import { streamObject } from "ai";
import { productionEnvGuard } from "@/lib/env";
import { getProviderConfig } from "@/lib/llm";
import { generateMockDocs } from "@/lib/mock";
import { SYSTEM_PROMPT, buildFewShotSystemPrompt, buildUserPrompt, classifyProjectType } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/ratelimit";
import { docsSchema, generateInputSchema } from "@/lib/schema";
import { createServiceClient, getSessionUser, isAuthConfigured } from "@/lib/supabase/server";
import { getProfile, hasFreeQuota, recordGeneration } from "@/lib/usage";

export const maxDuration = 120;

/**
 * 생성 1회 차감 — 스트림 정상 완료 + 스키마 검증 통과 시에만 호출된다.
 * 기록 실패가 스트림 응답을 깨뜨리지 않도록 예외는 로그로만 남긴다.
 */
async function recordUsageSafely(userId: string | null) {
  if (!userId) return;
  try {
    await recordGeneration(createServiceClient(), userId);
    console.log(`[generate] 무료 횟수 차감 완료 (user=${userId.slice(0, 8)}...)`);
  } catch (e) {
    console.error(`[generate] 횟수 기록 실패: ${e instanceof Error ? e.message : e}`);
  }
}

/**
 * MOCK_MODE=true: API 키 없이 mock 문서를 useObject가 파싱 가능한
 * partial-JSON 텍스트 스트림 형태로 청크 전송 (전체 플로우 테스트용)
 */
function mockStreamResponse(json: string, userId: string | null): Response {
  const encoder = new TextEncoder();
  const CHUNK_SIZE = 80;
  const CHUNK_DELAY_MS = 12;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (let i = 0; i < json.length; i += CHUNK_SIZE) {
        controller.enqueue(encoder.encode(json.slice(i, i + CHUNK_SIZE)));
        await new Promise((r) => setTimeout(r, CHUNK_DELAY_MS));
      }
      controller.close();
      // mock은 스트림 완료 = 정상 생성 (스키마 통과 보장됨)
      await recordUsageSafely(userId);
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  /* ── ⓪ 프로덕션 필수 env 검사 (누락 시 조용한 폴백 대신 명확한 500) ── */
  const envError = productionEnvGuard();
  if (envError) return envError;

  /* ── ① Rate limit: IP당 분당 5회 (로그인 여부 무관) ── */
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const rl = await checkRateLimit(ip);
  if (!rl.ok) {
    return Response.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  /* ── 입력 검증 ── */
  const parsed = generateInputSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: "잘못된 입력입니다.", issues: parsed.error.issues }, { status: 400 });
  }
  const input = parsed.data;

  /* ── ② 인증 + ③ 무료 횟수 검증 (Supabase 미설정 시 개발 모드로 건너뜀) ── */
  let userId: string | null = null;
  if (isAuthConfigured()) {
    const user = await getSessionUser();
    if (!user) {
      return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    userId = user.id;

    try {
      const row = await getProfile(createServiceClient(), userId);
      if (!hasFreeQuota(row)) {
        return Response.json(
          { error: "무료 생성 1회를 모두 사용했습니다.", paywall: true },
          { status: 402 }
        );
      }
    } catch (e) {
      console.error(`[generate] 횟수 조회 실패: ${e instanceof Error ? e.message : e}`);
      return Response.json({ error: "사용량 확인에 실패했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
    }
  } else {
    console.warn("[generate] Supabase 미설정 — 인증/횟수 제한 건너뜀 (개발 모드)");
  }

  // 스택 기반 프로젝트 유형 판별 → 해당 유형의 few-shot 예시 선택
  const projectType = classifyProjectType(input.stacks);

  if (process.env.MOCK_MODE === "true") {
    console.log(
      `[generate] MOCK_MODE=true · 유형=${projectType} · 프롬프트 캐싱은 실제 API 호출에서만 적용됩니다`
    );
    return mockStreamResponse(JSON.stringify(generateMockDocs(input)), userId);
  }

  // LLM_PROVIDER(anthropic|openai)에 따라 모델 결정 — 프롬프트/few-shot/스키마는 공유
  const llm = getProviderConfig();
  if (!llm.ok) {
    return Response.json({ error: llm.error }, { status: 500 });
  }

  const result = streamObject({
    model: llm.model,
    schema: docsSchema,
    messages: [
      // 1. 기본 시스템 프롬프트 (고정)
      { role: "system", content: SYSTEM_PROMPT },
      // 2. 유형별 few-shot 예시 — 캐시 브레이크포인트.
      //    같은 유형의 요청이면 1+2 전체 프리픽스가 캐시에서 읽힌다.
      //    (anthropic 전용 옵션 — openai 프로바이더에서는 무시되고 자동 캐싱에 의존)
      {
        role: "system",
        content: buildFewShotSystemPrompt(projectType),
        providerOptions: {
          anthropic: { cacheControl: { type: "ephemeral" } },
        },
      },
      // 3. 사용자 입력 (매 요청 변동 — 캐시 브레이크포인트 뒤에 위치)
      { role: "user", content: buildUserPrompt(input) },
    ],
    // 낮춰서 저품질(잘림) 재현 테스트 가능: MAX_OUTPUT_TOKENS=1000
    maxOutputTokens: Number(process.env.MAX_OUTPUT_TOKENS ?? 16000),
    onFinish: async ({ object, error, usage, providerMetadata }) => {
      // 문서 길이 로그 + 저품질(스키마 검증 실패) 감지.
      // 스트림은 이미 클라이언트로 전송된 뒤라, 품질 미달 에러 표시는
      // 같은 스키마(min 800)를 공유하는 클라이언트 useObject 검증이 담당한다.
      if (object) {
        console.log(
          `[generate] 문서 길이 readme=${object.readme.length}자 / blog=${object.blog.length}자 / qa=${object.qa.length}자`
        );
        // ③ 차감은 정상 완료 + 스키마 통과 시에만 — 저품질/중단/에러는 차감 없음
        await recordUsageSafely(userId);
      } else {
        console.warn(
          `[generate] ⚠️ 저품질 생성 감지 — 스키마 검증 실패 (placeholder/생략 의심), 횟수 차감 없음: ${error instanceof Error ? error.message.slice(0, 200) : String(error).slice(0, 200)}`
        );
      }
      const meta = providerMetadata?.anthropic as
        | { cacheCreationInputTokens?: number; cacheReadInputTokens?: number }
        | undefined;
      const created = meta?.cacheCreationInputTokens ?? 0;
      // AI SDK 5는 캐시 읽기를 표준 usage.cachedInputTokens로 보고한다
      const read = usage.cachedInputTokens ?? meta?.cacheReadInputTokens ?? 0;
      console.log(
        `[generate] ${llm.provider}/${llm.modelId} · 유형=${projectType} · 입력 ${usage.inputTokens}tok / 출력 ${usage.outputTokens}tok · ` +
          `캐시 생성=${created}tok, 캐시 적중=${read}tok ` +
          (read > 0 ? "✅ 캐시 적중" : created > 0 ? "🆕 캐시 신규 생성 (다음 요청부터 적중)" : "⚠️ 캐싱 미적용")
      );
    },
  });

  return result.toTextStreamResponse();
}

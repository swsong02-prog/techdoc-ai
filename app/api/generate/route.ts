import { streamObject } from "ai";
import { getProviderConfig } from "@/lib/llm";
import { generateMockDocs } from "@/lib/mock";
import { SYSTEM_PROMPT, buildFewShotSystemPrompt, buildUserPrompt, classifyProjectType } from "@/lib/prompts";
import { docsSchema, generateInputSchema } from "@/lib/schema";

export const maxDuration = 120;

/**
 * MOCK_MODE=true: API 키 없이 mock 문서를 useObject가 파싱 가능한
 * partial-JSON 텍스트 스트림 형태로 청크 전송 (전체 플로우 테스트용)
 */
function mockStreamResponse(json: string): Response {
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
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  const parsed = generateInputSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: "잘못된 입력입니다.", issues: parsed.error.issues }, { status: 400 });
  }
  const input = parsed.data;

  // 스택 기반 프로젝트 유형 판별 → 해당 유형의 few-shot 예시 선택
  const projectType = classifyProjectType(input.stacks);

  if (process.env.MOCK_MODE === "true") {
    console.log(
      `[generate] MOCK_MODE=true · 유형=${projectType} · 프롬프트 캐싱은 실제 API 호출에서만 적용됩니다`
    );
    return mockStreamResponse(JSON.stringify(generateMockDocs(input)));
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
    maxOutputTokens: 16000,
    onFinish: ({ usage, providerMetadata }) => {
      const meta = providerMetadata?.anthropic as
        | { cacheCreationInputTokens?: number; cacheReadInputTokens?: number }
        | undefined;
      const created = meta?.cacheCreationInputTokens ?? 0;
      const read = meta?.cacheReadInputTokens ?? 0;
      console.log(
        `[generate] ${llm.provider}/${llm.modelId} · 유형=${projectType} · 입력 ${usage.inputTokens}tok / 출력 ${usage.outputTokens}tok · ` +
          `캐시 생성=${created}tok, 캐시 적중=${read}tok ` +
          (read > 0 ? "✅ 캐시 적중" : created > 0 ? "🆕 캐시 신규 생성 (다음 요청부터 적중)" : "⚠️ 캐싱 미적용")
      );
    },
  });

  return result.toTextStreamResponse();
}

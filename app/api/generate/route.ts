import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { generateMockDocs } from "@/lib/mock";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
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

  if (process.env.MOCK_MODE === "true") {
    return mockStreamResponse(JSON.stringify(generateMockDocs(input)));
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY가 설정되지 않았습니다. MOCK_MODE=true로 테스트하세요." },
      { status: 500 }
    );
  }

  const result = streamObject({
    model: anthropic("claude-opus-5"),
    schema: docsSchema,
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(input),
    maxOutputTokens: 16000,
  });

  return result.toTextStreamResponse();
}

import { z } from "zod";

/** LLM이 생성하는 문서 3종 스키마 — streamObject / useObject 공용 */
export const docsSchema = z.object({
  readme: z
    .string()
    .describe(
      "GitHub README.md 마크다운 전문. 뱃지, 기술 스택 테이블, 아키텍처 다이어그램 코드블록 포함"
    ),
  blog: z
    .string()
    .describe("벨로그 스타일 구어체 개발 후기 블로그 포스팅 마크다운 전문"),
  qa: z
    .string()
    .describe("STAR 기법 기반 면접 예상 질문 5개와 모범 답안 마크다운 전문"),
});

export type Docs = z.infer<typeof docsSchema>;

/** /api/generate 요청 바디 스키마 */
export const generateInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  stacks: z.array(z.string().trim().min(1).max(50)).min(1).max(30),
  features: z.string().trim().min(1).max(2000),
  trouble: z.string().trim().max(2000).default(""),
});

export type GenerateInput = z.infer<typeof generateInputSchema>;

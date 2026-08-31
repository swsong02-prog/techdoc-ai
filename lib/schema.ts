import { z } from "zod";

/**
 * LLM이 생성하는 진단 + 문서 3종 스키마 — streamObject / useObject 공용.
 * analysis를 첫 필드로 두어 스트리밍 시 진단이 가장 먼저 도착한다.
 */
export const docsSchema = z.object({
  analysis: z
    .object({
      strengths: z
        .array(z.string())
        .describe("이 프로젝트의 어필 포인트 2~3개"),
      gaps: z
        .array(z.string())
        .describe(
          "부족한 부분 최대 3개. 각 항목은 '무엇이 부족한지 + 면접에서 어떤 리스크인지 + 어떻게 보완할지' 형태. 해당사항 없으면 빈 배열"
        ),
    })
    .describe("문서 작성 전 프로젝트 강점/보완점 진단"),
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

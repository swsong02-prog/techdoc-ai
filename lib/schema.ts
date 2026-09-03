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
  // .min(800): placeholder/요약으로 때운 저품질 생성을 검증 단계에서 걸러낸다
  readme: z
    .string()
    .min(800)
    .describe(
      "GitHub README.md 마크다운 전문. 뱃지, 기술 스택 테이블, 아키텍처 다이어그램 코드블록 포함"
    ),
  blog: z
    .string()
    .min(800)
    .describe("벨로그 스타일 구어체 개발 후기 블로그 포스팅 마크다운 전문"),
  qa: z
    .string()
    .min(800)
    .describe("STAR 기법 기반 면접 예상 질문 5개와 모범 답안 마크다운 전문"),
});

export type Docs = z.infer<typeof docsSchema>;

/* ─────────────────────────────────────────────
   입력 검증 — 의미 없는 입력이 무료 횟수·API 비용을 태우지 않게 차단.
   클라이언트(폼 사전 검증)와 서버(400 응답)가 같은 규칙을 공유한다.
───────────────────────────────────────────── */

/** 키보드 나열(asd, qwer, 1234, ㅁㄴㅇㄹ 등)·단일 문자 반복 감지 — 진짜 쓰레기만 거른다 */
const KEYBOARD_ROWS = [
  "qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890", "0987654321",
  "ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ", "ㅁㄴㅇㄹㅎㅗㅓㅏㅣ", "ㅋㅌㅊㅍㅠㅜㅡ",
];

export function isGibberish(text: string): boolean {
  const s = text.toLowerCase().replace(/\s+/g, "");
  if (s.length < 2) return false; // 길이는 별도 규칙에서 처리
  if (/^(.)\1+$/.test(s)) return true; // aaa, 1111
  // 전체가 키보드 한 줄의 연속 나열일 때만 (혼합 입력은 통과)
  return KEYBOARD_ROWS.some((row) => row.includes(s));
}

export interface InputFieldErrors {
  name?: string;
  stacks?: string;
  features?: string;
}

/** 필드별 검증 — 에러 없으면 빈 객체. 폼과 서버 스키마가 공용으로 사용 */
export function getInputErrors(input: {
  name: string;
  stacks: string[];
  features: string;
}): InputFieldErrors {
  const errors: InputFieldErrors = {};

  const name = input.name.trim();
  if (name.length < 2) {
    errors.name = "프로젝트 이름을 2자 이상 입력해주세요.";
  } else if (isGibberish(name)) {
    errors.name = "의미 있는 프로젝트 이름을 입력해주세요. (예: 클라우드 비용 대시보드)";
  }

  if (input.stacks.length < 1) {
    errors.stacks = "기술 스택을 1개 이상 선택해주세요.";
  }

  const lines = input.features
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 1) {
    errors.features = "핵심 기능을 1줄 이상 입력해주세요.";
  } else if (lines.some((l) => l.length < 10)) {
    errors.features = "핵심 기능은 한 줄에 10자 이상으로 구체적으로 적어주세요.";
  } else if (lines.some((l) => isGibberish(l))) {
    errors.features = "핵심 기능에 의미 있는 설명을 입력해주세요.";
  }

  return errors;
}

/** /api/generate 요청 바디 스키마 — getInputErrors와 동일 규칙로 이중 방어 */
export const generateInputSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    stacks: z.array(z.string().trim().min(1).max(50)).min(1).max(30),
    features: z.string().trim().min(1).max(2000),
    trouble: z.string().trim().max(2000).default(""),
  })
  .superRefine((val, ctx) => {
    const errors = getInputErrors(val);
    for (const [field, message] of Object.entries(errors)) {
      ctx.addIssue({ code: "custom", path: [field], message });
    }
  });

export type GenerateInput = z.infer<typeof generateInputSchema>;

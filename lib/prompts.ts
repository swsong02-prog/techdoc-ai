import { EXAMPLES, type ProjectType } from "./examples";
import type { GenerateInput } from "./schema";

/**
 * 문서 3종 생성 시스템 프롬프트.
 * readme / blog / qa 각각의 품질 기준을 명시하고,
 * 출력은 docsSchema(zod)가 강제하므로 구조 지시는 내용 품질에 집중한다.
 */
export const SYSTEM_PROMPT = `당신은 개발자 취업 준비생의 사이드 프로젝트를 "채용 담당자와 면접관에게 통하는 문서"로 바꿔주는 시니어 테크니컬 라이터입니다.

사용자가 제공한 프로젝트 정보(이름, 기술 스택, 핵심 기능, 트러블슈팅 경험)만을 근거로 진단(analysis)과 마크다운 문서 3종을 한국어로 작성합니다. 제공되지 않은 사실(성능 수치, 사용자 수, 구체적 코드)은 지어내지 말고, 필요하면 "예: ..." 형태의 제안으로 표시하세요.

## 0. analysis — 포트폴리오 진단 (문서 작성 전 수행)
문서를 쓰기 전에 이 프로젝트를 채용 담당자의 눈으로 진단합니다:
- strengths: 이 프로젝트의 어필 포인트 2~3개. 입력 정보에 실제로 존재하는 강점만 (기술 조합의 시의성, 트러블슈팅의 깊이, 문제 정의의 명확성 등)
- gaps: 부족한 부분 최대 3개. 각 항목은 반드시 "무엇이 부족한지 + 면접에서 어떤 리스크가 되는지 + 어떻게 보완할지"를 한 문단으로 담을 것
- gaps 점검 관점: ① 정량 성과 부재 ② 기술 선택 근거 부재 ③ 아키텍처 설명 부족 ④ 본인 역할 불명확(팀 프로젝트인 경우) ⑤ 트러블슈팅 깊이 부족
- 이 관점으로 점검하되 해당사항 없는 항목은 억지로 만들지 말 것. 모든 관점이 충족되면 gaps는 빈 배열도 허용됩니다

## 1. readme — GitHub README.md
GitHub 관례를 따르는 완성형 README:
- 최상단: 프로젝트 이름 H1 + 한 줄 소개 blockquote + shields.io 뱃지 (예: \`![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)\` — 입력된 기술 스택에 맞게)
- "📌 프로젝트 개요", "🛠 기술 스택"(반드시 마크다운 테이블: 분류/기술/선정 이유 3열), "🏗 아키텍처", "✨ 주요 기능", "🚀 실행 방법" 섹션
- 아키텍처는 코드블록으로 표현: 컴포넌트 간 데이터 흐름을 보여주는 ASCII 다이어그램 (\`\`\` 펜스 안에 화살표로 흐름 표기, 입력된 스택의 실제 역할이 드러나게)
- 실행 방법은 실제로 복붙 가능한 bash 코드블록
- 트러블슈팅 경험이 제공되면 "🔧 트러블슈팅" 섹션 추가: 문제 → 원인 분석 → 해결 → 배운 점 구조

## 2. blog — 기술 블로그 포스팅 (벨로그 스타일)
벨로그(velog)에서 흔히 보는 구어체 개발 후기:
- "~했어요", "~하더라고요" 체의 친근한 구어체. 격식체(~습니다)로 통일하지 말 것
- 흐름: 왜 시작했는지(개인적 동기) → 기술 선택 고민(대안과 비교한 이유) → 구현 중 삽질과 해결 과정 → 배운 점과 다음 계획
- 트러블슈팅 경험이 제공되면 삽질 파트의 중심 소재로 사용하고, 감정(막막함 → 실마리 → 해결의 쾌감)이 드러나게
- 중간중간 소제목(H2)과 볼드로 읽기 리듬을 만들 것. 이모지는 절제해서 사용
- 마지막은 독자에게 말 거는 마무리 인사

## 3. qa — 면접 예상 질문 & 모범 답안 5개
이 프로젝트로 실제 면접에서 나올 법한 질문 5개와 STAR 기법 기반 모범 답안:
- 형식: "## Q1. 질문" + "**모범 답안**: ..." 반복, 정확히 5개
- 각 답안은 STAR 구조(Situation 상황 → Task 과제 → Action 행동 → Result 결과)가 자연스러운 문장 속에 녹아들게 작성. "S:", "T:" 라벨은 붙이지 말 것
- 질문 구성: ① 기술 선택 이유(대안 대비 트레이드오프), ② 가장 어려웠던 기술적 문제, ③ 확장성/성능 개선(트래픽 10배 등), ④ 스택 중 하나의 실사용 장단점, ⑤ 다시 만든다면 개선할 점
- 트러블슈팅 경험이 제공되면 ②번 답안은 그 경험을 STAR로 재구성한 맞춤 답안으로 작성
- 트러블슈팅 경험이 없으면 ②번은 특정 경험을 지어내지 말고, 이 스택 조합에서 전형적으로 겪는 문제 유형을 예시로 들며 "STAR 구조로 본인 경험을 정리하는 방법"을 안내하는 일반화된 답안으로 작성

공통 규칙:
- 세 문서 모두 유효한 마크다운 전문(제목 H1부터 시작)이어야 하며, 서로 독립적으로 읽혀야 합니다
- 입력된 기술 스택 이름을 정확히 사용하고, 첫 번째 스택을 프로젝트의 중심 기술로 간주합니다
- 과장·허위("수백만 사용자") 금지. 취준생 포트폴리오라는 맥락에 맞는 현실적인 톤 유지`;

/* ─────────────────────────────────────────────
   프로젝트 유형 판별 + few-shot 프롬프트 조립
   (예시 "내용"은 lib/examples.ts에만 존재 — 여기는 로직만)
───────────────────────────────────────────── */

/** 유형 판별용 키워드 (소문자 부분일치). 스택당 1점, 최고점 유형 선택 */
const TYPE_KEYWORDS: Record<ProjectType, string[]> = {
  "ai-data": [
    "python", "pytorch", "tensorflow", "pandas", "numpy", "scikit",
    "langchain", "openai", "anthropic", "claude", "llm", "huggingface",
    "airflow", "spark", "kafka", "lightgbm", "jupyter", "ml",
  ],
  "backend-infra": [
    "aws", "gcp", "azure", "docker", "kubernetes", "terraform", "lambda",
    "nginx", "redis", "mysql", "postgres", "mongodb", "spring", "node.js",
    "express", "nestjs", "fastapi", "django", "go", "java", "grafana",
    "github actions", "jenkins", "rabbitmq",
  ],
  web: [
    "next.js", "react", "vue", "svelte", "typescript", "javascript",
    "tailwind", "html", "css", "flutter", "react native", "zustand", "redux",
  ],
};

/** 동점일 때 우선순위: 특수한 유형이 일반 유형을 이긴다 */
const TYPE_PRIORITY: ProjectType[] = ["ai-data", "backend-infra", "web"];

export function classifyProjectType(stacks: string[]): ProjectType {
  const scores: Record<ProjectType, number> = { web: 0, "backend-infra": 0, "ai-data": 0 };

  for (const stack of stacks) {
    const s = stack.toLowerCase();
    for (const type of TYPE_PRIORITY) {
      if (TYPE_KEYWORDS[type].some((kw) => s.includes(kw))) {
        scores[type] += 1;
        break; // 스택 하나는 한 유형에만 기여
      }
    }
  }

  let best: ProjectType = "web"; // 매칭 없으면 기본값
  let bestScore = 0;
  for (const type of TYPE_PRIORITY) {
    if (scores[type] > bestScore) {
      best = type;
      bestScore = scores[type];
    }
  }
  return best;
}

/**
 * 판별된 유형의 예시 2세트를 few-shot 블록으로 조립.
 * 이 블록은 route에서 cacheControl(프롬프트 캐싱) 브레이크포인트로 사용된다 —
 * 유형이 같으면 바이트 단위로 동일한 문자열이 나와 캐시가 적중한다.
 */
export function buildFewShotSystemPrompt(type: ProjectType): string {
  const { label, sets } = EXAMPLES[type];

  const rendered = sets
    .map(
      (set, i) => `<example index="${i + 1}">
<readme>
${set.readme.trim()}
</readme>
<blog>
${set.blog.trim()}
</blog>
<qa>
${set.qa.trim()}
</qa>
</example>`
    )
    .join("\n\n");

  return `다음은 이번 프로젝트와 같은 "${label}" 유형의 모범 문서 예시 2세트입니다.
구조·톤·품질 수준(STAR 답안, 수치 중심 서술, 테이블/다이어그램 활용)을 참고하되, 예시의 소재나 문장을 그대로 복사하지 마세요. 사용자가 입력한 프로젝트 정보만이 사실의 근거입니다.

${rendered}`;
}

/** 사용자 입력을 프롬프트로 변환. 트러블슈팅 유무에 따라 Q&A 분기 지시를 명시한다. */
export function buildUserPrompt({ name, stacks, features, trouble }: GenerateInput): string {
  const hasTrouble = trouble.trim().length > 0;

  return [
    `## 프로젝트 정보`,
    `- 프로젝트 이름: ${name}`,
    `- 기술 스택 (첫 번째가 중심 기술): ${stacks.join(", ")}`,
    ``,
    `## 핵심 기능`,
    features.trim(),
    ``,
    `## 트러블슈팅 경험`,
    hasTrouble
      ? trouble.trim()
      : `(입력 없음 — README에서 트러블슈팅 섹션은 생략하고, 면접 Q&A의 "가장 어려웠던 문제" 답안은 일반화된 안내 답안으로 작성할 것)`,
    ``,
    `위 정보로 readme, blog, qa 세 문서를 작성해주세요.`,
  ].join("\n");
}

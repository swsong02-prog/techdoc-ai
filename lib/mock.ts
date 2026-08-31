import type { Docs, GenerateInput } from "./schema";

/* ── Mock 문서 생성기 (MOCK_MODE=true 전용, 프로토타입 로직 포트) ── */
export function generateMockDocs({ name, stacks, features, trouble }: GenerateInput): Docs {
  const stackList = stacks.length ? stacks : ["미입력 스택"];
  const mainStack = stackList[0];
  const featureText = features.trim() || "핵심 기능 요약이 입력되지 않았습니다.";
  const hasTrouble = trouble.trim().length > 0;

  const readme = `# ${name}

> ${featureText.split("\n")[0].slice(0, 80)}

## 📌 프로젝트 개요

**${name}** 프로젝트는 ${stackList.slice(0, 3).join(", ")} 기반으로 구축된 서비스입니다.

${featureText}

## 🛠 기술 스택

| 분류 | 기술 |
| --- | --- |
| Core | ${stackList.slice(0, 3).join(", ")} |
| Infra / Etc | ${stackList.slice(3).join(", ") || "—"} |

## 🏗 아키텍처

\`\`\`
[Client] → [${stackList.includes("Nginx") ? "Nginx" : "Load Balancer"}] → [${mainStack} App] → [DB / Cache]
\`\`\`

## ✨ 주요 기능

${featureText
  .split("\n")
  .filter(Boolean)
  .map((f) => `- ${f.replace(/^[-*]\s*/, "")}`)
  .join("\n")}

${
  hasTrouble
    ? `## 🔧 트러블슈팅

${trouble}

**해결 과정에서 배운 점**: 문제를 단순히 해결하는 데 그치지 않고, 재발 방지를 위한 모니터링 체계까지 함께 고민했습니다.
`
    : ""
}
## 🚀 실행 방법

\`\`\`bash
git clone https://github.com/username/${name.toLowerCase().replace(/\s+/g, "-")}
cd ${name.toLowerCase().replace(/\s+/g, "-")}
docker compose up -d
\`\`\`
`;

  const blog = `# [개발 후기] ${name}을(를) 만들며 배운 것들

안녕하세요! 오늘은 최근에 진행한 **${name}** 프로젝트 개발 경험을 공유하려고 합니다.

## 왜 이 프로젝트를 시작했나

${featureText.split("\n")[0]}

이 문제를 직접 해결해보고 싶어서 ${mainStack}을(를) 중심으로 프로젝트를 시작하게 되었습니다.

## 기술 선택의 이유

이번 프로젝트에서는 **${stackList.join(", ")}** 을(를) 사용했습니다.

특히 **${mainStack}** 을(를) 선택한 이유는 다음과 같습니다:

- 러닝커브 대비 생산성이 높고, 커뮤니티 자료가 풍부함
- 실무에서 가장 많이 쓰이는 스택이라 취업 준비와 직결됨
- ${stackList.length > 1 ? `${stackList[1]}와(과)의 궁합이 검증되어 있음` : "확장성이 검증되어 있음"}

## 구현하면서 겪은 시행착오

${
  hasTrouble
    ? trouble
    : `처음에는 모든 게 순조로울 줄 알았지만, 실제로 구현을 시작하니 예상치 못한 문제들이 나타났습니다. 특히 ${mainStack} 환경 설정 과정에서 공식 문서만으로는 해결되지 않는 부분이 있어 여러 이슈 트래커를 뒤져가며 해결했습니다.`
}

## 마치며

이번 프로젝트를 통해 단순히 "돌아가는 코드"가 아니라 **"운영 가능한 시스템"** 을 만드는 것의 차이를 배웠습니다. 다음 글에서는 배포 자동화 과정을 더 자세히 다뤄보겠습니다.

읽어주셔서 감사합니다! 🙌
`;

  const qa = `# ${name} — 면접 예상 질문 & 모범 답안

## Q1. ${mainStack}을(를) 선택한 이유는 무엇인가요?

**모범 답안**: 단순히 유행이라서가 아니라, 프로젝트 요구사항(${featureText.split("\n")[0].slice(0, 40)}...)을 분석했을 때 ${mainStack}이(가) 제공하는 생태계와 안정성이 가장 적합하다고 판단했습니다. 대안으로 검토했던 기술과의 트레이드오프도 함께 설명할 수 있습니다.

## Q2. 이 프로젝트에서 가장 어려웠던 기술적 문제는 무엇이었나요?

**모범 답안**: ${
    hasTrouble
      ? `${trouble.split("\n")[0].slice(0, 100)} — 이 문제를 해결하며 원인 분석 → 가설 수립 → 검증의 순서로 접근하는 디버깅 프로세스를 체득했습니다.`
      : "문제 상황을 STAR 기법(상황-과제-행동-결과)으로 구조화해서 답변하세요. 트러블슈팅 입력란을 채우면 맞춤 답안이 생성됩니다."
  }

## Q3. 트래픽이 10배 증가한다면 어떤 부분을 개선하시겠습니까?

**모범 답안**: 현재 구조에서 병목이 될 지점을 먼저 짚고(예: DB 커넥션, 단일 인스턴스), ${
    stackList.includes("Redis") ? "이미 도입한 Redis 캐시 레이어를 확장하고" : "캐시 레이어 도입과"
  } 수평 확장이 가능하도록 무상태(stateless) 설계로 개선하겠다고 답변합니다.

## Q4. ${stackList.length > 1 ? `${stackList[1]}` : "협업 도구"}를 사용하며 느낀 장단점은?

**모범 답안**: 장점만 나열하지 말고, 실제로 겪은 한계와 그것을 어떻게 보완했는지 언급하면 실무 경험처럼 보입니다.

## Q5. 이 프로젝트를 다시 만든다면 무엇을 바꾸시겠습니까?

**모범 답안**: "완벽했다"는 답변은 감점 요인입니다. 테스트 코드 커버리지, 초기 설계 단계에서의 문서화 등 구체적인 개선점 1-2가지와 그 이유를 준비하세요.
`;

  /* ── 스키마 min(800) 충족을 위한 고정 보강 섹션 (mock 전용) ── */
  const readmePadded =
    readme +
    `
## 📈 향후 계획

- 사용자 피드백 기반으로 문서 템플릿 다양화
- 배포 자동화 파이프라인(CI/CD) 구축으로 릴리스 주기 단축
- 핵심 지표(응답 시간, 에러율) 모니터링 대시보드 도입

## 🗂 프로젝트 구조

\`\`\`
src/
├── components/   # UI 컴포넌트
├── lib/          # 비즈니스 로직·유틸
└── pages(app)/   # 라우팅
\`\`\`

## 📄 라이선스

MIT License — 자유롭게 참고하되, 별표(⭐) 하나는 큰 힘이 됩니다.
`;

  const blogPadded =
    blog +
    `
---

**P.S.** 이 글이 도움이 됐다면 댓글로 여러분의 프로젝트 이야기도 들려주세요. 같은 고민을 하는 사람이 많을수록 좋은 해결책이 더 빨리 나오더라고요. 다음 글에서는 이번 프로젝트의 배포 과정과 운영하면서 만난 예상 밖의 이슈들을 다뤄볼 예정입니다. 궁금한 점은 언제든 댓글로 남겨주세요!
`;

  const qaPadded =
    qa +
    `
---

## 💡 면접 답변 공통 팁

- 모든 답변은 STAR(상황-과제-행동-결과) 구조를 기본으로 하되, 라벨을 붙이지 말고 자연스러운 문장으로 녹여내세요.
- 수치를 말할 수 있는 부분은 반드시 수치로 말하세요. "많이 빨라졌다"보다 "3초에서 0.9초로 줄었다"가 기억에 남습니다.
- 모르는 질문에는 아는 범위를 명확히 하고 학습 계획으로 마무리하는 것이 어설픈 추측보다 좋은 인상을 줍니다.
`;

  /* ── 진단 (입력값 반영 mock) ── */
  const hasNumbers = /\d/.test(features);
  const featureLines = featureText.split("\n").filter(Boolean).length;

  const strengths: string[] = [
    `${stackList.slice(0, 3).join(", ")} 조합은 실무 채용 공고와 접점이 많은 스택 구성입니다`,
    `"${featureText.split("\n")[0].slice(0, 40)}"처럼 해결하려는 문제가 명확해 프로젝트 동기를 설명하기 좋습니다`,
  ];
  if (hasTrouble) {
    strengths.push("트러블슈팅 경험이 있어 문제 해결 과정을 STAR 구조로 풀어낼 수 있습니다");
  }

  const gaps: string[] = [];
  if (!hasTrouble) {
    gaps.push(
      "트러블슈팅 경험이 입력되지 않았습니다. 면접에서 '가장 어려웠던 문제' 질문에 구체적 답변이 어려워지는 리스크가 있으니, 개발 중 겪은 문제 하나를 원인 분석 → 해결 → 배운 점 구조로 정리해 보완하세요."
    );
  }
  if (!hasNumbers) {
    gaps.push(
      "정량 성과(응답 시간, 개선율 등 숫자)가 없습니다. 면접관에게 개선의 크기를 전달하기 어려운 리스크가 있으니, 개선 전후를 측정한 수치 한 개라도 만들어 문서에 반영하세요."
    );
  }
  if (featureLines < 2) {
    gaps.push(
      "핵심 기능이 한 줄뿐이라 프로젝트의 규모가 작아 보일 리스크가 있습니다. 기능을 2~3개로 쪼개 각각의 기술적 포인트를 드러내면 보완됩니다."
    );
  }

  // 입력이 극단적으로 짧아도 스키마 min(800)을 반드시 통과하도록 보장
  const ensureMinLen = (doc: string, min = 800): string => {
    let out = doc;
    while (out.length < min) {
      out += "\n> ℹ️ 이 문서는 MOCK_MODE 샘플입니다. 실제 생성에서는 입력 정보를 충분히 반영한 완성 문서가 제공됩니다.\n";
    }
    return out;
  };

  return {
    analysis: { strengths, gaps: gaps.slice(0, 3) },
    readme: ensureMinLen(readmePadded),
    blog: ensureMinLen(blogPadded),
    qa: ensureMinLen(qaPadded),
  };
}

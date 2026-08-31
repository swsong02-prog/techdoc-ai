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

  return { readme, blog, qa };
}

/**
 * 프로젝트 유형별 few-shot 모범 예시 — 순수 데이터 파일.
 *
 * ⚠️ 이 파일은 "데이터만" 담는다. 유형 판별/프롬프트 조립 로직은 lib/prompts.ts에 있음.
 * 예시 내용은 임시 초안이며, EXAMPLES 상수의 문자열만 통째로 교체하면 된다 (구조 유지).
 */

export type ProjectType = "web" | "backend-infra" | "ai-data";

/** 문서 3종이 한 세트 — 유형마다 2세트씩 */
export interface ExampleSet {
  readme: string;
  blog: string;
  qa: string;
}

export interface ProjectTypeExamples {
  /** 프롬프트에 표기되는 유형 이름 */
  label: string;
  /** README/블로그/Q&A 각 2개 = 세트 2개 */
  sets: [ExampleSet, ExampleSet];
}

/* ─────────────────────────────────────────────
   임시 초안 예시 (나중에 통째로 교체 예정)
───────────────────────────────────────────── */

const WEB_SET_1: ExampleSet = {
  readme: `# 모임 정산 서비스 N빵

> 모임 지출을 등록하면 인원별 정산 금액과 송금 링크를 자동 생성하는 웹 서비스

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

## 📌 프로젝트 개요
모임 후 정산 계산과 송금 요청을 반복하는 불편을 해결하기 위해 만든 서비스입니다.

## 🛠 기술 스택
| 분류 | 기술 | 선정 이유 |
| --- | --- | --- |
| Frontend | Next.js, TypeScript | SSR로 공유 링크 미리보기 지원, 타입 안정성 |
| 상태 관리 | Zustand | 정산 폼의 복잡한 상태를 가볍게 관리 |

## 🏗 아키텍처
\`\`\`
[Browser] → [Next.js (SSR/API Routes)] → [Supabase (DB/Auth)]
                     └→ [카카오페이 송금 링크 API]
\`\`\`

## ✨ 주요 기능
- 지출 항목별 참여자 지정 및 자동 분배 계산
- 정산 결과 공유 링크 생성 (로그인 불필요)

## 🚀 실행 방법
\`\`\`bash
git clone https://github.com/example/nbbang && cd nbbang
npm install && npm run dev
\`\`\`
`,
  blog: `# 정산 서비스를 만들며 SSR의 필요성을 처음 체감했어요

모임 총무를 세 번 연속으로 맡으면서 "이건 내가 만들고 만다"는 마음으로 시작한 프로젝트예요.

## 왜 Next.js였나

처음엔 React SPA로 시작했는데, 카카오톡에 공유 링크를 보내면 미리보기가 텅 비어서 나오더라고요. OG 태그가 서버에서 렌더링되어야 한다는 걸 그때 알았고, Next.js SSR로 갈아탔어요.

## 삽질 포인트

정산 금액에 소수점이 생기면 1원이 비는 문제가 있었어요. 결국 "나머지 1원은 총무가 부담" 규칙을 넣고 나서야 QA가 끝났습니다. 도메인 규칙은 코드보다 먼저 정해야 한다는 걸 배웠어요.

읽어주셔서 감사합니다. 여러분의 총무 생활에 평화가 있기를 🙏
`,
  qa: `# 면접 예상 질문 & 모범 답안

## Q1. CSR 대신 SSR을 선택한 이유는?
**모범 답안**: 초기엔 SPA였지만(상황) 공유 링크 미리보기가 요구사항이었고(과제), OG 태그 서버 렌더링을 위해 Next.js로 마이그레이션했으며(행동), 공유 유입이 전체 트래픽의 60%를 차지하게 되었습니다(결과).

## Q2. 가장 어려웠던 문제는?
**모범 답안**: 인원별 분배 시 원 단위 나머지 처리 문제였습니다. 부동소수점 오차의 원인을 분석하고 정수 연산 + 도메인 규칙(나머지 부담자 지정)으로 해결했습니다.
`,
};

const WEB_SET_2: ExampleSet = {
  readme: `# 독서 기록 서비스 책갈피

> 읽은 책의 문장을 수집하고 태그로 회고하는 개인 아카이브 웹앱

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)

## 📌 프로젝트 개요
메모 앱에 흩어진 독서 기록을 한곳에 모으기 위한 서비스입니다.

## 🛠 기술 스택
| 분류 | 기술 | 선정 이유 |
| --- | --- | --- |
| Frontend | React, TypeScript | 컴포넌트 재사용, 폼 타입 안정성 |
| 검색 | Fuse.js | 서버 없이 클라이언트 퍼지 검색 구현 |

## 🏗 아키텍처
\`\`\`
[Browser (React + IndexedDB)] → [도서 검색 Open API]
\`\`\`

## ✨ 주요 기능
- ISBN 검색으로 책 정보 자동 입력
- 문장 하이라이트 + 태그 기반 필터링

## 🚀 실행 방법
\`\`\`bash
npm install && npm run dev
\`\`\`
`,
  blog: `# 서버 없이 웹앱 만들기, 생각보다 할 만해요

개인 프로젝트에 매달 서버비를 쓰고 싶지 않아서, 이번엔 "서버 없이 어디까지 되나"를 실험해봤어요.

## IndexedDB라는 선택

localStorage는 5MB 제한이 있어서 책 표지 이미지까지 담기엔 부족하더라고요. IndexedDB로 옮기면서 비동기 API에 적응하느라 애먹었지만, 결과적으로 수천 개 기록도 문제없이 돌아가요.

## 배운 점

"서버가 필요한가?"를 먼저 묻는 습관이 생겼어요. 다음엔 동기화 기능을 붙이면서 진짜 서버가 필요한 순간을 경험해볼 계획입니다.
`,
  qa: `# 면접 예상 질문 & 모범 답안

## Q1. 백엔드 없이 구현한 이유와 한계는?
**모범 답안**: 단일 사용자 도구라는 요구사항 분석(상황) 하에 운영 비용 0원을 목표로(과제) IndexedDB 로컬 저장을 선택했고(행동), 기기 간 동기화가 안 되는 한계는 명확히 인지하고 있으며 확장 시나리오도 설계해두었습니다(결과).

## Q2. 클라이언트 검색 성능은 어떻게 확보했나?
**모범 답안**: Fuse.js 인덱스를 웹워커에서 빌드해 메인 스레드 블로킹을 제거했습니다.
`,
};

const BACKEND_SET_1: ExampleSet = {
  readme: `# 이미지 리사이징 파이프라인

> S3 업로드 이벤트 기반으로 다중 해상도 썸네일을 생성하는 서버리스 파이프라인

![AWS](https://img.shields.io/badge/AWS-232F3E?logo=amazonwebservices&logoColor=white) ![Lambda](https://img.shields.io/badge/Lambda-FF9900?logo=awslambda&logoColor=white)

## 📌 프로젝트 개요
원본 이미지 업로드 시 3종 해상도 썸네일을 자동 생성해 CDN으로 서빙합니다.

## 🛠 기술 스택
| 분류 | 기술 | 선정 이유 |
| --- | --- | --- |
| Compute | AWS Lambda | 업로드 이벤트 기반 간헐 트래픽에 비용 최적 |
| Storage/CDN | S3, CloudFront | 원본/파생본 분리 버킷 + 엣지 캐싱 |
| IaC | Terraform | 스테이징/프로덕션 환경 일관성 |

## 🏗 아키텍처
\`\`\`
[Client] → [S3 (원본)] ─이벤트─▶ [Lambda (sharp 리사이징)] → [S3 (파생본)] → [CloudFront]
\`\`\`

## ✨ 주요 기능
- 업로드 즉시 3종 해상도 자동 생성 (평균 1.2초)
- Terraform 모듈로 환경별 배포

## 🔧 트러블슈팅
Lambda 콜드스타트로 p99 지연이 4초를 넘는 문제 → sharp 레이어 최적화와 메모리 상향으로 1.5초까지 단축. 배운 점: 서버리스에서 번들 크기는 곧 지연시간이다.

## 🚀 실행 방법
\`\`\`bash
terraform init && terraform apply -var-file=prod.tfvars
\`\`\`
`,
  blog: `# 서버리스 이미지 파이프라인, 콜드스타트와 싸운 기록

인프라 공부를 하다가 "이벤트 기반 아키텍처를 직접 굴려봐야겠다" 싶어서 시작한 프로젝트예요.

## Lambda를 고른 이유

EC2 상시 운영은 이미지 업로드가 하루 몇십 건인 서비스엔 과했어요. 요청당 과금이라는 Lambda의 특성이 트래픽 패턴과 정확히 맞았습니다.

## 콜드스타트라는 벽

첫 요청이 4초씩 걸리더라고요. 번들에 들어간 sharp 바이너리가 원인이었고, 레이어 분리 + 메모리 상향으로 1.5초까지 줄였어요. CloudWatch로 p50/p99를 계속 보면서 튜닝하는 과정이 제일 재밌었습니다.

## 다음 계획

프로비저닝된 동시성으로 p99를 더 줄여볼 생각이에요. 인프라는 숫자로 말해야 한다는 걸 배웠습니다.
`,
  qa: `# 면접 예상 질문 & 모범 답안

## Q1. EC2가 아닌 Lambda를 선택한 근거는?
**모범 답안**: 트래픽이 간헐적이라는 분석(상황)에서 유휴 비용 제거가 과제였고(과제), 이벤트 기반 Lambda로 전환해(행동) 월 인프라 비용을 EC2 대비 90% 절감했습니다(결과). 상시 고트래픽이라면 반대로 EC2/ECS가 유리하다는 트레이드오프도 인지하고 있습니다.

## Q2. 콜드스타트 문제를 어떻게 해결했나?
**모범 답안**: p99 4초 관측(상황) → 번들 프로파일링으로 sharp 바이너리가 원인임을 특정(행동) → 레이어 분리와 메모리 상향으로 1.5초 달성(결과).
`,
};

const BACKEND_SET_2: ExampleSet = {
  readme: `# 실시간 순위 API 서버

> Redis Sorted Set 기반으로 게임 순위를 실시간 집계하는 백엔드 API

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?logo=springboot&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)

## 📌 프로젝트 개요
RDB 정렬 쿼리로는 감당되지 않는 실시간 순위 조회를 Redis로 해결한 API 서버입니다.

## 🛠 기술 스택
| 분류 | 기술 | 선정 이유 |
| --- | --- | --- |
| API | Spring Boot | 검증된 생태계, 팀 온보딩 용이 |
| 순위 저장소 | Redis (Sorted Set) | O(log N) 점수 갱신·범위 조회 |
| 영속화 | MySQL | 순위 이력의 원본 저장 |

## 🏗 아키텍처
\`\`\`
[Client] → [Spring Boot API] ─실시간 조회─▶ [Redis ZSET]
                  └─비동기 영속화─▶ [MySQL]
\`\`\`

## ✨ 주요 기능
- 상위 100위 조회 평균 3ms
- 점수 갱신과 이력 저장의 비동기 분리

## 🚀 실행 방법
\`\`\`bash
docker compose up -d && ./gradlew bootRun
\`\`\`
`,
  blog: `# 순위 조회 3초를 3ms로 만든 이야기

"ORDER BY score DESC LIMIT 100"이 왜 느려지는지 몸으로 배운 프로젝트였어요.

## RDB의 한계를 만나다

10만 행까지는 괜찮았는데, 점수 갱신이 몰리는 시간대엔 정렬 쿼리가 3초씩 걸리더라고요. 인덱스를 붙여도 갱신 부하와 조회 부하가 서로 발목을 잡았습니다.

## Redis Sorted Set이라는 정석

ZADD와 ZREVRANGE로 갱신과 조회 모두 밀리초 단위가 됐어요. 다만 Redis가 죽으면 순위가 날아가니까, MySQL에 이력을 비동기로 쌓고 재기동 시 복원하는 구조를 더했습니다.

정석이라 불리는 도구는 이유가 있더라고요. 다음엔 Redis Cluster 샤딩을 실험해볼 거예요.
`,
  qa: `# 면접 예상 질문 & 모범 답안

## Q1. Redis 도입을 결정한 과정은?
**모범 답안**: 피크 시간 정렬 쿼리 3초 관측(상황) → 실시간성 요구 충족이 과제(과제) → Sorted Set으로 순위 로직 이전(행동) → 조회 3ms, DB 부하 70% 감소(결과).

## Q2. Redis 장애 시 데이터 유실은 어떻게 대비했나?
**모범 답안**: Redis를 캐시가 아닌 파생 저장소로 정의하고, 원본은 MySQL에 비동기 영속화. 재기동 시 이력에서 ZSET을 재구성하는 복원 스크립트를 준비했습니다.
`,
};

const AI_SET_1: ExampleSet = {
  readme: `# 회의록 자동 요약 봇

> 녹취 텍스트를 업로드하면 결정사항·액션아이템을 구조화해주는 LLM 서비스

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)

## 📌 프로젝트 개요
긴 회의록에서 "누가 무엇을 언제까지"를 자동 추출하는 서비스입니다.

## 🛠 기술 스택
| 분류 | 기술 | 선정 이유 |
| --- | --- | --- |
| API | FastAPI | 비동기 스트리밍 응답 처리 |
| LLM | Claude API | 긴 컨텍스트 + 구조화 출력 |
| 평가 | pytest 기반 골든셋 | 프롬프트 회귀 방지 |

## 🏗 아키텍처
\`\`\`
[Client] → [FastAPI] → [Claude API (structured output)]
                └→ [골든셋 평가 파이프라인 (CI)]
\`\`\`

## ✨ 주요 기능
- 결정사항/액션아이템/담당자 JSON 구조화 추출
- 프롬프트 변경 시 골든셋 30건 자동 평가

## 🔧 트러블슈팅
장문 회의록에서 후반부 액션아이템 누락 → 청크 분할 + 병합 전략으로 재현율 0.6→0.9 개선. 배운 점: LLM 출력은 "느낌"이 아니라 평가셋 수치로 관리해야 한다.

## 🚀 실행 방법
\`\`\`bash
pip install -r requirements.txt && uvicorn app:app --reload
\`\`\`
`,
  blog: `# LLM 서비스는 프롬프트보다 평가가 어렵더라고요

회의록 요약 봇을 만들면서 "AI 기능은 만드는 것보다 검증이 본체"라는 걸 배웠어요.

## 잘 되는 줄 알았다

데모에선 완벽했는데, 실제 1시간짜리 회의록을 넣으니 후반부 액션아이템을 자꾸 빼먹더라고요. 문제는 제가 그걸 "느낌"으로만 판단하고 있었다는 거예요.

## 골든셋을 만들다

회의록 30건에 정답 라벨을 직접 달고, 프롬프트를 바꿀 때마다 재현율을 측정했어요. 청크 분할 전략을 도입한 게 0.6에서 0.9로 오르는 결정적 한 방이었습니다.

숫자가 있으니 개선이 게임처럼 재밌어지더라고요. LLM 다루는 분들, 평가셋부터 만드세요. 진심입니다.
`,
  qa: `# 면접 예상 질문 & 모범 답안

## Q1. LLM 출력 품질을 어떻게 보장했나?
**모범 답안**: 데모와 실사용 품질의 괴리 발견(상황) → 정량 평가 체계 구축이 과제(과제) → 골든셋 30건 + CI 자동 평가 파이프라인 구성(행동) → 재현율 0.9 달성 및 회귀 방지(결과).

## Q2. 환각(hallucination)은 어떻게 다뤘나?
**모범 답안**: 구조화 출력 스키마로 자유 서술을 제한하고, 원문에 없는 담당자 이름이 나오면 원문 대조로 필터링하는 후처리를 넣었습니다.
`,
};

const AI_SET_2: ExampleSet = {
  readme: `# 중고 시세 예측 대시보드

> 거래 데이터를 수집·학습해 중고 전자기기 적정 시세를 예측하는 데이터 서비스

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) ![pandas](https://img.shields.io/badge/pandas-150458?logo=pandas&logoColor=white)

## 📌 프로젝트 개요
흩어진 중고 거래가 데이터를 모아 모델 기반 적정가를 제시합니다.

## 🛠 기술 스택
| 분류 | 기술 | 선정 이유 |
| --- | --- | --- |
| 수집/전처리 | Python, pandas | 이상치 처리·피처 엔지니어링 |
| 모델 | LightGBM | 테이블 데이터에 강하고 학습 빠름 |
| 서빙 | Streamlit | 분석 결과의 빠른 시각화 |

## 🏗 아키텍처
\`\`\`
[크롤러 (일 1회)] → [전처리 파이프라인] → [LightGBM 학습] → [Streamlit 대시보드]
\`\`\`

## ✨ 주요 기능
- 모델명·상태·연식 입력 시 예측 시세와 신뢰 구간 표시
- 주간 재학습 파이프라인

## 🚀 실행 방법
\`\`\`bash
pip install -r requirements.txt && streamlit run app.py
\`\`\`
`,
  blog: `# 데이터 프로젝트의 8할은 전처리라는 말, 진짜였어요

모델링을 해보고 싶어서 시작했는데, 정작 3주 중 2주를 데이터 청소에 썼습니다.

## "아이폰 14 급처 5만원"의 함정

크롤링한 가격 데이터엔 낚시 글, 부품 판매, 오타가 뒤섞여 있었어요. 가격 분포의 IQR 기반 이상치 제거만으론 부족해서, 제목 키워드 규칙("부품", "급처", "교신")을 조합한 필터를 만들었습니다.

## 모델보다 피처

LightGBM 하이퍼파라미터 튜닝으로 오차가 3% 줄었는데, "출시 후 경과 개월" 피처 하나 추가로 11%가 줄더라고요. 도메인 이해가 모델 성능을 만든다는 걸 체감했습니다.

다음엔 이 파이프라인을 Airflow로 옮겨서 운영 자동화를 해볼 거예요.
`,
  qa: `# 면접 예상 질문 & 모범 답안

## Q1. 데이터 품질 문제를 어떻게 해결했나?
**모범 답안**: 수집 데이터의 30%가 노이즈(상황) → 신뢰 가능한 학습셋 구축이 과제(과제) → 통계 기반 이상치 제거 + 도메인 규칙 필터 결합(행동) → 검증셋 MAE 40% 개선(결과).

## Q2. 모델 성능 개선에서 가장 효과적이었던 것은?
**모범 답안**: 하이퍼파라미터 튜닝보다 도메인 피처("출시 후 경과 개월") 추가가 압도적이었습니다. 개선 폭을 수치로 비교해 우선순위를 정하는 습관을 얻었습니다.
`,
};

/* ─────────────────────────────────────────────
   유형별 예시 상수 — 이 객체만 교체하면 됨
───────────────────────────────────────────── */

export const EXAMPLES: Record<ProjectType, ProjectTypeExamples> = {
  web: {
    label: "웹서비스",
    sets: [WEB_SET_1, WEB_SET_2],
  },
  "backend-infra": {
    label: "백엔드·인프라",
    sets: [BACKEND_SET_1, BACKEND_SET_2],
  },
  "ai-data": {
    label: "AI·데이터",
    sets: [AI_SET_1, AI_SET_2],
  },
};

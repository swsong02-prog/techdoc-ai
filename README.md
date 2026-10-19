# TechDoc AI

사이드 프로젝트 정보(한 줄 소개, 기술 스택, 맡은 일, 트러블슈팅)를 넣으면 포트폴리오 문서 3종을 만들어 주는 웹 서비스입니다.

- 포트폴리오용 README
- 기술 블로그 글
- 면접 예상 질문과 답변

2026년 8월 30일부터 9월 3일까지 혼자 만든 개인 프로젝트이고, 아직 배포하지 않았습니다.

## 동작 방식

- Vercel AI SDK의 `streamObject`로 문서 3종을 한 번에 생성하고, 화면에는 탭마다 도착하는 대로 보여 줍니다.
- 입력과 응답 형식은 zod 스키마로 고정했습니다. 무료 횟수는 형식을 통과한 정상 응답일 때만 차감합니다.
- 입력한 기술 스택으로 프로젝트를 웹, 백엔드/인프라, AI/데이터 중 하나로 판별하고, 유형에 맞는 예시 문서를 프롬프트에 넣습니다.
- LLM은 환경변수로 Anthropic과 OpenAI 중에서 고를 수 있습니다. API 키는 서버에서만 씁니다.
- `MOCK_MODE=true`로 두면 API 키 없이 가짜 문서로 전체 흐름을 확인할 수 있습니다.
- Supabase 구글 로그인을 붙였고, 무료 생성은 계정당 1회로 제한했습니다. 요청 횟수 제한은 Upstash Redis를 쓰고, 설정이 없으면 메모리로 대신합니다.

## 기술 스택

| 분야 | 사용 기술 |
|---|---|
| 프론트엔드 | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| AI | Vercel AI SDK 5, Anthropic, OpenAI, zod |
| 인증과 제한 | Supabase Auth, Upstash Redis |

## 실행

```bash
npm install
cp .env.example .env.local   # MOCK_MODE=true면 키 없이 실행됩니다
npm run dev
```

## 파일

```
app/                 화면과 API 라우트 (api/generate, api/usage, auth/callback)
components/          입력 폼, 결과 뷰어, 로그인 모달
lib/                 프롬프트, 예시 문서, 스키마, LLM 선택, 사용량 제한
supabase/setup.sql   profiles 테이블과 RLS 정책
```

## 아직 못 한 것

- Vercel 배포
- 결제 (버튼 화면만 있습니다)
- 구글 로그인 동의 화면에 supabase.co 주소가 보이는 문제

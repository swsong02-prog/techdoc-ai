# TechDoc AI — 작업 로그

> 사이드 프로젝트를 포트폴리오 문서 3종(README·기술 블로그·면접 Q&A)으로 바꿔주는 AI 서비스
> 저장소: https://github.com/swsong02-prog/techdoc-ai

**기간**: 2026.08.30 ~ 2026.08.31

---

## 1. 프로토타입 (Vite + React)

- 완성된 UI 프로토타입(`TechDocAI.jsx`)을 `실험실/techdoc-ai`에 Vite + React 18 + Tailwind 4 프로젝트로 세팅
- Mock 데이터 기반으로 전체 플로우(입력 → 로딩 연출 → 문서 3종 생성 → 탭 전환 → 복사) 동작 확인
- 이 프로토타입은 참조용으로 남고, 실서비스는 아래 Next.js 프로젝트로 이관됨

## 2. Next.js 실서비스 이관 (`실험실/techdoc-ai-next`)

### Phase 1 — 프로젝트 셋업 + UI 이관
- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + lucide-react
- 프로토타입을 `app/page.tsx` + `components/` 7개로 분리 (TypeScript 변환)
- 내장 renderMarkdown 함수 → **react-markdown + remark-gfm + rehype-highlight** 조합으로 교체
- 스트리밍 중 미완성 마크다운 대비 **에러 바운더리** 적용 (다음 청크 도착 시 자동 복구)

### Phase 2 — API 라우트 + 스트리밍
- `app/api/generate/route.ts`: **Vercel AI SDK `streamObject`** + zod 스키마 `{ readme, blog, qa }`
- 클라이언트는 `experimental_useObject`로 부분 스트리밍 수신 → **탭별로 도착하는 대로 렌더링**
- **MOCK_MODE=true**: mock 문서를 동일한 partial-JSON 스트림 프로토콜로 청크 전송 → API 키 없이 전체 플로우(스트리밍 UX 포함) 테스트 가능
- `ANTHROPIC_API_KEY`는 서버 전용 (`NEXT_PUBLIC_` 미사용, `.env.local`은 gitignore)

### Phase 3 — 프롬프트 설계
- `lib/prompts.ts`에 시스템 프롬프트 분리
  - README: GitHub 관례 (shields.io 뱃지, 3열 기술 테이블, ASCII 아키텍처 다이어그램)
  - 블로그: 벨로그 스타일 구어체 후기 (감정 곡선 포함)
  - Q&A: STAR 기법 기반 모범 답안 5개
- 트러블슈팅 미입력 시 Q&A 해당 질문을 **일반화 답안으로 분기** 처리

### 검증
- `npm run build` 3단계 모두 통과
- MOCK_MODE 전체 플로우 + 모바일 375px 반응형(가로 오버플로 없음) 확인

## 3. GitHub 배포 & 노트북 이전

- 공개 저장소 생성: `swsong02-prog/techdoc-ai` (저장된 git 인증 사용)
- 노트북에서 clone → `npm install` → `.env.local` 생성 → 실행 확인 완료
- `.env.local`(API 키)은 커밋에서 제외 — 기기마다 별도 생성

## 4. Few-shot 예시 + 프롬프트 캐싱

- **`lib/examples.ts`** (순수 데이터): 프로젝트 유형별(웹서비스 / 백엔드·인프라 / AI·데이터) 모범 예시 2세트 × 문서 3종
- **`lib/prompts.ts`** (로직): `classifyProjectType()` — 스택 키워드 점수제 판별 (동점 시 ai-data > backend-infra > web), `buildFewShotSystemPrompt()` — 예시를 few-shot 블록으로 조립
- **프롬프트 캐싱**: few-shot 시스템 메시지에 `cacheControl: ephemeral` 적용
  - 메시지 구조: `[기본 프롬프트(고정)] → [few-shot 예시 ← 캐시 브레이크포인트] → [사용자 입력(변동)]`
  - 같은 유형 요청이면 캐시 적중 → 예시 부분 입력 비용 약 90% 절감
  - `onFinish`에서 캐시 생성/적중 토큰을 콘솔 로그로 출력
- **web 유형 예시 교체**: 임시 초안 → 정식 예시 "어디팔지"(중고 시세 비교), "런크루"(러닝 크루 매칭)로 교체. 데이터/로직 분리 구조 덕분에 문자열만 교체

## 5. LLM 프로바이더 스위치

- **`lib/llm.ts`**: `LLM_PROVIDER=anthropic|openai` env로 프로바이더 선택
- 프롬프트·few-shot·스키마·유형 판별은 프로바이더 무관 **공유** — streamObject의 model만 교체됨
- `@ai-sdk/openai@^2` 추가 (`ai@5` 호환 버전 — v4 설치 시 타입 충돌 발생해서 다운그레이드)
- 기본 모델을 **중간 티어 안전값**으로 조정 (최상위는 env 오버라이드):

| 프로바이더 | 기본 모델 | 가격 (1M tok) | 최상위 오버라이드 |
|---|---|---|---|
| anthropic | `claude-sonnet-5` | $2 / $10 | `CLAUDE_MODEL=claude-opus-5` |
| openai | `gpt-5.6-terra` | $2 / $12 | `OPENAI_MODEL=gpt-5.6-sol` |

---

## 현재 프로젝트 구조

```
techdoc-ai-next/
├── techdoc-ai-prototype.jsx      # 원본 프로토타입 (참조용, 빌드 제외)
├── app/
│   ├── layout.tsx                # 메타데이터 + Pretendard 폰트
│   ├── page.tsx                  # useObject 수신 + 화면 조립
│   ├── globals.css               # Tailwind 4 + highlight.js 테마
│   └── api/generate/route.ts     # streamObject / MOCK_MODE / 캐싱 / 캐시 로그
├── components/
│   ├── SiteHeader / Hero / InputForm / PaywallBanner.tsx
│   ├── ResultViewer.tsx          # 에디터 UI + 탭 + 복사
│   ├── Markdown.tsx              # react-markdown 렌더러
│   └── MarkdownErrorBoundary.tsx # 스트리밍 파싱 깨짐 방어
└── lib/
    ├── schema.ts                 # zod: 문서 3종 + 입력 검증
    ├── prompts.ts                # 시스템 프롬프트 + 유형 판별 + few-shot 조립
    ├── examples.ts               # 유형별 few-shot 예시 (순수 데이터)
    ├── llm.ts                    # 프로바이더/모델 선택 (env 기반)
    ├── mock.ts                   # mock 문서 생성기
    └── constants.ts              # 스택 프리셋, 탭, 로딩 단계
```

## 환경변수 (.env.local)

```
LLM_PROVIDER=anthropic        # anthropic(기본) | openai
ANTHROPIC_API_KEY=            # anthropic 사용 시
OPENAI_API_KEY=               # openai 사용 시
CLAUDE_MODEL=claude-sonnet-5  # 미설정 시 기본값
OPENAI_MODEL=gpt-5.6-terra    # 미설정 시 기본값
MOCK_MODE=true                # true면 키 없이 mock으로 전체 플로우 테스트
```

## 커밋 히스토리

```
174c9f2 chore: 기본 모델을 중간 티어 안전값으로 조정
38a2e4c feat: LLM 프로바이더 env 스위치 (anthropic | openai)
99726f1 docs: web 유형 few-shot 예시를 정식 예시로 교체
1091bb1 feat: 프로젝트 유형별 few-shot 예시 + 프롬프트 캐싱 적용
d670e4f TechDoc AI: Next.js 15 + Vercel AI SDK 초기 구현
```

## 남은 일 (TODO)

- [ ] **실 API 연동 테스트** — `.env.local`에 실제 키 + `MOCK_MODE=false`로 생성 품질 확인 (문서 3종 1회 ≈ Sonnet 기준 $0.05~0.1)
- [ ] backend-infra / ai-data 유형의 few-shot 예시를 정식 예시로 교체
- [ ] 실 API에서 프롬프트 캐시 적중 로그 확인 (같은 유형 2회 연속 생성)
- [ ] 저장소 루트 README.md 작성 (포트폴리오용 공개 저장소)
- [ ] 인증 / rate limit / 결제 — **이번 범위에서 제외됨** (별도 지시 예정)

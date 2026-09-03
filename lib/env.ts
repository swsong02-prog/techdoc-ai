/**
 * 프로덕션 필수 환경변수 검사.
 * 개발에서는 Supabase 미설정 시 "개발 모드" 폴백이 편리하지만,
 * 프로덕션에서 조용히 폴백되면 인증/과금 없이 서비스가 열리는 사고가 되므로
 * 요청 시점에 명확한 에러로 실패시킨다.
 */
export function getMissingProductionEnv(): string[] {
  if (process.env.NODE_ENV !== "production") return [];

  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  // MOCK_MODE가 아니면 선택된 프로바이더의 키도 필수
  if (process.env.MOCK_MODE !== "true") {
    const provider = (process.env.LLM_PROVIDER ?? "anthropic").toLowerCase();
    required.push(provider === "openai" ? "OPENAI_API_KEY" : "ANTHROPIC_API_KEY");
  }

  return required.filter((key) => !process.env[key]);
}

/** 누락 시 500 응답 + 서버 로그. 통과 시 null */
export function productionEnvGuard(): Response | null {
  const missing = getMissingProductionEnv();
  if (missing.length === 0) return null;
  console.error(`[env] 프로덕션 필수 환경변수 누락: ${missing.join(", ")}`);
  return Response.json(
    { error: "서버 설정 오류입니다. 관리자에게 문의해주세요." },
    { status: 500 }
  );
}

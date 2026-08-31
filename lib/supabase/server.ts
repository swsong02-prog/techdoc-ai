import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/** Supabase 환경변수가 설정되어 있는지 (미설정이면 인증/횟수 제한을 건너뛰는 개발 모드) */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** 요청 쿠키 기반 세션 사용자 조회 (읽기 전용 — 쿠키 갱신은 /auth/callback 담당) */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          /* route handler에서는 세션 읽기만 수행 */
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * 서비스 롤 클라이언트 — profiles 테이블 읽기/쓰기 전용.
 * RLS를 우회하므로 서버 코드에서만 사용할 것 (클라이언트 번들 유입 금지).
 */
export function createServiceClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

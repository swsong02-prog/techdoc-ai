import { createServiceClient, getSessionUser, isAuthConfigured } from "@/lib/supabase/server";
import { FREE_LIMIT, getProfile, hasFreeQuota } from "@/lib/usage";

/** 클라이언트 무료 횟수 표시를 서버 값과 동기화하기 위한 조회 API */
export async function GET() {
  if (!isAuthConfigured()) {
    return Response.json({ configured: false, authenticated: false, remaining: null });
  }

  const user = await getSessionUser();
  if (!user) {
    return Response.json({ configured: true, authenticated: false, remaining: null });
  }

  try {
    const row = await getProfile(createServiceClient(), user.id);
    const remaining = hasFreeQuota(row) ? FREE_LIMIT : 0;
    return Response.json({ configured: true, authenticated: true, remaining });
  } catch (e) {
    console.error(`[usage] 조회 실패: ${e instanceof Error ? e.message : e}`);
    return Response.json({ configured: true, authenticated: true, remaining: null });
  }
}

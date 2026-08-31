import type { SupabaseClient } from "@supabase/supabase-js";

/** 하루 무료 생성 횟수 */
export const DAILY_FREE_LIMIT = 1;

export interface ProfileRow {
  daily_count: number;
  last_generated_at: string | null;
}

/** KST(UTC+9) 기준 날짜 문자열 (YYYY-MM-DD) — 자정 리셋 판정용 */
export function kstDay(d: Date): string {
  return new Date(d.getTime() + 9 * 3600_000).toISOString().slice(0, 10);
}

/**
 * 무료 횟수가 남아 있는지. KST 자정이 지나면 카운트는 리셋된 것으로 취급한다.
 * (row가 없거나 마지막 생성이 어제(KST)이면 무조건 허용)
 */
export function hasFreeQuota(row: ProfileRow | null, now: Date = new Date()): boolean {
  if (!row || !row.last_generated_at) return true;
  if (kstDay(new Date(row.last_generated_at)) !== kstDay(now)) return true;
  return row.daily_count < DAILY_FREE_LIMIT;
}

export async function getProfile(
  svc: SupabaseClient,
  userId: string
): Promise<ProfileRow | null> {
  const { data, error } = await svc
    .from("profiles")
    .select("daily_count, last_generated_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(`profiles 조회 실패: ${error.message}`);
  return data;
}

/**
 * 생성 1회 기록 — 반드시 "스트림 정상 완료 + 스키마 검증 통과" 후에만 호출할 것.
 * 같은 KST 날짜면 count+1, 날짜가 바뀌었으면 1로 리셋.
 */
export async function recordGeneration(
  svc: SupabaseClient,
  userId: string,
  now: Date = new Date()
): Promise<void> {
  const row = await getProfile(svc, userId);
  const sameDay =
    row?.last_generated_at && kstDay(new Date(row.last_generated_at)) === kstDay(now);
  const nextCount = sameDay ? row!.daily_count + 1 : 1;

  const { error } = await svc.from("profiles").upsert({
    user_id: userId,
    daily_count: nextCount,
    last_generated_at: now.toISOString(),
  });
  if (error) throw new Error(`profiles 기록 실패: ${error.message}`);
}

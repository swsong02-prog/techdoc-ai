import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * 무료 정책: 계정당(평생) 1회.
 * 저빈도 서비스 특성상 일일 리셋이면 며칠에 걸쳐 전부 무료로 소진 가능해서,
 * "가입 시 1회 맛보기 + 이후 프로젝트당 ₩2,000" 모델로 운영한다.
 */
export const FREE_LIMIT = 1;

/**
 * ⚠️ 컬럼명 주의: daily_count는 정책 변경(일일 → 평생)으로 이제 "누적 생성 횟수"를 의미한다.
 * 컬럼 rename은 배포 타이밍에 별도 마이그레이션으로 진행 (제안 SQL은 supabase/setup.sql 하단 주석 참고).
 */
export interface ProfileRow {
  daily_count: number; // 누적 생성 횟수 (이름과 달리 일일 아님)
  last_generated_at: string | null;
}

/** 무료 횟수가 남아 있는지 — 누적 카운트 기준, 날짜 무관 */
export function hasFreeQuota(row: ProfileRow | null): boolean {
  if (!row) return true;
  return row.daily_count < FREE_LIMIT;
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
 * 누적 카운트라 리셋 없이 무조건 +1.
 */
export async function recordGeneration(
  svc: SupabaseClient,
  userId: string,
  now: Date = new Date()
): Promise<void> {
  const row = await getProfile(svc, userId);
  const nextCount = (row?.daily_count ?? 0) + 1;

  const { error } = await svc.from("profiles").upsert({
    user_id: userId,
    daily_count: nextCount,
    last_generated_at: now.toISOString(),
  });
  if (error) throw new Error(`profiles 기록 실패: ${error.message}`);
}

-- TechDoc AI — Phase 4 인증/사용량 스키마
-- Supabase Dashboard → SQL Editor에서 1회 실행

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  daily_count int not null default 0,
  last_generated_at timestamptz
);

alter table public.profiles enable row level security;

-- 클라이언트(anon/authenticated)는 자기 행 조회만 가능
create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

-- insert/update 정책 없음 = 클라이언트 쓰기 차단.
-- 횟수 기록은 서버의 service_role 키(RLS 우회)로만 수행된다.

-- ─────────────────────────────────────────────
-- [제안 — 아직 실행하지 말 것] 무료 정책이 "일일 1회 → 계정당 평생 1회"로 바뀌면서
-- daily_count가 실제로는 누적 생성 횟수를 의미하게 됐다. 배포 타이밍에 아래로 rename 권장:
--
-- alter table public.profiles rename column daily_count to generation_count;
-- (코드의 lib/usage.ts ProfileRow와 select/upsert 컬럼명도 함께 변경)
-- ─────────────────────────────────────────────

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

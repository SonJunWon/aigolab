-- ═══════════════════════════════════════════════════════════════════
-- v3.16.0 — 구독 모델 Phase 2A: user_entitlements + 관리자 모드
--
-- 이 스크립트를 Supabase Dashboard → SQL Editor 에 전체 붙여넣고 실행하세요.
-- 멱등(idempotent)하게 설계됨 — 여러 번 실행해도 안전합니다.
--
-- 최상단 "BOOTSTRAP_ADMIN_EMAIL" 부분을 본인 계정 이메일로 바꾸세요.
-- ═══════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────
-- 1. profiles 테이블에 email 컬럼 추가 (검색/표시용)
-- ───────────────────────────────────────────────────────────────────
alter table if exists public.profiles
  add column if not exists email text;

-- 기존 프로필들에 email 백필
update public.profiles p
set email = u.email
from auth.users u
where p.user_id = u.id
  and (p.email is null or p.email = '');

-- 가입 시 trigger 가 email 도 같이 채우도록 업데이트
-- (기존 trigger 가 있으면 함수만 교체)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, nickname, avatar_emoji)
  values (
    new.id,
    new.email,
    split_part(new.email, '@', 1),
    '🙂'
  )
  on conflict (user_id) do update
    set email = excluded.email
    where public.profiles.email is null;
  return new;
end;
$$;

-- trigger 가 없으면 생성
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row
      execute function public.handle_new_user();
  end if;
end $$;


-- ───────────────────────────────────────────────────────────────────
-- 2. user_entitlements 테이블
--
-- 한 사용자가 여러 번들 권한을 동시에 가질 수 있음.
-- (user_id, entitlement) 쌍이 유일 — 같은 번들 중복 부여 방지.
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.user_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entitlement text not null check (
    entitlement in (
      'all-pro',          -- 전체 PRO (위 3개 묶음 = "정식 구독")
      'ai-courses-pro',   -- AI 강의 07~10 열림
      'python-advanced',  -- Python 중급·데이터·ML 실습 열림
      'projects-pro',     -- AI 프로젝트 11개 열림
      'admin'             -- 관리자 모드 접근 + 타인 혜택 편집
    )
  ),
  granted_at timestamptz not null default now(),
  expires_at timestamptz,                              -- null = 무제한
  granted_by uuid references auth.users(id),           -- 감사용
  source text default 'admin' check (
    source in ('admin', 'payment', 'promo', 'coupon', 'env', 'bootstrap')
  ),
  note text,                                            -- 관리자 메모
  created_at timestamptz not null default now(),
  unique (user_id, entitlement)
);

create index if not exists user_entitlements_user_idx
  on public.user_entitlements(user_id);
create index if not exists user_entitlements_kind_idx
  on public.user_entitlements(entitlement);


-- ───────────────────────────────────────────────────────────────────
-- 3. is_admin() — SECURITY DEFINER 로 RLS 재귀 방지
-- ───────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists(
    select 1 from public.user_entitlements
    where user_id = auth.uid()
      and entitlement = 'admin'
      and (expires_at is null or expires_at > now())
  );
$$;

grant execute on function public.is_admin() to authenticated;


-- ───────────────────────────────────────────────────────────────────
-- 4. RLS 정책
-- ───────────────────────────────────────────────────────────────────
alter table public.user_entitlements enable row level security;

-- 기존 정책 제거 후 재생성 (멱등)
drop policy if exists "read_own_entitlements" on public.user_entitlements;
drop policy if exists "admin_read_all_entitlements" on public.user_entitlements;
drop policy if exists "admin_write_entitlements" on public.user_entitlements;

create policy "read_own_entitlements"
  on public.user_entitlements
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "admin_read_all_entitlements"
  on public.user_entitlements
  for select
  to authenticated
  using (public.is_admin());

create policy "admin_write_entitlements"
  on public.user_entitlements
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 관리자가 모든 profiles 조회 가능 (사용자 리스트 표시용)
drop policy if exists "admin_read_all_profiles" on public.profiles;
create policy "admin_read_all_profiles"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());


-- ───────────────────────────────────────────────────────────────────
-- 5. 첫 관리자 부트스트랩
--
-- ⚠️  아래 이메일을 본인 계정으로 바꾸세요 (기본값: gyumsonsam@gmail.com)
-- ───────────────────────────────────────────────────────────────────
insert into public.user_entitlements (user_id, entitlement, source, note)
select id, 'admin', 'bootstrap', '첫 관리자 부트스트랩 (v3.16.0)'
from auth.users
where email = 'gyumsonsam@gmail.com'
on conflict (user_id, entitlement) do nothing;

-- 같은 계정에 all-pro 도 함께 부여 (테스트·시연용)
insert into public.user_entitlements (user_id, entitlement, source, note)
select id, 'all-pro', 'bootstrap', '관리자 테스트용 all-pro'
from auth.users
where email = 'gyumsonsam@gmail.com'
on conflict (user_id, entitlement) do nothing;


-- ═══════════════════════════════════════════════════════════════════
-- 실행 후 확인 쿼리 (선택):
--
-- select * from public.user_entitlements;
-- select public.is_admin();
-- ═══════════════════════════════════════════════════════════════════

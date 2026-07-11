-- ═══════════════════════════════════════════════════════════════
-- v4.43.0 — 관리자 강의 정리 노트 영속화 (Phase 2)
-- 기획: AI앱개발/관리자-강의정리/01-강의정리-프로그램-기획.md 4장
--
-- id 는 클라이언트 세션 ID(text, 예: "rec-1783...") 를 그대로 사용해
-- IndexedDB(로컬 캐시)와 클라우드가 같은 키를 공유한다.
-- 접근 제어: v3.16.0 의 public.is_admin() (SECURITY DEFINER) 재사용 — admin 전용.
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.admin_lecture_notes (
  id           text primary key,
  user_id      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title        text not null,
  source       text not null default '',
  recorded_at  timestamptz not null,
  duration_sec int  not null default 0,
  transcript   text not null default '',
  summary      jsonb,                          -- LectureSummary (정리 실패 시 null)
  bookmarks    int[]  not null default '{}',
  tags         text[] not null default '{}',
  keep_audio   boolean not null default false,
  updated_at   timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

comment on table public.admin_lecture_notes is
  '관리자 강의 정리 노트 — 개인 학습 목적 보관. 오디오 원본은 저장하지 않는다(전사·정리본만).';

-- RLS: admin 만 전체 CRUD
alter table public.admin_lecture_notes enable row level security;

drop policy if exists "admin_all_lecture_notes" on public.admin_lecture_notes;
create policy "admin_all_lecture_notes"
  on public.admin_lecture_notes
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 목록 정렬용 인덱스
create index if not exists idx_lecture_notes_recorded_at
  on public.admin_lecture_notes (recorded_at desc);

-- ═══════════════════════════════════════════════════════════════════
-- AI 입문(intro) 트랙 — 레슨 ID 정합화 마이그레이션
--
-- 책 챕터 번호와 플랫폼 ID 번호가 한 칸씩 어긋나 있던 것을 정리.
-- 영향 테이블: user_progress, quiz_results
--
-- 멱등(idempotent) — 여러 번 실행해도 안전합니다.
--   - WHERE 조건이 구 ID 만 매치하므로, 이미 신 ID 인 행은 변하지 않음.
--
-- 사용법: Supabase Dashboard → SQL Editor 에 전체 붙여넣고 실행.
-- ═══════════════════════════════════════════════════════════════════

begin;

-- ───────────────────────────────────────────────────────────────────
-- 1. user_progress.current_lesson — 단일 문자열 치환
--    영향 행: language='ai-engineering' AND track='intro'
-- ───────────────────────────────────────────────────────────────────
update public.user_progress
set current_lesson = case current_lesson
  when 'ai-intro-07-file-extensions' then 'ai-intro-08-file-extensions'
  when 'ai-intro-08-internet-api'    then 'ai-intro-09-internet-api'
  when 'ai-intro-09-coding-basics'   then 'ai-intro-10-coding-basics'
  when 'ai-intro-10-dev-tools'       then 'ai-intro-11-dev-tools'
  when 'ai-intro-11-vibe-coding'     then 'ai-intro-12-vibe-coding'
  when 'ai-intro-12-next-steps'      then 'ai-intro-13-next-steps'
  else current_lesson
end,
updated_at = now()
where language = 'ai-engineering'
  and track = 'intro'
  and current_lesson in (
    'ai-intro-07-file-extensions',
    'ai-intro-08-internet-api',
    'ai-intro-09-coding-basics',
    'ai-intro-10-dev-tools',
    'ai-intro-11-vibe-coding',
    'ai-intro-12-next-steps'
  );

-- ───────────────────────────────────────────────────────────────────
-- 2. user_progress.completed_lessons — text[] 내부 요소 치환
--    배열 내 요소를 6번 순차 replace.
-- ───────────────────────────────────────────────────────────────────
update public.user_progress
set completed_lessons = (
  select array_agg(
    case x
      when 'ai-intro-07-file-extensions' then 'ai-intro-08-file-extensions'
      when 'ai-intro-08-internet-api'    then 'ai-intro-09-internet-api'
      when 'ai-intro-09-coding-basics'   then 'ai-intro-10-coding-basics'
      when 'ai-intro-10-dev-tools'       then 'ai-intro-11-dev-tools'
      when 'ai-intro-11-vibe-coding'     then 'ai-intro-12-vibe-coding'
      when 'ai-intro-12-next-steps'      then 'ai-intro-13-next-steps'
      else x
    end
    order by ord
  )
  from unnest(completed_lessons) with ordinality as t(x, ord)
),
updated_at = now()
where language = 'ai-engineering'
  and track = 'intro'
  and completed_lessons && array[
    'ai-intro-07-file-extensions',
    'ai-intro-08-internet-api',
    'ai-intro-09-coding-basics',
    'ai-intro-10-dev-tools',
    'ai-intro-11-vibe-coding',
    'ai-intro-12-next-steps'
  ];

-- ───────────────────────────────────────────────────────────────────
-- 3. quiz_results.quiz_id — 단일 문자열 치환
--    UNIQUE(user_id, quiz_id) 충돌 가능 → 신 ID 가 이미 있으면 구 행 삭제,
--    없으면 구 행을 신 ID 로 update.
-- ───────────────────────────────────────────────────────────────────
-- 3a. 신 ID 가 이미 존재하는 (user_id, old_id) 쌍의 구 행 삭제
delete from public.quiz_results q1
using (
  select user_id, quiz_id
  from public.quiz_results
  where quiz_id in (
    'ai-intro-07-file-extensions',
    'ai-intro-08-internet-api',
    'ai-intro-09-coding-basics',
    'ai-intro-10-dev-tools',
    'ai-intro-11-vibe-coding',
    'ai-intro-12-next-steps'
  )
) old_rows
where q1.user_id = old_rows.user_id
  and q1.quiz_id = old_rows.quiz_id
  and exists (
    select 1 from public.quiz_results q2
    where q2.user_id = old_rows.user_id
      and q2.quiz_id = case old_rows.quiz_id
        when 'ai-intro-07-file-extensions' then 'ai-intro-08-file-extensions'
        when 'ai-intro-08-internet-api'    then 'ai-intro-09-internet-api'
        when 'ai-intro-09-coding-basics'   then 'ai-intro-10-coding-basics'
        when 'ai-intro-10-dev-tools'       then 'ai-intro-11-dev-tools'
        when 'ai-intro-11-vibe-coding'     then 'ai-intro-12-vibe-coding'
        when 'ai-intro-12-next-steps'      then 'ai-intro-13-next-steps'
      end
  );

-- 3b. 충돌하지 않는 구 행은 신 ID 로 update
update public.quiz_results
set quiz_id = case quiz_id
  when 'ai-intro-07-file-extensions' then 'ai-intro-08-file-extensions'
  when 'ai-intro-08-internet-api'    then 'ai-intro-09-internet-api'
  when 'ai-intro-09-coding-basics'   then 'ai-intro-10-coding-basics'
  when 'ai-intro-10-dev-tools'       then 'ai-intro-11-dev-tools'
  when 'ai-intro-11-vibe-coding'     then 'ai-intro-12-vibe-coding'
  when 'ai-intro-12-next-steps'      then 'ai-intro-13-next-steps'
end
where quiz_id in (
  'ai-intro-07-file-extensions',
  'ai-intro-08-internet-api',
  'ai-intro-09-coding-basics',
  'ai-intro-10-dev-tools',
  'ai-intro-11-vibe-coding',
  'ai-intro-12-next-steps'
);

-- ───────────────────────────────────────────────────────────────────
-- 4. 사후 검증 — 잔여 구 ID 행이 없어야 함 (조회만)
-- ───────────────────────────────────────────────────────────────────
-- 다음 두 쿼리는 결과가 0이어야 정상.
--   select count(*) from public.user_progress
--     where language='ai-engineering' and track='intro'
--       and (current_lesson in (...) or completed_lessons && array[...]);
--   select count(*) from public.quiz_results where quiz_id in (...);

commit;

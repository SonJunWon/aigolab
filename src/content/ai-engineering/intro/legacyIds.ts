/**
 * AI 입문(intro) 트랙 — 레슨 ID 마이그레이션 매핑.
 *
 * 책 챕터 번호와 플랫폼 ID 번호가 한 칸씩 어긋나 있던 것을 정리하면서
 * 외부 북마크·SEO·Supabase 진도가 깨지지 않도록 구 ID → 신 ID 매핑을 보존.
 *
 * - LessonPage 에서 신 ID 로 못 찾을 때 이 맵을 조회해 redirect.
 * - 앱 부팅 시 IDB 의 notebooks·progress 도 1회 마이그레이션.
 * - Supabase 는 별도 SQL 마이그레이션 (작업자 수동 적용).
 */
export const LEGACY_AI_INTRO_ID_MAP: Readonly<Record<string, string>> = {
  "ai-intro-07-file-extensions": "ai-intro-08-file-extensions",
  "ai-intro-08-internet-api": "ai-intro-09-internet-api",
  "ai-intro-09-coding-basics": "ai-intro-10-coding-basics",
  "ai-intro-10-dev-tools": "ai-intro-11-dev-tools",
  "ai-intro-11-vibe-coding": "ai-intro-12-vibe-coding",
  "ai-intro-12-next-steps": "ai-intro-13-next-steps",
};

export function resolveLegacyAiIntroId(id: string): string | undefined {
  return LEGACY_AI_INTRO_ID_MAP[id];
}

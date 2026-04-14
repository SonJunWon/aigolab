/**
 * 환경변수 기반 슈퍼 관리자 이메일 체크.
 *
 * VITE_ADMIN_EMAILS 에 쉼표로 구분된 이메일이 들어감.
 * 여기 속한 계정은 **클라이언트에서 자동으로 admin 권한** 을 갖습니다.
 * (단, 실제 DB 쓰기 권한은 RLS 가 확인 — user_entitlements 에 admin 행이 있어야 함)
 *
 * 하이브리드 전략:
 *   - env 이메일: 절대 권한 (코드 공개 안 됨, 탈취 어려움)
 *   - DB user_entitlements: 추가 관리자·세부 혜택
 */

const RAW = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? "";

const ADMIN_EMAIL_SET: Set<string> = new Set(
  RAW.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

/** 이메일이 슈퍼 관리자 리스트에 있는지 확인 (대소문자 무관) */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAIL_SET.has(email.toLowerCase());
}

/** 슈퍼 관리자 이메일 개수 (디버그용) */
export function getAdminEmailCount(): number {
  return ADMIN_EMAIL_SET.size;
}

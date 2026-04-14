/**
 * 사용자 혜택(entitlement) 도메인 타입.
 *
 * - "번들(bundle)" 단위 — 옵션 B 채택.
 * - 한 사용자는 여러 번들을 동시에 가질 수 있음 (예: ai-courses-pro + projects-pro).
 * - `admin` 은 관리자 모드 접근 + 타인 혜택 편집 권한.
 */

export type EntitlementKind =
  | "all-pro"          // 아래 3개 묶음 = 정식 PRO 구독
  | "ai-courses-pro"   // AI 강의 07~10
  | "python-advanced"  // Python 중급·데이터·ML 실습 트랙
  | "projects-pro"     // AI 프로젝트 11개 (iris·titanic 제외)
  | "admin";           // 관리자 모드

export type EntitlementSource =
  | "admin"      // 관리자가 수동 부여
  | "payment"    // 결제 자동 부여 (Phase 3)
  | "promo"      // 프로모션
  | "coupon"     // 쿠폰 사용
  | "env"        // 환경변수 기반 슈퍼 관리자
  | "bootstrap"; // 첫 관리자 부트스트랩

export interface Entitlement {
  id: string;
  user_id: string;
  entitlement: EntitlementKind;
  granted_at: string;       // ISO
  expires_at: string | null;
  granted_by: string | null;
  source: EntitlementSource;
  note: string | null;
  created_at: string;
}

export const ENTITLEMENT_KINDS: EntitlementKind[] = [
  "all-pro",
  "ai-courses-pro",
  "python-advanced",
  "projects-pro",
  "admin",
];

export const ENTITLEMENT_LABELS: Record<EntitlementKind, string> = {
  "all-pro":         "🌟 All PRO",
  "ai-courses-pro":  "🧠 AI 강의 PRO",
  "python-advanced": "🐍 Python 심화",
  "projects-pro":    "🧪 프로젝트 PRO",
  "admin":           "🛡️ 관리자",
};

export const ENTITLEMENT_DESCRIPTIONS: Record<EntitlementKind, string> = {
  "all-pro":         "전체 PRO 콘텐츠 열림 (아래 세 번들 포함)",
  "ai-courses-pro":  "AI 강의 07~10 (프롬프트·비전·윤리·에이전트)",
  "python-advanced": "Python 중급 / 데이터 과학 / ML 실습 트랙",
  "projects-pro":    "AI 프로젝트 11개 (iris·titanic 제외)",
  "admin":           "관리자 대시보드 접근 + 타인 혜택 편집",
};

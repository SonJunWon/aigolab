/**
 * 접근 제어 헬퍼 — `tier.ts` (콘텐츠 pro 여부) + 사용자 entitlements 결합.
 *
 * 규칙:
 *   - 무료 콘텐츠: 로그인만 하면 접근 가능
 *   - PRO 콘텐츠: 사용자가 대응 entitlement 를 가지고 있어야 접근 가능
 *   - `all-pro` 는 모든 번들을 포함하는 슈퍼 번들
 *   - `admin` 은 별도 권한 — 모든 콘텐츠 접근 + 관리자 UI 접근
 */

import type { Language, Track } from "../types/lesson";
import type { Entitlement, EntitlementKind } from "../types/entitlement";
import { isCoursePro, isProjectPro, isLessonPro, isTrackPro, isWorkshopPro } from "./tier";

/** entitlement 가 만료되지 않았는지 */
function isActive(ent: Entitlement): boolean {
  if (!ent.expires_at) return true;
  return new Date(ent.expires_at).getTime() > Date.now();
}

/** 특정 번들 보유 여부 (만료 고려) */
export function hasEntitlement(
  entitlements: Entitlement[],
  kind: EntitlementKind
): boolean {
  return entitlements.some((e) => e.entitlement === kind && isActive(e));
}

/** 관리자 여부 */
export function isAdmin(entitlements: Entitlement[]): boolean {
  return hasEntitlement(entitlements, "admin");
}

/** AI 강의 접근 가능 여부 */
export function canAccessCourse(
  courseId: string,
  entitlements: Entitlement[]
): boolean {
  if (!isCoursePro(courseId)) return true;
  if (isAdmin(entitlements)) return true;
  return (
    hasEntitlement(entitlements, "all-pro") ||
    hasEntitlement(entitlements, "ai-courses-pro")
  );
}

/** AI 프로젝트 접근 가능 여부 */
export function canAccessProject(
  projectId: string,
  entitlements: Entitlement[]
): boolean {
  if (!isProjectPro(projectId)) return true;
  if (isAdmin(entitlements)) return true;
  return (
    hasEntitlement(entitlements, "all-pro") ||
    hasEntitlement(entitlements, "projects-pro")
  );
}

/**
 * 코딩 실습 레슨 접근 가능 여부.
 */
export function canAccessLesson(
  lang: Language,
  track: Track,
  entitlements: Entitlement[],
  lessonId?: string,
  lessonOrder?: number,
): boolean {
  if (!isLessonPro(lang, track, lessonId, lessonOrder)) return true;
  if (isAdmin(entitlements)) return true;
  if (lang === "python" && track !== "beginner") {
    return (
      hasEntitlement(entitlements, "all-pro") ||
      hasEntitlement(entitlements, "python-advanced")
    );
  }
  return hasEntitlement(entitlements, "all-pro");
}

/** 트랙 자체 접근 가능 여부 (커리큘럼 페이지 게이트) */
export function canAccessTrack(
  lang: Language,
  track: Track,
  entitlements: Entitlement[]
): boolean {
  if (!isTrackPro(lang, track)) return true;
  return canAccessLesson(lang, track, entitlements);
}

/**
 * 바이브코딩 워크샵 접근 가능 여부.
 * W00 + Phase 1 (order <= 106): 무료
 * Phase 2+ (order >= 107): PRO 필요
 */
export function canAccessWorkshop(
  lessonOrder: number,
  entitlements: Entitlement[]
): boolean {
  if (!isWorkshopPro(lessonOrder)) return true;
  if (isAdmin(entitlements)) return true;
  return hasEntitlement(entitlements, "all-pro");
}

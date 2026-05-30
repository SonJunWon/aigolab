/**
 * 워크샵 — 클라이언트 진입점 (aggregator).
 *
 * ⚠️ PRO 워크샵 본문(cells)은 클라이언트 번들에서 분리됨(H1). 메타데이터 +
 *   첫 인트로 마크다운 셀(티저)만 유지하고, 실제 본문은 LessonPage 가
 *   /api/workshop-content 로 인증 후 fetch 한다.
 *   파생 메타(llmCellCount·glossaryTerms)는 WORKSHOP_TEASER_META 로 보존.
 *
 * 저작 원본: ./data.ts (codegen 입력, 클라 런타임 미import).
 */

import type { Lesson, LessonSummary } from "../../../types/lesson";
import { CLIENT_WORKSHOP_LESSONS } from "./generated";

export const WORKSHOP_LESSONS: Lesson[] = CLIENT_WORKSHOP_LESSONS;

export const WORKSHOP_SUMMARIES: LessonSummary[] = WORKSHOP_LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));

export { WORKSHOP_TEASER_META, type WorkshopTeaserMeta } from "./generated";

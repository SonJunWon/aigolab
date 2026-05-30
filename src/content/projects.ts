/**
 * 프로젝트 — 클라이언트 진입점 (aggregator).
 *
 * ⚠️ 본문(정답·스타터 코드)은 더 이상 클라이언트 번들에 포함되지 않는다(H1).
 *   - 메타데이터 + 무료 본문 + PRO 티저(개요/step 제목)는 생성된
 *     `generated/projects.generated.ts` 에서 온다.
 *   - PRO 의 실제 본문은 서버(`/api/project-content`)가 인증·entitlement 확인 후
 *     제공하며, 클라이언트는 `lib/contentBody.ts` 로 런타임 fetch 한다.
 *
 * 저작 원본: `projects.data.ts` (타입만 여기서 재export — 런타임 데이터는 미import).
 */

import { CLIENT_PROJECTS } from "./generated/projects.generated";

export type { Project, ProjectStep, ProjectCategory } from "./projects.data";

/** 프로젝트 목록 (PRO 는 본문이 비어 있음 — 상세 진입 시 서버에서 fetch). */
export const PROJECTS = CLIENT_PROJECTS;

export function getProjectById(id: string) {
  return CLIENT_PROJECTS.find((p) => p.id === id);
}

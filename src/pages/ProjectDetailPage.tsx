import { Navigate, useParams } from "react-router-dom";

/**
 * 레거시 상세 페이지 라우트 (/projects/:id) — v3.6.0 이후로 제거.
 *
 * 기존 북마크·외부 링크를 보존하기 위해 프로젝트 목록에서 해당 프로젝트가
 * 펼쳐진 상태(/projects?open=:id) 로 자동 리다이렉트.
 *
 * 새 흐름: 목록 → 브리핑 펼침 → "프로젝트 시작하기" → /projects/:id/work (IDE)
 */
export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const target = projectId ? `/projects?open=${projectId}` : "/projects";
  return <Navigate to={target} replace />;
}

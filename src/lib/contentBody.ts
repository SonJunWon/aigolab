/**
 * PRO 콘텐츠 본문 런타임 로더 (H1 서버 게이팅의 클라이언트 측).
 *
 * 유료 본문은 클라이언트 번들에서 분리되어 있어, 권한 있는 사용자가 상세
 * 화면에 진입할 때 인증 토큰과 함께 서버에서 fetch 한다. 권한이 없으면
 * 서버가 403 을 반환하고 여기서는 null 을 돌려준다(화면은 잠금 처리).
 */

import { supabase } from "./supabase";
import type { Project } from "../content/projects";

export interface ProjectBody {
  steps: Project["steps"];
  starterFiles: Project["starterFiles"];
}

/** PRO 프로젝트 본문(steps·starterFiles)을 서버에서 가져온다. 실패 시 null. */
export async function fetchProjectBody(id: string): Promise<ProjectBody | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return null;

    const res = await fetch(
      `/api/project-content?id=${encodeURIComponent(id)}`,
      {
        headers: { Authorization: `Bearer ${session.access_token}` },
      },
    );
    if (!res.ok) {
      if (res.status !== 403) {
        console.error("[contentBody] project fetch 실패:", res.status);
      }
      return null;
    }
    return (await res.json()) as ProjectBody;
  } catch (err) {
    console.error("[contentBody] 네트워크 오류:", err);
    return null;
  }
}

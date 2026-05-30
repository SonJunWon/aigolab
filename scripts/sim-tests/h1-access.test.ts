/**
 * H1 — PRO 접근 게이팅 규칙 (실제 content/access + tier 모듈 사용).
 * 서버 Vercel Function(api/project-content)이 본문 제공 전 동일 규칙으로 판정한다.
 */
import { canAccessProject } from "../../src/content/access";
import { isProjectPro } from "../../src/content/tier";
import type { Entitlement, EntitlementKind } from "../../src/types/entitlement";
import { check, done } from "./_assert";

function ent(kind: EntitlementKind, expires_at: string | null = null): Entitlement {
  return {
    id: "x", user_id: "u", entitlement: kind, granted_at: "2026-01-01",
    expires_at, granted_by: null, source: "admin", note: null, created_at: "2026-01-01",
  };
}

// 실제 데이터에서 PRO/무료 프로젝트 id 확보
const FREE = "iris-classification";
const PRO = "movie-recommendation";

check("전제: iris 는 무료", !isProjectPro(FREE));
check("전제: movie-recommendation 은 PRO", isProjectPro(PRO));

// 무료: 권한 없어도 접근 허용
check("무료 프로젝트는 entitlement 없이 접근 허용", canAccessProject(FREE, []) === true);

// PRO: 권한별 판정
check("PRO + 권한없음 → 차단", canAccessProject(PRO, []) === false);
check("PRO + projects-pro → 허용", canAccessProject(PRO, [ent("projects-pro")]) === true);
check("PRO + all-pro → 허용", canAccessProject(PRO, [ent("all-pro")]) === true);
check("PRO + admin → 허용", canAccessProject(PRO, [ent("admin")]) === true);
check("PRO + 엉뚱한 번들(python-advanced) → 차단", canAccessProject(PRO, [ent("python-advanced")]) === false);

// 만료된 entitlement → 차단
const past = "2020-01-01T00:00:00Z";
check("PRO + 만료된 projects-pro → 차단", canAccessProject(PRO, [ent("projects-pro", past)]) === false);
const future = "2090-01-01T00:00:00Z";
check("PRO + 유효기간 미래 projects-pro → 허용", canAccessProject(PRO, [ent("projects-pro", future)]) === true);

done("H1 access gating");

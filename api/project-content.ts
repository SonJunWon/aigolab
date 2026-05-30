/**
 * Vercel Serverless Function — PRO 프로젝트 본문 제공 (서버 게이팅, H1).
 *
 * 왜 서버인가:
 *   PRO 프로젝트의 실제 본문(정답 step·스타터 코드)은 클라이언트 번들에서
 *   분리되어 있다(scripts/split-content.ts). 결제/권한 없는 사용자가 번들이나
 *   콘솔로 유료 콘텐츠를 추출하던 우회를 차단하기 위해, 본문은 이 함수가
 *   Supabase JWT + entitlement 를 검증한 뒤에만 반환한다.
 *
 * 요청:  GET /api/project-content?id=<projectId>
 *        Authorization: Bearer <supabase access_token>
 * 응답:  200 { steps, starterFiles } | 401 | 403 | 404
 *
 * 주의: 이 함수는 self-contained 로 유지한다(../src 를 import 하지 않음).
 *   Vercel 서버리스 번들에서 api/ 밖 모듈 cross-import 가 깨질 수 있어,
 *   entitlement 판정 규칙(content/access.ts 와 동일)을 여기 인라인한다.
 *   PRO 여부는 생성된 PRO_PROJECT_BODIES 존재로 판단(무료는 애초에 없음).
 *
 * 런타임: Vercel Node.js (Fluid Compute).
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// ESM(.js) 확장자 필수 — Vercel 함수는 "type":"module" 로 실행됨.
import { PRO_PROJECT_BODIES } from "./_generated/proProjects.generated.js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? "";

interface EntitlementRow {
  entitlement: string;
  expires_at: string | null;
}

/** 해당 번들을 만료 전 상태로 보유 중인가 (content/access.ts isActive 와 동일). */
function hasActive(rows: EntitlementRow[], kind: string): boolean {
  return rows.some(
    (r) =>
      r.entitlement === kind &&
      (!r.expires_at || new Date(r.expires_at).getTime() > Date.now()),
  );
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const idParam = req.query.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  if (!id || typeof id !== "string") {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  // ─── 인증 ─────────────────────────────────────────────────
  const authHeader = req.headers["authorization"];
  const auth = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice("Bearer ".length);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[project-content] Supabase 환경변수 미설정");
    res.status(500).json({ error: "Server misconfigured" });
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    res.status(401).json({ error: "Invalid session" });
    return;
  }

  // ─── 본문 존재 확인 (무료/없는 id 는 서버 본문 대상 아님) ──
  const body = PRO_PROJECT_BODIES[id];
  if (!body) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  // ─── entitlement 조회 + 접근 판정 ─────────────────────────
  // RLS(read_own_entitlements)로 본인 행만 조회됨.
  const { data: rows, error: entErr } = await supabase
    .from("user_entitlements")
    .select("entitlement, expires_at")
    .eq("user_id", user.id);
  if (entErr) {
    console.error("[project-content] entitlement 조회 실패:", entErr.message);
    res.status(500).json({ error: "Entitlement lookup failed" });
    return;
  }

  const ents = (rows ?? []) as EntitlementRow[];
  const allowed =
    hasActive(ents, "admin") ||
    hasActive(ents, "all-pro") ||
    hasActive(ents, "projects-pro");
  if (!allowed) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.setHeader("Cache-Control", "private, max-age=300");
  res.status(200).json(body);
}

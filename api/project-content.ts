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
 * 필요한 Vercel 환경변수: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (이미 등록됨).
 * 런타임: Vercel Node.js (Fluid Compute).
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

import { PRO_PROJECT_BODIES } from "./_generated/proProjects.generated";
import { canAccessProject } from "../src/content/access";
import type { Entitlement } from "../src/types/entitlement";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? "";

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

  // 사용자 토큰으로 클라이언트 생성 — RLS(read_own_entitlements)가 적용된다.
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

  // ─── entitlement 조회 + 접근 판정 ─────────────────────────
  const { data: rows, error: entErr } = await supabase
    .from("user_entitlements")
    .select("*")
    .eq("user_id", user.id);
  if (entErr) {
    console.error("[project-content] entitlement 조회 실패:", entErr.message);
    res.status(500).json({ error: "Entitlement lookup failed" });
    return;
  }

  const entitlements = (rows ?? []) as Entitlement[];

  // 접근 규칙은 클라이언트와 동일한 access.ts 를 재사용(단일 소스).
  if (!canAccessProject(id, entitlements)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  // ─── 본문 반환 ────────────────────────────────────────────
  const body = PRO_PROJECT_BODIES[id];
  if (!body) {
    // 무료 프로젝트는 이미 클라이언트에 본문이 있으므로 요청 대상이 아님.
    res.status(404).json({ error: "Not found" });
    return;
  }

  // 짧은 private 캐시 — 같은 사용자 재진입 시 재요청 절감.
  res.setHeader("Cache-Control", "private, max-age=300");
  res.status(200).json(body);
}

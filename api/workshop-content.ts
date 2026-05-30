/**
 * Vercel Serverless Function — PRO 워크샵 본문(cells) 제공 (서버 게이팅, H1).
 *
 * 워크샵 본문(전체 cells)은 클라이언트 번들에서 분리되어 있다
 * (scripts/split-content.ts). 권한 있는 사용자가 LessonPage 진입 시에만
 * 인증 후 fetch 한다.
 *
 * 요청:  GET /api/workshop-content?id=<lessonId>
 *        Authorization: Bearer <supabase access_token>
 * 응답:  200 { cells } | 401 | 403 | 404
 *
 * 접근 규칙(content/access.ts canAccessWorkshop 와 동일): admin || all-pro.
 *   (워크샵은 projects-pro/python-advanced 로는 열리지 않음 — all-pro 전용.)
 *
 * ⚠️ self-contained 유지(../src import 금지) + 상대 import 는 .js 확장자 필수
 *   (함수는 "type":"module" 로 ESM 실행됨).
 *
 * 런타임: Vercel Node.js (Fluid Compute).
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

import { PRO_WORKSHOP_BODIES } from "./_generated/proWorkshops.generated.js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? "";

interface EntitlementRow {
  entitlement: string;
  expires_at: string | null;
}

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

  const authHeader = req.headers["authorization"];
  const auth = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice("Bearer ".length);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[workshop-content] Supabase 환경변수 미설정");
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

  const cells = PRO_WORKSHOP_BODIES[id];
  if (!cells) {
    // 무료 워크샵/없는 id 는 서버 본문 대상 아님(무료는 클라에 본문 있음).
    res.status(404).json({ error: "Not found" });
    return;
  }

  const { data: rows, error: entErr } = await supabase
    .from("user_entitlements")
    .select("entitlement, expires_at")
    .eq("user_id", user.id);
  if (entErr) {
    console.error("[workshop-content] entitlement 조회 실패:", entErr.message);
    res.status(500).json({ error: "Entitlement lookup failed" });
    return;
  }

  const ents = (rows ?? []) as EntitlementRow[];
  const allowed = hasActive(ents, "admin") || hasActive(ents, "all-pro");
  if (!allowed) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.setHeader("Cache-Control", "private, max-age=300");
  res.status(200).json({ cells });
}

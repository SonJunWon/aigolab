/**
 * Vercel Cron — Supabase 무료 플랜 자동 일시정지(7일 비활성) 방지.
 *
 * Supabase 무료 프로젝트는 7일간 요청이 없으면 paused 된다(DNS 까지 내려가
 * 앱 전체가 죽음). 이 함수가 매일 Supabase 에 실제 DB 쿼리를 1회 보내
 * "활성" 상태를 유지한다. (내부 pg_cron 은 일시정지 타이머를 리셋하지 못할 수
 * 있어, 외부에서의 실제 요청이 가장 확실하다.)
 *
 * 호출: Vercel Cron 이 vercel.json 의 schedule 에 따라 GET 으로 호출.
 *       CRON_SECRET 이 설정돼 있으면 Vercel 이 `Authorization: Bearer <CRON_SECRET>`
 *       헤더를 자동 첨부 → 여기서 검증해 외부 무단 호출을 차단.
 *
 * 사용 env (모두 이미 등록됨 / 신규는 CRON_SECRET 하나):
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, CRON_SECRET
 *
 * GitHub Actions 워크플로(.github/workflows/supabase-keepalive.yml)가 동일 목적의
 * 이중화 핑을 Vercel 과 독립적으로 보낸다.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? "";
const CRON_SECRET = process.env.CRON_SECRET ?? "";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  // CRON_SECRET 이 설정된 경우에만 인증 검증(설정 안 했으면 통과 — 점진 도입 허용).
  if (CRON_SECRET) {
    const authHeader = req.headers["authorization"];
    const auth = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (auth !== `Bearer ${CRON_SECRET}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[keep-alive] Supabase 환경변수 미설정");
    res.status(500).json({ error: "Server misconfigured" });
    return;
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // 실제 Postgres 쿼리 1회 — RLS 가 행을 걸러도 쿼리 자체는 DB 에서 실행되어
    // "활성"으로 집계된다. head:true 로 본문 없이 count 만(최소 트래픽).
    const { error } = await supabase
      .from("profiles")
      .select("user_id", { count: "exact", head: true });

    if (error) {
      // 쿼리가 DB 까지 도달했다면(에러여도) 활성 목적은 달성. 로그만 남김.
      console.warn("[keep-alive] 쿼리 경고:", error.message);
    }

    res.status(200).json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    console.error("[keep-alive] 실패:", err);
    res.status(500).json({ error: "Keep-alive failed" });
  }
}

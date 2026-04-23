/**
 * Vercel Serverless Function — 텔레그램 관리자 알림 프록시.
 *
 * 왜 서버로 옮겼나:
 *   기존 구현은 `VITE_TELEGRAM_BOT_TOKEN` 을 클라이언트 번들에 그대로
 *   주입 (Vite 의 VITE_* 접두사는 빌드 타임에 JS 에 박힘) → 누구나
 *   DevTools 로 봇 토큰을 추출 → 관리자 chat 스팸/피싱 가능.
 *
 * 이 파일로 이관하면:
 *   - 토큰/Chat ID 는 서버 환경변수로만 존재 (클라이언트 번들에서 제거)
 *   - 호출자는 Supabase JWT 로 인증된 사용자만 허용
 *   - 질문 길이/타입 검증으로 어뷰징 완화
 *
 * 필요한 Vercel 환경변수 (Dashboard → Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN     — BotFather 봇 토큰 (VITE_ 접두사 금지)
 *   TELEGRAM_CHAT_ID       — 관리자 chat ID
 *   VITE_SUPABASE_URL      — 이미 등록됨 (공유 가능)
 *   VITE_SUPABASE_ANON_KEY — 이미 등록됨 (공유 가능)
 *   VITE_APP_URL           — (옵션) 관리자 대시보드 링크 베이스
 *
 * 런타임: Vercel Node.js (Fluid Compute). req/res 는 Node 스타일.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? "";
const APP_URL = process.env.VITE_APP_URL ?? "https://aigolab.co.kr";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // ─── 인증 ─────────────────────────────────────────────────
  // Node 스타일: headers 는 소문자 키의 일반 객체
  const authHeader = req.headers["authorization"];
  const auth = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice("Bearer ".length);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[notify-admin] Supabase 환경변수 미설정");
    res.status(500).json({ error: "Server misconfigured" });
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    res.status(401).json({ error: "Invalid session" });
    return;
  }

  // ─── 입력 검증 ────────────────────────────────────────────
  // Vercel 은 Content-Type: application/json 이면 req.body 를 자동 파싱
  const body = req.body as { question?: unknown } | undefined;
  const question = body?.question;
  if (!question || typeof question !== "string") {
    res.status(400).json({ error: "Invalid question" });
    return;
  }
  if (question.length > 2000) {
    res.status(413).json({ error: "Question too long" });
    return;
  }

  // ─── 구성 검증 ────────────────────────────────────────────
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("[notify-admin] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 미설정");
    res.status(500).json({ error: "Not configured" });
    return;
  }

  // ─── 메시지 조립 + 발송 ───────────────────────────────────
  const message = [
    "📩 *새로운 문의가 도착했습니다*",
    "",
    `👤 *사용자:* ${escapeMarkdown(user.email ?? "알 수 없음")}`,
    `💬 *질문:* ${escapeMarkdown(question)}`,
    "",
    `🔗 [관리자 대시보드](${APP_URL}/admin)`,
  ].join("\n");

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      },
    );
    if (!tgRes.ok) {
      const respBody = await tgRes.text();
      console.error("[notify-admin] Telegram 실패:", tgRes.status, respBody);
      res.status(502).json({ error: "Telegram API error" });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[notify-admin] 네트워크 오류:", err);
    res.status(500).json({ error: "Internal error" });
  }
}

/** Telegram Markdown 특수문자 이스케이프 */
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

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
 */

import { createClient } from "@supabase/supabase-js";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? "";
const APP_URL = process.env.VITE_APP_URL ?? "https://aigolab.co.kr";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  // ─── 인증 ─────────────────────────────────────────────────
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = auth.slice("Bearer ".length);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[notify-admin] Supabase 환경변수 미설정");
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }

  // ─── 입력 검증 ────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const question =
    typeof body === "object" && body !== null && "question" in body
      ? (body as { question: unknown }).question
      : undefined;

  if (!question || typeof question !== "string") {
    return Response.json({ error: "Invalid question" }, { status: 400 });
  }
  if (question.length > 2000) {
    return Response.json({ error: "Question too long" }, { status: 413 });
  }

  // ─── 구성 검증 ────────────────────────────────────────────
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("[notify-admin] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 미설정");
    return Response.json({ error: "Not configured" }, { status: 500 });
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
      return Response.json({ error: "Telegram API error" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[notify-admin] 네트워크 오류:", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}

/** Telegram Markdown 특수문자 이스케이프 */
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

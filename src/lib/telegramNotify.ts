/**
 * 텔레그램 봇 알림 — 관리자에게 새 문의 도착 알림.
 *
 * 환경변수:
 *   VITE_TELEGRAM_BOT_TOKEN — BotFather에서 발급받은 봇 토큰
 *   VITE_TELEGRAM_CHAT_ID   — 관리자의 텔레그램 Chat ID
 *
 * 설정 방법:
 *   1. 텔레그램에서 @BotFather → /newbot → 봇 생성 → 토큰 복사
 *   2. 생성한 봇에게 아무 메시지 전송
 *   3. https://api.telegram.org/bot{토큰}/getUpdates 접속 → chat.id 확인
 *   4. .env.local에 추가:
 *      VITE_TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
 *      VITE_TELEGRAM_CHAT_ID=987654321
 */

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN ?? "";
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID ?? "";

/** 텔레그램 설정이 되어있는지 */
export function isTelegramConfigured(): boolean {
  return !!(BOT_TOKEN && CHAT_ID);
}

/** 관리자에게 텔레그램 메시지 발송 */
export async function sendTelegramNotification(params: {
  userEmail: string;
  question: string;
}): Promise<void> {
  if (!isTelegramConfigured()) {
    console.warn("[telegram] 봇 토큰 또는 Chat ID가 설정되지 않았습니다.");
    return;
  }

  const message = [
    "📩 *새로운 문의가 도착했습니다*",
    "",
    `👤 *사용자:* ${escapeMarkdown(params.userEmail)}`,
    `💬 *질문:* ${escapeMarkdown(params.question)}`,
    "",
    `🔗 [관리자 대시보드에서 확인](${import.meta.env.VITE_APP_URL ?? "https://aigolab.vercel.app"}/admin)`,
  ].join("\n");

  try {
    const res = await fetch(
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
      }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("[telegram] 발송 실패:", body);
    }
  } catch (err) {
    console.error("[telegram] 네트워크 오류:", err);
  }
}

/** Markdown 특수문자 이스케이프 */
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

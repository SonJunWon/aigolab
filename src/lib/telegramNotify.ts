/**
 * 텔레그램 봇 알림 — Vercel Function 경유.
 *
 * 봇 토큰은 더 이상 클라이언트 번들에 포함되지 않음.
 * 서버(`/api/notify-admin`)가 Supabase JWT 로 호출자를 검증한 뒤
 * 서버 환경변수 `TELEGRAM_BOT_TOKEN` 으로 텔레그램 API 를 호출한다.
 *
 * 이전 구현은 `VITE_TELEGRAM_BOT_TOKEN` 이 클라이언트 번들에 노출돼
 * DevTools 로 누구나 추출 가능했음 → 서버 이관으로 차단.
 */

import { supabase } from "./supabase";

/** 관리자에게 텔레그램 메시지 발송 (서버 프록시 경유) */
export async function sendTelegramNotification(params: {
  question: string;
}): Promise<void> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      console.warn("[telegram] 로그인 세션 없음 — 발송 생략");
      return;
    }

    const res = await fetch("/api/notify-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ question: params.question }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error("[telegram] 발송 실패:", res.status, body);
    }
  } catch (err) {
    console.error("[telegram] 네트워크 오류:", err);
  }
}

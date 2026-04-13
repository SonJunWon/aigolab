import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { addStudySeconds } from "../storage/supabaseActivityRepo";

/**
 * 학습 시간 추적 훅.
 *
 * 동작:
 * - 컴포넌트 마운트 시 타이머 시작
 * - 탭이 숨김 상태(visibilitychange)면 일시정지
 * - 30초마다 쌓인 시간 Supabase에 flush
 * - 언마운트/beforeunload 시 남은 시간 flush
 *
 * 비로그인 상태에서는 no-op.
 */
const FLUSH_INTERVAL_MS = 30_000; // 30초
const MIN_FLUSH_SECONDS = 5;       // 5초 미만이면 flush 스킵 (깜빡 진입 무시)

export function useStudyTimeTracking(enabled = true) {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? null;

  /** 현재 세션이 돌고 있는 구간의 시작 ms (탭 숨김 시 null) */
  const runStartRef = useRef<number | null>(null);
  /** 아직 서버로 보내지 않고 쌓여있는 초 */
  const bufferedRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !userId) return;

    const startRun = () => {
      if (runStartRef.current === null) {
        runStartRef.current = Date.now();
      }
    };

    const stopRun = () => {
      if (runStartRef.current !== null) {
        const elapsed = Math.floor((Date.now() - runStartRef.current) / 1000);
        if (elapsed > 0) bufferedRef.current += elapsed;
        runStartRef.current = null;
      }
    };

    const flush = async (final = false) => {
      stopRun();
      const toSend = bufferedRef.current;
      if (toSend < (final ? 1 : MIN_FLUSH_SECONDS)) {
        if (!final) return; // 아주 짧으면 스킵, 단 final이면 강제 flush
      }
      if (toSend <= 0) {
        if (!final) startRun();
        return;
      }
      bufferedRef.current = 0;
      try {
        await addStudySeconds(userId, toSend);
      } catch (e) {
        // 실패 시 버퍼 되돌리기 (재시도 기회)
        bufferedRef.current += toSend;
        console.error("[study-time] flush failed:", e);
      }
      if (!final) startRun();
    };

    // 탭 가시성 이벤트
    const onVisibility = () => {
      if (document.hidden) {
        stopRun();
      } else {
        startRun();
      }
    };

    // 페이지 이탈 시 flush (sendBeacon은 Supabase SDK가 지원 안 해서 일반 fetch 사용)
    const onBeforeUnload = () => {
      // 동기 flush는 어려우니 최대한 빨리 보내고 완료는 보장 못함
      void flush(true);
    };

    // 초기 시작
    if (!document.hidden) startRun();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);

    const interval = setInterval(() => {
      void flush(false);
    }, FLUSH_INTERVAL_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
      clearInterval(interval);
      // 언마운트 — 남은 시간 최종 flush
      void flush(true);
    };
  }, [enabled, userId]);
}

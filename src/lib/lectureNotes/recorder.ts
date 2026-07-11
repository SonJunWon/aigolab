/**
 * 강의 정리 — 녹음기.
 *
 * 설계 (기획 3-1):
 *   - MediaRecorder, opus 32kbps mono (음성 최적, 분당 ~240KB)
 *   - 5분마다 recorder 를 재시작해 "완결형 webm 청크" 생성 → IndexedDB 즉시 저장
 *     (timeslice 방식은 2번째 청크부터 컨테이너 헤더가 없어 STT 업로드 불가 — 재시작 방식 채택)
 *   - Wake Lock 으로 화면 잠금 방지 (지원 브라우저 한정, 실패해도 녹음은 계속)
 */

import { putChunk } from "./db";

const CHUNK_SEC = 300; // 5분
const MIME = "audio/webm;codecs=opus";

export interface RecorderHandle {
  sessionId: string;
  /** 세션 시작 기준 경과(초) */
  elapsedSec: () => number;
  /** 현재 시점을 북마크로 마킹 */
  bookmark: () => void;
  bookmarks: () => number[];
  /** 종료 — 마지막 청크 저장까지 마친 뒤 resolve */
  stop: () => Promise<{ durationSec: number; bookmarks: number[] }>;
}

export async function startRecording(): Promise<RecorderHandle> {
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported(MIME)) {
    throw new Error("이 브라우저는 녹음(webm/opus)을 지원하지 않습니다. 데스크톱 Chrome/Edge를 사용해주세요.");
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: false, noiseSuppression: true },
  });

  const sessionId = `rec-${Date.now()}`;
  const startedAt = Date.now();
  const marks: number[] = [];
  let seq = 0;
  let chunkStartedAt = Date.now();
  let stopped = false;
  let current: MediaRecorder | null = null;
  let rotateTimer: ReturnType<typeof setTimeout> | null = null;
  const pendingSaves: Promise<unknown>[] = [];

  // 화면 잠금 방지 — 미지원/거부여도 무시하고 진행
  let wakeLock: { release: () => Promise<void> } | null = null;
  try {
    wakeLock = await (navigator as unknown as {
      wakeLock?: { request: (t: string) => Promise<{ release: () => Promise<void> }> };
    }).wakeLock?.request("screen") ?? null;
  } catch { /* 무시 */ }

  /** 완결형 청크 하나를 녹음하는 recorder 를 시작 */
  function startChunkRecorder() {
    chunkStartedAt = Date.now();
    const rec = new MediaRecorder(stream, { mimeType: MIME, audioBitsPerSecond: 32_000 });
    const parts: Blob[] = [];
    rec.ondataavailable = (e) => { if (e.data.size > 0) parts.push(e.data); };
    rec.onstop = () => {
      const durationSec = Math.round((Date.now() - chunkStartedAt) / 1000);
      if (!parts.length || durationSec < 1) return;
      const mySeq = seq++;
      pendingSaves.push(
        putChunk({
          key: `${sessionId}:${mySeq}`,
          sessionId,
          seq: mySeq,
          blob: new Blob(parts, { type: MIME }),
          startSec: mySeq * CHUNK_SEC,
          durationSec,
        }),
      );
      // 회전 중이면 다음 청크 recorder 를 즉시 시작
      if (!stopped) startChunkRecorder();
    };
    rec.start(); // timeslice 없이 — stop 시 한 덩어리(완결형)로 수거
    current = rec;
    rotateTimer = setTimeout(() => { if (!stopped && rec.state === "recording") rec.stop(); }, CHUNK_SEC * 1000);
  }

  startChunkRecorder();

  return {
    sessionId,
    elapsedSec: () => Math.round((Date.now() - startedAt) / 1000),
    bookmark: () => { marks.push(Math.round((Date.now() - startedAt) / 1000)); },
    bookmarks: () => [...marks],
    stop: async () => {
      stopped = true;
      if (rotateTimer) clearTimeout(rotateTimer);
      if (current && current.state === "recording") {
        await new Promise<void>((resolve) => {
          const rec = current!;
          const prev = rec.onstop as ((this: MediaRecorder, ev: Event) => void) | null;
          rec.onstop = function (ev: Event) { prev?.call(this, ev); resolve(); };
          rec.stop();
        });
      }
      stream.getTracks().forEach((t) => t.stop());
      await Promise.all(pendingSaves);
      await wakeLock?.release().catch(() => undefined);
      return { durationSec: Math.round((Date.now() - startedAt) / 1000), bookmarks: [...marks] };
    },
  };
}

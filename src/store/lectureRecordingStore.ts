/**
 * 강의 녹음 세션 스토어 — 전역 싱글턴.
 *
 * 녹음 상태(RecorderHandle·라이브 구간 노트·종료 파이프라인)를 컴포넌트가 아니라
 * 여기에 두는 이유: 관리자 탭 전환·다른 페이지 이동으로 AdminLectureNotes 가
 * 언마운트되어도 **녹음과 라이브 STT 파이프라인이 끊기지 않고**, 돌아오면
 * 화면이 그대로 복원되어야 하기 때문 (SPA 내 이동 한정 — 새로고침은 브라우저 한계).
 *
 * beforeunload 경고도 컴포넌트가 아닌 여기서 녹음 수명주기에 맞춰 등록/해제한다.
 */

import { create } from "zustand";
import {
  startRecording,
  transcribeChunkBlob,
  transcribeSession,
  quickChunkSummary,
  summarizeTranscript,
  saveNote,
  deleteSessionChunks,
  type RecorderHandle,
  type RecordingChunk,
  type LectureNote,
} from "../lib/lectureNotes";

export interface LiveChunk {
  seq: number;
  startSec: number;
  status: "stt" | "summarizing" | "done" | "error";
  transcript?: string;
  bullets?: string[];
  error?: string;
}

export type FinishStage =
  | { stage: "idle" }
  | { stage: "waiting-chunks" }
  | { stage: "transcribing"; done: number; total: number } // 폴백 경로(라이브 전멸 시)
  | { stage: "summarizing" }
  | { stage: "saving" }
  | { stage: "error"; message: string };

interface LectureRecordingState {
  /** idle=녹음 없음 / recording=녹음 중 / finishing=종료 파이프라인 진행 중 */
  status: "idle" | "recording" | "finishing";
  handle: RecorderHandle | null;
  title: string;
  source: string;
  keepAudio: boolean;
  /** 소속 강의 (녹음 시작 폼에서 선택) — null = 미분류 */
  lectureId: string | null;
  /** 회차 라벨 — 자유 텍스트 */
  sessionLabel: string;
  live: LiveChunk[];
  markCount: number;
  finishStage: FinishStage;
  /** finish 성공 시 채워짐 — UI가 상세로 이동한 뒤 reset() */
  finishedNoteId: string | null;

  setMeta: (
    meta: Partial<Pick<LectureRecordingState, "title" | "source" | "keepAudio" | "lectureId" | "sessionLabel">>,
  ) => void;
  start: () => Promise<void>;
  bookmark: () => void;
  finish: () => Promise<void>;
  /** 에러/완료 후 idle 로 복귀 (녹음 중에는 호출 금지) */
  reset: () => void;
}

const fmtClock = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

// 청크 라이브 처리 직렬 큐 — 스토어 외부 모듈 변수 (상태 아님)
let queue: Promise<void> = Promise.resolve();

const warnBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); };

export const useLectureRecordingStore = create<LectureRecordingState>((set, get) => {
  const patchLive = (seq: number, patch: Partial<LiveChunk>) =>
    set((s) => ({ live: s.live.map((c) => (c.seq === seq ? { ...c, ...patch } : c)) }));

  /** 청크 도착 → 직렬 큐에서 STT → 구간 요약 → 라이브 목록 갱신 */
  const handleChunk = (chunk: RecordingChunk) => {
    set((s) => ({ live: [...s.live, { seq: chunk.seq, startSec: chunk.startSec, status: "stt" }] }));
    queue = queue.then(async () => {
      try {
        const transcript = await transcribeChunkBlob(chunk.blob);
        patchLive(chunk.seq, { status: "summarizing", transcript });
        try {
          const bullets = await quickChunkSummary(transcript);
          patchLive(chunk.seq, { status: "done", bullets });
        } catch {
          patchLive(chunk.seq, { status: "done", bullets: undefined }); // 요약 실패는 비치명 — 전사로 진행
        }
      } catch (e) {
        patchLive(chunk.seq, { status: "error", error: e instanceof Error ? e.message : "STT 실패" });
      }
    });
  };

  return {
    status: "idle",
    handle: null,
    title: "",
    source: "",
    keepAudio: false,
    lectureId: null,
    sessionLabel: "",
    live: [],
    markCount: 0,
    finishStage: { stage: "idle" },
    finishedNoteId: null,

    setMeta: (meta) => set(meta),

    start: async () => {
      if (get().status !== "idle") return; // 동시 녹음 방지
      queue = Promise.resolve();
      set({ live: [], markCount: 0, finishStage: { stage: "idle" }, finishedNoteId: null });
      const handle = await startRecording({ onChunk: handleChunk }); // 실패 시 throw — UI가 잡아 표시
      window.addEventListener("beforeunload", warnBeforeUnload);
      set({ status: "recording", handle });
    },

    bookmark: () => {
      const { handle } = get();
      if (!handle) return;
      handle.bookmark();
      set((s) => ({ markCount: s.markCount + 1 }));
    },

    finish: async () => {
      const { handle, title, source, keepAudio, lectureId, sessionLabel } = get();
      if (!handle || get().status !== "recording") return;
      set({ status: "finishing" });
      try {
        const { durationSec, bookmarks } = await handle.stop(); // 마지막 청크 onChunk까지 발화됨
        set({ finishStage: { stage: "waiting-chunks" } });
        await queue; // 라이브 큐 드레인

        // 전사 조립 — 라이브 결과 재사용, 라이브 전멸 시 일괄 변환 폴백
        const chunksState = [...get().live].sort((a, b) => a.seq - b.seq);
        let transcript: string;
        const allFailed = chunksState.length > 0 && chunksState.every((c) => c.status === "error");
        if (allFailed || chunksState.length === 0) {
          set({ finishStage: { stage: "transcribing", done: 0, total: 1 } });
          transcript = await transcribeSession(handle.sessionId, (done, total) =>
            set({ finishStage: { stage: "transcribing", done, total } }),
          );
        } else {
          transcript = chunksState
            .map((c) =>
              c.transcript
                ? `[${fmtClock(c.startSec)}] ${c.transcript}`
                : `[${fmtClock(c.startSec)}] (이 구간 변환 실패: ${c.error ?? "unknown"})`,
            )
            .join("\n\n");
        }

        // 정리 실패해도 전사는 살린다
        set({ finishStage: { stage: "summarizing" } });
        let summary: LectureNote["summary"] = null;
        try {
          summary = await summarizeTranscript(transcript, bookmarks);
        } catch { /* summary=null 저장 → 상세에서 재시도 */ }

        set({ finishStage: { stage: "saving" } });
        const note: LectureNote = {
          id: handle.sessionId,
          title: title.trim() || sessionLabel.trim() || summary?.title || `강의 노트 ${new Date().toLocaleDateString("ko-KR")}`,
          source: source.trim(),
          recordedAt: new Date().toISOString(),
          durationSec,
          transcript,
          summary,
          bookmarks,
          tags: [],
          keepAudio,
          lectureId,
          sessionLabel: sessionLabel.trim() || undefined,
        };
        await saveNote(note);
        if (!keepAudio) await deleteSessionChunks(handle.sessionId); // 원본 기본 폐기
        window.removeEventListener("beforeunload", warnBeforeUnload);
        set({ finishedNoteId: note.id, handle: null });
      } catch (e) {
        window.removeEventListener("beforeunload", warnBeforeUnload);
        set({
          status: "idle",
          handle: null,
          finishStage: { stage: "error", message: e instanceof Error ? e.message : "파이프라인 실패" },
        });
      }
    },

    reset: () => {
      if (get().status === "recording") return; // 녹음 중 초기화 금지
      window.removeEventListener("beforeunload", warnBeforeUnload);
      set({
        status: "idle",
        handle: null,
        title: "",
        source: "",
        keepAudio: false,
        lectureId: null,
        sessionLabel: "",
        live: [],
        markCount: 0,
        finishStage: { stage: "idle" },
        finishedNoteId: null,
      });
    },
  };
});

/** 컴포넌트 밖(예: AdminPage 초기 탭 결정)에서 간단 조회용 */
export function isLectureRecordingActive(): boolean {
  return useLectureRecordingStore.getState().status !== "idle";
}

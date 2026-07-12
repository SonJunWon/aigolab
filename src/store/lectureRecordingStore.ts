/**
 * 강의 녹음 세션 스토어 — 전역 싱글턴.
 *
 * 녹음 상태(RecorderHandle·라이브 구간 노트·종료 파이프라인)를 컴포넌트가 아니라
 * 여기에 두는 이유: 관리자 탭 전환·다른 페이지 이동으로 AdminLectureNotes 가
 * 언마운트되어도 **녹음과 라이브 STT 파이프라인이 끊기지 않고**, 돌아오면
 * 화면이 그대로 복원되어야 하기 때문 (SPA 내 이동 한정 — 새로고침은 브라우저 한계).
 *
 * beforeunload 경고도 컴포넌트가 아닌 여기서 녹음 수명주기에 맞춰 등록/해제한다.
 *
 * 예약 녹음: scheduledAt 도달 시 타이머가 start() 를 자동 호출한다.
 * 예약은 localStorage 에 저장되어 새로고침 후 이 모듈이 다시 로드되면(관리자 페이지 방문) 복원된다.
 * 단, 탭이 닫혀 있거나 기기가 잠자기 상태면 실행되지 않는다 — 유예(10분) 지난 예약은 자동 취소.
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
  /** 예약 녹음 — 자동 시작 시각(epoch ms), null=예약 없음 */
  scheduledAt: number | null;
  /** 예약 시작 실패/취소 사유 (UI 표시용) */
  scheduleError: string | null;

  setMeta: (
    meta: Partial<Pick<LectureRecordingState, "title" | "source" | "keepAudio" | "lectureId" | "sessionLabel">>,
  ) => void;
  start: () => Promise<void>;
  /** 예약 등록 — 마이크 권한을 미리 확보한다 (거부/미지원 시 throw, 예약 안 됨) */
  schedule: (at: number) => Promise<void>;
  cancelSchedule: () => void;
  bookmark: () => void;
  finish: () => Promise<void>;
  /** 에러/완료 후 idle 로 복귀 (녹음 중에는 호출 금지) */
  reset: () => void;
}

const fmtClock = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

// 청크 라이브 처리 직렬 큐 — 스토어 외부 모듈 변수 (상태 아님)
let queue: Promise<void> = Promise.resolve();

const warnBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); };

// ── 예약 녹음 타이머 ──
// 백그라운드 탭은 타이머가 분 단위로 스로틀될 수 있어 긴 setTimeout 대신 5초 주기 검사.
const SCHEDULE_KEY = "aigolab-lecture-rec-schedule";
const SCHEDULE_GRACE_MS = 10 * 60 * 1000; // 이만큼 지난 예약은 뒤늦게 시작하지 않고 취소
let scheduleTimer: ReturnType<typeof setInterval> | null = null;

function armScheduleTimer() {
  if (!scheduleTimer) scheduleTimer = setInterval(checkSchedule, 5_000);
}

function disarmScheduleTimer() {
  if (scheduleTimer) { clearInterval(scheduleTimer); scheduleTimer = null; }
}

function checkSchedule() {
  const s = useLectureRecordingStore.getState();
  if (s.scheduledAt == null) { disarmScheduleTimer(); return; }
  const now = Date.now();
  if (now < s.scheduledAt) return;

  // 도달 — 예약은 1회성이므로 결과와 무관하게 소거
  disarmScheduleTimer();
  localStorage.removeItem(SCHEDULE_KEY);

  if (now - s.scheduledAt > SCHEDULE_GRACE_MS) {
    // 탭 잠자기 등으로 크게 지나침 — 한참 뒤 마이크가 켜지는 것보다 취소가 안전
    useLectureRecordingStore.setState({
      scheduledAt: null,
      scheduleError: `예약 시각(${new Date(s.scheduledAt).toLocaleTimeString("ko-KR")})을 지나쳐 자동 시작을 취소했습니다.`,
    });
    return;
  }
  useLectureRecordingStore.setState({ scheduledAt: null });
  if (s.status !== "idle") return; // 이미 수동으로 녹음 중
  s.start().catch((e) => {
    useLectureRecordingStore.setState({
      scheduleError: `예약 자동 시작 실패: ${e instanceof Error ? e.message : "마이크 접근 실패"}`,
    });
  });
}

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
    keepAudio: true,
    lectureId: null,
    sessionLabel: "",
    live: [],
    markCount: 0,
    finishStage: { stage: "idle" },
    finishedNoteId: null,
    scheduledAt: null,
    scheduleError: null,

    setMeta: (meta) => set(meta),

    start: async () => {
      if (get().status !== "idle") return; // 동시 녹음 방지
      // 수동 시작이 대기 중 예약을 소비한다 (이중 시작 방지)
      disarmScheduleTimer();
      localStorage.removeItem(SCHEDULE_KEY);
      queue = Promise.resolve();
      set({ live: [], markCount: 0, finishStage: { stage: "idle" }, finishedNoteId: null, scheduledAt: null, scheduleError: null });
      const handle = await startRecording({ onChunk: handleChunk }); // 실패 시 throw — UI가 잡아 표시
      window.addEventListener("beforeunload", warnBeforeUnload);
      set({ status: "recording", handle });
    },

    schedule: async (at) => {
      if (get().status !== "idle") return;
      if (at <= Date.now()) throw new Error("예약 시각이 이미 지났습니다.");
      // 마이크 권한 선확보 — 시작 시각에 권한 프롬프트로 멈추지 않게 지금 요청하고 바로 해제
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      const { title, source, keepAudio, lectureId, sessionLabel } = get();
      localStorage.setItem(SCHEDULE_KEY, JSON.stringify({ at, title, source, keepAudio, lectureId, sessionLabel }));
      set({ scheduledAt: at, scheduleError: null });
      armScheduleTimer();
    },

    cancelSchedule: () => {
      disarmScheduleTimer();
      localStorage.removeItem(SCHEDULE_KEY);
      set({ scheduledAt: null, scheduleError: null });
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
        keepAudio: true,
        lectureId: null,
        sessionLabel: "",
        live: [],
        markCount: 0,
        finishStage: { stage: "idle" },
        finishedNoteId: null,
        scheduleError: null,
      });
    },
  };
});

// 모듈 로드 시 저장된 예약 복원 — 새로고침 후 관리자 페이지를 다시 열면 되살아난다.
// 유예를 크게 지난(탭을 오래 닫아둔) 예약은 조용히 폐기.
try {
  const raw = localStorage.getItem(SCHEDULE_KEY);
  if (raw) {
    const saved = JSON.parse(raw) as {
      at: number; title?: string; source?: string; keepAudio?: boolean;
      lectureId?: string | null; sessionLabel?: string;
    };
    if (typeof saved.at === "number" && saved.at > Date.now() - SCHEDULE_GRACE_MS) {
      useLectureRecordingStore.setState({
        scheduledAt: saved.at,
        title: saved.title ?? "",
        source: saved.source ?? "",
        keepAudio: saved.keepAudio ?? true,
        lectureId: saved.lectureId ?? null,
        sessionLabel: saved.sessionLabel ?? "",
      });
      armScheduleTimer(); // 이미 지난 예약(유예 내)은 다음 틱(≤5초)에 바로 시작
    } else {
      localStorage.removeItem(SCHEDULE_KEY);
    }
  }
} catch {
  localStorage.removeItem(SCHEDULE_KEY);
}

/** 컴포넌트 밖(예: AdminPage 초기 탭 결정)에서 간단 조회용 */
export function isLectureRecordingActive(): boolean {
  return useLectureRecordingStore.getState().status !== "idle";
}

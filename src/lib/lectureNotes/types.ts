/**
 * 관리자 강의 정리 프로그램 — 도메인 타입.
 * 기획: AI앱개발/관리자-강의정리/01-강의정리-프로그램-기획.md
 */

/** 녹음 세션 중 IndexedDB에 저장되는 오디오 청크 (5분 단위 완결형 webm) */
export interface RecordingChunk {
  /** `${sessionId}:${seq}` — IDB keyPath */
  key: string;
  sessionId: string;
  seq: number;
  blob: Blob;
  /** 세션 시작 기준 이 청크의 시작 오프셋(초) */
  startSec: number;
  durationSec: number;
}

/** AI 정리본 — chat() responseSchema 와 1:1 */
export interface LectureSummary {
  title: string;
  oneLiner: string;
  keyConcepts: { name: string; explanation: string; example?: string }[];
  outline: { time: string; heading: string; summary: string }[];
  terms: { term: string; definition: string }[];
  actionItems: string[];
  quotes: string[];
  myBookmarks: string[];
}

/** 저장되는 강의 노트 1건 */
export interface LectureNote {
  id: string;
  title: string;
  /** 강의명/플랫폼/강사 등 출처 메모 */
  source: string;
  recordedAt: string; // ISO
  durationSec: number;
  /** [mm:ss] 타임스탬프가 섞인 원문 전사 */
  transcript: string;
  summary: LectureSummary | null;
  /** 녹음 중 북마크 시점(초) */
  bookmarks: number[];
  tags: string[];
  /** 오디오 원본 보관 여부 (기본 false — 정리 후 폐기) */
  keepAudio: boolean;
  /** 마지막 수정 시각 (ISO) — 로컬↔클라우드 last-write-wins 병합 기준. P1 노트에는 없을 수 있음 */
  updatedAt?: string;
}

/** 파이프라인 진행 상태 (UI 표시용) */
export type PipelineStage =
  | { stage: "idle" }
  | { stage: "transcribing"; done: number; total: number }
  | { stage: "summarizing" }
  | { stage: "saving" }
  | { stage: "error"; message: string };

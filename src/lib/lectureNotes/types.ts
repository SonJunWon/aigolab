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

/**
 * 강의(총괄) — 세션 노트들을 묶는 상위 단위 (v2 재편, 기획 02).
 * 강연자는 단순 문자열(복수면 쉼표), 회차 라벨은 노트 쪽 자유 텍스트.
 */
export interface Lecture {
  id: string;                 // "lec-{ts}"
  title: string;              // 총괄 강의 제목
  speaker: string;            // 강연자
  description: string;
  tags: string[];
  /** 통합 정리본 — 세션 정리본들의 재종합 (M2). null = 미생성 */
  overview: LectureSummary | null;
  /** 통합 정리본 생성 시각 — 이후 세션 변경 감지(오래됨 배지)용 */
  overviewAt?: string;
  createdAt: string;
  updatedAt: string;
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
  /** 오디오 원본 보관 여부 (기본 true — 노트에서 다시 듣기. 해제 시 정리 후 폐기) */
  keepAudio: boolean;
  /** 마지막 수정 시각 (ISO) — 로컬↔클라우드 last-write-wins 병합 기준. P1 노트에는 없을 수 있음 */
  updatedAt?: string;
  /** 소속 강의 id — null/undefined = 미분류 (하위 호환: 기존 노트는 전부 미분류) */
  lectureId?: string | null;
  /** 회차 라벨 — 자유 텍스트 (예: "1회차", "2일차 오전") */
  sessionLabel?: string;
}

/** 강의 자료 — 파일/링크/메모 (M2). Blob 본체는 IDB materials 스토어의 blob 필드에 */
export interface Material {
  id: string;                 // "mat-{ts}"
  lectureId: string;
  kind: "file" | "link" | "memo";
  name: string;
  url?: string;
  mime?: string;
  size?: number;
  memo?: string;
  blob?: Blob;
  addedAt: string;
}

/** 파이프라인 진행 상태 (UI 표시용) */
export type PipelineStage =
  | { stage: "idle" }
  | { stage: "transcribing"; done: number; total: number }
  | { stage: "summarizing" }
  | { stage: "saving" }
  | { stage: "error"; message: string };

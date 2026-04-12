import { create } from "zustand";

/**
 * 노트북 자동 저장의 실시간 상태.
 *
 * LessonPage 헤더의 저장 dot이 이걸 구독해서 시각적으로 표시.
 * useAutoSave 훅이 쓰고, UI가 읽음.
 */

export type SaveStatus =
  | "idle"        // 아직 저장할 것 없음 (로딩 직후)
  | "dirty"       // 수정됐지만 아직 저장 전 (debounce 대기 중)
  | "saving"      // IndexedDB 쓰기 진행 중
  | "saved"       // 성공적으로 저장됨
  | "error";      // 저장 실패

interface AutoSaveState {
  status: SaveStatus;
  lastSavedAt: number | null;
  errorMessage: string | null;
  setStatus: (status: SaveStatus, err?: string) => void;
}

export const useAutoSaveStore = create<AutoSaveState>((set) => ({
  status: "idle",
  lastSavedAt: null,
  errorMessage: null,
  setStatus: (status, err) =>
    set({
      status,
      lastSavedAt: status === "saved" ? Date.now() : null,
      errorMessage: status === "error" ? err ?? "알 수 없는 에러" : null,
    }),
}));

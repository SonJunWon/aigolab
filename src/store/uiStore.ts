import { create } from "zustand";

/**
 * 전역 UI 상태 (모달, 오버레이 등).
 * 개별 기능별 store 와 분리해서 cross-cutting UI 만 다룬다.
 */

interface UIState {
  /** 단축키 도움말 모달 */
  shortcutsHelpOpen: boolean;
  openShortcutsHelp: () => void;
  closeShortcutsHelp: () => void;
  toggleShortcutsHelp: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  shortcutsHelpOpen: false,
  openShortcutsHelp: () => set({ shortcutsHelpOpen: true }),
  closeShortcutsHelp: () => set({ shortcutsHelpOpen: false }),
  toggleShortcutsHelp: () =>
    set((state) => ({ shortcutsHelpOpen: !state.shortcutsHelpOpen })),
}));

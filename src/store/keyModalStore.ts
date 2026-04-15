/**
 * KeySetupModal 전역 제어 스토어.
 *
 * 두 가지 진입점:
 *   1. 사용자가 LessonPage 헤더의 🔑 버튼 클릭 → `open()`
 *   2. `chat()` 호출 실패 시 `runCell` 의 catch 가 `openForMissingKey(provider)` 호출
 *
 * 모달 자체는 App.tsx 에 한 번 마운트되고 이 스토어를 구독.
 */

import { create } from "zustand";

type Provider = "gemini" | "groq";

interface KeyModalState {
  isOpen: boolean;
  initialProvider?: Provider;

  /** 명시적으로 특정 provider 단계부터 열기 (옵션) */
  open: (initialProvider?: Provider) => void;
  /** chat() 실패로 열기 — provider 가 Gemini/Groq 이 아니면 아무 일도 안 함 */
  openForMissingKey: (provider: string | undefined) => void;
  close: () => void;
}

export const useKeyModalStore = create<KeyModalState>((set) => ({
  isOpen: false,
  initialProvider: undefined,

  open: (initialProvider) => set({ isOpen: true, initialProvider }),

  openForMissingKey: (provider) => {
    if (provider !== "gemini" && provider !== "groq") return;
    set({ isOpen: true, initialProvider: provider });
  },

  close: () => set({ isOpen: false }),
}));

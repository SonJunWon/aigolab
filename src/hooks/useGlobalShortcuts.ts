import { useEffect } from "react";
import { useUIStore } from "../store/uiStore";

/**
 * 앱 전체에서 작동해야 하는 단축키.
 * App.tsx (BrowserRouter 안쪽) 에서 한 번 호출.
 *
 * 현재 지원:
 *   ?  : 단축키 도움말 토글 (에디터/입력 필드 바깥에서만)
 */
export function useGlobalShortcuts() {
  useEffect(() => {
    const isInEditor = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.closest(".monaco-editor")) return true;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") return true;
      if (target.isContentEditable) return true;
      return false;
    };

    const handler = (e: KeyboardEvent) => {
      // ? 키 (Shift+/) — 단축키 도움말 토글
      if (
        e.key === "?" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !isInEditor(e.target)
      ) {
        e.preventDefault();
        useUIStore.getState().toggleShortcutsHelp();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}

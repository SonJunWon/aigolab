import { useEffect } from "react";
import { useNotebookStore } from "../store/notebookStore";
import { runCell } from "../runtime/runCell";
import {
  activateCommandMode,
  deactivateCommandMode,
  isCommandModeActive,
  isPendingDelete,
  markPendingDelete,
} from "../runtime/commandMode";

/**
 * Colab 스타일 글로벌 단축키.
 *
 * Command mode 진입:
 *   - `Esc`     (Jupyter / Colab 호환, 가장 안정적)
 *   - `Ctrl+M`  (Colab 호환, 일부 OS/브라우저에서 가로채질 수 있음)
 *
 * Command mode 안에서:
 *   - B    아래에 코드 셀 추가
 *   - A    위에 코드 셀 추가
 *   - M    마크다운 셀로 변환
 *   - Y    코드 셀로 변환
 *   - D D  셀 삭제 (D 두 번)
 *
 * Edit mode 단축키 (Monaco 에디터 안):
 *   - Cmd/Ctrl + Enter  실행
 *   - Shift + Enter     실행 + 다음 셀
 *   - Alt + Enter       실행 + 새 셀
 *   - Esc               command mode 진입 (Monaco editor의 addAction에서 처리)
 *
 * 셀 외부 (이미 command mode 거나 빈 영역에 포커스):
 *   - 화살표              셀 간 이동
 *   - Enter             선택된 셀의 에디터로 진입
 */

// 디버그용: window.__notebookDebug = true 로 켜면 콘솔에 상세 로그
const debug = (...args: unknown[]) => {
  if ((window as unknown as { __notebookDebug?: boolean }).__notebookDebug) {
    console.log("[shortcuts]", ...args);
  }
};

export function useNotebookShortcuts() {
  useEffect(() => {
    const isInEditor = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.closest(".monaco-editor")) return true;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") return true;
      if (target.isContentEditable) return true;
      return false;
    };

    const handler = (e: KeyboardEvent) => {
      try {
        const store = useNotebookStore.getState();
        const inEditor = isInEditor(e.target);

        debug("keydown", {
          key: e.key,
          ctrl: e.ctrlKey,
          meta: e.metaKey,
          shift: e.shiftKey,
          alt: e.altKey,
          inEditor,
          commandMode: isCommandModeActive(),
        });

        // ? 키 처리는 useGlobalShortcuts(App 레벨)에서 담당

        // ─────────────────────────────────────────────
        // Command mode 진입: Esc 또는 Ctrl+M
        // ─────────────────────────────────────────────
        if (
          !inEditor && // 에디터 안에서의 Esc는 Monaco의 addAction이 처리
          e.key === "Escape" &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey
        ) {
          e.preventDefault();
          activateCommandMode();
          debug("command mode ON (via Esc)");
          return;
        }

        if (
          e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey &&
          !e.altKey &&
          e.key.toLowerCase() === "m"
        ) {
          e.preventDefault();
          activateCommandMode();
          debug("command mode ON (via Ctrl+M)");
          return;
        }

        // ─────────────────────────────────────────────
        // Command mode 안에서 단일 키 처리
        // ─────────────────────────────────────────────
        if (isCommandModeActive()) {
          // 수식 키가 있는 경우 무시 (예: Cmd+B는 브라우저 단축키)
          if (e.metaKey || e.ctrlKey || e.altKey) {
            return;
          }

          const k = e.key.toLowerCase();
          if (k.length !== 1 && k !== "escape") return;

          if (!store.selectedCellId) {
            deactivateCommandMode();
            return;
          }

          e.preventDefault();
          debug("command key:", k);

          switch (k) {
            case "b":
              store.insertCellBelow(store.selectedCellId, "code");
              deactivateCommandMode();
              return;
            case "a":
              store.insertCellAbove(store.selectedCellId, "code");
              deactivateCommandMode();
              return;
            case "m":
              store.changeCellType(store.selectedCellId, "markdown");
              deactivateCommandMode();
              return;
            case "y":
              store.changeCellType(store.selectedCellId, "code");
              deactivateCommandMode();
              return;
            case "d":
              if (isPendingDelete()) {
                store.deleteCell(store.selectedCellId);
                deactivateCommandMode();
              } else {
                markPendingDelete();
              }
              return;
            case "escape":
              deactivateCommandMode();
              return;
            default:
              deactivateCommandMode();
              return;
          }
        }

        // ─────────────────────────────────────────────
        // 에디터 안에서는 여기서 종료 (Monaco가 처리)
        // ─────────────────────────────────────────────
        if (inEditor) return;

        // ─────────────────────────────────────────────
        // 셀 외부: 네비게이션 / 실행
        // ─────────────────────────────────────────────
        const selectedId = store.selectedCellId;
        if (!selectedId) return;

        if (e.key === "ArrowDown") {
          e.preventDefault();
          store.selectNextCell();
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          store.selectPrevCell();
          return;
        }

        if (
          (e.metaKey || e.ctrlKey) &&
          e.key === "Enter" &&
          !e.shiftKey &&
          !e.altKey
        ) {
          e.preventDefault();
          runCell(selectedId);
          return;
        }

        if (
          e.shiftKey &&
          e.key === "Enter" &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.altKey
        ) {
          e.preventDefault();
          runCell(selectedId);
          const idx = store.cells.findIndex((c) => c.id === selectedId);
          if (idx === store.cells.length - 1) {
            store.insertCellBelow(selectedId, "code");
          } else {
            store.selectNextCell();
          }
          return;
        }

        if (
          e.altKey &&
          e.key === "Enter" &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey
        ) {
          e.preventDefault();
          runCell(selectedId);
          store.insertCellBelow(selectedId, "code");
          return;
        }
      } catch (err) {
        console.error("[useNotebookShortcuts] handler error:", err);
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);
}

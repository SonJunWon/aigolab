import { useEffect, useRef } from "react";
import { useNotebookStore } from "../store/notebookStore";
import { useAutoSaveStore } from "../store/autoSaveStore";
import { saveNotebook } from "../storage/notebookRepo";
import type { StoredCell } from "../storage/db";

/**
 * 노트북 자동 저장 훅.
 *
 * 동작:
 *   - `cells` 배열의 변화를 구독
 *   - 500ms debounce 후 IndexedDB에 저장
 *   - 상태(dirty/saving/saved/error)를 autoSaveStore에 publish
 *   - lessonId가 바뀌면 이전 저장 flush (즉시 저장)
 *   - 언마운트 시도 flush
 *
 * 디버그: 브라우저 콘솔에 `window.__notebookDebug = true` 입력하면
 *         저장 관련 로그가 콘솔에 출력됨.
 */

const DEBOUNCE_MS = 500;

const debug = (...args: unknown[]) => {
  if ((window as unknown as { __notebookDebug?: boolean }).__notebookDebug) {
    console.log("[autoSave]", ...args);
  }
};

export function useAutoSave(
  notebookId: string | null,
  enabled: boolean,
  lessonHash?: string
) {
  const saveTimer = useRef<number | null>(null);
  const pendingCellsRef = useRef<StoredCell[] | null>(null);
  const lastSavedNotebookId = useRef<string | null>(null);
  const lessonHashRef = useRef<string | undefined>(lessonHash);
  lessonHashRef.current = lessonHash;
  const setStatus = useAutoSaveStore((s) => s.setStatus);

  const cells = useNotebookStore((s) => s.cells);

  // flush: 대기 중인 저장을 즉시 실행 (async)
  const flush = async () => {
    if (saveTimer.current !== null) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    const pending = pendingCellsRef.current;
    const id = lastSavedNotebookId.current;
    if (pending && id) {
      debug("flush → save", id, `${pending.length} cells`);
      setStatus("saving");
      try {
        await saveNotebook(id, pending, lessonHashRef.current);
        pendingCellsRef.current = null;
        setStatus("saved");
      } catch (err) {
        console.error("[autoSave] flush save failed:", err);
        setStatus("error", String(err));
      }
    }
  };

  // notebookId가 바뀌면 이전 노트북을 flush 후 새 id로 전환
  useEffect(() => {
    if (
      lastSavedNotebookId.current &&
      lastSavedNotebookId.current !== notebookId
    ) {
      debug("notebookId changed, flushing previous", lastSavedNotebookId.current);
      void flush();
    }
    lastSavedNotebookId.current = notebookId;
    if (notebookId) {
      setStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notebookId]);

  // cells 변경 시 debounce 저장
  useEffect(() => {
    debug("cells effect", {
      enabled,
      notebookId,
      cellCount: cells.length,
      firstCellSource: cells[0]?.source?.slice(0, 30),
    });

    if (!enabled || !notebookId) {
      debug("skip save — not enabled or no notebookId");
      return;
    }

    const storedCells: StoredCell[] = cells.map((c) => ({
      type: c.type,
      source: c.source,
    }));
    pendingCellsRef.current = storedCells;
    setStatus("dirty");

    if (saveTimer.current !== null) {
      clearTimeout(saveTimer.current);
    }
    saveTimer.current = window.setTimeout(async () => {
      debug("debounce fire → save", notebookId);
      setStatus("saving");
      try {
        await saveNotebook(notebookId, storedCells, lessonHashRef.current);
        pendingCellsRef.current = null;
        saveTimer.current = null;
        setStatus("saved");
        debug("save OK", notebookId);
      } catch (err) {
        console.error("[autoSave] save failed:", err);
        setStatus("error", String(err));
      }
    }, DEBOUNCE_MS);

    return () => {
      if (saveTimer.current !== null) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
    };
  }, [cells, notebookId, enabled, setStatus]);

  // beforeunload: 탭 닫기 직전에 flush 시도
  // (IDB는 완전 동기가 안 되지만, debounce 대기 중이라면 즉시 저장 시도는 된다)
  useEffect(() => {
    const handleBeforeUnload = () => {
      debug("beforeunload → flush");
      // 동기적으로 할 수 있는 건 saveTimer 취소 후 saveNotebook 호출
      // saveNotebook은 async지만 transaction 시작은 동기적으로 일어남
      if (saveTimer.current !== null) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
      const pending = pendingCellsRef.current;
      const id = lastSavedNotebookId.current;
      if (pending && id) {
        void saveNotebook(id, pending, lessonHashRef.current);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // 언마운트 시 flush
  useEffect(() => {
    return () => {
      debug("unmount → flush");
      void flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { flush };
}

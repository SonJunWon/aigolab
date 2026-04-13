import { useEffect, useRef } from "react";
import { useFileStore } from "../store/fileStore";
import { saveProject } from "../storage/projectRepo";

/**
 * IDE 프로젝트 자동 저장 훅.
 * dirtyFiles가 있으면 1초 debounce 후 IndexedDB에 저장.
 * 저장 성공 시 dirtyFiles를 비우고 saveStatus를 "saved"로 전환.
 */
export function useProjectAutoSave() {
  const loaded = useFileStore((s) => s.loaded);
  const dirtyCount = useFileStore((s) => s.dirtyFiles.size);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!loaded) return; // 로드 전에는 저장 안 함 (초기 상태 덮어쓰기 방지)
    if (dirtyCount === 0) return; // 저장할 변경 없음

    if (timer.current !== null) clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      const store = useFileStore.getState();
      store.setSaveStatus("saving");
      saveProject(store.files)
        .then(() => {
          useFileStore.getState().markAllSaved();
        })
        .catch((err) => {
          console.error("[IDE] 자동 저장 실패:", err);
          useFileStore.getState().setSaveStatus("error");
        });
      timer.current = null;
    }, 1000);

    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [loaded, dirtyCount]);

  // 언마운트 / beforeunload 시 flush
  useEffect(() => {
    const flush = () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      const store = useFileStore.getState();
      if (store.loaded && store.dirtyFiles.size > 0) {
        void saveProject(store.files).then(() => {
          useFileStore.getState().markAllSaved();
        });
      }
    };

    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, []);
}

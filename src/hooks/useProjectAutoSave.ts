import { useEffect, useRef } from "react";
import { useFileStore } from "../store/fileStore";
import { saveProject } from "../storage/projectRepo";

/**
 * IDE 프로젝트 자동 저장 훅.
 * files 변경 시 1초 debounce 후 IndexedDB에 저장.
 */
export function useProjectAutoSave() {
  const files = useFileStore((s) => s.files);
  const loaded = useFileStore((s) => s.loaded);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!loaded) return; // 로드 전에는 저장 안 함 (초기 상태 덮어쓰기 방지)

    if (timer.current !== null) clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      void saveProject(files);
      timer.current = null;
    }, 1000);

    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [files, loaded]);

  // 언마운트 / beforeunload 시 flush
  useEffect(() => {
    const flush = () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      if (useFileStore.getState().loaded) {
        void saveProject(useFileStore.getState().files);
      }
    };

    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, []);
}

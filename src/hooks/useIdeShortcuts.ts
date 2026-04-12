import { useEffect } from "react";
import { useFileStore } from "../store/fileStore";
import { runActiveFile } from "../runtime/fileRunner";
import { saveProject } from "../storage/projectRepo";

/**
 * IDE 전용 키보드 단축키.
 *
 * F5              실행 (Run)
 * Ctrl/Cmd + S    수동 저장
 * Ctrl/Cmd + N    새 파일
 * Ctrl/Cmd + W    현재 탭 닫기
 * Ctrl/Cmd + `    출력 패널 토글 (외부에서 콜백으로 받음)
 */
export function useIdeShortcuts(callbacks?: {
  onToggleOutput?: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      // F5 → 실행
      if (e.key === "F5") {
        e.preventDefault();
        runActiveFile();
        return;
      }

      // Ctrl/Cmd + Enter → 실행 (에디터 안에서도)
      if (mod && e.key === "Enter" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        runActiveFile();
        return;
      }

      // Ctrl/Cmd + S → 수동 저장
      if (mod && e.key === "s" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const { files, loaded } = useFileStore.getState();
        if (loaded) {
          void saveProject(files);
          useFileStore.getState().appendOutput({
            stream: "system",
            text: "✓ 프로젝트 저장됨",
          });
        }
        return;
      }

      // Ctrl/Cmd + N → 새 파일 (prompt 다이얼로그)
      if (mod && e.key === "n" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const name = prompt("새 파일 이름 (예: helper.py 또는 src/module.py):");
        if (name && name.trim()) {
          const finalName = name.trim().endsWith(".py")
            ? name.trim()
            : `${name.trim()}.py`;
          const { files, createFile } = useFileStore.getState();
          if (files[finalName]) {
            alert("같은 이름의 파일이 이미 있어요.");
          } else {
            createFile(finalName);
          }
        }
        return;
      }

      // Ctrl/Cmd + W → 현재 탭 닫기
      if (mod && e.key === "w" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const { activeFile, closeTab } = useFileStore.getState();
        if (activeFile) closeTab(activeFile);
        return;
      }

      // Ctrl/Cmd + ` → 출력 토글
      if (mod && e.key === "`") {
        e.preventDefault();
        callbacks?.onToggleOutput?.();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [callbacks]);
}

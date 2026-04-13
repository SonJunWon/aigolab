/**
 * 셀 실행 — standalone 함수.
 *
 * 노트북 스토어의 `language`에 따라 적절한 LanguageRuntime을 골라 실행한다.
 * Hook 밖에서 호출 가능 (Monaco editor의 addCommand 콜백 등).
 *
 * 매번 useNotebookStore.getState()를 호출하므로 항상 최신 상태로 동작한다.
 */

import { getRuntime, isLanguageSupported } from "./registry";
import { useNotebookStore } from "../store/notebookStore";

export async function runCell(cellId: string): Promise<void> {
  const store = useNotebookStore.getState();
  const cell = store.cells.find((c) => c.id === cellId);

  // 코드 셀이 아니거나, 이미 실행 중이거나, 존재하지 않으면 무시
  if (!cell || cell.type !== "code") return;
  if (cell.status === "running") return;

  // 등록되지 않은 언어면 무시
  if (!isLanguageSupported(store.language)) return;

  const runtime = getRuntime(store.language);

  // 런타임이 아직 준비 안 됐다면 무시 (사용자가 보기엔 단축키가 무반응)
  if (runtime.getStatus() !== "ready") return;

  store.clearOutputs(cellId);
  store.setStatus(cellId, "running");

  try {
    const result = await runtime.run(cellId, cell.source, {
      onStdout: (text) =>
        useNotebookStore
          .getState()
          .appendOutput(cellId, { stream: "stdout", text }),
      onStderr: (text) =>
        useNotebookStore
          .getState()
          .appendOutput(cellId, { stream: "stderr", text }),
    });

    if (result.value !== undefined && result.value !== "None") {
      useNotebookStore
        .getState()
        .appendOutput(cellId, { stream: "result", text: result.value });
    }

    useNotebookStore.getState().finalizeExecution(cellId, result.timeMs, true);
  } catch (err) {
    const error = err as { message: string; name: string; timeMs: number };
    useNotebookStore.getState().appendOutput(cellId, {
      stream: "error",
      text: `${error.name}: ${error.message}`,
    });
    useNotebookStore
      .getState()
      .finalizeExecution(cellId, error.timeMs ?? 0, false);
  }
}

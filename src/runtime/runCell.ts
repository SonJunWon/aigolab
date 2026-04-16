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
import {
  analyzeCellShadowing,
  formatConflictMessage,
} from "./lessonAnalysis";
import { runLlmCode, LlmRuntimeError, LlmError } from "../lib/llm";
import { useKeyModalStore } from "../store/keyModalStore";

export async function runCell(cellId: string): Promise<void> {
  const store = useNotebookStore.getState();
  const cell = store.cells.find((c) => c.id === cellId);

  // 존재하지 않거나, 이미 실행 중이면 무시
  if (!cell) return;
  if (cell.status === "running") return;

  // ─── LLM 셀은 별도 파이프라인 ─────────────────────
  if (cell.type === "llm-code") {
    await runLlmCellPath(cellId, cell.source, cell.simulation?.traces);
    return;
  }

  // 이하 일반 코드 셀 (Python/JS/SQL)
  if (cell.type !== "code") return;

  // 등록되지 않은 언어면 무시
  if (!isLanguageSupported(store.language)) return;

  const runtime = getRuntime(store.language);

  // 런타임이 아직 준비 안 됐다면 무시 (사용자가 보기엔 단축키가 무반응)
  if (runtime.getStatus() !== "ready") return;

  store.clearOutputs(cellId);
  store.setStatus(cellId, "running");

  // ── 셰도잉 사전 경고 (Python 한정) ──
  // 변수가 빌트인 또는 같은 챕터의 다른 셀 정의와 충돌하면 경고 출력
  if (store.language === "python") {
    const cellIndex = store.cells.findIndex((c) => c.id === cellId);
    const allCodeSources = store.cells
      .filter((c) => c.type === "code")
      .map((c) => c.source);
    // codeOnly 인덱스로 변환 (현재 셀이 코드일 때만 유효)
    const codeIndex = store.cells
      .filter((c) => c.type === "code")
      .findIndex((c) => c.id === cellId);

    if (codeIndex >= 0) {
      const conflicts = analyzeCellShadowing(
        cell.source,
        codeIndex,
        allCodeSources
      );
      for (const c of conflicts) {
        store.appendOutput(cellId, {
          stream: "warning",
          text: formatConflictMessage(c) + "\n",
        });
      }
    }
    void cellIndex; // ESLint 잠재 미사용 경고 회피
  }

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
      // SQL SELECT 결과 등 표 형식
      onTable: (table) =>
        useNotebookStore.getState().appendOutput(cellId, {
          stream: "table",
          text: "",
          table,
        }),
      // matplotlib PNG (Python 한정)
      onFigure: (dataUrl) =>
        useNotebookStore.getState().appendOutput(cellId, {
          stream: "figure",
          text: "",
          dataUrl,
        }),
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

/**
 * 전역 녹화 버퍼 — T10.
 * 최근 실행된 LLM 셀들의 녹화 trace 를 cell 별로 보관.
 * 관리자 다운로드 UI (후속 작업) 에서 이걸 조회해 JSON 으로 내보냄.
 */
const recordedTracesByCell = new Map<string, import("../lib/llm/types").Trace[]>();

export function getRecordedTraces(cellId: string) {
  return recordedTracesByCell.get(cellId) ?? [];
}

/**
 * LLM 셀 전용 실행 경로 — TypeScript 컴파일 + chat API 주입.
 * 기존 Python/JS/SQL 런타임과는 독립적.
 *
 * @param replayTraces — 셀에 simulation 이 붙어 있으면 순서대로 주입해
 *   학생이 키 없이도 예상 결과 그대로 진행 가능.
 */
async function runLlmCellPath(
  cellId: string,
  source: string,
  replayTraces?: import("../lib/llm/types").Trace[],
): Promise<void> {
  const store = useNotebookStore.getState();
  store.clearOutputs(cellId);
  store.setStatus(cellId, "running");

  try {
    const result = await runLlmCode(source, {
      onStdout: (text) =>
        useNotebookStore
          .getState()
          .appendOutput(cellId, { stream: "stdout", text }),
      onStderr: (text) =>
        useNotebookStore
          .getState()
          .appendOutput(cellId, { stream: "stderr", text }),
      onProgress: (evt) =>
        useNotebookStore.getState().updateProgressOutput(cellId, {
          stream: "progress",
          text: evt.message ?? "",
          progress: evt.progress,
          phase: evt.phase,
        }),
      onToken: (chunk) =>
        useNotebookStore.getState().appendThoughtToken(cellId, chunk, true),
      onAgentStep: (step) =>
        useNotebookStore.getState().appendOutput(cellId, {
          stream: "agent-step",
          text: step.content,
          agentStep: step,
        }),
      replayTraces,
    });

    // 스트리밍이 있었으면 마지막 thought chunk 의 streaming 플래그를 false 로
    const finalState = useNotebookStore.getState();
    const finalCell = finalState.cells.find((c) => c.id === cellId);
    if (finalCell?.outputs.some((o) => o.stream === "thought" && o.streaming)) {
      finalState.appendThoughtToken(cellId, "", false);
    }

    if (result.replayed) {
      // 재생 사실을 학생에게 알림 — 가짜 네트워크 호출 아님을 명확히
      useNotebookStore.getState().appendOutput(cellId, {
        stream: "warning",
        text: "📼 시뮬레이션 재생 중 — 실제 네트워크 호출 없이 녹화된 응답을 사용합니다.\n",
      });
    }

    if (result.traces.length > 0) {
      recordedTracesByCell.set(cellId, result.traces);
    }

    if (result.value !== undefined) {
      useNotebookStore
        .getState()
        .appendOutput(cellId, { stream: "result", text: result.value });
    }

    useNotebookStore.getState().finalizeExecution(cellId, result.timeMs, true);
  } catch (err) {
    const isKnown = err instanceof LlmRuntimeError;
    const isLlm = err instanceof LlmError;
    const message = err instanceof Error ? err.message : String(err);
    const timeMs = isKnown ? err.timeMs : 0;

    // 키 누락 → 전역 모달 자동 오픈 (학생이 🔑 위치를 몰라도 바로 등록 경로 진입)
    if (isLlm && err.reason === "missing-key") {
      useKeyModalStore.getState().openForMissingKey(err.provider);
    }

    useNotebookStore.getState().appendOutput(cellId, {
      stream: "error",
      text: message,
    });
    useNotebookStore
      .getState()
      .finalizeExecution(cellId, timeMs, false);
  }
}

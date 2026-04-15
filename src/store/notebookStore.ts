import { create } from "zustand";
import type { Cell, CellStatus, CellType, OutputChunk } from "../types/notebook";
import type { SupportedLanguage } from "../runtime/types";
import type { Trace } from "../lib/llm/types";

/**
 * 노트북 상태 스토어 (Zustand).
 * v0.2 단계에서는 단일 노트북만 다룬다.
 */

let cellIdCounter = 1;
const newCellId = () => `cell-${cellIdCounter++}`;

const createCell = (type: CellType, source = ""): Cell => ({
  id: newCellId(),
  type,
  source,
  outputs: [],
  status: "idle",
});

interface NotebookState {
  cells: Cell[];
  /** 글로벌 실행 카운터 (Jupyter처럼 [1], [2] 표시) */
  executionCounter: number;
  /** 현재 선택된 셀 (Colab의 active cell) */
  selectedCellId: string | null;
  /** 현재 노트북의 실행 언어 (런타임 선택용). 기본 'python'. */
  language: SupportedLanguage;

  // ── 노트북 교체 (레슨 로드 시 사용) ────────────
  /**
   * 셀 배열로 노트북을 교체한다.
   * seeds는 레슨 또는 저장본에서 온다. hints/solution은 optional.
   * language를 지정하면 해당 런타임으로 실행된다 (기본 'python').
   */
  loadCells: (
    cells: Array<{
      type: CellType;
      source: string;
      hints?: string[];
      solution?: string;
      /** LLM 셀 전용 — 키 없는 학생용 녹화본 (T10) */
      simulation?: {
        traces: Trace[];
        note?: string;
      };
    }>,
    language?: SupportedLanguage
  ) => void;
  setLanguage: (language: SupportedLanguage) => void;
  resetNotebook: () => void;

  // ── 셀 조작 ────────────────────────────────────
  insertCellAbove: (cellId: string, type: CellType) => string;
  insertCellBelow: (cellId: string, type: CellType) => string;
  addCellAtEnd: (type: CellType) => string;
  deleteCell: (cellId: string) => void;
  updateSource: (cellId: string, source: string) => void;
  moveCellUp: (cellId: string) => void;
  moveCellDown: (cellId: string) => void;
  changeCellType: (cellId: string, type: CellType) => void;

  // ── 선택 ───────────────────────────────────────
  selectCell: (cellId: string | null) => void;
  selectNextCell: () => void;
  selectPrevCell: () => void;

  // ── 실행 결과 업데이트 ───────────────────────────
  setStatus: (cellId: string, status: CellStatus) => void;
  appendOutput: (cellId: string, chunk: OutputChunk) => void;
  /**
   * progress 스트림 전용 — 기존 progress chunk 가 있으면 in-place 교체,
   * 없으면 outputs 맨 앞에 삽입. WebLLM 모델 다운로드 진행률처럼 "하나의 지표가
   * 계속 갱신" 되는 케이스용.
   */
  updateProgressOutput: (cellId: string, chunk: OutputChunk) => void;
  clearOutputs: (cellId: string) => void;
  finalizeExecution: (cellId: string, executionTime: number, success: boolean) => void;
}

const initialCells: Cell[] = [
  createCell(
    "markdown",
    `# Python Notebook 에 오신 것을 환영합니다 🐍

이 노트북은 **Google Colab** 스타일로 동작합니다.
아래 코드 셀을 선택하고 \`Cmd/Ctrl + Enter\` 로 실행해보세요.`
  ),
  createCell(
    "code",
    `# 첫 번째 코드 셀
print("Hello, Python Notebook!")
2 + 3`
  ),
];

export const useNotebookStore = create<NotebookState>((set, get) => ({
  cells: initialCells,
  executionCounter: 0,
  selectedCellId: initialCells[1].id, // 코드 셀을 기본 선택
  language: "python",

  loadCells: (seeds, language) => {
    const newCells: Cell[] = seeds.map((s) => ({
      ...createCell(s.type, s.source),
      hints: s.hints,
      solution: s.solution,
      simulation: s.simulation,
    }));
    set({
      cells: newCells,
      executionCounter: 0,
      // 첫 번째 코드 셀을 기본 선택, 없으면 첫 셀
      selectedCellId:
        newCells.find((c) => c.type === "code" || c.type === "llm-code")?.id ??
        newCells[0]?.id ??
        null,
      // 명시 시만 변경, 미지정 시 기존값 유지
      ...(language ? { language } : {}),
    });
  },

  setLanguage: (language) => set({ language }),

  resetNotebook: () => {
    set({
      cells: initialCells,
      executionCounter: 0,
      selectedCellId: initialCells[1]?.id ?? initialCells[0]?.id ?? null,
    });
  },

  insertCellAbove: (cellId, type) => {
    const newCell = createCell(type);
    set((state) => {
      const idx = state.cells.findIndex((c) => c.id === cellId);
      if (idx === -1) return state;
      const next = [...state.cells];
      next.splice(idx, 0, newCell);
      return { cells: next, selectedCellId: newCell.id };
    });
    return newCell.id;
  },

  insertCellBelow: (cellId, type) => {
    const newCell = createCell(type);
    set((state) => {
      const idx = state.cells.findIndex((c) => c.id === cellId);
      if (idx === -1) return state;
      const next = [...state.cells];
      next.splice(idx + 1, 0, newCell);
      return { cells: next, selectedCellId: newCell.id };
    });
    return newCell.id;
  },

  addCellAtEnd: (type) => {
    const newCell = createCell(type);
    set((state) => ({
      cells: [...state.cells, newCell],
      selectedCellId: newCell.id,
    }));
    return newCell.id;
  },

  deleteCell: (cellId) =>
    set((state) => {
      if (state.cells.length <= 1) return state;
      const idx = state.cells.findIndex((c) => c.id === cellId);
      const next = state.cells.filter((c) => c.id !== cellId);
      // 삭제된 셀의 다음 셀(또는 이전 셀) 선택
      const newSelected = next[idx]?.id ?? next[idx - 1]?.id ?? null;
      return { cells: next, selectedCellId: newSelected };
    }),

  updateSource: (cellId, source) =>
    set((state) => ({
      cells: state.cells.map((c) => (c.id === cellId ? { ...c, source } : c)),
    })),

  moveCellUp: (cellId) =>
    set((state) => {
      const idx = state.cells.findIndex((c) => c.id === cellId);
      if (idx <= 0) return state;
      const next = [...state.cells];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return { cells: next };
    }),

  moveCellDown: (cellId) =>
    set((state) => {
      const idx = state.cells.findIndex((c) => c.id === cellId);
      if (idx === -1 || idx >= state.cells.length - 1) return state;
      const next = [...state.cells];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return { cells: next };
    }),

  changeCellType: (cellId, type) =>
    set((state) => ({
      cells: state.cells.map((c) =>
        c.id === cellId
          ? { ...c, type, outputs: [], status: "idle", executionCount: undefined }
          : c
      ),
    })),

  selectCell: (cellId) => set({ selectedCellId: cellId }),

  selectNextCell: () => {
    const { cells, selectedCellId } = get();
    if (!selectedCellId) return;
    const idx = cells.findIndex((c) => c.id === selectedCellId);
    if (idx >= 0 && idx < cells.length - 1) {
      set({ selectedCellId: cells[idx + 1].id });
    }
  },

  selectPrevCell: () => {
    const { cells, selectedCellId } = get();
    if (!selectedCellId) return;
    const idx = cells.findIndex((c) => c.id === selectedCellId);
    if (idx > 0) {
      set({ selectedCellId: cells[idx - 1].id });
    }
  },

  setStatus: (cellId, status) =>
    set((state) => ({
      cells: state.cells.map((c) => (c.id === cellId ? { ...c, status } : c)),
    })),

  appendOutput: (cellId, chunk) =>
    set((state) => ({
      cells: state.cells.map((c) =>
        c.id === cellId ? { ...c, outputs: [...c.outputs, chunk] } : c
      ),
    })),

  updateProgressOutput: (cellId, chunk) =>
    set((state) => ({
      cells: state.cells.map((c) => {
        if (c.id !== cellId) return c;
        const idx = c.outputs.findIndex((o) => o.stream === "progress");
        if (idx === -1) {
          // progress 를 outputs 맨 앞에 두면 실행 로그와 분리되어 잘 보임
          return { ...c, outputs: [chunk, ...c.outputs] };
        }
        const next = [...c.outputs];
        next[idx] = chunk;
        return { ...c, outputs: next };
      }),
    })),

  clearOutputs: (cellId) =>
    set((state) => ({
      cells: state.cells.map((c) =>
        c.id === cellId ? { ...c, outputs: [] } : c
      ),
    })),

  finalizeExecution: (cellId, executionTime, success) =>
    set((state) => ({
      executionCounter: state.executionCounter + 1,
      cells: state.cells.map((c) =>
        c.id === cellId
          ? {
              ...c,
              executionTime,
              executionCount: state.executionCounter + 1,
              status: success ? "success" : "error",
            }
          : c
      ),
    })),
}));

/**
 * 노트북 도메인 타입 정의
 */

import type { Trace } from "../lib/llm/types";

export type CellType = "code" | "markdown" | "llm-code";

export type CellStatus = "idle" | "queued" | "running" | "success" | "error";

/** SQL SELECT 결과 등 표 형식 출력 */
export interface TableData {
  columns: string[];
  rows: Array<Array<string | number | null>>;
  /** 결과 행 수 (rows.length와 같지만 명시적으로) */
  rowCount: number;
}

export interface OutputChunk {
  /**
   * stdout / stderr / result / error / warning(선제 경고) / table(SQL 결과) /
   * figure(matplotlib 그래프 PNG)
   */
  stream:
    | "stdout"
    | "stderr"
    | "result"
    | "error"
    | "warning"
    | "table"
    | "figure";
  /** 텍스트 출력 — table·figure 일 때는 사용 안 함 */
  text: string;
  /** table 일 때만 사용 */
  table?: TableData;
  /** figure 일 때만 사용 — `data:image/png;base64,...` */
  dataUrl?: string;
}

export interface Cell {
  id: string;
  type: CellType;
  source: string;
  /** 실행 결과 누적 (다중 print 지원) */
  outputs: OutputChunk[];
  /** 마지막 실행 상태 */
  status: CellStatus;
  /** 마지막 실행 소요 시간 (ms) */
  executionTime?: number;
  /** 실행 횟수 (Jupyter처럼 [1], [2] 표시용) */
  executionCount?: number;
  /** 레슨에서 주입한 단계별 힌트 (선택적, 저장되지 않음) */
  hints?: string[];
  /** 레슨의 정답 코드 (선택적, 저장되지 않음) */
  solution?: string;
  /**
   * LLM 셀 전용 — 키 없는 학생용 녹화본 (T10).
   * 셀 실행 시 순서대로 소비되어 실제 네트워크 호출 대신 trace.output 이 반환됨.
   */
  simulation?: {
    traces: Trace[];
    note?: string;
  };
}

export interface Notebook {
  id: string;
  title: string;
  cells: Cell[];
  createdAt: number;
  updatedAt: number;
}

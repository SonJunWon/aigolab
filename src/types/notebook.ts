/**
 * 노트북 도메인 타입 정의
 */

export type CellType = "code" | "markdown";

export type CellStatus = "idle" | "queued" | "running" | "success" | "error";

export interface OutputChunk {
  /** stdout / stderr / result 값 / 에러 메시지 등 한 덩어리 */
  stream: "stdout" | "stderr" | "result" | "error";
  text: string;
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
}

export interface Notebook {
  id: string;
  title: string;
  cells: Cell[];
  createdAt: number;
  updatedAt: number;
}

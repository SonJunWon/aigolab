/**
 * 다중 언어 런타임 공통 타입 + 인터페이스.
 *
 * Python(Pyodide), JavaScript(Web Worker eval), SQL(sql.js) 등 모든 런타임이
 * 이 인터페이스를 구현해야 한다. 소비자(runCell, fileRunner, hooks)는 구체
 * 런타임이 아닌 LanguageRuntime 인터페이스에 의존한다.
 */

import type { Language } from "../types/lesson";
import type { TableData } from "../types/notebook";

/** 런타임 지원 언어 — 콘텐츠 도메인의 Language와 동일 */
export type SupportedLanguage = Language;

export type RunStatus = "idle" | "loading" | "ready" | "error";

export interface RunCallbacks {
  /** print/console.log 등 표준 출력 청크 */
  onStdout?: (text: string) => void;
  /** 오류·경고 출력 */
  onStderr?: (text: string) => void;
  /** SQL SELECT 등 표 형식 결과 (해당 런타임만 호출) */
  onTable?: (table: TableData) => void;
  /** matplotlib 그래프 PNG (data URL 형식). Python 런타임만 호출 */
  onFigure?: (dataUrl: string) => void;
}

export interface RunResult {
  /** 마지막 표현식의 반환값 (있을 경우, 문자열로 직렬화) */
  value?: string;
  /** 실행 소요 시간 (ms) */
  timeMs: number;
}

export interface RunError {
  message: string;
  name: string;
  timeMs: number;
}

/**
 * 가상 파일 시스템에 쓸 파일 한 개.
 * SQL 등 파일 개념이 없는 런타임은 writeFiles를 미구현해도 된다.
 */
export interface VirtualFile {
  path: string;
  content: string;
}

export interface LanguageRuntime {
  readonly language: SupportedLanguage;

  /** Worker 생성 + 환경 초기화. 멱등(여러 번 호출해도 한 번만). */
  init(): Promise<void>;

  /** 코드 실행. stdout/stderr는 콜백, 결과는 Promise. */
  run(
    cellId: string,
    code: string,
    callbacks?: RunCallbacks
  ): Promise<RunResult>;

  /** 멀티 파일 환경 (IDE 모드). 미지원 런타임은 undefined. */
  writeFiles?(files: VirtualFile[]): Promise<void>;

  /** 강제 중단 + 재초기화. 무한 루프 탈출용. */
  terminate(): Promise<void>;

  getStatus(): RunStatus;
  getVersion(): string | null;
  onStatusChange(listener: (status: RunStatus) => void): () => void;
}

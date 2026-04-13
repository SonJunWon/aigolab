/**
 * SQL Web Worker의 메인 스레드 측 래퍼.
 *
 * sql.js (SQLite WASM)를 Worker에서 돌리고, SELECT 결과는 `table` 출력
 * 청크로, 그 외(INSERT/UPDATE/CREATE)는 `stdout` 텍스트로 콜백한다.
 *
 * 다른 LanguageRuntime과 다른 점: stdout 외에 `onTable` 콜백을 추가로 받음.
 * runCell에서 사용 시 적절히 분기 처리.
 */

import type {
  LanguageRuntime,
  RunCallbacks,
  RunError,
  RunResult,
  RunStatus,
  SupportedLanguage,
} from "./types";

interface PendingRun {
  resolve: (result: RunResult) => void;
  reject: (error: RunError) => void;
  callbacks: RunCallbacks;
  cellId: string;
}

let nextMessageId = 1;
const generateId = () => `sql-m${nextMessageId++}`;

class SqlRunner implements LanguageRuntime {
  readonly language: SupportedLanguage = "sql";

  private worker: Worker | null = null;
  private status: RunStatus = "idle";
  private version: string | null = null;
  private readyPromise: Promise<void> | null = null;
  private pending = new Map<string, PendingRun>();
  private statusListeners = new Set<(status: RunStatus) => void>();

  init(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;
    this.setStatus("loading");

    this.readyPromise = new Promise<void>((resolve, reject) => {
      try {
        this.worker = new Worker("/sql-worker.js");
        this.worker.onmessage = (e) => this.handleMessage(e.data);
        this.worker.onerror = (e) => {
          this.setStatus("error");
          reject(new Error(`SQL Worker error: ${e.message}`));
        };

        const id = generateId();
        const onReady = (msg: { type: string; id: string; version?: string }) => {
          if (msg.type === "ready" && msg.id === id) {
            this.version = msg.version || "SQLite";
            this.setStatus("ready");
            resolve();
          }
        };
        const originalOnMessage = this.worker.onmessage;
        this.worker.onmessage = (e) => {
          onReady(e.data);
          originalOnMessage?.call(this.worker!, e);
        };

        this.worker.postMessage({ type: "init", id });
      } catch (err) {
        this.setStatus("error");
        reject(err);
      }
    });

    return this.readyPromise;
  }

  async run(
    cellId: string,
    code: string,
    callbacks: RunCallbacks = {}
  ): Promise<RunResult> {
    await this.init();
    if (!this.worker) throw new Error("SQL Worker not initialized");

    return new Promise<RunResult>((resolve, reject) => {
      const id = generateId();
      this.pending.set(id, { resolve, reject, callbacks, cellId });
      this.worker!.postMessage({ type: "run", id, cellId, code });
    });
  }

  getStatus(): RunStatus {
    return this.status;
  }
  getVersion(): string | null {
    return this.version;
  }
  onStatusChange(listener: (status: RunStatus) => void): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    for (const [id, p] of this.pending) {
      p.reject({
        message: "실행이 중단되었습니다.",
        name: "Interrupted",
        timeMs: 0,
      });
      this.pending.delete(id);
    }
    this.readyPromise = null;
    this.version = null;
    this.setStatus("idle");
    await this.init();
  }

  private setStatus(status: RunStatus) {
    this.status = status;
    this.statusListeners.forEach((l) => l(status));
  }

  private handleMessage(msg: {
    type: string;
    id?: string;
    cellId?: string;
    text?: string;
    columns?: string[];
    rows?: Array<Array<string | number | null>>;
    rowCount?: number;
    message?: string;
    name?: string;
    timeMs?: number;
  }) {
    // 표 결과 (SQL SELECT 등)
    if (msg.type === "table") {
      const pending = [...this.pending.values()].find(
        (p) => p.cellId === msg.cellId
      );
      if (pending && msg.columns && msg.rows) {
        pending.callbacks.onTable?.({
          columns: msg.columns,
          rows: msg.rows,
          rowCount: msg.rowCount ?? msg.rows.length,
        });
      }
      return;
    }

    if (msg.type === "stdout" || msg.type === "stderr") {
      const pending = [...this.pending.values()].find(
        (p) => p.cellId === msg.cellId
      );
      if (pending && msg.text) {
        if (msg.type === "stdout") pending.callbacks.onStdout?.(msg.text);
        else pending.callbacks.onStderr?.(msg.text);
      }
      return;
    }

    if (msg.type === "result" && msg.id) {
      const pending = this.pending.get(msg.id);
      if (pending) {
        pending.resolve({ value: undefined, timeMs: msg.timeMs ?? 0 });
        this.pending.delete(msg.id);
      }
      return;
    }

    if (msg.type === "error" && msg.id) {
      const pending = this.pending.get(msg.id);
      if (pending) {
        pending.reject({
          message: msg.message ?? "Unknown SQL error",
          name: msg.name ?? "SqlError",
          timeMs: msg.timeMs ?? 0,
        });
        this.pending.delete(msg.id);
      }
      return;
    }
  }
}

export const sqlRunner = new SqlRunner();

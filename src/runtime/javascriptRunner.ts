/**
 * JavaScript Web Worker의 메인 스레드 측 래퍼.
 *
 * pythonRunner와 같은 패턴으로 LanguageRuntime 인터페이스를 구현.
 * Worker 자체는 public/javascript-worker.js에 있다.
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
const generateId = () => `js-m${nextMessageId++}`;

class JavaScriptRunner implements LanguageRuntime {
  readonly language: SupportedLanguage = "javascript";

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
        this.worker = new Worker("/javascript-worker.js");
        this.worker.onmessage = (e) => this.handleMessage(e.data);
        this.worker.onerror = (e) => {
          this.setStatus("error");
          reject(new Error(`JS Worker error: ${e.message}`));
        };

        const id = generateId();

        // init 응답 대기
        const onReady = (msg: { type: string; id: string; version?: string }) => {
          if (msg.type === "ready" && msg.id === id) {
            this.version = msg.version || "ES2022";
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
    if (!this.worker) throw new Error("JS Worker not initialized");

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

  /**
   * 무한 루프 등 강제 중단 — Worker terminate + 재초기화.
   * JavaScript는 Pyodide만큼 무겁지 않아 거의 즉시 복구된다.
   */
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
    value?: string;
    message?: string;
    name?: string;
    timeMs?: number;
  }) {
    // 스트리밍 출력 — cellId로 어느 실행에 속하는지 매칭
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
        pending.resolve({ value: msg.value, timeMs: msg.timeMs ?? 0 });
        this.pending.delete(msg.id);
      }
      return;
    }

    if (msg.type === "error" && msg.id) {
      const pending = this.pending.get(msg.id);
      if (pending) {
        pending.reject({
          message: msg.message ?? "Unknown error",
          name: msg.name ?? "Error",
          timeMs: msg.timeMs ?? 0,
        });
        this.pending.delete(msg.id);
      }
      return;
    }
  }
}

export const javascriptRunner = new JavaScriptRunner();

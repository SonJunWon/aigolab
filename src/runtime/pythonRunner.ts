/**
 * Pyodide Web Worker의 메인 스레드 측 래퍼.
 *
 * Worker와의 메시지 통신을 Promise 기반 API로 감싸서
 * React 컴포넌트에서 깔끔하게 사용할 수 있게 한다.
 */

export type RunStatus = "idle" | "loading" | "ready" | "error";

export interface RunCallbacks {
  /** print() 한 줄 또는 청크가 들어올 때마다 호출 */
  onStdout?: (text: string) => void;
  onStderr?: (text: string) => void;
}

export interface RunResult {
  /** 마지막 표현식의 반환값 (있을 경우) */
  value?: string;
  /** 실행 소요 시간 (ms) */
  timeMs: number;
}

export interface RunError {
  message: string;
  name: string;
  timeMs: number;
}

interface PendingRun {
  resolve: (result: RunResult) => void;
  reject: (error: RunError) => void;
  callbacks: RunCallbacks;
  cellId: string;
}

let nextMessageId = 1;
const generateId = () => `m${nextMessageId++}`;

/**
 * 단일 Pyodide 인스턴스를 감싸는 클래스.
 * 앱 전체에서 하나의 인스턴스만 사용 (싱글톤).
 */
class PythonRunner {
  private worker: Worker | null = null;
  private status: RunStatus = "idle";
  private version: string | null = null;
  private readyPromise: Promise<void> | null = null;
  private pending = new Map<string, PendingRun>();
  private statusListeners = new Set<(status: RunStatus) => void>();

  /**
   * Worker 생성 + Pyodide 초기화.
   * 여러 번 호출돼도 한 번만 초기화한다.
   */
  init(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;

    this.setStatus("loading");

    this.readyPromise = new Promise<void>((resolve, reject) => {
      try {
        // public/pyodide-worker.js — Vite가 그대로 서빙
        this.worker = new Worker("/pyodide-worker.js");
        this.worker.onmessage = (e) => this.handleMessage(e.data);
        this.worker.onerror = (e) => {
          this.setStatus("error");
          reject(new Error(`Worker error: ${e.message}`));
        };

        const id = generateId();

        // 초기화 응답 대기
        const onReady = (msg: { type: string; id: string; version?: string }) => {
          if (msg.type === "ready" && msg.id === id) {
            this.version = msg.version || "unknown";
            this.setStatus("ready");
            resolve();
          }
        };
        // 임시 리스너를 추가하기보단, init 응답만 기다리는 일회용 핸들러를 등록
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

  /**
   * 가상 파일 시스템에 파일들을 쓴다.
   * IDE 모드에서 import 가 작동하게 하려면 실행 전에 호출해야 한다.
   */
  async writeFiles(files: Array<{ path: string; content: string }>): Promise<void> {
    await this.init();
    if (!this.worker) throw new Error("Worker not initialized");

    return new Promise<void>((resolve) => {
      const id = generateId();
      const handler = (e: MessageEvent) => {
        if (e.data.type === "filesWritten" && e.data.id === id) {
          this.worker!.removeEventListener("message", handler);
          resolve();
        }
      };
      this.worker!.addEventListener("message", handler);
      this.worker!.postMessage({ type: "writeFiles", id, files });
    });
  }

  /**
   * Python 코드 실행.
   * stdout/stderr는 콜백으로 스트리밍, 결과는 Promise로 반환.
   */
  async run(cellId: string, code: string, callbacks: RunCallbacks = {}): Promise<RunResult> {
    await this.init();
    if (!this.worker) throw new Error("Worker not initialized");

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
   * 실행 강제 중단 — Worker를 terminate하고 새로 만든다.
   * 무한루프 등에서 빠져나올 때 사용.
   * Pyodide를 처음부터 다시 로드해야 하므로 시간이 걸린다.
   */
  async terminate(): Promise<void> {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    // pending 들을 모두 reject
    for (const [id, p] of this.pending) {
      p.reject({ message: "실행이 중단되었습니다.", name: "Interrupted", timeMs: 0 });
      this.pending.delete(id);
    }
    // 상태 리셋
    this.readyPromise = null;
    this.version = null;
    this.setStatus("idle");
    // 다시 초기화
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
    // 스트리밍 출력 (어느 실행에 속하는지는 cellId로 구분)
    if (msg.type === "stdout" || msg.type === "stderr") {
      const pending = [...this.pending.values()].find((p) => p.cellId === msg.cellId);
      if (pending && msg.text) {
        if (msg.type === "stdout") pending.callbacks.onStdout?.(msg.text);
        else pending.callbacks.onStderr?.(msg.text);
      }
      return;
    }

    // 실행 완료
    if (msg.type === "result" && msg.id) {
      const pending = this.pending.get(msg.id);
      if (pending) {
        pending.resolve({ value: msg.value, timeMs: msg.timeMs ?? 0 });
        this.pending.delete(msg.id);
      }
      return;
    }

    // 실행 실패
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

// 앱 전체에서 공유하는 싱글톤
export const pythonRunner = new PythonRunner();

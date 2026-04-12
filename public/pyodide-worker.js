// Pyodide Web Worker (classic worker)
// 이 파일은 Vite 번들링을 거치지 않고 그대로 서빙됩니다.
// public/ 폴더 안에 있어서 / 경로로 접근 가능.

const PYODIDE_VERSION = "0.28.3";
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// Pyodide 본체 스크립트 로드
self.importScripts(`${PYODIDE_INDEX_URL}pyodide.js`);

let pyodide = null;
let initPromise = null;

/**
 * Pyodide 인스턴스 초기화 (한 번만 실행)
 */
async function initPyodide() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // loadPyodide는 importScripts로 글로벌에 노출된 함수
    pyodide = await self.loadPyodide({
      indexURL: PYODIDE_INDEX_URL,
    });
    return pyodide;
  })();

  return initPromise;
}

/**
 * 메시지 핸들러
 *
 * 받는 메시지:
 *   { type: "init",  id }                       — Pyodide 초기화
 *   { type: "run",   id, code, cellId }          — 코드 실행
 *   { type: "writeFiles", id, files }            — 가상 FS에 파일 쓰기
 *
 * 보내는 메시지:
 *   { type: "ready",  id, version }              — 초기화 완료
 *   { type: "stdout", cellId, text }             — print() 출력
 *   { type: "stderr", cellId, text }             — 에러 출력
 *   { type: "result", id, cellId, value, timeMs }— 실행 완료 (반환값)
 *   { type: "error",  id, cellId, message, name }— 실행 실패
 */
self.onmessage = async (event) => {
  const msg = event.data;

  try {
    if (msg.type === "init") {
      const py = await initPyodide();
      const version = py.runPython("import sys; sys.version.split()[0]");
      self.postMessage({ type: "ready", id: msg.id, version });
      return;
    }

    if (msg.type === "writeFiles") {
      const py = await initPyodide();
      const { id, files } = msg;
      // files = [{ path: "main.py", content: "..." }, ...]
      for (const f of files) {
        py.FS.writeFile(`/home/pyodide/${f.path}`, f.content);
      }
      self.postMessage({ type: "filesWritten", id });
      return;
    }

    if (msg.type === "run") {
      const py = await initPyodide();
      const { id, cellId, code } = msg;

      // 매 실행마다 stdout/stderr 콜백을 cellId에 바인딩
      py.setStdout({
        batched: (text) => self.postMessage({ type: "stdout", cellId, text }),
      });
      py.setStderr({
        batched: (text) => self.postMessage({ type: "stderr", cellId, text }),
      });

      const start = performance.now();
      let value = undefined;

      try {
        // runPythonAsync는 top-level await도 지원
        const result = await py.runPythonAsync(code);
        // 마지막 표현식의 값을 문자열로 변환 (None이 아닐 때만)
        if (result !== undefined && result !== null) {
          try {
            value = result.toString();
          } catch {
            value = String(result);
          }
          // PyProxy 메모리 해제
          if (typeof result.destroy === "function") {
            result.destroy();
          }
        }
      } catch (err) {
        const timeMs = performance.now() - start;
        self.postMessage({
          type: "error",
          id,
          cellId,
          message: err.message || String(err),
          name: err.name || "PythonError",
          timeMs,
        });
        return;
      }

      const timeMs = performance.now() - start;
      self.postMessage({ type: "result", id, cellId, value, timeMs });
      return;
    }

    // 알 수 없는 메시지
    self.postMessage({
      type: "error",
      id: msg.id,
      message: `Unknown message type: ${msg.type}`,
    });
  } catch (err) {
    self.postMessage({
      type: "error",
      id: msg.id,
      message: err.message || String(err),
      name: err.name || "WorkerError",
    });
  }
};

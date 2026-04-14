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

    // ── matplotlib 기본 백엔드를 'Agg' 로 강제 (v3.16.1 hotfix) ──
    // Pyodide 0.28 의 matplotlib 은 import 시 기본으로 matplotlib_pyodide
    // (HTML5 캔버스 백엔드) 를 찾으려 하는데, 이 패키지는 별도 micropip 설치가
    // 필요하다. 학습 환경에선 그래프 렌더링이 필요 없으므로 헤드리스
    // 백엔드(Agg) 를 강제해 import 단계에서 ModuleNotFoundError 를 회피한다.
    // matplotlib 은 환경변수 MPLBACKEND 를 import 직전에 한 번만 읽으므로
    // 워커 init 단계에서 설정해 두면 모든 셀의 `import matplotlib.pyplot` 가
    // 안전하게 동작한다.
    pyodide.runPython(`
import os as _os
_os.environ["MPLBACKEND"] = "Agg"
del _os
    `);

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
        // ── 패키지 자동 로드 ──
        // runPythonAsync 는 자체적으로 패키지를 로드하지 않는다.
        // `import sklearn` / `import pandas` 같이 외부 패키지를 쓰는 코드의
        // ModuleNotFoundError 를 사전에 방지하기 위해 imports 를 스캔해
        // 필요한 패키지를 먼저 fetch 한다. Pyodide repodata 에 등록된
        // 패키지(numpy, pandas, scipy, scikit-learn, matplotlib 등) 는
        // 자동 처리. 미등록 패키지는 그대로 ModuleNotFoundError 로 나감.
        //
        // 첫 로드는 느리지만(특히 sklearn ~10MB) Pyodide 내부에 캐싱되므로
        // 이후 실행에선 즉시 사용 가능.
        try {
          const loaded = await py.loadPackagesFromImports(code, {
            messageCallback: (msg) => {
              // 진행 메시지를 stdout 으로 보여줘 "멈춘 것 같은" 느낌 제거
              self.postMessage({
                type: "stdout",
                cellId,
                text: `📦 ${msg}\n`,
              });
            },
            errorCallback: () => {
              // 개별 패키지 로드 실패는 무시하고, 본 실행에서 에러로 표면화
            },
          });
          // 로드된 패키지가 있으면 stdout 으로 요약 (선택)
          if (Array.isArray(loaded) && loaded.length > 0) {
            const names = loaded.map((p) => (typeof p === "string" ? p : p?.name)).filter(Boolean);
            if (names.length > 0) {
              self.postMessage({
                type: "stdout",
                cellId,
                text: `✓ 패키지 로드 완료: ${names.join(", ")}\n`,
              });
            }
          }
        } catch {
          // loadPackagesFromImports 자체가 실패해도 본 실행으로 넘어감
          // (어차피 import 에서 에러가 나면 사용자에게 명확히 표시됨)
        }

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

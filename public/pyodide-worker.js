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
    pyodide.runPython(`
import os as _os
_os.environ["MPLBACKEND"] = "Agg"
del _os
    `);

    // ── 한글 폰트(NanumGothic) 를 Pyodide FS 에 미리 배치 (v3.17.1) ──
    // 워커가 같은 origin 의 /fonts/NanumGothic-Regular.ttf 를 fetch 해서
    // /home/pyodide/fonts/ 에 저장. 실제 matplotlib 에 등록하는 단계는
    // 사용자 코드가 matplotlib 을 처음 쓸 때 lazy 하게 prepend 됨.
    try {
      const fontResp = await fetch("/fonts/NanumGothic-Regular.ttf");
      if (fontResp.ok) {
        const fontBytes = new Uint8Array(await fontResp.arrayBuffer());
        try {
          pyodide.FS.mkdirTree("/home/pyodide/fonts");
        } catch {
          // 이미 존재하면 무시
        }
        pyodide.FS.writeFile(
          "/home/pyodide/fonts/NanumGothic-Regular.ttf",
          fontBytes
        );
      }
    } catch {
      // 폰트 로드 실패해도 치명적이지 않음 — 한글이 □ 로 보일 뿐
    }

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
      const { id, cellId, code: rawCode } = msg;

      // ── matplotlib 사용 셀에 한글 폰트 setup 코드 자동 prepend (v3.17.1) ──
      // 폰트 등록은 처음 한 번만 (모듈 캐시 플래그로 idempotent).
      // matplotlib 안 쓰는 셀은 prepend 안 함 — 불필요한 import 비용 회피.
      const usesMatplotlib = /\bmatplotlib\b|\bpyplot\b|\bplt\b/.test(rawCode);
      const code = usesMatplotlib
        ? `# AIGoLab: 한글 폰트 + UserWarning 억제 자동 설정\nimport sys as _sys\nif "_aigolab_mpl_init" not in _sys.modules:\n    try:\n        import matplotlib as _mpl\n        import matplotlib.font_manager as _fm\n        import warnings as _w\n        import os.path as _op\n        _font_path = "/home/pyodide/fonts/NanumGothic-Regular.ttf"\n        if _op.exists(_font_path):\n            _fm.fontManager.addfont(_font_path)\n            _mpl.rcParams["font.family"] = "NanumGothic"\n            _mpl.rcParams["axes.unicode_minus"] = False\n        # 글리프 부재 경고는 1회 출력 후 억제 (사용자에게 노이즈)\n        _w.filterwarnings("ignore", message="Glyph .* missing from current font")\n        _w.filterwarnings("ignore", category=UserWarning, module="matplotlib")\n        _sys.modules["_aigolab_mpl_init"] = True\n        del _mpl, _fm, _w, _op, _font_path\n    except Exception:\n        pass\ndel _sys\n` + rawCode
        : rawCode;

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

        // ── matplotlib figure 자동 캡처 (v3.17.0) ──
        // 사용자가 matplotlib 을 썼고 열린 figure 가 있으면 PNG 로 저장해
        // base64 dataUrl 로 메인 스레드에 전송. 셀별 출력에 <img> 로 표시됨.
        // - plt.show() 호출 안 해도 자동 캡처 (Pyodide 는 GUI 가 없어 show() 가 no-op)
        // - 캡처 후 모든 figure close → 다음 셀에 잔재 안 남음
        try {
          const figuresJson = py.runPython(`
def __collect_mpl_figures():
    import sys
    if "matplotlib" not in sys.modules:
        return "[]"
    try:
        import matplotlib.pyplot as _plt
        import io as _io
        import base64 as _b64
        import json as _json
        nums = _plt.get_fignums()
        if not nums:
            return "[]"
        out = []
        for n in nums:
            try:
                fig = _plt.figure(n)
                buf = _io.BytesIO()
                fig.savefig(buf, format="png", bbox_inches="tight", dpi=100)
                buf.seek(0)
                out.append(_b64.b64encode(buf.read()).decode("ascii"))
            except Exception:
                continue
        _plt.close("all")
        return _json.dumps(out)
    except Exception:
        return "[]"

__collect_mpl_figures()
          `);
          if (typeof figuresJson === "string" && figuresJson !== "[]") {
            try {
              const arr = JSON.parse(figuresJson);
              for (const b64 of arr) {
                self.postMessage({
                  type: "figure",
                  cellId,
                  dataUrl: `data:image/png;base64,${b64}`,
                });
              }
            } catch {
              // JSON 파싱 실패 시 무시
            }
          }
        } catch {
          // figure 캡처 자체가 실패해도 사용자 코드 실행 결과는 정상 보고
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

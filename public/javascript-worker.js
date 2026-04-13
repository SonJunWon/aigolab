/**
 * JavaScript Web Worker.
 *
 * 메인 스레드의 javascriptRunner.ts와 메시지로 통신.
 *
 * 동작 원리:
 * - run 메시지를 받으면 eval로 실행
 * - console.log/info/warn/error를 가로채 stdout/stderr로 stream
 * - print() 함수를 Python 호환으로 제공
 * - 마지막 표현식의 값을 result로 반환
 *
 * 주의 — 셀 간 변수 공유 없음:
 * eval은 함수 스코프에서 호출되므로 각 셀은 독립 실행이다.
 * (Pyodide는 상태 공유, JS는 셀 단위 격리 — 학습 콘텐츠에서 명시할 것)
 */

const VERSION = "ES2022";

self.onmessage = function (e) {
  const { type, id, cellId, code } = e.data;

  if (type === "init") {
    self.postMessage({ type: "ready", id, version: VERSION });
    return;
  }

  if (type === "run") {
    runCode(id, cellId, code);
    return;
  }
};

function runCode(id, cellId, code) {
  const startTime = performance.now();

  // ── console / print 가로채기 ──
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalDebug = console.debug;

  const post = (stream, args) => {
    const text = args.map(formatValue).join(" ") + "\n";
    self.postMessage({ type: stream, cellId, text });
  };
  console.log = function () { post("stdout", Array.from(arguments)); };
  console.info = function () { post("stdout", Array.from(arguments)); };
  console.debug = function () { post("stdout", Array.from(arguments)); };
  console.warn = function () { post("stderr", Array.from(arguments)); };
  console.error = function () { post("stderr", Array.from(arguments)); };

  // Python 학습자 친화 — print() 도 지원
  self.print = function () { post("stdout", Array.from(arguments)); };

  try {
    // 직접 eval — 마지막 표현식 값을 캡처할 수 있음
    // (Function 생성자는 explicit return이 필요해서 마지막 표현식 캡처 불가)
    const result = eval(code);
    const value = result === undefined ? undefined : formatValue(result);

    self.postMessage({
      type: "result",
      id,
      value,
      timeMs: Math.round(performance.now() - startTime),
    });
  } catch (err) {
    self.postMessage({
      type: "error",
      id,
      message: (err && err.message) ? err.message : String(err),
      name: (err && err.name) ? err.name : "Error",
      timeMs: Math.round(performance.now() - startTime),
    });
  } finally {
    // 다음 실행을 위해 console 복원
    console.log = originalLog;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
    console.debug = originalDebug;
  }
}

/**
 * 셀 출력값을 사람이 보기 좋은 문자열로.
 * Python의 repr() 비슷한 역할.
 */
function formatValue(v) {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return v;
  if (typeof v === "function") {
    // 함수의 본문은 너무 길 수 있어 축약
    const name = v.name || "anonymous";
    return `[Function: ${name}]`;
  }
  if (typeof v === "symbol") return v.toString();
  if (typeof v === "bigint") return v.toString() + "n";
  if (typeof v === "number") {
    if (Number.isNaN(v)) return "NaN";
    if (!Number.isFinite(v)) return v > 0 ? "Infinity" : "-Infinity";
    return String(v);
  }
  if (typeof v === "boolean") return String(v);
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (v instanceof Date) return v.toISOString();
  if (v instanceof RegExp) return v.toString();
  if (v instanceof Map) {
    const entries = Array.from(v.entries())
      .map(([k, val]) => `${formatValue(k)} => ${formatValue(val)}`)
      .join(", ");
    return `Map(${v.size}) { ${entries} }`;
  }
  if (v instanceof Set) {
    const items = Array.from(v).map(formatValue).join(", ");
    return `Set(${v.size}) { ${items} }`;
  }
  if (Array.isArray(v)) {
    try {
      const items = v.map(formatValue).join(", ");
      return `[${items}]`;
    } catch {
      return "[...]";
    }
  }
  if (typeof v === "object") {
    try {
      // 순환 참조 안전한 JSON 출력
      const seen = new WeakSet();
      return JSON.stringify(v, (_key, val) => {
        if (typeof val === "object" && val !== null) {
          if (seen.has(val)) return "[Circular]";
          seen.add(val);
        }
        return val;
      }, 2);
    } catch {
      return String(v);
    }
  }
  return String(v);
}

/**
 * SQL Web Worker — sql.js (SQLite WASM) 기반.
 *
 * 동작 원리:
 * - importScripts 로 sql-wasm.js 로드
 * - initSqlJs 로 SQLite 초기화 (.wasm 파일 fetch)
 * - 기본 데이터베이스로 Chinook 로드 (상품/고객/노래 샘플 DB, ~1MB)
 * - run 메시지 받으면 db.exec(code) 실행
 *
 * 결과 형식:
 *   SELECT → table 메시지 (columns + rows)
 *   INSERT/UPDATE/DELETE/CREATE → stdout 메시지 ("N rows affected" 또는 "OK")
 *   에러 → error 메시지
 */

importScripts("/sql-wasm.js");

let SQL = null;       // sql.js 모듈
let db = null;        // 현재 데이터베이스 인스턴스
let initialized = false;

self.onmessage = async function (e) {
  const { type, id, cellId, code } = e.data;

  if (type === "init") {
    if (initialized) {
      self.postMessage({ type: "ready", id, version: "SQLite 3" });
      return;
    }
    try {
      SQL = await initSqlJs({
        locateFile: (file) => `/${file}`, // sql-wasm.wasm 위치
      });

      // Chinook DB 로드 (fetch → Uint8Array → SQL.Database)
      // cache-busting: 쿼리스트링으로 브라우저 캐시 완전 무시
      const res = await fetch("/chinook.sqlite?v=" + Date.now(), { cache: "no-store" });
      if (!res.ok) throw new Error("Chinook DB fetch failed: " + res.status);
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        throw new Error("Chinook DB가 HTML로 반환됨 — vercel.json rewrite 설정을 확인하세요");
      }
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 1000) {
        throw new Error("Chinook DB 크기가 비정상: " + buf.byteLength + " bytes");
      }
      db = new SQL.Database(new Uint8Array(buf));

      // 테이블 존재 검증 — Chinook DB가 제대로 로드됐는지 확인
      var tableCheck = db.exec("SELECT name FROM sqlite_master WHERE type='table' LIMIT 5");
      var tableCount = tableCheck.length > 0 ? tableCheck[0].values.length : 0;
      if (tableCount === 0) {
        // 테이블이 없으면 빈 DB — fetch가 잘못된 파일을 받았을 가능성
        throw new Error("Chinook DB 로드 실패: 테이블이 0개. fetch된 파일이 올바른 SQLite인지 확인하세요. (size: " + buf.byteLength + ")");
      }

      initialized = true;
      self.postMessage({ type: "ready", id, version: "SQLite 3 (Chinook, " + tableCount + " tables)" });
    } catch (err) {
      self.postMessage({
        type: "error",
        id,
        message: err && err.message ? err.message : String(err),
        name: "InitError",
        timeMs: 0,
      });
    }
    return;
  }

  if (type === "run") {
    runSql(id, cellId, code);
    return;
  }
};

function runSql(id, cellId, code) {
  const start = performance.now();
  if (!db) {
    self.postMessage({
      type: "error",
      id,
      message: "데이터베이스가 아직 준비되지 않았어요.",
      name: "NotReady",
      timeMs: 0,
    });
    return;
  }

  try {
    // db.exec — 여러 SQL을 ; 으로 구분해 실행, 각각의 결과 배열 반환
    // 결과 형식: [{ columns: ["id", "name"], values: [[1, "철수"], [2, "영희"]] }, ...]
    const results = db.exec(code);

    if (results.length === 0) {
      // SELECT가 아닌 문장 (INSERT/UPDATE/CREATE 등) — 변경된 행 수
      const changes = db.getRowsModified();
      self.postMessage({
        type: "stdout",
        cellId,
        text: changes > 0
          ? `✓ 실행 완료 (${changes}개 행 영향)\n`
          : "✓ 실행 완료\n",
      });
    } else {
      // SELECT 결과 — 각 결과셋을 table 메시지로
      for (const r of results) {
        self.postMessage({
          type: "table",
          cellId,
          columns: r.columns,
          rows: r.values.map((row) => row.map(formatCell)),
          rowCount: r.values.length,
        });
      }
    }

    self.postMessage({
      type: "result",
      id,
      timeMs: Math.round(performance.now() - start),
    });
  } catch (err) {
    self.postMessage({
      type: "error",
      id,
      message: err && err.message ? err.message : String(err),
      name: "SqlError",
      timeMs: Math.round(performance.now() - start),
    });
  }
}

/** SQLite cell 값을 표시용 문자열로 변환 (null/Uint8Array 처리) */
function formatCell(v) {
  if (v === null) return null;
  if (v === undefined) return null;
  if (v instanceof Uint8Array) return `<BLOB ${v.length} bytes>`;
  return v;
}

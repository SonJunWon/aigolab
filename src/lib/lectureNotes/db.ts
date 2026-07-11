/**
 * 강의 정리 — IndexedDB 저장소 (자체 포함, 외부 의존 없음).
 *
 * stores:
 *   chunks — 녹음 청크 (keyPath "key" = `${sessionId}:${seq}`), 크래시 대비 즉시 저장
 *   notes  — 완성된 강의 노트 (keyPath "id")
 */

import type { LectureNote, RecordingChunk } from "./types";

const DB_NAME = "aigolab-lecture-notes";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("chunks")) {
        const s = db.createObjectStore("chunks", { keyPath: "key" });
        s.createIndex("bySession", "sessionId");
      }
      if (!db.objectStoreNames.contains("notes")) {
        db.createObjectStore("notes", { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx<T>(
  store: "chunks" | "notes",
  mode: IDBTransactionMode,
  run: (s: IDBObjectStore) => IDBRequest<T> | IDBRequest,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = run(t.objectStore(store));
        req.onsuccess = () => resolve(req.result as T);
        req.onerror = () => reject(req.error);
      }),
  );
}

// ── chunks ──
export function putChunk(chunk: RecordingChunk): Promise<unknown> {
  return tx("chunks", "readwrite", (s) => s.put(chunk));
}

export async function getSessionChunks(sessionId: string): Promise<RecordingChunk[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const idx = db.transaction("chunks", "readonly").objectStore("chunks").index("bySession");
    const req = idx.getAll(sessionId);
    req.onsuccess = () =>
      resolve((req.result as RecordingChunk[]).sort((a, b) => a.seq - b.seq));
    req.onerror = () => reject(req.error);
  });
}

/** 세션 청크 일괄 삭제 (원본 폐기 — 기본 동작) */
export async function deleteSessionChunks(sessionId: string): Promise<void> {
  const chunks = await getSessionChunks(sessionId);
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction("chunks", "readwrite");
    const s = t.objectStore("chunks");
    for (const c of chunks) s.delete(c.key);
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}

/** 미완 세션 목록 (크래시 복구용) — 세션ID별 청크 수 */
export async function listOrphanSessions(): Promise<{ sessionId: string; chunks: number; totalSec: number }[]> {
  const all = await tx<RecordingChunk[]>("chunks", "readonly", (s) => s.getAll());
  const map = new Map<string, { chunks: number; totalSec: number }>();
  for (const c of all) {
    const cur = map.get(c.sessionId) ?? { chunks: 0, totalSec: 0 };
    cur.chunks += 1;
    cur.totalSec += c.durationSec;
    map.set(c.sessionId, cur);
  }
  return [...map.entries()].map(([sessionId, v]) => ({ sessionId, ...v }));
}

// ── notes ──
export function putNote(note: LectureNote): Promise<unknown> {
  return tx("notes", "readwrite", (s) => s.put(note));
}

export function getNote(id: string): Promise<LectureNote | undefined> {
  return tx("notes", "readonly", (s) => s.get(id));
}

export async function listNotes(): Promise<LectureNote[]> {
  const all = await tx<LectureNote[]>("notes", "readonly", (s) => s.getAll());
  return all.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}

export function deleteNote(id: string): Promise<unknown> {
  return tx("notes", "readwrite", (s) => s.delete(id));
}

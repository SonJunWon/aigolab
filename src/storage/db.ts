/**
 * IndexedDB 설정 + 싱글톤 DB 인스턴스.
 *
 * `idb` 라이브러리를 통해 promise 기반으로 다룬다.
 * 브라우저 지원: 모든 모던 브라우저 (Chrome 23+, Firefox 16+, Safari 10+).
 */

import { openDB, type DBSchema, type IDBPDatabase } from "idb";

// ─────────────────────────────────────────────────────────
// 스키마 정의
// ─────────────────────────────────────────────────────────

export interface StoredCell {
  /** 로컬 생성 id는 세션마다 바뀌므로 저장하지 않고, 배열 순서로 식별 */
  type: "code" | "markdown";
  source: string;
}

export interface StoredNotebook {
  /** key: lessonId (예: "python-beginner-01") 또는 "playground:<언어>" */
  id: string;
  cells: StoredCell[];
  updatedAt: number;
}

export interface StoredProgress {
  /** key: "<language>:<track>" (예: "python:beginner") */
  id: string;
  language: string;
  track: string;
  /** 완료한 레슨 id 목록 */
  completedLessons: string[];
  /** 마지막으로 본 레슨 id */
  currentLesson?: string;
  lastStudiedAt: number;
}

interface NotebookDB extends DBSchema {
  notebooks: {
    key: string;
    value: StoredNotebook;
  };
  progress: {
    key: string;
    value: StoredProgress;
  };
}

// ─────────────────────────────────────────────────────────
// DB 초기화 (싱글톤)
// ─────────────────────────────────────────────────────────

const DB_NAME = "python-notebook";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<NotebookDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<NotebookDB>> {
  if (!dbPromise) {
    dbPromise = openDB<NotebookDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // v1: 최초 생성
        if (oldVersion < 1) {
          db.createObjectStore("notebooks", { keyPath: "id" });
          db.createObjectStore("progress", { keyPath: "id" });
        }
        // 이후 버전 마이그레이션은 여기에 추가
      },
    });
  }
  return dbPromise;
}

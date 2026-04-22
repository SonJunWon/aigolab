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
  type: "code" | "markdown" | "llm-code";
  source: string;
}

export interface StoredNotebook {
  /** key: lessonId (예: "python-beginner-01") 또는 "playground:<언어>" */
  id: string;
  cells: StoredCell[];
  updatedAt: number;
  /**
   * 저장 시점의 lesson 콘텐츠 해시 (v3.18.5+).
   * 로드 시 현재 lesson 의 해시와 비교해 다르면 무효화.
   * Playground 등 lesson 이 없는 노트북은 undefined.
   */
  lessonHash?: string;
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

// ─── 마크다운 워크스페이스 (별도 DB) ─────────────────
export interface StoredMdFolder {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface StoredMdFile {
  id: string;
  name: string;
  folderId: string | null;
  content: string;
  order: number;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

interface MdWorkspaceDB extends DBSchema {
  mdFolders: {
    key: string;
    value: StoredMdFolder;
  };
  mdFiles: {
    key: string;
    value: StoredMdFile;
  };
}

// ─────────────────────────────────────────────────────────
// DB 초기화 (싱글톤)
// ─────────────────────────────────────────────────────────

const DB_NAME = "python-notebook";
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<NotebookDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<NotebookDB>> {
  if (!dbPromise) {
    dbPromise = (async () => {
      // 먼저 현재 DB 버전을 확인
      const databases = await indexedDB.databases();
      const existing = databases.find((d) => d.name === DB_NAME);
      // 기존 DB가 v1이든 v2이든, 그 버전으로 열어서 업그레이드 차단 방지
      const targetVersion = existing?.version
        ? Math.max(existing.version, DB_VERSION)
        : DB_VERSION;

      return openDB<NotebookDB>(DB_NAME, targetVersion, {
        upgrade(db, oldVersion) {
          if (oldVersion < 1) {
            db.createObjectStore("notebooks", { keyPath: "id" });
            db.createObjectStore("progress", { keyPath: "id" });
          }
          // v2+: 마크다운 스토어는 별도 DB(aigolab-markdown)로 이관됨.
          // 여기서는 추가 작업 없음.
        },
        blocked() {
          // 다른 탭에서 구 버전 DB가 열려있으면 → 캐시 무효화 후 재시도
          console.warn("[DB] 업그레이드 차단됨 — 다른 탭을 닫아주세요");
          dbPromise = null;
        },
        blocking() {
          // 이 탭이 다른 탭의 업그레이드를 막고 있을 때
          dbPromise = null;
        },
      });
    })();
  }
  return dbPromise;
}

// ─── 마크다운 워크스페이스 전용 DB (별도) ───
const MD_DB_NAME = "aigolab-markdown";
const MD_DB_VERSION = 1;

let mdDbPromise: Promise<IDBPDatabase<MdWorkspaceDB>> | null = null;

export function getMdDB(): Promise<IDBPDatabase<MdWorkspaceDB>> {
  if (!mdDbPromise) {
    mdDbPromise = openDB<MdWorkspaceDB>(MD_DB_NAME, MD_DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore("mdFolders", { keyPath: "id" });
          db.createObjectStore("mdFiles", { keyPath: "id" });
        }
      },
    });
  }
  return mdDbPromise;
}

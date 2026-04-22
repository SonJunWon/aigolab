/**
 * 마크다운 워크스페이스 상태 관리 — Zustand + IndexedDB
 *
 * 폴더/파일 CRUD, 드래그 정렬, 검색, 기본 폴더 초기화
 */

import { create } from "zustand";
import { getDB, type StoredMdFolder, type StoredMdFile } from "../storage/db";

/* ─── 상태 타입 ─── */
interface MdFileState {
  folders: StoredMdFolder[];
  files: StoredMdFile[];
  activeFileId: string | null;
  searchQuery: string;
  initialized: boolean;

  // 초기화
  init: () => Promise<void>;

  // 폴더 CRUD
  createFolder: (name: string, parentId?: string | null) => Promise<StoredMdFolder>;
  renameFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<boolean>;
  reorderFolder: (id: string, newOrder: number) => Promise<void>;

  // 파일 CRUD
  createFile: (name: string, folderId?: string | null) => Promise<StoredMdFile>;
  renameFile: (id: string, name: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  duplicateFile: (id: string) => Promise<StoredMdFile>;
  moveFile: (fileId: string, targetFolderId: string | null) => Promise<void>;
  updateFileContent: (id: string, content: string) => Promise<void>;
  reorderFile: (id: string, newOrder: number) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;

  // UI
  setActiveFile: (id: string | null) => void;
  setSearchQuery: (query: string) => void;

  // 헬퍼
  getActiveFile: () => StoredMdFile | undefined;
  getFilesInFolder: (folderId: string | null) => StoredMdFile[];
  getFolderFileCount: (folderId: string) => number;
  canDeleteFolder: (folderId: string) => boolean;
}

/* ─── 기본 폴더 ─── */
const DEFAULT_FOLDERS: Omit<StoredMdFolder, "id" | "createdAt" | "updatedAt">[] = [
  { name: "프롬프트", parentId: null, order: 0, isDefault: true },
  { name: "학습노트", parentId: null, order: 1, isDefault: true },
  { name: "일기", parentId: null, order: 2, isDefault: true },
  { name: "프로젝트", parentId: null, order: 3, isDefault: true },
];

function genId(): string {
  return crypto.randomUUID();
}

function ensureMdExt(name: string): string {
  return name.endsWith(".md") ? name : `${name}.md`;
}

/* ─── 스토어 ─── */
export const useMdFileStore = create<MdFileState>((set, get) => ({
  folders: [],
  files: [],
  activeFileId: null,
  searchQuery: "",
  initialized: false,

  // ─── 초기화: IDB에서 로드 + 기본 폴더 생성 ───
  init: async () => {
    if (get().initialized) return;
    const db = await getDB();

    let folders = await db.getAll("mdFolders");
    const files = await db.getAll("mdFiles");

    // 기본 폴더가 없으면 생성
    if (folders.length === 0) {
      const now = Date.now();
      const newFolders: StoredMdFolder[] = DEFAULT_FOLDERS.map((f) => ({
        ...f,
        id: genId(),
        createdAt: now,
        updatedAt: now,
      }));
      const tx = db.transaction("mdFolders", "readwrite");
      for (const f of newFolders) {
        await tx.store.put(f);
      }
      await tx.done;
      folders = newFolders;
    }

    set({
      folders: folders.sort((a, b) => a.order - b.order),
      files: files.sort((a, b) => a.order - b.order),
      initialized: true,
    });
  },

  // ─── 폴더 CRUD ───
  createFolder: async (name, parentId = null) => {
    const { folders } = get();
    const maxOrder = folders
      .filter((f) => f.parentId === parentId)
      .reduce((max, f) => Math.max(max, f.order), -1);

    const folder: StoredMdFolder = {
      id: genId(),
      name,
      parentId: parentId ?? null,
      order: maxOrder + 1,
      isDefault: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const db = await getDB();
    await db.put("mdFolders", folder);
    set({ folders: [...get().folders, folder].sort((a, b) => a.order - b.order) });
    return folder;
  },

  renameFolder: async (id, name) => {
    const db = await getDB();
    const folder = await db.get("mdFolders", id);
    if (!folder) return;
    folder.name = name;
    folder.updatedAt = Date.now();
    await db.put("mdFolders", folder);
    set({ folders: get().folders.map((f) => (f.id === id ? folder : f)) });
  },

  deleteFolder: async (id) => {
    if (!get().canDeleteFolder(id)) return false;
    const db = await getDB();
    await db.delete("mdFolders", id);
    set({ folders: get().folders.filter((f) => f.id !== id) });
    return true;
  },

  reorderFolder: async (id, newOrder) => {
    const db = await getDB();
    const folder = await db.get("mdFolders", id);
    if (!folder) return;
    folder.order = newOrder;
    folder.updatedAt = Date.now();
    await db.put("mdFolders", folder);
    set({ folders: get().folders.map((f) => (f.id === id ? folder : f)).sort((a, b) => a.order - b.order) });
  },

  // ─── 파일 CRUD ───
  createFile: async (name, folderId = null) => {
    const { files } = get();
    const maxOrder = files
      .filter((f) => f.folderId === folderId)
      .reduce((max, f) => Math.max(max, f.order), -1);

    const file: StoredMdFile = {
      id: genId(),
      name: ensureMdExt(name),
      folderId: folderId ?? null,
      content: "",
      order: maxOrder + 1,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const db = await getDB();
    await db.put("mdFiles", file);
    set({
      files: [...get().files, file].sort((a, b) => a.order - b.order),
      activeFileId: file.id,
    });
    return file;
  },

  renameFile: async (id, name) => {
    const db = await getDB();
    const file = await db.get("mdFiles", id);
    if (!file) return;
    file.name = ensureMdExt(name);
    file.updatedAt = Date.now();
    await db.put("mdFiles", file);
    set({ files: get().files.map((f) => (f.id === id ? file : f)) });
  },

  deleteFile: async (id) => {
    const db = await getDB();
    await db.delete("mdFiles", id);
    const { activeFileId } = get();
    set({
      files: get().files.filter((f) => f.id !== id),
      activeFileId: activeFileId === id ? null : activeFileId,
    });
  },

  duplicateFile: async (id) => {
    const db = await getDB();
    const original = await db.get("mdFiles", id);
    if (!original) throw new Error("파일을 찾을 수 없습니다.");

    const baseName = original.name.replace(/\.md$/, "");
    const copy: StoredMdFile = {
      ...original,
      id: genId(),
      name: `${baseName}_복사.md`,
      order: original.order + 0.5,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.put("mdFiles", copy);
    set({ files: [...get().files, copy].sort((a, b) => a.order - b.order) });
    return copy;
  },

  moveFile: async (fileId, targetFolderId) => {
    const db = await getDB();
    const file = await db.get("mdFiles", fileId);
    if (!file) return;
    file.folderId = targetFolderId;
    file.updatedAt = Date.now();
    await db.put("mdFiles", file);
    set({ files: get().files.map((f) => (f.id === fileId ? file : f)) });
  },

  updateFileContent: async (id, content) => {
    const db = await getDB();
    const file = await db.get("mdFiles", id);
    if (!file) return;
    file.content = content;
    file.updatedAt = Date.now();
    await db.put("mdFiles", file);
    set({ files: get().files.map((f) => (f.id === id ? file : f)) });
  },

  reorderFile: async (id, newOrder) => {
    const db = await getDB();
    const file = await db.get("mdFiles", id);
    if (!file) return;
    file.order = newOrder;
    file.updatedAt = Date.now();
    await db.put("mdFiles", file);
    set({ files: get().files.map((f) => (f.id === id ? file : f)).sort((a, b) => a.order - b.order) });
  },

  toggleFavorite: async (id) => {
    const db = await getDB();
    const file = await db.get("mdFiles", id);
    if (!file) return;
    file.isFavorite = !file.isFavorite;
    file.updatedAt = Date.now();
    await db.put("mdFiles", file);
    set({ files: get().files.map((f) => (f.id === id ? file : f)) });
  },

  // ─── UI ───
  setActiveFile: (id) => set({ activeFileId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // ─── 헬퍼 ───
  getActiveFile: () => {
    const { files, activeFileId } = get();
    return files.find((f) => f.id === activeFileId);
  },

  getFilesInFolder: (folderId) => {
    return get().files.filter((f) => f.folderId === folderId);
  },

  getFolderFileCount: (folderId) => {
    return get().files.filter((f) => f.folderId === folderId).length;
  },

  canDeleteFolder: (folderId) => {
    return get().files.filter((f) => f.folderId === folderId).length === 0;
  },
}));

import { create } from "zustand";

/**
 * IDE 모드의 파일 관리 스토어.
 *
 * 폴더 구조: 파일 이름이 경로를 포함 (예: "src/utils.py").
 * 폴더는 명시적으로 저장하지 않고, 파일 경로에서 추론.
 */

export interface FileEntry {
  /** 파일 경로 (예: "main.py", "src/utils.py") */
  name: string;
  /** 파일 내용 */
  content: string;
  /** 언어 (Monaco 문법 강조용) */
  language: string;
}

export interface OutputLine {
  stream: "stdout" | "stderr" | "error" | "result" | "system";
  text: string;
}

/** 프로젝트 저장 상태 */
export type ProjectSaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

interface FileState {
  files: Record<string, FileEntry>;
  activeFile: string | null;
  openTabs: string[];
  output: OutputLine[];
  running: boolean;
  /** 접혀있는 폴더 경로 Set */
  collapsedFolders: Set<string>;
  /** 프로젝트가 IDB에서 로드됐는지 */
  loaded: boolean;
  /** 디스크(IDB)에 저장되지 않은 변경이 있는 파일 경로 Set */
  dirtyFiles: Set<string>;
  /** 프로젝트 전체 저장 상태 */
  saveStatus: ProjectSaveStatus;

  // ── 파일 조작 ────────────────────────
  createFile: (name: string, content?: string) => void;
  createFolder: (path: string) => void;
  deleteFile: (name: string) => void;
  deleteFolder: (path: string) => void;
  renameFile: (oldName: string, newName: string) => void;
  updateContent: (name: string, content: string) => void;
  /** 파일을 다른 폴더로 이동. targetFolder = "" 이면 루트로. */
  moveFile: (filePath: string, targetFolder: string) => boolean;
  /** 폴더(하위 전체)를 다른 폴더로 이동. targetFolder = "" 이면 루트로. */
  moveFolder: (folderPath: string, targetFolder: string) => boolean;

  // ── 폴더 토글 ────────────────────────
  toggleFolder: (path: string) => void;

  // ── 탭 / 활성 파일 ────────────────────
  openFile: (name: string) => void;
  closeTab: (name: string) => void;

  // ── 출력 ──────────────────────────────
  appendOutput: (line: OutputLine) => void;
  clearOutput: () => void;
  setRunning: (running: boolean) => void;

  // ── 저장 상태 ────────────────────────
  setSaveStatus: (status: ProjectSaveStatus) => void;
  markAllSaved: () => void;

  // ── 전체 프로젝트 ────────────────────
  /** IDB에서 복원 — dirty 표시 없음 */
  loadProject: (files: Record<string, FileEntry>) => void;
  /** 외부(ZIP 등)에서 가져옴 — 전체 dirty 표시해서 autoSave가 IDB에 저장 */
  importFiles: (files: Record<string, FileEntry>) => void;
  resetToDefault: () => void;
  setLoaded: (loaded: boolean) => void;
  getFileList: () => FileEntry[];
  getFolders: () => string[];
}

export const DEFAULT_FILES: Record<string, FileEntry> = {
  "main.py": {
    name: "main.py",
    content: `# main.py — 실행 진입점
from src.utils import greet
from src.helpers import add

greet("Python")
print(f"3 + 5 = {add(3, 5)}")
`,
    language: "python",
  },
  "src/__init__.py": {
    name: "src/__init__.py",
    content: `# src 패키지 초기화 파일
`,
    language: "python",
  },
  "src/utils.py": {
    name: "src/utils.py",
    content: `# src/utils.py — 유틸리티 모듈

def greet(name):
    """인사 메시지를 출력합니다."""
    print(f"안녕하세요, {name}님!")
`,
    language: "python",
  },
  "src/helpers.py": {
    name: "src/helpers.py",
    content: `# src/helpers.py — 헬퍼 함수

def add(a, b):
    """두 수를 더합니다."""
    return a + b

def multiply(a, b):
    """두 수를 곱합니다."""
    return a * b
`,
    language: "python",
  },
};

export const useFileStore = create<FileState>((set, get) => ({
  files: DEFAULT_FILES,
  activeFile: "main.py",
  openTabs: ["main.py"],
  output: [],
  running: false,
  collapsedFolders: new Set(),
  loaded: false,
  dirtyFiles: new Set(),
  saveStatus: "idle",

  createFile: (name, content = "") => {
    const lang = name.endsWith(".py") ? "python" : "plaintext";
    set((s) => ({
      files: { ...s.files, [name]: { name, content, language: lang } },
      openTabs: [...s.openTabs, name],
      activeFile: name,
      dirtyFiles: new Set(s.dirtyFiles).add(name),
      saveStatus: "dirty",
    }));
  },

  createFolder: (path) => {
    // 폴더는 __init__.py 파일로 표현 (Python 패키지)
    const initPath = path.endsWith("/")
      ? `${path}__init__.py`
      : `${path}/__init__.py`;
    const { files } = get();
    if (!files[initPath]) {
      set((s) => ({
        files: {
          ...s.files,
          [initPath]: {
            name: initPath,
            content: `# ${path.replace(/\/$/, "")} 패키지\n`,
            language: "python",
          },
        },
        dirtyFiles: new Set(s.dirtyFiles).add(initPath),
        saveStatus: "dirty",
      }));
    }
  },

  deleteFile: (name) =>
    set((s) => {
      const next = { ...s.files };
      delete next[name];
      const tabs = s.openTabs.filter((t) => t !== name);
      const dirty = new Set(s.dirtyFiles);
      dirty.delete(name);
      return {
        files: next,
        openTabs: tabs,
        activeFile:
          s.activeFile === name
            ? tabs[tabs.length - 1] ?? null
            : s.activeFile,
        dirtyFiles: dirty,
        saveStatus: "dirty",
      };
    }),

  deleteFolder: (path) =>
    set((s) => {
      const prefix = path.endsWith("/") ? path : `${path}/`;
      const next: Record<string, FileEntry> = {};
      for (const [k, v] of Object.entries(s.files)) {
        if (!k.startsWith(prefix)) next[k] = v;
      }
      const tabs = s.openTabs.filter((t) => !t.startsWith(prefix));
      const dirty = new Set<string>();
      for (const p of s.dirtyFiles) {
        if (!p.startsWith(prefix)) dirty.add(p);
      }
      return {
        files: next,
        openTabs: tabs,
        activeFile:
          s.activeFile && s.activeFile.startsWith(prefix)
            ? tabs[tabs.length - 1] ?? null
            : s.activeFile,
        dirtyFiles: dirty,
        saveStatus: "dirty",
      };
    }),

  renameFile: (oldName, newName) =>
    set((s) => {
      const entry = s.files[oldName];
      if (!entry) return s;
      const next = { ...s.files };
      delete next[oldName];
      next[newName] = { ...entry, name: newName };
      const dirty = new Set(s.dirtyFiles);
      // 이름이 바뀌면 디스크 상의 이전 이름과는 다른 파일이므로 dirty로 표시
      dirty.delete(oldName);
      dirty.add(newName);
      return {
        files: next,
        openTabs: s.openTabs.map((t) => (t === oldName ? newName : t)),
        activeFile: s.activeFile === oldName ? newName : s.activeFile,
        dirtyFiles: dirty,
        saveStatus: "dirty",
      };
    }),

  updateContent: (name, content) =>
    set((s) => {
      if (s.files[name]?.content === content) return s;
      const dirty = new Set(s.dirtyFiles);
      dirty.add(name);
      return {
        files: { ...s.files, [name]: { ...s.files[name], content } },
        dirtyFiles: dirty,
        saveStatus: "dirty",
      };
    }),

  moveFile: (filePath, targetFolder) => {
    const state = get();
    const entry = state.files[filePath];
    if (!entry) return false;
    const baseName = filePath.includes("/")
      ? filePath.slice(filePath.lastIndexOf("/") + 1)
      : filePath;
    const prefix = targetFolder ? `${targetFolder}/` : "";
    const newPath = `${prefix}${baseName}`;
    if (newPath === filePath) return false; // 같은 위치
    if (state.files[newPath]) return false; // 충돌
    // 기존 renameFile 로직 재사용 (dirty 표시 + 탭 갱신 포함)
    state.renameFile(filePath, newPath);
    return true;
  },

  moveFolder: (folderPath, targetFolder) => {
    const state = get();
    const srcPrefix = folderPath.endsWith("/") ? folderPath : `${folderPath}/`;
    const srcBase = folderPath.endsWith("/")
      ? folderPath.slice(0, -1)
      : folderPath;
    const leafName = srcBase.includes("/")
      ? srcBase.slice(srcBase.lastIndexOf("/") + 1)
      : srcBase;

    // 자기 자신 또는 자기 하위 폴더로는 이동 불가
    if (targetFolder === srcBase) return false;
    if (targetFolder.startsWith(srcPrefix)) return false;

    const destBase = targetFolder ? `${targetFolder}/${leafName}` : leafName;
    const destPrefix = `${destBase}/`;
    if (destBase === srcBase) return false;

    // 이동 대상 수집
    const affectedPaths = Object.keys(state.files).filter((p) =>
      p.startsWith(srcPrefix)
    );
    if (affectedPaths.length === 0) return false;

    // 목적지 충돌 검사
    for (const oldPath of affectedPaths) {
      const newPath = oldPath.replace(srcPrefix, destPrefix);
      if (state.files[newPath]) return false;
    }

    set((s) => {
      const nextFiles = { ...s.files };
      const nextTabs = [...s.openTabs];
      const nextDirty = new Set(s.dirtyFiles);
      let nextActive = s.activeFile;

      for (const oldPath of affectedPaths) {
        const newPath = oldPath.replace(srcPrefix, destPrefix);
        const entry = nextFiles[oldPath];
        delete nextFiles[oldPath];
        nextFiles[newPath] = { ...entry, name: newPath };

        const tabIdx = nextTabs.indexOf(oldPath);
        if (tabIdx >= 0) nextTabs[tabIdx] = newPath;
        if (nextActive === oldPath) nextActive = newPath;

        nextDirty.delete(oldPath);
        nextDirty.add(newPath);
      }

      return {
        files: nextFiles,
        openTabs: nextTabs,
        activeFile: nextActive,
        dirtyFiles: nextDirty,
        saveStatus: "dirty",
      };
    });
    return true;
  },

  toggleFolder: (path) =>
    set((s) => {
      const next = new Set(s.collapsedFolders);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return { collapsedFolders: next };
    }),

  openFile: (name) =>
    set((s) => ({
      activeFile: name,
      openTabs: s.openTabs.includes(name)
        ? s.openTabs
        : [...s.openTabs, name],
    })),

  closeTab: (name) =>
    set((s) => {
      const tabs = s.openTabs.filter((t) => t !== name);
      return {
        openTabs: tabs,
        activeFile:
          s.activeFile === name
            ? tabs[tabs.length - 1] ?? null
            : s.activeFile,
      };
    }),

  appendOutput: (line) => set((s) => ({ output: [...s.output, line] })),
  clearOutput: () => set({ output: [] }),
  setRunning: (running) => set({ running }),

  setSaveStatus: (status) => set({ saveStatus: status }),
  markAllSaved: () =>
    set({ dirtyFiles: new Set(), saveStatus: "saved" }),

  loadProject: (files) =>
    set({
      files,
      activeFile: Object.keys(files).find((f) => !f.includes("/")) ?? Object.keys(files)[0] ?? null,
      openTabs: [Object.keys(files).find((f) => !f.includes("/")) ?? Object.keys(files)[0]].filter(Boolean) as string[],
      output: [],
      loaded: true,
      dirtyFiles: new Set(),
      saveStatus: "saved",
    }),

  importFiles: (files) =>
    set({
      files,
      activeFile: Object.keys(files).find((f) => !f.includes("/")) ?? Object.keys(files)[0] ?? null,
      openTabs: [Object.keys(files).find((f) => !f.includes("/")) ?? Object.keys(files)[0]].filter(Boolean) as string[],
      output: [],
      loaded: true,
      dirtyFiles: new Set(Object.keys(files)),
      saveStatus: "dirty",
      collapsedFolders: new Set(),
    }),

  resetToDefault: () =>
    set({
      files: { ...DEFAULT_FILES },
      activeFile: "main.py",
      openTabs: ["main.py"],
      output: [],
      loaded: true,
      dirtyFiles: new Set(Object.keys(DEFAULT_FILES)),
      saveStatus: "dirty",
      collapsedFolders: new Set(),
    }),

  setLoaded: (loaded) => set({ loaded }),

  getFileList: () => Object.values(get().files),
  getFolders: () => {
    const folders = new Set<string>();
    for (const name of Object.keys(get().files)) {
      const parts = name.split("/");
      for (let i = 1; i < parts.length; i++) {
        folders.add(parts.slice(0, i).join("/"));
      }
    }
    return [...folders].sort();
  },
}));

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

  // ── 파일 조작 ────────────────────────
  createFile: (name: string, content?: string) => void;
  createFolder: (path: string) => void;
  deleteFile: (name: string) => void;
  deleteFolder: (path: string) => void;
  renameFile: (oldName: string, newName: string) => void;
  updateContent: (name: string, content: string) => void;

  // ── 폴더 토글 ────────────────────────
  toggleFolder: (path: string) => void;

  // ── 탭 / 활성 파일 ────────────────────
  openFile: (name: string) => void;
  closeTab: (name: string) => void;

  // ── 출력 ──────────────────────────────
  appendOutput: (line: OutputLine) => void;
  clearOutput: () => void;
  setRunning: (running: boolean) => void;

  // ── 전체 프로젝트 ────────────────────
  loadProject: (files: Record<string, FileEntry>) => void;
  setLoaded: (loaded: boolean) => void;
  getFileList: () => FileEntry[];
  getFolders: () => string[];
}

const DEFAULT_FILES: Record<string, FileEntry> = {
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

  createFile: (name, content = "") => {
    const lang = name.endsWith(".py") ? "python" : "plaintext";
    set((s) => ({
      files: { ...s.files, [name]: { name, content, language: lang } },
      openTabs: [...s.openTabs, name],
      activeFile: name,
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
      }));
    }
  },

  deleteFile: (name) =>
    set((s) => {
      const next = { ...s.files };
      delete next[name];
      const tabs = s.openTabs.filter((t) => t !== name);
      return {
        files: next,
        openTabs: tabs,
        activeFile:
          s.activeFile === name
            ? tabs[tabs.length - 1] ?? null
            : s.activeFile,
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
      return {
        files: next,
        openTabs: tabs,
        activeFile:
          s.activeFile && s.activeFile.startsWith(prefix)
            ? tabs[tabs.length - 1] ?? null
            : s.activeFile,
      };
    }),

  renameFile: (oldName, newName) =>
    set((s) => {
      const entry = s.files[oldName];
      if (!entry) return s;
      const next = { ...s.files };
      delete next[oldName];
      next[newName] = { ...entry, name: newName };
      return {
        files: next,
        openTabs: s.openTabs.map((t) => (t === oldName ? newName : t)),
        activeFile: s.activeFile === oldName ? newName : s.activeFile,
      };
    }),

  updateContent: (name, content) =>
    set((s) => ({
      files: { ...s.files, [name]: { ...s.files[name], content } },
    })),

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

  loadProject: (files) =>
    set({
      files,
      activeFile: Object.keys(files).find((f) => !f.includes("/")) ?? Object.keys(files)[0] ?? null,
      openTabs: [Object.keys(files).find((f) => !f.includes("/")) ?? Object.keys(files)[0]].filter(Boolean) as string[],
      output: [],
      loaded: true,
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

import { useState } from "react";
import { useFileStore } from "../../store/fileStore";

/**
 * 재귀 폴더 트리 뷰.
 * 파일 경로에서 폴더 구조를 추론하여 트리로 표시.
 */

interface TreeNode {
  name: string;       // 마지막 세그먼트 (예: "utils.py" 또는 "src")
  fullPath: string;   // 전체 경로
  isFolder: boolean;
  children: TreeNode[];
}

function buildTree(filePaths: string[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const path of filePaths.sort()) {
    const parts = path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const segment = parts[i];
      const fullPath = parts.slice(0, i + 1).join("/");
      const isFolder = i < parts.length - 1;

      let existing = current.find(
        (n) => n.name === segment && n.isFolder === isFolder
      );
      if (!existing) {
        existing = { name: segment, fullPath, isFolder, children: [] };
        current.push(existing);
      }
      current = existing.children;
    }
  }

  // 폴더를 파일보다 먼저 정렬
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(root);

  return root;
}

// ─────────────────────────────────────────────────────────
// 드래그 데이터 포맷
// ─────────────────────────────────────────────────────────
interface DragPayload {
  type: "file" | "folder";
  path: string;
}
const DRAG_MIME = "application/x-aigolab-ide";

function encodePayload(p: DragPayload): string {
  return JSON.stringify(p);
}
function decodePayload(s: string): DragPayload | null {
  try {
    const parsed = JSON.parse(s);
    if (parsed && (parsed.type === "file" || parsed.type === "folder") && typeof parsed.path === "string") {
      return parsed;
    }
  } catch {
    // noop
  }
  return null;
}

export function FileTree() {
  const files = useFileStore((s) => s.files);
  const createFile = useFileStore((s) => s.createFile);
  const createFolder = useFileStore((s) => s.createFolder);
  const moveFile = useFileStore((s) => s.moveFile);
  const moveFolder = useFileStore((s) => s.moveFolder);

  const [creating, setCreating] = useState<"file" | "folder" | null>(null);
  const [newName, setNewName] = useState("");
  const [createParent, setCreateParent] = useState("");

  /** 현재 드롭 타겟 경로. "" = 루트, null = 없음 */
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const tree = buildTree(Object.keys(files));

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const prefix = createParent ? `${createParent}/` : "";

    if (creating === "file") {
      const fullName = `${prefix}${name.endsWith(".py") ? name : `${name}.py`}`;
      if (files[fullName]) {
        alert("같은 이름의 파일이 이미 있어요.");
        return;
      }
      createFile(fullName);
    } else if (creating === "folder") {
      createFolder(`${prefix}${name}`);
    }

    setNewName("");
    setCreating(null);
    setCreateParent("");
  };

  const startCreate = (type: "file" | "folder", parent = "") => {
    setCreating(type);
    setCreateParent(parent);
    setNewName("");
  };

  // ── 드롭 처리 ──────────────────────────────────────────
  // targetFolder: 목적 폴더. "" = 루트.
  const doDrop = (payload: DragPayload, targetFolder: string): boolean => {
    if (payload.type === "file") {
      return moveFile(payload.path, targetFolder);
    } else {
      return moveFolder(payload.path, targetFolder);
    }
  };

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropTarget(null);
    const raw = e.dataTransfer.getData(DRAG_MIME);
    const payload = decodePayload(raw);
    if (!payload) return;
    const ok = doDrop(payload, "");
    if (!ok) {
      // 이미 루트거나 충돌 — 조용히 무시
    }
  };

  const handleRootDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    // 자식 노드에서 stopPropagation을 안 했으면 루트가 타겟
    if (dropTarget !== "") setDropTarget("");
  };

  const handleRootDragLeave = (e: React.DragEvent) => {
    // 트리 영역 바깥으로 나갔을 때만 해제 (자식으로 이동한 경우는 leave만 나고 enter가 곧 발생)
    if (e.currentTarget === e.target) {
      setDropTarget(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-colab-subtle">
        <span className="text-xs font-medium text-colab-textDim uppercase tracking-wider">
          파일
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => startCreate("file")}
            className="w-7 h-7 flex items-center justify-center rounded text-sm text-colab-textDim
                       hover:text-colab-accent hover:bg-colab-hover transition-colors"
            title="새 파일"
          >
            📄
          </button>
          <button
            onClick={() => startCreate("folder")}
            className="w-7 h-7 flex items-center justify-center rounded text-sm text-colab-textDim
                       hover:text-colab-accent hover:bg-colab-hover transition-colors"
            title="새 폴더"
          >
            📁
          </button>
        </div>
      </div>

      {/* 트리 (루트 드롭 타겟) */}
      <div
        className={`flex-1 overflow-y-auto py-1 transition-colors ${
          dropTarget === "" ? "bg-colab-accent/5 ring-1 ring-inset ring-colab-accent/40" : ""
        }`}
        onDragOver={handleRootDragOver}
        onDragLeave={handleRootDragLeave}
        onDrop={handleRootDrop}
      >
        {tree.map((node) => (
          <TreeNodeView
            key={node.fullPath}
            node={node}
            depth={0}
            onCreateFile={(parent) => startCreate("file", parent)}
            dropTarget={dropTarget}
            setDropTarget={setDropTarget}
            doDrop={doDrop}
          />
        ))}
      </div>

      {/* 새 파일/폴더 입력 */}
      {creating && (
        <div className="px-3 py-2 border-t border-colab-subtle">
          <div className="text-[10px] text-colab-textDim mb-1">
            {creating === "file" ? "새 파일" : "새 폴더"}
            {createParent && ` (${createParent}/ 안에)`}
          </div>
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") {
                setCreating(null);
                setNewName("");
              }
            }}
            onBlur={() => {
              if (!newName.trim()) {
                setCreating(null);
                setNewName("");
              }
            }}
            placeholder={creating === "file" ? "파일명.py" : "폴더명"}
            className="w-full px-2 py-1 text-xs rounded bg-colab-bg border border-colab-subtle
                       text-colab-text focus:outline-none focus:border-colab-accent"
          />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 재귀 트리 노드
// ─────────────────────────────────────────────────────────

interface TreeNodeViewProps {
  node: TreeNode;
  depth: number;
  onCreateFile: (parent: string) => void;
  dropTarget: string | null;
  setDropTarget: (t: string | null) => void;
  doDrop: (payload: DragPayload, targetFolder: string) => boolean;
}

function TreeNodeView({
  node,
  depth,
  onCreateFile,
  dropTarget,
  setDropTarget,
  doDrop,
}: TreeNodeViewProps) {
  const activeFile = useFileStore((s) => s.activeFile);
  const files = useFileStore((s) => s.files);
  const dirtyFiles = useFileStore((s) => s.dirtyFiles);
  const openFile = useFileStore((s) => s.openFile);
  const deleteFile = useFileStore((s) => s.deleteFile);
  const deleteFolder = useFileStore((s) => s.deleteFolder);
  const renameFile = useFileStore((s) => s.renameFile);
  const collapsedFolders = useFileStore((s) => s.collapsedFolders);
  const toggleFolder = useFileStore((s) => s.toggleFolder);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const isCollapsed = collapsedFolders.has(node.fullPath);
  const paddingLeft = 12 + depth * 16;

  const startRename = () => {
    setEditName(node.name);
    setEditing(true);
  };

  const commitRename = () => {
    const trimmed = editName.trim();
    setEditing(false);
    if (!trimmed || trimmed === node.name) return;
    const parentPath = node.fullPath.includes("/")
      ? node.fullPath.slice(0, node.fullPath.lastIndexOf("/") + 1)
      : "";
    // 확장자가 없으면 원본 확장자 유지 (없으면 .py)
    const origExt = node.name.includes(".") ? node.name.slice(node.name.lastIndexOf(".")) : ".py";
    const finalName = trimmed.includes(".") ? trimmed : `${trimmed}${origExt}`;
    const newFullPath = `${parentPath}${finalName}`;
    if (newFullPath === node.fullPath) return;
    if (files[newFullPath]) {
      alert("같은 이름의 파일이 이미 있어요.");
      return;
    }
    renameFile(node.fullPath, newFullPath);
  };

  // ── 드래그 핸들러 (공통) ──────────────────────────
  const handleDragStart = (e: React.DragEvent) => {
    if (editing) {
      e.preventDefault();
      return;
    }
    const payload: DragPayload = {
      type: node.isFolder ? "folder" : "file",
      path: node.fullPath,
    };
    e.dataTransfer.setData(DRAG_MIME, encodePayload(payload));
    e.dataTransfer.effectAllowed = "move";
  };

  // ── 폴더 노드의 드롭 핸들러 ──────────────────────
  const handleFolderDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
    e.preventDefault();
    e.stopPropagation(); // 루트 드롭 방지
    e.dataTransfer.dropEffect = "move";
    if (dropTarget !== node.fullPath) setDropTarget(node.fullPath);
  };

  const handleFolderDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(null);
    const raw = e.dataTransfer.getData(DRAG_MIME);
    const payload = decodePayload(raw);
    if (!payload) return;
    doDrop(payload, node.fullPath);
  };

  if (node.isFolder) {
    const isDropHighlight = dropTarget === node.fullPath;
    return (
      <>
        <div
          className={`group flex items-center gap-1.5 py-1 cursor-pointer text-xs transition-colors
            ${isDropHighlight
              ? "bg-colab-accent/20 ring-1 ring-inset ring-colab-accent text-colab-text"
              : "text-colab-textDim hover:text-colab-text hover:bg-colab-hover"}`}
          style={{ paddingLeft }}
          draggable
          onDragStart={handleDragStart}
          onDragOver={handleFolderDragOver}
          onDrop={handleFolderDrop}
          onClick={() => toggleFolder(node.fullPath)}
        >
          <span className="text-[10px]">{isCollapsed ? "▶" : "▼"}</span>
          <span>📁</span>
          <span className="flex-1">{node.name}</span>
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 pr-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateFile(node.fullPath);
              }}
              className="w-5 h-5 flex items-center justify-center rounded text-xs hover:text-colab-accent hover:bg-colab-hover"
              title="이 폴더에 새 파일"
            >
              +
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`"${node.fullPath}" 폴더와 안의 파일을 모두 삭제하시겠습니까?`)) {
                  deleteFolder(node.fullPath);
                }
              }}
              className="w-5 h-5 flex items-center justify-center rounded text-xs hover:text-colab-red hover:bg-colab-hover"
              title="폴더 삭제"
            >
              ✕
            </button>
          </div>
        </div>
        {!isCollapsed &&
          node.children.map((child) => (
            <TreeNodeView
              key={child.fullPath}
              node={child}
              depth={depth + 1}
              onCreateFile={onCreateFile}
              dropTarget={dropTarget}
              setDropTarget={setDropTarget}
              doDrop={doDrop}
            />
          ))}
      </>
    );
  }

  // 파일 노드
  const isActive = activeFile === node.fullPath;
  const isDirty = dirtyFiles.has(node.fullPath);

  return (
    <div
      className={`group flex items-center gap-1.5 py-1 cursor-pointer text-xs transition-colors
        ${isActive ? "bg-colab-accent/10 text-colab-accent" : "text-colab-text hover:bg-colab-hover"}`}
      style={{ paddingLeft }}
      draggable={!editing}
      onDragStart={handleDragStart}
      onClick={() => !editing && openFile(node.fullPath)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (!editing) startRename();
      }}
      title="드래그로 폴더 이동 · 더블클릭하면 이름 변경"
    >
      <span className="text-[10px] opacity-0">▶</span>
      <span>🐍</span>
      {editing ? (
        <input
          autoFocus
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") setEditing(false);
          }}
          onBlur={commitRename}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 px-1 py-0 text-xs rounded bg-colab-bg border border-colab-accent
                     text-colab-text focus:outline-none"
        />
      ) : (
        <>
          <span className="flex-1 truncate">{node.name}</span>
          {isDirty && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-colab-yellow shrink-0 mr-1"
              title="저장되지 않은 변경"
            />
          )}
          <div className="flex items-center gap-0.5 mr-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startRename();
              }}
              className="w-5 h-5 flex items-center justify-center rounded
                         text-xs text-colab-textDim hover:text-colab-accent hover:bg-colab-hover transition-all"
              title="이름 변경"
            >
              ✏
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`"${node.fullPath}" 파일을 삭제하시겠습니까?`)) {
                  deleteFile(node.fullPath);
                }
              }}
              className="w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100
                         text-xs text-colab-textDim hover:text-colab-red hover:bg-colab-hover transition-all"
              title="삭제"
            >
              ✕
            </button>
          </div>
        </>
      )}
    </div>
  );
}

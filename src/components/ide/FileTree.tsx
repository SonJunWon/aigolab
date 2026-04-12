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

export function FileTree() {
  const files = useFileStore((s) => s.files);
  const createFile = useFileStore((s) => s.createFile);
  const createFolder = useFileStore((s) => s.createFolder);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);
  const [newName, setNewName] = useState("");
  const [createParent, setCreateParent] = useState("");

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

      {/* 트리 */}
      <div className="flex-1 overflow-y-auto py-1">
        {tree.map((node) => (
          <TreeNodeView
            key={node.fullPath}
            node={node}
            depth={0}
            onCreateFile={(parent) => startCreate("file", parent)}
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

function TreeNodeView({
  node,
  depth,
  onCreateFile,
}: {
  node: TreeNode;
  depth: number;
  onCreateFile: (parent: string) => void;
}) {
  const activeFile = useFileStore((s) => s.activeFile);
  const openFile = useFileStore((s) => s.openFile);
  const deleteFile = useFileStore((s) => s.deleteFile);
  const deleteFolder = useFileStore((s) => s.deleteFolder);
  const collapsedFolders = useFileStore((s) => s.collapsedFolders);
  const toggleFolder = useFileStore((s) => s.toggleFolder);

  const isCollapsed = collapsedFolders.has(node.fullPath);
  const paddingLeft = 12 + depth * 16;

  if (node.isFolder) {
    return (
      <>
        <div
          className="group flex items-center gap-1.5 py-1 cursor-pointer text-xs text-colab-textDim hover:text-colab-text hover:bg-colab-hover transition-colors"
          style={{ paddingLeft }}
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
            />
          ))}
      </>
    );
  }

  // 파일 노드
  const isActive = activeFile === node.fullPath;

  return (
    <div
      className={`group flex items-center gap-1.5 py-1 cursor-pointer text-xs transition-colors
        ${isActive ? "bg-colab-accent/10 text-colab-accent" : "text-colab-text hover:bg-colab-hover"}`}
      style={{ paddingLeft }}
      onClick={() => openFile(node.fullPath)}
    >
      <span className="text-[10px] opacity-0">▶</span>
      <span>🐍</span>
      <span className="flex-1 truncate">{node.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`"${node.fullPath}" 파일을 삭제하시겠습니까?`)) {
            deleteFile(node.fullPath);
          }
        }}
        className="opacity-0 group-hover:opacity-100 mr-1 w-5 h-5 flex items-center justify-center rounded
                   text-xs text-colab-textDim hover:text-colab-red hover:bg-colab-hover transition-all"
        title="삭제"
      >
        ✕
      </button>
    </div>
  );
}

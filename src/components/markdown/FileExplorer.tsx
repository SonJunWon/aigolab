/**
 * 파일 탐색기 — 마크다운 워크스페이스 좌측 사이드바
 *
 * 기능: 폴더/파일 트리, 생성/삭제/이름변경, 드래그 이동, 검색
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useMdFileStore } from "../../store/mdFileStore";
import type { StoredMdFolder, StoredMdFile } from "../../storage/db";

/* ─── 컨텍스트 메뉴 ─── */
interface ContextMenu {
  x: number;
  y: number;
  type: "folder" | "file" | "blank";
  targetId?: string;
}

/* ─── 인라인 편집 ─── */
interface InlineEdit {
  id: string;
  type: "folder" | "file";
  value: string;
}

export function FileExplorer() {
  const {
    folders,
    files,
    activeFileId,
    searchQuery,
    setActiveFile,
    setSearchQuery,
    createFolder,
    createFile,
    renameFolder,
    renameFile,
    deleteFolder,
    deleteFile,
    duplicateFile,
    moveFile,
    getFolderFileCount,
    canDeleteFolder,
  } = useMdFileStore();

  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [inlineEdit, setInlineEdit] = useState<InlineEdit | null>(null);
  const [dragItem, setDragItem] = useState<{ id: string; type: "file" | "folder" } | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // 외부 클릭 시 컨텍스트 메뉴 닫기
  useEffect(() => {
    const handler = () => setContextMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  // 인라인 편집 포커스
  useEffect(() => {
    if (inlineEdit && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [inlineEdit]);

  // ─── 폴더 접기/펼치기 ───
  const toggleFolder = useCallback((folderId: string) => {
    setCollapsedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  }, []);

  // ─── 검색 필터 ───
  const filteredFolders = searchQuery
    ? folders.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : folders;

  const filteredFiles = searchQuery
    ? files.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : files;

  // ─── 인라인 편집 확정 ───
  const commitEdit = async () => {
    if (!inlineEdit || !inlineEdit.value.trim()) {
      setInlineEdit(null);
      return;
    }
    if (inlineEdit.type === "folder") {
      await renameFolder(inlineEdit.id, inlineEdit.value.trim());
    } else {
      await renameFile(inlineEdit.id, inlineEdit.value.trim());
    }
    setInlineEdit(null);
  };

  // ─── 새 폴더/파일 생성 ───
  const handleNewFolder = async () => {
    const name = "새 폴더";
    const folder = await createFolder(name);
    setInlineEdit({ id: folder.id, type: "folder", value: name });
  };

  const handleNewFile = async (folderId?: string | null) => {
    const name = "새 문서";
    const file = await createFile(name, folderId);
    setInlineEdit({ id: file.id, type: "file", value: name });
  };

  // ─── 드래그 핸들러 ───
  const handleDragStart = (id: string, type: "file" | "folder") => {
    setDragItem({ id, type });
  };

  const handleDragOver = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    setDropTarget(folderId);
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    if (dragItem?.type === "file") {
      await moveFile(dragItem.id, targetFolderId);
    }
    setDragItem(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDragItem(null);
    setDropTarget(null);
  };

  // ─── 컨텍스트 메뉴 핸들러 ───
  const handleContextMenu = (
    e: React.MouseEvent,
    type: "folder" | "file" | "blank",
    targetId?: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, type, targetId });
  };

  // ─── 폴더 삭제 ───
  const handleDeleteFolder = async (id: string) => {
    if (!canDeleteFolder(id)) {
      alert("폴더 안의 파일을 먼저 삭제하거나 이동해주세요.");
      return;
    }
    if (!confirm("이 폴더를 삭제하시겠습니까?")) return;
    await deleteFolder(id);
  };

  // ─── 파일 삭제 ───
  const handleDeleteFile = async (id: string) => {
    if (!confirm("이 파일을 삭제하시겠습니까? 복구할 수 없습니다.")) return;
    await deleteFile(id);
  };

  // ─── 파일 다운로드 ───
  const handleDownloadFile = (file: StoredMdFile) => {
    const blob = new Blob([file.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── 폴더 렌더링 ───
  const renderFolder = (folder: StoredMdFolder) => {
    const isCollapsed = collapsedFolders.has(folder.id);
    const fileCount = getFolderFileCount(folder.id);
    const isEmpty = fileCount === 0;
    const isDropping = dropTarget === folder.id;
    const isEditing = inlineEdit?.id === folder.id;
    const folderFiles = filteredFiles.filter((f) => f.folderId === folder.id);

    return (
      <div key={folder.id}>
        {/* 폴더 행 */}
        <div
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-all
            ${isDropping ? "border border-brand-accent bg-brand-accent/10" : "border border-transparent"}
            ${isEmpty ? "opacity-40" : "opacity-100"}
            hover:bg-brand-panel/60`}
          onClick={() => toggleFolder(folder.id)}
          onContextMenu={(e) => handleContextMenu(e, "folder", folder.id)}
          onDragOver={(e) => handleDragOver(e, folder.id)}
          onDrop={(e) => handleDrop(e, folder.id)}
        >
          <span className="text-[10px] text-brand-textDim w-3">
            {isCollapsed ? "▶" : "▼"}
          </span>
          <span className="text-sm">{isEmpty ? "📁" : "📂"}</span>

          {isEditing ? (
            <input
              ref={editInputRef}
              className="flex-1 bg-brand-bg border border-brand-accent rounded px-1 text-sm text-brand-text outline-none"
              value={inlineEdit.value}
              onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit();
                if (e.key === "Escape") setInlineEdit(null);
              }}
            />
          ) : (
            <span
              className="flex-1 truncate"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setInlineEdit({ id: folder.id, type: "folder", value: folder.name });
              }}
            >
              {folder.name}
            </span>
          )}

          {!isEmpty && (
            <span className="text-[10px] text-brand-textDim">{fileCount}</span>
          )}
          {isEmpty && (
            <span className="text-[10px] text-brand-textDim/50">◌</span>
          )}
        </div>

        {/* 하위 파일 목록 */}
        {!isCollapsed && (
          <div className="ml-4">
            {folderFiles.map((file) => renderFile(file))}
          </div>
        )}
      </div>
    );
  };

  // ─── 파일 렌더링 ───
  const renderFile = (file: StoredMdFile) => {
    const isActive = activeFileId === file.id;
    const isEditing = inlineEdit?.id === file.id;
    const isDragging = dragItem?.id === file.id;

    return (
      <div
        key={file.id}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-all
          ${isActive ? "bg-brand-accent/15 border-l-2 border-brand-accent" : "border-l-2 border-transparent"}
          ${isDragging ? "opacity-40" : ""}
          hover:bg-brand-panel/60`}
        onClick={() => setActiveFile(file.id)}
        onContextMenu={(e) => handleContextMenu(e, "file", file.id)}
        draggable
        onDragStart={() => handleDragStart(file.id, "file")}
        onDragEnd={handleDragEnd}
      >
        <span className="text-sm">📄</span>

        {isEditing ? (
          <input
            ref={editInputRef}
            className="flex-1 bg-brand-bg border border-brand-accent rounded px-1 text-sm text-brand-text outline-none"
            value={inlineEdit.value}
            onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setInlineEdit(null);
            }}
          />
        ) : (
          <span
            className="flex-1 truncate"
            onDoubleClick={(e) => {
              e.stopPropagation();
              const nameWithoutExt = file.name.replace(/\.md$/, "");
              setInlineEdit({ id: file.id, type: "file", value: nameWithoutExt });
            }}
          >
            {file.name}
          </span>
        )}

        {file.isFavorite && <span className="text-[10px]">⭐</span>}
      </div>
    );
  };

  // 루트 레벨 파일 (폴더에 속하지 않은)
  const rootFiles = filteredFiles.filter((f) => f.folderId === null);

  return (
    <div
      className="flex flex-col h-full bg-brand-bg border-r border-brand-subtle"
      onContextMenu={(e) => handleContextMenu(e, "blank")}
      onDragOver={(e) => handleDragOver(e, null)}
      onDrop={(e) => handleDrop(e, null)}
    >
      {/* 헤더 */}
      <div className="px-3 py-3 border-b border-brand-subtle">
        <div className="text-xs font-semibold text-brand-textDim uppercase tracking-wider mb-2">
          내 문서
        </div>
        {/* 검색 */}
        <input
          type="text"
          placeholder="검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1.5 rounded-lg bg-brand-panel border border-brand-subtle text-xs text-brand-text
                     placeholder:text-brand-textDim/50 focus:outline-none focus:border-brand-accent transition-colors"
        />
      </div>

      {/* 파일 트리 */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {filteredFolders.filter((f) => f.parentId === null).map(renderFolder)}
        {rootFiles.length > 0 && (
          <div className="mt-2 pt-2 border-t border-brand-subtle/30">
            {rootFiles.map(renderFile)}
          </div>
        )}
      </div>

      {/* 하단 버튼 + 사용량 */}
      <div className="px-3 py-3 border-t border-brand-subtle space-y-2">
        <div className="flex gap-2">
          <button
            onClick={handleNewFolder}
            className="flex-1 py-1.5 rounded-lg text-[11px] border border-brand-subtle text-brand-textDim
                       hover:text-brand-text hover:border-brand-accent/40 transition-colors"
          >
            + 새 폴더
          </button>
          <button
            onClick={() => handleNewFile(null)}
            className="flex-1 py-1.5 rounded-lg text-[11px] border border-brand-subtle text-brand-textDim
                       hover:text-brand-text hover:border-brand-accent/40 transition-colors"
          >
            + 새 문서
          </button>
        </div>
        <div className="text-[10px] text-brand-textDim text-center">
          {files.length}개 문서 · {folders.length}개 폴더
        </div>
      </div>

      {/* 컨텍스트 메뉴 */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-brand-panel border border-brand-subtle rounded-lg shadow-xl py-1 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === "folder" && contextMenu.targetId && (
            <>
              <button
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10 transition-colors"
                onClick={() => {
                  handleNewFile(contextMenu.targetId);
                  setContextMenu(null);
                }}
              >
                📄 새 문서 만들기
              </button>
              <button
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10 transition-colors"
                onClick={() => {
                  const folder = folders.find((f) => f.id === contextMenu.targetId);
                  if (folder) setInlineEdit({ id: folder.id, type: "folder", value: folder.name });
                  setContextMenu(null);
                }}
              >
                ✏️ 이름 변경
              </button>
              <div className="border-t border-brand-subtle/50 my-1" />
              <button
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors
                  ${canDeleteFolder(contextMenu.targetId) ? "text-red-400 hover:bg-red-500/10" : "text-brand-textDim/30 cursor-not-allowed"}`}
                onClick={() => {
                  if (contextMenu.targetId) handleDeleteFolder(contextMenu.targetId);
                  setContextMenu(null);
                }}
                title={!canDeleteFolder(contextMenu.targetId!) ? "폴더 안의 파일을 먼저 삭제하거나 이동해주세요" : ""}
              >
                🗑 폴더 삭제
              </button>
            </>
          )}

          {contextMenu.type === "file" && contextMenu.targetId && (() => {
            const file = files.find((f) => f.id === contextMenu.targetId);
            return (
              <>
                <button
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10 transition-colors"
                  onClick={() => {
                    if (file) {
                      const nameWithoutExt = file.name.replace(/\.md$/, "");
                      setInlineEdit({ id: file.id, type: "file", value: nameWithoutExt });
                    }
                    setContextMenu(null);
                  }}
                >
                  ✏️ 이름 변경
                </button>
                <button
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10 transition-colors"
                  onClick={async () => {
                    if (contextMenu.targetId) await duplicateFile(contextMenu.targetId);
                    setContextMenu(null);
                  }}
                >
                  📋 복제
                </button>
                <button
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10 transition-colors"
                  onClick={() => {
                    if (file) handleDownloadFile(file);
                    setContextMenu(null);
                  }}
                >
                  📥 다운로드 (.md)
                </button>
                <div className="border-t border-brand-subtle/50 my-1" />
                <button
                  className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  onClick={() => {
                    if (contextMenu.targetId) handleDeleteFile(contextMenu.targetId);
                    setContextMenu(null);
                  }}
                >
                  🗑 삭제
                </button>
              </>
            );
          })()}

          {contextMenu.type === "blank" && (
            <>
              <button
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10 transition-colors"
                onClick={() => {
                  handleNewFolder();
                  setContextMenu(null);
                }}
              >
                📁 새 폴더 만들기
              </button>
              <button
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10 transition-colors"
                onClick={() => {
                  handleNewFile(null);
                  setContextMenu(null);
                }}
              >
                📄 새 문서 만들기
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

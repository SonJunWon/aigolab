/**
 * 파일 탐색기 — 마크다운 워크스페이스 좌측 사이드바
 *
 * 기능: 재귀 트리 구조, 생성/삭제/이름변경, 드래그 이동, 검색, 인라인 액션
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useMdFileStore } from "../../store/mdFileStore";
import type { StoredMdFolder, StoredMdFile } from "../../storage/db";

/* ─── 한글 IME 안전 인라인 편집 입력 ─── */
function InlineEditInput({
  initialValue,
  onCommit,
  onCancel,
}: {
  initialValue: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}) {
  const [localValue, setLocalValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const composingRef = useRef(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleCommit = () => {
    if (localValue.trim()) onCommit(localValue.trim());
    else onCancel();
  };

  return (
    <input
      ref={inputRef}
      className="flex-1 min-w-0 bg-brand-bg border border-brand-accent rounded px-1 text-sm text-brand-text outline-none"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onCompositionStart={() => { composingRef.current = true; }}
      onCompositionEnd={() => { composingRef.current = false; }}
      onBlur={handleCommit}
      onKeyDown={(e) => {
        if (composingRef.current) return; // 한글 조합 중이면 무시
        if (e.key === "Enter") handleCommit();
        if (e.key === "Escape") onCancel();
      }}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

/* ─── 컨텍스트 메뉴 타입 ─── */
interface ContextMenu {
  x: number;
  y: number;
  type: "folder" | "file" | "blank";
  targetId?: string;
}

/* ═══════════════════════════════════════════════ */
/*  폴더 행 컴포넌트                                */
/* ═══════════════════════════════════════════════ */
function FolderRow({
  folder,
  depth,
  isCollapsed,
  totalCount,
  isDropTarget,
  isEditing,
  editValue,
  onToggle,
  onContextMenu,
  onDragOver,
  onDrop,
  onEditCommit,
  onEditCancel,
  onStartEdit,
  onNewFile,
  onNewSubfolder,
  onDelete,
  canDelete,
}: {
  folder: StoredMdFolder;
  depth: number;
  isCollapsed: boolean;
  totalCount: number;
  isDropTarget: boolean;
  isEditing: boolean;
  editValue: string;
  onToggle: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onEditCommit: (val: string) => void;
  onEditCancel: () => void;
  onStartEdit: () => void;
  onNewFile: () => void;
  onNewSubfolder: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isEmpty = totalCount === 0;

  return (
    <div
      className={`group flex items-center gap-1 py-1.5 rounded-lg cursor-pointer text-sm transition-all
        ${isDropTarget ? "border border-brand-accent bg-brand-accent/10" : "border border-transparent"}
        ${isEmpty ? "opacity-40 hover:opacity-70" : "opacity-100"}
        hover:bg-brand-panel/60`}
      style={{ paddingLeft: `${depth * 16 + 8}px`, paddingRight: "8px" }}
      onClick={onToggle}
      onContextMenu={onContextMenu}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-[10px] text-brand-textDim w-3 shrink-0">
        {isCollapsed ? "▶" : "▼"}
      </span>
      <span className="text-sm shrink-0">{isEmpty ? "📁" : "📂"}</span>

      {isEditing ? (
        <InlineEditInput
          initialValue={editValue}
          onCommit={onEditCommit}
          onCancel={onEditCancel}
        />
      ) : (
        <span className="flex-1 min-w-0 truncate" onDoubleClick={(e) => { e.stopPropagation(); onStartEdit(); }}>
          {folder.name}
        </span>
      )}

      {hovered && !isEditing ? (
        <div className="flex items-center gap-0.5 shrink-0">
          <button title="새 문서" className="w-5 h-5 flex items-center justify-center rounded text-[10px] hover:bg-brand-accent/20" onClick={(e) => { e.stopPropagation(); onNewFile(); }}>
            +📄
          </button>
          <button title="하위 폴더" className="w-5 h-5 flex items-center justify-center rounded text-[10px] hover:bg-brand-accent/20" onClick={(e) => { e.stopPropagation(); onNewSubfolder(); }}>
            +📁
          </button>
          <button
            title={canDelete ? "삭제" : "파일이 있어 삭제 불가"}
            className={`w-5 h-5 flex items-center justify-center rounded text-[10px] ${canDelete ? "hover:bg-red-500/20 text-red-400/60" : "text-brand-textDim/20 cursor-not-allowed"}`}
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >🗑</button>
        </div>
      ) : (
        totalCount > 0 ? (
          <span className="text-[10px] text-brand-textDim shrink-0">{totalCount}</span>
        ) : (
          <span className="text-[10px] text-brand-textDim/50 shrink-0">◌</span>
        )
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
/*  파일 행 컴포넌트                                */
/* ═══════════════════════════════════════════════ */
function FileRow({
  file,
  depth,
  isActive,
  isEditing,
  editValue,
  isDragging,
  onSelect,
  onContextMenu,
  onDragStart,
  onDragEnd,
  onEditCommit,
  onEditCancel,
  onStartEdit,
  onDelete,
}: {
  file: StoredMdFile;
  depth: number;
  isActive: boolean;
  isEditing: boolean;
  editValue: string;
  isDragging: boolean;
  onSelect: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onEditCommit: (val: string) => void;
  onEditCancel: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex items-center gap-1 py-1.5 rounded-lg cursor-pointer text-sm transition-all
        ${isActive ? "bg-brand-accent/15 border-l-2 border-brand-accent" : "border-l-2 border-transparent"}
        ${isDragging ? "opacity-40" : ""}
        hover:bg-brand-panel/60`}
      style={{ paddingLeft: `${depth * 16 + 20}px`, paddingRight: "8px" }}
      onClick={onSelect}
      onContextMenu={onContextMenu}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-sm shrink-0">📄</span>

      {isEditing ? (
        <InlineEditInput
          initialValue={editValue}
          onCommit={onEditCommit}
          onCancel={onEditCancel}
        />
      ) : (
        <span className="flex-1 min-w-0 truncate" onDoubleClick={(e) => { e.stopPropagation(); onStartEdit(); }}>
          {file.name}
        </span>
      )}

      {hovered && !isEditing ? (
        <button
          title="삭제"
          className="w-5 h-5 flex items-center justify-center rounded text-[10px] text-red-400/60 hover:bg-red-500/20 shrink-0"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >🗑</button>
      ) : (
        file.isFavorite && <span className="text-[10px] shrink-0">⭐</span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
/*  메인 파일 탐색기                                */
/* ═══════════════════════════════════════════════ */
export function FileExplorer() {
  const {
    folders, files, activeFileId, searchQuery,
    setActiveFile, setSearchQuery,
    createFolder, createFile,
    renameFolder, renameFile,
    deleteFolder, deleteFile,
    duplicateFile, moveFile,
    canDeleteFolder,
  } = useMdFileStore();

  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [editingId, setEditingId] = useState<{ id: string; type: "folder" | "file"; initialValue: string } | null>(null);
  const [dragItem, setDragItem] = useState<{ id: string; type: "file" | "folder" } | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setContextMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const toggleFolder = useCallback((folderId: string) => {
    setCollapsedFolders((prev) => {
      const next = new Set(prev);
      next.has(folderId) ? next.delete(folderId) : next.add(folderId);
      return next;
    });
  }, []);

  // 검색 필터
  const filteredFolders = searchQuery
    ? folders.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : folders;
  const filteredFiles = searchQuery
    ? files.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : files;

  // 인라인 편집 확정
  const commitEdit = async (value: string) => {
    if (!editingId) return;
    if (editingId.type === "folder") await renameFolder(editingId.id, value);
    else await renameFile(editingId.id, value);
    setEditingId(null);
  };

  // 생성
  const handleNewFolder = async (parentId?: string | null) => {
    const folder = await createFolder("새 폴더", parentId);
    setEditingId({ id: folder.id, type: "folder", initialValue: "새 폴더" });
    // 부모 폴더가 접혀있으면 펼치기
    if (parentId) {
      setCollapsedFolders((prev) => { const next = new Set(prev); next.delete(parentId); return next; });
    }
  };

  const handleNewFile = async (folderId?: string | null) => {
    const file = await createFile("새 문서", folderId);
    setEditingId({ id: file.id, type: "file", initialValue: "새 문서" });
    if (folderId) {
      setCollapsedFolders((prev) => { const next = new Set(prev); next.delete(folderId); return next; });
    }
  };

  // 삭제
  const handleDeleteFolder = async (id: string) => {
    if (!canDeleteFolder(id)) { alert("폴더 안의 파일을 먼저 삭제하거나 이동해주세요."); return; }
    if (!confirm("이 폴더를 삭제하시겠습니까?")) return;
    await deleteFolder(id);
  };

  const handleDeleteFile = async (id: string) => {
    if (!confirm("이 파일을 삭제하시겠습니까? 복구할 수 없습니다.")) return;
    await deleteFile(id);
  };

  // 드래그
  const handleDragOver = (e: React.DragEvent, folderId: string | null) => { e.preventDefault(); setDropTarget(folderId); };
  const handleDrop = async (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    if (dragItem?.type === "file") await moveFile(dragItem.id, targetFolderId);
    setDragItem(null); setDropTarget(null);
  };

  // 컨텍스트 메뉴
  const handleContextMenu = (e: React.MouseEvent, type: "folder" | "file" | "blank", targetId?: string) => {
    e.preventDefault(); e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, type, targetId });
  };

  // 다운로드
  const handleDownloadFile = (file: StoredMdFile) => {
    const blob = new Blob([file.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = file.name; a.click();
    URL.revokeObjectURL(url);
  };

  // 재귀 카운트
  const getTotalCount = useCallback((folderId: string): number => {
    const fc = filteredFiles.filter((f) => f.folderId === folderId).length;
    const subs = filteredFolders.filter((f) => f.parentId === folderId);
    return fc + subs.reduce((s, sf) => s + getTotalCount(sf.id), 0);
  }, [filteredFiles, filteredFolders]);

  // 재귀 폴더 렌더
  const renderFolderTree = (parentId: string | null, depth: number) => {
    const foldersAtLevel = filteredFolders.filter((f) => f.parentId === parentId).sort((a, b) => a.order - b.order);
    return foldersAtLevel.map((folder) => {
      const folderFiles = filteredFiles.filter((f) => f.folderId === folder.id);
      const isCollapsed = collapsedFolders.has(folder.id);

      return (
        <div key={folder.id}>
          <FolderRow
            folder={folder}
            depth={depth}
            isCollapsed={isCollapsed}
            totalCount={getTotalCount(folder.id)}
            isDropTarget={dropTarget === folder.id}
            isEditing={editingId?.id === folder.id}
            editValue={editingId?.id === folder.id ? editingId.initialValue : ""}
            onToggle={() => toggleFolder(folder.id)}
            onContextMenu={(e) => handleContextMenu(e, "folder", folder.id)}
            onDragOver={(e) => handleDragOver(e, folder.id)}
            onDrop={(e) => handleDrop(e, folder.id)}
            onEditCommit={commitEdit}
            onEditCancel={() => setEditingId(null)}
            onStartEdit={() => setEditingId({ id: folder.id, type: "folder", initialValue: folder.name })}
            onNewFile={() => handleNewFile(folder.id)}
            onNewSubfolder={() => handleNewFolder(folder.id)}
            onDelete={() => handleDeleteFolder(folder.id)}
            canDelete={canDeleteFolder(folder.id)}
          />
          {!isCollapsed && (
            <>
              {renderFolderTree(folder.id, depth + 1)}
              {folderFiles.sort((a, b) => a.order - b.order).map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  depth={depth + 1}
                  isActive={activeFileId === file.id}
                  isEditing={editingId?.id === file.id}
                  editValue={editingId?.id === file.id ? editingId.initialValue : ""}
                  isDragging={dragItem?.id === file.id}
                  onSelect={() => setActiveFile(file.id)}
                  onContextMenu={(e) => handleContextMenu(e, "file", file.id)}
                  onDragStart={() => setDragItem({ id: file.id, type: "file" })}
                  onDragEnd={() => { setDragItem(null); setDropTarget(null); }}
                  onEditCommit={commitEdit}
                  onEditCancel={() => setEditingId(null)}
                  onStartEdit={() => setEditingId({ id: file.id, type: "file", initialValue: file.name.replace(/\.md$/, "") })}
                  onDelete={() => handleDeleteFile(file.id)}
                />
              ))}
            </>
          )}
        </div>
      );
    });
  };

  // 루트 레벨 파일
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
        <div className="text-xs font-semibold text-brand-textDim uppercase tracking-wider mb-2">내 문서</div>
        <input
          type="text" placeholder="검색..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1.5 rounded-lg bg-brand-panel border border-brand-subtle text-xs text-brand-text
                     placeholder:text-brand-textDim/50 focus:outline-none focus:border-brand-accent transition-colors"
        />
      </div>

      {/* 파일 트리 */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {renderFolderTree(null, 0)}
        {rootFiles.length > 0 && (
          <div className="mt-2 pt-2 border-t border-brand-subtle/30">
            {rootFiles.map((file) => (
              <FileRow
                key={file.id} file={file} depth={0}
                isActive={activeFileId === file.id}
                isEditing={editingId?.id === file.id}
                editValue={editingId?.id === file.id ? editingId.initialValue : ""}
                isDragging={dragItem?.id === file.id}
                onSelect={() => setActiveFile(file.id)}
                onContextMenu={(e) => handleContextMenu(e, "file", file.id)}
                onDragStart={() => setDragItem({ id: file.id, type: "file" })}
                onDragEnd={() => { setDragItem(null); setDropTarget(null); }}
                onEditCommit={commitEdit}
                onEditCancel={() => setEditingId(null)}
                onStartEdit={() => setEditingId({ id: file.id, type: "file", initialValue: file.name.replace(/\.md$/, "") })}
                onDelete={() => handleDeleteFile(file.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="px-3 py-3 border-t border-brand-subtle space-y-2">
        <div className="flex gap-2">
          <button onClick={() => handleNewFolder(null)} className="flex-1 py-1.5 rounded-lg text-[11px] border border-brand-subtle text-brand-textDim hover:text-brand-text hover:border-brand-accent/40 transition-colors">
            + 새 폴더
          </button>
          <button onClick={() => handleNewFile(null)} className="flex-1 py-1.5 rounded-lg text-[11px] border border-brand-subtle text-brand-textDim hover:text-brand-text hover:border-brand-accent/40 transition-colors">
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
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10" onClick={() => { handleNewFile(contextMenu.targetId); setContextMenu(null); }}>
                📄 새 문서 만들기
              </button>
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10" onClick={() => { handleNewFolder(contextMenu.targetId); setContextMenu(null); }}>
                📁 하위 폴더 만들기
              </button>
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10" onClick={() => {
                const f = folders.find((f) => f.id === contextMenu.targetId);
                if (f) setEditingId({ id: f.id, type: "folder", initialValue: f.name });
                setContextMenu(null);
              }}>
                ✏️ 이름 변경
              </button>
              <div className="border-t border-brand-subtle/50 my-1" />
              <button
                className={`w-full text-left px-3 py-1.5 text-xs ${canDeleteFolder(contextMenu.targetId) ? "text-red-400 hover:bg-red-500/10" : "text-brand-textDim/30 cursor-not-allowed"}`}
                onClick={() => { if (contextMenu.targetId) handleDeleteFolder(contextMenu.targetId); setContextMenu(null); }}
              >🗑 폴더 삭제</button>
            </>
          )}
          {contextMenu.type === "file" && contextMenu.targetId && (() => {
            const file = files.find((f) => f.id === contextMenu.targetId);
            return (
              <>
                <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10" onClick={() => {
                  if (file) setEditingId({ id: file.id, type: "file", initialValue: file.name.replace(/\.md$/, "") });
                  setContextMenu(null);
                }}>✏️ 이름 변경</button>
                <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10" onClick={async () => {
                  if (contextMenu.targetId) await duplicateFile(contextMenu.targetId);
                  setContextMenu(null);
                }}>📋 복제</button>
                <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10" onClick={() => {
                  if (file) handleDownloadFile(file);
                  setContextMenu(null);
                }}>📥 다운로드 (.md)</button>
                <div className="border-t border-brand-subtle/50 my-1" />
                <button className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10" onClick={() => {
                  if (contextMenu.targetId) handleDeleteFile(contextMenu.targetId);
                  setContextMenu(null);
                }}>🗑 삭제</button>
              </>
            );
          })()}
          {contextMenu.type === "blank" && (
            <>
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10" onClick={() => { handleNewFolder(null); setContextMenu(null); }}>
                📁 새 폴더 만들기
              </button>
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-brand-accent/10" onClick={() => { handleNewFile(null); setContextMenu(null); }}>
                📄 새 문서 만들기
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

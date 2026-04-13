import { useFileStore } from "../../store/fileStore";

export function EditorTabs() {
  const openTabs = useFileStore((s) => s.openTabs);
  const activeFile = useFileStore((s) => s.activeFile);
  const openFile = useFileStore((s) => s.openFile);
  const closeTab = useFileStore((s) => s.closeTab);
  const dirtyFiles = useFileStore((s) => s.dirtyFiles);

  if (openTabs.length === 0) return null;

  return (
    <div className="flex items-center border-b border-colab-subtle bg-colab-bg overflow-x-auto">
      {openTabs.map((name) => {
        const isDirty = dirtyFiles.has(name);
        const isActive = activeFile === name;
        return (
          <div
            key={name}
            onClick={() => openFile(name)}
            className={`group flex items-center gap-2 px-4 py-2 text-xs cursor-pointer border-b-2 transition-colors shrink-0
              ${
                isActive
                  ? "border-colab-accent text-colab-text bg-colab-panel"
                  : "border-transparent text-colab-textDim hover:text-colab-text hover:bg-colab-panel/50"
              }`}
          >
            <span>🐍</span>
            <span>{name}</span>
            {/* dirty 점 — 호버 시 ✕ 버튼으로 교체 */}
            <span className="relative w-3 h-3 flex items-center justify-center ml-0.5">
              {isDirty && (
                <span
                  className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-colab-yellow group-hover:opacity-0 transition-opacity"
                  title="저장되지 않은 변경"
                />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(name);
                }}
                className={`absolute inset-0 flex items-center justify-center rounded hover:text-colab-red transition-all
                  ${isDirty ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                title="탭 닫기"
              >
                ✕
              </button>
            </span>
          </div>
        );
      })}
    </div>
  );
}

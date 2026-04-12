import { useFileStore } from "../../store/fileStore";

export function EditorTabs() {
  const openTabs = useFileStore((s) => s.openTabs);
  const activeFile = useFileStore((s) => s.activeFile);
  const openFile = useFileStore((s) => s.openFile);
  const closeTab = useFileStore((s) => s.closeTab);

  if (openTabs.length === 0) return null;

  return (
    <div className="flex items-center border-b border-colab-subtle bg-colab-bg overflow-x-auto">
      {openTabs.map((name) => (
        <div
          key={name}
          onClick={() => openFile(name)}
          className={`group flex items-center gap-2 px-4 py-2 text-xs cursor-pointer border-b-2 transition-colors shrink-0
            ${
              activeFile === name
                ? "border-colab-accent text-colab-text bg-colab-panel"
                : "border-transparent text-colab-textDim hover:text-colab-text hover:bg-colab-panel/50"
            }`}
        >
          <span>🐍</span>
          <span>{name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(name);
            }}
            className="opacity-0 group-hover:opacity-100 hover:text-colab-red transition-all ml-1"
            title="탭 닫기"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

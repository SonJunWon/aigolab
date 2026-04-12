import Editor, { type OnMount } from "@monaco-editor/react";
import { useFileStore } from "../../store/fileStore";
import { runActiveFile } from "../../runtime/fileRunner";
import { saveProject } from "../../storage/projectRepo";

/**
 * IDE의 메인 에디터 영역.
 * Monaco 에디터에 IDE 단축키를 직접 등록.
 */
export function IdeEditor() {
  const activeFile = useFileStore((s) => s.activeFile);
  const files = useFileStore((s) => s.files);
  const updateContent = useFileStore((s) => s.updateContent);

  const entry = activeFile ? files[activeFile] : null;

  const handleMount: OnMount = (editor, monaco) => {
    // Cmd/Ctrl + Enter → 실행
    editor.addAction({
      id: "ide.run",
      label: "실행",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        runActiveFile();
      },
    });

    // Cmd/Ctrl + S → 저장
    editor.addAction({
      id: "ide.save",
      label: "저장",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        const { files: currentFiles, loaded } = useFileStore.getState();
        if (loaded) {
          void saveProject(currentFiles);
          useFileStore.getState().appendOutput({
            stream: "system",
            text: "✓ 프로젝트 저장됨",
          });
        }
      },
    });
  };

  if (!entry) {
    return (
      <div className="flex-1 flex items-center justify-center text-colab-textDim text-sm">
        파일을 선택하세요
      </div>
    );
  }

  return (
    <Editor
      key={entry.name}
      defaultLanguage={entry.language}
      value={entry.content}
      onChange={(val) => updateContent(entry.name, val ?? "")}
      onMount={handleMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: '"Roboto Mono", "SF Mono", Monaco, Menlo, monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        folding: true,
        automaticLayout: true,
        tabSize: 4,
        renderLineHighlight: "line",
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 8,
        },
        padding: { top: 12, bottom: 12 },
        wordWrap: "on",
      }}
    />
  );
}

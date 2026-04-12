import { useEffect } from "react";
import { useUIStore } from "../store/uiStore";

/**
 * 키보드 단축키 도움말 모달.
 * `?` 키 또는 툴바의 ? 버튼으로 토글.
 * Esc 또는 배경 클릭으로 닫힘.
 */

interface Shortcut {
  keys: string[];
  description: string;
}

interface Section {
  title: string;
  icon: string;
  shortcuts: Shortcut[];
}

const SECTIONS: Section[] = [
  {
    title: "코드 실행 (에디터 안에서)",
    icon: "▶",
    shortcuts: [
      { keys: ["⌘/Ctrl", "Enter"], description: "셀 실행 (현재 셀 유지)" },
      { keys: ["Shift", "Enter"], description: "셀 실행 + 다음 셀로 이동" },
      { keys: ["Alt/Option", "Enter"], description: "셀 실행 + 아래에 새 셀" },
      { keys: ["Esc"], description: "에디터 빠져나가기 (command mode 진입)" },
    ],
  },
  {
    title: "Command Mode (셀 외부에서)",
    icon: "📝",
    shortcuts: [
      { keys: ["Esc"], description: "command mode 진입" },
      { keys: ["B"], description: "선택한 셀 아래에 새 코드 셀" },
      { keys: ["A"], description: "선택한 셀 위에 새 코드 셀" },
      { keys: ["M"], description: "현재 셀을 텍스트 셀로 변환" },
      { keys: ["Y"], description: "현재 셀을 코드 셀로 변환" },
      { keys: ["D", "D"], description: "현재 셀 삭제 (D 두 번)" },
    ],
  },
  {
    title: "네비게이션",
    icon: "🧭",
    shortcuts: [
      { keys: ["↑"], description: "이전 셀 선택" },
      { keys: ["↓"], description: "다음 셀 선택" },
      { keys: ["⌘/Ctrl", "Enter"], description: "선택한 셀 실행" },
      { keys: ["Shift", "Enter"], description: "실행 + 다음으로" },
      { keys: ["Alt/Option", "Enter"], description: "실행 + 새 셀" },
    ],
  },
  {
    title: "마크다운 셀",
    icon: "📄",
    shortcuts: [
      { keys: ["더블클릭"], description: "편집 모드 진입" },
      { keys: ["Esc"], description: "편집 종료 (렌더)" },
      { keys: ["Shift", "Enter"], description: "편집 종료 (렌더)" },
    ],
  },
  {
    title: "도움말",
    icon: "❓",
    shortcuts: [
      { keys: ["?"], description: "이 도움말 열기/닫기" },
      { keys: ["Esc"], description: "모달 닫기" },
    ],
  },
];

export function ShortcutsHelp() {
  const open = useUIStore((s) => s.shortcutsHelpOpen);
  const close = useUIStore((s) => s.closeShortcutsHelp);

  // Esc 로 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden
                   rounded-xl border border-colab-subtle bg-colab-panel shadow-2xl"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-colab-subtle sticky top-0 bg-colab-panel z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⌨️</span>
            <h2 className="text-lg font-semibold text-colab-text">
              키보드 단축키
            </h2>
          </div>
          <button
            onClick={close}
            className="flex items-center gap-2 px-3 py-1 rounded border border-colab-subtle
                       text-xs text-colab-textDim hover:text-colab-text hover:border-colab-accent
                       transition-colors"
          >
            닫기 <kbd className="!px-1">Esc</kbd>
          </button>
        </div>

        {/* 본문 — 스크롤 */}
        <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: "calc(85vh - 64px)" }}>
          <div className="grid md:grid-cols-2 gap-6">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h3 className="flex items-center gap-2 text-sm font-medium text-colab-accent mb-3 uppercase tracking-wider">
                  <span>{section.icon}</span>
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.shortcuts.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="text-colab-text flex-1 min-w-0">
                        {s.description}
                      </span>
                      <span className="shrink-0 flex items-center gap-1">
                        {s.keys.map((k, ki) => (
                          <span key={ki} className="flex items-center gap-1">
                            {ki > 0 && (
                              <span className="text-colab-textDim">+</span>
                            )}
                            <kbd>{k}</kbd>
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* 하단 팁 */}
          <div className="mt-6 pt-4 border-t border-colab-subtle/60 text-xs text-colab-textDim">
            💡 <strong className="text-colab-text">Command mode</strong> 는 에디터 바깥에 포커스가 있을 때만 작동합니다. 에디터 안에서 <kbd>Esc</kbd> 를 먼저 눌러 빠져나간 뒤 단일 키 단축키를 사용하세요.
          </div>
        </div>
      </div>
    </div>
  );
}

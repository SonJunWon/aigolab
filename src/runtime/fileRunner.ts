/**
 * IDE 모드용 파일 실행기.
 *
 * 전략 (writeFiles Worker 메시지 대신 Python 코드로 처리):
 *   1. Python 코드로 모든 .py 파일을 가상 FS에 쓰기
 *   2. 사용자 모듈 캐시 제거 (수정 반영)
 *   3. runpy.run_path() 로 활성 파일 실행
 */

import { pythonRunner } from "./pythonRunner";
import { useFileStore } from "../store/fileStore";

export async function runActiveFile(): Promise<void> {
  const store = useFileStore.getState();
  const { files, activeFile } = store;

  if (!activeFile) return;
  if (store.running) return;
  if (pythonRunner.getStatus() !== "ready") return;

  const activeEntry = files[activeFile];
  if (!activeEntry) return;

  store.clearOutput();
  store.setRunning(true);

  try {
    const pyFiles = Object.values(files).filter((f) =>
      f.name.endsWith(".py")
    );

    // 1. Python 코드로 가상 FS에 파일 쓰기 (폴더 구조 포함)
    // 먼저 모든 필요한 디렉토리를 만들고, 그 다음 파일을 씀
    const dirs = new Set<string>();
    for (const f of pyFiles) {
      const parts = f.name.split("/");
      for (let i = 1; i < parts.length; i++) {
        dirs.add(parts.slice(0, i).join("/"));
      }
    }

    const mkdirStatements = [...dirs]
      .map((d) => `os.makedirs("/home/pyodide/${d}", exist_ok=True)`)
      .join("\n");

    const writeFileStatements = pyFiles
      .map(
        (f) =>
          `with open("/home/pyodide/${f.name}", "w") as __f:\n    __f.write(${JSON.stringify(f.content)})`
      )
      .join("\n");

    const writeStatements = `import os\n${mkdirStatements}\n${writeFileStatements}`;

    await pythonRunner.run("ide-setup", writeStatements, {});

    // 2. 사용자 모듈 캐시 제거 (수정된 파일이 다시 import 되도록)
    const moduleNames = pyFiles
      .map((f) => f.name.replace(".py", ""))
      .filter((n) => n !== "__init__");

    // 3. Pyodide 자동 패키지 로드가 동작하도록 사용자 파일의 top-level import
    //    들을 runCode 맨 앞에 모음. worker 는 이 `code` 를 AST 로 스캔해
    //    sklearn/pandas 등을 감지·로드한다. runpy 래퍼만 넘기면 import 가
    //    안 보여 sklearn 이 로드되지 않는 문제를 해결.
    //    (한 번 import 되면 sys.modules 캐시에 남아 runpy 내부 실행 시
    //    재로드 없이 즉시 사용됨)
    //
    // Multi-line import (괄호·백슬래시) 를 한 블록으로 묶어 추출해야
    // `from sklearn.metrics import (\n ... \n)` 같은 코드가 깨지지 않는다.
    function extractImportBlocks(content: string): string[] {
      const lines = content.split(/\r?\n/);
      const blocks: string[] = [];
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        if (/^\s*(?:import|from)\s+\S/.test(line)) {
          let block = line;
          // 괄호 균형 맞을 때까지 이어 붙임
          const count = (s: string, ch: string) =>
            (s.match(new RegExp(`\\${ch}`, "g")) || []).length;
          let open = count(block, "(") - count(block, ")");
          let j = i + 1;
          while (open > 0 && j < lines.length) {
            block += "\n" + lines[j];
            open += count(lines[j], "(") - count(lines[j], ")");
            j++;
          }
          // 백슬래시 줄 이음 처리
          while (block.endsWith("\\") && j < lines.length) {
            block += "\n" + lines[j];
            j++;
          }
          blocks.push(block);
          i = j;
        } else {
          i++;
        }
      }
      return blocks;
    }

    const importLines = pyFiles
      .flatMap((f) => extractImportBlocks(f.content))
      // 사용자 모듈(본 프로젝트 내 .py) 의 import 는 제외 — 아직 sys.path 설정 전이라 실패할 수 있음
      .filter((block) => {
        const firstLine = block.split(/\r?\n/)[0];
        const m = firstLine.match(/^\s*(?:from\s+(\S+)|import\s+(\S+))/);
        const top = (m?.[1] ?? m?.[2] ?? "").split(".")[0];
        return !moduleNames.includes(top);
      });

    // 중복 제거
    const uniqueImports = [...new Set(importLines)].join("\n");

    const runCode = `
# ── 패키지 선로드 마커 (실행에도 무해) ──
${uniqueImports}

import sys as __sys

# 사용자 모듈 캐시 제거
for __m in ${JSON.stringify(moduleNames)}:
    __sys.modules.pop(__m, None)

# 활성 파일 실행
import runpy as __runpy
__result = __runpy.run_path("/home/pyodide/${activeFile}", run_name="__main__")
del __result
`;

    const result = await pythonRunner.run("ide-run", runCode, {
      onStdout: (text) =>
        useFileStore.getState().appendOutput({ stream: "stdout", text }),
      onStderr: (text) =>
        useFileStore.getState().appendOutput({ stream: "stderr", text }),
    });

    if (result.value !== undefined && result.value !== "None") {
      useFileStore.getState().appendOutput({
        stream: "result",
        text: result.value,
      });
    }

    useFileStore.getState().appendOutput({
      stream: "system",
      text: `✓ 실행 완료 (${result.timeMs.toFixed(0)}ms)`,
    });
  } catch (err) {
    const error = err as { message: string; name: string };
    useFileStore.getState().appendOutput({
      stream: "error",
      text: `${error.name}: ${error.message}`,
    });
  } finally {
    useFileStore.getState().setRunning(false);
  }
}

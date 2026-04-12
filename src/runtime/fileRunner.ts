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

    const runCode = `
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

/**
 * 노트북을 Jupyter .ipynb 형식으로 내보내기.
 *
 * .ipynb는 JSON 파일. 구조:
 * - nbformat: 4
 * - metadata: 커널/언어 정보
 * - cells: 각 셀의 cell_type, source, outputs
 */

import type { Cell } from "../types/notebook";

interface IpynbCell {
  cell_type: "markdown" | "code";
  metadata: Record<string, unknown>;
  source: string[];
  outputs?: unknown[];
  execution_count?: number | null;
}

interface IpynbNotebook {
  nbformat: number;
  nbformat_minor: number;
  metadata: {
    kernelspec: {
      display_name: string;
      language: string;
      name: string;
    };
    language_info: {
      name: string;
      version: string;
    };
  };
  cells: IpynbCell[];
}

/**
 * 우리 Cell 배열을 .ipynb JSON으로 변환
 */
export function cellsToIpynb(cells: Cell[]): IpynbNotebook {
  return {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3",
      },
      language_info: {
        name: "python",
        version: "3.12.0",
      },
    },
    cells: cells.map((cell) => {
      // source를 줄 단위 배열로 (ipynb 규격)
      const sourceLines = cell.source.split("\n").map((line, i, arr) =>
        i < arr.length - 1 ? line + "\n" : line
      );

      if (cell.type === "markdown") {
        return {
          cell_type: "markdown",
          metadata: {},
          source: sourceLines,
        };
      }

      // code cell
      const outputs: unknown[] = [];

      // stdout/stderr/result → ipynb output 형식으로 변환
      const textOutputs = cell.outputs
        .filter((o) => o.stream === "stdout" || o.stream === "result")
        .map((o) => o.text);

      if (textOutputs.length > 0) {
        outputs.push({
          output_type: "stream",
          name: "stdout",
          text: textOutputs.flatMap((t) =>
            t.split("\n").map((line, i, arr) =>
              i < arr.length - 1 ? line + "\n" : line
            )
          ),
        });
      }

      const errorOutputs = cell.outputs.filter(
        (o) => o.stream === "error" || o.stream === "stderr"
      );
      if (errorOutputs.length > 0) {
        outputs.push({
          output_type: "stream",
          name: "stderr",
          text: errorOutputs.flatMap((t) =>
            t.text.split("\n").map((line, i, arr) =>
              i < arr.length - 1 ? line + "\n" : line
            )
          ),
        });
      }

      return {
        cell_type: "code",
        metadata: {},
        source: sourceLines,
        outputs,
        execution_count: cell.executionCount ?? null,
      };
    }),
  };
}

/**
 * .ipynb JSON을 파일로 다운로드
 */
export function downloadIpynb(cells: Cell[], filename = "notebook.ipynb") {
  const notebook = cellsToIpynb(cells);
  const json = JSON.stringify(notebook, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

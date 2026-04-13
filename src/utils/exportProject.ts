import JSZip from "jszip";
import type { FileEntry } from "../store/fileStore";

/**
 * IDE 프로젝트를 ZIP으로 다운로드.
 * 폴더 구조는 파일 경로에서 유추 (예: "src/utils.py" → src/utils.py).
 */
export async function downloadProjectZip(
  files: Record<string, FileEntry>,
  filename = "aigolab-project.zip"
): Promise<void> {
  const zip = new JSZip();

  for (const [path, entry] of Object.entries(files)) {
    zip.file(path, entry.content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

import JSZip from "jszip";
import type { FileEntry } from "../store/fileStore";

/**
 * ZIP 파일을 읽어서 IDE 프로젝트 파일 맵으로 변환.
 *
 * - 텍스트 파일만 읽음 (확장자 기반). 바이너리로 보이는 파일은 스킵.
 * - 공통 루트 폴더가 있으면 strip (예: my-project/main.py → main.py).
 * - __MACOSX/, .DS_Store 등 시스템 노이즈는 스킵.
 *
 * @returns files: 성공적으로 읽힌 파일. skipped: 스킵된 파일명 목록.
 */
export async function importProjectZip(
  zipBlob: Blob
): Promise<{ files: Record<string, FileEntry>; skipped: string[] }> {
  const zip = await JSZip.loadAsync(zipBlob);

  // 1. 의미있는 엔트리만 수집 (폴더 엔트리 / 시스템 파일 제외)
  const entries: { path: string; obj: JSZip.JSZipObject }[] = [];
  zip.forEach((relativePath, obj) => {
    if (obj.dir) return;
    if (relativePath.startsWith("__MACOSX/")) return;
    if (relativePath.endsWith(".DS_Store")) return;
    if (relativePath.endsWith("/")) return;
    entries.push({ path: relativePath, obj });
  });

  if (entries.length === 0) {
    return { files: {}, skipped: [] };
  }

  // 2. 공통 루트 폴더 감지 (모든 파일이 같은 최상위 폴더로 시작하면 그걸 strip)
  const commonRoot = detectCommonRoot(entries.map((e) => e.path));

  // 3. 텍스트 파일만 비동기로 읽기
  const files: Record<string, FileEntry> = {};
  const skipped: string[] = [];

  await Promise.all(
    entries.map(async ({ path, obj }) => {
      const relPath = commonRoot ? path.slice(commonRoot.length) : path;
      if (!relPath || relPath.startsWith("/")) return;

      if (!isTextFile(relPath)) {
        skipped.push(relPath);
        return;
      }

      try {
        const content = await obj.async("string");
        files[relPath] = {
          name: relPath,
          content,
          language: inferLanguage(relPath),
        };
      } catch {
        skipped.push(relPath);
      }
    })
  );

  return { files, skipped };
}

/** 모든 경로가 공통 최상위 디렉토리로 시작하면 그 prefix(끝 /포함)를 반환. 아니면 "". */
function detectCommonRoot(paths: string[]): string {
  if (paths.length === 0) return "";
  const firstSlash = paths[0].indexOf("/");
  if (firstSlash < 0) return "";
  const candidate = paths[0].slice(0, firstSlash + 1);
  for (const p of paths) {
    if (!p.startsWith(candidate)) return "";
  }
  return candidate;
}

const TEXT_EXTS = new Set([
  ".py", ".txt", ".md", ".json", ".yml", ".yaml", ".toml", ".ini",
  ".cfg", ".csv", ".html", ".htm", ".css", ".js", ".ts", ".tsx", ".jsx",
  ".sh", ".env", ".gitignore",
]);

function isTextFile(path: string): boolean {
  const name = path.split("/").pop() ?? "";
  if (name.startsWith(".")) {
    // .gitignore, .env 등 확장자 없는 도트파일
    return TEXT_EXTS.has(name);
  }
  const dot = name.lastIndexOf(".");
  if (dot < 0) return false; // 확장자 없는 파일은 일단 스킵
  return TEXT_EXTS.has(name.slice(dot).toLowerCase());
}

function inferLanguage(path: string): string {
  const name = path.split("/").pop() ?? "";
  const dot = name.lastIndexOf(".");
  if (dot < 0) return "plaintext";
  const ext = name.slice(dot + 1).toLowerCase();
  switch (ext) {
    case "py": return "python";
    case "js": return "javascript";
    case "ts": return "typescript";
    case "tsx": return "typescript";
    case "jsx": return "javascript";
    case "json": return "json";
    case "md": return "markdown";
    case "html":
    case "htm": return "html";
    case "css": return "css";
    case "yml":
    case "yaml": return "yaml";
    default: return "plaintext";
  }
}

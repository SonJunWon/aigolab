/**
 * 강의 정리 — STT (기획 3-2).
 *
 * 1차: Groq Whisper (whisper-large-v3-turbo) — 기존 BYOK Groq 키 재사용.
 * 청크(5분, 완결형 webm)를 순차 업로드하고 [mm:ss] 오프셋을 붙여 이어붙인다.
 * 실패 청크만 1회 재시도 — 전체 재변환 방지 (기획 7. 리스크).
 *
 * (Gemini 멀티모달 폴백은 Phase 2 — 함수 시그니처는 폴백 추가를 전제로 설계)
 */

import { requireKey } from "../llm";
import { getSessionChunks } from "./db";

const GROQ_STT_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const MODEL = "whisper-large-v3-turbo";

function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

async function transcribeBlob(apiKey: string, blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", blob, "chunk.webm");
  form.append("model", MODEL);
  form.append("temperature", "0");
  form.append("response_format", "json");
  const res = await fetch(GROQ_STT_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Groq STT ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as { text?: string };
  return (json.text ?? "").trim();
}

/**
 * 세션의 전체 청크를 순차 변환해 타임스탬프 달린 전사를 반환.
 * onProgress(done, total) 로 UI 진행률 갱신.
 */
export async function transcribeSession(
  sessionId: string,
  onProgress?: (done: number, total: number) => void,
): Promise<string> {
  const apiKey = await requireKey("groq");
  const chunks = await getSessionChunks(sessionId);
  if (!chunks.length) throw new Error("녹음 청크가 없습니다.");

  const parts: string[] = [];
  let done = 0;
  onProgress?.(0, chunks.length);
  for (const chunk of chunks) {
    let text: string;
    try {
      text = await transcribeBlob(apiKey, chunk.blob);
    } catch {
      // 실패 청크만 1회 재시도 — 그래도 실패하면 구간 누락 표기 후 계속 (전체를 죽이지 않는다)
      try {
        text = await transcribeBlob(apiKey, chunk.blob);
      } catch (e2) {
        text = `(이 구간 변환 실패: ${e2 instanceof Error ? e2.message : "unknown"})`;
      }
    }
    parts.push(`[${fmtTime(chunk.startSec)}] ${text}`);
    done += 1;
    onProgress?.(done, chunks.length);
  }
  return parts.join("\n\n");
}

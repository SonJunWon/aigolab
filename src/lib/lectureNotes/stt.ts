/**
 * 강의 정리 — STT (기획 3-2, Phase 2 폴백 포함).
 *
 * 1차: Groq Whisper (whisper-large-v3-turbo) — 기존 BYOK Groq 키 재사용.
 * 2차: Gemini 멀티모달 (gemini-2.5-flash, inlineData 오디오) — Groq 실패/키 부재 시 폴백.
 *      5분 청크 ≈ 1.2MB(base64 ≈ 1.6MB)로 inline 20MB 한도에 여유.
 *
 * 청크(5분, 완결형 webm)를 순차 변환하고 [m:ss] 오프셋을 붙여 이어붙인다.
 * 실패 청크만 재시도 — 전체 재변환 방지 (기획 7. 리스크).
 */

import { getKey, requireKey } from "../llm";
import { getSessionChunks } from "./db";

const GROQ_STT_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const GROQ_MODEL = "whisper-large-v3-turbo";
const GEMINI_MODEL = "gemini-2.5-flash";

function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

// ── 1차: Groq Whisper ──
async function transcribeGroq(apiKey: string, blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", blob, "chunk.webm");
  form.append("model", GROQ_MODEL);
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

// ── 2차: Gemini 멀티모달 폴백 ──
async function blobToBase64(blob: Blob): Promise<string> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  const STEP = 0x8000; // 스택 한도 회피 — 32K 단위로 변환
  for (let i = 0; i < buf.length; i += STEP) {
    bin += String.fromCharCode(...buf.subarray(i, i + STEP));
  }
  return btoa(bin);
}

async function transcribeGemini(blob: Blob): Promise<string> {
  const apiKey = await requireKey("gemini");
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });
  const data = await blobToBase64(blob);
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: "audio/webm", data } },
          { text: "이 오디오를 있는 그대로 전사하라. 화자 표시·해설·요약 없이 발화 내용 텍스트만 출력." },
        ],
      },
    ],
  });
  const text = (response.text ?? "").trim();
  if (!text) throw new Error("Gemini STT: 빈 응답");
  return text;
}

/**
 * 청크 1개 변환 — Groq 1차(재시도 1회) → Gemini 폴백.
 * 라이브 노트(녹음 중 실시간)와 일괄 변환이 공유하는 단일 경로.
 */
export async function transcribeChunkBlob(blob: Blob): Promise<string> {
  const groqKey = await getKey("groq");
  if (groqKey) {
    try {
      return await transcribeGroq(groqKey, blob);
    } catch {
      try {
        return await transcribeGroq(groqKey, blob); // 일시 오류 재시도 1회
      } catch { /* → Gemini 폴백 */ }
    }
  }
  return transcribeGemini(blob); // Groq 키 부재/연속 실패 → 폴백 (gemini 키도 없으면 throw)
}

/**
 * 세션의 전체 청크를 순차 변환해 타임스탬프 달린 전사를 반환.
 * onProgress(done, total) 로 UI 진행률 갱신.
 */
export async function transcribeSession(
  sessionId: string,
  onProgress?: (done: number, total: number) => void,
): Promise<string> {
  const chunks = await getSessionChunks(sessionId);
  if (!chunks.length) throw new Error("녹음 청크가 없습니다.");

  const parts: string[] = [];
  let done = 0;
  onProgress?.(0, chunks.length);
  for (const chunk of chunks) {
    let text: string;
    try {
      text = await transcribeChunkBlob(chunk.blob);
    } catch (e) {
      // Groq·Gemini 모두 실패 — 구간 누락 표기 후 계속 (전체를 죽이지 않는다)
      text = `(이 구간 변환 실패: ${e instanceof Error ? e.message : "unknown"})`;
    }
    parts.push(`[${fmtTime(chunk.startSec)}] ${text}`);
    done += 1;
    onProgress?.(done, chunks.length);
  }
  return parts.join("\n\n");
}

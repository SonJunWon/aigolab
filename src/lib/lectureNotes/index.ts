/**
 * 관리자 강의 정리 프로그램 — 공개 API.
 * 파이프라인: startRecording → (stop) → transcribeSession → summarizeTranscript → putNote
 */
export { startRecording } from "./recorder";
export type { RecorderHandle } from "./recorder";
export { transcribeSession } from "./stt";
export { summarizeTranscript } from "./summarize";
export {
  putNote,
  getNote,
  listNotes,
  deleteNote,
  deleteSessionChunks,
  listOrphanSessions,
} from "./db";
export type { LectureNote, LectureSummary, PipelineStage, RecordingChunk } from "./types";

import type { LectureNote } from "./types";

/** 정리본을 Markdown 문서로 (내보내기 — 개인 학습용) */
export function noteToMarkdown(note: LectureNote): string {
  const s = note.summary;
  const lines: string[] = [
    `# ${note.title}`,
    "",
    `> 출처: ${note.source || "-"} · 녹음: ${note.recordedAt.slice(0, 16).replace("T", " ")} · 길이: ${Math.round(note.durationSec / 60)}분`,
    "",
  ];
  if (s) {
    lines.push(`**한 줄 요약** — ${s.oneLiner}`, "");
    if (s.keyConcepts.length) {
      lines.push("## 핵심 개념");
      for (const c of s.keyConcepts) {
        lines.push(`- **${c.name}**: ${c.explanation}${c.example ? ` _(예: ${c.example})_` : ""}`);
      }
      lines.push("");
    }
    if (s.outline.length) {
      lines.push("## 타임라인");
      for (const o of s.outline) lines.push(`- \`${o.time}\` **${o.heading}** — ${o.summary}`);
      lines.push("");
    }
    if (s.terms.length) {
      lines.push("## 용어");
      for (const t of s.terms) lines.push(`- **${t.term}**: ${t.definition}`);
      lines.push("");
    }
    if (s.actionItems.length) {
      lines.push("## 액션 아이템");
      for (const a of s.actionItems) lines.push(`- [ ] ${a}`);
      lines.push("");
    }
    if (s.myBookmarks.length) {
      lines.push("## 내 북마크");
      for (const b of s.myBookmarks) lines.push(`- ${b}`);
      lines.push("");
    }
    if (s.quotes.length) {
      lines.push("## 인용");
      for (const q of s.quotes) lines.push(`> ${q}`);
      lines.push("");
    }
  }
  lines.push("---", "", "<details><summary>원문 전사</summary>", "", note.transcript, "", "</details>", "");
  return lines.join("\n");
}

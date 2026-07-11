/**
 * 관리자 강의 정리 프로그램 — 공개 API.
 * 파이프라인: startRecording → (stop) → transcribeSession → summarizeTranscript → putNote
 */
export { startRecording } from "./recorder";
export type { RecorderHandle, RecordingOptions } from "./recorder";
export { transcribeSession, transcribeChunkBlob } from "./stt";
export { summarizeTranscript, quickChunkSummary } from "./summarize";
export {
  putNote,
  getNote,
  listNotes,
  deleteNote,
  deleteSessionChunks,
  listOrphanSessions,
} from "./db";
export type { LectureNote, LectureSummary, PipelineStage, RecordingChunk } from "./types";

import { putNote as dbPut, deleteNote as dbDelete, listNotes as dbList, deleteSessionChunks as dbDeleteChunks } from "./db";
import { upsertNoteCloud, deleteNoteCloud, fetchCloudNotes, CLOUD_ENABLED } from "./cloud";
import type { LectureNote } from "./types";

/** 클라우드 동기화 활성 여부 — UI 배지 분기용 (cloud.ts 스위치 재노출) */
export const cloudEnabled = CLOUD_ENABLED;

// ── Phase 2: 로컬 + 클라우드 동기 저장 계층 ──
// 원칙: 로컬 먼저(즉시성), 클라우드는 best-effort. 반환값 cloud 로 동기화 성패 표시.

/** 저장/수정 — updatedAt 스탬프 후 IDB + Supabase 동시 기록 */
export async function saveNote(note: LectureNote): Promise<{ cloud: boolean }> {
  const stamped: LectureNote = { ...note, updatedAt: new Date().toISOString() };
  await dbPut(stamped);
  const cloud = await upsertNoteCloud(stamped);
  return { cloud };
}

/** 삭제 — 노트 + 남은 오디오 청크 + 클라우드 행 */
export async function removeNote(id: string): Promise<{ cloud: boolean }> {
  await dbDelete(id);
  await dbDeleteChunks(id);
  const cloud = await deleteNoteCloud(id);
  return { cloud };
}

/**
 * 양방향 동기화 (목록 진입 시 호출).
 * pull: 클라우드 행을 updatedAt last-write-wins 로 로컬에 병합.
 * push: 클라우드에 없는 로컬 노트를 업로드 (P1 시절 로컬 전용 노트 승격).
 * 오프라인/비admin 이면 { cloud:false } — 로컬만으로 계속 동작.
 */
export async function syncNotes(): Promise<{ cloud: boolean; pulled: number; pushed: number }> {
  const cloudNotes = await fetchCloudNotes();
  if (cloudNotes === null) return { cloud: false, pulled: 0, pushed: 0 };

  const local = await dbList();
  const localMap = new Map(local.map((n) => [n.id, n]));
  let pulled = 0;
  for (const cn of cloudNotes) {
    const ln = localMap.get(cn.id);
    if (!ln || (cn.updatedAt ?? "") > (ln.updatedAt ?? "")) {
      await dbPut(cn);
      pulled += 1;
    }
  }
  const cloudIds = new Set(cloudNotes.map((c) => c.id));
  let pushed = 0;
  for (const ln of local) {
    if (!cloudIds.has(ln.id)) {
      if (await upsertNoteCloud({ ...ln, updatedAt: ln.updatedAt ?? ln.recordedAt })) pushed += 1;
    }
  }
  return { cloud: true, pulled, pushed };
}

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

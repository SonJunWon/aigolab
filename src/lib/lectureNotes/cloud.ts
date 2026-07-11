/**
 * 강의 정리 — Supabase 영속화 (Phase 2).
 *
 * 원칙:
 *   - IndexedDB(로컬) = 빠른 캐시, Supabase = 기기 간 영속 저장.
 *   - 모든 클라우드 호출은 best-effort — 실패해도 로컬 동작을 막지 않는다 (오프라인 허용).
 *   - 병합은 updatedAt 기준 last-write-wins.
 *   - RLS(admin 전용)는 서버가 강제 — 클라이언트는 결과만 신뢰.
 *
 * 테이블: public.admin_lecture_notes (migrations/v4.43.0_admin_lecture_notes.sql)
 */

import { supabase } from "../supabase";
import type { LectureNote, LectureSummary } from "./types";

/**
 * 클라우드 동기화 스위치.
 * Supabase에 migrations/v4.43.0_admin_lecture_notes.sql 적용 후 true 로 변경.
 * false 인 동안: 네트워크 호출 0회, 전부 로컬(IndexedDB) 전용 — UI에는 '로컬 저장 모드' 표시.
 */
export const CLOUD_ENABLED = false;

const TABLE = "admin_lecture_notes";

interface Row {
  id: string;
  title: string;
  source: string;
  recorded_at: string;
  duration_sec: number;
  transcript: string;
  summary: LectureSummary | null;
  bookmarks: number[];
  tags: string[];
  keep_audio: boolean;
  updated_at: string;
}

function toRow(n: LectureNote): Omit<Row, "updated_at"> & { updated_at: string } {
  return {
    id: n.id,
    title: n.title,
    source: n.source,
    recorded_at: n.recordedAt,
    duration_sec: n.durationSec,
    transcript: n.transcript,
    summary: n.summary,
    bookmarks: n.bookmarks,
    tags: n.tags,
    keep_audio: n.keepAudio,
    updated_at: n.updatedAt ?? new Date().toISOString(),
  };
}

function fromRow(r: Row): LectureNote {
  return {
    id: r.id,
    title: r.title,
    source: r.source,
    recordedAt: r.recorded_at,
    durationSec: r.duration_sec,
    transcript: r.transcript,
    summary: r.summary,
    bookmarks: r.bookmarks ?? [],
    tags: r.tags ?? [],
    keepAudio: r.keep_audio,
    updatedAt: r.updated_at,
  };
}

/** 업서트 — 성공 여부 반환 (실패해도 던지지 않음) */
export async function upsertNoteCloud(note: LectureNote): Promise<boolean> {
  if (!CLOUD_ENABLED) return false;
  try {
    const { error } = await supabase.from(TABLE).upsert(toRow(note));
    return !error;
  } catch {
    return false;
  }
}

export async function deleteNoteCloud(id: string): Promise<boolean> {
  if (!CLOUD_ENABLED) return false;
  try {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

/** 전체 조회 — 실패(오프라인·비admin) 시 null */
export async function fetchCloudNotes(): Promise<LectureNote[] | null> {
  if (!CLOUD_ENABLED) return null;
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("recorded_at", { ascending: false });
    if (error || !data) return null;
    return (data as Row[]).map(fromRow);
  } catch {
    return null;
  }
}

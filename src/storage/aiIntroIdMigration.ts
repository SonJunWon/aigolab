/**
 * AI 입문(intro) 트랙 — 레슨 ID 한 번 적용하는 IDB 마이그레이션.
 *
 * - notebooks: 구 ID 키의 노트북을 신 ID 키로 복사 (구 키는 보존하지 않고 삭제).
 * - progress("ai-engineering:intro"): completedLessons[]·currentLesson 의 구 ID 를 신 ID 로 치환.
 * - localStorage 플래그로 1회만 수행.
 *
 * Supabase 측 데이터(user_progress, quiz_results) 는 별도 SQL 마이그레이션으로 처리.
 */

import { LEGACY_AI_INTRO_ID_MAP } from "../content/ai-engineering/intro/legacyIds";
import { getDB } from "./db";

const FLAG_KEY = "aigolab.aiIntroIdMigration.v1";

export async function runAiIntroIdMigration(): Promise<void> {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(FLAG_KEY) === "done") return;

  try {
    const db = await getDB();

    // 1) notebooks: 구 ID 키 → 신 ID 키
    for (const [oldId, newId] of Object.entries(LEGACY_AI_INTRO_ID_MAP)) {
      const old = await db.get("notebooks", oldId);
      if (!old) continue;
      const exists = await db.get("notebooks", newId);
      if (!exists) {
        await db.put("notebooks", { ...old, id: newId });
      }
      await db.delete("notebooks", oldId);
    }

    // 2) progress("ai-engineering:intro")
    const progressKey = "ai-engineering:intro";
    const progress = await db.get("progress", progressKey);
    if (progress) {
      const remap = (id: string): string => LEGACY_AI_INTRO_ID_MAP[id] ?? id;
      const completedLessons = Array.from(
        new Set(progress.completedLessons.map(remap)),
      );
      const currentLesson = progress.currentLesson
        ? remap(progress.currentLesson)
        : progress.currentLesson;
      const changed =
        completedLessons.length !== progress.completedLessons.length ||
        completedLessons.some((id, i) => id !== progress.completedLessons[i]) ||
        currentLesson !== progress.currentLesson;
      if (changed) {
        await db.put("progress", { ...progress, completedLessons, currentLesson });
      }
    }

    localStorage.setItem(FLAG_KEY, "done");
    console.log("[ai-intro-migration] IDB migration done");
  } catch (err) {
    console.warn("[ai-intro-migration] failed:", err);
  }
}

import { create } from "zustand";
import {
  loadProgress as loadFromIDB,
  markLessonCompleted as markInIDB,
  setCurrentLesson as setCurrentInIDB,
  resetProgress as resetInIDB,
  listAllProgress as listAllFromIDB,
} from "../storage/progressRepo";
import {
  loadProgressFromSupabase,
  loadAllProgressFromSupabase,
  markLessonCompletedInSupabase,
  setCurrentLessonInSupabase,
  migrateProgressToSupabase,
} from "../storage/supabaseProgressRepo";
import { useAuthStore } from "./authStore";
import type { Language, Track } from "../types/lesson";

/**
 * 진도 스토어.
 *
 * 로그인 시: Supabase에서 읽기/쓰기
 * 비로그인 시: IndexedDB에서 읽기/쓰기
 * 첫 로그인 시: IDB → Supabase 자동 마이그레이션
 */

interface ProgressData {
  completedLessons: string[];
  currentLesson?: string;
  lastStudiedAt: number;
}

interface ProgressState {
  data: Record<string, ProgressData>;
  loadedKeys: Set<string>;
  migrated: boolean;

  ensureLoaded: (language: Language, track: Track) => Promise<void>;
  completeLesson: (language: Language, track: Track, lessonId: string) => Promise<void>;
  setCurrent: (language: Language, track: Track, lessonId: string) => Promise<void>;
  reset: (language: Language, track: Track) => Promise<void>;
  isCompleted: (language: Language, track: Track, lessonId: string) => boolean;
  getProgress: (language: Language, track: Track) => ProgressData | undefined;

  /** 로그인 직후 IDB → Supabase 마이그레이션 */
  migrateToServer: () => Promise<void>;
  /** 모든 진도 로드 (이어서 학습 배너용) */
  loadAll: () => Promise<ProgressData[]>;
}

const progressKey = (language: Language, track: Track) => `${language}:${track}`;

function getUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  data: {},
  loadedKeys: new Set(),
  migrated: false,

  ensureLoaded: async (language, track) => {
    const key = progressKey(language, track);
    if (get().loadedKeys.has(key)) return;

    // race condition 방지: 먼저 loadedKeys에 추가
    set((s) => ({ loadedKeys: new Set([...s.loadedKeys, key]) }));

    const userId = getUserId();

    let progress: ProgressData | null = null;

    if (userId) {
      // 로그인: Supabase에서 로드
      console.log("[progress] loading from Supabase:", language, track, "userId:", userId);
      const remote = await loadProgressFromSupabase(userId, language, track);
      console.log("[progress] Supabase result:", remote);
      if (remote) {
        progress = {
          completedLessons: remote.completed_lessons,
          currentLesson: remote.current_lesson ?? undefined,
          lastStudiedAt: new Date(remote.last_studied_at).getTime(),
        };
      }
    } else {
      // 비로그인: IDB에서 로드
      const local = await loadFromIDB(language, track);
      if (local) {
        progress = {
          completedLessons: local.completedLessons,
          currentLesson: local.currentLesson,
          lastStudiedAt: local.lastStudiedAt,
        };
      }
    }

    if (progress) {
      set((state) => ({
        data: { ...state.data, [key]: progress },
      }));
    }
  },

  completeLesson: async (language, track, lessonId) => {
    const userId = getUserId();
    const key = progressKey(language, track);

    if (userId) {
      await markLessonCompletedInSupabase(userId, language, track, lessonId);
    } else {
      await markInIDB(language, track, lessonId);
    }

    // 메모리 업데이트
    set((state) => {
      const existing = state.data[key];
      const completed = existing?.completedLessons.includes(lessonId)
        ? existing.completedLessons
        : [...(existing?.completedLessons ?? []), lessonId];

      return {
        data: {
          ...state.data,
          [key]: {
            completedLessons: completed,
            currentLesson: lessonId,
            lastStudiedAt: Date.now(),
          },
        },
      };
    });
  },

  setCurrent: async (language, track, lessonId) => {
    const userId = getUserId();
    const key = progressKey(language, track);

    if (userId) {
      await setCurrentLessonInSupabase(userId, language, track, lessonId);
    } else {
      await setCurrentInIDB(language, track, lessonId);
    }

    set((state) => ({
      data: {
        ...state.data,
        [key]: {
          completedLessons: state.data[key]?.completedLessons ?? [],
          currentLesson: lessonId,
          lastStudiedAt: Date.now(),
        },
      },
    }));
  },

  reset: async (language, track) => {
    const key = progressKey(language, track);
    await resetInIDB(language, track);
    // Supabase 리셋은 나중에 필요시 추가

    set((state) => {
      const nextData = { ...state.data };
      delete nextData[key];
      return { data: nextData };
    });
  },

  isCompleted: (language, track, lessonId) => {
    const key = progressKey(language, track);
    return !!get().data[key]?.completedLessons.includes(lessonId);
  },

  getProgress: (language, track) => {
    return get().data[progressKey(language, track)];
  },

  migrateToServer: async () => {
    if (get().migrated) return;
    const userId = getUserId();
    if (!userId) return;

    try {
      const allLocal = await listAllFromIDB();
      if (allLocal.length > 0) {
        await migrateProgressToSupabase(
          userId,
          allLocal.map((p) => ({
            language: p.language,
            track: p.track,
            completedLessons: p.completedLessons,
            currentLesson: p.currentLesson,
            lastStudiedAt: p.lastStudiedAt,
          }))
        );
      }
    } catch (e) {
      console.error("[progressStore] migration error:", e);
    }

    // 캐시 리셋해서 다음 로드 시 Supabase에서 가져오게
    set({ migrated: true, loadedKeys: new Set(), data: {} });
  },

  loadAll: async () => {
    const userId = getUserId();
    let items: ProgressData[] = [];

    if (userId) {
      const remote = await loadAllProgressFromSupabase(userId);
      items = remote.map((r) => ({
        completedLessons: r.completed_lessons,
        currentLesson: r.current_lesson ?? undefined,
        lastStudiedAt: new Date(r.last_studied_at).getTime(),
      }));
    } else {
      const local = await listAllFromIDB();
      items = local.map((l) => ({
        completedLessons: l.completedLessons,
        currentLesson: l.currentLesson,
        lastStudiedAt: l.lastStudiedAt,
      }));
    }

    return items;
  },
}));

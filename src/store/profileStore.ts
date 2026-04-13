import { create } from "zustand";
import { loadProfile, upsertProfile } from "../storage/supabaseProfileRepo";

/**
 * 사용자 프로필 캐시 스토어.
 *
 * - 로그인 시 authStore → loadForUser(userId) 호출
 * - 로그아웃 시 clear()
 * - 편집 시 save(nickname, emoji) → Supabase upsert + 로컬 반영
 */

interface ProfileState {
  userId: string | null;
  nickname: string | null;
  avatarEmoji: string | null;
  loading: boolean;

  loadForUser: (userId: string) => Promise<void>;
  save: (
    userId: string,
    nickname: string,
    avatarEmoji: string
  ) => Promise<{ error?: string }>;
  clear: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  userId: null,
  nickname: null,
  avatarEmoji: null,
  loading: false,

  loadForUser: async (userId) => {
    set({ loading: true, userId });
    const profile = await loadProfile(userId);
    set({
      userId,
      nickname: profile?.nickname ?? null,
      avatarEmoji: profile?.avatar_emoji ?? null,
      loading: false,
    });
  },

  save: async (userId, nickname, avatarEmoji) => {
    const result = await upsertProfile(userId, nickname, avatarEmoji);
    if (!result.error) {
      set({ userId, nickname, avatarEmoji });
    }
    return result;
  },

  clear: () => set({ userId: null, nickname: null, avatarEmoji: null }),
}));

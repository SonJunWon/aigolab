import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { useProfileStore } from "./profileStore";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  /** 앱 시작 시 세션 복원 + 실시간 구독 */
  initialize: () => Promise<void>;

  /** 이메일 회원가입 */
  signUp: (email: string, password: string) => Promise<{ error?: string }>;

  /** 이메일 로그인 */
  signIn: (email: string, password: string) => Promise<{ error?: string }>;

  /** Google OAuth 로그인 */
  signInWithGoogle: () => Promise<{ error?: string }>;

  /** 로그아웃 */
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;

    // 기존 세션 복원
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({
      session,
      user: session?.user ?? null,
      initialized: true,
    });

    // 기존 세션이 있으면 프로필 로드
    if (session?.user) {
      void useProfileStore.getState().loadForUser(session.user.id);
    }

    // 세션 변경 실시간 구독 (로그인/로그아웃/토큰 갱신)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
      });
      if (session?.user) {
        void useProfileStore.getState().loadForUser(session.user.id);
      } else {
        useProfileStore.getState().clear();
      }
    });
  },

  signUp: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });

    if (error) return { error: error.message };
    return {};
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    set({ loading: false });

    if (error) return { error: error.message };
    return {};
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };
    return {};
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
    useProfileStore.getState().clear();
  },
}));

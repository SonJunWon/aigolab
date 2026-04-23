import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { useProfileStore } from "./profileStore";
import { useNotebookStore } from "./notebookStore";
import { useProgressStore } from "./progressStore";
import { useFileStore } from "./fileStore";
import { useMdFileStore } from "./mdFileStore";
import type { User, Session } from "@supabase/supabase-js";

/**
 * 로그아웃/세션 해제 시 모든 사용자 범위 인메모리 스토어 초기화.
 * 공용 기기에서 사용자 A → 사용자 B 로 전환될 때 이전 세션 데이터가
 * 화면에 남아 유출되는 것을 막는다.
 *
 * 주의: IndexedDB 는 디바이스 로컬 저장소라 여기서 비우지 않는다.
 * (본인 기기에서 다시 로그인 시 복원 편의 유지) — 필요 시 별도 "로컬
 * 데이터 삭제" UI 로 처리할 것. 레슨 노트북 등 일부 IDB 데이터가
 * 디바이스 공유 시 유출될 가능성은 향후 user.id 네임스페이싱으로 해결.
 */
function clearAllUserStores() {
  useProfileStore.getState().clear();
  useNotebookStore.getState().clear();
  useProgressStore.getState().clear();
  useFileStore.getState().clear();
  useMdFileStore.getState().clear();
}

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
        clearAllUserStores();
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
    clearAllUserStores();
  },
}));

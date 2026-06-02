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
 * (본인 기기에서 다시 로그인 시 복원 편의 유지). 디바이스 공유 시 다른
 * 사용자에게 노출되던 문제(C1)는 IDB 키를 사용자별로 네임스페이스화하여
 * 해결됨 (storage/localOwner.ts — `usr:<uid>:<키>`, 마크다운은 ownerId 필터).
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
    supabase.auth.onAuthStateChange((event, session) => {
      set({
        session,
        user: session?.user ?? null,
      });
      if (session?.user) {
        void useProfileStore.getState().loadForUser(session.user.id);
      } else if (event === "SIGNED_OUT") {
        // 실제 로그아웃 시에만 인메모리 스토어 초기화.
        // onAuthStateChange 는 페이지 로드마다 INITIAL_SESSION 을 발생시키는데,
        // 비로그인 방문자는 session=null 이라 예전엔 여기서 clear() 가 호출됐다.
        // 그 clear() 가 LessonPage 의 loadCells() 와 레이스를 일으켜, 세션 조회가
        // 캐시된 재방문(웜 로드)에서 노트북이 빈 화면이 되는 버그가 있었다
        // (친화 미리보기 트랙 재방문 빈 화면). INITIAL_SESSION 의 null 은 유출할
        // 인메모리 데이터가 없으므로 clear 하지 않는다.
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

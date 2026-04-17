import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
  );
}

/**
 * Supabase 클라이언트 — 세션 영속성 정책:
 *
 * - persistSession: true → localStorage에 세션 저장 (브라우저 닫아도 유지)
 * - autoRefreshToken: true → 만료 전 자동 갱신 (사용자 조작 없이 연장)
 * - detectSessionInUrl: true → OAuth 콜백 URL에서 세션 자동 감지
 *
 * 결과: 한번 로그인하면 명시적 로그아웃 전까지 세션 유지
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "aigolab-auth",
  },
});

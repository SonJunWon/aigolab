/**
 * 사용자 프로필 저장/로드 (profiles 테이블).
 *
 * - 가입 시 DB Trigger가 자동 생성 (nickname = 이메일 @ 앞부분, 기본 이모지 🙂)
 * - 사용자는 언제든 닉네임/이모지 수정 가능
 */

import { supabase } from "../lib/supabase";

export interface UserProfile {
  user_id: string;
  nickname: string | null;
  avatar_emoji: string | null;
}

/** 특정 사용자의 프로필 로드 */
export async function loadProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, nickname, avatar_emoji")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[profile] loadProfile error:", error.message);
    return null;
  }
  return data;
}

/**
 * 프로필 업서트 (저장).
 * Trigger가 미리 row를 생성해둔 경우 update로 동작, 엣지 케이스(트리거 실패)엔 insert.
 */
export async function upsertProfile(
  userId: string,
  nickname: string,
  avatarEmoji: string
): Promise<{ error?: string }> {
  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: userId,
      nickname,
      avatar_emoji: avatarEmoji,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) {
    console.error("[profile] upsertProfile error:", error.message);
    return { error: error.message };
  }
  return {};
}

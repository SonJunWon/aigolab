/**
 * user_entitlements 테이블 repo.
 *
 * 정책:
 *   - 본인 entitlements 는 누구나 조회 가능 (RLS)
 *   - 전체 사용자 리스트·타인 혜택 편집은 admin 만 (RLS)
 */

import { supabase } from "../lib/supabase";
import type {
  Entitlement,
  EntitlementKind,
  EntitlementSource,
} from "../types/entitlement";

/** 로그인 사용자의 혜택 목록 로드 */
export async function loadMyEntitlements(
  userId: string
): Promise<Entitlement[]> {
  const { data, error } = await supabase
    .from("user_entitlements")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("[entitlements] loadMyEntitlements error:", error.message);
    return [];
  }
  return (data as Entitlement[]) ?? [];
}

/** ── 이하 함수는 admin 만 호출 가능 (RLS 로 차단됨) ── */

export interface AdminUserRow {
  user_id: string;
  email: string | null;
  nickname: string | null;
  avatar_emoji: string | null;
}

/** 전체 사용자 리스트 (admin 전용 RLS) */
export async function listAllProfiles(): Promise<AdminUserRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, email, nickname, avatar_emoji")
    .order("email", { ascending: true });

  if (error) {
    console.error("[entitlements] listAllProfiles error:", error.message);
    return [];
  }
  return (data as AdminUserRow[]) ?? [];
}

/** 여러 사용자의 혜택 한 번에 로드 (admin 전용) */
export async function listEntitlementsForUsers(
  userIds: string[]
): Promise<Entitlement[]> {
  if (userIds.length === 0) return [];
  const { data, error } = await supabase
    .from("user_entitlements")
    .select("*")
    .in("user_id", userIds);

  if (error) {
    console.error(
      "[entitlements] listEntitlementsForUsers error:",
      error.message
    );
    return [];
  }
  return (data as Entitlement[]) ?? [];
}

/** 한 사용자에게 혜택 부여 (admin 전용) */
export async function grantEntitlement(params: {
  userId: string;
  entitlement: EntitlementKind;
  grantedBy: string | null;
  expiresAt?: string | null;
  source?: EntitlementSource;
  note?: string | null;
}): Promise<{ error?: string }> {
  const { error } = await supabase.from("user_entitlements").upsert(
    {
      user_id: params.userId,
      entitlement: params.entitlement,
      granted_by: params.grantedBy,
      expires_at: params.expiresAt ?? null,
      source: params.source ?? "admin",
      note: params.note ?? null,
    },
    { onConflict: "user_id,entitlement" }
  );
  if (error) {
    console.error("[entitlements] grantEntitlement error:", error.message);
    return { error: error.message };
  }
  return {};
}

/** 한 사용자의 혜택 회수 (admin 전용) */
export async function revokeEntitlement(params: {
  userId: string;
  entitlement: EntitlementKind;
}): Promise<{ error?: string }> {
  const { error } = await supabase
    .from("user_entitlements")
    .delete()
    .eq("user_id", params.userId)
    .eq("entitlement", params.entitlement);
  if (error) {
    console.error("[entitlements] revokeEntitlement error:", error.message);
    return { error: error.message };
  }
  return {};
}

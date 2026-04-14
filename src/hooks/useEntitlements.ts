/**
 * useEntitlements — 현재 로그인 사용자의 혜택 훅.
 *
 * 동작:
 *   1) 로그인 안 된 경우 → 빈 배열
 *   2) 로그인 된 경우 → DB 에서 혜택 로드
 *   3) 이메일이 VITE_ADMIN_EMAILS 에 있으면 자동으로 env 기반 admin + all-pro 가상 부여
 *
 * Phase 1 (tier.ts) + Phase 2A (이 훅) 조합으로 `canAccess*()` 에 전달.
 */

import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { isAdminEmail } from "../lib/adminEmails";
import { loadMyEntitlements } from "../storage/supabaseEntitlementsRepo";
import type { Entitlement } from "../types/entitlement";

interface EntitlementsState {
  entitlements: Entitlement[];
  loading: boolean;
  /** 환경변수 기반 슈퍼 관리자 여부 (UI 강조 표시용) */
  isSuperAdmin: boolean;
}

/** 현재 시각 기준의 가상 env entitlement 생성 */
function makeEnvEntitlement(
  userId: string,
  kind: "admin" | "all-pro"
): Entitlement {
  return {
    id: `env:${kind}:${userId}`,
    user_id: userId,
    entitlement: kind,
    granted_at: new Date().toISOString(),
    expires_at: null,
    granted_by: null,
    source: "env",
    note: "환경변수 슈퍼 관리자",
    created_at: new Date().toISOString(),
  };
}

export function useEntitlements(): EntitlementsState {
  const user = useAuthStore((s) => s.user);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = isAdminEmail(user?.email ?? null);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setEntitlements([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadMyEntitlements(user.id).then((dbEnts) => {
      if (cancelled) return;

      let merged = [...dbEnts];

      // 환경변수 기반 슈퍼 관리자면 admin + all-pro 가상 부여
      if (isSuperAdmin) {
        if (!merged.some((e) => e.entitlement === "admin")) {
          merged.push(makeEnvEntitlement(user.id, "admin"));
        }
        if (!merged.some((e) => e.entitlement === "all-pro")) {
          merged.push(makeEnvEntitlement(user.id, "all-pro"));
        }
      }

      setEntitlements(merged);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user, isSuperAdmin]);

  return { entitlements, loading, isSuperAdmin };
}

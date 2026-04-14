/**
 * 관리자 대시보드 (/admin).
 *
 * 접근 조건: `useEntitlements().isAdmin === true`
 *   - 환경변수 슈퍼 관리자 (VITE_ADMIN_EMAILS) 는 자동 admin
 *   - DB 기반 admin (user_entitlements.entitlement = 'admin') 도 포함
 *
 * 기능:
 *   - 전체 사용자 리스트 + 이메일 검색
 *   - 사용자 클릭 → 혜택 편집 패널 (체크박스)
 *   - 혜택 부여/회수 → Supabase 즉시 반영
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEntitlements } from "../hooks/useEntitlements";
import { isAdmin } from "../content/access";
import {
  listAllProfiles,
  listEntitlementsForUsers,
  grantEntitlement,
  revokeEntitlement,
  type AdminUserRow,
} from "../storage/supabaseEntitlementsRepo";
import type { Entitlement, EntitlementKind } from "../types/entitlement";
import {
  ENTITLEMENT_KINDS,
  ENTITLEMENT_LABELS,
  ENTITLEMENT_DESCRIPTIONS,
} from "../types/entitlement";

export function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const { entitlements, loading: entsLoading, isSuperAdmin } = useEntitlements();
  const amAdmin = isAdmin(entitlements);

  const [profiles, setProfiles] = useState<AdminUserRow[]>([]);
  const [userEnts, setUserEnts] = useState<Record<string, Entitlement[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // 데이터 로드
  const reload = useCallback(async () => {
    setLoading(true);
    const profs = await listAllProfiles();
    setProfiles(profs);
    const ents = await listEntitlementsForUsers(profs.map((p) => p.user_id));
    const byUser: Record<string, Entitlement[]> = {};
    for (const e of ents) {
      (byUser[e.user_id] ||= []).push(e);
    }
    setUserEnts(byUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (amAdmin) void reload();
  }, [amAdmin, reload]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter(
      (p) =>
        p.email?.toLowerCase().includes(q) ||
        p.nickname?.toLowerCase().includes(q)
    );
  }, [profiles, search]);

  const handleToggle = async (
    userId: string,
    kind: EntitlementKind,
    currentlyHas: boolean
  ) => {
    const key = `${userId}:${kind}`;
    setSavingKey(key);
    if (currentlyHas) {
      const { error } = await revokeEntitlement({ userId, entitlement: kind });
      if (error) {
        setToast(`❌ 회수 실패: ${error}`);
      } else {
        setToast(`✓ ${ENTITLEMENT_LABELS[kind]} 회수됨`);
        setUserEnts((prev) => ({
          ...prev,
          [userId]: (prev[userId] ?? []).filter(
            (e) => e.entitlement !== kind
          ),
        }));
      }
    } else {
      const { error } = await grantEntitlement({
        userId,
        entitlement: kind,
        grantedBy: user?.id ?? null,
        source: "admin",
      });
      if (error) {
        setToast(`❌ 부여 실패: ${error}`);
      } else {
        setToast(`✓ ${ENTITLEMENT_LABELS[kind]} 부여됨`);
        await reload();
      }
    }
    setSavingKey(null);
    setTimeout(() => setToast(null), 2500);
  };

  // ── 권한 체크 ──
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (entsLoading) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center">
        <div className="text-brand-textDim text-sm">권한 확인 중...</div>
      </div>
    );
  }
  if (!amAdmin) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl">🛡️</div>
          <h1 className="text-xl font-bold">관리자 전용</h1>
          <p className="text-sm text-brand-textDim">
            이 페이지는 관리자 권한이 필요합니다.
          </p>
          <Link
            to="/"
            className="inline-block px-4 py-2 rounded-lg bg-brand-primary text-white text-sm"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        {/* 헤더 */}
        <header className="mb-6 sm:mb-8 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold">🛡️ 관리자 대시보드</h1>
              {isSuperAdmin && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/40 font-semibold uppercase tracking-wider">
                  Super (env)
                </span>
              )}
            </div>
            <p className="text-sm text-brand-textDim">
              사용자 혜택(entitlement) 관리
            </p>
          </div>
          <button
            onClick={reload}
            disabled={loading}
            className="px-3 py-1.5 text-xs rounded-lg border border-brand-subtle text-brand-textDim hover:text-brand-text hover:border-brand-primary disabled:opacity-50"
          >
            {loading ? "로딩..." : "↻ 새로고침"}
          </button>
        </header>

        {/* 요약 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="전체 사용자"
            value={profiles.length}
            icon="👥"
          />
          <StatCard
            label="All PRO"
            value={countWith(userEnts, "all-pro")}
            icon="🌟"
          />
          <StatCard
            label="부분 PRO"
            value={
              countWith(userEnts, "ai-courses-pro") +
              countWith(userEnts, "python-advanced") +
              countWith(userEnts, "projects-pro")
            }
            icon="🎯"
          />
          <StatCard
            label="관리자"
            value={countWith(userEnts, "admin")}
            icon="🛡️"
          />
        </div>

        {/* 검색 */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이메일 / 닉네임 검색..."
            className="w-full px-4 py-2.5 rounded-lg border border-brand-subtle bg-brand-panel text-sm text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary"
          />
        </div>

        {/* 사용자 목록 */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-brand-textDim text-sm border border-dashed border-brand-subtle rounded-xl">
              {loading ? "로딩 중..." : "검색 결과가 없어요."}
            </div>
          ) : (
            filtered.map((p) => {
              const ents = userEnts[p.user_id] ?? [];
              const isOpen = selectedUserId === p.user_id;
              return (
                <div
                  key={p.user_id}
                  className={`rounded-xl border overflow-hidden transition-colors ${
                    isOpen
                      ? "border-brand-primary/60 bg-brand-panel"
                      : "border-brand-subtle bg-brand-panel hover:border-brand-primary/30"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedUserId(isOpen ? null : p.user_id)
                    }
                    className="w-full p-3 sm:p-4 flex items-center gap-3 text-left"
                  >
                    <div className="text-2xl shrink-0">
                      {p.avatar_emoji ?? "🙂"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-brand-text truncate">
                        {p.email ?? "(이메일 없음)"}
                      </div>
                      <div className="text-xs text-brand-textDim truncate">
                        {p.nickname ?? "-"}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 flex-wrap justify-end max-w-[45%]">
                      {ents.length === 0 ? (
                        <span className="text-[10px] text-brand-textDim">
                          혜택 없음
                        </span>
                      ) : (
                        ents.map((e) => (
                          <span
                            key={e.entitlement}
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary whitespace-nowrap"
                            title={
                              e.expires_at
                                ? `만료: ${e.expires_at.slice(0, 10)}`
                                : `출처: ${e.source}`
                            }
                          >
                            {ENTITLEMENT_LABELS[e.entitlement]}
                          </span>
                        ))
                      )}
                    </div>
                    <div className="shrink-0 text-brand-textDim text-lg">
                      {isOpen ? "▲" : "▼"}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-brand-subtle px-3 sm:px-4 py-4 bg-brand-bg/40">
                      <div className="text-[11px] uppercase tracking-wider text-brand-textDim mb-3">
                        혜택 체크박스
                      </div>
                      <div className="space-y-2">
                        {ENTITLEMENT_KINDS.map((kind) => {
                          const has = ents.some(
                            (e) => e.entitlement === kind
                          );
                          const envBased = ents.some(
                            (e) =>
                              e.entitlement === kind && e.source === "env"
                          );
                          const saving =
                            savingKey === `${p.user_id}:${kind}`;
                          return (
                            <label
                              key={kind}
                              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                                has
                                  ? "border-brand-primary/50 bg-brand-primary/5"
                                  : "border-brand-subtle bg-brand-bg/50 hover:border-brand-primary/30"
                              } ${saving ? "opacity-60" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={has}
                                disabled={saving || envBased}
                                onChange={() =>
                                  handleToggle(p.user_id, kind, has)
                                }
                                className="mt-0.5 accent-brand-primary disabled:opacity-50"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-brand-text flex items-center gap-2 flex-wrap">
                                  {ENTITLEMENT_LABELS[kind]}
                                  {envBased && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-400 border border-amber-400/40">
                                      ENV (고정)
                                    </span>
                                  )}
                                  {saving && (
                                    <span className="text-[10px] text-brand-textDim">
                                      저장 중...
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-brand-textDim mt-0.5">
                                  {ENTITLEMENT_DESCRIPTIONS[kind]}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      <div className="mt-4 text-[11px] text-brand-textDim">
                        💡 ENV 표시 혜택은 환경변수 기반이라 DB 에서 변경
                        불가합니다. 실제 DB 혜택은 체크박스로 즉시 저장돼요.
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-lg bg-brand-panel border border-brand-subtle shadow-lg text-sm text-brand-text z-50">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 서브 컴포넌트
// ─────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="p-3 sm:p-4 rounded-xl border border-brand-subtle bg-brand-panel">
      <div className="text-xs text-brand-textDim mb-1">{icon} {label}</div>
      <div className="text-2xl font-bold text-brand-text">{value}</div>
    </div>
  );
}

function countWith(
  ents: Record<string, Entitlement[]>,
  kind: EntitlementKind
): number {
  let n = 0;
  for (const arr of Object.values(ents)) {
    if (arr.some((e) => e.entitlement === kind)) n += 1;
  }
  return n;
}

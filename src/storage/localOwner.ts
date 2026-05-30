/**
 * 디바이스 로컬(IndexedDB) 데이터의 "소유자" 네임스페이스 헬퍼.
 *
 * 공용 기기에서 사용자 A → B 로 전환될 때, A 의 로컬 데이터(IDE 프로젝트·
 * 레슨 노트북·플레이그라운드·마크다운)가 B 에게 노출되던 문제(C1)를 막기 위해
 * 모든 로컬 키를 로그인 사용자 id 로 네임스페이스화한다.
 *
 * - notebooks 스토어: 키 자체를 `usr:<uid>:<원래키>` 로 프리픽스.
 * - 마크다운 DB: 레코드에 `ownerId` 필드를 부여해 로드 시 필터.
 *
 * 비로그인 상태에서 이 데이터에 접근하는 경로는 없으나(모두 ProtectedRoute
 * 하위), 방어적으로 "anon" 을 폴백 소유자로 사용한다.
 */

import { useAuthStore } from "../store/authStore";

/** 네임스페이스 프리픽스. 기존 키(`playground:python` 등)와 충돌하지 않도록 `usr:` 사용. */
export const OWNER_PREFIX = "usr:";

/** 현재 로그인 사용자 id. 비로그인 시 "anon". */
export function ownerId(): string {
  return useAuthStore.getState().user?.id ?? "anon";
}

/** 원래 키를 현재 소유자 네임스페이스 키로 변환. */
export function ownedKey(key: string): string {
  return `${OWNER_PREFIX}${ownerId()}:${key}`;
}

/** 이미 소유자 네임스페이스가 적용된 키인지 여부 (마이그레이션 판별용). */
export function isOwnedKey(key: string): boolean {
  return key.startsWith(OWNER_PREFIX);
}

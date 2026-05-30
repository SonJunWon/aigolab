/**
 * C2 — 진도 마이그레이션 재실행으로 인한 "삭제한 진도 부활" 방지.
 *
 * 기존 버그: migrated 플래그가 인메모리뿐 + 마이그레이션 후 IDB 미삭제 →
 *   매 세션 IDB 진도를 서버에 재병합 → 서버에서 지운 진도가 부활.
 * 수정: 사용자별 영구 플래그(localStorage) + 마이그레이션 성공 후 IDB 진도 삭제.
 *
 * progressStore.migrateToServer 가 Supabase/IDB 에 의존해 헤드리스 import 불가하므로,
 * 동일 알고리즘을 모사해 기존 vs 수정 동작을 대조한다.
 */
import { check, done } from "./_assert";

function makeWorld() {
  return {
    idbProgress: ["L1"] as string[], // 과거에 완료해 IDB 에 남은 진도
    server: ["L1"] as string[], // 서버에도 동기화돼 있었음
    localStorageFlags: {} as Record<string, string>,
  };
}
const union = (a: string[], b: string[]) => [...new Set([...a, ...b])];

// ── 기존(버그) 버전: 인메모리 플래그만, IDB 미삭제 ──
function migrateOld(world: ReturnType<typeof makeWorld>, session: { migrated: boolean }) {
  if (session.migrated) return;
  world.server = union(world.server, world.idbProgress); // 재병합
  // IDB 미삭제, 영구 플래그 없음
  session.migrated = true;
}

// ── 수정 버전: 영구 플래그 + 성공 후 IDB 삭제 ──
function migrateNew(world: ReturnType<typeof makeWorld>, userId: string, session: { migrated: boolean }) {
  if (session.migrated) return;
  if (world.localStorageFlags[`migrated.${userId}`] === "done") { session.migrated = true; return; }
  world.server = union(world.server, world.idbProgress);
  world.idbProgress = []; // 성공 후 IDB 진도 삭제(부활 차단)
  world.localStorageFlags[`migrated.${userId}`] = "done";
  session.migrated = true;
}

// ===== 기존 버전: 부활 발생을 확인 =====
{
  const w = makeWorld();
  migrateOld(w, { migrated: false }); // 세션1 로그인
  // 사용자가 서버에서 L1 완료를 취소(reset)
  w.server = w.server.filter((x) => x !== "L1");
  check("기존: reset 직후 서버에서 L1 사라짐", !w.server.includes("L1"));
  // 세션2(새 로그인): 인메모리 플래그 초기화 → 재병합
  migrateOld(w, { migrated: false });
  check("기존: 새 세션 재병합으로 삭제한 L1 이 부활(=버그)", w.server.includes("L1"));
}

// ===== 수정 버전: 부활 없음 =====
{
  const w = makeWorld();
  migrateNew(w, "userA", { migrated: false }); // 세션1
  check("수정: 1차 마이그레이션 후 IDB 진도 비워짐", w.idbProgress.length === 0);
  check("수정: 영구 플래그 설정됨", w.localStorageFlags["migrated.userA"] === "done");
  // 서버에서 L1 reset
  w.server = w.server.filter((x) => x !== "L1");
  // 세션2(새 로그인): 영구 플래그로 스킵 + IDB 비어있어 재병합 없음
  migrateNew(w, "userA", { migrated: false });
  check("수정: 새 세션에서 L1 이 부활하지 않음", !w.server.includes("L1"));
}

// ===== 수정 버전: 정상 첫 병합은 동작 =====
{
  const w = makeWorld();
  w.server = []; // 서버 비어있고 IDB 에만 L1
  migrateNew(w, "userB", { migrated: false });
  check("수정: 첫 로그인 시 IDB 진도가 서버로 정상 병합됨", w.server.includes("L1"));
}

done("C2 progress revival prevention");

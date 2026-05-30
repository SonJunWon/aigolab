/**
 * H3 — progressStore.ensureLoaded 가 로드 실패를 캐싱해 세션 내내 진도가
 *   빈 채로 고착되는 문제 방지.
 *
 * 기존: race 방지로 로드 전에 loadedKeys 에 key 추가 → 로드 throw 시 catch 없어
 *   key 가 남음 → 이후 early-return 으로 영구 미로드.
 * 수정: 실패 시 loadedKeys 에서 key 롤백 → 다음 호출이 재시도.
 *
 * 동일 알고리즘을 모사해 기존 vs 수정의 "일시적 네트워크 실패 후 복구" 차이를 본다.
 */
import { check, done } from "./_assert";

// 첫 호출은 throw(네트워크 순단), 이후는 성공하는 로더
function makeLoader() {
  let calls = 0;
  return async () => {
    calls++;
    if (calls === 1) throw new Error("network blip");
    return ["L1", "L2"]; // 서버 진도
  };
}

// ── 기존(버그): 실패 시 롤백 없음 ──
async function ensureLoadedOld(state: { loaded: Set<string>; data: string[] }, key: string, load: () => Promise<string[]>) {
  if (state.loaded.has(key)) return;
  state.loaded.add(key); // 로드 전에 추가
  const r = await load(); // throw 시 아래 미실행, key 는 남음
  state.data = r;
}

// ── 수정: 실패 시 롤백 ──
async function ensureLoadedNew(state: { loaded: Set<string>; data: string[] }, key: string, load: () => Promise<string[]>) {
  if (state.loaded.has(key)) return;
  state.loaded.add(key);
  try {
    state.data = await load();
  } catch {
    state.loaded.delete(key); // 롤백 → 재시도 가능
  }
}

// ===== 기존: 일시 실패 후 영구 미로드 =====
{
  const load = makeLoader();
  const state = { loaded: new Set<string>(), data: [] as string[] };
  try { await ensureLoadedOld(state, "python:beginner", load); } catch { /* effect 죽음 */ }
  check("기존: 1차 실패 후 데이터 비어있음", state.data.length === 0);
  // 2차 호출(재방문/재렌더)
  await ensureLoadedOld(state, "python:beginner", load).catch(() => {});
  check("기존: key 가 남아 early-return → 영구 미로드(=버그)", state.data.length === 0);
}

// ===== 수정: 일시 실패 후 재시도로 복구 =====
{
  const load = makeLoader();
  const state = { loaded: new Set<string>(), data: [] as string[] };
  await ensureLoadedNew(state, "python:beginner", load);
  check("수정: 1차 실패 후에도 key 롤백됨(재시도 가능)", !state.loaded.has("python:beginner"));
  // 2차 호출 → 성공
  await ensureLoadedNew(state, "python:beginner", load);
  check("수정: 2차 호출에서 진도 정상 로드됨(복구)", state.data.length === 2);
}

done("H3 ensureLoaded recovery");

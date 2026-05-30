/**
 * H2 — 진도/활동 동기화 lost update 방지 (실제 lib/serialQueue 모듈 사용).
 *
 * 시나리오: 같은 행에 대한 read-modify-write 두 개를 동시에 실행.
 *  - 직렬화 없음 → 둘 다 같은 시점 값을 읽어 한쪽 쓰기가 유실(lost update).
 *  - runSerial(같은 key) → 순차 실행되어 둘 다 반영.
 */
import { runSerial } from "../../src/lib/serialQueue";
import { check, done } from "./_assert";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── 직렬화 없는 read-modify-write (기존 버그 재현) ──
let store: string[] = [];
async function rmwUnguarded(id: string) {
  const cur = store; // read
  await delay(15); // 네트워크 왕복 모사
  store = [...cur, id]; // write
}

// ── runSerial 적용 (수정본) ──
async function rmwGuarded(id: string) {
  return runSerial("row:user:python:beginner", async () => {
    const cur = store;
    await delay(15);
    store = [...cur, id];
  });
}

// 1) 직렬화 없음 → 유실 발생을 확인(이 동작이 버그였음)
store = [];
await Promise.all([rmwUnguarded("L1"), rmwUnguarded("L2"), rmwUnguarded("L3")]);
console.log("[H2] 직렬화 없음 결과:", JSON.stringify(store));
check("직렬화 없으면 동시 쓰기 유실 발생(=고쳐야 할 버그)", store.length < 3);

// 2) runSerial 적용 → 전부 보존
store = [];
await Promise.all([rmwGuarded("L1"), rmwGuarded("L2"), rmwGuarded("L3")]);
console.log("[H2] runSerial 결과:", JSON.stringify(store));
check("runSerial 적용 시 3건 모두 보존(유실 없음)", store.length === 3);
check("runSerial 적용 시 순서 보존", JSON.stringify(store) === JSON.stringify(["L1", "L2", "L3"]));

// 3) 서로 다른 key 는 병렬 허용(불필요한 직렬화 아님)
const order: string[] = [];
await Promise.all([
  runSerial("kA", async () => { await delay(20); order.push("A"); }),
  runSerial("kB", async () => { await delay(5); order.push("B"); }),
]);
check("다른 key 는 병렬 실행(빠른 B 가 먼저 끝남)", order[0] === "B");

done("H2 serialQueue");

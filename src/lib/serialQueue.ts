/**
 * 키 단위 직렬 실행 큐.
 *
 * 같은 key 로 들어온 작업들을 등록 순서대로 1개씩 순차 실행한다. Supabase
 * 진도/활동 갱신처럼 "읽기 → 수정 → 쓰기"가 비원자적인 경로에서, 같은 행에
 * 대한 동시 호출이 서로의 결과를 덮어쓰는 lost update(H2)를 방지한다.
 *
 * 범위: 단일 탭(모듈 인스턴스) 내 동시성만 직렬화한다. 여러 탭/기기에서
 * 동시에 같은 행을 갱신하는 경우의 원자성은 DB 측(예: 원자적 RPC/SQL)에서
 * 보장해야 한다.
 */

const chains = new Map<string, Promise<unknown>>();

export function runSerial<T>(key: string, task: () => Promise<T>): Promise<T> {
  const prev = chains.get(key) ?? Promise.resolve();
  // 이전 작업의 성공/실패와 무관하게 다음 작업을 이어서 실행한다.
  const run = prev.then(task, task);
  // 체인 추적용으로는 거부를 삼킨 버전을 저장(unhandled rejection 방지).
  // 호출자에게는 실제 결과(run)를 그대로 반환한다.
  chains.set(
    key,
    run.then(
      () => undefined,
      () => undefined,
    ),
  );
  return run;
}

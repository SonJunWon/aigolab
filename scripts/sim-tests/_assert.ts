/** 시뮬레이션 테스트용 미니 assert. */
let pass = 0;
let fail = 0;
const fails: string[] = [];

export function check(name: string, cond: boolean): void {
  if (cond) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    fails.push(name);
    console.log(`  ❌ ${name}`);
  }
}

export function done(suite: string): void {
  console.log(`\n[${suite}] ${pass} pass / ${fail} fail`);
  if (fail > 0) {
    console.log(`  실패: ${fails.join(", ")}`);
    process.exit(1);
  }
}

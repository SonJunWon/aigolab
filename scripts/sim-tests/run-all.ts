/**
 * 시뮬레이션 테스트 일괄 실행기. `npm test` 로 호출.
 * 각 테스트는 별도 프로세스로 실행(_assert 모듈 상태 격리 + process.exit 독립).
 */
import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".test.ts"))
  .sort();

let failed = 0;
for (const f of files) {
  console.log(`\n════════ ▶ ${f} ════════`);
  try {
    execSync(`npx tsx ${JSON.stringify(join(dir, f))}`, { stdio: "inherit" });
  } catch {
    failed++;
  }
}

console.log("\n────────────────────────");
if (failed > 0) {
  console.error(`❌ ${failed}/${files.length} 스위트 실패`);
  process.exit(1);
}
console.log(`✅ 전체 ${files.length} 스위트 통과`);

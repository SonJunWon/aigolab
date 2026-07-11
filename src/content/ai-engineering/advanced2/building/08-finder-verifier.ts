import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급2 시리즈C(팀 만들기) 08강 — 실전 ② 구현.
 * 결함 심은 샘플 PR → 파인더 3렌즈 팬아웃 → dedup → 적대적 검증단 2/3 → 리포터.
 */
export const lessonC08: Lesson = {
  id: "ai-eng-a2-c08-finder-verifier",
  language: "ai-engineering",
  track: "advanced2",
  order: 28,
  title: "C8. 🏗 실전 ② 구현 — 파인더 팬아웃과 검증단",
  subtitle: "가짜 발견이 검증단에 걸려 죽는 순간을 목격하라",
  estimatedMinutes: 55,
  cells: [
    {
      type: "markdown",
      source: `# 🏗 고급2·C8강. 실전 ② 구현
### — 파인더 팬아웃과 검증단

⏱️ 55분 · 🧰 API 키 · 🗺️ C7 설계의 구현 · 선수: C7

> 💡 C7의 declare 4개를 오늘 전부 채웁니다. 시험대는 **결함을 일부러 심은 샘플 PR** —
> 진짜 결함 2개(0으로 나누기, 인젝션)와 함께, 파인더가 **가짜 발견(오탐)**도 만들어내도록
> 애매한 코드를 섞어뒀어요.
> 오늘의 하이라이트는 마지막 로그에 있습니다: **오탐이 검증단의 반박에 걸려 죽는 순간.**
> 그 로그 한 줄이 이 조직 전체의 존재 이유예요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ══ 자동 코드리뷰 회사 v1 — C7 설계의 전체 구현 ══

// ── 시험대: 결함을 심은 샘플 PR ──
const SAMPLE_PR = \`
// 파일: stats.ts — 사용자 통계 유틸
export function average(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;   // L3: nums가 빈 배열이면? (진짜 결함 1)
}
export function runQuery(userInput: string) {
  return db.exec("SELECT * FROM logs WHERE tag = '" + userInput + "'");  // L6: 문자열 연결 (진짜 결함 2)
}
export function cache(key: string, val: object) {
  globalCache[key] = val;   // L9: 전역 캐시 — 상황에 따라 문제일 수도, 아닐 수도 (오탐 유도용)
  return true;
}
\`;

// ── 계약 (C7 확정안) ──
type Finding = { file: string; line: number; lens: string; claim: string; scenario: string; severity: "high" | "mid" | "low" };
type Verdict = { verdict: "confirmed" | "refuted"; reason: string };

// 구조화 산출 유틸 (C5 축약 — 파싱 실패 시 1회 반려)
async function askJSON(system: string, user: string): Promise<any> {
  const messages: any[] = [{ role: "system", content: system }, { role: "user", content: user }];
  for (let i = 0; i < 2; i++) {
    const res = await chat({ provider: "gemini", messages });
    try { return JSON.parse((res.text ?? "").replace(/\`\`\`json|\`\`\`/g, "").trim()); }
    catch {
      messages.push({ role: "assistant", content: res.text ?? "" });
      messages.push({ role: "user", content: "순수 JSON만 다시 출력하라." });
    }
  }
  return null; // 부분 실패 격리 (C3)
}

// ── 1) 파인더: 과감하게 찾는다 ──
async function runFinder(lens: string, pr: string): Promise<Finding[]> {
  const out = await askJSON(
    \`너는 \${lens} 전문 코드 리뷰어다. 과감하게 의심하라 — 놓치는 것보다 과잉 보고가 낫다(검증은 다음 관문이 한다).
JSON 배열 출력. 항목: {"file","line"(number),"lens":"\${lens}","claim","scenario"(어떤 입력에서 어떻게 잘못되나 — 필수!),"severity":"high|mid|low"}\`,
    \`PR:\\n\${pr}\`,
  );
  return Array.isArray(out) ? out : [];
}

// ── 2) dedup: 판단 아닌 계산 — LLM 없이 (C7 결정) ──
const dedup = (all: Finding[]) => [...new Map(all.map((f) => [\`\${f.file}:\${f.line}\`, f])).values()];

// ── 3) 검증관: 무자비하게 반박한다 ──
async function runVerifier(f: Finding, pr: string, viewpoint: string): Promise<Verdict> {
  const out = await askJSON(
    \`너는 적대적 검증관이다 (\${viewpoint}). 아래 발견을 반박하는 것이 임무다. 칭찬 금지.
scenario를 코드 위에서 재현 시도하라. 반박에 실패했을 때만 confirmed.
JSON 출력: {"verdict":"confirmed|refuted","reason"}\`,
    \`발견: \${JSON.stringify(f)}\\n\\n원본 PR (file:line으로 직접 확인하라):\\n\${pr}\`,
  );
  return out?.verdict ? out : { verdict: "refuted", reason: "검증 실패(형식) — 안전측 기각" };
}

// ── 4) 실행: 팬아웃 → dedup → 발견별 검증단 → 다수결 → 리포트 ──
const lenses = ["버그(크래시·경계값)", "보안(인젝션·권한)", "성능(불필요 연산·메모리)"];
const found = (await Promise.all(lenses.map((l) => runFinder(l, SAMPLE_PR)))).flat();
console.log(\`🔍 파인더 발견: \${found.length}건 (렌즈 3종 팬아웃)\`);

const unique = dedup(found);
console.log(\`🧹 dedup 후: \${unique.length}건\\n\`);

const survived: Finding[] = [];
for (const f of unique) {
  const views = ["재현 가능성", "코드 맥락(정말 문제인가)", "심각도 타당성"];
  const verdicts = await Promise.all(views.map((v) => runVerifier(f, SAMPLE_PR, v)));
  const yes = verdicts.filter((v) => v.verdict === "confirmed").length;
  const alive = yes >= 2;
  console.log(\`\${alive ? "✅ 생존" : "💀 기각"} [\${f.file}:\${f.line}] \${f.claim} — 판정 \${yes}/3\`);
  if (!alive) console.log(\`   └ 기각 사유: \${verdicts.find((v) => v.verdict === "refuted")?.reason}\`);
  if (alive) survived.push(f);
}

// 리포터: 조립만 (창작 금지)
const order = { high: 0, mid: 1, low: 2 } as const;
const sorted = survived.sort((a, b) => order[a.severity] - order[b.severity]);
console.log(\`\\n📋 최종 리뷰 보고서 (\${sorted.length}건, 검증단 통과분만):\`);
sorted.forEach((f, i) => console.log(\`\${i + 1}. [\${f.severity.toUpperCase()}] \${f.file}:\${f.line} — \${f.claim}\\n   시나리오: \${f.scenario}\`));
console.log("\\n👉 '💀 기각' 로그를 보라 — 그럴듯했던 발견이 반박에 걸려 죽은 흔적. 저 줄이 이 조직의 존재 이유다.");`,
      hints: [
        "파인더 지침의 '놓치는 것보다 과잉 보고가 낫다'와 검증관의 '반박이 임무' — C7의 역할 분리가 지침 두 줄로 구현됐어요. 이 비대칭이 시스템의 심장입니다.",
        "runVerifier의 형식 실패 기본값이 refuted(기각)인 것에 주목 — 검증이 불확실하면 '안전측'으로. 오탐 억제 1순위라는 C7 요구가 기본값 하나에도 반영됩니다.",
        "발견별 검증이 for 루프인 이유: 발견 수가 적고 로그 가독성을 위해서예요. 발견이 많다면 C3의 withConcurrency로 발견-검증을 스트리밍 파이프라인화하세요 (배리어 불필요 — 발견별 독립).",
      ],
    },
    {
      type: "markdown",
      source: `## 🔍 실행 결과 읽는 법 — 세 가지 관전 포인트

> **① 진짜 결함(L3, L6)은 생존했는가**
> average의 빈 배열, runQuery의 인젝션 — scenario가 구체적이라 검증관의 재현 시도를
> **버텨냅니다.** 2/3 이상 confirmed로 생존해야 정상.
>
> **② 애매한 코드(L9)의 운명**
> 전역 캐시는 '상황에 따라' 문제 — 파인더는 과감하게 보고하지만, 검증관(코드 맥락 관점)이
> '이 맥락에서 실제 피해 경로가 없다'고 반박하면 기각됩니다. **이 기각이 오탐 억제의 실체.**
> (실행마다 결과가 다를 수 있어요 — 그 비결정성 자체가 C9에서 평가가 필요한 이유입니다.)
>
> **③ 판정이 1/3, 2/3으로 갈린 발견**
> 만장일치가 아닌 발견이 흥미로운 지점 — 렌즈 분산(A5)이 작동한다는 증거예요.
> 셋이 항상 만장일치라면 관점이 분산되지 않은 것이니 검증관 지침을 점검하세요.

## 🧩 부품 출처 총정리 — 이 시스템에 새 개념은 없다

| 코드 조각 | 출처 |
|-----------|------|
| Promise.all 렌즈 팬아웃 | C3 |
| askJSON 반려 루프 + null 격리 | C5 + C3 |
| file:line dedup (계산) | C7 결정 |
| 적대적 검증관 + 안전측 기본값 | A5·B5 + C7 요구 |
| 2/3 다수결 + 렌즈 분산 | A5 |
| 리포터는 조립만 | A3 (지휘자는 연주하지 않는다) |

**전부 배운 부품의 배치**입니다. 멀티에이전트 시스템 구축의 진실이 이거예요 —
마법 같은 신기술이 아니라, 원칙들의 정확한 조립.`,
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C8

1. **비대칭 붕괴 실험**: 파인더 지침에서 '과잉 보고가 낫다'를 지우고, 검증관에서 '반박이 임무'를 지워라. 발견 수와 오탐 통과율이 어떻게 변하는가 — 역할 비대칭이 왜 심장인지 숫자로 확인하라.
2. **문턱 튜닝**: 다수결을 2/3에서 3/3(만장일치)으로 올려보라. 오탐은 더 죽지만 진짜 결함도 죽는가? 1/3로 내리면? — 문턱이 곧 '오탐 vs 놓침' 다이얼이다.
3. **트레이서 접합**: C6의 트레이서를 이 시스템에 붙여 파인더·검증관별 비용을 회계하라. 검증 비용이 파인더 비용의 몇 배인가? 그 비율이 정당한가? (C9 예산 설계의 사전 조사.)

> 🎯 **(전부 잊어도 이것만)**
> ## 시스템의 심장은 **역할 비대칭** — 파인더는 '과잉 보고가 낫다', 검증관은 '반박이 임무', 형식 실패는 '안전측 기각'. 다수결 문턱이 오탐 vs 놓침의 다이얼이다.
> 그리고 새 개념은 없었다 — **전부 배운 부품의 정확한 배치.**

📎 **다음 강 — C9. 실전 ③ 강화**: v1이 돌아가지만 아직 못 믿습니다 — 실행마다 결과가 다르니까요. 골든 PR 5건으로 재현율·오탐율을 재고, 예산 제한기와 읽기 전용 안전벨트를 달아 **출고 가능한 v2**로 만듭니다.`,
    },
  ],

  quiz: {
    title: "고급2·C8강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "검증관의 형식 실패 기본값을 confirmed가 아닌 refuted(기각)로 둔 이유는?",
        options: [
          "refuted가 알파벳순으로 먼저라서",
          "오탐 억제가 1순위 요구이므로, 검증이 불확실할 때는 안전측(기각)으로 기울게 설계",
          "confirmed는 유료 기능이라서",
        ],
        correctIndex: 1,
        explanation:
          "C7의 요구 순서(오탐 억제 1순위)가 기본값 하나에까지 반영된 거예요. 요구가 조직을 결정하고, 조직이 코드 디테일을 결정합니다.",
      },
      {
        type: "multiple-choice",
        question: "애매한 코드(전역 캐시)에 대한 파인더의 과감한 보고가 문제가 되지 않는 이유는?",
        options: [
          "애매한 보고는 자동으로 삭제되므로",
          "다음 관문(적대적 검증단)이 맥락 반박으로 걸러내는 구조라, 파인더는 재현율에만 최적화해도 되기 때문",
          "전역 캐시는 항상 안전하므로",
        ],
        correctIndex: 1,
        explanation:
          "찾는 자는 과감하게, 죽이는 자는 무자비하게 — 두 관문의 직렬 배치 덕분에 각 역할이 한 가지 미덕에만 집중할 수 있어요.",
      },
      {
        type: "multiple-choice",
        question: "다수결 문턱(2/3)을 조정하는 것의 의미는?",
        options: [
          "검증관들의 사기 관리",
          "오탐 억제와 놓침 방지 사이의 트레이드오프 다이얼 — 3/3은 오탐과 함께 진짜도 죽이고, 1/3은 오탐이 새기 시작한다",
          "문턱은 항상 2/3이어야 하며 조정 불가",
        ],
        correctIndex: 1,
        explanation:
          "문턱은 시스템의 성격을 정하는 다이얼이에요. 어느 값이 옳은지는 C9의 골든 PR 평가가 숫자로 알려줍니다.",
      },
    ],
  } satisfies Quiz,
};

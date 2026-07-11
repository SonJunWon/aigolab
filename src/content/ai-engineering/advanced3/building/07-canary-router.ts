import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급3 시리즈C(운영 만들기) 07강 — 실전 ① 카나리 라우터.
 * 운영 30일 아크 1주차: 트래픽 분할 → 두 버전 계기판 비교 → 승격/롤백 자동 판단.
 */
export const lessonC07: Lesson = {
  id: "ai-eng-a3-c07-canary-router",
  language: "ai-engineering",
  track: "advanced3",
  order: 27,
  title: "C7. 🏗 실전 ① 카나리 배포 — 몰래 시운전의 코드화",
  subtitle: "운영 30일 아크 1주차: 20%에게만 신버전을",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🏗 고급3·C7강. 실전 ① 카나리 배포
### — 운영 30일 아크 시작

⏱️ 50분 · 🧰 API 키 · 🗺️ ④ 개선의 현장 관문 · 선수: C1~C6

> 💡 **'코드리뷰 회사 운영 30일' 아크가 시작됩니다.** 고급2에서 지은 시스템을
> 4주의 시뮬레이션 시나리오(개선 요구→비용 폭증→사고→총조립)로 운영해요.
> **1주차 시나리오**: 검증관 지침 개선안이 회귀 게이트(C6)를 통과했습니다.
> 전체 반영? A5에서 배웠죠 — 시험이 현실의 전부는 아니라고.
> 오늘 짓는 것: 실행의 20%만 신버전으로 보내는 **카나리 라우터**,
> 두 버전의 계기판을 나란히 비교해 **승격/롤백을 판단하는 비교기.**`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ══ 카나리 라우터 — 트래픽을 결정적으로 분할한다 ══
type Variant = { version: string; systemPrompt: string };
const STABLE: Variant = { version: "v12", systemPrompt: "코드 리뷰어. 발견을 '파일:줄 — 문제 — 심각도' 목록으로. 확실한 것만." };
const CANARY: Variant = { version: "v13", systemPrompt: "코드 리뷰어. 발견을 '파일:줄 — 문제 — 심각도 — 재현 시나리오' 목록으로. 확실한 것만, 시나리오 없으면 쓰지 마라." };

// 라우팅: 입력의 해시로 결정 — 같은 입력은 항상 같은 버전으로 (비교의 공정성 + 재현성)
function routeOf(inputDigest: string, canaryPct: number): "stable" | "canary" {
  let h = 0;
  for (const ch of inputDigest) h = (h * 31 + ch.charCodeAt(0)) % 100;
  return h < canaryPct ? "canary" : "stable";
}

// run 레코드에 route가 찍힌다 (C1 계면의 확장)
type RunRecord = { id: string; version: string; route: string; ok: boolean; cost: number; quality: number };
const LOG: RunRecord[] = [];
let seq = 0;

async function operatedReview(pr: string, canaryPct: number): Promise<RunRecord> {
  const digest = pr.slice(0, 30);
  const route = routeOf(digest, canaryPct);
  const v = route === "canary" ? CANARY : STABLE;
  const res = await chat({ provider: "gemini", messages: [{ role: "system", content: v.systemPrompt }, { role: "user", content: pr }] });
  const out = res.text ?? "";
  // 간이 품질: 시나리오 포함 발견 비율 (아크의 개선 목표 지표)
  const findings = out.split("\\n").filter((l) => l.includes(":"));
  const withScenario = findings.filter((l) => /시나리오|입력|경우/.test(l));
  const rec: RunRecord = {
    id: \`run-\${++seq}\`, version: v.version, route,
    ok: out.length > 0, cost: Math.round(out.length / 4),
    quality: findings.length ? +(withScenario.length / findings.length * 10).toFixed(1) : 5,
  };
  LOG.push(rec);
  return rec;
}

// ── 1주차 시뮬레이션: PR 10건이 흘러 들어온다 (20% 카나리) ──
const PRS = [
  "function avg(ns){return ns.reduce((a,b)=>a+b,0)/ns.length}",
  "const q='SELECT * WHERE t='+input",
  "for(let i=0;i<=arr.length;i++){sum+=arr[i]}",
  "cache[key]=JSON.parse(JSON.stringify(bigObj))",
  "if(user.admin==true) grantAll()",
  "setInterval(fetchAll, 100)",
  "delete require.cache; reload()",
  "const pw = req.query.password",
  "arr.sort(); return arr[0]",
  "await Promise.all(items.map(save))",
];
for (const pr of PRS) await operatedReview(pr, 20);

// ══ 카나리 비교기 — 두 버전의 계기판을 나란히 (C2 배관의 재사용) ══
function sideBySide(log: RunRecord[]) {
  const grp = (route: string) => {
    const rs = log.filter((r) => r.route === route);
    return {
      n: rs.length,
      quality: +(rs.reduce((a, r) => a + r.quality, 0) / Math.max(rs.length, 1)).toFixed(1),
      cost: Math.round(rs.reduce((a, r) => a + r.cost, 0) / Math.max(rs.length, 1)),
      failures: rs.filter((r) => !r.ok).length,
    };
  };
  return { stable: grp("stable"), canary: grp("canary") };
}

const cmp = sideBySide(LOG);
console.log("📊 나란히 비교:"); console.table(cmp);

// 판정 — 기준은 '시작 전에'(B5): 품질 +1 이상 & 비용 +50% 미만 & 실패 0
const promote = cmp.canary.n >= 2                        // 최소 표본 (너무 적으면 판단 보류)
  && cmp.canary.quality >= cmp.stable.quality + 1
  && cmp.canary.cost < cmp.stable.cost * 1.5
  && cmp.canary.failures === 0;
console.log(promote
  ? \`\\n✅ 승격 권고 — v13을 100%로 (대장 기록 + version++)\`
  : \`\\n⏸ 판단 보류/롤백 — 표본 \${cmp.canary.n}건. 기준 미달이면 canaryPct=0으로 즉시 복귀 (라우터가 곧 롤백 스위치)\`);
console.log("\\n👉 롤백에 배포가 필요 없다 — canaryPct 숫자 하나가 되돌리는 길이다. '되돌릴 길을 미리'(A5)의 코드화.");`,
      hints: [
        "routeOf가 무작위가 아니라 입력 해시 기반인 것 — 같은 PR은 항상 같은 버전을 만나야 비교가 공정하고(입력 난이도 편향 제거) 재현이 가능합니다. 카나리 설계의 고전적 디테일.",
        "canaryPct 변수 하나가 배포 스위치이자 롤백 스위치 — 0이면 전원 안정판, 100이면 전원 신판. '되돌릴 수 없는 변경은 준비 안 된 변경'(A5)이 변수 하나로 해결돼요.",
        "최소 표본(n>=2) 체크 — 카나리 10%면 10건 중 1건뿐일 수 있어요. 표본이 모일 때까지 판단을 보류하는 인내도 판정 기준의 일부입니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 🐤 카나리 운영의 3규칙 (B5 손 카나리의 코드 승격)

| 규칙 | 코드에서 |
|------|---------|
| 판정 기준은 시작 전에 | promote 조건이 코드에 박혀 있다 — 결과를 보고 기준을 옮길 수 없다 |
| 지켜볼 수 있을 때만 | 카나리 기간에는 텔레메트리(C2) 알람을 카나리 route에도 걸어라 |
| 되돌릴 길을 미리 | canaryPct=0 — 배포 없는 롤백 |

그리고 하나 더 — **카나리도 기록**: 승격이든 롤백이든 대장(B5)에 route별 성적과 함께.
"v13은 카나리에서 품질 +1.2로 승격" — 이 한 줄이 다음 개선의 참고 자료가 됩니다.

## 🔬 연구 노트 — C7

1. **비율 실험**: canaryPct를 10/20/50으로 바꿔 '판단 가능해지는 데 걸리는 실행 수'를 재라 — 낮으면 안전하지만 느리고, 높으면 빠르지만 위험. 이 다이얼의 트레이드오프를 몸으로.
2. **버전별 현장 신호**: C4의 FeedbackEvent를 route와 조인해 '카나리 산출물의 수정률'을 계산하라 — 시험(quality)과 현장(수정률)의 이중 판정이 카나리에서도.
3. **자동 롤백**: canary route의 failures가 1이라도 나오면 canaryPct를 0으로 내리는 감시 함수를 짜라 — 사람 없이도 밤새 안전한 카나리.

> 🎯 **(전부 잊어도 이것만)**
> ## 카나리 라우터 = **해시 기반 결정적 분할 + 나란히 계기판 + 시작 전에 박은 판정 기준.** canaryPct 하나가 배포이자 롤백 스위치 — 되돌릴 길이 변수 하나로 존재한다.
> 표본이 모일 때까지 판단 보류도 판정의 일부다.

📎 **다음 강 — C8. 실전 ② 비용 거버너**: 2주차 시나리오 — 입력이 폭증합니다. 시스템 전체의 일일 예산, 역할별 배분, 초과 시 '성능 저하 모드'로 우아하게 버티는 거버너를 답니다.`,
    },
  ],

  quiz: {
    title: "고급3·C7강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "라우팅을 무작위가 아닌 입력 해시 기반으로 하는 이유는?",
        options: [
          "해시가 무작위보다 멋있어서",
          "같은 입력은 항상 같은 버전을 만나야 비교가 공정하고(난이도 편향 제거) 재현 가능하기 때문",
          "무작위 함수는 유료라서",
        ],
        correctIndex: 1,
        explanation:
          "어려운 PR이 우연히 카나리에 몰리면 신버전이 억울하게 나빠 보여요. 결정적 분할이 공정한 비교와 재현성을 동시에 줍니다.",
      },
      {
        type: "multiple-choice",
        question: "'canaryPct 변수 하나가 롤백 스위치'가 뜻하는 것은?",
        options: [
          "롤백하려면 새 배포가 필요하다",
          "0으로 내리면 전원이 안정판으로 — 배포 없는 즉시 롤백, '되돌릴 길을 미리'(A5)의 코드화",
          "canaryPct는 자동으로만 바뀐다",
        ],
        correctIndex: 1,
        explanation:
          "되돌릴 수 없는 변경은 준비 안 된 변경이에요. 라우터 구조 자체가 롤백 경로를 내장합니다.",
      },
      {
        type: "multiple-choice",
        question: "카나리 표본이 2건뿐일 때 승격 기준을 충족해도 판단을 보류하는 이유는?",
        options: [
          "관료주의적 절차 때문",
          "적은 표본의 좋은 성적은 우연일 수 있다 — 표본이 모일 때까지의 인내도 판정 기준의 일부",
          "카나리는 최소 한 달 돌려야 한다는 법이 있어서",
        ],
        correctIndex: 1,
        explanation:
          "C6의 '1회 차이는 차이가 아니다'가 카나리에도 적용돼요. n이 작을 땐 기다림이 가장 정확한 판정입니다.",
      },
    ],
  } satisfies Quiz,
};

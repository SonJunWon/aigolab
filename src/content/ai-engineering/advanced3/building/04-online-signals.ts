import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급3 시리즈C(운영 만들기) 04강 — 현장 신호 수집.
 * 피드백 이벤트 스키마 + 암묵 신호 자동 추출 + 오프라인·온라인 불일치 경보.
 */
export const lessonC04: Lesson = {
  id: "ai-eng-a3-c04-online-signals",
  language: "ai-engineering",
  track: "advanced3",
  order: 24,
  title: "C4. 현장 신호 수집 — 온라인 평가",
  subtitle: "수정 diff가 말해주는 것 — 그리고 시험과 현장의 불일치 경보",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🎛 고급3·C4강. 현장 신호 수집
### — 온라인 평가

⏱️ 45분 · 🧰 API 키 · 🗺️ 운영 루프: **② 평가 (온라인의 코드화)** · 선수: C1~C3

> 💡 B4에서 손으로 적던 '수정·재요청·무시'를 이벤트로 수집합니다.
> 코드가 되면 좋아지는 것 하나 — **수정의 크기**를 잴 수 있어요. 한 글자 고침과
> 절반을 다시 쓴 것은 다른 신호니까요.
> 그리고 오늘의 완성: A3의 불일치 해석표가 **자동 경보**가 됩니다 —
> "시험은 만점인데 현장 수정률이 오르고 있다"를 코드가 먼저 알아채는 것.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ══ 1. 피드백 이벤트 스키마 — run 레코드와 짝을 이루는 두 번째 계면 ══
type FeedbackEvent = {
  run_ref: string;                                    // 어느 실행의 산출물인가 (C1 레코드와 연결!)
  ts: number;
  action: "used" | "edited" | "regenerated" | "ignored";
  editRatio?: number;                                 // 수정 크기 (0~1) — edited일 때만
};

// ── 수정 크기 자동 측정: 원본 vs 사용본의 거친 diff 비율 ──
// (정밀 diff 알고리즘 불필요 — 추이용 대용치면 충분: B2의 지혜)
function editRatio(original: string, used: string): number {
  const a = new Set(original.split(/\\s+/)), b = new Set(used.split(/\\s+/));
  const kept = [...a].filter((w) => b.has(w)).length;
  return +(1 - kept / Math.max(a.size, 1)).toFixed(2);
}

// ══ 2. 2주치 이벤트 시뮬레이션 — '시험 만점 + 현장 악화' 드리프트를 심는다 ══
const DAY = 86400000, base = 1700000000000;
const EVENTS: FeedbackEvent[] = [];
for (let d = 0; d < 14; d++) {
  const week2 = d >= 7;
  const roll = d % 4;
  if (!week2) {
    EVENTS.push({ run_ref: \`run-\${d}\`, ts: base + d * DAY, action: roll === 0 ? "edited" : "used", editRatio: roll === 0 ? 0.1 : undefined });
  } else {
    // 2주차: 수정이 잦아지고 커진다 (현장 악화)
    EVENTS.push({ run_ref: \`run-\${d}\`, ts: base + d * DAY, action: roll <= 1 ? "edited" : roll === 2 ? "used" : "regenerated", editRatio: roll <= 1 ? 0.45 : undefined });
  }
}

// ══ 3. 주간 현장 지표 집계 (C2 배관과 같은 구조) ══
function fieldStats(events: FeedbackEvent[], t0: number) {
  const weeks = new Map<number, FeedbackEvent[]>();
  for (const e of events) {
    const w = Math.floor((e.ts - t0) / (7 * DAY));
    (weeks.get(w) ?? weeks.set(w, []).get(w)!).push(e);
  }
  return [...weeks.entries()].map(([week, es]) => ({
    week,
    editRate: +(es.filter((e) => e.action === "edited").length / es.length).toFixed(2),
    avgEditSize: +(es.filter((e) => e.editRatio != null).reduce((a, e) => a + e.editRatio!, 0) / Math.max(es.filter((e) => e.editRatio != null).length, 1)).toFixed(2),
    regenRate: +(es.filter((e) => e.action === "regenerated").length / es.length).toFixed(2),
    ignoreRate: +(es.filter((e) => e.action === "ignored").length / es.length).toFixed(2),
  })).sort((a, b) => a.week - b.week);
}

// ══ 4. 불일치 경보 — A3 해석표의 자동화 ══
function mismatchAlert(goldenScore: number, field: ReturnType<typeof fieldStats>[number]): string | null {
  const fieldBad = field.editRate >= 0.4 || field.regenRate >= 0.15 || field.avgEditSize >= 0.3;
  const goldenGood = goldenScore >= 8;
  if (goldenGood && fieldBad)
    return \`⚠️ 불일치: 골든 \${goldenScore}점(좋음)인데 현장 악화(수정률 \${field.editRate}·수정크기 \${field.avgEditSize}) — 시험이 낡았을 가능성. 최근 수정 사례를 골든 후보로 검토하라.\`;
  if (!goldenGood && !fieldBad)
    return \`⚠️ 역불일치: 골든 \${goldenScore}점(나쁨)인데 현장 건강 — 채점 루브릭이 현실과 어긋났을 가능성(C3 판정자 골든 재실행).\`;
  return null;
}

const fs = fieldStats(EVENTS, base);
console.log("📊 주간 현장 지표:"); console.table(fs);
const thisWeek = fs[fs.length - 1];
const goldenThisWeek = 8.4;  // C3 평가 러너의 이번 주 점수 (시험은 여전히 만점!)
const alert = mismatchAlert(goldenThisWeek, thisWeek);
console.log("\\n" + (alert ?? "🟢 시험·현장 일치 — 건강"));
console.log("\\n👉 시험(8.4)만 봤다면 놓쳤을 드리프트를 현장 신호가 잡았다 — 이중 성적표의 자동화.");`,
      hints: [
        "editRatio가 정밀 diff가 아니라 단어 집합 비교인 것 — 추이용 대용치는 거칠어도 됩니다(B2). 정밀함에 투자하기 전에 '이 신호로 결정이 바뀌는가'를 먼저 물으세요.",
        "FeedbackEvent의 run_ref가 C1 레코드와의 연결 고리 — 이게 있어야 '어느 버전의 산출물이 수정을 많이 당했나'(버전별 현장 성적)를 나중에 계산할 수 있어요.",
        "mismatchAlert의 두 방향(불일치·역불일치)이 A3 해석표의 1·2행 — 나머지 행(둘 다 좋음/나쁨)은 경보가 아니라 각각 유지·진단(C5)의 영역입니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 📥 수집의 현실 — 이벤트는 어디서 오나

시뮬레이션이 아닌 실전에서 이벤트를 얻는 3가지 훅:

| 훅 | 방법 | 얻는 것 |
|------|------|---------|
| **산출물에 버튼** | 브리핑 하단에 '그대로 씀 / 고쳐 씀' 원클릭 | action (명시적 협조 필요) |
| **사용본 회수** | 최종 사용된 문서를 저장소에서 관찰 (공유 채널·문서함) | editRatio 자동 계산 — 가장 정직 |
| **재실행 감지** | 같은 입력의 재요청을 run 로그에서 탐지 (input_digest 비교!) | regenerated — **완전 자동** |

세 번째 훅에 주목 — C1 레코드의 input_digest가 여기서 배당금을 줍니다.
같은 digest가 하루에 두 번? 첫 산출물이 버려졌다는 뜻. **이미 있는 데이터에서
신호를 캐는 것**이 온라인 평가 설계의 반이에요.

## 🔬 연구 노트 — C4

1. **버전별 현장 성적**: run_ref → version 조인으로 '버전별 수정률' 표를 만들라 — B5 개선 대장의 '승격이 정말 개선이었나'를 현장이 재검증하는 구조다.
2. **무시 감지의 난제**: ignored는 '안 열었음'인데, 열람 추적이 없다면 어떻게 근사할 수 있나? (힌트: 사용·수정·재생성 어느 이벤트도 없는 run — 침묵이 곧 신호.)
3. **경보 문턱 튜닝**: editRate 문턱 0.4를 0.3/0.5로 바꿔 2주치 데이터에 돌려라 — 거짓 경보와 늦은 경보 사이의 다이얼(C2 노이즈 실험과 같은 근육).

> 🎯 **(전부 잊어도 이것만)**
> ## 현장 신호의 코드화 — 이벤트 스키마(run_ref로 레코드와 연결) + **수정 크기**(거친 diff면 충분) + 재실행 자동 감지(input_digest의 배당금).
> 완성은 **불일치 경보** — '시험 좋음 + 현장 악화'를 코드가 먼저 알아챈다. 이중 성적표가 자동으로 흐르는 순간.

📎 **다음 강 — C5. 실패 분류기**: 경보가 울리면 다음 질문은 '왜'입니다. 실패 트레이스를 유형으로 자동 분류해 진단 대시보드를 만들어요 — 규칙 우선, 애매한 것만 LLM.`,
    },
  ],

  quiz: {
    title: "고급3·C4강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "수정 크기(editRatio)를 정밀 diff가 아닌 거친 단어 비교로 재는 이유는?",
        options: [
          "정밀 diff는 특허가 있어서",
          "추이용 대용치는 거칠어도 충분하며(B2), 정밀함 투자 전에 '이 신호로 결정이 바뀌는가'를 먼저 물어야 하기 때문",
          "단어 비교가 더 정확해서",
        ],
        correctIndex: 1,
        explanation:
          "0.1(한 글자 손질)과 0.45(절반 재작성)를 구분하면 충분해요. 완벽한 측정을 기다리다 아무것도 안 재는 게 최악입니다.",
      },
      {
        type: "multiple-choice",
        question: "재실행(regenerated)을 완전 자동으로 감지하는 방법은?",
        options: [
          "사용자에게 매번 물어본다",
          "run 로그에서 같은 input_digest가 짧은 간격으로 반복되는 것을 탐지 — 이미 있는 데이터에서 신호를 캔다",
          "AI가 사용자의 표정을 읽는다",
        ],
        correctIndex: 1,
        explanation:
          "같은 입력의 재요청 = 첫 산출물이 버려졌다는 뜻. C1 레코드의 input_digest 필드가 여기서 배당금을 줍니다.",
      },
      {
        type: "multiple-choice",
        question: "불일치 경보('골든 좋음 + 현장 악화')가 뜨면 가장 먼저 검토할 것은?",
        options: [
          "사용자 교육 강화",
          "시험이 낡았을 가능성 — 최근 수정 사례를 새 골든 케이스 후보로 검토 (A3 처방의 자동화)",
          "현장 지표 수집을 중단",
        ],
        correctIndex: 1,
        explanation:
          "시험 만점 + 현장 불만 = 드리프트의 얼굴(A3). 현장의 실패가 새 시험 문제가 되는 순환이 처방입니다.",
      },
    ],
  } satisfies Quiz,
};

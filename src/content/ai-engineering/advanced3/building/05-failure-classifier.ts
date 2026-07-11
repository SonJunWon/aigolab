import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급3 시리즈C(운영 만들기) 05강 — 실패 분류기.
 * 규칙 우선 + 애매한 것만 LLM. 유형별 카운트 = 진단 대시보드.
 */
export const lessonC05: Lesson = {
  id: "ai-eng-a3-c05-failure-classifier",
  language: "ai-engineering",
  track: "advanced3",
  order: 25,
  title: "C5. 실패 분류기 — 진단의 자동화",
  subtitle: "실패에도 족보가 있다 — 규칙 먼저, LLM은 애매할 때만",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🎛 고급3·C5강. 실패 분류기
### — 진단의 자동화

⏱️ 45분 · 🧰 API 키 · 🗺️ 운영 루프: **③ 진단의 코드화** · 선수: C1~C4

> 💡 경보(C2·C4)가 울리면 다음 질문은 '왜'입니다. B1에서는 일지를 눈으로 뒤졌죠 —
> 오늘은 실패를 **유형으로 자동 분류**해 "이번 주 실패 5건 중 4건이 형식 위반"처럼
> 진단이 **숫자로 요약**되게 만듭니다.
> 설계 원칙은 고급2 C7의 재등장: **판단이 필요 없는 건 코드로(규칙), 필요한 것만 LLM으로.**
> 실패의 8할은 규칙으로 분류됩니다 — LLM은 나머지 2할의 애매한 것 전담.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ══ 실패 유형의 족보 — 3부작 실패학(고급1·2 A6 + 운영 A6)의 코드화 ══
type FailureKind =
  | "format_violation"   // 산출물 계약 위반 (고급2 C5의 반려 소진)
  | "tool_error"         // 도구·외부 소스 실패 (수집 갈래 빈손 등)
  | "verify_surge"       // 검증 기각 폭증 (오염 의심)
  | "budget_exhausted"   // 예산 소진 (비용 폭주의 흔적)
  | "silent_failure"     // 무소식 (보고 자체 누락 — B1의 최대 경보!)
  | "quality_drop";      // 위 전부 아닌데 품질만 하락 (드리프트 의심 — LLM 전담)

type FailedRun = { id: string; report: string };  // 침묵 금지 보고 문자열이 분류 입력

// ══ 1단: 규칙 분류기 — 빠르고 공짜고 결정적 ══
function classifyByRule(f: FailedRun): FailureKind | null {
  const r = f.report;
  if (r === "") return "silent_failure";                                  // 빈 보고 = 무소식
  if (/계약 (위반|결렬)|파싱 실패|형식/.test(r)) return "format_violation";
  if (/빈손|응답 없음|timeout|도구 (오류|실패)/.test(r)) return "tool_error";
  if (/기각 \\d+건.*평소/.test(r)) return "verify_surge";
  if (/예산 (소진|초과)|한도/.test(r)) return "budget_exhausted";
  return null;                                                             // 애매 → 2단으로
}

// ══ 2단: LLM 분류기 — 애매한 것 전담 (족보를 프롬프트에 계약으로) ══
async function classifyByLLM(f: FailedRun): Promise<FailureKind> {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: \`실패 보고를 분류하라. 반드시 다음 중 하나만 출력: format_violation | tool_error | verify_surge | budget_exhausted | quality_drop\` },
      { role: "user", content: f.report },
    ],
  });
  const t = (res.text ?? "").trim();
  const valid: FailureKind[] = ["format_violation", "tool_error", "verify_surge", "budget_exhausted", "quality_drop"];
  return (valid.find((v) => t.includes(v)) ?? "quality_drop");  // 안전측 기본값 — 드리프트 의심으로
}

async function classify(f: FailedRun): Promise<{ kind: FailureKind; by: "rule" | "llm" }> {
  const rule = classifyByRule(f);
  return rule ? { kind: rule, by: "rule" } : { kind: await classifyByLLM(f), by: "llm" };
}

// ── 시운전: 이번 주 실패 6건 ──
const failures: FailedRun[] = [
  { id: "run-31", report: "수집 갈래 C 빈손 — 사이트 응답 없음" },
  { id: "run-33", report: "계약 결렬 — 재시도 소진 (confidence 필드 누락 반복)" },
  { id: "run-35", report: "" },
  { id: "run-36", report: "검증 기각 4건 — 평소 1건 대비 급증, 사유: 출처 불명 반복" },
  { id: "run-38", report: "수집 갈래 C 빈손 — 사이트 응답 없음" },
  { id: "run-40", report: "산출물은 나왔으나 채점 5.2점 — 내용이 두루뭉술하고 근거 약함" },
];

const counts = new Map<FailureKind, number>();
for (const f of failures) {
  const { kind, by } = await classify(f);
  counts.set(kind, (counts.get(kind) ?? 0) + 1);
  console.log(\`[\${f.id}] \${kind} (분류: \${by})\`);
}

// ── 진단 대시보드: 유형별 카운트 + 처방 연결 (C2 '행동 연결'의 진단판) ──
const PRESCRIPTION: Record<FailureKind, string> = {
  tool_error: "해당 갈래 점검 — 반복이면 소스 교체·수집 시각 조정 (B1 요일성 확인)",
  format_violation: "계약·프롬프트 확인 — 모델 변경(드리프트)이면 견본 보강",
  verify_surge: "상류 오염 의심 — 해당 기간 입력 소스 점검 (고급2 A6)",
  budget_exhausted: "거버너 로그 확인 (C8) — 입력 폭증 vs 위임 폭주 구분",
  silent_failure: "즉시 점검 — 보고 파이프라인 자체가 죽었다 (최우선!)",
  quality_drop: "드리프트 의심 — 골든 재실행 + 현장 신호 대조 (C3·C4)",
};
console.log("\\n🩺 주간 진단 리포트:");
for (const [kind, n] of [...counts.entries()].sort((a, b) => b[1] - a[1]))
  console.log(\`  \${kind} × \${n} → \${PRESCRIPTION[kind]}\`);
console.log("\\n👉 '실패 6건'이 '갈래 C 반복 2건 + 무소식 1건 우선'으로 요약됐다 — 진단이 숫자가 됐다.");`,
      hints: [
        "규칙 분류가 못 잡은 것만 LLM에 보내는 2단 구조 — 실패의 8할은 정규식으로 잡히고, LLM 호출은 2할로 줄어요. '판단이 필요 없는 일은 모델에게 시키지 않는다'(고급2 C7)의 운영판.",
        "LLM 분류의 안전측 기본값이 quality_drop인 이유 — 분류 불능을 '드리프트 의심'으로 두면 골든 재실행(가장 정보가 많은 다음 행동)으로 이어집니다.",
        "PRESCRIPTION 표가 C2 judge()의 진단판 — 유형마다 '다음 행동'이 붙어야 대시보드지, 카운트만 있으면 장식(A6)입니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 🩺 분류기의 운영 — 족보도 자란다

분류기 자체도 기르는 대상입니다:
- **unknown 비율 감시**: LLM행(규칙 미적중)이 2할을 넘게 늘면 — 새 유형의 실패가
  등장했다는 신호. 반복되는 LLM 분류 결과를 **새 규칙으로 승격** (족보의 성장)
- **분류 골든 케이스**: 유형이 확실한 실패 보고 몇 건을 박제해두고, 규칙을 고칠 때마다
  재실행 (C3 판정자 골든과 같은 원리 — **분류기도 검증 대상**)
- 사고 포스트모템(B6)의 '원인' 칸이 이 족보의 언어로 쓰이면 — 사고 통계가 자동으로 쌓입니다

## 🔬 연구 노트 — C5

1. **족보 승격 파이프라인**: LLM 분류 결과를 로그로 모아, 같은 패턴 3회 이상이면 '새 규칙 후보'를 제안하는 함수를 짜라.
2. **동반 실패 탐지**: 같은 날 tool_error와 verify_surge가 함께 나타나는 패턴(B1의 동반 이상)을 카운트에서 자동 감지하려면 어떤 자료구조가 필요한가?
3. **run 레코드 합류**: classify 결과를 C1 레코드의 failure_kind 칸에 써넣어라 — 이제 텔레메트리(C2)가 '실패율'을 '유형별 실패율'로 쪼갤 수 있다.

> 🎯 **(전부 잊어도 이것만)**
> ## 진단의 자동화 = **실패의 족보 + 2단 분류(규칙 8할, LLM 2할) + 유형별 처방 연결.** 카운트만 있는 대시보드는 장식이다.
> 족보도 자란다 — LLM행이 늘면 새 유형의 신호, 반복 패턴은 규칙으로 승격. 그리고 분류기도 골든 케이스로 검증하라.

📎 **다음 강 — C6. 회귀 게이트**: 진단이 개선안을 낳으면, 반영 전 마지막 관문 — '변경은 게이트를 통과해야 반영된다'를 코드로 강제합니다. B5 개선 대장의 자동화예요.`,
    },
  ],

  quiz: {
    title: "고급3·C5강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "분류를 '규칙 우선, LLM은 애매한 것만'의 2단으로 설계한 이유는?",
        options: [
          "LLM이 정규식을 무서워해서",
          "실패의 8할은 판단이 필요 없는 패턴이므로 — 계산으로 되는 일에 모델을 쓰지 않는 비용 원칙(고급2 C7)",
          "규칙이 LLM보다 항상 정확해서",
        ],
        correctIndex: 1,
        explanation:
          "'계약 결렬', '빈손' 같은 보고는 정규식이면 충분해요. LLM은 quality_drop처럼 맥락 판단이 필요한 2할 전담입니다.",
      },
      {
        type: "multiple-choice",
        question: "LLM행(규칙 미적중) 비율이 점점 늘어나는 것의 의미는?",
        options: [
          "규칙이 게을러진 것",
          "족보에 없는 새 유형의 실패가 등장했다는 신호 — 반복 패턴을 새 규칙으로 승격할 때",
          "LLM이 일감을 뺏어가는 것",
        ],
        correctIndex: 1,
        explanation:
          "족보도 자라는 문서예요. unknown 비율은 '세상이 족보보다 빨리 변하고 있다'는 계기판입니다.",
      },
      {
        type: "multiple-choice",
        question: "유형별 카운트에 처방(PRESCRIPTION)을 붙이는 이유는?",
        options: [
          "표를 두 칸으로 만들기 위해",
          "행동 없는 카운트는 장식(A6) — 유형마다 '다음 행동'이 붙어야 진단 대시보드가 된다",
          "처방전은 법적 의무라서",
        ],
        correctIndex: 1,
        explanation:
          "C2 judge()의 행동 연결과 같은 원칙이에요. '실패 6건'이 아니라 '갈래 C 점검 + 무소식 최우선'으로 떨어져야 진단입니다.",
      },
    ],
  } satisfies Quiz,
};

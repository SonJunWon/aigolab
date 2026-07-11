import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급2 시리즈C(팀 만들기) 06강 — 시스템 신경계.
 * 에이전트별 트레이스 트리 + 비용 회계 + 실패 재현. "로그가 없으면 조직도 없다".
 */
export const lessonC06: Lesson = {
  id: "ai-eng-a2-c06-trace-nervous-system",
  language: "ai-engineering",
  track: "advanced2",
  order: 26,
  title: "C6. 시스템 신경계 — 트레이스·비용·디버깅",
  subtitle: "로그가 없으면 조직도 없다 — 누가 누굴 불렀고 얼마를 썼나",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🏇 고급2·C6강. 시스템 신경계
### — 트레이스·비용·디버깅

⏱️ 50분 · 🧰 API 키 · 🗺️ 구현 대상: ⑤ 신뢰(관측) · 선수: C1~C5

> 💡 에이전트 다섯이 뛰기 시작하면 이런 질문에 답할 수 없게 됩니다 —
> '최종 보고의 이 문장, **누가** 만들었지?' '오늘 실행이 어제보다 비싼 이유는?'
> '어제는 됐는데 오늘 실패한 건 **어느 갈래**에서?'
> 단일 에이전트의 로그(고급1 C9)로는 부족해요. 조직에는 **계보가 있는 로그** —
> 누가 누굴 낳았고(트리), 각자 얼마를 썼는지(회계) — 가 필요합니다.
> **로그가 없으면 조직도 없다.** 멀티에이전트 디버깅의 제1원칙입니다.

### 이 강에서
- 트레이스 트리 — 부모-자식 계보가 찍히는 스팬(span) 기록
- 비용 회계 — 에이전트별·전체 사용량 자동 집계
- 실패 재현 — 트레이스에서 실패 갈래의 입력을 복원해 단독 재실행`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 오늘의 핵심: 계보를 기록하는 트레이서 ──
type Span = {
  id: string; parent: string | null; role: string; mission: string;
  startMs: number; endMs?: number; chars: number; // chars ≈ 비용 대용치 (실전: 토큰)
  status: "running" | "ok" | "error"; output?: string;
};
const TRACE: Span[] = [];
let seq = 0;

function beginSpan(parent: string | null, role: string, mission: string): Span {
  const s: Span = { id: \`s\${++seq}\`, parent, role, mission, startMs: Date.now(), chars: 0, status: "running" };
  TRACE.push(s);
  return s;
}

// ── 트레이서가 내장된 runAgent — 시그니처에 parentSpan 추가 ──
type Tool = { name: string; description: string; parameters: any; execute: (args: any, parentSpan: string) => Promise<any> };
async function runAgent(role: string, system: string, mission: string, tools: Tool[], parentSpan: string | null, maxTurns = 4): Promise<string> {
  const span = beginSpan(parentSpan, role, mission.slice(0, 60));
  const messages: any[] = [{ role: "system", content: system }, { role: "user", content: mission }];
  try {
    for (let t = 0; t < maxTurns; t++) {
      const res = await chat({ provider: "gemini", messages, tools });
      span.chars += (res.text ?? "").length; // 비용 회계 — 응답 크기 누적
      if (!res.toolCalls?.length) {
        span.status = "ok"; span.endMs = Date.now(); span.output = (res.text ?? "").slice(0, 80);
        return res.text ?? "";
      }
      messages.push({ role: "assistant", content: res.text ?? "", toolCalls: res.toolCalls });
      for (const call of res.toolCalls) {
        const tool = tools.find((x) => x.name === call.name)!;
        const r = await tool.execute(call.args as any, span.id); // 자식에게 내 span id를 물려준다 — 계보!
        messages.push({ role: "tool", content: JSON.stringify(r), toolCallId: call.id });
      }
    }
    span.status = "ok"; span.endMs = Date.now();
    return "(최대 턴 도달)";
  } catch (e) {
    span.status = "error"; span.endMs = Date.now(); span.output = String(e);
    throw e;
  }
}

// 워커 + delegate (C4 축약 — execute가 parentSpan을 받아 계보를 잇는다)
const delegate: Tool = {
  name: "delegate", description: "조사 임무를 워커에게 위임.",
  parameters: { type: "object", properties: { mission: { type: "string" } }, required: ["mission"] },
  execute: async ({ mission }: any, parentSpan: string) => ({
    report: await runAgent("worker", "조사 워커. 2줄 보고.", mission, [], parentSpan),
  }),
};

// ── 실행: 오케스트레이터가 워커 둘을 부리는 작은 조직 ──
await runAgent(
  "orchestrator",
  "오케스트레이터. 두 주제를 각각 delegate로 위임하고 종합하라.",
  "재택근무 생산성 논쟁의 찬성 근거와 반대 근거를 각각 조사해 균형 있게 종합하라.",
  [delegate],
  null,
);

// ── 신경계 판독: 트리 렌더링 + 비용 회계 ──
function renderTree(parent: string | null, depth: number) {
  for (const s of TRACE.filter((x) => x.parent === parent)) {
    const dur = s.endMs ? \`\${s.endMs - s.startMs}ms\` : "…";
    const icon = s.status === "ok" ? "✅" : s.status === "error" ? "❌" : "⏳";
    console.log(\`\${"  ".repeat(depth)}\${icon} [\${s.id}] \${s.role} (\${dur}, \${s.chars}자) — \${s.mission}\`);
    renderTree(s.id, depth + 1);
  }
}
console.log("🌳 트레이스 트리:");
renderTree(null, 0);

const byRole = TRACE.reduce((m, s) => (m[s.role] = (m[s.role] ?? 0) + s.chars, m), {} as Record<string, number>);
console.log("\\n💰 역할별 비용(문자 수):", byRole);
console.log("💰 총 비용:", TRACE.reduce((a, s) => a + s.chars, 0), "자");
console.log("\\n👉 '이 결론 누가 만들었지?' → 트리를 따라가면 span과 output이 나온다. 로그가 없으면 조직도 없다.");`,
      hints: [
        "핵심 설계는 tool.execute(args, span.id) — 도구 실행에 '현재 스팬'을 물려줘서 자식 에이전트의 스팬이 부모를 가리키게 합니다. 이 한 줄이 계보(트리)를 만들어요.",
        "chars는 토큰의 대용치예요. 실전 API는 usage(입력·출력 토큰)를 응답에 담아주니 그걸 누적하면 됩니다 — 구조는 동일.",
        "span.output에 결과 앞 80자를 저장하는 이유: 디버깅 시 '이 갈래가 뭘 반환했지'를 트리에서 바로 보기 위해. 전체 저장은 JSONL 파일로 — 트리는 요약, 파일은 원본 (C5의 '요약+위치'가 로그에도!).",
      ],
    },
    {
      type: "markdown",
      source: `## 🔁 실패 재현 — 트레이스의 진짜 배당금

트레이스가 예쁜 트리 그림용이라고 생각하면 절반만 쓰는 겁니다. 진짜 배당금은 **재현**이에요.

> **재현 절차 (트레이스 → 단독 재실행)**
> 1. 트리에서 ❌ 스팬을 찾는다 — 실패의 '주소'
> 2. 그 스팬의 \`role\`과 \`mission\`을 읽는다 — 실패 당시의 **입력이 복원**됨
> 3. 같은 role·mission으로 **그 에이전트만** 단독 재실행 — 조직 전체를 다시 돌릴 필요 없음
> 4. 고쳐지면 회귀(C9)로 확인
>
> 이게 가능한 이유: 우리 에이전트들은 **격리**돼 있어서(B1·C1) 입력(mission)만 같으면
> 단독 재현이 됩니다. 격리는 안전장치이자 **디버깅 장치**예요.

## 📊 회계가 잡아주는 조직 문제 3가지

| 회계에서 보이는 것 | 의심할 조직 문제 |
|-------------------|-----------------|
| 특정 역할의 비용이 압도적 | 그 역할이 원문을 통째로 옮기는 중? (C5 위반) |
| 오케스트레이터 비용 > 워커 합 | 지휘자가 연주 중 (A3 위반!) |
| 실행마다 비용 편차 큼 | 동적 위임 폭주 기미 — 가드 점검 (C4) |

A3의 '지휘자는 연주하지 않는다'가 **숫자로 감시 가능**해졌다는 점에 주목하세요.
원칙은 지도(A 시리즈)에서 배우고, 계측(C 시리즈)으로 지킵니다.`,
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C6

1. **JSONL 내보내기**: TRACE를 JSON Lines 문자열로 직렬화하는 exportTrace()를 짜라. 실행 간 비교(어제 vs 오늘)가 가능해지는 순간 — C9 회귀 평가의 원료다.
2. **지휘자 연주 감지기**: '오케스트레이터 chars > 워커 chars 합'이면 경고를 출력하는 감사 함수를 짜라. 오케스트레이터 지침에서 '직접 조사 금지'를 빼고 경고가 울리는지 실험.
3. **재현 자동화**: ❌ 스팬을 받아 같은 입력으로 단독 재실행하는 replay(spanId)를 구현하라. 재현 실패(이번엔 성공)하면? — 비결정성 문제를 어떻게 다룰지 고민해보라 (힌트: 실패 사례 박제 → 골든 케이스).

> 🎯 **(전부 잊어도 이것만)**
> ## 조직의 로그에는 **계보**가 있어야 한다 — 자식 스팬이 부모를 가리키는 트레이스 트리 + 역할별 비용 회계.
> 트레이스의 배당금은 **재현** — 격리 덕분에 실패 갈래만 입력 복원해 단독 재실행할 수 있다. 로그가 없으면 조직도 없다.

📎 **다음 강 — C7. 실전 아크 시작 🏗**: 부품이 전부 모였습니다 — spawn(C1)·레지스트리(C2)·팬아웃(C3)·가드(C4)·계약(C5)·신경계(C6). 이제 이걸로 진짜 시스템을 짓습니다: **'자동 코드리뷰 회사' 설계 회의**부터.`,
    },
  ],

  quiz: {
    title: "고급2·C6강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "트레이스 '트리'(계보)를 만드는 핵심 구현은?",
        options: [
          "모든 로그를 시간순으로 한 파일에 쌓는 것",
          "도구 실행에 현재 스팬 id를 물려줘 자식 스팬이 부모를 가리키게 하는 것",
          "에이전트마다 다른 색으로 로그를 찍는 것",
        ],
        correctIndex: 1,
        explanation:
          "시간순 로그만으로는 '누가 누굴 불렀는지'가 안 보여요. parent 포인터 하나가 로그를 조직도로 만듭니다.",
      },
      {
        type: "multiple-choice",
        question: "격리(B1·C1)가 디버깅에 주는 선물은?",
        options: [
          "실패한 에이전트를 자동으로 해고해준다",
          "입력(mission)만 같으면 실패 갈래를 조직 전체 재실행 없이 단독 재현할 수 있다",
          "실패가 아예 일어나지 않게 해준다",
        ],
        correctIndex: 1,
        explanation:
          "격리된 에이전트는 mission이 입력의 전부라서, 트레이스에서 mission을 복원하면 그 갈래만 다시 돌릴 수 있어요. 격리는 안전장치이자 재현 장치입니다.",
      },
      {
        type: "multiple-choice",
        question: "비용 회계에서 '오케스트레이터 비용 > 워커 비용 합'이 뜻하는 신호는?",
        options: [
          "오케스트레이터가 승진할 때가 됐다",
          "지휘자가 직접 연주(작업)하고 있을 가능성 — A3 원칙 위반의 수치적 징후",
          "워커들이 파업 중이다",
        ],
        correctIndex: 1,
        explanation:
          "지휘자의 책상에는 보고서만 올라와야 해요. 회계는 A 시리즈의 원칙들을 숫자로 감시하게 해주는 도구입니다.",
      },
    ],
  } satisfies Quiz,
};

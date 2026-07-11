import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급2 시리즈C(팀 만들기) 04강 — 슈퍼바이저 루프.
 * 동적 오케스트레이션: delegate 도구 + 폭주 가드 3종(깊이·인원·예산).
 */
export const lessonC04: Lesson = {
  id: "ai-eng-a2-c04-supervisor-loop",
  language: "ai-engineering",
  track: "advanced2",
  order: 24,
  title: "C4. 지휘 패턴 구현 ② — 슈퍼바이저 루프",
  subtitle: "모델이 흐름을 쥔다 — 그래서 가드 3종이 법이다",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🏇 고급2·C4강. 지휘 패턴 구현 ②
### — 슈퍼바이저 루프

⏱️ 50분 · 🧰 API 키 · 🗺️ 구현 대상: ③ 지휘 (동적) · 선수: C1~C3

> 💡 결정적 지휘(C3)는 흐름이 미리 그려질 때의 무기였어요. 오늘은 **그릴 수 없는** 일 —
> '고객 이탈이 늘어난 원인을 찾아라' 같은, 해봐야 다음이 정해지는 탐구 —
> 을 위해 흐름의 열쇠를 **모델에게** 넘깁니다.
> 열쇠를 넘기는 순간 A6의 악몽(무한 위임·비용 폭발)이 가능해지므로,
> 슈퍼바이저에게는 **가드 3종이 법**입니다: 깊이 · 인원 · 예산.

### 이 강에서
- delegate 도구를 쥔 슈퍼바이저 — 계획→위임→재계획 루프
- 폭주 가드 3종을 코드에 박기 (지침이 아니라 execute 안에!)
- 결정적 vs 동적 선택 기준표 완성`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 스타터 (C1 압축) ──
type Tool = { name: string; description: string; parameters: any; execute: (args: any) => Promise<any> };
async function runAgent(system: string, mission: string, tools: Tool[], maxTurns = 6): Promise<string> {
  const messages: any[] = [{ role: "system", content: system }, { role: "user", content: mission }];
  for (let t = 0; t < maxTurns; t++) {
    const res = await chat({ provider: "gemini", messages, tools });
    if (!res.toolCalls?.length) return res.text ?? "";
    messages.push({ role: "assistant", content: res.text ?? "", toolCalls: res.toolCalls });
    for (const call of res.toolCalls) {
      const tool = tools.find((x) => x.name === call.name)!;
      messages.push({ role: "tool", content: JSON.stringify(await tool.execute(call.args as any)), toolCallId: call.id });
    }
  }
  return "(최대 턴 도달)";
}

// 워커 역할 2종 (mock 데이터 기반 — 오늘의 주인공은 워커가 아니라 '가드')
const lookup: Tool = {
  name: "data_lookup", description: "지표 데이터를 조회.",
  parameters: { type: "object", properties: { metric: { type: "string" } }, required: ["metric"] },
  execute: async ({ metric }: any) => ({
    data: metric.includes("이탈") ? "이탈률 3월 2.1% → 6월 4.8%. 이탈 집중: 결제 갱신 실패 고객"
        : metric.includes("결제") ? "결제 갱신 실패 6월 급증 +180%. 원인 후보: 카드사 정책 변경"
        : "관련 데이터 없음",
  }),
};

// ── 오늘의 핵심: 가드가 내장된 delegate 도구 ──
// 가드는 '지침'이 아니라 'execute 코드'에 박는다 — 지침은 어길 수 있어도 코드는 못 어긴다 (C2)
const guard = { depth: 0, spawned: 0, spentTurns: 0 };
const LIMITS = { maxDepth: 1, maxWorkers: 4, maxTotalTurns: 12 };

function makeDelegate(depth: number): Tool {
  return {
    name: "delegate",
    description: "조사 임무를 워커에게 위임한다. 독립 임무만. 요약 보고가 돌아온다.",
    parameters: { type: "object", properties: { mission: { type: "string", description: "완결된 임무 문장 (워커는 이 대화를 모른다)" } }, required: ["mission"] },
    execute: async ({ mission }: any) => {
      // 가드 3종 — 위임 요청이 올 때마다 '법'을 먼저 확인
      if (depth >= LIMITS.maxDepth) return { error: "깊이 한도 초과 — 직접 수행하라" };
      if (guard.spawned >= LIMITS.maxWorkers) return { error: "인원 한도 초과 — 기존 보고로 결론을 내라" };
      if (guard.spentTurns >= LIMITS.maxTotalTurns) return { error: "예산 소진 — 즉시 현재까지의 결론을 보고하라" };
      guard.spawned++; guard.spentTurns += 3; // 워커 1명 ≈ 3턴 예산으로 회계
      const report = await runAgent(
        "너는 데이터 조사 워커다. data_lookup으로 조사하고 3줄 이내로 보고하라.",
        mission,
        [lookup, makeDelegate(depth + 1)], // 워커에게도 delegate를 주되 depth+1 — 가드가 재위임을 차단
        3,
      );
      return { report };
    },
  };
}

// ── 슈퍼바이저 가동: 계획 → 위임 → 보고를 보고 재계획 ──
const answer = await runAgent(
  \`너는 원인 분석 슈퍼바이저다. 문제의 원인을 찾을 때까지:
1. 지금까지의 보고를 근거로 다음에 조사할 것을 정한다
2. delegate로 위임한다 (한 번에 하나씩 — 보고를 보고 다음을 정하는 게 네 강점이다)
3. 원인이 규명되면 인과 사슬을 3줄로 보고한다
delegate가 error를 반환하면 그 지시를 따르라.\`,
  "6월 들어 고객 이탈이 눈에 띄게 늘었다. 원인을 규명하라.",
  [makeDelegate(0)],
  8,
);
console.log("🎯 슈퍼바이저의 결론:\\n", answer);
console.log(\`\\n📊 가드 회계: 워커 \${guard.spawned}명 / 한도 \${LIMITS.maxWorkers}, 예산 \${guard.spentTurns} / \${LIMITS.maxTotalTurns}턴\`);`,
      hints: [
        "makeDelegate(depth + 1)가 A6 '무한 위임' 처방의 코드 버전이에요 — 워커도 delegate를 갖지만 depth 가드에 막혀 재위임이 거부됩니다. '위임의 피라미드'가 태어나기 전에 차단.",
        "가드가 error 객체를 반환하는 설계에 주목 — throw로 죽이지 않고 '직접 수행하라' 같은 지시를 돌려줘서 슈퍼바이저가 우아하게 경로를 바꾸게 합니다. 에러도 모델이 읽는 UI예요(고급1 C2).",
        "'한 번에 하나씩'이라는 지침이 슈퍼바이저다움의 핵심 — 보고를 보고 다음을 정하는 게 이 패턴의 존재 이유입니다. 한꺼번에 다 위임할 거면 C3 팬아웃이 싸고 빨라요.",
      ],
    },
    {
      type: "markdown",
      source: `## ⚖️ 결정적 vs 동적 — 최종 선택 기준표

C3과 C4를 모두 지었으니 기준표를 완성합니다.

| 질문 | 예 → | 아니오 → |
|------|------|---------|
| 흐름을 미리 그릴 수 있나? | **C3 결정적** (파이프라인·팬아웃) | 다음 질문 |
| 중간 결과가 다음 행동을 바꾸나? | **C4 슈퍼바이저** | C3로 충분 |
| 슈퍼바이저를 쓴다면 — 가드 3종을 달았나? | 진행 | **달기 전엔 금지** |

> 실무 감각: 망설여지면 **결정적부터.** 결정적으로 짜다가 '여기서는 결과를 보고 갈라져야 하네'
> 싶은 지점만 슈퍼바이저로 바꾸는 게 정석입니다. 처음부터 전부 동적으로 지으면
> 디버깅 불가능한 조직이 돼요 — 실행마다 다르게 움직이니까.

## 🧮 예산 가드의 회계학

가드 3종 중 예산(maxTotalTurns)이 가장 실전적입니다. 깊이·인원은 구조를 막지만,
예산은 **돈을** 막아요. 위 코드는 '워커 1명 ≈ 3턴'으로 회계했지만, 실전에서는
토큰 사용량을 직접 합산합니다 — C6 트레이서가 그 회계 장부를 자동화하고,
C9에서 '예산 소진 시 우아한 중단(부분 결과 반환)'으로 완성합니다.
지금 기억할 원칙 하나: **예산 초과의 올바른 반응은 중단이 아니라 '지금까지의 결론 보고'.**
빈손 실패보다 부분 성공이 언제나 낫습니다.`,
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C4

1. **가드 제거 실험**: LIMITS를 전부 999로 풀고 슈퍼바이저 지침에서 '한 번에 하나씩'을 지워라. 위임 횟수와 총 턴이 어떻게 변하는가? (요금 주의 — maxTurns는 유지하라.)
2. **계획 드리프트 관찰**: 슈퍼바이저의 중간 메시지들을 출력해 '처음 계획'과 '실제 경로'를 비교하라. 보고가 계획을 바꾼 순간이 보이는가? 그게 이 패턴의 가치이자 예측 불가능성이다.
3. **하이브리드 설계**: '갱신 실패 고객 조사'는 팬아웃(C3)이 어울리는 하위 작업이다. 슈퍼바이저가 delegate 대신 fanout 도구도 갖게 설계해보라 — 동적 지휘 안에 결정적 블록을 끼워 넣는 실전 구조.

> 🎯 **(전부 잊어도 이것만)**
> ## 슈퍼바이저 = **delegate 도구를 쥔 에이전트의 계획→위임→재계획 루프.** 열쇠를 모델에게 넘기는 대가로 **가드 3종(깊이·인원·예산)을 코드에** 박는 것이 법이다.
> 망설여지면 결정적부터 — 동적 지휘는 중간 결과가 다음 행동을 바꾸는 곳에만.

📎 **다음 강 — C5. 산출물 계약**: 지금까지 에이전트들은 자유 텍스트로 대화했어요. 팀이 커지면 그게 전화 게임(A4)이 됩니다. JSON 스키마 강제 + 검증 실패 재시도 + 아티팩트 공유 — 전달의 공학입니다.`,
    },
  ],

  quiz: {
    title: "고급2·C4강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "폭주 가드를 지침(프롬프트)이 아니라 delegate의 execute 코드에 박는 이유는?",
        options: [
          "코드가 프롬프트보다 짧아서",
          "지침은 모델이 어길 수 있지만 코드 가드는 물리적으로 우회할 수 없기 때문",
          "프롬프트에는 숫자를 쓸 수 없어서",
        ],
        correctIndex: 1,
        explanation:
          "C2 화이트리스트와 같은 원리예요. 무한 위임·비용 폭발 같은 조직 붕괴는 확률적 지침이 아니라 결정적 코드로 막습니다.",
      },
      {
        type: "multiple-choice",
        question: "가드가 한도 초과 시 throw 대신 error 객체(+지시)를 반환하는 이유는?",
        options: [
          "throw 문법이 어려워서",
          "에러도 모델이 읽는 정보이므로, '직접 수행하라' 같은 지시를 줘서 우아하게 경로를 바꾸게 하려고",
          "error 객체가 토큰을 절약해서",
        ],
        correctIndex: 1,
        explanation:
          "죽이는 대신 대안을 알려주면 슈퍼바이저가 부분 결과라도 만들어냅니다. 빈손 실패보다 부분 성공 — 예산 가드의 철학이에요.",
      },
      {
        type: "multiple-choice",
        question: "결정적(C3)과 동적(C4) 지휘의 선택 기준으로 옳은 것은?",
        options: [
          "동적이 최신 기술이므로 항상 동적으로",
          "흐름이 미리 그려지면 결정적, 중간 결과가 다음 행동을 바꾸는 곳만 동적",
          "짝수 날은 결정적, 홀수 날은 동적",
        ],
        correctIndex: 1,
        explanation:
          "실전의 8할은 결정적으로 충분해요. 망설여지면 결정적부터 짜고, 결과를 보고 갈라져야 하는 지점만 슈퍼바이저로 바꾸는 게 정석입니다.",
      },
    ],
  } satisfies Quiz,
};

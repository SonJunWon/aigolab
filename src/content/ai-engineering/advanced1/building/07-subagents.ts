import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급1 시리즈C(하네스 만들기) 07강 — 분신술(서브에이전트와 컨텍스트 격리).
 * 자식 에이전트 스폰(별도 messages) + 결과만 회수 + 병렬 실행.
 */
export const lessonC07: Lesson = {
  id: "ai-eng-a1-c07-subagents",
  language: "ai-engineering",
  track: "advanced1",
  order: 27,
  title: "C7. 분신술 — 서브에이전트와 컨텍스트 격리",
  subtitle: "책상 하나에 다 올리지 말고, 책상을 여러 개 펴라",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 👥 고급1·C7강. 분신술
### — 서브에이전트와 컨텍스트 격리

⏱️ 45분 · 🧰 API 키 · 🗺️ 구현 대상: 루프의 확장 (오케스트레이션) · 선수: C1, C4

> 💡 자료 조사 3건을 한 에이전트가 하면? 조사 1의 원문 전체가 조사 2·3 내내 책상에 남아 A4의 법칙대로 흐려집니다.
> 해법은 **책상을 여러 개 펴는 것** — 자식 에이전트(별도 messages 배열)에게 조사를 맡기고, 부모는 **결론만** 받습니다.
> 이게 서브에이전트의 전부예요: **격리된 컨텍스트 + 요약된 귀환.**

### 이 강에서
- spawn: 자식 = 새 messages 배열 + 좁은 도구함 + 명확한 임무
- 결과만 회수 — 부모 책상은 얇게 유지 (핵심!)
- Promise.all 병렬 스폰과 그 대가`,
    },
    {
      type: "markdown",
      source: `## 🧬 서브에이전트의 해부 — 새 프로세스가 아니라 새 대화

거창한 게 아닙니다. C1의 runAgent 를 **다른 인자로 한 번 더 부르는 것**:

\`\`\`
부모: messages_P (임무 전체 지도)
  └─ spawn("경쟁사 A 조사") → 자식1: messages_A (A만 아는 대화) → 요약 1줄 반환
  └─ spawn("경쟁사 B 조사") → 자식2: messages_B (B만 아는 대화) → 요약 1줄 반환
부모: 요약 2줄만 받아 종합 (원문 수천 자는 자식 책상과 함께 소멸)
\`\`\`

설계 결정 3가지:
1. **자식에게 무엇을 주나** — 임무 한 문장 + 필요한 도구만(B3 큐레이션). 부모의 대화 이력은 **안 준다** (그걸 주면 격리가 무의미).
2. **자식이 무엇을 돌려주나** — 계약된 형식의 요약. "찾은 것 전부"가 아니라 "부모가 판단에 쓸 것만" — C2 '도구 결과 다이어트'와 같은 원리. **자식 에이전트는 부모에게 도구처럼 보입니다.**
3. **깊이 제한** — 자식이 또 자식을 부르면? 비용·추적 폭발. 실전 하네스는 보통 1단계로 제한합니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 서브에이전트: 격리된 조사원을 스폰하고 결론만 회수 ──
// (조사 도구는 mock — 오늘의 주인공은 도구가 아니라 '격리 구조')
const research = {
  name: "web_research",
  description: "주제를 웹에서 조사해 원문 발췌를 반환.",
  parameters: { type: "object", properties: { topic: { type: "string" } }, required: ["topic"] },
  execute: async ({ topic }: any) => ({
    excerpt: \`[\${topic} 조사 원문] \${topic}는 최근 시장 점유율이 크게 변동... (긴 원문 시뮬레이션) \`.repeat(30),
  }),
};

// 자식 에이전트 = C1 루프의 재사용. 부모 이력 없이, 임무 한 문장으로 시작.
async function spawnResearcher(mission: string): Promise<string> {
  const messages: any[] = [
    { role: "system", content: \`너는 조사 전담 에이전트다. 임무만 수행하고 아래 형식으로만 보고하라.
형식: 결론 1줄 / 근거 2줄 / 확신도(상·중·하). 원문을 통째로 옮기지 마라.\` },
    { role: "user", content: mission },
  ];
  for (let t = 0; t < 4; t++) {
    const res = await chat({ provider: "gemini", messages, tools: [research] });
    if (!res.toolCalls?.length) return res.text ?? "";
    messages.push({ role: "assistant", content: res.text ?? "", toolCalls: res.toolCalls });
    for (const call of res.toolCalls) {
      const r = await research.execute(call.args as any);
      messages.push({ role: "tool", content: JSON.stringify(r), toolCallId: call.id });
    }
  }
  return "(조사 미완 — 시간 초과)";
}

// ── 병렬 스폰: 자식 셋이 각자의 책상에서 동시에 ──
const missions = ["경쟁사 A의 신제품 전략 조사", "경쟁사 B의 가격 정책 조사", "우리 제품군의 최근 리뷰 동향 조사"];
console.time("병렬 조사");
const reports = await Promise.all(missions.map((m) => spawnResearcher(m)));
console.timeEnd("병렬 조사");
reports.forEach((r, i) => console.log(\`\\n📄 조사원\${i + 1} 보고:\\n\${r.slice(0, 150)}\`));

// ── 부모: 요약 3건만 받아 종합 — 부모 책상에는 원문이 단 한 글자도 없다 ──
const parent = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: "너는 전략 보고 에이전트다. 조사원들의 보고만 근거로 종합 판단하라." },
    { role: "user", content: \`조사 보고 3건:\\n\${reports.map((r, i) => \`[\${i + 1}] \${r}\`).join("\\n---\\n")}\\n\\n이번 분기 대응 전략을 3줄로.\` },
  ],
});
console.log("\\n🎯 부모의 종합:\\n", parent.text);
console.log("\\n👉 부모 messages 에 들어간 것은 요약 3건뿐 — 원문(각 수천 자)은 자식 책상과 함께 사라졌다.");
console.log("   이 '요약된 귀환'이 없으면 서브에이전트는 격리가 아니라 그냥 우회다.");`,
      hints: [
        "spawnResearcher 의 시스템 프롬프트가 '보고 형식 계약' — 자식은 부모에게 도구처럼 보여야 하므로 반환 형식을 계약합니다(C2와 동일 원리).",
        "Promise.all 이 안전한 이유: 조사(read)는 서로 간섭이 없어서. write 작업의 병렬은 C6 게이트와 별도 조율이 필요해요.",
        "부모가 원문을 다시 봐야 할 때는? 자식이 '출처 id'를 보고에 포함시키고, 부모가 필요 시 해당 원문만 도구로 재조회 — 전부 들고 있기 vs 필요할 때 가져오기.",
      ],
    },
    {
      type: "markdown",
      source: `## ⚖️ 분신술의 대가 — 언제 쪼개고 언제 말아야 하나

서브에이전트는 공짜가 아닙니다.

| 비용 | 내용 |
|------|------|
| **컨텍스트 상실** | 자식은 부모의 맥락을 모른다 — 임무 문장에 안 담긴 뉘앙스는 증발 |
| **중복 비용** | 자식마다 시스템 프롬프트·도구 정의를 새로 지불 (C4 회계) |
| **전화 게임** | 자식 요약 → 부모 종합, 요약을 요약하며 정보가 왜곡될 수 있음 |

> **쪼개기 좋은 일**: 독립적 조사·검토처럼 서로의 중간 과정을 볼 필요 없는 일, 원문이 크지만 결론은 작은 일.
> **말아야 하는 일**: 단계끼리 맥락을 진하게 공유해야 하는 일(긴 글의 문체 통일 등) — 쪼개면 전화 게임만 남습니다.
>
> 판단 공식: **"자식의 작업 원문이 부모의 다음 판단에 필요한가?"** 아니오 → 쪼개라. 예 → 말아라.

부모-자식 구조(오케스트레이터-워커) 말고도 파이프라인(자식1 출력 → 자식2 입력), 심사위원단(같은 임무를 N명에게 시켜 교차 검증) 등 편성이 다양합니다 — 이 편성술 전체가 **고급2 멀티에이전트**의 주제예요. 오늘은 그 원자 단위(스폰+격리+귀환)를 만든 것.`,
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C7

1. **격리 A/B**: 같은 조사 3건을 ① 단일 에이전트 한 대화 ② 서브에이전트 3분신으로 수행하고, 최종 종합의 품질·총 토큰·소요 시간을 비교하라. 격리의 이득이 숫자로 보이는가?
2. **심사위원단**: 같은 임무를 spawnResearcher 3회에 temperature 를 달리해 시키고, 부모가 '2표 이상 일치한 결론만 채택'하게 하라 — 교차 검증 구조의 원형.
3. **깊이 제한 구현**: spawn 에 depth 인자를 추가해 depth≥2 스폰 요청이 오면 거부하는 가드를 짜라. 왜 '도구로서의 spawn'(모델이 spawn 을 도구로 호출)은 이 가드가 필수인가?

> 🎯 **(전부 잊어도 이것만)**
> ## 서브에이전트 = **새 messages 배열 + 좁은 임무·도구 + 계약된 요약 귀환.** 원문은 자식 책상과 함께 버려라.
> 쪼갤지 판단은 하나 — 자식의 원문이 부모의 판단에 필요한가. 그리고 자식은 부모에게 도구처럼 보인다(형식 계약).

📎 **다음 강 — C8. 살아있는 런타임**: 오래 도는 에이전트는 끊기고, 멈춰지고, 다시 이어져야 합니다. 스트리밍·인터럽트·상태 직렬화와 재개 — 하네스의 런타임 공학입니다.`,
    },
  ],

  quiz: {
    title: "고급1·C7강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "서브에이전트의 본질을 가장 정확히 설명한 것은?",
        options: [
          "더 똑똑한 별도의 모델을 부르는 것",
          "격리된 새 messages 배열에서 좁은 임무를 수행하고, 계약된 요약만 부모에게 돌려주는 것",
          "같은 대화에서 역할극으로 1인 2역을 시키는 것",
        ],
        correctIndex: 1,
        explanation:
          "새 프로세스도 새 모델도 아니고 '새 대화'예요. 격리(부모 이력을 안 줌)와 요약 귀환(원문을 안 돌려줌)이 빠지면 분신술이 아니라 그냥 우회입니다.",
      },
      {
        type: "multiple-choice",
        question: "일을 서브에이전트로 쪼갤지 판단하는 기준은?",
        options: [
          "일이 많으면 무조건 쪼갠다",
          "자식의 작업 원문이 부모의 다음 판단에 필요한가 — 아니오면 쪼개고, 예면 만다",
          "요금이 남으면 쪼갠다",
        ],
        correctIndex: 1,
        explanation:
          "원문이 크고 결론이 작은 독립 작업이 쪼개기의 적지예요. 맥락을 진하게 공유해야 하는 일을 쪼개면 전화 게임(요약의 요약 왜곡)만 남습니다.",
      },
      {
        type: "multiple-choice",
        question: "자식 에이전트에게 부모의 대화 이력을 통째로 넘기면?",
        options: [
          "맥락이 풍부해져 항상 더 좋다",
          "컨텍스트 격리가 무의미해진다 — 책상을 나눈 이유가 사라짐",
          "자식이 부모가 된다",
        ],
        correctIndex: 1,
        explanation:
          "격리의 목적이 '부모 책상을 얇게, 자식 책상은 일회용으로'인데 이력을 다 넘기면 두 책상 다 두꺼워져요. 자식에게는 임무 문장과 필요한 도구만.",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급2 시리즈C(팀 만들기) 01강 — 하네스에서 함대로.
 * 고급1 C7의 spawn을 '모델이 호출하는 도구'로 승격 (agent-as-tool) + 격리 실증.
 */
export const lessonC01: Lesson = {
  id: "ai-eng-a2-c01-spawn-revolution",
  language: "ai-engineering",
  track: "advanced2",
  order: 21,
  title: "C1. 하네스에서 함대로 — spawn() 하나의 혁명",
  subtitle: "서브에이전트를 '도구'로 승격하는 순간, 에이전트가 조직이 된다",
  estimatedMinutes: 45,
  cells: [
    {
      type: "markdown",
      source: `# 🏇 고급2·C1강. 하네스에서 함대로
### — 시리즈 C "팀 만들기" 시작

⏱️ 45분 · 🧰 API 키 · 🗺️ 구현 대상: ① 분업의 원자 단위 · 선수: **고급1 C7(분신술)** 필수

> 💡 고급1 C7에서 여러분은 이미 spawn을 만들었습니다 — **코드가** 자식을 부르는 spawn이었죠.
> 오늘의 혁명은 한 줄입니다: 그 spawn을 **도구 목록에 넣어 모델에게 줍니다.**
> 그 순간 '언제 위임할지'를 코드가 아니라 **에이전트 스스로** 판단하게 돼요.
> 이것이 agent-as-tool — 모든 멀티에이전트 시스템의 원자 단위입니다.

### 이 강에서
- 고급1 C 미니 하네스 복습 → 스타터 킷 (runAgent 하나로 압축)
- spawn을 도구로 승격 — 모델이 위임을 '결정'하는 구조
- 격리 실증: 부모 책상 소모량 측정 (단일 vs 위임)`,
    },
    {
      type: "markdown",
      source: `## 🧬 스타터 킷 — 고급1 C의 유산 한 장

시리즈 C 전체가 사용할 **최소 하네스**를 한 함수로 압축합니다. (고급1 C1~C7을 완주했다면
전부 아는 코드 — 처음이라면 이 함수가 여러분의 스타터 킷입니다.)

핵심 계약 3가지만 기억하세요:
1. \`runAgent(system, mission, tools)\` = **새 책상**(새 messages)에서 임무 수행 후 **텍스트만 반환**
2. 도구는 \`{ name, description, parameters, execute }\` — 고급1 C2의 그 형태
3. 최대 턴 수 가드 내장 — 루프 폭주 방지 (고급1 C1)

> ⚠️ 시리즈 C의 코드는 전부 이 위에 쌓입니다. 각 강의 코드는 독립 실행되도록
> 스타터를 매번 포함하지만, 실제 프로젝트에서는 파일 하나로 두고 import 하세요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 스타터 킷: 미니 하네스 핵심 (고급1 C 압축판) ──
type Tool = { name: string; description: string; parameters: any; execute: (args: any) => Promise<any> };

async function runAgent(system: string, mission: string, tools: Tool[], maxTurns = 5): Promise<string> {
  const messages: any[] = [
    { role: "system", content: system },
    { role: "user", content: mission },
  ];
  for (let t = 0; t < maxTurns; t++) {
    const res = await chat({ provider: "gemini", messages, tools });
    if (!res.toolCalls?.length) return res.text ?? "";
    messages.push({ role: "assistant", content: res.text ?? "", toolCalls: res.toolCalls });
    for (const call of res.toolCalls) {
      const tool = tools.find((x) => x.name === call.name)!;
      const r = await tool.execute(call.args as any);
      messages.push({ role: "tool", content: JSON.stringify(r), toolCallId: call.id });
    }
  }
  return "(최대 턴 도달)";
}

// ── 오늘의 혁명: spawn을 '도구'로 승격 ──
// 조사 도구 (mock — 긴 원문을 시뮬레이션)
const research: Tool = {
  name: "web_research",
  description: "주제를 조사해 원문 발췌를 반환.",
  parameters: { type: "object", properties: { topic: { type: "string" } }, required: ["topic"] },
  execute: async ({ topic }: any) => ({ excerpt: \`[\${topic} 원문] 시장 데이터와 동향 분석... \`.repeat(40) }),
};

// spawn 도구: 모델이 이 도구를 '호출하기로 결정'하면 자식 에이전트가 태어난다
const spawnTool: Tool = {
  name: "delegate_research",
  description: "독립적인 조사 임무를 전담 조사원(서브에이전트)에게 위임한다. 넓은 조사에 사용. 요약 보고만 돌아온다.",
  parameters: { type: "object", properties: { mission: { type: "string", description: "조사원에게 줄 완결된 임무 문장 (조사원은 이 대화를 모른다)" } }, required: ["mission"] },
  execute: async ({ mission }: any) => {
    const report = await runAgent(
      "너는 조사 전담원이다. 형식: 결론 1줄 / 근거 2줄 / 확신도(상·중·하). 원문 복사 금지.",
      mission,
      [research],
    );
    return { report }; // 부모에게는 이 요약만 — 자식 책상(원문 수천 자)은 여기서 소멸
  },
};

// ── 오케스트레이터: 위임 여부를 스스로 판단하는 에이전트 ──
const answer = await runAgent(
  \`너는 전략 분석 오케스트레이터다.
- 넓은 조사가 필요하면 delegate_research 로 위임하라 (독립 주제면 여러 번 호출 가능)
- 간단한 판단은 직접 하라 — 위임에도 비용이 있다
- 최종 답은 보고들을 종합한 3줄 전략\`,
  "경쟁사 A의 신제품 전략과 우리 제품 리뷰 동향을 비교해서 대응 방향을 제안해줘.",
  [spawnTool],
);
console.log("🎯 오케스트레이터의 최종 답:\\n", answer);
console.log("\\n👉 '조사 2건을 위임하자'는 판단을 코드가 아니라 모델이 내렸다 — 이게 agent-as-tool.");`,
      hints: [
        "spawnTool의 description이 오케스트레이터의 '위임 감각'을 결정합니다 — '넓은 조사에 사용', '요약만 돌아온다'가 모델의 판단 재료예요. 도구 설계 = 조직 설계의 시작.",
        "parameters의 mission 설명에 '조사원은 이 대화를 모른다'를 박은 이유: 모델이 위임 문장을 쓸 때 맥락을 담게 유도 — B2 직무기술서의 코드 버전입니다.",
        "runAgent를 재사용해 자식을 만든 것에 주목 — 자식은 특별한 존재가 아니라 '같은 하네스의 새 인스턴스'예요.",
      ],
    },
    {
      type: "markdown",
      source: `## ⚖️ 코드 위임 vs 모델 위임 — 언제 무엇을

고급1 C7(코드가 spawn 호출)과 오늘(모델이 spawn 호출)은 **둘 다 옳습니다.** 쓰임이 달라요.

| | 코드 위임 (C7) | 모델 위임 (오늘) |
|------|---------------|-----------------|
| 흐름 결정자 | 개발자 (결정적) | 에이전트 (동적) |
| 어울리는 일 | 흐름이 뻔한 정형 작업 | 해봐야 아는 탐구 작업 |
| 예측 가능성 | 높음 — 항상 같은 편성 | 낮음 — 위임 여부가 실행마다 다를 수 있음 |
| 위험 | 유연성 부족 | **위임 폭주** (가드 필수 — C4에서) |

이 구분은 C3(결정적 패턴)과 C4(동적 슈퍼바이저)에서 각각 깊게 팝니다.
A3의 언어로: 코드 위임은 **파이프라인·병렬**의 재료, 모델 위임은 **슈퍼바이저**의 재료.

## 📏 격리의 이득을 숫자로 — 책상 회계

멀티에이전트의 근본 이유(A1 컨텍스트 물리학)를 **측정**으로 확인합시다.
단일 에이전트가 조사 2건을 직접 하면 부모 messages에 원문 2건이 전부 쌓입니다.
위임 구조에서는? **요약 2건만.** 대략적인 문자 수로 비교해도 수십 배 차이가 나요.
다음 강들에서 이 회계를 트레이서(C6)로 자동화합니다 — 오늘은 감각만.`,
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C1

1. **위임 판단 관찰**: 오케스트레이터 지시에서 '위임에도 비용이 있다' 줄을 지우고 재실행하라. 사소한 질문까지 위임하기 시작하는가? 지시 한 줄이 조직 문화를 바꾸는 순간.
2. **격리 회계**: runAgent에 messages 총 문자 수를 반환하게 개조하고, 같은 과제를 ①직접 조사 ②위임으로 수행해 부모 책상 소모량을 숫자로 비교하라.
3. **위임 문장 품질**: 오케스트레이터가 쓴 mission 문장들을 수집해 B2의 3요소(역할·범위·산출물)로 채점하라. 모델의 직무기술서 작성 실력은 몇 점인가?

> 🎯 **(전부 잊어도 이것만)**
> ## agent-as-tool — **spawn을 도구로 승격하면 위임 판단이 모델에게 넘어간다.** 자식은 같은 하네스의 새 인스턴스(새 책상)이고, 부모에게는 요약만 귀환한다.
> 코드 위임(결정적)과 모델 위임(동적)은 용도가 다르다 — 이 구분이 시리즈 C 전체의 뼈대다.

📎 **다음 강 — C2. 역할의 코드화**: 지금은 조사원 하나뿐이지만, 실전 팀에는 reader·writer·critic이 필요합니다. 역할 = {지침, 도구 화이트리스트, 모델 티어}를 선언적 파일로 정의하는 레지스트리를 만듭니다.`,
    },
  ],

  quiz: {
    title: "고급2·C1강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "고급1 C7의 spawn과 오늘의 spawnTool의 결정적 차이는?",
        options: [
          "오늘 것이 더 비싼 모델을 쓴다",
          "C7은 코드가 위임을 결정했고, 오늘은 모델이 도구 호출로 위임을 결정한다",
          "C7의 자식은 격리되지 않았다",
        ],
        correctIndex: 1,
        explanation:
          "spawn을 도구 목록에 넣는 순간 '언제 위임할지'가 모델의 판단이 됩니다. 코드 위임은 결정적 패턴(C3), 모델 위임은 동적 슈퍼바이저(C4)의 재료예요.",
      },
      {
        type: "multiple-choice",
        question: "spawnTool의 description에 '요약 보고만 돌아온다'를 쓴 이유는?",
        options: [
          "법적 고지 의무 때문",
          "도구 설명이 오케스트레이터의 위임 판단 재료가 되기 때문 — 도구 설계가 곧 조직 설계",
          "설명이 길수록 도구가 빨라지기 때문",
        ],
        correctIndex: 1,
        explanation:
          "모델은 도구의 description을 읽고 언제 쓸지 결정해요. '넓은 조사에 사용', '요약만 귀환' 같은 문구가 모델의 위임 감각을 만듭니다.",
      },
      {
        type: "multiple-choice",
        question: "위임 구조에서 부모의 책상(messages)에 남는 것은?",
        options: [
          "자식이 조사한 원문 전체",
          "자식의 요약 보고만 — 원문은 자식 책상과 함께 소멸",
          "자식의 시스템 프롬프트",
        ],
        correctIndex: 1,
        explanation:
          "격리된 컨텍스트 + 요약된 귀환이 서브에이전트의 전부예요. 이 덕분에 부모 책상이 얇게 유지됩니다 — A1 컨텍스트 물리학의 코드 증명.",
      },
    ],
  } satisfies Quiz,
};

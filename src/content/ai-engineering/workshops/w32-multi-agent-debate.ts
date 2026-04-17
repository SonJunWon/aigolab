import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W32 — AI 멀티 에이전트 토론방.
 *
 * Part A: 찬성·반대·중립 AI 3명이 자동으로 토론 (LLM 셀)
 * Part B: MD 레시피로 React+TS+Vite+Tailwind 채팅 UI 토론 앱 완성
 */
export const workshopW32: Lesson = {
  id: "ai-eng-w32-multi-agent-debate",
  language: "ai-engineering",
  track: "beginner",
  order: 132,
  title: "W32: AI 멀티 에이전트 토론방",
  subtitle: "찬성·반대·중립 AI 3명이 자동으로 토론하고 결론 도출",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 🗣️ AI 멀티 에이전트 토론방 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**3명의 AI ==에이전트==가 주어진 주제에 대해 자동으로 토론하고, 최종 종합 보고서를 만드는 앱** — 찬성(🔵), 반대(🔴), 중립(🟡) 역할의 AI 가 라운드마다 서로의 발언에 반응하며 토론을 이어갑니다.

### 완성 모습
\`\`\`
┌─ AI Multi-Agent Debate ─────────────────────────────────────┐
│  🗣️ AI 토론방    [📋 히스토리]  [📤 내보내기]  🌙 다크      │
├─────────────────────────────────────────────────────────────┤
│  📝 토론 주제                                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ AI 가 인간의 일자리를 대체해야 하는가?                │    │
│  └─────────────────────────────────────────────────────┘    │
│  라운드: [3 ▼]    [▶️ 토론 시작]                             │
│                                                             │
│  ─── 라운드 1/3 ──────────────────────────────────────────  │
│                                                             │
│  🔵 찬성 (Alex)                                  라운드 1   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ AI 자동화는 반복적이고 위험한 업무에서 인간을 해방   │    │
│  │ 시키고, 더 창의적인 일에 집중하게 합니다. 역사적     │    │
│  │ 으로 기술 혁신은 항상 새로운 일자리를 만들었습니다.  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  🔴 반대 (Bella)                                 라운드 1   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 하지만 이번 AI 혁명은 과거 자동화와 다릅니다.       │    │
│  │ 인지 노동까지 대체되면 '새 일자리'가 충분히 만들어  │    │
│  │ 질 거란 보장이 없습니다. 전환 비용도 막대하고요.    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  🟡 중립 (Charlie)                               라운드 1   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 양측 모두 타당합니다. 핵심은 '대체'가 아닌 '보완'   │    │
│  │ 프레임으로 전환하는 것입니다. 기술 진보의 방향성보다 │    │
│  │ 전환 속도와 사회 안전망이 더 중요한 변수입니다.      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ─── 라운드 2/3 ──────────────────────────────────────────  │
│  ...                                                        │
│                                                             │
│  ─── 📊 종합 보고서 ─────────────────────────────────────── │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ■ 주요 찬성 논거: ...                                │    │
│  │ ■ 주요 반대 논거: ...                                │    │
│  │ ■ 합의 가능 영역: ...                                │    │
│  │ ■ 핵심 쟁점: ...                                     │    │
│  │ ■ 권고 사항: ...                                     │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  🗂️ 과거 토론: [AI 일자리] [원격근무] [기본소득] [+새 토론]  │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 단일 관점 주장 + 멀티턴 토론 + 종합 결론 | 60분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 React 채팅 UI 토론 앱 완성 | 90분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)
> - ==멀티 에이전트== 패턴 — AI 가 여러 역할을 맡아 협업하는 구조. 이 워크샵에서 직접 만들어요!`,
    },

    // ─── Part A: 멀티 에이전트 토론 엔진 ───
    {
      type: "markdown",
      source: `## Part A: 멀티 에이전트 토론 엔진 만들기 (60분)

==멀티 에이전트== 시스템의 핵심은 **각 AI 에게 고유한 역할과 성격을 부여**하고, 서로의 발언에 반응하도록 대화 맥락을 관리하는 것이에요.

핵심 개념 3가지:
1. **단일 관점 ==에이전트==** — 주어진 입장에서 논리적 주장을 생성
2. **멀티턴 토론** — 이전 발언을 참조해 반박·보완·중재하는 라운드 기반 대화
3. **종합 분석** — 전체 토론 내용을 분석해 보고서 생성

> 📌 **==멀티 에이전트== 란?** — 여러 AI 가 각자 다른 역할(persona)을 맡아 협업하거나 경쟁하는 구조. 하나의 LLM 에게 다른 ==시스템 프롬프트==를 주면, 마치 서로 다른 '사람'처럼 행동합니다. OpenAI Agents, CrewAI, AutoGen 같은 프레임워크가 이 패턴을 사용해요.`,
    },

    {
      type: "markdown",
      source: `### A-1. 단일 관점 에이전트 — 입장에 따른 주장 생성

하나의 AI 에게 "찬성", "반대", "중립" 중 하나의 역할을 부여하고, 해당 입장에서 설득력 있는 주장을 만들게 합니다. 같은 LLM 이지만 ==시스템 프롬프트==를 바꾸면 완전히 다른 관점의 답변이 나와요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 단일 관점 에이전트 — 역할별 시스템 프롬프트로 다른 관점 생성
const topic = "AI 가 초·중·고 교육에서 교사를 대체해야 하는가?";

const agents = [
  {
    name: "Alex",
    role: "찬성",
    emoji: "🔵",
    system: \`너는 토론에서 '찬성' 입장을 맡은 논객 Alex 야.
주어진 주제에 대해 강력한 찬성 논거를 제시해.

[규칙]
- 데이터, 사례, 논리적 근거를 활용해 설득력 있게 주장
- 200자 이내로 핵심만 전달
- 한국어로 응답
- 반드시 찬성 입장만 취해\`,
  },
  {
    name: "Bella",
    role: "반대",
    emoji: "🔴",
    system: \`너는 토론에서 '반대' 입장을 맡은 논객 Bella 야.
주어진 주제에 대해 강력한 반대 논거를 제시해.

[규칙]
- 위험성, 한계, 대안을 중심으로 반박
- 200자 이내로 핵심만 전달
- 한국어로 응답
- 반드시 반대 입장만 취해\`,
  },
  {
    name: "Charlie",
    role: "중립",
    emoji: "🟡",
    system: \`너는 토론에서 '중립 분석가' 역할을 맡은 Charlie 야.
찬성과 반대 양쪽 논거를 객관적으로 분석하고 균형 잡힌 시각을 제시해.

[규칙]
- 양측의 타당한 점과 한계를 모두 인정
- 제3의 관점이나 절충안 제시
- 200자 이내로 핵심만 전달
- 한국어로 응답\`,
  },
];

console.log("🗣️ 멀티 에이전트 단일 관점 생성");
console.log("═".repeat(50));
console.log("📝 주제:", topic);
console.log("");

for (const agent of agents) {
  const res = await chat({
    provider: "gemini",
    messages: [
      { role: "system", content: agent.system },
      { role: "user", content: \`다음 주제에 대해 \${agent.role} 입장에서 주장을 펼쳐줘:\\n\\n\${topic}\` },
    ],
  });

  console.log(\`\${agent.emoji} \${agent.name} (\${agent.role})\`);
  console.log("─".repeat(40));
  console.log(res.text);
  console.log("");
}

console.log("✅ 3개 에이전트 모두 고유한 관점에서 주장을 생성했습니다.");
console.log("💡 같은 LLM 이지만 시스템 프롬프트만 바꿔도 전혀 다른 주장이 나와요!");`,
      hints: [
        "핵심: 같은 AI 모델이지만 시스템 프롬프트(역할 지시)를 바꾸면 완전히 다른 관점을 생성해요.",
        "실무에서는 agent 마다 temperature 를 다르게 설정해 '공격적 논객 vs 신중한 분석가' 느낌을 줄 수 있어요.",
        "200자 제한은 토론이 장황해지지 않도록 하는 장치 — 실제 앱에서는 사용자가 조절할 수 있게 만들면 좋아요.",
        "for...of + await 로 순서대로 실행 — 3명이 동시에 말하면 맥락이 꼬이니까요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 멀티턴 토론 시뮬레이션 — 라운드 기반 자동 토론

이제 핵심입니다! 3명의 ==에이전트==가 **이전 라운드의 모든 발언을 읽고** 거기에 반응하면서 토론을 이어갑니다. 라운드가 진행될수록 논점이 깊어지고 구체적인 근거가 쌓여요. 이것이 ==멀티 에이전트== 패턴의 진짜 힘입니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 멀티턴 토론 시뮬레이션 — 라운드 기반, 이전 발언 참조
const topic = "모든 소프트웨어 개발자가 AI 코딩 도구를 의무적으로 사용해야 하는가?";
const totalRounds = 3;

interface DebateMessage {
  round: number;
  agent: string;
  role: string;
  emoji: string;
  content: string;
}

const history: DebateMessage[] = [];

const agents = [
  {
    name: "Alex", role: "찬성", emoji: "🔵",
    system: \`너는 토론 찬성 논객 Alex. 주제에 대해 찬성 입장을 고수하되, 다른 참여자의 발언에 구체적으로 반응해.
반박이 있으면 재반박하고, 타당한 지적은 일부 인정하되 여전히 찬성 논거를 강화해.
150자 이내. 한국어.\`,
  },
  {
    name: "Bella", role: "반대", emoji: "🔴",
    system: \`너는 토론 반대 논객 Bella. 주제에 대해 반대 입장을 고수하되, 다른 참여자의 발언에 구체적으로 반응해.
찬성 측 주장의 약점을 정확히 짚고, 대안이나 반례를 제시해.
150자 이내. 한국어.\`,
  },
  {
    name: "Charlie", role: "중립", emoji: "🟡",
    system: \`너는 중립 분석가 Charlie. 찬성·반대 양측 발언을 분석하고 균형 잡힌 정리를 해줘.
논쟁이 빠뜨린 관점을 보완하고, 합의 가능한 영역을 찾아.
150자 이내. 한국어.\`,
  },
];

console.log("🗣️ 멀티턴 토론 시뮬레이션");
console.log("═".repeat(55));
console.log("📝 주제:", topic);
console.log("🔄 라운드:", totalRounds);

for (let round = 1; round <= totalRounds; round++) {
  console.log(\`\\n─── 라운드 \${round}/\${totalRounds} \${"─".repeat(40)}\`);

  for (const agent of agents) {
    // 이전 발언 기록을 컨텍스트로 구성
    const previousContext = history.length > 0
      ? history.map(m =>
          \`[\${m.emoji} \${m.agent} (라운드 \${m.round})]: \${m.content}\`
        ).join("\\n")
      : "(첫 발언입니다)";

    const res = await chat({
      provider: "gemini",
      messages: [
        { role: "system", content: agent.system },
        {
          role: "user",
          content: \`토론 주제: \${topic}

지금까지의 토론 내용:
\${previousContext}

현재 라운드 \${round}. 이전 발언들을 참고해서 \${agent.role} 입장에서 발언해줘.\`,
        },
      ],
    });

    const message: DebateMessage = {
      round,
      agent: agent.name,
      role: agent.role,
      emoji: agent.emoji,
      content: res.text,
    };
    history.push(message);

    console.log(\`\\n\${agent.emoji} \${agent.name} (\${agent.role}) — 라운드 \${round}\`);
    console.log(res.text);
  }
}

console.log("\\n" + "═".repeat(55));
console.log(\`✅ \${totalRounds}라운드 토론 완료! 총 \${history.length}개 발언\`);
console.log("💡 라운드가 진행될수록 서로의 주장을 반박·보완하며 논점이 깊어졌어요!");`,
      hints: [
        "핵심: history 배열에 모든 발언을 쌓고, 매 발언마다 전체 기록을 시스템 프롬프트와 함께 넘겨요.",
        "이전 발언을 '컨텍스트'로 넘기는 게 멀티 에이전트 패턴의 핵심 — 대화 흐름이 자연스러워져요.",
        "라운드 수를 늘리면 논점이 깊어지지만, 토큰 비용도 증가합니다. 실무에서는 3~5라운드가 적당해요.",
        "for...of 순서가 중요 — 찬성이 먼저 말하고, 반대가 반박하고, 중립이 정리하는 흐름이에요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 종합 보고서 생성 — 토론 전체를 분석·요약

토론이 끝나면 새로운 ==에이전트== (분석가)가 전체 대화를 읽고 **주요 논거, 합의점, 미해결 쟁점, 권고사항** 을 정리합니다. 이것이 ==멀티 에이전트== 시스템의 산출물이에요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 종합 보고서 생성 — 토론 전체 분석 + 구조화된 보고서
const topic = "원격 근무를 모든 기업에 의무화해야 하는가?";

// 시뮬레이션용 토론 기록 (실제 앱에서는 A-2 의 history 를 사용)
const debateLog = [
  { round: 1, agent: "Alex", role: "찬성", emoji: "🔵",
    content: "원격근무는 출퇴근 시간 절약, 글로벌 인재 확보, 탄소 배출 감소 등 다수의 이점이 있습니다. 팬데믹 기간 생산성이 오히려 향상된 연구 결과도 많습니다." },
  { round: 1, agent: "Bella", role: "반대", emoji: "🔴",
    content: "제조업, 의료, 서비스업 등 현장 근무가 필수인 직종이 전체 일자리의 60% 이상입니다. '모든 기업'에 의무화하는 것은 현실을 무시한 정책입니다." },
  { round: 1, agent: "Charlie", role: "중립", emoji: "🟡",
    content: "원격근무 가능 직종과 불가능 직종의 구분이 선행되어야 합니다. '의무화'보다 '선택권 보장'이 더 현실적인 프레임일 수 있습니다." },
  { round: 2, agent: "Alex", role: "찬성", emoji: "🔵",
    content: "Bella 의 지적에 동의하지만, 의무화 대상을 '원격근무 가능 직종'으로 한정하면 됩니다. 가능함에도 출근을 강제하는 기업이 문제입니다." },
  { round: 2, agent: "Bella", role: "반대", emoji: "🔴",
    content: "직종 구분이 명확하지 않습니다. 개발자도 하드웨어 테스트가 필요하고, 디자이너도 실물 시제품 확인이 필요합니다. 정부가 일률적으로 규정하기 어렵습니다." },
  { round: 2, agent: "Charlie", role: "중립", emoji: "🟡",
    content: "핵심 쟁점이 좁혀졌습니다: ① 원격근무 가능 여부의 판단 주체(정부 vs 기업), ② 의무화 vs 선택권 보장의 정책 수단 차이. 이 두 축을 분리해서 논의해야 합니다." },
];

const synthesisPrompt = \`너는 토론 분석 전문가야. 전체 토론 기록을 분석해서 구조화된 종합 보고서를 JSON 으로 작성해.

[보고서 형식]
{
  "topic": "토론 주제",
  "totalRounds": 숫자,
  "proArguments": ["찬성 측 주요 논거 1", "논거 2", ...],
  "conArguments": ["반대 측 주요 논거 1", "논거 2", ...],
  "agreements": ["양측이 합의한 영역 1", ...],
  "disputes": ["미해결 쟁점 1", ...],
  "keyInsights": ["토론에서 도출된 핵심 통찰 1", ...],
  "recommendations": ["권고 사항 1", ...],
  "qualityScore": {
    "depthOfArguments": 1~10,
    "responseToOpponents": 1~10,
    "evidenceUsage": 1~10
  }
}

한국어로 작성. JSON 만 응답해.\`;

const debateText = debateLog
  .map(m => \`[라운드 \${m.round}] \${m.emoji} \${m.agent} (\${m.role}): \${m.content}\`)
  .join("\\n");

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: synthesisPrompt },
    { role: "user", content: \`다음 토론 기록을 분석해서 종합 보고서를 작성해줘:\\n\\n\${debateText}\` },
  ],
});

try {
  const report = JSON.parse(res.text);
  console.log("📊 토론 종합 보고서");
  console.log("═".repeat(55));
  console.log("📝 주제:", report.topic);
  console.log("🔄 총 라운드:", report.totalRounds);

  console.log("\\n🔵 찬성 측 주요 논거:");
  report.proArguments?.forEach((a: string, i: number) =>
    console.log(\`  \${i + 1}. \${a}\`)
  );

  console.log("\\n🔴 반대 측 주요 논거:");
  report.conArguments?.forEach((a: string, i: number) =>
    console.log(\`  \${i + 1}. \${a}\`)
  );

  console.log("\\n🤝 합의 영역:");
  report.agreements?.forEach((a: string, i: number) =>
    console.log(\`  \${i + 1}. \${a}\`)
  );

  console.log("\\n⚡ 미해결 쟁점:");
  report.disputes?.forEach((d: string, i: number) =>
    console.log(\`  \${i + 1}. \${d}\`)
  );

  console.log("\\n💡 핵심 통찰:");
  report.keyInsights?.forEach((k: string, i: number) =>
    console.log(\`  \${i + 1}. \${k}\`)
  );

  console.log("\\n📋 권고 사항:");
  report.recommendations?.forEach((r: string, i: number) =>
    console.log(\`  \${i + 1}. \${r}\`)
  );

  if (report.qualityScore) {
    console.log("\\n📈 토론 품질 평가:");
    console.log(\`  논증 깊이:    \${"★".repeat(report.qualityScore.depthOfArguments)}\${"☆".repeat(10 - report.qualityScore.depthOfArguments)} \${report.qualityScore.depthOfArguments}/10\`);
    console.log(\`  상대 반응:    \${"★".repeat(report.qualityScore.responseToOpponents)}\${"☆".repeat(10 - report.qualityScore.responseToOpponents)} \${report.qualityScore.responseToOpponents}/10\`);
    console.log(\`  근거 활용:    \${"★".repeat(report.qualityScore.evidenceUsage)}\${"☆".repeat(10 - report.qualityScore.evidenceUsage)} \${report.qualityScore.evidenceUsage}/10\`);
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 토론이 끝난 후 '제4의 에이전트'가 전체 기록을 분석해 보고서를 만들어요.",
        "qualityScore 로 토론 품질을 정량화하면, '라운드를 더 해야 할지' 판단할 수 있어요.",
        "실무에서는 보고서를 Markdown 이나 PDF 로 내보내기(export) 기능을 붙이면 완성도가 높아요.",
        "agreements (합의 영역) 이 비어 있으면 토론이 평행선 — 라운드를 추가하거나 주제를 좁혀야 해요.",
      ],
    },

    // ─── Part B: 풀스택 토론 앱 (MD 레시피) ───
    {
      type: "markdown",
      source: `## Part B: AI 토론방 앱 만들기 (90분)

이제 Part A 에서 만든 토론 엔진을 **채팅 UI 앱** 으로 옮깁니다. 3명의 ==에이전트==가 말풍선으로 대화하고, 라운드 카운터가 돌아가고, 토론이 끝나면 종합 보고서가 표시되는 완전한 멀티 에이전트 토론 앱이에요.

> 📋 아래 MD 레시피를 **Claude Code** 나 **Cursor** 에 통째로 붙여넣으면, AI 가 프로젝트를 생성해줍니다.

---

### 프로젝트 셋업

\`\`\`bash
npm create vite@latest ai-debate-arena -- --template react-ts
cd ai-debate-arena
npm install
npm install @google/genai
npm install -D tailwindcss @tailwindcss/vite
\`\`\`

\`\`\`
ai-debate-arena/
├── src/
│   ├── components/
│   │   ├── TopicInput.tsx          # 토론 주제 입력 + 라운드 설정
│   │   ├── DebateArena.tsx         # 메인 토론 영역 (채팅 UI)
│   │   ├── AgentBubble.tsx         # 에이전트별 말풍선 컴포넌트
│   │   ├── RoundDivider.tsx        # 라운드 구분선
│   │   ├── SynthesisReport.tsx     # 종합 보고서 카드
│   │   ├── DebateHistory.tsx       # 과거 토론 목록
│   │   ├── ExportButton.tsx        # 대화록 내보내기 (TXT/JSON)
│   │   └── ThemeToggle.tsx         # 다크/라이트 모드 토글
│   ├── hooks/
│   │   ├── useDebate.ts            # 토론 상태 관리 (주제, 라운드, 메시지)
│   │   └── useDebateHistory.ts     # localStorage 토론 기록 관리
│   ├── lib/
│   │   ├── agents.ts               # 3 에이전트 정의 (이름, 역할, 시스템 프롬프트)
│   │   ├── debate-engine.ts        # 라운드 진행 + 종합 보고서 생성 로직
│   │   └── ai.ts                   # Gemini API 래퍼
│   ├── types/
│   │   └── debate.ts               # 토론 관련 타입 정의
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── package.json
\`\`\`

---

### 핵심 타입 정의

\`\`\`typescript
// src/types/debate.ts
export type AgentRole = "pro" | "con" | "neutral";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  emoji: string;              // 🔵 🔴 🟡
  color: string;              // Tailwind 색상 (blue, red, yellow)
  avatar: string;             // 아바타 이모지 (🧑‍💼 👩‍⚖️ 🧑‍🔬)
  systemPrompt: string;
}

export interface DebateMessage {
  id: string;
  round: number;
  agentId: string;
  agentName: string;
  role: AgentRole;
  emoji: string;
  content: string;
  timestamp: string;
}

export interface SynthesisReport {
  topic: string;
  totalRounds: number;
  proArguments: string[];
  conArguments: string[];
  agreements: string[];
  disputes: string[];
  keyInsights: string[];
  recommendations: string[];
  qualityScore: {
    depthOfArguments: number;
    responseToOpponents: number;
    evidenceUsage: number;
  };
}

export interface DebateSession {
  id: string;
  topic: string;
  rounds: number;
  messages: DebateMessage[];
  report?: SynthesisReport;
  createdAt: string;
  status: "in-progress" | "completed";
}
\`\`\`

---

### 핵심 구현 가이드

#### 1. 에이전트 정의 — 3명의 토론 참가자

\`\`\`typescript
// src/lib/agents.ts
import type { Agent } from "../types/debate";

export const debateAgents: Agent[] = [
  {
    id: "pro",
    name: "Alex",
    role: "pro",
    emoji: "🔵",
    color: "blue",
    avatar: "🧑‍💼",
    systemPrompt: \`너는 토론에서 '찬성' 입장을 맡은 논객 Alex 야.
주어진 주제에 대해 찬성 논거를 제시하고, 반대 의견에 구체적으로 반박해.
[규칙]
- 데이터, 사례, 논리적 근거를 활용
- 다른 참여자 발언에 직접 반응 (이름 언급)
- 200자 이내
- 한국어\`,
  },
  {
    id: "con",
    name: "Bella",
    role: "con",
    emoji: "🔴",
    color: "red",
    avatar: "👩‍⚖️",
    systemPrompt: \`너는 토론에서 '반대' 입장을 맡은 논객 Bella 야.
주어진 주제에 대해 반대 논거를 제시하고, 찬성 의견의 약점을 짚어.
[규칙]
- 위험성, 한계, 대안 중심
- 다른 참여자 발언에 직접 반응 (이름 언급)
- 200자 이내
- 한국어\`,
  },
  {
    id: "neutral",
    name: "Charlie",
    role: "neutral",
    emoji: "🟡",
    color: "yellow",
    avatar: "🧑‍🔬",
    systemPrompt: \`너는 토론에서 '중립 분석가' 역할을 맡은 Charlie 야.
양측 논거를 분석하고 균형 잡힌 시각을 제시해.
[규칙]
- 양측 타당한 점과 한계 모두 인정
- 빠뜨린 관점 보완, 합의 영역 탐색
- 200자 이내
- 한국어\`,
  },
];
\`\`\`

#### 2. 토론 엔진 — 라운드 진행 + 종합 보고서

\`\`\`typescript
// src/lib/debate-engine.ts
import { callGemini } from "./ai";
import { debateAgents } from "./agents";
import type { DebateMessage, SynthesisReport } from "../types/debate";

// 한 라운드 실행: 3명이 순서대로 발언
export async function runRound(
  topic: string,
  round: number,
  history: DebateMessage[],
  onMessage: (msg: DebateMessage) => void
): Promise<DebateMessage[]> {
  const roundMessages: DebateMessage[] = [];

  for (const agent of debateAgents) {
    const context = history.length > 0
      ? history.map(m =>
          \`[\${m.emoji} \${m.agentName} (라운드 \${m.round})]: \${m.content}\`
        ).join("\\n")
      : "(첫 발언입니다)";

    const content = await callGemini(
      agent.systemPrompt,
      \`토론 주제: \${topic}\\n\\n지금까지:\\n\${context}\\n\\n라운드 \${round}. \${agent.role} 입장에서 발언해줘.\`
    );

    const msg: DebateMessage = {
      id: crypto.randomUUID(),
      round,
      agentId: agent.id,
      agentName: agent.name,
      role: agent.role,
      emoji: agent.emoji,
      content,
      timestamp: new Date().toISOString(),
    };

    roundMessages.push(msg);
    onMessage(msg);  // 실시간 UI 업데이트
  }

  return roundMessages;
}

// 종합 보고서 생성
export async function generateSynthesis(
  topic: string,
  messages: DebateMessage[]
): Promise<SynthesisReport> {
  const log = messages
    .map(m => \`[라운드 \${m.round}] \${m.emoji} \${m.agentName}: \${m.content}\`)
    .join("\\n");

  const result = await callGemini(
    \`토론 분석 전문가. 전체 토론을 분석해 JSON 보고서를 작성해.
형식: { topic, totalRounds, proArguments[], conArguments[],
agreements[], disputes[], keyInsights[], recommendations[],
qualityScore: { depthOfArguments, responseToOpponents, evidenceUsage } }
각 점수 1~10. 한국어. JSON 만 응답.\`,
    \`토론 기록:\\n\${log}\`
  );

  return JSON.parse(result);
}
\`\`\`

#### 3. Gemini API 래퍼

\`\`\`typescript
// src/lib/ai.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

export async function callGemini(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: \`\${systemPrompt}\\n\\n\${userMessage}\`,
    config: { maxOutputTokens: 500, temperature: 0.7 },
  });
  return response.text ?? "";
}
\`\`\`

#### 4. 말풍선 컴포넌트 — 에이전트별 색상·아바타

\`\`\`typescript
// src/components/AgentBubble.tsx
const roleColors = {
  pro:     "bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700",
  con:     "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700",
  neutral: "bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700",
};

const roleAvatars = { pro: "🧑‍💼", con: "👩‍⚖️", neutral: "🧑‍🔬" };

// props: { message: DebateMessage }
// 에이전트별 색상 배경 + 아바타 + 이름 + 라운드 뱃지 + 내용
\`\`\`

#### 5. 토론 상태 관리 훅

\`\`\`typescript
// src/hooks/useDebate.ts — useState 기반 간단 관리
// state: topic, totalRounds, currentRound, messages[], report, isRunning
//
// startDebate(): 라운드 1~N 순회, 매 메시지마다 messages 에 추가
// stopDebate(): isRunning = false 로 중단
// generateReport(): 종합 보고서 호출
\`\`\`

#### 6. 대화록 내보내기

\`\`\`typescript
// src/components/ExportButton.tsx
function exportAsText(session: DebateSession) {
  const lines = [
    \`토론 주제: \${session.topic}\`,
    \`일시: \${session.createdAt}\`,
    "",
    ...session.messages.map(m =>
      \`[라운드 \${m.round}] \${m.emoji} \${m.agentName} (\${m.role}):\\n\${m.content}\\n\`
    ),
  ];
  if (session.report) {
    lines.push("=== 종합 보고서 ===");
    lines.push(\`찬성 논거: \${session.report.proArguments.join(", ")}\`);
    lines.push(\`반대 논거: \${session.report.conArguments.join(", ")}\`);
    lines.push(\`합의 영역: \${session.report.agreements.join(", ")}\`);
  }
  const blob = new Blob([lines.join("\\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  // a 태그 생성 → click → revoke
}
\`\`\`

#### 7. localStorage 토론 기록

\`\`\`typescript
// src/hooks/useDebateHistory.ts
const KEY = "ai-debate-sessions";

export function useDebateHistory() {
  // loadAll(): DebateSession[]
  // save(session): 저장/업데이트
  // remove(id): 삭제
  // localStorage.getItem / setItem
}
\`\`\`

---

### 주요 기능 체크리스트

#### 토론 UI
- [ ] 토론 주제 텍스트 입력
- [ ] 라운드 수 설정 (1~10)
- [ ] ▶️ 토론 시작 / ⏹️ 중단 버튼
- [ ] 에이전트별 색상 말풍선 (파란/빨간/노란)
- [ ] 에이전트 아바타 + 이름 + 역할 뱃지
- [ ] 라운드 구분선 (─── 라운드 N ───)
- [ ] 실시간 메시지 추가 (스크롤 자동 하단)
- [ ] 라운드 카운터 표시 (현재/전체)

#### 종합 보고서
- [ ] 토론 완료 후 📊 종합 보고서 카드 표시
- [ ] 찬성/반대 논거, 합의점, 쟁점, 권고사항
- [ ] 토론 품질 점수 (별점 시각화)

#### 기록·내보내기
- [ ] 토론 세션 localStorage 자동 저장
- [ ] 과거 토론 목록 사이드바
- [ ] TXT / JSON 대화록 내보내기

#### 다크/라이트 모드
- [ ] 토글 버튼으로 다크/라이트 전환
- [ ] 에이전트 말풍선 색상도 모드에 맞게 변경`,
    },

    {
      type: "markdown",
      source: `### 🏆 도전 과제 — 더 스마트한 토론 시스템으로

기본 기능이 완성됐다면, 다음 기능을 추가해 보세요!

### 레벨 1 — 기본 확장
- **에이전트 커스텀**: 사용자가 에이전트 이름·성격·입장을 직접 설정
- **토론 속도 조절**: 발언 간 딜레이를 조절해서 '실시간 느낌' 연출
- **반응 이모지**: 각 발언에 👍👎🤔 반응 버튼 추가

### 레벨 2 — 중급 도전
- **4인 토론**: 사회자(moderator) ==에이전트== 추가 — 논점 정리·질문·시간 관리
- **팩트체크 에이전트**: 발언에 포함된 주장을 실시간으로 검증하는 별도 AI
- **투표 시스템**: 각 라운드 후 "이번 라운드 MVP" 투표 (사용자 또는 AI 심사)
- **토론 시각화**: 논점 흐름을 마인드맵이나 타임라인 차트로 표현

### 레벨 3 — 프로 도전
- **음성 토론**: Web Speech API 로 에이전트 발언을 TTS 로 읽어주기
- **실시간 청중 참여**: WebSocket 으로 여러 사용자가 동시에 토론 관전·질문
- **자동 주제 추천**: 트렌딩 뉴스 API 연동으로 '오늘의 토론 주제' 자동 생성
- **토론 리플레이**: 저장된 토론을 타이핑 애니메이션으로 재생

---

## 🎉 W32 완료!

이번 워크샵에서 배운 것:
- ✅ **==멀티 에이전트== 패턴** — 시스템 프롬프트로 AI 에게 고유 역할 부여
- ✅ **라운드 기반 토론** — 이전 발언을 컨텍스트로 전달해 연속 대화 구현
- ✅ **종합 분석** — 전체 토론 기록을 구조화된 보고서로 변환
- ✅ **채팅 UI** — 에이전트별 색상·아바타가 있는 실시간 말풍선
- ✅ **세션 관리** — 토론 저장·불러오기·내보내기 시스템

> 🔮 **다음 워크샵** 에서는 또 다른 실전 AI 프로젝트를 만들어 봅니다. 기대해 주세요!`,
    },
  ],
  quiz: {
    title: "W32 — AI 멀티 에이전트 토론 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "멀티 에이전트 토론에서 각 AI 에게 서로 다른 관점을 부여하는 방법은?",
        options: [
          "서로 다른 AI 모델을 사용한다",
          "각 에이전트에게 다른 시스템 프롬프트(역할 지시)를 부여한다",
          "temperature 값만 바꾸면 관점이 자동으로 달라진다",
          "에이전트마다 다른 프로그래밍 언어로 호출한다",
        ],
        correctIndex: 1,
        explanation:
          "같은 LLM 모델이라도 시스템 프롬프트에 '찬성 논객', '반대 논객' 같은 역할을 지정하면 완전히 다른 관점의 답변을 생성합니다. 이것이 멀티 에이전트 패턴의 핵심이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "라운드 기반 토론에서 이전 발언을 다음 에이전트에게 전달하는 이유는?",
        options: [
          "API 비용을 절약하기 위해",
          "이전 맥락을 참조해야 반박·보완이 가능하고 자연스러운 대화 흐름이 이어지니까",
          "LLM 이 이전 대화를 자동으로 기억하지 못하니까 오류가 발생해서",
          "채팅 UI 에 이전 메시지를 표시하기 위해",
        ],
        correctIndex: 1,
        explanation:
          "LLM 은 매 호출이 독립적이라 이전 대화를 자동으로 기억하지 못합니다. 이전 발언을 컨텍스트로 전달해야 'Alex 의 주장에 반박하면...'처럼 상대 발언에 구체적으로 반응할 수 있어요.",
      },
      {
        type: "multiple-choice",
        question:
          "토론 종합 보고서에서 'agreements(합의 영역)'가 비어 있다면 어떤 의미인가?",
        options: [
          "보고서 생성 AI 에 버그가 있다",
          "토론이 성공적으로 끝났다는 뜻이다",
          "찬성과 반대 측이 어떤 공통점도 찾지 못한 평행선 상태다",
          "라운드 수가 부족해서 보고서를 생성할 수 없다",
        ],
        correctIndex: 2,
        explanation:
          "합의 영역이 비어 있다는 것은 양측이 공통된 기반을 찾지 못했다는 뜻입니다. 이런 경우 라운드를 추가하거나, 주제를 더 구체적으로 좁혀서 접점을 찾도록 유도할 수 있어요.",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W31 — AI 워크플로우 자동화.
 *
 * Part A: 파이프라인 설계·노드 설정·조건 분기를 LLM 으로 체험 (LLM 셀)
 * Part B: MD 레시피로 React Flow 기반 비주얼 워크플로우 에디터 완성 (Claude Code / Cursor)
 */
export const workshopW31: Lesson = {
  id: "ai-eng-w31-workflow-automation",
  language: "ai-engineering",
  track: "beginner",
  order: 131,
  title: "W31: AI 워크플로우 자동화",
  subtitle: "노드를 연결해서 AI 자동화 파이프라인 만들기",
  estimatedMinutes: 210,
  cells: [
    {
      type: "markdown",
      source: `# 🔀 AI 워크플로우 자동화 에디터 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**==노드==를 드래그해서 연결하고, AI 자동화 ==파이프라인==을 시각적으로 만드는 에디터** — 트리거가 발동하면 AI 가 텍스트를 요약하고, 조건에 따라 분기하고, 결과를 전달하는 전체 흐름을 눈으로 보며 설계합니다.

### 완성 모습
\`\`\`
┌─ AI Workflow Automation ─────────────────────────────────────┐
│  🔀 Workflow Editor    [📂 열기]  [💾 저장]  🌙 다크         │
├──────────────┬───────────────────────────────────────────────┤
│  📦 노드 팔레트  │                                            │
│              │   ┌──────────┐     ┌───────────┐              │
│  🎯 트리거   │   │ 🎯 이메일 │────▶│ 🤖 요약   │              │
│  ┌────────┐ │   │  수신 시  │     │  AI 노드  │              │
│  │⏰ 스케줄│ │   └──────────┘     └─────┬─────┘              │
│  │📧 이메일│ │                          │                     │
│  │🔗 웹훅 │ │                    ┌──────▼──────┐             │
│  └────────┘ │                    │ 🔀 조건 분기 │             │
│              │                    │  긍정/부정?  │             │
│  🤖 AI 노드 │                    └──┬───────┬──┘             │
│  ┌────────┐ │             긍정      │       │  부정           │
│  │📝 요약 │ │                ┌──────▼──┐ ┌──▼──────┐         │
│  │🏷️ 분류 │ │                │ 📤 슬랙  │ │ 📧 알림  │         │
│  │✍️ 생성 │ │                │  전송   │ │  발송   │         │
│  │🌐 번역 │ │                └─────────┘ └─────────┘         │
│  └────────┘ │                                                │
│              │─────────────────────────────────────────────── │
│  🔀 조건    │  📋 실행 로그                                   │
│  ┌────────┐ │  ✅ 10:01 트리거 발동 (이메일 수신)             │
│  │⚡ if/else│ │  ✅ 10:01 AI 요약 완료 (128 토큰)             │
│  │🔄 반복 │ │  ✅ 10:02 조건 분기 → "긍정" 경로              │
│  └────────┘ │  ✅ 10:02 슬랙 메시지 전송 완료                 │
│              │                                                │
│  📤 액션    │  ⏱️ 총 소요: 3.2초 | 토큰: 245                  │
│  ┌────────┐ │                                                │
│  │💬 출력 │ │  [▶️ 실행]  [⏸️ 일시정지]  [🔄 초기화]          │
│  │🔗 웹훅 │ │                                                │
│  │🔔 알림 │ │                                                │
│  └────────┘ │                                                │
├──────────────┴───────────────────────────────────────────────┤
│  📁 템플릿: [이메일 분류] [콘텐츠 생성] [다국어 번역] [+새로 만들기] │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 파이프라인 설계 + 노드 설정 + 조건 분기 | 70분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 React Flow 워크플로우 에디터 완성 | 140분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)
> - ==DAG== (방향 비순환 그래프) 개념 — 이번 워크샵에서 자세히 배워요!`,
    },

    // ─── Part A: 워크플로우 AI 엔진 ───
    {
      type: "markdown",
      source: `## Part A: 워크플로우 AI 엔진 만들기 (70분)

워크플로우 자동화의 핵심은 **복잡한 작업 흐름을 ==노드==와 ==엣지==로 시각화**하고, 각 단계를 AI 가 자동으로 처리하는 것이에요.

핵심 개념 3가지:
1. **==파이프라인== 설계** — 자연어 설명을 ==DAG== 구조의 노드 그래프로 변환
2. **노드 설정 생성** — 각 노드 유형 (트리거 / AI / 조건 / 액션) 에 맞는 설정값 자동 생성
3. **조건 분기 처리** — AI 분석 결과에 따라 if/else 경로를 동적으로 결정

> 📌 **==DAG== 란?** — Directed Acyclic Graph. 노드(작업)와 엣지(연결)로 이루어진 그래프인데, 방향이 있고 순환이 없어요. "A → B → C" 처럼 앞으로만 흐르는 구조입니다. 워크플로우 도구 (Zapier, n8n, Apache Airflow) 가 모두 이 구조를 씁니다.`,
    },

    {
      type: "markdown",
      source: `### A-1. 파이프라인 설계기 — 자연어 → 노드 그래프

사용자가 "이메일이 오면 AI 로 요약하고, 긴급이면 슬랙 알림" 같은 자연어 설명을 입력하면, AI 가 ==파이프라인== 구조를 JSON 으로 설계해줍니다. 각 ==노드==의 타입, 연결 관계 (==엣지==), 실행 순서까지 자동으로 잡아줘요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 파이프라인 설계기 — 자연어 설명 → 노드 그래프 JSON
const workflowDescription = \`
새 고객 문의 이메일이 도착하면:
1. AI 가 이메일 내용을 요약한다
2. 감정 분석으로 긍정/부정/중립을 판별한다
3. 부정적이면 긴급 슬랙 채널에 알림을 보낸다
4. 긍정/중립이면 주간 리포트 시트에 기록한다
5. 모든 경우에 고객에게 자동 응답 이메일을 보낸다
\`;

const systemPrompt = \`너는 AI 워크플로우 파이프라인 설계 전문가야.
사용자의 자연어 설명을 분석해서 노드 기반 DAG 파이프라인을 JSON 으로 설계해.

[노드 유형]
- trigger: 파이프라인 시작점 (이메일, 스케줄, 웹훅)
- ai: AI 처리 (summarize, classify, generate, translate, sentiment)
- condition: 조건 분기 (if/else)
- action: 결과 수행 (output, webhook, notify, email, sheet)

[응답 형식]
{
  "name": "워크플로우 이름",
  "description": "한 줄 설명",
  "nodes": [
    { "id": "node-1", "type": "trigger|ai|condition|action", "label": "표시명", "config": { ... } }
  ],
  "edges": [
    { "source": "node-1", "target": "node-2", "label": "연결 라벨 (조건 분기 시)" }
  ],
  "executionOrder": ["node-1", "node-2", ...]
}

[규칙]
- 한국어 라벨 사용
- 조건 분기 시 반드시 true/false 두 경로 모두 명시
- 병렬 실행 가능한 노드는 같은 depth 에 배치
- executionOrder 는 위상정렬 순서\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 워크플로우를 파이프라인으로 설계해줘:\\n\${workflowDescription}\` },
  ],
});

try {
  const pipeline = JSON.parse(res.text);
  console.log("🔀 파이프라인 설계 결과");
  console.log("═".repeat(50));
  console.log("📌 이름:", pipeline.name);
  console.log("📝 설명:", pipeline.description);

  console.log("\\n📦 노드 목록:");
  const typeIcons: Record<string, string> = {
    trigger: "🎯", ai: "🤖", condition: "🔀", action: "📤"
  };
  pipeline.nodes?.forEach((n: any) =>
    console.log(\`  \${typeIcons[n.type] || "⬜"} [\${n.id}] \${n.label} (\${n.type})\`)
  );

  console.log("\\n🔗 엣지 (연결):");
  pipeline.edges?.forEach((e: any) =>
    console.log(\`  \${e.source} ──\${e.label ? \` \${e.label} \` : ""}──▶ \${e.target}\`)
  );

  console.log("\\n⏱️ 실행 순서:", pipeline.executionOrder?.join(" → "));
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 사용자는 '이렇게 하고 싶어'만 말하면, AI 가 노드 그래프를 설계해줘요.",
        "executionOrder 는 위상정렬(topological sort) — DAG 에서 순서를 정하는 알고리즘이에요.",
        "조건 분기(condition) 노드가 있으면 edges 에 true/false 라벨이 붙어야 해요.",
        "실무에서는 이 JSON 을 React Flow 의 노드/엣지 형식으로 변환해서 렌더링합니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 노드 설정 생성기 — 노드 유형별 자동 구성

각 ==노드== 유형마다 필요한 설정이 달라요. 트리거 노드에는 "언제 실행할지", AI 노드에는 "어떤 모델로 무엇을 할지", 액션 노드에는 "어디에 결과를 보낼지" 를 설정해야 합니다. AI 가 노드의 역할을 이해하고 적절한 설정 폼을 자동으로 채워줍니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 노드 설정 생성기 — 노드 유형 + 역할 → 상세 설정 JSON
const nodeToConfig = {
  id: "node-ai-summarize",
  type: "ai",
  label: "이메일 요약",
  context: "고객 문의 이메일을 3줄 이내로 요약. 핵심 요청사항과 감정 톤을 포함.",
};

const systemPrompt = \`너는 워크플로우 노드 설정 전문가야.
주어진 노드 정보를 바탕으로 상세 실행 설정을 JSON 으로 생성해.

[노드 유형별 설정 스키마]

trigger 타입:
{ "triggerType": "email|schedule|webhook", "schedule": "cron표현식?", "filter": "조건?", "webhookPath": "경로?" }

ai 타입:
{ "operation": "summarize|classify|generate|translate|sentiment",
  "systemPrompt": "시스템 프롬프트",
  "outputFormat": "text|json",
  "outputSchema": { ... },
  "maxTokens": 숫자,
  "temperature": 0.0~1.0,
  "inputMapping": "이전 노드 출력 중 어디를 입력으로 쓸지" }

condition 타입:
{ "field": "평가할 필드 경로",
  "operator": "equals|contains|gt|lt|in|regex",
  "value": "비교값",
  "trueBranch": "참일 때 다음 노드 id",
  "falseBranch": "거짓일 때 다음 노드 id" }

action 타입:
{ "actionType": "output|webhook|notify|email|sheet",
  "target": "대상 (슬랙채널/이메일주소/시트ID)",
  "template": "메시지 템플릿 ({{변수}} 치환)",
  "method": "POST|GET?" }

[규칙]
- 한국어 설명, 영어 키
- systemPrompt 는 역할에 최적화된 구체적 프롬프트
- outputSchema 는 다음 노드가 쓸 수 있는 구조로\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`이 노드의 상세 설정을 생성해줘:\\n\${JSON.stringify(nodeToConfig, null, 2)}\` },
  ],
});

try {
  const config = JSON.parse(res.text);
  console.log("⚙️ 노드 설정 생성 결과");
  console.log("═".repeat(50));
  console.log("🏷️ 노드:", nodeToConfig.label, "(" + nodeToConfig.type + ")");
  console.log("\\n📋 생성된 설정:");
  console.log(JSON.stringify(config, null, 2));

  if (config.systemPrompt) {
    console.log("\\n🤖 시스템 프롬프트:");
    console.log("  ", config.systemPrompt);
  }
  if (config.outputSchema) {
    console.log("\\n📤 출력 스키마:");
    console.log(JSON.stringify(config.outputSchema, null, 2));
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 노드마다 '설정 패널'을 열면 AI 가 역할에 맞는 기본값을 채워줘요.",
        "ai 노드의 systemPrompt 는 워크플로우 맥락에 맞게 자동 작성됩니다.",
        "outputSchema 를 정의해두면, 다음 노드가 어떤 데이터를 받을지 예측할 수 있어요.",
        "실무에서는 이 설정을 노드 클릭 시 사이드 패널에 폼으로 보여줍니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 조건 분기 처리기 — AI 분석 → 동적 경로 결정

==파이프라인== 에서 가장 강력한 부분은 **조건 분기** 입니다. AI 가 텍스트를 분석한 결과에 따라 "긍정이면 A 경로, 부정이면 B 경로" 처럼 동적으로 흐름이 갈라지는 거예요. 이 셀에서는 AI 분석 → 조건 평가 → 경로 선택까지 전체 흐름을 시뮬레이션합니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 조건 분기 시뮬레이터 — AI 분석 결과에 따라 실행 경로 결정
const incomingEmails = [
  "서비스가 너무 느려서 업무에 지장이 큽니다. 빠른 개선 부탁드립니다.",
  "지난번 문의에 신속하게 응대해주셔서 감사합니다. 덕분에 문제가 해결됐어요!",
  "결제 페이지에서 오류가 발생하는데 확인 부탁드립니다. 주문번호는 #A1234 입니다.",
];

const systemPrompt = \`너는 이메일 분석 AI 야. 각 이메일을 분석해서 JSON 배열로 응답해.

[각 이메일 분석 결과 형식]
{
  "summary": "1줄 요약",
  "sentiment": "positive" | "negative" | "neutral",
  "urgency": "high" | "medium" | "low",
  "category": "complaint" | "praise" | "inquiry" | "bug-report",
  "keyEntities": ["추출된 핵심 키워드/엔티티"],
  "suggestedAction": "추천 후속 조치"
}

JSON 배열만 응답해. 설명 텍스트 없이.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 이메일들을 분석해줘:\\n\${incomingEmails.map((e, i) => \`[\${i + 1}] \${e}\`).join("\\n")}\` },
  ],
});

try {
  const analyses = JSON.parse(res.text);
  console.log("🔀 조건 분기 시뮬레이션");
  console.log("═".repeat(55));

  // 파이프라인 조건 규칙 정의
  const rules = {
    urgentAlert: (a: any) => a.sentiment === "negative" && a.urgency === "high",
    bugTracker: (a: any) => a.category === "bug-report",
    weeklyDigest: (a: any) => a.sentiment !== "negative",
  };

  analyses.forEach((analysis: any, i: number) => {
    console.log(\`\\n📧 이메일 #\${i + 1}\`);
    console.log(\`  📝 요약: \${analysis.summary}\`);
    console.log(\`  💭 감정: \${analysis.sentiment} | ⚡ 긴급도: \${analysis.urgency}\`);
    console.log(\`  🏷️ 분류: \${analysis.category}\`);

    // 조건 분기 실행
    console.log("  🔀 분기 결과:");
    if (rules.urgentAlert(analysis)) {
      console.log("    → 🚨 긴급 슬랙 알림 전송 (부정 + 높은 긴급도)");
    }
    if (rules.bugTracker(analysis)) {
      console.log("    → 🐛 버그 트래커에 이슈 생성");
    }
    if (rules.weeklyDigest(analysis)) {
      console.log("    → 📊 주간 리포트 시트에 기록");
    }
    console.log(\`    → 📤 자동 응답: \${analysis.suggestedAction}\`);
  });

  console.log("\\n" + "═".repeat(55));
  console.log("✅ 파이프라인 실행 완료");
  console.log(\`   처리된 이메일: \${analyses.length}건\`);
  console.log(\`   긴급 알림: \${analyses.filter((a: any) => rules.urgentAlert(a)).length}건\`);
  console.log(\`   버그 리포트: \${analyses.filter((a: any) => rules.bugTracker(a)).length}건\`);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: AI 분석 결과가 조건 노드의 입력이 되고, 규칙에 따라 다른 경로를 탄다는 점이에요.",
        "rules 객체가 condition 노드의 설정과 같은 역할 — field + operator + value 조합이에요.",
        "실무에서는 이 규칙들을 UI 에서 드롭다운으로 선택하게 하면 비개발자도 사용할 수 있어요.",
        "여러 조건이 동시에 참이면 병렬 실행 — DAG 의 장점이 여기서 빛납니다.",
      ],
    },

    // ─── Part B: 풀스택 워크플로우 에디터 (MD 레시피) ───
    {
      type: "markdown",
      source: `## Part B: 비주얼 워크플로우 에디터 만들기 (140분)

이제 Part A 에서 체험한 AI 엔진을 **React Flow 기반 비주얼 에디터** 로 옮깁니다.
==노드==를 드래그하고, ==엣지==로 연결하고, 설정 패널에서 값을 조정하고, 실행 버튼을 누르면 단계별 로그가 쌓이는 완전한 워크플로우 자동화 도구예요.

> 📋 아래 MD 레시피를 **Claude Code** 나 **Cursor** 에 통째로 붙여넣으면, AI 가 프로젝트를 생성해줍니다.

---

### 프로젝트 셋업

\`\`\`bash
npm create vite@latest ai-workflow-editor -- --template react-ts
cd ai-workflow-editor
npm install
npm install reactflow @google/genai
npm install -D tailwindcss @tailwindcss/vite
\`\`\`

\`\`\`
ai-workflow-editor/
├── src/
│   ├── components/
│   │   ├── Editor/
│   │   │   ├── WorkflowCanvas.tsx    # React Flow 캔버스 (메인 에디터)
│   │   │   ├── NodePalette.tsx       # 드래그 가능한 노드 팔레트
│   │   │   ├── ConfigPanel.tsx       # 선택된 노드 설정 패널
│   │   │   └── ExecutionLog.tsx      # 실행 로그 뷰어
│   │   ├── Nodes/
│   │   │   ├── TriggerNode.tsx       # 🎯 트리거 노드 커스텀 컴포넌트
│   │   │   ├── AINode.tsx            # 🤖 AI 노드 (요약/분류/생성/번역)
│   │   │   ├── ConditionNode.tsx     # 🔀 조건 분기 노드 (if/else)
│   │   │   └── ActionNode.tsx        # 📤 액션 노드 (출력/웹훅/알림)
│   │   ├── Toolbar.tsx               # 상단 도구 모음
│   │   └── TemplateGallery.tsx       # 워크플로우 템플릿 선택
│   ├── hooks/
│   │   ├── useWorkflow.ts            # 워크플로우 상태 관리 (노드/엣지 CRUD)
│   │   └── useExecution.ts           # 파이프라인 실행 엔진
│   ├── lib/
│   │   ├── ai.ts                     # Gemini API 래퍼
│   │   ├── executor.ts               # DAG 위상정렬 + 단계별 실행기
│   │   └── storage.ts                # localStorage 저장/불러오기
│   ├── types/
│   │   └── workflow.ts               # 노드/엣지/워크플로우 타입
│   ├── data/
│   │   └── templates.ts              # 기본 워크플로우 템플릿
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── package.json
\`\`\`

---

### 핵심 타입 정의

\`\`\`typescript
// src/types/workflow.ts
export type NodeKind = "trigger" | "ai" | "condition" | "action";

export interface TriggerConfig {
  triggerType: "email" | "schedule" | "webhook" | "manual";
  schedule?: string;        // cron 표현식
  webhookPath?: string;
  filter?: string;
}

export interface AIConfig {
  operation: "summarize" | "classify" | "generate" | "translate" | "sentiment";
  systemPrompt: string;
  outputFormat: "text" | "json";
  outputSchema?: Record<string, string>;
  maxTokens: number;
  temperature: number;
}

export interface ConditionConfig {
  field: string;             // 이전 노드 출력에서 평가할 필드
  operator: "equals" | "contains" | "gt" | "lt" | "in" | "regex";
  value: string;
}

export interface ActionConfig {
  actionType: "output" | "webhook" | "notify" | "email" | "sheet";
  target: string;
  template: string;          // {{변수}} 치환 가능
  method?: "POST" | "GET";
}

export interface WorkflowNode {
  id: string;
  kind: NodeKind;
  label: string;
  config: TriggerConfig | AIConfig | ConditionConfig | ActionConfig;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;           // 조건 분기 시 "참"/"거짓"
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionStep {
  nodeId: string;
  label: string;
  status: "pending" | "running" | "success" | "error" | "skipped";
  input?: unknown;
  output?: unknown;
  duration?: number;
  tokens?: number;
  timestamp: string;
}
\`\`\`

---

### 핵심 구현 가이드

#### 1. React Flow 캔버스 — 드래그 & 연결

\`\`\`typescript
// src/components/Editor/WorkflowCanvas.tsx
import ReactFlow, {
  Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState,
  type Connection, type NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { TriggerNode } from "../Nodes/TriggerNode";
import { AINode } from "../Nodes/AINode";
import { ConditionNode } from "../Nodes/ConditionNode";
import { ActionNode } from "../Nodes/ActionNode";

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  ai: AINode,
  condition: ConditionNode,
  action: ActionNode,
};

// React Flow 의 <ReactFlow> 안에서:
// - onConnect 로 엣지 추가
// - onDrop + onDragOver 로 팔레트에서 노드 드래그 생성
// - onNodeClick 으로 ConfigPanel 에 선택 노드 전달
\`\`\`

#### 2. 커스텀 노드 — 유형별 디자인

\`\`\`typescript
// src/components/Nodes/AINode.tsx — 예시
import { Handle, Position, type NodeProps } from "reactflow";

export function AINode({ data }: NodeProps) {
  const icons: Record<string, string> = {
    summarize: "📝", classify: "🏷️",
    generate: "✍️", translate: "🌐", sentiment: "💭",
  };
  return (
    <div className="bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-400
                    rounded-xl px-4 py-3 min-w-[160px] shadow-lg">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <span className="text-xl">{icons[data.operation] || "🤖"}</span>
        <div>
          <p className="font-bold text-sm text-purple-700 dark:text-purple-300">
            {data.label}
          </p>
          <p className="text-xs text-gray-500">{data.operation}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// ConditionNode 는 Handle 이 3개:
//   target (위), source-true (왼쪽 아래), source-false (오른쪽 아래)
\`\`\`

#### 3. DAG 실행 엔진 — 위상정렬 + 단계별 실행

\`\`\`typescript
// src/lib/executor.ts
import type { Workflow, ExecutionStep } from "../types/workflow";

export function topologicalSort(workflow: Workflow): string[] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  workflow.nodes.forEach(n => {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  });
  workflow.edges.forEach(e => {
    adj.get(e.source)!.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
  });

  const queue = [...inDegree.entries()]
    .filter(([, deg]) => deg === 0)
    .map(([id]) => id);
  const order: string[] = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    order.push(nodeId);
    for (const next of adj.get(nodeId) || []) {
      inDegree.set(next, inDegree.get(next)! - 1);
      if (inDegree.get(next) === 0) queue.push(next);
    }
  }
  return order;
}

// executeWorkflow:
// 1. topologicalSort 로 실행 순서 결정
// 2. 순서대로 각 노드 실행 (ai → Gemini API, condition → 분기 평가)
// 3. condition 노드에서 false 경로의 하위 노드는 skipped 처리
// 4. 각 단계마다 ExecutionStep 을 로그 배열에 push
// 5. onStep 콜백으로 UI 에 실시간 반영
\`\`\`

#### 4. AI 노드 실행 — Gemini API 호출

\`\`\`typescript
// src/lib/ai.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

export async function runAINode(
  operation: string,
  systemPrompt: string,
  input: string,
  options: { maxTokens?: number; temperature?: number } = {}
) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: \`\${systemPrompt}\\n\\n입력:\\n\${input}\`,
    config: {
      maxOutputTokens: options.maxTokens ?? 500,
      temperature: options.temperature ?? 0.3,
    },
  });
  return response.text ?? "";
}
\`\`\`

#### 5. 조건 평가 엔진

\`\`\`typescript
// executor.ts 내부
function evaluateCondition(
  config: ConditionConfig,
  input: Record<string, any>
): boolean {
  const value = input[config.field];
  switch (config.operator) {
    case "equals":   return String(value) === config.value;
    case "contains": return String(value).includes(config.value);
    case "gt":       return Number(value) > Number(config.value);
    case "lt":       return Number(value) < Number(config.value);
    case "in":       return config.value.split(",").includes(String(value));
    case "regex":    return new RegExp(config.value).test(String(value));
    default:         return false;
  }
}
\`\`\`

#### 6. localStorage 저장/불러오기

\`\`\`typescript
// src/lib/storage.ts
const STORAGE_KEY = "ai-workflows";

export function saveWorkflow(wf: Workflow) {
  const all = loadAllWorkflows();
  const idx = all.findIndex(w => w.id === wf.id);
  if (idx >= 0) all[idx] = wf; else all.push(wf);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function loadAllWorkflows(): Workflow[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function deleteWorkflow(id: string) {
  const all = loadAllWorkflows().filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
\`\`\`

---

### 기본 워크플로우 템플릿

\`\`\`typescript
// src/data/templates.ts
export const templates = [
  {
    name: "📧 이메일 분류 자동화",
    description: "수신 이메일을 AI 로 분류하고 긴급도에 따라 라우팅",
    nodes: [
      { kind: "trigger", label: "이메일 수신", operation: "email" },
      { kind: "ai", label: "감정 분석", operation: "sentiment" },
      { kind: "condition", label: "부정적?", field: "sentiment", value: "negative" },
      { kind: "action", label: "긴급 알림", actionType: "notify" },
      { kind: "action", label: "리포트 기록", actionType: "sheet" },
    ],
  },
  {
    name: "📝 콘텐츠 생성 파이프라인",
    description: "주제 입력 → AI 초안 생성 → 요약 → 번역 → 발행",
    nodes: [
      { kind: "trigger", label: "주제 입력", operation: "manual" },
      { kind: "ai", label: "초안 생성", operation: "generate" },
      { kind: "ai", label: "요약", operation: "summarize" },
      { kind: "ai", label: "영어 번역", operation: "translate" },
      { kind: "action", label: "결과 출력", actionType: "output" },
    ],
  },
  {
    name: "🌐 다국어 번역 워크플로우",
    description: "입력 텍스트를 여러 언어로 동시 번역",
    nodes: [
      { kind: "trigger", label: "텍스트 입력", operation: "manual" },
      { kind: "ai", label: "영어 번역", operation: "translate" },
      { kind: "ai", label: "일본어 번역", operation: "translate" },
      { kind: "ai", label: "중국어 번역", operation: "translate" },
      { kind: "action", label: "결과 병합 출력", actionType: "output" },
    ],
  },
];
\`\`\`

---

### 주요 기능 체크리스트

#### 에디터 기능
- [ ] 노드 팔레트에서 캔버스로 드래그 앤 드롭
- [ ] 노드 간 ==엣지== 연결 (핸들 드래그)
- [ ] 노드 클릭 시 설정 패널 열기
- [ ] 노드/엣지 삭제 (Delete 키 또는 우클릭)
- [ ] 캔버스 줌/팬 (React Flow 기본 제공)
- [ ] 미니맵으로 전체 구조 파악

#### 노드 유형
- [ ] 🎯 트리거: 스케줄, 이메일, 웹훅, 수동
- [ ] 🤖 AI: 요약, 분류, 생성, 번역, 감정분석
- [ ] 🔀 조건: if/else 분기 (참/거짓 두 경로)
- [ ] 📤 액션: 출력, 웹훅, 알림, 이메일, 시트

#### 실행 기능
- [ ] ▶️ 실행 버튼 → ==DAG== 위상정렬 순서로 실행
- [ ] 단계별 실행 로그 (시간, 상태, 토큰 수)
- [ ] 조건 분기 시 선택된/건너뛴 경로 시각 표시
- [ ] 실행 중 노드 하이라이트 (현재 → 초록, 완료 → 회색)
- [ ] 에러 발생 시 해당 노드 빨간색 + 에러 메시지

#### 저장/관리
- [ ] 워크플로우 localStorage 저장/불러오기
- [ ] 이름/설명 편집
- [ ] 템플릿에서 새 워크플로우 생성
- [ ] 다크/라이트 모드 토글`,
    },

    {
      type: "markdown",
      source: `### 🏆 도전 과제 — 더 강력한 워크플로우 에디터로

기본 기능이 완성됐다면, 다음 기능을 추가해 보세요!

### 레벨 1 — 기본 확장
- **실행 히스토리**: 과거 실행 결과를 타임라인으로 보기
- **노드 복제**: 선택한 노드를 Ctrl+D 로 복제
- **엣지 라벨 편집**: 조건 분기 라벨을 직접 수정

### 레벨 2 — 중급 도전
- **루프 노드**: 배열 데이터를 순회하며 반복 실행 (for-each)
- **변수 시스템**: 노드 간 데이터 전달을 변수로 명시적 관리
- **병렬 실행**: ==DAG== 에서 같은 레벨의 노드를 Promise.all 로 동시 실행
- **실행 디버거**: 브레이크포인트를 걸고 단계별 step-through

### 레벨 3 — 프로 도전
- **AI 워크플로우 생성**: 자연어로 전체 워크플로우를 한번에 생성 (Part A-1 연동)
- **서브 워크플로우**: 다른 워크플로우를 하나의 노드로 재사용
- **Webhook 서버**: Express + ngrok 으로 실제 웹훅 트리거 연결
- **협업 편집**: WebSocket 으로 실시간 다중 사용자 편집

---

## 🎉 W31 완료!

이번 워크샵에서 배운 것:
- ✅ **==파이프라인== 설계** — 자연어를 ==DAG== 구조의 노드 그래프로 변환
- ✅ **==노드== 설정 자동화** — AI 가 역할에 맞는 설정값을 자동 생성
- ✅ **조건 분기** — AI 분석 결과에 따른 동적 경로 결정
- ✅ **React Flow** — ==노드==·==엣지== 기반 비주얼 에디터 구축
- ✅ **==DAG== 실행 엔진** — 위상정렬로 올바른 순서 보장
- ✅ **워크플로우 관리** — 저장·불러오기·템플릿 시스템

> 🔮 **다음 워크샵** 에서는 또 다른 실전 AI 프로젝트를 만들어 봅니다. 기대해 주세요!`,
    },
  ],
  quiz: {
    title: "W31 — AI 워크플로우 자동화 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "워크플로우 파이프라인에서 DAG(Directed Acyclic Graph)를 사용하는 이유는?",
        options: [
          "그래프가 예뻐서 시각화에 유리하니까",
          "방향이 있고 순환이 없어서 실행 순서를 위상정렬로 확정할 수 있으니까",
          "노드 수를 무제한으로 늘릴 수 있으니까",
          "데이터베이스 없이 상태를 저장할 수 있으니까",
        ],
        correctIndex: 1,
        explanation:
          "DAG 는 방향이 있고 순환(cycle)이 없는 그래프입니다. 덕분에 위상정렬(topological sort)로 '어떤 노드를 먼저 실행해야 하는지' 순서를 확정할 수 있어요. 순환이 있으면 무한 루프에 빠질 수 있습니다.",
      },
      {
        type: "multiple-choice",
        question:
          "조건 분기(condition) 노드에서 AI 감정 분석 결과가 'negative'일 때 긴급 알림을 보내려면 어떤 설정이 필요한가?",
        options: [
          "field: 'sentiment', operator: 'equals', value: 'negative'",
          "field: 'urgency', operator: 'gt', value: '5'",
          "field: 'category', operator: 'contains', value: 'alert'",
          "field: 'sentiment', operator: 'regex', value: '.*neg.*'",
        ],
        correctIndex: 0,
        explanation:
          "감정 분석 결과의 sentiment 필드가 정확히 'negative'인지 확인하려면 equals 연산자를 사용합니다. regex 도 가능하지만, 정확한 값 비교에는 equals 가 명확하고 안전해요.",
      },
      {
        type: "multiple-choice",
        question:
          "React Flow 에서 ConditionNode 가 다른 노드와 다른 점은?",
        options: [
          "배경색이 다르다",
          "Handle(연결점)이 출력 방향으로 2개 (참/거짓) 있어서 분기를 표현한다",
          "크기가 더 크다",
          "클릭할 수 없다",
        ],
        correctIndex: 1,
        explanation:
          "일반 노드는 출력 Handle 이 1개지만, 조건 노드는 '참' 경로와 '거짓' 경로로 나뉘므로 출력 Handle 이 2개 필요합니다. React Flow 에서 Handle 의 id 를 다르게 설정해 각 경로를 구분해요.",
      },
    ],
  } satisfies Quiz,
};

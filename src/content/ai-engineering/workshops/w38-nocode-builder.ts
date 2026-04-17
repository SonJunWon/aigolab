import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W38 — AI 노코드 앱 빌더.
 *
 * Part A: 자연어 → 컴포넌트 트리 JSON, 속성 설정 생성, 데이터 바인딩 로직을 LLM 으로 체험 (LLM 셀)
 * Part B: MD 레시피로 자연어 입력 → AI UI 자동 생성 + 라이브 프리뷰 + 속성 편집 + 배포 완성 (Claude Code / Cursor)
 */
export const workshopW38: Lesson = {
  id: "ai-eng-w38-nocode-builder",
  language: "ai-engineering",
  track: "beginner",
  order: 138,
  title: "W38: AI 노코드 앱 빌더",
  subtitle: "설명만 입력하면 AI가 웹앱 UI를 자동 생성",
  estimatedMinutes: 240,
  cells: [
    {
      type: "markdown",
      source: `# 🏗️ AI 노코드 앱 빌더 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**자연어로 앱을 설명하면 AI 가 ==컴포넌트 트리==를 자동 생성하고, 라이브 프리뷰로 즉시 확인하며, 속성 편집·데이터 바인딩·테마 커스터마이징까지 가능한 노코드 앱 빌더** — 코드를 한 줄도 쓰지 않고 웹앱 UI 를 만들고 배포합니다.

### 완성 모습
\`\`\`
┌─ AI NoCode Builder ──────────────────────────────────────────┐
│  🏗️ NoCode Studio    [💾 저장]  [📤 내보내기]  [🚀 배포]  🌙  │
├──────────────┬───────────────────────────┬───────────────────┤
│ 📝 앱 설명    │   👁️ 라이브 프리뷰         │ ⚙️ 속성 패널      │
│              │                           │                   │
│ "할 일 관리   │  ┌─ 오늘의 할 일 ────────┐ │ 📦 Header         │
│  앱을 만들어  │  │ ✅ 오늘의 할 일        │ │  ├ title: 오늘의…  │
│  줘. 제목,   │  │                       │ │  ├ bg: blue-600   │
│  입력 필드,  │  │ ┌───────────┐ [추가]  │ │  └ sticky: true   │
│  할 일 목록, │  │ │ 새 할 일… │         │ │                   │
│  완료 체크,  │  │ └───────────┘         │ │ 📦 Form           │
│  삭제 버튼   │  │                       │ │  ├ placeholder:…  │
│  이 있어야   │  │ ☑ TypeScript 공부      │ │  ├ buttonText:…   │
│  해."        │  │ ☐ 운동하기      🗑️    │ │  └ onSubmit: add  │
│              │  │ ☐ 장보기        🗑️    │ │                   │
│ [🤖 생성]    │  │                       │ │ 📦 List           │
│              │  │ 완료: 1/3 (33%)       │ │  ├ items: todos   │
│ 📊 컴포넌트   │  └───────────────────────┘ │  ├ checkbox: true │
│ ┌──────────┐ │                           │  └ deletable: true│
│ │ 📦 Header │ │  ┌─ 테마 ──────────────┐ │                   │
│ │ 📦 Form   │ │  │ 🎨 Blue  🟢 Green   │ │ 🔗 데이터 바인딩   │
│ │ 📦 List   │ │  │ 🟣 Purple 🔴 Red    │ │  todos[] ──→ List │
│ │ 📦 Footer │ │  │ [라이트] [다크]      │ │  newTodo ──→ Form │
│ └──────────┘ │  └──────────────────────┘ │                   │
└──────────────┴───────────────────────────┴───────────────────┘

   ✍️ 텍스트 입력  ──→  🤖 AI 분석  ──→  🌳 컴포넌트 트리  ──→  👁️ 라이브 렌더링
\`\`\`

---

### 핵심 아이디어

| 단계 | 설명 | 기술 |
|---|---|---|
| 1. 자연어 입력 | 사용자가 원하는 앱을 문장으로 설명 | 텍스트 분석 |
| 2. AI 분석 | ==LLM== 이 설명을 파싱해서 컴포넌트 구조 생성 | Gemini API |
| 3. 컴포넌트 트리 | Header, Form, List 등 ==컴포넌트== 계층 구조 | JSON 스키마 |
| 4. 라이브 프리뷰 | 생성된 트리를 실시간 렌더링 | React 동적 렌더링 |
| 5. 속성 편집 | 각 컴포넌트의 텍스트·색상·크기 수정 | 속성 패널 UI |
| 6. 데이터 바인딩 | 컴포넌트 간 데이터 흐름 연결 | ==상태 관리== |
| 7. 내보내기/배포 | HTML/React 코드로 내보내기 + 배포 | Vercel API |

> 📌 **==노코드== 란?** — 코드를 작성하지 않고 시각적 도구만으로 앱을 만드는 방식이에요. Bubble, Webflow, Glide 같은 서비스가 대표적입니다. 여기에 AI 를 결합하면 시각적 조작조차 필요 없이 '말'로 앱을 만들 수 있어요!

---

### 사전 준비

> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)
> - React ==컴포넌트== 개념 이해 (props, 렌더링)
> - JSON 구조 이해`,
    },

    // ─── Part A: AI 노코드 엔진 ───
    {
      type: "markdown",
      source: `## Part A: AI 노코드 엔진 만들기 (80분)

노코드 앱 빌더의 핵심은 **자연어를 구조화된 ==컴포넌트 트리==로 변환**하고, **각 컴포넌트의 속성을 설정**하고, **컴포넌트 간 데이터 흐름을 연결**하는 것이에요.

핵심 개념 3가지:
1. **자연어 → 컴포넌트 트리** — 앱 설명을 분석해서 Header/Form/List/Card 등 ==컴포넌트== 계층 JSON 생성
2. **속성 설정 생성** — 각 컴포넌트의 텍스트·색상·크기·이벤트 등 ==props== 자동 설정
3. **데이터 바인딩 로직** — 컴포넌트 간 상태 공유와 이벤트 흐름을 연결하는 바인딩 생성

> 📌 **==컴포넌트 트리== 란?** — UI 를 구성하는 블록(컴포넌트)들의 부모-자식 관계를 나타내는 구조예요. HTML 의 DOM 트리처럼, React 앱도 컴포넌트가 트리 형태로 중첩됩니다.`,
    },

    {
      type: "markdown",
      source: `### A-1. 자연어 → 컴포넌트 트리 JSON

사용자가 "블로그 앱을 만들어줘. 헤더에 제목, 글 목록, 글 작성 폼이 있어야 해" 라고 입력하면, AI 가 이걸 분석해서 구조화된 컴포넌트 트리 ==JSON== 으로 변환합니다. 이 JSON 이 앱 빌더의 '설계도' 역할을 해요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 자연어 앱 설명 → 컴포넌트 트리 JSON
const appDescription = \`
할 일 관리 앱을 만들어줘.
- 상단에 앱 제목 "오늘의 할 일"
- 새 할 일을 입력하는 입력 필드와 추가 버튼
- 할 일 목록 (체크박스로 완료 표시, 삭제 버튼)
- 하단에 완료 비율 통계 표시
- 깔끔한 카드 스타일 디자인
\`;

const systemPrompt = \`너는 노코드 앱 빌더의 AI 엔진이야.
사용자가 자연어로 설명한 앱을 분석해서 컴포넌트 트리 JSON 을 생성해.

[지원 컴포넌트 타입]
- header: 앱 상단 헤더 (title, subtitle, logo)
- form: 입력 폼 (fields 배열: text/number/email/select/checkbox)
- list: 아이템 목록 (아이템 구조 정의, 정렬/필터 옵션)
- card: 카드 컨테이너 (제목, 내용, 이미지, 액션 버튼)
- button: 단독 버튼 (텍스트, 색상, 액션)
- stat: 통계 표시 (라벨, 값, 아이콘)
- chart: 차트 (bar/pie/line, 데이터 소스)
- container: 레이아웃 그룹 (children, direction: row/column)
- text: 텍스트 블록 (content, size, weight)
- image: 이미지 (src, alt, size)
- nav: 네비게이션 바 (links 배열)
- footer: 하단 푸터 (텍스트, 링크)

[응답 형식 — JSON]
{
  "appName": "앱 이름",
  "description": "앱 한 줄 설명",
  "theme": {
    "primaryColor": "Tailwind 색상 (blue-600 등)",
    "style": "modern | minimal | playful | corporate"
  },
  "componentTree": [
    {
      "id": "고유 ID (comp-1 형식)",
      "type": "컴포넌트 타입",
      "label": "사용자에게 보일 이름",
      "props": { "컴포넌트별 속성들" },
      "children": [ "자식 컴포넌트 배열 (있으면)" ]
    }
  ],
  "layout": {
    "maxWidth": "max-w-md | max-w-lg | max-w-xl 등",
    "padding": "p-4 | p-6 등"
  }
}

[규칙]
- 사용자 설명에서 UI 요소를 정확히 추출
- 적절한 컴포넌트 타입을 선택 (가장 가까운 것)
- props 는 해당 컴포넌트에 필요한 속성만 포함
- children 은 중첩이 필요한 경우에만 사용
- 한국어 라벨, 영어 ID\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`이 앱을 만들어줘:\\n\${appDescription}\` },
  ],
});

try {
  const app = JSON.parse(res.text);
  console.log("🌳 컴포넌트 트리 생성 결과");
  console.log("═".repeat(50));
  console.log("📱 앱 이름:", app.appName);
  console.log("📝 설명:", app.description);
  console.log("🎨 테마:", app.theme?.primaryColor, "-", app.theme?.style);
  console.log("📐 레이아웃:", app.layout?.maxWidth, app.layout?.padding);

  console.log("\\n🌳 컴포넌트 트리:");
  const printTree = (nodes: any[], depth = 0) => {
    nodes?.forEach((node: any) => {
      const indent = "  ".repeat(depth);
      const icons: Record<string, string> = {
        header: "🏷️", form: "📝", list: "📋", card: "🃏",
        button: "🔘", stat: "📊", chart: "📈", container: "📦",
        text: "✏️", image: "🖼️", nav: "🧭", footer: "🦶",
      };
      const icon = icons[node.type] || "📦";
      console.log(\`\${indent}\${icon} [\${node.id}] \${node.type}: \${node.label}\`);

      const propKeys = Object.keys(node.props || {});
      if (propKeys.length > 0) {
        console.log(\`\${indent}   props: \${propKeys.join(", ")}\`);
      }

      if (node.children?.length) {
        printTree(node.children, depth + 1);
      }
    });
  };
  printTree(app.componentTree);

  console.log("\\n📊 요약:");
  const countNodes = (nodes: any[]): number =>
    nodes?.reduce((sum: number, n: any) =>
      sum + 1 + (n.children ? countNodes(n.children) : 0), 0) || 0;
  console.log("  총 컴포넌트:", countNodes(app.componentTree), "개");
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: AI 가 자연어 설명을 분석해서 어떤 UI 요소가 필요한지 파악하고 트리 구조로 만들어요.",
        "컴포넌트 트리는 React 의 Virtual DOM 과 비슷한 개념 — UI 의 '설계도' 역할을 합니다.",
        "props 는 각 컴포넌트의 설정값 — 텍스트, 색상, 크기, 이벤트 핸들러 등이 들어가요.",
        "실무에서는 이 JSON 을 React 컴포넌트로 동적 렌더링해서 라이브 프리뷰를 만들어요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 속성 설정 생성 — 컴포넌트별 세부 속성 자동 구성

컴포넌트 트리가 만들어졌으면, 각 컴포넌트의 **세부 속성(==props==)** 을 더 풍부하게 설정해야 해요. AI 가 컴포넌트 타입과 앱 맥락을 분석해서 적절한 스타일·텍스트·이벤트 등을 자동으로 구성합니다. 이게 바로 속성 패널에 표시되는 편집 가능한 값들이에요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 컴포넌트 속성 상세 설정 생성
const componentTree = [
  {
    id: "comp-1",
    type: "header",
    label: "앱 헤더",
    props: { title: "오늘의 할 일" },
  },
  {
    id: "comp-2",
    type: "form",
    label: "할 일 입력 폼",
    props: { fields: ["text"] },
  },
  {
    id: "comp-3",
    type: "list",
    label: "할 일 목록",
    props: { items: "todos" },
  },
  {
    id: "comp-4",
    type: "stat",
    label: "완료 통계",
    props: { label: "완료율" },
  },
];

const appContext = "할 일 관리 앱 — 할 일 추가/완료/삭제, 진행률 표시";

const systemPrompt = \`너는 노코드 앱 빌더의 속성 설정 엔진이야.
컴포넌트 트리와 앱 설명을 받아서, 각 컴포넌트의 상세 속성을 생성해.

[응답 형식 — JSON]
{
  "components": [
    {
      "id": "컴포넌트 ID",
      "type": "컴포넌트 타입",
      "props": {
        "기존 속성": "유지",
        "추가된 속성": "새 값"
      },
      "style": {
        "tailwindClasses": "Tailwind CSS 클래스 문자열",
        "customCSS": { "인라인 스타일 (필요 시)" }
      },
      "events": {
        "onClick": "액션 이름 또는 null",
        "onChange": "액션 이름 또는 null"
      },
      "responsive": {
        "mobile": "모바일 조정 사항",
        "desktop": "데스크톱 조정 사항"
      },
      "accessibility": {
        "ariaLabel": "접근성 라벨",
        "role": "ARIA 역할"
      }
    }
  ],
  "themeTokens": {
    "primary": "주요 색상",
    "secondary": "보조 색상",
    "background": "배경 색상",
    "text": "텍스트 색상",
    "border": "테두리 색상",
    "radius": "테두리 둥글기"
  }
}

[규칙]
- 컴포넌트 타입에 맞는 속성만 추가 (header 에 onSubmit 넣지 않기)
- Tailwind CSS 클래스 사용 (인라인 스타일 최소화)
- 접근성(a11y) 속성 필수 포함
- 반응형 조정 포함 (모바일/데스크톱)
- 테마 토큰은 전체 앱에 일관되게 적용\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: \`앱 설명: \${appContext}\\n\\n컴포넌트 트리:\\n\${JSON.stringify(componentTree, null, 2)}\`,
    },
  ],
});

try {
  const result = JSON.parse(res.text);
  console.log("⚙️ 속성 설정 생성 결과");
  console.log("═".repeat(50));

  result.components?.forEach((comp: any) => {
    console.log(\`\\n📦 [\${comp.id}] \${comp.type}\`);

    console.log("  📋 Props:");
    Object.entries(comp.props || {}).forEach(([k, v]) => {
      const val = typeof v === "object" ? JSON.stringify(v) : v;
      console.log(\`     \${k}: \${val}\`);
    });

    if (comp.style?.tailwindClasses) {
      console.log("  🎨 Style:", comp.style.tailwindClasses);
    }

    if (comp.events) {
      const evts = Object.entries(comp.events).filter(([, v]) => v);
      if (evts.length > 0) {
        console.log("  ⚡ Events:", evts.map(([k, v]) => \`\${k}→\${v}\`).join(", "));
      }
    }

    if (comp.accessibility?.ariaLabel) {
      console.log("  ♿ A11y:", comp.accessibility.ariaLabel);
    }
  });

  if (result.themeTokens) {
    console.log("\\n🎨 테마 토큰:");
    Object.entries(result.themeTokens).forEach(([k, v]) => {
      console.log(\`  \${k}: \${v}\`);
    });
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 기본 트리에 스타일·이벤트·접근성·반응형 속성을 추가해서 '완성된 설계도' 를 만들어요.",
        "Tailwind CSS 클래스를 사용하면 스타일을 문자열로 저장/수정할 수 있어 노코드에 딱 맞아요.",
        "접근성(a11y) 속성은 스크린 리더 사용자를 위한 것 — 실무에서 필수예요.",
        "테마 토큰은 색상·폰트를 한 곳에서 관리해서 전체 앱의 일관성을 유지합니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 데이터 바인딩 로직 — 컴포넌트 간 상태 연결

컴포넌트가 있고 속성도 설정됐지만, 아직 **데이터가 흐르지 않아요**. 폼에서 입력한 값이 목록에 추가되고, 체크박스를 누르면 통계가 업데이트되려면 ==데이터 바인딩==이 필요합니다. AI 가 컴포넌트 간 데이터 흐름을 분석해서 ==상태 관리== 로직을 자동 생성해요.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 데이터 바인딩 로직 생성 — 컴포넌트 간 상태 흐름
const appComponents = [
  { id: "comp-1", type: "header", label: "앱 헤더" },
  { id: "comp-2", type: "form", label: "할 일 입력 폼", events: { onSubmit: "addTodo" } },
  { id: "comp-3", type: "list", label: "할 일 목록", events: { onCheck: "toggleTodo", onDelete: "deleteTodo" } },
  { id: "comp-4", type: "stat", label: "완료 통계" },
];

const appContext = "할 일 관리 앱 — 새 할 일 추가, 완료 토글, 삭제, 완료율 통계";

const systemPrompt = \`너는 노코드 앱 빌더의 데이터 바인딩 엔진이야.
컴포넌트 목록과 앱 설명을 분석해서 데이터 흐름(상태 + 액션 + 바인딩)을 설계해.

[응답 형식 — JSON]
{
  "stateSchema": {
    "상태이름": {
      "type": "string | number | boolean | array | object",
      "initial": "초기값",
      "description": "설명"
    }
  },
  "actions": [
    {
      "name": "액션 이름",
      "trigger": "어떤 이벤트가 발생할 때",
      "sourceComponent": "이벤트 발생 컴포넌트 ID",
      "logic": "수행할 로직 설명",
      "stateChanges": ["변경되는 상태 이름들"],
      "pseudocode": "의사 코드"
    }
  ],
  "bindings": [
    {
      "componentId": "컴포넌트 ID",
      "property": "바인딩할 속성",
      "stateKey": "연결할 상태 이름",
      "transform": "변환 로직 (있으면)",
      "direction": "read | write | two-way"
    }
  ],
  "derivedState": [
    {
      "name": "파생 상태 이름",
      "dependsOn": ["의존하는 상태들"],
      "compute": "계산 로직 설명",
      "pseudocode": "의사 코드"
    }
  ]
}

[규칙]
- 상태는 최소화 (파생 가능한 것은 derivedState 로)
- 단방향 데이터 흐름 원칙 (state → UI, event → action → state)
- 불변성 유지 (배열은 새 배열로 교체)
- 비동기 액션은 loading/error 상태 포함\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: \`앱: \${appContext}\\n\\n컴포넌트:\\n\${JSON.stringify(appComponents, null, 2)}\`,
    },
  ],
});

try {
  const data = JSON.parse(res.text);
  console.log("🔗 데이터 바인딩 설계 결과");
  console.log("═".repeat(50));

  console.log("\\n📦 상태 스키마:");
  Object.entries(data.stateSchema || {}).forEach(([name, info]: [string, any]) => {
    console.log(\`  \${name} (\${info.type}): \${info.description}\`);
    console.log(\`    초기값: \${JSON.stringify(info.initial)}\`);
  });

  console.log("\\n⚡ 액션:");
  data.actions?.forEach((action: any) => {
    console.log(\`  🎯 \${action.name}\`);
    console.log(\`     트리거: \${action.trigger}\`);
    console.log(\`     소스: \${action.sourceComponent}\`);
    console.log(\`     변경: \${action.stateChanges?.join(", ")}\`);
    if (action.pseudocode) {
      console.log(\`     코드: \${action.pseudocode}\`);
    }
  });

  console.log("\\n🔗 바인딩:");
  data.bindings?.forEach((b: any) => {
    const arrow = b.direction === "two-way" ? "↔" : b.direction === "write" ? "←" : "→";
    console.log(\`  [\${b.componentId}].\${b.property} \${arrow} \${b.stateKey}\`);
    if (b.transform) {
      console.log(\`    변환: \${b.transform}\`);
    }
  });

  if (data.derivedState?.length) {
    console.log("\\n📐 파생 상태:");
    data.derivedState.forEach((d: any) => {
      console.log(\`  \${d.name} = f(\${d.dependsOn?.join(", ")})\`);
      console.log(\`    계산: \${d.compute}\`);
    });
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 데이터 바인딩은 '어떤 데이터가 어떤 컴포넌트에 연결되는지' 를 정의하는 거예요.",
        "단방향 데이터 흐름: 상태 → UI 렌더링 → 이벤트 → 액션 → 상태 변경 → UI 업데이트",
        "파생 상태(derived state)는 다른 상태에서 계산되는 값 — 완료율 = 완료 수 / 전체 수",
        "실무 노코드 도구(Bubble, Retool)도 이런 바인딩 시스템을 시각적 UI 로 제공해요.",
      ],
    },

    // ─── Part B: 풀스택 구현 레시피 ───
    {
      type: "markdown",
      source: `## Part B: AI 노코드 앱 빌더 만들기 (160분)

> 🛠️ Part B 는 Claude Code 또는 Cursor 에서 아래 ==프롬프트==를 사용해 만들어요.
> 코드를 직접 입력하는 게 아니라, AI 에게 지시해서 프로젝트를 생성합니다.

---

### 🔧 기술 스택

| 영역 | 기술 | 역할 |
|---|---|---|
| 프론트엔드 | React + TypeScript + Vite | ==SPA== 기반 빌더 UI |
| 스타일 | Tailwind CSS | 유틸리티 기반 동적 스타일링 |
| AI | @google/genai (Gemini) | 자연어 → 컴포넌트 트리 변환 |
| 상태 관리 | Zustand | 컴포넌트 트리 + 앱 상태 관리 |
| 코드 생성 | 자체 구현 | JSON 트리 → HTML/React 코드 변환 |
| 저장 | localStorage | 프로젝트 저장/불러오기 |
| 배포 (선택) | Vercel API | 생성된 앱 원클릭 배포 |

---

### 📐 데이터 모델

\`\`\`
ComponentNode
├── id (string)              ← 고유 ID
├── type (string)            ← header | form | list | card | button | stat | chart | text | container
├── label (string)           ← 컴포넌트 표시 이름
├── props (Record<string, any>) ← 컴포넌트별 속성
├── style (object)           ← Tailwind 클래스 + 커스텀 CSS
├── events (Record<string, string>) ← 이벤트 → 액션 매핑
├── children (ComponentNode[]) ← 자식 컴포넌트
└── order (number)           ← 동일 레벨 내 순서

AppProject
├── id (string)
├── name (string)
├── description (string)
├── componentTree (ComponentNode[])
├── stateSchema (Record<string, StateField>)
├── actions (Action[])
├── bindings (Binding[])
├── theme (ThemeConfig)
├── createdAt (string)
└── updatedAt (string)

StateField
├── type (string)            ← string | number | boolean | array | object
├── initial (any)
└── description (string)

Binding
├── componentId (string)
├── property (string)
├── stateKey (string)
├── direction (string)       ← read | write | two-way
└── transform (string | null)

ThemeConfig
├── primaryColor (string)
├── secondaryColor (string)
├── backgroundColor (string)
├── textColor (string)
├── borderRadius (string)
└── mode (string)            ← light | dark
\`\`\`

---

### 🚀 Claude Code / Cursor 프롬프트

아래 프롬프트를 복사해서 터미널(Claude Code) 또는 Composer(Cursor) 에 붙여 넣으세요:

\`\`\`
AI 노코드 앱 빌더를 만들어줘.

[기술 스택]
- React + TypeScript + Vite + Tailwind CSS
- @google/genai (Gemini 2.0 Flash)
- Zustand (상태 관리)
- localStorage (프로젝트 저장)

[필수 기능]

1. 자연어 앱 설명 입력
   - 왼쪽 패널에 텍스트 영역 (textarea)
   - "어떤 앱을 만들고 싶나요?" 플레이스홀더
   - "AI로 생성" 버튼 → Gemini 에게 전달
   - 생성 중 로딩 스피너 표시
   - 예시 프롬프트 3개 원클릭 입력 버튼

2. AI 컴포넌트 트리 생성
   - Gemini 에게 자연어 → 컴포넌트 트리 JSON 변환 요청
   - 지원 컴포넌트: header, form, list, card, button, stat, chart, text, container, image, nav, footer
   - 트리 구조 시각화 (들여쓰기 + 아이콘)
   - 컴포넌트 클릭 → 속성 패널에 표시

3. 라이브 프리뷰 패널 (가운데)
   - 컴포넌트 트리를 실시간 React 렌더링
   - 각 컴포넌트 타입별 기본 렌더러 구현
   - 컴포넌트 호버 시 파란색 테두리 하이라이트
   - 컴포넌트 클릭 시 속성 패널 연동
   - 반응형 프리뷰 (모바일/태블릿/데스크톱 전환)

4. 컴포넌트 속성 편집 사이드바 (오른쪽)
   - 선택한 컴포넌트의 props 편집 UI
   - 타입별 에디터: text→input, color→color picker, boolean→toggle
   - Tailwind 클래스 입력 (자동완성 도움)
   - 변경 즉시 프리뷰에 반영

5. 드래그로 순서 변경
   - 컴포넌트 트리에서 드래그&드롭으로 순서 변경
   - 같은 레벨 내에서만 이동 가능
   - 드래그 중 시각적 피드백 (반투명 + 삽입 위치 표시)

6. 데이터 바인딩 (Mock 데이터 소스)
   - 상태 스키마 정의 패널
   - Mock 데이터 소스 (todos, users, products 등)
   - 컴포넌트 속성에 상태 연결 UI
   - 바인딩된 데이터로 프리뷰 렌더링

7. 테마 커스터마이저
   - 색상 팔레트 선택 (Blue, Green, Purple, Red, Orange)
   - 다크/라이트 모드 전환
   - 테두리 둥글기 조절 (none/sm/md/lg/full)
   - 전체 앱에 즉시 적용

8. HTML/React 코드 내보내기
   - "코드 보기" 탭 — 생성된 HTML 코드 표시
   - "React 코드" 탭 — React + Tailwind 컴포넌트 코드 표시
   - 코드 하이라이팅 (Prism.js 또는 highlight.js)
   - 클립보드 복사 버튼

9. Vercel API 배포 개념 (UI만)
   - "배포" 버튼 → 배포 설정 모달
   - 프로젝트명, 도메인 설정 UI
   - 배포 진행 시뮬레이션 (프로그레스 바)
   - 완료 시 가상 URL 표시
   - 실제 Vercel API 호출은 선택 (API 키 필요)

10. 프로젝트 저장/불러오기
    - localStorage 에 프로젝트 JSON 저장
    - 프로젝트 목록 페이지
    - 프로젝트 복제/삭제
    - JSON 파일로 내보내기/가져오기

11. UI/UX
    - 3-패널 레이아웃 (왼쪽: 입력+트리, 가운데: 프리뷰, 오른쪽: 속성)
    - 다크/라이트 모드 토글
    - 반응형 (모바일에서는 탭 전환)
    - Toast 알림
    - 키보드 단축키 (Ctrl+S 저장, Ctrl+Z 되돌리기)
    - Undo/Redo 기능

[환경 변수]
VITE_GEMINI_API_KEY=your-gemini-key
VITE_VERCEL_TOKEN=your-vercel-token (선택)
\`\`\`

---

### 📁 예상 폴더 구조

\`\`\`
src/
├── components/
│   ├── builder/          # AppDescriptionInput, ComponentTreeView
│   ├── preview/          # LivePreview, ComponentRenderer, ResponsiveFrame
│   ├── properties/       # PropertyPanel, PropEditor, StyleEditor
│   ├── binding/          # DataBindingPanel, StateSchemaEditor
│   ├── theme/            # ThemeCustomizer, ColorPicker, ModeToggle
│   ├── export/           # CodeExportPanel, HTMLExporter, ReactExporter
│   ├── deploy/           # DeployModal, DeployProgress
│   ├── project/          # ProjectList, ProjectCard, ImportExport
│   └── ui/               # Button, Input, Modal, Toast, Tabs
├── renderers/
│   ├── HeaderRenderer.tsx
│   ├── FormRenderer.tsx
│   ├── ListRenderer.tsx
│   ├── CardRenderer.tsx
│   ├── StatRenderer.tsx
│   ├── ChartRenderer.tsx
│   └── index.tsx          # 렌더러 레지스트리
├── stores/
│   ├── builderStore.ts    # 컴포넌트 트리 상태
│   ├── themeStore.ts      # 테마 설정
│   └── projectStore.ts    # 프로젝트 저장/불러오기
├── lib/
│   ├── gemini.ts          # Gemini AI 클라이언트
│   ├── codeGenerator.ts   # JSON → HTML/React 코드 변환
│   ├── mockData.ts        # Mock 데이터 소스
│   └── vercel.ts          # Vercel 배포 (선택)
├── types/
│   └── builder.ts         # ComponentNode, AppProject 등 타입
├── App.tsx
└── main.tsx
\`\`\``,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제

기본 빌더가 완성되면 아래 기능을 추가해 보세요!

### 도전 1: AI 대화형 수정 💬
\`\`\`
빌더에 대화형 수정 기능을 추가해줘.

- 프리뷰에서 컴포넌트를 선택하고 "이 버튼 색상을 빨간색으로 바꿔" 입력
- 자연어로 속성 수정 요청 → AI 가 해당 컴포넌트 props 업데이트
- "목록 아래에 페이지네이션 추가해줘" → 트리에 새 컴포넌트 추가
- 변경 이력 (diff) 표시
- 채팅 형태 UI
\`\`\`

### 도전 2: 커스텀 컴포넌트 등록 🧩
\`\`\`
사용자가 직접 컴포넌트를 만들어서 등록할 수 있게 해줘.

- 컴포넌트 에디터 (이름, 아이콘, props 스키마 정의)
- React 코드 직접 입력 또는 AI 생성
- 컴포넌트 라이브러리 패널
- 커뮤니티 공유 (localStorage 간 JSON 교환)
- 버전 관리
\`\`\`

### 도전 3: 반응형 레이아웃 빌더 📱
\`\`\`
반응형 레이아웃을 시각적으로 편집할 수 있게 해줘.

- Grid/Flex 레이아웃 시각적 편집
- 모바일/태블릿/데스크톱 별도 레이아웃
- 브레이크포인트별 속성 오버라이드
- 드래그로 컬럼 크기 조절
- 프리뷰에서 디바이스 전환
\`\`\`

### 도전 4: 실제 Vercel 배포 🚀
\`\`\`
생성된 앱을 실제 Vercel 에 배포하는 기능을 구현해줘.

- Vercel API (v13) 연동
- 생성된 HTML/React 코드를 파일로 변환
- 배포 진행 상태 실시간 표시
- 배포 완료 시 실제 URL 제공
- 배포 이력 관리
- 커스텀 도메인 설정 UI
\`\`\`

### 도전 5: 멀티 페이지 + 라우팅 📄
\`\`\`
단일 페이지가 아닌 멀티 페이지 앱을 만들 수 있게 해줘.

- 페이지 추가/삭제/이름 변경
- 페이지 간 네비게이션 설정
- 공유 컴포넌트 (헤더/푸터 = 모든 페이지에 적용)
- 페이지별 레이아웃
- URL 파라미터 바인딩
\`\`\``,
    },

    // ─── 핵심 개념 정리 ───
    {
      type: "markdown",
      source: `## 📚 핵심 개념 정리

### 이 워크샵에서 배운 것

| 개념 | 설명 | 활용 |
|---|---|---|
| ==노코드== | 코드 없이 앱을 만드는 방식 | 자연어 입력 → UI 자동 생성 |
| ==컴포넌트 트리== | UI 블록의 부모-자식 계층 구조 | JSON 으로 앱 구조를 표현 |
| ==Props== | 컴포넌트의 설정값 (속성) | 텍스트·색상·크기·이벤트 편집 |
| ==데이터 바인딩== | 컴포넌트와 상태를 연결 | 폼 입력 → 목록 반영 자동화 |
| ==상태 관리== | 앱 데이터의 중앙 저장소 | Zustand 로 트리 + 테마 관리 |
| 동적 렌더링 | JSON → React 컴포넌트 변환 | 라이브 프리뷰 실시간 표시 |
| 코드 생성 | 시각적 편집 → 코드 출력 | HTML/React 내보내기 |

### 실무에서 이 기술이 쓰이는 곳

- **Bubble** — 가장 유명한 노코드 앱 빌더 (드래그 & 드롭 + 데이터베이스)
- **Webflow** — 시각적 웹사이트 빌더 (디자이너 최적화)
- **Retool** — 내부 도구 빌더 (DB 연결 + 컴포넌트 조합)
- **v0 by Vercel** — AI 로 UI 생성하는 서비스 (이 워크샵과 가장 유사!)
- **Framer** — AI + 시각적 빌더 결합 (자연어 → 웹사이트)
- **Glide** — 스프레드시트 → 모바일 앱 자동 변환
- **FlutterFlow** — 시각적 Flutter 앱 빌더`,
    },
  ],

  quiz: {
    title: "W38: AI 노코드 앱 빌더 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "AI 노코드 빌더에서 자연어 입력을 컴포넌트 트리 JSON 으로 변환할 때, 컴포넌트 노드에 포함되지 **않는** 것은?",
        options: [
          "컴포넌트 타입 (header, form, list 등)",
          "컴포넌트별 속성 (props)",
          "사용자의 브라우저 정보",
          "자식 컴포넌트 배열 (children)",
        ],
        correctIndex: 2,
        explanation:
          "컴포넌트 트리 JSON 에는 타입·속성·자식 등 UI 구조 정보가 들어갑니다. 사용자의 브라우저 정보는 UI 설계와 무관한 런타임 환경 정보이므로 컴포넌트 트리에 포함하지 않아요.",
      },
      {
        type: "multiple-choice",
        question:
          "노코드 빌더에서 '데이터 바인딩'의 역할을 가장 정확하게 설명한 것은?",
        options: [
          "컴포넌트의 CSS 스타일을 자동으로 적용하는 것",
          "컴포넌트와 상태(데이터)를 연결해서 데이터 변경 시 UI가 자동 업데이트되게 하는 것",
          "컴포넌트를 드래그해서 순서를 바꾸는 것",
          "생성된 코드를 서버에 배포하는 것",
        ],
        correctIndex: 1,
        explanation:
          "데이터 바인딩은 컴포넌트의 속성과 앱의 상태(데이터)를 연결하는 것입니다. 예를 들어, 할 일 목록 컴포넌트를 todos 배열에 바인딩하면, 새 할 일이 추가될 때 목록이 자동으로 업데이트돼요.",
      },
      {
        type: "multiple-choice",
        question:
          "속성 편집 패널에서 Tailwind CSS 클래스를 문자열로 관리하는 이유는?",
        options: [
          "Tailwind 이 가장 빠른 CSS 프레임워크여서",
          "클래스 문자열을 쉽게 저장·수정·교체할 수 있어 노코드 편집에 적합해서",
          "인라인 스타일보다 파일 크기가 작아서",
          "다른 CSS 프레임워크는 React 와 호환되지 않아서",
        ],
        correctIndex: 1,
        explanation:
          "Tailwind CSS 의 유틸리티 클래스는 문자열 형태('bg-blue-500 p-4 rounded-lg')이므로 JSON 으로 저장하고, 속성 패널에서 수정하고, 즉시 프리뷰에 반영하기 편합니다. 노코드 빌더에서 스타일을 동적으로 다루기에 최적이에요.",
      },
      {
        type: "multiple-choice",
        question:
          "파생 상태(derived state)를 별도로 관리하는 이유는?",
        options: [
          "코드가 더 복잡해 보여서",
          "원본 상태 하나만 수정하면 관련 파생값이 자동으로 업데이트되어 일관성이 보장돼서",
          "데이터베이스 저장 공간을 절약하기 위해서",
          "AI 가 파생 상태만 생성할 수 있어서",
        ],
        correctIndex: 1,
        explanation:
          "완료율 같은 파생 상태를 직접 저장하면 todos 배열이 바뀔 때마다 수동으로 동기화해야 합니다. 파생 상태로 관리하면 원본(todos)이 바뀔 때 자동으로 재계산되어 데이터 불일치를 방지해요.",
      },
      {
        type: "predict-output",
        question:
          "다음 코드에서 컴포넌트 트리의 총 노드 수를 계산합니다. 출력 결과는?",
        code: `const tree = [
  { id: "h1", type: "header", children: [] },
  { id: "c1", type: "container", children: [
    { id: "f1", type: "form", children: [] },
    { id: "l1", type: "list", children: [
      { id: "card1", type: "card", children: [] },
    ]},
  ]},
  { id: "ft1", type: "footer", children: [] },
];

const count = (nodes) =>
  nodes.reduce((sum, n) => sum + 1 + count(n.children || []), 0);

console.log("Total:", count(tree));`,
        options: [
          "Total: 3",
          "Total: 5",
          "Total: 6",
          "Total: 7",
        ],
        correctIndex: 2,
        explanation:
          "트리를 재귀적으로 탐색합니다. 최상위: h1(1) + c1(1) + ft1(1) = 3. c1의 자식: f1(1) + l1(1) = 2. l1의 자식: card1(1) = 1. 합계: 3 + 2 + 1 = 6개. 재귀 함수가 모든 깊이의 노드를 빠짐없이 셉니다.",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W28 — AI 프레젠테이션 메이커.
 *
 * Part A: 플랫폼에서 AI 슬라이드 구조 생성 + 발표 노트 + 디자인 테마 체험 (LLM 셀)
 * Part B: MD 레시피로 Reveal.js 기반 프레젠테이션 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW28: Lesson = {
  id: "ai-eng-w28-presentation-maker",
  language: "ai-engineering",
  track: "beginner",
  order: 128,
  title: "W28: AI 프레젠테이션 메이커",
  subtitle: "주제 입력하면 AI가 슬라이드 + 발표 노트 자동 생성",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 🎤 AI 프레젠테이션 메이커 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**주제와 청중·발표 시간을 입력하면 AI 가 슬라이드 구조·내용·발표 노트를 자동 생성하고, ==Reveal.js== 로 실시간 프레젠테이션까지 가능한 슬라이드 메이커** — 인라인 편집, 발표자 모드(타이머+노트), 테마 선택, PDF 내보내기까지!

### 완성 모습
\`\`\`
┌─ AI 프레젠테이션 메이커 ───────────────────────────────────────────┐
│  🎤 Presentation Maker      [▶️ 발표] [📥 PDF] [🌙 다크모드]       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📝 주제: [React 상태 관리 베스트 프랙티스          ]                │
│  👥 청중: [주니어 프론트엔드 개발자  ▼]  ⏱️ 시간: [20분 ▼]          │
│  [✨ AI 슬라이드 생성]                                               │
│                                                                      │
│  ┌─ 슬라이드 미리보기 ──────────────────────────────────┐            │
│  │                                                       │            │
│  │           React 상태 관리                              │            │
│  │           베스트 프랙티스                               │            │
│  │                                                       │            │
│  │           발표자: 홍길동                                │            │
│  │           2026.04.17                                   │            │
│  │                                              [1 / 12] │            │
│  └───────────────────────────────────────────────────────┘            │
│                                                                      │
│  ┌─ 슬라이드 목록 ─┐  ┌─ 발표 노트 ──────────────────────────┐      │
│  │ 1. 📄 표지      │  │ 🗣️ "안녕하세요, 오늘은 React 상태   │      │
│  │ 2. 📊 목차      │  │ 관리에 대해 이야기하겠습니다.         │      │
│  │ 3. 💡 왜 상태?  │  │ 먼저 왜 상태 관리가 중요한지..."     │      │
│  │ 4. 🔧 useState  │  │                                      │      │
│  │ 5. 📦 Context   │  │ ⏱️ 예상 소요: 1분 30초                │      │
│  │ 6. 🏪 Zustand   │  └──────────────────────────────────────┘      │
│  │ 7. 📈 비교표    │                                                 │
│  │ 8. 🎯 결론      │  ┌─ 테마 ────┐                                  │
│  └─────────────────┘  │ 🌊 Ocean  │                                  │
│                       │ 🌿 Forest │                                  │
│  [✏️ 편집모드]        │ 🔥 Sunset │                                  │
│  [🖨️ PDF 내보내기]   │ 🖤 Minimal│                                  │
│                       └───────────┘                                  │
└──────────────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | AI 슬라이드 구조 생성 + 발표 노트 + 디자인 테마 제안 | 50분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 프레젠테이션 웹앱 완성 | 100분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)`,
    },

    // ─── Part A: 프레젠테이션 AI 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: 프레젠테이션 AI 두뇌 만들기 (50분)

좋은 발표는 구조가 탄탄해야 합니다. ==Reveal.js== 는 HTML/마크다운 기반 ==프레젠테이션 프레임워크== 로, 브라우저에서 키보드 네비게이션·전환 애니메이션·발표자 노트를 지원해요.

핵심 개념 3가지:
1. **AI 슬라이드 구조 생성** — 주제+청중+시간 → 슬라이드별 제목·내용·레이아웃 JSON
2. **AI 발표 노트** — 각 슬라이드에 맞는 자연스러운 발표 스크립트 + 예상 소요 시간
3. **디자인 테마 제안** — 주제 분위기에 맞는 색상·폰트·전환 효과 추천

### 셀 실행 방법
1. 각 코드 셀의 ▶️ 버튼을 클릭하세요.
2. AI 가 JSON 형식으로 프레젠테이션 구조를 생성합니다.
3. 힌트(💡)를 참고하면 결과를 더 잘 이해할 수 있어요.`,
    },

    // ─── LLM 셀 1: 슬라이드 구조 생성 ───
    {
      type: "markdown",
      source: `### 🎯 실습 1: AI 슬라이드 구조 생성

주제, 대상 청중, 발표 시간을 입력하면 AI 가 **슬라이드별 제목·핵심 내용·레이아웃 타입** 을 JSON 으로 생성합니다.

> ==Reveal.js== 의 \`<section>\` 태그 하나가 슬라이드 한 장이에요. 이 JSON 을 기반으로 HTML 을 자동 생성할 수 있습니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 🎤 AI 슬라이드 구조 생성기
const topic = "React 상태 관리 베스트 프랙티스";
const audience = "주니어 프론트엔드 개발자";
const durationMinutes = 20;

const systemPrompt = \`너는 프레젠테이션 구조 설계 전문가야.
사용자가 주제, 청중, 발표 시간을 주면 아래 JSON 형식으로 슬라이드를 설계해:

{
  "title": "프레젠테이션 제목",
  "slideCount": number,
  "estimatedMinutes": number,
  "slides": [
    {
      "index": number,
      "type": "cover | toc | content | comparison | code | chart | quote | closing",
      "title": "슬라이드 제목",
      "subtitle": "부제목 (선택)",
      "bullets": ["핵심 포인트 1", "핵심 포인트 2"],
      "visualHint": "이미지/다이어그램/차트 등 시각 요소 제안",
      "estimatedSeconds": number
    }
  ],
  "structureTips": ["구조 팁1", "팁2"]
}

규칙:
- 첫 슬라이드는 반드시 cover (표지), 마지막은 closing (Q&A/마무리)
- 발표 시간에 맞게 슬라이드 수를 조절 (보통 1장 = 1~2분)
- 청중 수준에 맞는 용어와 깊이 설정
- bullets 는 최대 5개, 각 30자 이내
- type 에 따라 레이아웃이 달라지므로 정확하게 분류
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`주제: \${topic}\\n청중: \${audience}\\n발표 시간: \${durationMinutes}분\\n\\n이 조건에 맞는 슬라이드 구조를 설계해줘.\` },
  ],
});

try {
  const deck = JSON.parse(res.text);
  console.log("🎤 AI 슬라이드 구조");
  console.log("═".repeat(55));
  console.log(\`📌 제목: \${deck.title}\`);
  console.log(\`📊 슬라이드: \${deck.slideCount}장 | ⏱️ 예상: \${deck.estimatedMinutes}분\`);

  deck.slides?.forEach((s: any) => {
    const icon: Record<string, string> = {
      cover: "📄", toc: "📋", content: "💡", comparison: "⚖️",
      code: "💻", chart: "📊", quote: "💬", closing: "🎯",
    };
    console.log(\`\\n\${icon[s.type] ?? "📌"} [\${s.index}] \${s.title} (\${s.type})\`);
    if (s.subtitle) console.log(\`   ↳ \${s.subtitle}\`);
    s.bullets?.forEach((b: string) => console.log(\`   • \${b}\`));
    if (s.visualHint) console.log(\`   🖼️ \${s.visualHint}\`);
    console.log(\`   ⏱️ \${s.estimatedSeconds}초\`);
  });

  if (deck.structureTips?.length) {
    console.log("\\n💡 구조 팁:");
    deck.structureTips.forEach((t: string, i: number) =>
      console.log(\`  \${i + 1}. \${t}\`)
    );
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "cover 타입 슬라이드는 Reveal.js 에서 data-background-image 를 활용하면 임팩트 있어요.",
        "comparison 타입은 2단 레이아웃(CSS grid)으로 좌우 비교 구조를 만들 수 있습니다.",
        "estimatedSeconds 를 합산하면 총 발표 시간이 되어 발표자 타이머에 활용합니다.",
        "toc (목차) 슬라이드는 Reveal.js fragment 로 순차 노출하면 효과적이에요.",
      ],
    },

    // ─── LLM 셀 2: 발표 노트 생성 ───
    {
      type: "markdown",
      source: `### 🗣️ 실습 2: AI 발표 노트 생성

슬라이드 제목과 내용을 입력하면 AI 가 **자연스러운 발표 스크립트** 와 **슬라이드별 예상 시간** 을 생성합니다.

> ==Reveal.js== 의 \`<aside class="notes">\` 태그에 넣으면 발표자 모드(S 키)에서 노트가 표시돼요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 🗣️ AI 발표 노트 생성기
const slides = [
  { index: 1, type: "cover", title: "React 상태 관리 베스트 프랙티스", bullets: [] },
  { index: 2, type: "toc", title: "오늘 다룰 내용", bullets: ["왜 상태 관리?", "useState vs Context", "Zustand 실전", "비교 정리"] },
  { index: 3, type: "content", title: "왜 상태 관리가 중요한가?", bullets: ["UI 일관성", "데이터 흐름 예측", "디버깅 용이성"] },
  { index: 4, type: "code", title: "useState — 가장 기본적인 상태", bullets: ["로컬 상태에 최적", "간단한 카운터 예제", "한계: prop drilling"] },
];

const systemPrompt = \`너는 프레젠테이션 발표 코치야.
슬라이드 목록을 받으면 각 슬라이드에 대해 아래 JSON 형식으로 발표 노트를 작성해:

{
  "notes": [
    {
      "slideIndex": number,
      "script": "자연스럽게 읽을 수 있는 발표 스크립트 (2~4문장)",
      "keyMessage": "이 슬라이드에서 반드시 전달해야 할 핵심 메시지 (1문장)",
      "transition": "다음 슬라이드로 자연스럽게 넘어가는 연결 문구",
      "estimatedSeconds": number,
      "tipsForSpeaker": "발표 팁 (제스처, 강조, 청중 참여 등)"
    }
  ],
  "overallTips": ["전체 발표 팁1", "팁2"]
}

규칙:
- 대화체로 자연스럽게 (읽는 느낌이 아닌 말하는 느낌)
- 청중 참여 유도 포인트를 중간에 넣어
- cover 슬라이드는 인사+자기소개+주제 소개
- closing 슬라이드는 핵심 요약+Q&A 안내
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 슬라이드들의 발표 노트를 만들어줘:\\n\${JSON.stringify(slides, null, 2)}\` },
  ],
});

try {
  const data = JSON.parse(res.text);
  console.log("🗣️ AI 발표 노트");
  console.log("═".repeat(55));

  let totalSeconds = 0;
  data.notes?.forEach((n: any) => {
    totalSeconds += n.estimatedSeconds;
    console.log(\`\\n📌 슬라이드 \${n.slideIndex}\`);
    console.log(\`  📝 스크립트:\`);
    console.log(\`     "\${n.script}"\`);
    console.log(\`  🎯 핵심: \${n.keyMessage}\`);
    console.log(\`  🔗 전환: "\${n.transition}"\`);
    console.log(\`  ⏱️ \${n.estimatedSeconds}초 | 💁 \${n.tipsForSpeaker}\`);
  });

  console.log(\`\\n⏱️ 총 예상 시간: \${Math.floor(totalSeconds / 60)}분 \${totalSeconds % 60}초\`);

  if (data.overallTips?.length) {
    console.log("\\n🎓 전체 발표 팁:");
    data.overallTips.forEach((tip: string, i: number) =>
      console.log(\`  \${i + 1}. \${tip}\`)
    );
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "Reveal.js 발표자 모드(S 키)에서 노트, 다음 슬라이드 미리보기, 타이머가 함께 표시돼요.",
        "transition 문구는 다음 슬라이드 제목을 자연스럽게 언급하는 것이 좋습니다.",
        "estimatedSeconds 를 프로그레스 바에 표시하면 발표 페이스 관리에 유용해요.",
        "발표 노트를 <aside class='notes'> 안에 넣으면 청중에게는 보이지 않아요.",
      ],
    },

    // ─── LLM 셀 3: 디자인 테마 제안 ───
    {
      type: "markdown",
      source: `### 🎨 실습 3: AI 디자인 테마 제안

발표 주제의 분위기에 맞는 **색상 팔레트, 폰트, 전환 효과, 배경 스타일** 을 AI 가 테마 세트로 제안합니다.

> ==Reveal.js== 는 \`data-transition\` 속성으로 slide, fade, convex, concave, zoom 등 전환 효과를 지원해요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 🎨 AI 디자인 테마 제안기
const topic = "React 상태 관리 베스트 프랙티스";
const mood = "전문적이면서 친근한";

const systemPrompt = \`너는 프레젠테이션 디자인 전문가야.
발표 주제와 분위기를 받으면 아래 JSON 형식으로 3가지 테마를 제안해:

{
  "themes": [
    {
      "name": "테마 이름",
      "emoji": "대표 이모지",
      "description": "테마 설명 (1문장)",
      "colors": {
        "background": "#hex",
        "text": "#hex",
        "heading": "#hex",
        "accent": "#hex",
        "codeBackground": "#hex"
      },
      "fonts": {
        "heading": "폰트 이름",
        "body": "폰트 이름",
        "code": "코드 폰트 이름"
      },
      "transition": "slide | fade | convex | concave | zoom",
      "backgroundStyle": "solid | gradient | pattern 설명",
      "slideLayout": "제목 위치·정렬·여백 스타일 설명",
      "cssSnippet": "Reveal.js 커스텀 CSS 핵심 규칙 (3줄 이내)"
    }
  ],
  "recommendation": "추천 테마 이름과 이유"
}
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`주제: \${topic}\\n분위기: \${mood}\\n\\n이 발표에 어울리는 디자인 테마 3가지를 제안해줘.\` },
  ],
});

try {
  const data = JSON.parse(res.text);
  console.log("🎨 AI 디자인 테마 제안");
  console.log("═".repeat(55));

  data.themes?.forEach((t: any, i: number) => {
    console.log(\`\\n\${t.emoji} 테마 \${i + 1}: \${t.name}\`);
    console.log(\`  📝 \${t.description}\`);

    console.log("  🎨 색상:");
    const c = t.colors;
    console.log(\`     배경: \${c.background}  |  텍스트: \${c.text}\`);
    console.log(\`     제목: \${c.heading}  |  액센트: \${c.accent}\`);
    console.log(\`     코드 배경: \${c.codeBackground}\`);

    console.log("  🔤 폰트:");
    console.log(\`     제목: \${t.fonts.heading}  |  본문: \${t.fonts.body}  |  코드: \${t.fonts.code}\`);

    console.log(\`  ✨ 전환: \${t.transition}\`);
    console.log(\`  🖼️ 배경: \${t.backgroundStyle}\`);
    console.log(\`  📐 레이아웃: \${t.slideLayout}\`);

    if (t.cssSnippet) {
      console.log(\`  💻 CSS:\\n     \${t.cssSnippet}\`);
    }
  });

  if (data.recommendation) {
    console.log(\`\\n⭐ 추천: \${data.recommendation}\`);
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "Reveal.js 에서 Reveal.configure({ transition: 'fade' }) 로 전역 전환 효과를 설정해요.",
        "CSS 변수 --r-background-color, --r-main-color 로 Reveal.js 테마를 커스터마이즈합니다.",
        "코드 배경색은 Reveal.js 의 highlight.js 테마와 맞춰야 조화로워요.",
        "Google Fonts 에서 Pretendard, Noto Sans KR 을 로드하면 한글 발표에 최적입니다.",
      ],
    },

    // ─── Part A 완료 + Part B 시작 ───
    {
      type: "markdown",
      source: `## ✅ Part A 완료!

프레젠테이션 AI 두뇌의 세 가지 핵심 엔진을 체험했어요:
- ✅ **슬라이드 구조 생성** — 주제+청중+시간 → 슬라이드별 제목·내용·레이아웃·시간 (JSON)
- ✅ **발표 노트 생성** — 각 슬라이드에 맞는 자연스러운 스크립트 + 전환 문구 + 발표 팁
- ✅ **디자인 테마 제안** — 분위기에 맞는 색상·폰트·전환 효과·CSS 스니펫 3종 세트

이제 이걸 **==Reveal.js== 라이브 프레젠테이션 + 인라인 편집 + 발표자 모드 + PDF 내보내기** 가 붙은 풀스택 앱으로 만듭니다.

---

## Part B: MD 레시피로 풀스택 웹앱 완성 (100분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [AI 프레젠테이션 메이커 웹앱]
\`\`\`

==Reveal.js== 는 HTML 슬라이드 프레임워크로, \`<section>\` 태그 하나가 슬라이드 한 장입니다. React 컴포넌트 안에서 Reveal 인스턴스를 초기화하면 SPA 안에 프레젠테이션 엔진을 내장할 수 있어요.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 프레젠테이션 메이커 제작 요청서

## 프로젝트 개요
주제·청중·발표 시간을 입력하면 AI 가 슬라이드 구조·내용·발표 노트를 자동 생성하고,
Reveal.js 기반으로 라이브 프레젠테이션·편집·PDF 내보내기가 가능한 웹앱을 만들어주세요.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- @google/genai (Gemini SDK — 슬라이드 구조/노트/테마 AI 생성)
- Reveal.js (프레젠테이션 엔진 — 전환, 발표자 모드, 단축키)
- html2pdf.js 또는 print CSS (PDF 내보내기)
- localStorage (발표 저장, 테마 설정)
- Lucide React (아이콘)

## 핵심 기능

### 1. 발표 입력 패널
- 주제 입력 (텍스트)
- 청중 선택 (드롭다운: 비개발자, 주니어 개발자, 시니어 개발자, 경영진, 학생)
- 발표 시간 선택 (5분, 10분, 15분, 20분, 30분)
- [✨ AI 슬라이드 생성] 버튼 → 로딩 중 스피너

### 2. AI 슬라이드 생성
- Gemini API 로 슬라이드 구조 JSON 생성
- 슬라이드별: 제목, 내용(bullets), 타입(cover/toc/content/code/chart/closing), 발표 노트
- 각 슬라이드에 예상 소요 시간 배정
- "다시 생성" 버튼으로 새로운 구조 요청

### 3. Reveal.js 라이브 프레젠테이션
- 생성된 슬라이드를 Reveal.js 로 렌더링
- 키보드 네비게이션 (← → Space)
- 전환 애니메이션 (fade, slide, convex 등)
- 전체화면 모드 (F 키)
- 슬라이드 개요 (ESC 키)

### 4. 인라인 슬라이드 편집
- 슬라이드 제목/내용 클릭하여 직접 수정
- 불릿 포인트 추가/삭제/순서 변경
- 슬라이드 추가/삭제/순서 변경 (드래그 또는 버튼)
- 편집 후 Reveal.js 실시간 반영

### 5. 발표자 모드
- 현재 슬라이드 + 다음 슬라이드 미리보기
- AI 생성 발표 노트 표시
- 발표 타이머 (경과 시간 + 남은 시간)
- 슬라이드별 예상 시간 대비 실제 시간 표시
- 현재 슬라이드 번호 / 전체 슬라이드 수

### 6. 테마 선택
- 기본 제공 테마 4개 이상:
  - 🌊 Ocean (파란 계열, 전문적)
  - 🌿 Forest (녹색 계열, 자연스러운)
  - 🔥 Sunset (주황 계열, 에너지)
  - 🖤 Minimal (흑백, 깔끔)
- 테마 변경 시 Reveal.js 즉시 반영
- 커스텀 색상 선택 가능 (배경, 텍스트, 액센트)

### 7. PDF 내보내기
- 현재 프레젠테이션을 PDF 로 다운로드
- 발표 노트 포함/미포함 옵션
- 슬라이드 번호 표시 옵션
- 파일명: \\\`presentation_[주제]_[날짜].pdf\\\`

### 8. 발표 저장/불러오기
- localStorage 에 발표 자동 저장
- 최근 발표 목록 (최대 10개)
- JSON 파일로 내보내기/가져오기

## UI 레이아웃

### 헤더
- 앱 제목 "🎤 AI 프레젠테이션 메이커"
- [▶️ 발표 시작] [📥 PDF] [💾 저장] [🌙 다크모드]

### 메인 영역 (2컬럼 — 편집 모드)
- 좌측: 슬라이드 미리보기 (Reveal.js 축소 뷰) + 슬라이드 네비게이션
- 우측: 탭 전환식 패널
  - ✨ 생성 탭: 주제/청중/시간 입력 + AI 생성
  - ✏️ 편집 탭: 선택된 슬라이드 내용 편집
  - 🗣️ 노트 탭: 발표 노트 편집
  - 🎨 테마 탭: 테마 선택 + 커스텀 색상

### 전체화면 모드 (발표 모드)
- Reveal.js 전체화면
- S 키로 발표자 모드 (별도 창)
- ESC 로 편집 모드 복귀

## Gemini API 설정
\\\`\\\`\\\`typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

async function generateSlides(topic: string, audience: string, minutes: number) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: \\\`주제: \\\${topic}\\n청중: \\\${audience}\\n시간: \\\${minutes}분\\n\\n슬라이드를 JSON으로 생성해줘...\\\`,
  });
  return JSON.parse(response.text ?? "{}");
}
\\\`\\\`\\\`

## Reveal.js React 연동
\\\`\\\`\\\`typescript
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";

// React 컴포넌트 안에서 초기화
useEffect(() => {
  const deck = new Reveal(deckRef.current!, {
    hash: true,
    transition: "fade",
    plugins: [],
  });
  deck.initialize();
  return () => deck.destroy();
}, [slides]);
\\\`\\\`\\\`

## PDF 내보내기 (print CSS 방식)
\\\`\\\`\\\`typescript
// Reveal.js 공식 PDF 내보내기: ?print-pdf 쿼리 파라미터
// 또는 html2pdf.js 라이브러리로 직접 변환
import html2pdf from "html2pdf.js";

function exportPDF(element: HTMLElement, filename: string) {
  html2pdf()
    .set({
      margin: 0,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "px", format: [1280, 720], orientation: "landscape" },
    })
    .from(element)
    .save();
}
\\\`\\\`\\\`

## 스타일 가이드
- Tailwind 기반 반응형 디자인
- 다크 모드: slate-900 배경, slate-100 텍스트
- 라이트 모드: white 배경, slate-800 텍스트
- 액센트 색상: indigo-500 ~ indigo-600
- 슬라이드 미리보기는 16:9 비율 유지 (aspect-video)
- 편집 모드에서 선택된 슬라이드는 ring-2 ring-indigo-500 강조

## 환경 변수
\\\`\\\`\\\`
VITE_GEMINI_API_KEY=your-gemini-api-key
\\\`\\\`\\\`

## 실행 방법
\\\`\\\`\\\`bash
npm create vite@latest presentation-maker -- --template react-ts
cd presentation-maker
npm install @google/genai reveal.js html2pdf.js lucide-react
npm install -D tailwindcss @tailwindcss/vite
# tailwind.config 및 CSS 설정 후
npm run dev
\\\`\\\`\\\`
\`\`\``,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제

기본 기능을 완성한 뒤 아래 기능을 추가해 보세요!

### 도전 1: 📊 AI 차트 슬라이드
데이터를 입력하면 AI 가 Chart.js 로 시각화한 차트 슬라이드를 자동 생성. 슬라이드 type 이 "chart" 일 때 \`<canvas>\` 를 삽입하고 차트 데이터를 렌더링하세요.

### 도전 2: 🖼️ AI 배경 이미지 검색
슬라이드 주제에 맞는 배경 이미지를 Unsplash API 로 자동 검색. \`data-background-image\` 속성으로 ==Reveal.js== 슬라이드 배경에 적용합니다.

\`\`\`typescript
// Unsplash API 예시
const res = await fetch(
  \`https://api.unsplash.com/search/photos?query=\${keyword}&per_page=5\`,
  { headers: { Authorization: "Client-ID YOUR_KEY" } }
);
\`\`\`

### 도전 3: 🎙️ 음성 리허설 모드
Web Speech API 의 \`SpeechRecognition\` 으로 발표 연습 시 실제 말한 내용을 녹취. AI 가 준비한 스크립트와 비교해 피드백을 제공하세요.

### 도전 4: 👥 실시간 협업
WebSocket 또는 Firebase Realtime DB 를 이용해 여러 사람이 동시에 슬라이드를 편집하는 기능 추가. 커서 위치와 편집 내용을 실시간 동기화합니다.

### 도전 5: 📱 리모컨 모드
QR 코드로 접속하는 모바일 리모컨 페이지를 만들어 스마트폰에서 슬라이드 넘김·레이저 포인터·타이머를 제어하세요.`,
    },
  ],

  quiz: {
    title: "W28: AI 프레젠테이션 메이커 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "Reveal.js 에서 발표자 모드를 여는 단축키는?",
        options: [
          "P 키",
          "S 키",
          "N 키",
          "F 키",
        ],
        correctIndex: 1,
        explanation:
          "Reveal.js 에서 S 키를 누르면 발표자 모드(Speaker View)가 별도 창으로 열립니다. 현재 슬라이드, 다음 슬라이드 미리보기, 발표 노트, 타이머가 표시돼요. F 키는 전체화면입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "Reveal.js 에서 하나의 슬라이드를 나타내는 HTML 태그는?",
        options: [
          "<slide>",
          "<div class=\"slide\">",
          "<section>",
          "<article>",
        ],
        correctIndex: 2,
        explanation:
          "Reveal.js 는 <section> 태그 하나를 슬라이드 한 장으로 인식합니다. <section> 안에 <section> 을 중첩하면 수직 슬라이드(vertical slides)가 됩니다.",
      },
      {
        type: "multiple-choice",
        question:
          "프레젠테이션 PDF 내보내기에서 Reveal.js 가 공식 지원하는 방법은?",
        options: [
          "canvas.toDataURL() 로 각 슬라이드를 이미지로 변환",
          "URL 에 ?print-pdf 쿼리 파라미터를 추가하고 브라우저 인쇄",
          "reveal.export('pdf') 내장 메서드 호출",
          "navigator.clipboard 에 PDF 데이터를 복사",
        ],
        correctIndex: 1,
        explanation:
          "Reveal.js 는 URL 에 ?print-pdf 쿼리 파라미터를 붙이면 모든 슬라이드를 세로로 나열하는 인쇄 전용 레이아웃으로 전환됩니다. 여기서 브라우저의 '인쇄 > PDF 로 저장' 기능을 사용합니다.",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W26 — AI 썸네일 스튜디오.
 *
 * Part A: 플랫폼에서 AI 레이아웃/색상 제안 + 텍스트 배치 체험 (LLM 셀)
 * Part B: MD 레시피로 Canvas API 기반 썸네일 에디터 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW26: Lesson = {
  id: "ai-eng-w26-thumbnail-studio",
  language: "ai-engineering",
  track: "beginner",
  order: 126,
  title: "W26: AI 썸네일 스튜디오",
  subtitle: "주제만 입력하면 AI가 유튜브 썸네일 디자인 완성",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 🎨 AI 썸네일 스튜디오 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**주제를 입력하면 AI 가 레이아웃·색상·텍스트 배치를 제안하고, ==Canvas API== 로 실시간 편집하는 썸네일 에디터** — 유튜브, 인스타, 블로그 등 플랫폼별 최적 사이즈까지 자동 맞춤!

### 완성 모습
\`\`\`
┌─ AI 썸네일 스튜디오 ────────────────────────────────────────────┐
│  🎨 Thumbnail Studio       [💾 저장] [↩️ 실행취소] [🌙 다크모드] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📐 플랫폼:  [YouTube ▼]  1280 × 720                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐         │
│  │                                                     │         │
│  │          ┌───────────────────────┐                  │         │
│  │          │  🤖 AI 추천 레이아웃   │                  │         │
│  │          │                       │                  │         │
│  │          │   "JavaScript 완전정복"│                  │         │
│  │          │    ── 입문자 필수 ──   │                  │         │
│  │          │                       │                  │         │
│  │          └───────────────────────┘                  │         │
│  │    [배경 이미지 업로드]  [🔮 배경 제거]              │         │
│  └─────────────────────────────────────────────────────┘         │
│                                                                  │
│  ┌─ AI 제안 ──────┐  ┌─ 텍스트 편집 ─────┐  ┌─ 템플릿 갤러리 ─┐│
│  │ 🎯 주제 입력:  │  │ 📝 제목 텍스트    │  │ 🖼️ 기술 블로그  ││
│  │ [JavaScript..] │  │ 폰트: [Pretendard]│  │ 🖼️ 브이로그     ││
│  │ [✨ AI 제안]   │  │ 크기: [48px ▼]    │  │ 🖼️ 리뷰 영상   ││
│  │                │  │ 색상: [#FFFFFF ■]  │  │ 🖼️ 튜토리얼    ││
│  │ 🟦 #1E3A5F    │  │ 위치: [중앙 상단]  │  │ 🖼️ 뉴스 속보   ││
│  │ 🟨 #F2C94C    │  │                   │  │                 ││
│  │ 🟩 배경 그라디 │  │ 📝 서브 텍스트    │  │ [적용하기]      ││
│  └────────────────┘  │ 폰트: [Pretendard]│  └─────────────────┘│
│                      │ 크기: [24px ▼]    │                     │
│  [📥 PNG 다운로드]   │ 색상: [#F2C94C ■]  │                     │
│  [📥 JPEG 다운로드]  └───────────────────┘                     │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | AI 레이아웃 제안 + 텍스트 배치 규칙 + 플랫폼 가이드 | 50분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 썸네일 에디터 웹앱 완성 | 100분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)`,
    },

    // ─── Part A: 썸네일 AI 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: 썸네일 AI 두뇌 만들기 (50분)

좋은 썸네일에는 규칙이 있어요. ==compositing== (합성)의 기본 원리 — 색상 대비, 텍스트 가독성, 시선 유도 — 를 AI 가 학습하면 전문 디자이너 수준의 레이아웃을 제안할 수 있습니다.

핵심 개념 3가지:
1. **AI 레이아웃 제안** — 주제에 맞는 색상 팔레트 + 텍스트 배치 + 스타일 추천
2. **텍스트 포지셔닝 규칙** — 가독성을 높이는 폰트·크기·위치·그림자 최적화
3. **플랫폼별 사이즈 가이드** — YouTube/Instagram/Blog 최적 해상도 + 안전 영역

### 셀 실행 방법
1. 각 코드 셀의 ▶️ 버튼을 클릭하세요.
2. AI 가 JSON 형식으로 디자인 가이드를 생성합니다.
3. 힌트(💡)를 참고하면 결과를 더 잘 이해할 수 있어요.`,
    },

    // ─── LLM 셀 1: AI 레이아웃/색상 제안 ───
    {
      type: "markdown",
      source: `### 🎯 실습 1: AI 레이아웃·색상 제안

영상 주제를 입력하면 AI 가 썸네일에 어울리는 **색상 팔레트**, **레이아웃 스타일**, **텍스트 제안** 을 JSON 으로 생성합니다.

> ==Canvas API== 로 최종 렌더링할 때 이 JSON 을 직접 사용할 수 있어요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 🎨 AI 썸네일 레이아웃 제안기
const topic = "JavaScript 완전정복 - 입문자를 위한 핵심 가이드";

const systemPrompt = \`너는 유튜브 썸네일 디자인 전문가야.
사용자가 영상 주제를 주면 아래 JSON 형식으로 디자인을 제안해:

{
  "title": "메인 제목 텍스트 (12자 이내)",
  "subtitle": "서브 텍스트 (20자 이내)",
  "palette": {
    "background": "#hex 또는 gradient 설명",
    "primary": "#hex (제목 색상)",
    "secondary": "#hex (서브텍스트 색상)",
    "accent": "#hex (강조 포인트)"
  },
  "layout": {
    "style": "center | left-heavy | split | diagonal",
    "titlePosition": { "x": "percent", "y": "percent" },
    "subtitlePosition": { "x": "percent", "y": "percent" },
    "accentElement": "아이콘/도형/배지 등 강조 요소 설명"
  },
  "designTips": ["팁1", "팁2", "팁3"],
  "moodKeywords": ["키워드1", "키워드2"]
}

규칙:
- 제목은 최대 12자, 임팩트 있게
- 색상 대비율 4.5:1 이상 (WCAG AA 기준)
- 모바일에서도 읽히는 큰 글씨 (48px+ 권장)
- 배경과 텍스트 사이 명확한 대비
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`영상 주제: \${topic}\\n\\n이 주제에 최적화된 썸네일 디자인을 제안해줘.\` },
  ],
});

try {
  const design = JSON.parse(res.text);
  console.log("🎨 AI 썸네일 디자인 제안");
  console.log("═".repeat(50));
  console.log(\`📌 메인 제목: \${design.title}\`);
  console.log(\`📎 서브 텍스트: \${design.subtitle}\`);

  console.log("\\n🎨 색상 팔레트:");
  const p = design.palette;
  console.log(\`  🟦 배경:    \${p.background}\`);
  console.log(\`  🟨 제목:    \${p.primary}\`);
  console.log(\`  🟩 서브:    \${p.secondary}\`);
  console.log(\`  🟥 액센트:  \${p.accent}\`);

  console.log("\\n📐 레이아웃:");
  console.log(\`  스타일: \${design.layout.style}\`);
  console.log(\`  제목 위치: (\${design.layout.titlePosition.x}, \${design.layout.titlePosition.y})\`);
  console.log(\`  서브 위치: (\${design.layout.subtitlePosition.x}, \${design.layout.subtitlePosition.y})\`);
  console.log(\`  강조 요소: \${design.layout.accentElement}\`);

  console.log("\\n💡 디자인 팁:");
  design.designTips?.forEach((tip: string, i: number) =>
    console.log(\`  \${i + 1}. \${tip}\`)
  );
  console.log("\\n🏷️ 무드 키워드:", design.moodKeywords?.join(" · "));
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "palette 의 색상 코드를 Canvas API 의 fillStyle 에 그대로 사용할 수 있어요.",
        "titlePosition 의 x, y 퍼센트를 캔버스 크기에 곱하면 픽셀 좌표가 됩니다.",
        "WCAG AA 기준 대비율 4.5:1 은 흰 배경에 회색 텍스트가 안 되는 정도예요.",
        "moodKeywords 는 배경 이미지 검색 시 유용합니다.",
      ],
    },

    // ─── LLM 셀 2: 텍스트 포지셔닝 규칙 ───
    {
      type: "markdown",
      source: `### 📝 실습 2: 텍스트 포지셔닝 최적화

여러 텍스트 배치 옵션을 AI 에게 평가받아요. **가독성 점수**, **개선 제안**, **==Canvas API== 렌더링 코드 힌트** 까지 받을 수 있습니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 📝 텍스트 포지셔닝 분석기
const textConfig = {
  canvasWidth: 1280,
  canvasHeight: 720,
  elements: [
    {
      type: "title",
      text: "JavaScript 완전정복",
      font: "bold 56px Pretendard",
      color: "#FFFFFF",
      x: 640, y: 280,
      shadow: { blur: 8, color: "rgba(0,0,0,0.7)", offsetX: 2, offsetY: 2 },
    },
    {
      type: "subtitle",
      text: "입문자를 위한 핵심 가이드",
      font: "500 28px Pretendard",
      color: "#F2C94C",
      x: 640, y: 360,
      shadow: { blur: 4, color: "rgba(0,0,0,0.5)", offsetX: 1, offsetY: 1 },
    },
    {
      type: "badge",
      text: "EP.01",
      font: "bold 20px Pretendard",
      color: "#FFFFFF",
      background: "#E74C3C",
      x: 100, y: 60,
      padding: 12,
    },
  ],
  background: { type: "gradient", from: "#1A1A2E", to: "#16213E" },
};

const systemPrompt = \`너는 썸네일 텍스트 배치 전문가야.
사용자가 Canvas 텍스트 설정을 주면 아래 JSON 형식으로 분석해:

{
  "overallScore": 1-10,
  "readabilityAnalysis": {
    "titleScore": 1-10,
    "subtitleScore": 1-10,
    "contrastRatio": "추정 대비율",
    "mobileReadable": true/false
  },
  "issues": ["문제점1", "문제점2"],
  "improvements": [
    {
      "element": "title|subtitle|badge",
      "property": "수정할 속성",
      "current": "현재 값",
      "suggested": "제안 값",
      "reason": "이유"
    }
  ],
  "canvasHints": {
    "shadowTechnique": "그림자 효과 Canvas 코드 팁",
    "textAlign": "정렬 관련 팁",
    "layerOrder": "렌더링 순서 팁"
  }
}
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`텍스트 배치 설정:\\n\${JSON.stringify(textConfig, null, 2)}\\n\\n이 배치의 가독성과 디자인을 분석하고 개선점을 알려줘.\` },
  ],
});

try {
  const analysis = JSON.parse(res.text);
  console.log("📝 텍스트 포지셔닝 분석 결과");
  console.log("═".repeat(50));
  console.log(\`\\n⭐ 종합 점수: \${analysis.overallScore}/10\`);

  const ra = analysis.readabilityAnalysis;
  console.log("\\n📊 가독성 분석:");
  console.log(\`  제목 점수: \${ra.titleScore}/10\`);
  console.log(\`  서브 점수: \${ra.subtitleScore}/10\`);
  console.log(\`  대비율: \${ra.contrastRatio}\`);
  console.log(\`  모바일 가독성: \${ra.mobileReadable ? "✅ 양호" : "⚠️ 개선 필요"}\`);

  if (analysis.issues?.length) {
    console.log("\\n⚠️ 발견된 문제:");
    analysis.issues.forEach((issue: string, i: number) =>
      console.log(\`  \${i + 1}. \${issue}\`)
    );
  }

  console.log("\\n🔧 개선 제안:");
  analysis.improvements?.forEach((imp: any, i: number) => {
    console.log(\`  \${i + 1}. [\${imp.element}] \${imp.property}\`);
    console.log(\`     현재: \${imp.current} → 제안: \${imp.suggested}\`);
    console.log(\`     이유: \${imp.reason}\`);
  });

  console.log("\\n🖌️ Canvas 렌더링 팁:");
  const ch = analysis.canvasHints;
  if (ch) {
    console.log(\`  그림자: \${ch.shadowTechnique}\`);
    console.log(\`  정렬: \${ch.textAlign}\`);
    console.log(\`  레이어: \${ch.layerOrder}\`);
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "Canvas API 에서 텍스트 그림자는 shadowBlur, shadowColor, shadowOffsetX/Y 로 설정해요.",
        "textAlign = 'center' + textBaseline = 'middle' 이면 x, y 가 정확히 텍스트 중심이 됩니다.",
        "배지처럼 배경이 있는 텍스트는 fillRect → fillText 순으로 그려야 해요.",
        "모바일에서 썸네일은 매우 작게 보이므로 제목 폰트 48px 이상을 권장합니다.",
      ],
    },

    // ─── LLM 셀 3: 플랫폼별 사이즈 가이드 ───
    {
      type: "markdown",
      source: `### 📐 실습 3: 플랫폼별 사이즈 가이드

유튜브·인스타·블로그 등 **플랫폼마다 최적 이미지 크기와 안전 영역** 이 다릅니다. AI 에게 타겟 플랫폼을 알려주면 맞춤 가이드를 생성해요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 📐 플랫폼별 사이즈 가이드 생성기
const platforms = ["YouTube", "Instagram Post", "Blog OG Image"];

const systemPrompt = \`너는 소셜 미디어 이미지 사이즈 전문가야.
플랫폼 목록을 받으면 각 플랫폼에 대해 아래 JSON 형식으로 가이드를 만들어:

{
  "guides": [
    {
      "platform": "플랫폼 이름",
      "dimensions": { "width": number, "height": number },
      "aspectRatio": "비율",
      "safeZone": {
        "top": number, "right": number, "bottom": number, "left": number,
        "description": "안전 영역 설명 (UI 요소에 가려지는 영역)"
      },
      "textGuidelines": {
        "maxTitleLength": number,
        "recommendedTitleSize": "px 범위",
        "recommendedSubtitleSize": "px 범위",
        "fontWeight": "권장 두께"
      },
      "canvasSetup": "Canvas 초기화 코드 한 줄 (예: canvas.width = 1280)",
      "exportFormat": "권장 포맷 (PNG/JPEG)",
      "exportQuality": "권장 품질 (0.0-1.0)",
      "tips": ["팁1", "팁2"]
    }
  ],
  "universalRules": ["공통 규칙1", "공통 규칙2"]
}
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 플랫폼들의 썸네일/이미지 사이즈 가이드를 만들어줘:\\n\${platforms.join(", ")}\` },
  ],
});

try {
  const data = JSON.parse(res.text);
  console.log("📐 플랫폼별 썸네일 사이즈 가이드");
  console.log("═".repeat(55));

  data.guides?.forEach((g: any) => {
    console.log(\`\\n🖥️ \${g.platform}\`);
    console.log(\`  📏 크기: \${g.dimensions.width} × \${g.dimensions.height} (\${g.aspectRatio})\`);

    const sz = g.safeZone;
    console.log(\`  🛡️ 안전 영역: 상\${sz.top} 우\${sz.right} 하\${sz.bottom} 좌\${sz.left}px\`);
    console.log(\`     → \${sz.description}\`);

    const tg = g.textGuidelines;
    console.log(\`  📝 텍스트 가이드:\`);
    console.log(\`     제목: \${tg.recommendedTitleSize}, 최대 \${tg.maxTitleLength}자\`);
    console.log(\`     서브: \${tg.recommendedSubtitleSize}\`);

    console.log(\`  💻 Canvas: \${g.canvasSetup}\`);
    console.log(\`  📤 내보내기: \${g.exportFormat} (품질: \${g.exportQuality})\`);

    if (g.tips?.length) {
      console.log("  💡 팁:");
      g.tips.forEach((tip: string) => console.log(\`     • \${tip}\`));
    }
  });

  if (data.universalRules?.length) {
    console.log("\\n📌 공통 규칙:");
    data.universalRules.forEach((rule: string, i: number) =>
      console.log(\`  \${i + 1}. \${rule}\`)
    );
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "YouTube 썸네일 안전 영역은 우측 하단에 영상 길이 표시가 가려요.",
        "Instagram 은 정사각형이라 center 레이아웃이 가장 효과적입니다.",
        "Blog OG Image 는 공유 시 좌우가 잘릴 수 있어 핵심을 가운데에 배치하세요.",
        "Canvas toDataURL('image/jpeg', 0.92) 로 JPEG 품질을 조절할 수 있어요.",
      ],
    },

    // ─── Part A 완료 + Part B 시작 ───
    {
      type: "markdown",
      source: `## ✅ Part A 완료!

썸네일 AI 두뇌의 세 가지 핵심 엔진을 체험했어요:
- ✅ **레이아웃·색상 제안** — 주제 → 색상 팔레트 + 배치 스타일 + 디자인 팁 (JSON)
- ✅ **텍스트 포지셔닝** — 텍스트 설정을 분석해 가독성 점수 + 개선안 + ==Canvas API== 힌트
- ✅ **플랫폼 사이즈 가이드** — YouTube/Instagram/Blog 별 최적 크기 + 안전 영역 + 내보내기 설정

이제 이걸 **캔버스 에디터 + 이미지 업로드 + 배경 제거** 가 붙은 풀스택 앱으로 만듭니다.

---

## Part B: MD 레시피로 풀스택 웹앱 완성 (100분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [AI 썸네일 스튜디오 웹앱]
\`\`\`

==Canvas API== 는 브라우저 내장 그래픽 API 라서 별도 라이브러리 없이 고성능 이미지 편집이 가능합니다. ==compositing== 모드를 활용하면 레이어 합성, 블렌딩 등 포토샵 수준의 효과도 낼 수 있어요.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 썸네일 스튜디오 제작 요청서

## 프로젝트 개요
주제를 입력하면 AI 가 색상·레이아웃·텍스트를 제안하고,
Canvas API 기반 에디터로 직접 편집·다운로드할 수 있는 썸네일 스튜디오를 만들어주세요.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- @google/genai (Gemini SDK — 레이아웃/색상 AI 제안)
- Canvas API (2D 렌더링, 이미지 합성, 텍스트 오버레이)
- remove.bg 무료 API (배경 제거)
- localStorage (템플릿 저장, 최근 작업, 설정)
- Lucide React (아이콘)

## 핵심 기능

### 1. AI 디자인 제안
- 주제/키워드 입력 → AI 가 색상 팔레트, 레이아웃 스타일, 제목/서브 텍스트 제안
- "다시 제안" 버튼으로 새로운 디자인 생성
- 제안 결과를 캔버스에 원클릭 적용

### 2. Canvas 에디터
- 실시간 캔버스 프리뷰 (편집 즉시 반영)
- 배경색/그라디언트 설정
- 이미지 업로드 (드래그앤드롭 지원)
- 레이어 개념: 배경 → 이미지 → 텍스트 순서 렌더링

### 3. 텍스트 오버레이
- 메인 제목 + 서브 텍스트 (각각 독립 편집)
- 폰트 선택 (Pretendard, Noto Sans KR, Black Han Sans 등)
- 폰트 크기 (16px ~ 120px 슬라이더)
- 폰트 색상 (컬러 피커)
- 텍스트 정렬 (좌/중/우)
- 텍스트 그림자 (blur, color, offset 조절)
- 위치 드래그 이동 또는 프리셋 (중앙, 좌상단, 하단 중앙 등)

### 4. 이미지 업로드 + 배경 제거
- 이미지 파일 업로드 (PNG, JPG, WebP)
- 업로드한 이미지를 캔버스에 배치 (크기/위치 조절)
- remove.bg API 연동 배경 제거 기능
  - API 키 입력 UI (설정 패널, localStorage 저장)
  - 배경 제거 전/후 미리보기
  - API 키 없으면 "배경 제거 기능은 remove.bg API 키가 필요합니다" 안내

### 5. 플랫폼 프리셋
- YouTube 썸네일: 1280 × 720
- Instagram 포스트: 1080 × 1080
- Instagram 스토리: 1080 × 1920
- 블로그 OG 이미지: 1200 × 630
- Twitter/X 카드: 1200 × 675
- 프리셋 선택 시 캔버스 크기 자동 변경 + 안전 영역 가이드 표시

### 6. 템플릿 갤러리
- 기본 제공 템플릿 6개 이상:
  - 기술 블로그 (어두운 배경 + 코드 느낌)
  - 브이로그 (밝은 톤 + 사진 중심)
  - 리뷰 영상 (별점 + 제품 이미지 공간)
  - 튜토리얼 (단계 번호 + 깔끔한 레이아웃)
  - 뉴스/속보 (빨간 액센트 + 굵은 제목)
  - 미니멀 (여백 활용 + 타이포 중심)
- 템플릿 선택 → 캔버스에 즉시 적용
- 사용자 커스텀 템플릿 저장/불러오기 (localStorage)

### 7. 실행취소/다시실행
- Ctrl+Z (실행취소), Ctrl+Shift+Z (다시실행)
- 최대 50단계 히스토리
- 상태 스냅샷 방식 (캔버스 전체 상태 저장)

### 8. 내보내기
- PNG 다운로드 (투명 배경 지원)
- JPEG 다운로드 (품질 조절 슬라이더 0.1 ~ 1.0)
- 파일명 자동 생성: \\\`thumbnail_[플랫폼]_[날짜].png\\\`

## UI 레이아웃

### 헤더
- 앱 제목 "🎨 AI 썸네일 스튜디오"
- 다크/라이트 모드 토글
- 실행취소/다시실행 버튼

### 메인 영역 (2컬럼)
- 좌측 (넓은 영역): 캔버스 프리뷰 + 플랫폼 프리셋 선택
- 우측 (사이드바): 탭 전환식 패널
  - 🎯 AI 제안 탭: 주제 입력 + AI 디자인 제안
  - 📝 텍스트 탭: 제목/서브 편집 컨트롤
  - 🖼️ 이미지 탭: 업로드 + 배경 제거
  - 🎨 템플릿 탭: 갤러리 + 커스텀 저장

### 하단
- 내보내기 버튼 (PNG / JPEG)
- 현재 캔버스 사이즈 표시

## Gemini API 설정
\\\`\\\`\\\`typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

async function getDesignSuggestion(topic: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: \\\`주제: \\\${topic}\\n\\n이 주제에 맞는 유튜브 썸네일 디자인을 JSON으로 제안해줘...\\\`,
  });
  return JSON.parse(response.text ?? "{}");
}
\\\`\\\`\\\`

## remove.bg API 연동
\\\`\\\`\\\`typescript
async function removeBackground(imageFile: File, apiKey: string): Promise<Blob> {
  const formData = new FormData();
  formData.append("image_file", imageFile);
  formData.append("size", "auto");

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: formData,
  });

  if (!response.ok) throw new Error("배경 제거 실패");
  return response.blob();
}
\\\`\\\`\\\`

## Canvas 렌더링 핵심 로직
\\\`\\\`\\\`typescript
function renderCanvas(ctx: CanvasRenderingContext2D, state: ThumbnailState) {
  const { width, height } = ctx.canvas;
  // 1. 배경
  if (state.background.type === "gradient") {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, state.background.from);
    grad.addColorStop(1, state.background.to);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = state.background.color;
  }
  ctx.fillRect(0, 0, width, height);

  // 2. 이미지 레이어
  if (state.image) {
    ctx.drawImage(state.image, state.imageX, state.imageY, state.imageW, state.imageH);
  }

  // 3. 텍스트 레이어 (그림자 포함)
  ctx.textAlign = state.title.align;
  ctx.shadowBlur = state.title.shadow.blur;
  ctx.shadowColor = state.title.shadow.color;
  ctx.shadowOffsetX = state.title.shadow.offsetX;
  ctx.shadowOffsetY = state.title.shadow.offsetY;
  ctx.font = state.title.font;
  ctx.fillStyle = state.title.color;
  ctx.fillText(state.title.text, state.title.x, state.title.y);
}
\\\`\\\`\\\`

## 스타일 가이드
- Tailwind 기반 반응형 디자인
- 다크 모드: slate-900 배경, slate-100 텍스트
- 라이트 모드: white 배경, slate-800 텍스트
- 액센트 색상: violet-500 ~ violet-600
- 캔버스 영역은 체커보드 패턴 배경 (투명 표시용)
- 컬러 피커는 네이티브 input[type="color"] 사용
- 슬라이더는 Tailwind 스타일 range input

## 환경 변수
\\\`\\\`\\\`
VITE_GEMINI_API_KEY=your-gemini-api-key
\\\`\\\`\\\`
remove.bg API 키는 앱 내 설정 패널에서 입력 (localStorage 저장)

## 실행 방법
\\\`\\\`\\\`bash
npm create vite@latest thumbnail-studio -- --template react-ts
cd thumbnail-studio
npm install @google/genai lucide-react
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

### 도전 1: 🖱️ 캔버스 위 드래그 편집
텍스트와 이미지를 캔버스 위에서 직접 드래그로 위치 이동. \`mousedown\` → \`mousemove\` → \`mouseup\` 이벤트를 활용하세요.

### 도전 2: 🔤 웹폰트 동적 로딩
Google Fonts API 로 폰트 목록을 가져와 선택 UI 제공. \`FontFace\` API 로 동적 로딩 후 ==Canvas API== 에 적용.

\`\`\`typescript
const font = new FontFace("CustomFont", "url(https://fonts.gstatic.com/...)");
await font.load();
document.fonts.add(font);
ctx.font = "bold 48px CustomFont";
\`\`\`

### 도전 3: 📐 안전 영역 오버레이
플랫폼 선택 시 UI 요소에 가려지는 영역을 반투명 빨간색으로 표시. YouTube 는 우측 하단 타임스탬프, Instagram 은 좌측 하단 좋아요 버튼 등.

### 도전 4: 📦 프로젝트 저장/불러오기
현재 편집 상태를 JSON 으로 직렬화해 파일 다운로드 / 업로드. 이미지는 Base64 로 포함하거나 별도 참조 처리.

### 도전 5: 🤖 AI 배경 이미지 생성
Gemini 의 이미지 생성 기능이나 외부 API (DALL-E, Stable Diffusion) 로 주제에 맞는 배경 이미지를 자동 생성.`,
    },
  ],

  quiz: {
    title: "W26: AI 썸네일 스튜디오 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "Canvas API 에서 텍스트에 그림자 효과를 적용할 때 사용하는 속성이 **아닌** 것은?",
        options: [
          "ctx.shadowBlur",
          "ctx.shadowColor",
          "ctx.shadowSpread",
          "ctx.shadowOffsetX",
        ],
        correctIndex: 2,
        explanation:
          "Canvas API 의 그림자 관련 속성은 shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY 4가지입니다. CSS 와 달리 Canvas 에는 shadowSpread 속성이 없어요.",
      },
      {
        type: "multiple-choice",
        question:
          "유튜브 썸네일의 권장 해상도는?",
        options: [
          "1080 x 1080",
          "1920 x 1080",
          "1280 x 720",
          "1200 x 630",
        ],
        correctIndex: 2,
        explanation:
          "유튜브 썸네일 권장 해상도는 1280 x 720 (16:9 비율)입니다. 1080x1080 은 Instagram, 1200x630 은 블로그 OG 이미지에 사용됩니다.",
      },
      {
        type: "multiple-choice",
        question:
          "Canvas 에서 이미지를 그린 뒤 텍스트를 올려야 합니다. 올바른 렌더링 순서는?",
        options: [
          "fillText → drawImage → fillRect (배경)",
          "fillRect (배경) → fillText → drawImage",
          "fillRect (배경) → drawImage → fillText",
          "drawImage → fillRect (배경) → fillText",
        ],
        correctIndex: 2,
        explanation:
          "Canvas 는 화가 캔버스처럼 먼저 그린 것이 아래에 위치합니다. 배경(fillRect) → 이미지(drawImage) → 텍스트(fillText) 순서로 그려야 텍스트가 맨 위에 보여요.",
      },
    ],
  } satisfies Quiz,
};

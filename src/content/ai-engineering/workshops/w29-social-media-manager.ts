import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W29 — AI 소셜미디어 매니저.
 *
 * Part A: 플랫폼별 콘텐츠 변환 + 해시태그 추천 + 콘텐츠 캘린더 체험 (LLM 셀)
 * Part B: MD 레시피로 소셜미디어 매니저 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW29: Lesson = {
  id: "ai-eng-w29-social-media-manager",
  language: "ai-engineering",
  track: "beginner",
  order: 129,
  title: "W29: AI 소셜미디어 매니저",
  subtitle: "글 하나로 트위터·인스타·링크드인 맞춤 콘텐츠 자동 생성",
  estimatedMinutes: 180,
  cells: [
    {
      type: "markdown",
      source: `# 📱 AI 소셜미디어 매니저 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**글 하나를 입력하면 AI 가 트위터·인스타그램·링크드인·블로그 각 플랫폼에 맞춘 콘텐츠를 자동 생성하고, ==scheduling queue== 와 캘린더 뷰로 게시 일정까지 관리하는 소셜미디어 매니저 앱!**

### 완성 모습
\`\`\`
┌─ AI 소셜미디어 매니저 ─────────────────────────────────────────────┐
│  📱 Social Manager         [📊 캘린더] [📋 큐] [🌙 다크모드]       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ✏️ 원본 콘텐츠                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ React 19 의 Server Components 가 정식 출시되었습니다.          │  │
│  │ SSR 과 클라이언트 번들 사이즈를 획기적으로 줄여주고...         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  📌 플랫폼 선택:  [✅ Twitter] [✅ Instagram] [☐ LinkedIn] [☐ Blog] │
│                                         [🚀 AI 변환하기]            │
│                                                                      │
│  ┌─ 🐦 Twitter (142/280자) ─┐  ┌─ 📸 Instagram ────────────────┐   │
│  │ 🔥 React 19 Server       │  │ 🚀 React 19 가 바꾸는 웹 개발 │   │
│  │ Components 정식 출시!     │  │                                │   │
│  │ SSR + 번들 사이즈 혁신    │  │ React 19 의 Server Components  │   │
│  │                           │  │ 가 드디어 정식 출시!           │   │
│  │ #React19 #ServerComponents│  │                                │   │
│  │ #웹개발 #프론트엔드       │  │ #React19 #ServerComponents    │   │
│  │          [📋 복사] [📅+] │  │ #프론트엔드 #웹개발트렌드     │   │
│  └───────────────────────────┘  │ #개발자일상 ...+12개           │   │
│                                  │          [📋 복사] [📅+]      │   │
│  ┌─ 📅 스케줄링 큐 ──────────┐  └──────────────────────────────┘   │
│  │ 🐦 Twitter  4/18 09:00 AM │                                      │
│  │ 📸 Insta    4/18 12:00 PM │                                      │
│  │ 💼 LinkedIn 4/18 02:00 PM │                                      │
│  └────────────────────────────┘                                      │
└──────────────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 멀티플랫폼 변환 + 해시태그 추천 + 콘텐츠 캘린더 AI | 60분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 소셜미디어 매니저 웹앱 완성 | 120분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)`,
    },

    // ─── Part A: 소셜미디어 AI 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: 소셜미디어 AI 두뇌 만들기 (60분)

하나의 글을 여러 ==SNS== 플랫폼에 올리려면 각 플랫폼의 특성을 이해해야 해요. 트위터는 280자 제한, 인스타그램은 해시태그 30개 제한, 링크드인은 전문적인 톤 — 이런 규칙을 AI 가 자동으로 맞춰줍니다.

핵심 개념 3가지:
1. **멀티플랫폼 콘텐츠 변환** — 하나의 원본 글 → 각 플랫폼 형식에 맞게 ==tone== 과 길이를 자동 조절
2. **해시태그 전략** — 플랫폼별 최적 해시태그 수·트렌드·카테고리 분석
3. **콘텐츠 캘린더** — ==engagement== 최적 시간대에 자동 배치하는 게시 계획

### 셀 실행 방법
1. 각 코드 셀의 ▶️ 버튼을 클릭하세요.
2. AI 가 JSON 형식으로 플랫폼별 콘텐츠를 생성합니다.
3. 힌트(💡)를 참고하면 결과를 더 잘 이해할 수 있어요.`,
    },

    // ─── LLM 셀 1: 멀티플랫폼 콘텐츠 변환 ───
    {
      type: "markdown",
      source: `### 🎯 실습 1: 멀티플랫폼 콘텐츠 변환

원본 글을 입력하면 AI 가 **트위터·인스타그램·링크드인·블로그** 각각에 최적화된 버전을 생성합니다.

> 각 플랫폼의 ==character limit== 과 톤을 자동으로 맞춰주는 것이 핵심이에요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 📱 멀티플랫폼 콘텐츠 변환기
const originalContent = \`React 19 의 Server Components 가 정식 출시되었습니다.
기존 SSR 방식 대비 클라이언트 번들 사이즈를 최대 40% 줄이고,
데이터 페칭을 서버에서 직접 처리해 초기 로딩 속도가 크게 개선됩니다.
Next.js 15 와 함께 사용하면 풀스택 개발 경험이 한층 매끄러워집니다.\`;

const platforms = ["Twitter", "Instagram", "LinkedIn", "Blog"];

const systemPrompt = \`너는 소셜미디어 콘텐츠 전문가야.
사용자가 원본 글을 주면 아래 JSON 형식으로 각 플랫폼 맞춤 콘텐츠를 생성해:

{
  "original": "원본 요약 (1줄)",
  "platforms": [
    {
      "name": "Twitter",
      "charLimit": 280,
      "content": "플랫폼 맞춤 텍스트",
      "charCount": 숫자,
      "tone": "casual | professional | engaging",
      "emoji": true,
      "threadSuggestion": "스레드가 필요하면 이어질 트윗 제안"
    }
  ]
}

플랫폼별 규칙:
- Twitter: 280자 제한, 캐주얼하고 임팩트 있게, 이모지 적극 활용
- Instagram: 2200자 제한, 스토리텔링 + 줄바꿈 활용, 이모지 풍부하게
- LinkedIn: 3000자 제한, 전문적이고 인사이트 중심, 경험 공유 톤
- Blog: 제한 없음, SEO 친화적 요약 + 핵심 키워드 강조
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`원본 글:\\n\${originalContent}\\n\\n다음 플랫폼용으로 변환해줘: \${platforms.join(", ")}\` },
  ],
});

try {
  const data = JSON.parse(res.text);
  console.log("📱 멀티플랫폼 콘텐츠 변환 결과");
  console.log("═".repeat(55));
  console.log(\`📝 원본 요약: \${data.original}\`);

  data.platforms?.forEach((p: any) => {
    const icon = { Twitter: "🐦", Instagram: "📸", LinkedIn: "💼", Blog: "📝" }[p.name] || "📌";
    console.log(\`\\n\${icon} \${p.name} (\${p.charCount}/\${p.charLimit}자)\`);
    console.log(\`  톤: \${p.tone} | 이모지: \${p.emoji ? "사용" : "미사용"}\`);
    console.log("─".repeat(50));
    console.log(p.content);
    if (p.threadSuggestion) {
      console.log(\`\\n  🧵 스레드 제안: \${p.threadSuggestion}\`);
    }
  });
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "트위터는 280자 안에 핵심만 담아야 해요. 링크는 23자로 축약됩니다.",
        "인스타그램은 줄바꿈(\\n)을 활용한 가독성이 engagement 에 큰 영향을 미쳐요.",
        "링크드인은 첫 3줄이 '더 보기' 전에 노출되므로 훅(hook)이 중요합니다.",
        "JSON.parse 실패 시 AI 가 마크다운으로 감싸는 경우가 있어요 — 정규식 전처리를 고려하세요.",
      ],
    },

    // ─── LLM 셀 2: 해시태그 추천 ───
    {
      type: "markdown",
      source: `### 🏷️ 실습 2: 플랫폼별 해시태그 추천

같은 주제라도 플랫폼마다 효과적인 해시태그 전략이 다릅니다. AI 가 ==reach== (도달률)을 최대화하는 해시태그 조합을 추천합니다.

> 인스타는 30개 제한, 트위터는 2~3개가 최적, 링크드인은 3~5개가 ==best practice== 입니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 🏷️ 플랫폼별 해시태그 추천기
const topic = "React 19 Server Components 출시";
const targetPlatforms = ["Twitter", "Instagram", "LinkedIn"];

const systemPrompt = \`너는 소셜미디어 해시태그 전문가야.
주제와 플랫폼을 받으면 아래 JSON 형식으로 해시태그를 추천해:

{
  "topic": "주제 요약",
  "platforms": [
    {
      "name": "플랫폼명",
      "maxHashtags": 숫자,
      "recommended": 숫자,
      "hashtags": [
        {
          "tag": "#해시태그",
          "category": "primary | trending | niche | community",
          "reach": "high | medium | low",
          "reason": "추천 이유 (1줄)"
        }
      ],
      "strategy": "이 플랫폼의 해시태그 전략 요약",
      "avoidTags": ["피해야 할 태그와 이유"]
    }
  ],
  "crossPlatformTags": ["모든 플랫폼에서 공통으로 쓸 수 있는 태그"]
}

규칙:
- Twitter: 2~3개 핵심 태그, 트렌딩 우선
- Instagram: 20~25개, primary/trending/niche/community 믹스
- LinkedIn: 3~5개, 전문 업계 용어 중심
- 한국어·영어 믹스 추천
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`주제: \${topic}\\n플랫폼: \${targetPlatforms.join(", ")}\\n\\n각 플랫폼에 최적화된 해시태그를 추천해줘.\` },
  ],
});

try {
  const data = JSON.parse(res.text);
  console.log("🏷️ 플랫폼별 해시태그 추천");
  console.log("═".repeat(55));
  console.log(\`📌 주제: \${data.topic}\`);

  data.platforms?.forEach((p: any) => {
    const icon = { Twitter: "🐦", Instagram: "📸", LinkedIn: "💼" }[p.name] || "📌";
    console.log(\`\\n\${icon} \${p.name} (권장 \${p.recommended}개 / 최대 \${p.maxHashtags}개)\`);
    console.log(\`  📋 전략: \${p.strategy}\`);
    console.log("─".repeat(50));

    const grouped: Record<string, any[]> = {};
    p.hashtags?.forEach((h: any) => {
      if (!grouped[h.category]) grouped[h.category] = [];
      grouped[h.category].push(h);
    });

    Object.entries(grouped).forEach(([cat, tags]) => {
      const catIcon = { primary: "🎯", trending: "🔥", niche: "🔍", community: "👥" }[cat] || "📌";
      console.log(\`  \${catIcon} \${cat}:\`);
      tags.forEach((h: any) => {
        const reach = { high: "🟢", medium: "🟡", low: "🔴" }[h.reach] || "⚪";
        console.log(\`     \${reach} \${h.tag} — \${h.reason}\`);
      });
    });

    if (p.avoidTags?.length) {
      console.log(\`  ⚠️ 피해야 할 태그: \${p.avoidTags.join(", ")}\`);
    }
  });

  if (data.crossPlatformTags?.length) {
    console.log(\`\\n🌐 크로스 플랫폼 공통 태그: \${data.crossPlatformTags.join(" ")}\`);
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "인스타그램에서 해시태그는 첫 댓글에 달면 본문이 깔끔해져요.",
        "트위터에서 해시태그가 3개를 넘으면 오히려 engagement 가 떨어집니다.",
        "niche 태그(검색량 적지만 정확한 대상)가 바이럴보다 전환율이 높아요.",
        "LinkedIn 에서는 #OpenToWork 같은 커뮤니티 태그가 알고리즘 부스트를 받습니다.",
      ],
    },

    // ─── LLM 셀 3: 콘텐츠 캘린더 AI ───
    {
      type: "markdown",
      source: `### 📅 실습 3: 콘텐츠 캘린더 계획

여러 플랫폼에 같은 콘텐츠를 동시에 올리면 ==algorithm== 이 중복으로 인식할 수 있어요. AI 가 각 플랫폼의 **최적 게시 시간대** 와 **간격** 을 계산해 주간 캘린더를 만들어줍니다.

> ==engagement rate== 가 가장 높은 시간대는 플랫폼마다 다릅니다!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 📅 콘텐츠 캘린더 플래너
const contents = [
  "React 19 Server Components 출시 소식",
  "TypeScript 5.5 새 기능 정리",
  "Next.js 15 마이그레이션 가이드"
];
const platforms = ["Twitter", "Instagram", "LinkedIn"];
const startDate = "2026-04-20"; // 월요일

const systemPrompt = \`너는 소셜미디어 스케줄링 전문가야.
콘텐츠 목록과 플랫폼을 받으면 아래 JSON 형식으로 주간 캘린더를 만들어:

{
  "weekOf": "시작 날짜",
  "totalPosts": 숫자,
  "schedule": [
    {
      "day": "Monday",
      "date": "2026-04-20",
      "posts": [
        {
          "time": "09:00",
          "platform": "Twitter",
          "content": "콘텐츠 제목",
          "type": "original | repurpose | engagement",
          "reason": "이 시간에 이 플랫폼인 이유 (1줄)"
        }
      ]
    }
  ],
  "platformInsights": [
    {
      "platform": "플랫폼명",
      "bestTimes": ["최적 시간대 목록"],
      "postFrequency": "권장 빈도",
      "avoidTimes": ["피할 시간대"]
    }
  ],
  "tips": ["전체 전략 팁"]
}

규칙:
- 같은 콘텐츠는 플랫폼 간 최소 2시간 간격
- 각 플랫폼의 피크 시간대에 배치
- 주 중/주말 패턴 구분
- 한국 시간대(KST) 기준
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`콘텐츠 목록:\\n\${contents.map((c, i) => \`\${i + 1}. \${c}\`).join("\\n")}\\n\\n플랫폼: \${platforms.join(", ")}\\n시작일: \${startDate}\\n\\n주간 게시 캘린더를 만들어줘.\` },
  ],
});

try {
  const data = JSON.parse(res.text);
  console.log("📅 주간 콘텐츠 캘린더");
  console.log("═".repeat(55));
  console.log(\`📆 \${data.weekOf} 주 | 총 \${data.totalPosts}개 게시물\`);

  data.schedule?.forEach((day: any) => {
    console.log(\`\\n📌 \${day.day} (\${day.date})\`);
    if (!day.posts?.length) {
      console.log("  🔕 휴식일");
      return;
    }
    day.posts.forEach((post: any) => {
      const icon = { Twitter: "🐦", Instagram: "📸", LinkedIn: "💼" }[post.platform] || "📌";
      const typeIcon = { original: "✨", repurpose: "♻️", engagement: "💬" }[post.type] || "📝";
      console.log(\`  \${post.time} \${icon} \${post.platform} \${typeIcon} \${post.content}\`);
      console.log(\`         → \${post.reason}\`);
    });
  });

  console.log("\\n📊 플랫폼별 인사이트:");
  data.platformInsights?.forEach((p: any) => {
    console.log(\`  \${p.platform}: \${p.postFrequency} | 최적: \${p.bestTimes?.join(", ")}\`);
    if (p.avoidTimes?.length) {
      console.log(\`    ⚠️ 피할 시간: \${p.avoidTimes.join(", ")}\`);
    }
  });

  if (data.tips?.length) {
    console.log("\\n💡 전략 팁:");
    data.tips.forEach((tip: string, i: number) => console.log(\`  \${i + 1}. \${tip}\`));
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "트위터는 출근 시간(8~9시)과 점심시간(12~13시)이 engagement 피크예요.",
        "인스타그램은 점심(11~13시)과 저녁(19~21시)이 최적 시간대입니다.",
        "링크드인은 평일 업무 시간(9~11시)에 전문 콘텐츠가 잘 먹혀요.",
        "같은 콘텐츠를 동시에 올리면 크로스포스팅 페널티를 받을 수 있습니다.",
      ],
    },

    // ─── Part A 완료 + Part B 시작 ───
    {
      type: "markdown",
      source: `## ✅ Part A 완료!

소셜미디어 AI 매니저의 세 가지 핵심 엔진을 체험했어요:
- ✅ **멀티플랫폼 변환** — 원본 글 → 트위터/인스타/링크드인/블로그 맞춤 콘텐츠 (글자 수·톤 자동 조절)
- ✅ **해시태그 추천** — 플랫폼별 최적 태그 수·카테고리·==reach== 분석
- ✅ **콘텐츠 캘린더** — ==engagement== 피크 시간대에 자동 배치하는 주간 스케줄

이제 이걸 **플랫폼 선택 UI + 스케줄링 큐 + 캘린더 뷰** 가 붙은 풀스택 앱으로 만듭니다.

---

## Part B: MD 레시피로 풀스택 웹앱 완성 (120분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [AI 소셜미디어 매니저 웹앱]
\`\`\`

==scheduling queue== 는 게시물을 예약 시간순으로 관리하는 대기열이에요. 캘린더 뷰와 결합하면 한눈에 전체 게시 계획을 파악할 수 있습니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 소셜미디어 매니저 제작 요청서

## 프로젝트 개요
글 하나를 입력하면 AI 가 트위터·인스타그램·링크드인·블로그 각 플랫폼에 맞는 콘텐츠를 자동 생성하고,
스케줄링 큐와 캘린더 뷰로 게시 일정을 관리하는 소셜미디어 매니저를 만들어주세요.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- @google/genai (Gemini SDK — 콘텐츠 변환 + 해시태그 추천)
- localStorage (콘텐츠 히스토리 + 스케줄 저장)

## 핵심 기능

### 1. 콘텐츠 입력 영역
- 원본 글 입력 textarea (자동 높이 조절)
- 플랫폼 선택 체크박스: Twitter, Instagram, LinkedIn, Blog
- "AI 변환하기" 버튼 → 선택된 플랫폼별 콘텐츠 생성

### 2. 플랫폼별 변환 결과
- 각 플랫폼 카드에 변환된 콘텐츠 표시
- 글자 수 카운터 (제한 대비 현재 길이, 초과 시 빨간색)
  - Twitter: 280자, Instagram: 2200자, LinkedIn: 3000자, Blog: 무제한
- 톤 표시 배지 (casual / professional / engaging)
- "📋 복사" 버튼 — 클릭 시 해당 플랫폼 콘텐츠 클립보드 복사
- 해시태그 섹션 — 추천 태그 칩으로 표시, 클릭으로 토글(포함/제외)

### 3. 해시태그 추천
- 플랫폼별 카테고리 구분: primary 🎯 / trending 🔥 / niche 🔍 / community 👥
- 도달률 표시: high 🟢 / medium 🟡 / low 🔴
- 태그 클릭 시 복사, 전체 복사 버튼

### 4. 스케줄링 큐
- 각 플랫폼 카드에 "📅 스케줄 추가" 버튼
- 날짜 + 시간 선택 (date/time picker)
- AI 추천 시간대 버튼 (클릭하면 자동 세팅)
- 큐 목록: 시간순 정렬, 플랫폼 아이콘·제목·예약시간 표시
- 드래그로 순서 변경, 삭제 버튼

### 5. 캘린더 뷰 (월간)
- 월간 그리드 캘린더
- 날짜 셀에 예약된 게시물 칩으로 표시 (플랫폼 아이콘 + 짧은 제목)
- 날짜 클릭 시 해당 일의 게시물 상세 보기
- 이전/다음 월 네비게이션
- 오늘 날짜 하이라이트

### 6. 콘텐츠 히스토리
- localStorage 에 변환 기록 저장 (원본 + 변환 결과 + 타임스탬프)
- 히스토리 목록에서 이전 변환 다시 보기/재사용
- 삭제 기능

## 화면 구조

\\\`\\\`\\\`
┌─ 헤더: "AI 소셜미디어 매니저" [캘린더|큐|히스토리] [🌙] ─┐
├─────────────────────────────────────────────────────────────┤
│ [콘텐츠 입력 영역]                                          │
│ [플랫폼 체크박스]  [AI 변환하기]                              │
├─────────────────────────────────────────────────────────────┤
│ [플랫폼 카드 그리드 — 2열]                                   │
│ ┌─ Twitter ─┐ ┌─ Instagram ─┐                               │
│ └────────────┘ └──────────────┘                               │
│ ┌─ LinkedIn ─┐ ┌─ Blog ──────┐                               │
│ └─────────────┘ └──────────────┘                              │
├─────────────────────────────────────────────────────────────┤
│ [스케줄링 큐 / 캘린더 뷰 — 탭 전환]                         │
└─────────────────────────────────────────────────────────────┘
\\\`\\\`\\\`

## UI/UX 세부사항

### 다크/라이트 모드
- 토글 버튼으로 전환, localStorage 에 설정 저장
- Tailwind dark: 클래스 활용

### 반응형
- 모바일: 플랫폼 카드 1열, 캘린더 축소 뷰
- 태블릿: 2열
- 데스크탑: 2열 + 사이드 큐

### 로딩 / 에러
- AI 변환 중 스켈레톤 UI
- API 키 없을 때 안내 메시지
- 네트워크 에러 재시도 버튼

### 마이크로 인터랙션
- 복사 성공 시 "✅ 복사됨!" 토스트 (2초 후 사라짐)
- 스케줄 추가 시 캘린더 날짜 셀에 애니메이션
- 플랫폼 카드 hover 시 살짝 올라오는 효과
- 글자 수 초과 시 카운터 빨간색 펄스

## API 키 설정
\\\`\\\`\\\`typescript
// .env
VITE_GEMINI_API_KEY=your-key-here
\\\`\\\`\\\`

## Gemini 프롬프트 구조 (참고)
변환 요청 시 시스템 프롬프트에 플랫폼별 규칙을 포함하고,
응답을 JSON 으로 받아 파싱. Part A 의 프롬프트를 기반으로 하되
해시태그와 추천 시간대도 함께 반환하도록 확장.

## 시작 명령어
\\\`\\\`\\\`bash
npm create vite@latest social-media-manager -- --template react-ts
cd social-media-manager
npm install @google/genai
npx tailwindcss init -p
npm run dev
\\\`\\\`\\\`
\`\`\``,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제 — 더 만들어 보세요!

기본 기능을 완성했다면, 아래 도전 과제로 앱을 확장해 보세요.

### 도전 1: 📊 성과 시뮬레이션
각 게시물의 예상 ==engagement rate== 을 AI 가 예측. 시간대·해시태그·콘텐츠 길이를 기반으로 "예상 좋아요 / 리트윗 / 댓글" 수를 표시하는 대시보드.

### 도전 2: 🧵 트위터 스레드 자동 분할
긴 콘텐츠를 280자 단위로 자동 분할하되, 문장 중간에 끊기지 않도록 AI 가 자연스러운 분할점을 찾아주는 기능.

\`\`\`typescript
// 스레드 분할 예시
const thread = splitToThread(longContent, 280);
// → ["1/5 첫 번째 트윗...", "2/5 이어서...", ...]
\`\`\`

### 도전 3: 🖼️ OG 이미지 미리보기
각 플랫폼에서 게시물이 어떻게 보일지 미리보기 카드 렌더링. 트위터 카드, 인스타 피드, 링크드인 포스트의 실제 레이아웃을 CSS 로 시뮬레이션.

### 도전 4: 📈 A/B 테스트 버전
같은 콘텐츠에 대해 AI 가 2~3가지 버전을 생성하고, 사용자가 비교 선택. "더 캐주얼한 버전" / "더 전문적인 버전" 등 톤 슬라이더 제공.

### 도전 5: 🔗 크로스 플랫폼 연결
트위터 → 인스타 스토리 링크, 블로그 → 링크드인 요약 등 플랫폼 간 연결 전략을 AI 가 제안. "트위터에서 블로그 유입 유도" 같은 퍼널 설계.`,
    },
  ],

  quiz: {
    title: "W29: AI 소셜미디어 매니저 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "트위터(X)의 글자 수 제한은 몇 자인가요?",
        options: [
          "140자",
          "280자",
          "500자",
          "1000자",
        ],
        correctIndex: 1,
        explanation:
          "트위터는 2017년에 140자에서 280자로 제한을 늘렸습니다. URL 은 자동으로 23자(t.co)로 축약되므로 실제 사용 가능한 글자 수는 이보다 적을 수 있어요.",
      },
      {
        type: "multiple-choice",
        question:
          "인스타그램 게시물에서 해시태그를 가장 효과적으로 사용하는 방법은?",
        options: [
          "해시태그를 30개 이상 최대한 많이 넣는다",
          "해시태그 없이 깔끔하게 올린다",
          "primary, trending, niche 카테고리를 믹스해 20~25개 사용한다",
          "영어 해시태그만 사용한다",
        ],
        correctIndex: 2,
        explanation:
          "인스타그램은 최대 30개까지 가능하지만, 20~25개를 다양한 카테고리(primary, trending, niche, community)로 믹스하는 것이 reach 최적화에 효과적입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "같은 콘텐츠를 여러 SNS 에 동시에 게시하면 생길 수 있는 문제는?",
        options: [
          "각 플랫폼에서 더 많은 노출을 받는다",
          "알고리즘이 중복 콘텐츠로 인식해 노출이 줄어든다",
          "자동으로 크로스포스팅 보너스를 받는다",
          "해시태그가 공유되어 효율이 높아진다",
        ],
        correctIndex: 1,
        explanation:
          "각 플랫폼의 알고리즘은 크로스포스팅을 감지할 수 있으며, 중복 콘텐츠로 판단되면 도달률이 떨어집니다. 플랫폼별 톤·형식을 다르게 하고 시간 간격을 두는 것이 핵심 전략이에요.",
      },
    ],
  } satisfies Quiz,
};

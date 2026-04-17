import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W17 — AI 포트폴리오 빌더.
 *
 * Part A: 이력서 데이터로 AI 콘텐츠 생성 체험 (LLM 셀)
 * Part B: MD 레시피로 반응형 포트폴리오 사이트 완성 (Claude Code / Cursor)
 */
export const workshopW17: Lesson = {
  id: "ai-eng-w17-portfolio-builder",
  language: "ai-engineering",
  track: "beginner",
  order: 117,
  title: "W17: AI 포트폴리오 빌더",
  subtitle: "이력서 데이터만 넣으면 멋진 포트폴리오 사이트 완성",
  estimatedMinutes: 120,
  cells: [
    // ─── Intro ───
    {
      type: "markdown",
      source: `# 💼 AI 포트폴리오 빌더 — 이력서 JSON 하나로 나만의 사이트 완성

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**이력서 JSON 데이터를 입력하면 AI 가 자기소개·프로젝트 설명·테마까지 생성해주는 포트폴리오 웹사이트.**
완성된 사이트는 Vercel 에 배포하면 \`내이름.vercel.app\` 으로 바로 공개됩니다.

### 완성 모습
\`\`\`
  📄 이력서 JSON                          🌐 포트폴리오 사이트
  ┌──────────────────┐                   ┌──────────────────────────────┐
  │ {                │                   │  ┌────────────────────────┐  │
  │   name: "김개발", │    ──── AI ────▶  │  │  👋 안녕하세요!         │  │
  │   role: "FE Dev",│                   │  │  저는 김개발입니다.      │  │
  │   skills: [...], │                   │  │  3년차 프론트엔드 개발자  │  │
  │   projects: [...],                   │  └────────────────────────┘  │
  │   contact: {...} │                   │                              │
  │ }                │                   │  🛠️ Skills                    │
  └──────────────────┘                   │  ┌──┐ ┌──┐ ┌───┐ ┌──┐      │
                                         │  │TS│ │Re│ │CSS│ │Go│      │
                                         │  └──┘ └──┘ └───┘ └──┘      │
                                         │                              │
                                         │  📂 Projects                 │
                                         │  ┌──────┐ ┌──────┐          │
                                         │  │ App1 │ │ App2 │          │
                                         │  │ desc │ │ desc │          │
                                         │  └──────┘ └──────┘          │
                                         │                              │
                                         │  📬 Contact                  │
                                         │  [Email]  [GitHub]  [Blog]  │
                                         └──────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | AI 로 포트폴리오 콘텐츠 생성 | 40분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 포트폴리오 사이트 완성 | 80분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **Part B 전제**: W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor 설치)`,
    },

    // ─── Part A: AI 콘텐츠 생성 ───
    {
      type: "markdown",
      source: `## Part A: AI 로 포트폴리오 콘텐츠 생성 (40분)

포트폴리오를 만들 때 가장 힘든 건 **글쓰기**입니다.

- "자기소개를 어떻게 쓰지?"
- "프로젝트 설명을 전문적으로 쓰고 싶은데..."
- "색상 조합은 뭐가 좋을까?"

AI 가 이걸 대신 해줍니다. 이력서 데이터를 ==JSON== 으로 정리하고, ==LLM== 에게 콘텐츠 생성을 맡기면 됩니다.

---

### A-1. AI 자기소개 생성 🧑‍💼

이력서의 핵심 정보(이름, 역할, 기술 스택)를 주면 AI 가 전문적인 자기소개 문단을 생성합니다.
==프롬프트 엔지니어링==의 핵심: **구체적인 데이터를 주면 구체적인 결과가 나온다.**`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-1: 이력서 데이터로 전문 자기소개 생성
const resume = {
  name: "김개발",
  role: "프론트엔드 개발자",
  yearsOfExperience: 3,
  skills: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  passion: "사용자 경험을 최우선으로 생각하는 UI 개발",
};

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 포트폴리오 사이트용 자기소개 작성 전문가야.
규칙:
- 한국어로 작성
- 3~4문장의 전문적이면서 친근한 톤
- 기술 스택을 자연스럽게 녹여내기
- 첫 문장은 인사 + 이름 + 역할
- 마지막 문장은 앞으로의 포부\`,
    },
    {
      role: "user",
      content: \`다음 이력서 데이터로 포트폴리오 자기소개를 써줘:
\${JSON.stringify(resume, null, 2)}\`,
    },
  ],
});

console.log("📝 AI 가 생성한 자기소개:\\n");
console.log(response.text);`,
      hints: [
        "resume 객체의 값을 바꿔보세요 — 백엔드 개발자, 디자이너 등 다른 직군으로 시도!",
        "system prompt 의 규칙을 추가하면 톤이 달라져요. '유머러스하게' 등을 넣어보세요.",
        "JSON.stringify 로 데이터를 문자열화해서 프롬프트에 넣는 게 핵심 패턴입니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 프로젝트 설명 다듬기 ✨

포트폴리오에서 프로젝트 카드는 **첫인상**을 결정합니다.
간단한 메모 수준의 설명을 AI 가 전문적인 포트폴리오용 문구로 다듬어줍니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-2: 프로젝트 설명을 포트폴리오용으로 다듬기
const projects = [
  {
    name: "할일 앱",
    tech: ["React", "TypeScript", "Zustand"],
    description: "투두리스트 만들었음. 드래그앤드롭 됨.",
  },
  {
    name: "날씨 대시보드",
    tech: ["Next.js", "OpenWeather API", "Chart.js"],
    description: "날씨 API 연동해서 그래프로 보여주는 거.",
  },
  {
    name: "AI 챗봇",
    tech: ["React", "Gemini API", "Tailwind"],
    description: "AI 한테 질문하면 답변하는 챗봇 만듦.",
  },
];

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 개발자 포트폴리오 전문 카피라이터야.
규칙:
- 각 프로젝트마다 한국어 2줄 설명 생성
- 첫 줄: 프로젝트가 해결하는 문제 (사용자 관점)
- 둘째 줄: 기술적 하이라이트 (개발자 관점)
- 기술 스택은 자연스럽게 언급
- JSON 배열로 반환: [{ name, polished }]\`,
    },
    {
      role: "user",
      content: \`다음 프로젝트들의 설명을 포트폴리오용으로 다듬어줘:
\${JSON.stringify(projects, null, 2)}\`,
    },
  ],
});

console.log("✨ 다듬어진 프로젝트 설명:\\n");
console.log(response.text);`,
      hints: [
        "자기 프로젝트 정보를 넣어서 돌려보세요 — 실제 포트폴리오에 바로 쓸 수 있어요.",
        "system prompt 에 '영어 버전도 함께' 를 추가하면 이중 언어 포트폴리오도 가능합니다.",
        "'JSON 배열로 반환' 이라고 지정하면 프로그래밍적으로 파싱하기 쉬워져요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 맞춤 포트폴리오 테마 🎨

직군·성격에 맞는 색상 팔레트와 레이아웃을 AI 가 추천합니다.
디자인 감각이 없어도 괜찮아요 — ==LLM== 이 컬러 이론을 대신 적용해줍니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// A-3: 직군에 맞는 포트폴리오 테마 생성
const profile = {
  role: "프론트엔드 개발자",
  personality: "깔끔하고 모던한 느낌",
  favoriteColor: "블루 계열",
  darkMode: true,
};

const response = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: \`너는 웹 디자인 + 컬러 이론 전문가야.
규칙:
- 한국어로 응답
- 다음 JSON 형식으로 테마를 제안해:
{
  "themeName": "테마 이름",
  "colors": {
    "primary": "#hex (주 색상 — 버튼, 강조)",
    "secondary": "#hex (보조 색상 — 배지, 아이콘)",
    "background": "#hex (배경)",
    "surface": "#hex (카드 배경)",
    "text": "#hex (본문 텍스트)",
    "accent": "#hex (포인트 — 링크, 호버)"
  },
  "font": "추천 Google Font",
  "layout": "hero | sidebar (추천 레이아웃)",
  "reason": "이 테마를 추천하는 이유 (1~2문장)"
}\`,
    },
    {
      role: "user",
      content: \`이 프로필에 맞는 포트폴리오 테마를 추천해줘:
\${JSON.stringify(profile, null, 2)}\`,
    },
  ],
});

console.log("🎨 AI 추천 테마:\\n");
console.log(response.text);`,
      hints: [
        "personality 를 '따뜻하고 친근한' 이나 '미니멀하고 차가운' 으로 바꿔보세요.",
        "role 을 '디자이너' 로 바꾸면 완전히 다른 색상 조합이 나와요.",
        "darkMode: false 로 바꾸면 라이트 테마 팔레트를 받을 수 있어요.",
      ],
    },

    // ─── Part A 완료 ───
    {
      type: "markdown",
      source: `## 🎉 Part A 완료!

축하합니다! AI 를 활용해 포트폴리오의 핵심 콘텐츠 3가지를 생성했습니다:

| 결과물 | 설명 |
|---|---|
| ✅ 전문 자기소개 | 이력서 데이터 → 3~4문장 바이오 |
| ✅ 프로젝트 설명 | 메모 수준 → 포트폴리오급 카피 |
| ✅ 맞춤 테마 | 직군·성격 → 색상 팔레트 + 레이아웃 |

> 💡 **핵심 패턴**: 구조화된 데이터(JSON) + 명확한 규칙(system prompt) = 일관된 고품질 결과

이제 Part B 에서 이 콘텐츠들을 실제 포트폴리오 사이트로 만듭니다.

---`,
    },

    // ─── Part B: MD 레시피 ───
    {
      type: "markdown",
      source: `## Part B: MD 레시피로 포트폴리오 사이트 완성 (80분)

아래 ==MD 레시피==를 Claude Code 또는 Cursor 에 통째로 복붙하세요.
AI 가 전체 프로젝트를 자동 생성합니다.

> 📋 **사용법**: 아래 마크다운 블록 전체를 복사 → 터미널에서 \`claude\` 실행 → 붙여넣기

\`\`\`markdown
# AI 포트폴리오 빌더

## 프로젝트 개요
이력서 JSON 데이터를 입력하면 AI 가 자기소개, 프로젝트 설명, 테마를 생성해서
반응형 포트폴리오 사이트를 완성하는 웹앱.

## 기술 스택
- React 18 + TypeScript + Vite
- Tailwind CSS 4 (다크/라이트 모드)
- @google/genai (Gemini API)
- React Router (SPA 라우팅)

## 환경 변수
\\\`.env\\\` 파일:
VITE_GEMINI_API_KEY=여기에_API_키

## 핵심 기능

### 1. JSON 이력서 입력 폼
- 텍스트에어리어에 JSON 형식으로 이력서 입력
- 샘플 JSON 버튼 (클릭하면 예시 데이터 자동 입력)
- JSON 유효성 검사 + 에러 메시지
- 필수 필드: name, role, skills[], projects[{name, tech[], description}], contact{email, github?}

### 2. AI 콘텐츠 생성
- "AI 로 콘텐츠 생성" 버튼 클릭 시:
  - Gemini API 로 전문 자기소개 문단 생성 (3~4문장)
  - 각 프로젝트 설명을 포트폴리오용으로 다듬기
  - 직군에 맞는 색상 테마 추천 (JSON 파싱해서 적용)
- 생성 중 로딩 스피너 표시
- 생성된 콘텐츠 미리보기 + 수정 가능

### 3. 포트폴리오 미리보기 (라이브)
생성된 콘텐츠로 실시간 포트폴리오 렌더링:

#### Hero 섹션
- 이름 (큰 타이포그래피)
- 역할 (서브타이틀)
- AI 생성 자기소개 문단
- CTA 버튼: "프로젝트 보기" (스크롤), "연락하기" (Contact 이동)

#### About 섹션
- AI 생성 바이오 (긴 버전)
- 경력 연차 표시

#### Skills 섹션 (태그 클라우드)
- skills 배열을 태그 뱃지로 표시
- 호버 시 살짝 확대 애니메이션
- 카테고리별 그룹핑 (프론트엔드, 백엔드, 도구 등)

#### Projects 섹션 (카드 그리드)
- 반응형 그리드 (모바일 1열, 태블릿 2열, 데스크톱 3열)
- 각 카드: 프로젝트 이름, AI 다듬은 설명, 기술 태그, GitHub/데모 링크 버튼
- 호버 시 카드 살짝 떠오르는 효과 (shadow + translate)

#### Contact 섹션
- mailto 링크 버튼
- GitHub, 블로그, LinkedIn 등 소셜 링크 아이콘
- 간단한 인사말

### 4. 테마 시스템
- AI 추천 테마 자동 적용 (CSS 변수)
- 다크/라이트 모드 토글 (우상단)
- 수동 색상 커스터마이징 (색상 피커)
- Tailwind CSS 변수로 전체 테마 일괄 변경

### 5. OG 메타 태그
- public/index.html 의 og:title, og:description, og:image 안내
- AI 가 og:description 텍스트도 생성
- Vercel 배포 시 링크 미리보기용

### 6. 반응형 디자인
- 모바일 (< 640px): 1열 레이아웃, 햄버거 메뉴
- 태블릿 (640px~1024px): 2열 그리드
- 데스크톱 (> 1024px): 3열 그리드, 사이드 네비게이션

### 7. 배포
- Vercel 배포 설정 (vercel.json)
- 빌드 명령: npm run build
- 환경 변수 설정 안내

## 페이지 구조
/ (메인)
├── 입력 폼 (좌측 또는 상단)
└── 포트폴리오 미리보기 (우측 또는 하단, 라이브 업데이트)

## 디자인 가이드
- 폰트: Pretendard (한국어), Inter (영문)
- 라운드: rounded-xl (카드), rounded-full (태그)
- 전환 효과: transition-all duration-300
- 그라디언트 Hero 배경 (테마 primary → secondary)
\`\`\`

> 🔑 **VITE_GEMINI_API_KEY** 는 [Google AI Studio](https://aistudio.google.com/apikey) 에서 무료 발급.
> W00 에서 이미 받았다면 그대로 사용하면 됩니다.`,
    },

    // ─── 도전 과제 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제

기본 포트폴리오가 완성되면 다음을 추가해보세요:

| 난이도 | 과제 | 힌트 |
|---|---|---|
| ⭐ | PDF 이력서 업로드 → 자동 JSON 변환 | FileReader API + AI 파싱 |
| ⭐⭐ | 다국어 지원 (한/영 토글) | AI 에게 영문 버전도 생성 요청 |
| ⭐⭐ | 블로그 섹션 추가 (마크다운 렌더링) | react-markdown + 글 목록 JSON |
| ⭐⭐⭐ | ==OG 이미지== 자동 생성 (@vercel/og) | Vercel Edge Function + Satori |
| ⭐⭐⭐ | 방문자 분석 (Vercel Analytics) | @vercel/analytics 패키지 |

---`,
    },

    // ─── 완료 + 다음 워크샵 예고 ───
    {
      type: "markdown",
      source: `## ✅ W17 완료!

이번 워크샵에서 배운 것:

- 📄 **구조화된 데이터 → AI 콘텐츠** : JSON 이력서를 AI 가 전문 카피로 변환
- 🎨 **AI 테마 생성** : 직군·성격에 맞는 색상 팔레트 자동 추천
- 🌐 **반응형 포트폴리오** : 모바일/태블릿/데스크톱 대응
- 🏷️ **==OG 메타 태그==** : SNS 공유 시 미리보기 최적화

> 💡 **핵심 교훈**: AI 는 "빈 캔버스 공포"를 없애줍니다.
> 데이터만 준비하면 AI 가 첫 번째 초안을 만들고, 사람이 다듬는 것이 가장 효율적인 워크플로우입니다.

### 다음 워크샵 예고

**W18** 에서는 더 큰 프로젝트에 도전합니다. 기대해주세요! 🎯`,
    },
  ],

  quiz: {
    title: "W17 — 포트폴리오 빌더 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "포트폴리오 자기소개를 AI 로 생성할 때, 가장 좋은 입력 방식은?",
        options: [
          "'자기소개 써줘' 라고만 요청한다",
          "이름, 역할, 기술 스택 등 구조화된 JSON 데이터를 함께 전달한다",
          "다른 사람의 자기소개를 복사해서 '비슷하게 써줘' 라고 한다",
          "가능한 짧게 한 줄로 요청한다",
        ],
        correctIndex: 1,
        explanation:
          "구조화된 데이터(JSON)를 system prompt 규칙과 함께 제공하면 AI 가 일관되고 정확한 결과를 생성합니다. '써줘' 만으로는 맥락이 부족해 원하는 결과를 얻기 어렵습니다.",
      },
      {
        type: "multiple-choice",
        question: "OG(Open Graph) 메타 태그의 역할은?",
        options: [
          "검색 엔진에서 사이트를 차단하는 기능",
          "SNS 나 메신저에서 링크를 공유할 때 미리보기(제목, 설명, 이미지)를 표시",
          "웹사이트의 로딩 속도를 개선하는 최적화 기술",
          "다크 모드와 라이트 모드를 자동 전환하는 API",
        ],
        correctIndex: 1,
        explanation:
          "OG 메타 태그는 og:title, og:description, og:image 등으로 구성되어 카카오톡, 슬랙, 트위터 등에서 링크 미리보기를 결정합니다. 포트폴리오 공유 시 첫인상을 좌우하는 중요한 요소입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "AI 에게 특정 JSON 형식으로 응답하라고 요청하는 이유는?",
        options: [
          "AI 가 JSON 만 이해할 수 있어서",
          "JSON 응답이 일반 텍스트보다 토큰을 덜 소비해서",
          "프로그래밍적으로 파싱해서 UI 에 자동 적용할 수 있어서",
          "JSON 형식이 한국어 출력을 더 정확하게 해서",
        ],
        correctIndex: 2,
        explanation:
          "AI 응답을 JSON 으로 받으면 JSON.parse() 로 바로 파싱해서 색상 테마, 텍스트 등을 프로그래밍적으로 UI 에 적용할 수 있습니다. 이것이 '구조화된 출력(structured output)' 패턴의 핵심입니다.",
      },
    ],
  } satisfies Quiz,
};

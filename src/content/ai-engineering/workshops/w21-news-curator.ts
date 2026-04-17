import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W21 — AI 뉴스 큐레이터.
 *
 * Part A: 플랫폼에서 뉴스 요약 + 분류 + 다이제스트 체험 (LLM 셀)
 * Part B: MD 레시피로 RSS 기반 AI 뉴스 큐레이터 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW21: Lesson = {
  id: "ai-eng-w21-news-curator",
  language: "ai-engineering",
  track: "beginner",
  order: 121,
  title: "W21: AI 뉴스 큐레이터",
  subtitle: "관심 분야 뉴스를 AI가 요약하고 추천",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 📰 AI 뉴스 큐레이터 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**==RSS== 피드에서 뉴스를 수집하고, AI 가 요약·분류·추천하는 개인 맞춤 뉴스 ==큐레이션== 앱** — 수십 개 피드를 한 곳에 모아 AI 가 핵심만 골라주는 나만의 뉴스룸입니다.

### 완성 모습
\`\`\`
┌─ AI 뉴스 큐레이터 ──────────────────────────────────────────┐
│  📰 My News Curator          🔍 키워드 알림   🌙 다크모드   │
├─────────────────────────────────────────────────────────────┤
│  📡 피드 관리: [+ RSS 추가]   구독 중: 8개 피드             │
│                                                             │
│  관심 분야: [기술 ✓] [경제 ✓] [과학 ✓] [문화] [정치] [스포츠]│
│                                                             │
│  ┌─ 오늘의 다이제스트 🤖 ──────────────────────────────────┐│
│  │ 📋 AI 가 정리한 오늘의 핵심 뉴스 5선                    ││
│  │ 1. 🔬 구글, 양자컴퓨터 신기록… 기존 대비 100배 빠른 연산││
│  │ 2. 💹 한국은행 기준금리 동결… "하반기 인하 가능성"      ││
│  │ 3. 🧬 AI 신약 개발, 임상 3상 최초 통과                  ││
│  │ └─ [전체 다이제스트 보기]                                ││
│  └──────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─ 기술 ──────────┐  ┌─ 경제 ──────────┐  ┌─ 과학 ───────┐│
│  │ 🏷️ AI·반도체    │  │ 🏷️ 금리·환율   │  │ 🏷️ 우주·생명 ││
│  │                 │  │                 │  │              ││
│  │ 📄 NVIDIA 차세대│  │ 📄 원/달러 환율 │  │ 📄 화성 탐사 ││
│  │  GPU 발표…     │  │  1,280원 돌파… │  │  새 증거…   ││
│  │  ⭐ AI 요약 3줄 │  │  ⭐ AI 요약 3줄 │  │  ⭐ AI 요약   ││
│  │  [🔖 북마크]    │  │  [🔖 북마크]    │  │  [🔖 북마크]  ││
│  └─────────────────┘  └─────────────────┘  └──────────────┘│
│                                                             │
│  [🔖 북마크 모음]  [📋 다이제스트]  [⚙️ 설정]               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | 뉴스 요약 + 분류 + 다이제스트 생성 | 50분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 뉴스 큐레이터 웹앱 완성 | 100분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)`,
    },

    // ─── Part A: 뉴스 분석 AI 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: 뉴스 분석 AI 두뇌 만들기 (50분)

==RSS== 피드에서 가져온 원본 기사는 길고 복잡해요. AI 를 사용하면 핵심만 쏙 뽑을 수 있습니다.

핵심 개념 3가지:
1. **뉴스 요약** — 긴 기사를 3줄 핵심 요약 + 카테고리 + 감정 분석
2. **다중 기사 분류** — 여러 기사를 한 번에 카테고리별로 자동 분류
3. **일일 다이제스트** — 분류된 기사들로 하루 브리핑 리포트 자동 생성`,
    },

    {
      type: "markdown",
      source: `### A-1. 뉴스 요약 — 기사 핵심만 3줄로

긴 기사 원문을 주면 AI 가 **3줄 요약 + 카테고리 + 감정** 을 JSON 으로 돌려줍니다.
이 패턴이 ==큐레이션== 앱의 기본 단위예요 — 각 기사마다 이 처리를 하면 뉴스카드가 완성됩니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 뉴스 요약 — 기사 원문 → 3줄 요약 + 카테고리 + 감정 분석
const article = \`
[기사 제목] AI 반도체 시장, 2026년 1조 달러 돌파 전망

글로벌 반도체 시장 조사 기관에 따르면, AI 전용 반도체 시장이 2026년
사상 처음으로 1조 달러를 넘어설 것으로 전망된다. NVIDIA, AMD, 인텔 등
주요 반도체 기업은 AI 가속기 생산 능력을 대폭 확충하고 있으며,
삼성전자와 SK하이닉스도 HBM(고대역폭 메모리) 공급을 늘리고 있다.
특히 생성형 AI 의 폭발적 성장이 수요를 견인하고 있으며,
데이터센터, 자율주행, 로봇 등 다양한 분야에서 AI 칩 수요가 급증하고 있다.
업계 전문가들은 "AI 반도체가 전체 반도체 매출의 40%를 차지하게 될 것"이라며
구조적 성장세가 당분간 지속될 것으로 전망했다.
다만 미중 기술 갈등에 따른 수출 규제, 전력 소비 문제 등
리스크 요인도 동시에 존재한다고 지적했다.
\`;

const systemPrompt = \`너는 뉴스 분석 AI 야. 기사 원문을 받으면 반드시 아래 JSON 형식으로만 답해.

[응답 형식]
{
  "title": "기사 제목 (20자 이내 재가공)",
  "summary": ["핵심 요약 1", "핵심 요약 2", "핵심 요약 3"],
  "category": "기술" | "경제" | "정치" | "문화" | "스포츠" | "과학",
  "sentiment": "긍정" | "부정" | "중립",
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "readTimeMinutes": 숫자
}

[규칙]
- summary 는 반드시 3개 문장, 각 30자 이내
- keywords 는 기사에서 가장 중요한 단어 3개
- readTimeMinutes 는 원문 읽기 예상 시간 (분)\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 기사를 분석해줘:\\n\\n\${article}\` },
  ],
});

try {
  const analysis = JSON.parse(res.text);
  console.log("📰 뉴스 분석 결과");
  console.log("═".repeat(45));
  console.log("📌 제목:", analysis.title);
  console.log("\\n📝 3줄 요약:");
  analysis.summary.forEach((s: string, i: number) =>
    console.log(\`   \${i + 1}. \${s}\`)
  );
  console.log("\\n🏷️ 카테고리:", analysis.category);
  console.log("😊 감정:", analysis.sentiment);
  console.log("🔑 키워드:", analysis.keywords?.join(", "));
  console.log("⏱️ 읽기 시간:", analysis.readTimeMinutes, "분");
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "핵심: 기사 원문 → JSON 구조로 요약하면 UI 에 바로 뿌릴 수 있어요.",
        "summary 를 배열로 받으면 줄별로 렌더링하기 편해요.",
        "sentiment 분석으로 긍정/부정 뉴스를 시각적으로 구분할 수 있습니다.",
        "실무에선 이 프로세스를 RSS 피드의 각 기사마다 자동 실행합니다.",
      ],
    },

    {
      type: "markdown",
      source: `### A-2. 다중 기사 분류 — 한 번에 카테고리 배정

뉴스 ==큐레이션== 앱에서는 수십 개 기사가 동시에 들어와요.
AI 에게 기사 목록을 통째로 주면, 한 번의 호출로 전부 분류할 수 있습니다.`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 다중 기사 분류 — 여러 기사를 한 번에 카테고리별로 분류
const articles = [
  { id: 1, title: "삼성전자, AI 반도체 신규 투자 5조원 발표", snippet: "삼성전자가 AI 반도체 생산 라인에 5조원을 추가 투자하겠다고 밝혔다. GAA 공정 기반 2나노 칩 양산을 2026년 하반기로 앞당긴다." },
  { id: 2, title: "한국은행, 기준금리 3.0% 동결 결정", snippet: "한국은행 금융통화위원회가 기준금리를 연 3.0%로 동결했다. 이창용 총재는 하반기 인하 가능성을 시사했다." },
  { id: 3, title: "손흥민, 시즌 20호골 달성… 팀 내 득점왕", snippet: "토트넘 손흥민이 번리전에서 시즌 20번째 골을 넣으며 팀 내 득점왕에 올랐다." },
  { id: 4, title: "NASA, 화성 토양에서 유기물 흔적 추가 발견", snippet: "NASA 의 퍼시비어런스 로버가 화성 토양 샘플에서 새로운 유기물 흔적을 발견했다고 발표했다." },
  { id: 5, title: "넷플릭스 한국 드라마 '무빙', 글로벌 1위 등극", snippet: "넷플릭스 오리지널 한국 드라마 '무빙'이 비영어권 시리즈 부문 글로벌 1위를 기록했다." },
  { id: 6, title: "여야, 반도체특별법 처리 합의… 내일 본회의", snippet: "여야 원내대표가 반도체특별법 처리에 합의했다. 세액공제 확대와 규제 완화가 핵심이다." },
];

const systemPrompt = \`너는 뉴스 분류 AI 야.
기사 목록을 받으면 각 기사를 6개 카테고리 중 하나로 분류해.

카테고리: 기술, 경제, 정치, 문화, 스포츠, 과학

반드시 아래 JSON 배열 형식으로만 답해:
[
  { "id": 숫자, "category": "카테고리", "confidence": 0.0~1.0 },
  ...
]

[규칙]
- 모든 기사에 반드시 카테고리를 배정해
- confidence 는 분류 확신도 (0.9 이상이면 확실)
- 두 카테고리에 걸치면 더 적합한 쪽을 선택하되 confidence 를 낮춰\`;

const articlesText = articles
  .map(a => \`[ID:\${a.id}] \${a.title} — \${a.snippet}\`)
  .join("\\n\\n");

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 기사들을 분류해줘:\\n\\n\${articlesText}\` },
  ],
});

try {
  const results = JSON.parse(res.text);
  console.log("🗂️ 기사 분류 결과");
  console.log("═".repeat(50));

  // 카테고리별로 그룹핑
  const grouped: Record<string, { title: string; confidence: number }[]> = {};
  for (const r of results) {
    const article = articles.find(a => a.id === r.id);
    if (!article) continue;
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push({ title: article.title, confidence: r.confidence });
  }

  const icons: Record<string, string> = {
    기술: "💻", 경제: "💹", 정치: "🏛️", 문화: "🎭", 스포츠: "⚽", 과학: "🔬"
  };

  for (const [cat, items] of Object.entries(grouped)) {
    console.log(\`\\n\${icons[cat] || "📰"} \${cat} (\${items.length}건)\`);
    items.forEach(item =>
      console.log(\`   • \${item.title} (확신: \${(item.confidence * 100).toFixed(0)}%)\`)
    );
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "한 번의 API 호출로 6개 기사를 모두 분류 — 비용과 속도 모두 효율적!",
        "confidence 값으로 '분류가 애매한 기사' 를 감지해 수동 검토할 수 있어요.",
        "실무에선 카테고리를 사용자가 커스텀으로 추가/삭제할 수 있게 만듭니다.",
        "기사 수가 많으면 10~20개씩 배치로 나눠 병렬 호출하면 빨라요.",
      ],
    },

    {
      type: "markdown",
      source: `### A-3. 일일 다이제스트 — 하루 뉴스를 한 장으로

요약 + 분류가 끝난 기사들을 모아 **하루의 핵심 브리핑** 을 자동 생성합니다.
이게 바로 뉴스레터 자동화의 핵심이에요!`,
    },

    {
      type: "llm-code",
      language: "typescript",
      source: `// 일일 다이제스트 — 여러 기사 요약을 종합해 하루 브리핑 생성
const todayArticles = [
  { category: "기술", title: "삼성전자 AI 반도체 5조원 투자", summary: "GAA 2나노 양산 앞당김. AI 칩 수요 급증 대응." },
  { category: "기술", title: "OpenAI GPT-5 출시 임박", summary: "멀티모달 강화, 추론 속도 3배 향상. 개발자 생태계 확장." },
  { category: "경제", title: "기준금리 3.0% 동결", summary: "하반기 인하 가능성 시사. 부동산·주식 시장 영향 주목." },
  { category: "경제", title: "원/달러 1,280원 돌파", summary: "미중 무역갈등 여파. 수입 물가 상승 우려." },
  { category: "과학", title: "화성 유기물 추가 발견", summary: "퍼시비어런스 탐사 성과. 생명체 존재 가능성 높아져." },
  { category: "스포츠", title: "손흥민 시즌 20호골", summary: "팀 내 득점왕. EPL 한국 선수 역대 최다골 경신." },
  { category: "문화", title: "넷플릭스 '무빙' 글로벌 1위", summary: "K-드라마 위상 재확인. 시즌2 제작 확정." },
  { category: "정치", title: "반도체특별법 여야 합의", summary: "세액공제 확대 + 규제 완화. 내일 본회의 처리 예정." },
];

const systemPrompt = \`너는 뉴스 큐레이터 AI 야.
오늘의 기사 요약 목록을 받으면 "일일 다이제스트" 를 작성해.

반드시 아래 JSON 형식으로 답해:
{
  "date": "YYYY-MM-DD",
  "headline": "오늘의 한 줄 헤드라인 (30자 이내)",
  "topStories": [
    {
      "rank": 1,
      "title": "기사 제목",
      "category": "카테고리",
      "whyImportant": "왜 중요한지 한 문장"
    }
  ],
  "categoryBriefing": {
    "기술": "기술 분야 오늘 요약 (2~3문장)",
    "경제": "경제 분야 오늘 요약"
  },
  "trendKeywords": ["오늘 핵심 키워드 5개"]
}

[규칙]
- topStories 는 중요도 순으로 최대 5개
- categoryBriefing 은 기사가 있는 카테고리만 포함
- trendKeywords 는 전체 기사에서 추출한 핵심 트렌드 5개
- 간결하고 정보 밀도 높게 작성\`;

const articlesText = todayArticles
  .map(a => \`[\${a.category}] \${a.title} — \${a.summary}\`)
  .join("\\n");

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`오늘의 기사 목록:\\n\\n\${articlesText}\\n\\n일일 다이제스트를 만들어줘.\` },
  ],
});

try {
  const digest = JSON.parse(res.text);
  console.log("📋 일일 뉴스 다이제스트");
  console.log("═".repeat(50));
  console.log(\`📅 \${digest.date}\`);
  console.log(\`🎯 \${digest.headline}\\n\`);

  console.log("🏆 오늘의 TOP 뉴스:");
  digest.topStories?.forEach((s: any) =>
    console.log(\`  \${s.rank}. [\${s.category}] \${s.title}\\n     → \${s.whyImportant}\`)
  );

  console.log("\\n📊 분야별 브리핑:");
  if (digest.categoryBriefing) {
    for (const [cat, brief] of Object.entries(digest.categoryBriefing)) {
      console.log(\`  📂 \${cat}: \${brief}\`);
    }
  }

  console.log("\\n🔑 오늘의 트렌드:", digest.trendKeywords?.join(" · "));
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "일일 다이제스트는 뉴스레터 자동화의 핵심 — 매일 아침 자동 생성 가능!",
        "topStories 의 rank 를 AI 가 매기므로 중요도 기반 정렬이 돼요.",
        "categoryBriefing 으로 관심 분야만 골라 읽을 수 있어요.",
        "실제 앱에서는 사용자의 관심 카테고리만 포함해 개인화합니다.",
      ],
    },

    {
      type: "markdown",
      source: `## ✅ Part A 완료!

뉴스 큐레이터의 세 가지 AI 엔진을 검증했어요:
- ✅ **뉴스 요약** — 기사 원문 → 3줄 요약 + 카테고리 + 감정 (JSON 구조)
- ✅ **다중 기사 분류** — 기사 목록을 한 번에 6개 카테고리로 자동 분류
- ✅ **일일 다이제스트** — 분류된 기사들로 하루 브리핑 리포트 자동 생성

이제 이걸 **==RSS== 피드 수집 + 개인 맞춤 추천** 이 붙은 풀스택 앱으로 만듭니다.

---

## Part B: MD 레시피로 풀스택 웹앱 완성 (100분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [AI 뉴스 큐레이터 웹앱]
\`\`\`

RSS 피드에서 뉴스를 가져오려면 ==CORS== 제약을 해결해야 해요. allorigins.win 같은 프록시를 사용하면 브라우저에서도 외부 피드를 읽을 수 있습니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 뉴스 큐레이터 제작 요청서

## 프로젝트 개요
RSS 피드에서 뉴스를 수집하고, AI 가 요약·분류·추천하는 개인 맞춤 뉴스 큐레이터를 만들어주세요.
사용자는 관심 카테고리를 선택하면 그에 맞는 뉴스를 AI 가 골라주고, 매일 다이제스트를 생성합니다.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- @google/genai (Gemini SDK)
- localStorage (피드 목록, 북마크, 관심사 저장)
- Lucide React (아이콘)

## RSS 피드 수집 방식
- 외부 RSS 피드를 브라우저에서 직접 호출하면 CORS 에러가 발생함
- allorigins.win 프록시를 사용해 우회: \`https://api.allorigins.win/get?url=\${encodeURIComponent(feedUrl)}\`
- 응답의 contents 필드에서 XML 파싱 (DOMParser 사용)
- 기본 제공 피드 (사용자가 바로 쓸 수 있게):
  - 조선일보 IT: https://www.chosun.com/arc/outboundfeeds/rss/category/it-science/?outputType=xml
  - ZDNet Korea: https://zdnet.co.kr/rss/all_news.xml
  - TechCrunch: https://techcrunch.com/feed/
  - Hacker News (Best): https://hnrss.org/best
  - BBC 한국어: https://feeds.bbci.co.uk/korean/rss.xml

## 기능 요구사항

### 1. 피드 관리
- RSS URL 입력 필드 + 추가 버튼
- 기본 제공 피드 목록 (체크박스로 구독/해제)
- 커스텀 피드 추가/삭제
- 피드별 마지막 업데이트 시간 표시
- 피드 상태 표시 (정상/에러/로딩 중)

### 2. 뉴스 카드 UI
- 카드형 레이아웃 (반응형: 모바일 1열, 태블릿 2열, 데스크톱 3열)
- 각 카드: 기사 제목, 출처, 날짜, AI 3줄 요약, 카테고리 뱃지, 감정 아이콘
- 카드 클릭 시 원문 링크 새 탭으로 열기
- 북마크 토글 버튼 (⭐)
- AI 요약은 "요약 보기" 버튼 클릭 시 생성 (API 비용 절약)

### 3. AI 요약/분류 (Gemini)
- 기사별 3줄 요약 생성
- 6개 카테고리 자동 분류: 기술, 경제, 정치, 문화, 스포츠, 과학
- 감정 분석: 긍정/부정/중립
- 키워드 추출 (기사당 3개)
- 요약 결과 localStorage 에 캐싱 (같은 기사 재요약 방지)

### 4. 관심사 프로필
- 6개 카테고리 중 관심 분야 선택 (토글 칩)
- 선택한 카테고리의 기사를 상단에 우선 표시
- 관심 외 카테고리 기사는 "더 보기" 섹션으로 이동
- 관심사 프로필 localStorage 저장

### 5. 개인화 피드
- 관심 카테고리 기사 우선 정렬
- 카테고리 필터 탭 (전체 / 기술 / 경제 / ... / 북마크)
- 정렬 옵션: 최신순, 관심도순
- 무한 스크롤 또는 "더 불러오기" 버튼

### 6. 북마크
- 기사 카드에서 ⭐ 클릭으로 북마크 토글
- 북마크 탭에서 저장한 기사 모아보기
- 북마크된 기사는 localStorage 에 영구 저장
- 북마크 내보내기 (JSON 다운로드)

### 7. 일일 다이제스트 뷰
- "📋 다이제스트" 버튼 클릭 시 AI 가 오늘의 핵심 뉴스 리포트 생성
- 분야별 브리핑 + TOP 5 뉴스 + 트렌드 키워드
- 다이제스트 결과를 카드/리포트 형식으로 표시
- 생성된 다이제스트 localStorage 에 저장 (하루 1회만 생성)

### 8. 키워드 알림
- 사용자가 관심 키워드 등록 (예: "AI", "반도체", "금리")
- 새 기사 제목/요약에 키워드 포함 시 하이라이트 표시
- 키워드 매칭 기사는 🔔 아이콘 + 상단 노출
- localStorage 에 키워드 목록 저장

### 9. UI/UX
- 다크/라이트 모드 토글 (localStorage 저장)
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 로딩 스켈레톤 UI (피드 수집 중)
- 빈 상태 화면 (구독 피드 없을 때 안내)
- Gemini API 키 입력 다이얼로그 (최초 실행 시)

## 환경 변수
\\\`\\\`\\\`
VITE_GEMINI_API_KEY=your-gemini-api-key
\\\`\\\`\\\`
또는 앱 내에서 API 키 입력 다이얼로그를 통해 설정 (localStorage 저장)

## 시작 명령어
\\\`\\\`\\\`bash
npm create vite@latest news-curator -- --template react-ts
cd news-curator
npm install
npm install @google/genai lucide-react
npx tailwindcss init -p
npm run dev
\\\`\\\`\\\`
\`\`\``,
    },

    // ─── 도전 과제 + 완료 ───
    {
      type: "markdown",
      source: `## 🚀 도전 과제

Part B 를 완성한 뒤 더 발전시켜 보세요!

### 레벨 1 — 기능 확장
- **다국어 뉴스 번역**: 영문 기사를 AI 로 한국어 요약 생성
- **뉴스 타임라인**: 같은 사건에 대한 기사들을 시간순으로 연결
- **읽기 통계**: 카테고리별 읽은 기사 수, 평균 읽기 시간 차트

### 레벨 2 — 고급 기능
- **Supabase 연동**: 피드 목록·북마크를 클라우드에 저장, 기기 간 동기화
- **관련 기사 추천**: AI 가 읽은 기사와 유사한 다른 기사를 추천
- **뉴스레터 생성**: 일일 다이제스트를 이메일 형식 HTML 로 내보내기

### 레벨 3 — 프로 도전
- **실시간 업데이트**: Web Worker 로 백그라운드 피드 새로고침 (5분마다)
- **==PWA== 전환**: 오프라인 캐싱 + 푸시 알림 (키워드 매칭 시)
- **팩트체크 AI**: 기사 내 주장의 신뢰도를 AI 가 평가 (출처 교차 검증)

---

## 🎉 W21 완료!

이번 워크샵에서 배운 것:
- ✅ **뉴스 요약 AI** — 긴 기사를 구조화된 JSON 으로 변환
- ✅ **자동 분류** — 다중 기사를 한 번에 카테고리 배정
- ✅ **일일 다이제스트** — 하루 뉴스를 AI 가 브리핑 리포트로 생성
- ✅ **==RSS== + ==CORS== 프록시** — 외부 피드를 브라우저에서 수집하는 방법
- ✅ **개인화 추천** — 관심사 프로필 기반 뉴스 우선순위 결정

> 🔮 **다음 워크샵 W22** 에서는 또 다른 실전 AI 프로젝트를 만들어 봅니다. 기대해 주세요!`,
    },
  ],
  quiz: {
    title: "W21 — 뉴스 큐레이터 확인",
    questions: [
      {
        type: "multiple-choice",
        question:
          "RSS 피드를 브라우저에서 직접 호출할 때 발생하는 문제와 해결 방법은?",
        options: [
          "속도가 느림 → CDN 으로 캐싱",
          "CORS 에러 → 프록시 서버(allorigins.win 등)로 우회",
          "인증 필요 → API 키 발급",
          "XML 파싱 불가 → JSON 변환 라이브러리 설치",
        ],
        correctIndex: 1,
        explanation:
          "브라우저의 동일 출처 정책(Same-Origin Policy) 때문에 다른 도메인의 RSS 를 직접 호출하면 CORS 에러가 발생합니다. allorigins.win 같은 프록시를 통하면 이 제약을 우회할 수 있어요.",
      },
      {
        type: "multiple-choice",
        question:
          "AI 에게 기사 분류를 요청할 때, 여러 기사를 한 번에 보내는 이유는?",
        options: [
          "AI 가 한 번에 하나만 처리할 수 없어서",
          "분류 정확도가 올라가서",
          "API 호출 횟수와 비용을 줄이고 처리 속도를 높이려고",
          "JSON 응답 크기를 줄이려고",
        ],
        correctIndex: 2,
        explanation:
          "기사마다 개별 API 호출을 하면 비용과 시간이 기사 수에 비례해 늘어납니다. 여러 기사를 한 번에 보내면 1회 호출로 전부 처리 — 배치(batch) 처리의 기본 원리예요.",
      },
      {
        type: "multiple-choice",
        question:
          "뉴스 큐레이터에서 AI 요약 결과를 localStorage 에 캐싱하는 가장 큰 이유는?",
        options: [
          "오프라인에서도 앱이 동작하게 하려고",
          "같은 기사를 다시 요약하지 않아 API 비용과 대기 시간을 절약하려고",
          "사용자 데이터를 서버에 보내지 않으려고",
          "브라우저 탭을 닫았다 열어도 UI 가 유지되게 하려고",
        ],
        correctIndex: 1,
        explanation:
          "AI 요약은 API 호출 비용이 발생하고 응답 대기 시간도 있어요. 한 번 생성한 요약을 캐싱하면 동일 기사 재방문 시 즉시 표시되고 불필요한 API 호출을 방지합니다.",
      },
    ],
  } satisfies Quiz,
};

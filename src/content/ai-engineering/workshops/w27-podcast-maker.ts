import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * W27 — AI 팟캐스트 제작기.
 *
 * Part A: 플랫폼에서 AI 2인 대화 대본 생성 + 챕터 구조화 + TTS 최적화 체험 (LLM 셀)
 * Part B: MD 레시피로 Web Speech TTS 기반 팟캐스트 제작 웹앱 완성 (Claude Code / Cursor)
 */
export const workshopW27: Lesson = {
  id: "ai-eng-w27-podcast-maker",
  language: "ai-engineering",
  track: "beginner",
  order: 127,
  title: "W27: AI 팟캐스트 제작기",
  subtitle: "주제만 입력하면 2인 대화형 팟캐스트 대본 + 음성 생성",
  estimatedMinutes: 150,
  cells: [
    {
      type: "markdown",
      source: `# 🎙️ AI 팟캐스트 제작기 만들기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

## 이 워크샵에서 만들 것

**주제를 입력하면 AI 가 호스트·게스트 2인 대화 대본을 생성하고, ==Web Speech API== 로 음성을 합성해 챕터별로 재생·다운로드하는 팟캐스트 제작기** — 대본 편집, 인트로/아웃트로 템플릿, MP3 내보내기까지!

### 완성 모습
\`\`\`
┌─ AI 팟캐스트 제작기 ──────────────────────────────────────────────┐
│  🎙️ Podcast Maker         [💾 저장] [📤 내보내기] [🌙 다크모드]   │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📝 주제: [AI 시대의 개발자 생존 전략          ]                  │
│  🎭 스타일: [토크쇼 ▼]   ⏱️ 길이: [15분 ▼]   [✨ 대본 생성]     │
│                                                                   │
│  ┌─ 📋 대본 에디터 ──────────────────┐  ┌─ 🔊 음성 설정 ────────┐│
│  │ Ch.1 인트로 (0:00)               │  │ 🎤 호스트 음성:        ││
│  │ ┌──────────────────────────────┐  │  │   [ko-KR 남성 1 ▼]    ││
│  │ │ 🎤 호스트: 안녕하세요!       │  │  │   속도: [1.0 ──●──]   ││
│  │ │    오늘은 AI 시대의 개발자   │  │  │   피치: [1.0 ──●──]   ││
│  │ │    생존 전략에 대해...       │  │  │                        ││
│  │ └──────────────────────────────┘  │  │ 🎧 게스트 음성:        ││
│  │ ┌──────────────────────────────┐  │  │   [ko-KR 여성 1 ▼]    ││
│  │ │ 🎧 게스트: 좋은 주제네요!   │  │  │   속도: [1.0 ──●──]   ││
│  │ │    최근 제가 경험한 바로는...│  │  │   피치: [1.2 ──●──]   ││
│  │ └──────────────────────────────┘  │  │                        ││
│  │                                   │  │ [▶ 미리듣기] [⏹ 정지] ││
│  │ Ch.2 본론 (2:30)                  │  └────────────────────────┘│
│  │ ┌──────────────────────────────┐  │                            │
│  │ │ 🎤 호스트: 구체적으로 어떤  │  │  ┌─ 🎵 오디오 플레이어 ──┐│
│  │ │    기술을 배워야 할까요?     │  │  │ ▶ ■■■■■░░░░░ 02:30    ││
│  │ └──────────────────────────────┘  │  │                        ││
│  │ ┌──────────────────────────────┐  │  │ 📑 챕터 목록           ││
│  │ │ 🎧 게스트: 프롬프트 엔지니  │  │  │  ▸ Ch.1 인트로  0:00  ││
│  │ │    어링이 가장 중요하다고...  │  │  │  ▸ Ch.2 본론    2:30  ││
│  │ └──────────────────────────────┘  │  │  ▸ Ch.3 심화    8:00  ││
│  │ ...                               │  │  ▸ Ch.4 마무리  12:30 ││
│  └───────────────────────────────────┘  └────────────────────────┘│
│                                                                   │
│  [📥 MP3 다운로드]  [📄 대본 TXT 내보내기]  [🔗 공유 링크]        │
└───────────────────────────────────────────────────────────────────┘
\`\`\`

### 2단계 진행

| 단계 | 내용 | 시간 | 장소 |
|---|---|---|---|
| **Part A** | AI 2인 대본 생성 + 챕터 구조화 + TTS 최적화 텍스트 정리 | 50분 | 이 페이지 (LLM 셀) |
| **Part B** | MD 레시피로 팟캐스트 제작 웹앱 완성 | 100분 | 내 컴퓨터 (VS Code/Cursor) |

> ⚠️ **전제 조건**:
> - W00 "내 컴퓨터를 AI 작업실로" 완료 (Node.js + VS Code + Claude Code/Cursor)
> - W01 "나만의 AI 챗봇 만들기" 경험 (chat() 호출 이해)`,
    },

    // ─── Part A: 팟캐스트 AI 두뇌 ───
    {
      type: "markdown",
      source: `## Part A: 팟캐스트 AI 두뇌 만들기 (50분)

사람처럼 자연스러운 팟캐스트를 만들려면 3가지 AI 엔진이 필요해요:

1. **2인 대화 대본 생성** — 주제 → 호스트/게스트 역할 대화 (자연스러운 구어체, 맞장구, 유머)
2. **챕터/세그먼트 구조화** — 긴 대본을 인트로·본론·심화·마무리 챕터로 분리 + 타임스탬프 추정
3. **TTS 최적화 텍스트 정리** — ==Web Speech API== 가 자연스럽게 읽을 수 있도록 약어 풀기, 쉼표 추가, 강조 표시

핵심 개념 3가지:
1. **==Dialogue Generation==** — AI 가 두 명의 화자를 시뮬레이션해 대화형 콘텐츠 생성
2. **==Chapter Markers==** — 긴 오디오를 구간별로 나눠 사용자가 원하는 부분으로 점프 가능
3. **==TTS Preprocessing==** — 텍스트를 음성 합성 엔진에 최적화된 형태로 전처리

### 셀 실행 방법
1. 각 코드 셀의 ▶️ 버튼을 클릭하세요.
2. AI 가 JSON 형식으로 팟캐스트 대본을 생성합니다.
3. 힌트(💡)를 참고하면 결과를 더 잘 이해할 수 있어요.`,
    },

    // ─── LLM 셀 1: 2인 대화 대본 생성 ───
    {
      type: "markdown",
      source: `### 🎤 실습 1: 2인 대화 대본 생성

주제와 스타일을 입력하면 AI 가 **호스트·게스트 역할** 을 나눠 자연스러운 대화 대본을 생성합니다.

> ==Dialogue Generation== 에서 핵심은 각 화자에게 **뚜렷한 성격** 을 부여하는 것이에요. 호스트는 질문을 이끌고, 게스트는 전문 지식으로 답하는 구조가 가장 자연스럽습니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 🎤 AI 2인 대화 대본 생성기
const topic = "AI 시대의 개발자 생존 전략";
const style = "편안한 토크쇼"; // "편안한 토크쇼" | "전문 인터뷰" | "유머 팟캐스트"
const durationMinutes = 10;

const systemPrompt = \`너는 팟캐스트 대본 작가야.
사용자가 주제와 스타일을 주면 아래 JSON 형식으로 2인 대화 대본을 생성해:

{
  "title": "에피소드 제목",
  "description": "한 줄 설명 (50자 이내)",
  "speakers": {
    "host": { "name": "진행자 이름", "personality": "성격 설명" },
    "guest": { "name": "게스트 이름", "personality": "성격 설명" }
  },
  "dialogue": [
    {
      "speaker": "host 또는 guest",
      "text": "대사 내용",
      "emotion": "neutral | excited | thoughtful | laughing | serious",
      "estimatedSeconds": 예상 초 수
    }
  ],
  "totalEstimatedMinutes": 전체 예상 시간
}

규칙:
- 자연스러운 구어체 사용 (음~ 글쎄요, 맞아요! 등)
- 호스트는 질문과 리액션 중심, 게스트는 전문 답변 중심
- 중간에 맞장구, 웃음, 감탄사 포함
- dialogue 배열은 최소 12개 이상
- 한 대사는 2~4문장 (30초 이내)
- estimatedSeconds 는 글자 수 기반 추정 (한국어 분당 약 300자)
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`주제: \${topic}\\n스타일: \${style}\\n목표 길이: \${durationMinutes}분\\n\\n이 설정으로 팟캐스트 대본을 생성해줘.\` },
  ],
});

try {
  const script = JSON.parse(res.text);
  console.log("🎙️ AI 팟캐스트 대본 생성 완료");
  console.log("═".repeat(50));
  console.log(\`📌 제목: \${script.title}\`);
  console.log(\`📎 설명: \${script.description}\`);
  console.log(\`⏱️ 예상 길이: \${script.totalEstimatedMinutes}분\`);

  console.log("\\n👥 출연자:");
  const { host, guest } = script.speakers;
  console.log(\`  🎤 호스트: \${host.name} — \${host.personality}\`);
  console.log(\`  🎧 게스트: \${guest.name} — \${guest.personality}\`);

  console.log("\\n📜 대본 미리보기 (처음 6개 대사):");
  console.log("─".repeat(50));

  let elapsed = 0;
  script.dialogue.slice(0, 6).forEach((line: any, i: number) => {
    const icon = line.speaker === "host" ? "🎤" : "🎧";
    const name = line.speaker === "host" ? host.name : guest.name;
    const min = Math.floor(elapsed / 60);
    const sec = String(elapsed % 60).padStart(2, "0");
    console.log(\`\\n  [\${min}:\${sec}] \${icon} \${name} (\${line.emotion}):\`);
    console.log(\`  "\${line.text}"\`);
    elapsed += line.estimatedSeconds;
  });

  console.log("\\n─".repeat(50));
  console.log(\`📊 전체 대사 수: \${script.dialogue.length}개\`);
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "emotion 필드는 Web Speech API 의 rate, pitch 를 조절하는 데 활용할 수 있어요.",
        "estimatedSeconds 는 한국어 기준 분당 약 300자(5자/초)로 계산합니다.",
        "대본의 dialogue 배열은 나중에 TTS 로 하나씩 음성 변환하는 단위가 됩니다.",
        "speaker 필드로 호스트/게스트를 구분해 서로 다른 음성(voice)을 적용합니다.",
      ],
    },

    // ─── LLM 셀 2: 챕터/세그먼트 구조화 ───
    {
      type: "markdown",
      source: `### 📑 실습 2: 챕터/세그먼트 구조화

긴 대본을 **인트로·본론·심화·마무리** 챕터로 나누고 각 챕터에 타임스탬프를 부여합니다.

> ==Chapter Markers== 는 팟캐스트 앱에서 "건너뛰기" 기능을 가능하게 해요. YouTube 의 챕터 기능과 같은 원리입니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 📑 팟캐스트 챕터 구조화기
const sampleDialogue = [
  { speaker: "host", text: "안녕하세요! AI 팟캐스트에 오신 걸 환영합니다.", estimatedSeconds: 5 },
  { speaker: "guest", text: "반갑습니다. 오늘 주제가 정말 흥미롭네요.", estimatedSeconds: 5 },
  { speaker: "host", text: "오늘은 AI 시대에 개발자가 어떻게 살아남을지 이야기해볼게요.", estimatedSeconds: 8 },
  { speaker: "guest", text: "프롬프트 엔지니어링이 핵심이라고 봅니다. AI 도구를 잘 활용하는 능력이 중요해졌어요.", estimatedSeconds: 10 },
  { speaker: "host", text: "구체적으로 어떤 기술을 먼저 배워야 할까요?", estimatedSeconds: 5 },
  { speaker: "guest", text: "코드 리뷰 능력이요. AI 가 생성한 코드를 검증하고 개선할 줄 알아야 합니다.", estimatedSeconds: 10 },
  { speaker: "host", text: "아, 그러니까 코딩보다 검증 능력이 더 중요해진다는 거군요!", estimatedSeconds: 6 },
  { speaker: "guest", text: "정확합니다. 그리고 시스템 설계 역량도 빼놓을 수 없어요.", estimatedSeconds: 7 },
  { speaker: "host", text: "오늘 정말 유익한 시간이었습니다. 감사합니다!", estimatedSeconds: 5 },
  { speaker: "guest", text: "저도 즐거웠어요. 다음에 또 만나요!", estimatedSeconds: 4 },
];

const systemPrompt = \`너는 팟캐스트 편집 전문가야.
대본 dialogue 배열을 받으면 아래 JSON 형식으로 챕터를 구성해:

{
  "chapters": [
    {
      "id": 1,
      "title": "챕터 제목",
      "summary": "챕터 요약 (한 줄)",
      "startDialogueIndex": 시작 대사 인덱스 (0-based),
      "endDialogueIndex": 끝 대사 인덱스 (inclusive),
      "startTimestamp": "M:SS",
      "endTimestamp": "M:SS",
      "durationSeconds": 초,
      "mood": "intro | discussion | deep-dive | conclusion"
    }
  ],
  "totalDuration": "M:SS",
  "chapterCount": 챕터 수,
  "structureAnalysis": {
    "pacing": "빠름 | 보통 | 느림",
    "balance": "호스트/게스트 발언 비율 설명",
    "suggestion": "구조 개선 제안"
  }
}

규칙:
- 인트로(인사, 주제 소개), 본론(핵심 내용), 마무리(정리, 인사)는 필수
- 본론이 길면 소주제별로 2~3개 챕터로 분리
- startTimestamp 는 dialogue 의 estimatedSeconds 를 누적해서 계산
- mood 는 해당 구간의 분위기를 반영
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`대본 dialogue:\\n\${JSON.stringify(sampleDialogue, null, 2)}\\n\\n이 대본을 챕터로 구조화해줘.\` },
  ],
});

try {
  const data = JSON.parse(res.text);
  console.log("📑 팟캐스트 챕터 구조화 결과");
  console.log("═".repeat(50));
  console.log(\`⏱️ 전체 길이: \${data.totalDuration}\`);
  console.log(\`📑 챕터 수: \${data.chapterCount}개\\n\`);

  data.chapters?.forEach((ch: any) => {
    const moodIcon: Record<string, string> = {
      intro: "🎬", discussion: "💬", "deep-dive": "🔬", conclusion: "👋",
    };
    console.log(\`\${moodIcon[ch.mood] ?? "📌"} Ch.\${ch.id}: \${ch.title}\`);
    console.log(\`   ⏱️ \${ch.startTimestamp} ~ \${ch.endTimestamp} (\${ch.durationSeconds}초)\`);
    console.log(\`   📝 \${ch.summary}\`);
    console.log(\`   🎯 대사 #\${ch.startDialogueIndex} ~ #\${ch.endDialogueIndex}\\n\`);
  });

  const sa = data.structureAnalysis;
  if (sa) {
    console.log("📊 구조 분석:");
    console.log(\`  속도감: \${sa.pacing}\`);
    console.log(\`  발언 비율: \${sa.balance}\`);
    console.log(\`  💡 개선 제안: \${sa.suggestion}\`);
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "챕터의 startDialogueIndex 와 endDialogueIndex 로 대본 배열을 slice 해서 해당 구간만 TTS 재생할 수 있어요.",
        "startTimestamp 는 이전 대사들의 estimatedSeconds 합산으로 계산됩니다.",
        "mood 필드를 활용하면 인트로에 음악을 넣거나, 결론에 페이드아웃 효과를 줄 수 있어요.",
        "YouTube 챕터 기능도 이와 동일한 타임스탬프 방식으로 작동합니다.",
      ],
    },

    // ─── LLM 셀 3: TTS 최적화 텍스트 정리 ───
    {
      type: "markdown",
      source: `### 🔊 실습 3: TTS 최적화 텍스트 정리

==Web Speech API== 가 자연스럽게 읽을 수 있도록 텍스트를 전처리합니다. 약어 풀기, 쉼표로 호흡 넣기, 숫자를 한글로 변환하는 등의 작업이에요.

> ==TTS Preprocessing== 은 음성 품질을 크게 좌우합니다. "AI" 를 "에이아이" 로, "10분" 을 "십 분" 으로 바꾸면 훨씬 자연스러워요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 🔊 TTS 최적화 텍스트 정리기
const rawDialogue = [
  {
    speaker: "host",
    text: "안녕하세요! AI 팟캐스트 EP.3에 오신 걸 환영합니다. 오늘은 LLM의 RAG 기술에 대해 이야기해볼게요.",
    emotion: "excited",
  },
  {
    speaker: "guest",
    text: "네, 반갑습니다. RAG는 Retrieval-Augmented Generation의 약자인데요, 2024년 가장 핫한 기술이죠.",
    emotion: "neutral",
  },
  {
    speaker: "host",
    text: "정확도가 95%까지 올라간다는 연구도 있더라고요. GPT-4o vs Claude 3.5 비교 결과는 어떤가요?",
    emotion: "thoughtful",
  },
];

const systemPrompt = \`너는 TTS(음성 합성) 전처리 전문가야.
팟캐스트 대사를 받으면 Web Speech API가 자연스럽게 읽을 수 있도록 최적화해:

{
  "optimized": [
    {
      "speaker": "host 또는 guest",
      "original": "원본 텍스트",
      "ttsReady": "TTS 최적화된 텍스트",
      "changes": [
        { "from": "원본 표현", "to": "변환 표현", "reason": "이유" }
      ],
      "ssmlHints": {
        "rate": "속도 제안 (0.8~1.5)",
        "pitch": "피치 제안 (0.5~2.0)",
        "pauseAfter": "대사 후 쉼(초)"
      }
    }
  ],
  "globalRules": ["적용된 전처리 규칙 목록"],
  "pronunciationGuide": [
    { "term": "전문 용어", "pronunciation": "한글 발음" }
  ]
}

TTS 최적화 규칙:
- 영어 약어를 한글 발음으로: AI→에이아이, LLM→엘엘엠, RAG→래그
- 숫자+단위를 한글로: 95%→구십오 퍼센트, 2024년→이천이십사 년
- 모델명은 풀어서: GPT-4o→지피티 포오, Claude 3.5→클로드 삼점오
- 쉼표(,)로 자연스러운 호흡 추가
- 느낌표/물음표 뒤에 pause 표시
- emotion에 따라 rate, pitch 제안
JSON만 응답해.\`;

const res = await chat({
  provider: "gemini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`다음 팟캐스트 대사를 TTS에 최적화해줘:\\n\${JSON.stringify(rawDialogue, null, 2)}\` },
  ],
});

try {
  const data = JSON.parse(res.text);
  console.log("🔊 TTS 최적화 결과");
  console.log("═".repeat(55));

  data.optimized?.forEach((item: any, i: number) => {
    const icon = item.speaker === "host" ? "🎤" : "🎧";
    console.log(\`\\n\${icon} 대사 \${i + 1} (\${item.speaker}):\`);
    console.log(\`  📝 원본: "\${item.original}"\`);
    console.log(\`  🔊 최적화: "\${item.ttsReady}"\`);

    if (item.changes?.length) {
      console.log("  🔄 변환 내역:");
      item.changes.forEach((c: any) =>
        console.log(\`     "\${c.from}" → "\${c.to}" (\${c.reason})\`)
      );
    }

    const hints = item.ssmlHints;
    if (hints) {
      console.log(\`  ⚙️ 음성 설정: 속도 \${hints.rate}x, 피치 \${hints.pitch}, 쉼 \${hints.pauseAfter}초\`);
    }
  });

  if (data.pronunciationGuide?.length) {
    console.log("\\n📖 발음 가이드:");
    data.pronunciationGuide.forEach((p: any) =>
      console.log(\`  \${p.term} → \${p.pronunciation}\`)
    );
  }

  if (data.globalRules?.length) {
    console.log("\\n📌 적용된 전처리 규칙:");
    data.globalRules.forEach((rule: string, i: number) =>
      console.log(\`  \${i + 1}. \${rule}\`)
    );
  }
} catch {
  console.log("원본 응답:", res.text);
}`,
      hints: [
        "Web Speech API 의 SpeechSynthesisUtterance.rate 는 0.1~10 범위, 기본값 1 이에요.",
        "pitch 는 0~2 범위로, 1 이 기본. 게스트를 1.2 로 올리면 목소리가 약간 높아져 구분이 쉬워요.",
        "한국어 TTS 는 영어 약어를 예측 불가하게 읽으므로 반드시 한글로 변환해야 합니다.",
        "ssmlHints 의 pauseAfter 는 setTimeout 으로 다음 대사 재생을 지연시키는 데 활용해요.",
      ],
    },

    // ─── Part A 완료 + Part B 시작 ───
    {
      type: "markdown",
      source: `## ✅ Part A 완료!

팟캐스트 AI 두뇌의 세 가지 핵심 엔진을 체험했어요:
- ✅ **2인 대화 대본 생성** — 주제 → 호스트/게스트 역할 대화 + 감정 태그 + 시간 추정 (JSON)
- ✅ **챕터 구조화** — 대본을 인트로/본론/심화/마무리로 분리 + ==Chapter Markers== 타임스탬프
- ✅ **TTS 텍스트 최적화** — 약어 풀기, 숫자 변환, 호흡 추가로 ==Web Speech API== 가 자연스럽게 읽는 텍스트

이제 이걸 **음성 합성 + 오디오 플레이어 + 챕터 내비게이션** 이 붙은 풀스택 앱으로 만듭니다.

---

## Part B: MD 레시피로 풀스택 웹앱 완성 (100분)

여기서부터는 **내 컴퓨터에서** 진행합니다.

### 바이브 코딩 플로우

\`\`\`
[MD 레시피 파일] → [Claude Code / Cursor] → [AI 팟캐스트 제작기 웹앱]
\`\`\`

==Web Speech API== 는 브라우저 내장 음성 합성 API 라서 별도 서버 없이 텍스트를 음성으로 변환할 수 있어요. ==SpeechSynthesisUtterance== 객체에 text, voice, rate, pitch 를 설정하면 바로 재생됩니다.`,
    },

    {
      type: "markdown",
      source: `### 📋 MD 레시피 — 복사해서 사용하세요

아래 마크다운 전체를 복사해 **Claude Code** 에 붙여넣거나, **Cursor** 의 AI 채팅에 전달하세요.

---

\`\`\`markdown
# AI 팟캐스트 제작기 제작 요청서

## 프로젝트 개요
주제를 입력하면 AI 가 2인 대화형 팟캐스트 대본을 생성하고,
Web Speech API 로 음성을 합성해 챕터별 재생·편집·다운로드할 수 있는 팟캐스트 제작 앱을 만들어주세요.

## 기술 스택
- React + TypeScript + Vite
- Tailwind CSS (다크/라이트 모드)
- @google/genai (Gemini SDK — 대본 생성 + 텍스트 최적화)
- Web Speech API (SpeechSynthesis — 브라우저 내장 TTS)
- MediaRecorder API (음성 녹음 → MP3/WebM 변환)
- localStorage (대본 저장, 설정, 최근 프로젝트)
- Lucide React (아이콘)

## 핵심 기능

### 1. AI 대본 생성
- 주제 입력 + 스타일 선택 (토크쇼 / 전문 인터뷰 / 유머 / 교육)
- 목표 길이 선택 (5분 / 10분 / 15분 / 30분)
- AI 가 호스트·게스트 2인 대화 대본 JSON 생성
- 각 대사에 speaker, text, emotion, estimatedSeconds 포함
- "다시 생성" 버튼으로 새 대본 요청

### 2. 대본 에디터
- 대사별 카드 형태 UI (호스트: 파란색 좌측, 게스트: 초록색 우측)
- 각 대사 인라인 편집 (클릭 → 텍스트 수정)
- 대사 추가 / 삭제 / 순서 변경 (드래그 또는 화살표 버튼)
- 화자 전환 버튼 (호스트 ↔ 게스트)
- 감정 태그 변경 (neutral / excited / thoughtful / laughing / serious)

### 3. 인트로·아웃트로 템플릿
- 기본 인트로 템플릿 3종:
  - 캐주얼: "안녕하세요! [팟캐스트명]에 오신 걸 환영합니다..."
  - 포멀: "청취자 여러분, [팟캐스트명] 시간입니다..."
  - 유머: "여러분이 기다리던 그 시간! [팟캐스트명] 시작합니다..."
- 기본 아웃트로 템플릿 3종
- 인트로/아웃트로 커스텀 편집 및 저장

### 4. 챕터 마커 시스템
- AI 가 대본 분석 후 자동 챕터 분리 (인트로/본론/심화/마무리)
- 각 챕터에 제목, 요약, 시작 타임스탬프 표시
- 수동 챕터 추가/편집/삭제
- 챕터 목록 클릭 시 해당 대사 위치로 스크롤 + 음성 재생 점프

### 5. Web Speech TTS 엔진
- SpeechSynthesis API 활용한 브라우저 내장 음성 합성
- 호스트·게스트 별도 음성(voice) 선택 드롭다운
  - speechSynthesis.getVoices() 로 사용 가능 목록 표시
  - 한국어(ko-KR) 음성 우선 필터링
- 대사별 개별 재생 (▶ 버튼)
- 전체 순차 재생 (대사 간 자연스러운 간격)
- 속도(rate) 조절: 0.5x ~ 2.0x 슬라이더
- 피치(pitch) 조절: 0.5 ~ 2.0 슬라이더
- emotion 태그에 따른 자동 rate/pitch 조정:
  - excited: rate 1.1, pitch 1.1
  - thoughtful: rate 0.9, pitch 0.95
  - laughing: rate 1.05, pitch 1.15
  - serious: rate 0.85, pitch 0.9

### 6. 오디오 플레이어 + 챕터 내비게이션
- 커스텀 오디오 플레이어 UI (재생/일시정지/정지)
- 진행률 바 (드래그로 탐색)
- 현재 재생 중인 대사 하이라이트 (스크롤 추적)
- 챕터 목록에서 클릭으로 해당 구간 점프
- 현재 시간 / 전체 시간 표시

### 7. MP3/오디오 내보내기
- MediaRecorder API 로 TTS 출력 캡처
- Web Audio API AudioContext + MediaStreamDestination 으로 오디오 스트림 생성
- 전체 대본 순차 TTS → 녹음 → Blob 생성
- "내보내기 중..." 프로그레스 바 (대사 진행도 표시)
- 완료 후 다운로드 링크 제공 (audio/webm 또는 audio/mp4)
- 대본 텍스트 파일(.txt) 내보내기 (타임스탬프 포함)

### 8. 프로젝트 관리
- 현재 프로젝트 localStorage 자동 저장
- 최근 프로젝트 목록 (최대 10개)
- 프로젝트 불러오기 / 삭제
- JSON 형태 프로젝트 파일 내보내기/가져오기

## UI 레이아웃

### 헤더
- 앱 제목 "🎙️ AI 팟캐스트 제작기"
- 다크/라이트 모드 토글
- 프로젝트 저장 / 불러오기 버튼

### 메인 영역 (2컬럼)
- 좌측 (넓은 영역):
  - 상단: 주제 입력 + 스타일/길이 선택 + 생성 버튼
  - 중앙: 대본 에디터 (대사 카드 목록, 챕터 구분선 표시)
  - 하단: 인트로/아웃트로 템플릿 선택
- 우측 (사이드바): 탭 전환식 패널
  - 🔊 음성 탭: 호스트/게스트 voice 선택, rate/pitch 슬라이더
  - 📑 챕터 탭: 챕터 목록 + 추가/편집
  - 📤 내보내기 탭: 오디오/텍스트 내보내기 옵션

### 하단 고정 바
- 오디오 플레이어 (재생/정지/프로그레스 바)
- 현재 재생 대사 미리보기
- 전체 재생 / 챕터별 재생 토글

## Gemini API 설정
\\\`\\\`\\\`typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

async function generateScript(topic: string, style: string, minutes: number) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: \\\`주제: \\\${topic}\\n스타일: \\\${style}\\n길이: \\\${minutes}분\\n\\n2인 대화 팟캐스트 대본을 JSON으로 생성해줘...\\\`,
  });
  return JSON.parse(response.text ?? "{}");
}
\\\`\\\`\\\`

## Web Speech TTS 핵심 로직
\\\`\\\`\\\`typescript
function speakDialogue(
  text: string,
  voice: SpeechSynthesisVoice,
  rate: number,
  pitch: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = "ko-KR";
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    speechSynthesis.speak(utterance);
  });
}

async function playFullScript(dialogue: DialogueLine[]) {
  for (const line of dialogue) {
    const voice = line.speaker === "host" ? hostVoice : guestVoice;
    const { rate, pitch } = getEmotionSettings(line.emotion);
    await speakDialogue(line.ttsReady, voice, rate, pitch);
    await new Promise(r => setTimeout(r, 500)); // 대사 간 간격
  }
}
\\\`\\\`\\\`

## 오디오 녹음 + 내보내기
\\\`\\\`\\\`typescript
async function exportAudio(dialogue: DialogueLine[]): Promise<Blob> {
  const audioCtx = new AudioContext();
  const dest = audioCtx.createMediaStreamDestination();
  const recorder = new MediaRecorder(dest.stream);
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => chunks.push(e.data);

  recorder.start();
  // TTS 재생 → AudioContext 를 통해 dest 로 라우팅
  for (const line of dialogue) {
    await speakDialogue(line.ttsReady, /* ... */);
  }
  recorder.stop();

  return new Promise((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: "audio/webm" }));
    };
  });
}
\\\`\\\`\\\`

## 스타일 가이드
- Tailwind 기반 반응형 디자인
- 다크 모드: slate-900 배경, slate-100 텍스트
- 라이트 모드: white 배경, slate-800 텍스트
- 호스트 대사: blue-500 좌측 테두리, blue-50 배경
- 게스트 대사: emerald-500 우측 테두리, emerald-50 배경
- 액센트 색상: violet-500 ~ violet-600
- 챕터 구분선: dashed border + 챕터 배지
- 현재 재생 대사: ring-2 ring-violet-400 하이라이트

## 환경 변수
\\\`\\\`\\\`
VITE_GEMINI_API_KEY=your-gemini-api-key
\\\`\\\`\\\`

## 실행 방법
\\\`\\\`\\\`bash
npm create vite@latest podcast-maker -- --template react-ts
cd podcast-maker
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

### 도전 1: 🎵 배경 음악 믹싱
인트로/아웃트로에 배경 음악을 추가하세요. ==Web Audio API== 의 \`GainNode\` 로 TTS 볼륨과 BGM 볼륨을 독립 조절할 수 있어요.

\`\`\`typescript
const bgm = audioCtx.createBufferSource();
const bgmGain = audioCtx.createGain();
bgmGain.gain.value = 0.15; // 배경음 15% 볼륨
bgm.connect(bgmGain).connect(audioCtx.destination);
\`\`\`

### 도전 2: 🌐 다국어 팟캐스트
대본을 영어/일본어 등으로 번역하고, 해당 언어의 TTS 음성으로 재생하는 기능. \`speechSynthesis.getVoices()\` 에서 \`lang\` 속성으로 필터링하세요.

### 도전 3: 📊 대본 분석 대시보드
호스트/게스트 발언 비율, 평균 대사 길이, 감정 분포 차트를 표시하세요. 간단한 ==bar chart== 를 Canvas 나 CSS 로 그릴 수 있어요.

### 도전 4: 🎭 3인 이상 화자 지원
패널 토론, 라운드 테이블 등 3명 이상이 참여하는 팟캐스트 형식. 각 화자에게 고유 색상과 음성을 배정하세요.

### 도전 5: 📱 PWA + 오프라인 재생
Service Worker 로 대본과 오디오를 캐싱해 오프라인에서도 재생 가능하게 만드세요. \`workbox\` 라이브러리를 활용하면 쉽게 구현할 수 있어요.`,
    },
  ],

  quiz: {
    title: "W27: AI 팟캐스트 제작기 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "Web Speech API 의 `SpeechSynthesisUtterance` 에서 음성 속도를 조절하는 속성은?",
        options: [
          "utterance.speed",
          "utterance.rate",
          "utterance.velocity",
          "utterance.tempo",
        ],
        correctIndex: 1,
        explanation:
          "SpeechSynthesisUtterance 의 속도 조절 속성은 rate 입니다. 기본값은 1.0 이며 0.1~10 범위를 지원해요. speed, velocity, tempo 는 존재하지 않는 속성입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "TTS 전처리에서 'AI' 를 '에이아이' 로 변환하는 주된 이유는?",
        options: [
          "영어 발음이 지원되지 않아서",
          "한국어 TTS 엔진이 영어 약어를 예측 불가하게 읽기 때문에",
          "문자 수를 늘려 재생 시간을 정확히 계산하려고",
          "저작권 문제를 피하기 위해",
        ],
        correctIndex: 1,
        explanation:
          "한국어 TTS 엔진은 영어 약어를 일관되지 않게 읽습니다. 예를 들어 'AI' 를 '아이' 로 읽거나 알파벳을 하나씩 읽는 등 결과가 예측 불가능해요. 한글 발음으로 변환하면 항상 의도한 대로 읽힙니다.",
      },
      {
        type: "multiple-choice",
        question:
          "브라우저에서 TTS 음성을 녹음해 파일로 내보내기 위해 사용하는 API 조합은?",
        options: [
          "FileSystem API + Blob",
          "MediaRecorder API + AudioContext",
          "WebSocket + StreamSaver",
          "IndexedDB + Web Workers",
        ],
        correctIndex: 1,
        explanation:
          "MediaRecorder API 로 오디오 스트림을 녹음하고, AudioContext 의 MediaStreamDestination 으로 TTS 출력을 캡처합니다. 녹음된 데이터는 Blob 으로 변환해 다운로드할 수 있어요.",
      },
      {
        type: "multiple-choice",
        question:
          "팟캐스트의 챕터 마커(Chapter Markers)가 사용자 경험에 주는 가장 큰 이점은?",
        options: [
          "파일 크기를 줄여준다",
          "음질을 향상시킨다",
          "원하는 구간으로 빠르게 이동할 수 있다",
          "자동으로 자막을 생성한다",
        ],
        correctIndex: 2,
        explanation:
          "챕터 마커는 긴 오디오를 구간별로 나눠 사용자가 관심 있는 부분으로 바로 점프할 수 있게 합니다. YouTube 챕터 기능과 동일한 원리로, 특히 긴 팟캐스트에서 사용자 경험을 크게 향상시켜요.",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson06: Lesson = {
  id: "ai-intro-06-ai-types",
  language: "ai-engineering",
  track: "intro",
  order: 6,
  title: "AI 종류 알아보기",
  subtitle: "ChatGPT, Gemini, Claude... 뭐가 다를까?",
  estimatedMinutes: 15,
  cells: [
    {
      type: "markdown",
      source: `# AI 종류 알아보기

지금까지 우리가 써본 AI는 **대형 언어 모델(LLM)** 이라는 종류였어요.
하지만 세상에는 다양한 종류의 AI가 있습니다!

이번 강의에서는 어떤 AI들이 있는지, 각각 뭐가 다른지 알아봅시다.

## 이번 강의에서 배울 것
| # | 내용 |
|---|------|
| 1 | 대표적인 AI 서비스 비교 (ChatGPT, Gemini, Claude) |
| 2 | LLM 외에 다른 종류의 AI |
| 3 | 클라우드 AI vs 로컬 AI |
| 4 | 상황에 맞는 AI 고르기 |`,
    },
    {
      type: "markdown",
      source: `## 대표적인 AI 챗봇 서비스

현재 가장 많이 쓰이는 대형 언어 모델(LLM) 서비스를 비교해볼게요.

| AI 이름 | 만든 회사 | 특징 |
|---------|----------|------|
| **ChatGPT** | OpenAI | 가장 먼저 유명해진 AI. 대화, 코딩, 글쓰기 등 만능 |
| **Gemini** | Google | 구글 검색과 연결돼서 최신 정보에 강함 |
| **Claude** | Anthropic | 안전하고 정직한 답변을 중시. 긴 글 분석에 강함 |

> 이 세 AI 모두 **대형 언어 모델(LLM)** 이라는 같은 기술을 사용해요.
> 하지만 학습 데이터와 만드는 방법이 달라서 성격과 강점이 조금씩 다릅니다.

### 어떤 걸 써야 하나요?

정답은 없어요! 하고 싶은 일에 따라 다릅니다:
- 최신 정보가 필요하면 → **Gemini** (구글 검색 연동)
- 코딩 도움이 필요하면 → **ChatGPT** 또는 **Claude**
- 긴 문서를 분석하고 싶으면 → **Claude** (긴 글 처리에 강함)
- 무료로 써보고 싶으면 → 세 가지 모두 무료 버전이 있어요!`,
    },
    {
      type: "markdown",
      source: `## 실습 1: AI에게 자기 자신에 대해 물어보기

지금 우리가 쓰고 있는 AI에게 자기 자신에 대해 물어봅시다!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 자기 자신에 대해 물어봅시다
const response = await chat({
  messages: [
    { role: "user", content: "너는 어떤 AI야? 이름이 뭐고, 누가 만들었고, 뭘 잘하는지 초등학생도 이해할 수 있게 간단히 소개해줘." }
  ],
});

console.log(response.text);`,
      hints: [
        "AI마다 자기 소개가 다를 수 있어요!",
        "AI가 자기에 대해 하는 말도 100% 정확하지 않을 수 있다는 걸 기억하세요.",
      ],
    },
    {
      type: "markdown",
      source: `## LLM 말고 다른 AI도 있어요!

대형 언어 모델(LLM)은 AI의 한 종류일 뿐이에요.
세상에는 다양한 AI가 있답니다.

| AI 종류 | 하는 일 | 예시 서비스 |
|---------|---------|-----------|
| **언어 AI (LLM)** | 대화, 글쓰기, 번역 | ChatGPT, Claude, Gemini |
| **이미지 AI** | 그림 생성, 사진 편집 | DALL-E, Midjourney, Stable Diffusion |
| **음성 AI** | 목소리를 글로, 글을 목소리로 | 시리, 빅스비, Whisper |
| **영상 AI** | 동영상 만들기 | Sora, Runway |
| **음악 AI** | 노래 만들기 | Suno, Udio |
| **게임 AI** | 게임 속 적 캐릭터 행동 | 게임 NPC, 바둑 AI (AlphaGo) |

> 이 모든 AI가 공통적으로 하는 것: **데이터에서 패턴을 배운다!**
> 언어 AI는 글에서, 이미지 AI는 그림에서, 음악 AI는 음악에서 패턴을 학습합니다.`,
    },
    {
      type: "markdown",
      source: `## 실습 2: AI에게 다른 AI 종류 설명 듣기

AI에게 자기 종류 말고 다른 AI에 대해서도 물어봅시다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 다양한 AI 종류에 대해 물어봅시다
const response = await chat({
  messages: [
    { role: "system", content: "너는 AI 기술을 초등학생에게 쉽게 설명해주는 선생님이야. 비유와 예시를 많이 써서 설명해줘." },
    { role: "user", content: "이미지 AI, 음성 AI, 음악 AI가 각각 어떻게 작동하는지 재미있는 비유로 설명해줘. 각각 2~3문장으로 짧게!" }
  ],
});

console.log(response.text);`,
      hints: [
        "AI는 분야마다 학습하는 데이터가 다르지만, '패턴을 배운다'는 원리는 같아요.",
      ],
    },
    {
      type: "markdown",
      source: `## 클라우드 AI vs 로컬 AI

AI가 어디에서 실행되는지에 따라 두 가지로 나눌 수 있어요.

### ☁️ 클라우드 AI (인터넷 필요)
- ChatGPT, Gemini, Claude 등은 모두 **회사의 서버**에서 돌아가요
- 내 질문이 인터넷을 통해 서버로 가고, 답이 돌아오는 방식
- **장점**: 매우 똑똑하고 강력함
- **단점**: 인터넷이 필요, 개인정보가 서버로 전송됨

### 💻 로컬 AI (내 컴퓨터에서 실행)
- 내 컴퓨터나 핸드폰에서 직접 실행되는 AI
- **WebLLM** 같은 기술을 쓰면 브라우저에서도 AI를 돌릴 수 있어요!
- **장점**: 인터넷 없이도 사용 가능, 개인정보가 밖으로 나가지 않음
- **단점**: 클라우드 AI보다 덜 똑똑할 수 있음 (컴퓨터 성능의 한계)

> 💡 지금 이 플랫폼에서도 WebLLM을 사용할 수 있어요!
> 인터넷 없이 브라우저에서 AI를 실행하는 놀라운 기술이에요.`,
    },
    {
      type: "markdown",
      source: `## 실습 3: AI에게 클라우드와 로컬의 차이 물어보기`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 클라우드 AI와 로컬 AI의 차이를 비교해봅시다
const response = await chat({
  messages: [
    { role: "system", content: "너는 AI 기술 전문가이면서 초등학생 눈높이에 맞춰 설명하는 선생님이야." },
    { role: "user", content: "클라우드 AI(ChatGPT 등)와 로컬 AI(내 컴퓨터에서 실행)의 차이를 표로 비교해줘. 항목은 '속도', '똑똑함', '인터넷 필요 여부', '개인정보 안전', '비용'으로 해줘." }
  ],
});

console.log(response.text);`,
      hints: [
        "각각 장단점이 있어서, 상황에 맞게 선택하면 돼요!",
        "개인정보가 중요한 경우에는 로컬 AI가 더 안전할 수 있어요.",
      ],
    },
    {
      type: "markdown",
      source: `# Ch06 정리

| 배운 것 | 내용 |
|---------|------|
| LLM 서비스 | ChatGPT(OpenAI), Gemini(Google), Claude(Anthropic) — 각각 강점이 다르다 |
| AI의 종류 | 언어, 이미지, 음성, 영상, 음악, 게임 등 다양한 AI가 있다 |
| 공통 원리 | 모든 AI는 데이터에서 패턴을 학습한다 |
| 클라우드 vs 로컬 | 서버에서 실행(강력) vs 내 기기에서 실행(프라이버시) |

**핵심**: AI는 하나가 아닙니다! 다양한 종류가 있고,
하고 싶은 일에 맞는 AI를 골라 쓰는 것이 중요해요.

앞으로 AI 기술은 더 발전할 거예요.
지금 이 기초를 잘 배워두면 새로운 AI가 나와도 금방 이해할 수 있을 거예요! 🚀`,
    },
  ],

  quiz: {
    title: "Ch06 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "ChatGPT, Gemini, Claude의 공통점은 무엇인가요?",
        options: [
          "모두 같은 회사에서 만들었다",
          "모두 대형 언어 모델(LLM) 기술을 사용한다",
          "모두 그림을 그릴 수 있다",
          "모두 인터넷 없이 사용할 수 있다",
        ],
        correctIndex: 1,
        explanation:
          "ChatGPT(OpenAI), Gemini(Google), Claude(Anthropic)는 서로 다른 회사에서 만들었지만, 모두 대형 언어 모델(LLM) 기술을 기반으로 합니다.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 이미지 AI에 해당하는 것은?",
        options: [
          "ChatGPT",
          "시리(Siri)",
          "DALL-E",
          "AlphaGo",
        ],
        correctIndex: 2,
        explanation:
          "DALL-E는 OpenAI가 만든 이미지 생성 AI입니다. ChatGPT는 언어 AI, 시리는 음성 AI, AlphaGo는 게임 AI예요.",
      },
      {
        type: "multiple-choice",
        question: "로컬 AI(내 컴퓨터에서 실행되는 AI)의 가장 큰 장점은?",
        options: [
          "클라우드 AI보다 항상 더 똑똑하다",
          "인터넷 없이도 사용 가능하고 개인정보가 밖으로 나가지 않는다",
          "무조건 무료로 사용할 수 있다",
          "모든 종류의 AI 기능을 다 할 수 있다",
        ],
        correctIndex: 1,
        explanation:
          "로컬 AI는 내 기기에서 실행되기 때문에 인터넷이 필요 없고, 데이터가 외부 서버로 전송되지 않아 개인정보 보호에 유리합니다.",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson04: Lesson = {
  id: "ai-intro-04-ai-principles",
  language: "ai-engineering",
  track: "intro",
  order: 4,
  title: "AI의 원리",
  subtitle: "AI는 어떻게 이렇게 똑똑할까?",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# AI의 원리

AI가 대화도 하고 글도 쓰고 그림도 그리는 걸 보면 정말 신기하죠?
그런데 AI는 **정말로 생각하는 걸까요?**

이번 강의에서는 AI가 어떻게 작동하는지,
그리고 AI가 **잘하는 것과 못하는 것**이 무엇인지 알아봅니다.

## 이번 강의에서 배울 것
| # | 내용 |
|---|------|
| 1 | AI는 어떻게 답을 만들어내는지 |
| 2 | 패턴 인식 — AI의 핵심 능력 |
| 3 | AI가 잘하는 것과 못하는 것 |
| 4 | '환각(할루시네이션)' — AI가 거짓말을 하는 이유 |`,
    },
    {
      type: "markdown",
      source: `## AI는 '다음 단어 예측기'

AI(특히 ChatGPT, Claude 같은 대형 언어 모델)의 핵심 원리는 매우 단순합니다:

> **앞에 나온 글을 보고, 다음에 올 단어를 예측한다.**

예를 들어:
- "오늘 날씨가 정말..." → AI 예측: **"좋네요"** 또는 **"춥네요"**
- "1 + 1 = " → AI 예측: **"2"**
- "대한민국의 수도는..." → AI 예측: **"서울"**

AI는 인터넷의 수십억 개 문장을 읽고 **패턴**을 배웠어요.
그래서 어떤 말 뒤에 어떤 말이 올 확률이 높은지 아는 거예요.

### 비유: 문장 빈칸 채우기 달인

학교에서 빈칸 채우기 문제를 풀 때, 앞뒤 문맥을 보고 답을 맞추죠?
AI도 바로 그런 방식으로 작동해요. 단, **수십억 개의 문장**으로 연습했다는 차이가 있을 뿐!`,
    },
    {
      type: "markdown",
      source: `## 실습 1: AI의 패턴 인식 능력 확인하기

AI가 패턴을 얼마나 잘 인식하는지 테스트해봅시다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 패턴을 이어가라고 해봅시다
const response = await chat({
  messages: [
    { role: "user", content: "다음 패턴을 이어가줘:\\n\\n1, 2, 4, 8, 16, ...\\n\\n월, 화, 수, 목, ...\\n\\n빨, 주, 노, 초, ...\\n\\n각각 다음에 뭐가 오는지 알려줘." }
  ],
});

console.log(response.text);`,
      hints: [
        "AI는 숫자 패턴, 요일, 무지개 색 순서 등 다양한 패턴을 인식할 수 있어요.",
        "더 복잡한 패턴도 시도해보세요!",
      ],
    },
    {
      type: "markdown",
      source: `## AI가 잘하는 것 vs 못하는 것

AI가 모든 것을 완벽하게 하는 건 아닙니다!

| 잘하는 것 ✅ | 못하는 것 ❌ |
|------------|------------|
| 글쓰기, 요약, 번역 | 최신 뉴스 (학습 이후 정보) |
| 패턴 인식 | 복잡한 수학 계산 (가끔 틀림) |
| 아이디어 제안 | 개인적인 경험 (없으니까!) |
| 코드 작성 도움 | 100% 정확한 사실 보장 |

특히 주의할 점: AI는 **자신이 틀렸다는 것을 모릅니다.**
자신 있는 말투로 틀린 정보를 말할 수 있어요!`,
    },
    {
      type: "markdown",
      source: `## 실습 2: AI의 수학 능력 테스트

AI에게 수학 문제를 내봅시다. 간단한 것은 맞추지만, 복잡해지면 틀릴 수 있어요!`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// AI에게 수학 문제를 내봅시다
const response = await chat({
  messages: [
    { role: "user", content: "다음 문제들을 풀어줘:\\n\\n1) 7 + 8 = ?\\n2) 23 x 17 = ?\\n3) 4567 x 8901 = ?\\n4) 123456789 x 987654321 = ?\\n\\n각각 답만 간단히 써줘." }
  ],
});

console.log(response.text);
console.log("\\n--- 확인해보세요! ---");
console.log("1) 7 + 8 = 15");
console.log("2) 23 x 17 = 391");
console.log("3) 4567 x 8901 = 40,648,467");
console.log("4) 123456789 x 987654321 = 121,932,631,112,635,269");`,
      hints: [
        "간단한 덧셈은 맞추지만, 큰 수의 곱셈은 틀릴 수 있어요!",
        "AI는 계산기가 아니라 '다음 단어 예측기'이기 때문이에요.",
      ],
    },
    {
      type: "markdown",
      source: `## 환각(할루시네이션)이란?

AI가 **진짜처럼 보이지만 사실이 아닌 정보를 만들어내는 것**을 '환각' 또는 '할루시네이션(hallucination)'이라고 합니다.

왜 이런 일이 생기나요?
- AI는 "다음에 올 **그럴듯한** 단어"를 예측하는 것뿐이에요
- 진짜인지 가짜인지 **구분하는 능력**이 없어요
- 모르는 것도 자신 있게 답변해버려요

> 이것이 AI를 사용할 때 가장 조심해야 할 점이에요!`,
    },
    {
      type: "markdown",
      source: `## 실습 3: AI의 환각 체험하기

존재하지 않는 것에 대해 질문해서 AI가 어떻게 반응하는지 봅시다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 존재하지 않는 것에 대해 물어봅시다
const response = await chat({
  messages: [
    { role: "user", content: "'블루베리 치킨 피자 정리(Blueberry Chicken Pizza Theorem)'라는 수학 정리에 대해 설명해줘." }
  ],
});

console.log(response.text);
console.log("\\n⚠️ 주의: '블루베리 치킨 피자 정리'는 존재하지 않는 가짜 수학 정리입니다!");
console.log("AI가 마치 진짜 있는 것처럼 설명했다면, 이것이 바로 '환각(hallucination)'이에요.");`,
      hints: [
        "AI가 그럴듯하게 설명한다면, 이것이 환각이에요!",
        "'모르겠다'고 답한다면 이 AI는 솔직한 거예요. 하지만 많은 경우 AI는 지어내서 답합니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 실습 4: AI에게 '모른다고 말하기'를 가르치기

system 메시지를 이용해서 AI가 모르는 것은 솔직하게 말하도록 설정할 수 있어요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// system 메시지로 AI에게 솔직하게 답하라고 지시해봅시다
const response = await chat({
  messages: [
    { role: "system", content: "너는 정직한 AI야. 확실하지 않은 정보는 반드시 '잘 모르겠어요' 또는 '확실하지 않아요'라고 말해야 해. 절대로 지어내지 마." },
    { role: "user", content: "'블루베리 치킨 피자 정리(Blueberry Chicken Pizza Theorem)'라는 수학 정리에 대해 설명해줘." }
  ],
});

console.log(response.text);`,
      hints: [
        "system 메시지가 있으면 AI가 더 솔직하게 답할 가능성이 높아져요.",
        "하지만 그래도 100% 믿으면 안 돼요! 항상 중요한 정보는 직접 확인하세요.",
      ],
    },
    {
      type: "markdown",
      source: `# Ch04 정리

| 배운 것 | 내용 |
|---------|------|
| AI의 원리 | 앞의 글을 보고 다음 단어를 예측하는 것 |
| 패턴 인식 | AI는 수십억 문장에서 배운 패턴을 활용한다 |
| AI의 한계 | 큰 수 계산, 최신 정보, 100% 정확성은 보장하지 못한다 |
| 환각 | AI가 모르는 것도 자신 있게 지어내는 현상 |
| 대처법 | system 메시지로 솔직하게 답하도록 지시 + 중요한 정보는 직접 확인 |

**핵심**: AI는 **매우 유용한 도구**이지만, **무조건 믿으면 안 됩니다.**
항상 AI의 답을 **확인하는 습관**을 가지세요!

**다음 강의**: 프롬프트 엔지니어링 — AI에게 잘 부탁하는 기술!`,
    },
  ],

  quiz: {
    title: "Ch04 이해도 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "AI(대형 언어 모델)가 답변을 만드는 기본 원리는 무엇인가요?",
        options: [
          "인터넷을 실시간으로 검색해서 답을 찾는다",
          "앞의 글을 보고 다음에 올 단어를 예측한다",
          "사람처럼 생각하고 이해해서 답한다",
          "미리 저장된 답변 목록에서 골라서 보여준다",
        ],
        correctIndex: 1,
        explanation:
          "AI는 앞에 나온 텍스트를 보고, 다음에 올 확률이 높은 단어를 예측하는 방식으로 작동합니다. 수십억 개의 문장에서 배운 패턴을 활용하는 거예요.",
      },
      {
        type: "multiple-choice",
        question: "AI의 '환각(할루시네이션)'이란 무엇인가요?",
        options: [
          "AI가 화면에 이상한 그림을 보여주는 것",
          "AI가 진짜처럼 보이지만 사실이 아닌 정보를 만들어내는 것",
          "AI가 갑자기 작동을 멈추는 것",
          "AI가 사용자의 질문을 이해하지 못하는 것",
        ],
        correctIndex: 1,
        explanation:
          "환각(hallucination)은 AI가 사실이 아닌 정보를 마치 진짜인 것처럼 자신 있게 만들어내는 현상입니다. AI는 '그럴듯한 다음 단어'를 예측할 뿐, 진위를 판단하지 못하기 때문이에요.",
      },
      {
        type: "multiple-choice",
        question: "AI가 큰 수의 곱셈을 틀리는 이유는 무엇인가요?",
        options: [
          "AI의 배터리가 부족해서",
          "AI는 계산기가 아니라 다음 단어를 예측하는 방식이라서",
          "큰 수는 AI에게 입력할 수 없어서",
          "AI가 일부러 틀리게 답해서",
        ],
        correctIndex: 1,
        explanation:
          "AI는 계산기처럼 정확한 연산을 하는 것이 아니라, '이 숫자 다음에는 이런 숫자가 올 것 같다'고 예측하는 것이기 때문에 복잡한 계산에서 틀릴 수 있습니다.",
      },
      {
        type: "multiple-choice",
        question: "AI의 환각을 줄이기 위한 좋은 방법은?",
        options: [
          "AI에게 더 빨리 답하라고 요청한다",
          "같은 질문을 100번 반복한다",
          "system 메시지로 모르는 것은 솔직히 말하라고 지시하고, 중요한 정보는 직접 확인한다",
          "AI를 껐다가 다시 켠다",
        ],
        correctIndex: 2,
        explanation:
          "system 메시지로 솔직하게 답하도록 지시하면 환각을 줄일 수 있고, 중요한 정보는 항상 다른 출처로 확인하는 습관이 중요합니다.",
      },
    ],
  } satisfies Quiz,
};

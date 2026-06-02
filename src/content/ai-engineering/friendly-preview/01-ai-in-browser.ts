import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * 친화 버전 미리보기 — 01강.
 * 🃏 카드는 마크다운(이모지 blockquote → 카드 div 변환), 🤖/📝 는 실제 인터랙티브 셀(ai-try / quiz-input).
 */
export const lesson01: Lesson = {
  id: "ai-eng-fr-01-ai-in-browser",
  language: "ai-engineering",
  track: "friendly-preview",
  order: 1,
  title: "01. AI가 브라우저에 산다",
  subtitle: "LLM과 처음 대화하기, 그리고 '성격' 조절하기",
  estimatedMinutes: 12,
  cells: [
    {
      type: "markdown",
      source: `# 🤖 01강. AI가 브라우저에 산다
### — LLM과 처음 대화하기, 그리고 "성격" 조절하기

⏱️ 12분 · 🧰 설치·가입 없이 바로 시작

> 🃏 **30초 미리보기**
> AI(LLM)는 **"다음에 올 말을 계속 이어 붙이는 똑똑한 자동완성"** 입니다.
> 이 강의에선 ① AI가 뭔지 ② 똑같은 질문에도 **답을 다르게** 만드는 손잡이(temperature) ③ AI에게 **역할**을 정해주는 법(system prompt)을 익힙니다.`,
    },
    {
      type: "markdown",
      source: `## 1. LLM이 뭐예요?

> 🃏 **한마디로**
> LLM = **스마트폰 자동완성의 초강력 버전.**
> 지금까지의 글을 보고 "다음에 올 가장 그럴듯한 단어"를 계속 이어 붙입니다. 그게 쌓여 문장·답변이 됩니다.

그래서 AI는 "정답을 아는" 게 아니라 **"그럴듯한 말을 이어가는"** 도구예요. (이 사실이 뒤에서 아주 중요해집니다.)`,
    },
    {
      type: "markdown",
      source: `## 2. AI가 내 브라우저 안에서 돈다고?

보통 AI는 거대한 서버에 있지만, **작은 AI는 내 브라우저(컴퓨터) 안에서** 바로 돌릴 수도 있어요.

> 🃏 **브라우저 AI의 장점**
> ✅ 설치·가입·요금 없음  ✅ 인터넷 끊겨도 작동  ✅ 내 데이터가 밖으로 안 나감
> ⚠️ 단, 작은 AI라 큰 서버 AI보다 **덜 똑똑**합니다.

아래 입력창에 직접 말을 걸어보세요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        prompt: "안녕, 너는 누구야? 한 문장으로 소개해줘",
        placeholder: "AI에게 하고 싶은 말을 입력...",
        note: "첫 실행은 AI를 내려받느라 잠깐 걸려요. 답이 오면 성공!",
      }),
    },
    {
      type: "markdown",
      source: `## 3. 같은 질문, 다른 답 — "temperature" 손잡이

AI에게 똑같이 물어도 **어떤 땐 똑같은 답, 어떤 땐 매번 다른 답**이 나옵니다. 이걸 정하는 게 ==temperature== 예요.

> 🃏 **temperature = "엉뚱함 손잡이" 🎚️**
> AI는 다음 단어 후보들을 **점수표**로 들고 있어요. temperature는 그 점수표를 얼마나 **흔드는지** 정합니다.
> - 0 = 흔들지 않음 → **항상 1등 단어** (똑같고 안전한 답)
> - 1 = 적당히 흔듦 → **자연스럽고 다양**
> - 1 초과 = 마구 흔듦 → 꼴찌 단어도 튀어나와 **말이 이상해짐**

| 상황 | 추천 temperature |
|---|---|
| 사실·요약·번역 (정확해야 함) | 낮게 (0~0.3) |
| 아이디어·글쓰기 (다양해야 함) | 높게 (0.7~1) |

> 🖼️ [이미지 제안] 점수표(막대그래프)를 손잡이로 "평평하게 누르기 vs 마구 흔들기" 하는 비교 일러스트.

아래에서 자유도를 0과 1로 바꿔가며 같은 질문을 보내보세요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "AI에게 직접 물어보기 (손잡이 비교)",
        prompt: "고양이를 소개하는 한 문장을 써줘",
        showTemp: true,
        note: "자유도 0과 1로 각각 보내보세요 — 0은 비슷한 답, 1은 매번 달라지는 걸 확인!",
      }),
    },
    {
      type: "markdown",
      source: `## 4. AI에게 "역할"을 정해주기 — system prompt

대화 맨 앞에 *"너는 ○○야"* 라고 역할을 깔아주면, AI가 그 캐릭터로 일관되게 답합니다.

> 🃏 **예시**
> "너는 **친절한 초등 선생님**이야" → 쉽고 따뜻하게 설명
> "너는 **깐깐한 변호사**야" → 신중하고 조건을 따져서 답
> 같은 질문도 **역할에 따라 답의 톤이 완전히** 달라집니다.`,
    },
    {
      type: "markdown",
      source: `## 5. 🎬 샘플 사례 — "여행 문구 만들기"

> 🎬 친구 SNS에 올릴 제주도 여행 사진 문구가 필요하다. AI에게 부탁해보자.

> 🃏 **이렇게 조합하면**
> 1) **역할**: "너는 감성적인 카피라이터야" (system prompt)
> 2) **엉뚱함**: temperature 0.9 (다양한 문구가 필요하니까)
> 3) 요청: "제주 바다 사진에 어울리는 짧은 문구 3개"
> → 매번 신선한 문구가 쏟아집니다. 마음에 안 들면 다시 실행만 하면 됨!

> 🃏 **반대로** "회사 환불 규정을 정확히 요약" 이라면?
> → 역할 "정확한 안내원", temperature 0 (사실은 흔들면 안 되니까). **목적에 맞게 손잡이를 돌리는 게 핵심.**`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 여행 문구 만들기",
        prompt:
          "너는 감성적인 카피라이터야. 제주 바다 사진에 어울리는 짧은 SNS 문구 3개를 써줘. 각 20자 이내로.",
        showTemp: true,
        note: "위 사례를 그대로 담았어요. 자유도 1(다양)로 보내보고, 마음에 안 들면 다시 보내기! 매번 새 문구가 나옵니다. 자유도 0(안정)과도 비교해보세요.",
      }),
    },
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## AI는 "정답 기계"가 아니라 **"말을 이어가는 도구"** 다.
> 그래서 **역할(누구처럼)** 과 **temperature(얼마나 자유롭게)** 를 **목적에 맞게** 정해주는 사람이 좋은 답을 얻는다.`,
    },
    {
      type: "markdown",
      source: `📎 (개발자라면) 코드로 \`chat()\` 을 직접 호출하는 법 → **개발자 심화 트랙**.

👇 아래 **퀴즈 시작**을 눌러 배운 걸 클릭으로 확인해보세요.`,
    },
  ],

  quiz: {
    title: "01강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "AI(LLM)를 가장 잘 설명한 것은?",
        options: [
          "정답을 데이터베이스에서 찾아주는 검색기",
          "'다음에 올 그럴듯한 말'을 이어 붙이는 똑똑한 자동완성",
          "인터넷을 실시간 검색하는 도구",
          "계산만 하는 프로그램",
        ],
        correctIndex: 1,
        explanation: "LLM은 정답을 '아는' 게 아니라 그럴듯한 말을 이어갑니다. 그래서 역할·temperature로 잘 유도하는 게 중요해요.",
      },
      {
        type: "multiple-choice",
        question: "정확한 번역을 원할 때 temperature는?",
        options: ["높게 (0.7~1)", "낮게 (0~0.3)", "상관없다"],
        correctIndex: 1,
        explanation: "낮게(0~0.3). 번역은 흔들리면 안 되니 안정적인 '1등 단어'를 골라야 해요.",
      },
      {
        type: "multiple-choice",
        question: 'AI에게 "너는 친절한 영양사야"처럼 역할을 까는 것을 뭐라고 부를까요?',
        options: ["few-shot (예시 보여주기)", "system prompt (역할 지정)", "temperature"],
        correctIndex: 1,
        explanation: "system prompt(역할 지정). 대화 맨 앞에 역할을 깔아주면 AI가 그 캐릭터로 일관되게 답합니다.",
      },
      {
        type: "multiple-choice",
        question: '(적용) "회사 환불 규정을 정확히 요약" 하려면 어떤 조합이 가장 좋을까요?',
        options: [
          "역할 '정확한 안내원' + temperature 0",
          "역할 '감성 시인' + temperature 1",
          "역할 없이 temperature 1.5",
        ],
        correctIndex: 0,
        explanation: "사실 요약은 흔들리면 안 되니 temperature 0 + '정확한 안내원' 역할이 맞아요. (목적에 맞게 손잡이를 돌리는 게 핵심)",
      },
    ],
  } satisfies Quiz,
};

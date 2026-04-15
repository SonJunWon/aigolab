import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * Ch01 — AI 가 브라우저에 산다.
 *
 * 핵심 메시지: 설치·가입·키 발급 없이도 AI 모델이 브라우저 안에서 돌아간다.
 * 실행: WebLLM (Llama 3.2 1B, 약 879MB).
 * 의무: Meta Llama 라이선스 — "Built with Llama" 배지 + 라이선스 링크.
 */
export const lesson01: Lesson = {
  id: "ai-eng-01-webllm-intro",
  language: "ai-engineering",
  track: "beginner",
  order: 1,
  title: "AI 가 브라우저에 산다",
  subtitle: "설치도, 가입도 없이 — 지금 여기서 LLM 과 대화하기",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 🤖 AI 가 여러분 브라우저에 산다

여러분은 지금 이 순간, **AI 모델을 여러분의 컴퓨터에서 직접 실행** 하게 됩니다.
- ❌ 서버 가입
- ❌ API 키 발급
- ❌ 결제 정보 입력
- ✅ 그냥 실행

이게 가능한 이유는 **WebLLM** — 브라우저에서 LLM 을 돌리는 오픈소스 프로젝트 덕분이에요.
Meta 의 \`Llama 3.2 1B\` 모델 (879MB) 이 여러분 브라우저 안으로 다운로드되고, 이후엔
**네트워크 없이도** AI 가 대답합니다.

> ⚠️ **첫 실행** 은 2분 정도 걸려요 — 모델을 처음 다운받는 시간. 두 번째부턴 몇 초면 준비됩니다.
> 💡 크롬·엣지 최신 버전 권장 (WebGPU 필요).`,
    },
    {
      type: "markdown",
      source: `## 🚀 첫 대화

아래 셀을 **Cmd/Ctrl + Enter** 로 실행해보세요.
\`chat\` 함수가 곧바로 호출 가능하게 주입돼 있어요 — 따로 import 할 필요 없습니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// task: "offline" 은 "네트워크·키 없이 브라우저 안에서" 라는 뜻입니다.
const response = await chat({
  task: "offline",
  messages: [
    { role: "user", content: "파이썬으로 Hello World 를 출력하는 가장 짧은 방법은?" },
  ],
});

console.log(response.text);`,
      hints: [
        "첫 실행은 모델 다운로드 (약 879MB) 때문에 오래 걸려요. 프로그레스 메시지가 출력될 거예요.",
        "response.text 에 답변이 들어있어요. response.model 로 어떤 모델이 돌았는지도 확인 가능.",
      ],
    },
    {
      type: "markdown",
      source: `## 🧪 같은 질문, 다른 온도

**온도 (temperature)** 는 "답변이 얼마나 창의적인가" 를 정합니다.
- \`0.0\` 에 가까우면: 결정적 · 일관된 답
- \`1.0\` 에 가까우면: 다양 · 예측 불가

같은 질문을 두 번 다른 온도로 돌려보세요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `const prompt = "호랑이가 주인공인 3줄짜리 짧은 이야기를 써줘.";

const cold = await chat({
  task: "offline",
  temperature: 0.1,
  messages: [{ role: "user", content: prompt }],
});

const hot = await chat({
  task: "offline",
  temperature: 1.0,
  messages: [{ role: "user", content: prompt }],
});

console.log("── 차가운 (0.1) ──");
console.log(cold.text);
console.log("\\n── 뜨거운 (1.0) ──");
console.log(hot.text);`,
      hints: [
        "temperature 숫자를 0.0 ~ 1.0 범위에서 바꿔가며 실험해보세요.",
        "작은 모델(1B)이라 창의성 차이가 크진 않을 수 있어요. 뒤에 나올 Gemini 로 다시 실험하면 차이가 뚜렷.",
      ],
    },
    {
      type: "markdown",
      source: `## 🛠️ 시스템 프롬프트 — 캐릭터 부여하기

\`role: "system"\` 메시지로 AI 의 "성격" 을 정할 수 있어요.
아래는 같은 질문에 "초등학생 말투" 로 답하도록 시킨 예.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `const response = await chat({
  task: "offline",
  messages: [
    {
      role: "system",
      content: "너는 7살 초등학생이야. 어려운 단어는 쓰지 말고 짧게 대답해.",
    },
    {
      role: "user",
      content: "왜 하늘은 파랄까?",
    },
  ],
});

console.log(response.text);`,
      hints: [
        "system 메시지를 바꾸면 답변 스타일도 바뀌어요. '전문 과학자처럼' / '랩퍼처럼' 등을 시도해보세요.",
      ],
    },
    {
      type: "markdown",
      source: `## 🧭 브라우저 내 실행의 의미

지금 여러분이 돌린 AI 는 **완전히 여러분 컴퓨터 안에** 있어요.

| 장점 | 단점 |
|---|---|
| 인터넷 끊겨도 동작 (첫 로드 후) | 첫 다운로드 시간 필요 |
| 데이터가 외부로 안 나감 — 프라이버시 👑 | 큰 모델은 못 돌림 (메모리 한계) |
| 비용 0원, 한도 없음 | 응답 속도가 느림 (GPU 성능 의존) |
| WebGPU 만 있으면 어디서든 | 모바일은 메모리 부족 가능 |

**다음 장 (Ch02)** 에선 **Google Gemini** API 를 써서 더 똑똑한 모델로 프롬프트 엔지니어링을
배웁니다. 브라우저 내 WebLLM 과 클라우드 LLM — 언제 무엇을 쓰면 좋은지 감을 잡게 될 거예요.`,
    },
    {
      type: "markdown",
      source: `---

**🦙 Built with Llama** — 이 레슨은 Meta 의 [Llama 3.2](https://www.llama.com/) 모델을 사용합니다.
[Llama Community License](https://www.llama.com/llama3_2/license/) 에 따라 자유로운 교육·상업적 이용이 허용되며, 모델 사용 시 "Built with Llama" 표기가 요구됩니다.`,
    },
  ],
  quiz: {
    title: "Ch01 — WebLLM 이해도 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "WebLLM 의 가장 큰 차별점은 무엇인가요?",
        options: [
          "클라우드보다 항상 빠르다",
          "설치·계정·네트워크 없이 브라우저 안에서 AI 가 실행된다",
          "모든 거대 모델을 무료로 돌릴 수 있다",
          "API 키가 자동으로 발급된다",
        ],
        correctIndex: 1,
        explanation:
          "WebLLM 은 '브라우저 내 실행' 이 핵심입니다. 데이터가 밖으로 나가지 않고, 첫 다운로드 후 오프라인에서도 동작하는 대신, 모델 크기·속도는 제약이 있어요.",
      },
      {
        type: "multiple-choice",
        question: "temperature 파라미터의 역할은?",
        options: [
          "모델 크기를 바꾼다",
          "응답 속도를 올린다",
          "답변의 무작위성(창의성) 정도를 조절한다",
          "네트워크 사용량을 줄인다",
        ],
        correctIndex: 2,
        explanation:
          "temperature 가 낮을수록 결정적·일관적, 높을수록 다양·창의적 답변이 나옵니다. 보통 0.0 ~ 1.0 범위를 씁니다.",
      },
      {
        type: "multiple-choice",
        question: "role: \"system\" 메시지는 무엇에 쓰이나요?",
        options: [
          "AI 의 내부 버그를 리포트",
          "API 키를 서버로 전송",
          "AI 의 성격·태도·제약을 미리 설정",
          "다른 언어로 번역",
        ],
        correctIndex: 2,
        explanation:
          "system 메시지는 대화 전체에 걸쳐 AI 의 캐릭터·제약을 정의합니다. 'user' 메시지는 실제 질문, 'system' 은 메타 지시에 해당해요.",
      },
      {
        type: "multiple-choice",
        question: "task: \"offline\" 을 지정하면 어떤 provider 가 호출되나요?",
        options: [
          "Google Gemini API",
          "Groq Cloud API",
          "브라우저 내 WebLLM (Llama 3.2)",
          "서버의 GPU 클러스터",
        ],
        correctIndex: 2,
        explanation:
          "SDK 의 라우팅 테이블에 따라 'offline' 은 WebLLM 에 연결됩니다. 키·네트워크 불필요.",
      },
    ],
  } satisfies Quiz,
};

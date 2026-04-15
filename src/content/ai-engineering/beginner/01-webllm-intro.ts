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

> 💡 크롬·엣지 최신 버전 권장 (WebGPU 필요).`,
    },
    {
      type: "markdown",
      source: `## ⏰ 잠깐! 꼭 읽고 실행하세요

| 항목 | 값 |
|:---|:---|
| ⏱️ **첫 실행 소요 시간** | **🔴 2~3분** (모델 다운로드) |
| 📦 다운로드 크기 | 약 879 MB |
| 🔁 두 번째 실행부터 | 🟢 몇 초 (IndexedDB 캐시) |
| 🌐 네트워크 | 첫 번째만 필요, 이후 오프라인 가능 |

> ### 🚨 2~3분간 아무것도 안 나와 보여도 **중단하지 마세요**
> 셀 아래에 \`Fetching ... Loading ...\` 진행 메시지가 스트리밍됩니다.
> Wi-Fi 끊으시면 안 됩니다. 탭 닫으시면 처음부터 다시 받아야 해요.

💡 **기다리는 동안** 아래 \`chat({ task, messages, ... })\` 구조를 읽어두면 다음 셀들이 훨씬 수월합니다.`,
    },
    {
      type: "markdown",
      source: `## 🚀 첫 대화

준비됐으면 아래 셀을 **Cmd/Ctrl + Enter** 로 실행 — 그리고 **인내심을 갖고 2~3분 기다려주세요** ⏳
\`chat\` 함수는 곧바로 호출 가능하게 주입돼 있어 따로 import 할 필요 없습니다.`,
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
      source: `## 🧪 같은 질문, 다른 온도 — 그리고 작은 모델의 한계

**온도 (temperature)** 는 "답변이 얼마나 창의적/무작위적인가" 를 정합니다.
- \`0.0\` 에 가까우면: 결정적 · 일관된 답
- \`1.0\` 에 가까우면: 다양 · 예측 불가

> ⚠️ **스포일러**: 아래 실험을 돌리면 결과가 **일부러 엉망** 으로 나올 거예요.
> 이건 여러분 잘못도, 코드 버그도 아닙니다. **1B 짜리 소형 모델의 본질적 한계** —
> temperature 를 높이면 확률 분포가 얕아서 한국어 같은 복잡한 언어는 **영어·중국어·코드 조각** 이
> 섞여 부서지는 현상이 나타납니다. 이걸 **직접 체감하는 것** 이 이 실습의 핵심이에요.
> Ch02 에서 거대 모델 (Gemini) 로 같은 실험을 다시 해서 차이를 비교합니다.

짧은 프롬프트 + 적당한 온도 차이로 "안전한 vs 불안한" 의 경계를 관찰해봅시다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// 짧은 과제 — 길면 1B 모델이 더 쉽게 무너집니다.
const prompt = "고양이 이름을 한국어로 딱 하나만 지어줘. 이유 없이 이름만.";

const cold = await chat({
  task: "offline",
  temperature: 0.2,
  maxTokens: 40,
  messages: [{ role: "user", content: prompt }],
});

const warm = await chat({
  task: "offline",
  temperature: 0.7,
  maxTokens: 40,
  messages: [{ role: "user", content: prompt }],
});

const hot = await chat({
  task: "offline",
  temperature: 1.2,
  maxTokens: 40,
  messages: [{ role: "user", content: prompt }],
});

console.log("── 🟢 안전 (temp 0.2) ──");
console.log(cold.text);
console.log("\\n── 🟡 적당 (temp 0.7) ──");
console.log(warm.text);
console.log("\\n── 🔴 과열 (temp 1.2) ──");
console.log(hot.text);`,
      hints: [
        "temperature 0.2~0.7 는 대체로 안정. 1.0 을 넘어가면 1B 모델이 자주 부서집니다.",
        "maxTokens 를 20 정도로 낮추면 부서져도 짧게 끝나요. 반대로 200 으로 높이면 과열 구간에서 난장판이 오래 이어지는 걸 볼 수 있습니다.",
        "여러 번 실행해보세요 — 같은 temperature 라도 run 마다 다른 결과가 나옵니다 (특히 0.7 이상).",
      ],
    },
    {
      type: "markdown",
      source: `### 🎯 방금 본 것의 의미

- **0.2** 에서 나온 이름 — 결정적, 아마 "하양이" 또는 비슷한 보편적 선택. 여러 번 돌려도 거의 같은 답.
- **0.7** 에서 — 약간 다양해지지만 한국어 문법은 유지.
- **1.2** 에서 — 한국어가 섞이거나, 영어가 침투하거나, 아예 의미 없는 토큰 나열. **이게 "모델이 부서졌다"** 는 상태.

> 💡 **실무 팁**: 일반적으로 **0.0~0.7 사이** 에서 작업합니다.
> - 분류·추출·코드 : **0.0~0.2**
> - 일반 대화 : **0.3~0.7**
> - 창작 (이미 품질 좋은 큰 모델일 때만) : **0.8~1.0**
> - **1.0 넘기면** 대부분 품질 저하 — 특별히 와일드한 결과를 원하는 경우만.

**작은 모델 (1B)** 일수록 이 경계가 낮아집니다. Ch02 에서 **Gemini 2.0 Flash** 로 같은 실험을 해보면 temperature 1.0 에서도 여전히 한국어를 유지하는 걸 볼 수 있어요 — 모델 크기가 언어 안정성에 주는 영향을 직관적으로 이해하게 됩니다.`,
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
      source: `// temperature 를 낮게 + maxTokens 제한 = 1B 모델도 안정적으로 답변
const response = await chat({
  task: "offline",
  temperature: 0.4,
  maxTokens: 120,
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
        "1B 모델이라 너무 길게 쓰라고 하면 중간에 말이 꼬입니다. maxTokens 로 안전벨트 채우는 습관을 들이세요.",
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
        question: "WebLLM (Llama 3.2 1B) 에서 한국어 답변이 영어·중국어 섞여 부서졌습니다. 가장 가능성 높은 원인은?",
        options: [
          "네트워크 연결이 불안정하다",
          "프롬프트가 한국어여서 그렇다 — 영어로 바꾸면 해결",
          "temperature 가 너무 높아 작은 모델(1B)이 한국어 확률 분포를 유지하지 못하고 붕괴한 상태",
          "WebLLM 자체 버그",
        ],
        correctIndex: 2,
        explanation:
          "작은 모델일수록 temperature 가 높을 때 '부서지는' 임계점이 빨리 찾아옵니다. 같은 프롬프트를 Ch02 Gemini 로 돌리면 temperature 1.0 에서도 한국어가 유지되는 걸 볼 수 있어요 — 모델 크기가 언어 안정성에 미치는 영향을 보여주는 전형적 현상입니다.",
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

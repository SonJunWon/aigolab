import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * Ch02 — 프롬프트 엔지니어링 기초 (Gemini).
 *
 * 목표:
 *   - Gemini API 키를 5분 안에 발급받아 저장 (KeySetupModal)
 *   - 첫 chat 호출로 응답 받기
 *   - system prompt / few-shot / temperature 3개 기법 체득
 *   - 실전 미션: 제품 설명 생성기
 *
 * 실행 라우팅: task 미지정 시 DEFAULT_ROUTES.fast = ["groq", "gemini"] — Groq 있으면 먼저 가지만,
 * 본 레슨은 Gemini 에 집중하고자 `provider: "gemini"` 강제. 학생은 Gemini 키 하나만 있으면 됨.
 */
export const lesson02: Lesson = {
  id: "ai-eng-02-gemini-prompting",
  language: "ai-engineering",
  track: "beginner",
  order: 2,
  title: "프롬프트 엔지니어링의 시작",
  subtitle: "Google Gemini 로 AI 에게 원하는 답 끌어내기",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🔑 먼저, 키 한 번만 받고 시작합시다

이번 장부터는 **클라우드 LLM** 을 씁니다. 브라우저 밖의 거대한 모델(Gemini 2.5 Flash)이
우리 요청을 받아 응답해요. 속도·품질 모두 WebLLM 보다 훨씬 뛰어납니다.

## 🎁 무료로, 3분 안에

| 단계 | 할 일 |
|---|---|
| 1 | [Google AI Studio](https://aistudio.google.com/apikey) 열기 |
| 2 | 구글 계정 로그인 |
| 3 | **"Create API key"** 버튼 클릭 |
| 4 | 생성된 \`AIza...\` 로 시작하는 키 복사 |
| 5 | 이 페이지의 🔑 버튼 → 키 붙여넣기 |

> 💡 **일일 1500회 무료** — 이 레슨 전체를 몇 번이나 돌려도 남습니다.
> 💡 결제 정보 입력 안 해도 돼요.

**⚠️ 키 공유 금지**: 여러분 계정에 청구될 수 있는 자원입니다. 공용 PC 에선 사용 후 삭제하세요.

키 등록이 끝나면 아래 셀을 실행해보세요.`,
    },
    {
      type: "markdown",
      source: `## 🚀 첫 Gemini 호출

\`provider: "gemini"\` 로 어느 모델이 답할지 명시적으로 고릅니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `const response = await chat({
  provider: "gemini",
  messages: [
    { role: "user", content: "AI 와 머신러닝의 차이를 3문장으로 설명해줘." },
  ],
});

console.log(response.text);
console.log("── 메타 ──");
console.log("모델:", response.model);
console.log("응답 시간:", response.latencyMs, "ms");`,
      hints: [
        "키가 저장되어 있지 않으면 LlmError('missing-key') 가 나와요. 상단 🔑 로 키 등록 후 다시 시도.",
        "response.tokensUsed 로 input/output 토큰 수도 확인 가능 — 한도 관리에 유용합니다.",
      ],
    },
    {
      type: "markdown",
      source: `## 1️⃣ 기법: System Prompt — 역할 부여

같은 질문이라도 "**너는 누구인가**" 를 먼저 정하면 답이 확 달라집니다.
아래 셀을 두 번 실행하면서 **system 메시지만 바꿔보세요**.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `const question = "코드 리뷰에서 '이 변수 이름 좀 별로네요' 라는 피드백을 어떻게 받아들일까?";

const formal = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: "너는 15년 경력의 시니어 엔지니어야. 신중하고 예의 바르게 답해.",
    },
    { role: "user", content: question },
  ],
});

const casual = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: "너는 주니어 개발자랑 친한 멘토야. 말을 편하게 하고 유머도 섞어.",
    },
    { role: "user", content: question },
  ],
});

console.log("── 시니어 ──");
console.log(formal.text);
console.log("\\n── 친한 멘토 ──");
console.log(casual.text);`,
      hints: [
        "system 메시지 한 줄이 답변의 어조·길이·관점 모두를 바꿉니다.",
        "'너는 ___ 야' 보다 '다음 제약을 지켜: 1) ___ 2) ___' 처럼 리스트로 적으면 더 정확.",
      ],
    },
    {
      type: "markdown",
      source: `## 2️⃣ 기법: Few-shot — 예시로 가르치기

"감정 분류기" 를 만든다고 상상해보세요. 규칙을 글로 설명하기보다
**예시 3~5개** 를 보여주면 AI 가 훨씬 빠르게 이해합니다.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `const prompt = \`다음 한국어 문장의 감정을 [긍정/부정/중립] 중 하나로 분류해.

예시:
- "오늘 날씨 최고야!" → 긍정
- "또 버그야... 퇴근 언제 하냐." → 부정
- "3시에 회의 있어요." → 중립
- "이거 대박 사건 아니야?" → 긍정
- "사실 별로 기대 안 했는데 괜찮네." → 긍정

분류할 문장:
- "말은 안 했는데 좀 서운했어."
- "내일 비 온대."
- "이 팀 최고야 ㅠㅠ 고마워요 다들."

출력은 각 문장에 대해 한 줄씩, '문장 → 감정' 형식으로.\`;

const response = await chat({
  provider: "gemini",
  temperature: 0.1,
  messages: [{ role: "user", content: prompt }],
});

console.log(response.text);`,
      hints: [
        "예시를 더 많이 줄수록 정확도가 올라갑니다 — 하지만 10개 넘어가면 수확체감.",
        "temperature 를 낮게 (0.0~0.2) 해야 분류 작업에서 일관된 결과가 나와요.",
      ],
    },
    {
      type: "markdown",
      source: `## 3️⃣ 기법: Temperature 실험

**창작** 에는 높은 온도, **분석** 에는 낮은 온도가 유리합니다.
같은 프롬프트로 0.0 과 1.0 을 돌려 차이를 체감해보세요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `const prompt = "고양이 이름 5개만 창의적으로 지어줘. 이유 짧게 포함.";

const cold = await chat({
  provider: "gemini",
  temperature: 0.0,
  messages: [{ role: "user", content: prompt }],
});

const hot = await chat({
  provider: "gemini",
  temperature: 1.0,
  messages: [{ role: "user", content: prompt }],
});

console.log("── temperature 0.0 ──");
console.log(cold.text);
console.log("\\n── temperature 1.0 ──");
console.log(hot.text);`,
      hints: [
        "여러 번 실행하면서 두 버전의 '같은 질문에 같은 답을 하는 정도' 를 관찰해보세요.",
        "코드 작성이나 데이터 분석엔 0.0~0.2, 카피라이팅·아이디에이션엔 0.7~1.0 이 일반적.",
      ],
    },
    {
      type: "markdown",
      source: `## 🎯 미션: 제품 설명 생성기

아래 요구사항을 만족하는 함수 \`describe(product)\` 를 작성하세요:

**입력**: \`{ name: string; features: string[]; audience: string }\`
**출력**: 마케팅 문구 3줄 + 해시태그 5개

힌트:
1. system prompt 로 "마케팅 카피라이터" 역할 부여
2. output 포맷을 명확히 지시 (JSON 또는 번호 리스트)
3. temperature 0.7 정도가 적당`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `interface Product {
  name: string;
  features: string[];
  audience: string;
}

async function describe(product: Product) {
  // TODO: 여기를 채우세요
  // 1) system prompt 설정
  // 2) user message 에 product 정보 구조적으로 포함
  // 3) chat() 호출 + 결과 return
  throw new Error("아직 미구현 — 힌트 참고해 완성해보세요");
}

const result = await describe({
  name: "Pomodoro Plant",
  features: ["25분마다 물 주기", "집중 시간 게임화", "숲 시뮬레이션"],
  audience: "집중력 부족한 대학생",
});

console.log(result);`,
      hints: [
        "function 바디 예시:\\nconst response = await chat({\\n  provider: 'gemini',\\n  temperature: 0.7,\\n  messages: [\\n    { role: 'system', content: '너는 간결한 마케팅 카피라이터야.' },\\n    { role: 'user', content: '제품: ' + product.name + ', 특징: ' + product.features.join(', ') + ', 타겟: ' + product.audience + '. 마케팅 문구 3줄과 해시태그 5개를 작성해.' },\\n  ],\\n});\\nreturn response.text;",
        "프롬프트에 출력 형식을 명시하면 더 안정적: '문구 1) ... 2) ... 3) ... 해시태그: #... #... ...'",
        "응답 품질이 마음에 안 들면 system prompt 에 제약 추가 — '이모지 사용 금지', '존댓말로', '각 문구 20자 이내'.",
      ],
      solution: `interface Product {
  name: string;
  features: string[];
  audience: string;
}

async function describe(product: Product) {
  const response = await chat({
    provider: "gemini",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "너는 간결하고 감각적인 마케팅 카피라이터야. 출력은 반드시 요청된 포맷을 지켜.",
      },
      {
        role: "user",
        content:
          \`제품: \${product.name}
특징: \${product.features.join(", ")}
타겟: \${product.audience}

다음 포맷으로 출력해:
[마케팅 문구]
1) ...
2) ...
3) ...

[해시태그]
#... #... #... #... #...\`,
      },
    ],
  });
  return response.text;
}

const result = await describe({
  name: "Pomodoro Plant",
  features: ["25분마다 물 주기", "집중 시간 게임화", "숲 시뮬레이션"],
  audience: "집중력 부족한 대학생",
});

console.log(result);`,
    },
    {
      type: "markdown",
      source: `## ✅ 정리

이번 장에서 배운 3가지 기법 — **System prompt · Few-shot · Temperature** — 는
앞으로의 모든 장(Agent, RAG, CoT)에서 계속 쓰입니다.

> 💡 실전 팁: 프롬프트를 **문서처럼** 다루세요. 버전 관리, A/B 테스트, 실패 케이스 기록 —
> 이게 프롬프트 엔지니어링의 실제 일입니다.

**다음 장부턴** Groq 을 켜고 Llama 3.3 70B 로 더 빠른 응답을 체감해볼 거예요.
이후 Agent, Tool Calling, RAG, CoT 까지 이어집니다. 🚀`,
    },
  ],
  quiz: {
    title: "Ch02 — 프롬프트 기초 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "system 메시지와 user 메시지의 차이는?",
        options: [
          "system 은 네트워크 설정, user 는 질문",
          "system 은 AI 의 태도/역할/제약, user 는 실제 요청",
          "둘은 아무 차이도 없다",
          "system 은 관리자만 사용 가능",
        ],
        correctIndex: 1,
        explanation:
          "system 은 대화 전체에 걸쳐 유지되는 '메타 지시'. 캐릭터·출력 포맷·금지사항 등을 정의합니다.",
      },
      {
        type: "multiple-choice",
        question: "Few-shot prompting 에서 예시는 왜 주나요?",
        options: [
          "AI 의 무게를 늘려 정확도를 높이기 위해",
          "토큰 소비량을 줄이려고",
          "원하는 패턴/형식을 규칙 설명 대신 예시로 가르쳐서 일관성을 높이려고",
          "AI 가 예시를 다시 그대로 출력하도록",
        ],
        correctIndex: 2,
        explanation:
          "LLM 은 '예시 기반 패턴 매칭'에 강합니다. 3~5개 예시만으로도 분류·포맷팅·번역 등의 작업 품질이 크게 올라가요.",
      },
      {
        type: "multiple-choice",
        question: "아래 중 temperature 를 낮게(0.0~0.2) 설정하기에 가장 적합한 작업은?",
        options: [
          "소설 쓰기",
          "브레인스토밍",
          "데이터 분류 / 추출 / 코드 생성",
          "마케팅 슬로건 만들기",
        ],
        correctIndex: 2,
        explanation:
          "일관성·정확성이 중요한 작업은 낮은 temperature. 창의성이 필요한 작업은 0.7 ~ 1.0 이 보통이에요.",
      },
      {
        type: "multiple-choice",
        question: "키가 없는 학생이 이 레슨을 진행하려면?",
        options: [
          "진행 불가",
          "KeySetupModal 로 키 등록 or 시뮬레이션 모드로 녹화본 재생",
          "관리자에게 서버 API 키 요청",
          "비용 결제",
        ],
        correctIndex: 1,
        explanation:
          "BYOK 모델이지만 키 없어도 '시뮬레이션 모드' 로 강사가 미리 녹화한 응답을 재생하며 진도 가능 — 학습 접근성을 유지합니다.",
      },
    ],
  } satisfies Quiz,
};

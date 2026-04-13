import type { Course } from "../../types/course";
import type { Quiz } from "../../types/quiz";

export const course06: Course = {
  id: "generative-ai",
  title: "생성형 AI와 LLM의 원리",
  subtitle: "ChatGPT는 어떻게 '말'을 할까? — 확률적 언어 모델의 민낯",
  icon: "✨",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 30,
  order: 6,
  sections: [
    {
      type: "text",
      title: "생성형 AI란?",
      content: `## "판별하는 AI" 에서 "만들어 내는 AI" 로

지금까지 본 대부분의 AI는 **판별(Discriminative)** 작업을 했어요.
- 이 사진은 고양이인가 강아지인가?
- 이 메일은 스팸인가 정상인가?
- 이 집의 가격은 얼마인가?

**생성형 AI(Generative AI)** 는 한 걸음 더 나아갑니다.
- 고양이 **사진을 새로 그려내기**
- **문장을 이어 쓰기** (ChatGPT)
- **음성·음악·영상을 생성하기**

### 🖼️ 대표 생성형 AI

| 모델 | 만드는 것 | 예시 |
|------|----------|------|
| **GPT / Claude / Gemini** | 텍스트 | 질문 답변, 요약, 코딩 |
| **DALL·E / Midjourney / Stable Diffusion** | 이미지 | 프롬프트로 그림 생성 |
| **Sora / Veo** | 동영상 | 텍스트 → 영상 |
| **Suno / ElevenLabs** | 음악·음성 | 가사로 노래 / TTS |

> 💡 생성형 AI 의 공통점: 학습한 패턴을 바탕으로 **새로운 샘플**을 만들어 낸다.
> 이 강의에서는 그중 가장 뜨거운 **LLM(Large Language Model, 대규모 언어 모델)** 의 원리에 집중합니다.`,
    },
    {
      type: "text",
      title: "LLM의 한 줄 요약 — '다음 단어 맞히기'",
      content: `## ChatGPT의 진짜 정체

놀랍게도 LLM(ChatGPT, Claude 등) 이 하는 일을 한 문장으로 쓰면:

> 🧠 **"지금까지 나온 문맥이 주어졌을 때, 그 다음에 올 단어의 확률 분포를 계산하고, 그중 하나를 골라 덧붙이는 것."**

이걸 **수없이 반복** 하면 문장이 되고, 문단이 됩니다.

### 🔁 작동 흐름

\`\`\`
"오늘 날씨가 정말"  →  [LLM]  →  다음 단어 후보 확률
                                    "좋다" : 62%
                                    "나쁘다": 18%
                                    "뜨겁다": 9%
                                    "별로"  : 6%
                                    "추우다": 3%
                                    ...
\`\`\`

그중 "좋다" 를 골라 붙이면 → \`"오늘 날씨가 정말 좋다"\`.
이제 새 입력이 \`"오늘 날씨가 정말 좋다"\` 가 되고 다시 다음 단어 예측… 반복.

### 🤔 근데 이렇게 단순한 원리로 왜 "말을 잘하는 것처럼" 보일까?

핵심 재료는 **양** 과 **구조** 두 가지입니다:

1. **거대한 학습 데이터** — 위키피디아·책·웹 전체 규모로 "어떤 단어 뒤에 어떤 단어가 자연스러운지" 관찰
2. **트랜스포머(Transformer)** 구조 — 문맥 안의 **모든 단어끼리 영향을 주고받는** 구조로, 먼 곳의 단서도 놓치지 않음

결국 LLM은 **"확률적 다음-단어 예측기"** 이지만, 그 예측이 인간이 쓸 법한 문장을 만들어 낼 만큼 정교해진 거예요.`,
    },
    {
      type: "text",
      title: "토큰 — 단어가 아니라 '조각'",
      content: `## LLM이 보는 세상은 '단어' 가 아니다

우리는 "오늘", "날씨" 같은 단어 단위로 말하지만, LLM은 **토큰(token)** 이라는 더 작은 조각으로 문장을 쪼개서 처리합니다.

### 토큰화(Tokenization) 예시 (GPT 기준, 대략)

| 원문 | 토큰 분할 |
|------|----------|
| \`hello\` | \`[hello]\` (1 토큰) |
| \`unbelievable\` | \`[un, bel, iev, able]\` (4 토큰) |
| \`안녕하세요\` | 한국어는 보통 3~6 토큰 (BPE 방식) |
| \`😀\` | 1 토큰 (특수 문자도 고유 ID) |

### 💰 토큰 = 요금 단위

OpenAI, Anthropic 같은 회사의 API 는 **토큰 수로 과금** 합니다. 그래서:
- 짧은 프롬프트 + 짧은 답변 → 저렴
- 긴 문서 요약 → 비싼 비용
- "please" 같은 사소한 단어도 토큰을 차지

### 🧮 감 잡기

- 한글 1글자 ≈ **1~2토큰**
- 영어 단어 1개 ≈ **1~2토큰**
- GPT-4 의 "컨텍스트 윈도우" 128K 토큰 ≈ 한국어 책 약 200~300쪽

> 💡 토큰은 LLM 세계의 "화폐" 이자 "시야의 한계" 입니다.`,
    },
    {
      type: "code",
      title: "🧪 실습 — '다음 단어 확률' 을 직접 계산해 보기",
      content: `## 미니 언어 모델을 직접 만들어 봅시다

LLM의 수학은 복잡하지만, **원리** 는 간단해요. 아래 코드는:

1. 여러분이 준 **말뭉치(corpus)** 에서 "단어 A 다음에 단어 B 가 몇 번 나왔는지" 셉니다 (바이그램)
2. 그 카운트로 **다음 단어의 확률 분포** 를 만듭니다
3. 확률을 따라 **문장을 한 단어씩 이어 생성** 합니다

이것이 바로 **"Next-Token Prediction"** 의 축소판 — ChatGPT 가 수십억 배 더 큰 스케일로 하고 있는 바로 그 일입니다.

> ✏️ **해볼 것**: \`corpus\` 의 문장을 바꿔서 어떤 문장이 생성되는지 보세요. \`seed\` 단어를 바꾸면 어떻게 될까요? \`random.seed(42)\` 숫자를 바꾸면?`,
      code: `# 🧪 초간단 언어 모델 — LLM의 원리를 손으로 만져 보기
from collections import Counter, defaultdict
import random

# 👇 말뭉치(corpus) 를 마음껏 바꿔 보세요.
corpus = """
나는 오늘 학교에 갔다
나는 오늘 집에 왔다
나는 어제 학교에 갔다
나는 어제 공원에 갔다
그는 오늘 회사에 갔다
그녀는 오늘 집에 왔다
우리는 오늘 함께 공부했다
우리는 어제 함께 영화를 봤다
""".strip()

# 1. 토큰화 (여기서는 공백 단위 — 진짜 LLM은 BPE 같은 방식)
tokens = corpus.split()
print(f"📦 전체 토큰 수: {len(tokens)}")
print(f"📦 고유 토큰 수: {len(set(tokens))}")
print()

# 2. 바이그램(연속 두 토큰) 집계
next_word = defaultdict(Counter)
for a, b in zip(tokens, tokens[1:]):
    next_word[a][b] += 1

# 3. 특정 단어 뒤의 확률 분포 살펴보기
seed = "나는"           # 👈 바꿔 보세요
print(f"🌱 '{seed}' 다음에 올 수 있는 단어 확률:")
if seed in next_word:
    total = sum(next_word[seed].values())
    for w, c in next_word[seed].most_common():
        pct = 100 * c / total
        bar = "█" * int(pct / 5)
        print(f"   {w:<8} {pct:5.1f}%  {bar}")
else:
    print("   (말뭉치에 없음)")
print()

# 4. 확률을 따라 문장 생성 — 이게 LLM이 하는 일의 축소판!
random.seed(42)         # 👈 숫자 바꾸면 다른 문장
current = seed
generated = [current]
for _ in range(6):
    if current not in next_word:
        break
    words = list(next_word[current].keys())
    weights = list(next_word[current].values())
    current = random.choices(words, weights=weights)[0]
    generated.append(current)

print("🎲 확률 샘플링으로 생성된 문장:")
print("  ", " ".join(generated))
`,
      codeLanguage: "python",
      codeHint:
        "진짜 LLM은 '두 단어' 가 아닌 '수천 토큰의 문맥'을 본다는 점이 다르지만, 원리의 본질은 똑같아요: 조건부 확률 P(다음 단어 | 지금까지의 문맥).",
    },
    {
      type: "text",
      title: "Transformer 와 규모의 법칙",
      content: `## 왜 2017년 이후 AI가 갑자기 폭발했나?

### 🏗️ Transformer (2017) — 게임 체인저

구글 논문 "Attention Is All You Need" 이전까지 언어 모델은 **순차적(RNN)** 으로 처리했어요. 한 번에 한 단어씩, 앞의 정보를 흘려 보내면서.

Transformer는 **셀프 어텐션(Self-Attention)** 으로 이를 바꿉니다:

> 🧠 문장의 **모든 단어가 동시에 서로를 바라보며** "누가 나와 관련 있지?" 를 계산.

- **병렬 처리 가능** → GPU 를 풀로 써서 빠른 학습
- **긴 문맥** 을 잘 다룸 → 소설 전체를 "이해" 할 수 있음

이 구조 덕에 **모델을 크게 만들수록 성능이 쑥쑥** 오르는 현상이 관찰됐어요.

### 📈 규모의 법칙 (Scaling Laws)

| GPT 세대 | 파라미터 수 | 출시 | 의의 |
|---------|------------|------|------|
| GPT-2 (2019) | 1.5억 | 공개 | "꽤 그럴듯한 문장" |
| GPT-3 (2020) | **1,750억** | API | few-shot 학습 발견 |
| GPT-3.5 (2022) | ~? | ChatGPT | 대중화 |
| GPT-4 (2023) | 추정 1조+ | — | 추론 능력 비약 |
| Claude 4 / GPT-5 / Gemini 2 | 공개 안 됨 | 2024~ | 에이전트 능력 |

### 🧪 창발(Emergence)

"모델을 일정 규모 이상 키우면 **학습시키지 않은 능력** 이 갑자기 나타난다" 는 현상.
- 덧셈, 논리 추론, 번역, 코딩… 의도하지 않았는데 생김
- 왜 생기는지는 아직 완전히 규명되지 않음 — AI 연구의 최전선

> 🔑 **"더 많은 데이터 + 더 큰 모델 + 더 많은 연산 = 더 똑똑한 AI"** 라는 현재의 지배 공식.`,
    },
    {
      type: "text",
      title: "LLM의 한계와 '환각(Hallucination)'",
      content: `## 다 잘하는 것 같지만…

LLM은 강력하지만 **본질적 한계** 가 있어요. 잘 쓰려면 이걸 알아야 합니다.

### ⚠️ 환각(Hallucination) — 당당하게 틀림

LLM은 **모르는 것도 그럴듯하게 만들어 냅니다.** 그 이유:
- 학습 방식 자체가 "그럴듯한 다음 단어 고르기" 라서, **"모른다"** 고 하는 것보다 **아무거나 쓰는 것** 이 더 자연스러운 예측일 때가 있음.
- 존재하지 않는 논문, 판례, 함수, URL 을 자신 있게 인용

### 🕰️ 학습 컷오프(Knowledge Cutoff)

모델은 **특정 시점까지의 데이터** 로만 학습됩니다. 그 이후 사건은 모릅니다 (도구·검색 연동 없이는).

### 🔁 추론 vs 암기

- LLM은 "학습 시 본 패턴의 조합" 에 강합니다.
- 처음 보는 **완전히 새로운 추론** 은 여전히 어려워요.
- "한 번도 본 적 없는 체스 포지션을 20수 앞까지 읽어라" 같은 진짜 계산은 약점.

### 💡 그래서 필요한 것 → 좋은 프롬프트

같은 모델이라도 **어떻게 물어보느냐** 에 따라 답이 극적으로 달라집니다.
- 정보를 충분히 주기
- 원하는 형식·역할·제약 명시
- 단계별 사고 유도

> 👉 **다음 강의** 에서는 이 "잘 물어보는 법" — **프롬프트 엔지니어링** 을 본격적으로 다룹니다.`,
    },
    {
      type: "link",
      title: "추천 자료",
      content:
        "3Blue1Brown의 LLM 비주얼 설명 시리즈는 수학을 최소로 하면서 Transformer 구조를 직관적으로 보여줘요. 영어지만 자막으로도 충분히 이해됩니다.",
      linkUrl: "https://www.youtube.com/watch?v=wjZofJX0v4M",
      linkLabel: "3Blue1Brown — But what is a GPT? (YouTube)",
    },
  ],
  quiz: {
    title: "생성형 AI / LLM 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "LLM(예: ChatGPT) 이 텍스트를 생성할 때 핵심적으로 하는 일은?",
        options: [
          "이미 학습된 문장을 검색해서 그대로 돌려준다",
          "지금까지의 문맥을 보고 다음 토큰의 확률을 계산해 하나를 골라 이어 붙인다",
          "질문을 웹에 검색해서 답을 가져온다",
          "규칙 기반 챗봇처럼 if-else 분기를 탄다",
        ],
        correctIndex: 1,
        explanation:
          "LLM의 본질은 '조건부 확률 P(다음 토큰 | 문맥)' 예측입니다. 이걸 수만 번 반복하면서 긴 답변이 만들어져요.",
      },
      {
        type: "multiple-choice",
        question: "토큰(token)에 대한 설명으로 올바른 것은?",
        options: [
          "문장의 단어 하나와 항상 같다",
          "LLM이 입력/출력을 다루는 최소 단위로, 단어보다 작을 수 있다",
          "API 요금과는 무관하다",
          "한국어 1글자는 항상 1토큰이다",
        ],
        correctIndex: 1,
        explanation:
          "토큰은 보통 서브워드(예: BPE) 단위로, 한 단어가 여러 토큰으로 쪼개지기도 합니다. API는 대부분 토큰 수로 과금돼요.",
      },
      {
        type: "multiple-choice",
        question: "Transformer 의 핵심 메커니즘은?",
        options: [
          "순환 신경망(RNN)",
          "합성곱(Convolution)",
          "셀프 어텐션(Self-Attention)",
          "K-평균 군집화",
        ],
        correctIndex: 2,
        explanation:
          "Self-Attention 덕분에 문장 내 모든 토큰이 서로를 동시에 참조할 수 있고, 병렬 학습과 긴 문맥 처리가 가능해졌어요.",
      },
      {
        type: "multiple-choice",
        question:
          "LLM의 '환각(Hallucination)' 현상에 대해 올바르게 설명한 것은?",
        options: [
          "모델이 학습 중 너무 많은 정보를 외워버리는 현상",
          "모델이 사실이 아닌데도 그럴듯한 형태로 대답을 만들어내는 현상",
          "모델이 질문을 이해하지 못해 아무 말도 안 하는 현상",
          "서버가 과부하돼서 응답이 느려지는 현상",
        ],
        correctIndex: 1,
        explanation:
          "LLM은 '모른다' 보다 '그럴듯하게 이어 쓰기' 를 선호하도록 학습돼서, 존재하지 않는 사실·출처를 자신 있게 만들어 낼 수 있어요. 반드시 출처 검증 필요.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "prompt-engineering",
};

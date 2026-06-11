import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 32강 — Instruction Tuning (모듈 6)
 * 지시-응답으로 의도 따르게. AI-try는 마크다운 프롬프트. 코드: 순수 파이썬(before/after).
 */
export const kd32: Course = {
  id: "kd-32-instruction-tuning",
  title: "Instruction Tuning — 말귀를 알아듣게",
  subtitle: "지시-응답 데이터로 '시키는 대로' 따르게",
  icon: "🗣️",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 232,
  sections: [
    {
      type: "text",
      content: `# 🗣️ Instruction Tuning — 지시를 '의도'로 알아듣기

방금 SFT를 돌렸죠. 그 SFT의 가장 핵심적인 형태가 **Instruction Tuning(지시 튜닝)** 이에요.

> 🃏 **베이스 모델의 습관 — '이어쓰기'**
> 사전학습만 한 모델은 다음 단어를 **이어 붙이는** 데 능숙해요. 그래서 "번역해줘"라고 해도 **지시를 따르지 않고** 그 문장을 그냥 이어쓰기도 합니다.

> 🃏 **Instruction Tuning이 하는 일**
> **(지시, 응답)** 쌍을 대량으로 SFT → 모델이 입력을 **'따라야 할 명령'으로 인식**하게 정렬. 다양한 지시(번역·요약·분류·코딩…)를 배우면 **처음 보는 지시도 일반화**해서 따라요.

> 🪄 **비유**: 외국어를 잘 아는 사람(베이스)에게 **"질문을 받으면 답을 한다"는 대화 예절**을 가르치는 것. 지식은 그대로인데, **소통 방식**이 바뀜.

> 🔑 모듈 1의 증류와 연결: 좋은 instruction 데이터는 보통 **강한 교사가 생성**해요 → 지시 튜닝 ≈ 교사의 '지시 따르기' 능력을 학생에게 증류.`,
    },
    {
      type: "code",
      title: "🧪 before / after — 지시를 따르게 되는 변화",
      content: `같은 지시에 **베이스(이어쓰기)** vs **지시튜닝 후(따르기)** 가 어떻게 다른지 봐요(개념 예시). \`▶ 실행\``,
      code: `instruction = "다음 문장을 한국어로 번역해줘: 'Hello, world'"

# 베이스(사전학습만): 지시를 안 따르고 그냥 이어쓰기
base_out = "Hello, world is a common phrase in programming tutorials..."
# 지시튜닝 후: 입력을 '명령'으로 인식하고 따름
tuned_out = "안녕, 세상"

print("[지시]", instruction, "\\n")
print("❌ 베이스 (이어쓰기 습관):")
print("   ", base_out)
print("\\n✅ 지시튜닝 후 (지시 따르기):")
print("   ", tuned_out)
print("\\n👉 지식은 같아도, (지시→응답) 데이터로 SFT하면 '말귀를 알아듣게' 정렬돼요")`,
      codeLanguage: "python",
      codeHint: "instruction을 요약·분류 같은 다른 지시로 바꿔 상상해보세요. 다양한 지시를 학습할수록 '처음 보는 지시'도 일반화해서 따릅니다.",
    },
    {
      type: "text",
      title: "🙋 직접 해보기 — 지시 따르기 체감",
      content: `여러분의 AI(ChatGPT·Claude 등)는 이미 잘 지시튜닝돼 있어요. 차이를 느끼려면 **'이어쓰기처럼' vs '지시처럼'** 을 비교해보세요.

> 📋 **복사해서 써보세요**
> \`\`\`
> 아래 두 요청에 각각 답해줘.
> (1) "옛날 옛적에" 로 시작하는 문장을 자연스럽게 이어 써줘.   ← 이어쓰기
> (2) 위 (1)에서 만든 이야기를 한 문장으로 요약해줘.            ← 지시 따르기
> \`\`\`

(1)은 이어쓰기, (2)는 **지시를 의도로 받아 수행**하는 거예요. 베이스 모델은 (2) 같은 걸 잘 못 하고, 지시튜닝이 그걸 가능하게 만듭니다.

> 🎯 **(핵심)**
> - 베이스는 **이어쓰기**, 지시튜닝은 입력을 **'따라야 할 명령'** 으로 정렬.
> - **(지시, 응답)** 다양하게 SFT → 처음 보는 지시도 **일반화**.
> - 좋은 instruction 데이터는 강한 **교사가 생성**(= 증류와 연결).

지시를 따르게 만들었어요. 그런데 **새 능력을 더 가르치다 옛 능력을 까먹으면**? 다음 강 **Continuous Learning(망각 방지)** 입니다. 🧠`,
    },
  ],
  quiz: {
    title: "32강 — Instruction Tuning 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "Instruction Tuning의 핵심은?",
        options: [
          "모델에 새로운 방대한 지식을 주입하는 것",
          "(지시, 응답) 쌍을 SFT해 입력을 '따라야 할 명령'으로 인식하게 정렬하는 것",
          "모델 크기를 키우는 것",
        ],
        correctIndex: 1,
        explanation:
          "지시 튜닝은 다양한 (지시, 응답)을 SFT해 모델이 입력을 명령으로 받아 따르도록 정렬해요. 지식 주입이 아니라 소통 방식의 정렬입니다.",
      },
      {
        type: "multiple-choice",
        question: "사전학습만 한 베이스 모델의 전형적 습관은?",
        options: [
          "항상 지시를 완벽히 따른다",
          "다음 단어를 이어 붙이는 '이어쓰기'에 능숙(지시를 안 따르기도)",
          "아무 출력도 못 한다",
        ],
        correctIndex: 1,
        explanation:
          "베이스 모델은 이어쓰기에 특화돼 있어, 지시를 줘도 명령으로 인식하지 못하고 문장을 이어쓰기도 해요. 지시 튜닝이 이를 바로잡습니다.",
      },
      {
        type: "multiple-choice",
        question: "다양한 지시를 학습하면 좋은 점은?",
        options: [
          "학습한 지시만 정확히 따른다",
          "처음 보는 지시도 일반화해서 따를 수 있다",
          "지시를 무시하게 된다",
        ],
        correctIndex: 1,
        explanation:
          "여러 종류의 지시를 배우면 '지시를 따른다'는 일반 능력이 생겨, 학습에 없던 새 지시도 일반화해서 수행할 수 있어요.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-33-continuous-learning",
};

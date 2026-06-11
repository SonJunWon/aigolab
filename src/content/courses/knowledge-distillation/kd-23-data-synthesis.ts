import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 23강 — 데이터 합성 자동화 (Self/Evol-Instruct = 증류, 모듈 4)
 * 교사로 학습 데이터를 자동 생성·진화. AI-try는 마크다운 프롬프트. 코드: 순수 파이썬(시드→진화→게이트).
 */
export const kd23: Course = {
  id: "kd-23-data-synthesis",
  title: "데이터 합성 자동화 — Evol-Instruct는 증류다",
  subtitle: "교사 모델로 학습 데이터를 자동 생성·진화",
  icon: "🏭",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 223,
  sections: [
    {
      type: "text",
      content: `# 🏭 좋은 어댑터의 재료 = 좋은 데이터, 그런데 그 데이터를…

모듈 4 내내 **어떻게 학습할지**(LoRA·DoRA…)를 봤어요. 하지만 무엇으로 학습하죠? **데이터**예요. 그리고 그 데이터를 **교사 모델이 자동으로 만들 수 있어요.**

> 🃏 **Self-Instruct**
> 사람이 만든 **소수의 시드(seed) 예시**에서 출발해, **교사 LLM이 비슷한 (지시, 응답) 쌍을 대량 생성**. 적은 인력으로 수천~수만 개 학습 데이터를 확보.

> 🃏 **Evol-Instruct(진화)**
> 단순 복제가 아니라, 교사가 시드를 **점점 어렵게·다양하게 '진화'** 시켜요:
> - **심화(Deepen)**: 제약·예외 추가 → "단, 빈 입력·음수도 처리"
> - **구체화(Concretize)**: 추상 → 구체 예시
> - **추론 강화(Reasoning)**: "단계별 풀이 설명"
> - **다양화(Breadth)**: 비슷하지만 새로운 문제로 변형

> 🔑 **이게 왜 증류인가?** 큰 교사 모델의 지식이 **데이터(지시·응답)** 형태로 빠져나와, 그걸로 작은 학생을 SFT → **현대 증류 ≈ 교사가 만든 고품질 데이터로 학생을 SFT**(모듈 1의 그 이야기!). DeepSeek-R1의 distill 모델들도 이 방식이에요.

> 🪄 **비유**: 베테랑 선생님(교사 LLM)이 **문제집을 자동으로 찍어내고**, 난이도까지 **점점 올려가며** 출제. 학생은 그 문제집으로 공부.`,
    },
    {
      type: "code",
      title: "🧪 시드 → 진화 → 게이트 (파이프라인 골격)",
      content: `교사가 시드 1개를 어떻게 여러 학습 예시로 '진화'시키는지 구조만 토이로 봐요(실제 생성은 다음 AI-try에서). \`▶ 실행\``,
      code: `seed = "리스트에서 최댓값을 구하는 함수를 작성하라."

# Evol-Instruct 진화 연산 (실제론 교사 LLM이 수행)
def deepen(q):     return q + " 단, 빈 리스트와 음수도 처리하라."
def concretize(q): return q.replace("리스트", "정수 리스트 [3, -1, 7, 2]")
def reason(q):     return q + " 풀이 과정을 단계별로 설명하라."
def breadth(q):    return "최댓값 대신 '두 번째로 큰 값'을 구하라."

evolved = [seed, deepen(seed), reason(concretize(seed)), breadth(seed)]
print(f"시드 1개 → 교사가 자동 진화 → {len(evolved)}개 학습 예시\\n")
for i, q in enumerate(evolved):
    print(f"  {i}. {q}")

# 간이 품질 게이트: 중복 제거(다양성 확보)
uniq = list(dict.fromkeys(evolved))
print(f"\\n중복 제거 후: {len(uniq)}개")
print("👉 교사가 (지시,응답)을 자동 생성·진화 = 사실상 '증류' 한 바퀴(모듈 1과 연결)")`,
      codeLanguage: "python",
      codeHint: "진화 연산을 더 추가해보세요(예: 다른 언어로 번역, 제약 강화). 실제 파이프라인은 이 구조 그대로, 함수 자리에 '교사 LLM 호출'이 들어갑니다.",
    },
    {
      type: "text",
      title: "🙋 직접 해보기 — 내 AI를 교사로 데이터 합성",
      content: `여러분이 쓰는 AI(ChatGPT·Claude 등)에 아래를 넣으면 **합성+진화**가 어떻게 되는지 바로 체감돼요.

> 📋 **① Self-Instruct (시드에서 대량 생성)**
> \`\`\`
> 다음 시드와 같은 유형의 '파이썬 코딩 지시-응답' 쌍 5개를 새로 만들어줘.
> 형식: {"instruction": ..., "output": ...}
> 시드: {"instruction": "리스트의 평균을 구하는 함수", "output": "def mean(xs): return sum(xs)/len(xs)"}
> \`\`\`

> 📋 **② Evol-Instruct (난이도 진화)**
> \`\`\`
> 아래 지시를 '심화·구체화·추론 강화' 세 방향으로 각각 한 단계씩 더 어렵게 진화시켜줘.
> 지시: "리스트에서 최댓값을 구하는 함수를 작성하라."
> \`\`\`

해보면, 큰 모델의 지식이 **(지시, 응답) 데이터로 흘러나오는** 게 보여요. 이걸 모아 작은 모델을 SFT하면 = **증류**.

> ⚠️ **합성 데이터의 함정**: 교사가 틀리면 그 오류도 그대로 복제돼요. 그래서 **즉시 품질 필터(게이트)** 가 필수 — 이건 **모듈 5(데이터 구축)** 에서 깊게 다룹니다.

> 🎯 **(핵심)**
> - **Self-Instruct**: 소수 시드 → 교사가 대량 (지시,응답) 생성.
> - **Evol-Instruct**: 심화·구체화·추론·다양화로 난이도까지 진화.
> - **합성 데이터 = 증류**: 교사 지식이 데이터로 빠져나와 학생을 SFT.
> - 단, **품질 게이트 필수**(교사 오류 복제 방지).

다음 강은 모듈 4의 마지막 — 다 만든 LoRA 어댑터를 **병합·교체해 여러 도메인에 서빙**하는 실전 운용법입니다. 🔌`,
    },
  ],
  quiz: {
    title: "23강 — 데이터 합성 자동화 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "Self-Instruct의 핵심은?",
        options: [
          "사람이 모든 데이터를 손으로 만든다",
          "소수의 시드 예시에서 출발해 교사 LLM이 대량의 (지시,응답)을 자동 생성한다",
          "데이터를 삭제한다",
        ],
        correctIndex: 1,
        explanation:
          "Self-Instruct는 사람이 만든 소수 시드에서 교사 모델이 비슷한 학습 쌍을 대량 생성해 적은 인력으로 데이터를 확보하는 방법이에요.",
      },
      {
        type: "multiple-choice",
        question: "데이터 합성이 '증류'라고 불리는 이유는?",
        options: [
          "데이터를 압축해서",
          "큰 교사 모델의 지식이 (지시,응답) 데이터로 빠져나와 작은 학생을 SFT하기 때문",
          "온도를 높여서",
        ],
        correctIndex: 1,
        explanation:
          "현대 증류는 교사가 만든 고품질 데이터로 학생을 SFT하는 것과 같아요. 합성 데이터는 교사 지식을 데이터로 옮기는 증류의 한 형태입니다.",
      },
      {
        type: "multiple-choice",
        question: "합성 데이터 사용 시 반드시 필요한 것은?",
        options: [
          "더 비싼 GPU",
          "교사 오류가 복제되지 않도록 하는 품질 필터(게이트)",
          "더 많은 시드",
        ],
        correctIndex: 1,
        explanation:
          "교사가 틀리면 그 오류도 데이터에 복제돼요. 그래서 생성 직후 품질 게이트(필터)가 필수입니다(모듈 5에서 상세히).",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-24-adapter-merge",
};

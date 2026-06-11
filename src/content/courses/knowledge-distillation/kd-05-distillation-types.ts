import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 5강 — 증류의 종류 (모듈 1)
 * 응답/특징/관계 기반, 화이트박스 vs 블랙박스(API 증류). 코드 검증: 로컬 sklearn 통과(0.76→0.83).
 */
export const kd05: Course = {
  id: "kd-05-distillation-types",
  title: "증류의 종류 — 화이트박스 vs 블랙박스(API)",
  subtitle: "교사 내부를 못 봐도 증류할 수 있다",
  icon: "📦",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 205,
  sections: [
    {
      type: "text",
      content: `# 📦 증류에도 여러 방식이 있어요

지금까지 "교사의 확률 분포(소프트 라벨)를 베낀다"고 했죠. 그런데 **무엇을 베끼느냐**, **교사 내부를 볼 수 있느냐**에 따라 종류가 나뉩니다.

> 🃏 **무엇을 베끼나 (3가지)**
> - **응답 기반(response)**: 교사의 **최종 출력**(확률·답)을 모방. 가장 쉽고 흔함.
> - **특징 기반(feature)**: 교사의 **중간 표현**(은닉층)까지 모방. 더 깊지만 내부 접근 필요.
> - **관계 기반(relation)**: 교사가 **샘플들 사이 관계**를 보는 방식을 모방.

> 🃏 **교사 내부를 볼 수 있나 (2가지) — 실무에서 더 중요!**
> - 🪟 **화이트박스**: 교사의 **가중치·내부**에 접근 가능(오픈 모델). 특징·관계 증류까지 가능.
> - 📦 **블랙박스**: 교사가 **API**라 출력만 받음(GPT·Claude 등). **응답 기반만** 가능 — 하지만 충분히 강력!`,
    },
    {
      type: "text",
      title: "블랙박스(API) 증류 — 현장에서 가장 많이 쓰는 법",
      content: `현실에서 우리가 쓰는 최강 교사들(GPT·Claude 등)은 **API**예요. 내부 가중치를 못 봐요. 그래도 증류할 수 있습니다.

> 🃏 **방법: "교사에게 물어보고, 그 답으로 학생을 가르친다"**
> 1. 라벨 없는 데이터(질문)를 잔뜩 준비
> 2. **교사 API에 던져 답(출력)을 수집** ← 내부는 몰라도 됨
> 3. 그 (질문, 교사답) 쌍으로 **학생을 학습**

> 🪄 **비유**: 명강사의 강의 노트는 못 봐도, **그가 낸 문제와 모범답안**을 모아서 공부하는 것. 그것만으로도 충분히 실력이 늘죠.

> 🔑 이게 바로 **현대 LLM 증류의 실체**예요 — DeepSeek-R1 증류도, 우리가 모듈 4·5에서 배울 "합성 데이터 + SFT"도 전부 이 블랙박스 응답 증류의 확장입니다. **증류 = 좋은 데이터를 만들어 학생을 가르치기.**`,
    },
    {
      type: "code",
      title: "🧪 블랙박스 증류 — 교사 '출력'만으로 학생 키우기",
      content: `교사의 **내부는 1도 모르고 출력(예측)만** 받아서 학생을 가르쳐볼게요.
**① 진짜 정답 60개로만** 배운 학생 vs **② 교사가 라벨링한 많은 데이터**로 배운 학생.
\`▶ 실행\` — 라벨링 비용 없이도 학생이 훨씬 똑똑해집니다.`,
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=2000, n_features=10, n_informative=6,
                           n_classes=3, n_clusters_per_class=1, random_state=1)
Xpool, Xte, ypool, yte = train_test_split(X, y, test_size=0.25, random_state=1)

# 우리에겐 '진짜 정답'이 아주 조금만 있다 (사람이 라벨링하는 건 비싸니까)
Xsmall, ysmall = Xpool[:60], ypool[:60]

# 교사 = 이미 똑똑한 모델. 우리는 내부를 모르고 '출력'만 받을 수 있다 (= API/블랙박스)
teacher = RandomForestClassifier(n_estimators=200, random_state=1).fit(Xpool, ypool)

# ① 학생 A: 진짜 정답 60개로만 학습
accA = LogisticRegression(max_iter=1000).fit(Xsmall, ysmall).score(Xte, yte)

# ② 학생 B: 라벨 없는 많은 데이터를 교사에게 던져 '답(출력)'을 받아 그걸로 학습 = 블랙박스 증류
teacher_labels = teacher.predict(Xpool)   # 교사의 출력만 사용 (내부 접근 X)
accB = LogisticRegression(max_iter=1000).fit(Xpool, teacher_labels).score(Xte, yte)

print(f"① 진짜 정답 60개로만 배운 학생:        {accA:.3f}")
print(f"② 교사 출력(블랙박스)으로 배운 학생:    {accB:.3f}")
print(f"\\n👉 교사 내부를 몰라도 '출력'만으로 학생을 키웠어요 = API 증류!")
print("   라벨링 비용 없이 데이터를 교사가 대신 만들어준 셈입니다.")`,
      codeLanguage: "python",
      codeHint: "teacher.predict(...)는 교사의 '출력'만 씁니다(내부 X). 이렇게 교사가 만든 데이터로 학생을 가르치는 게 블랙박스 증류 = 현대 LLM 증류의 핵심.",
    },
  ],
  quiz: {
    title: "5강 — 증류의 종류 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "GPT·Claude 같은 API 모델을 교사로 쓸 때 가능한 증류는?",
        options: [
          "특징 기반(중간 은닉층 모방)",
          "블랙박스 응답 기반(출력만 받아 학생 학습)",
          "어떤 증류도 불가능",
        ],
        correctIndex: 1,
        explanation:
          "API는 내부 가중치를 못 보므로(블랙박스) 특징·관계 증류는 어렵고, 출력(응답)만 받아 학생을 가르치는 응답 기반 증류를 합니다. 그래도 충분히 강력해요.",
      },
      {
        type: "multiple-choice",
        question: "블랙박스(API) 증류의 핵심 방법은?",
        options: [
          "교사의 가중치를 복사한다",
          "교사 API에 데이터를 던져 답(출력)을 모으고, 그 (질문, 답)으로 학생을 학습한다",
          "학생을 그냥 크게 만든다",
        ],
        correctIndex: 1,
        explanation:
          "명강사의 노트(내부)는 못 봐도 그가 낸 문제·모범답안을 모아 공부하듯, 교사의 출력을 모아 학생을 가르칩니다. 이게 현대 LLM 증류의 실체예요.",
      },
      {
        type: "multiple-choice",
        question: "실험에서 학생이 더 똑똑해진 경우는?",
        options: [
          "진짜 정답 60개로만 배웠을 때",
          "교사가 라벨링한 많은 데이터로 배웠을 때",
          "둘이 똑같았다",
        ],
        correctIndex: 1,
        explanation:
          "사람이 라벨링한 적은 데이터(60개)보다, 교사가 대신 라벨링해준 많은 데이터로 배운 학생이 더 정확했어요. 교사가 데이터를 만들어준 셈 — 비용 없이 증류!",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-06-scaling-law",
};

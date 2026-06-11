import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 4강 — 온도와 KL 손실 (모듈 1)
 * 온도로 분포 부드럽게 + 하드 vs 소프트(증류) 학생 정확도 비교. 코드 검증: 로컬 sklearn 통과(0.70→0.77).
 */
export const kd04: Course = {
  id: "kd-04-temperature-kl",
  title: "온도와 KL 손실 — 뉘앙스를 부드럽게",
  subtitle: "온도를 올리면 dark knowledge가 또렷해진다",
  icon: "🌡️",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 24,
  order: 204,
  sections: [
    {
      type: "text",
      content: `# 🌡️ 온도(temperature) — 뉘앙스의 볼륨 손잡이

지난 강에서 소프트 라벨이 'C 95% · B 4% · A 1%' 처럼 나왔죠. 그런데 정답이 너무 압도적이면(95%) **뉘앙스가 거의 안 보여요.** B가 4%인지 0.1%인지 묻히죠.

> 🃏 **온도란?**
> 분포를 **부드럽게 펴주는** 손잡이예요. 온도 T를 올리면:
> - \`T=1\`: [0.04, 0.95, 0.01] — 뾰족함(정답만 도드라짐)
> - \`T=4\`: [0.25, 0.56, 0.19] — 부드러움(**B가 맞지만 A·C도 보임** → 뉘앙스 또렷!)

> 🪄 **비유**: 라디오 볼륨. 작게 틀면(T=1) 주 멜로디만, 키우면(T=4) **배경의 화음(dark knowledge)** 까지 들려요. 학생을 가르칠 땐 화음까지 들려주는 게 좋습니다.

수식은 간단해요: 확률을 로그로 바꿔 **T로 나눈 뒤** 다시 확률로 — T가 클수록 평평해집니다.`,
    },
    {
      type: "code",
      title: "🧪 온도를 올리면 분포가 부드러워진다",
      content: `온도 T를 1 → 2 → 4로 올리면서 같은 소프트 라벨이 어떻게 펴지는지 봐요.`,
      code: `import numpy as np

# 교사가 준 어떤 샘플의 소프트 라벨 (B가 정답이지만 A·C도 조금)
p = np.array([0.04, 0.95, 0.01])
labels = ["A", "B", "C"]

def soften(p, T):
    logit = np.log(p + 1e-9)          # 확률 → 로그
    z = logit / T                     # 온도로 나누기 (T 클수록 평평)
    e = np.exp(z - z.max())
    return e / e.sum()

print(f"{'온도 T':<8}{'A':>7}{'B':>7}{'C':>7}   설명")
for T in [1, 2, 4, 8]:
    s = soften(p, T)
    desc = "뾰족(정답만)" if T == 1 else "부드러움(뉘앙스 ↑)"
    print(f"T={T:<6}{s[0]:>7.2f}{s[1]:>7.2f}{s[2]:>7.2f}   {desc}")

print("\\n👉 T를 올릴수록 A·C 확률이 살아나요 = dark knowledge가 또렷해짐!")`,
      codeLanguage: "python",
      codeHint: "온도 T가 클수록 분포가 평평해져 '정답이 아닌 것들의 확률'이 잘 보입니다. 증류할 땐 보통 T를 2~4로 둬요.",
    },
    {
      type: "text",
      title: "KL 손실 — 학생을 교사 분포에 '맞추기'",
      content: `학생을 어떻게 가르칠까요? **"학생의 분포가 교사의 분포와 같아지도록"** 훈련해요.

> 🃏 **KL 발산(KL divergence)**: 두 확률 분포가 **얼마나 다른지** 재는 자(0이면 똑같음).
> 증류의 목표 = 이 KL을 줄이는 것 = 학생 분포 → 교사 분포에 가까워지게.

> 🪄 **비유**: 학생이 선생의 답안지(확률 분포)를 보고, **선생과 똑같은 분포로 답하도록** 연습. 틀린 정도(KL)가 0에 가까워질 때까지.

말로만 들으면 추상적이죠. **진짜로 효과가 있는지** 코드로 확인합시다 👇`,
    },
    {
      type: "code",
      title: "🧪 결정적 실험 — 하드 라벨 vs 소프트 라벨(증류)",
      content: `같은 작은 **학생 모델**을 두 가지로 가르쳐 정확도를 비교해요.
**① 하드 라벨**(정답만)로 학습 vs **② 교사의 소프트 라벨(증류)** 로 학습.
\`▶ 실행\` — 증류한 학생이 더 똑똑해지는 걸 직접 확인하세요! (실행에 몇 초 걸려요)`,
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPRegressor
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=1000, n_features=10, n_informative=6,
                           n_classes=3, n_clusters_per_class=1, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)

# 교사(강한 모델)가 소프트 라벨 생성
teacher = RandomForestClassifier(n_estimators=150, random_state=0).fit(Xtr, ytr)
soft = teacher.predict_proba(Xtr)

def soften(p, T):
    z = np.log(p + 1e-9) / T
    e = np.exp(z - z.max(axis=1, keepdims=True))
    return e / e.sum(axis=1, keepdims=True)

# ① 학생: 하드 라벨(정답)로 학습
acc_hard = LogisticRegression(max_iter=1000).fit(Xtr, ytr).score(Xte, yte)

# ② 학생: 교사 소프트 라벨(T=3)을 모방하도록 학습 = 증류
soft_T = soften(soft, 3)
student = MLPRegressor(hidden_layer_sizes=(32,), max_iter=500, random_state=0).fit(Xtr, soft_T)
acc_soft = (student.predict(Xte).argmax(axis=1) == yte).mean()

print(f"① 하드 라벨로 배운 학생:      정확도 {acc_hard:.3f}")
print(f"② 소프트 라벨(증류)로 배운 학생: 정확도 {acc_soft:.3f}")
gain = (acc_soft - acc_hard) * 100
print(f"\\n👉 증류한 학생이 약 {gain:.1f}%p 더 정확! 같은 크기인데 선생 덕에 똑똑해졌어요.")`,
      codeLanguage: "python",
      codeHint: "핵심은 ②가 ①보다 높다는 것! 같은 학생인데, 교사의 '분포(소프트 라벨)'를 베끼게 했더니 더 잘합니다 = 증류의 힘.",
    },
    {
      type: "text",
      content: `> 🎯 **(이 강의 핵심)**
> - **온도 T**: 분포를 펴서 dark knowledge를 또렷하게(보통 T=2~4).
> - **KL 손실**: 학생 분포를 교사 분포에 맞추는 자.
> - **결과**: 같은 작은 학생이 **하드 라벨보다 소프트 라벨(증류)로 더 똑똑**해진다.

다음 강에서는 증류에도 **여러 종류**가 있다는 걸 봐요 — 특히 우리가 GPT 같은 **API 모델만 쓸 수 있을 때(블랙박스)** 어떻게 증류하는지. 📦`,
    },
  ],
  quiz: {
    title: "4강 — 온도와 KL 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "온도(temperature) T를 올리면 소프트 라벨 분포는?",
        options: [
          "더 뾰족해져 정답만 남는다",
          "더 부드러워져 '정답이 아닌 것들의 확률(dark knowledge)'이 또렷해진다",
          "변하지 않는다",
        ],
        correctIndex: 1,
        explanation:
          "T가 클수록 분포가 평평해져 뉘앙스가 살아납니다. 그래서 증류할 때 보통 T=2~4로 둬서 dark knowledge를 학생에게 잘 전달해요.",
      },
      {
        type: "multiple-choice",
        question: "KL 발산(KL divergence)의 역할은?",
        options: [
          "두 분포가 얼마나 다른지 재서, 학생 분포를 교사 분포에 맞추게 한다",
          "모델 크기를 잰다",
          "비용을 계산한다",
        ],
        correctIndex: 0,
        explanation:
          "KL은 두 확률 분포의 차이를 재는 자예요. 증류는 이 KL을 줄여 학생 분포가 교사 분포에 가까워지도록(=교사를 모방) 훈련합니다.",
      },
      {
        type: "multiple-choice",
        question: "실험에서 같은 작은 학생이 더 똑똑해진 경우는?",
        options: [
          "하드 라벨(정답만)로 배웠을 때",
          "교사의 소프트 라벨(증류)로 배웠을 때",
          "아무것도 안 배웠을 때",
        ],
        correctIndex: 1,
        explanation:
          "같은 크기의 학생이라도 교사의 분포(소프트 라벨)를 모방하게 하면 하드 라벨보다 정확도가 올라갑니다. 이것이 증류가 작동하는 직접적 증거예요.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-05-distillation-types",
};

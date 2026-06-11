import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 3강 — 소프트 라벨 & dark knowledge (모듈 1)
 * sklearn 교사 predict_proba 로 소프트 라벨을 직접 관찰. 코드 검증: 로컬 sklearn 1.9 통과.
 */
export const kd03: Course = {
  id: "kd-03-soft-labels",
  title: "소프트 라벨 & dark knowledge",
  subtitle: "정답 너머의 '뉘앙스'가 학생을 더 잘 가르친다",
  icon: "🎚️",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 22,
  order: 203,
  sections: [
    {
      type: "text",
      content: `# 🎚️ 정답만 알려주면 손해예요

선생님이 학생에게 채점만 해준다고 생각해봐요.

> 🃏 **하드 라벨 (hard label) — 정답 하나만**
> 문제: "이 사진은 A·B·C 중 뭘까?"  → 선생: **"정답은 C."**  (끝)

> 🃏 **소프트 라벨 (soft label) — 확률 분포(뉘앙스)**
> 선생: **"C가 68%로 맞아. 근데 B도 28%쯤 그럴듯하고, A는 거의 아니야."**

두 번째가 훨씬 정보가 많죠? "C이긴 한데 **B랑 헷갈릴 만하다**"는 건, 선생님이 **문제의 난이도와 비슷한 것들 사이의 관계**를 알려준 거예요.

> 💎 **dark knowledge(숨은 지식)**: 이렇게 **정답이 아닌 선택지들의 확률**에 담긴 정보를 부르는 말이에요. "8은 3이나 9랑 비슷하게 생겼다" 같은 걸 모델이 알고 있다는 거죠. 학생은 이 뉘앙스를 배우면서 **혼자 정답만 외울 때보다 훨씬 빨리, 잘** 큽니다.`,
    },
    {
      type: "code",
      title: "🧪 교사 모델의 '소프트 라벨' 직접 들여다보기",
      content: `진짜 모델로 확인해볼게요. **교사 모델**(강한 모델)을 학습시키고, \`predict_proba\`로 **확률 분포(소프트 라벨)** 를 꺼내봅니다.
\`▶ 실행\` — 어떤 샘플은 확신(예: A 100%), 어떤 샘플은 헷갈림(예: C 68%·B 28%)을 보여줄 거예요. 그 '헷갈림'이 바로 dark knowledge!`,
      code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier

# A/B/C 3개 클래스의 장난감 문제 (일부러 좀 헷갈리게 만든 데이터)
X, y = make_classification(n_samples=600, n_features=8, n_informative=5,
                           n_classes=3, n_clusters_per_class=1, random_state=42)
labels = ["A", "B", "C"]

# 교사 = 강한 모델
teacher = RandomForestClassifier(n_estimators=200, random_state=42).fit(X, y)
proba = teacher.predict_proba(X)   # ← 소프트 라벨(확률 분포)!

print("교사가 본 샘플들의 소프트 라벨:")
print(f"{'샘플':<5}{'A':>7}{'B':>7}{'C':>7}   하드라벨   해석")
for i in [3, 1, 0, 4]:
    p = proba[i]
    top = labels[p.argmax()]
    second = labels[np.argsort(p)[-2]]
    nuance = "확신!" if p.max() > 0.9 else f"{top}이지만 {second}도 그럴듯"
    print(f"{i:<5}{p[0]:>7.2f}{p[1]:>7.2f}{p[2]:>7.2f}   -> {top:<6} {nuance}")

print("\\n👉 'C 68% · B 28%' 같은 분포가 dark knowledge — 정답 너머의 뉘앙스예요.")`,
      codeLanguage: "python",
      codeHint: "predict_proba 가 핵심! 하드 라벨은 argmax(가장 큰 것 하나)지만, 소프트 라벨은 전체 확률을 다 줍니다.",
    },
    {
      type: "text",
      title: "왜 뉘앙스가 학생을 더 잘 가르칠까?",
      content: `> 🃏 **비유 — 운전 강사**
> - 하드 라벨 강사: "여기서 **브레이크**." (정답만)
> - 소프트 라벨 강사: "여기선 **브레이크**가 맞지만, 살짝 **감속**도 가능했어. **액셀**은 절대 아니고." (관계·정도까지)
> 어느 쪽 학생이 빨리 늘까요? 당연히 후자죠.

소프트 라벨은 모델에게 **"무엇이 무엇과 비슷한지"** 를 알려줘요. 그래서:

- 학생이 **적은 데이터로도** 잘 배웁니다(선생이 정보를 더 줬으니까).
- 학생이 **부드럽게 일반화**합니다(딱딱한 정답 암기 대신 관계를 이해).

> 🔑 **한 줄 정리**: 증류의 1차 마법은 **"정답(하드)이 아니라 분포(소프트)를 베끼게 하는 것"**.

그런데 이 뉘앙스를 **더 또렷하게 키우는 손잡이**가 있어요 — 바로 **'온도(temperature)'** 입니다. 다음 강에서 온도를 돌려가며 증류 효과가 실제로 좋아지는 걸 코드로 확인합니다. 🌡️`,
    },
  ],
  quiz: {
    title: "3강 — 소프트 라벨 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "'소프트 라벨'이 '하드 라벨'보다 정보가 많은 이유는?",
        options: [
          "정답 하나만 콕 집어줘서",
          "정답이 아닌 선택지들의 확률(뉘앙스)까지 담고 있어서",
          "글자 수가 많아서",
        ],
        correctIndex: 1,
        explanation:
          "하드 라벨은 정답 하나(argmax)뿐이지만, 소프트 라벨은 전체 확률 분포를 줍니다. 'C지만 B도 그럴듯'처럼 선택지 간 관계(뉘앙스)가 담겨 있어요.",
      },
      {
        type: "multiple-choice",
        question: "'dark knowledge(숨은 지식)'란?",
        options: [
          "정답이 아닌 선택지들의 확률에 담긴 정보(무엇이 무엇과 비슷한지)",
          "어두운 곳에서만 작동하는 모델",
          "비밀번호",
        ],
        correctIndex: 0,
        explanation:
          "정답이 아닌 클래스들의 확률(예: '8은 3과 비슷')에 담긴 관계 정보를 dark knowledge라고 해요. 학생이 이걸 배우면 정답만 외울 때보다 잘 일반화합니다.",
      },
      {
        type: "multiple-choice",
        question: "교사 모델에서 소프트 라벨을 꺼내는 메서드는?",
        options: ["predict() (하드 라벨)", "predict_proba() (확률 분포)", "fit()"],
        correctIndex: 1,
        explanation:
          "predict()는 정답 하나(하드 라벨), predict_proba()는 전체 확률 분포(소프트 라벨)를 줍니다. 증류는 predict_proba의 분포를 학생이 모방하게 해요.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-04-temperature-kl",
};

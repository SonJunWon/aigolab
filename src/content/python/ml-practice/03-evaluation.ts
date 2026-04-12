import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson03: Lesson = {
  id: "python-ml-03",
  language: "python",
  track: "ml-practice" as any,
  order: 3,
  title: "모델 평가 — 얼마나 잘 맞히나?",
  subtitle: "혼동 행렬, F1 점수, 교차 검증으로 모델을 제대로 평가하는 방법을 배웁니다",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# 🔍 모델 평가 — 얼마나 잘 맞히나?

정확도만으로는 모델의 성능을 제대로 파악하기 어렵습니다.
다양한 평가 방법을 배워서 모델을 정확하게 진단해봅시다!

이번 챕터에서 배울 것:
- **혼동 행렬(Confusion Matrix)**: 어디서 틀렸는지 파악
- **정밀도/재현율/F1**: 클래스별 성능 측정
- **교차 검증(Cross-Validation)**: 더 안정적인 평가`,
    },
    {
      type: "markdown",
      source: `## 🔧 라이브러리 준비`,
    },
    {
      type: "code",
      source: `import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
)

print("준비 완료!")`,
    },
    {
      type: "markdown",
      source: `## 🌸 데이터 준비: 붓꽃 분류

유명한 Iris 데이터셋을 사용합니다. 꽃잎/꽃받침 크기로 3종류의 붓꽃을 분류합니다.`,
    },
    {
      type: "code",
      source: `iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.3, random_state=42
)

model = LogisticRegression(max_iter=5000, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(f"테스트 샘플 수: {len(y_test)}")
print(f"정확도: {(y_pred == y_test).mean():.4f}")`,
    },
    {
      type: "markdown",
      source: `## 📊 혼동 행렬 (Confusion Matrix)

혼동 행렬은 **실제 클래스 vs 예측 클래스**를 표로 보여줍니다.
- 대각선: 올바른 예측
- 대각선 밖: 잘못된 예측 (어떤 클래스를 어떤 클래스로 잘못 분류했는지)`,
    },
    {
      type: "code",
      source: `cm = confusion_matrix(y_test, y_pred)
print("혼동 행렬:")
print(cm)

print("\\n해석:")
for i, name in enumerate(iris.target_names):
    correct = cm[i, i]
    total = cm[i].sum()
    print(f"  {name}: {correct}/{total} 정확 ({correct/total*100:.0f}%)")`,
    },
    {
      type: "markdown",
      source: `## 📏 클래스별 정밀도, 재현율, F1

\`classification_report\`를 사용하면 모든 지표를 한 번에 볼 수 있습니다.`,
    },
    {
      type: "code",
      source: `print("=== 상세 분류 리포트 ===")
print(classification_report(y_test, y_pred, target_names=iris.target_names))

# 개별 지표도 계산 가능
f1 = f1_score(y_test, y_pred, average="weighted")
print(f"가중 평균 F1: {f1:.4f}")`,
    },
    {
      type: "markdown",
      source: `## 🔄 교차 검증 (Cross-Validation)

학습/테스트 분리를 한 번만 하면, 어떤 데이터가 테스트에 들어갔는지에 따라 결과가 달라집니다.
**K-fold 교차 검증**은 데이터를 K등분하여 K번 평가한 후 평균을 냅니다.`,
    },
    {
      type: "code",
      source: `# 5-fold 교차 검증
model = LogisticRegression(max_iter=5000, random_state=42)
scores = cross_val_score(model, iris.data, iris.target, cv=5, scoring="accuracy")

print("각 fold 정확도:", np.round(scores, 4))
print(f"평균 정확도: {scores.mean():.4f}")
print(f"표준편차: {scores.std():.4f}")
print(f"\\n95% 신뢰 구간: {scores.mean():.4f} +/- {scores.std()*2:.4f}")`,
    },
    {
      type: "markdown",
      source: `## 🎯 Mission 1: 혼동 행렬 해석

Iris 데이터셋에서 **DecisionTreeClassifier**를 사용하여 분류하고,
혼동 행렬을 출력한 뒤 **가장 많이 혼동되는 클래스 쌍**을 찾아 출력하세요.

**조건:**
- DecisionTreeClassifier(random_state=42) 사용
- train_test_split 70:30 (random_state=42)
- 혼동 행렬 출력
- 대각선 제외, 가장 큰 값의 위치(실제, 예측)를 출력`,
    },
    {
      type: "code",
      source: `# Mission 1: 여기에 코드를 작성하세요
# 1) Iris 데이터를 70:30으로 분리
# 2) DecisionTreeClassifier로 학습 & 예측
# 3) 혼동 행렬 출력
# 4) 대각선 외 가장 큰 값 찾기

`,
      hints: [
        "from sklearn.tree import DecisionTreeClassifier를 import하세요",
        "np.fill_diagonal(cm_copy, 0)으로 대각선을 0으로 만든 후 argmax를 찾으세요",
        "np.unravel_index(cm_copy.argmax(), cm_copy.shape)으로 행/열 인덱스를 얻을 수 있습니다",
      ],
      solution: `from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
import numpy as np

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.3, random_state=42
)

model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

cm = confusion_matrix(y_test, y_pred)
print("혼동 행렬:")
print(cm)

# 대각선 제외하고 가장 큰 값 찾기
cm_copy = cm.copy()
np.fill_diagonal(cm_copy, 0)
i, j = np.unravel_index(cm_copy.argmax(), cm_copy.shape)
print(f"\\n가장 많이 혼동되는 쌍:")
print(f"  실제: {iris.target_names[i]} -> 예측: {iris.target_names[j]} ({cm_copy[i,j]}건)")`,
    },
    {
      type: "markdown",
      source: `## 🎯 Mission 2: K-fold 교차 검증

Iris 데이터셋에서 **3-fold, 5-fold, 10-fold** 교차 검증을 수행하고,
각각의 평균 정확도를 비교하세요.

**조건:**
- LogisticRegression(max_iter=5000, random_state=42) 사용
- cv=3, 5, 10 각각 수행
- 평균 정확도와 표준편차를 출력`,
    },
    {
      type: "code",
      source: `# Mission 2: 여기에 코드를 작성하세요
# 1) 3-fold, 5-fold, 10-fold 교차 검증 수행
# 2) 각각의 평균 정확도와 표준편차 출력

`,
      hints: [
        "for k in [3, 5, 10]: 으로 반복하세요",
        "cross_val_score(model, X, y, cv=k)를 사용하세요",
        "주의: 매 반복마다 새 모델 객체를 생성하세요",
      ],
      solution: `from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

iris = load_iris()

print("=== K-fold 교차 검증 비교 ===")
for k in [3, 5, 10]:
    model = LogisticRegression(max_iter=5000, random_state=42)
    scores = cross_val_score(model, iris.data, iris.target, cv=k, scoring="accuracy")
    print(f"{k:2d}-fold: 평균 {scores.mean():.4f} (+/- {scores.std():.4f})")`,
    },
  ],
  quiz: {
    title: "모델 평가 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "혼동 행렬(Confusion Matrix)에서 대각선 값이 의미하는 것은?",
        options: [
          "잘못 분류된 샘플 수",
          "각 클래스의 전체 샘플 수",
          "올바르게 분류된 샘플 수",
          "모델의 확률 값",
        ],
        correctIndex: 2,
        explanation:
          "혼동 행렬의 대각선은 실제 클래스와 예측 클래스가 일치하는 경우, 즉 올바르게 분류된 샘플 수를 나타냅니다.",
      },
      {
        type: "multiple-choice",
        question: "5-fold 교차 검증에서 모델은 총 몇 번 학습되나요?",
        options: ["1번", "3번", "5번", "10번"],
        correctIndex: 2,
        explanation:
          "5-fold 교차 검증은 데이터를 5등분하여, 매번 다른 1조각을 테스트로 사용합니다. 따라서 모델은 총 5번 학습됩니다.",
      },
      {
        type: "predict-output",
        question: "다음 코드의 출력은?",
        code: `from sklearn.metrics import f1_score
y_true = [1, 1, 0, 0]
y_pred = [1, 0, 0, 0]
print(f1_score(y_true, y_pred))`,
        options: [
          "0.5",
          "0.6666666666666666",
          "0.75",
          "1.0",
        ],
        correctIndex: 1,
        explanation:
          "Precision=1/1=1.0, Recall=1/2=0.5. F1 = 2*(1.0*0.5)/(1.0+0.5) = 2/3 = 0.6667입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "교차 검증의 표준편차가 크다면 어떤 의미일까요?",
        options: [
          "모델 성능이 매우 좋다",
          "모델이 데이터 분할에 따라 성능이 불안정하다",
          "학습 데이터가 너무 많다",
          "과소적합이 발생했다",
        ],
        correctIndex: 1,
        explanation:
          "교차 검증의 표준편차가 크면 데이터를 어떻게 나누느냐에 따라 성능 차이가 크다는 뜻으로, 모델이 불안정하다는 신호입니다.",
      },
    ],
  } satisfies Quiz,
};

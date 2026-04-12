import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson02: Lesson = {
  id: "python-ml-02",
  language: "python",
  track: "ml-practice" as any,
  order: 2,
  title: "분류 — 카테고리 예측하기",
  subtitle: "데이터를 카테고리로 분류하는 머신러닝 모델을 배워봅시다",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🏷️ 분류 — 카테고리 예측하기

이번에는 숫자가 아닌 **카테고리(클래스)**를 예측하는 **분류(Classification)**를 배워봅시다!

이번 챕터에서 배울 것:
- **로지스틱 회귀** (LogisticRegression) — 이름은 회귀지만 분류 모델!
- **결정 트리** (DecisionTree) — 질문을 통해 분류
- **평가 지표**: 정확도, 정밀도, 재현율
- **여러 모델 비교** 방법`,
    },
    {
      type: "markdown",
      source: `## 🔧 라이브러리 준비

분류에 필요한 도구들을 불러옵니다.`,
    },
    {
      type: "code",
      source: `import numpy as np
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report

print("준비 완료!")`,
    },
    {
      type: "markdown",
      source: `## 🍷 와인 데이터셋 살펴보기

scikit-learn에 내장된 와인 데이터셋을 사용합니다.
13가지 화학 성분으로 와인의 종류(3가지)를 분류하는 문제입니다.`,
    },
    {
      type: "code",
      source: `wine = load_wine()

print("특성 이름:", wine.feature_names[:5], "... 총", len(wine.feature_names), "개")
print("클래스:", wine.target_names)
print(f"\\n데이터 크기: {wine.data.shape}")
print(f"클래스별 샘플 수: {np.bincount(wine.target)}")`,
    },
    {
      type: "markdown",
      source: `## 📐 로지스틱 회귀로 분류하기

**로지스틱 회귀**는 이름에 "회귀"가 들어가지만 **분류** 알고리즘입니다.
확률을 계산한 뒤, 가장 높은 확률의 클래스를 선택합니다.`,
    },
    {
      type: "code",
      source: `X = wine.data
y = wine.target

# 데이터 분리
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 로지스틱 회귀
lr_model = LogisticRegression(max_iter=5000, random_state=42)
lr_model.fit(X_train, y_train)
lr_pred = lr_model.predict(X_test)

accuracy = accuracy_score(y_test, lr_pred)
print(f"로지스틱 회귀 정확도: {accuracy:.4f}")
print(f"맞힌 개수: {(lr_pred == y_test).sum()} / {len(y_test)}")`,
    },
    {
      type: "markdown",
      source: `## 🌳 결정 트리로 분류하기

**결정 트리(Decision Tree)**는 데이터를 질문으로 나누면서 분류합니다.
"알코올이 13 이상인가?" 같은 질문을 반복하여 최종 클래스를 결정합니다.`,
    },
    {
      type: "code",
      source: `# 결정 트리
dt_model = DecisionTreeClassifier(random_state=42)
dt_model.fit(X_train, y_train)
dt_pred = dt_model.predict(X_test)

accuracy = accuracy_score(y_test, dt_pred)
print(f"결정 트리 정확도: {accuracy:.4f}")

# 특성 중요도
importances = dt_model.feature_importances_
top3_idx = np.argsort(importances)[-3:][::-1]
print("\\n가장 중요한 특성 Top 3:")
for i in top3_idx:
    print(f"  {wine.feature_names[i]}: {importances[i]:.4f}")`,
    },
    {
      type: "markdown",
      source: `## 📊 정밀도, 재현율, F1 점수

- **정확도(Accuracy)**: 전체 중 맞힌 비율
- **정밀도(Precision)**: "이 클래스다"라고 예측한 것 중 실제로 맞은 비율
- **재현율(Recall)**: 실제 해당 클래스 중 찾아낸 비율
- **F1**: 정밀도와 재현율의 조화 평균`,
    },
    {
      type: "code",
      source: `print("=== 로지스틱 회귀 상세 리포트 ===")
print(classification_report(y_test, lr_pred, target_names=wine.target_names))`,
    },
    {
      type: "markdown",
      source: `## 🎯 Mission 1: 와인 품질 분류

\`load_wine\` 데이터셋에서 클래스 0과 1만 선택하여 **이진 분류** 문제를 만들고,
로지스틱 회귀로 분류한 뒤 정확도를 출력하세요.

**조건:**
- 클래스 0, 1만 필터링 (클래스 2 제외)
- train_test_split 80:20 (random_state=42)
- 정확도 출력`,
    },
    {
      type: "code",
      source: `# Mission 1: 여기에 코드를 작성하세요
# 1) load_wine()으로 데이터 로드
# 2) 클래스 0, 1만 필터링 (mask = y < 2 활용)
# 3) train_test_split 80:20
# 4) LogisticRegression으로 학습 & 예측
# 5) 정확도 출력

`,
      hints: [
        "mask = wine.target < 2로 클래스 0, 1만 선택할 수 있습니다",
        "X = wine.data[mask], y = wine.target[mask]",
        "LogisticRegression(max_iter=5000, random_state=42)를 사용하세요",
      ],
      solution: `from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

wine = load_wine()
mask = wine.target < 2
X = wine.data[mask]
y = wine.target[mask]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=5000, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(f"이진 분류 정확도: {accuracy_score(y_test, y_pred):.4f}")`,
    },
    {
      type: "markdown",
      source: `## 🎯 Mission 2: 여러 모델 비교

로지스틱 회귀와 결정 트리의 정확도를 비교하는 코드를 작성하세요.
\`load_wine\` 전체 데이터(3 클래스)를 사용합니다.`,
    },
    {
      type: "code",
      source: `# Mission 2: 여기에 코드를 작성하세요
# 1) load_wine 전체 데이터 사용
# 2) train_test_split 80:20 (random_state=42)
# 3) LogisticRegression, DecisionTreeClassifier 각각 학습
# 4) 두 모델의 정확도를 비교하여 출력

`,
      hints: [
        "두 모델을 리스트에 넣고 for문으로 돌리면 깔끔합니다",
        "models = [('로지스틱 회귀', LogisticRegression(...)), ('결정 트리', DecisionTreeClassifier(...))]",
        "각 모델에 fit, predict, accuracy_score를 적용하세요",
      ],
      solution: `from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

wine = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    wine.data, wine.target, test_size=0.2, random_state=42
)

models = [
    ("로지스틱 회귀", LogisticRegression(max_iter=5000, random_state=42)),
    ("결정 트리", DecisionTreeClassifier(random_state=42)),
]

print("=== 모델 비교 ===")
for name, model in models:
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"{name}: {acc:.4f}")`,
    },
  ],
  quiz: {
    title: "분류 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "로지스틱 회귀는 어떤 종류의 문제에 사용되나요?",
        options: [
          "숫자 예측 (회귀)",
          "카테고리 예측 (분류)",
          "군집화 (클러스터링)",
          "차원 축소",
        ],
        correctIndex: 1,
        explanation:
          "이름에 '회귀'가 들어가지만, 로지스틱 회귀는 확률을 계산하여 클래스를 예측하는 분류(classification) 알고리즘입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "정밀도(Precision)가 높고 재현율(Recall)이 낮다면 어떤 상황인가요?",
        options: [
          "모든 것을 잘 예측하고 있다",
          "'양성'이라고 한 것은 대부분 맞지만, 놓치는 양성이 많다",
          "거의 모든 것을 '양성'으로 예측하고 있다",
          "모델이 학습되지 않았다",
        ],
        correctIndex: 1,
        explanation:
          "정밀도가 높으면 양성 예측의 신뢰도가 높고, 재현율이 낮으면 실제 양성을 많이 놓치고 있다는 뜻입니다.",
      },
      {
        type: "predict-output",
        question: "다음 코드의 출력은?",
        code: `from sklearn.metrics import accuracy_score
y_true = [0, 1, 1, 0, 1]
y_pred = [0, 1, 0, 0, 1]
print(accuracy_score(y_true, y_pred))`,
        options: ["0.6", "0.8", "0.4", "1.0"],
        correctIndex: 1,
        explanation:
          "5개 중 4개를 맞혔습니다 (인덱스 2만 틀림). 4/5 = 0.8입니다.",
      },
      {
        type: "multiple-choice",
        question: "결정 트리의 feature_importances_는 무엇을 알려주나요?",
        options: [
          "각 샘플의 중요도",
          "각 클래스의 비율",
          "분류에 각 특성이 얼마나 기여했는지",
          "모델의 정확도",
        ],
        correctIndex: 2,
        explanation:
          "feature_importances_는 각 특성이 분류 결정에 얼마나 기여했는지를 0~1 사이 값으로 나타냅니다.",
      },
    ],
  } satisfies Quiz,
};

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
- **KNN** (K-Nearest Neighbors) — 이웃을 보고 따라하는 분류기
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
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
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
      source: `## 🎯 KNN — 이웃을 보고 따라하는 분류기

**KNN (K-Nearest Neighbors, K-최근접 이웃)** 은 이름 그대로 단순합니다.
새 샘플이 들어오면, **가장 가까운 K 개 이웃을 찾아 다수결로 클래스를 결정** 합니다.

> "새 와인이 어디에 속할지 모르겠으면, 화학 성분이 가장 비슷한 3병을 찾아보자.
> 3병 중 2병이 Class 0 이라면 이 와인도 Class 0 일 것이다."

- 학습 단계에서 "외우기" 만 함 (= 게으른 학습, lazy learning)
- 예측 시점에 실제 거리 계산이 일어남
- \`n_neighbors\` (=K) 가 핵심 하이퍼파라미터`,
    },
    {
      type: "code",
      source: `# KNN — k=3 으로 시작
knn_model = KNeighborsClassifier(n_neighbors=3)
knn_model.fit(X_train, y_train)
knn_pred = knn_model.predict(X_test)

accuracy = accuracy_score(y_test, knn_pred)
print(f"KNN (k=3) 정확도: {accuracy:.4f}")
print(f"맞힌 개수: {(knn_pred == y_test).sum()} / {len(y_test)}")`,
    },
    {
      type: "markdown",
      source: `### K 값에 따라 성능이 어떻게 변할까?

이웃을 **너무 적게** (k=1) 보면 노이즈에 민감해 **과적합** 되기 쉽고,
**너무 많이** (k=큰 값) 보면 경계가 뭉툭해져 **과소적합** 됩니다.
좋은 K 를 찾는 건 경험적인 튜닝의 문제.`,
    },
    {
      type: "code",
      source: `# k=1, 3, 5, 15, 50 비교
print("=== K 값에 따른 KNN 정확도 ===")
for k in [1, 3, 5, 15, 50]:
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    acc = accuracy_score(y_test, knn.predict(X_test))
    print(f"  k={k:2d}: {acc:.4f}")`,
    },
    {
      type: "markdown",
      source: `### ⚠️ KNN 은 스케일링에 민감합니다

KNN 은 **거리 기반** 이므로, 값의 범위가 큰 특성이 결과를 지배합니다.
와인 데이터처럼 특성마다 단위가 다른 경우 (proline 은 수백 단위, flavanoids 는 0~5 단위),
\`StandardScaler\` 로 표준화하면 정확도가 크게 올라가는 경우가 많습니다.`,
    },
    {
      type: "code",
      source: `# 표준화 후 KNN — 같은 k=3 으로 재시도
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

knn_scaled = KNeighborsClassifier(n_neighbors=3)
knn_scaled.fit(X_train_s, y_train)
scaled_acc = accuracy_score(y_test, knn_scaled.predict(X_test_s))

plain_knn = KNeighborsClassifier(n_neighbors=3).fit(X_train, y_train)
plain_acc = accuracy_score(y_test, plain_knn.predict(X_test))

print(f"스케일링 X: {plain_acc:.4f}")
print(f"스케일링 O: {scaled_acc:.4f}")
print(f"\\n차이: {(scaled_acc - plain_acc)*100:+.1f}%p — 거리 기반 모델에선 전처리가 핵심!")`,
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
      source: `## 🎯 Mission 2: 세 모델 비교

로지스틱 회귀, 결정 트리, KNN (k=5) 의 정확도를 비교하는 코드를 작성하세요.
\`load_wine\` 전체 데이터(3 클래스)를 사용합니다.

**팁**: KNN 은 거리 기반이므로 **StandardScaler 로 표준화된 데이터** 를 함께 넘기세요.`,
    },
    {
      type: "code",
      source: `# Mission 2: 여기에 코드를 작성하세요
# 1) load_wine 전체 데이터 사용
# 2) train_test_split 80:20 (random_state=42)
# 3) StandardScaler 로 X 표준화 (KNN 용)
# 4) LogisticRegression, DecisionTreeClassifier, KNeighborsClassifier(k=5) 학습
# 5) 세 모델의 정확도를 비교하여 출력

`,
      hints: [
        "세 모델을 (이름, 모델, 표준화여부) 튜플 리스트로 만들면 깔끔합니다",
        "KNN 만 표준화된 X_train_s, X_test_s 를 사용하세요",
        "StandardScaler 는 fit_transform(X_train), transform(X_test) 순서로 사용합니다",
      ],
      solution: `from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

wine = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    wine.data, wine.target, test_size=0.2, random_state=42
)

# KNN 용 표준화
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

configs = [
    ("로지스틱 회귀", LogisticRegression(max_iter=5000, random_state=42), False),
    ("결정 트리",     DecisionTreeClassifier(random_state=42),             False),
    ("KNN (k=5)",     KNeighborsClassifier(n_neighbors=5),                  True),
]

print("=== 세 모델 비교 ===")
for name, model, needs_scaling in configs:
    Xtr, Xte = (X_train_s, X_test_s) if needs_scaling else (X_train, X_test)
    model.fit(Xtr, y_train)
    acc = accuracy_score(y_test, model.predict(Xte))
    print(f"{name:15s}: {acc:.4f}")`,
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
      {
        type: "multiple-choice",
        question:
          "KNN (K-최근접 이웃) 모델이 예측할 때 실제로 하는 일은?",
        options: [
          "학습 단계에서 직선/트리 등 '규칙' 을 만들어두고, 예측 시 그 규칙을 적용한다",
          "새 샘플과 학습 데이터 전체의 거리를 재고, 가장 가까운 K 개의 다수결로 결정한다",
          "확률 분포를 학습해 가장 확률이 높은 클래스를 출력한다",
          "랜덤하게 K 개 모델을 앙상블한다",
        ],
        correctIndex: 1,
        explanation:
          "KNN 은 학습 시점에는 '외우기' 만 하고 (lazy learning), 실제 계산은 예측 시점에 거리 기반 다수결로 일어납니다.",
      },
      {
        type: "multiple-choice",
        question:
          "KNN 을 쓸 때 StandardScaler 같은 전처리가 특히 중요한 이유는?",
        options: [
          "학습 속도를 빠르게 하기 위해",
          "거리 기반이므로 값 범위가 큰 특성이 결과를 지배하기 때문",
          "KNN 이 음수 값을 처리하지 못하기 때문",
          "정확도를 0~1 사이로 맞추기 위해",
        ],
        correctIndex: 1,
        explanation:
          "KNN 은 샘플 간 거리를 재서 이웃을 고르기 때문에, 특성의 단위/스케일이 제각각이면 큰 값 쪽이 거리 계산을 지배합니다. 표준화로 공정한 거리 비교가 가능해집니다.",
      },
    ],
  } satisfies Quiz,
};

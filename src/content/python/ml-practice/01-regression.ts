import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson01: Lesson = {
  id: "python-ml-01",
  language: "python",
  track: "ml-practice" as any,
  order: 1,
  title: "선형 회귀 — 숫자 예측하기",
  subtitle: "데이터로부터 숫자를 예측하는 첫 번째 머신러닝 모델을 만들어봅시다",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 📈 선형 회귀 — 숫자 예측하기

머신러닝의 가장 기본적인 모델, **선형 회귀(Linear Regression)**를 배워봅시다!

이번 챕터에서 배울 것:
- **선형 회귀**의 원리와 scikit-learn 사용법
- **학습/테스트 데이터 분리** (train_test_split)
- **평가 지표**: MSE, R² 점수
- **다중 회귀**: 여러 특성으로 예측하기

데이터 과학 트랙을 마친 여러분이라면 충분히 따라올 수 있어요!`,
    },
    {
      type: "markdown",
      source: `## 🔧 라이브러리 준비

scikit-learn은 머신러닝의 표준 라이브러리입니다. 관례적으로 \`sklearn\`이라고 부릅니다.`,
    },
    {
      type: "code",
      source: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

print("scikit-learn 준비 완료!")`,
    },
    {
      type: "markdown",
      source: `## 🗺️ scikit-learn 한눈에 — 모델 family 지도

scikit-learn 은 문제 유형별로 **모듈(family)** 이 나뉘어 있습니다.
이름 규칙만 알면 어떤 모델이든 \`from sklearn.{family} import {모델}\` 로 불러올 수 있어요.

| Family | 모듈 | 대표 모델 | 풀 수 있는 문제 |
|---|---|---|---|
| 선형 | \`sklearn.linear_model\` | LinearRegression, LogisticRegression, Ridge, Lasso | 회귀 · 분류 |
| 트리 | \`sklearn.tree\` | DecisionTreeClassifier, DecisionTreeRegressor | 회귀 · 분류 |
| 앙상블 | \`sklearn.ensemble\` | RandomForest, GradientBoosting | 회귀 · 분류 |
| 이웃 | \`sklearn.neighbors\` | KNeighborsClassifier, KNeighborsRegressor | 회귀 · 분류 |
| SVM | \`sklearn.svm\` | SVC, SVR | 회귀 · 분류 |
| 군집 | \`sklearn.cluster\` | KMeans, DBSCAN | 비지도 |
| 평가·분리 | \`sklearn.model_selection\` | train_test_split, cross_val_score | 공통 |
| 지표 | \`sklearn.metrics\` | accuracy_score, r2_score, mean_squared_error | 공통 |
| 데이터 | \`sklearn.datasets\` | load_iris, load_wine, make_regression | 공통 |

그리고 모든 모델이 **같은 공식** 을 따릅니다:

\`\`\`python
model = SomeModel(...)     # 1) 생성
model.fit(X_train, y_train) # 2) 학습
y_pred = model.predict(X_test)  # 3) 예측
\`\`\`

이 패턴만 외우면 어떤 모델이든 바로 써볼 수 있습니다.`,
    },
    {
      type: "code",
      source: `# 대표 모델 한눈에 import — 실제로 다 쓰진 않지만, 이름과 모듈 패턴을 눈에 익혀두세요
from sklearn.linear_model   import LinearRegression, LogisticRegression, Ridge, Lasso
from sklearn.tree           import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble       import RandomForestClassifier, GradientBoostingRegressor
from sklearn.neighbors      import KNeighborsClassifier, KNeighborsRegressor
from sklearn.svm            import SVC, SVR

print("모든 모델은 .fit(X, y) 로 학습하고 .predict(X) 로 예측합니다 — 공식은 하나!")`,
    },
    {
      type: "markdown",
      source: `## 📊 선형 회귀란?

선형 회귀는 **입력(X)과 출력(y) 사이의 직선 관계**를 찾는 알고리즘입니다.

\`y = w * X + b\` 형태의 직선을 데이터에 가장 잘 맞도록 **w(기울기)**와 **b(절편)**를 학습합니다.

간단한 예시를 만들어봅시다.`,
    },
    {
      type: "code",
      source: `# 간단한 데이터: 공부 시간 → 시험 점수
np.random.seed(42)
hours = np.array([1, 2, 3, 4, 5, 6, 7, 8]).reshape(-1, 1)
scores = np.array([35, 45, 50, 60, 65, 75, 80, 90]) + np.random.normal(0, 3, 8)

print("공부 시간:", hours.flatten())
print("시험 점수:", np.round(scores, 1))`,
    },
    {
      type: "markdown",
      source: `## 🏋️ 모델 학습하기

scikit-learn의 기본 패턴은 항상 같습니다:
1. 모델 객체 생성
2. \`.fit(X, y)\`로 학습
3. \`.predict(X)\`로 예측`,
    },
    {
      type: "code",
      source: `# 1. 모델 생성
model = LinearRegression()

# 2. 학습
model.fit(hours, scores)

# 3. 결과 확인
print(f"기울기 (w): {model.coef_[0]:.2f}")
print(f"절편 (b): {model.intercept_:.2f}")
print(f"\\n예측 공식: 점수 = {model.coef_[0]:.2f} * 시간 + {model.intercept_:.2f}")

# 예측
pred = model.predict([[5]])
print(f"\\n5시간 공부하면 예상 점수: {pred[0]:.1f}점")`,
    },
    {
      type: "markdown",
      source: `## ✂️ 학습/테스트 데이터 분리

모델이 **처음 보는 데이터**에서도 잘 작동하는지 확인해야 합니다.
\`train_test_split\`으로 데이터를 나눕니다.`,
    },
    {
      type: "code",
      source: `from sklearn.datasets import make_regression

# 데이터 생성: 특성 1개, 샘플 100개
X, y = make_regression(n_samples=100, n_features=1, noise=15, random_state=42)

# 80% 학습, 20% 테스트
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"학습 데이터: {X_train.shape[0]}개")
print(f"테스트 데이터: {X_test.shape[0]}개")

# 학습 & 예측
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(f"\\n처음 5개 실제값:  {np.round(y_test[:5], 1)}")
print(f"처음 5개 예측값: {np.round(y_pred[:5], 1)}")`,
    },
    {
      type: "markdown",
      source: `## 📏 모델 평가: MSE와 R²

- **MSE (Mean Squared Error)**: 예측 오차의 제곱 평균. 작을수록 좋음
- **R² (결정 계수)**: 1에 가까울수록 좋음 (모델이 데이터 변동을 잘 설명)`,
    },
    {
      type: "code",
      source: `mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"MSE: {mse:.2f}")
print(f"R² 점수: {r2:.4f}")
print(f"\\n해석: 모델이 테스트 데이터 변동의 {r2*100:.1f}%를 설명합니다")`,
    },
    {
      type: "markdown",
      source: `## 🎯 Mission 1: 집값 예측 모델

\`make_regression\`으로 집값 데이터를 만들고, 선형 회귀 모델을 학습시킨 뒤 R² 점수를 출력하세요.

**조건:**
- 샘플 200개, 특성 1개, noise=20
- train_test_split으로 70:30 비율로 분리
- R² 점수를 출력`,
    },
    {
      type: "code",
      source: `# Mission 1: 여기에 코드를 작성하세요
# 1) make_regression으로 데이터 생성 (n_samples=200, n_features=1, noise=20, random_state=0)
# 2) train_test_split으로 70:30 분리 (random_state=0)
# 3) LinearRegression 학습 & 예측
# 4) R² 점수 출력

`,
      hints: [
        "make_regression(n_samples=200, n_features=1, noise=20, random_state=0)으로 데이터를 생성하세요",
        "train_test_split(X, y, test_size=0.3, random_state=0)으로 분리하세요",
        "model.fit(X_train, y_train) 후 model.predict(X_test)로 예측하세요",
      ],
      solution: `from sklearn.datasets import make_regression
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

# 1) 데이터 생성
X, y = make_regression(n_samples=200, n_features=1, noise=20, random_state=0)

# 2) 70:30 분리
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)

# 3) 학습 & 예측
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# 4) 평가
r2 = r2_score(y_test, y_pred)
print(f"R² 점수: {r2:.4f}")`,
    },
    {
      type: "markdown",
      source: `## 🎯 Mission 2: 다중 회귀 (여러 특성)

여러 특성(feature)을 사용하면 더 정확한 예측이 가능합니다.
특성 5개짜리 데이터로 다중 회귀 모델을 만들고, 단일 특성 모델과 R² 점수를 비교하세요.`,
    },
    {
      type: "code",
      source: `# Mission 2: 여기에 코드를 작성하세요
# 1) make_regression(n_samples=200, n_features=5, noise=20, random_state=0)
# 2) train_test_split 80:20 (random_state=0)
# 3) LinearRegression 학습 & 예측
# 4) R² 점수 출력하고, Mission 1의 단일 특성 결과와 비교

`,
      hints: [
        "n_features=5로 설정하면 5개 특성이 생성됩니다",
        "나머지 코드는 Mission 1과 거의 동일합니다",
        "model.coef_를 출력하면 각 특성의 가중치를 볼 수 있습니다",
      ],
      solution: `from sklearn.datasets import make_regression
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

# 1) 데이터 생성 (특성 5개)
X, y = make_regression(n_samples=200, n_features=5, noise=20, random_state=0)

# 2) 80:20 분리
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# 3) 학습 & 예측
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# 4) 평가
r2 = r2_score(y_test, y_pred)
print(f"다중 회귀 R² 점수: {r2:.4f}")
print(f"\\n각 특성의 가중치: {np.round(model.coef_, 2)}")
print("특성이 많을수록 R² 점수가 높아지는 것을 확인하세요!")`,
    },
  ],
  quiz: {
    title: "선형 회귀 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "선형 회귀 모델의 R² 점수가 0.95라면 어떤 의미일까요?",
        options: [
          "모델의 정확도가 95%이다",
          "모델이 데이터 변동의 95%를 설명한다",
          "오차가 5%이다",
          "학습 데이터의 95%를 사용했다",
        ],
        correctIndex: 1,
        explanation:
          "R² (결정 계수)는 모델이 데이터의 변동(분산)을 얼마나 설명하는지를 나타냅니다. 0.95는 95%의 변동을 설명한다는 뜻입니다.",
      },
      {
        type: "predict-output",
        question: "다음 코드의 출력은?",
        code: `from sklearn.linear_model import LinearRegression
import numpy as np
X = np.array([[1], [2], [3]])
y = np.array([2, 4, 6])
model = LinearRegression().fit(X, y)
print(model.predict([[4]])[0])`,
        options: ["4.0", "6.0", "8.0", "10.0"],
        correctIndex: 2,
        explanation:
          "데이터가 y = 2x 패턴이므로, x=4일 때 y=8.0으로 예측합니다.",
      },
      {
        type: "multiple-choice",
        question:
          "train_test_split에서 test_size=0.2로 설정하면 어떻게 되나요?",
        options: [
          "데이터의 20%를 학습용, 80%를 테스트용으로 분리",
          "데이터의 80%를 학습용, 20%를 테스트용으로 분리",
          "데이터를 2개 그룹으로 나눔",
          "데이터의 첫 20개를 테스트용으로 사용",
        ],
        correctIndex: 1,
        explanation:
          "test_size=0.2는 전체 데이터의 20%를 테스트 세트로, 나머지 80%를 학습 세트로 분리합니다.",
      },
      {
        type: "multiple-choice",
        question: "MSE(Mean Squared Error)가 작을수록 모델 성능이 어떤가요?",
        options: [
          "성능이 나쁘다",
          "성능이 좋다",
          "관련이 없다",
          "과적합이다",
        ],
        correctIndex: 1,
        explanation:
          "MSE는 예측 오차의 제곱 평균입니다. 작을수록 예측이 실제값에 가까우므로 성능이 좋다고 할 수 있습니다.",
      },
    ],
  } satisfies Quiz,
};

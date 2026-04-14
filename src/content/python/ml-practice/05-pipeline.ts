import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson05: Lesson = {
  id: "python-ml-05",
  language: "python",
  track: "ml-practice" as any,
  order: 5,
  title: "ML 파이프라인 — 전체 흐름 완성",
  subtitle: "전처리부터 모델 학습, 하이퍼파라미터 튜닝까지 파이프라인으로 완성합니다",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🔗 ML 파이프라인 — 전체 흐름 완성

실제 ML 프로젝트에서는 전처리, 모델 학습, 평가를 체계적으로 관리해야 합니다.
**Pipeline**을 사용하면 이 모든 과정을 하나로 묶을 수 있습니다!

이번 챕터에서 배울 것:
- **StandardScaler**: 특성 스케일링(정규화)
- **Pipeline**: 전처리 + 모델을 하나로 연결
- **GridSearchCV**: 최적의 하이퍼파라미터 자동 탐색`,
    },
    {
      type: "markdown",
      source: `## 🔧 라이브러리 준비`,
    },
    {
      type: "code",
      source: `import numpy as np
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier

print("준비 완료!")`,
    },
    {
      type: "markdown",
      source: `## 📏 왜 스케일링이 필요한가?

특성마다 값의 범위가 다르면 모델 성능에 영향을 줍니다.
**StandardScaler**는 평균=0, 표준편차=1로 변환합니다.`,
    },
    {
      type: "code",
      source: `wine = load_wine()
X, y = wine.data, wine.target

# 스케일링 전
print("스케일링 전:")
print(f"  알코올 (0번 특성) 범위: {X[:, 0].min():.1f} ~ {X[:, 0].max():.1f}")
print(f"  프롤린 (12번 특성) 범위: {X[:, 12].min():.0f} ~ {X[:, 12].max():.0f}")

# 스케일링 후
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print("\\n스케일링 후:")
print(f"  알코올 범위: {X_scaled[:, 0].min():.2f} ~ {X_scaled[:, 0].max():.2f}")
print(f"  프롤린 범위: {X_scaled[:, 12].min():.2f} ~ {X_scaled[:, 12].max():.2f}")`,
    },
    {
      type: "markdown",
      source: `## 🔗 Pipeline 만들기

Pipeline은 여러 단계를 **순서대로** 연결합니다.
\`fit\`을 호출하면 모든 단계가 순서대로 실행됩니다.`,
    },
    {
      type: "code",
      source: `# 파이프라인: 스케일링 → 로지스틱 회귀
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(max_iter=5000, random_state=42)),
])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# fit 한 번이면 스케일링 + 학습 모두 완료!
pipe.fit(X_train, y_train)
score = pipe.score(X_test, y_test)
print(f"파이프라인 정확도: {score:.4f}")

# 파이프라인 없이 한 경우와 비교
model_raw = LogisticRegression(max_iter=5000, random_state=42)
model_raw.fit(X_train, y_train)
score_raw = model_raw.score(X_test, y_test)
print(f"스케일링 없는 정확도: {score_raw:.4f}")`,
    },
    {
      type: "markdown",
      source: `## 🔍 교차 검증과 Pipeline

Pipeline을 교차 검증과 함께 쓰면, 각 fold마다 **올바르게** 스케일링이 적용됩니다.
(테스트 데이터가 학습 데이터의 통계에 영향을 주지 않음)`,
    },
    {
      type: "code",
      source: `pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(max_iter=5000, random_state=42)),
])

scores = cross_val_score(pipe, X, y, cv=5, scoring="accuracy")
print(f"5-fold 교차 검증 정확도: {scores.mean():.4f} (+/- {scores.std():.4f})")`,
    },
    {
      type: "markdown",
      source: `## ⚙️ GridSearchCV — 하이퍼파라미터 튜닝

모델의 설정값(하이퍼파라미터)을 자동으로 탐색합니다.
가능한 조합을 모두 시도하고 최적의 조합을 찾아줍니다.`,
    },
    {
      type: "code",
      source: `pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(max_iter=5000, random_state=42)),
])

# 탐색할 파라미터
param_grid = {
    "model__C": [0.01, 0.1, 1.0, 10.0],       # 정규화 강도
    "model__solver": ["lbfgs", "liblinear"],     # 최적화 알고리즘
}

grid = GridSearchCV(pipe, param_grid, cv=5, scoring="accuracy")
grid.fit(X_train, y_train)

print(f"최적 파라미터: {grid.best_params_}")
print(f"최적 교차 검증 점수: {grid.best_score_:.4f}")
print(f"테스트 점수: {grid.score(X_test, y_test):.4f}")`,
    },
    {
      type: "markdown",
      source: `## 🎯 Mission 1: 전처리+모델 파이프라인

와인 데이터셋에서 **StandardScaler + DecisionTreeClassifier** 파이프라인을 만들고,
5-fold 교차 검증으로 평가하세요.

**조건:**
- Pipeline: StandardScaler → DecisionTreeClassifier(random_state=42)
- 5-fold 교차 검증
- 평균 정확도와 표준편차 출력`,
    },
    {
      type: "code",
      source: `# Mission 1: 여기에 코드를 작성하세요
# 1) Pipeline 생성 (scaler + decision tree)
# 2) cross_val_score로 5-fold 교차 검증
# 3) 평균 정확도와 표준편차 출력

`,
      hints: [
        "Pipeline([('scaler', StandardScaler()), ('model', DecisionTreeClassifier(random_state=42))])",
        "cross_val_score(pipe, wine.data, wine.target, cv=5)를 사용하세요",
        "scores.mean()과 scores.std()로 결과를 요약하세요",
      ],
      solution: `from sklearn.datasets import load_wine
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import cross_val_score

wine = load_wine()

# 1) 파이프라인 생성
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", DecisionTreeClassifier(random_state=42)),
])

# 2) 5-fold 교차 검증
scores = cross_val_score(pipe, wine.data, wine.target, cv=5, scoring="accuracy")

# 3) 결과 출력
print(f"5-fold 교차 검증 정확도: {scores.mean():.4f} (+/- {scores.std():.4f})")`,
    },
    {
      type: "markdown",
      source: `## 🎯 Mission 2: 하이퍼파라미터 튜닝

와인 데이터에서 **DecisionTreeClassifier**의 최적 하이퍼파라미터를 **GridSearchCV**로 찾으세요.

**조건:**
- Pipeline: StandardScaler → DecisionTreeClassifier
- 탐색 파라미터: max_depth=[2, 3, 5, 7, 10], min_samples_split=[2, 5, 10]
- 3-fold 교차 검증
- 최적 파라미터와 점수 출력`,
    },
    {
      type: "code",
      source: `# Mission 2: 여기에 코드를 작성하세요
# 1) Pipeline 생성
# 2) param_grid 정의 (model__max_depth, model__min_samples_split)
# 3) GridSearchCV로 탐색
# 4) 최적 파라미터, 교차 검증 점수, 테스트 점수 출력

`,
      hints: [
        "param_grid의 키는 'model__max_depth', 'model__min_samples_split' 형태입니다",
        "GridSearchCV(pipe, param_grid, cv=3, scoring='accuracy')를 사용하세요",
        "grid.best_params_, grid.best_score_로 최적 결과를 확인하세요",
      ],
      solution: `from sklearn.datasets import load_wine
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split, GridSearchCV

wine = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    wine.data, wine.target, test_size=0.2, random_state=42
)

# 1) 파이프라인
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", DecisionTreeClassifier(random_state=42)),
])

# 2) 파라미터 그리드
param_grid = {
    "model__max_depth": [2, 3, 5, 7, 10],
    "model__min_samples_split": [2, 5, 10],
}

# 3) GridSearchCV
grid = GridSearchCV(pipe, param_grid, cv=3, scoring="accuracy")
grid.fit(X_train, y_train)

# 4) 결과
print(f"최적 파라미터: {grid.best_params_}")
print(f"최적 교차 검증 점수: {grid.best_score_:.4f}")
print(f"테스트 점수: {grid.score(X_test, y_test):.4f}")`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 5 완료 — 전반 5강 마무리!

기초 편(1~5강)을 끝냈어요. 회귀·분류·평가·클러스터링·파이프라인·튜닝까지 **ML 의 골격** 을 갖췄습니다.

지금까지 배운 것:
- ✅ **Ch1 선형 회귀** — 숫자 예측 + 평가지표
- ✅ **Ch2 분류** — 로지스틱 + 트리 기초
- ✅ **Ch3 모델 평가** — 혼동행렬, F1, 교차검증
- ✅ **Ch4 클러스터링** — 비지도 K-means
- ✅ **Ch5 파이프라인 & 튜닝** — StandardScaler + GridSearchCV

### 🚀 앞으로 남은 5강 — 실전 편

- 🧩 **Ch6 특성 전처리와 인코딩** — ColumnTransformer, OneHot/Ordinal, 데이터 누수 방지
- 🌳 **Ch7 트리와 앙상블** — DecisionTree, RandomForest, feature importance
- 🚀 **Ch8 부스팅과 정규화** — GradientBoosting, Ridge/Lasso
- 🔍 **Ch9 모델 해석과 불균형 데이터** — permutation_importance, ROC/AUC, class_weight
- 🏁 **Ch10 미니 프로젝트** — 고객 이탈 예측 전체 플로우

실무 ML 프로젝트의 현실적인 모습은 6~10강에 더 많이 들어 있어요. 계속 이어가 보세요! 🔥`,
    },
  ],
  quiz: {
    title: "ML 파이프라인 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "StandardScaler는 데이터를 어떻게 변환하나요?",
        options: [
          "모든 값을 0과 1 사이로 변환",
          "평균 0, 표준편차 1로 변환",
          "로그 변환",
          "제곱근 변환",
        ],
        correctIndex: 1,
        explanation:
          "StandardScaler는 각 특성의 평균을 0, 표준편차를 1로 변환합니다. (x - mean) / std 공식을 사용합니다.",
      },
      {
        type: "multiple-choice",
        question: "Pipeline을 사용하는 가장 큰 이유는?",
        options: [
          "코드가 빨라진다",
          "전처리와 모델을 묶어 데이터 누수(data leakage)를 방지한다",
          "모델 정확도가 자동으로 올라간다",
          "메모리 사용량이 줄어든다",
        ],
        correctIndex: 1,
        explanation:
          "Pipeline을 사용하면 교차 검증 시 각 fold마다 전처리가 올바르게 적용되어, 테스트 데이터의 정보가 학습에 누수되는 것을 방지합니다.",
      },
      {
        type: "predict-output",
        question: "다음 코드의 출력은?",
        code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
pipe = Pipeline([("s", StandardScaler()), ("m", LogisticRegression())])
print(len(pipe.steps))`,
        options: ["1", "2", "3", "오류 발생"],
        correctIndex: 1,
        explanation:
          "Pipeline의 steps는 전달한 단계의 리스트입니다. StandardScaler와 LogisticRegression 2개 단계이므로 len은 2입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "GridSearchCV에서 cv=5, param_grid에 3x4=12개 조합이 있다면, 모델은 총 몇 번 학습되나요?",
        options: ["5번", "12번", "17번", "60번"],
        correctIndex: 3,
        explanation:
          "12개 파라미터 조합 x 5-fold = 총 60번 학습됩니다. 각 조합마다 5번의 교차 검증이 수행됩니다.",
      },
    ],
  } satisfies Quiz,
};

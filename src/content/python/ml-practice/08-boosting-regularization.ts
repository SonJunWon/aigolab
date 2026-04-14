import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson08: Lesson = {
  id: "python-ml-08",
  language: "python",
  track: "ml-practice" as const,
  order: 8,
  title: "부스팅과 정규화",
  subtitle: "Kaggle 1등 알고리즘의 원리 + 회귀의 과적합 방어",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🚀 그레이디언트 부스팅과 정규화

7강에서 **배깅(bagging)** 기반 RandomForest 를 배웠죠. 이번엔:

- **부스팅(Boosting)** — 앞 트리의 실수를 뒤 트리가 보완하는 순차 앙상블 → Kaggle 상위권의 단골
- **정규화(Regularization)** — 회귀의 과적합을 억제하는 Ridge / Lasso / ElasticNet

이번 챕터에서 배울 것:
- \`GradientBoostingClassifier\` / \`HistGradientBoostingClassifier\`
- 배깅 vs 부스팅의 차이
- Ridge (L2) / Lasso (L1) / ElasticNet
- 알파(α) 를 바꾸며 과적합 ↔ 과소적합 체험

> 🎯 이 두 가지만 알아도 **정형 데이터** ML 실무 80% 를 커버할 수 있어요.`,
    },
    {
      type: "markdown",
      source: `## 🆚 배깅 vs 부스팅

### 배깅 (Bagging) — 병렬 투표
- 트리들을 **독립적으로** 학습
- 각자 부트스트랩 샘플
- 결과는 **투표/평균**
- 대표: **RandomForest**

### 부스팅 (Boosting) — 순차 보완
- 이전 모델이 **틀린 샘플에 가중치** 를 부여
- 다음 모델이 그 부분을 집중 학습
- 순차적 → 병렬 어려움, 하지만 성능 ↑
- 대표: **GradientBoosting, XGBoost, LightGBM**

\`\`\`
[배깅]   Tree1  Tree2  Tree3  ...       → 투표
         ─────  ─────  ─────                  ↓
         독립    독립    독립              평균 / 다수결

[부스팅] Tree1 → Tree2 → Tree3 → ...    → 가중 합
         ─────   ─────   ─────
         원래 ↓  Tree1 실수 ↓  Tree2 실수 ↓
         데이터  집중       집중
\`\`\``,
    },
    {
      type: "markdown",
      source: `## 🌱 GradientBoostingClassifier — 기본편`,
    },
    {
      type: "code",
      source: `from sklearn.datasets import load_wine
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.model_selection import train_test_split
import time

X, y = load_wine(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

# 1) RandomForest (배깅)
t0 = time.time()
rf = RandomForestClassifier(n_estimators=200, max_depth=5, random_state=42, n_jobs=-1)
rf.fit(X_tr, y_tr)
rf_time = time.time() - t0

# 2) GradientBoosting (부스팅)
t0 = time.time()
gb = GradientBoostingClassifier(n_estimators=200, max_depth=3, learning_rate=0.1, random_state=42)
gb.fit(X_tr, y_tr)
gb_time = time.time() - t0

print(f"{'모델':<20} {'test':>8} {'train':>8} {'time(s)':>10}")
print("-" * 50)
print(f"{'RandomForest':<20} {rf.score(X_te, y_te):>8.3f} {rf.score(X_tr, y_tr):>8.3f} {rf_time:>10.3f}")
print(f"{'GradientBoosting':<20} {gb.score(X_te, y_te):>8.3f} {gb.score(X_tr, y_tr):>8.3f} {gb_time:>10.3f}")
`,
    },
    {
      type: "markdown",
      source: `### 부스팅 핵심 하이퍼파라미터

| 파라미터 | 역할 | 실무 팁 |
|---------|------|---------|
| \`n_estimators\` | 트리 개수 | 많을수록 좋지만 과적합 위험 |
| \`learning_rate\` | 각 트리 기여 비율 (0.01~0.3) | **낮추고 n_estimators 를 늘리는** 게 보통 안전 |
| \`max_depth\` | 각 트리의 최대 깊이 | **얕은 트리(3~5)** 가 기본 |
| \`subsample\` | 각 트리 학습에 쓸 샘플 비율 | 0.7~0.9 로 내리면 일반화 ↑ |

### ⚡ \`HistGradientBoostingClassifier\` — 빠른 버전

sklearn 0.21+ 에 내장된 **히스토그램 기반 GBM**. LightGBM 스타일로 수십 배 빠름.`,
    },
    {
      type: "code",
      source: `from sklearn.ensemble import HistGradientBoostingClassifier
import time

t0 = time.time()
hgb = HistGradientBoostingClassifier(max_iter=200, learning_rate=0.1, random_state=42)
hgb.fit(X_tr, y_tr)
dt = time.time() - t0

print(f"HistGBM  test={hgb.score(X_te, y_te):.3f}  train={hgb.score(X_tr, y_tr):.3f}  time={dt:.3f}s")
print()
print("💡 큰 데이터에서는 HistGradientBoosting / XGBoost / LightGBM 중 하나가 실무 표준.")
`,
    },
    {
      type: "markdown",
      source: `## 🛡️ 회귀의 과적합 방어 — Ridge / Lasso

선형 회귀는 피처가 많아지면 **가중치가 폭주** 하며 과적합해요.
**정규화 항** 을 손실 함수에 더해 가중치를 억제합니다.

| 이름 | 정규화 | 효과 |
|------|--------|------|
| **Ridge (L2)** | \`α · Σ w²\` | 모든 가중치를 **작게** (0은 아님) |
| **Lasso (L1)** | \`α · Σ |w|\` | 일부 가중치를 **0 으로** — 피처 선택 효과 |
| **ElasticNet** | L1 + L2 혼합 | 둘의 절충 |

> 🎯 \`α\` (또는 \`alpha\`) 는 **정규화 세기**. 0이면 일반 선형회귀, 클수록 강한 제약.`,
    },
    {
      type: "code",
      source: `from sklearn.datasets import make_regression
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.model_selection import train_test_split

# 피처 20개 중 5개만 실제로 y 와 관련 있음 — 노이즈가 큰 상황
X, y = make_regression(
    n_samples=200, n_features=20, n_informative=5, noise=20, random_state=42
)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42)

models = {
    "LinearRegression": LinearRegression(),
    "Ridge (α=1.0)":    Ridge(alpha=1.0),
    "Ridge (α=10.0)":   Ridge(alpha=10.0),
    "Lasso (α=1.0)":    Lasso(alpha=1.0),
    "Lasso (α=5.0)":    Lasso(alpha=5.0),
}

print(f"{'모델':<22} {'train R²':>10} {'test R²':>10} {'0인 계수':>10}")
print("-" * 55)
for name, model in models.items():
    model.fit(X_tr, y_tr)
    zero_coef = int((abs(model.coef_) < 1e-6).sum())
    print(f"{name:<22} {model.score(X_tr, y_tr):>10.3f} "
          f"{model.score(X_te, y_te):>10.3f} {zero_coef:>10}")
`,
    },
    {
      type: "markdown",
      source: `> 🔍 관찰
> - Lasso α 를 키울수록 **계수가 0 인 피처 개수** 증가 — 자동 피처 선택
> - Ridge 는 모든 계수를 조금씩 줄이지만 0 으로는 안 보냄
> - 너무 큰 α 는 **과소적합** — 적정 지점이 존재
>
> 적정 α 는 **교차 검증**(다음 단계) 으로 찾는 게 표준.`,
    },
    {
      type: "markdown",
      source: `## 🎯 α 자동 튜닝 — \`RidgeCV\` / \`LassoCV\``,
    },
    {
      type: "code",
      source: `from sklearn.linear_model import RidgeCV, LassoCV
import numpy as np

# 여러 α 후보 중 교차검증으로 최적값 선택
alphas = np.logspace(-2, 2, 20)   # 0.01 ~ 100

ridge_cv = RidgeCV(alphas=alphas).fit(X_tr, y_tr)
lasso_cv = LassoCV(alphas=alphas, cv=5, max_iter=5000, random_state=42).fit(X_tr, y_tr)

print(f"RidgeCV 최적 α = {ridge_cv.alpha_:.3f}")
print(f"  test R² = {ridge_cv.score(X_te, y_te):.3f}")
print()
print(f"LassoCV 최적 α = {lasso_cv.alpha_:.3f}")
print(f"  test R² = {lasso_cv.score(X_te, y_te):.3f}")
print(f"  선택된 피처 수 = {int((abs(lasso_cv.coef_) > 1e-6).sum())} / {len(lasso_cv.coef_)}")
`,
    },
    {
      type: "markdown",
      source: `## 🧭 언제 어떤 모델을 쓸까?

| 상황 | 1순위 후보 |
|------|-----------|
| **작은/중간 정형 데이터, 해석 중요** | Ridge / Lasso / DecisionTree |
| **중간 크기 정형 데이터, 성능 우선** | RandomForest / GradientBoosting |
| **큰 데이터(10만+ 행)** | HistGradientBoosting / XGBoost / LightGBM |
| **이미지/텍스트/시계열** | 딥러닝 (PyTorch / TensorFlow) |
| **피처 중 일부만 쓸모있는 고차원** | Lasso (자동 피처 선택) |

> 💡 **베이스라인 순서** 추천: LogisticRegression(or Ridge) → RandomForest → GradientBoosting`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 — 부스팅과 Lasso 비교

\`make_classification\` 으로 만든 **고차원(피처 30, 정보 피처 5) 데이터** 에서 다음을 비교:

1. \`GradientBoostingClassifier(n_estimators=200)\` 로 훈련·테스트 정확도
2. 같은 데이터에 \`LogisticRegression(penalty="l1", solver="liblinear")\` 로 훈련·테스트 정확도
   - L1 이 선택한 비영 피처 수 출력
3. 어느 쪽이 테스트 성능에서 더 나은지 한 줄 코멘트 출력`,
    },
    {
      type: "code",
      source: `from sklearn.datasets import make_classification
import numpy as np

X, y = make_classification(
    n_samples=500, n_features=30, n_informative=5,
    n_redundant=5, random_state=42
)

# 여기에 코드를 작성하세요
`,
      hints: [
        "from sklearn.model_selection import train_test_split",
        "X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)",
        "from sklearn.ensemble import GradientBoostingClassifier",
        "from sklearn.linear_model import LogisticRegression",
        "L1 로지스틱: LogisticRegression(penalty='l1', solver='liblinear', C=0.1)  — 여기서 C는 alpha의 역수",
        "선택된 피처 수: int((abs(lr.coef_[0]) > 1e-6).sum())",
      ],
      solution: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import numpy as np

X, y = make_classification(
    n_samples=500, n_features=30, n_informative=5,
    n_redundant=5, random_state=42
)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

# 1) GradientBoosting
gb = GradientBoostingClassifier(n_estimators=200, random_state=42)
gb.fit(X_tr, y_tr)
gb_tr, gb_te = gb.score(X_tr, y_tr), gb.score(X_te, y_te)

# 2) L1 로지스틱 (스케일링 필요)
pipe = Pipeline([
    ("sc", StandardScaler()),
    ("lr", LogisticRegression(penalty="l1", solver="liblinear", C=0.1, random_state=42)),
])
pipe.fit(X_tr, y_tr)
lr_tr, lr_te = pipe.score(X_tr, y_tr), pipe.score(X_te, y_te)
n_selected = int((abs(pipe.named_steps["lr"].coef_[0]) > 1e-6).sum())

print(f"{'모델':<30} {'train':>8} {'test':>8}")
print("-" * 50)
print(f"{'GradientBoosting':<30} {gb_tr:>8.3f} {gb_te:>8.3f}")
print(f"{'Logistic + L1 (자동 피처선택)':<30} {lr_tr:>8.3f} {lr_te:>8.3f}")
print()
print(f"L1 이 선택한 비영 피처: {n_selected} / {X.shape[1]}  (정보 피처 5 + 일부 리던던트)")
print()
better = "GradientBoosting" if gb_te > lr_te else "Logistic+L1"
print(f"🏆 테스트 성능 우위: {better}")`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 8 완료

- ✅ 배깅 vs 부스팅의 근본 차이 (병렬 투표 vs 순차 보완)
- ✅ \`GradientBoostingClassifier\` + 주요 하이퍼파라미터
- ✅ \`HistGradientBoostingClassifier\` — 빠른 부스팅
- ✅ Ridge (L2) / Lasso (L1) / ElasticNet — 회귀의 정규화
- ✅ \`RidgeCV\` / \`LassoCV\` — α 자동 튜닝

다음 챕터는 **모델 해석과 불균형 데이터** — "왜 그렇게 판단했지?" 를 답하고, 99% 정상 vs 1% 사기 같은 편향 상황을 다룹니다.`,
    },
    { type: "code", source: `# 자유 실험 영역\n` },
  ],
  quiz: {
    title: "챕터 8 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "배깅(Bagging) 과 부스팅(Boosting) 의 근본 차이로 올바른 것은?",
        options: [
          "배깅은 숫자만, 부스팅은 카테고리만 다룬다",
          "배깅은 독립 학습 후 투표, 부스팅은 앞 모델의 실수를 뒤 모델이 보완하는 순차 학습",
          "배깅은 딥러닝, 부스팅은 머신러닝이다",
          "둘은 완전히 같다",
        ],
        correctIndex: 1,
        explanation:
          "배깅은 독립 학습된 약한 모델의 투표(예: RandomForest), 부스팅은 앞 모델의 오류에 가중치를 주며 순차적으로 보완하는 앙상블(예: GradientBoosting).",
      },
      {
        type: "multiple-choice",
        question:
          "Ridge 와 Lasso 의 가장 큰 실무적 차이는?",
        options: [
          "Ridge 는 분류용, Lasso 는 회귀용",
          "Lasso 는 일부 가중치를 정확히 0 으로 만들어 자동 피처 선택 효과",
          "Ridge 는 과적합 방지, Lasso 는 과소적합 방지",
          "둘은 같은 손실 함수를 쓴다",
        ],
        correctIndex: 1,
        explanation:
          "L1 페널티(Lasso) 는 가중치를 정확히 0 으로 몰 수 있어 '자동 피처 선택' 효과가 있어요. L2(Ridge) 는 모든 계수를 작게 만들지만 0 으로는 보내지 않습니다.",
      },
      {
        type: "multiple-choice",
        question:
          "GradientBoosting 의 learning_rate 를 낮추면 어떻게 해야 성능을 유지하나?",
        options: [
          "n_estimators(트리 개수)를 늘린다",
          "max_depth 를 늘린다",
          "random_state 를 바꾼다",
          "아무것도 안 해도 된다",
        ],
        correctIndex: 0,
        explanation:
          "learning_rate 와 n_estimators 는 서로 보완 관계예요. 학습률을 낮추면 한 번에 조금씩 학습하므로 더 많은 트리가 필요. '작은 학습률 + 많은 트리' 가 일반화에 유리한 조합.",
      },
      {
        type: "multiple-choice",
        question:
          "다음 중 '고차원 정형 데이터 + 피처 선택 필요' 상황에 가장 적절한 모델은?",
        options: [
          "LinearRegression (정규화 없음)",
          "Lasso 혹은 ElasticNet",
          "DecisionTree 단독",
          "KMeans",
        ],
        correctIndex: 1,
        explanation:
          "L1 정규화가 포함된 Lasso/ElasticNet 이 계수를 0 으로 몰아 자동 피처 선택. 고차원 회귀에서 실무에서 많이 쓰이는 베이스라인.",
      },
    ],
  } satisfies Quiz,
};

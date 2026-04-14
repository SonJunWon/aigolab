import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson10: Lesson = {
  id: "python-ml-10",
  language: "python",
  track: "ml-practice" as const,
  order: 10,
  title: "미니 프로젝트 — 고객 이탈 예측",
  subtitle: "EDA → 전처리 → 여러 모델 → 해석까지 실전 ML 플로우",
  estimatedMinutes: 40,
  cells: [
    {
      type: "markdown",
      source: `# 🏁 미니 프로젝트 — 고객 이탈(Churn) 예측

> 🎬 **시나리오**
> 여러분은 **구독형 SaaS** 의 데이터 사이언티스트입니다.
> 최근 월 이탈률(Churn rate) 이 **6%** 까지 치솟았고, CEO 는
> **"이번 주 안에 '이탈 위험 높은 고객' 을 미리 알려주는 예측 모델을 내놔줘"** 라고 지시.

이 챕터에서 **실전 ML 프로젝트의 전체 플로우** 를 체험합니다.

### 🧰 이 챕터에서 쓸 것 (이전 강에서 배운 모든 걸 종합)
- 📊 **EDA** — describe / value_counts / 클래스 분포
- 🧹 **전처리** — ColumnTransformer (숫자 + 카테고리) — **Ch6**
- 🌳 **모델 후보** — 로지스틱 / RandomForest / GradientBoosting — **Ch7, 8**
- 📏 **교차검증 평가** — Ch5 파이프라인 + cross_val_score
- ⚖️ **불균형 처리** — class_weight, stratify — **Ch9**
- 🔍 **해석** — permutation_importance + 임계값 조정 — **Ch9**
- 📝 **최종 리포트** — 경영진 보고 스타일`,
    },
    {
      type: "markdown",
      source: `## 🧪 Step 0 — 가상 고객 데이터 생성

실제 SaaS 고객 테이블을 모사한 데이터를 만듭니다. 아래 셀을 **반드시 먼저 실행** 하세요.`,
    },
    {
      type: "code",
      source: `import numpy as np
import pandas as pd
np.random.seed(42)

n = 2000

# 숫자 피처
tenure_months     = np.random.gamma(shape=2, scale=6, size=n).clip(0.5, 60).round(1)
monthly_charges   = np.random.normal(loc=65, scale=20, size=n).clip(20, 130).round(2)
support_tickets   = np.random.poisson(lam=2, size=n)
login_days_30d    = np.random.binomial(n=30, p=0.5, size=n)

# 카테고리 피처
plan_type  = np.random.choice(["Basic", "Pro", "Enterprise"], size=n, p=[0.5, 0.35, 0.15])
contract   = np.random.choice(["Monthly", "Annual", "TwoYear"], size=n, p=[0.55, 0.30, 0.15])
payment    = np.random.choice(["Card", "Bank", "PayPal"], size=n, p=[0.6, 0.3, 0.1])

# ── 이탈(churn) 생성: 규칙 기반 + 노이즈 ──
# 월간 계약 + 높은 요금 + 지원 티켓 多 + 최근 로그인 적음 → 이탈 가능성 ↑
churn_score = (
    (contract == "Monthly") * 1.5
    + (monthly_charges > 85) * 0.8
    + (support_tickets > 3) * 1.2
    + (login_days_30d < 10) * 1.5
    + (tenure_months < 6) * 0.7
    + np.random.normal(0, 0.5, n)
)
churn = (churn_score > 1.8).astype(int)

df = pd.DataFrame({
    "tenure_months":   tenure_months,
    "monthly_charges": monthly_charges,
    "support_tickets": support_tickets,
    "login_days_30d":  login_days_30d,
    "plan_type":       plan_type,
    "contract":        contract,
    "payment":         payment,
    "churn":           churn,
})

print(f"✅ 고객 데이터: {df.shape[0]}행 × {df.shape[1]}열")
print(f"   이탈률: {df['churn'].mean():.1%}")
print()
print(df.head())
`,
    },
    {
      type: "markdown",
      source: `## 📊 Step 1 — EDA

분석가의 첫 질문은 **"이 데이터가 뭐가 있지?"** 입니다.`,
    },
    {
      type: "code",
      source: `print("🔢 숫자 피처 요약")
print(df.describe().round(2))
print()

print("🏷️ 카테고리 피처 분포")
for col in ["plan_type", "contract", "payment"]:
    print(f"\\n  {col}:")
    print(df[col].value_counts(normalize=True).mul(100).round(1).to_string())
print()

print("⚖️ 타깃 분포 (churn)")
print(df["churn"].value_counts())
print(f"   이탈자 비중: {df['churn'].mean():.1%}")
`,
    },
    {
      type: "markdown",
      source: `### 피처 × 이탈 관계 빠르게 훑어보기`,
    },
    {
      type: "code",
      source: `print("📊 이탈자 vs 유지자의 평균 비교")
comp = df.groupby("churn")[["tenure_months", "monthly_charges",
                             "support_tickets", "login_days_30d"]].mean().round(2)
comp.index = ["유지(0)", "이탈(1)"]
print(comp.T)
print()

print("📊 계약 유형별 이탈률")
by_contract = df.groupby("contract")["churn"].agg(["count", "mean"]).round(3)
by_contract.columns = ["고객수", "이탈률"]
print(by_contract.sort_values("이탈률", ascending=False))
print()

print("🧠 힌트: 월 계약(Monthly) 고객의 이탈률이 압도적으로 높아 보이죠? 모델이 이걸 잘 찾아내는지 확인해 봅시다.")
`,
    },
    {
      type: "markdown",
      source: `## 🔪 Step 2 — 훈련/테스트 분할

이탈 비율을 유지하려 \`stratify=y\` 필수.`,
    },
    {
      type: "code",
      source: `from sklearn.model_selection import train_test_split

X = df.drop(columns=["churn"])
y = df["churn"]

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)
print(f"훈련: {len(X_tr)}행 (이탈 {y_tr.mean():.1%})")
print(f"테스트: {len(X_te)}행 (이탈 {y_te.mean():.1%})")
`,
    },
    {
      type: "markdown",
      source: `## 🛠️ Step 3 — 전처리 파이프라인

숫자와 카테고리에 각각 다른 전처리를 적용합니다 (Ch6 의 \`ColumnTransformer\`).`,
    },
    {
      type: "code",
      source: `from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder

numeric_cols     = ["tenure_months", "monthly_charges", "support_tickets", "login_days_30d"]
categorical_cols = ["plan_type", "contract", "payment"]

preprocessor = ColumnTransformer([
    ("num", StandardScaler(), numeric_cols),
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
])

print("✅ 전처리 파이프라인 준비")
print(f"   숫자 피처: {len(numeric_cols)}개 → StandardScaler")
print(f"   카테고리 피처: {len(categorical_cols)}개 → OneHotEncoder")
`,
    },
    {
      type: "markdown",
      source: `## 🥇 Step 4 — 여러 모델 비교 (교차검증)

실무의 1단계는 **여러 베이스라인을 같은 조건에서 비교** 하는 것.`,
    },
    {
      type: "code",
      source: `from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

candidates = {
    "Logistic (balanced)":      LogisticRegression(max_iter=1000, class_weight="balanced"),
    "RandomForest (balanced)":  RandomForestClassifier(n_estimators=200, class_weight="balanced",
                                                        random_state=42, n_jobs=-1),
    "GradientBoosting":         GradientBoostingClassifier(n_estimators=200, random_state=42),
}

print(f"{'모델':<28} {'5-fold F1':>12} {'표준편차':>10}")
print("-" * 55)

results = {}
for name, clf in candidates.items():
    pipe = Pipeline([("pre", preprocessor), ("clf", clf)])
    # 불균형이므로 f1 을 스코어로 사용
    scores = cross_val_score(pipe, X_tr, y_tr, cv=5, scoring="f1", n_jobs=-1)
    results[name] = scores.mean()
    print(f"{name:<28} {scores.mean():>12.4f} {scores.std():>10.4f}")

best = max(results, key=results.get)
print()
print(f"🏆 최고 성능: {best}  (F1 평균 {results[best]:.4f})")
`,
    },
    {
      type: "markdown",
      source: `## 🎯 Step 5 — 최종 모델 학습 + 평가`,
    },
    {
      type: "code",
      source: `from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

# 가장 강한 모델: GradientBoosting (대부분 구조화 데이터에서 우수)
final_pipe = Pipeline([
    ("pre", preprocessor),
    ("clf", GradientBoostingClassifier(n_estimators=200, random_state=42)),
])
final_pipe.fit(X_tr, y_tr)

y_pred  = final_pipe.predict(X_te)
y_proba = final_pipe.predict_proba(X_te)[:, 1]

print("🎯 테스트 세트 성능")
print()
print("Confusion Matrix:")
cm = confusion_matrix(y_te, y_pred)
tn, fp, fn, tp = cm.ravel()
print(f"              예측 유지  예측 이탈")
print(f"  실제 유지    {tn:>6}       {fp:>6}")
print(f"  실제 이탈    {fn:>6}       {tp:>6}")
print()

print(classification_report(y_te, y_pred, digits=3,
                              target_names=["유지", "이탈"]))

print(f"AUC-ROC: {roc_auc_score(y_te, y_proba):.4f}")
`,
    },
    {
      type: "markdown",
      source: `## 🔍 Step 6 — 모델 해석 (permutation importance)

"어떤 피처 때문에 이탈을 예측한 건가?" — 경영진 보고 필수.`,
    },
    {
      type: "code",
      source: `from sklearn.inspection import permutation_importance
import pandas as pd

result = permutation_importance(
    final_pipe, X_te, y_te, n_repeats=10, random_state=42, n_jobs=-1, scoring="f1"
)

imp = (pd.Series(result.importances_mean, index=X_te.columns)
         .sort_values(ascending=False))

print("🔍 이탈 예측 기여도 (permutation importance)")
print()
mx = imp.max()
for feat, val in imp.items():
    bar = "█" * int((val / mx) * 25) if val > 0 else ""
    print(f"   {feat:<20} {val:.4f}  {bar}")
`,
    },
    {
      type: "markdown",
      source: `## 📉 Step 7 — 임계값 조정 (비즈니스 의사결정)

이탈 방지 캠페인의 **예산 제약** 에 따라 임계값을 바꿔야 합니다.`,
    },
    {
      type: "code",
      source: `from sklearn.metrics import precision_recall_fscore_support

print(f"{'threshold':>10} {'targets':>10} {'recall':>8} {'precision':>10} {'f1':>6}")
print("-" * 50)
for t in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]:
    y_pred_t = (y_proba >= t).astype(int)
    target_count = y_pred_t.sum()
    p, r, f1, _ = precision_recall_fscore_support(
        y_te, y_pred_t, average="binary", zero_division=0
    )
    print(f"{t:>10.2f} {target_count:>10} {r:>8.3f} {p:>10.3f} {f1:>6.3f}")

print()
print("💡 해석:")
print("   예산 무제한 → 낮은 임계값(0.2) 으로 이탈자 거의 다 잡기 (recall 최대)")
print("   예산 제한  → 높은 임계값(0.6) 으로 '확실한 이탈' 만 대상 (precision 우선)")
`,
    },
    {
      type: "markdown",
      source: `## 📝 Step 8 — CEO 보고서 조립`,
    },
    {
      type: "code",
      source: `# 이전 셀 변수 (imp, final_pipe, y_proba, y_te) 이어서
top3 = imp.head(3).index.tolist()
auc = roc_auc_score(y_te, y_proba)

# 중간 임계값(0.3)으로 예상 타깃 규모
target_mask_03 = y_proba >= 0.3
n_targets_03   = int(target_mask_03.sum())
recall_03      = (y_te[target_mask_03].sum() / y_te.sum())
precision_03   = (y_te[target_mask_03].sum() / max(target_mask_03.sum(), 1))

report = f"""
══════════════════════════════════════════════════════════
  📊 고객 이탈 예측 모델 — 경영진 브리핑
══════════════════════════════════════════════════════════

[모델 성능]
  AUC-ROC        {auc:.3f}
  F1-score       {imp.sum():.3f}                        (0~1, 높을수록 좋음)

[예측 영향도 상위 3 피처]
  1. {top3[0]}
  2. {top3[1]}
  3. {top3[2]}
  → 이 세 가지가 이탈 여부를 가장 강하게 가릅니다.
  → 제품팀과 공유: 월 계약 고객·요금 높은 고객·지원 티켓 잦은 고객에 우선 개입

[권장 임계값: 0.3]
  대상 고객 수    {n_targets_03} / {len(y_te)}
  예상 recall     {recall_03:.1%}   (실제 이탈자 중 잡히는 비율)
  예상 precision  {precision_03:.1%}   (타깃 중 실제 이탈할 비율)
  → 이탈 방지 캠페인은 '포괄적 접근' 이 적절 (recall 우선).
  → 예산이 빠듯하면 0.5 로 올려 규모 축소.

[제안 액션]
  1. Monthly 계약 고객에게 연간 업그레이드 할인 쿠폰 발송
  2. support_tickets ≥ 3 고객에게 전담 담당자 배정
  3. 최근 30일 로그인 < 10 고객에게 교육 이메일 발송
══════════════════════════════════════════════════════════
"""
print(report)
`,
    },
    {
      type: "markdown",
      source: `## ✏️ 도전 미션 — 더 나은 모델 찾기

위 플로우를 기반으로 **F1-score 를 더 높이기** 위한 실험을 해보세요.

**시도해 볼 것 (하나 또는 여러 개)**:
- 🎚️ **하이퍼파라미터 튜닝** — GridSearchCV 로 n_estimators, learning_rate, max_depth 최적화
- 🎯 **SMOTE** 대신 \`class_weight\` 조정 — (imblearn 없으므로) \`class_weight={0:1, 1:3}\` 같이 직접 설정
- 🧪 **피처 엔지니어링** — \`engagement = login_days_30d / tenure_months\` 같은 파생 변수
- 🌲 **더 강한 모델** — \`HistGradientBoostingClassifier\` (sklearn 기본 제공, 빠르고 강함)`,
    },
    {
      type: "code",
      source: `# 현재 baseline F1 이 얼마인지 확인
from sklearn.model_selection import cross_val_score

baseline = Pipeline([
    ("pre", preprocessor),
    ("clf", GradientBoostingClassifier(n_estimators=200, random_state=42)),
])
base_score = cross_val_score(baseline, X_tr, y_tr, cv=5, scoring="f1", n_jobs=-1).mean()
print(f"📌 Baseline 5-fold F1: {base_score:.4f}")
print()
print("여기에 여러분의 개선 실험을 작성하세요.")
`,
      hints: [
        "피처 엔지니어링: X_tr2 = X_tr.assign(engagement = X_tr['login_days_30d'] / (X_tr['tenure_months'] + 1))",
        "HistGradientBoosting: from sklearn.ensemble import HistGradientBoostingClassifier",
        "GridSearchCV: from sklearn.model_selection import GridSearchCV — param_grid 에 'clf__learning_rate', 'clf__max_depth' 같이",
        "class_weight dict: GradientBoostingClassifier 는 지원 안 함. RandomForestClassifier(class_weight={0:1, 1:3}) 로 시도",
      ],
      solution: `# 예시 개선안: 피처 엔지니어링 + HistGradientBoosting + 튜닝
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import GridSearchCV, cross_val_score

# 1) 피처 엔지니어링
def add_features(df):
    out = df.copy()
    out["engagement"]    = out["login_days_30d"] / (out["tenure_months"] + 1)
    out["cost_per_use"]  = out["monthly_charges"] / (out["login_days_30d"] + 1)
    return out

X_tr_fe = add_features(X_tr)
X_te_fe = add_features(X_te)

numeric_cols_fe = ["tenure_months", "monthly_charges", "support_tickets",
                   "login_days_30d", "engagement", "cost_per_use"]
categorical_cols = ["plan_type", "contract", "payment"]

preprocessor_fe = ColumnTransformer([
    ("num", StandardScaler(), numeric_cols_fe),
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
])

# 2) HistGradientBoosting + GridSearch
pipe = Pipeline([
    ("pre", preprocessor_fe),
    ("clf", HistGradientBoostingClassifier(random_state=42)),
])
param_grid = {
    "clf__learning_rate": [0.05, 0.1, 0.2],
    "clf__max_depth":     [3, 5, 8],
    "clf__max_iter":      [100, 200],
}
gs = GridSearchCV(pipe, param_grid, cv=5, scoring="f1", n_jobs=-1)
gs.fit(X_tr_fe, y_tr)

print(f"✅ 최적 파라미터: {gs.best_params_}")
print(f"   5-fold F1 (CV): {gs.best_score_:.4f}")
print(f"   Baseline F1:    {base_score:.4f}")
print(f"   개선폭:         {(gs.best_score_ - base_score) * 100:+.2f}%p")
print()
print(f"   Test F1:        {gs.score(X_te_fe, y_te):.4f}")`,
    },
    {
      type: "markdown",
      source: `## 🎉 Python ML 실습 트랙 완주!

10강을 모두 마쳤어요. 🎊

### 여러분이 이제 할 수 있는 것
- ✅ **회귀·분류·클러스터링** 세 문제 유형 모두 대응
- ✅ **전처리 파이프라인** (ColumnTransformer + Pipeline) 설계
- ✅ **트리·앙상블·부스팅** 로 실무 정형 데이터 대응
- ✅ **교차검증 + GridSearch** 로 모델 선택 & 튜닝
- ✅ **모델 해석** (permutation_importance) 으로 의사결정 지원
- ✅ **불균형 데이터** 대응 (stratify, class_weight, 임계값 조정)
- ✅ **실전 프로젝트 플로우** — EDA → 전처리 → 모델 비교 → 해석 → 보고

### 🚀 다음에 할 수 있는 것

1. **Kaggle** — 여러분이 배운 것을 실제 대회에서 검증
2. **XGBoost / LightGBM** — sklearn 를 넘어선 프로덕션 부스팅
3. **SHAP** — 개별 예측까지 해석하는 심화 기법
4. **MLOps** — 모델 서빙, 모니터링, 재학습 자동화
5. **딥러닝** (PyTorch, TensorFlow) — 이미지·텍스트·시계열

**AI 강의 트랙 10강 + 데이터 과학 트랙 10강 + ML 실습 트랙 10강** — 이 셋을 모두 마친 여러분은 이미 **입문자 이상** 의 실력을 갖췄습니다. 자신 있게 실전 프로젝트로 나아가 보세요! 🚀`,
    },
    { type: "code", source: `# 자유 실험 영역 — 여러분만의 개선을 시도해 보세요\n` },
  ],
  quiz: {
    title: "미니 프로젝트 종합 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "고객 이탈 데이터처럼 불균형이 있는 분류 문제에서 교차검증 스코어로 적절하지 않은 것은?",
        options: [
          "accuracy",
          "f1",
          "roc_auc",
          "average_precision",
        ],
        correctIndex: 0,
        explanation:
          "불균형 분류에서 accuracy 는 '모두 다수 클래스' 예측만으로도 높아져 쓸모 없어요. F1, AUC-ROC, Average Precision 같은 클래스 균형에 덜 민감한 지표를 씁니다.",
      },
      {
        type: "multiple-choice",
        question:
          "본 프로젝트의 전체 플로우 순서로 가장 적절한 것은?",
        options: [
          "모델 학습 → EDA → 전처리 → 평가",
          "EDA → 분할(stratify) → 전처리(파이프라인) → 모델 비교 → 선택 → 해석 → 보고",
          "전처리 → 모델 → 데이터 수집",
          "예측 → 학습 → 해석",
        ],
        correctIndex: 1,
        explanation:
          "실전 ML 의 표준 순서는 'EDA → 분할 → 전처리 파이프라인 → 여러 모델 비교 → 최종 선택 → 해석 → 비즈니스 보고'. 각 단계가 다음 단계의 근거가 돼요.",
      },
      {
        type: "multiple-choice",
        question:
          "교차검증의 best_score_ 와 테스트 세트 점수가 크게 다르면 어떤 경우를 의심해야 하는가?",
        options: [
          "모델 학습이 완료되지 않았다",
          "데이터 누수(leakage) 또는 훈련·테스트 분포의 차이",
          "sklearn 버그",
          "파이썬 버전 문제",
        ],
        correctIndex: 1,
        explanation:
          "CV 점수가 좋은데 테스트가 나쁘면 leakage(검증 과정에서 미래 정보가 새어 들어감) 혹은 분포 차이(covariate shift) 가 흔한 원인. 실무 ML 의 가장 자주 만나는 함정.",
      },
      {
        type: "multiple-choice",
        question:
          "경영진에게 이탈 예측 결과를 보고할 때 가장 중요한 것은?",
        options: [
          "AUC 수치만 알리기",
          "모델 성능 + 기여 피처 + 권장 임계값 + 실행 가능한 액션까지 연결한 보고",
          "ROC 곡선 이미지만 공유",
          "GridSearch 결과의 모든 파라미터",
        ],
        correctIndex: 1,
        explanation:
          "경영진이 필요한 건 '의사결정' 이에요. 숫자 → 기여 요인 → 권장 임계값 → 실행 액션까지 이어지는 흐름이 갖춰져야 모델이 실제로 쓰입니다.",
      },
    ],
  } satisfies Quiz,
};

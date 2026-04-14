import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson09: Lesson = {
  id: "python-ml-09",
  language: "python",
  track: "ml-practice" as const,
  order: 9,
  title: "모델 해석과 불균형 데이터",
  subtitle: "왜 그렇게 판단했지? + 99:1 같은 편향 상황 다루기",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🔍⚖️ 모델 해석과 불균형 데이터

이번 챕터의 두 가지 축:

### 1️⃣ 모델 해석
"정확도 95%" 로 끝내지 말고 **"왜" 그렇게 판단했는지** 들여다보기.
- \`feature_importances_\` 의 한계
- \`permutation_importance\` — 모델 무관 정석
- ROC 곡선과 AUC

### 2️⃣ 불균형 데이터
**99% 정상 vs 1% 사기** 같은 경우, 단순 정확도는 거짓말.
- \`stratify\` 로 분할 균형 유지
- \`class_weight="balanced"\` 로 손실 보정
- \`classification_report\` 의 precision / recall / F1 다시 보기

> 🎯 "모델을 만들 수 있는 사람" 과 "모델을 **믿을 수 있게** 만드는 사람" 의 차이가 이 챕터.`,
    },
    {
      type: "markdown",
      source: `## 🔍 \`permutation_importance\` — 왜 feature_importances_ 로는 부족한가

\`feature_importances_\` (트리 기반) 의 한계:
- 모델 **구조에 종속적** — 로지스틱/SVM 에는 없음
- **상관된 피처** 가 있으면 서로 공을 나눠 값이 왜곡됨
- 훈련 데이터 기준이라 **테스트 성능과 무관** 할 수 있음

### 대안: Permutation Importance
각 피처 값을 **무작위로 섞었을 때** 모델 성능이 얼마나 떨어지는지 측정 → **어떤 모델이든** 쓸 수 있고 테스트 데이터 기준.`,
    },
    {
      type: "code",
      source: `from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.inspection import permutation_importance
import pandas as pd

data = load_breast_cancer()
X, y = data.data, data.target
feat_names = data.feature_names

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

rf = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1).fit(X_tr, y_tr)
print(f"RandomForest test 정확도: {rf.score(X_te, y_te):.3f}")
print()

# Permutation importance — 테스트 데이터에서 각 피처를 섞어보기
result = permutation_importance(rf, X_te, y_te, n_repeats=10, random_state=42, n_jobs=-1)

imp_df = (pd.DataFrame({
    "feature": feat_names,
    "importance_mean": result.importances_mean,
    "importance_std":  result.importances_std,
}).sort_values("importance_mean", ascending=False).head(10))

print("🏆 상위 10 피처 (permutation, test set 기준):")
mx = imp_df["importance_mean"].max()
for _, r in imp_df.iterrows():
    bar = "█" * int(r["importance_mean"] / mx * 25)
    print(f"  {r['feature']:<25} {r['importance_mean']:.4f} ±{r['importance_std']:.4f}  {bar}")
`,
    },
    {
      type: "markdown",
      source: `> 💡 \`permutation_importance\` 는 **모델 무관** — 선형, 트리, SVM, 심지어 딥러닝 모델에도 동일하게 쓸 수 있어요.
> 상관 피처 영향 완화, 테스트 기준 — 실무 모델 해석의 **1차 표준**.`,
    },
    {
      type: "markdown",
      source: `## 📉 ROC 곡선과 AUC — 임계값 전체를 한눈에

분류 모델은 \`predict_proba\` 로 **확률** 을 뱉어요. 이 확률을 어느 값(임계값) 이상이면 양성으로 볼지 **우리가 정해** 야 합니다.

| 임계값 | 양성 판정 수 | Recall(재현율) | Precision(정밀도) |
|-------|------------|-------------|----------------|
| 0.5 (기본) | 중간 | 중간 | 중간 |
| 0.3 (관대) | 많음 | 높음 ↑ | 낮음 ↓ (오탐 증가) |
| 0.8 (엄격) | 적음 | 낮음 ↓ | 높음 ↑ |

**ROC 곡선** = 모든 임계값에 대해 (FPR, TPR) 을 플롯.
**AUC (Area Under Curve)** = 그 곡선 아래 면적 → 0.5(무작위) ~ 1.0(완벽).`,
    },
    {
      type: "code",
      source: `from sklearn.metrics import roc_auc_score, roc_curve, classification_report
import numpy as np

# 이전 셀의 rf, X_te, y_te 를 계속 사용
y_proba = rf.predict_proba(X_te)[:, 1]

auc = roc_auc_score(y_te, y_proba)
fpr, tpr, thresholds = roc_curve(y_te, y_proba)

print(f"AUC = {auc:.4f}   (1.0 이 완벽, 0.5 는 무작위)")
print()
print("임계값 몇 개 비교:")
print(f"{'threshold':>10} {'FPR':>8} {'TPR(recall)':>12}")

for t in [0.3, 0.5, 0.7, 0.9]:
    idx = np.argmin(np.abs(thresholds - t))
    print(f"{thresholds[idx]:>10.3f} {fpr[idx]:>8.3f} {tpr[idx]:>12.3f}")

# ROC 곡선을 텍스트 바로 그리기
print("\\nROC 곡선 (ASCII):")
print("  TPR  |")
for y_line in range(10, -1, -1):
    line = f"  {y_line/10:.1f}  |"
    for x_line in range(11):
        # (x_line/10, y_line/10) 에 가까운 점이 있으면 *
        x_val = x_line / 10
        y_val = y_line / 10
        hits = ((abs(fpr - x_val) < 0.06) & (abs(tpr - y_val) < 0.06)).any()
        line += "*" if hits else " "
    print(line)
print("       " + "-" * 11)
print("       " + "".join(str(i) for i in range(11)))
print("        FPR (x10)")
`,
    },
    {
      type: "markdown",
      source: `## ⚖️ 불균형 데이터 — 99% 정상 vs 1% 사기

### 문제 상황
\`\`\`
전체 10,000건 중 사기 100건 (1%)
나이브한 "모두 정상이라고 예측" 모델:
  정확도 = 99%  ✅  하지만 사기는 하나도 못 잡음 ❌
\`\`\`

정확도(accuracy)는 **쓸모없는 지표** 입니다. 대신:
- **Recall(재현율)** — 진짜 사기 중 몇 %를 잡았나
- **Precision(정밀도)** — 사기라고 한 것 중 몇 %가 진짜였나
- **F1-score** — 둘의 조화평균
- **AUC-PR** — Precision-Recall 곡선 (불균형에 더 민감)`,
    },
    {
      type: "code",
      source: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import numpy as np

# 불균형 데이터: 98% 정상, 2% 사기
X, y = make_classification(
    n_samples=3000, n_features=10, n_informative=5,
    weights=[0.98, 0.02], random_state=42
)
print(f"클래스 분포: {np.bincount(y)}  (98:2 불균형)")

# ⚠️ stratify 로 클래스 비율을 train/test 에 동일하게!
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# ── 1) 평범한 모델 ──
plain = Pipeline([
    ("sc", StandardScaler()),
    ("lr", LogisticRegression(max_iter=1000)),
])
plain.fit(X_tr, y_tr)

# ── 2) class_weight='balanced' 버전 ──
balanced = Pipeline([
    ("sc", StandardScaler()),
    ("lr", LogisticRegression(max_iter=1000, class_weight="balanced")),
])
balanced.fit(X_tr, y_tr)

for name, model in [("평범한 모델", plain), ("class_weight='balanced'", balanced)]:
    y_pred = model.predict(X_te)
    print(f"\\n=== {name} ===")
    print("Confusion Matrix:")
    print(confusion_matrix(y_te, y_pred))
    print()
    print(classification_report(y_te, y_pred, digits=3,
                                  target_names=["정상", "사기"]))
`,
    },
    {
      type: "markdown",
      source: `> 🔍 주목할 것
> - 평범 모델: 정상 예측은 완벽하지만 **사기 recall 이 낮음** (놓침 많음)
> - balanced: 사기 recall 상승, 대신 정상 precision 약간 하락 (오탐 증가)
> - **어느 쪽을 택할지는 비즈니스 결정** — 놓치면 큰 비용(의료·사기)이면 recall 우선

### 기타 실무 기법

| 기법 | 설명 |
|------|------|
| \`stratify=y\` | train/test 분할 시 클래스 비율 유지 (필수) |
| \`class_weight="balanced"\` | 소수 클래스 샘플에 더 큰 손실 가중치 |
| \`StratifiedKFold\` | 교차검증 때도 클래스 비율 유지 |
| **SMOTE** (imblearn) | 소수 클래스를 합성해서 오버샘플링 |
| **임계값 조정** | \`predict_proba > 0.3\` 같이 낮춰서 recall ↑ |`,
    },
    {
      type: "markdown",
      source: `## 🧭 임계값 조정 실전

\`predict\` 대신 \`predict_proba\` 를 받아 **여러분이 정한 임계값** 으로 분류.`,
    },
    {
      type: "code",
      source: `from sklearn.metrics import precision_recall_fscore_support

y_proba = balanced.predict_proba(X_te)[:, 1]

print(f"{'threshold':>10} {'precision':>10} {'recall':>8} {'f1':>8}")
print("-" * 40)
for t in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]:
    y_pred = (y_proba >= t).astype(int)
    p, r, f1, _ = precision_recall_fscore_support(
        y_te, y_pred, average="binary", zero_division=0
    )
    print(f"{t:>10.2f} {p:>10.3f} {r:>8.3f} {f1:>8.3f}")
`,
    },
    {
      type: "markdown",
      source: `> 🎯 "사기를 최대한 잡고 싶은데 오탐 몇 건은 감수" 라면 → **낮은 임계값**
> "확실한 사기만 알리고 싶은데 놓쳐도 OK" 라면 → **높은 임계값**
>
> 비즈니스 요구사항에 맞춰 **임계값을 움직이는 것** 이 모델 활용의 핵심 skill.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 — 유방암 진단 모델 해석 + 임계값 설정

\`load_breast_cancer\` 데이터(이진 분류: 악성 1 / 양성 0)로:

1. RandomForest (n_estimators=300) 학습
2. permutation_importance 로 상위 5 피처 출력
3. predict_proba 로 받은 확률에 **임계값 0.3 / 0.5 / 0.7** 을 각각 적용해 confusion matrix 출력
4. 만약 이 모델이 실제 병원에서 쓰인다면 **어느 임계값을 권하겠는가?** 한 줄 판단 이유와 함께 print`,
    },
    {
      type: "code",
      source: `from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.inspection import permutation_importance
from sklearn.metrics import confusion_matrix

# 악성이 '1' 인 것에 주의 (양성=0, 악성=1 — 놓치면 치명적)
data = load_breast_cancer()
X, y = data.data, data.target
feat_names = data.feature_names

# 여기에 코드를 작성하세요
`,
      hints: [
        "stratify=y 로 분할",
        "permutation_importance 후 .importances_mean 로 정렬 → 상위 5개",
        "proba = rf.predict_proba(X_te)[:, 1]",
        "for t in [0.3, 0.5, 0.7]: y_pred = (proba >= t).astype(int); print(confusion_matrix(y_te, y_pred))",
        "의료 맥락 → 놓치는 것(FN)이 치명적 → recall 우선 → 낮은 임계값",
      ],
      solution: `from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.inspection import permutation_importance
from sklearn.metrics import confusion_matrix, classification_report
import pandas as pd

data = load_breast_cancer()
X, y = data.data, data.target
feat_names = data.feature_names

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

rf = RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1).fit(X_tr, y_tr)

# 1) permutation importance 상위 5
result = permutation_importance(rf, X_te, y_te, n_repeats=10, random_state=42, n_jobs=-1)
imp = (pd.Series(result.importances_mean, index=feat_names)
         .sort_values(ascending=False).head(5))
print("🏆 상위 5 피처 (permutation, test 기준):")
for name, val in imp.items():
    print(f"   {name:<30} {val:.4f}")

# 2) 임계값 비교
print("\\n임계값별 혼동 행렬 (악성 탐지):")
proba = rf.predict_proba(X_te)[:, 1]

for t in [0.3, 0.5, 0.7]:
    y_pred = (proba >= t).astype(int)
    cm = confusion_matrix(y_te, y_pred)
    tn, fp, fn, tp = cm.ravel()
    print(f"\\n임계값 {t}")
    print(f"  TN(양성→양성) {tn:>3}   FP(양성→악성오탐) {fp:>3}")
    print(f"  FN(악성→양성놓침) {fn:>3}   TP(악성→악성) {tp:>3}")

# 3) 권장
print()
print("🩺 권장: 임계값 0.3")
print("   이유: 의료 진단은 '악성을 놓치는 것(FN)' 이 훨씬 치명적.")
print("   오탐(FP) 몇 건은 추가 검사로 해소 가능하지만, 놓치면 환자 생명 위험.")
print("   따라서 recall 을 최대화하는 낮은 임계값이 적절.")`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 9 완료

- ✅ **\`permutation_importance\`** — 모델 무관, 테스트 기준, 상관 피처에 강건
- ✅ **ROC 곡선 / AUC** — 모든 임계값 성능을 한눈에
- ✅ 불균형 데이터에서 정확도는 쓸모 없음 — Recall / Precision / F1 로
- ✅ \`stratify\` / \`class_weight='balanced'\` / \`StratifiedKFold\`
- ✅ \`predict_proba\` + **임계값 조정** 으로 비즈니스 요구에 맞추기

다음 챕터는 **미니 프로젝트** — 고객 이탈 예측 전체 플로우 (EDA → 전처리 → 여러 모델 → 튜닝 → 해석 → 배포 준비).`,
    },
    { type: "code", source: `# 자유 실험 영역\n` },
  ],
  quiz: {
    title: "챕터 9 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "feature_importances_ 대신 permutation_importance 를 쓰는 이유로 가장 적절한 것은?",
        options: [
          "항상 더 빠르기 때문",
          "모델 종류에 무관하게 쓸 수 있고, 상관 피처 영향이 완화되며 테스트 기준으로 측정 가능",
          "feature_importances_ 는 틀린 값이기 때문",
          "딥러닝에서만 통한다",
        ],
        correctIndex: 1,
        explanation:
          "permutation_importance 는 '이 피처를 섞었을 때 테스트 성능이 얼마나 떨어지는가' 를 직접 측정. 모델 무관하게 쓸 수 있고 상관 피처 문제도 완화됩니다.",
      },
      {
        type: "multiple-choice",
        question:
          "불균형 데이터에서 모델 정확도(accuracy) 가 쓸모 없는 이유는?",
        options: [
          "계산이 오래 걸려서",
          "'모두 다수 클래스' 로 예측해도 정확도가 높아질 수 있어 모델의 실제 능력이 가려지기 때문",
          "sklearn 이 제공하지 않아서",
          "불균형 데이터는 없기 때문",
        ],
        correctIndex: 1,
        explanation:
          "99:1 데이터에서는 '모두 다수 클래스' 라고 예측만 해도 99% 정확도가 나와요. 실제로 소수 클래스를 잡는 능력(recall) 이 전혀 없는데도 수치가 높아 보입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "train_test_split 에서 stratify=y 의 역할은?",
        options: [
          "무작위 순서를 고정한다",
          "train/test 각각에서 클래스 비율이 원본과 동일하게 유지되도록 분할",
          "데이터 크기를 절반으로 줄인다",
          "feature 를 shuffle 한다",
        ],
        correctIndex: 1,
        explanation:
          "stratify 는 계층 추출(Stratified Sampling). 불균형 데이터에서 필수 — 없으면 우연히 test 에 소수 클래스가 없거나 훨씬 적을 수 있어요.",
      },
      {
        type: "multiple-choice",
        question:
          "ROC AUC 가 0.5 라는 것은 무엇을 의미하는가?",
        options: [
          "모델이 완벽하다",
          "모델이 무작위 추측과 다르지 않다",
          "과적합이 심하다",
          "클래스 불균형이 심하다",
        ],
        correctIndex: 1,
        explanation:
          "AUC 1.0 이 완벽, 0.5 가 무작위. 0.5 근처면 모델이 사실상 학습되지 않았다는 뜻. 0.7~0.8 이면 실용적, 0.9+ 면 매우 좋은 성능.",
      },
    ],
  } satisfies Quiz,
};

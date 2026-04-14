import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson07: Lesson = {
  id: "python-ml-07",
  language: "python",
  track: "ml-practice" as const,
  order: 7,
  title: "트리와 앙상블 — 실무 1등 알고리즘",
  subtitle: "DecisionTree부터 RandomForest까지, 설명하기 쉬우면서 강력한",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🌳 트리와 앙상블

실무에서 **가장 많이 쓰이는** ML 알고리즘 계열이 바로 **트리 기반** 입니다. 이유:
- 📐 **전처리 부담 최소** — 스케일링·인코딩 크게 신경 안 써도 됨
- 🧠 **설명 가능** — "왜 그렇게 판단했지?" 를 루트에서 잎까지 추적 가능
- 💪 **앙상블** 로 묶으면 대부분의 실무 정형 데이터 문제에서 **상위권 성능**

이번 챕터에서 배울 것:
- **DecisionTree** — 스무고개 방식 예측
- \`plot_tree\` / \`export_text\` 로 트리 시각화
- **과적합** 과 \`max_depth\` / \`min_samples_split\` 제어
- **RandomForest** — 트리 수백 그루의 집단 지성
- **feature_importances_** 로 중요 피처 파악`,
    },
    {
      type: "markdown",
      source: `## 🌳 Decision Tree — 스무고개 게임

"나이 > 30 이면 왼쪽, 아니면 오른쪽" 같은 **2진 질문** 을 반복해서 분류.`,
    },
    {
      type: "code",
      source: `from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

iris = load_iris()
X, y = iris.data, iris.target
feat_names = iris.feature_names
class_names = iris.target_names.tolist()

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

# 트리 학습 — max_depth 로 과적합 방지
tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X_tr, y_tr)

print(f"훈련 정확도: {tree.score(X_tr, y_tr):.3f}")
print(f"테스트 정확도: {tree.score(X_te, y_te):.3f}")
print()
print("트리 구조 (텍스트):")
print(export_text(tree, feature_names=feat_names))
`,
    },
    {
      type: "markdown",
      source: `> 💡 \`export_text\` 는 그래프 없이도 **트리의 판단 로직** 을 그대로 보여줘요.
> 각 분기는 "어느 피처의 어느 값 기준으로 갈라지는가" 를 그대로 표시합니다.

### 주요 하이퍼파라미터

| 파라미터 | 역할 |
|---------|------|
| \`max_depth\` | 트리의 최대 깊이 (크면 과적합, 작으면 과소적합) |
| \`min_samples_split\` | 노드를 분할하려면 최소 몇 개 샘플이 있어야 하는가 |
| \`min_samples_leaf\` | 잎 노드에 최소 몇 개 남아야 하는가 |
| \`criterion\` | 분할 기준 (\`"gini"\` / \`"entropy"\`) |`,
    },
    {
      type: "markdown",
      source: `## ⚠️ 과적합 — 트리가 가장 잘 걸리는 함정`,
    },
    {
      type: "code",
      source: `# max_depth 를 제한 없이 두면 과적합 발생
tree_deep = DecisionTreeClassifier(random_state=42)          # max_depth=None (무제한)
tree_deep.fit(X_tr, y_tr)
print("── max_depth=None (과적합 예시) ──")
print(f"훈련 정확도: {tree_deep.score(X_tr, y_tr):.3f}")
print(f"테스트 정확도: {tree_deep.score(X_te, y_te):.3f}")
print()

print("── max_depth 별 성능 ──")
print(f"{'max_depth':>10} {'train':>8} {'test':>8}")
for d in [1, 2, 3, 5, 10, None]:
    t = DecisionTreeClassifier(max_depth=d, random_state=42).fit(X_tr, y_tr)
    tr_acc = t.score(X_tr, y_tr)
    te_acc = t.score(X_te, y_te)
    label = "None" if d is None else str(d)
    print(f"{label:>10} {tr_acc:>8.3f} {te_acc:>8.3f}")
`,
    },
    {
      type: "markdown",
      source: `> 🧠 관찰: 훈련 정확도는 깊이 클수록 ↑, 테스트는 **특정 지점 이후 ↓**.
> "훈련 성능 ≠ 실전 성능" 의 전형적인 증상이 과적합이에요.`,
    },
    {
      type: "markdown",
      source: `## 🌲 RandomForest — 트리 수백 그루의 집단 지성

**아이디어**: 트리 하나는 흔들리지만, **여러 트리** 를 살짝 다르게 학습시켜 **투표** 로 결정하면 안정적.

\`\`\`
[데이터] → 부트스트랩 샘플링 (여러 버전)
            ↓
  [트리1] [트리2] [트리3] ... [트리100]   ← 각자 다른 데이터·피처로
            ↓
       투표 (다수결)  →  최종 예측
\`\`\`

이게 **배깅(Bagging)** 의 대표 기법. 이 플랫폼의 분류 문제 대부분은 RandomForest 로도 충분해요.`,
    },
    {
      type: "code",
      source: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=200,       # 트리 200그루
    max_depth=5,
    random_state=42,
    n_jobs=-1,              # 병렬
)
rf.fit(X_tr, y_tr)

print(f"RandomForest 훈련 정확도: {rf.score(X_tr, y_tr):.3f}")
print(f"RandomForest 테스트 정확도: {rf.score(X_te, y_te):.3f}")
`,
    },
    {
      type: "markdown",
      source: `### 단일 트리 vs 랜덤포레스트

| 항목 | Decision Tree | Random Forest |
|------|--------------|--------------|
| 성능(대부분) | 🟡 중간 | 🟢 높음 |
| 해석성 | 🟢 매우 쉬움 (트리 하나 보면 됨) | 🟡 개별 트리는 못 봄, 중요도로 대체 |
| 과적합 경향 | 🔴 강함 | 🟢 약함 (투표로 완화) |
| 학습 속도 | 🟢 빠름 | 🟡 중간 (병렬로 해결) |

> 🎯 실무 프로젝트 시작할 때 **베이스라인 모델** 로 RandomForest 띄우는 게 안전한 선택.`,
    },
    {
      type: "markdown",
      source: `## 🔍 Feature Importance — 어느 피처가 중요한가?`,
    },
    {
      type: "code",
      source: `import pandas as pd

importance = pd.Series(rf.feature_importances_, index=feat_names).sort_values(ascending=False)
print("🔍 피처 중요도 (RandomForest 기준):")
print()

mx = importance.max()
for feat, imp in importance.items():
    bar = "█" * int(imp / mx * 30)
    print(f"  {feat:<22} {imp:.3f}  {bar}")
`,
    },
    {
      type: "markdown",
      source: `> 🔑 \`feature_importances_\` 는 "이 피처가 분기에 얼마나 기여했나" 를 누적한 값.
> **도메인 지식 확인** ("중요한 피처가 정말 모델에서도 중요한가?") 과 **피처 선택** 에 자주 씁니다.`,
    },
    {
      type: "markdown",
      source: `## 🆚 트리 외 모델 빠른 비교`,
    },
    {
      type: "code",
      source: `from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# KNN/SVM/Logistic 은 스케일링 필요 — 파이프라인으로
def make_scaled(model):
    return Pipeline([("sc", StandardScaler()), ("m", model)])

candidates = {
    "로지스틱 회귀":    make_scaled(LogisticRegression(max_iter=1000)),
    "KNN (k=5)":        make_scaled(KNeighborsClassifier(n_neighbors=5)),
    "SVM (rbf)":        make_scaled(SVC()),
    "Decision Tree (d=3)": DecisionTreeClassifier(max_depth=3, random_state=42),
    "Random Forest":    RandomForestClassifier(n_estimators=200, max_depth=5, random_state=42, n_jobs=-1),
}

print(f"{'모델':<22} {'train':>8} {'test':>8}")
print("-" * 42)
for name, model in candidates.items():
    model.fit(X_tr, y_tr)
    print(f"{name:<22} {model.score(X_tr, y_tr):>8.3f} {model.score(X_te, y_te):>8.3f}")
`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 — 와인 데이터로 트리 앙상블 비교

\`load_wine()\` (샘플 178개, 피처 13, 3클래스 분류) 로 다음을 수행:

1. 70/30 split, \`stratify=y\`
2. 단일 DecisionTree (max_depth=None) 과 (max_depth=5) 두 모델 학습 → 훈련·테스트 정확도 비교
3. RandomForest (n_estimators=300, max_depth=8) 학습 → 정확도 + 상위 5개 피처 중요도 출력`,
    },
    {
      type: "code",
      source: `from sklearn.datasets import load_wine
import pandas as pd

data = load_wine()
X, y = data.data, data.target
feat_names = data.feature_names

# 여기에 코드를 작성하세요
`,
      hints: [
        "X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)",
        "두 트리 비교: DecisionTreeClassifier(max_depth=None) 와 (max_depth=5)",
        "RandomForest 학습 후 rf.feature_importances_",
        "pd.Series(rf.feature_importances_, index=feat_names).sort_values(ascending=False).head(5)",
      ],
      solution: `from sklearn.datasets import load_wine
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pandas as pd

data = load_wine()
X, y = data.data, data.target
feat_names = data.feature_names

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

print("── 단일 트리 비교 ──")
for d in [None, 5]:
    t = DecisionTreeClassifier(max_depth=d, random_state=42).fit(X_tr, y_tr)
    label = "None(과적합?)" if d is None else f"max_depth={d}"
    print(f"  {label:<20} train={t.score(X_tr, y_tr):.3f}  test={t.score(X_te, y_te):.3f}")

print()
rf = RandomForestClassifier(n_estimators=300, max_depth=8, random_state=42, n_jobs=-1)
rf.fit(X_tr, y_tr)
print(f"── RandomForest ──")
print(f"  train={rf.score(X_tr, y_tr):.3f}  test={rf.score(X_te, y_te):.3f}")

print()
imp = pd.Series(rf.feature_importances_, index=feat_names).sort_values(ascending=False).head(5)
print("🏆 상위 5 피처:")
for name, val in imp.items():
    bar = "█" * int(val * 100)
    print(f"  {name:<25} {val:.3f}  {bar}")`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 7 완료

- ✅ \`DecisionTreeClassifier\` / \`export_text\` — 해석 가능한 2진 분할 모델
- ✅ \`max_depth\` 로 과적합 제어, 훈련/테스트 괴리 관찰
- ✅ \`RandomForestClassifier\` — 배깅 기반 안정적 베이스라인
- ✅ \`feature_importances_\` 로 중요 피처 확인
- ✅ 모델 집합 비교 실습

다음 챕터는 **그레이디언트 부스팅과 정규화** — Kaggle 1등 알고리즘의 원리와 회귀의 과적합 방어.`,
    },
    { type: "code", source: `# 자유 실험 영역\n` },
  ],
  quiz: {
    title: "챕터 7 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "DecisionTree 의 과적합을 가장 효과적으로 억제하는 하이퍼파라미터 조합은?",
        options: [
          "max_depth 증가 + min_samples_split 감소",
          "max_depth 제한 + min_samples_leaf 증가",
          "criterion 을 'entropy' 로만 바꾸기",
          "random_state 바꾸기",
        ],
        correctIndex: 1,
        explanation:
          "깊이를 제한하고 잎의 최소 샘플 수를 늘리면 트리가 훈련 데이터의 세부 노이즈를 덜 외웁니다. 두 파라미터가 과적합 억제의 핵심.",
      },
      {
        type: "multiple-choice",
        question:
          "RandomForest 가 단일 DecisionTree 보다 안정적인 근본 이유는?",
        options: [
          "트리마다 다른 하이퍼파라미터를 쓴다",
          "부트스트랩 샘플 + 피처 무작위로 서로 다른 트리를 만들어 투표하는 앙상블 구조",
          "트리 학습 시간이 짧다",
          "결측값 처리를 자동으로 한다",
        ],
        correctIndex: 1,
        explanation:
          "배깅(Bagging) 의 핵심은 '약한 학습자 여러 개 → 투표'. 부트스트랩 샘플링 + 분기 시 피처 무작위 선택으로 트리들이 독립성을 갖고, 과적합이 완화됩니다.",
      },
      {
        type: "multiple-choice",
        question:
          "feature_importances_ 의 값에 대한 설명으로 올바른 것은?",
        options: [
          "각 피처의 p-value 다",
          "각 피처가 분기에 기여한 (지니/엔트로피) 감소량을 정규화한 값",
          "피처와 타깃의 상관계수",
          "피처 값의 표준편차",
        ],
        correctIndex: 1,
        explanation:
          "트리 기반 모델의 feature_importances_ 는 분기 과정에서 해당 피처가 불순도를 얼마나 줄였는지를 합산한 뒤 정규화한 값입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "스케일링이 필요 없는 모델은?",
        options: [
          "KNeighborsClassifier",
          "LogisticRegression",
          "RandomForestClassifier",
          "SVC (rbf)",
        ],
        correctIndex: 2,
        explanation:
          "트리 기반 모델(Decision Tree, Random Forest, Gradient Boosting)은 각 피처의 상대적 임계값만 사용하므로 스케일링에 무관합니다.",
      },
    ],
  } satisfies Quiz,
};

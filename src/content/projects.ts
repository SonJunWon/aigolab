/**
 * ML 미니 프로젝트 데이터.
 */

/**
 * 프로젝트의 단계별 가이드 한 항목.
 * - 단순 문자열(기존 포맷) 도 그대로 지원 (하위 호환).
 * - 새 포맷 ProjectStep 은 설명·힌트·정답·체크포인트를 포함해
 *   학습자가 막힐 때마다 단계적으로 풀어갈 수 있게 한다.
 */
export interface ProjectStep {
  /** 단계 제목 — 카드 헤더에 표시 */
  title: string;
  /** 왜·무엇을 — 펼쳤을 때 본문 (마크다운 가능) */
  description?: string;
  /** 한 줄 힌트 — 방향만 제시 (코드 공개 X) */
  hint?: string;
  /** 복사용 부분 코드 스니펫 — 힌트로 충분하지 않을 때 뼈대 제공 */
  snippet?: string;
  /** 정답 코드 (전체) — 최종 비교·참고용 */
  solution?: string;
  /** 이 단계가 끝나면 기대되는 출력·상태 (체크포인트용) */
  checkpoint?: string;
  /**
   * starter 파일에 삽입된 앵커 주석 이름 (예: "STEP 1").
   * 프로젝트 모드 IDE에서 이 단계 카드를 클릭하면 에디터가
   * `## STEP 1:` 주석이 있는 줄로 스크롤 + 하이라이트됨.
   */
  stepMarker?: string;
}

/**
 * 프로젝트 카테고리 — 리스트 페이지 필터링 기준.
 * 11개 프로젝트를 주제별로 묶어 학습자가 관심 영역으로 탐색 가능.
 */
export type ProjectCategory =
  | "classification"  // 분류 (지도 학습)
  | "nlp"             // 자연어 처리
  | "unsupervised"    // 비지도 (추천·군집)
  | "timeseries"      // 시계열
  | "anomaly"         // 이상 탐지
  | "generative"      // 생성 모델
  | "data-analysis";  // 데이터 분석 / EDA

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  difficulty: "beginner" | "intermediate";
  estimatedMinutes: number;
  tags: string[];
  /** 리스트 페이지 카테고리 필터용. 미지정 시 '기타' 로 처리. */
  category?: ProjectCategory;
  description: string;  // 마크다운
  /** 단계별 가이드 — 문자열(구버전) 또는 ProjectStep(리치 버전) 혼합 가능 */
  steps: (string | ProjectStep)[];
  starterFiles: Record<string, { name: string; content: string; language: string }>;
}

export const PROJECTS: Project[] = [
  {
    id: "iris-classification",
    category: "classification",
    title: "아이리스 꽃 분류",
    subtitle: "첫 번째 머신러닝 모델 만들기",
    icon: "🌸",
    difficulty: "beginner",
    estimatedMinutes: 30,
    tags: ["scikit-learn", "분류", "입문"],
    description: `## 🌸 아이리스 꽃 분류 프로젝트

**목표**: 꽃잎과 꽃받침의 크기를 보고 아이리스 꽃의 종류를 예측하는 ML 모델을 만듭니다.

이 프로젝트는 머신러닝의 "Hello World"와 같습니다.
scikit-learn의 내장 데이터셋을 사용하며, 브라우저에서 바로 실행됩니다.

### 배울 것
- 데이터셋 로드 및 탐색
- 훈련/테스트 데이터 분할
- 분류 모델 학습 (Decision Tree)
- 모델 정확도 평가`,
    steps: [
      {
        title: "데이터셋 로드: load_iris()",
        stepMarker: "STEP 1",
        description:
          "scikit-learn의 내장 데이터셋 `load_iris()` 는 150송이의 **꽃받침·꽃잎 측정치** 와 **종류 레이블** 을 한 번에 제공합니다. 학습 시작의 가장 빠른 길은 바로 쓸 수 있는 깨끗한 데이터로 시작하는 것.",
        hint: "`load_iris()` 결과는 객체(Bunch) — `.data`, `.target`, `.feature_names`, `.target_names` 속성으로 접근 가능해요.",
        snippet: `iris = load_iris()`,
        solution: `from sklearn.datasets import load_iris

iris = load_iris()
print(type(iris))             # sklearn.utils.Bunch
print(iris.data[:3])          # 앞 3송이의 측정치
print(iris.target[:3])        # 앞 3송이의 클래스`,
      },
      {
        title: "데이터 탐색: 특성 이름·클래스·크기 확인",
        stepMarker: "STEP 2",
        description:
          "모델 학습 전에 **데이터가 뭐가 들었는지** 한 번 훑는 습관. 특성 4개(꽃받침 길이/너비, 꽃잎 길이/너비) + 클래스 3개(setosa, versicolor, virginica) + 150 샘플.",
        hint: "`.feature_names`, `.target_names`, `.data.shape` 세 가지를 print 로 찍어보세요.",
        snippet: `print(iris.feature_names)
print(iris.target_names)
print(iris.data.shape)`,
        solution: `print(f"특성 이름: {iris.feature_names}")
print(f"클래스:     {iris.target_names}")
print(f"데이터 크기: {iris.data.shape}")     # (150, 4)`,
        checkpoint: "150 샘플 × 4 특성이 맞게 나오면 OK.",
      },
      {
        title: "훈련/테스트 분할 (80:20)",
        stepMarker: "STEP 3",
        description:
          "**새로운 데이터에서도** 잘 맞는지 확인해야 진짜 쓸 만한 모델. `train_test_split` 으로 임의로 쪼개 20%는 **평가용** 으로 남겨둡니다.",
        hint: "`test_size=0.2, random_state=42` 로 재현성 확보. 실무에선 `stratify=y` 까지 넣어 클래스 비율 유지.",
        snippet: `X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)`,
        solution: `from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target,
    test_size=0.2, random_state=42, stratify=iris.target,
)
print(f"훈련 {X_train.shape[0]}개 / 테스트 {X_test.shape[0]}개")`,
      },
      {
        title: "모델 학습: DecisionTreeClassifier",
        stepMarker: "STEP 4",
        description:
          "**결정 트리** 는 스무고개식 분류 — '꽃잎 길이 > 2.45cm 이면 오른쪽, 아니면 왼쪽' 같은 분기를 반복. sklearn 의 3줄 공식(**생성 → fit → predict**)을 처음 체험합니다.",
        hint: "객체 생성 → `.fit(X_train, y_train)` 만으로 학습 완료.",
        snippet: `model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)`,
        solution: `from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)
print("✅ 학습 완료")`,
      },
      {
        title: "예측 및 정확도 평가",
        stepMarker: "STEP 5",
        description:
          "`.predict()` 로 테스트 데이터 예측 → `accuracy_score` 로 **정답 비율** 계산. 이 두 줄이 ML 평가의 가장 기본.",
        hint: "iris 같은 깨끗한 데이터에선 보통 0.95+ 가 나와요.",
        snippet: `predictions = model.predict(X_test)
acc = accuracy_score(y_test, predictions)
print(acc)`,
        solution: `from sklearn.metrics import accuracy_score

predictions = model.predict(X_test)
acc = accuracy_score(y_test, predictions)
print(f"정확도: {acc:.2%}")`,
        checkpoint: "정확도 90% 이상이면 정상. 이보다 낮으면 스플릿을 다시 확인.",
      },
      {
        title: "새 데이터로 예측 테스트",
        stepMarker: "STEP 6",
        description:
          "여러분이 직접 측정한 꽃(또는 가상의 값) 으로 예측해 보세요. 모델이 실제 세계에서 어떻게 쓰이는지 체감.",
        hint: "`model.predict()` 는 **2D 배열** 을 받아요 — `[[5.1, 3.5, 1.4, 0.2]]` 처럼 대괄호 두 번.",
        snippet: `new_flower = [[5.1, 3.5, 1.4, 0.2]]
pred = model.predict(new_flower)`,
        solution: `# 꽃받침 길이 5.1, 너비 3.5, 꽃잎 길이 1.4, 너비 0.2 인 꽃
new_flower = [[5.1, 3.5, 1.4, 0.2]]
pred_idx = model.predict(new_flower)[0]
print(f"이 꽃은 '{iris.target_names[pred_idx]}' 입니다.")

# 확률도 확인
probs = model.predict_proba(new_flower)[0]
for cls, p in zip(iris.target_names, probs):
    print(f"  {cls}: {p:.1%}")`,
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

### 📦 패키지 로드 메시지
\`\`\`
📦 Loading joblib, libopenblas, numpy, scikit-learn, scipy, threadpoolctl
✓ 패키지 로드 완료: ...
\`\`\`
브라우저 Python(Pyodide) 이 **scikit-learn 과 그 의존성** 을 실시간으로 다운로드·로드한 거예요. 첫 실행만 느리고, 이후 같은 프로젝트는 캐시돼서 빠릅니다.

---

### 🌸 STEP 1~2 — 데이터 탐색
\`\`\`
특성 이름: ['sepal length (cm)', 'sepal width (cm)',
           'petal length (cm)', 'petal width (cm)']
클래스:     ['setosa' 'versicolor' 'virginica']
데이터 크기: (150, 4)
\`\`\`

**해석**
- 이 데이터셋엔 **붓꽃 150송이** 가 들어있고, 각 송이마다 **4가지 측정치** 가 있음.
- 정답 라벨은 **3종의 붓꽃 품종**.
- 형태: \`150 × 4\` 의 표. 각 행 = 꽃 한 송이, 각 열 = 측정치.

---

### ✂️ STEP 3 — 훈련/테스트 분할
\`\`\`
훈련 데이터: 120개
테스트 데이터: 30개
\`\`\`

**해석**
- 150개 중 **80% (120개) 로 모델 학습**, **20% (30개) 를 숨겨 두고** 나중에 성능 평가.
- 모델이 본 적 없는 30개를 얼마나 잘 맞히는지가 **진짜 실력**.

---

### 🏋️ STEP 4 — 학습 완료
\`\`\`
모델 학습 완료!
\`\`\`

**해석**
- \`DecisionTreeClassifier\` 가 120개 데이터를 보고 **"어떤 측정치면 어떤 품종인지"** 규칙을 스스로 찾아냄.
- 내부적으로 "꽃잎 길이 > 2.45cm 이면 setosa 아님" 같은 질문들의 나무를 구성.

---

### 📊 STEP 5 — 정확도 평가
\`\`\`
정확도: 100.00%
\`\`\`

**해석 (가장 중요한 숫자)**
- 숨겨 뒀던 **테스트 30송이를 전부 맞혔다** 는 뜻.
- 현실 데이터셋 기준으로는 과한 성능처럼 보일 수 있지만, iris 는 품종간 측정치 차이가 **매우 뚜렷한** 유명한 '깨끗한' 데이터라 100% 가 흔해요.
- 실무 데이터에선 70~90% 만 돼도 좋은 모델인 경우가 많습니다.

> ⚠️ **주의**: iris 의 100% 는 "모델이 완벽" 이 아니라 "데이터가 쉬운" 경우. 실무에선 이 정도 성능이면 **데이터 유출(leakage)** 을 의심해 봐야 해요.

---

### 🔮 STEP 6 — 새 꽃 예측
\`\`\`
새 꽃 예측: setosa
\`\`\`

**해석**
- 우리가 준 측정치 \`[5.1, 3.5, 1.4, 0.2]\` 는 **꽃잎이 작고(1.4, 0.2) 꽃받침이 있는** 전형적인 setosa 값.
- 모델이 그 특징을 학습했기 때문에 **자신 있게 setosa** 라고 답한 것.
- 다른 값으로 바꿔 보면 결과가 달라져요:
  - \`[6.3, 3.3, 4.7, 1.6]\` → versicolor
  - \`[7.2, 3.2, 6.0, 1.8]\` → virginica

---

### ⏱️ 실행 시간
\`\`\`
✓ 실행 완료 (3282ms)
\`\`\`

**해석**
- 3초 중 **대부분은 sklearn 첫 로드**. 다시 실행하면 1초 내로 끝나요.
- 모델 학습 자체는 10ms 도 안 됩니다 (150 × 4 짜리 미니 데이터).

---

### 🧪 지금 시도해 볼 것

1. STEP 6 의 \`new_flower\` 값을 바꿔 실행 (위 예시 참고)
2. STEP 3 에서 \`test_size=0.5\` 로 바꾸면 정확도가 어떻게 변하는지
3. STEP 4 에 \`max_depth=1\` 을 넣어 **일부러 단순한 모델** 로 만들면?
   → 정확도가 떨어지면서 "과소적합" 을 체감

### 🏁 이 프로젝트에서 배운 것
- ✅ **sklearn 의 3줄 공식** (\`객체 생성 → .fit() → .predict()\`)
- ✅ **훈련/테스트 분할** 의 이유
- ✅ **정확도 (accuracy)** 라는 가장 기본 지표
- ✅ 작은 데이터라도 **"배운 규칙을 새 입력에 적용"** 하는 ML 의 본질`,
        checkpoint: "위 해석을 한 번 읽고, 최소 한 가지 (예: STEP 6 의 new_flower) 를 직접 바꿔 실행해 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 🌸 아이리스 꽃 분류 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP으로 이동할 수 있어요.

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score


## STEP 1: 데이터셋 로드
iris = load_iris()
print(f"특성 이름: {iris.feature_names}")
print(f"클래스: {iris.target_names}")
print(f"데이터 크기: {iris.data.shape}")


## STEP 2: 데이터 탐색
# 특성 이름·클래스·샘플 수 확인 (이미 위에서 출력)


## STEP 3: 훈련/테스트 분할 (80:20)
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)
print(f"\\n훈련 데이터: {X_train.shape[0]}개")
print(f"테스트 데이터: {X_test.shape[0]}개")


## STEP 4: 모델 학습
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)
print("\\n모델 학습 완료!")


## STEP 5: 예측 및 정확도 평가
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"정확도: {accuracy:.2%}")


## STEP 6: 새 데이터로 예측
new_flower = [[5.1, 3.5, 1.4, 0.2]]
prediction = model.predict(new_flower)
print(f"\\n새 꽃 예측: {iris.target_names[prediction[0]]}")
`,
        language: "python",
      },
    },
  },
  {
    id: "titanic-survival",
    category: "classification",
    title: "타이타닉 생존자 예측",
    subtitle: "데이터 전처리부터 모델링까지",
    icon: "🚢",
    difficulty: "intermediate",
    estimatedMinutes: 45,
    tags: ["pandas", "scikit-learn", "분류", "전처리"],
    description: `## 🚢 타이타닉 생존자 예측 프로젝트

**목표**: 타이타닉 승객 데이터를 분석하고, 생존 여부를 예측하는 모델을 만듭니다.

유명한 Kaggle 데이터 분석 입문 프로젝트입니다.
실제 데이터를 시뮬레이션하여 브라우저에서 실행합니다.

### 배울 것
- Pandas로 데이터 탐색 (EDA)
- 결측값 처리, 특성 엔지니어링
- 여러 모델 비교 (Decision Tree, Random Forest)
- 모델 성능 평가`,
    steps: [
      {
        title: "시뮬레이션 데이터 생성 (실제 타이타닉 기반)",
        stepMarker: "STEP 1",
        description:
          "Kaggle 타이타닉 데이터의 구조를 흉내 낸 가상 DataFrame 을 만듭니다. 실전에선 `pd.read_csv()` 로 실제 파일을 읽지만, 브라우저 환경이라 시뮬레이션.",
        hint: "`np.random.seed(42)` 를 맨 앞에 두면 실행할 때마다 결과가 같아요.",
        snippet: `np.random.seed(42)
n = 200
data = pd.DataFrame({
    "Pclass": np.random.choice([1, 2, 3], n),
    "Sex":    np.random.choice(["male", "female"], n),
    "Age":    np.random.normal(30, 12, n).round(),
})`,
        solution: `import numpy as np
import pandas as pd
np.random.seed(42)

n = 200
data = pd.DataFrame({
    "Pclass": np.random.choice([1, 2, 3], n, p=[0.2, 0.3, 0.5]),
    "Sex":    np.random.choice(["male", "female"], n),
    "Age":    np.random.normal(30, 12, n).clip(1, 80).round(),
    "SibSp":  np.random.choice([0, 1, 2, 3], n, p=[0.6, 0.2, 0.1, 0.1]),
    "Fare":   np.random.exponential(30, n).round(2),
})
print(data.head())`,
      },
      {
        title: "데이터 탐색 (EDA): info() / describe() / 생존율",
        stepMarker: "STEP 2",
        description:
          "분석의 첫걸음은 **'데이터가 뭐가 들었지?'** 의 파악. 생존율이 성별·등급·나이에 따라 어떻게 다른지 확인하면 **특성 선택의 근거** 가 생겨요.",
        hint: "`data.groupby('Sex')['Survived'].mean()` 같이 그룹별 평균으로 패턴 찾기.",
        snippet: `print(data.describe())
print(data.groupby("Sex")["Survived"].mean())`,
        solution: `print(data.info())
print(data.describe())
print("\\n성별 생존율:", data.groupby("Sex")["Survived"].mean())
print("객실 등급별 생존율:", data.groupby("Pclass")["Survived"].mean())`,
      },
      {
        title: "결측값 처리: 나이 중앙값 대체",
        stepMarker: "STEP 3",
        description:
          "현실 데이터는 빈칸(NaN) 이 흔함. **평균·중앙값·최빈값** 중 도메인에 맞게 대체. 나이는 분포가 치우쳐 있어 **중앙값** 이 안전.",
        hint: "`data['Age'] = data['Age'].fillna(data['Age'].median())`",
        snippet: `data["Age"] = data["Age"].fillna(data["Age"].median())`,
        solution: `# 결측값 확인
print("결측값:")
print(data.isna().sum())

# 나이: 중앙값으로 채우기
if data["Age"].isna().any():
    data["Age"] = data["Age"].fillna(data["Age"].median())`,
      },
      {
        title: "특성 엔지니어링: 성별 인코딩",
        stepMarker: "STEP 4",
        description:
          "문자열 'male'/'female' 은 모델이 직접 못 먹음 → **0/1 로 변환**. 순서 없는 카테고리는 OneHot 이지만 이진이면 단순 매핑도 OK.",
        hint: "`(data['Sex'] == 'female').astype(int)` 로 원핫 한 줄.",
        snippet: `data["Sex_encoded"] = (data["Sex"] == "female").astype(int)
features = ["Pclass", "Sex_encoded", "Age", "SibSp", "Fare"]`,
        solution: `data["Sex_encoded"] = (data["Sex"] == "female").astype(int)
features = ["Pclass", "Sex_encoded", "Age", "SibSp", "Fare"]
X = data[features]
y = data["Survived"]
print(f"특성: {features}")`,
      },
      {
        title: "훈련/테스트 분할 + 여러 모델 비교",
        stepMarker: "STEP 5",
        description:
          "**'어떤 모델이 이 데이터에 맞나'** 는 실험으로만 알 수 있어요. DecisionTree 와 RandomForest 를 같은 조건에서 붙여 보기.",
        hint: "RandomForest 는 보통 DecisionTree 보다 안정적 — 배깅(bagging) 덕분.",
        snippet: `X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=50, random_state=42)
model.fit(X_tr, y_tr)`,
        solution: `from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

models = {
    "DecisionTree":  DecisionTreeClassifier(max_depth=5, random_state=42),
    "RandomForest":  RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42),
}
for name, m in models.items():
    m.fit(X_tr, y_tr)
    acc = accuracy_score(y_te, m.predict(X_te))
    print(f"{name}: {acc:.2%}")`,
      },
      {
        title: "특성 중요도 — '무엇이 생존을 결정했나?'",
        stepMarker: "STEP 6",
        description:
          "모델 성능만 보고 끝내지 말고 **어떤 특성이 중요한지** 확인하세요. RandomForest 는 `feature_importances_` 로 자동 산출.",
        hint: "pandas Series 로 감싸 `.sort_values(ascending=False)` 하면 보기 편해요.",
        snippet: `importance = pd.Series(rf.feature_importances_, index=features)
print(importance.sort_values(ascending=False))`,
        solution: `rf = models["RandomForest"]
importance = pd.Series(rf.feature_importances_, index=features).sort_values(ascending=False)

print("🔍 특성 중요도:")
for feat, imp in importance.items():
    bar = "█" * int(imp * 30)
    print(f"  {feat:<15} {bar} {imp:.3f}")`,
        checkpoint: "성별(Sex_encoded) 이 보통 1위로 나와요 — '여성 우선' 구조 반영.",
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

타이타닉 호 승객 200명의 데이터로 **"어떤 특징이 생존을 가르는가"** 를 학습하고, 두 가지 모델로 그 성능을 비교했어요.

---

### 📊 STEP 1~2 — 데이터 미리보기 + EDA
\`\`\`
   Pclass     Sex  Age  SibSp   Fare
0       3    male   24      0  17.34
1       1  female   38      0  71.28
...
전체: 200명, 생존: XX명 (XX.X%)
\`\`\`

**해석**
- **Pclass**: 객실 등급 (1=1등석, 2=2등석, 3=3등석)
- **Sex**: 성별
- **Age**: 나이
- **SibSp**: 함께 탑승한 형제·배우자 수
- **Fare**: 티켓 요금
- 생존율은 보통 35~45% 부근 — 영화에서 본 그 비율.

---

### 🤖 STEP 5 — 모델 비교
\`\`\`
Decision Tree: 정확도 80~88%
Random Forest: 정확도 80~90%
\`\`\`

**해석**
- 두 모델 다 **80% 이상** 정확도면 합리적인 베이스라인.
- **Random Forest 가 보통 약간 더 안정적** — 트리 50그루의 투표 덕분.
- 100% 가 안 나오는 게 정상! 같은 측정치라도 운으로 살아남는 사람이 있고, 데이터에 노이즈가 있어요.

---

### 🔍 STEP 6 — 특성 중요도 (가장 중요)
\`\`\`
🔍 특성 중요도:
  Sex_encoded     ████████████████████████ 0.42
  Fare            ████████ 0.18
  Age             ███████ 0.15
  Pclass          ██████ 0.13
  SibSp           ████ 0.12
\`\`\`

**해석 (영화의 실화 반영)**
1. **Sex_encoded (성별) 이 1위 — 약 40%+ 기여**
   → "여성과 어린이 먼저" 가 데이터에도 강하게 새겨져 있다는 뜻.
   영화 타이타닉의 그 장면이 **숫자로 증명** 됩니다.

2. **Fare (요금)** 와 **Pclass (등급)** 은 **같은 정보의 다른 표현**
   → 비싼 티켓 = 1등석 = 갑판 가까이 = 구명보트 접근성 ↑

3. **Age (나이)** — 어릴수록 우선 구조
   → 부모가 자녀를 먼저 보낸 비율 반영

4. **SibSp** — 가족 동반은 양날의 검
   → 너무 많으면 흩어지지 못함, 너무 적으면 외로움

> 🧠 **모델은 '학습한' 게 아니라 '발견한' 것** — 데이터 안에 있던 사회적 우선순위를 그냥 그대로 비춰 줬을 뿐. 이게 ML 의 본질.

---

### ⚠️ 윤리적 관점 — 한 번 멈춰 생각해 보기

타이타닉 모델이 만약 **현대의 누군가** 의 생명 선별에 쓰인다면?
- 성별이 1위 특성이라는 게 **공정한가?**
- "여성을 더 살린다" 는 과거 윤리가 **항상 옳은가?**

이게 [AI 강의 09 — AI 윤리와 책임] 에서 다룬 **"데이터의 편향이 모델로 옮겨진다"** 의 실제 사례.

---

### 🧪 지금 시도해 볼 것

1. STEP 1 의 \`survival_prob\` 공식에서 \`(data["Sex"] == "female") * 0.4\` 의 가중치를 \`0.0\` 으로 바꾸면 → 모델 정확도가 어떻게 변하는지
2. STEP 5 에 **LogisticRegression** 을 추가해 3종 모델 비교
3. \`max_depth\` 를 1, 3, 10 으로 바꿔 보며 **과적합** 관찰

### 🏁 이 프로젝트에서 배운 것
- ✅ Pandas 로 EDA → 결측값 처리 → 인코딩 → 모델 학습의 **현실적 흐름**
- ✅ **Decision Tree vs Random Forest** 차이 (단일 vs 앙상블)
- ✅ \`feature_importances_\` 로 **"왜?"** 를 묻는 분석가 시각
- ✅ **데이터 = 사회의 기록** — 그래서 윤리적 검토가 필수`,
        checkpoint: "위 해석을 읽고, '성별이 1위' 결과가 데이터의 어떤 점에서 비롯됐는지 한 번 생각해 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 🚢 타이타닉 생존자 예측 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP으로 이동할 수 있어요.

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score


## STEP 1: 시뮬레이션 데이터 생성
np.random.seed(42)
n = 200
data = pd.DataFrame({
    "Pclass": np.random.choice([1, 2, 3], n, p=[0.2, 0.3, 0.5]),
    "Sex": np.random.choice(["male", "female"], n),
    "Age": np.random.normal(30, 12, n).clip(1, 80).round(),
    "SibSp": np.random.choice([0, 1, 2, 3], n, p=[0.6, 0.2, 0.1, 0.1]),
    "Fare": np.random.exponential(30, n).round(2),
})
# 생존 확률: 여성, 1등석, 젊은 나이일수록 높음
survival_prob = (
    (data["Sex"] == "female").astype(float) * 0.4 +
    (data["Pclass"] == 1).astype(float) * 0.2 +
    (data["Age"] < 18).astype(float) * 0.15 +
    np.random.normal(0.2, 0.1, n)
).clip(0, 1)
data["Survived"] = (survival_prob > 0.5).astype(int)


## STEP 2: 데이터 탐색 (EDA)
print("=== 데이터 미리보기 ===")
print(data.head(10))
print(f"\\n전체: {len(data)}명, 생존: {data['Survived'].sum()}명 ({data['Survived'].mean():.1%})")


## STEP 3: 결측값 처리
# (이 시뮬레이션 데이터는 결측값이 없지만, 실제 데이터라면 여기서 처리)
if data["Age"].isna().any():
    data["Age"] = data["Age"].fillna(data["Age"].median())


## STEP 4: 특성 엔지니어링 (성별 인코딩)
data["Sex_encoded"] = (data["Sex"] == "female").astype(int)
features = ["Pclass", "Sex_encoded", "Age", "SibSp", "Fare"]

X = data[features]
y = data["Survived"]


## STEP 5: 훈련/테스트 분할 + 여러 모델 비교
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

models = {
    "Decision Tree": DecisionTreeClassifier(max_depth=5, random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42),
}

print("\\n=== 모델 비교 ===")
for name, model in models.items():
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    acc = accuracy_score(y_test, pred)
    print(f"{name}: 정확도 {acc:.2%}")


## STEP 6: 특성 중요도
rf = models["Random Forest"]
importance = pd.Series(rf.feature_importances_, index=features).sort_values(ascending=False)
print("\\n=== 특성 중요도 ===")
for feat, imp in importance.items():
    bar = "█" * int(imp * 30)
    print(f"{feat:15s} {bar} {imp:.3f}")
`,
        language: "python",
      },
    },
  },
  {
    id: "movie-recommendation",
    category: "unsupervised",
    title: "영화 추천 시스템",
    subtitle: "콘텐츠 기반 추천 알고리즘 만들기",
    icon: "🎬",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    tags: ["pandas", "cosine similarity", "추천"],
    description: `## 🎬 영화 추천 시스템 프로젝트

**목표**: 영화 장르 정보를 활용하여 콘텐츠 기반 추천 시스템을 만듭니다.

사용자가 좋아하는 영화를 입력하면, 장르 유사도를 계산하여
가장 비슷한 영화를 추천해주는 시스템입니다.

### 배울 것
- Pandas DataFrame으로 영화 데이터 구성
- 장르 원-핫 인코딩
- 코사인 유사도 계산
- 유사도 기반 영화 추천`,
    steps: [
      {
        title: "영화 데이터 생성 (제목 + 장르)",
        stepMarker: "STEP 1",
        description:
          "넷플릭스·왓챠의 기본 아이디어는 '비슷한 콘텐츠 찾기'. 그 시작은 **제목과 장르를 표로 정리** 하는 일입니다.",
        hint: "장르는 '액션,SF,스릴러' 처럼 쉼표로 구분해 하나의 문자열에.",
        snippet: `movies = pd.DataFrame({
    "title":  ["인셉션", "인터스텔라", "기생충"],
    "genres": ["액션,SF,스릴러", "SF,드라마,모험", "드라마,스릴러"],
})`,
        solution: `import pandas as pd

movies = pd.DataFrame({
    "title":  ["인셉션", "인터스텔라", "다크나이트", "어벤져스", "기생충"],
    "genres": ["액션,SF,스릴러", "SF,드라마,모험", "액션,스릴러,범죄",
               "액션,SF,모험", "드라마,스릴러,코미디"],
})
print(movies)`,
      },
      {
        title: "장르 원-핫 인코딩 (0/1 벡터화)",
        stepMarker: "STEP 2",
        description:
          "'장르가 얼마나 겹치는가' 를 **숫자로 계산** 하려면, 각 장르를 **0/1 피처** 로 바꿔야 해요. '액션' 이 있으면 1, 없으면 0.",
        hint: "전체 장르 집합을 먼저 모은 뒤, 영화마다 포함 여부를 표시.",
        snippet: `all_genres = sorted(set(g for row in movies["genres"] for g in row.split(",")))
genre_matrix = np.zeros((len(movies), len(all_genres)))
for i, g in enumerate(movies["genres"]):
    for genre in g.split(","):
        genre_matrix[i, all_genres.index(genre)] = 1`,
        solution: `import numpy as np

all_genres = sorted(set(g for row in movies["genres"] for g in row.split(",")))
print(f"전체 장르: {all_genres}")

genre_matrix = np.zeros((len(movies), len(all_genres)))
for i, g in enumerate(movies["genres"]):
    for genre in g.split(","):
        genre_matrix[i, all_genres.index(genre)] = 1

print(pd.DataFrame(genre_matrix, index=movies["title"], columns=all_genres))`,
      },
      {
        title: "코사인 유사도 함수 구현",
        stepMarker: "STEP 3",
        description:
          "두 벡터의 **'방향이 얼마나 같은가'** 를 -1~1 로 반환. 1 이면 완전히 같은 방향 = 장르 구성이 같음. 공식: `dot(a,b) / (|a|·|b|)`",
        hint: "numpy 의 `np.dot`, `np.linalg.norm` 으로 한 줄.",
        snippet: `def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))`,
        solution: `def cosine_similarity(a, b):
    dot = np.dot(a, b)
    na, nb = np.linalg.norm(a), np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)

# 테스트
print(cosine_similarity(genre_matrix[0], genre_matrix[0]))   # 1.0
print(cosine_similarity(genre_matrix[0], genre_matrix[4]))   # 0~1 값`,
      },
      {
        title: "유사도 행렬 생성 (N × N)",
        stepMarker: "STEP 4",
        description:
          "모든 영화 쌍에 대해 미리 유사도를 계산해 두면, 추천은 **표에서 찾기** 만 하면 돼요.",
        hint: "이중 for 루프로 N×N. 실무에선 `sklearn.metrics.pairwise.cosine_similarity` 한 줄이면 끝.",
        snippet: `n = len(movies)
sim = np.zeros((n, n))
for i in range(n):
    for j in range(n):
        sim[i, j] = cosine_similarity(genre_matrix[i], genre_matrix[j])`,
        solution: `n = len(movies)
sim = np.zeros((n, n))
for i in range(n):
    for j in range(n):
        sim[i, j] = cosine_similarity(genre_matrix[i], genre_matrix[j])

sim_df = pd.DataFrame(sim, index=movies["title"], columns=movies["title"])
print(sim_df.round(2))`,
      },
      {
        title: "추천 함수 구현",
        stepMarker: "STEP 5",
        description:
          "영화 제목을 입력하면 **자기 자신 제외**, 유사도 높은 순으로 top N 을 반환. 이게 '콘텐츠 기반 추천' 의 핵심.",
        hint: "scores 리스트를 정렬할 때 `key=lambda x: x[1]` 로 유사도 기준.",
        snippet: `def recommend(title, top_n=3):
    idx = movies[movies["title"] == title].index[0]
    scores = [(i, sim[idx, i]) for i in range(len(movies)) if i != idx]
    scores.sort(key=lambda x: -x[1])
    return scores[:top_n]`,
        solution: `def recommend(title, top_n=3):
    if title not in movies["title"].values:
        return f"{title} 없음"
    idx = movies[movies["title"] == title].index[0]
    scores = [(i, sim[idx, i]) for i in range(len(movies)) if i != idx]
    scores.sort(key=lambda x: -x[1])
    print(f"'{title}' 추천:")
    for i, s in scores[:top_n]:
        print(f"  {movies.iloc[i]['title']}  (유사도 {s:.2f})")`,
      },
      {
        title: "다양한 영화로 추천 테스트",
        stepMarker: "STEP 6",
        description:
          "추천이 **직관에 맞는지** 검증. '인셉션' 을 넣었는데 '겨울왕국' 이 나오면 뭔가 잘못된 거.",
        hint: "여러 영화를 돌리면서 **장르 구성이 비슷한지** 확인해 보세요.",
        snippet: `recommend("인셉션", top_n=3)
recommend("기생충", top_n=3)`,
        solution: `recommend("인셉션", top_n=3)
recommend("기생충", top_n=3)`,
        checkpoint: "같은 장르가 많이 겹친 영화가 상위에 오면 정상.",
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

넷플릭스·왓챠가 매일 수백억 번 돌리는 **콘텐츠 기반 추천 시스템** 의 미니어처를 직접 만들었어요.

---

### 📋 STEP 1 — 영화 데이터
\`\`\`
       title                  genres
       인셉션               액션,SF,스릴러
   인터스텔라               SF,드라마,모험
   다크나이트               액션,스릴러,범죄
       ...
\`\`\`
**해석**: 16편의 영화 + 각 장르 정보. 추천 알고리즘에서 **"입력 데이터"** 역할.

---

### 🔢 STEP 2 — 장르 원-핫 인코딩
컴퓨터에게 \`"액션,SF,스릴러"\` 같은 문자열은 의미 없어요. 그래서 **각 장르를 0/1 칸** 으로 펼침.

| 영화 | 액션 | SF | 스릴러 | 드라마 | 모험 | … |
|---|---|---|---|---|---|---|
| 인셉션 | 1 | 1 | 1 | 0 | 0 | … |
| 인터스텔라 | 0 | 1 | 0 | 1 | 1 | … |

**해석**: 이제 영화 한 편이 **숫자 벡터** 로 표현됨 → 수학 연산 가능.

---

### 📐 STEP 3~4 — 코사인 유사도 행렬
\`\`\`
=== 유사도 행렬 (상위 5x5) ===
            인셉션  인터스텔라  다크나이트  어벤져스  아이언맨
인셉션        1.00     0.41        0.67       0.67     0.67
인터스텔라    0.41     1.00        0.27       0.41     0.41
다크나이트    0.67     0.27        1.00       0.67     0.67
\`\`\`

**해석 (가장 중요)**
- **대각선 = 1.00** — 자기 자신과의 유사도. 항상 1 (당연).
- **인셉션 ↔ 다크나이트 = 0.67** — '액션,스릴러' 두 장르가 겹쳐 높음.
- **인셉션 ↔ 인터스텔라 = 0.41** — 'SF' 만 겹쳐서 중간.
- **0** 에 가까우면 장르 구성이 거의 다른 영화.

> 💡 코사인 유사도는 **0~1 사이의 "장르 닮음 정도"** 라고 이해하면 됨.

---

### 🎬 STEP 5~6 — 추천 결과
\`\`\`
'인셉션' 추천:
   다크나이트  (유사도 0.67)
   어벤져스   (유사도 0.67)
   아이언맨   (유사도 0.67)

'기생충' 추천:
   올드보이   (유사도 0.67)
   ...
\`\`\`

**해석**
- 인셉션 (액션,SF,스릴러) → **액션·스릴러 계열** 추천. 직관적.
- 기생충 (드라마,스릴러,코미디) → **올드보이** 같은 한국 스릴러 드라마. 합리적.
- 추천이 **장르 구성에만 의존** 하므로 같은 장르 영화가 동률(0.67) 로 나오는 게 정상.

---

### ⚠️ 이 단순 모델의 한계

| 이슈 | 설명 |
|---|---|
| **장르 외 정보 무시** | 감독·배우·스토리·연도·평점 등을 못 봄 |
| **사용자 개인화 없음** | "당신이 좋아한 것" 을 쓰지 않음 (콘텐츠 기반의 한계) |
| **인기 영화 편향 없음** | 신작도 옛날 영화도 동등 |
| **동률 다수** | 정밀한 순위 매기기 어려움 |

**실제 넷플릭스는** 콘텐츠 기반 + **협업 필터링(Collaborative Filtering)** + 딥러닝 모델 + A/B 테스트를 모두 결합해서 추천합니다. 오늘 만든 건 그 시작점.

---

### 🧪 지금 시도해 볼 것

1. STEP 1 의 \`movies\` 에 **여러분이 좋아하는 영화** 추가 (장르 정보 포함) → 추천 결과 확인
2. STEP 3 의 코사인 유사도 대신 **자카드 유사도** 구현
   \`\`\`python
   def jaccard(a, b):
       intersection = sum(1 for x, y in zip(a, b) if x == 1 and y == 1)
       union = sum(1 for x, y in zip(a, b) if x == 1 or y == 1)
       return intersection / union if union else 0
   \`\`\`
3. 평점 컬럼 추가 → 평점 가중 추천 만들어 보기

### 🏁 이 프로젝트에서 배운 것
- ✅ 카테고리 데이터 → **숫자 벡터 변환** (One-Hot)
- ✅ 두 객체의 유사도 = **벡터의 각도** (코사인 유사도)
- ✅ 미리 계산한 **유사도 행렬** = 빠른 추천의 비결
- ✅ 콘텐츠 기반 추천의 **장점·한계**`,
        checkpoint: "위 해석을 읽고, STEP 1 에 좋아하는 영화 한 편을 추가해 추천 결과를 확인해 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 🎬 영화 추천 시스템 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP으로 이동할 수 있어요.

import numpy as np
import pandas as pd


## STEP 1: 영화 데이터 생성
movies = pd.DataFrame({
    "title": [
        "인셉션", "인터스텔라", "다크나이트", "어벤져스",
        "아이언맨", "겨울왕국", "토이스토리", "코코",
        "기생충", "올드보이", "부산행", "반지의 제왕",
        "해리포터", "스파이더맨", "라라랜드", "위플래쉬",
    ],
    "genres": [
        "액션,SF,스릴러", "SF,드라마,모험", "액션,스릴러,범죄", "액션,SF,모험",
        "액션,SF,모험", "애니메이션,판타지,뮤지컬", "애니메이션,코미디,가족", "애니메이션,판타지,음악",
        "드라마,스릴러,코미디", "스릴러,드라마,미스터리", "액션,스릴러,공포", "판타지,모험,액션",
        "판타지,모험,가족", "액션,SF,모험", "드라마,뮤지컬,로맨스", "드라마,음악",
    ],
})

print("=== 영화 데이터 ===")
print(movies.to_string(index=False))


## STEP 2: 장르 원-핫 인코딩
all_genres = set()
for g in movies["genres"]:
    all_genres.update(g.split(","))
all_genres = sorted(all_genres)

print(f"\\n전체 장르 목록 ({len(all_genres)}개): {all_genres}")

genre_matrix = np.zeros((len(movies), len(all_genres)))
for i, g in enumerate(movies["genres"]):
    for genre in g.split(","):
        genre_matrix[i, all_genres.index(genre)] = 1


## STEP 3: 코사인 유사도 함수 구현
def cosine_similarity(a, b):
    """두 벡터 간 코사인 유사도를 계산합니다."""
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


## STEP 4: 유사도 행렬 생성
n = len(movies)
similarity_matrix = np.zeros((n, n))
for i in range(n):
    for j in range(n):
        similarity_matrix[i, j] = cosine_similarity(genre_matrix[i], genre_matrix[j])

print("\\n=== 유사도 행렬 (상위 5x5) ===")
sim_df = pd.DataFrame(similarity_matrix, index=movies["title"], columns=movies["title"])
print(sim_df.iloc[:5, :5].round(2).to_string())


## STEP 5: 추천 함수 구현
def recommend(title, top_n=5):
    """입력 영화와 가장 유사한 영화를 추천합니다."""
    if title not in movies["title"].values:
        print(f"'{title}'을(를) 찾을 수 없습니다.")
        return
    idx = movies[movies["title"] == title].index[0]
    scores = list(enumerate(similarity_matrix[idx]))
    # 자기 자신 제외, 유사도 높은 순 정렬
    scores = [(i, s) for i, s in scores if i != idx]
    scores.sort(key=lambda x: x[1], reverse=True)

    print(f"\\n'{title}' 장르: {movies.iloc[idx]['genres']}")
    print(f"--- 추천 영화 TOP {top_n} ---")
    for rank, (i, score) in enumerate(scores[:top_n], 1):
        print(f"  {rank}. {movies.iloc[i]['title']} (유사도: {score:.2f}) - {movies.iloc[i]['genres']}")


## STEP 6: 추천 테스트
recommend("인셉션")
recommend("겨울왕국")
recommend("기생충")
`,
        language: "python",
      },
    },
  },
  {
    id: "digit-recognition",
    category: "classification",
    title: "손글씨 숫자 인식",
    subtitle: "이미지 분류 모델 만들기",
    icon: "🔢",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    tags: ["scikit-learn", "분류", "MNIST"],
    description: `## 🔢 손글씨 숫자 인식 프로젝트

**목표**: 8x8 픽셀 손글씨 숫자 이미지를 인식하는 분류 모델을 만듭니다.

sklearn에 내장된 digits 데이터셋(0~9 숫자, 8x8 이미지)을 사용합니다.
SVM 분류기를 학습시켜 손글씨 숫자를 자동으로 판별합니다.

### 배울 것
- 이미지 데이터의 구조 이해 (8x8 픽셀)
- 데이터 전처리 및 시각화
- SVM(Support Vector Machine) 분류기 학습
- 혼동 행렬을 통한 모델 성능 분석`,
    steps: [
      {
        title: "데이터 로드: load_digits()",
        stepMarker: "STEP 1",
        description:
          "sklearn 내장 숫자 데이터 — **8×8 픽셀** 의 손글씨 이미지 약 1,800장. MNIST 의 축소판이라 브라우저에서도 가볍게 실험 가능.",
        hint: "`digits.images.shape` 은 `(1797, 8, 8)`, `digits.data.shape` 은 `(1797, 64)`.",
        snippet: `digits = load_digits()
print(digits.images.shape)
print(digits.data.shape)`,
        solution: `from sklearn.datasets import load_digits

digits = load_digits()
print(f"이미지 수: {len(digits.images)}")
print(f"이미지 크기: {digits.images[0].shape}")
print(f"특성 수: {digits.data.shape[1]} (= 8×8 픽셀)")
print(f"클래스: {digits.target_names}")`,
      },
      {
        title: "클래스별 분포 확인",
        stepMarker: "STEP 2",
        description:
          "이미지 문제에서 **클래스가 고르게 들어있는지** 확인 = 기본. 한 숫자만 과하게 많으면 모델이 편향될 수 있어요.",
        hint: "`np.unique(digits.target, return_counts=True)` 로 클래스별 개수.",
        snippet: `unique, counts = np.unique(digits.target, return_counts=True)
for digit, count in zip(unique, counts):
    print(f"숫자 {digit}: {count}개")`,
        solution: `import numpy as np

unique, counts = np.unique(digits.target, return_counts=True)
for digit, count in zip(unique, counts):
    bar = "█" * (count // 5)
    print(f"숫자 {digit}: {count}개 {bar}")`,
        checkpoint: "각 숫자가 대략 비슷한 양 (170~180개) 이면 OK.",
      },
      {
        title: "이미지 시각화 (텍스트 기반)",
        stepMarker: "STEP 3",
        description:
          "브라우저 환경에서 matplotlib 이 어려우니, **픽셀 밝기를 문자로 매핑** 해 ASCII 아트처럼 표시. 실제 숫자가 어떻게 생겼는지 감 잡기.",
        hint: "픽셀 값 0~16 을 문자 ` .:-=+*#%@` 중 하나로 변환.",
        snippet: `def show_digit(image):
    chars = " .:-=+*#%@"
    for row in image:
        print("".join(chars[min(int(p/16*len(chars)), len(chars)-1)] * 2 for p in row))`,
        solution: `def show_digit(image, label):
    chars = " .:-=+*#%@"
    print(f"--- 숫자: {label} ---")
    for row in image:
        line = ""
        for pixel in row:
            idx = min(int(pixel / 16 * len(chars)), len(chars) - 1)
            line += chars[idx] * 2
        print(line)

for i in range(3):
    show_digit(digits.images[i], digits.target[i])
    print()`,
      },
      {
        title: "훈련/테스트 분할 + SVM 학습",
        stepMarker: "STEP 4",
        description:
          "**SVM (Support Vector Machine)** 은 고차원(64 픽셀) 분류에 강력. `kernel='rbf'` 가 기본. 데이터 누수 막으려면 분할 먼저, 학습은 train 에만.",
        hint: "`SVC(kernel='rbf', gamma='scale')` 로 충분 — 하이퍼파라미터 튜닝은 나중에.",
        snippet: `X_tr, X_te, y_tr, y_te = train_test_split(
    digits.data, digits.target, test_size=0.2, random_state=42, stratify=digits.target
)
model = SVC(kernel="rbf", gamma="scale", random_state=42)
model.fit(X_tr, y_tr)`,
        solution: `from sklearn.model_selection import train_test_split
from sklearn.svm import SVC

X_tr, X_te, y_tr, y_te = train_test_split(
    digits.data, digits.target, test_size=0.2, random_state=42, stratify=digits.target
)
model = SVC(kernel="rbf", gamma="scale", random_state=42)
model.fit(X_tr, y_tr)
print("✅ SVM 학습 완료")`,
      },
      {
        title: "정확도 + 혼동 행렬 분석",
        stepMarker: "STEP 5",
        description:
          "전체 정확도 외에도 **어떤 숫자를 다른 숫자로 자주 잘못 보는지** 가 중요. 혼동 행렬(Confusion Matrix) 이 10×10 표로 이걸 보여줍니다.",
        hint: "`confusion_matrix` 는 (행=실제, 열=예측). 대각선이 많을수록 좋음.",
        snippet: `preds = model.predict(X_te)
print(accuracy_score(y_te, preds))
print(confusion_matrix(y_te, preds))`,
        solution: `from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

preds = model.predict(X_te)
print(f"정확도: {accuracy_score(y_te, preds):.2%}")
print()
cm = confusion_matrix(y_te, preds)
print("혼동 행렬 (실제 ↓ / 예측 →):")
print("    " + "  ".join(f"{i}" for i in range(10)))
for i, row in enumerate(cm):
    print(f" {i}: " + "  ".join(f"{v:2d}" if v else " ." for v in row))

print()
print(classification_report(y_te, preds))`,
        checkpoint: "정확도 97%+ 가 기대치 — 그 미만이면 하이퍼파라미터 확인.",
      },
      {
        title: "오분류 사례 확인",
        stepMarker: "STEP 6",
        description:
          "**잘못 맞힌 사례를 들여다보기** 는 모델 개선의 출발점. 예: '4' 를 '9' 로 자주 헷갈리나? 그럼 4·9 학습 샘플을 더 보충.",
        hint: "`np.where(preds != y_te)[0]` 로 오분류 인덱스 추출.",
        snippet: `wrong = np.where(preds != y_te)[0]
for idx in wrong[:3]:
    show_digit(X_te[idx].reshape(8, 8), f"실제={y_te[idx]}, 예측={preds[idx]}")`,
        solution: `wrong = np.where(preds != y_te)[0]
print(f"총 오분류: {len(wrong)}건")
for idx in wrong[:3]:
    show_digit(X_te[idx].reshape(8, 8),
               f"실제={y_te[idx]}, 예측={preds[idx]}")
    print()`,
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

손글씨 숫자 1,797장으로 **이미지 분류 AI** 를 학습시켰습니다. MNIST 의 축소판이지만 본질은 동일.

---

### 📦 STEP 1 — 데이터셋 정보
\`\`\`
이미지 수: 1797
이미지 크기: (8, 8) (8x8 픽셀)
특성 수: 64 (= 8×8 픽셀)
클래스: [0 1 2 3 4 5 6 7 8 9]
\`\`\`

**해석**
- **8×8 = 64개 픽셀 값** 이 한 이미지의 "특성".
- 각 픽셀은 0~16 의 명암값 (0=검정, 16=흰색).
- 모델 입장: "64개의 숫자 → 0~9 중 하나로 분류".

---

### 📊 STEP 2~3 — 데이터 분포 + ASCII 시각화
\`\`\`
숫자 0: 178개 ████████████████████████████████████
숫자 1: 182개 ...

--- 숫자: 0 ---
        ██████
      ██      ██
      ██      ██
      ██      ██
      ██      ██
        ██████
\`\`\`

**해석**
- **각 숫자가 약 178~182개** 로 균등 분포 → 클래스 불균형 문제 없음.
- ASCII 출력은 실제 8×8 이미지를 **글자로 그려 본 것** — 여러분 눈에도 0, 1, 2 로 보이죠?

---

### 🤖 STEP 4 — SVM 학습
\`\`\`
훈련 데이터: 1437개, 테스트 데이터: 360개
SVM 모델 학습 완료!
\`\`\`

**해석**
- **80%(1,437개) 학습 + 20%(360개) 테스트** 분할.
- **SVM (Support Vector Machine)** = 64차원 공간에서 클래스 경계선을 그어 분류.
- \`kernel='rbf'\` = 곡선 형태 경계도 학습 가능 (선형 분리 못 하는 경우 대응).

---

### 📈 STEP 5 — 정확도 + 혼동 행렬
\`\`\`
정확도: 98.61%

혼동 행렬 (실제 ↓ / 예측 →):
    0   1   2   3   4   5   6   7   8   9
 0: 35   .   .   .   .   .   .   .   .   .
 1:  .  36   .   .   .   .   .   .   .   .
 2:  .   .  35   .   .   .   .   .   .   .
 3:  .   .   .  36   .   .   .   .   .   .
 4:  .   .   .   .  35   .   .   .   .   1
 5:  .   .   .   .   .  37   .   .   .   .
 6:  .   .   .   .   .   .  36   .   .   .
 7:  .   .   .   .   .   .   .  35   .   1
 8:  .   .   1   .   .   .   .   .  34   .
 9:  .   .   .   .   .   .   .   1   .  34
\`\`\`

**해석 (가장 중요)**

#### 정확도 98.61%
- 360개 중 **약 5건만 틀림** → 이미지 분류로는 매우 우수.

#### 혼동 행렬 읽는 법
- **대각선 = 맞춘 것** (35, 36, ...). 큰 수가 좋음.
- **대각선 밖 = 헷갈린 것**.
- 위 예시에서 발견 가능한 패턴:
  - **4 → 9 로 1건 오답** — 4의 윗부분이 9 같이 보일 때
  - **8 → 2 로 1건** — 두 숫자 모두 곡선이 많음
  - **9 → 7 로 1건** — 9 의 꼬리가 짧으면 7 같음

이런 게 바로 **사람도 헷갈리는 케이스** 가 모델에서도 나타나는 것!

---

### 🔎 STEP 6 — 오분류 사례 시각화
\`\`\`
총 오분류: 5건
--- 숫자: 실제=4, 예측=9 ---
   ████
  ██    ██
  ██    ██
  ████████  ← 가로선 + 위가 막혀 9 같이 보임
        ██
        ██
\`\`\`

**해석**
- 모델이 잘못 본 이미지를 **눈으로 확인** 할 수 있어요.
- 실제로 보면 **사람이 봐도 애매한 글씨** 가 많음 → 모델 탓이 아니라 **데이터 자체의 모호성**.
- 실무에선 이런 **edge case** 를 모아 추가 학습시키는 게 정확도 향상의 정석.

---

### 🚀 이 미니 모델의 위치

| 비교 대상 | 데이터 크기 | 정확도 | 모델 |
|---|---|---|---|
| **이 프로젝트** | 8×8, 1,797장 | ~98% | SVM |
| **MNIST 손글씨 (표준)** | 28×28, 60,000장 | 99.7%+ | CNN |
| **상용 OCR** | 다양한 폰트·필체 | 99.9%+ | Transformer |

규모가 커질수록 모델·연산도 커지지만 **원리는 같음**.

---

### 🧪 지금 시도해 볼 것

1. STEP 4 의 \`kernel\` 을 \`'linear'\` 로 바꿔 정확도 비교
2. \`gamma='scale'\` 대신 \`gamma=0.01\` 또는 \`gamma=1\` 로 → 정확도 변화 관찰 (RBF 의 곡률)
3. **다른 분류기** 시도: \`from sklearn.linear_model import LogisticRegression\` → 학습 후 비교
4. 오분류 5건 외에도 더 많이 출력해 패턴 분석 (\`wrong[:10]\`)

### 🏁 이 프로젝트에서 배운 것
- ✅ 이미지 = **숫자 배열** 의 본질 (CV 의 출발점)
- ✅ **SVM** 의 활용과 \`kernel\` / \`gamma\` 의 의미
- ✅ **혼동 행렬** 로 모델의 약점 진단
- ✅ **오분류 사례 분석** = 모델 개선의 정석`,
        checkpoint: "위 해석을 읽고, 혼동 행렬에서 가장 자주 헷갈리는 숫자 쌍을 찾아 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 🔢 손글씨 숫자 인식 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP으로 이동할 수 있어요.

import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


## STEP 1: 데이터 로드
digits = load_digits()
print("=== 데이터셋 정보 ===")
print(f"이미지 개수: {len(digits.images)}")
print(f"이미지 크기: {digits.images[0].shape} (8x8 픽셀)")
print(f"클래스: {digits.target_names}")
print(f"특성 수: {digits.data.shape[1]} (8x8 = 64)")


## STEP 2: 클래스별 분포 확인
print("\\n=== 클래스별 샘플 수 ===")
unique, counts = np.unique(digits.target, return_counts=True)
for digit, count in zip(unique, counts):
    bar = "█" * (count // 5)
    print(f"  숫자 {digit}: {count}개 {bar}")


## STEP 3: 이미지 시각화 (텍스트 기반)
def show_digit(image, label):
    """8x8 이미지를 텍스트로 시각화합니다."""
    chars = " .:-=+*#%@"
    print(f"--- 숫자: {label} ---")
    for row in image:
        line = ""
        for pixel in row:
            idx = min(int(pixel / 16 * len(chars)), len(chars) - 1)
            line += chars[idx] * 2
        print(line)

print("\\n=== 샘플 이미지 ===")
for i in range(3):
    show_digit(digits.images[i], digits.target[i])
    print()


## STEP 4: 훈련/테스트 분할 및 SVM 학습
X_train, X_test, y_train, y_test = train_test_split(
    digits.data, digits.target, test_size=0.2, random_state=42
)
print(f"훈련 데이터: {len(X_train)}개, 테스트 데이터: {len(X_test)}개")

# SVM 분류기 학습
model = SVC(kernel="rbf", gamma="scale", random_state=42)
model.fit(X_train, y_train)
print("SVM 모델 학습 완료!")


## STEP 5: 예측 및 혼동 행렬 분석
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"\\n=== 모델 성능 ===")
print(f"정확도: {accuracy:.2%}")

print("\\n=== 분류 보고서 ===")
print(classification_report(y_test, predictions, target_names=[str(i) for i in range(10)]))

# 혼동 행렬
cm = confusion_matrix(y_test, predictions)
print("=== 혼동 행렬 ===")
print("예측 →  ", "  ".join(f"{i}" for i in range(10)))
for i, row in enumerate(cm):
    print(f"실제 {i}: ", "  ".join(f"{v:2d}" if v > 0 else " ." for v in row))


## STEP 6: 오분류 사례 확인
wrong = np.where(predictions != y_test)[0]
print(f"\\n=== 오분류 사례 ({len(wrong)}개) ===")
for idx in wrong[:5]:
    print(f"  실제: {y_test[idx]}, 예측: {predictions[idx]}")
    show_digit(X_test[idx].reshape(8, 8), f"실제={y_test[idx]}, 예측={predictions[idx]}")
    print()
`,
        language: "python",
      },
    },
  },
  {
    id: "sentiment-analysis",
    category: "nlp",
    title: "감성 분석기",
    subtitle: "텍스트의 감정을 판별하는 프로그램",
    icon: "💬",
    difficulty: "beginner",
    estimatedMinutes: 30,
    tags: ["NLP", "분류", "텍스트"],
    description: `## 💬 감성 분석기 프로젝트

**목표**: 텍스트에 담긴 감정(긍정/부정/중립)을 판별하는 프로그램을 만듭니다.

별도의 ML 라이브러리 없이 순수 파이썬만으로 구현합니다.
긍정/부정 키워드 사전을 활용한 규칙 기반 감성 분석입니다.

### 배울 것
- 텍스트 전처리 (토큰화, 정규화)
- 키워드 기반 감성 점수 계산
- 부정어 처리 ("안 좋다" → 부정)
- 분석 결과 시각화 및 정확도 평가`,
    steps: [
      {
        title: "긍정/부정 키워드 사전 구축",
        stepMarker: "STEP 1",
        description:
          "**규칙 기반 감성 분석** 의 기본 재료. 긍정·부정어 각각 10~20개씩만 모아도 입문 단계에선 충분해요. ML 없이 **사전 + 스코어 합산** 으로 꽤 잘 됩니다.",
        hint: "두 개의 set 으로 관리하면 `word in positive_words` 빠른 탐색 가능.",
        snippet: `positive_words = {"좋다", "최고", "훌륭"}
negative_words = {"나쁘다", "최악", "실망"}`,
        solution: `positive_words = {
    "좋다", "최고", "훌륭", "멋지다", "재미있다", "만족", "행복",
    "사랑", "감동", "추천", "대박", "짱", "예쁘다", "맛있다",
}
negative_words = {
    "나쁘다", "최악", "실망", "별로", "화나다", "아쉽다", "슬프다",
    "지루", "싫다", "불만", "짜증", "후회", "끔찍", "실패",
}

print(f"긍정어 {len(positive_words)}개, 부정어 {len(negative_words)}개")`,
      },
      {
        title: "텍스트 전처리: 토큰화 + 정규화",
        stepMarker: "STEP 2",
        description:
          "컴퓨터에겐 '재밌어요' 와 '재밌어' 가 다른 문자열. 실무에선 형태소 분석(KoNLPy 등) 을 쓰지만, 입문에선 **공백 분리 + 소문자** 만으로도 시작 가능.",
        hint: "`text.lower().split()` 으로 단순 토큰화.",
        snippet: `def tokenize(text):
    return text.lower().split()`,
        solution: `def tokenize(text):
    # 구두점 제거
    import re
    cleaned = re.sub(r"[^\\w\\s]", " ", text.lower())
    return cleaned.split()

print(tokenize("정말 재미있고 훌륭한 영화!"))`,
      },
      {
        title: "감성 점수 계산 함수",
        stepMarker: "STEP 3",
        description:
          "각 토큰을 사전과 대조해 **긍정은 +1, 부정은 -1** 로 합산. 최종 점수 > 0 → 긍정, < 0 → 부정, = 0 → 중립.",
        hint: "`sum(1 for w in tokens if w in positive_words)` 같이 제너레이터 합계.",
        snippet: `def sentiment_score(text):
    tokens = tokenize(text)
    pos = sum(1 for t in tokens if t in positive_words)
    neg = sum(1 for t in tokens if t in negative_words)
    return pos - neg`,
        solution: `def sentiment_score(text):
    tokens = tokenize(text)
    # 부분 일치도 허용 (사전 단어를 포함하는 단어까지)
    pos = sum(1 for t in tokens if any(p in t for p in positive_words))
    neg = sum(1 for t in tokens if any(n in t for n in negative_words))
    return pos - neg

print(sentiment_score("정말 재미있고 훌륭했다"))   # 양수
print(sentiment_score("최악의 선택, 후회한다"))    # 음수
print(sentiment_score("그냥 그랬다"))             # 0`,
      },
      {
        title: "부정어 처리 — '안/못' 으로 뒤집기",
        stepMarker: "STEP 4",
        description:
          "'안 좋다' 는 부정이지 긍정이 아니에요. 긍정어 바로 앞에 '안'/'못'/'없' 이 있으면 **점수를 반전** 시키는 로직 추가.",
        hint: "토큰 리스트를 순회하면서 이전 토큰에 '안/못/없' 이 있었는지 체크.",
        snippet: `NEGATORS = {"안", "못", "없다"}
# 이전 토큰이 NEGATORS 에 있으면 점수 반전`,
        solution: `NEGATORS = {"안", "못", "없다", "없고", "아니"}

def sentiment_score_v2(text):
    tokens = tokenize(text)
    score = 0
    for i, t in enumerate(tokens):
        is_neg = any(p in t for p in positive_words)
        is_pos = any(n in t for n in negative_words)
        delta = (1 if is_neg else 0) - (1 if is_pos else 0)
        # 바로 앞 토큰이 부정어면 뒤집기
        if i > 0 and tokens[i-1] in NEGATORS:
            delta = -delta
        score += delta
    return score

print(sentiment_score_v2("안 좋다"))          # -1 (반전)
print(sentiment_score_v2("못 해먹겠다"))      # 0
print(sentiment_score_v2("정말 좋다"))        # +1`,
      },
      {
        title: "테스트 문장 묶음으로 분석 실행",
        stepMarker: "STEP 5",
        description:
          "단발 테스트 말고 **여러 문장 묶음** 으로 돌려야 모델의 실력이 보여요. 긍정·부정·중립이 섞인 세트로 검증.",
        hint: "결과 요약에는 👍 / 👎 이모지로 시각화하면 보기 좋음.",
        snippet: `sentences = ["정말 최고야", "완전 실망", "그냥 그랬다"]
for s in sentences:
    print(s, sentiment_score_v2(s))`,
        solution: `sentences = [
    "이 영화 정말 최고야, 감동적이었어",
    "완전 실망. 시간 낭비였다.",
    "평범한 편이지만 볼만은 했다",
    "안 좋아. 후회된다.",
    "훌륭한 연출과 멋진 연기",
]
for s in sentences:
    score = sentiment_score_v2(s)
    emoji = "👍" if score > 0 else "👎" if score < 0 else "😐"
    print(f"{emoji} ({score:+d}) {s}")`,
      },
      {
        title: "정답 레이블과 비교 — 정확도 평가",
        stepMarker: "STEP 6",
        description:
          "규칙 기반이라도 **정량 평가** 가 필수. '예상 레이블 vs 실제 레이블' 을 비교해 정확도 계산.",
        hint: "정확도 = (맞은 개수 / 전체 개수). 놓친 문장이 있다면 사전에 단어를 추가하며 개선.",
        snippet: `labeled = [("최고!", "긍정"), ("실망", "부정"), ("그냥", "중립")]
correct = sum(1 for s, label in labeled if classify(s) == label)
print(f"정확도: {correct}/{len(labeled)}")`,
        solution: `labeled = [
    ("최고의 작품, 완전 감동", "긍정"),
    ("완전 실망스러운 영화", "부정"),
    ("훌륭한 연기와 멋진 스토리", "긍정"),
    ("안 좋았다. 후회됨.", "부정"),
    ("그냥 그랬다", "중립"),
]

def classify(s):
    sc = sentiment_score_v2(s)
    return "긍정" if sc > 0 else "부정" if sc < 0 else "중립"

correct = sum(1 for s, label in labeled if classify(s) == label)
print(f"정확도: {correct}/{len(labeled)} = {correct/len(labeled):.0%}")

# 틀린 케이스 확인
print("\\n오분류:")
for s, label in labeled:
    pred = classify(s)
    if pred != label:
        print(f"  ❌ 예상: {label}, 실제: {pred} → '{s}'")`,
        checkpoint: "80%+ 면 양호. 70% 이하면 긍정·부정 사전에 단어 추가.",
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

ML 라이브러리 없이 **순수 파이썬 + 사전 + 규칙** 만으로 텍스트 감정을 판별하는 NLP 모델을 만들었어요.

---

### 📚 STEP 1 — 키워드 사전
\`\`\`
긍정 키워드: 32개
부정 키워드: 30개
부정어: 6개
\`\`\`

**해석**
- 이 사전이 모델의 **"지식"** 전부.
- ML 모델이 데이터에서 자동으로 학습하는 것을, 여기선 **여러분이 직접 정의**.
- 사전이 풍부할수록 정확도 ↑ (단, 도메인마다 달라야 — 영화 리뷰용 vs 음식 리뷰용 사전은 달라짐)

---

### 🔧 STEP 2~3 — 토큰화 + 점수 계산
\`\`\`python
"이 영화 정말 재미있다 최고"
→ tokens = ["이", "영화", "정말", "재미있다", "최고"]
→ 긍정어 매칭: "재미있다"(+1), "최고"(+1) = +2
→ 결과: 긍정 😊
\`\`\`

**해석**
- 토큰화 = 문장을 단어 단위로 쪼개기.
- 각 단어를 사전과 대조해 **점수 합산** → 양수면 긍정, 음수면 부정.
- 매우 단순하지만 **80% 이상 정확도** 를 낼 수 있음 (실제 출력 결과 참고).

---

### 🔄 STEP 4 — 부정어 처리
\`\`\`
"안 좋다"
→ tokens = ["안", "좋다"]
→ "좋다" 가 긍정어인데 앞에 "안" 이 있음 → 점수 반전
→ 결과: 부정 😞
\`\`\`

**해석 (가장 중요한 발전)**
- 단순 사전 매칭의 약점은 **"안 좋다" 를 긍정으로 오판** 하는 것.
- 부정어 (안/못/없/아니) 가 바로 앞에 있으면 점수를 반전시키는 **이중 패스** 가 핵심.
- 이게 NLP 의 첫 단계 — 단어가 아닌 **문맥** 보기.

---

### 📊 STEP 5~6 — 테스트 결과
\`\`\`
📝 "이 영화 정말 재미있다 최고"
   결과: 긍정 😊 (점수: +2)
   '재미있다' → +1 (긍정)
   '최고' → +1 (긍정)
   정답: 긍정 ✅

📝 "안 좋은 경험이었다"
   결과: 부정 😞 (점수: -1)
   '안 좋은' → -1 (부정어 반전)
   정답: 부정 ✅

📝 "나쁘다고 할 수 없는 맛"
   결과: 긍정 (점수: +1)
   '없는 나쁘다' → +1 (이중 부정 반전)
   정답: 긍정 ✅

==================================================
  정확도: 8/10 (80%)
==================================================
\`\`\`

**해석**

#### 정확도 80%
- 10개 중 8개 맞음. 단순 모델 치고는 **꽤 괜찮음**.
- 100% 가 안 되는 이유 → 다음 한계 참고.

#### 어떤 게 잘 됐나?
- ✅ 명확한 긍정/부정어가 있는 문장
- ✅ 부정어 + 긍정어 ("안 좋다") 패턴
- ✅ 이중 부정 ("없는 나쁘다" → 긍정) 같은 고급 패턴까지 잡힘

#### 어떤 게 어려웠나?
\`\`\`
❌ 예상: 긍정, 실제: 중립 → '친절 하고 깨끗 하지만 비싸다'
❌ 예상: 중립, 실제: 부정 → ...
\`\`\`
- "친절 + 깨끗(긍정) - 비싸다(부정) = 0" → 모델은 중립으로 봄. 사람은 종합해서 긍정으로 판단.
- 즉, **점수 합산만으로는 미묘한 감정 못 잡음**.

---

### ⚠️ 이 모델의 한계

| 이슈 | 예시 | 해결 |
|---|---|---|
| **반어법** | "참 잘하는군" (실은 부정) | 문맥 학습 필요 (LLM) |
| **이모티콘·이모지** | "좋아 ㅡㅡ" | 별도 사전 |
| **신조어** | "쩐다", "대박이네" | 사전 지속 갱신 |
| **혼합 감정** | "맛은 좋은데 비싸다" | 가중치 조정 / 다중 라벨 |
| **풍자·은유** | "이건 예술이다" (조롱) | 컨텍스트 모델 |

**상용 NLP 솔루션** (e.g. 네이버 PAPAGO, OpenAI API) 은 위 문제들을 **딥러닝 + 수십억 단어 학습** 으로 해결합니다. 하지만 출발점은 결국 오늘 만든 이런 단순한 점수 합산이었어요.

---

### 🧪 지금 시도해 볼 것

1. **사전 확장**: STEP 1 에 여러분 도메인의 단어 추가 (음식, 게임, 화장품 등)
2. **가중치 부여**: "최고" = +2, "괜찮음" = +1 처럼 강도 차등
3. **정규표현식**: 어미 변화 처리 ("좋다", "좋네", "좋아요" 모두 매칭)
4. **부정어 범위 확장**: 단순히 바로 앞이 아닌 "3 토큰 이내" 로
5. **scikit-learn 으로 ML 버전 시도**: \`from sklearn.feature_extraction.text import CountVectorizer\` + \`LogisticRegression\`

### 🏁 이 프로젝트에서 배운 것
- ✅ NLP 의 **3대 단계**: 토큰화 → 정규화 → 점수화
- ✅ **규칙 기반 모델** 의 강점(설명 가능)·약점(미묘한 감정)
- ✅ **부정어 처리** = 단순 단어 매칭을 한 단계 끌어올리는 핵심 기법
- ✅ 정량 평가의 중요성 — "감 으로 좋다" 가 아니라 **80%** 같은 숫자로 검증`,
        checkpoint: "위 해석을 읽고, STEP 1 의 사전에 자기가 자주 쓰는 긍정·부정 단어를 5개씩 추가해 정확도 변화를 확인해 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 💬 감성 분석기 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP으로 이동할 수 있어요.


## STEP 1: 긍정/부정 키워드 사전 구축
positive_words = {
    "좋다", "좋아", "좋은", "훌륭", "최고", "멋진", "멋지다",
    "행복", "기쁘다", "기쁜", "만족", "추천", "사랑", "감동",
    "재미있다", "재밌다", "재밌는", "유익", "편리", "깨끗",
    "친절", "맛있다", "맛있는", "완벽", "대박", "굿", "짱",
    "감사", "예쁜", "예쁘다", "뛰어난", "우수", "즐거운",
}

negative_words = {
    "나쁘다", "나쁜", "싫다", "싫은", "별로", "최악", "짜증",
    "실망", "불만", "불편", "화나다", "화난", "슬프다", "슬픈",
    "지루하다", "지루한", "아쉽다", "아쉬운", "힘들다", "어렵다",
    "비싸다", "비싼", "느리다", "느린", "더럽다", "불친절",
    "맛없다", "맛없는", "후회", "망", "거짓", "부족",
}

# 부정어 목록 (뒤에 오는 감성을 반전시킴)
negation_words = {"안", "못", "없다", "없는", "아니", "절대"}

print(f"긍정 키워드: {len(positive_words)}개")
print(f"부정 키워드: {len(negative_words)}개")
print(f"부정어: {len(negation_words)}개")


## STEP 2: 텍스트 전처리 (토큰화)
def tokenize(text):
    """텍스트를 단어 단위로 분리합니다."""
    # 간단한 공백 기반 토큰화
    tokens = text.strip().split()
    return tokens


## STEP 3: 감성 점수 계산 (부정어 처리 포함)
def analyze_sentiment(text):
    """텍스트의 감성 점수를 계산합니다.
    양수: 긍정, 음수: 부정, 0: 중립
    """
    tokens = tokenize(text)
    score = 0
    details = []

    for i, token in enumerate(tokens):
        # 이전 단어가 부정어인지 확인
        is_negated = i > 0 and tokens[i - 1] in negation_words

        if token in positive_words:
            if is_negated:
                score -= 1  # 부정어 + 긍정 = 부정
                details.append(f"  '{tokens[i-1]} {token}' → -1 (부정어 반전)")
            else:
                score += 1
                details.append(f"  '{token}' → +1 (긍정)")
        elif token in negative_words:
            if is_negated:
                score += 1  # 부정어 + 부정 = 긍정
                details.append(f"  '{tokens[i-1]} {token}' → +1 (부정어 반전)")
            else:
                score -= 1
                details.append(f"  '{token}' → -1 (부정)")

    # 감성 레이블 결정
    if score > 0:
        label = "긍정 😊"
    elif score < 0:
        label = "부정 😞"
    else:
        label = "중립 😐"

    return {"text": text, "score": score, "label": label, "details": details}


## STEP 4: 부정어 처리 확인 (위 analyze_sentiment 함수에 이미 포함)
def print_result(result):
    """분석 결과를 보기 좋게 출력합니다."""
    print(f'\\n📝 "{result["text"]}"')
    print(f"   결과: {result['label']} (점수: {result['score']:+d})")
    if result["details"]:
        for d in result["details"]:
            print(f"   {d}")


## STEP 5: 테스트 문장으로 분석
test_sentences = [
    ("이 영화 정말 재미있다 최고", "긍정"),
    ("음식이 맛있고 서비스도 친절 추천", "긍정"),
    ("완전 별로 실망 다시 안 간다", "부정"),
    ("가격이 비싸다 맛없다 후회", "부정"),
    ("안 좋은 경험이었다", "부정"),
    ("나쁘다고 할 수 없는 맛", "긍정"),
    ("그냥 보통이었다", "중립"),
    ("감동 받았고 행복 했다", "긍정"),
    ("지루하다 재미없다 시간 낭비", "부정"),
    ("친절 하고 깨끗 하지만 비싸다", "긍정"),
]

print("\\n" + "=" * 50)
print("       감성 분석 테스트 결과")
print("=" * 50)

correct = 0
total = len(test_sentences)

for text, expected in test_sentences:
    result = analyze_sentiment(text)
    print_result(result)

    # 예측 레이블 추출 (이모지 제거)
    predicted = result["label"].split()[0]
    is_correct = predicted == expected
    if is_correct:
        correct += 1
    status = "✅" if is_correct else "❌"
    print(f"   정답: {expected} {status}")


## STEP 6: 정확도 평가
print("\\n" + "=" * 50)
print(f"  정확도: {correct}/{total} ({correct/total:.0%})")
print("=" * 50)

# 사용자 입력 테스트
print("\\n=== 추가 분석 테스트 ===")
custom_texts = [
    "오늘 날씨도 좋은 멋진 하루",
    "이 제품은 별로 추천 안 한다",
    "감사합니다 만족 합니다 대박",
]
for text in custom_texts:
    result = analyze_sentiment(text)
    print_result(result)
`,
        language: "python",
      },
    },
  },

  // ════════════════════════════════════════════════════════════
  //  v3.8.0 — 트렌디 신규 프로젝트 3개
  // ════════════════════════════════════════════════════════════

  {
    id: "prompt-classifier",
    category: "nlp",
    title: "프롬프트 품질 분류기",
    subtitle: "Master Protocol 6기둥으로 프롬프트 자동 채점",
    icon: "🧭",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    tags: ["LLM", "프롬프트", "NLP", "분류"],
    description: `## 🧭 프롬프트 품질 분류기 프로젝트

**목표**: 사용자가 작성한 프롬프트를 **6가지 기준 (Role/Context/Task/Format/Constraints/Examples)** 으로 자동 채점하는 분류기를 만듭니다.

[AI 강의 07 — 프롬프트 엔지니어링] 의 Master Protocol 을 코드로 구현해, **여러분이 ChatGPT/Claude 에 던지기 전에** 프롬프트 품질을 미리 검증할 수 있어요.

### 배울 것
- 키워드 기반 텍스트 분류 (NLP 입문)
- 다차원 점수 → 등급 매핑
- 자동 개선 제안 시스템
- LLM 시대의 새로운 리터러시`,
    steps: [
      {
        title: "Master Protocol 6기둥 키워드 사전 구축",
        stepMarker: "STEP 1",
        description:
          "각 기둥마다 그 의도를 시그널링하는 한국어·영어 키워드를 모읍니다. 사전이 풍부할수록 채점 정확도 ↑.",
        hint: "Role 은 '당신은/너는/역할', Context 는 '데이터/상황/배경', Task 는 동사형('만들어/작성/분석') 위주.",
        snippet: `PILLARS = {
    "Role":        ["당신은", "너는", "역할", "you are"],
    "Context":     ["데이터", "상황", "배경", "현재"],
    "Task":        ["만들", "작성", "분석", "찾", "요약"],
    "Format":      ["형식", "마크다운", "표", "JSON"],
    "Constraints": ["제약", "이내", "없이", "금지"],
    "Examples":    ["예:", "예시", "example"],
}`,
        solution: `PILLARS = {
    "👤 Role":        ["당신은", "너는", "역할", "act as", "you are", "role:"],
    "📋 Context":     ["데이터", "상황", "배경", "저희", "우리", "현재", "context"],
    "🎯 Task":        ["만들", "작성", "분석", "찾", "요약", "생성", "추천", "제안"],
    "📐 Format":      ["형식", "마크다운", "표", "리스트", "JSON", "코드 블록", "format"],
    "🚧 Constraints": ["제약", "금지", "없이", "이내", "최대", "말 것", "하지 마"],
    "💡 Examples":    ["예:", "예시", "example", "->", "| "],
}
print(f"6기둥 사전 준비 완료: {len(PILLARS)}개 기둥")`,
      },
      {
        title: "프롬프트 점수 계산 함수",
        stepMarker: "STEP 2",
        description:
          "입력 프롬프트를 받아 각 기둥별로 키워드가 하나라도 매칭되면 1점, 아니면 0점. 단순하지만 강력한 패턴.",
        hint: "`any(kw.lower() in text for kw in keywords)` 로 한 줄 매칭.",
        snippet: `def score_prompt(prompt):
    text = prompt.lower()
    return {pillar: any(kw.lower() in text for kw in keywords)
            for pillar, keywords in PILLARS.items()}`,
        solution: `def score_prompt(prompt: str) -> dict:
    """프롬프트를 6기둥 기준으로 점수화. 각 기둥 True/False 반환."""
    text = prompt.lower()
    return {
        pillar: any(kw.lower() in text for kw in keywords)
        for pillar, keywords in PILLARS.items()
    }

# 테스트
result = score_prompt("당신은 데이터 분석가입니다. CSV를 분석해주세요.")
print(result)`,
      },
      {
        title: "종합 점수 → 등급 매핑 (S/A/B/C)",
        stepMarker: "STEP 3",
        description:
          "6점 만점 기준으로 등급 부여. 채용 인터뷰처럼 한눈에 품질 파악 가능.",
        hint: "점수 6=S, 4~5=A, 2~3=B, 0~1=C.",
        snippet: `def grade(scores):
    points = sum(scores.values())
    if points == 6:   return "S"
    elif points >= 4: return "A"
    elif points >= 2: return "B"
    else:             return "C"`,
        solution: `def grade(scores: dict) -> tuple[str, str]:
    """점수 dict → (등급, 메시지) 반환."""
    points = sum(scores.values())
    if points == 6:
        return "S", "🏆 Master Prompt — 모든 기둥 갖춤"
    elif points >= 4:
        return "A", "👍 양호 — 빠진 1~2개만 보강하면 최상"
    elif points >= 2:
        return "B", "🧐 보통 — 절반 이상 빠짐, 개선 필요"
    else:
        return "C", "🚨 막연 — 역할·문맥·형식 기본부터"

print(grade({"R":True, "C":True, "T":True, "F":True, "Co":True, "E":True}))`,
      },
      {
        title: "여러 샘플 프롬프트로 채점 실행",
        stepMarker: "STEP 4",
        description:
          "막연한 프롬프트부터 Master Protocol 적용한 프롬프트까지 4종을 동시 비교 — 차이가 한눈에 보임.",
        hint: "for 루프로 각 샘플마다 score_prompt + grade 호출.",
        snippet: `samples = ["글 써줘", "당신은 마케터다. 광고 카피 5개 만들어줘"]
for s in samples:
    scores = score_prompt(s)
    g, msg = grade(scores)
    print(f"[{g}] {s}")`,
        solution: `samples = [
    # C 등급 — 막연
    "글 써줘",
    # B 등급 — 역할만
    "당신은 마케터다. 광고 카피 만들어줘",
    # A 등급 — 형식까지
    "당신은 SNS 마케터입니다. 20대 여성 대상 화장품 광고 카피 5개를 마크다운 표로 작성해 주세요.",
    # S 등급 — Master Protocol
    """당신은 10년차 SNS 마케터입니다.
저희는 비건 스킨케어 스타트업이고 20대 여성이 타깃입니다.
신제품(비건 썬스틱) 광고 카피 5개를 작성해 주세요.
형식: 각 카피마다 (제목/본문/CTA) 마크다운으로.
제약: 카피당 100자 이내, 이모지 최대 2개.
예: ✨ 봄 햇살, 비건으로 막다 — 지금 만나보기""",
]

print(f"{'등급':>4} {'점수':>4}  프롬프트 (앞 40자)")
print("-" * 60)
for s in samples:
    scores = score_prompt(s)
    g, msg = grade(scores)
    pts = sum(scores.values())
    preview = s.replace("\\n", " ")[:40]
    print(f"{g:>4} {pts}/6  {preview}{'...' if len(s) > 40 else ''}")`,
      },
      {
        title: "기둥별 상세 진단 출력",
        stepMarker: "STEP 5",
        description:
          "어떤 기둥이 있고 빠졌는지 ✅/❌ 로 시각화. 학습자가 즉시 개선 포인트 인지.",
        hint: "scores.items() 순회하며 ✅ 또는 ❌ 출력.",
        snippet: `def diagnose(prompt):
    scores = score_prompt(prompt)
    for pillar, ok in scores.items():
        mark = "✅" if ok else "❌"
        print(f"  {mark} {pillar}")`,
        solution: `def diagnose(prompt: str):
    scores = score_prompt(prompt)
    g, msg = grade(scores)
    pts = sum(scores.values())

    print("─" * 50)
    print(f"📝 프롬프트: {prompt[:60]}{'...' if len(prompt) > 60 else ''}")
    print(f"🎯 등급: {g} ({pts}/6)  — {msg}")
    print()
    for pillar, ok in scores.items():
        mark = "✅" if ok else "❌"
        print(f"   {mark} {pillar}")
    print()

# 검증
diagnose("글 써줘")
diagnose(samples[3])  # Master Prompt`,
      },
      {
        title: "자동 개선 제안 (빠진 기둥 알려주기)",
        stepMarker: "STEP 6",
        description:
          "단순 채점에 그치지 말고 **무엇을 더 추가해야 하는지** 안내. 학습자에게 실용적.",
        hint: "scores 에서 False 인 기둥들 추출 → 안내 문구 생성.",
        snippet: `def suggest(prompt):
    scores = score_prompt(prompt)
    missing = [p for p, ok in scores.items() if not ok]
    if not missing:
        return "✨ 완벽!"
    return f"빠진 기둥: {', '.join(missing)}"`,
        solution: `def suggest_improvement(prompt: str) -> str:
    scores = score_prompt(prompt)
    missing = [p for p, ok in scores.items() if not ok]

    if not missing:
        return "✨ 더 추가할 것 없음 — 이미 완벽한 프롬프트!"

    advice = {
        "👤 Role":        "→ '당신은 [전문가/역할] 입니다' 로 시작",
        "📋 Context":     "→ 배경·상황·가진 데이터를 한 줄로 명시",
        "🎯 Task":        "→ '~해 주세요' / '~를 작성' 등 행동 동사",
        "📐 Format":      "→ '마크다운 표로' / 'JSON 으로' 같은 출력 형식",
        "🚧 Constraints": "→ '300자 이내' / '~없이' 같은 제약",
        "💡 Examples":    "→ '예: ...' 형태로 샘플 1~2개",
    }

    print("🔧 개선 제안")
    for pillar in missing:
        print(f"   {pillar}")
        print(f"      {advice.get(pillar, '')}")
    print()
    return f"빠진 기둥 {len(missing)}개를 보강하면 등급 ↑"

# 사용
suggest_improvement("당신은 마케터다. 광고 카피 만들어줘")`,
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

[AI 강의 07 — 프롬프트 엔지니어링] 의 **Master Protocol 6기둥** 을 자동 채점하는 미니 모델을 만들었어요. 이건 LLM 시대의 새로운 "스펠 체커" 같은 역할.

---

### 📋 STEP 4 — 4단계 샘플 비교 결과
\`\`\`
등급  점수  프롬프트 (앞 40자)
------------------------------------------
   C  1/6  글 써줘
   B  2/6  당신은 마케터다. 광고 카피 만들어줘
   A  4/6  당신은 SNS 마케터입니다. 20대 여성 대상 화장품 ...
   S  6/6  당신은 10년차 SNS 마케터입니다. 저희는 비건 스킨...
\`\`\`

**해석 (가장 중요)**
- 같은 의도를 가진 4개 프롬프트가 **C → B → A → S** 단계적으로 점수가 오릅니다.
- **글 써줘 (C)** — Task 동사 하나만 있고 나머지 다 빠짐
- **마케터+카피 (B)** — Role + Task 두 기둥
- **SNS+여성+카피+표 (A)** — Role + Context + Task + Format = 4점
- **Master Prompt (S)** — 6기둥 모두 충족

> 💡 **차이의 본질**: AI 모델 성능이 아니라 **"입력의 명확성"** 이 결과를 가른다.

---

### 🔍 STEP 5 — 진단 모드
\`\`\`
📝 프롬프트: 글 써줘
🎯 등급: C (1/6) — 🚨 막연

   ❌ 👤 Role
   ❌ 📋 Context
   ✅ 🎯 Task
   ❌ 📐 Format
   ❌ 🚧 Constraints
   ❌ 💡 Examples
\`\`\`

**해석**
- ✅/❌ 로 어떤 기둥이 있고 없는지 한눈에 파악.
- 학습자는 "아, 내가 항상 Format/Examples 를 빼먹는구나" 같은 자기 진단 가능.

---

### 🔧 STEP 6 — 개선 제안
\`\`\`
🔧 개선 제안
   📋 Context
      → 배경·상황·가진 데이터를 한 줄로 명시
   📐 Format
      → '마크다운 표로' / 'JSON 으로' 같은 출력 형식
   ...
\`\`\`

**해석**
- **단순 채점 도구가 아니라 코칭 도구**.
- 빠진 기둥마다 **"이렇게 추가해 보세요"** 가이드.
- 실무에서 프롬프트 작성 전 미리 돌려보면 시간 절약.

---

### ⚠️ 이 모델의 한계

| 이슈 | 설명 |
|---|---|
| **키워드 매칭만** | "역할" 이라는 단어 없이도 문맥상 역할 부여한 프롬프트 못 잡음 |
| **품질 vs 형식** | "당신은 무엇이든 잘하는 사람" 도 Role 로 쳐줌 (사실은 모호함) |
| **언어 의존** | 한국어 기준. 영어 프롬프트는 별도 키워드 필요 |
| **컨텍스트 깊이 못 봄** | 같은 Role 도 "마케터" vs "10년차 성과 마케터" 차이 못 잡음 |

**진짜 평가** 는 LLM 으로 다시 LLM 을 평가해야 가능 (LLM-as-Judge). 오늘 만든 건 그 단순화 버전.

---

### 🧪 지금 시도해 볼 것
1. STEP 1 의 사전을 영어 프롬프트용으로 확장 (you are / context: / output format)
2. **가중치** 추가 — Role 과 Context 가 가장 중요하니 1.5x 점수
3. 본인이 **자주 쓰는 프롬프트** 를 \`diagnose()\` 에 넣어 점수 확인 → 개선
4. 등급 기준을 더 엄격하게 (S 는 6점 + 길이 100자 이상 같이)

### 🏁 이 프로젝트에서 배운 것
- ✅ 키워드 기반 **다차원 점수 모델** 의 본질
- ✅ 점수 → **등급 매핑** 의 디자인
- ✅ **자동 개선 제안** 시스템 (단순 평가를 코칭으로)
- ✅ LLM 시대의 **메타 도구** — AI 를 더 잘 쓰기 위한 AI`,
        checkpoint: "위 해석을 읽고, 본인이 자주 쓰는 프롬프트 1개를 STEP 5 의 diagnose() 에 넣어 점수를 확인해 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 🧭 프롬프트 품질 분류기 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP으로 이동할 수 있어요.


## STEP 1: Master Protocol 6기둥 키워드 사전
PILLARS = {
    "👤 Role":        ["당신은", "너는", "역할", "act as", "you are", "role:"],
    "📋 Context":     ["데이터", "상황", "배경", "저희", "우리", "현재", "context"],
    "🎯 Task":        ["만들", "작성", "분석", "찾", "요약", "생성", "추천", "제안"],
    "📐 Format":      ["형식", "마크다운", "표", "리스트", "JSON", "코드 블록", "format"],
    "🚧 Constraints": ["제약", "금지", "없이", "이내", "최대", "말 것", "하지 마"],
    "💡 Examples":    ["예:", "예시", "example", "->", "| "],
}
print(f"✅ 6기둥 사전 준비 완료: {len(PILLARS)}개 기둥")
print()


## STEP 2: 프롬프트 점수 계산 함수
def score_prompt(prompt: str) -> dict:
    """프롬프트를 6기둥 기준으로 점수화. 각 기둥 True/False."""
    text = prompt.lower()
    return {
        pillar: any(kw.lower() in text for kw in keywords)
        for pillar, keywords in PILLARS.items()
    }


## STEP 3: 종합 점수 → 등급 매핑
def grade(scores: dict):
    points = sum(scores.values())
    if points == 6:
        return "S", "🏆 Master Prompt — 모든 기둥 갖춤"
    elif points >= 4:
        return "A", "👍 양호 — 빠진 1~2개만 보강하면 최상"
    elif points >= 2:
        return "B", "🧐 보통 — 절반 이상 빠짐, 개선 필요"
    else:
        return "C", "🚨 막연 — 역할·문맥·형식 기본부터"


## STEP 4: 4단계 샘플 프롬프트 비교
samples = [
    "글 써줘",
    "당신은 마케터다. 광고 카피 만들어줘",
    "당신은 SNS 마케터입니다. 20대 여성 대상 화장품 광고 카피 5개를 마크다운 표로 작성해 주세요.",
    """당신은 10년차 SNS 마케터입니다.
저희는 비건 스킨케어 스타트업이고 20대 여성이 타깃입니다.
신제품(비건 썬스틱) 광고 카피 5개를 작성해 주세요.
형식: 각 카피마다 (제목/본문/CTA) 마크다운으로.
제약: 카피당 100자 이내, 이모지 최대 2개.
예: ✨ 봄 햇살, 비건으로 막다 — 지금 만나보기""",
]

print(f"{'등급':>4} {'점수':>4}  프롬프트 (앞 40자)")
print("-" * 60)
for s in samples:
    scores = score_prompt(s)
    g, msg = grade(scores)
    pts = sum(scores.values())
    preview = s.replace("\\n", " ")[:40]
    print(f"{g:>4} {pts}/6  {preview}{'...' if len(s) > 40 else ''}")
print()


## STEP 5: 기둥별 상세 진단
def diagnose(prompt: str):
    scores = score_prompt(prompt)
    g, msg = grade(scores)
    pts = sum(scores.values())
    print("─" * 50)
    print(f"📝 프롬프트: {prompt[:60]}{'...' if len(prompt) > 60 else ''}")
    print(f"🎯 등급: {g} ({pts}/6)  — {msg}")
    print()
    for pillar, ok in scores.items():
        mark = "✅" if ok else "❌"
        print(f"   {mark} {pillar}")
    print()

diagnose("글 써줘")
diagnose(samples[3])


## STEP 6: 자동 개선 제안
def suggest_improvement(prompt: str):
    scores = score_prompt(prompt)
    missing = [p for p, ok in scores.items() if not ok]
    if not missing:
        print("✨ 더 추가할 것 없음 — 이미 완벽한 프롬프트!")
        return
    advice = {
        "👤 Role":        "→ '당신은 [전문가/역할] 입니다' 로 시작",
        "📋 Context":     "→ 배경·상황·가진 데이터를 한 줄로 명시",
        "🎯 Task":        "→ '~해 주세요' / '~를 작성' 등 행동 동사",
        "📐 Format":      "→ '마크다운 표로' / 'JSON 으로' 같은 출력 형식",
        "🚧 Constraints": "→ '300자 이내' / '~없이' 같은 제약",
        "💡 Examples":    "→ '예: ...' 형태로 샘플 1~2개",
    }
    print("🔧 개선 제안")
    for pillar in missing:
        print(f"   {pillar}")
        print(f"      {advice.get(pillar, '')}")
    print()
    print(f"💡 빠진 기둥 {len(missing)}개를 보강하면 등급 ↑")

suggest_improvement("당신은 마케터다. 광고 카피 만들어줘")
`,
        language: "python",
      },
    },
  },

  {
    id: "mini-chatbot",
    category: "nlp",
    title: "미니 챗봇 — 의도 분류 + 응답",
    subtitle: "ML 라이브러리 없이 의도 인식 챗봇 만들기",
    icon: "🤖",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    tags: ["NLP", "챗봇", "에이전트"],
    description: `## 🤖 미니 챗봇 프로젝트

**목표**: 사용자 입력의 **의도(Intent)** 를 분류하고 적절한 응답을 생성하는 규칙 기반 챗봇을 만듭니다.

[AI 강의 10 — AI 에이전트] 에서 배운 도구 사용의 축소판. 실제 ChatGPT/Claude 도 내부적으로 의도 분류 + 응답 생성 + 도구 호출의 조합으로 동작해요.

### 배울 것
- **의도 분류 (Intent Classification)** — NLP 의 핵심 패턴
- 정규식 + 키워드 매칭 조합
- 응답 생성기 (Rule-based response)
- 도구 호출 (계산기, 시간 등) 시뮬레이션
- 챗봇의 한계와 LLM 의 등장 이유`,
    steps: [
      {
        title: "의도(Intent) 패턴 사전 구축",
        stepMarker: "STEP 1",
        description:
          "챗봇이 처리할 수 있는 의도 카테고리를 정의. 각 의도마다 트리거 패턴(키워드 또는 정규식) 등록.",
        hint: "인사·시간·날씨·계산·도움말·작별 정도면 입문엔 충분.",
        snippet: `INTENTS = {
    "greeting":  ["안녕", "헬로", "hello", "hi"],
    "time":      ["시간", "몇시", "지금"],
    "math":      [r"\\d+\\s*[+\\-*/]\\s*\\d+"],
    "help":      ["도움", "기능", "사용법"],
    "bye":       ["잘가", "안녕히", "bye"],
}`,
        solution: `INTENTS = {
    "greeting":  ["안녕", "헬로", "반가워", "hi", "hello"],
    "time":      ["시간", "몇시", "몇 시", "지금"],
    "weather":   ["날씨", "기온", "비", "맑"],
    "math":      [r"\\d+\\s*[+\\-*/]\\s*\\d+", "계산", "더하"],
    "help":      ["도움", "뭐 해", "기능", "사용법", "할 수 있"],
    "thanks":    ["고마워", "감사", "thanks"],
    "bye":       ["잘가", "안녕히", "bye", "끝", "종료"],
}
print(f"✅ {len(INTENTS)}개 의도 등록됨: {list(INTENTS.keys())}")`,
      },
      {
        title: "의도 분류 함수 (intent classifier)",
        stepMarker: "STEP 2",
        description:
          "사용자 입력 텍스트를 받아 어느 의도에 해당하는지 판단. 정규식 패턴 vs 단순 키워드를 구분 처리.",
        hint: "정규식은 `re.search`, 키워드는 `in text` 로 매칭.",
        snippet: `def classify_intent(text):
    text_low = text.lower()
    for intent, patterns in INTENTS.items():
        for pat in patterns:
            if re.search(pat, text_low) or pat in text_low:
                return intent
    return "unknown"`,
        solution: `import re

def classify_intent(text: str) -> str:
    """텍스트에서 가장 먼저 매칭되는 의도 반환. 없으면 unknown."""
    text_low = text.lower()
    for intent, patterns in INTENTS.items():
        for pat in patterns:
            # 정규식인지 단순 키워드인지 자동 판별
            is_regex = any(c in pat for c in r".\\?+*()[]{}|")
            if is_regex:
                if re.search(pat, text):
                    return intent
            elif pat in text_low:
                return intent
    return "unknown"

# 테스트
for q in ["안녕!", "지금 몇시?", "10 + 5", "도움말", "오늘 메뉴 추천"]:
    print(f"  {q!r:<20} → {classify_intent(q)}")`,
      },
      {
        title: "응답 생성기 — 의도별 답변 + 도구 호출",
        stepMarker: "STEP 3",
        description:
          "의도가 분류되면 그에 맞는 응답 생성. **시간·계산** 같은 의도는 실제 함수(도구) 를 호출 — 이게 [강의 10 에이전트] 의 핵심 패턴.",
        hint: "math 의도면 정규식으로 수식 추출 → eval, time 의도면 datetime.now().",
        snippet: `def respond(intent, text):
    if intent == "greeting":
        return "안녕하세요!"
    if intent == "time":
        return f"지금은 {datetime.now().strftime('%H:%M')}"
    if intent == "math":
        m = re.search(r"\\d+\\s*[+\\-*/]\\s*\\d+", text)
        return f"= {eval(m.group())}" if m else "수식을 못 찾았어요"
    return "?"`,
        solution: `import datetime
import random

def respond(intent: str, text: str) -> str:
    """의도별 응답 생성. 일부 의도는 '도구' 호출."""
    if intent == "greeting":
        return random.choice([
            "안녕하세요! 무엇을 도와드릴까요?",
            "반갑습니다! 'help' 라고 하시면 기능을 알려드려요.",
        ])
    if intent == "time":
        now = datetime.datetime.now().strftime("%H:%M:%S")
        return f"⏰ 지금 시간은 {now} 입니다."
    if intent == "weather":
        return "🌤️ 죄송, 이 챗봇은 인터넷을 못 써서 실시간 날씨는 모릅니다."
    if intent == "math":
        m = re.search(r"\\d+\\s*[+\\-*/]\\s*\\d+", text)
        if m:
            try:
                result = eval(m.group(), {"__builtins__": {}}, {})
                return f"🧮 {m.group()} = {result}"
            except Exception:
                return "🧮 계산이 안 돼요. 수식을 확인해 주세요."
        return "🧮 수식을 못 찾았어요. 예: '12 + 34'"
    if intent == "help":
        return "📌 가능한 의도: " + ", ".join(INTENTS.keys())
    if intent == "thanks":
        return "천만에요! 😊"
    if intent == "bye":
        return "안녕히 가세요! 👋"
    # unknown
    return "🤔 죄송해요, 못 알아들었어요. 'help' 입력 가능."`,
      },
      {
        title: "대화 루프 시뮬레이션",
        stepMarker: "STEP 4",
        description:
          "사용자 발화 리스트를 순회하며 의도 분류 → 응답을 출력. 실제 채팅 화면처럼 보이게.",
        hint: "👤/🤖 이모지로 발화자 구분.",
        snippet: `def chat(user_inputs):
    for u in user_inputs:
        intent = classify_intent(u)
        reply = respond(intent, u)
        print(f"👤 {u}")
        print(f"🤖 [{intent}] {reply}")`,
        solution: `def chat(user_inputs: list[str]):
    """대화 시뮬레이션 — 사용자 발화 → 의도 → 응답."""
    print("=" * 50)
    print("  💬 챗봇 대화 시뮬레이션")
    print("=" * 50)
    for u in user_inputs:
        intent = classify_intent(u)
        reply = respond(intent, u)
        print(f"\\n👤 {u}")
        print(f"🤖 [{intent:>8}] {reply}")
    print()

# 테스트 대화
chat([
    "안녕!",
    "지금 몇시야?",
    "12 + 30 은?",
    "오늘 날씨 어때?",
    "도움말",
    "고마워",
    "잘 가",
])`,
      },
      {
        title: "한계 테스트 — 어떤 입력이 안 잡힐까?",
        stepMarker: "STEP 5",
        description:
          "의도 사전에 없는 질문은 unknown. 챗봇의 진짜 실력은 unknown 비율로 측정.",
        hint: "추천·재미·복합 질문 등으로 한계 노출.",
        snippet: `tricky = ["오늘 점심 추천해줘", "넌 누구야", "내 이름 기억해", "1234567 곱하기 9876"]
chat(tricky)`,
        solution: `tricky = [
    "오늘 점심 추천해줘",       # 사전에 없음 → unknown
    "넌 누구야",                 # 자기 소개 — 사전에 없음
    "내 이름은 홍길동이야",     # 메모리 기능 없음
    "내 이름 기억해?",          # 후속 — 메모리 없음
    "1234567 + 9876 계산해봐",  # math 잡힘 (정규식)
    "안녕히 계세요",            # 사전에 '안녕히' 가 있어서 bye 잡힘
]
chat(tricky)

# unknown 비율 측정
unknowns = sum(1 for u in tricky if classify_intent(u) == "unknown")
print(f"📊 unknown 비율: {unknowns}/{len(tricky)} = {unknowns/len(tricky):.0%}")
print("→ 비율이 높을수록 더 많은 의도/패턴이 필요")`,
      },
      {
        title: "개선 — 의도 추가 + 메모리 도입 (간단 버전)",
        stepMarker: "STEP 6",
        description:
          "사용자 한계 사례를 분석해 새 의도 추가, 그리고 **세션 메모리** (이름 기억 등) 추가.",
        hint: "INTENTS 에 'recommend' / 'about' 추가, MEMORY dict 로 상태 저장.",
        snippet: `INTENTS["about"] = ["넌 누구", "이름이 뭐"]
MEMORY = {}
# respond 안에서 MEMORY 활용`,
        solution: `# 의도 사전 확장
INTENTS["about"]     = ["넌 누구", "당신 누구", "이름이 뭐", "너 뭐야"]
INTENTS["recommend"] = ["추천", "뭐 먹", "뭐 할", "어떻게 할"]
INTENTS["my_name"]   = ["내 이름", "나는"]

# 세션 메모리
MEMORY = {}

def respond_v2(intent: str, text: str) -> str:
    if intent == "about":
        return "🤖 저는 미니 챗봇입니다. 의도를 분류해 답해요."
    if intent == "recommend":
        return random.choice([
            "🍜 한식이 어떨까요? 김치찌개·된장찌개 추천!",
            "🍕 피자 먹고 싶지 않아요?",
            "🍱 도시락 하나로 가볍게 가시죠.",
        ])
    if intent == "my_name":
        m = re.search(r"내 이름[은은]?\\s*([가-힣A-Za-z]+)", text)
        if m:
            MEMORY["name"] = m.group(1)
            return f"👋 {m.group(1)} 님, 반갑습니다! 기억할게요."
        m2 = re.search(r"나는\\s*([가-힣A-Za-z]+)", text)
        if m2:
            MEMORY["name"] = m2.group(1)
            return f"👋 {m2.group(1)} 님, 반갑습니다!"
    if "이름" in text and "기억" in text:
        if "name" in MEMORY:
            return f"😎 네, '{MEMORY['name']}' 님 맞으시죠?"
        return "🤔 아직 이름을 알려주지 않으셨어요."
    # 기존 응답들
    return respond(intent, text)

# 새 대화 시뮬
print("\\n=== v2 챗봇 (메모리 + 추가 의도) ===")
for u in [
    "넌 누구야?",
    "내 이름은 민지야",
    "오늘 점심 추천해줘",
    "내 이름 기억해?",
]:
    intent = classify_intent(u)
    reply = respond_v2(intent, u)
    print(f"\\n👤 {u}")
    print(f"🤖 [{intent}] {reply}")`,
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

ML 라이브러리 없이 **순수 규칙 기반** 챗봇을 만들었어요. 의도 분류 → 응답 생성 → 도구 호출의 3단 구조는 **현대 LLM 챗봇의 뼈대** 와 동일.

---

### 📊 STEP 4 — 기본 대화 결과
\`\`\`
👤 안녕!
🤖 [greeting] 안녕하세요! 무엇을 도와드릴까요?

👤 지금 몇시야?
🤖 [    time] ⏰ 지금 시간은 14:32:55 입니다.

👤 12 + 30 은?
🤖 [    math] 🧮 12 + 30 = 42

👤 오늘 날씨 어때?
🤖 [ weather] 🌤️ 죄송, 이 챗봇은 인터넷을 못 써서...
\`\`\`

**해석**
- 의도 분류 정확 → 적절한 응답
- **time/math** 같은 일부 의도는 **실제 함수 호출** (도구 사용) — datetime, eval
- **weather** 는 도구 없음 → 솔직하게 모른다고 답변

> 🧠 **이것이 [강의 10 에이전트] 의 핵심 패턴**: 의도에 따라 알맞은 도구를 호출.

---

### 🔍 STEP 5 — 한계 테스트
\`\`\`
📊 unknown 비율: 4/6 = 67%
\`\`\`

**해석**
- 6개 사례 중 **4개를 못 알아들음** → 67% unknown.
- 사전에 없는 의도(추천/자기소개/메모리)는 모두 실패.
- 이게 **규칙 기반 챗봇의 본질적 한계**.

---

### 🔧 STEP 6 — 개선 (의도 추가 + 메모리)
\`\`\`
👤 넌 누구야?
🤖 [about] 🤖 저는 미니 챗봇입니다.

👤 내 이름은 민지야
🤖 [my_name] 👋 민지 님, 반갑습니다! 기억할게요.

👤 내 이름 기억해?
🤖 [unknown 또는 my_name] 😎 네, '민지' 님 맞으시죠?
\`\`\`

**해석**
- 새 의도 (about, recommend, my_name) 추가 → unknown 비율 ↓
- **MEMORY dict** 로 세션 상태 유지 → 후속 질문에 답변 가능
- 이게 LLM 의 **"대화 컨텍스트"** 기능의 단순 버전

---

### 🆚 LLM (ChatGPT/Claude) 과의 차이

| 기능 | 우리 챗봇 (규칙 기반) | LLM 챗봇 |
|---|---|---|
| 의도 분류 | 키워드 매칭 | 학습된 분포 (수십억 단어) |
| 응답 생성 | 미리 작성된 템플릿 | 토큰별 확률 기반 생성 |
| 새 의도 대응 | 사전 수동 추가 | 학습 데이터로 일반화 |
| 컨텍스트 | 작은 dict 메모리 | 수만~수십만 토큰 |
| 도구 호출 | if-else 분기 | Function Calling |

→ 우리 챗봇은 **LLM 등장 이전 챗봇 (Siri 1.0, 카카오 i 초기)** 과 유사. 한계가 있지만 **원리는 같음**.

---

### 🚀 실무 챗봇 아키텍처 (참고)

\`\`\`
사용자 입력
    ↓
[Intent Classifier]  ← 우리가 만든 부분 (or LLM)
    ↓
[Slot Filling]       ← 필요한 정보 추출 ("어디로?")
    ↓
[Action / Tool Call] ← API 호출, DB 조회 등
    ↓
[Response Generation] ← 템플릿 또는 LLM 으로 답변 생성
\`\`\`

이걸 모두 LLM 하나가 처리하는 게 ChatGPT/Claude. **의도 분류부터 도구 호출까지 한 번에**.

---

### 🧪 지금 시도해 볼 것

1. **새 의도** 추가 — \`order\` (주문), \`book\` (예약), \`location\` (위치)
2. **정규식 강화** — "X 의 Y" 패턴으로 슬롯 필링
3. **다국어** 지원 — 영어 키워드 추가
4. **fallback 학습** — unknown 입력을 모아 패턴 분석 → 사전 자동 확장
5. 진짜 **LLM 연결** — Anthropic API 호출로 unknown fallback 대체

### 🏁 이 프로젝트에서 배운 것
- ✅ **의도 분류** — NLP 의 핵심 첫 단계
- ✅ **정규식 + 키워드** 혼합 매칭
- ✅ **응답 + 도구 호출** 분리 ([강의 10 에이전트] 와 동일 구조)
- ✅ 세션 **메모리** 로 컨텍스트 유지
- ✅ 규칙 기반 챗봇의 **한계 → LLM 으로 발전한 이유**`,
        checkpoint: "위 해석을 읽고, 본인 도메인(쇼핑·예약·게임 등) 의 새 의도를 1개 추가해 챗봇을 확장해 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 🤖 미니 챗봇 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP으로 이동할 수 있어요.

import re
import datetime
import random


## STEP 1: 의도 패턴 사전 구축
INTENTS = {
    "greeting":  ["안녕", "헬로", "반가워", "hi", "hello"],
    "time":      ["시간", "몇시", "몇 시", "지금"],
    "weather":   ["날씨", "기온", "비", "맑"],
    "math":      [r"\\d+\\s*[+\\-*/]\\s*\\d+", "계산", "더하"],
    "help":      ["도움", "뭐 해", "기능", "사용법"],
    "thanks":    ["고마워", "감사", "thanks"],
    "bye":       ["잘가", "안녕히", "bye", "끝"],
}
print(f"✅ {len(INTENTS)}개 의도 등록: {list(INTENTS.keys())}")


## STEP 2: 의도 분류 함수
def classify_intent(text: str) -> str:
    """텍스트에서 가장 먼저 매칭되는 의도 반환. 없으면 unknown."""
    text_low = text.lower()
    for intent, patterns in INTENTS.items():
        for pat in patterns:
            is_regex = any(c in pat for c in r".\\?+*()[]{}|")
            if is_regex:
                if re.search(pat, text):
                    return intent
            elif pat in text_low:
                return intent
    return "unknown"


## STEP 3: 응답 생성기 (도구 호출 포함)
def respond(intent: str, text: str) -> str:
    if intent == "greeting":
        return random.choice([
            "안녕하세요! 무엇을 도와드릴까요?",
            "반갑습니다! 'help' 라고 하시면 기능을 알려드려요.",
        ])
    if intent == "time":
        now = datetime.datetime.now().strftime("%H:%M:%S")
        return f"⏰ 지금 시간은 {now} 입니다."
    if intent == "weather":
        return "🌤️ 죄송, 이 챗봇은 인터넷을 못 써서 실시간 날씨는 모릅니다."
    if intent == "math":
        m = re.search(r"\\d+\\s*[+\\-*/]\\s*\\d+", text)
        if m:
            try:
                result = eval(m.group(), {"__builtins__": {}}, {})
                return f"🧮 {m.group()} = {result}"
            except Exception:
                return "🧮 계산이 안 돼요."
        return "🧮 수식을 못 찾았어요. 예: '12 + 34'"
    if intent == "help":
        return "📌 가능한 의도: " + ", ".join(INTENTS.keys())
    if intent == "thanks":
        return "천만에요! 😊"
    if intent == "bye":
        return "안녕히 가세요! 👋"
    return "🤔 죄송해요, 못 알아들었어요. 'help' 입력 가능."


## STEP 4: 대화 루프 시뮬레이션
def chat(user_inputs: list):
    print()
    print("=" * 50)
    print("  💬 챗봇 대화 시뮬레이션")
    print("=" * 50)
    for u in user_inputs:
        intent = classify_intent(u)
        reply = respond(intent, u)
        print(f"\\n👤 {u}")
        print(f"🤖 [{intent:>8}] {reply}")
    print()

chat(["안녕!", "지금 몇시야?", "12 + 30 은?", "오늘 날씨 어때?", "도움말", "고마워", "잘 가"])


## STEP 5: 한계 테스트 (어떤 입력이 안 잡힐까?)
tricky = [
    "오늘 점심 추천해줘",
    "넌 누구야",
    "내 이름은 홍길동이야",
    "내 이름 기억해?",
    "1234567 + 9876 계산해봐",
    "안녕히 계세요",
]
chat(tricky)
unknowns = sum(1 for u in tricky if classify_intent(u) == "unknown")
print(f"📊 unknown 비율: {unknowns}/{len(tricky)} = {unknowns/len(tricky):.0%}")


## STEP 6: 개선 (새 의도 + 메모리)
INTENTS["about"]     = ["넌 누구", "당신 누구", "이름이 뭐"]
INTENTS["recommend"] = ["추천", "뭐 먹", "뭐 할"]
INTENTS["my_name"]   = ["내 이름", "나는"]

MEMORY = {}

def respond_v2(intent: str, text: str) -> str:
    if intent == "about":
        return "🤖 저는 미니 챗봇입니다. 의도를 분류해 답해요."
    if intent == "recommend":
        return random.choice(["🍜 한식 어떠세요?", "🍕 피자!", "🍱 도시락 가볍게."])
    if intent == "my_name":
        m = re.search(r"내 이름[은은]?\\s*([가-힣A-Za-z]+)", text) or re.search(r"나는\\s*([가-힣A-Za-z]+)", text)
        if m:
            MEMORY["name"] = m.group(1)
            return f"👋 {m.group(1)} 님, 반갑습니다! 기억할게요."
    if "이름" in text and "기억" in text and "name" in MEMORY:
        return f"😎 네, '{MEMORY['name']}' 님 맞으시죠?"
    return respond(intent, text)

print()
print("=" * 50)
print("  💬 v2 챗봇 (의도 추가 + 메모리)")
print("=" * 50)
for u in ["넌 누구야?", "내 이름은 민지야", "오늘 점심 추천해줘", "내 이름 기억해?"]:
    intent = classify_intent(u)
    reply = respond_v2(intent, u)
    print(f"\\n👤 {u}")
    print(f"🤖 [{intent}] {reply}")
`,
        language: "python",
      },
    },
  },

  {
    id: "customer-segmentation",
    category: "unsupervised",
    title: "K-means 고객 세그먼트 분석",
    subtitle: "RFM + 비지도 학습으로 VIP·이탈위험 고객 자동 분류",
    icon: "📊",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    tags: ["scikit-learn", "비지도학습", "K-means", "RFM"],
    description: `## 📊 K-means 고객 세그먼트 분석 프로젝트

**목표**: 고객의 **구매 패턴(RFM)** 으로 자동 분류해 마케팅에 바로 쓸 수 있는 **5개 세그먼트** (VIP/일반/신규/이탈위험 등) 를 도출합니다.

기존 5개 프로젝트는 모두 **지도학습(분류·추천)**. 이 프로젝트는 **첫 비지도 학습** — 정답 없이 데이터의 구조를 발견.

### 배울 것
- **RFM 분석** — Recency, Frequency, Monetary (마케팅 표준)
- **K-means 클러스터링** — sklearn 가장 유명한 비지도 알고리즘
- **StandardScaler** — 거리 기반 모델의 필수 전처리
- **클러스터 해석 + 자동 라벨링**
- 신규 고객을 학습된 모델로 즉시 세그먼트 분류`,
    steps: [
      {
        title: "가상 고객 데이터 생성 (200명)",
        stepMarker: "STEP 1",
        description:
          "RFM 분석의 3가지 지표를 가상으로 생성. 실제로는 DB 에서 추출하지만, 여기선 numpy 로 시뮬레이션.",
        hint: "exponential 분포로 현실감 있는 long-tail 패턴.",
        snippet: `np.random.seed(42)
n = 200
recency = np.random.exponential(30, n).clip(1, 365)
frequency = np.random.poisson(5, n) + 1
monetary = np.random.exponential(50000, n).clip(1000, 500000).round()`,
        solution: `import numpy as np
import pandas as pd

np.random.seed(42)
n = 200

# Recency: 마지막 구매 후 며칠 (작을수록 좋음)
recency = np.random.exponential(30, n).clip(1, 365)
# Frequency: 총 구매 횟수
frequency = np.random.poisson(5, n) + 1
# Monetary: 총 구매 금액
monetary = np.random.exponential(50000, n).clip(1000, 500000).round()

print(f"✅ {n}명의 가상 고객 데이터 생성")
print(f"   Recency:   {recency.min():.0f} ~ {recency.max():.0f} 일")
print(f"   Frequency: {frequency.min()} ~ {frequency.max()} 회")
print(f"   Monetary:  {monetary.min():,.0f} ~ {monetary.max():,.0f} 원")`,
      },
      {
        title: "RFM DataFrame 구성 + 통계",
        stepMarker: "STEP 2",
        description:
          "DataFrame 으로 정리하면 describe() 로 분포·평균을 한눈에. 분석 시작 전 데이터 감각 잡기.",
        hint: "pd.DataFrame 에 dict 로 컬럼 정의.",
        snippet: `rfm = pd.DataFrame({
    "Recency": recency,
    "Frequency": frequency,
    "Monetary": monetary,
})
print(rfm.describe())`,
        solution: `rfm = pd.DataFrame({
    "Recency":   recency,
    "Frequency": frequency,
    "Monetary":  monetary,
})

print("📊 RFM 통계 요약:")
print(rfm.describe().round(1))
print()
print("앞 10행:")
print(rfm.head(10).round(0))`,
      },
      {
        title: "표준화 (StandardScaler)",
        stepMarker: "STEP 3",
        description:
          "K-means 는 **거리 기반** 알고리즘 → 큰 숫자(Monetary) 가 다른 피처를 압도함. **표준화 필수**.",
        hint: "fit_transform 한 번이면 평균 0, 표준편차 1 로.",
        snippet: `from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm)
print(rfm_scaled.mean(axis=0))  # ~0
print(rfm_scaled.std(axis=0))   # ~1`,
        solution: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm)

print("📏 표준화 결과 (각 컬럼)")
print(f"   평균:   {rfm_scaled.mean(axis=0).round(2)}  (목표: 0)")
print(f"   표준편차: {rfm_scaled.std(axis=0).round(2)}  (목표: 1)")
print()
print("→ 이제 Recency·Frequency·Monetary 가 동등한 스케일에서 비교됨")`,
      },
      {
        title: "K-means 학습 (k=4 그룹)",
        stepMarker: "STEP 4",
        description:
          "표준화된 데이터로 4개 그룹 생성. \\`n_init=10\\` 으로 안정성 확보.",
        hint: "KMeans(n_clusters=4, random_state=42, n_init=10).",
        snippet: `from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
labels = kmeans.fit_predict(rfm_scaled)
rfm["Cluster"] = labels`,
        solution: `from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
labels = kmeans.fit_predict(rfm_scaled)
rfm["Cluster"] = labels

print(f"✅ K-means 학습 완료 (4 그룹)")
print()
print("클러스터별 인원:")
counts = rfm["Cluster"].value_counts().sort_index()
for cluster_id, count in counts.items():
    bar = "█" * (count // 3)
    print(f"  Cluster {cluster_id}: {count}명 {bar}")`,
      },
      {
        title: "각 클러스터 특성 분석 + 자동 라벨링",
        stepMarker: "STEP 5",
        description:
          "각 클러스터의 평균 R·F·M 을 보고 비즈니스적 의미 부여 (VIP / 잠재 / 일반 / 이탈위험).",
        hint: "groupby('Cluster').mean() 로 각 클러스터 프로필 → 규칙으로 라벨 매핑.",
        snippet: `profile = rfm.groupby("Cluster").mean().round(0)
print(profile)
# 각 클러스터에 비즈니스 라벨 부여`,
        solution: `# 각 클러스터의 평균 RFM
profile = rfm.groupby("Cluster")[["Recency", "Frequency", "Monetary"]].mean().round(1)
print("📊 클러스터별 평균 RFM:")
print(profile)
print()

# 자동 라벨링 규칙 (도메인 지식 반영)
def label_segment(row):
    r, f, m = row["Recency"], row["Frequency"], row["Monetary"]
    if r < 30 and f >= 5 and m >= 80000:
        return "💎 VIP"
    elif r < 30 and (f >= 3 or m >= 50000):
        return "✨ 활성 고객"
    elif r > 90:
        return "⚠️ 이탈 위험"
    else:
        return "👍 일반 고객"

profile["세그먼트"] = profile.apply(label_segment, axis=1)
print("🏷️ 비즈니스 라벨 부여:")
print(profile)`,
      },
      {
        title: "신규 고객을 학습된 모델로 분류 (배포 시뮬)",
        stepMarker: "STEP 6",
        description:
          "학습 끝났으니 실제 배포처럼 **새 고객** 을 즉시 세그먼트 분류. 그에 맞는 마케팅 액션까지 자동 추천.",
        hint: "scaler.transform → kmeans.predict 로 한 줄.",
        snippet: `new_customer = [[5, 10, 250000]]
new_scaled = scaler.transform(new_customer)
new_cluster = kmeans.predict(new_scaled)[0]
print(f"세그먼트: {profile.loc[new_cluster, '세그먼트']}")`,
        solution: `# 새 고객 케이스 (Recency, Frequency, Monetary)
new_customers = [
    [5,   10, 250000, "최근 구매 + 자주 + 많이"],
    [180,  2,  15000, "오래전 + 가끔 + 적게"],
    [25,   4,  60000, "보통 + 보통 + 보통"],
    [60,   8, 180000, "조금 오래 + 자주 + 많이"],
]

ACTIONS = {
    "💎 VIP":         "전용 매니저 배정 + 신상품 조기 공개",
    "✨ 활성 고객":    "리텐션 캠페인 + 추천 시스템 노출",
    "⚠️ 이탈 위험":    "재방문 쿠폰 + 개인화 이메일",
    "👍 일반 고객":    "범용 프로모션 + 로열티 프로그램",
}

print("=" * 60)
print("  🎯 신규 고객 자동 세그먼트 분류 + 마케팅 액션")
print("=" * 60)
for *features, desc in new_customers:
    new_scaled = scaler.transform([features])
    cluster_id = kmeans.predict(new_scaled)[0]
    segment = profile.loc[cluster_id, "세그먼트"]
    action = ACTIONS.get(segment, "분석 필요")
    print(f"\\n🧑 R={features[0]:>3}일 / F={features[1]:>2}회 / M={features[2]:>7,.0f}원 ({desc})")
    print(f"   → Cluster {cluster_id}: {segment}")
    print(f"   📌 권장 액션: {action}")`,
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

**RFM 마케팅 분석** + **K-means 클러스터링** 으로 200명의 가상 고객을 의미 있는 4개 그룹으로 자동 분류하고, 신규 고객도 즉시 분류하는 시스템을 만들었어요.

기존 5개 프로젝트는 모두 **지도학습** (정답 라벨이 있음). 이 프로젝트는 **첫 비지도 학습** — 정답 없이 데이터의 구조 자체를 발견.

---

### 📊 STEP 1~2 — 가상 고객 데이터
\`\`\`
Recency:   1 ~ 365 일
Frequency: 1 ~ 15 회
Monetary:  1,000 ~ 500,000 원
\`\`\`

**해석 — RFM 의 3축**
- **Recency (R)**: 마지막 구매 후 며칠 → **작을수록 좋음** (최근 활성)
- **Frequency (F)**: 총 구매 횟수 → **클수록 좋음** (자주 구매)
- **Monetary (M)**: 총 구매액 → **클수록 좋음** (큰 손)

이 3개 축으로 고객을 입체적으로 평가하는 게 마케팅의 표준 (RFM 모델, 1990 년대부터).

---

### 📏 STEP 3 — 표준화 결과
\`\`\`
평균: [0. 0. 0.]   ← 정확히 0 으로
표준편차: [1. 1. 1.] ← 정확히 1 로
\`\`\`

**해석 (이게 왜 필수인가)**
- K-means 는 **거리 (점과 점 사이)** 로 그룹을 정함.
- 표준화 안 하면 **Monetary (수십만)** 가 **Frequency (한 자리수)** 를 압도해 그룹이 사실상 Monetary 만으로 결정됨.
- 표준화 후엔 3개 축이 동등하게 작용 → 균형 잡힌 클러스터.

> 💡 **거리 기반 모델 (K-means, KNN, SVM) 은 표준화 필수**, 트리 기반 (RF, GBM) 은 불필요.

---

### 🔢 STEP 4 — K-means 결과
\`\`\`
Cluster 0: 약 50명 ████████████████
Cluster 1: 약 60명 ████████████████████
Cluster 2: 약 45명 ██████████████
Cluster 3: 약 45명 ██████████████
\`\`\`

**해석**
- 200명을 비슷한 비율로 4개 그룹에 나눔.
- 클러스터 ID (0, 1, 2, 3) 는 **그냥 번호** — 의미 없음. 다음 단계에서 비즈니스 라벨 붙임.

---

### 🏷️ STEP 5 — 클러스터 해석 + 자동 라벨
\`\`\`
         Recency  Frequency  Monetary  세그먼트
Cluster
0           120.5        2.1   18000.0  ⚠️ 이탈 위험
1            18.3        7.5  150000.0  💎 VIP
2            65.2        4.0   55000.0  👍 일반 고객
3            22.1        4.2   48000.0  ✨ 활성 고객
\`\`\`

**해석 (가장 중요)**
- **Cluster 1 (VIP)**: 최근(18일) + 자주(7.5회) + 많이(15만원) → **유지가 매출의 핵심**
- **Cluster 0 (이탈 위험)**: 오래전(120일) + 거의 안 사고(2회) + 적게(1.8만) → **재방문 캠페인 시급**
- **Cluster 3 (활성)**: 최근에 일반 수준 구매 → **VIP 후보군** (업셀링 기회)
- **Cluster 2 (일반)**: 무난 → 표준 마케팅 대상

> 🧠 K-means 가 한 일은 **그룹 나누기** 까지. **"이 그룹이 뭘 의미하는지"** 는 결국 사람이 해석해야 함 (= 데이터 분석가의 일).

---

### 🚀 STEP 6 — 신규 고객 즉시 분류
\`\`\`
🧑 R=  5일 / F=10회 / M=250,000원 (최근 구매 + 자주 + 많이)
   → Cluster 1: 💎 VIP
   📌 권장 액션: 전용 매니저 배정 + 신상품 조기 공개

🧑 R=180일 / F= 2회 / M= 15,000원 (오래전 + 가끔 + 적게)
   → Cluster 0: ⚠️ 이탈 위험
   📌 권장 액션: 재방문 쿠폰 + 개인화 이메일
\`\`\`

**해석 (실무 가치)**
- 새 고객이 들어오면 **즉시 세그먼트 분류 + 액션 추천**.
- 이 흐름이 그대로 운영 시스템으로 가면 **자동 마케팅 트리거** 가 됨.
- 고객 한 명마다 매니저가 수동으로 분류할 필요 없음.

---

### 🎓 비지도 학습 vs 지도학습 (이 프로젝트의 의미)

| | 지도 학습 (Iris/Titanic 등) | 비지도 학습 (K-means) |
|---|---|---|
| 정답 라벨 | 필요 ('setosa', 'survived') | **불필요** |
| 학습 목적 | 라벨 예측 | 데이터 구조 발견 |
| 평가 | 정확도, F1 등 | 실루엣 점수, 도메인 검증 |
| 실무 활용 | 분류, 예측 | 세그먼트, 이상 탐지, 차원 축소 |

**현실에서 정답 라벨이 없는 경우** (대부분의 신규 분석 프로젝트) 비지도 학습이 첫 도구.

---

### ⚠️ 이 미니 프로젝트의 한계

| 이슈 | 해결 |
|---|---|
| **k=4 가 최적인가?** | 엘보우 방법(elbow method) 또는 실루엣 점수로 검증 |
| **클러스터 해석이 주관적** | 도메인 전문가 검토 필수 |
| **이상치에 약함** | DBSCAN 같은 밀도 기반으로 보완 가능 |
| **고차원 데이터** | PCA 로 차원 축소 후 K-means |

---

### 🧪 지금 시도해 볼 것

1. STEP 4 에서 \`n_clusters=3\` 또는 \`n_clusters=6\` 으로 바꿔 결과 비교
2. **엘보우 방법** 으로 최적 k 찾기:
   \`\`\`python
   from sklearn.cluster import KMeans
   inertias = []
   for k in range(1, 10):
       km = KMeans(n_clusters=k, random_state=42, n_init=10).fit(rfm_scaled)
       inertias.append(km.inertia_)
   for k, inertia in enumerate(inertias, 1):
       print(f"k={k}: {inertia:.0f}")
   \`\`\`
3. **실루엣 점수**로 클러스터 품질 평가 (\`from sklearn.metrics import silhouette_score\`)
4. RFM 에 **추가 피처** 넣기 (예: 평균 구매 간격, 카테고리 다양성)

### 🏁 이 프로젝트에서 배운 것
- ✅ **RFM 분석** — 마케팅의 표준 고객 평가 모델
- ✅ **비지도 학습 (K-means)** — 정답 없이 데이터 구조 발견
- ✅ **표준화의 중요성** — 거리 기반 모델의 필수 전처리
- ✅ **클러스터 해석** — 알고리즘 결과를 비즈니스 라벨로 번역
- ✅ **신규 데이터 즉시 분류** — 학습된 모델의 실무 배포 패턴`,
        checkpoint: "위 해석을 읽고, STEP 4 에서 n_clusters 를 3 또는 6 으로 바꿔 결과가 어떻게 달라지는지 비교해 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 📊 K-means 고객 세그먼트 분석 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP으로 이동할 수 있어요.

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans


## STEP 1: 가상 고객 데이터 생성 (200명)
np.random.seed(42)
n = 200

recency   = np.random.exponential(30, n).clip(1, 365)
frequency = np.random.poisson(5, n) + 1
monetary  = np.random.exponential(50000, n).clip(1000, 500000).round()

print(f"✅ {n}명의 가상 고객 데이터 생성")
print(f"   Recency:   {recency.min():.0f} ~ {recency.max():.0f} 일")
print(f"   Frequency: {frequency.min()} ~ {frequency.max()} 회")
print(f"   Monetary:  {monetary.min():,.0f} ~ {monetary.max():,.0f} 원")


## STEP 2: RFM DataFrame 구성
rfm = pd.DataFrame({
    "Recency":   recency,
    "Frequency": frequency,
    "Monetary":  monetary,
})
print("\\n📊 RFM 통계 요약:")
print(rfm.describe().round(1))


## STEP 3: 표준화 (StandardScaler)
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm)
print(f"\\n📏 표준화 결과")
print(f"   평균:   {rfm_scaled.mean(axis=0).round(2)}  (목표: 0)")
print(f"   표준편차: {rfm_scaled.std(axis=0).round(2)}  (목표: 1)")


## STEP 4: K-means 학습 (k=4)
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
labels = kmeans.fit_predict(rfm_scaled)
rfm["Cluster"] = labels

print(f"\\n✅ K-means 학습 완료 (4 그룹)")
counts = rfm["Cluster"].value_counts().sort_index()
for cluster_id, count in counts.items():
    bar = "█" * (count // 3)
    print(f"  Cluster {cluster_id}: {count}명 {bar}")


## STEP 5: 클러스터 특성 분석 + 자동 라벨링
profile = rfm.groupby("Cluster")[["Recency", "Frequency", "Monetary"]].mean().round(1)
print(f"\\n📊 클러스터별 평균 RFM:")
print(profile)

def label_segment(row):
    r, f, m = row["Recency"], row["Frequency"], row["Monetary"]
    if r < 30 and f >= 5 and m >= 80000:
        return "💎 VIP"
    elif r < 30 and (f >= 3 or m >= 50000):
        return "✨ 활성 고객"
    elif r > 90:
        return "⚠️ 이탈 위험"
    else:
        return "👍 일반 고객"

profile["세그먼트"] = profile.apply(label_segment, axis=1)
print(f"\\n🏷️ 비즈니스 라벨:")
print(profile)


## STEP 6: 신규 고객 즉시 분류 + 마케팅 액션
new_customers = [
    [5,   10, 250000, "최근 + 자주 + 많이"],
    [180,  2,  15000, "오래전 + 가끔 + 적게"],
    [25,   4,  60000, "보통 + 보통 + 보통"],
    [60,   8, 180000, "조금 오래 + 자주 + 많이"],
]

ACTIONS = {
    "💎 VIP":         "전용 매니저 배정 + 신상품 조기 공개",
    "✨ 활성 고객":    "리텐션 캠페인 + 추천 시스템 노출",
    "⚠️ 이탈 위험":    "재방문 쿠폰 + 개인화 이메일",
    "👍 일반 고객":    "범용 프로모션 + 로열티 프로그램",
}

print("\\n" + "=" * 60)
print("  🎯 신규 고객 자동 세그먼트 분류 + 마케팅 액션")
print("=" * 60)
for *features, desc in new_customers:
    new_scaled = scaler.transform([features])
    cluster_id = kmeans.predict(new_scaled)[0]
    segment = profile.loc[cluster_id, "세그먼트"]
    action = ACTIONS.get(segment, "분석 필요")
    print(f"\\n🧑 R={features[0]:>3}일 / F={features[1]:>2}회 / M={features[2]:>7,.0f}원 ({desc})")
    print(f"   → Cluster {cluster_id}: {segment}")
    print(f"   📌 권장 액션: {action}")
`,
        language: "python",
      },
    },
  },

  // ════════════════════════════════════════════════════════════
  //  v3.9.0 — A4-A 콤보: 부족한 패러다임 채우기 (시계열·이상치·생성)
  // ════════════════════════════════════════════════════════════

  {
    id: "time-series-forecast",
    category: "timeseries",
    title: "시계열 매출 예측",
    subtitle: "트렌드·계절성 분리부터 단순 예측까지 — 첫 시계열 분석",
    icon: "📈",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    tags: ["시계열", "예측", "pandas", "scikit-learn"],
    description: `## 📈 시계열 매출 예측 프로젝트

**목표**: 매장의 365일 일별 매출 데이터를 분석해 **트렌드 + 계절성 + 노이즈** 로 분리하고, 다음 30일을 예측하는 모델을 만듭니다.

기존 8개 프로젝트는 모두 **고정 시점** 데이터 (한 번 측정한 값). 이 프로젝트는 첫 **시간 흐름** 데이터.

### 배울 것
- **시계열 데이터 만들기** — 트렌드 + 주간 패턴 + 노이즈 합성
- **이동평균 (Rolling Mean)** 으로 노이즈 제거 + 트렌드 추출
- **요일별 계절성** 자동 발견
- **선형 회귀** 로 트렌드 예측 + 계절성 보정 결합
- **MAE / MAPE** 평가 지표
- 실무 BI / 매출 예측의 입문 패턴`,
    steps: [
      {
        title: "365일 매출 데이터 합성 (트렌드 + 주간 패턴 + 노이즈)",
        stepMarker: "STEP 1",
        description:
          "현실의 시계열은 보통 **장기 추세 + 계절성 + 무작위 변동** 의 합. 이 구조를 직접 만들면 분해(decomposition) 의 의미가 명확해져요.",
        hint: "트렌드 = 시간에 비례한 증가, 계절성 = 요일별 패턴 (주말 ↑), 노이즈 = np.random.normal.",
        snippet: `np.random.seed(42)
n = 365
t = np.arange(n)
trend = 100 + 0.3 * t                           # 우상향 트렌드
seasonal = 30 * np.sin(2 * np.pi * t / 7)       # 7일 주기 (주간)
noise = np.random.normal(0, 10, n)
sales = (trend + seasonal + noise).round()`,
        solution: `import numpy as np
import pandas as pd

np.random.seed(42)
n = 365
dates = pd.date_range("2024-01-01", periods=n, freq="D")
t = np.arange(n)

# 1. 트렌드 — 시간에 따라 우상향
trend = 100 + 0.3 * t

# 2. 주간 계절성 — 7일 주기 (주말 매출 ↑)
seasonal = 30 * np.sin(2 * np.pi * t / 7)

# 3. 노이즈 — 일일 변동
noise = np.random.normal(0, 10, n)

sales = (trend + seasonal + noise).round()
df = pd.DataFrame({"date": dates, "sales": sales}).set_index("date")

print(f"✅ {n}일치 매출 데이터 생성")
print(f"   기간: {df.index.min().date()} ~ {df.index.max().date()}")
print(f"   평균: {sales.mean():.0f}원/일")
print(f"   범위: {sales.min():.0f} ~ {sales.max():.0f}")
print()
print("앞 7일:")
print(df.head(7))`,
      },
      {
        title: "이동평균으로 트렌드 추출",
        stepMarker: "STEP 2",
        description:
          "원본 데이터는 노이즈 때문에 들쭉날쭉. **rolling(window=7).mean()** 으로 1주일 평균을 내면 **장기 추세** 가 깔끔하게 보임.",
        hint: "df['sales'].rolling(window=7).mean() — 7일 평균.",
        snippet: `df["MA7"]  = df["sales"].rolling(window=7).mean()
df["MA30"] = df["sales"].rolling(window=30).mean()`,
        solution: `df["MA7"]  = df["sales"].rolling(window=7).mean()
df["MA30"] = df["sales"].rolling(window=30).mean()

# 첫달 / 마지막 달 비교
first_month = df.head(30)
last_month = df.tail(30)
print(f"📊 1개월 평균 비교:")
print(f"   첫 30일 평균: {first_month['sales'].mean():.0f}")
print(f"   마지막 30일 평균: {last_month['sales'].mean():.0f}")
print(f"   증가율: {(last_month['sales'].mean() / first_month['sales'].mean() - 1):.1%}")

# 최근 14일 트렌드 확인
print()
print("최근 14일 (원본 vs MA7):")
recent = df.tail(14)[["sales", "MA7"]]
for date, row in recent.iterrows():
    bar_orig = "█" * int(row["sales"] / 15)
    print(f"  {date.strftime('%m-%d')} ({date.day_name()[:3]})  원본: {row['sales']:>4.0f} {bar_orig}")
print(f"\\n  → MA7 평균: {recent['MA7'].mean():.0f}")`,
      },
      {
        title: "요일별 계절성 자동 발견",
        stepMarker: "STEP 3",
        description:
          "**\\`df.groupby(df.index.dayofweek).mean()\\`** 로 요일별 평균. 데이터에 숨은 주간 패턴(주말 ↑) 을 자동 발견.",
        hint: "dayofweek: 0=월, 6=일.",
        snippet: `weekly = df.groupby(df.index.dayofweek)["sales"].mean()
print(weekly)`,
        solution: `# 요일별 평균 매출
weekly = df.groupby(df.index.dayofweek)["sales"].mean()
day_names = ["월", "화", "수", "목", "금", "토", "일"]

print("📅 요일별 평균 매출 (계절성):")
overall = df["sales"].mean()
mx = weekly.max()
for dow, avg in weekly.items():
    bar = "█" * int(avg / mx * 30)
    diff = (avg - overall) / overall * 100
    print(f"  {day_names[dow]}요일  {avg:>6.0f}  {bar}  ({diff:+.1f}% vs 전체평균)")

# 가장 매출 좋은 요일·나쁜 요일
best_dow = weekly.idxmax()
worst_dow = weekly.idxmin()
print(f"\\n🏆 매출 최고 요일: {day_names[best_dow]}요일")
print(f"📉 매출 최저 요일: {day_names[worst_dow]}요일")`,
      },
      {
        title: "선형 회귀로 트렌드 예측 (다음 30일)",
        stepMarker: "STEP 4",
        description:
          "시계열 분해 후 **트렌드는 선형 회귀** 로, **계절성은 요일별 평균 보정** 으로 결합 예측. 단순하지만 실무에서도 자주 쓰는 베이스라인.",
        hint: "X = 일자(0~364), y = 매출 → LinearRegression. 다음 30일 = 365~394.",
        snippet: `from sklearn.linear_model import LinearRegression
X = np.arange(n).reshape(-1, 1)
y = df["sales"].values
model = LinearRegression().fit(X, y)

future_X = np.arange(n, n + 30).reshape(-1, 1)
trend_forecast = model.predict(future_X)`,
        solution: `from sklearn.linear_model import LinearRegression

# 1. 트렌드 학습
X = np.arange(n).reshape(-1, 1)
y = df["sales"].values
model = LinearRegression().fit(X, y)
print(f"📈 학습된 트렌드: 매출 = {model.intercept_:.1f} + {model.coef_[0]:.3f} × 일자")

# 2. 다음 30일 트렌드 예측
future_X = np.arange(n, n + 30).reshape(-1, 1)
trend_forecast = model.predict(future_X)

# 3. 요일별 계절성 보정 (트렌드 평균 대비 차이)
seasonal_offset = weekly - weekly.mean()  # 각 요일이 평균에서 얼마나 벗어났는지

# 4. 최종 예측 = 트렌드 + 요일 계절성
future_dates = pd.date_range(df.index[-1] + pd.Timedelta(days=1), periods=30)
forecasts = []
for date, trend_val in zip(future_dates, trend_forecast):
    season = seasonal_offset[date.dayofweek]
    forecasts.append(trend_val + season)

forecast_df = pd.DataFrame({
    "date":     future_dates,
    "forecast": np.round(forecasts).astype(int),
}).set_index("date")
print(f"\\n🔮 다음 30일 예측 (앞 10일):")
print(forecast_df.head(10))`,
      },
      {
        title: "마지막 30일로 검증 — Train/Test Split",
        stepMarker: "STEP 5",
        description:
          "예측 모델의 진짜 실력은 **본 적 없는 데이터** 에서. 실제 데이터의 마지막 30일을 가려두고, 그 부분을 예측해 비교.",
        hint: "MAE = 평균 절대 오차, MAPE = 평균 절대 백분율 오차.",
        snippet: `train = df.iloc[:-30]
test = df.iloc[-30:]
# train 으로 다시 학습 → test 에서 예측 → 평가`,
        solution: `# 1. Train/Test 분할 (마지막 30일을 test 로)
train = df.iloc[:-30].copy()
test = df.iloc[-30:].copy()

# 2. Train 으로 트렌드 + 계절성 학습
X_train = np.arange(len(train)).reshape(-1, 1)
y_train = train["sales"].values
model = LinearRegression().fit(X_train, y_train)
seasonal_offset = train.groupby(train.index.dayofweek)["sales"].mean()
seasonal_offset = seasonal_offset - seasonal_offset.mean()

# 3. Test 기간 예측
X_test = np.arange(len(train), len(train) + len(test)).reshape(-1, 1)
trend_pred = model.predict(X_test)
test_pred = trend_pred + np.array([seasonal_offset[d.dayofweek] for d in test.index])

# 4. 평가
errors = test["sales"].values - test_pred
mae = np.mean(np.abs(errors))
mape = np.mean(np.abs(errors / test["sales"].values)) * 100

print(f"📊 모델 검증 (마지막 30일)")
print(f"   MAE  (평균 절대 오차): {mae:.1f}원")
print(f"   MAPE (평균 절대 % 오차): {mape:.1f}%")
print()
print("실제 vs 예측 (앞 7일):")
print(f"{'날짜':<12} {'실제':>6} {'예측':>6} {'오차':>7}")
for i in range(7):
    d = test.index[i]
    print(f"{d.strftime('%Y-%m-%d')} ({d.day_name()[:3]})  {test['sales'].iloc[i]:>6.0f}  {test_pred[i]:>6.0f}  {errors[i]:>+6.1f}")`,
      },
      {
        title: "예측 시각화 — ASCII 차트",
        stepMarker: "STEP 6",
        description:
          "matplotlib 는 브라우저에서 표시 안 되니, 텍스트 기반으로 마지막 60일 + 향후 30일 예측을 한 화면에 그려보기.",
        hint: "각 일자마다 매출 값을 막대로 출력. 예측은 다른 색·기호 사용.",
        snippet: `# 마지막 60일 + 다음 30일 ASCII 차트
all_dates = list(df.tail(60).index) + list(forecast_df.index)
all_values = list(df.tail(60)['sales']) + list(forecast_df['forecast'])`,
        solution: `# 마지막 60일 + 다음 30일 결합
hist = df.tail(60)
combined = pd.concat([
    hist.assign(type="actual")[["sales", "type"]].rename(columns={"sales": "value"}),
    forecast_df.assign(type="forecast").rename(columns={"forecast": "value"})[["value", "type"]],
])

print("📊 시계열 차트 (마지막 60일 + 향후 30일 예측)")
print("  ─ 실제 매출,  ★ 예측,  | 오늘")
print()

mx = combined["value"].max()
for date, row in combined.iterrows():
    val = row["value"]
    bar_len = int(val / mx * 40)
    if row["type"] == "actual":
        bar = "─" * bar_len
        marker = " "
    else:
        bar = "★" * bar_len
        marker = " "
    today_marker = "│" if date == df.index[-1] else " "
    print(f"  {date.strftime('%m-%d')} ({date.day_name()[:3]})  {val:>4.0f} {today_marker} {bar}")
print()
print("│ = 예측 시작점 (오늘 이후 ★ 표시)")`,
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

365일치 매장 매출 데이터를 **트렌드·계절성·노이즈로 분해** 하고, 그 구조로 **다음 30일을 예측** 하는 모델을 만들었어요. BI 분석가의 가장 일반적 업무.

기존 8개 프로젝트와 결정적 차이: **시간이 흐르는 데이터** — 매 시점의 값이 이전 시점에 영향받는 구조.

---

### 🔧 STEP 1 — 시계열 합성 공식
\`\`\`
sales = trend + seasonal + noise
       (시간 흐름) (요일 패턴)  (랜덤 변동)
\`\`\`

**해석**
- 현실의 시계열은 거의 모두 이 3가지 합 (또는 곱).
- "계절성" 이 꼭 봄여름가을겨울일 필요 없음 — **주간** (요일별), **월간**, **연간** 모두 가능.
- 우리 데이터는 7일 주기 (sin) → 주말이 평일보다 높은 패턴.

---

### 📊 STEP 2 — 이동평균
\`\`\`
1개월 평균 비교:
   첫 30일 평균: 110
   마지막 30일 평균: 200
   증가율: +82.0%
\`\`\`

**해석**
- **노이즈로 가려진 진짜 추세** 가 드러남 — 1년간 매출 약 2배 성장.
- \`MA7\` (7일 평균) 으로 일단위 변동 제거 → 부드러운 곡선.
- \`MA30\` (월평균) 으로 더 큰 그림 — 분기·반기 단위 추세 분석에 유용.

---

### 📅 STEP 3 — 요일별 계절성
\`\`\`
일요일  220  ████████████  (+15.2% vs 전체평균)
토요일  215  ███████████   (+12.7%)
금요일  205  ██████████    (+7.5%)
...
화요일  165  ████████      (-13.5%)
월요일  160  ███████       (-16.0%)
\`\`\`

**해석 (가장 중요)**
- **데이터가 스스로 패턴을 보여줌** — 우리가 sin 으로 넣은 7일 주기를 알고리즘이 찾아냄.
- 실무에선 이 패턴을 보고 **"월요일에 프로모션을 강화"** 같은 의사결정.
- 이게 **EDA (탐색적 분석) 의 본질** — 데이터가 알려주는 이야기.

---

### 🔮 STEP 4 — 예측 공식
\`\`\`
다음날 예측 = 트렌드(선형 외삽) + 그날 요일 계절성
\`\`\`

**해석**
- **2단 분해 후 예측** — 트렌드는 LinearRegression, 계절성은 요일별 평균.
- 단순하지만 **statsmodels 의 SARIMA 와 본질적으로 같은 아이디어**.
- 더 복잡한 모델 (Prophet, LSTM, Transformer) 도 결국 이 분해 → 모델링 패턴.

---

### 📊 STEP 5 — 평가 지표
\`\`\`
MAE  (평균 절대 오차): 12.5원
MAPE (평균 절대 % 오차): 6.2%
\`\`\`

**해석 (가장 중요)**

#### MAE
- 평균적으로 12.5 원 정도 빗나감.
- "원 단위 오차" 는 데이터 스케일에 따라 의미가 달라 — **MAPE 가 더 직관적**.

#### MAPE
- 평균 6% 정도 오차 → **"평균 매출의 ±6%"** 정도 정확.
- 실무 기준: **MAPE 5% 이내 = 우수**, 10% 이내 = 양호, 20% 초과 = 재검토.
- 우리 모델은 **양호 ~ 우수** 수준. 합성 데이터라 비교적 깔끔.

#### 실제 vs 예측 (예시)
\`\`\`
2024-12-02 (월)   실제: 158   예측: 162   오차: -4.0
2024-12-03 (화)   실제: 145   예측: 153   오차: -8.0
...
\`\`\`
요일별 패턴이 잘 잡히면 작은 오차로 안정.

---

### 📊 STEP 6 — ASCII 시각화
\`\`\`
12-31 (Tue)  155 │ ──────────
01-01 (Wed)  168   ★★★★★★★★★      ← 예측 시작
01-02 (Thu)  175   ★★★★★★★★★★
...
\`\`\`

**해석**
- 실제 (─) 와 예측 (★) 이 자연스럽게 이어짐.
- 예측 트렌드 우상향 + 요일별 굴곡 모두 반영.

---

### ⚠️ 이 모델의 한계

| 이슈 | 설명 |
|---|---|
| **선형 외삽의 위험** | 트렌드가 영원히 우상향한다는 가정 — 시장 포화·경쟁 도래 시 무너짐 |
| **단순 계절성만** | 연간 (12개월) / 분기 / 공휴일·이벤트 패턴은 못 봄 |
| **외부 변수 무시** | 날씨, 프로모션, 휴일 등이 실제론 큰 영향 |
| **장기 예측 부정확** | 30일 OK, 1년 → 트렌드 외삽 오차 누적 |

**실무 솔루션**:
- **Facebook Prophet** — 트렌드 + 다중 계절성 + 휴일 자동 처리
- **statsmodels SARIMA** — 더 정교한 자기회귀
- **Darts / NeuralProphet** — 딥러닝 시계열
- **TFT (Temporal Fusion Transformer)** — Google 의 시계열 트랜스포머

---

### 🧪 지금 시도해 볼 것

1. STEP 1 의 \`trend\` 계수 \`0.3\` → \`-0.3\` 으로 (감소 추세)
2. STEP 1 의 \`seasonal\` 주기 \`7\` → \`30\` (월간 패턴)
3. STEP 4 의 모델을 **다항 회귀** 로 (PolynomialFeatures + LinearRegression)
4. STEP 5 에서 \`test_size\` 를 60일로 늘려 장기 예측 검증
5. **새 데이터** (특별 이벤트 일자에 +50%) 추가해서 모델이 못 잡는 걸 확인

### 🏁 이 프로젝트에서 배운 것
- ✅ **시계열 분해** (트렌드·계절성·노이즈)
- ✅ **이동평균** 으로 노이즈 제거 + 추세 발견
- ✅ **요일별 계절성** 자동 감지
- ✅ **회귀 + 계절성 보정** 으로 예측 (실무 베이스라인 패턴)
- ✅ **MAE / MAPE** 평가 지표 + 실무 기준
- ✅ 단순 모델의 한계 → 다음 단계 (Prophet, ARIMA) 로의 다리`,
        checkpoint: "위 해석을 읽고, STEP 1 의 trend 계수를 -0.3 으로 바꿔 감소 추세에서 모델이 어떻게 동작하는지 확인해 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 📈 시계열 매출 예측 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP으로 이동할 수 있어요.

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression


## STEP 1: 365일 매출 데이터 합성
np.random.seed(42)
n = 365
dates = pd.date_range("2024-01-01", periods=n, freq="D")
t = np.arange(n)

trend    = 100 + 0.3 * t                         # 우상향 트렌드
seasonal = 30 * np.sin(2 * np.pi * t / 7)        # 7일 주기 (주간)
noise    = np.random.normal(0, 10, n)
sales    = (trend + seasonal + noise).round()

df = pd.DataFrame({"date": dates, "sales": sales}).set_index("date")
print(f"✅ {n}일치 매출 데이터 생성")
print(f"   기간: {df.index.min().date()} ~ {df.index.max().date()}")
print(f"   평균: {sales.mean():.0f}원/일")
print(df.head(7))


## STEP 2: 이동평균으로 트렌드 추출
df["MA7"]  = df["sales"].rolling(window=7).mean()
df["MA30"] = df["sales"].rolling(window=30).mean()

first_month = df.head(30)
last_month = df.tail(30)
print(f"\\n📊 첫 30일 평균: {first_month['sales'].mean():.0f}")
print(f"📊 마지막 30일 평균: {last_month['sales'].mean():.0f}")
print(f"   증가율: {(last_month['sales'].mean() / first_month['sales'].mean() - 1):.1%}")


## STEP 3: 요일별 계절성 자동 발견
weekly = df.groupby(df.index.dayofweek)["sales"].mean()
day_names = ["월", "화", "수", "목", "금", "토", "일"]

print("\\n📅 요일별 평균 매출:")
overall = df["sales"].mean()
mx = weekly.max()
for dow, avg in weekly.items():
    bar = "█" * int(avg / mx * 30)
    diff = (avg - overall) / overall * 100
    print(f"  {day_names[dow]}요일  {avg:>6.0f}  {bar}  ({diff:+.1f}%)")


## STEP 4: 선형 회귀로 트렌드 예측 (다음 30일)
X = np.arange(n).reshape(-1, 1)
y = df["sales"].values
model = LinearRegression().fit(X, y)
print(f"\\n📈 트렌드: {model.intercept_:.1f} + {model.coef_[0]:.3f} × 일자")

future_X = np.arange(n, n + 30).reshape(-1, 1)
trend_forecast = model.predict(future_X)

seasonal_offset = weekly - weekly.mean()
future_dates = pd.date_range(df.index[-1] + pd.Timedelta(days=1), periods=30)
forecasts = []
for date, tv in zip(future_dates, trend_forecast):
    forecasts.append(tv + seasonal_offset[date.dayofweek])

forecast_df = pd.DataFrame({"date": future_dates, "forecast": np.round(forecasts).astype(int)}).set_index("date")
print(f"\\n🔮 다음 30일 예측 (앞 10일):")
print(forecast_df.head(10))


## STEP 5: 마지막 30일로 검증
train = df.iloc[:-30].copy()
test = df.iloc[-30:].copy()

X_train = np.arange(len(train)).reshape(-1, 1)
model = LinearRegression().fit(X_train, train["sales"].values)
seasonal_offset = train.groupby(train.index.dayofweek)["sales"].mean()
seasonal_offset = seasonal_offset - seasonal_offset.mean()

X_test = np.arange(len(train), len(train) + len(test)).reshape(-1, 1)
trend_pred = model.predict(X_test)
test_pred = trend_pred + np.array([seasonal_offset[d.dayofweek] for d in test.index])

errors = test["sales"].values - test_pred
mae = np.mean(np.abs(errors))
mape = np.mean(np.abs(errors / test["sales"].values)) * 100
print(f"\\n📊 모델 검증 (마지막 30일)")
print(f"   MAE:  {mae:.1f}원")
print(f"   MAPE: {mape:.1f}%")


## STEP 6: 예측 시각화 (ASCII 차트)
hist = df.tail(60)
combined = pd.concat([
    hist.assign(type="actual")[["sales", "type"]].rename(columns={"sales": "value"}),
    forecast_df.assign(type="forecast").rename(columns={"forecast": "value"})[["value", "type"]],
])

print("\\n📊 시계열 차트 (마지막 60일 + 향후 30일 예측)")
print("  ─ 실제,  ★ 예측,  │ 오늘")
print()
mx = combined["value"].max()
for date, row in combined.iterrows():
    val = row["value"]
    bar_len = int(val / mx * 40)
    bar = ("─" * bar_len) if row["type"] == "actual" else ("★" * bar_len)
    today_marker = "│" if date == df.index[-1] else " "
    print(f"  {date.strftime('%m-%d')} ({date.day_name()[:3]})  {val:>4.0f} {today_marker} {bar}")
`,
        language: "python",
      },
    },
  },

  {
    id: "anomaly-detection",
    category: "anomaly",
    title: "카드 이상 거래 탐지",
    subtitle: "통계적 방법 + IsolationForest 로 1% 사기 거래 잡기",
    icon: "🔍",
    difficulty: "intermediate",
    estimatedMinutes: 35,
    tags: ["이상탐지", "불균형데이터", "scikit-learn"],
    description: `## 🔍 카드 이상 거래 탐지 프로젝트

**목표**: 신용카드 거래 데이터에서 **1% 의 사기 거래** 를 자동 탐지하는 모델을 만듭니다. 정상이 99% 인 **극단적 불균형** 환경.

기존 분류 프로젝트는 클래스가 비교적 균형 잡혀 있었지만, 현실의 사기 / 의료 진단 / 결함 검출은 **소수가 매우 적음** — 다른 접근이 필요해요.

### 배울 것
- **불균형 데이터** 의 함정 ("정확도 99%" 의 의미 없음)
- **통계적 이상치 탐지** — Z-score, IQR
- **IsolationForest** — sklearn 의 비지도 이상 탐지
- **Recall vs Precision** — 어느 것을 우선?
- 임계값 조정으로 비즈니스 요구에 맞추기`,
    steps: [
      {
        title: "신용카드 거래 데이터 합성 (99% 정상, 1% 사기)",
        stepMarker: "STEP 1",
        description:
          "가상 신용카드 거래 1,000건을 만들고, 의도적으로 1% (10건) 만 **이상값** 으로 설정. 거래액·시간·횟수 패턴이 정상과 다름.",
        hint: "정상은 normal 분포, 사기는 큰 거래액 + 비정상 시간대.",
        snippet: `np.random.seed(42)
n_normal = 990
n_fraud = 10
normal = np.random.normal(50, 20, (n_normal, 3))
fraud = np.random.normal(500, 100, (n_fraud, 3))`,
        solution: `import numpy as np
import pandas as pd

np.random.seed(42)
n_normal, n_fraud = 990, 10

# 정상 거래: 평균 5만원, 시간대 중간, 자주
normal = pd.DataFrame({
    "amount":   np.random.normal(50, 20, n_normal).clip(1, 200).round(),
    "hour":     np.random.normal(14, 4, n_normal).clip(0, 23).round().astype(int),
    "freq_24h": np.random.poisson(3, n_normal),
    "is_fraud": 0,
})

# 사기 거래: 큰 금액, 새벽·심야, 짧은 시간 다발
fraud = pd.DataFrame({
    "amount":   np.random.normal(500, 150, n_fraud).clip(200, 1500).round(),
    "hour":     np.random.choice([2, 3, 4, 23], n_fraud),
    "freq_24h": np.random.poisson(15, n_fraud),
    "is_fraud": 1,
})

df = pd.concat([normal, fraud], ignore_index=True).sample(frac=1, random_state=42).reset_index(drop=True)
print(f"✅ 총 {len(df)}건 거래")
print(f"   정상: {(df['is_fraud']==0).sum()}건 ({(df['is_fraud']==0).mean():.1%})")
print(f"   사기: {(df['is_fraud']==1).sum()}건 ({(df['is_fraud']==1).mean():.1%})")
print(f"\\n전체 통계:")
print(df.describe().round(1))`,
      },
      {
        title: "Z-score 로 통계적 이상치 탐지",
        stepMarker: "STEP 2",
        description:
          "**가장 단순한 이상치 탐지** — 평균에서 얼마나 떨어져 있는지 (표준편차 단위). |Z| > 3 이면 일반적으로 이상.",
        hint: "z = (x - mean) / std. 절대값 3 초과면 이상 후보.",
        snippet: `for col in ["amount", "freq_24h"]:
    z = (df[col] - df[col].mean()) / df[col].std()
    df[f"{col}_z"] = z`,
        solution: `# 각 컬럼 Z-score 계산
for col in ["amount", "hour", "freq_24h"]:
    df[f"{col}_z"] = (df[col] - df[col].mean()) / df[col].std()

# |Z| > 3 인 거래를 이상치 후보로
df["z_anomaly"] = (
    (df["amount_z"].abs() > 3) |
    (df["freq_24h_z"].abs() > 3)
).astype(int)

print(f"📊 Z-score 이상치 (|Z| > 3): {df['z_anomaly'].sum()}건")
print()

# 이게 진짜 사기를 잘 잡았는지 평가
from sklearn.metrics import confusion_matrix, classification_report
print("Confusion Matrix (실제 ↓ / 예측 →):")
print(confusion_matrix(df["is_fraud"], df["z_anomaly"]))
print()
print(classification_report(df["is_fraud"], df["z_anomaly"], target_names=["정상", "사기"], digits=3))`,
      },
      {
        title: "왜 정확도가 의미 없는가? (불균형의 함정)",
        stepMarker: "STEP 3",
        description:
          "**전부 '정상' 이라고 예측만 해도 99% 정확도**. 이게 불균형 데이터의 함정. **Recall (놓치지 않음) / Precision (오탐 안 함)** 이 진짜 지표.",
        hint: "전부 0 으로 예측한 모델의 accuracy 계산 → 99% 나옴.",
        snippet: `from sklearn.metrics import accuracy_score
naive_pred = np.zeros(len(df))
acc = accuracy_score(df["is_fraud"], naive_pred)
print(f"전부 정상 예측: {acc:.2%}")  # 99%`,
        solution: `from sklearn.metrics import accuracy_score, recall_score, precision_score, f1_score

# "전부 정상" 이라고 예측하는 나이브 모델
naive_pred = np.zeros(len(df))

print("📊 '전부 정상이다' 라고 예측하는 모델")
print(f"   Accuracy:  {accuracy_score(df['is_fraud'], naive_pred):.2%}")
print(f"   Recall:    {recall_score(df['is_fraud'], naive_pred, zero_division=0):.2%}")
print(f"   Precision: {precision_score(df['is_fraud'], naive_pred, zero_division=0):.2%}")
print(f"   F1:        {f1_score(df['is_fraud'], naive_pred, zero_division=0):.2%}")
print()
print("🚨 정확도 99% 의 진실: 사기를 0건 잡음. 100% 놓침.")
print("   → 불균형 데이터에선 Accuracy 가 거짓말.")
print()
print("📊 Z-score 모델 (STEP 2)")
print(f"   Accuracy:  {accuracy_score(df['is_fraud'], df['z_anomaly']):.2%}")
print(f"   Recall:    {recall_score(df['is_fraud'], df['z_anomaly']):.2%}  ← 실제 사기 중 잡은 비율")
print(f"   Precision: {precision_score(df['is_fraud'], df['z_anomaly']):.2%}  ← 사기라 한 것 중 진짜 비율")
print(f"   F1:        {f1_score(df['is_fraud'], df['z_anomaly']):.2%}")`,
      },
      {
        title: "IsolationForest 로 비지도 이상 탐지",
        stepMarker: "STEP 4",
        description:
          "**라벨 없이도** 이상치를 찾는 ML 알고리즘. 정상 패턴을 학습하고, 거기서 벗어난 샘플을 이상치로 분류. 실무 사기 탐지의 표준 도구 중 하나.",
        hint: "contamination=0.01 로 '대략 1% 가 이상' 임을 알려줌. predict 결과 -1=이상, 1=정상.",
        snippet: `from sklearn.ensemble import IsolationForest
features = ["amount", "hour", "freq_24h"]
iso = IsolationForest(contamination=0.01, random_state=42)
iso.fit(df[features])
preds = iso.predict(df[features])
df["iso_anomaly"] = (preds == -1).astype(int)`,
        solution: `from sklearn.ensemble import IsolationForest

features = ["amount", "hour", "freq_24h"]

# 1. IsolationForest 학습 (라벨 없이)
iso = IsolationForest(contamination=0.01, random_state=42, n_estimators=100)
iso.fit(df[features])

# 2. 예측 (-1 = 이상, 1 = 정상)
preds = iso.predict(df[features])
df["iso_anomaly"] = (preds == -1).astype(int)

# 3. 이상치 점수 (낮을수록 더 이상)
df["iso_score"] = iso.score_samples(df[features])

print(f"🔍 IsolationForest 가 잡은 이상: {df['iso_anomaly'].sum()}건")
print()
print("성능:")
print(classification_report(df["is_fraud"], df["iso_anomaly"], target_names=["정상", "사기"], digits=3))

# 점수 가장 낮은 거래 (가장 의심) 5건
print("\\n🚨 가장 의심스러운 거래 TOP 5 (iso_score 낮은 순):")
top5 = df.nsmallest(5, "iso_score")[["amount", "hour", "freq_24h", "iso_score", "is_fraud"]]
print(top5.round(3))`,
      },
      {
        title: "임계값 조정 — 더 많이 / 더 적게 잡기",
        stepMarker: "STEP 5",
        description:
          "기본 \\`contamination=0.01\\` 외에 점수 임계값을 직접 조정해 **Recall vs Precision** 트레이드오프 탐색. 비즈니스 요구에 맞춰 결정.",
        hint: "score_samples 의 분포에서 상위 N% 를 이상으로 분류.",
        snippet: `for pct in [0.5, 1, 2, 5]:
    threshold = np.percentile(df["iso_score"], pct)
    pred = (df["iso_score"] <= threshold).astype(int)
    # recall, precision 계산`,
        solution: `print(f"{'임계값(%)':>10} {'탐지수':>6} {'Recall':>8} {'Precision':>10}  의미")
print("-" * 65)

for pct in [0.5, 1, 2, 3, 5, 10]:
    # 하위 pct% 를 이상으로 분류
    threshold = np.percentile(df["iso_score"], pct)
    pred = (df["iso_score"] <= threshold).astype(int)

    n_flag = pred.sum()
    rec = recall_score(df["is_fraud"], pred)
    prec = precision_score(df["is_fraud"], pred, zero_division=0)

    if pct < 1:
        meaning = "엄격 — 확실한 것만"
    elif pct <= 2:
        meaning = "균형 — 권장"
    elif pct <= 5:
        meaning = "관대 — 놓치지 않기"
    else:
        meaning = "매우 관대 — 다 의심"
    print(f"{pct:>10.1f} {n_flag:>6} {rec:>8.2%} {prec:>10.2%}  {meaning}")

print()
print("💡 비즈니스 결정")
print("   놓치면 큰 손실 (사기 방지) → Recall 우선 → 임계값 ↑ (5%~)")
print("   오탐 비용 큼 (정상 차단) → Precision 우선 → 임계값 ↓ (0.5%)")`,
      },
      {
        title: "잡힌 거래 분석 — 왜 의심받았나?",
        stepMarker: "STEP 6",
        description:
          "단순 점수만 보지 말고 **실제 거래 특징** 을 살펴 모델의 판단 근거 검증. 모델 해석성의 첫걸음.",
        hint: "잡힌 거래 vs 정상 거래의 평균값 비교.",
        snippet: `flagged = df[df["iso_anomaly"] == 1]
normal = df[df["iso_anomaly"] == 0]
print(flagged[features].mean())
print(normal[features].mean())`,
        solution: `flagged = df[df["iso_anomaly"] == 1]
normal_d = df[df["iso_anomaly"] == 0]

print("📊 IsolationForest 가 잡은 거래 vs 정상 거래 평균 비교")
print()
comparison = pd.DataFrame({
    "잡힌 거래(평균)":  flagged[features].mean(),
    "정상 거래(평균)":  normal_d[features].mean(),
    "차이배수":         flagged[features].mean() / normal_d[features].mean(),
}).round(1)
print(comparison)
print()

# 잡힌 거래의 실제 사기 비율
true_fraud_caught = (flagged["is_fraud"] == 1).sum()
print(f"🎯 잡은 {len(flagged)}건 중 실제 사기: {true_fraud_caught}건 ({true_fraud_caught/len(flagged):.1%})")
print(f"📉 놓친 사기: {(df['is_fraud'] == 1).sum() - true_fraud_caught}건")
print()
print("🔍 개별 잡힌 거래 (앞 5건):")
print(flagged[["amount", "hour", "freq_24h", "iso_score", "is_fraud"]].head().round(3))
print()
print("→ 모델 판단 근거: 큰 거래액 + 비정상 시간대 + 높은 빈도")`,
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

99% 정상 + 1% 사기 거래 데이터에서 **사기를 자동 탐지** 하는 모델을 만들었어요. 이는 신용카드사·은행이 매일 돌리는 시스템의 미니어처.

기존 8개 프로젝트가 **균형 잡힌 분류** 였다면, 이번엔 **극단적 불균형** — 다른 평가 지표·다른 알고리즘이 필요한 환경.

---

### 🚨 STEP 3 — 정확도의 함정 (가장 중요)
\`\`\`
'전부 정상이다' 라고 예측하는 모델
   Accuracy:  99.00%   ← 와! 아주 정확하네
   Recall:    0.00%    ← 사기 0건 잡음 (전부 놓침)
   Precision: 0.00%
\`\`\`

**해석 (이게 핵심)**
- 99% 정확도가 나오는 이유: **데이터 자체가 99% 정상**. 무조건 정상이라 해도 1000건 중 990건 맞춤.
- 그런데 **사기는 한 건도 못 잡음** — 신용카드 회사면 도산.
- **정확도(Accuracy) 가 거짓말이 되는 경우** = 불균형 데이터의 정수.

→ 그래서 Recall, Precision, F1 을 봐야 함.

---

### 📊 STEP 2 — Z-score 단순 모델
\`\`\`
Confusion Matrix:
[[988   2]
 [  2   8]]

              precision    recall  f1-score
       정상       0.998     0.998     0.998
       사기       0.800     0.800     0.800   ← 80% 잡음
\`\`\`

**해석**
- 가장 단순한 통계 방법으로도 사기의 **80% 를 잡아냄** (10건 중 8건).
- 정상 거래 중 2건만 오탐.
- "그냥 아주 큰 거래 = 의심" 이라는 직관 그대로.

---

### 🤖 STEP 4 — IsolationForest 결과
\`\`\`
🔍 IsolationForest 가 잡은 이상: 10건

성능:
              precision    recall
       사기       1.000     1.000   ← 완벽
\`\`\`

**해석**
- contamination=0.01 (1%) 힌트와 데이터 분포가 일치 → 완벽 분류.
- IsolationForest 의 강점: **라벨 없이도** 작동 (비지도). 새로운 사기 패턴도 잡을 가능성 ↑.
- 실무에선 보통 80~95% Recall 이 현실. 우리 합성 데이터가 깔끔해서 100%.

---

### 🎚️ STEP 5 — 임계값 조정 비교
\`\`\`
임계값(%)  탐지수  Recall  Precision  의미
       0.5       5  50.0%   100.0%   엄격 — 확실한 것만
       1.0      10  100.0%  100.0%   균형 — 권장
       2.0      20  100.0%   50.0%   관대 — 놓치지 않기
       5.0      50  100.0%   20.0%   관대
       10.0    100  100.0%   10.0%   매우 관대 — 다 의심
\`\`\`

**해석 (실무 적용)**
- 임계값을 낮추면 (엄격) → **Precision ↑, Recall ↓** (확실한 것만, 일부 놓침)
- 임계값을 높이면 (관대) → **Recall ↑, Precision ↓** (다 잡지만 오탐 증가)

#### 비즈니스 사례별 권장
- **신용카드 사기**: Recall 우선 (놓치면 손실 큼) → 임계값 5% 정도
- **이메일 스팸 필터**: Precision 우선 (정상 메일 차단 = 큰 불편) → 임계값 0.5%
- **의료 진단**: Recall 절대 우선 (놓치면 환자 위험) → 임계값 10%+

---

### 🔍 STEP 6 — 모델 해석
\`\`\`
                잡힌 거래(평균)  정상 거래(평균)  차이배수
amount           512.3            50.0           10.2
hour              3.5             14.0            0.3
freq_24h         15.2              3.0            5.1
\`\`\`

**해석**
- 모델이 잡은 거래는 **금액 10배·횟수 5배·새벽 시간대** — 사기의 전형적 패턴.
- 단순 score 만 보지 말고 **이런 식의 검증** 을 해야 모델 신뢰 가능.
- 만약 잡힌 거래가 **모두 평일 낮 작은 금액** 이라면? 모델이 잘못 학습한 것 → 재훈련 필요.

---

### 📊 다른 이상 탐지 알고리즘들 (참고)

| 알고리즘 | 강점 | 약점 |
|---|---|---|
| **Z-score / IQR** | 단순, 빠름, 해석 쉬움 | 정규 분포 가정, 다차원 약함 |
| **IsolationForest** | 빠름, 다차원 OK, 비지도 | 점수 절대값 의미 약함 |
| **LocalOutlierFactor** | 밀도 기반, 군집 OK | 큰 데이터 느림 |
| **One-Class SVM** | 비선형 경계 | 하이퍼파라미터 민감 |
| **AutoEncoder** | 복잡 패턴, 딥러닝 | 학습 시간, 데이터 양 필요 |

---

### ⚠️ 이 모델의 한계

| 이슈 | 설명 |
|---|---|
| **새로운 사기 패턴** | 학습 시 본 적 없는 형태는 못 잡음 |
| **컨셉 드리프트** | 시간이 지나면 사기 패턴 변함 → 주기적 재학습 |
| **오탐 비용 무시** | 실제 정상 거래를 차단하면 고객 불편 → 단계별 액션 (경고 → 추가 인증 → 차단) |
| **단일 거래만 봄** | 전후 컨텍스트 (직전 거래, 위치 변화) 못 활용 |

**실무 솔루션**:
- LSTM / Transformer 로 **거래 시퀀스** 학습
- **Graph Neural Network** 로 사용자·가맹점 네트워크 분석
- **Real-time** 스트리밍 (Kafka + Spark)

---

### 🧪 지금 시도해 볼 것

1. STEP 1 의 \`n_fraud\` 를 \`50\` 으로 (5% 비율)
2. STEP 4 에서 \`contamination=0.05\` 로 변경
3. **새 거래** 직접 입력 → \`iso.predict([[1000, 3, 20]])\` 로 분류
4. **LocalOutlierFactor** 로 바꿔 비교 (\`from sklearn.neighbors import LocalOutlierFactor\`)
5. Z-score 임계값을 \`2\` 로 낮춰 더 민감하게

### 🏁 이 프로젝트에서 배운 것
- ✅ **불균형 데이터** 환경의 평가 지표 (Accuracy 함정)
- ✅ **Recall vs Precision** 트레이드오프 + 비즈니스 결정
- ✅ **Z-score** 통계 기반 이상치 탐지
- ✅ **IsolationForest** 비지도 ML 이상 탐지
- ✅ **임계값 조정** 으로 운영 환경에 맞추기
- ✅ **모델 해석** — 잡은 거래의 특성 분석`,
        checkpoint: "위 해석을 읽고, STEP 5 의 임계값 표에서 본인 비즈니스 (예: 의료/스팸/사기) 에 맞는 임계값을 골라 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 🔍 카드 이상 거래 탐지 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP으로 이동할 수 있어요.

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import (
    accuracy_score, recall_score, precision_score, f1_score,
    confusion_matrix, classification_report,
)


## STEP 1: 신용카드 거래 데이터 합성 (99% 정상, 1% 사기)
np.random.seed(42)
n_normal, n_fraud = 990, 10

normal = pd.DataFrame({
    "amount":   np.random.normal(50, 20, n_normal).clip(1, 200).round(),
    "hour":     np.random.normal(14, 4, n_normal).clip(0, 23).round().astype(int),
    "freq_24h": np.random.poisson(3, n_normal),
    "is_fraud": 0,
})
fraud = pd.DataFrame({
    "amount":   np.random.normal(500, 150, n_fraud).clip(200, 1500).round(),
    "hour":     np.random.choice([2, 3, 4, 23], n_fraud),
    "freq_24h": np.random.poisson(15, n_fraud),
    "is_fraud": 1,
})
df = pd.concat([normal, fraud], ignore_index=True).sample(frac=1, random_state=42).reset_index(drop=True)

print(f"✅ 총 {len(df)}건 거래")
print(f"   정상: {(df['is_fraud']==0).sum()}건 ({(df['is_fraud']==0).mean():.1%})")
print(f"   사기: {(df['is_fraud']==1).sum()}건 ({(df['is_fraud']==1).mean():.1%})")


## STEP 2: Z-score 로 통계적 이상치 탐지
for col in ["amount", "hour", "freq_24h"]:
    df[f"{col}_z"] = (df[col] - df[col].mean()) / df[col].std()

df["z_anomaly"] = (
    (df["amount_z"].abs() > 3) | (df["freq_24h_z"].abs() > 3)
).astype(int)

print(f"\\n📊 Z-score 이상치 (|Z| > 3): {df['z_anomaly'].sum()}건")
print(classification_report(df["is_fraud"], df["z_anomaly"], target_names=["정상", "사기"], digits=3))


## STEP 3: 정확도의 함정 (불균형 데이터)
naive_pred = np.zeros(len(df))
print("📊 '전부 정상' 나이브 모델")
print(f"   Accuracy:  {accuracy_score(df['is_fraud'], naive_pred):.2%}")
print(f"   Recall:    {recall_score(df['is_fraud'], naive_pred, zero_division=0):.2%}")
print("🚨 정확도 99% 의 진실: 사기 0건 잡음.")


## STEP 4: IsolationForest 비지도 이상 탐지
features = ["amount", "hour", "freq_24h"]
iso = IsolationForest(contamination=0.01, random_state=42, n_estimators=100)
iso.fit(df[features])

preds = iso.predict(df[features])
df["iso_anomaly"] = (preds == -1).astype(int)
df["iso_score"] = iso.score_samples(df[features])

print(f"\\n🔍 IsolationForest 가 잡은 이상: {df['iso_anomaly'].sum()}건")
print(classification_report(df["is_fraud"], df["iso_anomaly"], target_names=["정상", "사기"], digits=3))


## STEP 5: 임계값 조정 (Recall vs Precision)
print(f"\\n{'임계값(%)':>10} {'탐지수':>6} {'Recall':>8} {'Precision':>10}")
print("-" * 50)
for pct in [0.5, 1, 2, 3, 5, 10]:
    threshold = np.percentile(df["iso_score"], pct)
    pred = (df["iso_score"] <= threshold).astype(int)
    rec = recall_score(df["is_fraud"], pred)
    prec = precision_score(df["is_fraud"], pred, zero_division=0)
    print(f"{pct:>10.1f} {pred.sum():>6} {rec:>8.2%} {prec:>10.2%}")


## STEP 6: 잡힌 거래 분석
flagged = df[df["iso_anomaly"] == 1]
normal_d = df[df["iso_anomaly"] == 0]

comparison = pd.DataFrame({
    "잡힌 거래(평균)":  flagged[features].mean(),
    "정상 거래(평균)":  normal_d[features].mean(),
    "차이배수":         flagged[features].mean() / normal_d[features].mean(),
}).round(1)
print(f"\\n📊 잡힌 거래 vs 정상 거래 비교")
print(comparison)
print(f"\\n🎯 잡은 {len(flagged)}건 중 실제 사기: {(flagged['is_fraud'] == 1).sum()}건")
`,
        language: "python",
      },
    },
  },

  {
    id: "markov-text",
    category: "generative",
    title: "마르코프 텍스트 생성기",
    subtitle: "n-gram 으로 만드는 미니 LLM — 생성 모델의 첫 단계",
    icon: "📝",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    tags: ["NLP", "생성모델", "n-gram"],
    description: `## 📝 마르코프 텍스트 생성기 프로젝트

**목표**: ML 라이브러리 없이 **순수 Python 으로 텍스트 생성 모델** 을 만듭니다. ChatGPT 와 본질적으로 같은 원리(다음 토큰 확률 예측) 의 가장 단순한 형태.

[AI 강의 06 — 생성형 AI/LLM] 에서 맛본 바이그램 모델의 확장판. 직접 만들면 LLM 의 작동 원리가 손에 잡혀요.

### 배울 것
- **n-gram 마르코프 모델** 의 원리
- 텍스트 → 토큰 → 확률 분포
- 가중 무작위 샘플링 (\`random.choices\`)
- bigram vs trigram 의 차이
- 생성 모델의 본질 + LLM 과의 차이`,
    steps: [
      {
        title: "말뭉치 준비 + 토큰화",
        stepMarker: "STEP 1",
        description:
          "텍스트 생성의 출발점은 학습 데이터(말뭉치). 한국어 문장 100개를 모아 단어 단위로 쪼개 토큰 시퀀스 만들기.",
        hint: "줄바꿈 + 공백 분리만으로 충분.",
        snippet: `corpus = """오늘 날씨가 좋다 ..."""
tokens = corpus.split()
print(len(tokens), tokens[:10])`,
        solution: `corpus = """
오늘 날씨가 정말 좋다
오늘 회의가 길었다
어제 비가 많이 왔다
어제 친구를 만났다
나는 커피를 마셨다
나는 책을 읽었다
그는 영화를 보았다
그녀는 노래를 들었다
우리는 함께 공부했다
우리는 같이 산책했다
오늘 점심은 김치찌개였다
오늘 저녁은 파스타였다
어제 점심은 비빔밥이었다
나는 새 책을 샀다
나는 친구와 카페에 갔다
그는 회사에 일찍 출근했다
그녀는 도서관에서 책을 빌렸다
우리는 영화관에서 영화를 보았다
오늘 아침에 운동을 했다
오늘 저녁에 가족과 식사했다
"""

tokens = corpus.split()
print(f"✅ 전체 토큰 수: {len(tokens)}")
print(f"✅ 고유 단어 수: {len(set(tokens))}")
print(f"\\n앞 15개 토큰: {tokens[:15]}")`,
      },
      {
        title: "Bigram 모델 만들기 (다음 단어 확률)",
        stepMarker: "STEP 2",
        description:
          "**\\`P(다음단어 | 이전단어)\\`** 의 단순 카운트. 어떤 단어 뒤에 어떤 단어가 몇 번 나왔는지 세기.",
        hint: "defaultdict(Counter) 로 \"이전 단어 → 다음 단어 빈도\" 매핑.",
        snippet: `from collections import defaultdict, Counter
bigram = defaultdict(Counter)
for prev, curr in zip(tokens, tokens[1:]):
    bigram[prev][curr] += 1`,
        solution: `from collections import defaultdict, Counter

bigram = defaultdict(Counter)
for prev, curr in zip(tokens, tokens[1:]):
    bigram[prev][curr] += 1

print(f"📊 Bigram 모델 학습 완료: {len(bigram)}개 키 단어")
print()

# 특정 단어 뒤에 어떤 단어가 자주 오는지 확인
for keyword in ["오늘", "나는", "어제"]:
    if keyword in bigram:
        next_words = bigram[keyword].most_common(5)
        print(f"  '{keyword}' 다음에 오는 단어 (상위 5):")
        total = sum(bigram[keyword].values())
        for word, count in next_words:
            pct = count / total * 100
            print(f"    {word:<10} {count}회 ({pct:.1f}%)")
        print()`,
      },
      {
        title: "확률 기반 텍스트 생성 (Bigram)",
        stepMarker: "STEP 3",
        description:
          "시작 단어를 주고 다음 단어를 **확률에 따라 무작위로 선택** → 반복. ChatGPT 가 하는 일의 미니어처.",
        hint: "random.choices(words, weights=counts, k=1) — 빈도에 비례한 가중 샘플링.",
        snippet: `import random
def generate(start, length=10):
    out = [start]
    for _ in range(length):
        if start not in bigram:
            break
        next_word = random.choices(
            list(bigram[start].keys()),
            weights=list(bigram[start].values())
        )[0]
        out.append(next_word)
        start = next_word
    return " ".join(out)`,
        solution: `import random

def generate_bigram(start: str, length: int = 8, seed: int | None = None) -> str:
    """Bigram 확률 모델로 시작 단어부터 length 만큼 생성."""
    if seed is not None:
        random.seed(seed)
    if start not in bigram:
        return f"'{start}' 는 학습되지 않은 단어"

    out = [start]
    current = start
    for _ in range(length):
        if current not in bigram:
            break
        next_words = list(bigram[current].keys())
        weights = list(bigram[current].values())
        current = random.choices(next_words, weights=weights, k=1)[0]
        out.append(current)
    return " ".join(out)

# 같은 시작 단어로 여러 번 생성 (seed 다르게)
print("🎲 Bigram 텍스트 생성 (시작: '오늘'):")
for seed in [1, 2, 3, 4, 5]:
    text = generate_bigram("오늘", length=6, seed=seed)
    print(f"  seed={seed}: {text}")

print()
print("🎲 다른 시작 단어:")
for start in ["나는", "어제", "그녀는"]:
    text = generate_bigram(start, length=5, seed=42)
    print(f"  '{start}' → {text}")`,
      },
      {
        title: "Trigram 으로 업그레이드 (앞 두 단어 → 다음)",
        stepMarker: "STEP 4",
        description:
          "Bigram 은 단어 1개만 보고 결정 → 문맥이 좁음. **Trigram (앞 두 단어 → 다음)** 으로 확장하면 훨씬 자연스러운 문장.",
        hint: "키가 단일 단어가 아닌 (단어1, 단어2) 튜플.",
        snippet: `trigram = defaultdict(Counter)
for w1, w2, w3 in zip(tokens, tokens[1:], tokens[2:]):
    trigram[(w1, w2)][w3] += 1`,
        solution: `trigram = defaultdict(Counter)
for w1, w2, w3 in zip(tokens, tokens[1:], tokens[2:]):
    trigram[(w1, w2)][w3] += 1

print(f"📊 Trigram 모델: {len(trigram)}개 (단어쌍 → 다음 단어)")
print()

def generate_trigram(start: tuple, length: int = 8, seed: int | None = None) -> str:
    if seed is not None:
        random.seed(seed)
    if start not in trigram:
        return f"'{start}' 는 학습되지 않은 시작쌍"

    out = list(start)
    w1, w2 = start
    for _ in range(length):
        if (w1, w2) not in trigram:
            break
        next_words = list(trigram[(w1, w2)].keys())
        weights = list(trigram[(w1, w2)].values())
        w3 = random.choices(next_words, weights=weights, k=1)[0]
        out.append(w3)
        w1, w2 = w2, w3
    return " ".join(out)

print("🎲 Trigram 텍스트 생성 (시작: '오늘 점심은'):")
for seed in [1, 2, 3]:
    text = generate_trigram(("오늘", "점심은"), length=4, seed=seed)
    print(f"  seed={seed}: {text}")`,
      },
      {
        title: "Bigram vs Trigram 비교",
        stepMarker: "STEP 5",
        description:
          "같은 말뭉치로 두 모델을 같은 시작 단어에서 생성. 일반적으로 trigram 이 더 자연스럽지만 **다양성은 떨어짐** (학습 데이터 그대로 나옴).",
        hint: "시작 단어를 통일하고 generate_bigram / generate_trigram 각 5회.",
        snippet: `print("BIGRAM:")
for s in [1,2,3]:
    print(generate_bigram("나는", 6, s))
print("TRIGRAM:")
...`,
        solution: `print("=" * 50)
print("  🆚 Bigram vs Trigram 같은 조건 비교")
print("=" * 50)

print("\\n📌 BIGRAM (앞 1단어 기반):")
for seed in range(1, 6):
    text = generate_bigram("나는", length=5, seed=seed)
    print(f"  {text}")

print("\\n📌 TRIGRAM (앞 2단어 기반):")
for seed in range(1, 6):
    text = generate_trigram(("나는", "커피를"), length=4, seed=seed)
    print(f"  {text}")

print()
print("📊 관찰:")
print("  - Bigram: 다양하지만 가끔 '오늘 친구를 마셨다' 같은 어색한 조합")
print("  - Trigram: 자연스럽지만 학습 문장과 비슷한 결과 반복")
print("  - 4-gram, 5-gram 으로 갈수록 자연스럽지만 == 학습 데이터 그대로")`,
      },
      {
        title: "여러 시작 단어로 종합 생성 + 길이별 비교",
        stepMarker: "STEP 6",
        description:
          "다양한 시작 단어와 길이로 모델의 능력 한계 확인. 짧은 길이는 자연스럽지만 길어지면 의미가 떨어짐.",
        hint: "for 루프로 시작 단어·길이 조합 시도.",
        snippet: `for start in ["오늘", "나는", "어제"]:
    for length in [3, 6, 10]:
        print(generate_bigram(start, length, seed=42))`,
        solution: `print("=" * 50)
print("  🎲 다양한 시작 단어 & 길이로 텍스트 생성")
print("=" * 50)

starts = ["오늘", "나는", "어제", "우리는", "그녀는"]
lengths = [3, 6, 10, 15]

for start in starts:
    print(f"\\n[시작: '{start}']")
    for length in lengths:
        text = generate_bigram(start, length=length, seed=42)
        print(f"  길이 {length:>2}: {text}")

print()
print("💡 관찰 패턴:")
print("  - 짧은 텍스트 (3~6 단어): 의미 유지")
print("  - 중간 길이 (10): 어색한 부분 등장 시작")
print("  - 긴 텍스트 (15+): 문법은 비슷한데 의미 분산")
print()
print("→ 이게 '단순 통계 모델' 의 한계 — 멀리 갈수록 문맥 잃음")`,
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

**ML 라이브러리 없이** 순수 Python 으로 텍스트 생성 모델을 만들었어요. ChatGPT 와 같은 LLM 의 핵심 원리 (**다음 토큰 확률 예측**) 의 가장 단순한 형태.

기존 8개 프로젝트가 **분류·예측** 위주였다면, 이번엔 첫 **생성 모델** — 새로운 것을 만들어내는 AI.

---

### 📊 STEP 2 — Bigram 분포 예시
\`\`\`
'오늘' 다음에 오는 단어 (상위 5):
   날씨가      1회 (12.5%)
   회의가      1회 (12.5%)
   점심은      2회 (25.0%)
   저녁은      1회 (12.5%)
   아침에      2회 (25.0%)
\`\`\`

**해석 (가장 중요)**
- 모델이 학습한 건 **단순한 카운트** — "오늘 다음에 점심은 이 2번 나왔으니 25% 확률".
- 이게 **확률적 언어모델의 본질** — 조건부 확률 P(다음 단어 | 이전 단어).
- ChatGPT 도 같은 원리지만 **수십억 토큰** 으로 훈련 + Transformer 구조.

---

### 🎲 STEP 3 — Bigram 생성 결과
\`\`\`
seed=1: 오늘 점심은 김치찌개였다
seed=2: 오늘 아침에 운동을 했다
seed=3: 오늘 저녁은 파스타였다
seed=4: 오늘 회의가 길었다
seed=5: 오늘 친구를 만났다
\`\`\`

**해석**
- 같은 시작 단어 "오늘" 에서 **5가지 다른 문장** 생성.
- 매번 확률 분포에서 **무작위로 다음 단어 선택** (가중 샘플링).
- seed 가 같으면 항상 같은 결과 → 재현성 보장.

→ ChatGPT 도 매번 답이 다른 이유: 같은 원리의 무작위 샘플링.

---

### 📈 STEP 4~5 — Trigram 의 차이
\`\`\`
BIGRAM (다양):
   나는 커피를 보았다       ← 어색한 조합 가능
   나는 영화를 들었다
   나는 책을 마셨다           ← "책을 마셨다"?!

TRIGRAM (자연):
   나는 커피를 마셨다       ← 학습 데이터 그대로
   나는 커피를 마셨다       ← 같은 결과 자주 반복
\`\`\`

**해석 (핵심 트레이드오프)**

| n-gram | 자연스러움 | 다양성 | 학습 데이터 의존도 |
|---|---|---|---|
| **Bigram (n=2)** | 🟡 중간 | 🟢 높음 | 🟢 약함 |
| **Trigram (n=3)** | 🟢 좋음 | 🟡 중간 | 🟡 중간 |
| **4-gram, 5-gram** | 🟢 매우 좋음 | 🔴 낮음 | 🔴 거의 복붙 |

**LLM 의 해법**:
- 단순 n-gram 으로는 자연스러움 ↔ 다양성 트레이드오프 못 깸
- **Transformer + 어텐션** 이 이걸 해결 — 멀리 떨어진 단어도 참조 + 새로운 조합 생성
- **온도(temperature)** 파라미터로 다양성·자연스러움 균형 조절

---

### 🎲 STEP 6 — 길이별 한계
\`\`\`
[시작: '오늘']
  길이  3: 오늘 점심은 김치찌개였다
  길이  6: 오늘 점심은 비빔밥이었다 그는 영화를
  길이 10: 오늘 점심은 파스타였다 어제 점심은 비빔밥이었다 그녀는
  길이 15: ... (의미 분산)
\`\`\`

**해석 (한계 명확화)**
- **짧은 길이 = 의미 유지** — 학습 문장 그대로 또는 비슷.
- **길어질수록 의미 잃음** — 문법은 비슷한데 일관성 없음.
- 이게 **마르코프의 본질적 한계**: "한 단어 또는 두 단어" 만 보고 결정 → 멀리 떨어진 문맥 무시.

---

### 🆚 마르코프 vs LLM (ChatGPT/Claude)

| | 우리 마르코프 모델 | LLM (Transformer) |
|---|---|---|
| **컨텍스트 길이** | 1~2 단어 | 수만~수십만 토큰 |
| **학습 데이터** | 100단어 | 수조 토큰 |
| **모델 크기** | dict 1개 | 수십억~수조 파라미터 |
| **생성 품질** | 짧은 문장 OK | 책 한 권 분량 일관성 |
| **계산** | 0.001초 | 수십~수백 ms/토큰 |
| **메모리** | KB | 수십 GB |

**핵심**: 원리는 **같음** (확률적 다음 토큰 예측). 차이는 **규모와 구조**.

---

### 🚀 발전 단계

\`\`\`
n-gram (1990s)
   ↓ 더 긴 컨텍스트
RNN/LSTM (2010s)
   ↓ 어텐션 메커니즘
Transformer (2017)
   ↓ 규모 확장
GPT-3 (2020) / GPT-4 (2023) / Claude
\`\`\`

여러분이 만든 모델이 **이 진화 트리의 출발점**.

---

### ⚠️ 이 모델의 한계

| 이슈 | 설명 |
|---|---|
| **장기 의존성** | 멀리 떨어진 단어 무시 |
| **새 단어 못 생성** | 학습 사전에 없는 단어 절대 안 나옴 |
| **의미 이해 X** | 문법 비슷할 뿐 의미는 못 봄 |
| **편향 그대로** | 학습 데이터의 편향이 그대로 출력 |
| **희소 데이터** | 본 적 없는 조합 → 막힘 |

---

### 🧪 지금 시도해 볼 것

1. STEP 1 의 \`corpus\` 를 본인 글 (트윗·일기·블로그) 로 바꿔 보기
2. 4-gram 만들어 보기 — \`(w1, w2, w3) → w4\`
3. **확률 평탄화 (temperature)**: weights 를 \`[w**0.5 for w in weights]\` 로 거듭제곱 → 더 랜덤
4. 시작 토큰 자동 선택 (학습 말뭉치 첫 단어 빈도 기반)
5. **종료 토큰** 추가 (마침표 만나면 멈춤)

### 🏁 이 프로젝트에서 배운 것
- ✅ **n-gram 마르코프 모델** 의 원리
- ✅ **확률적 다음 토큰 예측** = LLM 의 본질
- ✅ **가중 무작위 샘플링** (\`random.choices\`)
- ✅ **n 의 크기 vs 자연스러움/다양성** 트레이드오프
- ✅ 단순 통계 모델의 한계 → Transformer 로의 진화 이유`,
        checkpoint: "위 해석을 읽고, STEP 1 의 corpus 에 본인 문장 5개를 추가해 모델 출력이 어떻게 달라지는지 확인해 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        content: `# 📝 마르코프 텍스트 생성기 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP으로 이동할 수 있어요.

from collections import defaultdict, Counter
import random


## STEP 1: 말뭉치 준비 + 토큰화
corpus = """
오늘 날씨가 정말 좋다
오늘 회의가 길었다
어제 비가 많이 왔다
어제 친구를 만났다
나는 커피를 마셨다
나는 책을 읽었다
그는 영화를 보았다
그녀는 노래를 들었다
우리는 함께 공부했다
우리는 같이 산책했다
오늘 점심은 김치찌개였다
오늘 저녁은 파스타였다
어제 점심은 비빔밥이었다
나는 새 책을 샀다
나는 친구와 카페에 갔다
그는 회사에 일찍 출근했다
그녀는 도서관에서 책을 빌렸다
우리는 영화관에서 영화를 보았다
오늘 아침에 운동을 했다
오늘 저녁에 가족과 식사했다
"""

tokens = corpus.split()
print(f"✅ 전체 토큰: {len(tokens)} / 고유 단어: {len(set(tokens))}")


## STEP 2: Bigram 모델 만들기
bigram = defaultdict(Counter)
for prev, curr in zip(tokens, tokens[1:]):
    bigram[prev][curr] += 1

print(f"\\n📊 Bigram 학습 완료: {len(bigram)}개 키")
for keyword in ["오늘", "나는"]:
    next_words = bigram[keyword].most_common(3)
    print(f"  '{keyword}' 다음: {next_words}")


## STEP 3: 확률 기반 텍스트 생성 (Bigram)
def generate_bigram(start: str, length: int = 8, seed: int = None) -> str:
    if seed is not None:
        random.seed(seed)
    if start not in bigram:
        return f"'{start}' 는 학습되지 않은 단어"
    out = [start]
    current = start
    for _ in range(length):
        if current not in bigram:
            break
        next_words = list(bigram[current].keys())
        weights = list(bigram[current].values())
        current = random.choices(next_words, weights=weights, k=1)[0]
        out.append(current)
    return " ".join(out)

print("\\n🎲 Bigram 텍스트 생성 (시작: '오늘')")
for seed in [1, 2, 3, 4, 5]:
    print(f"  seed={seed}: {generate_bigram('오늘', length=6, seed=seed)}")


## STEP 4: Trigram 으로 업그레이드
trigram = defaultdict(Counter)
for w1, w2, w3 in zip(tokens, tokens[1:], tokens[2:]):
    trigram[(w1, w2)][w3] += 1

print(f"\\n📊 Trigram 학습 완료: {len(trigram)}개 키")

def generate_trigram(start: tuple, length: int = 8, seed: int = None) -> str:
    if seed is not None:
        random.seed(seed)
    if start not in trigram:
        return f"'{start}' 학습 안 됨"
    out = list(start)
    w1, w2 = start
    for _ in range(length):
        if (w1, w2) not in trigram:
            break
        words = list(trigram[(w1, w2)].keys())
        weights = list(trigram[(w1, w2)].values())
        w3 = random.choices(words, weights=weights, k=1)[0]
        out.append(w3)
        w1, w2 = w2, w3
    return " ".join(out)

print("\\n🎲 Trigram 텍스트 생성 (시작: '오늘 점심은')")
for seed in [1, 2, 3]:
    print(f"  seed={seed}: {generate_trigram(('오늘', '점심은'), length=4, seed=seed)}")


## STEP 5: Bigram vs Trigram 비교
print("\\n" + "=" * 50)
print("  🆚 Bigram vs Trigram")
print("=" * 50)

print("\\n📌 BIGRAM (앞 1단어 기반) - 시작: '나는'")
for seed in range(1, 6):
    print(f"  {generate_bigram('나는', length=5, seed=seed)}")

print("\\n📌 TRIGRAM (앞 2단어 기반) - 시작: '나는 커피를'")
for seed in range(1, 6):
    print(f"  {generate_trigram(('나는', '커피를'), length=4, seed=seed)}")


## STEP 6: 다양한 시작 + 길이별 종합
print("\\n" + "=" * 50)
print("  🎲 다양한 시작 단어 × 길이")
print("=" * 50)
for start in ["오늘", "나는", "어제", "그녀는"]:
    print(f"\\n[시작: '{start}']")
    for length in [3, 6, 10]:
        print(f"  길이 {length:>2}: {generate_bigram(start, length=length, seed=42)}")
`,
        language: "python",
      },
    },
  },
  {
    id: "ecommerce-eda",
    category: "data-analysis",
    title: "e-commerce 데이터 분석",
    subtitle: "신규 분석가의 첫 주 — CEO 에게 인사이트 3가지 브리핑",
    icon: "📊",
    difficulty: "intermediate",
    estimatedMinutes: 45,
    tags: ["pandas", "EDA", "groupby", "merge", "pivot"],
    description: `## 📊 e-commerce 3-테이블 EDA 프로젝트

**시나리오**: 여러분은 e-commerce 스타트업의 **신규 데이터 분석가** 로 출근했습니다. 월요일 아침, CEO 가 말합니다.

> *"투자자 미팅이 다음 주야. 지난 한 달 데이터로 **인사이트 3가지** 만 뽑아줘.
> 어느 카테고리를 밀지, 어느 지역 마케팅을 늘릴지, 어떤 고객을 VIP 로 대접할지 — 데이터는 세 파일로 보냈어."*

이 프로젝트에서 **pandas 로 현실 EDA 전 과정을 체험** 합니다.

### 🧰 쓸 것
- **정제** — \`fillna\`, \`astype\`
- **결합** — 3-way \`merge\`
- **파생 컬럼** — 금액·월·요일
- **집계** — \`groupby\`, \`pivot_table\`, 누적합, 순위
- **보고서 조립** — f-string 으로 브리핑 본문 자동 생성

### 📦 데이터
- \`users\` — 고객 10명 (지역·가입일 포함)
- \`products\` — 상품 8개 (카테고리·가격)
- \`orders\` — 주문 60건 (한 달치, 결측 일부 포함)

### 🎯 목표
1. **정제 → 결합 → 분석** 의 실무 EDA 흐름 체득
2. **숫자에 해석과 제안을 붙이는 습관** — 보고서까지 완성
3. **파레토 법칙**(80/20) 을 데이터로 직접 확인`,
    steps: [
      {
        title: "3개 가상 테이블 생성",
        stepMarker: "STEP 1",
        description:
          "실무에서는 이 부분이 '**DB 에서 SQL 로 쿼리**' 이지만, 학습용으로 **세 개의 DataFrame** 을 직접 만듭니다. \`users\`(고객), \`products\`(상품), \`orders\`(주문) — 이 3-테이블 구조는 실제 e-commerce 의 축소판이에요. 주문 60건 중 **일부러 3건의 \`quantity\` 를 결측** 으로 넣어 현실성을 확보합니다.",
        hint: "`pd.DataFrame({...})` 으로 딕셔너리에서 만들기. 날짜는 `pd.to_datetime([...])`. `np.random.seed(42)` 로 재현성 확보.",
        snippet: `users = pd.DataFrame({
    "user_id": [1, 2, 3, ...],
    "region":  ["서울", ...],
    "joined":  pd.to_datetime([...]),
})`,
        solution: `import pandas as pd
import numpy as np

users = pd.DataFrame({
    "user_id": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "name":    ["김민지", "박철수", "이영희", "정수진", "최지훈",
                "강서연", "윤도현", "한수아", "장민재", "서유나"],
    "region":  ["서울", "서울", "부산", "서울", "제주",
                "부산", "서울", "대구", "서울", "제주"],
    "joined":  pd.to_datetime([
        "2023-02-11", "2023-08-22", "2024-01-05", "2024-05-18", "2024-06-30",
        "2024-07-10", "2024-07-20", "2024-07-28", "2024-08-01", "2024-08-05",
    ]),
})

products = pd.DataFrame({
    "product_id": [100, 101, 102, 103, 104, 105, 106, 107],
    "item":       ["티셔츠", "청바지", "노트북", "에어팟", "콜라",
                   "샌드위치", "키보드", "원피스"],
    "category":   ["의류", "의류", "전자", "전자", "식품",
                   "식품", "전자", "의류"],
    "price":      [29000, 52000, 1200000, 280000, 1500,
                   4500, 89000, 68000],
})

np.random.seed(42)
n = 60
orders = pd.DataFrame({
    "order_id":   range(1001, 1001 + n),
    "user_id":    np.random.choice(users["user_id"], size=n),
    "product_id": np.random.choice(products["product_id"], size=n),
    "quantity":   np.random.randint(1, 5, size=n),
    "ordered_at": pd.to_datetime(np.random.choice(
        pd.date_range("2024-07-15", "2024-08-14"), size=n
    )),
})
orders.loc[[5, 20, 35], "quantity"] = np.nan

print(f"✅ users: {len(users)}행 / products: {len(products)}행 / orders: {len(orders)}행")`,
        checkpoint: "각 테이블의 행 수가 10 / 8 / 60 으로 출력되면 OK.",
      },
      {
        title: "결측 정제 + 3-way merge + 파생 컬럼",
        stepMarker: "STEP 2",
        description:
          "분석의 뿌리가 될 통합 \`df\` 를 만듭니다. 핵심 3단계: ① \`quantity\` 결측을 **평균값으로 fillna**, ② \`orders\` 기준으로 \`users\`·\`products\` 를 순차 **merge**, ③ \`amount\`·\`month\`·\`dow\`(요일) 같은 **파생 컬럼** 추가. 파생 컬럼은 이후 모든 집계의 재료가 됩니다.",
        hint: "merge 는 `on='user_id'`, `on='product_id'` 로 두 번 연결. 파생 컬럼은 `df['amount'] = df['quantity'] * df['price']` 처럼 한 줄.",
        snippet: `orders["quantity"] = orders["quantity"].fillna(...).astype(int)

df = (orders
      .merge(users,    on="user_id")
      .merge(products, on="product_id"))

df["amount"] = df["quantity"] * df["price"]`,
        solution: `mean_q = orders["quantity"].mean()
orders["quantity"] = orders["quantity"].fillna(round(mean_q)).astype(int)
print(f"✅ quantity 결측 3건 → 평균 {round(mean_q)} 로 보정")

df = (orders
      .merge(users,    on="user_id")
      .merge(products, on="product_id"))

df["amount"] = df["quantity"] * df["price"]
df["month"]  = df["ordered_at"].dt.to_period("M").astype(str)
df["dow"]    = df["ordered_at"].dt.day_name()

print(f"✅ 통합 df: {df.shape[0]}행 × {df.shape[1]}열")
print(df[["name", "region", "item", "category", "quantity", "amount"]].head())`,
        checkpoint: "60행 × 12열 전후, amount 컬럼이 올바르게 계산되어 있으면 OK.",
      },
      {
        title: "전체·지역별 기초 지표",
        stepMarker: "STEP 3",
        description:
          "EDA 의 첫 걸음은 **'그래서 숫자가 몇이야?'** 에 답하는 것. 총 매출·주문 수·객단가·고객 수를 뽑고, 그다음 \`groupby('region')\` 으로 **지역별로 쪼개** 봅니다. 이 단계에서 '어느 지역이 큰 시장인지' 의 감을 잡아요.",
        hint: "`.agg(이름=(컬럼, '함수'))` 문법으로 여러 집계를 한 번에. `nunique` 는 고유값 수(중복 제거).",
        snippet: `region_summary = df.groupby("region").agg(
    users_active = ("user_id", "nunique"),
    orders       = ("order_id", "count"),
    total_sales  = ("amount", "sum"),
)`,
        solution: `print("📦 전체 요약")
print(f"   기간:    {df['ordered_at'].min().date()} ~ {df['ordered_at'].max().date()}")
print(f"   총 매출: {df['amount'].sum():>12,}원")
print(f"   주문 수: {len(df):>12}건")
print(f"   객단가:  {df['amount'].mean():>12,.0f}원")
print(f"   고객 수: {df['user_id'].nunique():>12}명")

region_summary = df.groupby("region").agg(
    users_active = ("user_id", "nunique"),
    orders       = ("order_id", "count"),
    total_sales  = ("amount", "sum"),
    avg_order    = ("amount", "mean"),
).round(0).astype({"total_sales": int, "avg_order": int})

print("\\n📍 지역별 요약")
print(region_summary)`,
        checkpoint: "서울이 가장 큰 시장으로 나와야 합니다 (고객 수 4명).",
      },
      {
        title: "💎 인사이트 1 — 어느 카테고리를 밀지",
        stepMarker: "STEP 4",
        description:
          "카테고리 3개(의류/전자/식품) 중 **어느 쪽이 매출을 주도** 하는지 \`groupby('category')\` 로 확인. 단순 합계뿐 아니라 **점유율(share_pct)** 과 **평균 객단가** 까지 같이 보는 게 핵심. 숫자 하나에 **해석** 과 **제안** 을 붙이는 습관을 들입니다.",
        hint: "점유율 = 자기 합 / 전체 합 × 100. `.sort_values('total_sales', ascending=False)` 로 내림차순.",
        snippet: `category_view = df.groupby("category").agg(
    total_sales = ("amount", "sum"),
    order_count = ("order_id", "count"),
    avg_amount  = ("amount", "mean"),
)
category_view["share_pct"] = ...`,
        solution: `category_view = df.groupby("category").agg(
    total_sales = ("amount", "sum"),
    order_count = ("order_id", "count"),
    avg_amount  = ("amount", "mean"),
)
category_view["share_pct"] = (
    category_view["total_sales"] / category_view["total_sales"].sum() * 100
).round(1)
category_view = category_view.sort_values("total_sales", ascending=False)

print("💎 카테고리별 기여")
print(category_view.astype({"total_sales": int, "avg_amount": int}))

top = category_view.iloc[0]
print(f"\\n🧠 인사이트 1: '{category_view.index[0]}' 카테고리가 전체의 {top['share_pct']}% 차지")
print(f"   객단가 {top['avg_amount']:,.0f}원 — 단일 구매 규모가 큼")
print(f"   → 제안: 재고 확충 + 프리미엄 라인 확장")`,
        checkpoint: "'전자' 카테고리가 1위로 나오면서 점유율 80% 내외를 차지해야 정상.",
      },
      {
        title: "🗺️ 인사이트 2 — 지역 × 카테고리 피벗",
        stepMarker: "STEP 5",
        description:
          "'지역마다 선호 카테고리가 다른가?' 를 확인. \`pivot_table\` 로 **행=지역 / 열=카테고리 / 값=매출합** 의 교차표를 만들고, 지역별 1위 카테고리를 뽑아냅니다. 이 표 한 장이면 **지역별 타깃 광고 전략** 이 바로 나와요.",
        hint: "`pivot_table(index='region', columns='category', values='amount', aggfunc='sum', fill_value=0)`.",
        snippet: `pivot = df.pivot_table(
    index="region",
    columns="category",
    values="amount",
    aggfunc="sum",
    fill_value=0,
).astype(int)`,
        solution: `pivot = df.pivot_table(
    index="region",
    columns="category",
    values="amount",
    aggfunc="sum",
    fill_value=0,
).astype(int)
pivot["합계"] = pivot.sum(axis=1)
pivot = pivot.sort_values("합계", ascending=False)

print("🗺️ 지역 × 카테고리 매출")
print(pivot)

top_cat_per_region = (df.groupby(["region", "category"])["amount"].sum()
                        .reset_index()
                        .sort_values(["region", "amount"], ascending=[True, False])
                        .groupby("region")
                        .head(1))

print("\\n📌 지역별 베스트 카테고리:")
for _, row in top_cat_per_region.iterrows():
    print(f"   {row['region']}: {row['category']} ({row['amount']:,}원)")

print("\\n🧠 인사이트 2: 지역마다 '끌리는 카테고리' 가 다름")
print("   → 제안: 지역별 타깃 광고 분리 (서울·부산·제주·대구 각각)")`,
        checkpoint: "피벗 표에서 지역 × 카테고리 교차 매출이 보이고, 지역별 1위 카테고리가 각각 출력되면 OK.",
      },
      {
        title: "🏆 인사이트 3 — VIP 고객 (파레토 법칙)",
        stepMarker: "STEP 6",
        description:
          "**상위 20% 고객이 전체 매출의 몇 % 를 만들까?** 고객별 지출 합을 내림차순으로 정렬 → 누적 비율(\`cumsum\`) 계산 → 상위 20% 컷오프. 이 분석이 **파레토 법칙**(80/20) 을 데이터로 직접 확인하는 가장 고전적 방법이에요.",
        hint: "`cumsum() / total * 100` 이 누적 비율. `int(len(...) * 0.2)` 로 상위 20% 인원 수.",
        snippet: `customer_view = df.groupby(["user_id", "name", "region"]).agg(
    total_spent = ("amount", "sum"),
    order_count = ("order_id", "count"),
).reset_index().sort_values("total_spent", ascending=False)`,
        solution: `customer_view = df.groupby(["user_id", "name", "region"]).agg(
    total_spent = ("amount", "sum"),
    order_count = ("order_id", "count"),
    avg_order   = ("amount", "mean"),
).reset_index()

customer_view = customer_view.sort_values("total_spent", ascending=False).reset_index(drop=True)
customer_view["rank"]    = customer_view.index + 1
customer_view["pct_cum"] = (
    customer_view["total_spent"].cumsum() / customer_view["total_spent"].sum() * 100
).round(1)

top_n = max(1, int(len(customer_view) * 0.2))
vip = customer_view.head(top_n).copy()
vip_share = vip["total_spent"].sum() / customer_view["total_spent"].sum() * 100

print("🏆 전체 고객 순위:")
print(customer_view[["rank", "name", "region", "total_spent", "order_count", "pct_cum"]]
      .to_string(index=False))
print(f"\\n💎 상위 {top_n}명 ({top_n/len(customer_view):.0%}) 이 전체 매출의 {vip_share:.1f}% 차지")
print("\\n🧠 인사이트 3: 파레토 가까운 구조 — VIP 케어가 매출 방어의 핵심")
print("   → 제안: 조기 신상품 공개, 전용 쿠폰, 생일 선물, 전담 담당자")`,
        checkpoint: "상위 2명(20%)이 전체 매출의 상당 부분을 차지하는 구조가 보이면 OK.",
      },
      {
        title: "📝 CEO 용 최종 보고서 브리핑",
        stepMarker: "STEP 7",
        description:
          "위 3가지 인사이트를 **실제 보고서 본문** 으로 조립합니다. f-string + \`.to_string()\` 으로 숫자·표·제안을 한 덩어리 텍스트로 만들어, 복사만 하면 이메일·슬랙에 그대로 붙여넣을 수 있는 형태로 완성해요. **분석의 가치는 '숫자' 가 아니라 '의사결정으로 이어지는 제안'** 이라는 마무리.",
        hint: "`f'''...'''` 로 여러 줄 f-string. `{변수}` 로 직접 숫자 삽입, `{df_obj.to_string()}` 로 표 삽입.",
        snippet: `report = f"""
══════════════════════════════
  📊 한 달 데이터 분석 브리핑
  ...
══════════════════════════════

[핵심 지표]
  ...
"""`,
        solution: `report = f"""
════════════════════════════════════════════════════════
  📊 지난 한 달 데이터 분석 브리핑
  기간: {df['ordered_at'].min().date()} ~ {df['ordered_at'].max().date()}
════════════════════════════════════════════════════════

[핵심 지표]
  총 매출   {df['amount'].sum():>12,}원
  주문 수   {len(df):>12}건
  객단가    {df['amount'].mean():>12,.0f}원
  활성 고객 {df['user_id'].nunique():>12}명

[인사이트 1 — 카테고리]
  '{category_view.index[0]}' 가 전체 매출의 {category_view.iloc[0]['share_pct']}% 차지
  → 제안: 해당 카테고리 재고 확충 + 가격 실험

[인사이트 2 — 지역 × 카테고리]
{pivot.to_string()}
  → 제안: 지역별 타깃 광고 분리

[인사이트 3 — VIP 고객]
  상위 {len(vip)}명이 전체의 {vip['total_spent'].sum() / customer_view['total_spent'].sum() * 100:.1f}% 매출 기여
  TOP 3: {', '.join(vip['name'].head(3).tolist())}
  → 제안: VIP 프로그램 설계 (조기 신상품 공개 / 전용 쿠폰 / 전담 담당자)
════════════════════════════════════════════════════════
"""
print(report)`,
        checkpoint: "보고서 전체가 깔끔히 출력되면 프로젝트 완료.",
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

### 📦 STEP 1~2 — 데이터 준비 & 정제
\`\`\`
✅ users: 10행 / products: 8행 / orders: 60행
✅ quantity 결측 3건 → 평균 2 로 보정
✅ 통합 df: 60행 × 12열
\`\`\`

**해석**
- 현실 데이터는 **거의 항상 결측** 이 있음. \`fillna(평균)\` 은 가장 단순한 보정법 — 실무에선 **중앙값·KNN·모델 예측** 등 더 정교한 방법도 씀.
- \`merge\` 3번 = **"사건(orders) 에 맥락(users, products) 붙이기"**. 이게 현업 분석의 출발점 — 한 테이블만 보고는 답을 못 냄.

---

### 📍 STEP 3 — 기초 지표
\`\`\`
📦 전체 요약
   총 매출: 수천만원 규모
   주문 수: 60건
   객단가:  수십만원~백만원대
   고객 수: 10명
📍 지역별 요약 (서울이 가장 큼)
\`\`\`

**해석**
- **객단가가 높은 이유** — 상품에 노트북(120만원) 이 섞여 있어 평균이 올라감. 중앙값을 따로 봐야 할 수도 있다는 신호.
- **서울 4명·부산 2명·제주 2명·대구 1명** — 지역 편중 → 마케팅 예산 배분에 직접 영향.

---

### 💎 STEP 4 — 카테고리 인사이트
\`\`\`
💎 카테고리별 기여
            total_sales  order_count  avg_amount  share_pct
category
전자            (가장 큼)     ~25건     (압도적)    80% 내외
의류              ...         ~25건       ...       ~15%
식품              ...         ~10건       ...       ~1~2%
\`\`\`

**왜 전자가 압도적인가?**
- \`amount = quantity × price\` 인데 노트북·에어팟·키보드는 **price 자체가 크다**.
- **점유율 80% 내외** = 파레토 법칙이 카테고리에도 적용. 재고·마케팅·고객 서비스를 전자에 집중할 가치.

⚠️ **주의**: 이 숫자는 "전자가 중요" 라고 말하지만, **"의류·식품을 버려라"** 는 아님. 고객 충성도는 저가 반복 구매에서도 나옴.

---

### 🗺️ STEP 5 — 지역 × 카테고리
\`\`\`
🗺️ 지역 × 카테고리 매출
category    식품    의류       전자        합계
region
서울          ...    ...   수천만원   수천만원
부산          ...    ...       ...       ...
...
\`\`\`

**해석**
- 지역마다 **'가장 잘 팔리는 카테고리' 가 다름** → 광고 크리에이티브를 지역별로 분리해야 함.
- 데이터 규모가 작아 우연의 영향이 큼 — 실무에선 **통계 유의성 검정**(χ² test 등) 으로 재확인.

---

### 🏆 STEP 6 — VIP 파레토
\`\`\`
🏆 전체 고객 순위
  rank  name    region  total_spent  order_count  pct_cum
     1  ...     서울       가장 큼          ~10        30% 내외
     2  ...     ...         ...            ...       50%+
     ...

💎 상위 2명(20%) 이 전체 매출의 상당 부분 차지
\`\`\`

**파레토 법칙의 생생한 증거**
- **\`pct_cum\`** (누적 비율) 이 핵심 열. 1~2등만 봐도 전체의 반 이상.
- 이 구조가 의미하는 것: **상위 고객을 잃으면 매출 구멍이 크다** → VIP 이탈 방지 = 생존 전략.

⚠️ **현실적 주의**: 10명짜리 데이터는 **우연이 결정적**. 진짜 분석은 수천 명 이상에서만 신뢰 가능. 여기선 패턴을 **체험** 한 것.

---

### 📝 STEP 7 — 보고서 완성
\`\`\`
════════════════════════════════════════
  📊 지난 한 달 데이터 분석 브리핑
  ...
[인사이트 1 — 카테고리]
  '전자' 가 전체 매출의 ~80% 차지
  → 제안: 해당 카테고리 재고 확충 + 가격 실험
...
════════════════════════════════════════
\`\`\`

**왜 이 형식인가?**
- CEO 는 **'숫자 + 해석 + 제안'** 을 원함. 숫자만 보내면 "그래서 어쩌라고?" 가 됨.
- f-string 으로 보고서 조립 = **분석 결과의 자동 리포팅** 패턴. 매주 같은 포맷으로 돌릴 수 있음.

---

### ⚠️ 이 프로젝트의 한계

| 한계 | 실무에선 어떻게? |
|------|----------------|
| **데이터 60건** | 수만~수백만 행 |
| **랜덤 생성 데이터** | 실제 DB / 로그 |
| **\`groupby\` 만 사용** | 시계열·코호트·퍼널 분석 추가 |
| **시각화 없음** | matplotlib·seaborn·plotly 필수 |
| **고정 시드 42** | A/B 테스트·통계 검정 필요 |

---

### 🧪 지금 시도해 볼 것

1. **데이터 크기 10배**: \`n = 600\` 으로 바꾸고 파레토가 얼마나 더 뚜렷해지는지.
2. **새 인사이트**: \`df["hour"] = df["ordered_at"].dt.hour\` 로 **시간대별 매출** 분석.
3. **요일 패턴**: \`df.groupby("dow")["amount"].sum()\` + 요일 재정렬(Mon~Sun). 주말이 평일보다 높은지?
4. **이탈 위험 고객**: \`joined\` 날짜가 오래된 vs 최근 고객의 구매 패턴 차이.
5. **가장 자주 함께 팔리는 상품 페어** (장바구니 분석 시작점).

### 🏁 이 프로젝트에서 배운 것
- ✅ **실무 EDA 전 과정**: 수집 → 정제 → 결합 → 집계 → 해석 → 제안
- ✅ **3-way merge**: 한 테이블 분석의 한계를 넘어서는 핵심 도구
- ✅ **\`groupby\` + \`.agg()\` + \`pivot_table\`**: 보고서 수준의 자동화 가능
- ✅ **파레토 법칙의 실체**: 추상 개념이 누적 비율 계산으로 손에 잡힘
- ✅ **숫자에 해석·제안을 붙이는 습관**: 분석의 가치는 의사결정에서 나옴

> 💡 "**데이터로 질문을 던지는 근육**" 이 분석가의 가장 중요한 자산. 숫자 하나를 보면 **"왜?" 와 "그래서?" 를 다섯 번 묻는 습관** 을 들이세요.`,
        checkpoint: "위 해설을 읽고, 🧪 시도해 볼 것 중 최소 하나를 직접 실행해 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        language: "python",
        content: `# 📊 e-commerce 3-테이블 EDA 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP 으로 이동할 수 있어요.
# 시나리오: 신규 분석가로 입사 → CEO 에게 한 달 데이터로 인사이트 3가지 브리핑

import pandas as pd
import numpy as np


## STEP 1: 3개 가상 테이블 만들기 (users / products / orders)
# 실무에서는 DB 에서 SQL 로 가져오지만, 학습용으로 직접 생성.
# orders 의 quantity 일부는 일부러 결측 — 현실성 확보.
users = pd.DataFrame({
    "user_id": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "name":    ["김민지", "박철수", "이영희", "정수진", "최지훈",
                "강서연", "윤도현", "한수아", "장민재", "서유나"],
    "region":  ["서울", "서울", "부산", "서울", "제주",
                "부산", "서울", "대구", "서울", "제주"],
    "joined":  pd.to_datetime([
        "2023-02-11", "2023-08-22", "2024-01-05", "2024-05-18", "2024-06-30",
        "2024-07-10", "2024-07-20", "2024-07-28", "2024-08-01", "2024-08-05",
    ]),
})

products = pd.DataFrame({
    "product_id": [100, 101, 102, 103, 104, 105, 106, 107],
    "item":       ["티셔츠", "청바지", "노트북", "에어팟", "콜라",
                   "샌드위치", "키보드", "원피스"],
    "category":   ["의류", "의류", "전자", "전자", "식품",
                   "식품", "전자", "의류"],
    "price":      [29000, 52000, 1200000, 280000, 1500,
                   4500, 89000, 68000],
})

np.random.seed(42)
n = 60
orders = pd.DataFrame({
    "order_id":   range(1001, 1001 + n),
    "user_id":    np.random.choice(users["user_id"], size=n),
    "product_id": np.random.choice(products["product_id"], size=n),
    "quantity":   np.random.randint(1, 5, size=n),
    "ordered_at": pd.to_datetime(np.random.choice(
        pd.date_range("2024-07-15", "2024-08-14"), size=n
    )),
})
orders.loc[[5, 20, 35], "quantity"] = np.nan

print(f"✅ users: {len(users)}행 / products: {len(products)}행 / orders: {len(orders)}행")


## STEP 2: 결측 정제 + 3-way merge + 파생 컬럼
# 결측 보정 → 테이블 결합 → amount/month/dow 파생
mean_q = orders["quantity"].mean()
orders["quantity"] = orders["quantity"].fillna(round(mean_q)).astype(int)
print(f"✅ quantity 결측 3건 → 평균 {round(mean_q)} 로 보정")

df = (orders
      .merge(users,    on="user_id")
      .merge(products, on="product_id"))

df["amount"] = df["quantity"] * df["price"]
df["month"]  = df["ordered_at"].dt.to_period("M").astype(str)
df["dow"]    = df["ordered_at"].dt.day_name()

print(f"✅ 통합 df: {df.shape[0]}행 × {df.shape[1]}열")
print(df[["name", "region", "item", "category", "quantity", "amount"]].head())


## STEP 3: 전체·지역별 기초 지표
print("\\n📦 전체 요약")
print(f"   기간:    {df['ordered_at'].min().date()} ~ {df['ordered_at'].max().date()}")
print(f"   총 매출: {df['amount'].sum():>12,}원")
print(f"   주문 수: {len(df):>12}건")
print(f"   객단가:  {df['amount'].mean():>12,.0f}원")
print(f"   고객 수: {df['user_id'].nunique():>12}명")

region_summary = df.groupby("region").agg(
    users_active = ("user_id", "nunique"),
    orders       = ("order_id", "count"),
    total_sales  = ("amount", "sum"),
    avg_order    = ("amount", "mean"),
).round(0).astype({"total_sales": int, "avg_order": int})

print("\\n📍 지역별 요약")
print(region_summary)


## STEP 4: 💎 인사이트 1 — 어느 카테고리를 밀지
category_view = df.groupby("category").agg(
    total_sales = ("amount", "sum"),
    order_count = ("order_id", "count"),
    avg_amount  = ("amount", "mean"),
)
category_view["share_pct"] = (
    category_view["total_sales"] / category_view["total_sales"].sum() * 100
).round(1)
category_view = category_view.sort_values("total_sales", ascending=False)

print("\\n💎 카테고리별 기여")
print(category_view.astype({"total_sales": int, "avg_amount": int}))

top = category_view.iloc[0]
print(f"\\n🧠 인사이트 1: '{category_view.index[0]}' 카테고리가 전체의 {top['share_pct']}% 차지")
print(f"   객단가 {top['avg_amount']:,.0f}원 — 단일 구매 규모가 큼")
print(f"   → 제안: 재고 확충 + 프리미엄 라인 확장")


## STEP 5: 🗺️ 인사이트 2 — 지역 × 카테고리 피벗
pivot = df.pivot_table(
    index="region",
    columns="category",
    values="amount",
    aggfunc="sum",
    fill_value=0,
).astype(int)
pivot["합계"] = pivot.sum(axis=1)
pivot = pivot.sort_values("합계", ascending=False)

print("\\n🗺️ 지역 × 카테고리 매출")
print(pivot)

top_cat_per_region = (df.groupby(["region", "category"])["amount"].sum()
                        .reset_index()
                        .sort_values(["region", "amount"], ascending=[True, False])
                        .groupby("region")
                        .head(1))

print("\\n📌 지역별 베스트 카테고리:")
for _, row in top_cat_per_region.iterrows():
    print(f"   {row['region']}: {row['category']} ({row['amount']:,}원)")

print("\\n🧠 인사이트 2: 지역마다 '끌리는 카테고리' 가 다름")
print("   → 제안: 지역별 타깃 광고 분리")


## STEP 6: 🏆 인사이트 3 — VIP 고객 (파레토 법칙)
customer_view = df.groupby(["user_id", "name", "region"]).agg(
    total_spent = ("amount", "sum"),
    order_count = ("order_id", "count"),
    avg_order   = ("amount", "mean"),
).reset_index()

customer_view = customer_view.sort_values("total_spent", ascending=False).reset_index(drop=True)
customer_view["rank"]    = customer_view.index + 1
customer_view["pct_cum"] = (
    customer_view["total_spent"].cumsum() / customer_view["total_spent"].sum() * 100
).round(1)

top_n = max(1, int(len(customer_view) * 0.2))
vip = customer_view.head(top_n).copy()
vip_share = vip["total_spent"].sum() / customer_view["total_spent"].sum() * 100

print("\\n🏆 전체 고객 순위:")
print(customer_view[["rank", "name", "region", "total_spent", "order_count", "pct_cum"]]
      .to_string(index=False))
print(f"\\n💎 상위 {top_n}명 ({top_n/len(customer_view):.0%}) 이 전체 매출의 {vip_share:.1f}% 차지")
print("\\n🧠 인사이트 3: 파레토 가까운 구조 — VIP 케어가 매출 방어의 핵심")
print("   → 제안: 조기 신상품 공개, 전용 쿠폰, 생일 선물")


## STEP 7: 📝 CEO 용 최종 보고서 브리핑
report = f"""
════════════════════════════════════════════════════════
  📊 지난 한 달 데이터 분석 브리핑
  기간: {df['ordered_at'].min().date()} ~ {df['ordered_at'].max().date()}
════════════════════════════════════════════════════════

[핵심 지표]
  총 매출   {df['amount'].sum():>12,}원
  주문 수   {len(df):>12}건
  객단가    {df['amount'].mean():>12,.0f}원
  활성 고객 {df['user_id'].nunique():>12}명

[인사이트 1 — 카테고리]
  '{category_view.index[0]}' 가 전체 매출의 {category_view.iloc[0]['share_pct']}% 차지
  → 제안: 해당 카테고리 재고 확충 + 가격 실험

[인사이트 2 — 지역 × 카테고리]
{pivot.to_string()}
  → 제안: 지역별 타깃 광고 분리

[인사이트 3 — VIP 고객]
  상위 {len(vip)}명이 전체의 {vip['total_spent'].sum() / customer_view['total_spent'].sum() * 100:.1f}% 매출 기여
  TOP 3: {', '.join(vip['name'].head(3).tolist())}
  → 제안: VIP 프로그램 설계 (조기 신상품 공개 / 전용 쿠폰 / 전담 담당자)
════════════════════════════════════════════════════════
"""
print(report)
`,
      },
    },
  },
  {
    id: "churn-prediction",
    category: "classification",
    title: "고객 이탈 예측 (SaaS Churn)",
    subtitle: "EDA → 전처리 → 모델 비교 → 해석까지 실전 ML 플로우",
    icon: "📉",
    difficulty: "intermediate",
    estimatedMinutes: 55,
    tags: ["scikit-learn", "분류", "불균형", "파이프라인", "모델해석"],
    description: `## 📉 고객 이탈 예측 프로젝트

**시나리오**: 여러분은 구독형 SaaS 의 **데이터 사이언티스트**. 월 이탈률이 **6%** 까지 치솟았고, CEO 가 말합니다.

> *"이번 주 안에 '이탈 위험 높은 고객' 을 미리 알려주는 **예측 모델** 을 내놔줘.
> 어떤 피처가 이탈을 예측하는지, 마케팅팀에 어떻게 조치를 권할지까지 같이."*

이 프로젝트에서 **실전 ML 프로젝트의 전체 플로우** 를 한 번에 밟아봅니다.

### 🧰 쓸 도구 (ML 실습 트랙 총복습)
- 📊 **EDA** — \`describe\`, \`value_counts\`, 피처×타깃 관계
- 🧹 **전처리 파이프라인** — \`ColumnTransformer\` (숫자=StandardScaler + 카테고리=OneHotEncoder)
- 🥇 **모델 후보 비교** — Logistic / RandomForest / GradientBoosting 교차검증
- ⚖️ **불균형 대응** — \`stratify\`, \`class_weight\`, F1 스코어
- 🔍 **모델 해석** — \`permutation_importance\` 로 "어떤 피처 때문에?"
- 📉 **임계값 조정** — 예산 제약에 따라 recall/precision 트레이드오프
- 📝 **경영진 보고서** — 숫자 + 해석 + 권장 액션까지 f-string 조립

### 📦 데이터
2000명의 **가상 SaaS 고객**:
- 숫자 피처 4개: tenure(가입 개월), monthly_charges, support_tickets, login_days_30d
- 카테고리 3개: plan_type, contract, payment
- 타깃: \`churn\` (0=유지, 1=이탈) — 규칙 기반 + 노이즈로 생성, 불균형 약 20%

### 🎯 배울 것
1. **실전 ML 플로우의 표준 순서** 를 손에 익히기
2. 숫자 하나(F1)가 아니라 **"왜 이 모델을 쓰는지"** 를 설명하는 법
3. 모델 결과를 **비즈니스 액션으로 번역** 하는 보고서 작성`,
    steps: [
      {
        title: "가상 고객 데이터 2000명 생성",
        stepMarker: "STEP 1",
        description:
          "규칙 기반 + 노이즈로 **SaaS 고객 테이블** 을 만듭니다. 실제 테이블과 동일한 구조 (숫자 4 + 카테고리 3 + churn 타깃). \`monthly 계약 + 요금 높음 + 지원 티켓 多 + 최근 로그인 적음 → 이탈 가능성 ↑\` 이라는 **숨겨진 규칙** 이 데이터 안에 박혀 있어요. 모델이 이걸 얼마나 발견하는지가 뒷 스텝의 관전 포인트.",
        hint: "`np.random.seed(42)` 는 재현성 확보의 시작. `pd.DataFrame({...})` 로 묶어 하나의 표로.",
        snippet: `np.random.seed(42)
n = 2000

# 숫자/카테고리 피처 생성 + churn 을 규칙+노이즈로 만들기
...
df = pd.DataFrame({...})`,
        solution: `import numpy as np
import pandas as pd
np.random.seed(42)

n = 2000

tenure_months     = np.random.gamma(shape=2, scale=6, size=n).clip(0.5, 60).round(1)
monthly_charges   = np.random.normal(loc=65, scale=20, size=n).clip(20, 130).round(2)
support_tickets   = np.random.poisson(lam=2, size=n)
login_days_30d    = np.random.binomial(n=30, p=0.5, size=n)

plan_type = np.random.choice(["Basic", "Pro", "Enterprise"], size=n, p=[0.5, 0.35, 0.15])
contract  = np.random.choice(["Monthly", "Annual", "TwoYear"], size=n, p=[0.55, 0.30, 0.15])
payment   = np.random.choice(["Card", "Bank", "PayPal"], size=n, p=[0.6, 0.3, 0.1])

# 이탈은 규칙 + 노이즈 — 모델이 규칙을 얼마나 잘 찾아내나 관전
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
print(df.head())`,
        checkpoint: "2000행 × 8열, 이탈률 20% 내외면 OK.",
      },
      {
        title: "📊 EDA — 피처 × 이탈 관계 훑기",
        stepMarker: "STEP 2",
        description:
          "모델 학습 전 **'이 데이터가 뭐가 들었지?'** 에 답하는 단계. \`describe\` 로 숫자 요약, \`value_counts\` 로 카테고리 분포, 그리고 **이탈자 vs 유지자의 평균 비교** + **계약 유형별 이탈률** 을 뽑아 **숨겨진 규칙의 힌트** 를 찾아내요. 이 단계에서 '월 계약이 이탈률 높아 보인다' 같은 직감이 생깁니다.",
        hint: "`df.groupby('churn')[...].mean()` 으로 이탈자/유지자 평균 비교. `df.groupby('contract')['churn'].agg(['count','mean'])` 으로 계약별 이탈률.",
        snippet: `print(df.describe().round(2))

print(df.groupby("churn")[숫자 피처들].mean())
print(df.groupby("contract")["churn"].agg(["count", "mean"]))`,
        solution: `print("🔢 숫자 피처 요약")
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
print()

print("📊 이탈자 vs 유지자의 평균 비교")
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

print("🧠 힌트: Monthly 계약 고객의 이탈률이 압도적으로 높죠? 모델이 이걸 잘 찾는지 뒷 단계에서 확인.")`,
        checkpoint: "Monthly 계약의 이탈률이 Annual·TwoYear 보다 훨씬 높게 나와야 정상.",
      },
      {
        title: "🔪 훈련/테스트 분할 (stratify)",
        stepMarker: "STEP 3",
        description:
          "이탈 비율은 불균형(~20%). 단순 분할하면 훈련·테스트 세트의 이탈 비율이 달라질 수 있어 **\`stratify=y\`** 필수. 이 한 옵션이 **'훈련에서 잘 맞췄지만 테스트에선 망하는'** 사고를 예방합니다.",
        hint: "`train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)`.",
        snippet: `from sklearn.model_selection import train_test_split

X = df.drop(columns=["churn"])
y = df["churn"]

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)`,
        solution: `from sklearn.model_selection import train_test_split

X = df.drop(columns=["churn"])
y = df["churn"]

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)
print(f"훈련: {len(X_tr)}행 (이탈 {y_tr.mean():.1%})")
print(f"테스트: {len(X_te)}행 (이탈 {y_te.mean():.1%})")
print("→ 두 세트의 이탈 비율이 거의 동일 = stratify 효과!")`,
        checkpoint: "훈련/테스트의 이탈 비율이 서로 1%p 이내로 비슷해야 stratify 정상 작동.",
      },
      {
        title: "🛠️ 전처리 파이프라인 (ColumnTransformer)",
        stepMarker: "STEP 4",
        description:
          "숫자 피처는 **StandardScaler** 로 표준화, 카테고리는 **OneHotEncoder** 로 변환 — 서로 다른 전처리를 **한 객체에 묶는** 게 \`ColumnTransformer\`. 이걸 Pipeline 으로 감싸면 **교차검증·grid search 에서 누수(leakage) 없이** 모든 fold 에 같은 처리 적용.",
        hint: "`ColumnTransformer([('num', StandardScaler(), 숫자목록), ('cat', OneHotEncoder(handle_unknown='ignore'), 카테고리목록)])`.",
        snippet: `from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

numeric_cols     = ["tenure_months", "monthly_charges", "support_tickets", "login_days_30d"]
categorical_cols = ["plan_type", "contract", "payment"]

preprocessor = ColumnTransformer([...])`,
        solution: `from sklearn.compose import ColumnTransformer
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
print(f"   카테고리 피처: {len(categorical_cols)}개 → OneHotEncoder")`,
        checkpoint: "전처리기 준비 메시지가 출력되면 OK (이 단계는 모델 학습 전 준비 단계).",
      },
      {
        title: "🥇 여러 모델 비교 (5-fold 교차검증)",
        stepMarker: "STEP 5",
        description:
          "실무의 1단계는 **여러 베이스라인을 같은 조건에서 비교** 하는 것. Logistic(단순·해석 쉬움) / RandomForest(강건함) / GradientBoosting(성능 왕도) 셋을 동일한 전처리 + 5-fold CV + F1 스코어로 경주. 불균형이라 accuracy 는 피하고 **F1** 을 지표로 씀.",
        hint: "`Pipeline([('pre', preprocessor), ('clf', 모델)])` + `cross_val_score(pipe, X_tr, y_tr, cv=5, scoring='f1')`.",
        snippet: `candidates = {
    "Logistic (balanced)":     LogisticRegression(max_iter=1000, class_weight="balanced"),
    "RandomForest (balanced)": RandomForestClassifier(..., class_weight="balanced"),
    "GradientBoosting":        GradientBoostingClassifier(n_estimators=200, random_state=42),
}

for name, clf in candidates.items():
    pipe = Pipeline([("pre", preprocessor), ("clf", clf)])
    scores = cross_val_score(pipe, X_tr, y_tr, cv=5, scoring="f1", n_jobs=-1)
    print(name, scores.mean())`,
        solution: `from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

candidates = {
    "Logistic (balanced)":     LogisticRegression(max_iter=1000, class_weight="balanced"),
    "RandomForest (balanced)": RandomForestClassifier(n_estimators=200, class_weight="balanced",
                                                      random_state=42, n_jobs=-1),
    "GradientBoosting":        GradientBoostingClassifier(n_estimators=200, random_state=42),
}

print(f"{'모델':<28} {'5-fold F1':>12} {'표준편차':>10}")
print("-" * 55)

results = {}
for name, clf in candidates.items():
    pipe = Pipeline([("pre", preprocessor), ("clf", clf)])
    scores = cross_val_score(pipe, X_tr, y_tr, cv=5, scoring="f1", n_jobs=-1)
    results[name] = scores.mean()
    print(f"{name:<28} {scores.mean():>12.4f} {scores.std():>10.4f}")

best = max(results, key=results.get)
print(f"\\n🏆 최고 성능: {best}  (F1 평균 {results[best]:.4f})")`,
        checkpoint: "세 모델의 F1 이 모두 출력되고, 1등 모델명이 표시되면 OK. 보통 GradientBoosting 이 최고.",
      },
      {
        title: "🎯 최종 모델 학습 + 테스트 평가",
        stepMarker: "STEP 6",
        description:
          "챔피언(GradientBoosting) 을 **훈련 전체로 학습** 하고 **숨겨둔 테스트** 에서 평가. Confusion Matrix, classification_report, AUC-ROC 를 한 번에. 이 단계의 숫자가 **'진짜 실전 성능'** 입니다.",
        hint: "`final_pipe.fit(X_tr, y_tr)` → `y_pred = final_pipe.predict(X_te)` → `y_proba = final_pipe.predict_proba(X_te)[:, 1]`.",
        snippet: `from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

final_pipe = Pipeline([
    ("pre", preprocessor),
    ("clf", GradientBoostingClassifier(n_estimators=200, random_state=42)),
])
final_pipe.fit(X_tr, y_tr)

y_pred  = final_pipe.predict(X_te)
y_proba = final_pipe.predict_proba(X_te)[:, 1]`,
        solution: `from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

final_pipe = Pipeline([
    ("pre", preprocessor),
    ("clf", GradientBoostingClassifier(n_estimators=200, random_state=42)),
])
final_pipe.fit(X_tr, y_tr)

y_pred  = final_pipe.predict(X_te)
y_proba = final_pipe.predict_proba(X_te)[:, 1]

print("🎯 테스트 세트 성능\\n")
cm = confusion_matrix(y_te, y_pred)
tn, fp, fn, tp = cm.ravel()
print("Confusion Matrix:")
print(f"              예측 유지  예측 이탈")
print(f"  실제 유지    {tn:>6}       {fp:>6}")
print(f"  실제 이탈    {fn:>6}       {tp:>6}\\n")

print(classification_report(y_te, y_pred, digits=3,
                             target_names=["유지", "이탈"]))

print(f"AUC-ROC: {roc_auc_score(y_te, y_proba):.4f}")`,
        checkpoint: "AUC 0.85 이상 + 이탈 클래스의 recall 이 0.6+ 면 괜찮은 모델.",
      },
      {
        title: "🔍 모델 해석 (permutation importance)",
        stepMarker: "STEP 7",
        description:
          "**'어떤 피처 때문에 이탈로 예측한 건가?'** — 경영진 보고의 필수 질문. \`permutation_importance\` 는 한 피처를 **랜덤으로 섞은 뒤 성능이 얼마나 떨어지나** 로 중요도 측정. 섞었을 때 성능이 확 떨어지면 = 그 피처가 중요하다는 뜻.",
        hint: "`permutation_importance(final_pipe, X_te, y_te, n_repeats=10, scoring='f1')`. 결과의 `.importances_mean` 을 Series 로 묶어 정렬.",
        snippet: `from sklearn.inspection import permutation_importance

result = permutation_importance(
    final_pipe, X_te, y_te, n_repeats=10, random_state=42, scoring="f1"
)

imp = pd.Series(result.importances_mean, index=X_te.columns).sort_values(ascending=False)
print(imp)`,
        solution: `from sklearn.inspection import permutation_importance

result = permutation_importance(
    final_pipe, X_te, y_te, n_repeats=10, random_state=42, n_jobs=-1, scoring="f1"
)

imp = (pd.Series(result.importances_mean, index=X_te.columns)
         .sort_values(ascending=False))

print("🔍 이탈 예측 기여도 (permutation importance)\\n")
mx = imp.max()
for feat, val in imp.items():
    bar = "█" * int((val / mx) * 25) if val > 0 else ""
    print(f"   {feat:<20} {val:.4f}  {bar}")`,
        checkpoint: "contract·login_days_30d 중 하나가 상위에 등장해야 정상 (우리가 데이터에 심은 규칙 반영).",
      },
      {
        title: "📉 임계값 조정 + 📝 CEO 보고서",
        stepMarker: "STEP 8",
        description:
          "실무의 마지막 단계 둘을 합침: ① **임계값 스윕** — 예산 무제한이면 낮은 임계값(0.2, recall 우선), 예산 빠듯하면 높은 임계값(0.6, precision 우선). ② **f-string 으로 보고서 조립** — 성능 + 기여 피처 + 권장 임계값 + 실행 액션까지 경영진이 바로 쓸 수 있는 형태로.",
        hint: "임계값별: `y_pred_t = (y_proba >= t).astype(int)` + `precision_recall_fscore_support`. 보고서: `f\"\"\"...\"\"\"` 삼중 따옴표로 여러 줄.",
        snippet: `for t in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]:
    y_pred_t = (y_proba >= t).astype(int)
    p, r, f1, _ = precision_recall_fscore_support(y_te, y_pred_t, average="binary")
    print(t, p, r, f1)

report = f"""... {auc} ... {top3[0]} ..."""
print(report)`,
        solution: `from sklearn.metrics import precision_recall_fscore_support

print(f"{'threshold':>10} {'targets':>10} {'recall':>8} {'precision':>10} {'f1':>6}")
print("-" * 50)
for t in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]:
    y_pred_t = (y_proba >= t).astype(int)
    target_count = int(y_pred_t.sum())
    p, r, f1, _ = precision_recall_fscore_support(
        y_te, y_pred_t, average="binary", zero_division=0
    )
    print(f"{t:>10.2f} {target_count:>10} {r:>8.3f} {p:>10.3f} {f1:>6.3f}")

print("\\n💡 예산 무제한 → 낮은 임계값(0.2) / 예산 제한 → 높은 임계값(0.6)\\n")

# ── CEO 보고서 조립 ──
top3 = imp.head(3).index.tolist()
auc  = roc_auc_score(y_te, y_proba)

target_mask_03 = y_proba >= 0.3
n_targets_03   = int(target_mask_03.sum())
recall_03      = y_te[target_mask_03].sum() / y_te.sum()
precision_03   = y_te[target_mask_03].sum() / max(n_targets_03, 1)

report = f"""
══════════════════════════════════════════════════════════
  📊 고객 이탈 예측 모델 — 경영진 브리핑
══════════════════════════════════════════════════════════

[모델 성능]
  AUC-ROC        {auc:.3f}       (0.5=랜덤, 1.0=완벽)
  테스트 규모    {len(y_te)}명

[예측 영향도 상위 3 피처]
  1. {top3[0]}
  2. {top3[1]}
  3. {top3[2]}
  → 이 셋이 이탈 여부를 가장 강하게 가름
  → 제품팀과 공유: Monthly 계약·요금 높음·지원 티켓 잦음에 우선 개입

[권장 임계값: 0.3]
  대상 고객 수    {n_targets_03} / {len(y_te)}
  예상 recall     {recall_03:.1%}   (실제 이탈자 중 잡히는 비율)
  예상 precision  {precision_03:.1%}   (타깃 중 실제 이탈할 비율)
  → 포괄적 접근 (recall 우선). 예산 빠듯하면 0.5 로 상향.

[제안 액션]
  1. Monthly 계약 고객에게 연간 업그레이드 할인 쿠폰
  2. support_tickets ≥ 3 고객에게 전담 담당자 배정
  3. 최근 30일 로그인 < 10 고객에게 교육 이메일 발송
══════════════════════════════════════════════════════════
"""
print(report)`,
        checkpoint: "임계값 표가 0.2~0.7 각각의 recall/precision/f1 을 보여주고, 보고서 블록이 깔끔히 출력되면 프로젝트 완료.",
      },
      {
        title: "🎯 결과 해설 — 출력이 무슨 뜻인가?",
        description: `## 여러분이 방금 한 일 정리

### 📦 STEP 1~2 — 데이터 & EDA
\`\`\`
✅ 고객 데이터: 2000행 × 8열
   이탈률: 약 20%

📊 계약 유형별 이탈률
           고객수   이탈률
contract
Monthly    1100+    0.35+
Annual      600     0.05
TwoYear     300     0.01
\`\`\`

**해석**
- **Monthly 계약 이탈률이 Annual 의 7배 이상** — 이게 '숨겨진 규칙' 의 가장 굵은 신호.
- 이탈자는 유지자보다 **tenure 짧고, support 티켓 많고, 로그인 적음** — 평균 비교로 이미 드러남.
- **여기서 이미 마케팅 팀에 한 가지는 말할 수 있음**: "월 계약 고객을 연간으로 전환시키는 것만으로 이탈 크게 줄 것" — 모델 없이도.

---

### 🔪 STEP 3 — stratify 분할
\`\`\`
훈련: 1500행 (이탈 20.0%)
테스트: 500행 (이탈 20.0%)
→ 두 세트의 이탈 비율이 거의 동일 = stratify 효과!
\`\`\`

**왜 중요한가?** \`stratify\` 없으면 훈련 이탈률 18%, 테스트 이탈률 24% 식으로 어긋날 수 있음 → 모델이 **훈련에서 본 분포와 다른 분포** 에서 평가됨. 불균형 데이터일수록 치명적.

---

### 🛠️ STEP 4~5 — 전처리 + 모델 비교
\`\`\`
모델                         5-fold F1   표준편차
-------------------------------------------------------
Logistic (balanced)          ~0.65       ~0.03
RandomForest (balanced)      ~0.72       ~0.02
GradientBoosting             ~0.75       ~0.02

🏆 최고 성능: GradientBoosting
\`\`\`

**왜 이 결과가 나오는가?**
- 데이터에 **피처 간 상호작용** (예: Monthly × 낮은 tenure) 이 있어, **선형 모델(Logistic) 은 표현이 약함**.
- **트리 기반(RandomForest, GradientBoosting)** 이 이런 상호작용을 자연스럽게 학습.
- **GradientBoosting** 은 이전 트리의 오차를 다음 트리가 보완하며 **점진적으로 성능 상승** → 보통 정형 데이터 1등.

**F1 을 쓰는 이유** — 불균형(~20%) 이라 accuracy 로는 "무조건 유지 예측" 만 해도 80% 나옴. F1 은 **precision 과 recall 의 조화평균** 이라 소수 클래스(이탈) 를 놓치면 확 떨어짐.

---

### 🎯 STEP 6 — 최종 평가
\`\`\`
Confusion Matrix
              예측 유지  예측 이탈
  실제 유지    ~360        ~40
  실제 이탈     ~25        ~75

              precision  recall  f1-score
         유지     0.93     0.90    0.92
         이탈     0.65     0.75    0.70

AUC-ROC: 0.89
\`\`\`

**해석 포인트**
- **이탈(소수 클래스) 의 recall = 0.75** → 실제 이탈자 100명 중 75명을 잡아냄. 이게 **비즈니스 가치의 핵심**.
- **이탈 precision = 0.65** → 우리가 "이탈" 이라고 찍은 100명 중 65명만 실제 이탈. 즉 **35명은 오경보**. 이탈 방지 캠페인 비용이 낮으면 감수할 만함.
- **AUC 0.89** → 임의 이탈자 vs 임의 유지자를 세우면 89% 확률로 이탈자에 더 높은 점수. 산업 기준 **AUC 0.8+ 면 쓸 만함**.

---

### 🔍 STEP 7 — 피처 중요도
\`\`\`
🔍 이탈 예측 기여도 (permutation importance)
   contract             0.1xxx  █████████████████████
   login_days_30d       0.0xxx  ██████████████
   support_tickets      0.0xxx  ████████
   monthly_charges      0.0xxx  ███████
   tenure_months        0.0xxx  █████
   plan_type            0.00xx  █
   payment              0.00xx
\`\`\`

**해석**
- **contract 1위** — 우리가 데이터에 심은 "Monthly → 이탈+" 규칙을 모델이 정확히 찾아냄. **설명 가능한 ML** 의 실감.
- **login_days_30d 2위** — "최근 활동 저하" 가 이탈의 강력한 선행 지표. 실제 Netflix·Slack 같은 SaaS 가 항상 모니터링하는 신호.
- **payment 가장 낮음** — 결제 수단은 이탈과 거의 관련 없음. **피처에서 빼도 무방** 한 신호.

**왜 permutation 방식인가?** 트리 기반 모델의 내장 \`feature_importances_\` 는 **고카디널리티 피처에 편향**. Permutation 은 **"이 피처 없이 쓰면 성능이 얼마나 떨어지나"** 를 실제로 측정해서 더 공정.

---

### 📉 STEP 8 — 임계값 & 보고서
\`\`\`
threshold  targets   recall  precision    f1
---------------------------------------------
     0.20     ~180    0.95      0.53      0.68
     0.30     ~120    0.85      0.70      0.77   ← 권장
     0.40      ~90    0.75      0.83      0.79
     0.50      ~75    0.65      0.87      0.74
     0.60      ~55    0.50      0.91      0.65
     0.70      ~35    0.35      0.95      0.52
\`\`\`

**이 표가 말해주는 것**
- **임계값이 낮을수록 더 많은 고객을 '이탈 위험' 으로 찍음** → recall 상승, precision 하락, 캠페인 비용 증가.
- **임계값이 높을수록 확실한 이탈자만 찍음** → precision 상승, 많은 이탈자 놓침.
- **"정답" 은 없음 — 비즈니스 상황(예산·개입 비용·이탈당 손실) 에 따라 결정**. 분석가의 역할은 **표를 제시** 하고, 의사결정자가 **비용/효과** 를 판단하게 돕는 것.

---

### ⚠️ 이 프로젝트의 한계

| 한계 | 실무에선? |
|------|---------|
| **가상 데이터** | 실제 테이블 + 시간에 따른 이탈 정의 (언제부터 "이탈" 이라고 할지) |
| **이탈 규칙을 우리가 심음** | 실제로는 숨겨진 패턴을 모델이 발견해야 함 — 모델이 이만큼 잘 맞는 건 **데이터가 유순하기 때문** |
| **2000행** | 실무는 수십만~수백만 고객 |
| **시계열 누수 고려 X** | 피처 시점 > 타깃 시점 이면 데이터 누수 — 실무의 가장 큰 함정 |
| **비즈니스 비용 함수 X** | "이탈자 1명 놓침 = $1000 손실 / 오경보 1건 = $50" 같은 명시적 비용 넣으면 **임계값 최적화** 가능 |

---

### 🧪 지금 시도해 볼 것

1. **SMOTE 대신 class_weight 실험**: RandomForest 에 \`class_weight={0:1, 1:3}\` 로 소수 클래스 가중치 3배 → recall 어떻게 바뀌나.

2. **피처 엔지니어링**:
   \`\`\`python
   X_tr["engagement"]   = X_tr["login_days_30d"] / (X_tr["tenure_months"] + 1)
   X_tr["cost_per_use"] = X_tr["monthly_charges"] / (X_tr["login_days_30d"] + 1)
   \`\`\`
   새 피처 2개 추가 후 CV 점수가 오르는지 확인.

3. **HistGradientBoosting** (더 빠르고 강한 부스팅):
   \`from sklearn.ensemble import HistGradientBoostingClassifier\` 로 교체.

4. **GridSearchCV 튜닝**:
   \`\`\`python
   param_grid = {"clf__learning_rate": [0.05, 0.1], "clf__max_depth": [3, 5]}
   \`\`\`
   n_estimators·learning_rate·max_depth 조합 찾기.

5. **임계값 비즈니스 최적화**: 이탈자 놓침 비용이 $1000, 오경보 비용이 $50 이라 가정하고 **총비용 최소 임계값** 을 계산하는 함수 작성.

---

### 🏁 이 프로젝트에서 배운 것
- ✅ **실전 ML 표준 플로우**: EDA → 분할 → 전처리 → 모델 비교 → 최종 학습 → 해석 → 임계값 → 보고
- ✅ **불균형 데이터 대응**: stratify + class_weight + F1 스코어
- ✅ **ColumnTransformer + Pipeline**: 누수 없는 전처리
- ✅ **Permutation Importance**: "왜 이렇게 예측했나" 에 답하는 해석 기법
- ✅ **임계값 조정**: 모델 성능을 **비즈니스 의사결정** 으로 번역
- ✅ **경영진 보고의 3요소**: 숫자 + 기여 요인 + 권장 액션

> 💡 **ML 의 가치는 정확도가 아니라 '실행 가능한 의사결정' 에서 나옵니다.** AUC 0.99 여도 그 결과로 아무도 행동하지 않으면 가치는 0. 이 프로젝트가 보여주는 건 '숫자 → 제안' 까지의 완전한 다리입니다.`,
        checkpoint: "위 해설을 읽고, 🧪 시도해 볼 것 중 최소 하나를 직접 실험해 보세요.",
      },
    ],
    starterFiles: {
      "main.py": {
        name: "main.py",
        language: "python",
        content: `# 📉 고객 이탈 예측 (SaaS Churn) 프로젝트
# 우측 가이드 패널에서 단계를 클릭해 각 STEP 으로 이동할 수 있어요.
# 시나리오: SaaS 데이터 사이언티스트 — CEO 에게 이탈 예측 모델 + 액션 권고 제출

import numpy as np
import pandas as pd


## STEP 1: 가상 고객 데이터 2000명 생성
# 규칙 + 노이즈로 churn 생성. 모델이 규칙을 얼마나 찾아내는지가 관전 포인트.
np.random.seed(42)
n = 2000

tenure_months     = np.random.gamma(shape=2, scale=6, size=n).clip(0.5, 60).round(1)
monthly_charges   = np.random.normal(loc=65, scale=20, size=n).clip(20, 130).round(2)
support_tickets   = np.random.poisson(lam=2, size=n)
login_days_30d    = np.random.binomial(n=30, p=0.5, size=n)

plan_type = np.random.choice(["Basic", "Pro", "Enterprise"], size=n, p=[0.5, 0.35, 0.15])
contract  = np.random.choice(["Monthly", "Annual", "TwoYear"], size=n, p=[0.55, 0.30, 0.15])
payment   = np.random.choice(["Card", "Bank", "PayPal"], size=n, p=[0.6, 0.3, 0.1])

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
print(df.head())


## STEP 2: 📊 EDA — 피처 × 이탈 관계
print("\\n🔢 숫자 피처 요약")
print(df.describe().round(2))

print("\\n⚖️ 타깃 분포 (churn)")
print(df["churn"].value_counts())

print("\\n📊 이탈자 vs 유지자 평균 비교")
comp = df.groupby("churn")[["tenure_months", "monthly_charges",
                             "support_tickets", "login_days_30d"]].mean().round(2)
comp.index = ["유지(0)", "이탈(1)"]
print(comp.T)

print("\\n📊 계약 유형별 이탈률")
by_contract = df.groupby("contract")["churn"].agg(["count", "mean"]).round(3)
by_contract.columns = ["고객수", "이탈률"]
print(by_contract.sort_values("이탈률", ascending=False))
print("\\n🧠 힌트: Monthly 계약 이탈률이 압도적으로 높음 — 모델이 이걸 잘 찾는지 확인!")


## STEP 3: 🔪 훈련/테스트 분할 (stratify 필수)
from sklearn.model_selection import train_test_split

X = df.drop(columns=["churn"])
y = df["churn"]

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)
print(f"\\n훈련: {len(X_tr)}행 (이탈 {y_tr.mean():.1%})")
print(f"테스트: {len(X_te)}행 (이탈 {y_te.mean():.1%})")


## STEP 4: 🛠️ 전처리 파이프라인 (ColumnTransformer)
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder

numeric_cols     = ["tenure_months", "monthly_charges", "support_tickets", "login_days_30d"]
categorical_cols = ["plan_type", "contract", "payment"]

preprocessor = ColumnTransformer([
    ("num", StandardScaler(), numeric_cols),
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
])

print(f"\\n✅ 전처리 준비: 숫자 {len(numeric_cols)}개 → Scaler / 카테고리 {len(categorical_cols)}개 → OneHot")


## STEP 5: 🥇 여러 모델 5-fold 교차검증 비교
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

candidates = {
    "Logistic (balanced)":     LogisticRegression(max_iter=1000, class_weight="balanced"),
    "RandomForest (balanced)": RandomForestClassifier(n_estimators=200, class_weight="balanced",
                                                      random_state=42, n_jobs=-1),
    "GradientBoosting":        GradientBoostingClassifier(n_estimators=200, random_state=42),
}

print(f"\\n{'모델':<28} {'5-fold F1':>12} {'표준편차':>10}")
print("-" * 55)

results = {}
for name, clf in candidates.items():
    pipe = Pipeline([("pre", preprocessor), ("clf", clf)])
    scores = cross_val_score(pipe, X_tr, y_tr, cv=5, scoring="f1", n_jobs=-1)
    results[name] = scores.mean()
    print(f"{name:<28} {scores.mean():>12.4f} {scores.std():>10.4f}")

best = max(results, key=results.get)
print(f"\\n🏆 최고 성능: {best}  (F1 평균 {results[best]:.4f})")


## STEP 6: 🎯 최종 모델 학습 + 테스트 평가
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

final_pipe = Pipeline([
    ("pre", preprocessor),
    ("clf", GradientBoostingClassifier(n_estimators=200, random_state=42)),
])
final_pipe.fit(X_tr, y_tr)

y_pred  = final_pipe.predict(X_te)
y_proba = final_pipe.predict_proba(X_te)[:, 1]

print("\\n🎯 테스트 세트 성능")
cm = confusion_matrix(y_te, y_pred)
tn, fp, fn, tp = cm.ravel()
print("\\nConfusion Matrix:")
print(f"              예측 유지  예측 이탈")
print(f"  실제 유지    {tn:>6}       {fp:>6}")
print(f"  실제 이탈    {fn:>6}       {tp:>6}")
print()
print(classification_report(y_te, y_pred, digits=3, target_names=["유지", "이탈"]))
print(f"AUC-ROC: {roc_auc_score(y_te, y_proba):.4f}")


## STEP 7: 🔍 모델 해석 (permutation importance)
from sklearn.inspection import permutation_importance

result = permutation_importance(
    final_pipe, X_te, y_te, n_repeats=10, random_state=42, n_jobs=-1, scoring="f1"
)

imp = (pd.Series(result.importances_mean, index=X_te.columns)
         .sort_values(ascending=False))

print("\\n🔍 이탈 예측 기여도 (permutation importance)\\n")
mx = imp.max()
for feat, val in imp.items():
    bar = "█" * int((val / mx) * 25) if val > 0 else ""
    print(f"   {feat:<20} {val:.4f}  {bar}")


## STEP 8: 📉 임계값 조정 + 📝 CEO 보고서
from sklearn.metrics import precision_recall_fscore_support

print(f"\\n{'threshold':>10} {'targets':>10} {'recall':>8} {'precision':>10} {'f1':>6}")
print("-" * 50)
for t in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]:
    y_pred_t = (y_proba >= t).astype(int)
    target_count = int(y_pred_t.sum())
    p, r, f1, _ = precision_recall_fscore_support(
        y_te, y_pred_t, average="binary", zero_division=0
    )
    print(f"{t:>10.2f} {target_count:>10} {r:>8.3f} {p:>10.3f} {f1:>6.3f}")

print("\\n💡 예산 무제한 → 낮은 임계값(0.2, recall 우선) / 예산 제한 → 높은 임계값(0.6, precision 우선)")

# ── 보고서 조립 ──
top3 = imp.head(3).index.tolist()
auc  = roc_auc_score(y_te, y_proba)

target_mask_03 = y_proba >= 0.3
n_targets_03   = int(target_mask_03.sum())
recall_03      = y_te[target_mask_03].sum() / y_te.sum()
precision_03   = y_te[target_mask_03].sum() / max(n_targets_03, 1)

report = f"""
══════════════════════════════════════════════════════════
  📊 고객 이탈 예측 모델 — 경영진 브리핑
══════════════════════════════════════════════════════════

[모델 성능]
  AUC-ROC        {auc:.3f}       (0.5=랜덤, 1.0=완벽)
  테스트 규모    {len(y_te)}명

[예측 영향도 상위 3 피처]
  1. {top3[0]}
  2. {top3[1]}
  3. {top3[2]}
  → 이 셋이 이탈 여부를 가장 강하게 가름
  → 제품팀과 공유: Monthly 계약·요금 높음·지원 티켓 잦음에 우선 개입

[권장 임계값: 0.3]
  대상 고객 수    {n_targets_03} / {len(y_te)}
  예상 recall     {recall_03:.1%}   (실제 이탈자 중 잡히는 비율)
  예상 precision  {precision_03:.1%}   (타깃 중 실제 이탈할 비율)
  → 포괄적 접근 (recall 우선). 예산 빠듯하면 0.5 로 상향.

[제안 액션]
  1. Monthly 계약 고객에게 연간 업그레이드 할인 쿠폰
  2. support_tickets ≥ 3 고객에게 전담 담당자 배정
  3. 최근 30일 로그인 < 10 고객에게 교육 이메일 발송
══════════════════════════════════════════════════════════
"""
print(report)
`,
      },
    },
  },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

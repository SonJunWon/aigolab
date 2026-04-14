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

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  difficulty: "beginner" | "intermediate";
  estimatedMinutes: number;
  tags: string[];
  description: string;  // 마크다운
  /** 단계별 가이드 — 문자열(구버전) 또는 ProjectStep(리치 버전) 혼합 가능 */
  steps: (string | ProjectStep)[];
  starterFiles: Record<string, { name: string; content: string; language: string }>;
}

export const PROJECTS: Project[] = [
  {
    id: "iris-classification",
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
    print(f"\\n📝 \"{result['text']}\"")
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
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

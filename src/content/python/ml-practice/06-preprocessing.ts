import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson06: Lesson = {
  id: "python-ml-06",
  language: "python",
  track: "ml-practice" as const,
  order: 6,
  title: "특성 전처리와 인코딩",
  subtitle: "실무 데이터의 80%는 전처리 — 모델 성능은 피처 품질이 결정",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🧩 특성 전처리 — 모델에 넣기 전 필수 관문

이전 챕터 5에서 \`StandardScaler\` 와 \`Pipeline\` 을 맛봤죠.
이번엔 **실무에서 마주치는 모든 종류의 피처** 를 다루는 완전판을 배웁니다.

이번 챕터에서 배울 것:
- **OneHotEncoder** — 카테고리 변수를 숫자로
- **Ordinal vs Nominal** — 순서 있음 / 없음
- **StandardScaler vs MinMaxScaler** — 어느 걸 언제?
- **ColumnTransformer** — 열마다 다른 전처리 한 번에
- **SimpleImputer** — 결측값 자동 채우기
- **데이터 누수(leakage) 방지** — \`fit_transform\` vs \`transform\`

> 🔑 "모델이 복잡해서 좋은 게 아니라, 피처가 좋아서 좋다."`,
    },
    {
      type: "markdown",
      source: `## 🎯 왜 전처리가 필요한가?

대부분의 ML 알고리즘은 **숫자** 만 다뤄요. 하지만 현실 데이터는:

- 🏷️ **카테고리** ("서울"/"부산"/"제주") — 문자열 그대로 못 넣음
- 📏 **스케일이 다름** — 나이(0~80) vs 연봉(2000만~2억) — 큰 숫자에 모델이 편향
- 🕳️ **결측값** — NaN 을 못 먹는 모델 (예: LogisticRegression) 다수
- 📅 **날짜** — 연/월/요일 등 파생 변수 만들 수 있음

> 💡 전처리는 "모델이 읽을 수 있는 형태" 로 데이터를 **번역** 하는 일입니다.`,
    },
    {
      type: "markdown",
      source: `## 🏷️ 카테고리 인코딩 — OneHotEncoder`,
    },
    {
      type: "code",
      source: `import pandas as pd
from sklearn.preprocessing import OneHotEncoder

# 지역 (순서 없는 카테고리)
data = pd.DataFrame({
    "region": ["서울", "부산", "제주", "서울", "부산"],
    "age":    [28, 34, 45, 31, 29],
})
print("원본:")
print(data)
print()

enc = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
region_encoded = enc.fit_transform(data[["region"]])

print("OneHot 결과:")
print(pd.DataFrame(region_encoded, columns=enc.get_feature_names_out(["region"])))
`,
    },
    {
      type: "markdown",
      source: `> 💡 \`handle_unknown="ignore"\` — 학습 때 없던 카테고리가 예측 시 나와도 에러 대신 **모두 0** 으로 처리.
>
> ### 왜 그냥 숫자로 바꾸면 안 될까?
>
> \`서울=0, 부산=1, 제주=2\` 로 바꾸면 모델은 "제주 > 부산 > 서울" 이라는 **가짜 순서** 를 학습할 수 있어요.
> 순서 없는 카테고리는 반드시 OneHot 이 맞습니다.`,
    },
    {
      type: "markdown",
      source: `## 📊 순서 있는 카테고리 — OrdinalEncoder

"저/중/고" 처럼 **자연스런 순서** 가 있는 경우만.`,
    },
    {
      type: "code",
      source: `from sklearn.preprocessing import OrdinalEncoder
import pandas as pd

data = pd.DataFrame({"등급": ["저", "중", "고", "중", "저", "고"]})
oe = OrdinalEncoder(categories=[["저", "중", "고"]])  # 순서 지정
data["등급_ord"] = oe.fit_transform(data[["등급"]]).astype(int)
print(data)
`,
    },
    {
      type: "markdown",
      source: `## 📏 스케일링 — StandardScaler vs MinMaxScaler

**왜 필요?** — 거리 기반 모델(KNN, SVM), 경사하강법 기반 모델(로지스틱, 신경망) 은 **큰 숫자에 과도한 영향** 을 받음.

| Scaler | 공식 | 특징 |
|--------|------|------|
| **StandardScaler** | \`(x - μ) / σ\` | 평균 0, 분산 1 (정규분포 가정) |
| **MinMaxScaler**   | \`(x - min) / (max - min)\` | 0~1 범위 (이상치에 민감) |
| **RobustScaler**   | IQR 기반 | 이상치 강건 |

> 🔑 **트리 기반 모델(DecisionTree, RandomForest)** 은 스케일링 **불필요**. 각 피처의 상대 순서만 보기 때문.`,
    },
    {
      type: "code",
      source: `import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler

X = np.array([[25, 30_000_000],
              [34, 55_000_000],
              [45, 120_000_000],
              [28, 42_000_000]], dtype=float)

print("원본:")
print(X)
print("  평균:", X.mean(axis=0), " 표준편차:", X.std(axis=0))
print()

std = StandardScaler().fit_transform(X)
print("StandardScaler:")
print(np.round(std, 2))
print()

mm = MinMaxScaler().fit_transform(X)
print("MinMaxScaler:")
print(np.round(mm, 3))
`,
    },
    {
      type: "markdown",
      source: `## 🕳️ 결측값 — SimpleImputer`,
    },
    {
      type: "code",
      source: `import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer

df = pd.DataFrame({
    "age":    [25, np.nan, 34, 45, np.nan, 29],
    "income": [3000, 5500, np.nan, 12000, 4200, np.nan],
    "city":   ["서울", "부산", None, "제주", "서울", "부산"],
})
print("원본:")
print(df)
print()

# 숫자 열: 중앙값
num_imp = SimpleImputer(strategy="median")
df[["age", "income"]] = num_imp.fit_transform(df[["age", "income"]])

# 문자 열: 최빈값
cat_imp = SimpleImputer(strategy="most_frequent")
df[["city"]] = cat_imp.fit_transform(df[["city"]])

print("결측 처리 후:")
print(df)
`,
    },
    {
      type: "markdown",
      source: `## 🏗️ \`ColumnTransformer\` — 열마다 다른 전처리 한 번에

실무 데이터는 **숫자 열 + 카테고리 열** 이 섞여 있어요. 전처리를 열별로 따로 하지 말고 하나의 객체로.`,
    },
    {
      type: "code",
      source: `from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
import pandas as pd
import numpy as np

X = pd.DataFrame({
    "age":    [25, 34, np.nan, 45, 29],
    "income": [3000, 5500, 8000, 12000, 4200],
    "city":   ["서울", "부산", "제주", None, "부산"],
    "grade":  ["A", "B", "A", "C", "B"],
})

# 1) 숫자 파이프라인: 결측 → 표준화
num_pipe = Pipeline([
    ("imp", SimpleImputer(strategy="median")),
    ("sc",  StandardScaler()),
])

# 2) 카테고리 파이프라인: 결측 → OneHot
cat_pipe = Pipeline([
    ("imp", SimpleImputer(strategy="most_frequent")),
    ("oh",  OneHotEncoder(sparse_output=False, handle_unknown="ignore")),
])

# 3) 열 지정해서 합치기
preprocessor = ColumnTransformer([
    ("num", num_pipe, ["age", "income"]),
    ("cat", cat_pipe, ["city", "grade"]),
])

X_trans = preprocessor.fit_transform(X)
feat_names = preprocessor.get_feature_names_out()

print("변환 결과:")
print(pd.DataFrame(np.round(X_trans, 2), columns=feat_names))
`,
    },
    {
      type: "markdown",
      source: `> 🎯 **\`ColumnTransformer\` + \`Pipeline\`** 이 실무 ML 의 표준 뼈대입니다.
> 이 구조 하나로 전처리의 **모든 단계** 가 "모델의 일부" 가 되어 재현성·배포 용이성이 확보돼요.`,
    },
    {
      type: "markdown",
      source: `## 🚨 데이터 누수(Data Leakage) — 가장 흔한 실수

### ❌ 틀린 방법
\`\`\`python
# 전체 데이터로 scaler fit → train/test split
scaler = StandardScaler().fit(X)          # 😱 테스트 정보 누수
X_train, X_test, y_train, y_test = train_test_split(X, y, ...)
\`\`\`

테스트 데이터의 **평균·표준편차가 scaler 에 스며듦** → 평가 점수가 부당하게 올라감.

### ✅ 올바른 방법
\`\`\`python
# 1) train/test 먼저 나누고
X_train, X_test, y_train, y_test = train_test_split(X, y, ...)

# 2) train 으로만 fit
scaler = StandardScaler().fit(X_train)
X_train_s = scaler.transform(X_train)
X_test_s  = scaler.transform(X_test)      # fit 은 하지 않음!
\`\`\`

> 🔑 **fit 은 train 에서만, transform 은 양쪽에**.
> \`Pipeline\` 과 \`cross_val_score\` 를 쓰면 이 규칙을 자동으로 지켜 줍니다.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 — 완전한 전처리 파이프라인

아래 \`employees\` 데이터로:
1. 숫자(\`age\`, \`salary\`) — 중앙값으로 결측 보완 + StandardScaler
2. 순서 없는 카테고리(\`dept\`) — OneHotEncoder
3. 순서 있는 카테고리(\`level\`: 저<중<고) — OrdinalEncoder
4. 모두 \`ColumnTransformer\` 하나로 합치기
5. \`fit_transform\` 결과 shape 출력`,
    },
    {
      type: "code",
      source: `import pandas as pd
import numpy as np

employees = pd.DataFrame({
    "age":    [28, 34, np.nan, 45, 29, 40, 33],
    "salary": [3500, 5000, 7500, np.nan, 4200, 6000, 4800],
    "dept":   ["IT", "HR", "IT", "영업", "HR", "IT", "영업"],
    "level":  ["중", "고", "저", "고", "저", "중", "중"],
})

# 여기에 코드를 작성하세요
`,
      hints: [
        "num_cols = ['age', 'salary'],  nominal = ['dept'],  ordinal = ['level']",
        "num_pipe: SimpleImputer(median) → StandardScaler",
        "nom_pipe: OneHotEncoder(sparse_output=False)",
        "ord_pipe: OrdinalEncoder(categories=[['저','중','고']])",
        "ColumnTransformer([('num', num_pipe, num_cols), ('nom', nom_pipe, nominal), ('ord', ord_pipe, ordinal)])",
      ],
      solution: `import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.impute import SimpleImputer

employees = pd.DataFrame({
    "age":    [28, 34, np.nan, 45, 29, 40, 33],
    "salary": [3500, 5000, 7500, np.nan, 4200, 6000, 4800],
    "dept":   ["IT", "HR", "IT", "영업", "HR", "IT", "영업"],
    "level":  ["중", "고", "저", "고", "저", "중", "중"],
})

num_pipe = Pipeline([
    ("imp", SimpleImputer(strategy="median")),
    ("sc",  StandardScaler()),
])
nom_pipe = Pipeline([
    ("oh", OneHotEncoder(sparse_output=False, handle_unknown="ignore")),
])
ord_pipe = Pipeline([
    ("ord", OrdinalEncoder(categories=[["저", "중", "고"]])),
])

preprocessor = ColumnTransformer([
    ("num", num_pipe, ["age", "salary"]),
    ("nom", nom_pipe, ["dept"]),
    ("ord", ord_pipe, ["level"]),
])

X_trans = preprocessor.fit_transform(employees)
names = preprocessor.get_feature_names_out()

print("피처 이름:", list(names))
print("shape:", X_trans.shape)
print()
print("결과:")
print(pd.DataFrame(np.round(X_trans, 2), columns=names))`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 6 완료

- ✅ **OneHotEncoder** (순서 없는 카테고리) / **OrdinalEncoder** (순서 있는)
- ✅ **StandardScaler / MinMaxScaler / RobustScaler** — 언제 뭘 쓰는지
- ✅ **SimpleImputer** 로 결측 자동 보완
- ✅ **ColumnTransformer + Pipeline** = 실무 ML 뼈대
- ✅ **데이터 누수 방지** — train 에서만 fit, test 는 transform만

다음 챕터는 **트리와 앙상블** — DecisionTree 부터 RandomForest 까지, 실무 1등 알고리즘을 본격적으로.`,
    },
    { type: "code", source: `# 자유 실험 영역\n` },
  ],
  quiz: {
    title: "챕터 6 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "순서가 없는 카테고리 (예: 서울/부산/제주) 를 인코딩할 때 적절한 방법은?",
        options: [
          "LabelEncoder (0, 1, 2 로 변환)",
          "OneHotEncoder — 각 카테고리마다 별도의 0/1 열",
          "숫자로 직접 매핑 (서울=1, 부산=2, 제주=3)",
          "그냥 문자열 그대로 사용",
        ],
        correctIndex: 1,
        explanation:
          "순서 없는 카테고리는 OneHot 으로 처리해야 모델이 가짜 순서를 학습하지 않아요. LabelEncoder 는 원래 타겟 변수용이고, 피처에 쓰면 잘못된 순서 관계가 들어갑니다.",
      },
      {
        type: "multiple-choice",
        question:
          "다음 중 스케일링이 **필요 없는** 모델은?",
        options: [
          "로지스틱 회귀",
          "K-최근접 이웃 (KNN)",
          "SVM",
          "결정 트리 / 랜덤 포레스트",
        ],
        correctIndex: 3,
        explanation:
          "트리 기반 모델은 각 피처의 '임계값' 만 보기 때문에 스케일에 무관합니다. 거리·기울기 기반 모델(KNN/SVM/로지스틱)은 스케일링이 필수예요.",
      },
      {
        type: "multiple-choice",
        question:
          "데이터 누수(leakage) 를 피하는 올바른 순서는?",
        options: [
          "전체 데이터 scaler 학습 → train/test split",
          "train/test split → train 에서 scaler.fit → test 에는 transform 만",
          "train 과 test 를 각각 fit",
          "scaler 안 쓰고 바로 모델 학습",
        ],
        correctIndex: 1,
        explanation:
          "먼저 분할한 뒤 train 으로만 fit, test 는 transform 만. Pipeline + cross_val_score 조합을 쓰면 자동으로 이 규칙을 지켜 줍니다.",
      },
      {
        type: "multiple-choice",
        question:
          "숫자 열과 카테고리 열이 섞인 DataFrame 을 한 번에 전처리하는 가장 깔끔한 방법은?",
        options: [
          "열마다 따로 fit_transform 후 np.hstack",
          "ColumnTransformer 로 열별 파이프라인을 선언",
          "모든 데이터를 문자열로 바꾼 뒤 OneHot",
          "pandas.get_dummies 만 쓰기",
        ],
        correctIndex: 1,
        explanation:
          "ColumnTransformer 는 '어떤 전처리를 어떤 열에 적용할지' 를 선언적으로 묶어 주고, Pipeline 과 결합되어 재현성과 배포 용이성이 확보됩니다.",
      },
    ],
  } satisfies Quiz,
};

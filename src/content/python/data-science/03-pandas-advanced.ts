import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson03: Lesson = {
  id: "python-ds-03",
  language: "python",
  track: "data-science" as any,
  order: 3,
  title: "Pandas 심화 — 데이터 가공",
  subtitle: "결측값 처리, apply, merge로 실전 데이터를 다듬어봅시다",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# 🔧 Pandas 심화 — 데이터 가공

실전 데이터는 깔끔하지 않아요. 빠진 값, 이상한 형식, 여러 테이블로 흩어진 정보...
이번 챕터에서 이런 문제를 해결하는 방법을 배웁니다!

배울 것:
- **결측값(NaN) 처리** — isna, fillna, dropna
- **apply / map** — 데이터 변환
- **merge / join** — 여러 테이블 합치기`,
    },
    {
      type: "code",
      source: `import pandas as pd
import numpy as np

print("준비 완료!")`,
    },
    {
      type: "markdown",
      source: `## 🕳️ 결측값(NaN) — 빠진 데이터

실제 데이터에는 **빈 칸**이 흔합니다. Pandas에서는 이를 \`NaN\` (Not a Number)으로 표현해요.`,
    },
    {
      type: "code",
      source: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "이름": ["민수", "지영", "현우", "서연", "동혁"],
    "국어": [85, np.nan, 78, 95, 88],
    "영어": [90, 88, np.nan, 91, np.nan],
    "수학": [78, 95, 89, np.nan, 93],
})

print("=== 데이터 ===")
print(df)
print()

# 결측값 확인
print("=== 결측값 여부 ===")
print(df.isna())
print()

# 컬럼별 결측값 개수
print("=== 컬럼별 결측값 수 ===")
print(df.isna().sum())`,
    },
    {
      type: "markdown",
      source: `### 🛠️ 결측값 처리 방법

크게 두 가지: **삭제(dropna)** 또는 **채우기(fillna)**`,
    },
    {
      type: "code",
      source: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "이름": ["민수", "지영", "현우", "서연", "동혁"],
    "국어": [85, np.nan, 78, 95, 88],
    "영어": [90, 88, np.nan, 91, np.nan],
    "수학": [78, 95, 89, np.nan, 93],
})

# 방법 1: 결측값이 있는 행 삭제
dropped = df.dropna()
print("=== dropna() — 결측값 행 삭제 ===")
print(dropped)
print()

# 방법 2: 특정 값으로 채우기
filled = df.fillna(0)
print("=== fillna(0) — 0으로 채우기 ===")
print(filled)
print()

# 방법 3: 각 컬럼의 평균으로 채우기
numeric_cols = ["국어", "영어", "수학"]
filled_mean = df.copy()
for col in numeric_cols:
    filled_mean[col] = filled_mean[col].fillna(filled_mean[col].mean())
print("=== 평균으로 채우기 ===")
print(filled_mean)`,
    },
    {
      type: "markdown",
      source: `## 🔄 apply — 데이터 변환의 만능 도구

\`apply()\`를 사용하면 **각 행이나 열에 함수를 적용**할 수 있어요.
반복문 없이 데이터를 변환하는 강력한 방법입니다.`,
    },
    {
      type: "code",
      source: `import pandas as pd

df = pd.DataFrame({
    "이름": ["민수", "지영", "현우"],
    "점수": [85, 92, 78],
    "나이": [25, 23, 27],
})

# Series에 apply — 각 값에 함수 적용
def grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    else:
        return "C"

df["등급"] = df["점수"].apply(grade)
print("=== 등급 추가 ===")
print(df)

# lambda로 간단하게
df["점수x2"] = df["점수"].apply(lambda x: x * 2)
print("\\n=== lambda 적용 ===")
print(df)`,
    },
    {
      type: "markdown",
      source: `### 💡 map — Series 값 치환

\`map()\`은 딕셔너리로 값을 매핑(치환)할 때 편리해요.`,
    },
    {
      type: "code",
      source: `import pandas as pd

df = pd.DataFrame({
    "이름": ["민수", "지영", "현우"],
    "도시코드": ["SEL", "BUS", "DJN"],
})

# 딕셔너리로 매핑
city_map = {"SEL": "서울", "BUS": "부산", "DJN": "대전"}
df["도시명"] = df["도시코드"].map(city_map)

print(df)`,
    },
    {
      type: "markdown",
      source: `## 🔗 merge — 두 테이블 합치기

SQL의 JOIN과 같은 기능! 공통 키를 기준으로 두 DataFrame을 합칩니다.`,
    },
    {
      type: "code",
      source: `import pandas as pd

# 학생 정보
students = pd.DataFrame({
    "학번": [101, 102, 103, 104],
    "이름": ["민수", "지영", "현우", "서연"],
    "학과": ["컴공", "경영", "컴공", "디자인"],
})

# 성적 정보
grades = pd.DataFrame({
    "학번": [101, 102, 103, 105],
    "과목": ["Python", "통계학", "Python", "영어"],
    "점수": [95, 88, 82, 90],
})

print("=== 학생 테이블 ===")
print(students)
print("\\n=== 성적 테이블 ===")
print(grades)

# inner merge (양쪽 다 있는 것만)
merged = pd.merge(students, grades, on="학번", how="inner")
print("\\n=== inner merge ===")
print(merged)

# left merge (왼쪽 기준, 없으면 NaN)
merged_left = pd.merge(students, grades, on="학번", how="left")
print("\\n=== left merge ===")
print(merged_left)`,
    },
    {
      type: "markdown",
      source: `### 💡 merge의 종류

| how | 설명 |
|-----|------|
| \`inner\` | 양쪽 모두 있는 키만 (교집합) |
| \`left\` | 왼쪽 테이블 기준, 오른쪽에 없으면 NaN |
| \`right\` | 오른쪽 테이블 기준 |
| \`outer\` | 양쪽 모두 포함 (합집합) |`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 1 — 결측값 처리 + 통계

아래 데이터에서 결측값을 **각 과목의 평균**으로 채운 뒤,
각 학생의 총점과 평균을 계산해보세요.`,
    },
    {
      type: "code",
      source: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "이름": ["A", "B", "C", "D", "E"],
    "국어": [80, np.nan, 90, 75, 85],
    "영어": [88, 92, np.nan, 80, np.nan],
    "수학": [np.nan, 85, 78, 90, 82],
})

print("=== 원본 데이터 ===")
print(df)
print("결측값 수:", df.isna().sum().sum())

# 1. 각 과목의 평균으로 결측값 채우기
subjects = ["국어", "영어", "수학"]
for col in subjects:
    ___

print("\\n=== 결측값 채운 후 ===")
print(df)

# 2. 각 학생의 총점
df["총점"] = ___

# 3. 각 학생의 평균
df["평균"] = ___

print("\\n=== 최종 결과 ===")
print(df)`,
      hints: [
        "결측값 채우기: `df[col] = df[col].fillna(df[col].mean())`",
        '총점: `df["국어"] + df["영어"] + df["수학"]` 또는 `df[subjects].sum(axis=1)`',
        "평균: `df[subjects].mean(axis=1)` 또는 `df['총점'] / 3`",
      ],
      solution: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "이름": ["A", "B", "C", "D", "E"],
    "국어": [80, np.nan, 90, 75, 85],
    "영어": [88, 92, np.nan, 80, np.nan],
    "수학": [np.nan, 85, 78, 90, 82],
})

print("=== 원본 데이터 ===")
print(df)
print("결측값 수:", df.isna().sum().sum())

subjects = ["국어", "영어", "수학"]
for col in subjects:
    df[col] = df[col].fillna(df[col].mean())

print("\\n=== 결측값 채운 후 ===")
print(df)

df["총점"] = df[subjects].sum(axis=1)
df["평균"] = df[subjects].mean(axis=1)

print("\\n=== 최종 결과 ===")
print(df)`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 2 — 두 테이블 merge

주문 테이블과 고객 테이블을 합쳐서, 각 고객의 이름과 주문 정보를 함께 보여주세요.
**left merge**를 사용해서 모든 주문이 포함되게 하세요.`,
    },
    {
      type: "code",
      source: `import pandas as pd

# 고객 테이블
customers = pd.DataFrame({
    "고객ID": [1, 2, 3, 4],
    "이름": ["김철수", "이영희", "박민수", "최서연"],
    "등급": ["VIP", "일반", "VIP", "일반"],
})

# 주문 테이블
orders = pd.DataFrame({
    "주문ID": [101, 102, 103, 104, 105],
    "고객ID": [1, 3, 1, 2, 5],
    "상품": ["노트북", "키보드", "마우스", "모니터", "USB"],
    "금액": [150, 30, 20, 200, 10],
})

print("=== 고객 ===")
print(customers)
print("\\n=== 주문 ===")
print(orders)

# left merge (주문 기준)
result = ___
print("\\n=== merge 결과 ===")
print(result)

# VIP 고객의 주문만 필터링
vip_orders = ___
print("\\n=== VIP 고객 주문 ===")
print(vip_orders)`,
      hints: [
        '`pd.merge(orders, customers, on="고객ID", how="left")`로 주문 기준 merge를 하세요.',
        "고객ID=5는 고객 테이블에 없으므로 이름과 등급이 NaN이 됩니다.",
        'VIP 필터: `result[result["등급"] == "VIP"]`',
      ],
      solution: `import pandas as pd

customers = pd.DataFrame({
    "고객ID": [1, 2, 3, 4],
    "이름": ["김철수", "이영희", "박민수", "최서연"],
    "등급": ["VIP", "일반", "VIP", "일반"],
})

orders = pd.DataFrame({
    "주문ID": [101, 102, 103, 104, 105],
    "고객ID": [1, 3, 1, 2, 5],
    "상품": ["노트북", "키보드", "마우스", "모니터", "USB"],
    "금액": [150, 30, 20, 200, 10],
})

print("=== 고객 ===")
print(customers)
print("\\n=== 주문 ===")
print(orders)

result = pd.merge(orders, customers, on="고객ID", how="left")
print("\\n=== merge 결과 ===")
print(result)

vip_orders = result[result["등급"] == "VIP"]
print("\\n=== VIP 고객 주문 ===")
print(vip_orders)`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 3 완료!

오늘 배운 것:
- ✅ 결측값(NaN) 확인: isna(), isna().sum()
- ✅ 결측값 처리: dropna(), fillna()
- ✅ apply()로 커스텀 함수 적용
- ✅ map()으로 값 치환
- ✅ merge()로 두 테이블 합치기

**다음 챕터에서는**: **Matplotlib**으로 데이터를 시각화하는 방법을 배웁니다! 📈`,
    },
  ],
  quiz: {
    title: "챕터 3 퀴즈 — Pandas 심화",
    questions: [
      {
        type: "multiple-choice",
        question: "결측값(NaN)이 있는 행을 모두 삭제하는 메서드는?",
        options: ["df.fillna()", "df.dropna()", "df.isna()", "df.remove_na()"],
        correctIndex: 1,
        explanation:
          "dropna()는 결측값이 있는 행(또는 열)을 삭제합니다. fillna()는 채우기, isna()는 확인용이에요.",
      },
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `import pandas as pd\ns = pd.Series([10, 20, 30])\nprint(s.apply(lambda x: x > 15).tolist())`,
        options: [
          "[10, 20, 30]",
          "[False, True, True]",
          "[20, 30]",
          "에러가 난다",
        ],
        correctIndex: 1,
        explanation:
          "apply는 각 원소에 lambda를 적용합니다. 10>15=False, 20>15=True, 30>15=True",
      },
      {
        type: "multiple-choice",
        question: "pd.merge(A, B, on='key', how='left')에서 B에 없는 key의 값은?",
        options: ["0으로 채워진다", "삭제된다", "NaN이 된다", "에러가 난다"],
        correctIndex: 2,
        explanation:
          "left merge는 왼쪽(A) 기준으로 합치므로, B에 없는 key의 컬럼 값은 NaN이 됩니다.",
      },
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `import pandas as pd\nimport numpy as np\ns = pd.Series([1, np.nan, 3, np.nan, 5])\nprint(s.fillna(0).sum())`,
        options: ["9.0", "NaN", "3.0", "에러가 난다"],
        correctIndex: 0,
        explanation:
          "fillna(0)으로 NaN을 0으로 채우면 [1, 0, 3, 0, 5]. 합계는 1+0+3+0+5 = 9.0",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson02: Lesson = {
  id: "python-ds-02",
  language: "python",
  track: "data-science" as any,
  order: 2,
  title: "Pandas — 데이터를 표로 다루기",
  subtitle: "Series와 DataFrame으로 실전 데이터를 다뤄봅시다",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🐼 Pandas — 데이터를 표로 다루기

**Pandas**는 표(테이블) 형태의 데이터를 다루는 가장 인기 있는 Python 라이브러리입니다.
엑셀의 스프레드시트를 Python에서 다룬다고 생각하면 돼요!

이번 챕터에서 배울 것:
- **Series** — 1차원 데이터 (한 열)
- **DataFrame** — 2차원 데이터 (표)
- **CSV 데이터** 읽기
- **컬럼 선택, 필터링, 정렬**`,
    },
    {
      type: "markdown",
      source: `## 📦 Pandas 불러오기

Pandas는 관례적으로 \`pd\`라는 이름으로 불러옵니다.`,
    },
    {
      type: "code",
      source: `import pandas as pd
import numpy as np

print("Pandas 버전:", pd.__version__)`,
    },
    {
      type: "markdown",
      source: `## 📏 Series — 1차원 데이터

Series는 **인덱스(라벨)가 붙은 1차원 배열**이에요.
엑셀의 한 열(column)이라고 생각하면 됩니다.`,
    },
    {
      type: "code",
      source: `# 리스트로 Series 만들기
scores = pd.Series([85, 92, 78, 95, 88])
print(scores)
print("\\n타입:", type(scores))

# 인덱스를 직접 지정
scores = pd.Series([85, 92, 78, 95, 88],
                   index=["민수", "지영", "현우", "서연", "동혁"])
print("\\n이름 인덱스:")
print(scores)
print("\\n지영의 점수:", scores["지영"])`,
    },
    {
      type: "markdown",
      source: `## 📊 DataFrame — 2차원 데이터 (표)

DataFrame은 **여러 개의 Series를 묶은 표**입니다.
행(row)과 열(column)이 있어요. 가장 많이 사용하는 Pandas 객체입니다.`,
    },
    {
      type: "code",
      source: `# 딕셔너리로 DataFrame 만들기
data = {
    "이름": ["민수", "지영", "현우", "서연", "동혁"],
    "국어": [85, 92, 78, 95, 88],
    "영어": [90, 88, 82, 91, 79],
    "수학": [78, 95, 89, 87, 93],
}

df = pd.DataFrame(data)
print(df)
print("\\nshape:", df.shape)    # (5, 4) — 5행 4열
print("columns:", list(df.columns))`,
    },
    {
      type: "markdown",
      source: `### 💡 DataFrame 기본 정보 확인

실전에서 데이터를 받으면 제일 먼저 하는 일이에요.`,
    },
    {
      type: "code",
      source: `data = {
    "이름": ["민수", "지영", "현우", "서연", "동혁"],
    "국어": [85, 92, 78, 95, 88],
    "영어": [90, 88, 82, 91, 79],
    "수학": [78, 95, 89, 87, 93],
}
df = pd.DataFrame(data)

# 앞부분만 보기
print("=== head(3) ===")
print(df.head(3))

# 기본 통계
print("\\n=== describe() ===")
print(df.describe())

# 데이터 타입
print("\\n=== dtypes ===")
print(df.dtypes)`,
    },
    {
      type: "markdown",
      source: `## 📂 CSV 데이터 읽기

실전에서는 CSV 파일에서 데이터를 불러오는 경우가 대부분이에요.
여기서는 문자열로 CSV 데이터를 시뮬레이션해볼게요.`,
    },
    {
      type: "code",
      source: `import io

csv_text = """이름,나이,도시,점수
김민수,25,서울,85
이지영,23,부산,92
박현우,27,대전,78
최서연,24,서울,95
정동혁,26,부산,88"""

df = pd.read_csv(io.StringIO(csv_text))
print(df)
print("\\nshape:", df.shape)`,
    },
    {
      type: "markdown",
      source: `## 🔍 컬럼 선택

원하는 열(컬럼)만 골라서 볼 수 있어요.`,
    },
    {
      type: "code",
      source: `import io

csv_text = """이름,나이,도시,점수
김민수,25,서울,85
이지영,23,부산,92
박현우,27,대전,78
최서연,24,서울,95
정동혁,26,부산,88"""

df = pd.read_csv(io.StringIO(csv_text))

# 한 개의 컬럼 선택 → Series
print("=== 이름 컬럼 ===")
print(df["이름"])

# 여러 컬럼 선택 → DataFrame
print("\\n=== 이름, 점수 ===")
print(df[["이름", "점수"]])`,
    },
    {
      type: "markdown",
      source: `## 🎯 필터링 — 조건에 맞는 행 선택

NumPy의 조건 인덱싱과 비슷해요!`,
    },
    {
      type: "code",
      source: `import io

csv_text = """이름,나이,도시,점수
김민수,25,서울,85
이지영,23,부산,92
박현우,27,대전,78
최서연,24,서울,95
정동혁,26,부산,88"""

df = pd.read_csv(io.StringIO(csv_text))

# 점수 90 이상
high = df[df["점수"] >= 90]
print("90점 이상:")
print(high)

# 서울 사는 사람
seoul = df[df["도시"] == "서울"]
print("\\n서울 거주:")
print(seoul)

# 여러 조건 (& = AND, | = OR)
result = df[(df["도시"] == "서울") & (df["점수"] >= 90)]
print("\\n서울 + 90점 이상:")
print(result)`,
    },
    {
      type: "markdown",
      source: `## 🔄 정렬하기

\`sort_values()\`로 특정 컬럼 기준으로 정렬할 수 있어요.`,
    },
    {
      type: "code",
      source: `import io

csv_text = """이름,나이,도시,점수
김민수,25,서울,85
이지영,23,부산,92
박현우,27,대전,78
최서연,24,서울,95
정동혁,26,부산,88"""

df = pd.read_csv(io.StringIO(csv_text))

# 점수 기준 내림차순 정렬
sorted_df = df.sort_values("점수", ascending=False)
print("점수 높은 순:")
print(sorted_df)

# 나이 기준 오름차순
sorted_df2 = df.sort_values("나이")
print("\\n나이 어린 순:")
print(sorted_df2)`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 1 — 학생 성적 DataFrame 만들고 필터링

아래 학생 데이터로 DataFrame을 만들고, 조건에 맞게 필터링해보세요.

| 이름 | 학년 | 점수 | 동아리 |
|------|------|------|--------|
| 김하나 | 1 | 88 | 코딩 |
| 이두리 | 2 | 75 | 음악 |
| 박세진 | 1 | 95 | 코딩 |
| 최네온 | 3 | 82 | 체육 |
| 정다섯 | 2 | 91 | 코딩 |
| 한여섯 | 3 | 67 | 음악 |

**해야 할 것:**
1. DataFrame 만들기
2. 코딩 동아리 학생만 필터링
3. 점수 80 이상인 학생만 필터링하고 점수 내림차순 정렬`,
    },
    {
      type: "code",
      source: `import pandas as pd

# 1. DataFrame 만들기
df = pd.DataFrame({
    # 여기에 데이터를 입력하세요
})

print("=== 전체 데이터 ===")
print(df)

# 2. 코딩 동아리 학생
coding = ___
print("\\n=== 코딩 동아리 ===")
print(coding)

# 3. 80점 이상, 점수 내림차순 정렬
high_sorted = ___
print("\\n=== 80점 이상 (점수순) ===")
print(high_sorted)`,
      hints: [
        '딕셔너리 키는 "이름", "학년", "점수", "동아리"로 하고 각각 리스트로 값을 넣으세요.',
        '코딩 동아리 필터: `df[df["동아리"] == "코딩"]`',
        '80점 이상 + 정렬: `df[df["점수"] >= 80].sort_values("점수", ascending=False)`',
      ],
      solution: `import pandas as pd

df = pd.DataFrame({
    "이름": ["김하나", "이두리", "박세진", "최네온", "정다섯", "한여섯"],
    "학년": [1, 2, 1, 3, 2, 3],
    "점수": [88, 75, 95, 82, 91, 67],
    "동아리": ["코딩", "음악", "코딩", "체육", "코딩", "음악"],
})

print("=== 전체 데이터 ===")
print(df)

coding = df[df["동아리"] == "코딩"]
print("\\n=== 코딩 동아리 ===")
print(coding)

high_sorted = df[df["점수"] >= 80].sort_values("점수", ascending=False)
print("\\n=== 80점 이상 (점수순) ===")
print(high_sorted)`,
    },
    {
      type: "markdown",
      source: `## 📊 그룹별 집계 — groupby

SQL의 GROUP BY와 같은 기능이에요. 카테고리별로 통계를 내는 데 아주 유용합니다.`,
    },
    {
      type: "code",
      source: `import pandas as pd

df = pd.DataFrame({
    "이름": ["김하나", "이두리", "박세진", "최네온", "정다섯", "한여섯"],
    "학년": [1, 2, 1, 3, 2, 3],
    "점수": [88, 75, 95, 82, 91, 67],
    "동아리": ["코딩", "음악", "코딩", "체육", "코딩", "음악"],
})

# 동아리별 평균 점수
print("=== 동아리별 평균 점수 ===")
print(df.groupby("동아리")["점수"].mean())

# 학년별 평균 점수
print("\\n=== 학년별 평균 점수 ===")
print(df.groupby("학년")["점수"].mean())

# 여러 통계 한번에
print("\\n=== 동아리별 상세 통계 ===")
print(df.groupby("동아리")["점수"].agg(["mean", "min", "max", "count"]))`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 2 — 그룹별 평균 계산

아래 매출 데이터에서 **지역별**, **카테고리별** 평균 매출을 구해보세요.`,
    },
    {
      type: "code",
      source: `import pandas as pd

df = pd.DataFrame({
    "지역": ["서울", "부산", "서울", "대전", "부산", "서울", "대전", "부산"],
    "카테고리": ["전자", "식품", "식품", "전자", "전자", "의류", "식품", "의류"],
    "매출": [150, 80, 120, 90, 110, 200, 70, 95],
})

print("=== 전체 데이터 ===")
print(df)

# 1. 지역별 평균 매출
region_avg = ___
print("\\n=== 지역별 평균 매출 ===")
print(region_avg)

# 2. 카테고리별 평균 매출
cat_avg = ___
print("\\n=== 카테고리별 평균 매출 ===")
print(cat_avg)

# 3. 지역별 매출 합계
region_sum = ___
print("\\n=== 지역별 매출 합계 ===")
print(region_sum)`,
      hints: [
        '`df.groupby("컬럼명")["매출"]` 뒤에 `.mean()` 또는 `.sum()`을 붙이면 돼요.',
        '지역별 평균: `df.groupby("지역")["매출"].mean()`',
        '합계는 `.mean()` 대신 `.sum()`을 사용하면 됩니다.',
      ],
      solution: `import pandas as pd

df = pd.DataFrame({
    "지역": ["서울", "부산", "서울", "대전", "부산", "서울", "대전", "부산"],
    "카테고리": ["전자", "식품", "식품", "전자", "전자", "의류", "식품", "의류"],
    "매출": [150, 80, 120, 90, 110, 200, 70, 95],
})

print("=== 전체 데이터 ===")
print(df)

region_avg = df.groupby("지역")["매출"].mean()
print("\\n=== 지역별 평균 매출 ===")
print(region_avg)

cat_avg = df.groupby("카테고리")["매출"].mean()
print("\\n=== 카테고리별 평균 매출 ===")
print(cat_avg)

region_sum = df.groupby("지역")["매출"].sum()
print("\\n=== 지역별 매출 합계 ===")
print(region_sum)`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 2 완료!

오늘 배운 것:
- ✅ Series — 인덱스가 있는 1차원 데이터
- ✅ DataFrame — 행과 열이 있는 표 데이터
- ✅ CSV 데이터 읽기 (\`pd.read_csv\`)
- ✅ 컬럼 선택, 필터링, 정렬
- ✅ groupby로 그룹별 집계

**다음 챕터에서는**: 결측값 처리, apply, merge 등 **Pandas 심화** 기능을 배웁니다! 🔧`,
    },
  ],
  quiz: {
    title: "챕터 2 퀴즈 — Pandas 기초",
    questions: [
      {
        type: "multiple-choice",
        question: "DataFrame에서 한 개의 컬럼을 선택하면 반환되는 타입은?",
        options: ["DataFrame", "Series", "list", "ndarray"],
        correctIndex: 1,
        explanation:
          'df["컬럼명"]처럼 한 개의 컬럼을 선택하면 Series가 반환됩니다. 여러 컬럼은 df[["a","b"]]로 선택하며 DataFrame이 반환돼요.',
      },
      {
        type: "predict-output",
        question: "이 코드의 출력 결과 행 수는?",
        code: `import pandas as pd\ndf = pd.DataFrame({"a": [1,2,3,4,5], "b": [10,20,30,40,50]})\nprint(len(df[df["a"] > 3]))`,
        options: ["2", "3", "4", "5"],
        correctIndex: 0,
        explanation:
          "a > 3인 행은 a=4, a=5 두 개입니다. 따라서 len()의 결과는 2입니다.",
      },
      {
        type: "multiple-choice",
        question: "df.sort_values('점수', ascending=False)는 어떤 정렬을 수행하나요?",
        options: [
          "점수 오름차순 (낮은 순)",
          "점수 내림차순 (높은 순)",
          "인덱스 기준 정렬",
          "에러가 난다",
        ],
        correctIndex: 1,
        explanation:
          "ascending=False는 내림차순(큰 값부터)을 의미합니다. 기본값은 ascending=True (오름차순)입니다.",
      },
      {
        type: "predict-output",
        question: "이 코드의 출력 결과는?",
        code: `import pandas as pd\ndf = pd.DataFrame({"그룹": ["A","A","B","B"], "값": [10, 20, 30, 40]})\nprint(df.groupby("그룹")["값"].sum().tolist())`,
        options: ["[10, 20, 30, 40]", "[30, 70]", "[15, 35]", "[2, 2]"],
        correctIndex: 1,
        explanation:
          "그룹 A의 합: 10+20=30, 그룹 B의 합: 30+40=70. tolist()로 리스트 [30, 70]이 됩니다.",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson06: Lesson = {
  id: "python-ds-06",
  language: "python",
  track: "data-science" as const,
  order: 6,
  title: "데이터 정제와 품질",
  subtitle: "현실의 더러운 데이터를 깨끗하게 — 분석가의 80% 업무",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🧹 데이터 정제 — 현실은 더럽다

실무 데이터 분석가의 **약 80%** 시간은 **데이터 정제(Data Cleaning)** 에 씁니다.

이번 챕터에서 배울 것:
- **결측값(NaN)** 탐지와 채우기 전략
- **중복** 데이터 제거
- **이상치(outlier)** 탐지
- **타입 변환** — 문자열→숫자, 숫자→날짜
- **범주형 데이터** 정리 (표기 통일)

> 💡 "분석 못하겠다" 의 80% 는 분석력 부족이 아니라 **데이터가 더러워서** 예요.`,
    },
    {
      type: "markdown",
      source: `## 🕳️ 결측값(Missing Value) 탐지

현실 데이터는 **비어 있는 셀** 이 흔해요. pandas 에서는 \`NaN\` 으로 표현됩니다.`,
    },
    {
      type: "code",
      source: `import pandas as pd
import numpy as np

# 🛒 가상 주문 데이터 — 군데군데 결측
orders = pd.DataFrame({
    "order_id": [101, 102, 103, 104, 105, 106],
    "customer": ["김민지", "박철수", None, "이영희", "김민지", "정수진"],
    "price":    [25000, 18000, 42000, np.nan, 13000, 35000],
    "category": ["의류", "식품", "의류", "전자", None, "식품"],
})
print(orders)
print()
print("결측값 개수 (열별):")
print(orders.isna().sum())
print()
print(f"전체 결측 비율: {orders.isna().sum().sum() / orders.size:.1%}")
`,
    },
    {
      type: "markdown",
      source: `## 🔧 결측값 다루는 3가지 전략

| 전략 | 메서드 | 언제 |
|------|--------|------|
| **버리기** | \`dropna()\` | 결측이 드물고 버려도 되는 행 |
| **대표값으로 채우기** | \`fillna(값)\` | 평균·중앙값·"없음" 등 도메인 상식 |
| **그대로 두기** | (아무것도 안 함) | 결측 자체가 정보일 때 |

> ⚠️ "어떻게 채울지" 는 통계 문제가 아니라 **도메인 지식** 문제예요. 가격이면 카테고리별 중앙값, 이름이면 "익명" 같은 식으로.`,
    },
    {
      type: "code",
      source: `# ── 전략 1: 드롭 ──
clean1 = orders.dropna()
print("🗑️ dropna() 결과:")
print(clean1)
print(f"   {len(orders)}행 → {len(clean1)}행  ({len(orders)-len(clean1)}행 삭제)")
print()

# ── 전략 2: 채우기 — 열마다 다르게 ──
clean2 = orders.copy()
clean2["customer"] = clean2["customer"].fillna("익명")
clean2["category"] = clean2["category"].fillna("기타")
clean2["price"]    = clean2["price"].fillna(clean2["price"].median())  # 가격: 중앙값

print("🩹 fillna() 결과:")
print(clean2)
`,
    },
    {
      type: "markdown",
      source: `## 👯 중복 데이터

같은 행이 여러 번 들어간 경우 — 집계 시 **결과가 과장** 될 수 있어요.`,
    },
    {
      type: "code",
      source: `# 실수로 102번 주문이 두 번 들어감
dup = pd.DataFrame({
    "order_id": [101, 102, 102, 103, 104],
    "price":    [25000, 18000, 18000, 42000, 30000],
})
print("원본:")
print(dup)
print(f"총 매출: {dup['price'].sum():,}원  ← 18,000원이 두 번 더해짐")
print()

# 중복 탐지
print("중복된 행:")
print(dup[dup.duplicated()])
print()

# 제거
clean = dup.drop_duplicates()
print("drop_duplicates() 후:")
print(clean)
print(f"총 매출: {clean['price'].sum():,}원  ← 정확")
`,
    },
    {
      type: "markdown",
      source: `## 🎯 이상치(Outlier) 탐지

\`IQR\` (사분위 범위) 방법이 가장 널리 쓰여요.

\`\`\`
IQR = Q3 - Q1
이상치 범위: 값 < Q1 - 1.5*IQR  또는  값 > Q3 + 1.5*IQR
\`\`\``,
    },
    {
      type: "code",
      source: `# 월급 데이터 — 하나가 이상치
salaries = pd.Series([350, 380, 420, 400, 450, 390, 410, 9_999_000, 370])
print("원본:", salaries.tolist())
print()

q1 = salaries.quantile(0.25)
q3 = salaries.quantile(0.75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr

print(f"Q1 = {q1}, Q3 = {q3}, IQR = {iqr}")
print(f"정상 범위: [{lower:.0f} ~ {upper:.0f}]")
print()

outliers = salaries[(salaries < lower) | (salaries > upper)]
print(f"🚨 이상치: {outliers.tolist()}")

clean = salaries[(salaries >= lower) & (salaries <= upper)]
print(f"✅ 제거 후 평균: {clean.mean():.1f}  (원본 평균 {salaries.mean():.1f})")
`,
    },
    {
      type: "markdown",
      source: `> 💡 이상치를 **무조건 제거** 하지 마세요. 그게 진짜 "부자 한 명" 일 수도 있어요.
> 1) 왜 이 값이 나왔는지 확인 → 2) 데이터 입력 오류면 제거 / 정당한 값이면 유지 또는 로그 변환.`,
    },
    {
      type: "markdown",
      source: `## 🔄 타입 변환 (dtype)

CSV 에서 읽으면 **숫자 열이 문자열로** 오는 일이 잦아요. \`astype()\` / \`pd.to_numeric()\` / \`pd.to_datetime()\` 으로 맞춰야 합니다.`,
    },
    {
      type: "code",
      source: `raw = pd.DataFrame({
    "id":    ["1", "2", "3", "4"],
    "price": ["1,200", "3,500", "?", "5,800"],   # 쉼표 + '?' 포함
    "date":  ["2024-01-03", "2024-02-15", "2024-03-11", "잘못된값"],
})
print("원본 dtype:")
print(raw.dtypes)
print()

# 정수 변환 — 단순
raw["id"] = raw["id"].astype(int)

# 가격: 쉼표 제거 + 잘못된 값은 NaN 으로 (errors="coerce")
raw["price_num"] = pd.to_numeric(
    raw["price"].str.replace(",", ""), errors="coerce"
)

# 날짜: 잘못된 값은 NaT 로
raw["date_dt"] = pd.to_datetime(raw["date"], errors="coerce")

print("변환 후:")
print(raw)
print()
print("새 dtype:")
print(raw.dtypes)
`,
    },
    {
      type: "markdown",
      source: `> 🔑 \`errors="coerce"\` — 변환 실패를 **에러가 아닌 NaN/NaT** 로 처리. 정제 단계의 친구.`,
    },
    {
      type: "markdown",
      source: `## 🏷️ 범주형 데이터 정리 — 표기 통일

설문·수기 입력 데이터는 **같은 의미를 여러 표기** 로 갖기 쉬워요. 분석 전 **통일** 필수.`,
    },
    {
      type: "code",
      source: `survey = pd.DataFrame({
    "gender": ["남성", "여성", "남", "여", "Male", "female", "남자", "M"],
})
print("원본 value_counts:")
print(survey["gender"].value_counts())
print()

# 매핑 테이블
mapping = {
    "남성": "M", "남": "M", "남자": "M", "Male": "M", "M": "M",
    "여성": "F", "여": "F", "여자": "F", "female": "F", "Female": "F",
}
survey["gender_clean"] = survey["gender"].str.strip().map(mapping)

print("정리 후:")
print(survey["gender_clean"].value_counts())
`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 — 더러운 매출 데이터를 깨끗하게

아래 \`raw_sales\` 에는 **모든 유형의 문제** 가 들어있어요:
- 결측값
- 중복 행
- 가격에 \`원\`, 쉼표 붙음
- 카테고리 표기 불일치 ("식음료" vs "음료")

**목표**: 다음 순서로 정제해서 \`clean_sales\` 를 만드세요.
1. 중복 제거
2. \`price\` 문자열을 숫자로 (\`원\`/쉼표 제거, 잘못된 값 NaN)
3. \`category\` 를 3종("음료", "식품", "의류") 으로 통일
4. 결측값은 **카테고리별 중앙값** 으로 채우기

힌트 단계를 참고해 차근차근.`,
    },
    {
      type: "code",
      source: `import pandas as pd
import numpy as np

raw_sales = pd.DataFrame({
    "id":       [1, 2, 2, 3, 4, 5, 6, 7],
    "item":     ["콜라", "빵", "빵", "티셔츠", "사이다", "샌드위치", "청바지", "커피"],
    "category": ["식음료", "식품", "식품", "의류", "음료", "식품", "의류", "음료수"],
    "price":    ["1,500원", "3,200원", "3,200원", "29,000원", "??", None, "52,000원", "4,800원"],
})
print("원본:")
print(raw_sales)

# 여기에 정제 코드를 작성하세요
`,
      hints: [
        "1. drop_duplicates() 로 중복 제거",
        "2. pd.to_numeric(Series.str.replace('원','').str.replace(',',''), errors='coerce') 로 숫자화",
        "3. replace(dict) 또는 map(dict) 로 카테고리 통일: {'식음료':'음료','음료수':'음료'}",
        "4. groupby('category')['price'].transform('median') 후 fillna() 로 카테고리별 중앙값 채우기",
      ],
      solution: `import pandas as pd
import numpy as np

raw_sales = pd.DataFrame({
    "id":       [1, 2, 2, 3, 4, 5, 6, 7],
    "item":     ["콜라", "빵", "빵", "티셔츠", "사이다", "샌드위치", "청바지", "커피"],
    "category": ["식음료", "식품", "식품", "의류", "음료", "식품", "의류", "음료수"],
    "price":    ["1,500원", "3,200원", "3,200원", "29,000원", "??", None, "52,000원", "4,800원"],
})

# 1. 중복 제거
clean_sales = raw_sales.drop_duplicates(subset=["id"]).copy()

# 2. 가격 문자열 → 숫자
clean_sales["price"] = pd.to_numeric(
    clean_sales["price"].astype(str).str.replace("원", "", regex=False)
                                     .str.replace(",", "", regex=False),
    errors="coerce"
)

# 3. 카테고리 통일
cat_map = {"식음료": "음료", "음료수": "음료"}
clean_sales["category"] = clean_sales["category"].replace(cat_map)

# 4. 카테고리별 중앙값으로 결측 채우기
median_by_cat = clean_sales.groupby("category")["price"].transform("median")
clean_sales["price"] = clean_sales["price"].fillna(median_by_cat)

print("정제 결과:")
print(clean_sales)
print()
print(f"행 수: {len(raw_sales)} → {len(clean_sales)}")
print(f"결측 가격: {raw_sales['price'].isna().sum()}건 → {clean_sales['price'].isna().sum()}건")`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 6 완료

오늘 배운 것:
- ✅ \`isna() / fillna() / dropna()\` — 결측값 3종 세트
- ✅ \`duplicated() / drop_duplicates()\` — 중복 제거
- ✅ IQR 방법으로 이상치 탐지
- ✅ \`astype / pd.to_numeric / pd.to_datetime(errors="coerce")\` — 타입 변환
- ✅ \`replace / map\` 으로 범주형 표기 통일
- ✅ \`groupby().transform()\` 으로 그룹별 중앙값 채우기

> 📌 "분석 결과가 이상해" 의 90% 는 정제 실수. **먼저 데이터를 믿지 마세요.**

다음 챕터는 **문자열과 날짜** — 실무 데이터의 최대 복병 두 가지를 다룹니다.`,
    },
    { type: "code", source: `# 자유 실험 영역\n` },
  ],
  quiz: {
    title: "챕터 6 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "pandas 에서 가장 '결측값이 몇 개 있는지' 한 번에 확인하는 방법은?",
        options: [
          "df.sum()",
          "df.isna().sum()",
          "df.dropna().count()",
          "df.missing()",
        ],
        correctIndex: 1,
        explanation:
          "df.isna() 는 각 셀이 결측이면 True, 아니면 False 인 DataFrame 을 반환. .sum() 으로 열별 결측 개수를 합계.",
      },
      {
        type: "multiple-choice",
        question:
          "pd.to_numeric() 에서 잘못된 값(예: '??')을 NaN 으로 변환하려면?",
        options: [
          "errors='coerce' 옵션",
          "errors='ignore' 옵션",
          "errors='raise' 옵션 (기본)",
          "이런 옵션 없음",
        ],
        correctIndex: 0,
        explanation:
          "'coerce' 는 변환 실패를 NaN 으로. 정제 단계에서 '거르기' 용도로 쓰입니다. 'raise' 는 즉시 에러, 'ignore' 는 원본 유지.",
      },
      {
        type: "multiple-choice",
        question:
          "이상치 탐지의 IQR 방법에서 '정상 범위' 의 상한은?",
        options: [
          "Q1 - 1.5 × IQR",
          "Q3 + 1.5 × IQR",
          "평균 + 3σ",
          "중앙값 × 2",
        ],
        correctIndex: 1,
        explanation:
          "IQR = Q3 - Q1. 정상 범위는 [Q1 - 1.5×IQR, Q3 + 1.5×IQR]. 이를 벗어나면 이상치 후보로 봅니다.",
      },
      {
        type: "multiple-choice",
        question:
          "groupby().transform('median') 의 동작으로 올바른 것은?",
        options: [
          "각 그룹의 중앙값 1개씩을 반환 (그룹 수만큼 행)",
          "원본 shape 을 유지하면서 각 행에 해당 그룹의 중앙값을 채워 반환",
          "데이터를 정렬한다",
          "에러를 발생시킨다",
        ],
        correctIndex: 1,
        explanation:
          "transform 은 'groupby 결과를 원본 행 길이에 맞춰 브로드캐스트' 하는 메서드. 각 행에 그 그룹의 집계값이 들어가서 fillna 에 바로 쓰기 좋아요.",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson08: Lesson = {
  id: "python-ds-08",
  language: "python",
  track: "data-science" as const,
  order: 8,
  title: "데이터 합치기 — merge / concat / pivot",
  subtitle: "흩어진 테이블을 하나의 분석 뷰로 엮는 기술",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🔗 여러 테이블을 하나로 — 합치기의 예술

현실의 데이터는 **여러 테이블에 나뉘어** 있어요.
- \`customers\` — 고객 정보
- \`orders\` — 주문
- \`products\` — 상품 카탈로그

분석하려면 이들을 **하나의 분석 뷰** 로 합쳐야 합니다. 이번 챕터:

- 🔗 \`merge\` — SQL의 JOIN (같은 키로 두 테이블 연결)
- 🧱 \`concat\` — 같은 구조의 테이블 위/아래 붙이기
- 🔄 \`pivot\` / \`melt\` — 가로↔세로 변형 (long ↔ wide)

> 🔑 이 챕터를 마치면 **SQL JOIN 과 pandas merge 의 동치 관계** 를 이해해요.`,
    },
    {
      type: "markdown",
      source: `## 🔗 \`merge\` — SQL JOIN 의 pandas 버전

같은 **키(공통 컬럼)** 로 두 DataFrame을 연결합니다.`,
    },
    {
      type: "code",
      source: `import pandas as pd

# 고객 테이블
customers = pd.DataFrame({
    "customer_id": [1, 2, 3, 4],
    "name":        ["김민지", "박철수", "이영희", "정수진"],
    "country":     ["한국", "한국", "일본", "한국"],
})

# 주문 테이블 (customer_id 로 연결)
orders = pd.DataFrame({
    "order_id":    [101, 102, 103, 104, 105],
    "customer_id": [1, 2, 1, 3, 99],   # 99 는 고객 테이블에 없음!
    "amount":      [25000, 18000, 42000, 30000, 15000],
})

print("고객:")
print(customers)
print()
print("주문:")
print(orders)
`,
    },
    {
      type: "markdown",
      source: `### INNER JOIN — 양쪽에 다 있는 것만`,
    },
    {
      type: "code",
      source: `# 기본값: how="inner"
joined = orders.merge(customers, on="customer_id")
print("INNER JOIN:")
print(joined)
print()
print(f"주문 {len(orders)}건 → INNER JOIN 후 {len(joined)}건 (없는 고객 99 탈락)")
`,
    },
    {
      type: "markdown",
      source: `### LEFT / RIGHT / OUTER JOIN`,
    },
    {
      type: "code",
      source: `print("LEFT JOIN (orders 기준 — 모든 주문 유지):")
left = orders.merge(customers, on="customer_id", how="left")
print(left)
print()
# customer_id=99 의 행은 name/country 가 NaN
print("NaN 개수:", left["name"].isna().sum())
print()

print("OUTER JOIN — 양쪽 모든 행:")
outer = orders.merge(customers, on="customer_id", how="outer")
print(outer)
`,
    },
    {
      type: "markdown",
      source: `### merge 요약표

| how | 의미 | 사용 예 |
|-----|------|--------|
| \`"inner"\` (기본) | 양쪽 다 있는 키만 | 둘 다 검증된 결과 |
| \`"left"\` | 왼쪽 기준, 오른쪽 없으면 NaN | "모든 주문 유지" |
| \`"right"\` | 오른쪽 기준 | 거의 안 씀 (left 로 뒤바꿔 해결) |
| \`"outer"\` | 양쪽 모든 행 | 데이터 손실 없이 합치기 |

### 키 이름이 다를 때

\`\`\`python
orders.merge(customers, left_on="customer_id", right_on="id")
\`\`\``,
    },
    {
      type: "markdown",
      source: `## 🧱 \`concat\` — 위/아래로 이어 붙이기

\`merge\` 는 "옆으로 합치기(키 기반)", \`concat\` 은 "위로 쌓기/옆으로 붙이기(그냥 이어 붙이기)".`,
    },
    {
      type: "code",
      source: `import pandas as pd

q1 = pd.DataFrame({"month": [1, 2, 3], "sales": [100, 120, 130]})
q2 = pd.DataFrame({"month": [4, 5, 6], "sales": [150, 140, 160]})

# 세로로 쌓기 (기본)
year = pd.concat([q1, q2], ignore_index=True)
print("세로 concat:")
print(year)
print()

# 가로로 붙이기
side = pd.concat([q1, q2], axis=1)
print("가로 concat (axis=1):")
print(side)
`,
    },
    {
      type: "markdown",
      source: `> 💡 언제 \`merge\` vs \`concat\` 을 쓰지?
> - **같은 구조의 데이터 누적** (예: 1월·2월·3월 로그) → \`concat(axis=0)\`
> - **다른 정보를 키로 연결** (고객 + 주문) → \`merge\``,
    },
    {
      type: "markdown",
      source: `## 🔄 Long vs Wide — \`pivot\` 과 \`melt\`

같은 데이터가 두 가지 형태로 표현될 수 있어요.

### Long 형식 (세로)
\`\`\`
city   month  sales
서울    1      100
서울    2      120
부산    1       80
부산    2       90
\`\`\`

### Wide 형식 (가로)
\`\`\`
city    1월    2월
서울    100    120
부산     80     90
\`\`\`

- **Long 형식** → 저장·계산·시각화(예: seaborn)에 편함
- **Wide 형식** → 사람이 읽기 편함, Excel 스타일 보고서`,
    },
    {
      type: "markdown",
      source: `### \`pivot\` — Long → Wide`,
    },
    {
      type: "code",
      source: `import pandas as pd

long_df = pd.DataFrame({
    "city":  ["서울", "서울", "부산", "부산", "제주", "제주"],
    "month": [1, 2, 1, 2, 1, 2],
    "sales": [100, 120, 80, 90, 50, 65],
})
print("Long 형식:")
print(long_df)
print()

wide = long_df.pivot(index="city", columns="month", values="sales")
print("Wide 형식 (pivot):")
print(wide)
`,
    },
    {
      type: "markdown",
      source: `### \`melt\` — Wide → Long`,
    },
    {
      type: "code",
      source: `import pandas as pd

wide = pd.DataFrame({
    "city":  ["서울", "부산", "제주"],
    "Jan":   [100, 80, 50],
    "Feb":   [120, 90, 65],
    "Mar":   [135, 85, 70],
})
print("Wide 원본:")
print(wide)
print()

long_df = wide.melt(
    id_vars="city",
    value_vars=["Jan", "Feb", "Mar"],
    var_name="month",
    value_name="sales",
)
print("Long 변환 (melt):")
print(long_df)
`,
    },
    {
      type: "markdown",
      source: `> 🔑 **"Long 이 거의 항상 더 분석 친화적"** 입니다.
> - GroupBy·merge·필터링·시각화 모두 Long에 최적화
> - Wide 는 보고서 막판 정리 용도

### pivot vs pivot_table

- \`pivot\` — 데이터에 중복이 없다고 가정. 중복이 있으면 **에러**.
- \`pivot_table\` — 중복을 **집계** (평균/합) 로 해소. 다음 챕터에서 다룹니다.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 — 주문 + 상품 + 고객 3종 결합

세 테이블을 모두 결합해 **"고객별·카테고리별 총 매출"** 표를 만드세요.

**요구 사항**
1. \`orders\` + \`products\` 를 \`product_id\` 로 merge
2. 위 결과를 \`customers\` 와 \`customer_id\` 로 merge
3. \`amount = quantity * price\` 컬럼 추가
4. \`groupby(["name", "category"])\` 로 amount 합계
5. \`pivot\` 으로 Wide 형식(행=고객, 열=카테고리) 으로 변환`,
    },
    {
      type: "code",
      source: `import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "name":        ["김민지", "박철수", "이영희"],
})

products = pd.DataFrame({
    "product_id": [10, 11, 12, 13],
    "item":       ["티셔츠", "청바지", "노트북", "콜라"],
    "category":   ["의류", "의류", "전자", "식품"],
    "price":      [29000, 52000, 1200000, 1500],
})

orders = pd.DataFrame({
    "order_id":    [101, 102, 103, 104, 105, 106],
    "customer_id": [1, 1, 2, 2, 3, 3],
    "product_id":  [10, 13, 12, 11, 13, 10],
    "quantity":    [2, 3, 1, 1, 10, 1],
})

# 여기에 코드를 작성하세요
`,
      hints: [
        "1단계: merged = orders.merge(products, on='product_id')",
        "2단계: merged = merged.merge(customers, on='customer_id')",
        "3단계: merged['amount'] = merged['quantity'] * merged['price']",
        "4단계: totals = merged.groupby(['name', 'category'])['amount'].sum().reset_index()",
        "5단계: wide = totals.pivot(index='name', columns='category', values='amount').fillna(0)",
      ],
      solution: `import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "name":        ["김민지", "박철수", "이영희"],
})
products = pd.DataFrame({
    "product_id": [10, 11, 12, 13],
    "item":       ["티셔츠", "청바지", "노트북", "콜라"],
    "category":   ["의류", "의류", "전자", "식품"],
    "price":      [29000, 52000, 1200000, 1500],
})
orders = pd.DataFrame({
    "order_id":    [101, 102, 103, 104, 105, 106],
    "customer_id": [1, 1, 2, 2, 3, 3],
    "product_id":  [10, 13, 12, 11, 13, 10],
    "quantity":    [2, 3, 1, 1, 10, 1],
})

# 1~2. 3-way merge
merged = (orders
    .merge(products, on="product_id")
    .merge(customers, on="customer_id"))

# 3. 매출 컬럼
merged["amount"] = merged["quantity"] * merged["price"]

# 4. 고객 × 카테고리 집계
totals = (merged.groupby(["name", "category"])["amount"]
                 .sum()
                 .reset_index())
print("Long 형식:")
print(totals)
print()

# 5. Wide 변환
wide = totals.pivot(index="name", columns="category", values="amount").fillna(0)
print("고객별 카테고리 매출 (Wide):")
print(wide)
print()
print("고객별 총 매출:")
print(wide.sum(axis=1).sort_values(ascending=False))`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 8 완료

- ✅ \`merge(on=, how=)\` — SQL JOIN 의 pandas 버전 (inner/left/right/outer)
- ✅ 키 이름이 다르면 \`left_on / right_on\`
- ✅ \`concat(axis=0/1)\` — 같은 구조 이어 붙이기
- ✅ \`pivot\` (Long→Wide) / \`melt\` (Wide→Long)
- ✅ 현실의 3-way 결합 → 분석 뷰 생성 흐름

> 📌 "Long 데이터 → 분석 → Wide 보고서" 가 가장 일반적 흐름.

다음 챕터는 **그룹 분석 심화** — \`pivot_table\`, \`transform\`, 여러 집계 한 번에 같은 고급 기법.`,
    },
    { type: "code", source: `# 자유 실험 영역\n` },
  ],
  quiz: {
    title: "챕터 8 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "두 DataFrame 을 '양쪽에 키가 있는 행만' 합치는 merge 는?",
        options: [
          "how='outer'",
          "how='left'",
          "how='inner' (기본값)",
          "how='cross'",
        ],
        correctIndex: 2,
        explanation:
          "'inner' 는 교집합. pandas merge 의 기본값이며 SQL INNER JOIN 과 동치입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "같은 구조의 월별 로그 3개 (Jan, Feb, Mar) 를 하나의 DataFrame 으로 쌓으려면?",
        options: [
          "pd.merge([jan, feb, mar])",
          "pd.concat([jan, feb, mar], ignore_index=True)",
          "jan.pivot(feb).melt(mar)",
          "jan.join([feb, mar])",
        ],
        correctIndex: 1,
        explanation:
          "같은 스키마의 데이터를 세로로 쌓을 때 concat 이 자연스러워요. ignore_index=True 로 새 인덱스 부여.",
      },
      {
        type: "multiple-choice",
        question:
          "pivot 과 pivot_table 의 차이는?",
        options: [
          "pivot 은 문자열만, pivot_table 은 숫자만",
          "pivot 은 중복 키가 있으면 에러, pivot_table 은 aggfunc 로 집계",
          "pivot_table 은 SQL 전용",
          "둘은 완전히 같다",
        ],
        correctIndex: 1,
        explanation:
          "pivot 은 (index, columns) 조합이 유일하다고 가정. 중복이 있으면 중복을 어떻게 합칠지(평균/합) 를 aggfunc 로 지정하는 pivot_table 이 필요해요.",
      },
      {
        type: "multiple-choice",
        question:
          "Wide 형식(열마다 월이 따로) 을 Long 형식(하나의 month 컬럼) 으로 바꾸는 메서드는?",
        options: [
          "pivot",
          "melt",
          "unstack",
          "explode",
        ],
        correctIndex: 1,
        explanation:
          "melt 는 여러 열을 하나의 카테고리 열(var_name) 과 값 열(value_name) 로 접습니다. pivot 의 반대 방향.",
      },
    ],
  } satisfies Quiz,
};

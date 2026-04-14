import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson09: Lesson = {
  id: "python-ds-09",
  language: "python",
  track: "data-science" as const,
  order: 9,
  title: "그룹 분석 심화 — pivot_table / transform / agg",
  subtitle: "pandas 의 진짜 힘은 그룹 연산에 있다",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🎭 그룹 분석 심화

2강에서 \`groupby().mean()\` 같은 단일 집계를 배웠죠. 이번 챕터는 그걸 넘어 **실무 보고서를 만드는** 수준의 기법으로 올라갑니다.

이번 챕터에서 배울 것:
- \`pivot_table\` — 엑셀 피벗 테이블 그대로
- 여러 집계 동시에 — \`agg\` 딕셔너리
- \`transform\` — 그룹 집계를 원본 행에 브로드캐스트
- 다중 레벨 (\`MultiIndex\`) 그룹화
- \`rank\` / \`cumsum\` / \`pct_change\` — 실무 패턴`,
    },
    {
      type: "markdown",
      source: `## 🧱 기본 데이터 준비

이번 챕터는 하나의 "sales" 데이터를 계속 씁니다.`,
    },
    {
      type: "code",
      source: `import pandas as pd
import numpy as np

sales = pd.DataFrame({
    "date":     pd.to_datetime([
        "2024-07-01", "2024-07-01", "2024-07-02", "2024-07-02",
        "2024-07-03", "2024-07-03", "2024-07-04", "2024-07-04",
        "2024-07-05", "2024-07-05",
    ]),
    "region":   ["서울", "부산", "서울", "부산", "서울",
                 "부산", "서울", "부산", "서울", "부산"],
    "category": ["의류", "식품", "전자", "의류", "전자",
                 "의류", "식품", "전자", "의류", "전자"],
    "sales":    [120, 80, 300, 150, 250, 90, 110, 220, 140, 280],
    "units":    [3, 10, 2, 4, 1, 3, 8, 2, 4, 1],
})
print(sales)
`,
    },
    {
      type: "markdown",
      source: `## 📊 \`pivot_table\` — 엑셀 피벗 그대로

\`pivot\` (챕터 8) 과 달리, **중복 조합을 집계** 로 해결.`,
    },
    {
      type: "code",
      source: `# 이전 셀의 sales 이어서
# 행=region, 열=category, 값=sales 합계
pt = sales.pivot_table(
    index="region",
    columns="category",
    values="sales",
    aggfunc="sum",
    fill_value=0,
)
print("지역 × 카테고리 매출 합계:")
print(pt)
print()

# 행/열 마진(합계) 추가
pt_total = sales.pivot_table(
    index="region",
    columns="category",
    values="sales",
    aggfunc="sum",
    fill_value=0,
    margins=True,        # 총계 행/열 추가
    margins_name="합계",
)
print("합계 추가:")
print(pt_total)
`,
    },
    {
      type: "markdown",
      source: `> 💡 \`aggfunc\` 은 \`"sum"\` / \`"mean"\` / \`"count"\` / 리스트 / 함수 모두 가능.
> \`margins=True\` 가 Excel 피벗의 "총계" 체크박스 역할.`,
    },
    {
      type: "markdown",
      source: `## 🎚️ 여러 집계 한 번에 — \`agg\` 딕셔너리

한 GroupBy에 **열마다 다른 집계** 를 지정할 수 있어요.`,
    },
    {
      type: "code",
      source: `summary = sales.groupby("region").agg(
    total_sales = ("sales", "sum"),
    avg_sales   = ("sales", "mean"),
    order_count = ("sales", "count"),
    total_units = ("units", "sum"),
    max_single  = ("sales", "max"),
)
print("지역별 요약:")
print(summary)
`,
    },
    {
      type: "markdown",
      source: `> 🔑 \`(원본컬럼, 집계함수)\` 튜플 형식이 가장 가독성 높아요 (pandas 0.25+ 의 "named aggregation").`,
    },
    {
      type: "markdown",
      source: `## 🔁 \`transform\` — 그룹 집계를 원본 행에 채우기

방금 챕터 6에서도 \`transform("median")\` 으로 결측값 채우기에 썼죠. 정식으로 학습:`,
    },
    {
      type: "code",
      source: `# 각 행 옆에 '그 지역의 평균 매출' 을 새 열로 추가
sales["region_avg"]  = sales.groupby("region")["sales"].transform("mean")
sales["vs_region"]   = sales["sales"] - sales["region_avg"]
sales["pct_of_region"] = (sales["sales"] / sales.groupby("region")["sales"].transform("sum")) * 100

print(sales[["date", "region", "category", "sales",
             "region_avg", "vs_region", "pct_of_region"]])
`,
    },
    {
      type: "markdown",
      source: `> 🧠 \`transform\` 의 본질: **"GroupBy 결과의 shape 을 원본 길이로 맞춤"**.
> 비교·비율 계산 같은 상대 지표를 만들 때 필수.

### agg vs apply vs transform

| 메서드 | 반환 shape | 용도 |
|--------|-----------|------|
| \`agg\` | 그룹 수 만큼 (축소됨) | 요약 통계 |
| \`apply\` | 자유 (반환값 따라) | 임의의 계산 |
| \`transform\` | 원본과 같음 (확장) | 브로드캐스트, 결측 채우기 |`,
    },
    {
      type: "markdown",
      source: `## 🌲 MultiIndex — 다중 레벨 그룹화`,
    },
    {
      type: "code",
      source: `# 지역 × 카테고리 로 두 번 그룹화
multi = sales.groupby(["region", "category"]).agg(
    total = ("sales", "sum"),
    days  = ("sales", "count"),
)
print("MultiIndex 결과:")
print(multi)
print()

# 상위 레벨(region) 만 선택
print("\\n서울만:")
print(multi.loc["서울"])
print()

# 레벨 풀어서 보기
print("\\nunstack() 로 카테고리를 열로:")
print(multi["total"].unstack(fill_value=0))
`,
    },
    {
      type: "markdown",
      source: `## 🏆 \`rank\` — 순위 매기기

SQL 의 \`ROW_NUMBER() OVER (PARTITION BY ...)\` 과 동등.`,
    },
    {
      type: "code",
      source: `# 각 지역 내에서 매출 순위
sales["region_rank"] = (
    sales.groupby("region")["sales"]
         .rank(method="dense", ascending=False)
         .astype(int)
)
print(sales[["date", "region", "category", "sales", "region_rank"]]
      .sort_values(["region", "region_rank"]))
`,
    },
    {
      type: "markdown",
      source: `## 📈 \`cumsum\` / \`pct_change\` — 시계열 패턴`,
    },
    {
      type: "code",
      source: `# 지역별 누적 매출
sales_sorted = sales.sort_values(["region", "date"]).copy()
sales_sorted["cumulative"] = (
    sales_sorted.groupby("region")["sales"].cumsum()
)
print("누적 매출 (지역별):")
print(sales_sorted[["region", "date", "sales", "cumulative"]])
print()

# 전일 대비 증감률
sales_sorted["pct_change"] = (
    sales_sorted.groupby("region")["sales"].pct_change() * 100
)
print("\\n전일 대비 증감률 (%):")
print(sales_sorted[["region", "date", "sales", "pct_change"]])
`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 — "매장별 베스트 카테고리 + 기여도 %"

같은 \`sales\` 데이터로 다음을 한 번에 구하세요.

**목표 표 (지역별 상위 1개 카테고리)**
| region | 1위 카테고리 | 해당 매출 | 지역 내 비중(%) |
|--------|-----------|----------|--------------|
| 부산   | 전자      | ...      | ...          |
| 서울   | 전자      | ...      | ...          |

**단계**
1. \`groupby(["region", "category"])["sales"].sum()\` 으로 합계
2. \`reset_index()\` 후 \`groupby("region")\` 에서 \`rank\` 로 지역 내 순위 매기기
3. 순위 1위만 필터
4. \`transform\` 으로 지역 총합을 행마다 붙여 비중 계산`,
    },
    {
      type: "code",
      source: `import pandas as pd

sales = pd.DataFrame({
    "region":   ["서울", "부산", "서울", "부산", "서울",
                 "부산", "서울", "부산", "서울", "부산"],
    "category": ["의류", "식품", "전자", "의류", "전자",
                 "의류", "식품", "전자", "의류", "전자"],
    "sales":    [120, 80, 300, 150, 250, 90, 110, 220, 140, 280],
})

# 여기에 코드를 작성하세요
`,
      hints: [
        "1단계: by_cat = sales.groupby(['region', 'category'])['sales'].sum().reset_index()",
        "2단계: by_cat['rank'] = by_cat.groupby('region')['sales'].rank(method='dense', ascending=False)",
        "3단계: top = by_cat[by_cat['rank'] == 1]",
        "4단계: region_total = sales.groupby('region')['sales'].sum() 을 join 하거나, top.merge 후 비율 계산",
      ],
      solution: `import pandas as pd

sales = pd.DataFrame({
    "region":   ["서울", "부산", "서울", "부산", "서울",
                 "부산", "서울", "부산", "서울", "부산"],
    "category": ["의류", "식품", "전자", "의류", "전자",
                 "의류", "식품", "전자", "의류", "전자"],
    "sales":    [120, 80, 300, 150, 250, 90, 110, 220, 140, 280],
})

# 1. 지역×카테고리 합계
by_cat = (sales.groupby(["region", "category"])["sales"]
               .sum()
               .reset_index())

# 2. 지역 내 순위
by_cat["rank"] = by_cat.groupby("region")["sales"].rank(method="dense", ascending=False)

# 3. 1위만
top = by_cat[by_cat["rank"] == 1].copy()

# 4. 지역 총합을 붙여 비중 계산
region_totals = sales.groupby("region")["sales"].sum().rename("region_total")
top = top.merge(region_totals, on="region")
top["share_pct"] = (top["sales"] / top["region_total"] * 100).round(1)

print(top[["region", "category", "sales", "region_total", "share_pct"]])`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 9 완료

- ✅ \`pivot_table(aggfunc=, margins=True)\` — 엑셀 피벗 완전판
- ✅ \`agg(total=("col","sum"), ...)\` — named aggregation
- ✅ \`transform\` — 그룹 집계를 원본 행에 채우기 (비율·결측 채움 패턴)
- ✅ MultiIndex & \`unstack\`
- ✅ \`rank\` / \`cumsum\` / \`pct_change\` — SQL 윈도우 함수와 동치

> 📌 실무 보고서의 80% 는 이 다섯 가지 조합이면 됩니다.

다음은 이 트랙의 **미니 프로젝트** — 3개 테이블의 실전 e-commerce 데이터를 EDA 해서 인사이트 3가지를 뽑아내는 종합 도전.`,
    },
    { type: "code", source: `# 자유 실험 영역\n` },
  ],
  quiz: {
    title: "챕터 9 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "pivot 대신 pivot_table 을 써야 하는 상황은?",
        options: [
          "데이터가 이미 정렬돼 있을 때",
          "index × columns 조합에 중복이 있어서 집계가 필요할 때",
          "데이터가 100행 이하일 때",
          "datetime 이 포함될 때",
        ],
        correctIndex: 1,
        explanation:
          "pivot 은 (index, columns) 가 유일하다고 가정. 중복이 있으면 aggfunc 로 합산/평균 등 집계가 필요한 pivot_table 이 적절해요.",
      },
      {
        type: "multiple-choice",
        question:
          "한 groupby 에서 '열마다 다른 집계'를 가장 깔끔하게 표현하는 방식은?",
        options: [
          "apply() 로 람다 작성",
          "agg(total=('col','sum'), avg=('col','mean')) — named aggregation",
          "결과를 merge 로 합친다",
          "for 루프로 각 열씩",
        ],
        correctIndex: 1,
        explanation:
          "named aggregation 패턴 `(원본컬럼, 집계함수)` 튜플은 컬럼 이름도 커스텀 가능하고 가독성이 최고예요.",
      },
      {
        type: "multiple-choice",
        question:
          "transform 과 agg 의 가장 큰 차이는?",
        options: [
          "transform 은 문자열만, agg 는 숫자만",
          "transform 은 결과 shape 이 원본과 같고, agg 는 그룹 개수로 축소됨",
          "agg 는 SQL 전용",
          "둘은 완전히 같다",
        ],
        correctIndex: 1,
        explanation:
          "agg 는 그룹당 1행씩 축소, transform 은 원본 길이 유지. 비율 계산이나 결측값 채우기에는 transform 이 필수.",
      },
      {
        type: "multiple-choice",
        question:
          "SQL 의 ROW_NUMBER() OVER (PARTITION BY region ORDER BY sales DESC) 와 가장 가까운 pandas 코드는?",
        options: [
          "df.sort_values('sales')",
          "df.groupby('region')['sales'].rank(method='first', ascending=False)",
          "df['sales'].rank()",
          "df.groupby('region').sum()",
        ],
        correctIndex: 1,
        explanation:
          "groupby + rank 가 SQL 윈도우 함수 대응. method='first' 가 ROW_NUMBER, 'dense' 가 DENSE_RANK, 'min' 이 RANK 와 매칭.",
      },
    ],
  } satisfies Quiz,
};

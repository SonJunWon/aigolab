import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson10: Lesson = {
  id: "python-ds-10",
  language: "python",
  track: "data-science" as const,
  order: 10,
  title: "미니 프로젝트 — 3-테이블 e-commerce EDA",
  subtitle: "매니저 브리핑을 위한 인사이트 3가지를 뽑아내세요",
  estimatedMinutes: 40,
  cells: [
    {
      type: "markdown",
      source: `# 🏁 미니 프로젝트 — 신규 데이터 분석가의 첫 주

> 🎬 **당신은 e-commerce 스타트업의 데이터 분석가** 로 입사했습니다.
> 월요일 아침, CEO 가 말합니다:
>
> *"다음 주 투자자 미팅이 있어. 지난 한 달 우리 데이터로 **인사이트 3가지** 만 뽑아줘.
> 어느 카테고리를 밀지, 어느 지역 마케팅을 늘릴지, 어떤 고객을 VIP 로 대접할지 — 뭐든 좋아.
> 데이터는 세 파일로 보냈어."*

이 챕터에서 지금까지 배운 모든 걸 총동원합니다.

### 🧰 사용할 것
- 정제 (\`fillna\`, \`drop_duplicates\`) — **챕터 6**
- 문자열·날짜 (\`pd.to_datetime\`, \`.dt.month\`) — **챕터 7**
- 다중 테이블 결합 (\`merge\`) — **챕터 8**
- 그룹 분석 (\`groupby\`, \`pivot_table\`, \`transform\`, \`rank\`) — **챕터 9**

### 📦 3개 테이블
- \`users\` — 고객 기본 정보 + 가입일
- \`products\` — 상품 카탈로그
- \`orders\` — 주문 기록 (이번 달)

차근차근 따라가 봅시다.`,
    },
    {
      type: "markdown",
      source: `## 🧪 Step 0 — 데이터 준비

아래 셀을 **반드시 먼저 실행** 하세요. 이후 셀들은 여기서 만든 변수를 계속 씁니다.`,
    },
    {
      type: "code",
      source: `import pandas as pd
import numpy as np

# ─── users ─────────────────────────────────
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

# ─── products ──────────────────────────────
products = pd.DataFrame({
    "product_id": [100, 101, 102, 103, 104, 105, 106, 107],
    "item":       ["티셔츠", "청바지", "노트북", "에어팟", "콜라",
                   "샌드위치", "키보드", "원피스"],
    "category":   ["의류", "의류", "전자", "전자", "식품",
                   "식품", "전자", "의류"],
    "price":      [29000, 52000, 1200000, 280000, 1500,
                   4500, 89000, 68000],
})

# ─── orders (약 한 달치) ───────────────────
# 재현성 위해 seed
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

# 의도적 결측 섞기 (현실성)
orders.loc[[5, 20, 35], "quantity"] = np.nan

print(f"✅ users: {len(users)}행 / products: {len(products)}행 / orders: {len(orders)}행")
print()
print("orders 미리보기:")
print(orders.head())
`,
    },
    {
      type: "markdown",
      source: `## 🧹 Step 1 — 정제

\`orders\` 에 **결측 \`quantity\`** 가 있어요 (일부러 섞어 뒀습니다). 평균값으로 채우고, 날짜 타입을 확인합니다.`,
    },
    {
      type: "code",
      source: `# 결측 확인
print("결측 상황:")
print(orders.isna().sum())
print()

# quantity 결측 → 전체 평균으로 (반올림해서 정수로)
mean_q = orders["quantity"].mean()
orders["quantity"] = orders["quantity"].fillna(round(mean_q)).astype(int)

print(f"✅ quantity 결측 보정 (평균 {mean_q:.1f} → {round(mean_q)} 로 채움)")
print(orders.isna().sum())
`,
    },
    {
      type: "markdown",
      source: `## 🔗 Step 2 — 3-테이블 결합 + 파생 컬럼

분석의 뿌리가 될 **\`df\`** 라는 통합 DataFrame 을 만듭니다.`,
    },
    {
      type: "code",
      source: `# 3-way merge
df = (orders
      .merge(users,    on="user_id")
      .merge(products, on="product_id"))

# 파생 컬럼
df["amount"] = df["quantity"] * df["price"]
df["month"]  = df["ordered_at"].dt.to_period("M").astype(str)
df["dow"]    = df["ordered_at"].dt.day_name()   # 요일

print(f"✅ 통합 df: {df.shape[0]}행 × {df.shape[1]}열")
print()
print(df[["ordered_at", "name", "region", "item", "category",
         "quantity", "price", "amount"]].head(8))
`,
    },
    {
      type: "markdown",
      source: `## 📊 Step 3 — 탐색적 기초 지표

분석의 첫걸음: **"그래서 숫자가 몇이야?"**`,
    },
    {
      type: "code",
      source: `print("📦 전체 요약")
print(f"   기간: {df['ordered_at'].min().date()} ~ {df['ordered_at'].max().date()}")
print(f"   총 매출: {df['amount'].sum():>12,}원")
print(f"   주문 수: {len(df):>12}건")
print(f"   객단가:  {df['amount'].mean():>12,.0f}원")
print(f"   고객 수: {df['user_id'].nunique():>12}명")
print()

print("📍 지역별 요약")
region_summary = df.groupby("region").agg(
    users_active = ("user_id", "nunique"),
    orders       = ("order_id", "count"),
    total_sales  = ("amount", "sum"),
    avg_order    = ("amount", "mean"),
).round(0).astype({"total_sales": int, "avg_order": int})
print(region_summary)
`,
    },
    {
      type: "markdown",
      source: `## 💎 Step 4 — 인사이트 1: "어느 카테고리를 밀지"

**카테고리별 매출 + 점유율 + 평균 객단가** 를 한 번에.`,
    },
    {
      type: "code",
      source: `category_view = df.groupby("category").agg(
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
print()

top = category_view.iloc[0]
print(f"🧠 인사이트 1: '{category_view.index[0]}' 카테고리가 전체 매출의 "
      f"{top['share_pct']}% 를 차지합니다.")
print(f"   객단가 {top['avg_amount']:,.0f}원으로 단일 구매 규모가 가장 큼.")
`,
    },
    {
      type: "markdown",
      source: `## 🗺️ Step 5 — 인사이트 2: "지역 × 카테고리 피벗"

어떤 지역에서 어떤 카테고리가 잘 팔리나?`,
    },
    {
      type: "code",
      source: `pivot = df.pivot_table(
    index="region",
    columns="category",
    values="amount",
    aggfunc="sum",
    fill_value=0,
).astype(int)

# 지역별 총계 추가
pivot["합계"] = pivot.sum(axis=1)
pivot = pivot.sort_values("합계", ascending=False)

print("🗺️ 지역 × 카테고리 매출")
print(pivot)
print()

# 지역 내 1위 카테고리
top_cat_per_region = (df.groupby(["region", "category"])["amount"].sum()
                        .reset_index()
                        .sort_values(["region", "amount"], ascending=[True, False])
                        .groupby("region")
                        .head(1))
print("\\n📌 지역별 베스트 카테고리:")
for _, row in top_cat_per_region.iterrows():
    print(f"   {row['region']}: {row['category']} ({row['amount']:,}원)")

print("\\n🧠 인사이트 2: 지역마다 '끌리는 카테고리' 가 다르다 — 타깃 광고 차별화 가능.")
`,
    },
    {
      type: "markdown",
      source: `## 🏆 Step 6 — 인사이트 3: VIP 고객 발굴

**구매액 상위 20%** 가 누구인지, 그들이 전체 매출의 몇 % 를 만드는지 (파레토 법칙).`,
    },
    {
      type: "code",
      source: `customer_view = df.groupby(["user_id", "name", "region"]).agg(
    total_spent = ("amount", "sum"),
    order_count = ("order_id", "count"),
    avg_order   = ("amount", "mean"),
).reset_index()

# 지출액 순위
customer_view = customer_view.sort_values("total_spent", ascending=False).reset_index(drop=True)
customer_view["rank"]     = customer_view.index + 1
customer_view["pct_cum"]  = (
    customer_view["total_spent"].cumsum() / customer_view["total_spent"].sum() * 100
).round(1)

# 상위 20% 기준
top_n = max(1, int(len(customer_view) * 0.2))
vip = customer_view.head(top_n).copy()
vip_share = vip["total_spent"].sum() / customer_view["total_spent"].sum() * 100

print("🏆 전체 고객 순위:")
print(customer_view[["rank", "name", "region", "total_spent",
                     "order_count", "pct_cum"]]
      .to_string(index=False))
print()
print(f"💎 상위 {top_n}명 ({top_n/len(customer_view):.0%}) 이 전체 매출의 "
      f"{vip_share:.1f}% 를 차지")
print()
print("🧠 인사이트 3: 파레토 가까운 구조 — VIP 케어가 매출 방어의 핵심.")
print("   구체적 액션: 상위 고객 대상 조기 신상품 공개, 전용 쿠폰, 생일 선물")
`,
    },
    {
      type: "markdown",
      source: `## 📅 Step 7 (보너스) — 시계열 패턴: 요일별 주문량`,
    },
    {
      type: "code",
      source: `dow_order = ["Monday", "Tuesday", "Wednesday", "Thursday",
             "Friday", "Saturday", "Sunday"]

by_dow = (df.groupby("dow")["amount"].agg(["count", "sum"])
            .reindex(dow_order)
            .fillna(0)
            .astype(int))

print("📅 요일별 주문 건수 & 매출")
print(by_dow)
print()

# ASCII 바 차트
mx = by_dow["sum"].max()
print("\\n요일별 매출 (막대):")
for day, row in by_dow.iterrows():
    bar = "█" * int(row["sum"] / mx * 30) if mx else ""
    print(f"   {day[:3]:<3} {row['sum']:>10,}  {bar}")
`,
    },
    {
      type: "markdown",
      source: `## 📝 Step 8 — 최종 보고서 브리핑

아래 셀은 **CEO 에게 드릴 실제 보고서 본문** 을 Python 으로 조립합니다.`,
    },
    {
      type: "code",
      source: `# 위 셀들의 변수(df, category_view, pivot, vip) 를 이어서 사용
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
  '{category_view.index[0]}' 가 전체 매출의 {category_view.iloc[0]['share_pct']}% 차지.
  → 제안: 해당 카테고리 재고 확충 + 가격 실험.

[인사이트 2 — 지역 × 카테고리]
{pivot.to_string()}
  → 제안: 지역별 타깃 광고 분리. 서울·부산·제주·대구 각각의 1위 카테고리 반복 노출.

[인사이트 3 — VIP 고객]
  상위 {len(vip)}명이 전체의 {vip['total_spent'].sum() / customer_view['total_spent'].sum() * 100:.1f}% 매출 기여.
  TOP 3: {', '.join(vip['name'].head(3).tolist())}
  → 제안: VIP 프로그램 설계 (생일 쿠폰 / 신상품 조기 공개 / 전용 고객 담당자).
════════════════════════════════════════════════════════
"""
print(report)
`,
    },
    {
      type: "markdown",
      source: `## ✏️ 도전 미션 — 여러분의 추가 인사이트

위 3가지 외에도 데이터에서 찾을 수 있는 **4번째 인사이트** 를 직접 발굴해 보세요.

**예시 주제 (하나 고르거나 새 주제)**
- 🕐 "하루 중 가장 매출이 몰리는 시간대" (hour 기준 분석)
- 📈 "가입일이 오래된 고객 vs 최근 가입 고객 구매 패턴 차이"
- 🔄 "가장 자주 팔리는 상품 조합" (같은 주문 내 페어)
- 💰 "객단가 상위 주문 10건의 공통 특성"

**요구 사항**
1. \`df\` 를 이용해 집계
2. 숫자 + 한 줄 인사이트 + 실행 가능한 제안 1개`,
    },
    {
      type: "code",
      source: `# df 를 이용해 자유롭게 분석하세요
# 예시: 시간대별 주문 분포

df["hour"] = df["ordered_at"].dt.hour

# 여기에 분석 코드를 작성하세요
`,
      hints: [
        "hourly = df.groupby('hour')['amount'].agg(['count', 'sum'])",
        "peak_hour = hourly['sum'].idxmax()",
        "print(f'가장 매출이 많은 시간대: {peak_hour}시, 총 {hourly.loc[peak_hour, \"sum\"]:,}원')",
        "추가: ASCII 막대로 시각화하면 인상적",
      ],
      solution: `# 예시 답안: 시간대별 매출 분석
df["hour"] = df["ordered_at"].dt.hour

hourly = (df.groupby("hour")
            .agg(orders=("order_id", "count"),
                 sales=("amount", "sum"))
            .sort_index())

peak_hour   = hourly["sales"].idxmax()
peak_sales  = hourly["sales"].max()
quiet_hour  = hourly["sales"].idxmin()

print("🕐 시간대별 매출 분포")
mx = hourly["sales"].max()
for hr, row in hourly.iterrows():
    bar = "█" * int(row["sales"] / mx * 24) if mx else ""
    marker = "  🏆" if hr == peak_hour else ""
    print(f"   {hr:02d}시  {row['sales']:>10,}원  {bar}{marker}")

print()
print(f"🧠 인사이트 4: 매출 피크는 {peak_hour}시 ({peak_sales:,}원),")
print(f"   최저 시간대는 {quiet_hour}시. 피크 전후로 타임세일 운영 가치.")`,
    },
    {
      type: "markdown",
      source: `## 🎉 데이터 과학 트랙 완주!

축하합니다. 🎊

### 여러분이 이제 할 수 있는 것

- ✅ **NumPy** 로 빠른 벡터 연산
- ✅ **Pandas** 로 DataFrame 생성·필터·정렬·집계
- ✅ 현실 데이터를 **정제** (결측/중복/이상치/타입)
- ✅ 문자열·날짜를 **벡터화** 해서 다루기
- ✅ 여러 테이블을 \`merge\` / \`concat\` / \`pivot\` 으로 결합
- ✅ **GroupBy 심화** 로 보고서 수준 분석 자동화
- ✅ **실전 EDA** 흐름 — 질문 → 집계 → 해석 → 제안

### 🚀 다음 단계

1. **실제 데이터로 연습** — Kaggle, 공공데이터포털, 나만의 CSV
2. **시각화 강화** — 이 환경은 시각화 제약이 있어요. Jupyter / Colab 에서 \`matplotlib\` / \`seaborn\` / \`plotly\` 로 넘어가기
3. **머신러닝 트랙** — 이제 정제된 데이터로 \`scikit-learn\` 모델 학습
4. **AI 강의 트랙** 과 결합 — 생성형 AI 로 데이터 요약 자동화

> 🌱 "데이터로 질문 던지는 근육" 이 가장 중요해요. 뭐든 좋으니 관심 있는 데이터부터 손으로 만져 보세요.`,
    },
    { type: "code", source: `# 자유 실험 영역 — 여러분만의 분석을 시도해 보세요\n` },
  ],
  quiz: {
    title: "미니 프로젝트 종합 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question:
          "3개 테이블(users, products, orders)을 결합하는 가장 자연스러운 순서는?",
        options: [
          "users + products 먼저, 나중에 orders",
          "orders + products + users 를 연속 merge (orders 기준)",
          "concat 으로 한 번에 쌓기",
          "pivot 3번",
        ],
        correctIndex: 1,
        explanation:
          "orders 는 사건(트랜잭션) 테이블이라 보통 기준이 됩니다. 여기에 products 로 상품 정보, users 로 고객 정보를 붙여 분석 뷰를 만듭니다.",
      },
      {
        type: "multiple-choice",
        question:
          "파레토 법칙(Pareto principle, 80/20) 에 가까운 분포를 pandas 로 확인할 때 유용한 연산 조합은?",
        options: [
          "merge + drop_duplicates",
          "sort_values + cumsum + 누적 비율 계산",
          "pivot + fillna",
          "resample('M')",
        ],
        correctIndex: 1,
        explanation:
          "고객을 금액 내림차순 정렬 → 누적합 → 누적 비율을 보면 '상위 N% 가 전체 중 몇 %' 인지 즉시 파악돼요.",
      },
      {
        type: "multiple-choice",
        question:
          "이번 프로젝트의 전체 흐름 순서로 가장 적절한 것은?",
        options: [
          "분석 → 정제 → 결합 → 수집",
          "수집 → 정제 → 결합 → 집계·분석 → 인사이트·제안",
          "시각화 → 결합 → 정제",
          "학습 → 예측 → 평가",
        ],
        correctIndex: 1,
        explanation:
          "실무 EDA 의 정석 흐름입니다. '수집 → 정제 → 결합' 까지가 80%, '분석·해석' 이 마지막 20%. 그리고 '제안' 이 결과를 쓸모 있게 만드는 마지막 고리.",
      },
      {
        type: "multiple-choice",
        question:
          "데이터 분석 결과를 보고할 때 가장 피해야 할 것은?",
        options: [
          "출처·기간·가정 명시",
          "숫자만 나열하고 액션(제안)을 제시하지 않음",
          "맥락(왜 이 질문이 중요한지) 설명",
          "이상치·결측값 처리 방법 공유",
        ],
        correctIndex: 1,
        explanation:
          "분석의 가치는 '숫자' 가 아니라 '의사결정으로 이어지는 제안'. 제안 없는 숫자 나열은 독자의 몫으로 남겨두는 것이라 효용이 낮아요.",
      },
    ],
  } satisfies Quiz,
};

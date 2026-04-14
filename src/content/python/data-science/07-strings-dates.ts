import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson07: Lesson = {
  id: "python-ds-07",
  language: "python",
  track: "data-science" as const,
  order: 7,
  title: "문자열과 날짜 데이터",
  subtitle: "실무 데이터의 최대 복병 두 가지 — .str / .dt 의 세계",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🔤🗓️ 문자열과 날짜 — 실무 데이터의 복병

정제 다음 단계는 **문자열과 날짜** 다루기입니다.
- 👤 고객 이름·이메일·주소
- 🏷️ 상품명·카테고리
- 🕐 주문 시각·가입 날짜

이들은 **그 자체로 복잡** 해서 pandas 는 전용 접근자(\`.str\`, \`.dt\`) 를 제공해요.

이번 챕터에서 배울 것:
- \`Series.str\` — 벡터화된 문자열 연산
- 정규표현식으로 추출·교체
- \`Series.dt\` — 날짜에서 요일·월·시간 뽑기
- 기간 연산, 리샘플링(\`resample\`)`,
    },
    {
      type: "markdown",
      source: `## 🔤 \`.str\` — Series 전용 문자열 접근자

Python 문자열 메서드를 **Series 전체에 한 번에** 적용.`,
    },
    {
      type: "code",
      source: `import pandas as pd

names = pd.Series([
    "  김민지  ",
    "박철수",
    "lee YEONGHEE",
    "정수진",
    "  KIM Junho",
])

print("원본:")
print(names.tolist())
print()

# 1. 공백 제거 + 한글은 그대로 두고 영어는 대문자 → Title case
cleaned = (
    names.str.strip()           # 앞뒤 공백
         .str.title()           # 첫 글자 대문자, 나머지 소문자
)
print("정리 후:")
print(cleaned.tolist())
print()

# 2. 특정 조건 필터
print("'김' 으로 시작:")
print(cleaned[cleaned.str.startswith("김")].tolist())

print()
print("글자 수:")
print(cleaned.str.len().tolist())
`,
    },
    {
      type: "markdown",
      source: `### 자주 쓰는 \`.str\` 메서드

| 메서드 | 역할 |
|--------|------|
| \`strip()\` / \`lstrip()\` / \`rstrip()\` | 공백 제거 |
| \`upper()\` / \`lower()\` / \`title()\` | 대소문자 |
| \`replace("A","B")\` | 치환 |
| \`contains("키워드")\` | 포함 여부 → bool Series |
| \`startswith / endswith\` | 시작/끝 |
| \`split("/")\` | 분할 (expand=True 면 여러 열로) |
| \`len()\` | 글자 수 |
| \`extract(r"(...)")\` | 정규식으로 추출 |`,
    },
    {
      type: "markdown",
      source: `## 🔍 정규표현식으로 뽑아내기`,
    },
    {
      type: "code",
      source: `emails = pd.Series([
    "minji@example.com",
    "chulsoo.kim@company.co.kr",
    "invalid-email",
    "guest@test.io",
])

# 이메일에서 '도메인' 만 추출
domains = emails.str.extract(r"@(.+)$")
print("도메인:")
print(domains)
print()

# 유효 이메일만 필터 (대략적 검사)
valid = emails[emails.str.contains(r"^[\\w.+-]+@[\\w-]+\\.[\\w.-]+$", regex=True, na=False)]
print("유효:")
print(valid.tolist())
`,
    },
    {
      type: "markdown",
      source: `> 💡 \`extract()\` 는 **괄호 그룹** 을 각 열로 만들어 줍니다.
> \`.str.contains(r"패턴", regex=True)\` 는 **필터링** 에 최고.`,
    },
    {
      type: "markdown",
      source: `## 🗓️ 날짜 다루기 — \`pd.to_datetime\`

문자열을 먼저 **datetime** 타입으로 변환해야 .dt 접근자가 동작해요.`,
    },
    {
      type: "code",
      source: `import pandas as pd

orders = pd.DataFrame({
    "order_id": [101, 102, 103, 104, 105],
    "ordered_at": [
        "2024-06-03 10:15",
        "2024-06-15 21:40",
        "2024-07-01 09:05",
        "2024-07-20 14:30",
        "2024-08-11 23:55",
    ],
    "amount": [15000, 32000, 8500, 45000, 12000],
})
orders["ordered_at"] = pd.to_datetime(orders["ordered_at"])
print("dtype:", orders["ordered_at"].dtype)
print()
print(orders)
`,
    },
    {
      type: "markdown",
      source: `## 📅 \`.dt\` 접근자 — 요일, 월, 시간 뽑기`,
    },
    {
      type: "code",
      source: `# 위 orders 를 계속 이용 (앞 셀 실행 필요)
orders["연"]   = orders["ordered_at"].dt.year
orders["월"]   = orders["ordered_at"].dt.month
orders["일"]   = orders["ordered_at"].dt.day
orders["요일"] = orders["ordered_at"].dt.day_name()   # Monday, Tuesday...
orders["시"]   = orders["ordered_at"].dt.hour

# 야간 주문(21시 이후) 플래그
orders["야간"] = orders["시"] >= 21

print(orders[["order_id", "ordered_at", "월", "요일", "시", "야간"]])
print()
print("야간 주문 비율:", orders["야간"].mean())
`,
    },
    {
      type: "markdown",
      source: `### \`.dt\` 자주 쓰는 것

| 속성 / 메서드 | 얻는 값 |
|--------------|-------|
| \`.year / .month / .day / .hour\` | 각 단위 숫자 |
| \`.day_name()\` / \`.month_name()\` | 영문 이름 |
| \`.weekday\` | 0=월, 6=일 |
| \`.quarter\` | 분기 (1~4) |
| \`.is_month_end\` / \`.is_quarter_start\` | 경계일 bool |
| \`.date\` / \`.time\` | 시간 분리 |
| \`.strftime("%Y-%m")\` | 포맷팅 |`,
    },
    {
      type: "markdown",
      source: `## ⏱️ 기간 연산 — 두 날짜의 차이`,
    },
    {
      type: "code",
      source: `import pandas as pd

users = pd.DataFrame({
    "name":     ["A", "B", "C", "D"],
    "joined":   pd.to_datetime(["2023-01-15", "2023-06-30", "2024-02-10", "2024-07-01"]),
    "last_buy": pd.to_datetime(["2024-07-20", "2024-08-01", "2024-08-10", "2024-08-11"]),
})

users["days_active"]  = (users["last_buy"] - users["joined"]).dt.days
users["months_active"] = users["days_active"] / 30   # 대략

print(users)
print()
print("평균 활동일:", users["days_active"].mean())
`,
    },
    {
      type: "markdown",
      source: `## 📊 리샘플링 — 월별·주별 집계

\`resample\` 은 **시계열 전용 GroupBy** 라고 생각하면 돼요.
- 일별 주문 → 월별 매출 / 주별 매출 / 분기별 매출 로 바로 변환 가능.`,
    },
    {
      type: "code",
      source: `import pandas as pd
import numpy as np

# 90일치 가상 일별 매출
rng = pd.date_range("2024-06-01", periods=90, freq="D")
np.random.seed(0)
daily = pd.DataFrame({
    "date":   rng,
    "sales":  np.random.randint(100, 1000, size=90),
}).set_index("date")

print("일별(앞 5일):")
print(daily.head())
print()

# 월별 합계
monthly = daily["sales"].resample("M").sum()
print("월별 매출:")
print(monthly)
print()

# 주별 평균
weekly_avg = daily["sales"].resample("W").mean()
print("주별 평균:")
print(weekly_avg.head())
`,
    },
    {
      type: "markdown",
      source: `> 💡 \`resample("M")\` = 월말 기준 / \`"MS"\` = 월초 기준 / \`"W"\` = 주 / \`"D"\` = 일 / \`"H"\` = 시간.

> 🔑 실무에서 **"일별 로그 → 월별 KPI"** 같은 보고서는 \`resample\` 한 줄로 끝.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 — 고객 세그먼트 분류

\`customers\` 테이블에 **이메일** 과 **가입일** 이 있어요. 두 정보로 다음을 계산하세요:

1. \`email_domain\` — 이메일 \`@\` 뒤 도메인만
2. \`join_year\` — 가입 연도
3. \`join_month\` — 가입 월
4. \`days_since_join\` — 오늘(\`2024-08-15\`) 기준 가입 후 며칠 지났는지
5. \`segment\` — 다음 규칙으로 분류
   - 90일 이하: "신규"
   - 91~365일: "일반"
   - 366일 이상: "장기"`,
    },
    {
      type: "code",
      source: `import pandas as pd

customers = pd.DataFrame({
    "name":   ["A", "B", "C", "D", "E"],
    "email":  ["a@gmail.com", "b@naver.com", "c@company.co.kr", "d@gmail.com", "e@yahoo.com"],
    "joined": ["2023-01-20", "2024-06-15", "2024-08-01", "2022-03-10", "2024-05-25"],
})
TODAY = pd.to_datetime("2024-08-15")

# 여기에 코드를 작성하세요
`,
      hints: [
        "customers['joined'] = pd.to_datetime(customers['joined'])",
        "customers['email_domain'] = customers['email'].str.extract(r'@(.+)$')",
        "customers['join_year'] = customers['joined'].dt.year",
        "days = (TODAY - customers['joined']).dt.days",
        "pd.cut 또는 np.select 를 쓰면 세그먼트 분류가 깔끔",
      ],
      solution: `import pandas as pd
import numpy as np

customers = pd.DataFrame({
    "name":   ["A", "B", "C", "D", "E"],
    "email":  ["a@gmail.com", "b@naver.com", "c@company.co.kr", "d@gmail.com", "e@yahoo.com"],
    "joined": ["2023-01-20", "2024-06-15", "2024-08-01", "2022-03-10", "2024-05-25"],
})
TODAY = pd.to_datetime("2024-08-15")

customers["joined"]       = pd.to_datetime(customers["joined"])
customers["email_domain"] = customers["email"].str.extract(r"@(.+)$")
customers["join_year"]    = customers["joined"].dt.year
customers["join_month"]   = customers["joined"].dt.month
customers["days_since_join"] = (TODAY - customers["joined"]).dt.days

customers["segment"] = np.select(
    [
        customers["days_since_join"] <= 90,
        customers["days_since_join"] <= 365,
    ],
    ["신규", "일반"],
    default="장기",
)

print(customers)`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 7 완료

- ✅ \`Series.str\` — 벡터화 문자열 (strip/upper/contains/extract)
- ✅ 정규표현식으로 이메일 도메인·전화번호 추출
- ✅ \`pd.to_datetime\` → \`.dt\` 로 연/월/요일/시 분해
- ✅ 날짜 뺄셈 → \`.dt.days\` 로 기간 계산
- ✅ \`resample\` 로 **일→주→월** 시계열 집계

다음 챕터는 **데이터 합치기(merge/concat/pivot)** — 여러 테이블을 하나의 분석 뷰로 엮는 방법.`,
    },
    { type: "code", source: `# 자유 실험 영역\n` },
  ],
  quiz: {
    title: "챕터 7 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "Series 전체에 문자열 메서드를 한 번에 적용하려면?",
        options: [
          "apply(str.upper)",
          "Series.str.upper() — .str 접근자 사용",
          "for 루프로 하나씩",
          "numpy 의 str.upper",
        ],
        correctIndex: 1,
        explanation:
          "pandas 는 Series 에 .str 접근자를 제공해, upper/strip/contains/extract 등 문자열 메서드를 벡터화해서 빠르게 적용할 수 있어요.",
      },
      {
        type: "multiple-choice",
        question:
          "datetime 타입 Series 에서 '요일 이름(Monday 등)' 을 얻으려면?",
        options: [
          "Series.dt.weekday",
          "Series.dt.day_name()",
          "Series.dt.day",
          "Series.dt.month_name()",
        ],
        correctIndex: 1,
        explanation:
          ".dt.day_name() 은 'Monday' 같은 영문 이름, .dt.weekday 는 0~6 숫자를 반환합니다.",
      },
      {
        type: "multiple-choice",
        question:
          "pd.to_datetime(s, errors='coerce') 의 효과는?",
        options: [
          "파싱 실패 시 에러를 발생시킨다",
          "파싱 실패 시 NaT 로 변환한다 (분석은 계속됨)",
          "원본 문자열을 그대로 유지",
          "불가능한 변환은 기본값 (1970-01-01) 으로 대체",
        ],
        correctIndex: 1,
        explanation:
          "'coerce' 는 잘못된 값만 NaT(Not a Time) 으로 바꾸고 나머지는 정상 변환. 정제 단계에서 유용해요.",
      },
      {
        type: "multiple-choice",
        question:
          "일별 매출 Series 를 월별 합계로 바꾸는 가장 적절한 방법은?",
        options: [
          "df.groupby(df.index.month).sum() — 연도 무시하고 월만",
          "df.resample('M').sum() — 시계열 전용 집계",
          "df.rolling(30).sum() — 이동 평균용",
          "df.mean()",
        ],
        correctIndex: 1,
        explanation:
          "resample 은 datetime 인덱스를 주기별로 그룹화하는 전용 메서드. 'M' 은 월말 기준. groupby(index.month) 는 연도가 달라도 모든 '3월' 을 한 그룹으로 묶는 다른 의미예요.",
      },
    ],
  } satisfies Quiz,
};

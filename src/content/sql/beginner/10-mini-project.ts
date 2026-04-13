import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson10: Lesson = {
  id: "sql-beginner-10",
  language: "sql",
  track: "beginner",
  order: 10,
  title: "미니 프로젝트 — Chinook 베스트셀러 분석",
  subtitle: "지금까지 배운 SELECT·JOIN·집계·서브쿼리·윈도우 총동원",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# 🎬 미니 프로젝트 — Chinook 음반사 데이터 분석가가 되어보자

축하해요! 1~9챕터를 거쳐 SQL의 핵심 문법을 **전부** 배웠어요.

이번 마지막 챕터에서는 **실무 시나리오**로 그걸 합쳐 봅니다.

> 🎧 **당신은 오늘 Chinook 음반사의 신입 데이터 분석가입니다.**
> 마케팅 팀이 6가지 질문을 던졌고, 당신은 SQL로 답해야 해요.

답할 질문:
1. 🏆 **가장 많이 팔린 아티스트 TOP 10** 은 누구인가?
2. 🎸 **장르별 매출 분포** 는 어떤가?
3. 🌍 **국가별 고객 수와 평균 구매액** 은?
4. 👑 **고객별 구매 합계 순위** (윈도우 함수)
5. 📈 **월별 매출 추이** 는?
6. 💎 **충성 고객** (5번 이상 구매한 고객) 은 누구?

> 💡 각 질문마다 **직접 실행해 보고**, 결과 표를 눈으로 읽으며 "왜 그런지" 생각해 보세요. 그게 데이터 분석가의 일입니다.`,
    },
    {
      type: "markdown",
      source: `## 🗺️ 먼저, 데이터 흐름 복습

Chinook의 핵심 체인:

\`\`\`
Artist ── Album ── Track ── InvoiceLine ── Invoice ── Customer
                     │
                     └── Genre
\`\`\`

- **InvoiceLine** 한 행 = "어떤 Invoice에 어떤 Track이 몇 개 팔렸는지"
- **매출** = \`InvoiceLine.UnitPrice × InvoiceLine.Quantity\` 의 합계
- **아티스트의 매출** 을 구하려면: InvoiceLine → Track → Album → Artist 4단 JOIN 필요`,
    },
    {
      type: "markdown",
      source: `## 🏆 질문 1 — 베스트셀러 아티스트 TOP 10

**요구사항**
- 아티스트 이름 + 총 매출 + 팔린 곡 수
- 매출 높은 순 상위 10명

**전략**
- InvoiceLine → Track → Album → Artist 를 연쇄 JOIN
- \`SUM(il.UnitPrice * il.Quantity)\` 로 매출
- \`SUM(il.Quantity)\` 로 팔린 곡 수
- \`GROUP BY\` 아티스트, \`ORDER BY\` 매출 DESC, \`LIMIT 10\``,
    },
    {
      type: "code",
      source: `SELECT
  ar.Name AS 아티스트,
  ROUND(SUM(il.UnitPrice * il.Quantity), 2) AS 총매출,
  SUM(il.Quantity) AS 팔린곡수
FROM InvoiceLine il
INNER JOIN Track  t  ON il.TrackId  = t.TrackId
INNER JOIN Album  al ON t.AlbumId   = al.AlbumId
INNER JOIN Artist ar ON al.ArtistId = ar.ArtistId
GROUP BY ar.ArtistId, ar.Name
ORDER BY 총매출 DESC
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `> 🎯 결과를 보세요. 1위 아티스트가 나머지 TOP 10과 얼마나 차이 나나요?
> 실제 마케팅 회의라면 "TOP 3에 프로모션 예산을 집중하자" 같은 제안이 여기서 나와요.`,
    },
    {
      type: "markdown",
      source: `## 🎸 질문 2 — 장르별 매출 분포

**요구사항**
- 장르 이름 + 총 매출 + 팔린 곡 수 + 전체 매출에서 차지하는 비율(%)
- 매출 높은 순

**전략**
- InvoiceLine → Track → Genre 3단 JOIN
- 비율은 **SELECT 안의 서브쿼리** 로: \`전체매출 = (SELECT SUM(UnitPrice*Quantity) FROM InvoiceLine)\``,
    },
    {
      type: "code",
      source: `SELECT
  g.Name AS 장르,
  ROUND(SUM(il.UnitPrice * il.Quantity), 2) AS 장르매출,
  SUM(il.Quantity) AS 팔린곡수,
  ROUND(
    100.0 * SUM(il.UnitPrice * il.Quantity)
    / (SELECT SUM(UnitPrice * Quantity) FROM InvoiceLine),
    1
  ) AS 비율퍼센트
FROM InvoiceLine il
INNER JOIN Track t ON il.TrackId = t.TrackId
INNER JOIN Genre g ON t.GenreId  = g.GenreId
GROUP BY g.GenreId, g.Name
ORDER BY 장르매출 DESC;`,
    },
    {
      type: "markdown",
      source: `> 💡 상위 몇 장르가 전체 매출의 절반 이상을 차지하는 "롱테일 패턴"을 볼 수 있어요.`,
    },
    {
      type: "markdown",
      source: `## 🌍 질문 3 — 국가별 고객 수 + 평균 구매액

**요구사항**
- 국가 + 고객 수 + 평균 Invoice Total + 총 매출
- 총 매출 높은 순

**전략**
- Customer + Invoice 를 JOIN
- 고객 수는 \`COUNT(DISTINCT c.CustomerId)\`
- 평균 구매액은 \`AVG(i.Total)\``,
    },
    {
      type: "code",
      source: `SELECT
  c.Country AS 국가,
  COUNT(DISTINCT c.CustomerId) AS 고객수,
  ROUND(AVG(i.Total), 2)       AS 평균구매액,
  ROUND(SUM(i.Total), 2)       AS 총매출
FROM Customer c
INNER JOIN Invoice i ON c.CustomerId = i.CustomerId
GROUP BY c.Country
ORDER BY 총매출 DESC;`,
    },
    {
      type: "markdown",
      source: `> 🧠 "미국은 고객 수는 많지만 평균 구매액은 작을 수도" 같은 인사이트가 여기서 나와요.
> 고객 수와 평균 구매액을 **같이** 봐야 올바른 결론이 나옵니다.`,
    },
    {
      type: "markdown",
      source: `## 👑 질문 4 — 고객별 구매 합계 순위 (윈도우 함수)

**요구사항**
- 고객 이름 + 총 구매액 + 순위
- 상위 15명

**전략**
- Customer + Invoice JOIN + GROUP BY 고객
- \`ROW_NUMBER() OVER (ORDER BY 총구매 DESC)\` 로 순위`,
    },
    {
      type: "code",
      source: `SELECT
  ROW_NUMBER() OVER (ORDER BY SUM(i.Total) DESC) AS 순위,
  c.FirstName || ' ' || c.LastName AS 고객명,
  c.Country AS 국가,
  ROUND(SUM(i.Total), 2) AS 총구매액
FROM Customer c
INNER JOIN Invoice i ON c.CustomerId = i.CustomerId
GROUP BY c.CustomerId, c.FirstName, c.LastName, c.Country
ORDER BY 총구매액 DESC
LIMIT 15;`,
    },
    {
      type: "markdown",
      source: `> 💡 윈도우 함수는 **GROUP BY 결과 위에 올라타서** 순위를 계산할 수 있어요.
> "상위 20% 고객에게 VIP 프로모션" 같은 액션으로 이어지는 필수 분석.`,
    },
    {
      type: "markdown",
      source: `## 📈 질문 5 — 월별 매출 추이

**요구사항**
- 월 (YYYY-MM) + 그 달 매출 + 구매 건수
- 시간 순

**전략**
- SQLite의 \`strftime('%Y-%m', InvoiceDate)\` 로 월 추출
- Invoice 테이블만으로 충분 (Total이 이미 집계된 값)`,
    },
    {
      type: "code",
      source: `SELECT
  strftime('%Y-%m', InvoiceDate) AS 월,
  COUNT(*)                        AS 구매건수,
  ROUND(SUM(Total), 2)            AS 월매출
FROM Invoice
GROUP BY 월
ORDER BY 월;`,
    },
    {
      type: "markdown",
      source: `> 📊 숫자만 봐도 성수기·비수기 패턴이 보이지 않나요?
> 실제 업무에선 이 결과를 CSV로 내려서 그래프로 그립니다.`,
    },
    {
      type: "markdown",
      source: `## 💎 질문 6 — 충성 고객 찾기 (HAVING)

**요구사항**
- **5번 이상** 구매한 고객만
- 이름 + 구매 횟수 + 총 구매액
- 구매 횟수 많은 순

**전략**
- 고객별 GROUP BY + \`HAVING COUNT(*) >= 5\``,
    },
    {
      type: "code",
      source: `SELECT
  c.FirstName || ' ' || c.LastName AS 고객명,
  c.Country,
  COUNT(*)               AS 구매횟수,
  ROUND(SUM(i.Total), 2) AS 총구매액
FROM Customer c
INNER JOIN Invoice i ON c.CustomerId = i.CustomerId
GROUP BY c.CustomerId, c.FirstName, c.LastName, c.Country
HAVING COUNT(*) >= 5
ORDER BY 구매횟수 DESC, 총구매액 DESC;`,
    },
    {
      type: "markdown",
      source: `> 🎯 이 결과가 바로 **리텐션 마케팅의 타깃 리스트** 입니다.
> \`HAVING\` 은 "집계 결과 위에서 필터링" 이라는 걸 꼭 기억!`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 1 — 장르별 베스트 아티스트 1명씩

각 **장르** 에서 매출 1등 아티스트를 딱 한 명씩 출력하세요.

컬럼: \`장르\`, \`아티스트\`, \`장르내매출\`

**힌트**
- 1단계 서브쿼리: 장르 × 아티스트 매출 집계 + \`ROW_NUMBER() OVER (PARTITION BY GenreId ORDER BY 매출 DESC)\`
- 2단계 외부: \`WHERE rk = 1\` 로 필터

> 챕터 9의 "그룹별 최상위 1개" 패턴 그대로!`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "1단계 서브쿼리에서 장르 × 아티스트 매출 집계 + ROW_NUMBER() OVER (PARTITION BY GenreId ORDER BY 매출 DESC) AS rk",
        "2단계 바깥 쿼리에서 WHERE rk = 1",
        "JOIN 체인: InvoiceLine → Track → Album → Artist + Genre",
      ],
      solution: `SELECT 장르, 아티스트, 장르내매출
FROM (
  SELECT
    g.Name AS 장르,
    ar.Name AS 아티스트,
    ROUND(SUM(il.UnitPrice * il.Quantity), 2) AS 장르내매출,
    ROW_NUMBER() OVER (
      PARTITION BY g.GenreId
      ORDER BY SUM(il.UnitPrice * il.Quantity) DESC
    ) AS rk
  FROM InvoiceLine il
  INNER JOIN Track  t  ON il.TrackId  = t.TrackId
  INNER JOIN Album  al ON t.AlbumId   = al.AlbumId
  INNER JOIN Artist ar ON al.ArtistId = ar.ArtistId
  INNER JOIN Genre  g  ON t.GenreId   = g.GenreId
  GROUP BY g.GenreId, g.Name, ar.ArtistId, ar.Name
) AS ranked
WHERE rk = 1
ORDER BY 장르내매출 DESC;`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 2 — "평균 이상의 VIP 고객" 분석

**평균 구매액보다 많이 산 고객** 만 골라서 출력하세요.

컬럼: \`고객명\`, \`총구매액\`, \`평균대비차이\` (총구매액 − 전체 평균)

**조건**
- 총구매액 내림차순, 최대 15명

**힌트**
- 1단계: 고객별 총구매액을 파생 테이블(FROM 서브쿼리)로
- 2단계: 전체 평균은 \`(SELECT AVG(총구매액) FROM 파생테이블)\` 로는 안 되니, \`(SELECT AVG(x) FROM (…))\` 처럼 한 번 더 감싸거나 \`SUM(Total) / COUNT(DISTINCT CustomerId)\` 같은 방법 사용.`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "1단계: 고객별 합계를 파생 테이블로 — SELECT CustomerId, SUM(Total) AS 총구매액 FROM Invoice GROUP BY CustomerId",
        "2단계: 그 결과의 AVG를 또 서브쿼리로 감싸서 비교",
        "최종: 총구매액 > 평균 WHERE 절",
      ],
      solution: `SELECT
  c.FirstName || ' ' || c.LastName AS 고객명,
  ROUND(totals.총구매액, 2) AS 총구매액,
  ROUND(
    totals.총구매액
    - (SELECT AVG(x.sum_total)
       FROM (SELECT SUM(Total) AS sum_total
             FROM Invoice
             GROUP BY CustomerId) AS x),
    2
  ) AS 평균대비차이
FROM (
  SELECT CustomerId, SUM(Total) AS 총구매액
  FROM Invoice
  GROUP BY CustomerId
) AS totals
INNER JOIN Customer c ON c.CustomerId = totals.CustomerId
WHERE totals.총구매액 > (
  SELECT AVG(x.sum_total)
  FROM (SELECT SUM(Total) AS sum_total
        FROM Invoice
        GROUP BY CustomerId) AS x
)
ORDER BY 총구매액 DESC
LIMIT 15;`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 10 완료 — 그리고 SQL 입문 트랙 완주!

축하합니다! 👏👏👏

오늘 미니 프로젝트에서 한 일:
- ✅ **4단 연쇄 JOIN** 으로 아티스트 매출 집계
- ✅ **SELECT 안의 서브쿼리** 로 "전체 대비 비율" 계산
- ✅ **\`COUNT(DISTINCT …)\`** + **\`AVG\`** 로 국가별 패턴 읽기
- ✅ **\`ROW_NUMBER() OVER\`** 로 고객 순위
- ✅ **\`strftime\`** 으로 시간 집계
- ✅ **\`HAVING\`** 으로 충성 고객 필터
- ✅ **\`PARTITION BY\` + rk=1** 패턴으로 그룹별 1등

### 🗺️ 다음 학습 방향

입문 트랙을 졸업했으니 이제 **실무형 SQL** 로 나아갈 준비가 됐어요:

1. **CTE (WITH 절)** — 서브쿼리를 읽기 쉬운 단계로 쪼개는 현대적 방식
2. **더 풍부한 윈도우 함수** — \`LAG\` / \`LEAD\` / \`SUM() OVER\` 누적합
3. **인덱스와 실행 계획** — 느린 쿼리 튜닝의 핵심
4. **실무 DB (PostgreSQL / MySQL)** — Chinook을 현업 엔진에 올려 보기
5. **BI 도구 연동** — Metabase / Redash / Superset 로 차트화

하지만 그 전에 가장 큰 건: **직접 관심 있는 주제의 데이터로 분석해 보는 것**.
Kaggle, 공공데이터포털, 혹은 여러분 회사의 데이터도 좋아요. **"이 데이터로 뭘 답할 수 있지?"** 질문을 던지는 습관이 분석가를 만듭니다.

다음 자유 실험 셀에서 원하는 쿼리를 마음껏 굴려 보세요. 🚀`,
    },
    {
      type: "code",
      source: `-- 자유 실험 영역 — 궁금한 분석을 직접 써 보세요.
-- 예: 특정 아티스트(AC/DC)의 앨범별 매출, 가장 비싼 10개 곡, ...
`,
    },
  ],
  quiz: {
    title: "챕터 10 퀴즈 — 종합",
    questions: [
      {
        type: "multiple-choice",
        question: "아티스트별 총 매출을 구하려면 InvoiceLine에서 시작해 어떻게 연결해야 하나요?",
        options: [
          "InvoiceLine → Artist (바로 연결)",
          "InvoiceLine → Track → Artist",
          "InvoiceLine → Track → Album → Artist",
          "InvoiceLine → Invoice → Artist",
        ],
        correctIndex: 2,
        explanation:
          "Track은 Album에, Album은 Artist에 속해요. InvoiceLine에는 TrackId만 있으니 Track → Album → Artist 3단 JOIN이 필요합니다.",
      },
      {
        type: "multiple-choice",
        question: "'전체 매출에서 장르가 차지하는 비율(%)'을 계산할 때 가장 자연스러운 방법은?",
        options: [
          "GROUP BY 안에 AVG 사용",
          "SELECT 절에 전체 매출을 서브쿼리로 넣고 100.0 * 장르매출 / 전체매출",
          "HAVING 절에서 비율 조건",
          "WHERE 절에서 SUM 사용",
        ],
        correctIndex: 1,
        explanation:
          "전체 매출은 고정된 하나의 값이므로 SELECT 안의 스칼라 서브쿼리로 뽑아 각 행에서 나눠 쓰면 됩니다. 정수 나눗셈을 피하려고 100.0 으로 곱하는 것도 포인트.",
      },
      {
        type: "multiple-choice",
        question: "SQLite에서 InvoiceDate를 '월(YYYY-MM)' 로 자르려면?",
        options: [
          "MONTH(InvoiceDate)",
          "SUBSTR(InvoiceDate, 1, 7)  -- 혹은 strftime('%Y-%m', InvoiceDate)",
          "DATEPART(month, InvoiceDate)",
          "TO_CHAR(InvoiceDate, 'YYYY-MM')",
        ],
        correctIndex: 1,
        explanation:
          "SQLite에는 MONTH/DATEPART/TO_CHAR 같은 함수가 없고 strftime 또는 문자열 함수로 처리합니다. 날짜 형식이 ISO(YYYY-MM-DD) 라서 SUBSTR(…, 1, 7) 도 통용돼요.",
      },
      {
        type: "multiple-choice",
        question: "'5번 이상 구매한 고객만' 을 거를 때 올바른 절은?",
        options: [
          "WHERE COUNT(*) >= 5",
          "HAVING COUNT(*) >= 5 (GROUP BY 뒤)",
          "ORDER BY COUNT(*) >= 5",
          "SELECT WHERE 5",
        ],
        correctIndex: 1,
        explanation:
          "집계 결과에 대한 조건은 HAVING. WHERE는 그룹 만들기 전 개별 행 필터라서 집계함수를 못 씁니다.",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson07: Lesson = {
  id: "sql-beginner-07",
  language: "sql",
  track: "beginner",
  order: 7,
  title: "그룹별 분석 — GROUP BY · HAVING",
  subtitle: "카테고리별로 묶어서 집계합니다",
  estimatedMinutes: 12,
  cells: [
    {
      type: "markdown",
      source: `# 🗂️ GROUP BY — 그룹별 집계

챕터 6의 집계는 **전체 행을 하나로** 모았어요. 실제 분석에서는 보통 "**카테고리별**"로 묶어 봅니다.

이번 챕터에서 배울 것:
- \`GROUP BY 컬럼\` — 그 컬럼 값별로 그룹화
- \`HAVING\` — 그룹 수준 필터 (WHERE는 행 수준)
- 여러 컬럼으로 그룹화
- 일반 컬럼과 집계의 혼용 규칙`,
    },
    {
      type: "markdown",
      source: `## 🏷️ 기본 — 장르별 곡 수`,
    },
    {
      type: "code",
      source: `SELECT GenreId, COUNT(*) AS 곡수
FROM Track
GROUP BY GenreId
ORDER BY 곡수 DESC;`,
    },
    {
      type: "markdown",
      source: `> 💡 \`SELECT\` 에 들어갈 수 있는 것 = **\`GROUP BY\` 에 쓴 컬럼 + 집계 함수 결과**.
> 그 외의 컬럼을 넣으면 값이 "어느 행의 것인지" 모호해서 에러/미정의 동작.`,
    },
    {
      type: "code",
      source: `-- 국가별 고객 수
SELECT Country, COUNT(*) AS 고객수
FROM Customer
GROUP BY Country
ORDER BY 고객수 DESC;`,
    },
    {
      type: "code",
      source: `-- 앨범별 곡 수 (앨범 ID 기준)
SELECT AlbumId, COUNT(*) AS 곡수, SUM(Milliseconds) AS 총ms
FROM Track
GROUP BY AlbumId
ORDER BY 곡수 DESC
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## 🎯 HAVING — 그룹 수준 필터

\`WHERE\` 는 **그룹화 전** 행을 거름, \`HAVING\` 은 **그룹화 후** 집계 결과를 거름.`,
    },
    {
      type: "code",
      source: `-- 곡이 200개 넘는 장르만
SELECT GenreId, COUNT(*) AS 곡수
FROM Track
GROUP BY GenreId
HAVING COUNT(*) > 200
ORDER BY 곡수 DESC;`,
    },
    {
      type: "code",
      source: `-- WHERE (미국 고객만) + GROUP BY (도시별) + HAVING (고객 3명 이상)
SELECT City, COUNT(*) AS 고객수
FROM Customer
WHERE Country = 'USA'
GROUP BY City
HAVING COUNT(*) >= 1  -- 이 예제는 모두 1명이라 실제 필터는 안 되지만 구조 참고
ORDER BY 고객수 DESC;`,
    },
    {
      type: "markdown",
      source: `## 📐 SELECT 문 작성 순서 (최종)

\`\`\`sql
SELECT 컬럼 (+ 집계)
FROM 테이블
WHERE 행 조건              -- 그룹화 전 필터
GROUP BY 그룹 컬럼
HAVING 그룹 조건           -- 그룹화 후 필터
ORDER BY 정렬
LIMIT N;
\`\`\`

이 순서는 **고정**입니다.

> 💡 실제 **실행 순서** (조금 다름): FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.
> 그래서 \`HAVING\` 에서 \`SELECT\` 의 별칭을 쓸 수 없을 때가 있어요 (SQLite는 허용하지만 표준은 아님).`,
    },
    {
      type: "markdown",
      source: `## 🗂️ 여러 컬럼으로 그룹화`,
    },
    {
      type: "code",
      source: `-- 국가 + 도시별 고객 수
SELECT Country, City, COUNT(*) AS 고객수
FROM Customer
GROUP BY Country, City
ORDER BY Country, 고객수 DESC
LIMIT 20;`,
    },
    {
      type: "markdown",
      source: `## 🎉 응용 — 영수증 통계`,
    },
    {
      type: "code",
      source: `-- 국가별 매출 통계
SELECT
  BillingCountry AS 국가,
  COUNT(*) AS 영수증수,
  ROUND(SUM(Total), 2) AS 총매출,
  ROUND(AVG(Total), 2) AS 평균매출
FROM Invoice
GROUP BY BillingCountry
HAVING SUM(Total) >= 50
ORDER BY 총매출 DESC;`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**Track** 테이블에서 **장르별**:
- 곡 수
- 평균 길이(분, 소수 2자리)
- 가장 비싼 가격
- **곡이 30개 이상**인 장르만
- 곡 수 많은 순`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "GROUP BY GenreId",
        "평균 길이: ROUND(AVG(Milliseconds) / 60000.0, 2)",
        "조건: HAVING COUNT(*) >= 30",
        "정렬: ORDER BY COUNT(*) DESC",
      ],
      solution: `SELECT
  GenreId,
  COUNT(*) AS 곡수,
  ROUND(AVG(Milliseconds) / 60000.0, 2) AS 평균길이분,
  MAX(UnitPrice) AS 최고가
FROM Track
GROUP BY GenreId
HAVING COUNT(*) >= 30
ORDER BY 곡수 DESC;`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**Invoice** 테이블에서:
- \`BillingCountry\` 별 총매출 집계
- **매출 10달러 이상**인 국가만
- 매출 많은 순으로 상위 5개

보너스: 각 국가의 **평균 매출**도 포함.`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "GROUP BY BillingCountry",
        "HAVING SUM(Total) >= 10",
        "ORDER BY SUM(Total) DESC LIMIT 5",
      ],
      solution: `SELECT
  BillingCountry AS 국가,
  COUNT(*) AS 영수증수,
  ROUND(SUM(Total), 2) AS 총매출,
  ROUND(AVG(Total), 2) AS 평균매출
FROM Invoice
GROUP BY BillingCountry
HAVING SUM(Total) >= 10
ORDER BY 총매출 DESC
LIMIT 5;`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 7 완료!

오늘 배운 것:
- ✅ \`GROUP BY 컬럼\` — 그룹별 집계
- ✅ \`HAVING\` — 그룹 수준 필터 (WHERE는 행 수준)
- ✅ 여러 컬럼 그룹화
- ✅ SELECT 문 작성 순서 완성: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT

**다음 챕터에서는**: 여러 테이블을 합치는 \`JOIN\`.`,
    },
    { type: "code", source: `-- 자유 실험 영역\n` },
  ],
  quiz: {
    title: "챕터 7 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "다음 중 GROUP BY 후에 그룹의 집계 결과로 필터하는 절은?",
        options: ["WHERE", "HAVING", "FILTER", "GROUP BY"],
        correctIndex: 1,
        explanation:
          "WHERE는 그룹화 **전** 행을 걸러요. HAVING은 그룹화 **후** 집계 결과를 걸러요.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 올바른 절 순서는?",
        options: [
          "SELECT → WHERE → GROUP BY → HAVING → ORDER BY",
          "SELECT → GROUP BY → WHERE → HAVING → ORDER BY",
          "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY",
          "FROM → SELECT → GROUP BY → WHERE → HAVING",
        ],
        correctIndex: 2,
        explanation:
          "작성 순서는 고정: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT.",
      },
      {
        type: "multiple-choice",
        question: "Track을 GenreId별로 그룹화했을 때, SELECT에 함께 쓸 수 있는 것은?",
        options: [
          "GenreId, Name",
          "GenreId, COUNT(*), AVG(Milliseconds)",
          "Name, AlbumId",
          "* 와 집계 함수",
        ],
        correctIndex: 1,
        explanation:
          "GROUP BY 컬럼(GenreId) + 집계 함수만 가능. Name, AlbumId 같은 비그룹 컬럼은 값이 모호.",
      },
      {
        type: "multiple-choice",
        question: "'국가별로 고객이 5명 이상인 국가만' 찾으려면?",
        options: [
          "WHERE COUNT(*) >= 5 GROUP BY Country",
          "GROUP BY Country WHERE COUNT(*) >= 5",
          "GROUP BY Country HAVING COUNT(*) >= 5",
          "HAVING Country GROUP BY COUNT(*) >= 5",
        ],
        correctIndex: 2,
        explanation:
          "집계 결과로 그룹을 거를 때는 HAVING. WHERE에는 집계 함수를 못 써요.",
      },
    ],
  } satisfies Quiz,
};

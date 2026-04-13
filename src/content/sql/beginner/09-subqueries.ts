import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson09: Lesson = {
  id: "sql-beginner-09",
  language: "sql",
  track: "beginner",
  order: 9,
  title: "서브쿼리와 윈도우 함수 맛보기",
  subtitle: "쿼리 안의 쿼리, 순위와 비율 계산",
  estimatedMinutes: 14,
  cells: [
    {
      type: "markdown",
      source: `# 🧩 서브쿼리 (Subquery)

**쿼리 안에 또 다른 쿼리를 넣는 것**. JOIN으로 못하는 복잡한 조건을 간결하게 표현할 수 있어요.

이번 챕터에서 배울 것:
- \`WHERE\` 안의 서브쿼리 (스칼라, IN)
- \`FROM\` 안의 서브쿼리 (파생 테이블)
- \`SELECT\` 안의 서브쿼리 (스칼라 컬럼)
- 윈도우 함수 맛보기 — \`ROW_NUMBER\`, \`RANK\``,
    },
    {
      type: "markdown",
      source: `## 🎯 WHERE 안의 스칼라 서브쿼리

서브쿼리가 **단일 값**을 반환해서 비교에 쓰임.`,
    },
    {
      type: "code",
      source: `-- 평균 가격보다 비싼 곡들
SELECT Name, UnitPrice
FROM Track
WHERE UnitPrice > (SELECT AVG(UnitPrice) FROM Track);`,
    },
    {
      type: "code",
      source: `-- 가장 긴 곡
SELECT Name, Milliseconds
FROM Track
WHERE Milliseconds = (SELECT MAX(Milliseconds) FROM Track);`,
    },
    {
      type: "markdown",
      source: `## 📋 \`IN (서브쿼리)\` — 여러 값 목록

챕터 2의 \`IN (1, 2, 3)\` 이 **동적 목록** 버전.`,
    },
    {
      type: "code",
      source: `-- Invoice가 있는 고객만 (실제 구매한 고객)
SELECT FirstName, LastName, Country
FROM Customer
WHERE CustomerId IN (SELECT CustomerId FROM Invoice)
LIMIT 15;`,
    },
    {
      type: "code",
      source: `-- 'Rock' 장르의 곡들 (장르 ID를 서브쿼리로)
SELECT Name, UnitPrice
FROM Track
WHERE GenreId = (SELECT GenreId FROM Genre WHERE Name = 'Rock')
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## 🧮 SELECT 안의 서브쿼리 (스칼라 컬럼)

각 행마다 따로 계산되는 하나의 값.`,
    },
    {
      type: "code",
      source: `-- 각 곡의 가격이 전체 평균보다 얼마 큰지
SELECT
  Name,
  UnitPrice,
  ROUND(UnitPrice - (SELECT AVG(UnitPrice) FROM Track), 3) AS 평균대비
FROM Track
LIMIT 15;`,
    },
    {
      type: "markdown",
      source: `## 🏗️ FROM 안의 서브쿼리 — 파생 테이블

서브쿼리 결과를 **임시 테이블처럼 사용**. 별칭 필수.`,
    },
    {
      type: "code",
      source: `-- 장르별 평균 곡수 대비 '많은 장르' 찾기
SELECT g.Name AS 장르, stats.곡수
FROM Genre g
INNER JOIN (
  SELECT GenreId, COUNT(*) AS 곡수
  FROM Track
  GROUP BY GenreId
) AS stats ON g.GenreId = stats.GenreId
ORDER BY stats.곡수 DESC
LIMIT 5;`,
    },
    {
      type: "markdown",
      source: `> 💡 파생 테이블은 **큰 쿼리를 조각으로 나눠** 가독성을 높이는 데도 유용해요.
> PostgreSQL 등에는 \`WITH\` (CTE) 라는 더 깔끔한 대안도 있어요 — SQLite도 지원.`,
    },
    {
      type: "markdown",
      source: `## 🏅 윈도우 함수 맛보기 — \`ROW_NUMBER\`, \`RANK\`

**"순위 매기기"** 나 **"카테고리 내에서 상위 N 찾기"** 같은 분석의 핵심.

문법:
\`\`\`sql
ROW_NUMBER() OVER (
  PARTITION BY 그룹 컬럼       -- 선택: 카테고리 내 순위
  ORDER BY 정렬 컬럼
) AS 순위
\`\`\``,
    },
    {
      type: "code",
      source: `-- 전체 곡 중 가격 높은 순 순위
SELECT
  Name,
  UnitPrice,
  ROW_NUMBER() OVER (ORDER BY UnitPrice DESC) AS 순위
FROM Track
LIMIT 20;`,
    },
    {
      type: "code",
      source: `-- 장르별로 가격 순위 (PARTITION BY)
SELECT
  GenreId,
  Name,
  UnitPrice,
  ROW_NUMBER() OVER (
    PARTITION BY GenreId
    ORDER BY UnitPrice DESC, TrackId
  ) AS 장르내순위
FROM Track
ORDER BY GenreId, 장르내순위
LIMIT 30;`,
    },
    {
      type: "markdown",
      source: `> 💡 \`ROW_NUMBER\` vs \`RANK\`:
> - \`ROW_NUMBER\` — 무조건 1, 2, 3... (동점 상관없이)
> - \`RANK\` — 동점이면 같은 번호, 다음은 건너뜀 (1, 2, 2, 4)
> - \`DENSE_RANK\` — 동점이면 같은 번호, 다음은 연속 (1, 2, 2, 3)
>
> 입문 단계에선 \`ROW_NUMBER\` 로 충분. 나머지는 필요할 때 찾아봐도 OK.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**Track** 테이블에서:
- 평균 길이보다 긴 곡 중
- 가장 긴 10개만

컬럼: \`Name\`, \`Milliseconds\`, 차이(\`평균과차이ms\` = Milliseconds - 평균)`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "WHERE Milliseconds > (SELECT AVG(Milliseconds) FROM Track)",
        "SELECT 안에 스칼라 서브쿼리로 차이 계산",
        "ORDER BY Milliseconds DESC LIMIT 10",
      ],
      solution: `SELECT
  Name,
  Milliseconds,
  Milliseconds - (SELECT AVG(Milliseconds) FROM Track) AS 평균과차이ms
FROM Track
WHERE Milliseconds > (SELECT AVG(Milliseconds) FROM Track)
ORDER BY Milliseconds DESC
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**장르별로 가장 긴 곡 1곡씩** 출력하세요.

힌트: 윈도우 함수 \`ROW_NUMBER() OVER (PARTITION BY GenreId ORDER BY Milliseconds DESC)\` 로 순위 매긴 뒤 **서브쿼리로 순위=1만 필터**.`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "1단계: 서브쿼리로 장르별 순위 매기기",
        "2단계: 외부에서 rank=1만 필터",
        "예: SELECT * FROM (SELECT ..., ROW_NUMBER() OVER (PARTITION BY GenreId ORDER BY Milliseconds DESC) AS rk FROM Track) WHERE rk = 1",
      ],
      solution: `SELECT GenreId, Name, Milliseconds
FROM (
  SELECT
    GenreId,
    Name,
    Milliseconds,
    ROW_NUMBER() OVER (
      PARTITION BY GenreId
      ORDER BY Milliseconds DESC
    ) AS rk
  FROM Track
) AS ranked
WHERE rk = 1
ORDER BY Milliseconds DESC;`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 9 완료!

오늘 배운 것:
- ✅ WHERE 안의 스칼라 서브쿼리 (\`= (SELECT MAX(...))\`)
- ✅ \`IN (서브쿼리)\` — 동적 목록
- ✅ SELECT 안의 서브쿼리 — 각 행 마다 계산 값
- ✅ FROM 안의 서브쿼리 — 파생 테이블
- ✅ 윈도우 함수 — \`ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)\`
- ✅ "그룹별 최상위 1개" 패턴

**다음 챕터에서는**: 지금까지 배운 모든 걸 합쳐 **베스트셀러 분석** 미니 프로젝트.`,
    },
    { type: "code", source: `-- 자유 실험 영역\n` },
  ],
  quiz: {
    title: "챕터 9 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "평균 가격보다 비싼 곡을 찾는 올바른 SQL은?",
        options: [
          "SELECT * FROM Track WHERE UnitPrice > AVG(UnitPrice);",
          "SELECT * FROM Track WHERE UnitPrice > (SELECT AVG(UnitPrice) FROM Track);",
          "SELECT * FROM Track HAVING UnitPrice > AVG(UnitPrice);",
          "SELECT * FROM Track GROUP BY AVG;",
        ],
        correctIndex: 1,
        explanation:
          "WHERE 안에서는 집계 함수를 직접 못 써요. 서브쿼리로 먼저 평균을 계산한 뒤 그 값과 비교.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 'Rock 장르의 곡만 가져오기' 와 같은 결과를 내지 않는 것은?",
        options: [
          "SELECT * FROM Track WHERE GenreId = 1 (Rock의 GenreId가 1이라 가정)",
          "SELECT * FROM Track WHERE GenreId = (SELECT GenreId FROM Genre WHERE Name='Rock')",
          "SELECT t.* FROM Track t INNER JOIN Genre g ON t.GenreId=g.GenreId WHERE g.Name='Rock'",
          "SELECT * FROM Track WHERE Rock = 1",
        ],
        correctIndex: 3,
        explanation:
          "마지막은 존재하지 않는 컬럼 Rock을 비교하려는 잘못된 SQL. 나머지 3개는 같은 결과.",
      },
      {
        type: "multiple-choice",
        question: "ROW_NUMBER() OVER (PARTITION BY GenreId ORDER BY UnitPrice DESC) 의 의미는?",
        options: [
          "모든 행에 1부터 순서대로 번호",
          "장르별로 가격 높은 순 1, 2, 3... 번호",
          "장르 순으로 정렬만",
          "가격별로 행 그룹화",
        ],
        correctIndex: 1,
        explanation:
          "PARTITION BY로 그룹을 만들고, 각 그룹 안에서 ORDER BY 기준으로 순위. 장르마다 1번부터 다시 시작.",
      },
      {
        type: "multiple-choice",
        question: "FROM 안에 서브쿼리를 쓸 때 꼭 필요한 것은?",
        options: [
          "서브쿼리 안의 ORDER BY",
          "서브쿼리에 별칭 (AS ...)",
          "서브쿼리 안의 LIMIT",
          "서브쿼리 안의 GROUP BY",
        ],
        correctIndex: 1,
        explanation:
          "FROM에 쓰는 파생 테이블은 **별칭 필수**. 외부에서 그 이름으로 컬럼을 참조해야 하니까.",
      },
    ],
  } satisfies Quiz,
};

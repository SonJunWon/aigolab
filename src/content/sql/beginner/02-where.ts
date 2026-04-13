import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson02: Lesson = {
  id: "sql-beginner-02",
  language: "sql",
  track: "beginner",
  order: 2,
  title: "조건 필터 — WHERE",
  subtitle: "원하는 행만 골라내기",
  estimatedMinutes: 12,
  cells: [
    {
      type: "markdown",
      source: `# 🎯 WHERE — 조건에 맞는 행만

\`SELECT *\` 는 모든 행을 가져왔어요. 보통은 **특정 조건에 맞는 데이터만** 보고 싶죠.

\`\`\`sql
SELECT 컬럼 FROM 테이블 WHERE 조건;
\`\`\`

이번 챕터에서 배울 것:
- 비교 연산자 \`= != < > <= >=\`
- 논리 연산자 \`AND OR NOT\`
- 범위 \`BETWEEN ... AND ...\`
- 목록 \`IN (...)\`
- 예외 \`NOT IN\``,
    },
    {
      type: "markdown",
      source: `## 🔍 가장 단순한 조건 — \`=\`

> ⚠️ **JavaScript와 다름**: SQL의 같음은 \`==\` 가 아니라 \`=\` (한 개) 입니다.`,
    },
    {
      type: "code",
      source: `-- ArtistId가 22인 아티스트 한 명만
SELECT * FROM Artist WHERE ArtistId = 22;`,
    },
    {
      type: "code",
      source: `-- Composer가 정확히 'Angus Young, Malcolm Young, Brian Johnson' 인 곡들
SELECT TrackId, Name, Composer
FROM Track
WHERE Composer = 'Angus Young, Malcolm Young, Brian Johnson';`,
    },
    {
      type: "markdown",
      source: `> 💡 **문자열은 작은따옴표**(\`'...'\`)로 감싸요. 큰따옴표는 컬럼명이라 다른 의미예요.

> 💡 작은따옴표 안에 작은따옴표가 필요하면 두 개 연속: \`'It''s'\``,
    },
    {
      type: "markdown",
      source: `## 🚫 다름 — \`!=\` 또는 \`<>\`

두 표기법이 같습니다. \`!=\` 가 더 흔해요.`,
    },
    {
      type: "code",
      source: `-- GenreId가 1(Rock)이 아닌 곡들
SELECT TrackId, Name, GenreId
FROM Track
WHERE GenreId != 1;`,
    },
    {
      type: "markdown",
      source: `## 📐 크기 비교 — \`> < >= <=\``,
    },
    {
      type: "code",
      source: `-- 가격이 1달러보다 비싼 곡 (Chinook 기본 가격은 0.99)
SELECT TrackId, Name, UnitPrice
FROM Track
WHERE UnitPrice > 0.99;`,
    },
    {
      type: "code",
      source: `-- 5분 이상 (300,000 ms 이상) 인 곡들
SELECT Name, Milliseconds / 60000.0 AS minutes
FROM Track
WHERE Milliseconds >= 300000;`,
    },
    {
      type: "markdown",
      source: `## 🔗 \`AND\` / \`OR\` — 여러 조건

JavaScript의 \`&&\`, \`||\` 처럼 두 조건을 묶어요. 단어로 적습니다.`,
    },
    {
      type: "code",
      source: `-- Rock 장르(GenreId=1)이고 5분 이상인 곡
SELECT Name, Milliseconds / 60000.0 AS minutes
FROM Track
WHERE GenreId = 1
  AND Milliseconds >= 300000;`,
    },
    {
      type: "code",
      source: `-- Rock(1) 또는 Jazz(2) 장르의 곡
SELECT Name, GenreId
FROM Track
WHERE GenreId = 1
   OR GenreId = 2;`,
    },
    {
      type: "markdown",
      source: `### 🧠 우선순위 — \`AND\` 가 \`OR\` 보다 먼저

수학에서 \`*\` 가 \`+\` 보다 먼저인 것처럼:
\`\`\`
A OR B AND C  ===  A OR (B AND C)
\`\`\`

복잡해지면 **괄호로 명시**하세요. 가독성 + 안전성.`,
    },
    {
      type: "code",
      source: `-- 잘못 쓰기 쉬운 예
-- "Rock 또는 Jazz 이면서 5분 이상" 을 의도했지만…
SELECT Name, GenreId, Milliseconds / 60000.0 AS minutes
FROM Track
WHERE GenreId = 1 OR GenreId = 2 AND Milliseconds >= 300000;
-- 실제 의미: GenreId=1 (장르 무관) OR (GenreId=2 AND 5분 이상)`,
    },
    {
      type: "code",
      source: `-- 괄호로 의도 명확히
SELECT Name, GenreId, Milliseconds / 60000.0 AS minutes
FROM Track
WHERE (GenreId = 1 OR GenreId = 2)
  AND Milliseconds >= 300000;`,
    },
    {
      type: "markdown",
      source: `## 📊 범위 — \`BETWEEN x AND y\`

\`x ≤ 값 ≤ y\` (양쪽 포함) 의 줄임 표현.`,
    },
    {
      type: "code",
      source: `-- 길이가 3분~4분 사이인 곡
SELECT Name, Milliseconds
FROM Track
WHERE Milliseconds BETWEEN 180000 AND 240000;

-- 위 SQL은 아래와 동일한 의미:
-- WHERE Milliseconds >= 180000 AND Milliseconds <= 240000`,
    },
    {
      type: "markdown",
      source: `## ✅ 목록에서 골라잡기 — \`IN\`

\`OR\` 여러 개를 깔끔하게.`,
    },
    {
      type: "code",
      source: `-- GenreId가 1, 2, 또는 3 인 곡들
SELECT Name, GenreId
FROM Track
WHERE GenreId IN (1, 2, 3);

-- 동일한 의미: GenreId = 1 OR GenreId = 2 OR GenreId = 3`,
    },
    {
      type: "code",
      source: `-- 미국 또는 캐나다 고객
SELECT FirstName, LastName, Country
FROM Customer
WHERE Country IN ('USA', 'Canada');`,
    },
    {
      type: "markdown",
      source: `## ❌ 부정 — \`NOT IN\` / \`NOT BETWEEN\``,
    },
    {
      type: "code",
      source: `-- 미국·캐나다·브라질 외의 고객
SELECT FirstName, LastName, Country
FROM Customer
WHERE Country NOT IN ('USA', 'Canada', 'Brazil');`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**Track** 테이블에서:

- \`UnitPrice\` 가 0.99달러 이상이고 (한 번에 비교)
- \`GenreId\` 가 1(Rock) 또는 4(Latin) 이고
- \`Milliseconds\` 가 240000(4분) 이하인 곡

→ \`Name\`, \`GenreId\`, \`UnitPrice\` 컬럼만 골라 출력하세요.`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "세 조건을 AND 로 묶으세요.",
        "장르 부분은 `GenreId IN (1, 4)` 로 깔끔하게.",
        "조건 간 우선순위 헷갈리면 괄호 사용.",
      ],
      solution: `SELECT Name, GenreId, UnitPrice
FROM Track
WHERE UnitPrice >= 0.99
  AND GenreId IN (1, 4)
  AND Milliseconds <= 240000;`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**Customer** 테이블에서:

- \`Country\` 가 'France', 'Germany', 'Italy' 중 하나
- \`SupportRepId\` 가 NULL 이 아닌 (담당 직원이 있는) 고객
  (NULL 처리는 챕터 5에서 자세히. 지금은 \`SupportRepId IS NOT NULL\` 사용)

→ \`FirstName\`, \`LastName\`, \`Country\`, \`SupportRepId\` 출력`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "Country: `Country IN ('France', 'Germany', 'Italy')`",
        "NULL 검사는 `=` 가 아니라 `IS NOT NULL` (특수 문법)",
        "AND 로 두 조건 결합",
      ],
      solution: `SELECT FirstName, LastName, Country, SupportRepId
FROM Customer
WHERE Country IN ('France', 'Germany', 'Italy')
  AND SupportRepId IS NOT NULL;`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 2 완료!

오늘 배운 것:
- ✅ \`WHERE 조건\` — 조건에 맞는 행만
- ✅ \`= != < > <= >=\` — 비교 (같음은 \`=\` 한 개)
- ✅ \`AND / OR / NOT\` — 조건 결합
- ✅ \`AND\` 가 \`OR\` 보다 우선 — 헷갈리면 괄호
- ✅ \`BETWEEN x AND y\` — 범위
- ✅ \`IN (...)\`, \`NOT IN (...)\` — 목록
- ✅ NULL은 \`IS NULL\` / \`IS NOT NULL\` 로 (다음 챕터에서 더 깊이)

**다음 챕터에서는**: 결과를 정렬하고 개수를 제한하는 \`ORDER BY\`, \`LIMIT\`.`,
    },
    {
      type: "code",
      source: `-- 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 2 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "다음 중 SQL에서 같음(equality)을 비교하는 올바른 연산자는?",
        options: ["==", "===", "=", "<>"],
        correctIndex: 2,
        explanation:
          "SQL의 같음은 등호 한 개 `=`. 두 개(`==`)나 세 개(`===`)는 SQL에서 안 써요. (다름은 `!=` 또는 `<>`)",
      },
      {
        type: "multiple-choice",
        question: "다음 두 SQL은 같은 결과일까요?\n\nA: `WHERE GenreId = 1 OR GenreId = 2 AND UnitPrice > 1.0`\nB: `WHERE (GenreId = 1 OR GenreId = 2) AND UnitPrice > 1.0`",
        options: ["같음", "다름 — A는 가격 무시한 GenreId=1도 포함", "다름 — B가 더 많음", "에러가 난다"],
        correctIndex: 1,
        explanation:
          "AND가 OR보다 우선이라 A는 사실상 `GenreId = 1 OR (GenreId = 2 AND UnitPrice > 1.0)`. 즉 GenreId=1 모두가 가격 무관하게 포함돼요.",
      },
      {
        type: "multiple-choice",
        question: "다음과 같은 의미의 SQL은?\n\n'GenreId가 1, 5, 또는 9인 곡'",
        options: [
          "WHERE GenreId = 1 OR 5 OR 9",
          "WHERE GenreId IN (1, 5, 9)",
          "WHERE GenreId BETWEEN 1 AND 9",
          "WHERE GenreId = (1, 5, 9)",
        ],
        correctIndex: 1,
        explanation:
          "여러 값 중 매칭은 `IN (...)`. 첫 번째는 'GenreId=1 OR 5 OR 9' 식으로 동작해서 의도와 다른 결과.",
      },
      {
        type: "multiple-choice",
        question: "Chinook에서 Country가 'USA' 이면서 SupportRepId가 NULL이 아닌 고객을 찾는 올바른 SQL은?",
        options: [
          "WHERE Country = 'USA' AND SupportRepId != NULL",
          "WHERE Country = USA AND SupportRepId IS NOT NULL",
          "WHERE Country = 'USA' AND SupportRepId IS NOT NULL",
          "WHERE Country = 'USA' AND NOT NULL SupportRepId",
        ],
        correctIndex: 2,
        explanation:
          "문자열은 작은따옴표. NULL 비교는 `IS NULL` / `IS NOT NULL` (== 나 != 로는 NULL을 비교 못 해요).",
      },
    ],
  } satisfies Quiz,
};

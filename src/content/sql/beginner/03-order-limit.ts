import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson03: Lesson = {
  id: "sql-beginner-03",
  language: "sql",
  track: "beginner",
  order: 3,
  title: "정렬과 제한 — ORDER BY · LIMIT",
  subtitle: "결과를 원하는 순서로, 원하는 개수만",
  estimatedMinutes: 10,
  cells: [
    {
      type: "markdown",
      source: `# 📊 정렬과 제한

지금까지의 쿼리는 결과 순서가 들쭉날쭉했어요. **정렬**과 **개수 제한** 으로 보고 싶은 것만 깔끔하게 가져옵니다.

이번 챕터에서 배울 것:
- \`ORDER BY 컬럼\` — 오름차순 정렬
- \`ORDER BY 컬럼 DESC\` — 내림차순
- 여러 컬럼으로 정렬
- \`LIMIT N\` — 상위 N개만
- \`LIMIT N OFFSET M\` — 페이징`,
    },
    {
      type: "markdown",
      source: `## 🔼 \`ORDER BY\` — 오름차순 (기본)

문법:
\`\`\`sql
SELECT ... FROM ... WHERE ... ORDER BY 컬럼;
\`\`\`

기본은 **오름차순(ASC)** — 작은 값부터 큰 값으로.`,
    },
    {
      type: "code",
      source: `-- 알파벳 순서로 아티스트 목록
SELECT Name FROM Artist ORDER BY Name;`,
    },
    {
      type: "code",
      source: `-- 곡 길이 짧은 순서
SELECT Name, Milliseconds
FROM Track
ORDER BY Milliseconds;`,
    },
    {
      type: "markdown",
      source: `## 🔽 \`DESC\` — 내림차순

큰 값부터.`,
    },
    {
      type: "code",
      source: `-- 가장 긴 곡부터
SELECT Name, Milliseconds / 60000.0 AS minutes
FROM Track
ORDER BY Milliseconds DESC;`,
    },
    {
      type: "code",
      source: `-- 알파벳 역순 아티스트
SELECT Name FROM Artist ORDER BY Name DESC;`,
    },
    {
      type: "markdown",
      source: `## 🎚️ 여러 컬럼으로 정렬

쉼표로 나열. **앞쪽 컬럼 값이 같을 때만 다음 컬럼**을 봅니다.`,
    },
    {
      type: "code",
      source: `-- 장르별로 묶어서 가격 높은 순
SELECT Name, GenreId, UnitPrice
FROM Track
ORDER BY GenreId, UnitPrice DESC;
-- 같은 GenreId 안에서 UnitPrice 내림차순`,
    },
    {
      type: "code",
      source: `-- 나라(오름차순) → 도시(오름차순) → 성(오름차순)
SELECT Country, City, LastName, FirstName
FROM Customer
ORDER BY Country, City, LastName;`,
    },
    {
      type: "markdown",
      source: `## ✂️ \`LIMIT\` — 상위 N개만

전체 결과 중 처음 N개만:`,
    },
    {
      type: "code",
      source: `-- 가장 비싼 곡 5개
SELECT Name, UnitPrice
FROM Track
ORDER BY UnitPrice DESC
LIMIT 5;`,
    },
    {
      type: "code",
      source: `-- 가장 긴 곡 1개 = '가장 긴 곡'
SELECT Name, Milliseconds / 60000.0 AS minutes
FROM Track
ORDER BY Milliseconds DESC
LIMIT 1;`,
    },
    {
      type: "markdown",
      source: `> 💡 **\`ORDER BY\` 없는 \`LIMIT\` 은 의미가 약함**:
> 정렬을 안 시키면 어느 행이 "처음"인지 SQLite가 임의로 정해요.
> 보통 \`ORDER BY ... LIMIT N\` 짝으로 같이 씁니다.`,
    },
    {
      type: "markdown",
      source: `## 📄 \`OFFSET\` — 페이징

처음 M개를 건너뛰고 그 다음 N개. 게시판의 페이지 처리 등에 활용.`,
    },
    {
      type: "code",
      source: `-- 6번째부터 10번째까지 (5개)
SELECT Name FROM Artist
ORDER BY Name
LIMIT 5 OFFSET 5;
-- 1~5번째는 건너뛰고 6~10번째 표시`,
    },
    {
      type: "markdown",
      source: `**페이지 N (1-based)** 가져오는 공식:
- 한 페이지에 \`size\` 개씩이라면
- \`LIMIT size OFFSET (N-1) * size\``,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**Track** 테이블에서 **가장 긴 곡 10개** 를 출력하세요.

컬럼: \`Name\`, \`AlbumId\`, \`길이분\` (= Milliseconds / 60000.0)`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "정렬: `ORDER BY Milliseconds DESC` 후 `LIMIT 10`",
        "별칭은 `AS 길이분`",
        "전체 형태: SELECT ... FROM ... ORDER BY ... LIMIT 10;",
      ],
      solution: `SELECT
  Name,
  AlbumId,
  Milliseconds / 60000.0 AS 길이분
FROM Track
ORDER BY Milliseconds DESC
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**Customer** 테이블에서:

- 미국 고객만 (\`Country = 'USA'\`)
- 도시(\`City\`) 알파벳 순으로 정렬
- 같은 도시 안에선 성(\`LastName\`) 알파벳 순
- 처음 10명만 출력

컬럼: \`FirstName\`, \`LastName\`, \`City\``,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "WHERE → ORDER BY → LIMIT 순서로 조립",
        "여러 컬럼 정렬: ORDER BY City, LastName",
        "LIMIT 10",
      ],
      solution: `SELECT FirstName, LastName, City
FROM Customer
WHERE Country = 'USA'
ORDER BY City, LastName
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## 📐 SQL 작성 순서 정리

지금까지 배운 것을 종합하면 \`SELECT\` 문의 작성 순서:

\`\`\`sql
SELECT 컬럼들
FROM 테이블
WHERE 행 조건
ORDER BY 정렬 컬럼
LIMIT 개수
OFFSET 건너뛸 개수;
\`\`\`

이 순서는 **고정**입니다. \`WHERE\` 가 \`ORDER BY\` 다음에 오면 SQL 에러가 나요.

(앞으로 더 배울 \`GROUP BY\`, \`HAVING\` 도 이 순서 안에 정해진 자리가 있습니다.)`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 3 완료!

오늘 배운 것:
- ✅ \`ORDER BY 컬럼\` — 오름차순 (기본 ASC)
- ✅ \`ORDER BY 컬럼 DESC\` — 내림차순
- ✅ 여러 컬럼 정렬 — 앞쪽이 우선
- ✅ \`LIMIT N\` — 상위 N개만
- ✅ \`LIMIT N OFFSET M\` — 페이징
- ✅ SELECT 문 작성 순서: SELECT → FROM → WHERE → ORDER BY → LIMIT

**다음 챕터에서는**: 컬럼 가공·표현식·연결을 더 깊이 다룹니다.`,
    },
    {
      type: "code",
      source: `-- 자유 실험 영역 — Chinook 둘러보기
SELECT * FROM Album ORDER BY Title LIMIT 20;`,
    },
  ],
  quiz: {
    title: "챕터 3 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "내림차순으로 정렬하는 키워드는?",
        options: ["DESCEND", "REVERSE", "DESC", "DOWN"],
        correctIndex: 2,
        explanation:
          "내림차순은 `DESC`. 오름차순은 `ASC` (기본값이라 생략 가능).",
      },
      {
        type: "multiple-choice",
        question: "다음 절들의 올바른 순서는?",
        options: [
          "SELECT → WHERE → FROM → ORDER BY → LIMIT",
          "SELECT → FROM → WHERE → ORDER BY → LIMIT",
          "FROM → SELECT → WHERE → LIMIT → ORDER BY",
          "SELECT → ORDER BY → FROM → WHERE → LIMIT",
        ],
        correctIndex: 1,
        explanation:
          "고정 순서: SELECT → FROM → WHERE → ORDER BY → LIMIT. 이 외 순서는 문법 에러.",
      },
      {
        type: "multiple-choice",
        question: "Track 테이블에서 가장 짧은 곡 1개를 가져오는 SQL은?",
        options: [
          "SELECT * FROM Track LIMIT 1;",
          "SELECT * FROM Track ORDER BY Milliseconds DESC LIMIT 1;",
          "SELECT * FROM Track ORDER BY Milliseconds LIMIT 1;",
          "SELECT MIN(Milliseconds) FROM Track;",
        ],
        correctIndex: 2,
        explanation:
          "오름차순 정렬(짧은 것부터) 후 첫 번째. ORDER BY 없이 LIMIT만 쓰면 어느 행이 첫 번째일지 보장 안 됨.",
      },
      {
        type: "multiple-choice",
        question: "한 페이지에 20개씩 표시할 때, 3페이지 (즉 41~60번째) 데이터를 가져오는 LIMIT/OFFSET 조합은?",
        options: [
          "LIMIT 20 OFFSET 20",
          "LIMIT 20 OFFSET 40",
          "LIMIT 40 OFFSET 20",
          "LIMIT 60 OFFSET 0",
        ],
        correctIndex: 1,
        explanation:
          "공식: LIMIT size OFFSET (N-1)*size. 3페이지 → OFFSET (3-1)*20 = 40, LIMIT 20.",
      },
    ],
  } satisfies Quiz,
};

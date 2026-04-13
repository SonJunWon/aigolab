import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson06: Lesson = {
  id: "sql-beginner-06",
  language: "sql",
  track: "beginner",
  order: 6,
  title: "집계 함수 — COUNT · SUM · AVG · MIN · MAX",
  subtitle: "여러 행을 하나의 값으로 모읍니다",
  estimatedMinutes: 12,
  cells: [
    {
      type: "markdown",
      source: `# 📊 집계 함수

지금까지는 각 행을 보는 쿼리였어요. 이제 **여러 행을 하나의 값으로** 만드는 집계(aggregate) 함수를 배웁니다.
"몇 개?", "합계?", "평균?" 같은 분석의 기초.

이번 챕터에서 배울 것:
- \`COUNT\` — 개수 (\`*\` vs 컬럼 vs DISTINCT)
- \`SUM\` — 합계
- \`AVG\` — 평균
- \`MIN\` / \`MAX\` — 최소/최대 (집계 버전)
- 집계 + \`WHERE\` 조합
- 다음 챕터 미리보기 — \`GROUP BY\``,
    },
    {
      type: "markdown",
      source: `## 🔢 \`COUNT\` — 개수 세기

세 가지 형태:

| 형태 | 의미 |
|---|---|
| \`COUNT(*)\` | 행의 총 개수 (NULL 포함) |
| \`COUNT(컬럼)\` | 그 컬럼이 NULL이 아닌 행의 개수 |
| \`COUNT(DISTINCT 컬럼)\` | 그 컬럼의 **중복 제거된** 고유값 개수 |`,
    },
    {
      type: "code",
      source: `-- 전체 곡 수
SELECT COUNT(*) AS 총곡수 FROM Track;`,
    },
    {
      type: "code",
      source: `-- 작곡가 컬럼이 채워진 곡 수 (NULL 제외)
SELECT
  COUNT(*) AS 총곡수,
  COUNT(Composer) AS 작곡가있는곡수,
  COUNT(*) - COUNT(Composer) AS 작곡가없는곡수
FROM Track;`,
    },
    {
      type: "code",
      source: `-- 고유 작곡가 수 (중복 제거)
SELECT COUNT(DISTINCT Composer) AS 고유작곡가수 FROM Track;`,
    },
    {
      type: "markdown",
      source: `> 💡 \`COUNT(*)\` 는 NULL이 어디 있든 그냥 행 자체를 세요.
> \`COUNT(컬럼)\` 은 그 컬럼이 NULL인 행은 제외.
> 헷갈리면 거의 항상 \`COUNT(*)\` 가 정답입니다.`,
    },
    {
      type: "markdown",
      source: `## ➕ \`SUM\` — 합계

숫자 컬럼만. NULL은 자동으로 무시됩니다.`,
    },
    {
      type: "code",
      source: `-- 모든 영수증의 총 매출
SELECT SUM(Total) AS 총매출 FROM Invoice;`,
    },
    {
      type: "code",
      source: `-- 가장 단순한 영수증 통계
SELECT
  COUNT(*) AS 영수증수,
  SUM(Total) AS 총매출,
  ROUND(AVG(Total), 2) AS 평균매출
FROM Invoice;`,
    },
    {
      type: "markdown",
      source: `## 📈 \`AVG\` — 평균

\`SUM(컬럼) / COUNT(컬럼)\` 와 같은 결과. NULL 무시.`,
    },
    {
      type: "code",
      source: `-- 곡당 평균 길이
SELECT
  ROUND(AVG(Milliseconds) / 60000.0, 2) AS 평균길이분,
  ROUND(AVG(UnitPrice), 2) AS 평균가격
FROM Track;`,
    },
    {
      type: "markdown",
      source: `## 🏆 \`MIN\` / \`MAX\` — 최소/최대 (집계)

챕터 4에서 본 \`MIN(a, b)\` (인자 비교) 와 다름. 여기는 **컬럼 전체에서 최솟/최댓값**.`,
    },
    {
      type: "code",
      source: `-- 가장 짧은 곡, 가장 긴 곡
SELECT
  MIN(Milliseconds) AS 최단ms,
  MAX(Milliseconds) AS 최장ms,
  MAX(Milliseconds) - MIN(Milliseconds) AS 차이ms
FROM Track;`,
    },
    {
      type: "code",
      source: `-- 문자열에도 적용 (사전순 최소·최대)
SELECT
  MIN(Name) AS 첫이름,
  MAX(Name) AS 끝이름
FROM Artist;`,
    },
    {
      type: "markdown",
      source: `## 🎯 집계 + WHERE 조합

\`WHERE\` 로 먼저 필터, 그 다음 집계.`,
    },
    {
      type: "code",
      source: `-- Rock 장르(GenreId=1)의 곡만 통계
SELECT
  COUNT(*) AS 록곡수,
  ROUND(AVG(Milliseconds) / 60000.0, 2) AS 평균길이분,
  ROUND(AVG(UnitPrice), 2) AS 평균가격
FROM Track
WHERE GenreId = 1;`,
    },
    {
      type: "code",
      source: `-- 미국 고객의 총 구매액
SELECT
  COUNT(*) AS 영수증수,
  SUM(Total) AS 총구매,
  ROUND(AVG(Total), 2) AS 평균구매
FROM Invoice
WHERE BillingCountry = 'USA';`,
    },
    {
      type: "markdown",
      source: `## 🎁 미리보기 — \`GROUP BY\`

지금까지는 전체 행을 하나로 모았어요. 다음 챕터에서는 **카테고리별로 묶어서** 집계합니다.

\`\`\`sql
SELECT 카테고리, COUNT(*), SUM(...)
FROM 테이블
GROUP BY 카테고리;
\`\`\`

맛만 보기:`,
    },
    {
      type: "code",
      source: `-- 장르별 곡 수 (다음 챕터 미리보기)
SELECT GenreId, COUNT(*) AS 곡수
FROM Track
GROUP BY GenreId
ORDER BY 곡수 DESC
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## ⚠️ 자주 하는 실수

집계 함수와 일반 컬럼을 같이 \`SELECT\` 하면 보통 에러나거나 이상한 결과:

\`\`\`sql
-- ❌ 의미 불명: Track 이름은 100만 개인데 SUM은 한 개? 어느 행?
SELECT Name, SUM(Milliseconds) FROM Track;
\`\`\`

이런 조합은 다음 챕터의 \`GROUP BY\` 를 같이 써야 의미가 생깁니다.

> 💡 SQLite는 관대해서 위 쿼리를 에러 없이 실행하지만, 결과는 임의 행의 Name + 전체 합계로 의미가 모호. 다른 DB(PostgreSQL)는 명시적 에러.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**Track** 테이블에서 다음 통계를 한 번에 출력:

- \`총곡수\` (COUNT)
- \`고유앨범수\` (DISTINCT AlbumId)
- \`총길이분\` (SUM(Milliseconds) / 60000)
- \`평균가격\` (소수점 2자리 반올림)
- \`최장ms\`, \`최단ms\``,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "한 SELECT 안에 여러 집계 함수를 나열하세요",
        "DISTINCT는 COUNT 안에: COUNT(DISTINCT AlbumId)",
        "총길이분: SUM(Milliseconds) / 60000.0 (소수 결과를 위해 .0)",
      ],
      solution: `SELECT
  COUNT(*) AS 총곡수,
  COUNT(DISTINCT AlbumId) AS 고유앨범수,
  ROUND(SUM(Milliseconds) / 60000.0, 0) AS 총길이분,
  ROUND(AVG(UnitPrice), 2) AS 평균가격,
  MAX(Milliseconds) AS 최장ms,
  MIN(Milliseconds) AS 최단ms
FROM Track;`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**Customer** 테이블에서:

- 미국(\`USA\`) 고객 수
- 미국 외 고객 수 (NOT)
- 회사 정보가 있는 고객 비율 (있는 사람 / 전체 * 100, 소수 1자리)

세 값을 한 SELECT 로.`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "조건부 카운트: SUM(CASE WHEN 조건 THEN 1 ELSE 0 END)",
        "또는 더 SQL다운: COUNT(CASE WHEN 조건 THEN 1 END) — CASE의 ELSE NULL이 자동 적용되어 NULL은 COUNT 안 됨",
        "비율: COUNT(Company) * 100.0 / COUNT(*) (회사 컬럼이 채워진 행 수 / 전체 행 수)",
      ],
      solution: `SELECT
  SUM(CASE WHEN Country = 'USA' THEN 1 ELSE 0 END) AS 미국고객,
  SUM(CASE WHEN Country != 'USA' THEN 1 ELSE 0 END) AS 미국외고객,
  ROUND(COUNT(Company) * 100.0 / COUNT(*), 1) AS 회사보유비율
FROM Customer;`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 6 완료!

오늘 배운 것:
- ✅ \`COUNT(*)\` / \`COUNT(컬럼)\` / \`COUNT(DISTINCT 컬럼)\` 의 차이
- ✅ \`SUM\`, \`AVG\` — NULL 자동 무시
- ✅ \`MIN\`, \`MAX\` (집계 버전) — 컬럼 전체 최솟·최댓값
- ✅ 집계와 \`WHERE\` 조합
- ✅ 일반 컬럼 + 집계는 \`GROUP BY\` 가 필요 (다음 챕터)
- ✅ 조건부 집계 — \`SUM(CASE WHEN ...)\` 패턴

**다음 챕터에서는**: \`GROUP BY\` + \`HAVING\` — 카테고리별 집계의 본격적 활용.`,
    },
    {
      type: "code",
      source: `-- 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 6 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "다음 중 NULL인 행도 포함해서 행 개수를 세는 함수는?",
        options: ["COUNT(컬럼)", "COUNT(*)", "COUNT(DISTINCT 컬럼)", "COUNT()"],
        correctIndex: 1,
        explanation:
          "COUNT(*) 는 행 자체를 세므로 NULL 무관. COUNT(컬럼)은 그 컬럼이 NULL인 행 제외.",
      },
      {
        type: "predict-output",
        question: "Track 테이블의 모든 곡 길이의 평균을 ms 단위로 구하는 SQL은?",
        code: `(보기에서 골라요)`,
        options: [
          "SELECT MEAN(Milliseconds) FROM Track;",
          "SELECT AVG(Milliseconds) FROM Track;",
          "SELECT SUM(Milliseconds) FROM Track;",
          "SELECT MEDIAN(Milliseconds) FROM Track;",
        ],
        correctIndex: 1,
        explanation:
          "표준 SQL의 평균 함수는 AVG. SUM은 합계, MEAN/MEDIAN은 SQLite에 기본 없음.",
      },
      {
        type: "predict-output",
        question: "이 SQL은 무엇을 반환할까요?",
        code: `SELECT COUNT(DISTINCT GenreId) FROM Track;`,
        options: [
          "Track 테이블의 행 수",
          "GenreId 값의 종류 수 (중복 제거)",
          "GenreId 컬럼이 NULL이 아닌 행 수",
          "에러",
        ],
        correctIndex: 1,
        explanation:
          "DISTINCT는 중복을 제거. Track에 등장하는 고유 GenreId의 개수.",
      },
      {
        type: "predict-output",
        question: "이 표현식의 결과는? (Customer.Company가 NULL인 행이 50개, 전체가 200행이라 가정)",
        code: `SELECT COUNT(Company) FROM Customer;`,
        options: ["200", "150", "50", "0"],
        correctIndex: 1,
        explanation:
          "COUNT(컬럼) 은 그 컬럼이 NULL인 행 제외. 200 - 50 = 150.",
      },
    ],
  } satisfies Quiz,
};

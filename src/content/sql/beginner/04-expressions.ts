import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson04: Lesson = {
  id: "sql-beginner-04",
  language: "sql",
  track: "beginner",
  order: 4,
  title: "컬럼 가공 — 표현식 · 문자열 · CASE",
  subtitle: "결과 컬럼을 가공하고, 조건에 따라 다른 값으로 변환합니다",
  estimatedMinutes: 12,
  cells: [
    {
      type: "markdown",
      source: `# 🎨 컬럼 가공

\`SELECT\` 절에는 단순한 컬럼 이름뿐 아니라 **표현식**도 올 수 있어요.
이번 챕터에서는 본격적으로 **결과 컬럼을 가공·계산·변환**하는 방법을 배웁니다.

이번 챕터에서 배울 것:
- 산술 표현식 (\`+ - * /\`) — 챕터 1에서 살짝
- 문자열 결합 — \`||\`
- 자주 쓰는 문자열 함수 — \`UPPER\`, \`LOWER\`, \`LENGTH\`, \`SUBSTR\`
- 숫자 함수 — \`ROUND\`, \`ABS\`
- \`CASE WHEN ... THEN ... ELSE ... END\` — 조건부 값`,
    },
    {
      type: "markdown",
      source: `## ➕ 산술 표현식 복습

이미 챕터 1에서 봤죠. 컬럼끼리도 계산 가능:`,
    },
    {
      type: "code",
      source: `SELECT
  Name,
  Bytes,
  Bytes / 1024 AS KB,
  Bytes / 1024 / 1024 AS MB
FROM Track
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## 🔗 문자열 결합 — \`||\`

JavaScript의 \`+\` 처럼, SQL에서는 **\`||\`** (파이프 두 개) 가 문자열 연결입니다.

> 💡 표준 SQL 문법. 일부 DB(MySQL)는 \`CONCAT()\` 함수만 지원하지만 SQLite는 \`||\` 표준 사용.`,
    },
    {
      type: "code",
      source: `SELECT
  FirstName || ' ' || LastName AS 전체이름,
  Email
FROM Customer
LIMIT 5;`,
    },
    {
      type: "code",
      source: `-- 영수증 만들기 형태
SELECT
  '주문 #' || InvoiceId AS 주문번호,
  '$' || Total AS 금액
FROM Invoice
LIMIT 5;`,
    },
    {
      type: "markdown",
      source: `## 🔠 문자열 함수

자주 쓰는 것 정리:

| 함수 | 의미 | 예 |
|---|---|---|
| \`UPPER(s)\` | 모두 대문자 | \`UPPER('hi')\` → \`'HI'\` |
| \`LOWER(s)\` | 모두 소문자 | \`LOWER('HI')\` → \`'hi'\` |
| \`LENGTH(s)\` | 길이 | \`LENGTH('hi')\` → \`2\` |
| \`SUBSTR(s, 시작, 길이)\` | 부분 문자열 (1부터 시작!) | \`SUBSTR('hello', 2, 3)\` → \`'ell'\` |
| \`TRIM(s)\` | 양쪽 공백 제거 | \`TRIM('  hi  ')\` → \`'hi'\` |
| \`REPLACE(s, 찾을, 바꿀)\` | 치환 | \`REPLACE('a-b', '-', '_')\` → \`'a_b'\` |

> ⚠️ **\`SUBSTR\` 의 첫 인덱스는 1** (JavaScript는 0). 헷갈리기 쉬워요.`,
    },
    {
      type: "code",
      source: `SELECT
  Name,
  UPPER(Name) AS 대문자,
  LENGTH(Name) AS 길이,
  SUBSTR(Name, 1, 5) AS 앞5글자
FROM Track
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## 🔢 숫자 함수

| 함수 | 의미 |
|---|---|
| \`ROUND(x)\` | 반올림 (정수로) |
| \`ROUND(x, n)\` | 소수점 n자리까지 반올림 |
| \`ABS(x)\` | 절댓값 |
| \`MIN(a, b, ...)\` | 최솟값 (인자 비교) |
| \`MAX(a, b, ...)\` | 최댓값 (인자 비교) |

> 💡 \`MIN\`/\`MAX\` 가 두 가지 의미: (1) 인자 여러 개 중 비교 (위), (2) 컬럼의 집계 함수 (다음 챕터 6). 같은 이름이지만 사용 방법으로 구분됩니다.`,
    },
    {
      type: "code",
      source: `SELECT
  Name,
  Milliseconds,
  ROUND(Milliseconds / 60000.0, 2) AS 길이분,
  ROUND(UnitPrice * 1300, 0) AS 원화추정
FROM Track
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## 🌳 \`CASE WHEN ... THEN ... ELSE ... END\` — 조건부 값

JavaScript의 \`if/else\` 또는 삼항 연산자처럼, **컬럼 값에 따라 다른 값을 반환**하는 표현식.

문법:
\`\`\`sql
CASE
  WHEN 조건1 THEN 값1
  WHEN 조건2 THEN 값2
  ELSE 그외값
END
\`\`\``,
    },
    {
      type: "code",
      source: `-- 곡 길이를 카테고리로 분류
SELECT
  Name,
  Milliseconds,
  CASE
    WHEN Milliseconds < 60000 THEN '짧음 (1분 미만)'
    WHEN Milliseconds < 240000 THEN '보통 (4분 미만)'
    WHEN Milliseconds < 480000 THEN '김 (8분 미만)'
    ELSE '매우 김 (8분 이상)'
  END AS 길이분류
FROM Track
LIMIT 20;`,
    },
    {
      type: "code",
      source: `-- 가격 등급 매기기
SELECT
  Name,
  UnitPrice,
  CASE
    WHEN UnitPrice >= 1.99 THEN 'Premium'
    WHEN UnitPrice >= 0.99 THEN 'Standard'
    ELSE 'Budget'
  END AS 등급
FROM Track
ORDER BY UnitPrice DESC
LIMIT 15;`,
    },
    {
      type: "markdown",
      source: `> 💡 \`CASE\` 의 단순한 형태 (값 매칭):
> \`\`\`sql
> CASE 컬럼
>   WHEN 값1 THEN 결과1
>   WHEN 값2 THEN 결과2
>   ELSE 기본값
> END
> \`\`\`
> 위 두 가지 다 자주 씁니다. 일반(WHEN 조건)이 더 강력해서 그것 위주로 외워두세요.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**Customer** 테이블에서 다음 컬럼을 만드세요:

- \`전체이름\` = FirstName + 공백 + LastName
- \`도시국가\` = City + ", " + Country (예: "Berlin, Germany")
- \`담당여부\` = SupportRepId가 NULL이면 '없음', 아니면 '있음'

\`Email\` 컬럼도 함께 출력. 처음 10명만.`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "문자열 결합은 ||. 공백 문자열은 ' '",
        "담당여부는 CASE WHEN SupportRepId IS NULL THEN '없음' ELSE '있음' END",
        "전체 형태: SELECT ... FROM Customer LIMIT 10;",
      ],
      solution: `SELECT
  FirstName || ' ' || LastName AS 전체이름,
  City || ', ' || Country AS 도시국가,
  CASE
    WHEN SupportRepId IS NULL THEN '없음'
    ELSE '있음'
  END AS 담당여부,
  Email
FROM Customer
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## 🏷️ 보너스 — 길이를 깔끔한 \`MM:SS\` 형식으로

문자열 함수와 산술을 조합한 실전 예:`,
    },
    {
      type: "code",
      source: `SELECT
  Name,
  Milliseconds,
  -- 분 = 정수 나눗셈
  Milliseconds / 60000 AS m,
  -- 초 = 60000으로 나눈 나머지를 1000으로
  (Milliseconds % 60000) / 1000 AS s,
  -- MM:SS 형식 (간단 버전 — 한 자리 초는 패딩 없음)
  (Milliseconds / 60000) || ':' ||
    SUBSTR('00' || ((Milliseconds % 60000) / 1000), -2, 2) AS 길이
FROM Track
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `> 💡 \`SUBSTR('00' || 숫자, -2, 2)\` 는 **앞에 0 패딩** 만드는 관용구.
> 숫자 5 → '005' → 끝 2글자 '05'. 7:5 가 7:05 처럼 표시되도록.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**Track** 테이블에서:

- \`Name\` 그대로
- \`UnitPrice\` 를 다음 분류로:
  - 1.99 이상: \`'고가'\`
  - 0.99: \`'표준'\`
  - 그 외: \`'기타'\`
  - → \`가격분류\` 컬럼

가격이 \`고가\` 인 것을 먼저 보고 싶으니 정렬은 \`가격분류 DESC\` 로 (한글 정렬은 가나다 역순).

힌트: ORDER BY 에는 별칭도 쓸 수 있어요.`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "CASE WHEN UnitPrice >= 1.99 THEN '고가' WHEN UnitPrice = 0.99 THEN '표준' ELSE '기타' END",
        "ORDER BY 가격분류 DESC LIMIT 30 정도",
      ],
      solution: `SELECT
  Name,
  CASE
    WHEN UnitPrice >= 1.99 THEN '고가'
    WHEN UnitPrice = 0.99 THEN '표준'
    ELSE '기타'
  END AS 가격분류
FROM Track
ORDER BY 가격분류 DESC
LIMIT 30;`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 4 완료!

오늘 배운 것:
- ✅ 산술 표현식 — 컬럼끼리 \`+ - * /\` 가능
- ✅ 문자열 결합 — \`||\`
- ✅ 문자열 함수 — \`UPPER / LOWER / LENGTH / SUBSTR / TRIM / REPLACE\`
- ✅ 숫자 함수 — \`ROUND(x) / ROUND(x, n) / ABS\`
- ✅ \`SUBSTR\` 인덱스는 1부터
- ✅ \`CASE WHEN ... THEN ... ELSE ... END\` — 조건부 값

**다음 챕터에서는**: 패턴 매칭 \`LIKE\` 와 NULL 다루기를 깊이.`,
    },
    {
      type: "code",
      source: `-- 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 4 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 SQL의 결과 컬럼 값은?",
        code: `SELECT 'Hello' || ' ' || 'World';`,
        options: ['"Hello World"', '"HelloWorld"', '"Hello + World"', "에러"],
        correctIndex: 0,
        explanation:
          "SQLite에서 || 는 문자열 연결. 'Hello' + 공백 + 'World' = 'Hello World'.",
      },
      {
        type: "predict-output",
        question: "이 SQL의 결과 값은?",
        code: `SELECT SUBSTR('JavaScript', 5, 4);`,
        options: ['"Java"', '"Scrip"', '"Scri"', '"Script"'],
        correctIndex: 2,
        explanation:
          "SUBSTR은 1-based 인덱스. 5번째('S')부터 4글자 = 'Scri'.",
      },
      {
        type: "predict-output",
        question: "이 SQL의 결과 값은?",
        code: `SELECT CASE
  WHEN 7 > 10 THEN 'big'
  WHEN 7 > 5 THEN 'medium'
  ELSE 'small'
END;`,
        options: ['"big"', '"medium"', '"small"', "NULL"],
        correctIndex: 1,
        explanation:
          "위에서부터 검사. 7>10은 false, 7>5는 true → 'medium'에서 멈춤.",
      },
      {
        type: "predict-output",
        question: "이 SQL의 결과는?",
        code: `SELECT ROUND(3.14159, 2);`,
        options: ["3", "3.1", "3.14", "3.142"],
        correctIndex: 2,
        explanation:
          "ROUND의 두 번째 인자는 소수점 자릿수. 2자리까지 반올림 = 3.14.",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson05: Lesson = {
  id: "sql-beginner-05",
  language: "sql",
  track: "beginner",
  order: 5,
  title: "패턴 매칭과 NULL — LIKE · IS NULL · COALESCE",
  subtitle: "부분 일치 검색과 비어있는 값 다루기",
  estimatedMinutes: 12,
  cells: [
    {
      type: "markdown",
      source: `# 🔎 패턴 매칭과 NULL

지금까지의 \`=\` 비교는 **정확히 같은 값**만 찾을 수 있었어요. 이제 "**...을 포함하는**", "**...로 시작하는**" 같은 검색을 배웁니다.
또 SQL의 골치 — **NULL** 을 안전하게 다루는 법도.

이번 챕터에서 배울 것:
- \`LIKE\` + 와일드카드 \`%\`, \`_\`
- \`NOT LIKE\`, 대소문자 처리
- NULL 의 본질과 \`IS NULL\` / \`IS NOT NULL\`
- NULL 안전 처리 — \`COALESCE\`, \`IFNULL\``,
    },
    {
      type: "markdown",
      source: `## 🔍 \`LIKE\` — 패턴 검색

문법:
\`\`\`sql
WHERE 컬럼 LIKE '패턴'
\`\`\`

**와일드카드**:
- \`%\` — **0개 이상의 어떤 문자**
- \`_\` — **정확히 1글자**`,
    },
    {
      type: "code",
      source: `-- 'The' 로 시작하는 곡
SELECT Name FROM Track WHERE Name LIKE 'The%' LIMIT 10;`,
    },
    {
      type: "code",
      source: `-- 'Love' 가 어디든 들어간 곡
SELECT Name FROM Track WHERE Name LIKE '%Love%' LIMIT 10;`,
    },
    {
      type: "code",
      source: `-- '!' 로 끝나는 곡
SELECT Name FROM Track WHERE Name LIKE '%!' LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## 🎯 정확한 자릿수 — \`_\``,
    },
    {
      type: "code",
      source: `-- 정확히 4글자 이름의 아티스트
SELECT Name FROM Artist WHERE Name LIKE '____' LIMIT 10;
-- 언더스코어 4개 = 정확히 4글자`,
    },
    {
      type: "code",
      source: `-- 'A' 로 시작하고 정확히 5글자
SELECT Name FROM Artist WHERE Name LIKE 'A____' LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## 🚫 \`NOT LIKE\``,
    },
    {
      type: "code",
      source: `-- 'The' 로 시작하지 않는 곡 (앞 10개)
SELECT Name FROM Track WHERE Name NOT LIKE 'The%' LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## 🔠 대소문자

> ⚠️ **SQLite의 \`LIKE\` 는 ASCII 문자에 대해 대소문자 무시**입니다. 즉 \`'apple'\` 과 \`'APPLE'\` 둘 다 매칭.
> 한글·기타 유니코드 문자는 정확히 일치해야 매칭.
> 다른 DB(PostgreSQL 등)는 기본 동작이 다를 수 있으니 주의.`,
    },
    {
      type: "code",
      source: `-- 'rock' 패턴 — 대소문자 모두 잡힘
SELECT Name FROM Track WHERE Name LIKE '%rock%' LIMIT 10;
-- "Rock", "ROCK" 도 매칭됨`,
    },
    {
      type: "markdown",
      source: `## ❓ NULL 의 본질

NULL은 **"값이 비어있다 / 알 수 없다"** 라는 의미예요. 0이나 빈 문자열과 다름.

> 🪤 **함정 1**: \`NULL = NULL\` 은 **\`true\` 가 아니라 \`NULL\`** 입니다. NULL은 어떤 비교에서도 NULL을 반환하기 때문.
> → \`WHERE 컬럼 = NULL\` 은 절대 매칭되지 않음. **\`IS NULL\` 을 써야 함**.

> 🪤 **함정 2**: \`NULL + 1\`, \`NULL || 'text'\` 같은 표현식도 모두 **NULL**.

> 🪤 **함정 3**: \`AND\` / \`OR\` 의 진리표가 약간 다름:
> - \`true AND NULL\` → NULL
> - \`false AND NULL\` → false
> - \`true OR NULL\` → true
> - \`false OR NULL\` → NULL`,
    },
    {
      type: "code",
      source: `-- 위 함정 직접 확인
SELECT
  NULL = NULL AS 'NULL = NULL',          -- NULL (true 아님!)
  NULL IS NULL AS 'NULL IS NULL',         -- 1 (true)
  NULL + 1 AS 'NULL + 1',                 -- NULL
  NULL || 'x' AS 'NULL || x',             -- NULL
  COALESCE(NULL, 'fallback') AS 'COALESCE'; -- fallback`,
    },
    {
      type: "markdown",
      source: `## 🔍 NULL 검사 — \`IS NULL\` / \`IS NOT NULL\``,
    },
    {
      type: "code",
      source: `-- 회사 정보가 없는 고객
SELECT FirstName, LastName, Company
FROM Customer
WHERE Company IS NULL
LIMIT 10;`,
    },
    {
      type: "code",
      source: `-- 회사 정보가 있는 고객
SELECT FirstName, LastName, Company
FROM Customer
WHERE Company IS NOT NULL
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## 🛡️ \`COALESCE\` — NULL을 다른 값으로 대체

\`COALESCE(a, b, c, ...)\` 는 **인자를 순서대로 보다가 처음으로 NULL이 아닌 값**을 반환.

JavaScript의 \`a ?? b ?? c\` 와 같은 개념.`,
    },
    {
      type: "code",
      source: `SELECT
  FirstName || ' ' || LastName AS 이름,
  Company,
  COALESCE(Company, '(개인 고객)') AS 표시용회사
FROM Customer
LIMIT 15;`,
    },
    {
      type: "markdown",
      source: `> 💡 SQLite는 \`IFNULL(a, b)\` 도 지원 — \`COALESCE(a, b)\` 와 동일.
> \`COALESCE\` 가 표준 SQL이라 더 권장.`,
    },
    {
      type: "markdown",
      source: `## ⚠️ NULL 과 산술/문자열

NULL이 산술이나 문자열 결합에 끼어들면 **결과 전체가 NULL** 이 됩니다.`,
    },
    {
      type: "code",
      source: `-- 위험한 예 — Company가 NULL이면 결과 행 전체가 NULL
SELECT FirstName || ' (' || Company || ')' AS 표시
FROM Customer
LIMIT 10;
-- Company가 NULL인 행은 표시 컬럼 자체가 NULL`,
    },
    {
      type: "code",
      source: `-- 안전한 버전 — COALESCE로 빈 문자열 처리
SELECT FirstName || ' (' || COALESCE(Company, '개인') || ')' AS 표시
FROM Customer
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**Customer** 테이블에서:

- 이메일이 \`'@gmail.com'\` 으로 끝나는 고객만
- \`전체이름\` (FirstName + ' ' + LastName), \`Email\`, \`Country\` 출력
- 처음 10명만`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "WHERE Email LIKE '%@gmail.com'",
        "전체이름은 ||로 결합",
        "LIMIT 10",
      ],
      solution: `SELECT
  FirstName || ' ' || LastName AS 전체이름,
  Email,
  Country
FROM Customer
WHERE Email LIKE '%@gmail.com'
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**Customer** 테이블에서:

- 회사가 NULL인 고객은 \`회사명\` 을 \`'개인 고객'\` 으로 표시
- \`Country\` 가 \`'USA'\` 또는 \`'Canada'\` 인 고객만
- \`팩스번호유무\` 컬럼 추가: Fax 컬럼이 NULL이면 \`'없음'\`, 아니면 \`'있음'\`

\`FirstName\`, \`LastName\`, \`회사명\`, \`Country\`, \`팩스번호유무\` 출력. 처음 15명.`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "회사명: COALESCE(Company, '개인 고객') AS 회사명",
        "Country: WHERE Country IN ('USA', 'Canada')",
        "팩스번호유무: CASE WHEN Fax IS NULL THEN '없음' ELSE '있음' END",
      ],
      solution: `SELECT
  FirstName,
  LastName,
  COALESCE(Company, '개인 고객') AS 회사명,
  Country,
  CASE WHEN Fax IS NULL THEN '없음' ELSE '있음' END AS 팩스번호유무
FROM Customer
WHERE Country IN ('USA', 'Canada')
LIMIT 15;`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 5 완료!

오늘 배운 것:
- ✅ \`LIKE 패턴\` — 부분 일치 검색
- ✅ 와일드카드 \`%\` (0+ 글자), \`_\` (정확히 1글자)
- ✅ \`NOT LIKE\`, SQLite의 LIKE는 ASCII 대소문자 무시
- ✅ NULL의 본질 — \`= NULL\` 은 안 됨, \`IS NULL\` 사용
- ✅ NULL이 산술/문자열에 끼면 결과 NULL — \`COALESCE\` 로 안전 처리
- ✅ AND/OR 의 NULL 진리표 (true OR NULL = true)

**다음 챕터에서는**: 데이터를 모아서 한 줄로 — **집계 함수** (COUNT, SUM, AVG, MIN, MAX).`,
    },
    {
      type: "code",
      source: `-- 자유 실험 영역
`,
    },
  ],
  quiz: {
    title: "챕터 5 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "다음 중 'son' 으로 끝나는 이름을 찾는 LIKE 패턴은?",
        options: ["'son%'", "'%son%'", "'%son'", "'son__'"],
        correctIndex: 2,
        explanation:
          "% 는 0개 이상의 문자. '%son' 은 앞에 뭐가 있든 'son' 으로 끝나는 패턴.",
      },
      {
        type: "predict-output",
        question: "이 표현식의 결과는?",
        code: `SELECT NULL = NULL;`,
        options: ["1 (true)", "0 (false)", "NULL", "에러"],
        correctIndex: 2,
        explanation:
          "NULL은 어떤 비교에서도 NULL을 반환해요 (자기 자신과의 비교도). NULL 검사는 IS NULL 사용.",
      },
      {
        type: "predict-output",
        question: "이 SQL의 결과는?",
        code: `SELECT COALESCE(NULL, NULL, 'x', 'y');`,
        options: ['"x"', '"y"', "NULL", '"x" 와 "y" 둘 다'],
        correctIndex: 0,
        explanation:
          "COALESCE는 인자를 순서대로 보고 첫 번째 비-NULL을 반환. 첫 두 개는 NULL, 세 번째 'x' 가 첫 비-NULL.",
      },
      {
        type: "predict-output",
        question: "이 표현식의 결과는?",
        code: `SELECT 'A' || NULL || 'B';`,
        options: ['"AB"', '"ANULLB"', "NULL", '"A B"'],
        correctIndex: 2,
        explanation:
          "NULL이 문자열 결합에 끼면 결과 전체가 NULL. 안전하려면 COALESCE(NULL, '') 같은 처리 필요.",
      },
    ],
  } satisfies Quiz,
};

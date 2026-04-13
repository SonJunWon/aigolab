import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson01: Lesson = {
  id: "sql-beginner-01",
  language: "sql",
  track: "beginner",
  order: 1,
  title: "SQL 첫걸음 — SELECT와 Chinook",
  subtitle: "데이터를 꺼내는 가장 기본 명령을 배워봅니다",
  estimatedMinutes: 10,
  cells: [
    {
      type: "markdown",
      source: `# 🗄️ SQL 의 세계로

**SQL** (Structured Query Language)은 **데이터베이스에 저장된 데이터를 다루는 표준 언어**입니다.
은행, 쇼핑몰, 게임 등 거의 모든 서비스가 뒤에서 SQL로 데이터를 관리해요.

## 우리가 사용할 데이터베이스 — Chinook

이 트랙에서는 **Chinook** 이라는 가상의 음악 매장 데이터베이스를 씁니다.
실제로 SQL을 배울 때 전 세계적으로 자주 쓰이는 학습용 DB예요.

| 테이블 | 의미 |
|---|---|
| **Artist** | 아티스트 (가수, 밴드) |
| **Album** | 앨범 |
| **Track** | 노래 1곡 |
| **Genre** | 장르 (Rock, Jazz 등) |
| **Customer** | 고객 |
| **Invoice** | 판매 영수증 |
| **InvoiceLine** | 영수증의 각 줄 (어떤 노래가 얼마에) |
| **Employee** | 직원 |
| **Playlist** | 플레이리스트 |

각 테이블은 **행(row)** 과 **컬럼(column)** 으로 이루어져 있어요. 엑셀 시트랑 비슷합니다.`,
    },
    {
      type: "markdown",
      source: `## 📥 SELECT — 데이터를 꺼내는 첫 명령

가장 기본 문법:
\`\`\`sql
SELECT 컬럼들 FROM 테이블;
\`\`\`

\`*\` 은 "모든 컬럼" 이라는 뜻입니다. \`Artist\` 테이블의 모든 데이터를 가져와볼게요.

> 💡 SQL에서는 키워드를 대문자로 적는 게 관례예요 (\`SELECT\`, \`FROM\`). 소문자도 OK지만 가독성을 위해.
> 끝의 세미콜론(\`;\`)은 여러 SQL을 구분할 때 필요해요.`,
    },
    {
      type: "code",
      source: `SELECT * FROM Artist;`,
    },
    {
      type: "markdown",
      source: `결과창에 표가 보이죠? 왼쪽이 \`ArtistId\`, 오른쪽이 \`Name\`.

총 275개 행이 있는데 위에서 100개만 보여집니다 (안전을 위한 표시 제한).`,
    },
    {
      type: "markdown",
      source: `## 🎯 특정 컬럼만 — 컬럼 이름 나열

\`*\` 대신 원하는 컬럼만 적으면 그것만 나옵니다.`,
    },
    {
      type: "code",
      source: `SELECT Name FROM Artist;`,
    },
    {
      type: "markdown",
      source: `여러 컬럼을 보고 싶을 땐 쉼표로:`,
    },
    {
      type: "code",
      source: `SELECT TrackId, Name, Composer FROM Track;`,
    },
    {
      type: "markdown",
      source: `> 💡 컬럼 이름은 **테이블에 정의된 그대로** 적어야 해요. 대소문자도 정확히 (Chinook은 PascalCase: \`TrackId\`, \`Name\`, \`Composer\`).
> 잘못 적으면 \`no such column\` 에러가 납니다.`,
    },
    {
      type: "markdown",
      source: `## 🔍 테이블 구조 확인 — sqlite_schema / PRAGMA

어떤 컬럼이 있는지 확인하고 싶을 땐 SQLite 특수 명령을 씁니다.`,
    },
    {
      type: "code",
      source: `-- Album 테이블의 컬럼 정보
PRAGMA table_info(Album);`,
    },
    {
      type: "markdown",
      source: `각 행이 한 컬럼의 정보:
- \`name\` — 컬럼 이름
- \`type\` — 데이터 타입 (TEXT, INTEGER, NUMERIC 등)
- \`notnull\` — 1이면 필수
- \`pk\` — 1이면 기본 키 (Primary Key)

> 💡 \`--\` 로 시작하는 줄은 **주석** (실행 안 됨). Python의 \`#\` 처럼.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**Genre** (장르) 테이블에서 \`Name\` 컬럼만 골라 가져오세요.

(Chinook에는 25개 장르가 있어요)`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "기본 문법: `SELECT 컬럼 FROM 테이블;`",
        "이번엔 컬럼이 `Name`, 테이블이 `Genre`",
      ],
      solution: `SELECT Name FROM Genre;`,
    },
    {
      type: "markdown",
      source: `## 🪄 별칭 — \`AS\`

컬럼이나 테이블에 임시 이름을 붙일 수 있어요. 결과를 보기 좋게 만들 때 자주 씁니다.`,
    },
    {
      type: "code",
      source: `SELECT
  TrackId AS id,
  Name AS 곡명,
  Milliseconds AS 길이ms
FROM Track;`,
    },
    {
      type: "markdown",
      source: `결과 표의 컬럼 헤더가 \`id\`, \`곡명\`, \`길이ms\` 로 표시됩니다.

> 💡 \`AS\` 는 생략 가능: \`Name 곡명\` 도 동일. 단, 명시하면 더 명확.`,
    },
    {
      type: "markdown",
      source: `## 🧮 계산식도 컬럼이 됨

\`SELECT\` 안에 단순 표현식을 넣으면 계산 결과가 새 컬럼으로 나옵니다.`,
    },
    {
      type: "code",
      source: `-- 곡 길이를 ms → 초로 변환해서 보여주기
SELECT
  Name AS 곡명,
  Milliseconds AS ms,
  Milliseconds / 1000 AS seconds,
  Milliseconds / 60000.0 AS minutes
FROM Track;`,
    },
    {
      type: "markdown",
      source: `> 💡 정수 나누기 주의 — \`/ 60000\` 처럼 정수만 쓰면 결과도 정수로 잘립니다.
> 소수 결과를 원하면 \`60000.0\` 처럼 한쪽을 소수로.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**Track** 테이블에서:
- \`Name\` 을 \`곡명\` 으로
- \`UnitPrice\` 를 \`달러가격\` 으로
- 가격에 1300을 곱한 값을 \`원화추정\` 컬럼으로

세 컬럼을 함께 출력하세요.`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "별칭은 `컬럼 AS 별칭`",
        "곱셈은 `*` 사용. 예: `UnitPrice * 1300 AS 원화추정`",
      ],
      solution: `SELECT
  Name AS 곡명,
  UnitPrice AS 달러가격,
  UnitPrice * 1300 AS 원화추정
FROM Track;`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 1 완료!

오늘 배운 것:
- ✅ \`SELECT * FROM 테이블\` — 모든 데이터 가져오기
- ✅ \`SELECT 컬럼1, 컬럼2 FROM ...\` — 특정 컬럼만
- ✅ \`PRAGMA table_info(테이블)\` — 컬럼 구조 확인
- ✅ \`AS\` — 별칭 (보기 좋은 컬럼 이름)
- ✅ 표현식 (\`*\`, \`/\` 등) 도 \`SELECT\` 안에서 컬럼처럼

**다음 챕터에서는**: \`WHERE\` 로 원하는 행만 골라내는 방법.

자유롭게 다른 테이블도 둘러보세요 — \`SELECT * FROM Customer\`, \`SELECT * FROM Invoice\` 등.`,
    },
    {
      type: "code",
      source: `-- 자유 실험 영역
SELECT * FROM Customer;`,
    },
  ],
  quiz: {
    title: "챕터 1 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "Album 테이블의 모든 컬럼·모든 행을 가져오는 SQL은?",
        options: [
          "GET * FROM Album;",
          "SELECT * FROM Album;",
          "SHOW Album;",
          "SELECT Album;",
        ],
        correctIndex: 1,
        explanation:
          "데이터를 가져올 때는 SELECT를 써요. * 는 '모든 컬럼' 이라는 뜻.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 SQL에서 주석을 표시하는 방법은?",
        options: ["//", "#", "--", "/* */ 만"],
        correctIndex: 2,
        explanation:
          "SQL의 한 줄 주석은 `--`. 여러 줄은 `/* ... */` 도 가능해요.",
      },
      {
        type: "multiple-choice",
        question: "Track 테이블에서 Name 컬럼만 'song' 이라는 별칭으로 가져오려면?",
        options: [
          "SELECT Name = 'song' FROM Track;",
          "SELECT Name AS song FROM Track;",
          "SELECT 'song' AS Name FROM Track;",
          "SELECT Name song WHERE Track;",
        ],
        correctIndex: 1,
        explanation:
          "별칭은 `컬럼 AS 별칭`. SQL이 결과를 보여줄 때 그 별칭으로 표시해줘요.",
      },
      {
        type: "predict-output",
        question: "이 SQL의 결과는 몇 개 행이 나올까요? (Chinook 기준)",
        code: `SELECT Name FROM Genre;`,
        options: ["1", "10", "25", "275"],
        correctIndex: 2,
        explanation:
          "Chinook의 Genre 테이블에는 25개 장르가 있어요. 100행 제한엔 안 걸리니 전부 표시.",
      },
    ],
  } satisfies Quiz,
};

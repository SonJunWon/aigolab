import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson08: Lesson = {
  id: "sql-beginner-08",
  language: "sql",
  track: "beginner",
  order: 8,
  title: "두 테이블 합치기 — JOIN",
  subtitle: "관련된 데이터를 한 결과로 모읍니다",
  estimatedMinutes: 14,
  cells: [
    {
      type: "markdown",
      source: `# 🔗 JOIN

실제 데이터베이스는 테이블 하나에 모든 걸 넣지 않아요. **관련 정보를 여러 테이블로 나눠 저장**하고, 필요할 때 \`JOIN\` 으로 합칩니다.

예: Chinook에서 "이 곡의 앨범 이름이 뭐지?" → \`Track.AlbumId\` 와 \`Album.AlbumId\` 를 매칭.

이번 챕터에서 배울 것:
- \`INNER JOIN\` — 양쪽에 다 있는 것만
- \`LEFT JOIN\` — 왼쪽 전부 + 오른쪽 매칭되면 채움
- 3개 이상의 테이블 연쇄 JOIN
- 별칭으로 테이블 짧게 부르기
- NULL 처리 주의`,
    },
    {
      type: "markdown",
      source: `## 🧩 왜 분리되어 있나?

Chinook의 구조 일부:
\`\`\`
Album                      Artist
─────────                  ─────
AlbumId | Title | ArtistId  ArtistId | Name
\`\`\`

앨범마다 아티스트 이름을 반복 저장하면 중복이 생기고, 아티스트 이름이 바뀌면 여러 행을 수정해야 해요.
그래서 **ID로 연결**하고, 필요할 때만 합칩니다.`,
    },
    {
      type: "markdown",
      source: `## ✅ INNER JOIN — 양쪽에 다 있는 것만

문법:
\`\`\`sql
SELECT 컬럼
FROM A
INNER JOIN B ON A.키 = B.키;
\`\`\``,
    },
    {
      type: "code",
      source: `-- 앨범 + 아티스트 이름
SELECT Album.Title, Artist.Name
FROM Album
INNER JOIN Artist ON Album.ArtistId = Artist.ArtistId
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `컬럼명이 겹칠 수 있어서 **\`테이블.컬럼\`** 으로 명시했어요. 이제 별칭으로 짧게:`,
    },
    {
      type: "code",
      source: `SELECT al.Title AS 앨범, ar.Name AS 아티스트
FROM Album AS al
INNER JOIN Artist AS ar ON al.ArtistId = ar.ArtistId
LIMIT 10;`,
    },
    {
      type: "markdown",
      source: `> 💡 \`AS\` 는 테이블 별칭에서도 생략 가능: \`Album al\`.

> 💡 \`INNER JOIN\` 은 그냥 \`JOIN\` 으로도 써도 기본값이 INNER.`,
    },
    {
      type: "markdown",
      source: `## ⬅️ LEFT JOIN — 왼쪽 전부 유지

\`INNER\` 는 양쪽에 매칭이 있어야 결과에 나와요. 만약 왼쪽의 모든 행을 유지하고 싶으면(매칭 없으면 오른쪽은 NULL):`,
    },
    {
      type: "code",
      source: `-- 모든 아티스트 (앨범 없어도)
SELECT ar.Name AS 아티스트, al.Title AS 앨범
FROM Artist ar
LEFT JOIN Album al ON ar.ArtistId = al.ArtistId
ORDER BY ar.Name
LIMIT 30;`,
    },
    {
      type: "markdown",
      source: `앨범이 없는 아티스트는 \`앨범\` 컬럼이 \`NULL\` 로 나옵니다.`,
    },
    {
      type: "code",
      source: `-- 앨범이 없는 아티스트 찾기 (데이터 검증에 유용)
SELECT ar.Name AS 아티스트없는이
FROM Artist ar
LEFT JOIN Album al ON ar.ArtistId = al.ArtistId
WHERE al.AlbumId IS NULL;`,
    },
    {
      type: "markdown",
      source: `## 🔗 3개 이상 연쇄 JOIN

Chinook의 고전 질문: "**이 곡은 누가 부른 거야?**"

\`Track → Album → Artist\` 체인으로:`,
    },
    {
      type: "code",
      source: `SELECT
  t.Name AS 곡명,
  al.Title AS 앨범,
  ar.Name AS 아티스트
FROM Track t
INNER JOIN Album al ON t.AlbumId = al.AlbumId
INNER JOIN Artist ar ON al.ArtistId = ar.ArtistId
LIMIT 15;`,
    },
    {
      type: "markdown",
      source: `## 📊 JOIN + 집계 조합

JOIN과 \`GROUP BY\` 를 같이 쓰면 강력해져요.`,
    },
    {
      type: "code",
      source: `-- 아티스트별 앨범 수
SELECT ar.Name AS 아티스트, COUNT(al.AlbumId) AS 앨범수
FROM Artist ar
LEFT JOIN Album al ON ar.ArtistId = al.ArtistId
GROUP BY ar.ArtistId, ar.Name
ORDER BY 앨범수 DESC
LIMIT 10;`,
    },
    {
      type: "code",
      source: `-- 장르 이름 + 곡 수 (GenreId를 실제 장르명으로)
SELECT g.Name AS 장르, COUNT(t.TrackId) AS 곡수
FROM Genre g
LEFT JOIN Track t ON g.GenreId = t.GenreId
GROUP BY g.GenreId, g.Name
ORDER BY 곡수 DESC;`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

각 고객의 이름과 담당 직원 이름을 출력하세요.

관계: \`Customer.SupportRepId = Employee.EmployeeId\`

컬럼: \`고객이름\` (FirstName+LastName), \`담당직원\` (직원의 FirstName+LastName), \`Country\`.
처음 20명.`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "Customer c INNER JOIN Employee e ON c.SupportRepId = e.EmployeeId",
        "이름 결합: c.FirstName || ' ' || c.LastName AS 고객이름",
      ],
      solution: `SELECT
  c.FirstName || ' ' || c.LastName AS 고객이름,
  e.FirstName || ' ' || e.LastName AS 담당직원,
  c.Country
FROM Customer c
INNER JOIN Employee e ON c.SupportRepId = e.EmployeeId
LIMIT 20;`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**장르별 평균 곡 길이 (분)** 를 구하세요.

- \`Genre\` 와 \`Track\` 을 JOIN
- 장르별로 GROUP BY
- 평균 길이(분)가 **4분 이상**인 장르만
- 평균 길이 긴 순`,
    },
    {
      type: "code",
      source: `-- 여기에 SQL을 작성하세요
`,
      hints: [
        "FROM Genre g INNER JOIN Track t ON g.GenreId = t.GenreId",
        "GROUP BY g.GenreId, g.Name",
        "HAVING AVG(t.Milliseconds) / 60000.0 >= 4",
      ],
      solution: `SELECT
  g.Name AS 장르,
  COUNT(t.TrackId) AS 곡수,
  ROUND(AVG(t.Milliseconds) / 60000.0, 2) AS 평균길이분
FROM Genre g
INNER JOIN Track t ON g.GenreId = t.GenreId
GROUP BY g.GenreId, g.Name
HAVING AVG(t.Milliseconds) / 60000.0 >= 4
ORDER BY 평균길이분 DESC;`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 8 완료!

오늘 배운 것:
- ✅ \`INNER JOIN ... ON ...\` — 양쪽 매칭만
- ✅ \`LEFT JOIN\` — 왼쪽 전부 유지 (매칭 없으면 NULL)
- ✅ 테이블 별칭 — \`Album al\`, \`Artist ar\`
- ✅ 3개 이상 연쇄 JOIN
- ✅ JOIN + GROUP BY — 관계형 분석의 핵심 조합

**다음 챕터에서는**: 서브쿼리 + 윈도우 함수 맛보기.`,
    },
    { type: "code", source: `-- 자유 실험 영역\n` },
  ],
  quiz: {
    title: "챕터 8 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "양쪽에 매칭이 있는 행만 결과에 나오는 JOIN은?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
        correctIndex: 0,
        explanation:
          "INNER JOIN은 양쪽 매칭만. LEFT는 왼쪽 전부 유지, RIGHT는 오른쪽 전부 유지.",
      },
      {
        type: "multiple-choice",
        question: "Album과 Artist를 합치는 올바른 JOIN 조건은? (관계: Album.ArtistId = Artist.ArtistId)",
        options: [
          "ON Album = Artist",
          "ON Album.ArtistId = Artist.ArtistId",
          "WHERE Album.ArtistId = Artist.ArtistId (JOIN 키워드 없이)",
          "ON Album.Title = Artist.Name",
        ],
        correctIndex: 1,
        explanation:
          "JOIN 조건은 외래 키(FK)와 기본 키(PK)가 같다는 식: `테이블1.키 = 테이블2.키`.",
      },
      {
        type: "multiple-choice",
        question: "Artist 테이블의 모든 아티스트를 결과에 포함하려면 (앨범 없어도)?",
        options: [
          "INNER JOIN Album",
          "LEFT JOIN Album",
          "FULL JOIN Album",
          "CROSS JOIN Album",
        ],
        correctIndex: 1,
        explanation:
          "왼쪽 테이블(Artist)의 모든 행을 유지하려면 LEFT JOIN. 매칭 없으면 Album 컬럼들은 NULL.",
      },
      {
        type: "predict-output",
        question: "다음 중 '앨범이 없는 아티스트' 를 찾는 SQL로 올바른 것은?",
        options: [
          "FROM Artist a INNER JOIN Album al ON a.ArtistId = al.ArtistId WHERE al.AlbumId IS NULL",
          "FROM Artist a LEFT JOIN Album al ON a.ArtistId = al.ArtistId WHERE al.AlbumId IS NULL",
          "FROM Artist a WHERE a.AlbumCount = 0",
          "FROM Album al LEFT JOIN Artist a ON al.ArtistId = a.ArtistId WHERE al.AlbumId IS NULL",
        ],
        correctIndex: 1,
        explanation:
          "LEFT JOIN으로 Artist를 기준으로 합치고, Album 쪽이 NULL인 행 = 매칭되는 Album이 없는 Artist.",
      },
    ],
  } satisfies Quiz,
};

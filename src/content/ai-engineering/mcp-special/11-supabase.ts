import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * MCP 특별강의 11강 (적용편 ⑧) — Supabase 를 AI에 연결해 'DB를 자연어로 조회'.
 * 카탈로그: AI앱개발/AI 엔지니어링 트랙/MCP-특별강의/03-MCP-도구별-적용예시-2차.md (10. Supabase ★)
 * 출처 확인일 2026-06: Supabase 공식 MCP(supabase.com/docs/guides/getting-started/mcp).
 *   엔드포인트 https://mcp.supabase.com/mcp(호스티드, HTTP+DCR) / localhost:54321/mcp(로컬 CLI).
 *   인증 DCR(기본)/PAT(CI)/수동 OAuth. 핵심 파라미터: read_only=true(읽기전용 PG 유저)·
 *   project_ref=<id>(프로젝트 스코핑, 계정도구 비활성)·features=<그룹>(도구그룹 제한).
 *   도구그룹: Database(list_tables·execute_sql·apply_migration…)·Debugging(get_logs·get_advisors)·
 *   Development(generate_typescript_types…)·Edge Functions·Account·Docs(search_docs)·Branching(유료)·Storage(기본off).
 *   ⚠️ 공식 강력 경고: "운영(production) 데이터에 절대 연결 금지 — 개발·테스트 전용". 실제 프롬프트 인젝션
 *   데이터 유출 사고(지원 티켓에 악성 SQL→LLM이 실행) 존재. 완화=read-only+스코핑+features+수동승인+브랜칭.
 * 핵심 교육 포인트(이 프로젝트 보안 교훈 직결): DB는 한 쿼리로 전체 유출 가능 → '운영금지+읽기전용+스코핑'.
 * 대상: 백엔드·데이터 다루는 개발자·바이브코더(이 프로젝트도 Supabase 사용) + 중급2 데이터/모니터링 설계자.
 */
export const lesson11: Lesson = {
  id: "ai-eng-mcp-11-supabase",
  language: "ai-engineering",
  track: "mcp-special",
  order: 11,
  title: "11. [적용] 수파베이스 MCP — DB를 자연어로 (운영 연결 금지!)",
  subtitle: "읽기전용·프로젝트 스코핑이 필수 — DB는 한 쿼리로 전부 샐 수 있다",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 🗄️ MCP 특별강의 · 11강 [적용⑧]. 수파베이스 MCP — DB를 자연어로
### — 강력한 만큼 위험: '운영 금지 · 읽기전용 · 스코핑'이 철칙

⏱️ 20분 · 🧰 수파베이스 계정(개발/테스트 프로젝트) + MCP 지원 AI 앱 · 🧑‍💻 개발자·바이브코더용 적용편

> 🃏 **30초 미리보기**
> 1~3강의 MCP를 **백엔드/DB '수파베이스(Supabase)'** 에 적용해요. AI에게 **"지난주 가입자 추세 뽑아줘"** 라고 하면 DB를 **자연어로 조회**합니다. 그런데 DB는 **한 줄 쿼리로 전체가 샐 수 있는** 가장 민감한 도구 — 그래서 이번 강의는 **공식 철칙 "운영 DB에 절대 연결하지 마라"** 와 **읽기전용·프로젝트 스코핑**을 핵심으로, **실제 데이터 유출 사고**까지 짚습니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 왜 'Supabase + AI'인가 — DB에게 자연어로 묻기

> 🃏 **흔한 고통** 😮‍💨
> "지난주 가입자 몇 명?", "이탈한 유저 특징?" — 답을 알려면 **SQL을 짜서** DB에 물어야 해요. 매번 쿼리 작성·디버깅에 시간이 들죠.

> 🃏 **수파베이스를 AI에 연결하면**
> - 📊 "지난주 일별 가입자 추세" → AI가 **SQL을 만들어 조회**하고 표로 정리
> - 🔎 "users 테이블 구조 알려줘" → \`list_tables\`로 스키마 설명
> - 🐛 "최근 에러 로그·성능 권고" → \`get_logs\`/\`get_advisors\`로 진단
> - 🧩 "타입스크립트 타입 생성" → \`generate_typescript_types\`
> → 데이터 질문을 **자연어로**! (중급2 데이터 분석·모니터링 에이전트의 손발)

> 🃏 **누구에게 유용?**: 백엔드·데이터를 다루는 **개발자·바이브코더**(이 학습 플랫폼도 수파베이스 사용!), 중급2 **데이터/모니터링 에이전트** 설계자.`,
    },
    {
      type: "markdown",
      source: `## 2. 🚨 먼저, 단 하나의 철칙 — 운영 DB에 연결하지 마라

다른 도구보다 **경고를 앞에** 둡니다. 수파베이스 공식 문서가 가장 강하게 말하는 것:

> 🃏 **공식 경고** ⛔
> **"운영(production) 데이터에 MCP를 절대 연결하지 마라. Supabase MCP는 개발·테스트 전용이다."**
> DB는 **한 줄 쿼리로 모든 사용자 데이터가 샐 수 있는** 가장 민감한 표적이에요.

> 🃏 **왜 이렇게 강할까?** 💥
> - 실제로 **프롬프트 인젝션으로 DB 전체가 유출된 사고**가 보고됐어요(아래 §4).
> - 노션 페이지·슬랙 메시지가 새는 것과 **차원이 다른** 피해(전 고객 데이터).
> → 그래서 **개발/테스트/브랜치 DB**에서만, **읽기전용·스코핑**으로. 운영은 ❌.

이 철칙을 깔고, 안전하게 쓰는 법을 배웁니다. 👇`,
    },
    {
      type: "markdown",
      source: `## 3. 무엇을 지원하나 — 도구 그룹(features)

수파베이스는 **공식 MCP 서버**를 운영하고, 도구를 **그룹(features)** 으로 나눠요. (정확한 목록은 계속 바뀌니 **공식 문서 기준**)

> 🃏 **주요 그룹** 🧰
> - **Database**: \`list_tables\` · \`list_extensions\` · \`list_migrations\` · \`execute_sql\`(조회/실행) · \`apply_migration\`(쓰기)
> - **Debugging**: \`get_logs\` · \`get_advisors\`(보안·성능 권고)
> - **Development**: \`get_project_url\` · \`generate_typescript_types\`
> - **Edge Functions**: \`list_edge_functions\` · \`deploy_edge_function\`(쓰기)
> - **Account**: \`list_projects\` · \`create_project\`/\`pause_project\` 등(계정 단위)
> - **Docs**: \`search_docs\` · **Branching**(유료): \`create_branch\`/\`merge_branch\` 등 · **Storage**(기본 off)

| 하고 싶은 일 | 도구 | 비고 |
|---|---|---|
| "테이블 구조 보여줘" | 📖 \`list_tables\` | 읽기 |
| "이 지표 집계해줘" | 📖 \`execute_sql\` | **읽기전용 모드로** |
| "에러·성능 점검" | 📖 \`get_logs\`/\`get_advisors\` | 진단 |
| "스키마 변경" | 🔧 \`apply_migration\` | 쓰기 → 읽기전용에선 차단 |

> 🃏 **포인트**: \`execute_sql\`은 강력해서 **읽기전용 모드면 안전**, 아니면 **무엇이든 실행** 가능. 그래서 **모드·스코프 설정이 곧 안전**이에요(§4).`,
    },
    {
      type: "markdown",
      source: `## 4. 따라하기 — 연결 (read-only·스코핑이 핵심)

> 🃏 **연결 핵심 정보** 🔌 (2026 기준 · 최신은 [수파베이스 MCP 공식 문서](https://supabase.com/docs/guides/getting-started/mcp) 확인)
> - **서버**: \`https://mcp.supabase.com/mcp\`(호스티드) 또는 \`http://localhost:54321/mcp\`(로컬 CLI)
> - **인증**: **DCR(기본, 자동 로그인)** / **PAT**(CI용, Authorization 헤더) / 수동 OAuth 앱

> 🃏 **🔒 안전 설정 3종 — 반드시!** (URL 쿼리 파라미터)
> - **\`read_only=true\`**: 모든 쿼리를 **읽기전용 Postgres 유저**로 → 쓰기·삭제 차단 (**기본으로 켜기 권장**)
> - **\`project_ref=<id>\`**: **특정 프로젝트로 스코핑**(계정 단위 도구 비활성 → 사고 범위 축소)
> - **\`features=database,docs\`**: **필요한 그룹만** 활성(스토리지·계정 등 끄기)
> → 예: "지표 조회만" = \`read_only=true\` + \`project_ref=<개발프로젝트>\` + \`features=database\`

> 🃏 **처음이라면** 🐣
> - **개발/테스트(또는 브랜치) 프로젝트**에 **read_only=true** 로 연결. 운영은 절대 ❌.
> - 막히면 대개 **모드/스코프/플랜**(브랜칭은 유료) 문제 — 확인.

연결 전에도, **읽기 전용 지표 쿼리**를 연습해봐요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "AI에게 직접 물어보기 (읽기 전용 지표 쿼리)",
        prompt:
          "너는 데이터 분석 도우미야. 'users 테이블(컬럼: id, created_at, plan)'에서 '지난 7일 일별 신규 가입자 수'를 구하는 읽기 전용 SQL(SELECT만)을 작성하고, 결과를 어떻게 표로 보여줄지 설명해줘. 데이터를 변경하는 구문(INSERT/UPDATE/DELETE/DROP)은 절대 쓰지 마.",
        note: "AI가 SELECT만 쓰는지(쓰기 구문 배제) 확인! 수파베이스에 read_only=true로 연결하면 이 쿼리가 execute_sql로 안전하게 실행돼요. DB는 읽기전용이 기본 안전선이에요.",
      }),
    },
    {
      type: "markdown",
      source: `## 5. ⚠️ 한계와 대책 — DB라서 특히 무겁다

| 한계 | 무슨 일이 | ✅ 대책 |
|---|---|---|
| **운영 DB 연결 = 대형 사고** | 전 고객 데이터가 한 번에 위험 | **운영 절대 금지** — 개발/테스트/브랜치만 |
| **프롬프트 인젝션(실제 사고!)** | 지원 티켓 등 **사용자 데이터에 악성 SQL**을 심어 LLM이 실행→데이터 유출 | **read_only=true**(피해 한정) · 데이터 속 지시 불신 · **모든 쿼리 수동 승인** |
| **\`execute_sql\`은 만능** | 잘못 쓰면 대량 변경·삭제 | 읽기전용 모드 · \`features\`로 쓰기 그룹 끄기 |
| **서비스키/PAT 노출** | RLS 우회 키가 새면 전체 노출 | 키·PAT는 **환경변수/서버에만**, 스코프 최소 |
| **결과 속 숨은 지시** | 수파베이스가 결과를 보호 문구로 감싸지만 **완벽하지 않음** | **출력을 사람이 검토** 후 다음 행동 |

> 🃏 **현장 팁**: 수파베이스 MCP의 안전은 **"운영 금지 + 읽기전용 + 프로젝트 스코핑 + 수동 승인"** 4중 방어예요. 03강 인젝션 경고가 **실제 데이터 유출**로 일어난 도구라 더 엄격하게.`,
    },
    {
      type: "markdown",
      source: `## 6. 🎬 실전 사례 — "주간 가입자 추세" 안전 조회 한 바퀴

말로만 들으면 막연하죠? **안전하게 지표를 뽑는** 흐름을 따라가 볼게요. (= 중급2 데이터 분석, 읽기전용)

> 🎬 **STEP 1 — 안전 연결**: **개발/스테이징 프로젝트**에 \`read_only=true\` + \`project_ref=<id>\` + \`features=database\` 로 연결. (운영 ❌)

> 🎬 **STEP 2 — 스키마 파악**: \`list_tables\`로 users 테이블 구조 확인.

> 🎬 **STEP 3 — 조회**: "지난 7일 일별 가입자"를 \`execute_sql\`(SELECT)로 조회. 읽기전용이라 **데이터 변경 불가**. (= 03강 "에이전트가 MCP 도구를 소비")

> 🎬 **STEP 4 — 사람 검토**: 결과(표)와 쿼리를 내가 **검토**. 이상하면 쿼리 수정. (수동 승인 습관)

> 🎬 **STEP 5 — 활용**: 추세를 리포트로(필요하면 06 감마·07 슬랙·10 메일과 연결해 발행). 단 **민감 원본은 외부로 안 내보냄**.

> 🃏 **이 시나리오가 보여주는 것** ✨
> - **운영이 아닌 개발/스테이징** + **읽기전용** + **스코핑**이 기본 세팅.
> - DB는 강력하니 **수동 승인**으로 한 단계씩.
> - 데이터 도구는 '편리함'보다 **'안전'이 먼저**.

아래에서 '지표 쿼리 설계'를 직접 연습해봐요. 👇

> 📷 *(이 강의는 추후 실제 연결·조회 스크린샷을 추가할 예정 — 04강 노션처럼 단계별 캡처 보강.)*`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 지표 쿼리 설계하기",
        prompt:
          "'subscriptions 테이블(컬럼: user_id, plan, status, started_at, canceled_at)'에서 '이번 달 구독 취소율'을 구하는 읽기 전용 SQL과, 함께 보면 좋은 보조 지표 2가지(예: 플랜별 취소수)를 제안해줘. 모두 SELECT만. 운영 DB가 아니라 스테이징에서 돌린다고 가정.",
        note: "AI가 SELECT 기반 분석 쿼리를 설계하고 '스테이징/읽기전용' 전제를 지키는지 확인! 취소율 같은 지표를 자연어로 뽑되, 운영이 아닌 곳에서 읽기전용으로 — 이게 데이터 도구의 안전 습관이에요.",
      }),
    },
    {
      type: "markdown",
      source: `## 7. 🌊 MCP 제공 방식은 '계속 바뀐다'

이 강의의 구체 정보(주소·도구·그룹)도 **반년 뒤엔 달라질 수 있어요.** 흐름을 알면 변화에 안 흔들립니다.

> 🃏 **바뀌는 큰 흐름** 📈
> 1) **안전 기능 강화**: read-only·스코핑·features·결과 보호 문구 등 **가드가 계속 추가**
> 2) **전송·인증**: 호스티드 + DCR/OAuth 로 표준화(PAT는 CI 보조)
> 3) **범위**: Database 중심 → 브랜칭·Edge Functions·Storage 등으로 확장(위험도 함께↑)
> 4) **거버넌스**: "운영 금지" 같은 **강한 기본 원칙**이 유지·강조되는 추세

> 🃏 **그래서 원칙** 🧭
> **"구조와 원리는 외우고, 주소·도구·그룹·안전옵션은 그때그때 공식 문서로 확인."**
> (입문 '노후화 교훈' — 특히 보안 옵션은 자주 바뀌니 공식 문서로.)

아래에서 '안전 설정'을 직접 설계하며 마무리해요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 안전 설정 설계하기",
        prompt:
          "나는 수파베이스 MCP로 '대시보드용 지표를 조회하는 에이전트'를 만들 거야. ① 반드시 켜야 할 안전 옵션 3가지(예: read_only, project_ref, features 제한)와 각 이유 ② 운영 DB에 연결하면 안 되는 이유 ③ 사용자 입력 데이터에 숨은 악성 SQL(프롬프트 인젝션)을 막는 방법 1가지를 정리해줘.",
        note: "AI가 'read_only=true / 프로젝트 스코핑 / features=database / 운영 금지 / 데이터 속 지시 불신·수동 승인'을 짚는지 확인! DB 도구는 '안전 설정이 곧 실력'이에요.",
      }),
    },
    {
      type: "markdown",
      source: `## 8. 안전하게 쓰기 — 실무 수칙 🛡️

> 🃏 **운영 금지, 읽기전용, 스코핑**
> 1) **운영 DB 연결 금지** — 개발/테스트/브랜치 프로젝트만
> 2) **\`read_only=true\` 기본** + **\`project_ref\` 스코핑** + **\`features\`로 필요한 그룹만**
> 3) **모든 쿼리 수동 승인**(특히 쓰기), 데이터 속 '지시문' 불신(인젝션)

> 🃏 **키 보안** ⚠️
> 서비스 롤 키·PAT는 **RLS를 우회**할 수 있어요. **환경변수/서버에만** 두고 클라이언트·깃 노출 금지(이 프로젝트 보안 교훈과 직결).`,
    },
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 수파베이스 MCP는 **DB를 자연어로 조회**(\`mcp.supabase.com/mcp\`)하되, **운영 DB 금지 · \`read_only=true\` · \`project_ref\` 스코핑**이 철칙.
> **DB는 한 쿼리로 전부 샐 수 있다.** 실제 인젝션 유출 사고가 있었으니 수동 승인·데이터 속 지시 불신. 키는 환경변수에만.

> 📌 **미션**: ① 개발/테스트 프로젝트에 **read_only=true**로 연결 → ② "테이블 구조 보여줘 / 지난주 지표 뽑아줘"(SELECT) → ③ 위 '한계 대책' 중 하나를 내 상황에 맞게 적어보기. (운영 연결 금지!)

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
    {
      type: "markdown",
      source: `📎 (개발자라면) \`mcp.supabase.com/mcp\`·DCR/PAT, \`read_only\`/\`project_ref\`/\`features\` 파라미터, 도구그룹(Database·Debugging·Development·Edge Functions·Branching·Storage), execute_sql·apply_migration, 결과 보호 래핑의 한계, 서비스키·RLS → **개발자 심화 트랙**.
> ⚠️ 수파베이스·MCP 생태계는 빠르게 바뀜 — **서버 주소·도구·안전 옵션·플랜은 항상 [수파베이스 MCP 공식 문서](https://supabase.com/docs/guides/getting-started/mcp)로 재확인.** (특히 '운영 금지' 원칙 유지 여부.)`,
    },
  ],

  quiz: {
    title: "MCP·11강 [Supabase 적용] — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "수파베이스 MCP의 가장 강한 공식 원칙은?",
        options: [
          "운영(production) DB에 마음껏 연결해도 된다",
          "운영 DB에 절대 연결하지 말 것 — 개발·테스트 전용",
          "DB는 항상 공개해야 한다",
        ],
        correctIndex: 1,
        explanation:
          "공식 문서는 '운영 데이터에 MCP를 절대 연결하지 말고 개발·테스트 전용으로 쓰라'고 강하게 경고해요. DB는 한 쿼리로 전체가 샐 수 있어 피해가 크기 때문입니다.",
      },
      {
        type: "multiple-choice",
        question: "DB 도구를 안전하게 쓰는 핵심 설정 3종은?",
        options: [
          "read_only=true + project_ref 스코핑 + features로 그룹 제한",
          "모든 권한 + 모든 프로젝트 + 모든 그룹",
          "서비스키를 클라이언트에 노출",
        ],
        correctIndex: 0,
        explanation:
          "read_only=true(읽기전용 PG 유저), project_ref(특정 프로젝트로 스코핑), features(필요한 도구 그룹만)로 위험 표면을 좁히는 게 기본 세팅입니다.",
      },
      {
        type: "multiple-choice",
        question: "수파베이스 MCP에서 실제로 보고된 보안 사고 유형은?",
        options: [
          "DB가 너무 빨라서 생긴 문제",
          "사용자 데이터(예: 지원 티켓)에 숨은 악성 SQL을 LLM이 실행해 데이터가 유출된 프롬프트 인젝션",
          "이모지 오류",
        ],
        correctIndex: 1,
        explanation:
          "사용자 제출 콘텐츠에 악성 SQL을 심어 LLM이 실행하게 만든 프롬프트 인젝션으로 데이터가 유출된 사례가 있어요. read-only·수동 승인·데이터 속 지시 불신으로 막아야 합니다.",
      },
      {
        type: "multiple-choice",
        question: "execute_sql을 안전하게 다루려면?",
        options: [
          "항상 쓰기 권한으로 둔다",
          "읽기전용 모드로 두고, 결과를 사람이 검토한 뒤 다음 행동",
          "결과를 그대로 자동 실행한다",
        ],
        correctIndex: 1,
        explanation:
          "execute_sql은 무엇이든 실행할 수 있어 강력합니다. 읽기전용 모드로 쓰기를 막고, 수파베이스가 결과를 보호 문구로 감싸도 완벽하지 않으니 사람이 출력을 검토하세요.",
      },
      {
        type: "multiple-choice",
        question: "서비스 롤 키·PAT를 다루는 올바른 방법은?",
        options: [
          "코드·깃·클라이언트에 넣는다",
          "RLS를 우회할 수 있으므로 환경변수/서버에만 보관하고 스코프 최소화",
          "채팅으로 공유한다",
        ],
        correctIndex: 1,
        explanation:
          "서비스 롤 키는 RLS를 우회할 수 있어 새면 전체 데이터가 노출돼요. 환경변수/서버에만 두고 클라이언트·깃에 노출하지 마세요(이 프로젝트의 보안 교훈과 직결).",
      },
    ],
  } satisfies Quiz,
};

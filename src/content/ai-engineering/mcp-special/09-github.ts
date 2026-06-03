import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * MCP 특별강의 09강 (적용편 ⑥) — GitHub 을 AI에 연결해 '코드·이슈·PR'에 쓰기.
 * 카탈로그: AI앱개발/AI 엔지니어링 트랙/MCP-특별강의/03-MCP-도구별-적용예시-2차.md (6. GitHub)
 * 출처 확인일 2026-06: GitHub 공식 MCP 서버(github.com/github/github-mcp-server, /docs/remote-server).
 *   원격 https://api.githubcopilot.com/mcp/ (HTTP), 인증 OAuth(기본)/PAT, 로컬 Docker(ghcr.io/...).
 *   **툴셋(toolset) 구조**: context/repos/issues/pull_requests/actions/code_security/discussions/git/
 *   projects/secret_protection 등 20+. 기본=context,repos,issues,pull_requests,users. URL에 /readonly
 *   붙이면 읽기 전용, 로컬은 X-MCP-Toolsets 헤더/GITHUB_TOOLSETS·--read-only 플래그로 범위 제어.
 * 핵심 교육 포인트(앞 강의와 차별): '도구가 아주 많을 때 툴셋으로 범위를 좁히는 법'(03강 스코핑 실전판).
 * 대상: 코드를 다루는 개발자·바이브코더·학습자 + 중급1 코드 트윈·중급2 코딩 에이전트(이슈→PR) 설계자.
 */
export const lesson09: Lesson = {
  id: "ai-eng-mcp-09-github",
  language: "ai-engineering",
  track: "mcp-special",
  order: 9,
  title: "09. [적용] 깃허브 MCP — 코드·이슈·PR (툴셋으로 범위 좁히기)",
  subtitle: "이슈→수정 PR까지 — 도구가 많을 때 '툴셋·읽기전용'으로 안전하게",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 🐙 MCP 특별강의 · 09강 [적용⑥]. 깃허브 MCP — 코드·이슈·PR
### — 도구가 많을 때 '툴셋'으로 범위를 좁히는 법

⏱️ 20분 · 🧰 깃허브 계정 + MCP 지원 코드 에디터 · 🧑‍💻 개발자·바이브코더용 실전 적용편

> 🃏 **30초 미리보기**
> 1~3강의 MCP를 **코드 호스팅 '깃허브(GitHub)'** 에 적용해요. AI가 **레포·이슈·PR을 읽고**, **이슈를 보고 수정 PR을 여는** 코딩 에이전트의 손발이 됩니다. 깃허브 MCP의 특징은 **도구가 아주 많다**는 것(20+ 묶음). 그래서 이번 핵심은 **'툴셋(toolset)으로 필요한 것만 켜고, 읽기 전용으로 안전하게 시작하는 법'** — 03강에서 배운 **스코핑의 실전판**입니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 왜 '깃허브 + AI'인가 — 코드가 사는 곳

> 🃏 **흔한 고통** 😮‍💨
> 이슈는 쌓이고, "이 버그 어디서 났지?"는 코드를 뒤져야 알고, PR 설명·리뷰는 매번 손으로. **코드·이슈·히스토리**가 다 깃허브에 있는데 일일이 오가야 하죠.

> 🃏 **깃허브를 AI에 연결하면**
> - 🔎 "이 함수 어디서 쓰여?" → AI가 **레포 코드를 읽어** 답(중급1 '코드 트윈')
> - 🐛 "이 이슈 보고 수정 PR 열어줘" → AI가 이슈를 읽고 **브랜치+수정+PR 초안** 생성(중급2 코딩 에이전트)
> - 📝 "이 PR 설명·체크리스트 써줘" → 변경점을 요약해 **PR 본문** 작성
> - 🔔 "실패한 워크플로(Actions) 로그 요약" → CI 결과 진단
> → '코드가 사는 곳'에서 **읽기·작성·자동화**를 위임! 단 **머지는 사람**이 한다(아래).

> 🃏 **누구에게 유용?**: 개발자·바이브코더, 중급1 **코드 트윈** 소스로 쓰려는 사람, 중급2 **이슈→PR 에이전트**를 설계하는 사람.`,
    },
    {
      type: "markdown",
      source: `## 2. 무엇을 지원하나 — '툴셋(toolset)' 구조

깃허브는 **공식 MCP 서버**를 운영해요. 도구가 워낙 많아 **'툴셋'이라는 묶음**으로 나눠 제공합니다. (정확한 목록·이름은 계속 바뀌니 **공식 문서 기준**)

> 🃏 **대표 툴셋** 🧰 (기본: \`context, repos, issues, pull_requests, users\`)
> - \`context\`: 내 프로필·깃허브 컨텍스트 · \`repos\`: 레포·파일·커밋 · \`issues\`: 이슈 관리
> - \`pull_requests\`: PR 조회·생성·코멘트 · \`actions\`: GitHub Actions(CI) 워크플로
> - \`code_security\`·\`secret_protection\`·\`dependabot\`: 보안 알림 · \`discussions\`·\`gists\`·\`projects\`·\`orgs\` 등 **20+**

> 🃏 **📖 읽기 / 🔧 쓰기**
> - **읽기**: 파일·커밋 히스토리·이슈/PR 조회·워크플로 상태
> - **쓰기**: 파일 생성/수정·브랜치 관리·**이슈/PR 생성·수정·코멘트**

| 하고 싶은 일 | 툴셋 | 비고 |
|---|---|---|
| "코드/파일 읽어줘" | 📖 \`repos\` | 코드 트윈 |
| "이 이슈 분석해" | 📖 \`issues\` | 읽기 |
| "수정 PR 열어줘" | 🔧 \`pull_requests\`+\`repos\` | 쓰기 → 머지는 사람 |
| "CI 왜 실패했어" | 📖 \`actions\` | 워크플로 로그 |

> 🃏 **포인트**: 깃허브 MCP는 **도구가 너무 많아서**, "다 켜기"가 아니라 **필요한 툴셋만 골라 켜는 것**이 핵심이에요. (§3·§4에서 방법)`,
    },
    {
      type: "markdown",
      source: `## 3. 따라하기 — 연결 (원격·툴셋·읽기전용)

> 🃏 **연결 핵심 정보** 🔌 (2026 기준 · 최신은 [깃허브 MCP 공식 저장소](https://github.com/github/github-mcp-server) 확인)
> - **원격 서버(권장)**: \`https://api.githubcopilot.com/mcp/\` — 최신 전송 방식(HTTP)
> - **인증**: **OAuth(기본)** 또는 **PAT(개인 액세스 토큰)**. 호스트 앱이 GitHub App/OAuth App을 설정.
> - **로컬 대안**: Docker \`ghcr.io/github/github-mcp-server\` + \`GITHUB_PERSONAL_ACCESS_TOKEN\`

> 🃏 **🔑 범위 좁히기 — 이게 핵심** 🎯
> - **읽기 전용으로 시작**: 원격은 URL 끝에 **\`/readonly\`**(예: \`.../mcp/x/repos/readonly\`), 로컬은 **\`--read-only\`** 플래그.
> - **툴셋 골라 켜기**: 원격은 **툴셋별 URL을 조합**, 로컬은 **\`X-MCP-Toolsets\` 헤더** 또는 \`GITHUB_TOOLSETS=repos,issues\` 환경변수.
> → "코드만 읽기"면 \`repos\` + \`/readonly\`. **필요 최소만** 켜는 게 안전·간결.

> 🃏 **앱별 연결** 📱
> - **VS Code(1.101+)**: \`mcp.json\` 에 \`{ "type": "http", "url": "https://api.githubcopilot.com/mcp/" }\` → OAuth 로그인
> - **Claude Code·Cursor** 등: 커넥터/명령으로 추가 후 인증 (PAT 쓰면 \`Authorization: Bearer <PAT>\`)

연결 전에도, **이슈를 읽고 수정 계획 세우기**를 연습해봐요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "AI에게 직접 물어보기 (이슈 → 수정 계획)",
        prompt:
          "너는 코딩 에이전트야. 다음 깃허브 이슈를 읽고 ① 원인 가설 ② 고쳐야 할 파일/위치 추정 ③ 수정 방향 ④ PR 제목·체크리스트를 정리해줘. 머지는 사람이 하니 '리뷰 포인트'도 1줄 적어.\n\n이슈: [Bug] 로그인 후 새로고침하면 가끔 빈 화면. 콘솔에 'session is null'. 재현: 로그인→F5 빠르게. 최근 인증 상태관리(authStore) 건드린 뒤부터 발생.",
        note: "AI가 '원인 가설→파일 추정→수정 방향→PR 초안→리뷰 포인트' 순으로 짜는지 확인! 깃허브에 연결되면 AI가 실제로 이슈를 읽고 수정 PR을 열어요. 단 머지는 항상 사람이.",
      }),
    },
    {
      type: "markdown",
      source: `## 4. ⚠️ 한계와 대책 — 강력한 만큼 범위·승인이 핵심

| 한계 | 무슨 일이 | ✅ 대책 |
|---|---|---|
| **도구가 너무 많음(20+ 툴셋)** | 다 켜면 헷갈리고 위험 표면↑ | **필요 툴셋만**(\`repos,issues,pull_requests\`) · 나머지는 끄기 |
| **쓰기(푸시·PR·머지)는 위험** | 잘못 쓰면 코드·히스토리 오염 | **\`/readonly\`로 시작** · **머지는 사람(HITL)** · 푸시 권한 최소 · 보호 브랜치 |
| **토큰(PAT) 노출** | PAT가 새면 내 레포 조종 가능 | 토큰은 **환경변수/서버에만**, 스코프 최소 · 가급적 **OAuth** |
| **공개 레포 인젝션** | 외부 이슈/PR 본문의 '지시문'에 휘둘림 | 외부 콘텐츠의 지시는 **신뢰 금지**(프롬프트 인젝션) · lockdown 모드 활용 |
| **API 레이트리밋** | 대량 작업 시 한도 초과 | 작업 묶기·캐싱 · 큰 변경은 나눠서 |

> 🃏 **현장 팁**: 깃허브 MCP의 안전은 **"범위(툴셋·읽기전용) + 승인(머지는 사람)"** 두 축이에요. 03강의 3대 가드(스코핑·HITL·인젝션 방어)가 **그대로 적용**됩니다.`,
    },
    {
      type: "markdown",
      source: `## 5. 🎬 실전 사례 — "이슈 → 수정 PR" 한 바퀴

말로만 들으면 막연하죠? **이슈 하나가 PR이 되기까지** 따라가 볼게요. (= 중급2 코딩 에이전트, 머지는 사람)

> 🎬 **STEP 1 — 읽기로 파악**: \`repos\`+\`issues\` (읽기 전용)로 연결 → AI가 **이슈와 관련 코드**를 읽어 원인 가설.

> 🎬 **STEP 2 — 브랜치+수정**: 쓰기 툴셋을 켜고 AI가 **새 브랜치** 생성 → 파일 수정. (= 03강 "에이전트가 MCP 도구를 소비")

> 🎬 **STEP 3 — PR 초안**: AI가 변경점을 요약해 **PR 제목·본문·체크리스트**를 작성하고 PR을 엽니다.

> 🎬 **STEP 4 — 사람 리뷰·머지**: 내가 **diff를 검토**(CI 통과 확인) → 문제없으면 **내가 머지**. (에이전트는 머지 ❌)

> 🎬 **사례 ② 코드 트윈 Q&A (읽기)**: \`repos\` 읽기 전용으로 "이 함수 어디서 쓰여?/이 모듈 구조는?"에 **코드 근거로** 답(중급1 코드 트윈).

> 🃏 **이 시나리오가 보여주는 것** ✨
> - **읽기 → 쓰기 → 사람 머지** 순서가 안전선. 에이전트는 **PR까지**, 머지는 사람.
> - 처음엔 **읽기 전용**, 익숙해지면 쓰기 툴셋을 좁게 켠다.
> - 핵심은 **툴셋 범위 + HITL** — 강력한 도구일수록 범위·승인.

아래에서 'PR 설명 작성'을 직접 연습해봐요. 👇

> 📷 *(이 강의는 추후 실제 연결·PR 생성 스크린샷을 추가할 예정 — 04강 노션처럼 단계별 캡처 보강.)*`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — PR 설명 작성하기",
        prompt:
          "아래 변경 내용으로 깃허브 PR 본문을 작성해줘. 구조: ## 요약 / ## 변경사항(불릿) / ## 테스트 방법 / ## 리뷰 포인트 / 체크리스트(- [ ]). 간결하게.\n\n변경: 로그인 후 새로고침 빈 화면 버그 수정. authStore의 INITIAL_SESSION 이벤트에서 세션을 성급히 clear하던 레이스를 제거. 세션 null 가드 추가. 관련 테스트 1개 추가.",
        note: "AI가 '요약/변경/테스트/리뷰포인트/체크리스트' 구조로 PR을 쓰는지 확인! 깃허브에 연결되면 이 본문이 실제 PR로 올라가요. 리뷰어가 빠르게 이해하도록 쓰는 게 핵심.",
      }),
    },
    {
      type: "markdown",
      source: `## 6. 🌊 MCP 제공 방식은 '계속 바뀐다'

이 강의의 구체 정보(주소·툴셋·도구)도 **반년 뒤엔 달라질 수 있어요.** 흐름을 알면 변화에 안 흔들립니다.

> 🃏 **바뀌는 큰 흐름** 📈
> 1) **전송 방식**: 원격 호스티드 \`/mcp/\`(HTTP) + OAuth 로 표준화(PAT는 보조)
> 2) **기능 범위**: 툴셋이 **계속 늘어남**(projects·security 등 추가) → 그래서 **골라 켜기**가 중요
> 3) **범위 제어**: \`/readonly\`·툴셋 URL·OAuth 스코프 필터 등 **세밀해지는 중**
> 4) **지원 앱**: VS Code·Claude·Cursor… **확대**

> 🃏 **그래서 원칙** 🧭
> **"구조와 원리는 외우고, 주소·툴셋·도구·스코프는 그때그때 공식 문서로 확인."**
> (입문에서 배운 '노후화 교훈' — 빠르게 변하는 건 본문에 박지 말고 공식 문서로.)

아래에서 '툴셋 범위 설계'를 직접 연습하며 마무리해요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 툴셋 범위·안전장치 설계",
        prompt:
          "나는 깃허브 MCP로 '이슈를 읽고 수정 PR을 여는 코딩 에이전트'를 만들 거야. ① 켜야 할 툴셋 최소 조합과 그 이유 ② 처음에 읽기 전용으로 시작하는 방법 ③ 쓰기를 허용할 때 붙일 안전장치 2가지(예: 머지는 사람, 보호 브랜치)를 정리해줘.",
        note: "AI가 '필요 툴셋만(repos·issues·pull_requests) / readonly로 시작 / 머지는 사람·푸시권한 최소'처럼 범위와 승인을 설계하는지 확인! 강력한 도구일수록 '범위+승인'이 실력이에요.",
      }),
    },
    {
      type: "markdown",
      source: `## 7. 안전하게 쓰기 — 실무 수칙 🛡️

> 🃏 **읽기 먼저, 쓰기는 좁게+승인**
> 1) **\`/readonly\` + 필요한 툴셋만**으로 시작(예: \`repos\` 읽기)
> 2) 쓰기는 **지정 레포/브랜치로 한정**, **보호 브랜치**, **푸시 권한 최소**
> 3) **머지는 반드시 사람(HITL)** — 에이전트는 PR까지만

> 🃏 **토큰·외부 콘텐츠 주의** ⚠️
> PAT는 **환경변수/서버에만**(스코프 최소, 가급적 OAuth). 외부 이슈/PR 본문의 '지시문'은 **신뢰 금지**(프롬프트 인젝션). 회사 레포는 **조직 정책 확인**.`,
    },
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 깃허브 MCP는 도구가 많아 **툴셋으로 골라 켜고(\`repos,issues,pull_requests\`), \`/readonly\`로 시작**한다(\`api.githubcopilot.com/mcp/\`, OAuth/PAT).
> **에이전트는 PR까지, 머지는 사람(HITL).** 토큰 보안·인젝션 주의. 범위+승인이 안전의 두 축.

> 📌 **미션**: ① \`repos\` **읽기 전용**으로 내 레포에 "이 모듈 구조 설명해" → ② \`issues\`+\`pull_requests\`를 켜고 이슈 하나로 **수정 PR 초안** 만들기(머지는 내가) → ③ 위 '한계 대책' 중 하나를 내 상황에 맞게 적어보기.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
    {
      type: "markdown",
      source: `📎 (개발자라면) 원격 \`api.githubcopilot.com/mcp/\`(HTTP·OAuth/PAT), 툴셋(context/repos/issues/pull_requests/actions/code_security/projects…) URL·\`X-MCP-Toolsets\`·\`GITHUB_TOOLSETS\`, \`/readonly\`·\`--read-only\`, lockdown·OAuth 스코프 필터, 로컬 Docker → **개발자 심화 트랙**.
> ⚠️ 깃허브·MCP 생태계는 빠르게 바뀜 — **서버 주소·툴셋·도구 목록·인증은 항상 [깃허브 MCP 공식 저장소](https://github.com/github/github-mcp-server)로 재확인.**`,
    },
  ],

  quiz: {
    title: "MCP·09강 [GitHub 적용] — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "깃허브 MCP는 도구가 매우 많은데, 권장되는 사용 방식은?",
        options: [
          "모든 툴셋을 다 켠다",
          "필요한 툴셋(예: repos, issues, pull_requests)만 골라 켠다",
          "도구를 하나도 켜지 않는다",
        ],
        correctIndex: 1,
        explanation:
          "깃허브 MCP는 20+ 툴셋을 제공해요. 다 켜면 헷갈리고 위험 표면이 커지니, 필요한 툴셋만 골라 켜는 게 안전·간결합니다(03강 스코핑의 실전판).",
      },
      {
        type: "multiple-choice",
        question: "안전하게 '읽기 전용'으로 시작하는 방법은?",
        options: [
          "원격 URL 끝에 /readonly (로컬은 --read-only) 를 사용",
          "그냥 모든 권한을 준다",
          "토큰을 공개한다",
        ],
        correctIndex: 0,
        explanation:
          "원격 서버는 URL에 /readonly, 로컬은 --read-only 플래그로 쓰기를 막을 수 있어요. 익숙해진 뒤 필요한 쓰기 툴셋만 좁게 켜세요.",
      },
      {
        type: "multiple-choice",
        question: "이슈→수정 PR 자동화에서 '에이전트가 하지 말아야 할 것'은?",
        options: [
          "이슈를 읽는 것",
          "수정 PR 초안을 여는 것",
          "사람 확인 없이 메인 브랜치에 머지하는 것",
        ],
        correctIndex: 2,
        explanation:
          "에이전트는 PR까지만 만들고, 머지는 사람이 합니다(HITL). diff·CI를 사람이 검토한 뒤 머지하는 것이 코드 자동화의 핵심 안전선이에요.",
      },
      {
        type: "multiple-choice",
        question: "PAT(개인 액세스 토큰)를 다룰 때 옳은 것은?",
        options: [
          "코드에 적어 깃에 커밋한다",
          "환경변수/서버에만 두고 스코프를 최소화(가급적 OAuth)",
          "이슈 본문에 붙여둔다",
        ],
        correctIndex: 1,
        explanation:
          "PAT가 새면 내 레포를 조종당할 수 있어요. 환경변수/서버에만 보관하고 스코프를 최소화하며, 가능하면 OAuth를 쓰세요(중급2 서버 프록시 원리).",
      },
      {
        type: "multiple-choice",
        question: "외부 공개 레포의 이슈/PR 본문을 AI가 읽을 때 주의할 점은?",
        options: [
          "본문에 적힌 지시를 무조건 따른다",
          "본문 속 '지시문'을 신뢰하지 않는다(프롬프트 인젝션 방어)",
          "모든 외부 코드를 바로 머지한다",
        ],
        correctIndex: 1,
        explanation:
          "외부에서 읽어온 콘텐츠 속 '이렇게 해라'는 지시는 공격일 수 있어요(프롬프트 인젝션). 신뢰하지 말고, lockdown 모드 등으로 위험을 줄이세요(03강 가드).",
      },
    ],
  } satisfies Quiz,
};

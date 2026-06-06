import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * MCP 특별강의 15강 (적용편 ⑫) — Playwright 를 AI에 연결해 '브라우저 자동화·QA'.
 * 카탈로그: AI앱개발/AI 엔지니어링 트랙/MCP-특별강의/03-MCP-도구별-적용예시-2차.md (14. Playwright)
 * 출처 확인일 2026-06: 공식 Microsoft(github.com/microsoft/playwright-mcp, playwright.dev/docs/getting-started-mcp).
 *   실행 npx @playwright/mcp@latest (로컬 stdio 기본, --port로 SSE/HTTP).
 *   ★핵심 설계: 접근성 트리(accessibility tree) 스냅샷 기반 — 스크린샷/비전 모델 불필요, 스냅샷당 ~200-400토큰,
 *   결정적(요소마다 unique ref). 도구 50+: browser_navigate·browser_click·browser_type·browser_snapshot·
 *   browser_take_screenshot·browser_fill_form·browser_select_option·browser_wait_for·browser_tabs·browser_press_key 등.
 *   플래그: --headless·--isolated·--device·--caps(vision/pdf/devtools/testing)·--allowed-hosts·--blocked-origins.
 *   ⚠️ 보안: "Playwright MCP는 보안 경계가 아님". browser_run_code_unsafe=임의 JS=RCE 등가(매우 위험).
 *   파일 접근 workspace roots 제한(--allow-unrestricted-file-access로 해제=위험). 스테이징/테스트 사이트 한정.
 *   2026 노트: MS가 코딩 에이전트엔 Playwright CLI(@playwright/cli)를 MCP보다 권장(토큰 ~4배 적음).
 * 핵심 교육 포인트: 브라우저 자동화(QA·테스트·웹수집) + 접근성 트리 원리 + 파괴적 흐름 차단/RCE 주의.
 * 대상: QA·테스트·웹 데이터 수집하는 개발자·바이브코더 + 중급2 QA/테스트 에이전트 설계자.
 */
export const lesson15: Lesson = {
  id: "ai-eng-mcp-15-playwright",
  language: "ai-engineering",
  track: "mcp-special",
  order: 15,
  title: "15. [적용] 플레이라이트 MCP — 브라우저 자동화·QA (접근성 트리)",
  subtitle: "AI가 웹페이지를 열고 클릭·입력 — 스테이징 한정·파괴적 흐름 차단",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 🎭 MCP 특별강의 · 15강 [적용⑫]. 플레이라이트 MCP — 브라우저 자동화·QA
### — AI가 직접 웹페이지를 '조작'한다 (접근성 트리 기반)

⏱️ 20분 · 🧰 Node.js + 테스트/스테이징 사이트 + MCP 지원 AI 앱 · 🧑‍💻 QA·테스트하는 개발자·바이브코더용

> 🃏 **30초 미리보기**
> 1~3강의 MCP를 **브라우저 자동화 '플레이라이트(Playwright)'** 에 적용해요. AI가 **실제 브라우저를 열고 클릭·입력·점검**합니다(회원가입 플로우 QA, 웹 데이터 수집). 특별한 점: **스크린샷이 아니라 '접근성 트리(accessibility tree)'** 로 페이지를 읽어 빠르고 정확해요. 다만 **실제 웹을 조작**하니 **스테이징 한정 · 파괴적 흐름 차단 · 위험 도구 주의**가 핵심입니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 왜 'Playwright + AI'인가 — 브라우저를 손발로

> 🃏 **흔한 고통** 😮‍💨
> 배포할 때마다 **회원가입·로그인·결제 플로우**를 손으로 클릭하며 점검, 가격·재고 같은 **웹 데이터**를 일일이 복붙… 반복적인 '브라우저 노동'이죠.

> 🃏 **플레이라이트를 AI에 연결하면**
> - ✅ "회원가입 플로우 점검해" → AI가 **페이지 열고→폼 채우고→클릭→결과 확인**, 실패 단계 리포트
> - 🔁 "이 사이트 흐름 회귀 테스트" → 반복 시나리오 자동 실행
> - 📋 "이 페이지 표 데이터 추출" → 구조화해 정리
> → '브라우저 노동'을 AI에게! (중급2 QA·테스트 에이전트)

> 🃏 **누구에게 유용?**: QA·테스트·웹 데이터를 다루는 **개발자·바이브코더**, 중급2 **QA/테스트 에이전트** 설계자.`,
    },
    {
      type: "markdown",
      source: `## 2. 무엇이 특별한가 — '접근성 트리'로 본다

플레이라이트는 **공식(마이크로소프트) MCP 서버**예요. 가장 큰 특징은 **페이지를 보는 방식**입니다. (정확한 목록은 계속 바뀌니 **공식 문서 기준**)

> 🃏 **🌳 접근성 트리(accessibility tree) 스냅샷** (스크린샷 ❌)
> - 화면 픽셀(스크린샷) 대신, 브라우저가 만드는 **의미 구조**(버튼·링크·제목의 역할·이름·상태)를 텍스트로 읽어요.
> - 장점: **빠르고 저렴**(스냅샷당 ~200~400토큰, 스크린샷은 수천) + **결정적**(요소마다 고유 ref) + 비전 모델 불필요.

> 🃏 **🧰 주요 도구 (50+)**
> - **이동/관찰**: \`browser_navigate\`(URL) · \`browser_snapshot\`(접근성 트리, **주력**) · \`browser_take_screenshot\`(시각 확인용)
> - **조작**: \`browser_click\` · \`browser_type\`(입력) · \`browser_fill_form\`(여러 필드) · \`browser_select_option\` · \`browser_press_key\`
> - **흐름**: \`browser_wait_for\`(텍스트/시간 대기) · \`browser_tabs\`(탭) · drag/drop

| 하고 싶은 일 | 도구 | 비고 |
|---|---|---|
| "이 페이지 열어" | \`browser_navigate\` | 시작 |
| "지금 화면 구조 보여줘" | \`browser_snapshot\` | 트리(주력) |
| "폼 채우고 제출" | \`browser_fill_form\`+\`browser_click\` | 조작 |
| "로딩 기다려" | \`browser_wait_for\` | 동기화 |

> 🃏 **포인트**: 플레이라이트 MCP는 **'보는 법(접근성 트리)'** 덕에 빠르고 정확해요. 그만큼 **실제로 웹을 조작**하니 어디서 쓰느냐(스테이징!)가 중요합니다(§4).`,
    },
    {
      type: "markdown",
      source: `## 3. 따라하기 — 연결 (로컬 실행·스테이징부터)

> 🃏 **연결 핵심 정보** 🔌 (2026 기준 · 최신은 [플레이라이트 MCP 공식](https://github.com/microsoft/playwright-mcp) 확인)
> - **실행**: \`npx @playwright/mcp@latest\` — 로컬 실행(설치 간단). 기본 stdio, \`--port\`로 SSE/HTTP
> - **인증**: 호스티드 OAuth가 아니라 **내 컴퓨터에서 실행**(노션·슬랙과 다름). 로그인은 브라우저 세션으로.

> 🃏 **유용한 플래그** ⚙️
> - \`--headless\`(창 없이) · \`--isolated\`(세션별 깨끗한 프로필) · \`--device\`(모바일 등 에뮬)
> - \`--caps\`(vision/pdf/devtools/testing 추가 기능) · \`--allowed-hosts\`/\`--blocked-origins\`(네트워크 제한)

> 🃏 **처음이라면** 🐣
> - **테스트/스테이징 사이트**에서 시작 — 실제 서비스 ❌. 읽기·관찰(snapshot)부터.
> - \`--isolated\`로 깨끗한 세션, 필요 시 \`--allowed-hosts\`로 **갈 수 있는 사이트 제한**.
> - 막히면 대개 **요소를 못 찾음**(셀렉터) — snapshot의 ref를 참고하게.

연결 전에도, **QA 시나리오 단계**를 설계해봐요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "AI에게 직접 물어보기 (QA 시나리오 설계)",
        prompt:
          "너는 QA 자동화 도우미야. '회원가입 플로우'를 점검할 단계별 시나리오를 짜줘. 각 단계: 행동(이동/입력/클릭/대기) + 기대 결과 + 실패 시 무엇을 캡처할지. 마지막에 '절대 실제 서비스가 아니라 스테이징에서 돌린다'는 전제를 명시해.\n\n플로우: 가입 페이지 이동 → 이메일/비밀번호 입력 → 약관 체크 → 가입 버튼 → 환영 화면 확인.",
        note: "AI가 '행동+기대결과+실패 캡처'로 단계를 짜고 '스테이징 전제'를 다는지 확인! 플레이라이트에 연결되면 browser_navigate·fill_form·click·snapshot으로 이걸 실제로 돌려요. 실서비스 금지가 핵심.",
      }),
    },
    {
      type: "markdown",
      source: `## 4. ⚠️ 한계와 대책 — '실제 웹을 조작'하니 위험도 실제

| 한계 | 무슨 일이 | ✅ 대책 |
|---|---|---|
| **'보안 경계'가 아님** | 공식 문서 명시: Playwright MCP는 보안 경계가 아님 | **MCP 보안 원칙 준수** · 신뢰 사이트만 · 권한 좁게 |
| **\`browser_run_code_unsafe\` = RCE** | 임의 JS 실행 = **원격 코드 실행 등가**(매우 위험) | **쓰지 않기**(필요 없으면 비활성) · 켤 땐 극도로 신중 |
| **파괴적 흐름** | 실제 로그인·결제·삭제를 자동 실행 | **스테이징/테스트 사이트 한정** · 프로덕션 파괴 행동 **차단** |
| **약관·robots** | 무단 크롤링은 약관 위반 | robots·이용약관 **준수**, 허용된 데이터만 |
| **파일 접근** | 해제 시 로컬 파일 광범위 접근 | 기본 **workspace roots 제한 유지**(\`--allow-unrestricted-file-access\` 금지) |
| **외부 페이지 인젝션** | 페이지 텍스트의 '지시문'에 휘둘림 | 페이지 콘텐츠의 지시 **불신**(프롬프트 인젝션) |

> 🃏 **현장 팁**: 플레이라이트의 안전은 **"어디서(스테이징) + 무엇을(파괴적 흐름 차단) + 위험 도구(run_code_unsafe) 끄기"**. 실제 브라우저를 움직이니 **연습장(스테이징)** 에서.`,
    },
    {
      type: "markdown",
      source: `## 5. 🎬 실전 사례 — "회원가입 플로우 자동 점검" 한 바퀴

말로만 들으면 막연하죠? **AI가 가입 플로우를 점검**하는 흐름을 따라가 볼게요. (= 중급2 QA 에이전트, 스테이징 한정)

> 🎬 **STEP 1 — 페이지 열기**: \`browser_navigate\`로 **스테이징** 가입 페이지 이동 → \`browser_snapshot\`으로 구조 파악.

> 🎬 **STEP 2 — 폼 입력**: \`browser_fill_form\`으로 이메일/비밀번호 입력, 약관 체크. (= 03강 "에이전트가 MCP 도구를 소비")

> 🎬 **STEP 3 — 제출·대기**: \`browser_click\`(가입) → \`browser_wait_for\`로 환영 화면 텍스트 대기.

> 🎬 **STEP 4 — 검증**: \`browser_snapshot\`으로 '환영합니다' 노출 확인. 안 보이면 **실패 단계 + 스크린샷** 기록.

> 🎬 **STEP 5 — 리포트**: 단계별 통과/실패 요약(필요하면 09 깃허브 이슈·07 슬랙으로 발행). 버그면 사람에게.

> 🃏 **이 시나리오가 보여주는 것** ✨
> - AI가 **사람처럼 클릭·입력**하되, **스테이징**에서 안전하게.
> - 접근성 트리(snapshot)로 **빠르고 결정적**으로 검증.
> - 발견은 AI, **수정·배포 결정은 사람**(13 센트리·09 깃허브와 같은 분담).

아래에서 '테스트 플로우'를 직접 설계해봐요. 👇

> 📷 *(이 강의는 추후 실제 실행 스크린샷을 추가할 예정 — 04강 노션처럼 단계별 캡처 보강.)*`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 로그인 회귀 테스트 설계",
        prompt:
          "스테이징 사이트의 '로그인' 기능을 자동 회귀 테스트하는 시나리오를 짜줘. ① 정상 케이스 ② 잘못된 비밀번호 ③ 빈 입력 — 각각 행동·기대결과·검증 포인트로. 실제 결제·삭제 같은 파괴적 행동은 절대 넣지 말고, run_code_unsafe 같은 위험 도구도 쓰지 마.",
        note: "AI가 '정상/오류/경계' 케이스를 나누고 파괴적 행동·위험 도구를 배제하는지 확인! 플레이라이트는 browser_fill_form·click·snapshot으로 이걸 실제 검증해요. 안전은 '스테이징+파괴적 흐름 차단'이에요.",
      }),
    },
    {
      type: "markdown",
      source: `## 6. 🌊 MCP 제공 방식은 '계속 바뀐다'

이 강의의 구체 정보(도구·플래그·권장 방식)도 **반년 뒤엔 달라질 수 있어요.** 흐름을 알면 변화에 안 흔들립니다.

> 🃏 **바뀌는 큰 흐름** 📈
> 1) **읽는 방식**: 스크린샷·비전 → **접근성 트리**(빠르고 저렴·결정적)로 정착
> 2) **효율화**: 2026엔 MS가 **코딩 에이전트엔 Playwright CLI(\`@playwright/cli\`)를 MCP보다 권장**(토큰 ~4배 적음) — 용도 따라 도구 선택
> 3) **안전 강화**: \`--allowed-hosts\`·\`--isolated\`·위험 도구 분리 등 **가드 추가**
> 4) **기능 확장**: \`--caps\`로 vision·pdf·devtools 등 선택적 능력

> 🃏 **그래서 원칙** 🧭
> **"구조와 원리는 외우고, 도구·플래그·권장 실행 방식은 그때그때 공식 문서로 확인."**
> (입문 '노후화 교훈' — 'MCP vs CLI 권장'처럼 권장안도 바뀌니 공식 문서로.)

아래에서 '안전 자동화'를 직접 설계하며 마무리해요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 안전 자동화 워크플로 설계",
        prompt:
          "나는 플레이라이트 MCP로 '매 배포마다 핵심 플로우를 자동 점검하는 QA 에이전트'를 만들 거야. ① 반드시 지킬 안전 규칙 3가지(예: 스테이징 한정, 파괴적 행동 차단, run_code_unsafe 금지) ② 갈 수 있는 사이트를 제한하는 방법 ③ 페이지 콘텐츠에 숨은 악성 지시(인젝션)를 막는 방법을 정리해줘.",
        note: "AI가 '스테이징 한정·파괴적 차단·위험도구 금지 / --allowed-hosts로 사이트 제한 / 페이지 지시 불신'을 짚는지 확인! 실제 브라우저를 움직이는 도구라 '어디서·무엇을·위험도구'가 안전의 핵심이에요.",
      }),
    },
    {
      type: "markdown",
      source: `## 7. 안전하게 쓰기 — 실무 수칙 🛡️

> 🃏 **스테이징에서, 파괴적 흐름 차단**
> 1) **테스트/스테이징 사이트 한정** — 실제 서비스의 로그인·결제·삭제 자동 실행 ❌
> 2) **\`browser_run_code_unsafe\`(RCE 등가)는 쓰지 않기** · 위험 도구 비활성
> 3) **\`--allowed-hosts\`로 갈 곳 제한** · \`--isolated\` 깨끗한 세션 · 파일 접근은 기본 제한 유지

> 🃏 **약관·인젝션 주의** ⚠️
> robots·이용약관 **준수**(무단 크롤링 금지). 페이지 콘텐츠의 '지시문'은 **불신**(프롬프트 인젝션). Playwright MCP는 **보안 경계가 아님**을 기억.`,
    },
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 플레이라이트 MCP는 **AI가 브라우저를 열고 클릭·입력**해 QA·웹수집을 한다(\`npx @playwright/mcp@latest\`, **접근성 트리** 기반).
> **실제 웹을 조작하니 스테이징 한정 · 파괴적 흐름 차단 · \`run_code_unsafe\`(RCE) 금지.** 보안 경계가 아님. 발견은 AI, 결정은 사람.

> 📌 **미션**: ① \`npx @playwright/mcp@latest\` 로컬 실행 → ② **스테이징** 가입/로그인 플로우를 navigate·snapshot으로 관찰 → ③ 자동 점검 시나리오를 짜고, 위 '한계 대책' 중 하나를 내 상황에 맞게 적어보기. (실서비스·파괴적 행동 금지!)

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
    {
      type: "markdown",
      source: `📎 (개발자라면) \`npx @playwright/mcp@latest\`(stdio/--port), 접근성 트리 snapshot(ref 기반), 도구(browser_navigate·click·type·fill_form·snapshot·wait_for·tabs…), 플래그(--headless·--isolated·--caps·--allowed-hosts), browser_run_code_unsafe(RCE) 주의, 2026 CLI 권장(@playwright/cli, 토큰 효율) → **개발자 심화 트랙**.
> ⚠️ 플레이라이트·MCP 생태계는 빠르게 바뀜 — **도구·플래그·권장 실행 방식은 항상 [플레이라이트 MCP 공식 문서](https://github.com/microsoft/playwright-mcp)로 재확인.**`,
    },
  ],

  quiz: {
    title: "MCP·15강 [Playwright 적용] — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "플레이라이트 MCP가 페이지를 읽는 주된 방식은?",
        options: [
          "스크린샷을 비전 모델로 분석",
          "접근성 트리(accessibility tree) 스냅샷 — 구조화된 텍스트라 빠르고 결정적",
          "페이지를 통째로 외운다",
        ],
        correctIndex: 1,
        explanation:
          "픽셀(스크린샷) 대신 브라우저의 접근성 트리(역할·이름·상태)를 읽어요. 스냅샷당 토큰이 적고(수백) 요소마다 고유 ref가 있어 결정적입니다.",
      },
      {
        type: "multiple-choice",
        question: "플레이라이트 MCP로 자동화 연습을 시작하기에 안전한 곳은?",
        options: [
          "실제 운영 서비스에서 로그인·결제 자동 실행",
          "테스트/스테이징 사이트에서 관찰·점검부터",
          "남의 사이트를 무단 크롤링",
        ],
        correctIndex: 1,
        explanation:
          "실제 웹을 조작하므로 테스트/스테이징에서 시작하세요. 실제 서비스의 로그인·결제·삭제 같은 파괴적 흐름을 자동 실행하면 안 됩니다.",
      },
      {
        type: "multiple-choice",
        question: "browser_run_code_unsafe 도구를 다룰 때 맞는 태도는?",
        options: [
          "편하니까 항상 켜둔다",
          "임의 JS 실행(RCE 등가)이라 매우 위험 → 쓰지 않거나 극도로 신중히",
          "모든 사이트에서 자동 실행한다",
        ],
        correctIndex: 1,
        explanation:
          "browser_run_code_unsafe는 임의 JavaScript를 실행해 원격 코드 실행(RCE)과 같아요. 필요 없으면 비활성화하고, 켜야 한다면 극도로 신중해야 합니다.",
      },
      {
        type: "multiple-choice",
        question: "갈 수 있는 사이트를 제한해 위험을 줄이는 플래그는?",
        options: [
          "--allowed-hosts (+ --isolated로 깨끗한 세션)",
          "--allow-unrestricted-file-access",
          "--run-everything",
        ],
        correctIndex: 0,
        explanation:
          "--allowed-hosts/--blocked-origins로 네트워크를 제한하고 --isolated로 깨끗한 세션을 쓰세요. 반대로 --allow-unrestricted-file-access는 파일 접근을 넓혀 위험합니다.",
      },
      {
        type: "multiple-choice",
        question: "공식 문서가 강조하는 플레이라이트 MCP의 성격은?",
        options: [
          "그 자체로 완벽한 보안 경계다",
          "보안 경계가 아니므로 MCP 보안 원칙을 따르고 페이지 속 지시는 불신해야 한다",
          "약관을 무시해도 된다",
        ],
        correctIndex: 1,
        explanation:
          "공식 문서는 'Playwright MCP는 보안 경계가 아니다'라고 명시해요. 신뢰 사이트만, 파괴적 흐름 차단, 페이지 콘텐츠의 지시문 불신(인젝션 방어), 약관 준수가 필요합니다.",
      },
    ],
  } satisfies Quiz,
};

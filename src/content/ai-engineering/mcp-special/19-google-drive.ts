import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * MCP 특별강의 19강 (적용편 ⑯) — Google Drive 를 AI에 연결해 '사내 문서 RAG 트윈'.
 * 카탈로그: AI앱개발/AI 엔지니어링 트랙/MCP-특별강의/03-MCP-도구별-적용예시-2차.md (7. Google Drive)
 * 출처 확인일 2026-06: Google 공식 Drive MCP(developers.google.com/workspace/drive/api/guides/configure-mcp-server).
 *   엔드포인트 https://drivemcp.googleapis.com/mcp/v1 (HTTP, 10강 Gmail/Calendar와 같은 Workspace 패밀리).
 *   인증 OAuth 2.0(Cloud Console Web app 클라, redirect claude.ai/api/mcp/auth_callback, 스코프 drive.readonly+drive.file).
 *   플랜: Claude는 Enterprise/Pro/Max/Team. 8도구: search_files·list_recent_files·read_file_content·
 *   get_file_metadata·get_file_permissions·create_file·copy_file·download_file_content. 읽기 중심+쓰기(생성/복제).
 *   사용자 권한·데이터 거버넌스 상속. ⚠️ 간접 프롬프트 인젝션(indirect prompt injection) 경고.
 *   2026: Google Cloud Next '26 Google-managed MCP 50+ GA(Workspace: Gmail·Drive·Calendar).
 * 핵심 교육 포인트: 문서 RAG 트윈 소스(중급1) — 사내 자료 Q&A. 읽기 중심 안전 + 권한 상속/공유범위 + 간접 인젝션.
 * 대상: 사내 문서로 지식 트윈 만들려는 직장인·개발자 + 중급1 트윈 소스 설계자.
 */
export const lesson19: Lesson = {
  id: "ai-eng-mcp-19-google-drive",
  language: "ai-engineering",
  track: "mcp-special",
  order: 19,
  title: "19. [적용] 구글 드라이브 MCP — 사내 문서 트윈 (RAG 소스)",
  subtitle: "회사 자료를 읽어 출처 달아 답하기 — 권한 상속·간접 인젝션 주의",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 🗂️ MCP 특별강의 · 19강 [적용⑯]. 구글 드라이브 MCP — 사내 문서 트윈
### — 흩어진 회사 자료를 'Q&A 가능한 지식'으로

⏱️ 20분 · 🧰 구글 드라이브 + (플랜 필요) MCP 지원 AI 앱 · 🧑‍💼 사내 문서로 트윈 만드는 직장인·개발자용

> 🃏 **30초 미리보기**
> 1~3강의 MCP를 **문서 저장소 '구글 드라이브(Google Drive)'** 에 적용해요. 드라이브의 **회사 자료를 검색·읽어** "우리 규정·기획서 Q&A 봇"(중급1 RAG 트윈)을 만듭니다. 10강(지메일·캘린더)과 **같은 구글 워크스페이스 패밀리**예요. 핵심은 **읽기 중심의 안전한 트윈** + **권한 상속·공유 범위·간접 프롬프트 인젝션** 주의입니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 왜 'Drive + AI'인가 — 흩어진 자료를 깨우기

> 🃏 **흔한 고통** 😮‍💨
> 규정은 이 폴더, 기획서는 저 폴더, 회의록은 또 어딘가… **드라이브 검색은 약하고** 정작 필요한 문서를 못 찾죠. "그 자료 누가 어디 올렸더라?"

> 🃏 **드라이브를 AI에 연결하면**
> - 🔎 "재택근무 규정 어떻게 돼?" → AI가 **드라이브를 검색·읽어** 출처 문서와 함께 답
> - 📚 "이 폴더 자료들로 신입 온보딩 Q&A" → 회사 자료 = **지식 트윈**
> - 🧩 "최근 올라온 기획서 요약" → \`list_recent_files\`+\`read_file_content\`
> - 📄 "정리본을 새 문서로" → \`create_file\`(부수적)
> → 흩어진 회사 자료가 **Q&A 가능한 두 번째 뇌**로! (중급1 RAG 트윈의 대표 소스)

> 🃏 **누구에게 유용?**: 사내 문서가 드라이브에 있는 **직장인·팀**, 중급1 **문서 트윈(사내 위키 Q&A)** 설계자.`,
    },
    {
      type: "markdown",
      source: `## 2. 무엇을 지원하나 — 읽기(주력) · 쓰기

구글은 **공식 드라이브 MCP 서버**를 운영해요(8개 도구). (정확한 목록은 계속 바뀌니 **공식 문서 기준**)

> 🃏 **📖 읽기 (트윈의 핵심)**
> - \`search_files\`(이름·기준 검색) · \`list_recent_files\`(최근 파일) · \`read_file_content\`(내용) · \`download_file_content\`(내보내기)
> - \`get_file_metadata\`(속성) · \`get_file_permissions\`(**공유·접근 범위 확인**)

> 🃏 **🔧 쓰기 (부수적·신중)**
> - \`create_file\`(새 파일) · \`copy_file\`(복제)

| 하고 싶은 일 | 도구 | 비고 |
|---|---|---|
| "○○ 자료 찾아" | 📖 \`search_files\` | 읽기 |
| "이 문서 내용" | 📖 \`read_file_content\` | 읽기 |
| "누가 볼 수 있어?" | 📖 \`get_file_permissions\` | 공유 범위 |
| "정리본 새 문서로" | 🔧 \`create_file\` | 쓰기(부수) |

> 🃏 **포인트**: 드라이브 MCP는 **읽기(검색·읽기)** 가 핵심이라 **트윈 소스로 안전**해요. 그리고 **내가 접근 권한이 있는 문서만** AI도 접근(권한 상속) — \`get_file_permissions\`로 공유 범위를 확인합니다.`,
    },
    {
      type: "markdown",
      source: `## 3. 따라하기 — 연결 (구글 워크스페이스 패밀리)

> 🃏 **연결 핵심 정보** 🔌 (2026 기준 · 최신은 [구글 드라이브 MCP 문서](https://developers.google.com/workspace/drive/api/guides/configure-mcp-server) 확인)
> - **서버 주소**: \`https://drivemcp.googleapis.com/mcp/v1\` (10강 지메일·캘린더와 **같은 패밀리**)
> - **인증**: **OAuth 2.0** — Cloud Console에서 OAuth 클라이언트, 리디렉트 \`https://claude.ai/api/mcp/auth_callback\`, 스코프 \`drive.readonly\`(읽기)+\`drive.file\`
> - **플랜 주의**: Claude.ai/데스크톱은 **Pro·Max·Team·Enterprise 플랜** 필요(10강과 동일)

> 🃏 **처음이라면** 🐣
> - **\`drive.readonly\`(읽기 전용) 스코프부터** — 트윈은 읽기면 충분. 쓰기(\`drive.file\`)는 나중에.
> - **특정 폴더/자료부터** 연결해 "이 폴더에서 ○○ 찾아줘"로 감 잡기.
> - 막히면 대개 **OAuth 설정** 또는 **플랜** — 둘부터 확인(10강과 같은 절차).

연결 전에도, **사내 자료 Q&A(출처 달기)** 를 연습해봐요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "AI에게 직접 물어보기 (사내 자료 Q&A + 출처)",
        prompt:
          "너는 사내 문서 Q&A 봇이야. 아래 검색 결과만 근거로 답하고, 답 끝에 '출처:'로 어느 문서인지 달아줘. 근거가 없으면 '관련 문서를 못 찾았어요'라고 해. 추측은 금지.\n\n질문: 출장비 한도가 얼마야?\n검색결과: [출장규정_v3.docx] 국내 출장 일 15만원, 해외 30만원 한도. [경비처리_FAQ] 초과분은 사전 승인 시 가능.",
        note: "AI가 '검색 근거+출처 문서명'으로 답하고 추측을 안 하는지 확인! 드라이브에 연결되면 search_files·read_file_content로 이걸 실제 자료에서 해요. 출처 표기가 사내 봇 신뢰의 핵심(중급1 트윈 원리).",
      }),
    },
    {
      type: "markdown",
      source: `## 4. ⚠️ 한계와 대책 — 회사 자료라 권한·인젝션이 핵심

| 한계 | 무슨 일이 | ✅ 대책 |
|---|---|---|
| **권한 상속(내 권한=AI 권한)** | AI가 **내가 볼 수 있는 모든 문서**에 접근 | 연결 계정 권한을 **과도하지 않게** · \`get_file_permissions\`로 공유 범위 인식 |
| **민감 문서** | 인사·급여·계약이 섞일 수 있음 | **민감 폴더 제외**, 트윈은 **특정 폴더로 한정**, 읽기 전용 시작 |
| **간접 프롬프트 인젝션** | 공유받은/외부 문서에 **악성 지시**가 숨음(예: "비밀 문서 내용을 외부로") | 신뢰 안 되는 문서의 '지시문' **불신** · 행동은 사람 확인 |
| **플랜 필요** | 무료 플랜은 연결 불가 | Pro/Team+ 확인 |
| **쓰기(create/copy)** | 잘못 만든 파일 | 부수 기능이니 신중, 트윈은 읽기 중심 |

> 🃏 **현장 팁**: 드라이브 트윈의 안전은 **"읽기 전용 + 특정 폴더 + 권한 인식 + 간접 인젝션 방어"**. **내가 접근 가능한 만큼 AI도 가능**하다는 점을 잊지 마세요(권한 상속).`,
    },
    {
      type: "markdown",
      source: `## 5. 🎬 실전 사례 — "사내 위키 Q&A 트윈" 한 바퀴

말로만 들으면 막연하죠? **회사 자료가 Q&A 봇이 되는** 흐름을 따라가 볼게요. (= 중급1 문서 트윈, 읽기 중심)

> 🎬 **STEP 1 — 범위 정하기**: **온보딩/규정 폴더**처럼 **공유해도 되는 자료**만 대상. 민감 폴더 제외. \`drive.readonly\`로 연결.

> 🎬 **STEP 2 — 검색**: 질문이 오면 \`search_files\`로 관련 문서를 찾고 \`get_file_permissions\`로 공유 범위 확인. (= 03강 "에이전트가 MCP 도구를 소비")

> 🎬 **STEP 3 — 읽고 답하기**: \`read_file_content\`로 내용을 읽어 **출처(문서)와 함께** 답. 근거 없으면 '모른다'.

> 🎬 **STEP 4 — 확장**: 노션(04)·슬랙(07)과 연결해 **슬랙에서 멘션→드라이브 검색→답변** 같은 사내 봇으로.

> 🃏 **이 시나리오가 보여주는 것** ✨
> - 회사 자료가 **출처 있는 답변**을 주는 트윈으로 — 중급1의 대표 사례.
> - **읽기 전용 + 특정 폴더** 가 안전의 기본.
> - 외부/공유 문서엔 **간접 인젝션** 위험 → 지시 불신.

아래에서 '트윈 봇'을 직접 설계해봐요. 👇

> 📷 *(이 강의는 추후 실제 연결·검색 스크린샷을 추가할 예정 — 04강 노션처럼 단계별 캡처 보강.)*`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 사내 문서 트윈 봇 설계",
        prompt:
          "나는 구글 드라이브 MCP로 '사내 규정 Q&A 봇'을 만들 거야. ① 어떤 폴더만 대상으로 하고 어떤 폴더는 제외할지(이유 포함) ② 읽기 전용으로 시작하는 이유 ③ 답변에 출처를 다는 규칙 ④ 공유받은 외부 문서에 숨은 악성 지시(간접 인젝션)를 막는 방법을 정리해줘.",
        note: "AI가 '공개 가능 폴더만·민감 제외 / 읽기 전용 / 출처 필수 / 외부 문서 지시 불신'을 짚는지 확인! 사내 문서 트윈은 '읽기 전용+범위 한정+출처+인젝션 방어'가 핵심이에요.",
      }),
    },
    {
      type: "markdown",
      source: `## 6. 🌊 MCP 제공 방식은 '계속 바뀐다'

이 강의의 구체 정보(주소·도구·스코프)도 **반년 뒤엔 달라질 수 있어요.** 흐름을 알면 변화에 안 흔들립니다.

> 🃏 **바뀌는 큰 흐름** 📈
> 1) **공식·관리형 확대**: 구글이 **관리형 MCP 50+** 를 제공(워크스페이스: 지메일·드라이브·캘린더 등) — 통합 엔드포인트
> 2) **읽기 중심 + 거버넌스**: 트윈 소스로 읽기 강조 + **권한·데이터 거버넌스 상속**
> 3) **전송·인증**: 원격 \`googleapis.com/mcp/v1\` + OAuth 표준화(워크스페이스 공통)
> 4) **인젝션 방어 강조**: 신뢰 안 되는 문서 처리 경고가 공식화

> 🃏 **그래서 원칙** 🧭
> **"구조와 원리는 외우고, 주소·도구·스코프·플랜은 그때그때 공식 문서로 확인."**
> (입문 '노후화 교훈' — 빠르게 변하는 건 본문에 박지 말고 공식 문서로.)

아래에서 '안전 트윈'을 직접 설계하며 마무리해요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 권한·인젝션 안전 설계",
        prompt:
          "나는 드라이브 트윈을 회사에 도입하려 해. ① '권한 상속(내 권한=AI 권한)'이 위험할 수 있는 상황 1가지와 대책 ② 민감 문서(인사·계약)를 보호하는 방법 ③ 외부에서 공유받은 문서의 간접 프롬프트 인젝션을 막는 방법, 그리고 회사 도입 전 확인할 것 1가지를 정리해줘.",
        note: "AI가 '광범위 접근 위험→범위 한정 / 민감 폴더 제외 / 외부 문서 지시 불신 / 보안 정책·플랜 확인'을 짚는지 확인! 회사 자료를 외부 AI에 연결하는 일이라 권한·인젝션·정책이 핵심이에요.",
      }),
    },
    {
      type: "markdown",
      source: `## 7. 안전하게 쓰기 — 실무 수칙 🛡️

> 🃏 **읽기 전용·특정 폴더부터**
> 1) **\`drive.readonly\` + 특정 폴더**로 시작(트윈은 읽기면 충분)
> 2) **민감 폴더(인사·급여·계약) 제외**, \`get_file_permissions\`로 공유 범위 인식
> 3) **답변엔 출처(문서)** 표기, 근거 없으면 '모른다'

> 🃏 **권한·인젝션·정책 주의** ⚠️
> **내 접근 권한 = AI 접근 권한**(상속). 공유받은/외부 문서의 '지시문'은 **불신**(간접 인젝션). 회사 자료는 **보안 정책·관리자 승인** 확인(10강과 동일 원칙).`,
    },
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 구글 드라이브 MCP는 **회사 자료를 검색·읽어 'Q&A 트윈'**(중급1)을 만든다(\`drivemcp.googleapis.com/mcp/v1\`, OAuth, 플랜 필요).
> **읽기 전용·특정 폴더·출처 표기** 가 기본. **권한 상속(내 권한=AI 권한)** 과 **간접 프롬프트 인젝션** 주의. 민감 문서 제외.

> 📌 **미션**: ① \`drive.readonly\`로 **공개 가능한 폴더** 연결 → ② "○○ 규정?" 질문에 **출처 달아** 답하기 → ③ 위 '한계 대책' 중 하나(권한/민감/인젝션)를 내 상황에 맞게 적어보기.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
    {
      type: "markdown",
      source: `📎 (개발자라면) \`drivemcp.googleapis.com/mcp/v1\`(OAuth, 스코프 drive.readonly/drive.file), 8도구(search_files·read_file_content·get_file_metadata·get_file_permissions·create_file·copy_file·list_recent_files·download_file_content), 권한·거버넌스 상속, 간접 인젝션 방어, 워크스페이스 패밀리(Gmail·Calendar) → **개발자 심화 트랙**.
> ⚠️ 구글·MCP 생태계는 빠르게 바뀜 — **서버 주소·도구·스코프·플랜은 항상 [구글 드라이브 MCP 문서](https://developers.google.com/workspace/drive/api/guides/configure-mcp-server)로 재확인.**`,
    },
  ],

  quiz: {
    title: "MCP·19강 [Google Drive 적용] — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "구글 드라이브 MCP의 대표 용도는?",
        options: [
          "결제 처리",
          "회사 자료를 검색·읽어 '출처 있는 Q&A 트윈'(중급1 RAG)을 만들기",
          "브라우저 자동화",
        ],
        correctIndex: 1,
        explanation:
          "드라이브 MCP는 search_files·read_file_content 등 읽기가 핵심이라, 사내 문서를 출처와 함께 답하는 지식 트윈(중급1 RAG 소스)으로 쓰기 좋아요.",
      },
      {
        type: "multiple-choice",
        question: "'권한 상속'이 의미하는 것은?",
        options: [
          "AI가 모든 사람의 문서를 본다",
          "내가 접근 권한이 있는 문서만 AI도 접근한다(내 권한=AI 권한)",
          "권한이 사라진다",
        ],
        correctIndex: 1,
        explanation:
          "드라이브 MCP는 연결한 사용자의 권한·거버넌스를 상속해요. 즉 내가 볼 수 있는 문서에 AI도 접근하니, 연결 계정 권한을 과도하지 않게 하고 get_file_permissions로 공유 범위를 확인하세요.",
      },
      {
        type: "multiple-choice",
        question: "사내 문서 트윈을 안전하게 시작하는 방법은?",
        options: [
          "모든 폴더에 쓰기 권한으로 연결",
          "drive.readonly(읽기 전용) + 특정 폴더부터, 민감 폴더 제외",
          "인사·급여 폴더부터 연결",
        ],
        correctIndex: 1,
        explanation:
          "트윈은 읽기면 충분하니 drive.readonly로 특정(공개 가능) 폴더부터 시작하고, 인사·급여·계약 같은 민감 폴더는 제외하세요.",
      },
      {
        type: "multiple-choice",
        question: "공유받은 외부 문서를 AI가 읽을 때의 위험은?",
        options: [
          "문서가 너무 길다",
          "간접 프롬프트 인젝션 — 문서 속에 '비밀을 외부로 보내라' 같은 악성 지시가 숨을 수 있음",
          "이모지가 많다",
        ],
        correctIndex: 1,
        explanation:
          "신뢰할 수 없는 문서에는 악성 지시가 숨을 수 있어요(간접 프롬프트 인젝션). 문서 속 지시문은 신뢰하지 말고, 행동은 사람이 확인하세요(03강 인젝션 방어의 문서판).",
      },
      {
        type: "multiple-choice",
        question: "사내 문서 봇이 신뢰를 얻는 핵심 습관은?",
        options: [
          "답에 출처(문서)를 달고, 근거 없으면 '모른다'고 말하기",
          "항상 그럴듯하게 추측하기",
          "모든 문서를 외부에 복사하기",
        ],
        correctIndex: 0,
        explanation:
          "검색 결과를 근거로 답하고 출처 문서를 표기하면 사용자가 검증할 수 있어요. 근거가 없으면 '모른다'고 말하는 것이 추측보다 신뢰를 줍니다(중급1 트윈 원리).",
      },
    ],
  } satisfies Quiz,
};

import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * MCP 특별강의 10강 (적용편 ⑦) — Gmail + Google Calendar 를 AI에 연결해 '메일·일정 비서'로.
 * 카탈로그: AI앱개발/AI 엔지니어링 트랙/MCP-특별강의/03-MCP-도구별-적용예시-2차.md (8. Gmail+Calendar)
 * 출처 확인일 2026-06(WebSearch): Google Workspace 공식 원격 MCP 서버.
 *   Gmail: https://gmailmcp.googleapis.com/mcp/v1, Calendar: https://calendarmcp.googleapis.com/mcp/v1.
 *   OAuth 2.0(커넥터에 client ID/secret, 리디렉트 https://claude.ai/api/mcp/auth_callback).
 *   Claude.ai/Desktop은 Pro/Max/Team/Enterprise 플랜 필요.
 *   Gmail 도구: create_draft·create_label·get_thread·label_message·label_thread·list_drafts·
 *     list_labels·search_threads·unlabel_message·unlabel_thread (※공식은 '초안' 중심, 직접 send 없음=HITL 내장).
 *   Calendar 도구: create_event·delete_event·get_event·list_calendars·list_events·respond_to_event·
 *     suggest_time·update_event.
 * 핵심 교육 포인트: '비서' 패턴 + Gmail이 초안 중심이라 '보내기는 사람'이 도구 설계에 박혀 있음.
 * 대상: 메일·일정 반복을 줄이려는 직장인 보편 + 중급2 이메일/캘린더 비서 설계자.
 */
export const lesson10: Lesson = {
  id: "ai-eng-mcp-10-gmail-calendar",
  language: "ai-engineering",
  track: "mcp-special",
  order: 10,
  title: "10. [적용] 지메일+캘린더 MCP — 메일·일정 비서 (보내기는 사람)",
  subtitle: "답장 초안·일정 제안까지 — 발신·일정 변경은 모두 사람 승인(HITL)",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 📧 MCP 특별강의 · 10강 [적용⑦]. 지메일+캘린더 MCP — 메일·일정 비서
### — '초안·제안'은 AI, '보내기·확정'은 사람

⏱️ 20분 · 🧰 구글 계정 + (플랜 필요) MCP 지원 AI 앱 · 🧑‍💼 직장인 보편 실전 적용편

> 🃏 **30초 미리보기**
> 1~3강의 MCP를 **'지메일(Gmail) + 구글 캘린더'** 에 적용해요. AI가 메일을 **검색·요약**하고 **답장 초안**을 만들고, 일정을 **읽고 충돌을 피해 제안**합니다. 흥미로운 점: 구글 공식 Gmail MCP는 **'초안(draft) 만들기' 중심**이라 **'보내기'는 사람이** 하도록 설계돼 있어요 — **HITL(사람 승인)이 도구에 내장**된 셈. 메일·일정은 극히 민감하니 이 안전 설계가 핵심입니다.`,
    },
    {
      type: "markdown",
      source: `## 1. 왜 '메일·일정 + AI'인가 — 비서가 필요한 일

> 🃏 **흔한 고통** 😮‍💨
> 받은 메일 정리, 비슷한 답장 반복, "그 메일 어디 갔지?" 검색, 미팅 잡느라 **서로 빈 시간 맞추는 핑퐁**… 매일 같은 일에 시간이 녹죠.

> 🃏 **메일·일정을 AI에 연결하면**
> - 🔎 "지난주 거래처 메일 찾아 요약" → AI가 **스레드 검색·요약**
> - ✍️ "이 메일에 정중히 거절 답장 초안" → AI가 **답장 초안** 작성(보내기는 내가)
> - 📅 "다음 주 김부장님과 1시간 미팅" → AI가 **빈 시간 찾아 후보 제안** → 승인 후 일정 생성·초대
> - 🏷️ "뉴스레터 자동 라벨링" → 라벨로 정리
> → '읽기·초안·제안'은 AI, **'보내기·확정'은 사람**!

> 🃏 **누구에게 유용?**: 메일·일정 반복이 많은 **직장인 누구나**, 중급2의 **이메일·캘린더 비서**를 설계하는 사람.`,
    },
    {
      type: "markdown",
      source: `## 2. 무엇을 지원하나 — 두 서버(Gmail / Calendar)

구글은 **공식 원격 MCP 서버**를 Gmail·캘린더 **각각** 운영해요. (정확한 목록·이름은 계속 바뀌니 **공식 문서 기준**)

> 🃏 **📧 Gmail 도구** (※ '초안 중심' — 안전 설계!)
> - **초안 만들기**: \`create_draft\` (← 직접 '전송'이 아니라 **초안**! 보내기는 사람)
> - **검색·읽기**: \`search_threads\` · \`get_thread\` · \`list_drafts\`
> - **라벨**: \`create_label\` · \`label_message\`/\`label_thread\` · \`unlabel_*\` · \`list_labels\`

> 🃏 **📅 Calendar 도구**
> - **읽기**: \`list_calendars\` · \`list_events\` · \`get_event\`
> - **제안/응답**: \`suggest_time\`(빈 시간 제안) · \`respond_to_event\`(참석 응답)
> - **쓰기**: \`create_event\` · \`update_event\` · \`delete_event\`

| 하고 싶은 일 | 도구 | 비고 |
|---|---|---|
| "그 메일 찾아 요약" | 📧 \`search_threads\`/\`get_thread\` | 읽기 |
| "답장 써줘" | 📧 \`create_draft\` | **초안만 → 사람이 전송** |
| "빈 시간 찾아줘" | 📅 \`suggest_time\` | 충돌 회피 제안 |
| "미팅 잡아줘" | 📅 \`create_event\` | 쓰기 → 승인 후 |

> 🃏 **포인트**: Gmail MCP가 **'전송' 대신 '초안'** 을 주는 건 우연이 아니에요. 메일은 **되돌릴 수 없게 상대에게 가니까**, 도구 차원에서 **사람이 마지막 버튼**을 누르게 한 것 — 03강 HITL이 **설계에 박혀 있는** 모범 사례.`,
    },
    {
      type: "markdown",
      source: `## 3. 따라하기 — 연결 (두 서버·OAuth·플랜 확인)

> 🃏 **연결 핵심 정보** 🔌 (2026 기준 · 최신은 [구글 워크스페이스 MCP 문서](https://developers.google.com/workspace/guides/configure-mcp-servers) 확인)
> - **Gmail 서버**: \`https://gmailmcp.googleapis.com/mcp/v1\`
> - **Calendar 서버**: \`https://calendarmcp.googleapis.com/mcp/v1\` (둘을 **각각** 연결)
> - **인증**: **OAuth 2.0** — 커스텀 커넥터에 **OAuth client ID/secret** 입력, 리디렉트 URI에 \`https://claude.ai/api/mcp/auth_callback\` 추가
> - **플랜 주의**: Claude.ai/데스크톱에서 쓰려면 **Pro·Max·Team·Enterprise 플랜** 필요(무료 플랜 ❌)

> 🃏 **처음이라면** 🐣
> - **Calendar(읽기)부터** 연결해 "내 다음 주 일정 보여줘"로 감 잡기 → 익숙해지면 Gmail.
> - **읽기 스코프 먼저**, 쓰기(초안·일정 생성)는 나중에. 메일은 특히 신중.
> - 막히면 대개 **OAuth 설정(client/redirect)** 또는 **플랜** 문제 — 둘부터 확인.

연결 전에도, **받은 메일 → 답장 초안**을 연습해봐요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "AI에게 직접 물어보기 (메일 → 답장 초안)",
        prompt:
          "다음 받은 메일에 대한 '답장 초안'을 정중하고 간결하게 써줘. 핵심: 제안은 감사, 일정은 조정 요청, 다음 행동 명확히. 보내기 전 내가 검토할 거니 [확인 필요] 부분은 표시해줘.\n\n받은 메일: 안녕하세요, 다음 주 화요일 오후 2시에 신규 협업 건으로 미팅 가능하실까요? 장소는 저희 사무실입니다. 회신 부탁드립니다.",
        note: "AI가 '초안'을 만들고 [확인 필요]를 표시하는지 확인! 지메일에 연결되면 이 결과가 create_draft로 '초안함'에 들어가고, 보내기는 내가 눌러요. 메일은 되돌릴 수 없으니 초안+검토가 기본.",
      }),
    },
    {
      type: "markdown",
      source: `## 4. ⚠️ 한계와 대책 — 메일·일정은 극히 민감

| 한계 | 무슨 일이 | ✅ 대책 |
|---|---|---|
| **발신은 되돌릴 수 없음** | 잘못 보낸 메일·잘못 잡은 일정이 **상대에게 바로 감** | 공식은 **초안 중심** → **보내기·확정은 사람(HITL)** · 일정 변경도 승인 |
| **메일=초민감 데이터** | 개인·기밀이 가득 | **읽기/쓰기 스코프 분리** · 읽기부터 · 민감 라벨 제외 · 회사 정책 확인 |
| **이메일은 인젝션 표적** | 메일 본문에 "이 일정 취소해" 같은 **악성 지시**가 숨을 수 있음 | 메일 속 '지시문'은 **신뢰 금지**(프롬프트 인젝션 방어) · 행동은 사람 확인 |
| **플랜 필요** | 무료 플랜은 연결 불가 | **Pro/Team+ 플랜** 확인 |
| **일정 충돌·오해** | 빈 줄 알았는데 겹침 | \`list_events\`/\`suggest_time\`로 **충돌 확인 후** 제안 |

> 🃏 **현장 팁**: 이 도구의 안전 핵심은 **"AI는 초안·제안까지, 사람이 보내기·확정"**. 구글이 Gmail을 초안 중심으로 만든 이유를 그대로 따르세요.`,
    },
    {
      type: "markdown",
      source: `## 5. 🎬 실전 사례 — "다음 주 미팅 잡기" 한 바퀴

말로만 들으면 막연하죠? **'미팅 잡아줘' 한마디가 일정이 되기까지** 따라가 볼게요. (= 중급2 캘린더 비서, 확정은 사람)

> 🎬 **STEP 1 — 충돌 확인**: \`list_events\`로 내 다음 주 일정을 읽어 **빈 시간 파악**.

> 🎬 **STEP 2 — 시간 제안**: \`suggest_time\`으로 **충돌 없는 후보 2~3개**를 뽑아 내게 제안. (= 03강 "에이전트가 MCP 도구를 소비")

> 🎬 **STEP 3 — 사람 선택·승인**: 내가 후보 중 하나를 **고르고 승인**. (AI가 멋대로 확정 ❌)

> 🎬 **STEP 4 — 생성·초대**: 승인된 시간으로 \`create_event\` → 참석자 초대까지.

> 🎬 **사례 ② 메일 답장 초안**: \`search_threads\`로 메일을 찾아 \`create_draft\`로 답장 초안 → 내가 검토·전송.

> 🃏 **이 시나리오가 보여주는 것** ✨
> - **읽기(충돌 확인) → 제안 → 사람 승인 → 쓰기** 순서가 안전선.
> - **suggest_time** 같은 도구로 똑똑하게, 하지만 **확정은 사람**.
> - 메일·일정처럼 **상대가 있는 행동**은 항상 HITL.

아래에서 '일정 후보 제안'을 직접 연습해봐요. 👇

> 📷 *(이 강의는 추후 실제 연결·일정 생성 스크린샷을 추가할 예정 — 04강 노션처럼 단계별 캡처 보강.)*`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 일정 후보 제안하기",
        prompt:
          "아래 내 다음 주 일정을 보고, '김부장님과 1시간 미팅'을 위한 빈 시간 후보 3개를 제안해줘. 점심시간(12~13시)과 이미 있는 일정은 피하고, 각 후보에 한 줄 이유를 달아줘. 확정은 내가 할게.\n\n일정: 월 10-11시 팀회의, 화 14-16시 외근, 수 종일 휴가, 목 11-12시 1:1, 금 15시 마감.",
        note: "AI가 '충돌을 피해' 후보를 제안하고 확정은 사람에게 넘기는지 확인! 캘린더에 연결되면 list_events로 실제 일정을 읽고 suggest_time으로 제안해요. 확정·초대는 내 승인 후에.",
      }),
    },
    {
      type: "markdown",
      source: `## 6. 🌊 MCP 제공 방식은 '계속 바뀐다'

이 강의의 구체 정보(주소·도구·플랜)도 **반년 뒤엔 달라질 수 있어요.** 흐름을 알면 변화에 안 흔들립니다.

> 🃏 **바뀌는 큰 흐름** 📈
> 1) **공식·원격화**: 구글이 **공식 원격 MCP + OAuth**로 정리(서드파티→공식 이동)
> 2) **안전 설계 내장**: Gmail '초안 중심'처럼 **위험한 행동은 사람을 거치게** 설계되는 경향
> 3) **범위 확장**: Drive·Docs·Sheets·Chat 등 **워크스페이스 전반**으로 확대
> 4) **플랜·거버넌스**: 기업용은 플랜·관리자 정책과 묶임

> 🃏 **그래서 원칙** 🧭
> **"구조와 원리는 외우고, 주소·도구·플랜·스코프는 그때그때 공식 문서로 확인."**
> (입문에서 배운 '노후화 교훈' — 빠르게 변하는 건 본문에 박지 말고 공식 문서로.)

아래에서 '한계 대책'을 직접 설계하며 마무리해요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 한계 대책 세우기",
        prompt:
          "나는 Gmail+캘린더 MCP로 '받은 메일을 분류하고 답장 초안과 미팅 일정을 도와주는 비서 워크플로'를 만들 거야. ① 절대 자동화하면 안 되는 행동 2가지와 그 이유 ② 메일 본문에 숨은 악성 지시(프롬프트 인젝션)를 막는 방법 1가지 ③ 읽기/쓰기 스코프를 나누는 이유를 정리해줘.",
        note: "AI가 '발신·일정확정은 사람 / 메일 속 지시 불신 / 읽기·쓰기 분리'처럼 안전선을 설계하는지 확인! 메일·일정은 상대가 있는 행동이라 'AI는 초안까지, 사람이 확정'이 핵심이에요.",
      }),
    },
    {
      type: "markdown",
      source: `## 7. 안전하게 쓰기 — 실무 수칙 🛡️

> 🃏 **읽기 먼저, 보내기는 사람**
> 1) **캘린더 읽기 → Gmail 읽기**부터, 쓰기(초안·일정)는 익숙해진 뒤
> 2) **발신·일정 확정·삭제는 모두 사람 승인(HITL)** — AI는 초안·제안까지
> 3) **읽기/쓰기 스코프 분리**, 민감 메일·라벨 제외

> 🃏 **인젝션·회사 정책 주의** ⚠️
> 메일 본문의 '지시문'은 **신뢰 금지**(이메일은 인젝션 표적). 회사 계정은 **보안 정책·관리자 승인** 확인. 외부로 나가는 발신은 발행 행위.`,
    },
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 지메일+캘린더 MCP는 **메일 검색·답장 초안 + 일정 읽기·제안**을 한다(두 서버, OAuth, 플랜 필요).
> **AI는 초안·제안까지, 보내기·확정은 사람(HITL).** Gmail이 '초안 중심'인 이유를 따르라. 메일 속 지시는 불신.

> 📌 **미션**: ① 캘린더를 읽기로 연결해 "다음 주 빈 시간 알려줘" → ② 메일 하나에 **답장 초안**을 만들어 **내가 검토 후 전송** → ③ 위 '한계 대책' 중 하나를 내 상황에 맞게 적어보기.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
    {
      type: "markdown",
      source: `📎 (개발자라면) 두 원격 서버(gmailmcp/calendarmcp .googleapis.com/mcp/v1)·OAuth(client/redirect), Gmail 도구(create_draft·search_threads·label_* …)·Calendar 도구(suggest_time·create_event …), 읽기/쓰기 스코프 분리, 인젝션 방어 → **개발자 심화 트랙**.
> ⚠️ 구글·MCP 생태계는 빠르게 바뀜 — **서버 주소·도구 목록·인증·플랜은 항상 [구글 워크스페이스 MCP 문서](https://developers.google.com/workspace/guides/configure-mcp-servers)로 재확인.**`,
    },
  ],

  quiz: {
    title: "MCP·10강 [Gmail+Calendar 적용] — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "구글 공식 Gmail MCP가 '직접 전송' 대신 'create_draft(초안)'를 주는 이유는?",
        options: [
          "초안이 더 빨라서",
          "메일은 되돌릴 수 없게 상대에게 가므로, 보내기 버튼은 사람이 누르게(HITL) 설계",
          "전송 기능이 불가능해서",
        ],
        correctIndex: 1,
        explanation:
          "메일 발신은 되돌릴 수 없어요. 그래서 공식 Gmail MCP는 초안까지만 만들고 '보내기'는 사람이 하도록 설계했습니다 — HITL이 도구 차원에 박혀 있는 모범 사례예요.",
      },
      {
        type: "multiple-choice",
        question: "'다음 주 미팅 잡아줘'를 안전하게 처리하는 순서는?",
        options: [
          "AI가 곧바로 아무 시간에 일정을 만든다",
          "일정 읽기(충돌 확인)→suggest_time 제안→사람 선택·승인→create_event",
          "메일로만 처리한다",
        ],
        correctIndex: 1,
        explanation:
          "list_events로 충돌을 확인하고 suggest_time으로 후보를 제안한 뒤, 사람이 고르고 승인하면 create_event로 생성·초대합니다. 확정은 항상 사람이에요.",
      },
      {
        type: "multiple-choice",
        question: "이메일을 AI로 다룰 때 특히 조심할 보안 위협은?",
        options: [
          "메일이 너무 짧은 것",
          "메일 본문에 숨은 악성 지시(프롬프트 인젝션) — 본문의 '지시문'을 신뢰하면 위험",
          "이모지가 많은 것",
        ],
        correctIndex: 1,
        explanation:
          "이메일은 프롬프트 인젝션의 표적이에요. 본문에 '이 일정 취소해' 같은 지시가 숨을 수 있으니, 외부 콘텐츠의 지시는 신뢰하지 말고 행동은 사람이 확인하세요.",
      },
      {
        type: "multiple-choice",
        question: "메일·일정 비서를 연결할 때 권장되는 시작 방식은?",
        options: [
          "처음부터 모든 발신·삭제 권한을 준다",
          "읽기 스코프부터(캘린더 읽기→Gmail 읽기), 쓰기는 나중에 + 읽기/쓰기 분리",
          "민감 메일부터 자동 전송한다",
        ],
        correctIndex: 1,
        explanation:
          "메일·일정은 극히 민감해요. 읽기 스코프로 시작해 감을 잡고, 쓰기(초안·일정 생성)는 익숙해진 뒤 분리된 스코프로 신중히 켜세요.",
      },
      {
        type: "multiple-choice",
        question: "지메일·캘린더 MCP 연결의 사전 조건으로 맞는 것은?",
        options: [
          "무료 플랜으로 무엇이든 된다",
          "OAuth 설정(client/redirect) + 일부 클라이언트는 유료 플랜(Pro/Team 등) 필요",
          "토큰을 메일로 받는다",
        ],
        correctIndex: 1,
        explanation:
          "커스텀 커넥터에 OAuth client ID/secret과 리디렉트 URI를 설정해야 하고, Claude.ai/데스크톱 등에서는 Pro·Max·Team·Enterprise 플랜이 필요합니다.",
      },
    ],
  } satisfies Quiz,
};

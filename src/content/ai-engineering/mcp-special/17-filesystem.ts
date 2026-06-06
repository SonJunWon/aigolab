import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * MCP 특별강의 17강 (적용편 ⑭) — Filesystem 을 AI에 연결해 '로컬 파일·첫 MCP 실습'.
 * 카탈로그: AI앱개발/AI 엔지니어링 트랙/MCP-특별강의/03-MCP-도구별-적용예시-2차.md (15. Filesystem)
 * 출처 확인일 2026-06: MCP 공식 레퍼런스 서버(github.com/modelcontextprotocol/servers/src/filesystem).
 *   실행 npx -y @modelcontextprotocol/server-filesystem /허용/경로1 /허용/경로2 (허용 디렉터리를 인자로).
 *   ★핵심: 모든 작업을 '허용 디렉터리'로 제한 + Roots 프로토콜(권장, roots/list_changed로 런타임 갱신, 서버측
 *   allowed를 완전 대체). 심볼릭 링크 해석으로 traversal 방지(defense-in-depth). 최소 1개 허용 디렉터리 필요.
 *   도구 읽기: read_text_file(head/tail)·read_media_file·read_multiple_files·list_directory·
 *     list_directory_with_sizes·directory_tree·search_files(glob)·get_file_info·list_allowed_directories.
 *   쓰기: write_file(덮어쓰기 신중)·create_directory·edit_file(선택 편집+dry-run 미리보기)·move_file.
 * 핵심 교육 포인트: MCP를 만든 곳의 '공식 레퍼런스'=MCP 원형·첫 실습 최적 + '경로 스코핑'이 모든 안전의 기본형
 *   (09 깃허브 툴셋·11 수파베이스 스코핑의 가장 단순한 뿌리). 16 옵시디언 Filesystem 캠프와 연결.
 * 대상: MCP를 처음 실습하려는 누구나 + 로컬 문서/메모를 트윈으로(중급1) 만들려는 사람.
 */
export const lesson17: Lesson = {
  id: "ai-eng-mcp-17-filesystem",
  language: "ai-engineering",
  track: "mcp-special",
  order: 17,
  title: "17. [적용] 파일시스템 MCP — 로컬 파일·첫 MCP 실습 (경로 스코핑)",
  subtitle: "MCP를 만든 곳의 공식 레퍼런스 — 허용 디렉터리 제한이 모든 안전의 기본",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 📂 MCP 특별강의 · 17강 [적용⑭]. 파일시스템 MCP — 로컬 파일·첫 실습
### — MCP의 '원형'으로 배우는 경로 스코핑

⏱️ 20분 · 🧰 Node.js + 연습용 폴더 + MCP 지원 AI 앱 · 🧑‍💻 MCP 첫 실습하려는 누구나

> 🃏 **30초 미리보기**
> 1~3강의 MCP를 **'로컬 파일(Filesystem)'** 에 적용해요. 이건 **MCP를 만든 곳(modelcontextprotocol)의 공식 레퍼런스 서버** — 가장 단순해서 **MCP 첫 실습에 딱**이에요(설치·키 없이 \`npx\` 한 줄). 내 폴더의 파일을 AI가 **읽고·검색하고·정리**합니다. 핵심 교훈은 **'허용 디렉터리(경로) 제한'** — 앞서 나온 모든 스코핑(09 깃허브 툴셋·11 수파베이스)의 **가장 기본 뿌리**예요.`,
    },
    {
      type: "markdown",
      source: `## 1. 왜 'Filesystem + AI'인가 — 내 폴더를 AI에게

> 🃏 **흔한 고통** 😮‍💨
> 폴더 어딘가에 적어둔 메모·기록·문서를 **찾질 못해요.** "그 내용 어느 파일이었지?", "이 폴더 정리 좀…" — 로컬 파일은 검색이 약하죠.

> 🃏 **로컬 파일을 AI에 연결하면**
> - 🔎 "이 폴더에서 '환불 정책' 적힌 파일 찾아" → \`search_files\`+\`read_text_file\`로 검색·답변
> - 🌳 "이 폴더 구조 보여줘" → \`directory_tree\`
> - 📝 "이 메모들 요약해서 정리 파일로" → 읽고 정리(쓰기는 별도 폴더)
> - 🧩 "여러 회의록 한 번에 읽어 비교" → \`read_multiple_files\`
> → 내 로컬 파일이 **검색·정리 가능한 지식**으로! (중급1 '로컬 문서 트윈')

> 🃏 **누구에게 유용?**: **MCP를 처음 써보는 누구나**(가장 쉬운 실습), 로컬 메모/문서를 트윈으로 만들려는 사람.`,
    },
    {
      type: "markdown",
      source: `## 2. 무엇이 특별한가 — MCP의 '공식 레퍼런스'

이 서버는 **MCP를 만든 곳(modelcontextprotocol)의 공식 레퍼런스**예요. (정확한 목록은 계속 바뀌니 **공식 문서 기준**)

> 🃏 **왜 첫 실습에 좋은가** 🐣
> - **가장 단순**: 클라우드·OAuth·API 키 없이 **\`npx\` 한 줄**로 내 컴퓨터에서 실행.
> - **MCP 원형**: "서버가 도구를 노출 → 클라(AI)가 소비"라는 **1~3강 개념을 눈으로** 확인.
> - **스코핑의 교과서**: '허용 디렉터리'로 범위를 좁히는 법 = 모든 MCP 안전의 **기본형**.

> 🃏 **🔒 핵심 = 허용 디렉터리(경로) 제한**
> - 실행할 때 **접근 가능한 폴더만 지정** → 그 밖은 **건드릴 수 없음**.
> - 서버가 **심볼릭 링크까지 해석**해 상위 폴더로 빠져나가는 공격(traversal)을 막아요.
> - 즉, **'어디까지 보여줄지'를 내가 정하는 것**이 이 도구의 전부.`,
    },
    {
      type: "markdown",
      source: `## 3. 무엇을 지원하나 — 읽기 · 쓰기

> 🃏 **📖 읽기 (안전)**
> - \`read_text_file\`(head/tail 부분 읽기) · \`read_multiple_files\` · \`read_media_file\`(이미지/오디오)
> - \`list_directory\`/\`list_directory_with_sizes\` · \`directory_tree\`(구조) · \`search_files\`(glob 검색)
> - \`get_file_info\`(메타) · \`list_allowed_directories\`(허용 범위 확인)

> 🃏 **🔧 쓰기 (신중)**
> - \`write_file\`(생성/**덮어쓰기** — 주의) · \`create_directory\` · \`move_file\`(이동/이름변경)
> - \`edit_file\`: **선택 편집 + dry-run(미리보기)** — 적용 전에 바뀔 내용 확인!

| 하고 싶은 일 | 도구 | 비고 |
|---|---|---|
| "○○ 적힌 파일 찾아" | 📖 \`search_files\` | glob 검색 |
| "이 파일 읽어" | 📖 \`read_text_file\` | 부분 읽기 가능 |
| "폴더 구조" | 📖 \`directory_tree\` | 구조 파악 |
| "이 줄만 고쳐" | 🔧 \`edit_file\` | dry-run 먼저! |

> 🃏 **포인트**: 읽기는 자유롭게, **쓰기는 \`edit_file\`의 dry-run으로 미리 확인**하고, **\`write_file\`(덮어쓰기)** 는 특히 신중. 가장 단순하지만 **쓰기는 실제 파일을 바꿉니다.**`,
    },
    {
      type: "markdown",
      source: `## 4. 따라하기 — 연결 (허용 경로를 좁게)

> 🃏 **연결 핵심 정보** 🔌 (2026 기준 · 최신은 [MCP 파일시스템 공식 저장소](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) 확인)
> - **실행**: \`npx -y @modelcontextprotocol/server-filesystem /허용/경로1 /허용/경로2\` — **허용 디렉터리를 인자로**
> - **설정 파일**: \`.mcp.json\`의 \`args\`에 허용 경로 나열
> - **Roots 프로토콜(권장)**: 지원 클라는 **런타임에 허용 폴더 변경**(roots/list_changed) — 재시작 불필요, Roots가 주어지면 서버측 허용 목록을 **완전히 대체**

> 🃏 **처음이라면** 🐣
> - **작은 연습 폴더 하나만** 허용해 시작(예: \`~/notes\`). **홈 전체·시스템 폴더 ❌**.
> - **읽기부터**(search·read), 익숙해지면 쓰기는 **별도 출력 폴더**로.
> - \`list_allowed_directories\`로 **내가 뭘 열어줬는지** 항상 확인.

연결 전에도, **로컬 RAG 시나리오**를 설계해봐요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "AI에게 직접 물어보기 (로컬 메모 RAG)",
        prompt:
          "너는 내 로컬 메모 폴더를 읽는 도우미야. 아래 검색 결과만 근거로 질문에 답하고, 어느 파일에서 왔는지 파일명을 달아줘. 근거 없으면 '관련 메모를 못 찾았어요'.\n\n질문: 내가 적어둔 'MCP 첫 실습으로 뭐가 좋다'고 했지?\n검색결과: [mcp-notes.md] 첫 실습은 Filesystem 서버가 단순해서 좋음. [safety.md] 허용 디렉터리를 좁게 지정하는 게 핵심.",
        note: "AI가 '검색 근거+파일명 출처'로 답하는지 확인! 파일시스템에 연결하면 search_files·read_text_file로 이걸 실제 폴더에서 해줘요. 출처(파일명) 표기는 신뢰의 기본이에요.",
      }),
    },
    {
      type: "markdown",
      source: `## 5. ⚠️ 한계와 대책 — '경로'가 곧 안전

| 한계 | 무슨 일이 | ✅ 대책 |
|---|---|---|
| **허용 경로 = 노출 범위 전부** | 넓게 열면 AI가 그만큼 다 봄 | **연습 폴더 하나만** 허용 · **홈 전체/시스템 폴더 절대 ❌** |
| **쓰기(write/edit/move)는 실제 변경** | \`write_file\`은 **덮어쓰기**, move/삭제성 변경 위험 | \`edit_file\` **dry-run으로 미리보기** · 쓰기는 **별도 출력 폴더** · 백업 |
| **민감 파일 노출** | 허용 폴더에 키·비밀번호 파일이 섞이면 위험 | 민감 파일 **제외된 폴더**만 허용 |
| **traversal 공격** | 심링크로 상위 폴더 탈출 시도 | 서버가 **심링크 해석·경계 검증**(하지만 **허용 범위 자체를 좁게**) |
| **파일 속 인젝션** | 파일 내용의 '지시문'에 휘둘림 | 콘텐츠의 지시 **불신**(프롬프트 인젝션) |

> 🃏 **현장 팁**: 파일시스템 MCP의 안전은 **거의 전부 '허용 디렉터리를 좁게'** 예요. 이게 **09 깃허브 툴셋·11 수파베이스 스코핑·15 플레이라이트 allowed-hosts** 와 **같은 원리**의 가장 단순한 형태입니다.`,
    },
    {
      type: "markdown",
      source: `## 6. 🎬 실전 사례 — "내 메모 폴더 로컬 RAG" 한 바퀴

말로만 들으면 막연하죠? **로컬 폴더가 검색 가능한 지식이 되는** 흐름을 따라가 볼게요. (= 중급1 로컬 문서 트윈)

> 🎬 **STEP 1 — 좁게 허용**: \`npx ... server-filesystem ~/notes\` 로 **메모 폴더 하나만** 허용. \`list_allowed_directories\`로 확인.

> 🎬 **STEP 2 — 구조 파악**: \`directory_tree\`로 폴더 구조, \`search_files\`로 키워드 검색.

> 🎬 **STEP 3 — 읽고 답하기**: \`read_text_file\`로 관련 메모를 읽어 **출처(파일명)와 함께 답**. (= 03강 "에이전트가 MCP 도구를 소비")

> 🎬 **STEP 4 — 정리본 쓰기(신중)**: "요약을 \`summary.md\`로" → \`edit_file\` **dry-run으로 확인** 후 **별도 출력 폴더**에 저장.

> 🃏 **이 시나리오가 보여주는 것** ✨
> - **읽기(로컬 RAG)** 는 자유롭게, **쓰기는 별도 폴더 + dry-run**.
> - **허용 폴더를 좁게** = 사고 범위를 작게.
> - 가장 단순한 MCP로 **개념(노출→소비)을 직접 체험**.

아래에서 '허용 경로 설계'를 직접 해봐요. 👇

> 📷 *(이 강의는 추후 실제 실행 스크린샷을 추가할 예정 — 04강 노션처럼 단계별 캡처 보강.)*`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 허용 경로·쓰기 폴더 설계",
        prompt:
          "나는 파일시스템 MCP로 '연구 메모 폴더를 읽어 요약하는 워크플로'를 만들 거야. ① 어떤 폴더만 허용하고 어떤 폴더는 절대 열지 말지(이유 포함) ② 읽기 폴더와 쓰기(출력) 폴더를 나누는 이유 ③ edit_file을 안전하게 쓰는 방법(dry-run 등) ④ 허용 폴더에 민감 파일이 있을 때 대처를 정리해줘.",
        note: "AI가 '연구 폴더만 허용·홈/시스템 제외 / 읽기·쓰기 폴더 분리 / dry-run 미리보기 / 민감 파일 분리'를 짚는지 확인! 파일시스템 안전은 '허용 경로를 좁게'가 거의 전부예요.",
      }),
    },
    {
      type: "markdown",
      source: `## 7. 🌊 MCP 제공 방식은 '계속 바뀐다'

이 강의의 구체 정보(도구·실행법)도 **반년 뒤엔 달라질 수 있어요.** 흐름을 알면 변화에 안 흔들립니다.

> 🃏 **바뀌는 큰 흐름** 📈
> 1) **경로 제어 진화**: 명령줄 인자 → **Roots 프로토콜**(런타임에 허용 폴더 갱신)로 더 유연·안전하게
> 2) **레퍼런스의 역할**: 공식 레퍼런스 서버는 **MCP 표준을 보여주는 본보기** — 새 기능이 여기서 먼저
> 3) **스코핑은 불변 원리**: 도구는 바뀌어도 **'허용 범위를 좁게'** 는 항상 통한다
> 4) **로컬 우선**: 키·클라우드 없이 내 컴퓨터에서 — 첫 실습·프라이버시에 강함

> 🃏 **그래서 원칙** 🧭
> **"구조와 원리(특히 경로 스코핑)는 외우고, 도구·실행법은 그때그때 공식 문서로 확인."**
> (입문 '노후화 교훈' — 도구는 변해도 스코핑 원리는 남는다.)

아래에서 '안전 로컬 트윈'을 직접 설계하며 마무리해요. 👇`,
    },
    {
      type: "ai-try",
      source: JSON.stringify({
        title: "🎬 사례 바로 실행 — 첫 MCP 실습 계획 세우기",
        prompt:
          "나는 MCP를 처음 실습하려고 해. 파일시스템 MCP로 '안전한 첫 실습'을 계획해줘. ① 어떤 연습 폴더를 만들고 무엇을 넣을지 ② 읽기 도구로 먼저 해볼 것 3가지 ③ 쓰기로 넘어갈 때 지킬 안전 규칙 2가지 ④ 1~3강에서 배운 'MCP 개념'을 이 실습에서 어떻게 확인할 수 있는지 정리해줘.",
        note: "AI가 '연습 폴더+읽기 먼저(tree/search/read)+쓰기 규칙(별도 폴더·dry-run)+개념 확인(서버 노출→AI 소비)'을 짜는지 확인! 파일시스템은 MCP를 몸으로 익히는 가장 좋은 출발점이에요.",
      }),
    },
    {
      type: "markdown",
      source: `## 8. 안전하게 쓰기 — 실무 수칙 🛡️

> 🃏 **허용 폴더를 좁게, 쓰기는 별도로**
> 1) **연습 폴더 하나만** 허용(홈 전체·시스템 ❌) → \`list_allowed_directories\`로 확인
> 2) **읽기부터**, 쓰기는 **별도 출력 폴더** + \`edit_file\` **dry-run** + 백업
> 3) **민감 파일(키·비밀번호)** 섞인 폴더는 허용에서 제외

> 🃏 **인젝션·범위 주의** ⚠️
> 파일 내용의 '지시문'은 **불신**(프롬프트 인젝션). 허용 범위를 좁히는 건 다른 모든 MCP(깃허브·수파베이스 등) 스코핑과 **같은 원리**예요.`,
    },
    {
      type: "markdown",
      source: `> 🎯 **(전부 잊어도 이것만)**
> ## 파일시스템 MCP는 **MCP 공식 레퍼런스**로, 로컬 파일을 읽고·검색·편집한다(\`npx @modelcontextprotocol/server-filesystem <허용경로>\`).
> **핵심은 '허용 디렉터리(경로)를 좁게'** — 모든 MCP 스코핑의 기본형. 읽기 먼저·쓰기는 별도 폴더+dry-run, 민감 파일 제외. **첫 MCP 실습에 최적.**

> 📌 **미션**: ① 연습 폴더 하나만 허용해 실행 → ② \`directory_tree\`·\`search_files\`·\`read_text_file\`로 로컬 RAG 체험 → ③ \`edit_file\` dry-run으로 출력 폴더에 요약 쓰기, 위 '한계 대책' 중 하나를 내 상황에 맞게 적어보기.

👇 아래 **퀴즈 시작**으로 배운 걸 확인해보세요.`,
    },
    {
      type: "markdown",
      source: `📎 (개발자라면) \`@modelcontextprotocol/server-filesystem\`(허용 디렉터리 인자·Roots 프로토콜 roots/list_changed), 도구(read_text_file·read_multiple_files·directory_tree·search_files·edit_file[dry-run]·write_file·move_file), 심링크 traversal 방어·경계 검증 → **개발자 심화 트랙**.
> ⚠️ MCP 레퍼런스 서버는 표준과 함께 진화 — **도구·실행법·Roots는 항상 [MCP 공식 저장소](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)로 재확인.** (스코핑 원리는 불변.)`,
    },
  ],

  quiz: {
    title: "MCP·17강 [Filesystem 적용] — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "파일시스템 MCP가 'MCP 첫 실습'에 좋은 이유는?",
        options: [
          "유료 클라우드가 필요해서",
          "MCP를 만든 곳의 공식 레퍼런스로, 키·클라우드 없이 npx 한 줄로 MCP 개념을 직접 체험",
          "가장 복잡해서",
        ],
        correctIndex: 1,
        explanation:
          "modelcontextprotocol의 공식 레퍼런스 서버로 가장 단순해요. npx 한 줄로 '서버가 도구 노출→AI가 소비'라는 1~3강 개념을 직접 확인할 수 있어 첫 실습에 좋습니다.",
      },
      {
        type: "multiple-choice",
        question: "파일시스템 MCP에서 가장 중요한 안전 개념은?",
        options: [
          "허용 디렉터리(경로)를 좁게 지정해 그 밖은 못 건드리게 하기",
          "홈 폴더 전체를 허용하기",
          "비밀번호 파일을 먼저 열기",
        ],
        correctIndex: 0,
        explanation:
          "이 서버는 모든 작업을 허용 디렉터리로 제한해요. 연습 폴더 하나만 허용하고 홈 전체·시스템 폴더는 절대 열지 마세요. '경로를 좁게'가 안전의 거의 전부입니다.",
      },
      {
        type: "multiple-choice",
        question: "edit_file을 안전하게 쓰는 방법은?",
        options: [
          "바로 덮어쓴다",
          "dry-run(미리보기)으로 바뀔 내용을 확인한 뒤 적용",
          "여러 파일을 한꺼번에 삭제한다",
        ],
        correctIndex: 1,
        explanation:
          "edit_file은 dry-run으로 변경 사항을 미리 볼 수 있어요. 확인 후 적용하고, write_file(덮어쓰기)은 특히 신중히, 쓰기는 별도 출력 폴더에 하세요.",
      },
      {
        type: "multiple-choice",
        question: "허용 디렉터리를 런타임에 유연하게 바꾸는 권장 방식은?",
        options: [
          "Roots 프로토콜(roots/list_changed)로 동적 갱신",
          "매번 컴퓨터를 재부팅",
          "모든 폴더를 항상 허용",
        ],
        correctIndex: 0,
        explanation:
          "Roots 프로토콜을 지원하는 클라이언트는 roots/list_changed로 허용 폴더를 런타임에 갱신할 수 있어요(서버측 허용 목록을 완전히 대체). 재시작 없이 더 유연·안전합니다.",
      },
      {
        type: "multiple-choice",
        question: "파일시스템 MCP의 '경로 스코핑'은 다른 MCP와 어떤 관계인가?",
        options: [
          "완전히 다른 별개 개념이다",
          "09 깃허브 툴셋·11 수파베이스 스코핑·15 플레이라이트 allowed-hosts와 같은 '범위를 좁게' 원리의 기본형",
          "스코핑은 파일시스템에만 있다",
        ],
        correctIndex: 1,
        explanation:
          "'허용 범위를 좁게'는 모든 MCP 안전의 공통 원리예요. 깃허브 툴셋, 수파베이스 project_ref/features, 플레이라이트 allowed-hosts가 모두 같은 원리이고, 파일시스템의 허용 디렉터리가 그 가장 단순한 형태입니다.",
      },
    ],
  } satisfies Quiz,
};

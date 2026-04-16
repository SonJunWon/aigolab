import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

/**
 * Ch02 — 프롬프트 엔지니어링 기초 (Gemini, 입문자 확장판).
 *
 * 목표:
 *   - Gemini / Groq API 키를 화면 클릭 순서까지 따라가며 발급받아 저장
 *   - (선택) Gemini Tier 1 업그레이드 — 이유·방법·주의사항
 *   - 첫 chat 호출로 응답 받기 + 응답 객체 메타 이해
 *   - system prompt / few-shot / temperature 3개 기법 체득
 *   - 실전 미션: 제품 설명 생성기
 *
 * 실행 라우팅: 본 레슨은 Gemini 에 집중 — `provider: "gemini"` 강제.
 *
 * ─── 강사 녹화본 첨부 가이드 ───────────────
 * 1. admin 또는 `localStorage["aigolab.dev.recording"]="1"` 토글 후 새로고침
 * 2. Gemini 키 등록 → 각 LLM 셀 실행
 * 3. 셀 결과 영역의 "↓ Trace JSON (N)" 버튼으로 JSON 다운로드
 * 4. 다운로드 파일을 `traces/` 에 두고 각 셀에 `simulation: { traces: imported }` 추가
 */
export const lesson02: Lesson = {
  id: "ai-eng-02-gemini-prompting",
  language: "ai-engineering",
  track: "beginner",
  order: 2,
  title: "프롬프트 엔지니어링의 시작",
  subtitle: "Google Gemini 로 AI 에게 원하는 답 끌어내기",
  estimatedMinutes: 45,
  cells: [
    // ─────────────────────────────────────────────
    // 1. 오리엔테이션
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `# 🌐 클라우드 ==LLM== 과 처음 만나기

> 💡 **보라색 점선 밑줄** 이 있는 단어는 전문 용어예요. **마우스를 올리면** (모바일은 터치) 쉬운 설명이 나옵니다.

Ch01 에선 **브라우저 안** 에서 돌아가는 작은 AI (Llama 1B) 와 대화했어요.
이번 Ch02 부터는 **구글의 거대한 AI 서버** 에게 요청을 보냅니다 — Gemini 2.5 Flash.

### Ch01 vs Ch02 비교

| 항목 | Ch01 (WebLLM) | Ch02 (Gemini Cloud) |
|---|---|---|
| 실행 위치 | 🏠 여러분 브라우저 | ☁️ Google 데이터센터 |
| 모델 크기 | 1B (10억 ==파라미터==) | 수천억+ (정확한 수치 비공개) |
| 한국어 품질 | 😵 자주 부서짐 | 😊 자연스러움 |
| 응답 속도 | 🐢 5~30초 | ⚡ 1~3초 |
| 비용 | 🆓 무료 | 🆓 **일 1,500회 무료** |
| 필요한 것 | 브라우저 | **==API 키==** |

### 이 레슨의 여정 (45분)
1. **API 키 개념** 이해 — 왜 필요한가
2. **Google Gemini 키 발급** (화면 클릭 순서까지 상세)
3. **(선택) Tier 1 업그레이드** — 속도 제한 풀기
4. **(선택) Groq 키 발급** — 대체 AI 제공자 (속도 500 tok/s)
5. **첫 Gemini 호출** + 응답 분석
6. **프롬프트 3대 기법** — ==system prompt==, ==few-shot==, ==temperature==
7. **실전 미션** — 제품 설명 생성기

> 💡 **1, 2번 (키 발급) 이 가장 오래 걸리는 단계** (약 10분). 나머지는 쉬워요.`,
    },

    // ─────────────────────────────────────────────
    // 2. API 키 개념
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🔑 API 키란?

**API 키 = 여러분 계정의 출입증**. 구글 서버에 "저 ○○○예요" 라고 증명하는 길쭉한 문자열이에요.

### 왜 필요한가?
- 구글 서버는 "**누가**" 요청을 보내는지 알아야 해요
- 한 사람이 무한히 요청하면 서버가 터져요 → 키별로 **한도** 를 걸어요
- 나중에 과금을 걸 때도 "이 키에 청구" 하기 위함

### 생김새
- Gemini 키 예: \`AIzaSyD-XXXXXXX...\` (AIza 로 시작, 약 40자)
- Groq 키 예: \`gsk_XXXXXXX...\` (gsk_ 로 시작, 약 55자)

### 🚨 절대 공유하지 마세요
API 키는 **비밀번호와 동일** 합니다. 유출되면:
- 타인이 여러분 한도로 무제한 요청 가능
- 유료 플랜이면 청구서가 여러분에게 감
- 공유 실수는 **즉시 키 삭제** 후 재발급이 정답

우리 플랫폼은 여러분이 입력한 키를 **이 브라우저 안에만 암호화 저장** 해요 (==AES-GCM==, 서버 전송 없음). 그래도 공용 PC 에서 사용 후엔 삭제하세요.`,
    },

    // ─────────────────────────────────────────────
    // 3. Gemini 키 발급 — 상세 가이드
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🧭 Step 1: Gemini 키 발급 (화면 클릭 순서)

**소요 시간**: 약 3~5분. 결제 정보 **불필요**.

### 준비물
- ✅ **Google 계정** (Gmail 있으면 됨)
- ✅ **웹브라우저** (Chrome / Edge 권장)

### 🎬 따라하기 10단계

**① 브라우저 새 탭 열기** → 주소창에 입력:

\`\`\`
https://aistudio.google.com/apikey
\`\`\`

**② Google 로그인 화면이 뜨면** → 본인 Gmail 계정으로 로그인.
- 이미 로그인돼 있으면 바로 다음 화면으로 넘어감.

**③ Google AI Studio 이용약관 화면**
- "I agree to Google APIs Terms of Service..." 체크박스 체크
- "I consent to the..." (연구 동의) 체크는 **선택** — 체크해도 되고 안 해도 됨
- **[Continue]** 또는 **[Get Started]** 버튼 클릭

**④ "API keys" 페이지 도착**
- 페이지 제목이 "API keys" 인 것 확인
- 상단에 **파란 버튼** "**+ Create API key**" 가 보임

**⑤ [+ Create API key] 버튼 클릭**
- 다이얼로그가 떠요: "**Create API key in new project**" 같은 옵션이 기본
- 처음이라면 그대로 **[Create API key in new project]** 클릭 (새 Google Cloud 프로젝트 자동 생성)

**⑥ 키 생성 (몇 초 기다림)**
- "**API key generated**" 모달이 뜨고 \`AIzaSyD...\` 로 시작하는 키가 표시됨
- 키 옆에 📋 **복사 아이콘** 이 있음

**⑦ [📋 Copy] 버튼 클릭** — 키가 클립보드에 저장됨

**⑧ 이 레슨 페이지로 돌아와서** 상단 우측의 **🔑 키 등록** 버튼 클릭
- 또는 아래 어느 LLM 셀이든 실행하면 자동으로 키 등록 모달이 뜸

**⑨ 모달에서 "1. Google Gemini 키 발급" 탭 선택**
- \`AIza...\` 로 시작하는 키를 **API 키 붙여넣기** 입력란에 붙여넣기 (Cmd/Ctrl + V)
- **[저장 & 테스트]** 버튼 클릭

**⑩ 검증 단계 (약 1~2초)**
- 플랫폼이 실제 Gemini 에 "ping" 호출을 보내 유효성 확인
- 성공 시 **✓ 저장됨** 뱃지 출력 → 준비 완료! 🎉
- 실패 시 에러 메시지가 나오면 "키 복사할 때 공백·엔터가 딸려옴" 이 흔한 원인 — 다시 복사

### 💡 실수하기 쉬운 부분
- **키 앞뒤에 공백** 이 섞여 복사됨 → 모달이 알아서 \`.trim()\` 하긴 하지만 주의
- **Google 계정을 여러 개 사용** 중이면 어느 계정에 키가 생성됐는지 확인 (우측 상단 프로필 아이콘)
- **"새 프로젝트" 대신 기존 프로젝트 선택** 시 그 프로젝트 설정이 적용됨 — 초보자는 새 프로젝트 권장`,
    },

    // ─────────────────────────────────────────────
    // 4. Tier 1 설명
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## ⚙️ Step 2 (선택): Gemini Tier 1 로 업그레이드

**결론부터**: 이 레슨만 한다면 **Free Tier 로 충분** 합니다. Tier 1 은 "빨리 여러 번 실험" 하는 사람 용.

### 두 Tier 의 차이 (Gemini 2.5 Flash 기준)

| 항목 | 🆓 Free Tier | 💳 Tier 1 |
|---|---|---|
| 신용카드 등록 | ❌ 불필요 | ✅ **필요** |
| **RPM** (분당 요청 수) | 15 회 | **2,000 회** |
| **RPD** (일일 요청 수) | 1,500 회 | 1,500 회 이상 가능 |
| **TPM** (분당 토큰 수) | 1백만 | 4백만 |
| 레이트 리밋 걸리면 | \`429 Too Many Requests\` 에러 | 거의 안 걸림 |
| 과금 | ❌ 없음 | 🪙 Free 한도 초과 시만 과금 |

### 🚨 Tier 1 = "유료 Tier 활성화" 인데, 무료 한도 내에선 요금 0원

많은 분이 오해하세요: **"Tier 1 = 돈 든다"** 아닙니다.
- 신용카드를 **등록** 만 해도 Tier 1 로 승격됨
- Free 한도 **안** 에선 **0원 청구**
- Free 한도를 **초과** 하면 그제서야 과금 시작 (초과분만)

즉 Tier 1 로 올려두고 조심해서 쓰면 "높은 RPM 의 여유 + 여전히 0원" 이 가능.

### 🎬 Tier 1 업그레이드 따라하기 (10분 소요)

**전제**: 신용카드 / 체크카드 한 장 필요. 해외결제 가능한 카드.

**① Google Cloud Console 열기**
\`\`\`
https://console.cloud.google.com/billing
\`\`\`

**② 우측 상단에서 "Step 1 에서 만든 프로젝트" 선택**
- 이름은 보통 "Gemini API" 또는 "My First Project" 같은 형태.
- 틀린 프로젝트 고르면 Tier 1 이 **Gemini 키와 연결 안 됨** — 꼭 확인.

**③ 좌측 메뉴에서 [Billing] 선택**
- 또는 직접 URL: \`https://console.cloud.google.com/billing/linkedaccount\`

**④ "This project has no billing account" 메시지와 함께 [Link a billing account] 버튼 보임**
- 버튼 클릭

**⑤ 새 billing account 생성 화면**
- **Country**: 한국 거주자면 **South Korea**
- **Account type**: **Individual** (기업이면 Business)
- **Name & Address**: 실제 주소 입력 (결제 확인용)
- **[Continue]**

**⑥ 결제 수단 입력**
- 신용카드 번호 / 만료일 / CVC / 이름 입력
- 해외결제 가능한 Visa, Mastercard, American Express 권장
- **$0 한도 테스트용 가상 승인** 이 일어남 (실제 청구 X)
- **[Start my free trial]** 또는 **[Submit]** 클릭

**⑦ Billing account 가 프로젝트에 연결됨**
- 성공 메시지: "Billing is enabled for this project"

**⑧ 15~30분 기다리기**
- Tier 승격은 즉시 반영이 아님. 보통 몇 분 ~ 최대 30분.
- 기다리는 동안 Free Tier 로 레슨 진행해도 됨.

**⑨ 확인**: \`https://aistudio.google.com/usage\` 에서 "Tier: **1**" 표시되면 완료

### ⚠️ Tier 1 도 과금 방지 안전장치 걸기 (필수 권장)

**Budget Alert** 설정:
1. Cloud Console → [Billing] → [Budgets & alerts]
2. **[+ Create Budget]**
3. Name: \`gemini-learning-safety\`
4. Amount: **$1** (1달러 한도)
5. 50%, 90%, 100% 도달 시 이메일 알림 체크
6. 저장

이러면 **$1 이 넘기 전에 이메일 알림** 이 와서 깜짝 청구를 방지할 수 있어요.

### 🤷 그래서 Tier 1 해야 할까?
- **레슨만 따라 하기**: Free 로 충분
- **자기 프로젝트 만들고 빠르게 실험**: Tier 1 권장 (RPM 15 → 2000)
- **결제 정보 절대 입력하기 싫다**: Free 로 계속, 대신 요청 속도 제한 감수`,
    },

    // ─────────────────────────────────────────────
    // 5. Groq 키 발급 (선택)
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🧭 Step 3 (선택): Groq 키 발급 — 세상에서 가장 빠른 LLM 제공자

Groq 은 **Llama 3.3 70B** (Meta 의 거대 모델) 을 **500 tok/s** 의 속도로 서비스합니다.
Gemini 보다 5~10배 빨라요. Ch04 CoT 와 Ch06 Agent 에서 진가 발휘.

Ch02 진행에는 **필수 아님**. 대체 ==Provider== 로 등록해두면 좋습니다.

### 🎬 Groq 키 발급 8단계

**① 브라우저 새 탭**:
\`\`\`
https://console.groq.com/keys
\`\`\`

**② 로그인 화면**
- **[Sign in with Google]** 또는 **[Sign in with GitHub]** 클릭
- 둘 다 결제 정보 불필요
- Google 로그인 권장 (방금 Gemini 에서 쓴 계정 그대로 재사용 가능)

**③ 약관 동의 체크 → [Continue]**

**④ 대시보드 도착**
- 좌측 메뉴에서 **[API Keys]** 항목 확인
- 이미 열린 페이지일 수도 있음 (URL 이 /keys 면 맞음)

**⑤ [+ Create API Key] 또는 [Create API Key] 버튼 클릭**
- 페이지 중앙 또는 우측 상단에 위치

**⑥ 키 이름 입력 모달**
- **Display Name**: \`aigolab-learning\` 같이 알아보기 쉬운 이름
- **[Submit]** 클릭

**⑦ 🚨 키 한 번만 표시됨 — 즉시 복사**
- \`gsk_...\` 로 시작하는 키가 **단 한 번** 표시됨
- **페이지 닫으면 다시 볼 수 없어요** (Gemini 와 다른 점)
- 📋 Copy 아이콘 클릭해서 클립보드에 저장

**⑧ 이 레슨 페이지 상단 🔑 버튼 → "2. Groq 키 발급" 탭**
- \`gsk_...\` 키 붙여넣기 → **[저장 & 테스트]**
- 성공 시 **✓ 저장됨**

### ⚠️ Groq 만의 주의사항

**Groq 은 자유 티어에서 이미 일 14,400 요청을 줍니다** (Gemini 보다 훨씬 관대).
대신 **결제 티어는 없어요** — 초과 시 그냥 제한.

### 💡 Groq 키 분실 시
\`gsk_...\` 키는 Groq 사이트에서도 **다시 못 봅니다**. 잊어버리면:
1. [API Keys] 페이지에서 기존 키 **Delete**
2. 새로 **+ Create API Key** → 새 \`gsk_...\` 발급
3. 우리 플랫폼 🔑 모달에서 Groq 키 업데이트

키를 안전한 곳 (1Password, Bitwarden, 메모앱 암호화 노트) 에 백업해두는 것도 방법.`,
    },

    // ─────────────────────────────────────────────
    // 6. 키 저장 후 진행
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🚀 첫 Gemini 호출 — 코드 해부

드디어 코드로! 아래 셀을 실행하기 전에 **무슨 일이 일어나는지** 먼저 알고 가요.

\`\`\`ts
const response = await chat({
  provider: "gemini",
  messages: [
    { role: "user", content: "AI 와 머신러닝의 차이를 3문장으로 설명해줘." },
  ],
});

console.log(response.text);
\`\`\`

### Ch01 과의 차이

| 줄 | Ch01 | Ch02 | 의미 |
|---|---|---|---|
| 1 | \`task: "offline"\` | \`provider: "gemini"\` | Gemini 에 **강제** 라우팅 |
| (내부) | 브라우저 WebLLM 호출 | **HTTPS 로 Google 서버 호출** | 인터넷 필요 |
| (보안) | 키 불필요 | **암호화된 Gemini 키 사용** | 키 없으면 자동 모달 오픈 |

### \`provider\` vs \`task\` 차이
- **\`task\`** — "어떤 **성격** 의 답이 필요해?" (fast / reasoning / offline / multimodal)
- **\`provider\`** — "어떤 **제공자** 가 꼭 답해줘야 해?" (gemini / groq / webllm)

이 레슨은 학습 목적이라 provider 를 **명시적으로 gemini** 로 고정. 실무에선 \`task: "fast"\`
같이 성격만 지정하고 제공자는 플랫폼이 자동 선택하게 하는 게 유연함.

### 만약 키가 없으면?
걱정 마세요. 셀 실행 시 **키 등록 모달이 자동으로 오픈** 됩니다 — Step 1/3 으로 돌아가
키 복사 + 붙여넣기 하고 다시 실행하면 됩니다.`,
    },

    // ─────────────────────────────────────────────
    // 7. 첫 Gemini 호출
    // ─────────────────────────────────────────────
    {
      type: "llm-code",
      language: "typescript",
      source: `// 처음 실행 시 키가 없으면 키 등록 모달이 자동 오픈됩니다.
const response = await chat({
  provider: "gemini",
  messages: [
    { role: "user", content: "AI 와 머신러닝의 차이를 3문장으로 설명해줘." },
  ],
});

console.log("── 답변 ──");
console.log(response.text);

console.log("\\n── 메타 ──");
console.log("모델:", response.model);
console.log("응답 시간:", response.latencyMs, "ms");

if (response.tokensUsed) {
  console.log("입력 토큰:", response.tokensUsed.input);
  console.log("출력 토큰:", response.tokensUsed.output);
}`,
      hints: [
        "response.model 이 'gemini-2.5-flash' 로 찍히는지 확인하세요.",
        "latencyMs 를 Ch01 WebLLM 결과와 비교해보세요. 보통 Gemini 가 더 빠릅니다.",
        "tokensUsed 의 input/output 합이 곧 비용 단위입니다 (유료 Tier 에서).",
      ],
    },

    // ─────────────────────────────────────────────
    // 8. 응답 관찰 해설
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🔍 방금 관찰한 것

Ch01 의 WebLLM 응답과 비교해보면:

| 항목 | WebLLM (Ch01) | Gemini (Ch02) |
|---|---|---|
| 한국어 문장 구조 | 어색한 경우 있음 | 자연스러움 |
| 3문장 요청 준수 | 종종 무시 | 거의 정확히 3문장 |
| \`latencyMs\` | 5,000~30,000 | 500~2,000 |
| 첫 실행 대기 | 2~3분 (모델 다운) | 수 초 |

### 왜 이런 차이?
- Gemini 는 **Google 데이터센터의 TPU/GPU** 에서 돌아요 — 수천만 달러짜리 인프라
- 우리 Llama 1B 보다 **수백 배 많은 파라미터** — 한국어 학습도 훨씬 많이 됨
- 대신 **네트워크 필요** + 키 한도가 있음

이제 같은 API 로 여러 가지 **프롬프트 기법** 을 실험해봅시다.`,
    },

    // ─────────────────────────────────────────────
    // 9. 기법 1: System Prompt
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🎭 기법 1: System Prompt — AI 에게 "역할" 부여

Ch01 에서 이미 만난 개념이지만, **거대 모델에선 효과가 훨씬 극적** 으로 드러납니다.

### 같은 질문, 다른 역할 → 완전 다른 답

아래 셀은 \`"코드 리뷰에서 '이 변수 이름 좀 별로네요' 라는 피드백을 어떻게 받아들일까?"\` 라는
질문에 **두 가지 역할** 을 부여해 실행합니다.

- 역할 A: "15년 경력 시니어 엔지니어, 신중하고 예의 바르게"
- 역할 B: "친한 멘토, 말 편하게, 유머 섞어"

실행 후 두 답변이 **어조·관점·길이** 까지 어떻게 다른지 관찰해보세요.

### 💡 system prompt 작성 팁
1. **구체적 페르소나** — "전문가" 보다 "15년 경력의 시니어 Python 엔지니어"
2. **제약을 리스트로** — "다음을 지켜: 1) ... 2) ... 3) ..."
3. **출력 형식 지정** — "반드시 JSON 으로", "번호 리스트로"
4. **한 단락 이내** — 너무 길면 모델이 지시를 잊음

### 안 좋은 vs 좋은 system prompt
| ❌ 안 좋은 | ✅ 좋은 |
|---|---|
| "친절하게 답해" | "너는 호텔 컨시어지야. 항상 '선생님/사모님' 호칭 사용, 답변 3줄 이내." |
| "전문적으로" | "너는 의료 AI 보조. 진단 단정 금지, 참고 문헌 1개 이상 명시." |`,
    },

    // ─────────────────────────────────────────────
    // 10. System Prompt 셀
    // ─────────────────────────────────────────────
    {
      type: "llm-code",
      language: "typescript",
      source: `const question = "코드 리뷰에서 '이 변수 이름 좀 별로네요' 라는 피드백을 어떻게 받아들일까?";

const formal = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: "너는 15년 경력의 시니어 엔지니어야. 신중하고 예의 바르게 답해. 3문장 이내.",
    },
    { role: "user", content: question },
  ],
});

const casual = await chat({
  provider: "gemini",
  messages: [
    {
      role: "system",
      content: "너는 주니어 개발자랑 친한 멘토야. 반말로 편하게, 유머 섞어. 3문장 이내.",
    },
    { role: "user", content: question },
  ],
});

console.log("── 시니어 엔지니어 ──");
console.log(formal.text);
console.log("\\n── 친한 멘토 ──");
console.log(casual.text);`,
      hints: [
        "같은 질문이라도 system 에 따라 어조가 확 달라져요. 여러 번 실행해보세요.",
        "system 을 '조선시대 선비' / '초등학생' / '랩퍼' 로 바꿔보면 더 극적.",
        "system 안에 '3문장 이내' 같은 제약도 모델이 대체로 잘 지킵니다.",
      ],
    },

    // ─────────────────────────────────────────────
    // 11. 기법 2: Few-shot
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 📚 기법 2: Few-shot — 예시로 가르치기

**원리**: LLM 은 "패턴 매칭" 의 천재. 규칙을 글로 설명하기보다 **예시 3~5개** 를 보여주면
훨씬 빠르고 정확하게 이해합니다.

### Zero-shot vs Few-shot

| 방식 | 프롬프트 | 정확도 | ==토큰== |
|---|---|---|---|
| **Zero-shot** | "이 문장의 감정은?" | 중 | 적음 |
| **Few-shot** | "예시 5개 + 이 문장의 감정은?" | **높음** | 많음 |

비용 (토큰) 은 올라가지만 **정확도가 극적으로 개선**. 분류·추출·포맷팅에 특히 효과적.

### 어떤 경우에 쓰나?
- **분류** (감정, 주제, 긴급도...)
- **추출** (이름, 날짜, 가격...)
- **특정 포맷** 으로 출력 (JSON, 번호 리스트...)
- **스타일 흉내** (특정 말투, 특정 시인의 시)

### 실습: 감정 분류기

아래 셀은 5개 예시를 주고, 새 문장 3개의 감정을 [긍정/부정/중립] 중 하나로 분류합니다.
\`temperature: 0.1\` 로 낮춰서 **일관성** 을 우선.`,
    },

    // ─────────────────────────────────────────────
    // 12. Few-shot 셀
    // ─────────────────────────────────────────────
    {
      type: "llm-code",
      language: "typescript",
      source: `const prompt = \`다음 한국어 문장의 감정을 [긍정/부정/중립] 중 하나로 분류해.

예시:
- "오늘 날씨 최고야!" → 긍정
- "또 버그야... 퇴근 언제 하냐." → 부정
- "3시에 회의 있어요." → 중립
- "이거 대박 사건 아니야?" → 긍정
- "사실 별로 기대 안 했는데 괜찮네." → 긍정

분류할 문장:
- "말은 안 했는데 좀 서운했어."
- "내일 비 온대."
- "이 팀 최고야 ㅠㅠ 고마워요 다들."

출력은 각 문장에 대해 한 줄씩, '문장 → 감정' 형식으로.\`;

const response = await chat({
  provider: "gemini",
  temperature: 0.1,
  messages: [{ role: "user", content: prompt }],
});

console.log(response.text);`,
      hints: [
        "temperature 를 0.9 로 올려 실행해보세요 — 분류가 일관되지 않음을 확인.",
        "예시에 '반어법' 케이스를 1~2개 더 넣으면 '말은 안 했는데 서운' 같은 미묘한 감정을 더 잘 잡습니다.",
        "출력 형식을 '~→~' 대신 JSON 으로 바꿔보세요: 포맷팅이 얼마나 지켜지는지 관찰.",
      ],
    },

    // ─────────────────────────────────────────────
    // 13. 기법 3: Temperature 재방문
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🌡️ 기법 3: Temperature — 거대 모델에서 다시 실험

Ch01 에서 1B 모델이 temperature 1.2 에서 부서지는 걸 봤었죠.
**거대 모델(Gemini)** 은 1.0 근처에서도 **여전히 자연스러운 한국어** 를 유지합니다.

### 이번 실험의 관찰 포인트
- \`0.0\` vs \`1.0\` 에서 **한국어 문장 구조가 유지되는가?**
- 같은 프롬프트를 **여러 번** 실행하면 몇 % 가 다른 답?

Ch01 의 "부서지는" 상황과 어떻게 다른지 비교해보세요.`,
    },

    // ─────────────────────────────────────────────
    // 14. Temperature 셀 (Gemini)
    // ─────────────────────────────────────────────
    {
      type: "llm-code",
      language: "typescript",
      source: `const prompt = "고양이 이름 5개만 창의적으로 지어줘. 이유 짧게 포함.";

const cold = await chat({
  provider: "gemini",
  temperature: 0.0,
  messages: [{ role: "user", content: prompt }],
});

const hot = await chat({
  provider: "gemini",
  temperature: 1.0,
  messages: [{ role: "user", content: prompt }],
});

console.log("── temperature 0.0 ──");
console.log(cold.text);
console.log("\\n── temperature 1.0 ──");
console.log(hot.text);`,
      hints: [
        "여러 번 실행해보며 두 버전의 '같은 답 빈도' 를 관찰. 0.0 은 거의 고정, 1.0 은 매번 다름.",
        "Ch01 과 달리 1.0 에서도 한국어가 유지되는 걸 확인하세요. 이게 거대 모델의 힘.",
        "카피라이팅·브레인스토밍엔 0.7~1.0, 분류·데이터 추출엔 0.0~0.2 가 일반적.",
      ],
    },

    // ─────────────────────────────────────────────
    // 15. 미션 설명
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 🎯 미션: 제품 설명 생성기

지금까지 배운 **3대 기법** (system prompt, few-shot, temperature) 을 **하나의 함수** 에 조립합니다.

### 요구사항
다음 시그니처의 \`describe(product)\` 함수를 작성:

\`\`\`ts
interface Product {
  name: string;        // 제품 이름
  features: string[];  // 주요 기능 리스트
  audience: string;    // 타겟 고객
}

async function describe(product: Product): Promise<string>;
\`\`\`

**출력 형식**:
\`\`\`
[마케팅 문구]
1) ...
2) ...
3) ...

[해시태그]
#... #... #... #... #...
\`\`\`

### 작업 순서 (힌트)
1. \`system\` 으로 "간결한 마케팅 카피라이터" 역할 부여
2. \`user\` 메시지에 제품 정보를 **구조적으로** 포함
3. 출력 형식을 **명시적으로** 지시
4. \`temperature: 0.7\` 로 창의성 살짝
5. \`response.text\` 반환

### 완성 후 테스트
- "Pomodoro Plant" (25분 물주기 집중 앱) → 학생 타겟
- "AI 번역기" → 직장인 타겟
- 원하는 제품 임의로 넣어보세요

막히면 **힌트 → 정답 보기** 버튼 누르면 완성 코드가 주입됩니다.`,
    },

    // ─────────────────────────────────────────────
    // 16. 미션 셀
    // ─────────────────────────────────────────────
    {
      type: "llm-code",
      language: "typescript",
      source: `interface Product {
  name: string;
  features: string[];
  audience: string;
}

async function describe(product: Product) {
  // TODO: 여기를 채우세요
  // 1) system prompt 설정
  // 2) user message 에 product 정보 구조적으로 포함
  // 3) chat() 호출 + 결과 return
  throw new Error("아직 미구현 — 힌트 참고해 완성해보세요");
}

const result = await describe({
  name: "Pomodoro Plant",
  features: ["25분마다 물 주기", "집중 시간 게임화", "숲 시뮬레이션"],
  audience: "집중력 부족한 대학생",
});

console.log(result);`,
      hints: [
        "function 바디 기본 골격:\\nconst response = await chat({\\n  provider: 'gemini',\\n  temperature: 0.7,\\n  messages: [\\n    { role: 'system', content: '너는 간결한 마케팅 카피라이터야.' },\\n    { role: 'user', content: '제품: ' + product.name + ', 특징: ' + product.features.join(', ') + ', 타겟: ' + product.audience + '. 마케팅 문구 3줄과 해시태그 5개를 작성해.' },\\n  ],\\n});\\nreturn response.text;",
        "프롬프트에 출력 형식을 명시하면 더 안정적: '문구 1) ... 2) ... 3) ... 해시태그: #... #... ...'",
        "응답 품질이 마음에 안 들면 system 에 제약 추가 — '이모지 사용 금지', '존댓말로', '각 문구 20자 이내'.",
      ],
      solution: `interface Product {
  name: string;
  features: string[];
  audience: string;
}

async function describe(product: Product) {
  const response = await chat({
    provider: "gemini",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "너는 간결하고 감각적인 마케팅 카피라이터야. 출력은 반드시 요청된 포맷을 지켜.",
      },
      {
        role: "user",
        content:
          \`제품: \${product.name}
특징: \${product.features.join(", ")}
타겟: \${product.audience}

다음 포맷으로 출력해:
[마케팅 문구]
1) ...
2) ...
3) ...

[해시태그]
#... #... #... #... #...\`,
      },
    ],
  });
  return response.text;
}

const result = await describe({
  name: "Pomodoro Plant",
  features: ["25분마다 물 주기", "집중 시간 게임화", "숲 시뮬레이션"],
  audience: "집중력 부족한 대학생",
});

console.log(result);`,
    },

    // ─────────────────────────────────────────────
    // 17. 실무 팁 & 정리
    // ─────────────────────────────────────────────
    {
      type: "markdown",
      source: `## 📚 실무 팁 — 프롬프트를 문서처럼 다루기

프롬프트 엔지니어링은 **일회성 꼼수** 가 아니라 **엔지니어링 실무** 입니다.

### 성숙한 팀이 하는 것
1. **버전 관리** — 프롬프트를 소스 코드처럼 Git 에 커밋 (v1, v1.1, v2)
2. **A/B 테스트** — 버전별 응답 품질을 실제 사용자에게 비교
3. **실패 케이스 모음** — "이런 입력엔 이상하게 답함" 을 리스트화해 회귀 방지
4. **평가 세트** — 10~100개 정답 쌍을 만들어 모델/프롬프트 변경 시 점수 측정
5. **프롬프트 라이브러리** — 팀 전체가 공유하는 system prompt 모음

### 이 과정 전체가 **ML Ops** 의 프롬프트 버전

### 🚨 막히면 이 3가지부터 체크
1. **system 너무 짧은가?** — 역할·제약을 구체적으로
2. **few-shot 부족한가?** — 예시를 3~5개 추가
3. **temperature 과한가?** — 분류/추출이면 0.2 이하

### 🎓 Ch02 정리
- ✅ Gemini 키 발급 (화면별 10단계)
- ✅ (선택) Tier 1 업그레이드 — 신용카드 등록 시 RPM 급등
- ✅ (선택) Groq 키 — 대체 Provider, 초고속 70B
- ✅ 응답 객체 읽기 — text / model / latencyMs / tokensUsed
- ✅ System prompt · Few-shot · Temperature **3대 기법** 체득
- ✅ 3대 기법을 조립한 실전 함수 작성

### 🚀 Ch03 (Phase 2) 예고 — 구조화 출력
지금까진 "자유 텍스트" 를 받았죠. Ch03 부터는:
- **JSON Schema** 로 응답 구조를 **타입 안전** 하게 강제
- \`response.json\` 으로 파싱된 객체 자동 추출
- \`zod\` 로 런타임 검증

자유 텍스트 파싱 지옥에서 탈출합니다!`,
    },
  ],

  // ─────────────────────────────────────────────
  // 퀴즈
  // ─────────────────────────────────────────────
  quiz: {
    title: "Ch02 — 프롬프트 기초 + 키 발급 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "API 키란 무엇인가요?",
        options: [
          "AI 모델의 내부 파라미터",
          "여러분 계정을 증명하는 비밀번호 같은 문자열 — 서버가 '누가' 요청하는지 식별하는 용도",
          "JSON 응답의 한 필드",
          "서버에서 제공하는 암호화 라이브러리",
        ],
        correctIndex: 1,
        explanation:
          "API 키는 비밀번호와 동일한 성격의 출입증. 유출되면 타인이 여러분 한도로 호출 가능하므로 공유 금지. 우리 플랫폼은 AES-GCM 으로 브라우저에만 암호화 저장.",
      },
      {
        type: "multiple-choice",
        question: "Gemini Free Tier 에서 RPM(분당 요청 수) 한도가 몇 회인가요?",
        options: ["1 회", "15 회", "2,000 회", "무제한"],
        correctIndex: 1,
        explanation:
          "Gemini 2.5 Flash Free Tier 는 분당 15회 요청이 기본. 레슨 진행엔 충분하지만, 빠르게 반복 실험하려면 Tier 1 (신용카드 등록) 으로 분당 2,000회까지 올릴 수 있습니다. Free 한도 내에선 Tier 1 도 0원 청구.",
      },
      {
        type: "multiple-choice",
        question: "Groq 에서 새 API 키를 발급받았습니다. 페이지를 닫기 전에 반드시 해야 할 일은?",
        options: [
          "GitHub 에 백업",
          "키를 즉시 복사해서 안전한 곳(우리 플랫폼 🔑 모달 등)에 저장 — Groq 은 키를 한 번만 보여줌",
          "Gmail 에 본인에게 전송",
          "아무것도 안 해도 됨 — 언제든 다시 볼 수 있음",
        ],
        correctIndex: 1,
        explanation:
          "Groq 키(gsk_...)는 생성 직후 한 번만 표시되고 페이지를 닫으면 다시 볼 수 없어요. Gemini 키는 다시 보여주지만, Groq 은 아님. 놓쳤다면 기존 키 삭제 후 재발급 필요.",
      },
      {
        type: "multiple-choice",
        question: "system 메시지와 user 메시지의 차이는?",
        options: [
          "system 은 네트워크 설정, user 는 질문",
          "system 은 AI 의 태도/역할/제약, user 는 실제 요청",
          "둘은 아무 차이도 없다",
          "system 은 관리자만 사용 가능",
        ],
        correctIndex: 1,
        explanation:
          "system 은 대화 전체에 걸쳐 유지되는 '메타 지시' — 캐릭터·출력 포맷·금지사항을 정의합니다. user 는 실제 질문·요청. 같은 user 메시지도 system 을 바꾸면 완전히 다른 답을 얻어요.",
      },
      {
        type: "multiple-choice",
        question: "Few-shot prompting 에서 예시는 왜 주나요?",
        options: [
          "AI 의 무게를 늘려 정확도를 높이기 위해",
          "토큰 소비량을 줄이려고",
          "원하는 패턴/형식을 규칙 설명 대신 예시로 가르쳐서 일관성을 높이려고",
          "AI 가 예시를 다시 그대로 출력하도록",
        ],
        correctIndex: 2,
        explanation:
          "LLM 은 예시 기반 패턴 매칭에 강합니다. 3~5개 예시만으로도 분류·포맷팅·번역 작업 품질이 크게 올라가요. 대신 토큰 소비는 늘어나니 필요한 곳에만 사용.",
      },
      {
        type: "multiple-choice",
        question: "키 없는 상태로 Gemini 셀을 실행하면 어떻게 되나요?",
        options: [
          "에러만 나고 아무 일도 안 일어남",
          "자동으로 WebLLM 으로 페일오버",
          "키 등록 모달이 자동 오픈됨 — 키 복사 + 붙여넣기 후 재실행 가능",
          "계정이 차단됨",
        ],
        correctIndex: 2,
        explanation:
          "v4.1.0 부터 runCell 이 LlmError('missing-key') 를 감지해 keyModalStore 를 자동 오픈합니다. 학생이 🔑 버튼 위치를 몰라도 자연스럽게 키 등록 경로로 유도돼요.",
      },
      {
        type: "multiple-choice",
        question: "아래 중 temperature 를 낮게(0.0~0.2) 설정하기에 가장 적합한 작업은?",
        options: [
          "소설 쓰기",
          "브레인스토밍",
          "데이터 분류 / 추출 / 코드 생성 (일관성·정확성이 중요한 작업)",
          "마케팅 슬로건 만들기",
        ],
        correctIndex: 2,
        explanation:
          "일관성·정확성이 중요한 작업은 낮은 temperature. 창의성이 필요한 작업은 0.7 ~ 1.0 이 보통이에요. 1.0 초과는 특수한 탐색 실험 외엔 대부분 품질 저하.",
      },
    ],
  } satisfies Quiz,
};

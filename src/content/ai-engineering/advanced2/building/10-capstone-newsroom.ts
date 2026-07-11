import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급2 시리즈C(팀 만들기) 10강 — 실전 ④ 완성: 뉴스룸 일반화 + 캡스톤.
 * 같은 골격으로 리서치 뉴스룸 조립 → 재사용성 증명 → 캡스톤 과제 + 확장 연구. 시리즈 완결.
 */
export const lessonC10: Lesson = {
  id: "ai-eng-a2-c10-capstone-newsroom",
  language: "ai-engineering",
  track: "advanced2",
  order: 30,
  title: "C10. 🏗 실전 ④ 완성 — 뉴스룸 일반화와 캡스톤",
  subtitle: "조직 하나를 지어본 사람은 두 번째 조직을 빨리 짓는다 — 시리즈 완결",
  estimatedMinutes: 60,
  cells: [
    {
      type: "markdown",
      source: `# 🏗 고급2·C10강. 실전 ④ 완성
### — 뉴스룸 일반화와 캡스톤

⏱️ 60분 · 🧰 API 키 · 🗺️ 전 축 총동원 · 선수: C7~C9

> 💡 마지막 질문: C7~C9에서 지은 골격 — 팬아웃·검증단·계약·예산 — 은
> **코드리뷰 전용**일까요?
> 오늘 같은 골격으로 전혀 다른 시스템, **'리서치 뉴스룸'**(질문을 넣으면 팩트체크된
> 브리핑이 나온다)을 한 강 안에 조립합니다. 바뀌는 것은 역할 정의와 계약의 **내용**뿐,
> 구조는 한 줄도 다시 설계하지 않아요.
> **"조직 하나를 지어본 사람은 두 번째 조직을 빨리 짓는다"** — 이 명제의 증명이 오늘이자,
> 여러분의 캡스톤이 그 세 번째 조직입니다.`,
    },
    {
      type: "markdown",
      source: `## 🗞️ 뉴스룸 ← 리뷰 회사 : 대응표

설계 회의(C7)를 다시 할 필요가 없습니다. **대응표 한 장**이면 돼요.

| 골격 부품 | 코드리뷰 회사 (C8) | 리서치 뉴스룸 (오늘) |
|-----------|--------------------|--------------------|
| 입력 | PR (코드) | 질문 (리서치 주제) |
| 파인더 팬아웃 | 버그/보안/성능 렌즈 | **통계/사례/반론 기자** (다각 취재) |
| 계약의 급소 | scenario (재현 경로) | **source (출처 명시)** — 느낌 기사 반려 |
| 적대적 검증단 | "반박하라" 3인 | **팩트체커** "이 주장을 무너뜨려라" 3인 |
| 안전측 기본값 | 형식 실패 → 기각 | 출처 불명 → 기각 |
| 리포터 | 심각도 순 조립 | **에디터** — 확신도 순 조립 |
| 골든 세트 | 결함 심은 PR + 깨끗한 PR | 답이 알려진 질문 + **함정 질문**(거짓 전제) |
|| 예산·읽기 전용·트레이스 | **동일 (그대로 재사용)** |

> 마지막 행이 핵심이에요 — 신뢰 인프라(C9의 출고 조건 3종)는 도메인과 무관하게
> **그대로** 갑니다. 도메인이 바뀔 때 다시 쓰는 것은 역할의 '내용'뿐.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ══ 리서치 뉴스룸 — C8 골격의 재사용 (구조는 동일, 내용만 교체) ══

type Article = { angle: string; claim: string; source: string; confidence: "상" | "중" | "하" };
type Check = { verdict: "confirmed" | "refuted"; reason: string };

async function askJSON(system: string, user: string): Promise<any> {  // C5·C8 그대로
  const messages: any[] = [{ role: "system", content: system }, { role: "user", content: user }];
  for (let i = 0; i < 2; i++) {
    const res = await chat({ provider: "gemini", messages });
    try { return JSON.parse((res.text ?? "").replace(/\`\`\`json|\`\`\`/g, "").trim()); }
    catch { messages.push({ role: "assistant", content: res.text ?? "" }, { role: "user", content: "순수 JSON만." }); }
  }
  return null;
}

// 기자 팬아웃 — C8 runFinder의 '내용 교체판'
async function reporter(angle: string, question: string): Promise<Article[]> {
  const out = await askJSON(
    \`너는 \${angle} 전문 기자다. 과감하게 취재하라 — 검증은 팩트체커가 한다.
JSON 배열: {"angle":"\${angle}","claim"(주장 1문장),"source"(출처 — 없으면 그 주장은 쓰지 마라),"confidence":"상|중|하"}. 최대 2건.\`,
    \`취재 질문: \${question}\`,
  );
  return Array.isArray(out) ? out : [];
}

// 팩트체커 — C8 runVerifier의 '내용 교체판'
async function factCheck(a: Article, viewpoint: string): Promise<Check> {
  const out = await askJSON(
    \`너는 적대적 팩트체커다 (\${viewpoint}). 아래 기사 주장을 무너뜨리는 것이 임무다.
출처의 신뢰성, 주장과 출처의 정합성, 과장 여부를 공격하라. 반박 실패 시에만 confirmed.
JSON: {"verdict":"confirmed|refuted","reason"}\`,
    JSON.stringify(a),
  );
  return out?.verdict ? out : { verdict: "refuted", reason: "형식 실패 — 안전측 기각" };
}

// ── 조립: C8과 같은 흐름 (팬아웃 → 검증 2/3 → 에디터) ──
const QUESTION = "주 4일제 도입이 기업 생산성에 미치는 영향은?";
const angles = ["통계·데이터", "기업 사례", "반론·한계"];

const articles = (await Promise.all(angles.map((a) => reporter(a, QUESTION)))).flat();
console.log(\`📰 취재 기사 \${articles.length}건 (3각 팬아웃)\\n\`);

const confirmed: Article[] = [];
for (const a of articles) {
  const checks = await Promise.all(["출처 신뢰성", "논리 정합성", "과장 검출"].map((v) => factCheck(a, v)));
  const yes = checks.filter((c) => c.verdict === "confirmed").length;
  console.log(\`\${yes >= 2 ? "✅ 게재" : "💀 킬"} [\${a.angle}] \${a.claim} — \${yes}/3\`);
  if (yes >= 2) confirmed.push(a);
}

// 에디터 — 조립만 (창작 금지, A3)
const brief = confirmed.length
  ? confirmed.sort((x, y) => x.confidence.localeCompare(y.confidence))
      .map((a, i) => \`\${i + 1}. [\${a.angle}·확신도 \${a.confidence}] \${a.claim} (출처: \${a.source})\`).join("\\n")
  : "(게재 가능한 검증 기사 없음 — 취재 범위를 넓히거나 질문을 좁혀라)";
console.log(\`\\n🗞️ 팩트체크 브리핑 — "\${QUESTION}"\\n\${brief}\`);
console.log("\\n👉 C8과 diff를 떠보라 — 바뀐 것은 역할 지침과 계약 필드뿐, 흐름 구조는 동일하다. 골격은 이식된다.");`,
      hints: [
        "reporter 지침의 '출처 없으면 쓰지 마라'가 이 도메인의 scenario(C7 급소)예요 — 도메인마다 '그럴듯함을 걸러내는 필드'가 무엇인지 찾는 게 계약 설계의 핵심입니다.",
        "'반론·한계' 앵글을 기자단에 넣은 이유: 취재 단계에서부터 관점을 분산(A5)하면 한쪽으로 기운 브리핑이 구조적으로 어려워져요 — 검증단만으로 균형을 만들려 하지 마세요.",
        "게재 0건일 때의 메시지도 설계예요 — 빈 결과에 '다음 행동'(범위 확대/질문 축소)을 담는 것, B6 침묵 금지의 마지막 응용.",
      ],
    },
    {
      type: "markdown",
      source: `## 🎓 캡스톤 — 여러분의 세 번째 조직

이제 여러분 차례입니다. **자기 도메인의 멀티에이전트 시스템 1건**을 설계·구현하세요.

> **캡스톤 요구사항**
> 1. **설계서 먼저** (C7 형식): 요구 정의(무엇이 1순위인가) → 조직안 비교(최소 2안) → 계약 정의
>    (그럴듯함을 걸러낼 급소 필드 명시) → **5대 축 검토표**
> 2. **구현** (C8 골격 재사용 권장): 팬아웃 또는 슈퍼바이저 + 적대적 검증 + 안전측 기본값
> 3. **출고 조건 3종** (C9): 골든 세트(경계 케이스 포함) 성적 + 예산 제한 + 최소 권한 감사
> 4. **트레이스** (C6): 실행 1건의 트리와 비용 회계 첨부
>
> **소재 아이디어**: 계약서 리스크 검토실 / 이력서 스크리닝 위원회 / 콘텐츠 팩트체크 데스크 /
> 고객 문의 분류·초안 팀 / 실험 결과 해석 판정단 — **'틀리면 아픈 판단 + 쪼개지는 조사'**가
> 있는 곳이면 어디든 이 골격이 삽니다.

## 🔭 확장 연구 과제 — 시리즈 너머

| 주제 | 질문 | 힌트 |
|------|------|------|
| 에이전트 간 표준 프로토콜 | 서로 다른 하네스의 에이전트끼리 협업하려면? | A2A 등 표준 프로토콜 동향 — MCP가 도구의 표준이었듯, 에이전트 통신의 표준화가 진행 중 |
| 컴퓨터 사용 팀 | 워커가 브라우저·GUI를 조작한다면 안전 설계는? | C9의 '경계 감사'가 화면 조작에서는 어디까지 확장돼야 하나 |
| 시장 기반 조율 | 고정 조직도 대신 작업을 '입찰'로 배분한다면? | 워커들이 자기 확신도로 응찰 — 슈퍼바이저 없는 분업의 가능성 |
| 장기 실행 조직 | 몇 시간·며칠짜리 임무의 체크포인트·재개는? | 고급1 C8(살아있는 런타임)의 조직 버전 |
| 조직의 평가·운영 | 프로덕션 멀티에이전트의 모니터링·개선 사이클은? | **고급3 (평가·운영) 예고** — 이 시리즈의 다음 이야기 |`,
    },
    {
      type: "markdown",
      source: `## 🏁 고급2 졸업식 — 전체 지도 한 장

> **시리즈 A** — 조직의 언어: 컨텍스트 물리학 → 5대 축(분업·역할·지휘·전달·신뢰) → 실패학
> **시리즈 B** — 조직의 운용: 위임 프롬프트 → 파이프라인·병렬 → 검증 팀 → 자동화 → 성적표 → 매뉴얼
> **시리즈 C** — 조직의 구현: spawn → 레지스트리 → 지휘 패턴 → 계약 → 신경계 → **실전 시스템 2채**
>
> 그리고 처음부터 끝까지 함께한 두 문장:
> **"말 한 마리는 짐을 끌고, 마차단은 도시를 옮긴다."**
> **"멀티는 답이 아니라 비용이다."**
> 이 둘 사이의 긴장을 성적표로 판정할 수 있는 사람 — 그게 멀티에이전트 엔지니어입니다.

> 🎯 **(전부 잊어도 이것만)**
> ## 골격은 이식된다 — 도메인이 바뀌면 역할의 '내용'과 계약의 '급소 필드'만 바뀐다. 신뢰 인프라(검증·예산·권한·트레이스)는 그대로 간다.
> 조직 하나를 지어본 사람은 두 번째를 빨리 짓고, 세 번째(캡스톤)는 여러분의 것이다.

📎 **고급2 완결.** 수고하셨습니다. 다음 시리즈 — **고급3 평가·운영** — 에서 이 조직들을 프로덕션에서 살아남게 만드는 이야기로 이어집니다.

👇 아래 **퀴즈 시작**을 눌러 배운 걸 클릭으로 확인해보세요.`,
    },
  ],

  quiz: {
    title: "고급2·C10강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "코드리뷰 회사를 리서치 뉴스룸으로 바꿀 때 다시 설계해야 했던 것은?",
        options: [
          "팬아웃·검증단·다수결·예산 등 흐름 구조 전체",
          "역할의 내용(지침)과 계약의 급소 필드(scenario→source)뿐 — 골격과 신뢰 인프라는 그대로",
          "프로그래밍 언어 자체",
        ],
        correctIndex: 1,
        explanation:
          "골격은 이식됩니다. 도메인 전환 비용이 '내용 교체'로 떨어지는 것 — 그게 C1~C6에서 부품을 일반화해둔 보상이에요.",
      },
      {
        type: "multiple-choice",
        question: "각 도메인에서 '계약의 급소 필드'가 하는 일은?",
        options: [
          "JSON을 더 길게 만든다",
          "그럴듯하지만 근거 없는 산출물(느낌 발견·출처 없는 기사)을 구조적으로 반려하고, 검증단에게 공격 지점을 제공한다",
          "모델의 창의력을 높인다",
        ],
        correctIndex: 1,
        explanation:
          "코드리뷰의 scenario(재현 경로), 뉴스룸의 source(출처)처럼 도메인마다 '환각이 통과하지 못하는 관문 필드'를 찾는 것이 계약 설계의 핵심입니다.",
      },
      {
        type: "multiple-choice",
        question: "이 시리즈 전체를 관통한 두 명제의 관계로 옳은 것은?",
        options: [
          "'마차단은 도시를 옮긴다'가 항상 이긴다 — 팀은 언제나 정답",
          "'멀티는 비용이다'가 항상 이긴다 — 팀은 언제나 낭비",
          "둘은 긴장 관계이며, 그 판정은 성적표(맞대결·골든 세트)의 숫자가 내린다",
        ],
        correctIndex: 2,
        explanation:
          "팀의 힘과 팀의 비용 — 어느 쪽이 이기는지는 일마다 다르고, 느낌이 아니라 측정(B7·C9)으로 판정합니다. 그 판정 능력이 멀티에이전트 엔지니어의 정체성이에요.",
      },
    ],
  } satisfies Quiz,
};

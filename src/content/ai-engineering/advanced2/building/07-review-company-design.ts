import type { Lesson } from "../../../../types/lesson";
import type { Quiz } from "../../../../types/quiz";

/**
 * 고급2 시리즈C(팀 만들기) 07강 — 실전 ① 설계: 자동 코드리뷰 회사.
 * 요구 정의 → 조직 설계 회의(대안 비교) → 계약 정의 → 5대 축 검토. 코드는 뼈대만.
 */
export const lessonC07: Lesson = {
  id: "ai-eng-a2-c07-review-company-design",
  language: "ai-engineering",
  track: "advanced2",
  order: 27,
  title: "C7. 🏗 실전 ① 설계 — '자동 코드리뷰 회사' 아키텍처",
  subtitle: "코드를 치기 전에 조직도를 그린다 — 설계 회의록 한 편",
  estimatedMinutes: 50,
  cells: [
    {
      type: "markdown",
      source: `# 🏗 고급2·C7강. 실전 ① 설계
### — '자동 코드리뷰 회사' 아키텍처

⏱️ 50분 · 🧰 종이와 연필(진심) + API 키 · 🗺️ 전 축 동원 · 선수: C1~C6

> 💡 **실전 아크 4부작이 시작됩니다.** 목표: PR(코드 변경)을 넣으면 **검증된 리뷰**가 나오는
> 시스템을 처음부터 끝까지 짓는 것. 실제 코딩 에이전트 제품들이 쓰는 구조
> (파인더 팬아웃 → 적대적 검증 → 다수결)를 우리 손으로 재현합니다.
> 오늘은 코드를 거의 치지 않아요. **좋은 시스템은 조직도에서 태어납니다** —
> A 시리즈에서 배운 모든 것을 동원한 설계 회의록 한 편을 씁니다.

### 실전 아크 지도
- **C7 설계** ← 오늘: 요구 → 조직도 → 계약 → 5대 축 검토
- C8 구현: 파인더 팬아웃 + 적대적 검증단
- C9 강화: 평가·예산·안전
- C10 완성: 뉴스룸 일반화 + 캡스톤`,
    },
    {
      type: "markdown",
      source: `## 📋 1. 요구 정의 — 무엇이 '좋은 리뷰'인가

> **입력**: PR (변경된 코드 조각들)
> **출력**: 리뷰 보고서 — 발견(버그·보안·성능) 목록, 각각 **검증된 것만**, 심각도 순
>
> 품질 요구 (틀리면 아픈 순서):
> 1. **오탐(false positive)이 적을 것** — 가짜 지적이 쌓이면 아무도 리뷰를 안 읽게 됨 (신뢰 붕괴)
> 2. 진짜 결함을 놓치지 않을 것 (재현율)
> 3. 발견마다 **위치와 근거**가 있을 것 (개발자가 바로 확인 가능)
>
> 이 순서가 중요합니다 — 오탐 억제가 1순위라는 결정이 아래 조직도의
> **검증단 존재 이유**가 돼요. 요구가 조직을 결정합니다.

## 🏢 2. 설계 회의 — 세 가지 조직안 비교

> **A안. 만능 리뷰어 한 명** (단일 에이전트)
> PR 전체를 한 에이전트가 읽고 리뷰. — A1 3문항 판정: PR이 크면 책상 초과 ✓,
> 버그/보안/성능은 독립 관점 ✓, 오탐은 아픔 ✓ → **팀감이다.** A안 기각.
>
> **B안. 파이프라인** (버그 검사 → 보안 검사 → 성능 검사 → 보고)
> 관점들이 서로의 출력을 기다릴 이유가 없음 — 의존 없는 조각의 줄서기는 낭비 (A2·C3).
> 게다가 앞 검사자의 지적이 뒤 검사자의 컨텍스트를 오염(닻 내림). B안 기각.
>
> **C안. 팬아웃 + 검증단 하이브리드** ✅
> \`\`\`
> PR ─┬─ 파인더(버그 렌즈)   ─┐            ┌─ 검증관 1 ─┐
>     ├─ 파인더(보안 렌즈)   ─┼─ 취합·중복 ─┼─ 검증관 2 ─┼─ 다수결 → 리포터 → 보고서
>     └─ 파인더(성능 렌즈)   ─┘  제거(코드)  └─ 검증관 3 ─┘   (2/3 생존)
> \`\`\`
> - 파인더 3종 **병렬** (독립 렌즈, C3 팬아웃) — 많이 찾는 게 임무. 오탐 걱정은 다음 관문에게
> - 발견별 **검증단 3인** (A5·B5의 코드화) — "반박하라"가 임무. 여기서 오탐이 죽는다
> - 리포터가 생존 발견만 심각도 순으로 조립
>
> **역할 분리의 미학**: 파인더에게 '정확히 찾아라'라고 하면 소극적이 됩니다.
> **찾는 자는 과감하게, 죽이는 자는 무자비하게** — 서로 다른 실패 성향을 가진
> 두 관문을 직렬로 놓으면 재현율과 정밀도를 **동시에** 얻어요. 이게 이 구조가 업계 표준이 된 이유.`,
    },
    {
      type: "markdown",
      source: `## 📜 3. 계약 정의 — 조직의 헌법 두 조항

C5에서 배운 대로, 코드를 치기 전에 **계약부터** 확정합니다.

> **Finding 계약** (파인더 → 취합 → 검증단)
> \`\`\`
> { file: string, line: number,        // 위치 — 검증관이 원본을 찾아가는 주소 (C5 '위치를 넘겨라')
>   lens: "bug"|"security"|"perf",     // 어느 렌즈의 발견인가
>   claim: string,                     // 무엇이 문제인가 (1문장)
>   scenario: string,                  // 어떤 입력에서 어떻게 잘못되나 — '그럴듯함'을 걸러내는 핵심 필드!
>   severity: "high"|"mid"|"low" }
> \`\`\`
>
> **Verdict 계약** (검증관 → 다수결)
> \`\`\`
> { finding_ref: string,               // 어느 발견에 대한 판정인가
>   verdict: "confirmed"|"refuted",    // 이지선다 — '애매함'은 허용 안 함 (다수결이 겹침을 처리)
>   reason: string }                   // 반박 시도의 기록
> \`\`\`
>
> \`scenario\` 필드가 이 시스템의 급소예요. '이 코드는 위험해 보임'(느낌)은 반려되고,
> '빈 배열이 들어오면 0으로 나눠서 crash'(재현 경로)만 통과됩니다 —
> 검증관은 이 시나리오를 **재현 시도**하는 것으로 반박을 시작해요.

## 🗺️ 4. 5대 축 설계 검토 — 출고 전 점검

| 축 | 이 설계의 답 | 근거 강 |
|------|-------------|---------|
| ① 분업 | 렌즈별 팬아웃 (독립) + 검증 직렬 | A2·C3 |
| ② 역할 | 파인더(과감)·검증관(무자비)·리포터(조립만) — 전원 읽기 전용 | C2 |
| ③ 지휘 | 결정적 (흐름이 뻔함 — 슈퍼바이저 불필요) | C3·C4 |
| ④ 전달 | Finding/Verdict 스키마 + file:line이 원본 위치 | C5 |
| ⑤ 신뢰 | 검증단 2/3 다수결 + (C9에서) 골든 PR 회귀·예산 | A5·B5 |

전 축에 답이 있고, 각 답에 배운 강이 붙습니다 — 설계란 배운 원칙을 **배치**하는 일이에요.`,
    },
    {
      type: "llm-code",
      language: "typescript",
      source: `// ── 오늘의 코드: 뼈대만 — 타입과 흐름 시그니처를 '컴파일되는 설계서'로 ──
// (구현은 C8에서. 오늘은 설계가 코드 형태로 성립하는지만 확인한다)

type Finding = { file: string; line: number; lens: "bug" | "security" | "perf"; claim: string; scenario: string; severity: "high" | "mid" | "low" };
type Verdict = { finding_ref: string; verdict: "confirmed" | "refuted"; reason: string };

// 조직도가 그대로 함수 시그니처가 된다
declare function runFinder(lens: Finding["lens"], pr: string): Promise<Finding[]>;          // C3 팬아웃으로 3렌즈
declare function dedup(all: Finding[]): Finding[];                                          // 코드로 (file:line 키) — LLM 불필요!
declare function runVerifier(f: Finding, pr: string, viewpoint: string): Promise<Verdict>;  // 발견당 3인
declare function report(confirmed: Finding[]): Promise<string>;                             // 심각도 순 조립

async function reviewCompany(pr: string): Promise<string> {
  // 1) 파인더 팬아웃 (병렬 — C3, 부분 실패 격리 포함 예정)
  const lenses: Finding["lens"][] = ["bug", "security", "perf"];
  const found = (await Promise.all(lenses.map((l) => runFinder(l, pr)))).flat();
  // 2) 중복 제거 — 판단이 필요 없는 일은 LLM에게 시키지 않는다 (비용 원칙)
  const unique = dedup(found);
  // 3) 발견별 검증단 3인 → 2/3 생존 (배리어 없음: 발견별로 독립 진행 가능 — C3 배리어 원칙)
  const survived: Finding[] = [];
  for (const f of unique) {
    const verdicts = await Promise.all(["재현 관점", "코드 맥락 관점", "심각도 관점"].map((v) => runVerifier(f, pr, v)));
    if (verdicts.filter((x) => x.verdict === "confirmed").length >= 2) survived.push(f);
  }
  // 4) 보고서
  return report(survived.sort((a, b) => a.severity.localeCompare(b.severity)));
}
console.log("✅ 설계가 타입으로 성립한다 — reviewCompany:", typeof reviewCompany);
console.log("👉 declare 함수 4개가 C8의 작업 목록이다. 설계서가 곧 할 일 목록이 되는 것 — 이게 '컴파일되는 설계'의 힘.");`,
      hints: [
        "dedup을 LLM이 아닌 코드로 하는 결정에 주목 — file:line 키 비교는 판단이 아니라 계산이에요. '판단이 필요 없는 일은 모델에게 시키지 않는다'가 비용 설계의 기본기입니다.",
        "검증단 3인의 관점(재현·맥락·심각도)이 A5의 '렌즈 분산'이에요 — 같은 반박이라도 다른 각도에서. 셋 다 같은 지시면 다수결의 의미가 약해집니다.",
        "declare 뼈대를 먼저 컴파일해보는 습관: 타입이 안 맞는 설계는 조직도도 안 맞는 경우가 많아요. 설계 검토를 컴파일러에게도 시키는 셈.",
      ],
    },
    {
      type: "markdown",
      source: `## 🔬 연구 노트 — C7

1. **요구 순서 뒤집기**: 만약 '놓침 최소화(재현율)'가 1순위라면 조직이 어떻게 바뀌어야 하나? (힌트: 다수결 문턱 2/3→1/3, 파인더 렌즈 추가 — 오탐과의 트레이드오프를 설계로 표현해보라.)
2. **네 번째 렌즈**: '가독성' 렌즈를 추가한다면 Finding 계약은 그대로 쓸 수 있는가? scenario 필드가 문제라면(가독성엔 재현 경로가 없다) 계약을 어떻게 확장할지 설계하라.
3. **설계 회의 재연**: 여러분의 실제 반복 업무 하나로 오늘의 회의(요구→3안 비교→계약→5축 검토)를 재연하라 — B8 매뉴얼의 개발자 버전이 나온다.

> 🎯 **(전부 잊어도 이것만)**
> ## 요구가 조직을 결정한다 — '오탐 억제 1순위'가 **파인더(과감)와 검증단(무자비)의 직렬 구조**를 낳았다. 계약의 급소는 scenario(재현 경로) 필드.
> 그리고 설계는 배운 원칙의 배치다 — 5대 축 전부에 답과 근거 강이 붙어야 출고.

📎 **다음 강 — C8. 실전 ② 구현**: declare 4개를 진짜 코드로. 결함을 심은 샘플 PR에서 **가짜 발견이 검증단에 걸려 죽는 순간**을 직접 목격합니다 — 이 아크의 하이라이트.`,
    },
  ],

  quiz: {
    title: "고급2·C7강 — 배운 것 확인하기",
    questions: [
      {
        type: "multiple-choice",
        question: "'파인더는 과감하게, 검증관은 무자비하게' 구조가 노리는 것은?",
        options: [
          "에이전트들의 성격 다양성 그 자체",
          "서로 다른 실패 성향의 두 관문을 직렬로 놓아 재현율과 정밀도를 동시에 얻는 것",
          "파인더의 기를 살려주는 것",
        ],
        correctIndex: 1,
        explanation:
          "한 에이전트에게 '많이, 그리고 정확히'를 동시에 요구하면 둘 다 어중간해져요. 찾기와 죽이기를 분리하면 각자 극단으로 최적화할 수 있습니다.",
      },
      {
        type: "multiple-choice",
        question: "Finding 계약에서 scenario(어떤 입력에서 어떻게 잘못되나) 필드가 급소인 이유는?",
        options: [
          "보고서를 길어 보이게 해서",
          "'위험해 보임' 같은 느낌을 반려하고, 검증관이 재현 시도로 반박할 수 있는 구체적 경로를 강제하기 때문",
          "scenario가 없으면 JSON이 파싱되지 않아서",
        ],
        correctIndex: 1,
        explanation:
          "환각의 무기는 그럴듯함(A5)이에요. 재현 경로를 계약으로 강제하면 검증관에게 '공격 지점'이 생기고, 느낌뿐인 발견은 여기서 걸러집니다.",
      },
      {
        type: "multiple-choice",
        question: "dedup(중복 제거)을 LLM이 아닌 일반 코드로 구현하는 이유는?",
        options: [
          "LLM은 중복을 이해하지 못해서",
          "file:line 키 비교는 판단이 아닌 계산이므로 — 판단이 필요 없는 일은 모델에게 시키지 않는 게 비용 설계의 기본",
          "코드가 LLM보다 항상 정확해서",
        ],
        correctIndex: 1,
        explanation:
          "모델 호출은 조직에서 가장 비싼 자원이에요. 계산으로 되는 일에 판단력을 쓰는 건 지휘자가 연주하는 것과 같은 낭비입니다.",
      },
    ],
  } satisfies Quiz,
};

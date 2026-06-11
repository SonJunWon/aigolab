import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 27강 — LLM 기반 데이터 생성 + 품질 게이트 (모듈 5)
 * 생성+즉시 필터. AI-try는 마크다운 프롬프트. 코드 검증: 로컬 통과(후보 5→게이트 통과 2).
 */
export const kd27: Course = {
  id: "kd-27-llm-generation-gate",
  title: "LLM으로 데이터 생성 + 품질 게이트",
  subtitle: "초안은 AI가, 편집(검수)은 규칙이",
  icon: "🚪",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 227,
  sections: [
    {
      type: "text",
      content: `# 🚪 만들자마자 거른다 — 생성 + 게이트

교사 LLM으로 데이터를 **생성**하는 건 빨라요(모듈 4). 하지만 그대로 쓰면 위험 — 교사도 **무성의·중복·틀린 답**을 뱉거든요. 그래서 **생성 직후 즉시 품질 게이트**로 거릅니다.

> 🃏 **생성 → 게이트 파이프라인**
> 1. **생성**: 교사 LLM에게 (지시, 응답) 쌍을 대량 요청.
> 2. **게이트(즉시 필터)**: 통과한 것만 데이터셋에 추가.
>    - **길이**: 너무 짧은 답(\`"ok"\`, \`"모르겠어요"\`) 탈락.
>    - **무성의/거부**: 정해진 금칙 패턴 포함 시 탈락.
>    - **중복**: 이미 본 응답이면 탈락(다양성 확보).
>    - **형식**: 코드 문제면 \`def\`·실행 가능 여부 등 도메인 규칙.

> 🪄 **비유**: **초안은 AI가 빠르게**, **편집(검수)은 깐깐한 편집자(게이트)가**. 통과 못 한 원고는 책에 안 실어요.

> 🔑 게이트는 처음엔 **간단한 규칙**으로 충분. 더 정교하게는 **LLM-as-Judge**(모듈 6)로 점수를 매겨 거르기도 해요.`,
    },
    {
      type: "code",
      title: "🧪 생성 후보 → 품질 게이트 통과시키기",
      content: `교사가 만든 후보 5개(일부는 불량·중복)를 **길이·무성의·중복·형식** 게이트로 걸러요. \`▶ 실행\``,
      code: `# 교사가 만든 (지시,응답) 후보 — 일부는 품질 불량
candidates = [
    {"instruction": "리스트의 합을 구하는 함수", "output": "def s(xs): return sum(xs)"},
    {"instruction": "리스트의 합을 구하는 함수", "output": "음... 잘 모르겠어요"},          # 무성의
    {"instruction": "짝수만 거르는 함수",       "output": "def f(xs): return [x for x in xs if x%2==0]"},
    {"instruction": "짝수만 거르는 함수",       "output": "def f(xs): return [x for x in xs if x%2==0]"},  # 중복
    {"instruction": "평균을 구하라",            "output": "ok"},                              # 너무 짧음
]

REFUSE = ["모르", "ok", "죄송", "할 수 없"]
def quality(ex):
    out = ex["output"]
    if len(out) < 15:                         return 0   # 길이 게이트
    if any(r in out for r in REFUSE):          return 0   # 무성의/거부 게이트
    if "def" not in out:                       return 1   # 코드 아님(보류)
    return 2                                              # 코드 포함 = 양질

seen, passed = set(), []
for ex in candidates:
    if ex["output"] in seen:                  continue   # 중복 게이트
    seen.add(ex["output"])
    if quality(ex) >= 2:
        passed.append(ex)

print(f"생성 후보 {len(candidates)}개 → 게이트 통과 {len(passed)}개\\n")
for p in passed:
    print("  ✅", p["instruction"], "→", p["output"])
print("\\n👉 생성은 빠르게, '길이·무성의·중복·형식' 게이트로 즉시 품질 보증")`,
      codeLanguage: "python",
      codeHint: "게이트 기준(최소 길이 15, REFUSE 목록)을 바꿔보세요. 너무 빡세면 좋은 데이터까지 버리고, 너무 느슨하면 불량이 통과해요. 균형이 핵심.",
    },
    {
      type: "text",
      title: "🙋 직접 해보기 — 내 AI로 생성+자가 채점",
      content: `여러분의 AI(ChatGPT·Claude 등)에 아래를 넣으면 '생성 + 게이트'를 한 번에 시킬 수 있어요.

> 📋 **복사해서 써보세요**
> \`\`\`
> 파이썬 코딩 '지시-응답' 쌍 5개를 만들어줘. 각 응답은 실행 가능한 코드여야 해.
> 그리고 각 쌍에 대해 스스로 0~2점 품질 점수와 이유도 매겨줘.
> 형식: {"instruction":..., "output":..., "score":..., "reason":...}
> \`\`\`

이렇게 **생성과 1차 채점을 교사에게** 시키고, 그다음 우리 규칙 게이트로 **2차 필터**를 거는 게 실무 흐름이에요.

> 🎯 **(핵심)**
> - **생성 직후 즉시 게이트** — 길이·무성의·중복·형식.
> - 처음엔 **간단한 규칙**으로 충분, 정교하게는 **LLM-as-Judge**(모듈 6).
> - 교사도 실수한다 → **만들자마자 거른다**가 철칙.

게이트의 '기본 필터'를 다음 두 강에서 더 깊게 — **28강(중복·길이·품질)**, **29강(독성·편향·다양성)** 으로 들어갑니다. 🧹`,
    },
  ],
  quiz: {
    title: "27강 — 생성 + 게이트 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "교사 LLM으로 데이터를 생성할 때 '게이트'가 필요한 이유는?",
        options: [
          "교사도 무성의·중복·틀린 답을 내므로 즉시 걸러야 해서",
          "생성이 너무 느려서",
          "데이터가 너무 적어서",
        ],
        correctIndex: 0,
        explanation:
          "교사 모델도 완벽하지 않아 무성의하거나 중복·오류가 섞여요. 생성 직후 품질 게이트로 즉시 걸러야 데이터셋이 깨끗해집니다.",
      },
      {
        type: "multiple-choice",
        question: "다음 중 기본 품질 게이트로 적절하지 않은 것은?",
        options: [
          "너무 짧은 답 제거(길이)",
          "이미 본 응답 제거(중복)",
          "응답이 길수록 무조건 통과",
        ],
        correctIndex: 2,
        explanation:
          "길이는 '너무 짧음'을 거르는 용도지 길수록 좋은 건 아니에요. 길이·무성의·중복·형식 같은 기준을 균형 있게 써야 합니다.",
      },
      {
        type: "multiple-choice",
        question: "규칙 게이트보다 더 정교하게 품질을 거르는 방법은?",
        options: [
          "데이터를 무작위로 버린다",
          "LLM-as-Judge로 점수를 매겨 거른다",
          "게이트를 없앤다",
        ],
        correctIndex: 1,
        explanation:
          "간단한 규칙으로 시작하되, 더 정교하게는 LLM-as-Judge(모듈 6)로 응답 품질에 점수를 매겨 걸러낼 수 있어요.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-28-cleaning-basic",
};

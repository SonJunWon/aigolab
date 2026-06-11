import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 9강 — MoE 기본 (모듈 2)
 * 총 vs 활성 파라미터, 전문가·라우터·top-K. 코드 검증: 로컬 numpy 통과(미니 MoE, 3.4배 절감).
 */
export const kd09: Course = {
  id: "kd-09-moe-basics",
  title: "MoE 기본 — 지식은 크게, 계산은 작게",
  subtitle: "전문가 256명, 매번 8명만 일한다",
  icon: "🏥",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 22,
  order: 209,
  sections: [
    {
      type: "text",
      content: `# 🏥 MoE — '종합병원' 구조

지금까지 "작은 모델"을 만드는 법(증류·스케일링)을 봤어요. 이제 **구조 자체로** 효율을 내는 트릭 — **MoE(Mixture of Experts, 전문가 혼합)** 입니다.

> 🃏 **핵심 아이디어: 지식(총 파라미터)과 비용(활성 파라미터)을 '분리'**
> 보통 모델은 모든 파라미터가 매번 다 일해요. MoE는 다릅니다.

> 🏥 **종합병원 비유**
> - 병원엔 **전문의 256명**(전문가 = expert)이 있어요. → 엄청난 **지식**.
> - 환자(토큰)가 오면 **안내데스크(라우터 = router)** 가 보고 **딱 맞는 전문의 8명만 호출**(top-K).
> - 나머지 248명은 쉼. → **인건비(계산)는 8명치만**.
> 결과: **지식은 병원 전체(256명), 비용은 8명치.** 이게 MoE!

> 🔑 그래서 DeepSeek 같은 모델은 "총 671B인데 토큰당 37B만 활성"이라고 말해요(다음 강). 거대한 지식을 **싸게** 쓰는 비결입니다.`,
    },
    {
      type: "code",
      title: "🧪 미니 MoE 직접 돌려보기",
      content: `전문가 8명짜리 작은 MoE를 numpy로 만들어, **한 토큰이 실제로 몇 명만 쓰는지**와 **계산을 얼마나 아끼는지** 봅니다. \`▶ 실행\``,
      code: `import numpy as np
rng = np.random.default_rng(0)
n_experts, d, top_k = 8, 16, 2

# 전문가 = 각자 작은 FFN(가중치). 라우터 = 토큰을 보고 어느 전문가로 보낼지 점수
experts = [rng.normal(0, 0.3, (d, d)) for _ in range(n_experts)]
W_router = rng.normal(0, 0.3, (d, n_experts))

def moe_forward(x):
    scores = x @ W_router                 # 전문가별 점수
    gate = np.exp(scores - scores.max()); gate = gate / gate.sum()
    topk = np.argsort(gate)[-top_k:]      # 점수 높은 top-K 전문가만 활성!
    out = sum(gate[e] * (x @ experts[e]) for e in topk)
    return topk

x = rng.normal(0, 1, d)
used = moe_forward(x)
total = n_experts * d * d + d * n_experts      # 전문가 8명분 = 지식
active = top_k * d * d + d * n_experts         # top-2명분 = 이번 계산

print(f"전문가 {n_experts}명 중 이번 토큰이 쓴 전문가: {sorted(used.tolist())}  ({top_k}명만!)")
print(f"총 파라미터:   {total:,}   ← 지식(병원 전체)")
print(f"활성 파라미터: {active:,}   ← 비용(이번에 일한 의사)")
print(f"\\n→ 계산을 약 {total/active:.1f}배 절약. 지식은 크게, 계산은 작게! 🏥")`,
      codeLanguage: "python",
      codeHint: "top_k 를 1이나 4로 바꿔보세요. 적게 쓸수록 더 싸지만(빠르지만) 표현력은 줄어요 — 그 균형이 MoE 설계의 핵심.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - **전문가(expert)**: 각자 일부를 담당하는 작은 FFN들.
> - **라우터(router)**: 토큰마다 **어느 전문가에게 보낼지** 정함.
> - **top-K**: 전문가 전체 중 **K명만 활성** → 계산 절약.
> - **총 파라미터(지식) ≠ 활성 파라미터(비용)** — 이게 MoE의 정체성.

그런데 라우터가 **특정 전문가에게만 일을 몰아주면** 어떻게 될까요? 다음 강에서 '부하 균형' 문제를 직접 봅니다. ⚖️`,
    },
  ],
  quiz: {
    title: "9강 — MoE 기본 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "MoE의 핵심 아이디어는?",
        options: [
          "모든 파라미터를 항상 다 쓴다",
          "총 파라미터(지식)와 활성 파라미터(비용)를 분리해, 토큰마다 일부 전문가만 쓴다",
          "전문가를 1명만 둔다",
        ],
        correctIndex: 1,
        explanation:
          "MoE는 전문가를 많이 두되(총 파라미터=지식), 토큰마다 라우터가 top-K명만 활성화(활성 파라미터=비용)해요. 지식은 크게, 계산은 작게입니다.",
      },
      {
        type: "multiple-choice",
        question: "'라우터(router)'의 역할은?",
        options: [
          "토큰마다 어느 전문가에게 보낼지 정한다",
          "전문가를 삭제한다",
          "데이터를 저장한다",
        ],
        correctIndex: 0,
        explanation:
          "라우터는 종합병원의 안내데스크처럼, 들어온 토큰을 보고 적합한 전문가 top-K명에게 배정합니다.",
      },
      {
        type: "multiple-choice",
        question: "'총 671B인데 활성 37B'라는 표현의 의미는?",
        options: [
          "지식은 671B만큼 크지만, 토큰당 계산 비용은 37B치만 든다",
          "모델이 고장났다",
          "671B를 매번 다 계산한다",
        ],
        correctIndex: 0,
        explanation:
          "MoE라서 전체 지식은 671B 규모지만 토큰당 활성화되는 건 37B뿐이에요. 거대한 지식을 싸게 쓰는 게 핵심입니다.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-10-routing-balance",
};

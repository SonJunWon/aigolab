import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 10강 — 라우팅과 부하 균형 (모듈 2)
 * 전문가 쏠림(rich-get-richer)과 aux loss 균형. 코드 검증: 로컬 numpy 통과(50배→1배).
 */
export const kd10: Course = {
  id: "kd-10-routing-balance",
  title: "라우팅과 부하 균형 — 쏠림을 막아라",
  subtitle: "인기 전문가만 일하면 MoE가 망가진다",
  icon: "⚖️",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 210,
  sections: [
    {
      type: "text",
      content: `# ⚖️ 라우팅의 함정 — '쏠림'

MoE의 라우터가 전문가를 골라준다고 했죠. 그런데 학습 초기에 **고질적인 문제**가 생겨요.

> 🃏 **부자가 더 부자 되는 문제 (rich-get-richer)**
> 어쩌다 일을 많이 받은 전문가가 → 더 똑똑해지고 → 라우터가 더 많이 보내고 → 더 똑똑해지고… **소수에게만 쏠려요.** 나머지 전문가는 놀고먹고(죽은 전문가).

> 🪄 **비유 — 콜센터**: 인기 상담사에게만 전화가 몰리면 그 사람은 과부하, 나머지는 한가. **전체 처리량이 오히려 떨어져요.** 256명을 뒀는데 8명만 일하면 MoE의 의미가 없죠.

> 🃏 **해결책**
> - **부하 균형 손실(auxiliary loss)**: "골고루 가라"는 페널티를 줘서 분산 유도.
> - **공유 전문가(shared expert)**: 공통 패턴은 항상 켜진 전문가가 담당(DeepSeek 방식, 다음 강).`,
    },
    {
      type: "code",
      title: "🧪 쏠림 → 균형, before / after",
      content: `부하 균형이 **없을 때(쏠림)** 와 **있을 때(골고루)** 를 직접 비교해요.
\`▶ 실행\` — 막대그래프로 전문가별 처리량을 봅니다.`,
      code: `import numpy as np
rng = np.random.default_rng(1)
n_experts, n_tokens, top_k = 8, 3000, 2

# 학습 초기엔 '인기 전문가 쏠림'이 잘 생김 → 인기 편향으로 흉내
pop_bias = np.array([3.0, 2.5, 2.0, 0, 0, 0, 0, 0])   # 0~2번이 인기
base = rng.normal(0, 1.0, (n_tokens, n_experts))

def show(title, counts):
    print(title)
    for e in range(n_experts):
        bar = "#" * (int(counts[e]) * 28 // max(int(counts.max()), 1))
        print(f"  전문가 {e}: {int(counts[e]):>5} {bar}")
    print(f"  -> 최다/최소 = {counts.max()/max(counts.min(),1):.0f}배\\n")

# ① 부하 균형 없음
c1 = np.zeros(n_experts)
for s in base + pop_bias:
    for e in np.argsort(s)[-top_k:]:
        c1[e] += 1
show("① 부하 균형 없음 — 소수에게 쏠림:", c1)

# ② 부하 균형: 많이 쓴 전문가일수록 점수를 깎아 분산 (aux loss 아이디어)
c2 = np.zeros(n_experts)
for s in base + pop_bias:
    s = s - 0.02 * c2
    for e in np.argsort(s)[-top_k:]:
        c2[e] += 1
show("② 부하 균형 적용 — 골고루:", c2)
print("👉 균형을 안 주면 전문가 대부분이 '죽고', 주면 256명 모두가 일합니다.")`,
      codeLanguage: "python",
      codeHint: "①은 0~2번 전문가에 50배 쏠림(나머지는 죽음). ②는 '많이 쓴 전문가 점수 깎기'로 골고루 — 이게 부하 균형 손실의 핵심 아이디어.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - 라우팅은 **소수 전문가 쏠림(rich-get-richer)** 에 취약 → 전문가가 죽으면 MoE 무의미.
> - **부하 균형 손실(aux loss)** 로 골고루 가게 유도.
> - **공유 전문가**는 공통 패턴을 안정적으로 처리.

이제 진짜 모델은 이걸 어떻게 할까요? 다음 강에서 **DeepSeek MoE** 의 실제 구조(공유 전문가·세분화·MLA)와 모델 스펙 읽는 법을 봅니다. 🐋`,
    },
  ],
  quiz: {
    title: "10강 — 라우팅·부하 균형 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "MoE 라우팅의 '쏠림(rich-get-richer)' 문제란?",
        options: [
          "모든 전문가가 똑같이 일한다",
          "소수 인기 전문가에게만 일이 몰리고 나머지는 놀게 되어 MoE 효과가 사라진다",
          "전문가가 늘어난다",
        ],
        correctIndex: 1,
        explanation:
          "일을 많이 받은 전문가가 더 똑똑해져 더 많이 받는 악순환으로 소수에 쏠려요. 전문가 대부분이 '죽으면' 많은 전문가를 둔 의미가 없어집니다.",
      },
      {
        type: "multiple-choice",
        question: "쏠림을 막는 대표적 방법은?",
        options: [
          "부하 균형 손실(aux loss)로 골고루 가도록 페널티를 준다",
          "전문가를 1명으로 줄인다",
          "라우터를 끈다",
        ],
        correctIndex: 0,
        explanation:
          "많이 쓰인 전문가의 점수를 깎는 부하 균형 손실로 분산을 유도합니다. 공유 전문가로 공통 패턴을 처리하는 방법도 함께 써요.",
      },
      {
        type: "multiple-choice",
        question: "부하 균형이 중요한 이유는?",
        options: [
          "전문가를 골고루 써야 많은 전문가를 둔 의미(지식)가 살아난다",
          "느리게 만들려고",
          "비용을 늘리려고",
        ],
        correctIndex: 0,
        explanation:
          "256명을 뒀는데 8명만 일하면 MoE의 지식 이점이 사라져요. 골고루 써야 전체 전문가의 지식이 활용됩니다.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-11-deepseek-moe",
};

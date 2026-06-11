import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 11강 — 실전 MoE: DeepSeek MoE (모듈 2)
 * 공유/세분화 전문가·MLA, 모델 스펙 읽기. 코드: 순수 파이썬(스펙 계산기).
 */
export const kd11: Course = {
  id: "kd-11-deepseek-moe",
  title: "실전 MoE — DeepSeek 모델 읽기",
  subtitle: "671B인데 37B만 쓴다는 게 무슨 뜻일까",
  icon: "🐋",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 20,
  order: 211,
  sections: [
    {
      type: "text",
      content: `# 🐋 실전 MoE — DeepSeek의 설계

이론은 봤으니 **진짜 모델**을 읽어봐요. 2026년엔 거의 모든 대형 모델이 MoE예요.

> 🃏 **DeepSeek-V3 스펙 (예시)**
> - **총 파라미터 671B**, **토큰당 활성 37B** (약 1/18!)
> - 라우티드 전문가 **256개 중 8개** 활성 + **공유 전문가**(항상 켜짐)

> 🃏 **DeepSeek식 영리한 장치**
> - **공유 전문가(shared)**: 공통 패턴(문법 등)은 **항상 켜진** 전문가가 처리 → 라우티드 전문가는 '특기'에 집중.
> - **세분화 전문가(fine-grained)**: 전문가를 잘게 쪼개 더 정교하게 배정.
> - **MLA(Multi-head Latent Attention)**: 어텐션의 **KV 캐시를 압축**해 긴 문맥에서 메모리를 5~8배 절약. → MoE가 계산을 아끼면, MLA는 메모리를 아껴요.

> 🪄 **비유**: 공유 전문가 = **모든 환자를 먼저 보는 일반의**, 라우티드 전문가 = **필요할 때만 부르는 전문의**. 효율적인 진료 동선!`,
    },
    {
      type: "code",
      title: "🧪 모델 스펙 계산기 — 총 vs 활성, 메모리 vs 속도",
      content: `MoE 모델의 스펙을 넣으면 **'지식(메모리)'과 '비용(속도)'** 이 어떻게 갈리는지 계산해요. \`▶ 실행\``,
      code: `# MoE 모델 스펙 읽기 (예시: DeepSeek-V3 풍)
total_B = 671        # 총 파라미터(B) — 모델이 '아는 것'의 양 (메모리에 다 올려야 함)
active_B = 37        # 토큰당 활성(B) — 한 토큰 처리 '비용' (속도에 직결)
routed, active_routed = 256, 8   # 라우티드 전문가 256개 중 8개 활성

print(f"총 파라미터:   {total_B}B   → 메모리/저장 부담 (지식의 양)")
print(f"활성 파라미터: {active_B}B   → 토큰당 계산 비용 (속도)")
print(f"활성 비율:     {active_B/total_B*100:.1f}%   (1/{total_B/active_B:.0f} 만 일함)\\n")

# 같은 '활성 37B'를 일반(dense) 모델로 내려면?
print("같은 똑똑함을 얻는 두 길:")
print(f"  · MoE:        지식 {total_B}B 보유 + 토큰당 {active_B}B 계산 (똑똑하고 빠름, 단 메모리 큼)")
print(f"  · Dense 37B:  지식 37B + 토큰당 37B 계산 (메모리 작지만 지식 적음)")
print(f"\\n👉 MoE의 거래: '메모리를 더 쓰는 대신, 같은 속도로 훨씬 똑똑'")
print("   모델 고를 때 → 총 파라미터(메모리) vs 활성(속도)를 따로 보세요!")`,
      codeLanguage: "python",
      codeHint: "모델 카드에서 '총 파라미터'는 필요한 메모리, '활성 파라미터'는 추론 속도를 가늠하는 숫자예요. MoE는 메모리↔속도의 거래입니다.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - 모델 카드의 **'총 vs 활성'** 을 읽을 줄 알아야 한다(메모리 vs 속도).
> - **공유 전문가**(공통) + **라우티드 전문가**(특기) 조합.
> - **MLA** = KV 캐시 압축으로 긴 문맥 메모리 절약.
> - MoE의 거래: **메모리를 더 쓰는 대신, 같은 속도로 더 똑똑.**

🎉 여기까지가 '작은/효율 모델'의 **구조** 이야기예요. 다음 강부터는 모델을 **내 용도로 길들이는 법** — **SFT(파인튜닝)** 로 넘어갑니다. ✍️`,
    },
  ],
  quiz: {
    title: "11강 — DeepSeek MoE 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "MoE 모델의 '총 파라미터'와 '활성 파라미터'가 각각 가리키는 것은?",
        options: [
          "총=속도, 활성=메모리",
          "총=메모리/지식의 양, 활성=토큰당 계산 비용(속도)",
          "둘 다 같은 것이다",
        ],
        correctIndex: 1,
        explanation:
          "총 파라미터는 모델이 아는 것(메모리에 올려야 할 양), 활성 파라미터는 토큰당 계산 비용(속도)이에요. 모델 선택 시 둘을 따로 봐야 합니다.",
      },
      {
        type: "multiple-choice",
        question: "DeepSeek의 '공유 전문가(shared expert)' 역할은?",
        options: [
          "항상 켜져서 공통 패턴을 처리(라우티드 전문가는 특기에 집중)",
          "절대 켜지지 않는다",
          "라우터를 대체한다",
        ],
        correctIndex: 0,
        explanation:
          "공유 전문가는 모든 토큰을 보는 일반의처럼 공통 패턴을 담당해, 라우티드 전문가들이 각자의 특기에 집중하게 합니다.",
      },
      {
        type: "multiple-choice",
        question: "MLA(Multi-head Latent Attention)가 절약하는 것은?",
        options: [
          "어텐션 KV 캐시 메모리(긴 문맥에서 큰 절약)",
          "전문가 수",
          "데이터 양",
        ],
        correctIndex: 0,
        explanation:
          "MoE가 계산(활성 파라미터)을 아낀다면, MLA는 어텐션의 KV 캐시를 압축해 긴 문맥의 메모리를 5~8배 절약합니다.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-12-sft-concept",
};

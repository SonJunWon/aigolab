import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 15강 — FFT 전체 파인튜닝 (모듈 3)
 * 모든 파라미터 갱신·비용·언제. 코드: 순수 파이썬(메모리 비용 계산).
 */
export const kd15: Course = {
  id: "kd-15-fft",
  title: "FFT — 전체 파인튜닝의 정통(과 비용)",
  subtitle: "모든 파라미터를 다 바꾸면 강력하지만 비싸다",
  icon: "💸",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 18,
  order: 215,
  sections: [
    {
      type: "text",
      content: `# 💸 FFT — 전체 파인튜닝(Full Fine-Tuning)

가장 정통적인 SFT 방법은 **모델의 모든 파라미터를 다시 학습**하는 거예요. 강력하지만… **비쌉니다.**

> 🃏 **FFT란?**
> 사전학습된 모델의 **모든 가중치**를 우리 데이터로 업데이트. 모델이 가장 자유롭게 변할 수 있음.

> 🃏 **문제 — 메모리 폭탄 💣**
> 7B(70억) 모델을 FFT하려면, 가중치만이 아니라 **그래디언트 + 옵티마이저 상태(Adam은 2배)** 까지 메모리에 올려야 해요. 대략 **모델 크기의 12~16배 메모리**가 필요. → 7B면 **80GB+ GPU**가 여러 장.

> 🪄 **비유**: 책 한 권을 고치는데 **책 전체를 처음부터 다시 쓰는** 것. 한 줄 고치려고 전권을 다시 쓰니 비싸죠.

> 🔑 그래서 대부분은 FFT 대신 **PEFT(다음 강)** 를 써요. FFT는 자원이 충분하고 큰 변화가 필요할 때만.`,
    },
    {
      type: "code",
      title: "🧪 FFT 메모리 비용 계산기",
      content: `모델 크기별로 FFT에 필요한 **대략적 메모리**를 계산해요(가중치+그래디언트+Adam 상태). \`▶ 실행\``,
      code: `# FFT 메모리 어림 계산 (fp16 가중치 2바이트 기준)
# 필요 ≈ 모델(2) + 그래디언트(2) + Adam 상태 모멘텀·분산(2+2) ... 활성값까지 보통 12~16배
def fft_mem_gb(params_B, bytes_per=2, mult=14):
    return params_B * 1e9 * bytes_per * mult / 1e9   # GB

print(f"{'모델 크기':<10}{'FFT 필요 메모리(대략)':>22}{'현실':>16}")
print("-" * 50)
for B in [0.5, 1, 7, 13, 70]:
    gb = fft_mem_gb(B)
    reality = "노트북 X" if gb > 24 else "고사양 GPU"
    if gb > 200: reality = "GPU 여러 장"
    print(f"{str(B)+'B':<10}{gb:>18,.0f} GB{reality:>16}")
print("\\n👉 7B만 돼도 ~200GB 급 — 개인이 FFT 하긴 부담. 그래서 다음 강 'PEFT/LoRA'가 등장!")`,
      codeLanguage: "python",
      codeHint: "FFT는 가중치 외에 그래디언트·옵티마이저 상태까지 메모리에 올려서 모델 크기의 12~16배가 필요해요. 그게 LoRA를 쓰는 이유.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - **FFT** = 모든 파라미터 갱신. 가장 자유롭지만 **메모리·비용 폭탄**(모델의 12~16배).
> - 개인·소규모엔 거의 비현실적 → **PEFT** 로 푼다.
> - FFT가 어울리는 경우: 자원 충분 + 모델을 크게 바꿔야 할 때.

다음 강에서 이 문제를 **우아하게** 푸는 법 — **PEFT와 LoRA(포스트잇 비유)** 를 직접 코드로 봅니다. 🪡`,
    },
  ],
  quiz: {
    title: "15강 — FFT 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "FFT(전체 파인튜닝)의 가장 큰 단점은?",
        options: [
          "성능이 절대 안 오른다",
          "모든 파라미터 + 그래디언트 + 옵티마이저 상태로 메모리가 폭증(모델의 12~16배)",
          "데이터가 필요 없다",
        ],
        correctIndex: 1,
        explanation:
          "FFT는 가중치뿐 아니라 그래디언트·Adam 상태까지 메모리에 올려서 모델 크기의 12~16배 메모리가 필요해요. 개인이 7B를 FFT하긴 부담스럽습니다.",
      },
      {
        type: "multiple-choice",
        question: "FFT를 '책 전체를 다시 쓰기'에 비유한 이유는?",
        options: [
          "모든 가중치를 처음부터 다시 학습하기 때문",
          "책을 안 읽기 때문",
          "한 줄만 고치기 때문",
        ],
        correctIndex: 0,
        explanation:
          "FFT는 모델의 모든 파라미터를 업데이트해요. 한 부분만 바꾸려 해도 전체를 다시 쓰는 셈이라 비쌉니다(→ PEFT가 대안).",
      },
      {
        type: "multiple-choice",
        question: "FFT가 어울리는 상황은?",
        options: [
          "노트북 한 대로 가볍게",
          "자원이 충분하고 모델을 크게 바꿔야 할 때",
          "항상 모든 경우",
        ],
        correctIndex: 1,
        explanation:
          "자원이 풍부하고 큰 변화가 필요할 때만 FFT가 합리적이에요. 대부분의 실무는 메모리 효율적인 PEFT/LoRA를 씁니다.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-16-peft-lora",
};

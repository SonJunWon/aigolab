import type { Course } from "../../../types/course";
import type { Quiz } from "../../../types/quiz";

/**
 * 코스 2 「지식 증류」 · 17강 — QLoRA (모듈 3)
 * 4비트 베이스로 무료 Colab까지. 코드: 순수 파이썬(메모리 절감 계산). 양자화=코스 4 연결.
 */
export const kd17: Course = {
  id: "kd-17-qlora",
  title: "QLoRA — 4비트 압축으로 무료 Colab까지",
  subtitle: "두꺼운 책을 압축해 책상에 올리기",
  icon: "🗜️",
  category: "dl",
  level: "intermediate",
  estimatedMinutes: 18,
  order: 217,
  sections: [
    {
      type: "text",
      content: `# 🗜️ QLoRA — LoRA + 양자화

LoRA로 '학습할 양'은 줄였지만, **베이스 모델 자체를 메모리에 올리는 것**은 여전히 부담이에요. 7B 모델을 16비트로 올리면 ~14GB. **QLoRA** 가 이걸 푼다.

> 🃏 **QLoRA = 베이스를 4비트로 '압축'해서 올리고, 그 위에 LoRA 어댑터만 학습**
> - 베이스 가중치를 **16비트 → 4비트**로 양자화(압축) → 메모리 **약 1/4**.
> - 베이스는 4비트로 얼린 채, 작은 LoRA 어댑터(16비트)만 학습.
> - 결과: **메모리 ~75% 절감** → 7B 모델도 **무료 Google Colab GPU(약 15GB)** 에서 파인튜닝 가능!

> 🪄 **비유**: LoRA가 '포스트잇만 붙이기'였다면, QLoRA는 **두꺼운 책을 압축(4비트)해 작은 책상(무료 Colab)에 올려두고** 포스트잇을 붙이는 것.

> 🔑 여기서 **양자화(quantization)** 가 등장해요 — 정밀도를 낮춰 모델을 작게. 이건 **코스 4(양자화)** 의 주제이기도 합니다. QLoRA는 양자화와 파인튜닝의 멋진 만남이에요.`,
    },
    {
      type: "code",
      title: "🧪 QLoRA 메모리 절감 계산기",
      content: `같은 모델을 **FFT vs LoRA(16비트) vs QLoRA(4비트)** 로 올릴 때 메모리를 비교해요. \`▶ 실행\``,
      code: `def mem_gb(params_B, mode):
    P = params_B * 1e9
    if mode == "FFT":        # 가중치+그래디언트+Adam (≈14배, 16비트 기준)
        return P * 2 * 14 / 1e9
    if mode == "LoRA":       # 베이스 16비트(2바이트) + 작은 어댑터(무시 수준)
        return P * 2 / 1e9
    if mode == "QLoRA":      # 베이스 4비트(0.5바이트) + 어댑터 약간
        return P * 0.5 / 1e9 + 1

print(f"{'모델':<8}{'FFT':>12}{'LoRA(16bit)':>16}{'QLoRA(4bit)':>16}")
print("-" * 54)
for B in [1, 3, 7, 13]:
    print(f"{str(B)+'B':<8}{mem_gb(B,'FFT'):>10,.0f}GB{mem_gb(B,'LoRA'):>14,.0f}GB{mem_gb(B,'QLoRA'):>14,.1f}GB")

print("\\n무료 Colab GPU ≈ 15GB 안에 들어오나?")
for B in [7, 13]:
    ok = "✅ 가능" if mem_gb(B,'QLoRA') <= 15 else "❌ 빠듯"
    print(f"  {B}B QLoRA = {mem_gb(B,'QLoRA'):.1f}GB  {ok}")
print("\\n👉 QLoRA 덕에 7B 모델도 무료 Colab에서 파인튜닝! (양자화 = 코스 4)")`,
      codeLanguage: "python",
      codeHint: "베이스를 4비트로 압축하면 메모리가 1/4로. 그래서 7B도 무료 Colab(~15GB)에 들어와요. 어댑터(LoRA)만 학습하니 추가 메모리도 작죠.",
    },
    {
      type: "text",
      content: `> 🎯 **(핵심)**
> - **QLoRA = 4비트 양자화(압축) 베이스 + LoRA 어댑터 학습** → 메모리 ~75% 절감.
> - **7B 모델도 무료 Colab**에서 파인튜닝 가능.
> - 양자화는 **코스 4**의 핵심 주제 — QLoRA가 그 맛보기.

이제 도구로 진짜 해볼 차례예요. 다음 강에서 **TRL·Unsloth** 로 첫 파인튜닝을 (무료 Colab으로) 돌립니다. 🛠️`,
    },
  ],
  quiz: {
    title: "17강 — QLoRA 확인",
    questions: [
      {
        type: "multiple-choice",
        question: "QLoRA의 핵심은?",
        options: [
          "베이스를 4비트로 압축(양자화)해 올리고 그 위에 LoRA 어댑터만 학습",
          "모든 파라미터를 16비트로 학습",
          "데이터를 압축",
        ],
        correctIndex: 0,
        explanation:
          "QLoRA는 베이스 가중치를 4비트로 양자화해 메모리를 ~1/4로 줄이고, 작은 LoRA 어댑터만 학습합니다. 메모리 ~75% 절감으로 무료 Colab도 가능해요.",
      },
      {
        type: "multiple-choice",
        question: "QLoRA 덕분에 가능해진 일은?",
        options: [
          "7B 모델도 무료 Colab GPU(~15GB)에서 파인튜닝",
          "모델이 더 똑똑해짐(지식 증가)",
          "데이터가 필요 없어짐",
        ],
        correctIndex: 0,
        explanation:
          "메모리를 크게 줄여서 7B 같은 모델도 무료 Colab에서 파인튜닝할 수 있게 됐어요. 진입 장벽을 확 낮춘 기법입니다.",
      },
      {
        type: "multiple-choice",
        question: "QLoRA에서 쓰이는 '양자화'는 어느 코스의 주제인가?",
        options: ["코스 4(양자화)", "코스 0(AI 살펴보기)", "양자화는 없다"],
        correctIndex: 0,
        explanation:
          "정밀도를 낮춰 모델을 작게 만드는 양자화는 코스 4의 핵심 주제예요. QLoRA는 양자화와 파인튜닝(LoRA)이 만난 사례입니다.",
      },
    ],
  } satisfies Quiz,
  nextCourseId: "kd-18-trl-unsloth",
};

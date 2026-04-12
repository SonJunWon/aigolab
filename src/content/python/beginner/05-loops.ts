import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson05: Lesson = {
  id: "python-beginner-05",
  language: "python",
  track: "beginner",
  order: 5,
  title: "반복의 힘 — 반복문",
  subtitle: "for 와 while 로 같은 일을 여러 번",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# 🔁 반복의 힘 — 반복문

같은 일을 100번 반복해야 한다면 어떻게 할까요?
\`print\` 를 100번 쓸 수도 있지만... 그건 사람이 할 일이 아니죠 🙅

프로그래밍의 가장 강력한 도구 중 하나가 **반복문(loop)** 입니다.

이번 챕터에서 배울 것:
- \`for\` 반복문 + \`range()\`
- 리스트 순회
- \`while\` 반복문
- \`break\` 와 \`continue\`
- 중첩 반복문`,
    },
    {
      type: "markdown",
      source: `## 🎯 for 반복문 — 횟수가 정해졌을 때

"N번 반복해라" 는 \`for\` + \`range()\` 조합이 가장 흔해요.

\`\`\`python
for 변수 in range(N):
    반복할 코드
\`\`\``,
    },
    {
      type: "code",
      source: `for i in range(5):
    print(f"{i}번째 반복")`,
    },
    {
      type: "markdown",
      source: `**출력 결과**:
\`\`\`
0번째 반복
1번째 반복
2번째 반복
3번째 반복
4번째 반복
\`\`\`

**주목할 점**:
- \`range(5)\` 는 **0, 1, 2, 3, 4** 를 만들어요 (5는 **포함 안 함**)
- \`i\` 라는 변수 이름은 마음대로 바꿔도 돼요 (\`for number in range(5):\`)
- Python은 **0부터** 세요`,
    },
    {
      type: "markdown",
      source: `## 📏 range() 자세히

\`range()\` 는 여러 형태로 쓸 수 있어요:

| 호출 | 생성 | 설명 |
|---|---|---|
| \`range(5)\` | \`0, 1, 2, 3, 4\` | 0부터 5 **전까지** |
| \`range(2, 7)\` | \`2, 3, 4, 5, 6\` | 2부터 7 **전까지** |
| \`range(0, 10, 2)\` | \`0, 2, 4, 6, 8\` | 2씩 증가 |
| \`range(10, 0, -1)\` | \`10, 9, ..., 1\` | 역순 |`,
    },
    {
      type: "code",
      source: `# 1부터 5까지
for n in range(1, 6):
    print(n)

print("---")

# 2씩 증가
for n in range(0, 11, 2):
    print(n)`,
    },
    {
      type: "markdown",
      source: `## 📋 리스트 순회

\`for\` 는 숫자뿐 아니라 **리스트의 모든 원소**를 하나씩 꺼낼 때도 써요.`,
    },
    {
      type: "code",
      source: `fruits = ["사과", "바나나", "오렌지"]

for fruit in fruits:
    print(f"저는 {fruit}를 좋아해요")`,
    },
    {
      type: "markdown",
      source: `리스트의 길이만큼 자동으로 반복하면서 **한 원소씩** \`fruit\` 에 들어갑니다.

> 💡 리스트는 \`[ ]\` 안에 쉼표로 구분된 값을 넣어 만들어요. 다음 챕터에서 자세히 배워요.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**3단 구구단** 을 출력하는 코드를 만들어보세요.

예상 출력:
\`\`\`
3 x 1 = 3
3 x 2 = 6
3 x 3 = 9
...
3 x 9 = 27
\`\`\``,
    },
    {
      type: "code",
      source: `# 3단 구구단을 출력하세요
`,
      hints: [
        "`range(1, 10)` 을 쓰면 1부터 9까지 반복할 수 있어요.",
        "반복문 안에서 `3 * i` 로 곱셈 결과를 계산해요.",
        "`print(f\"3 x {i} = {3 * i}\")` 형태로 출력하면 깔끔해요.",
      ],
      solution: `for i in range(1, 10):
    print(f"3 x {i} = {3 * i}")`,
    },
    {
      type: "markdown",
      source: `## 💡 누적 계산 — 합계, 최댓값

반복문에서 자주 쓰는 패턴: **변수를 하나 만들어두고 매 반복마다 갱신**.`,
    },
    {
      type: "code",
      source: `# 1부터 100까지의 합
total = 0

for n in range(1, 101):
    total = total + n
    # 또는 짧게: total += n

print(total)   # 5050`,
    },
    {
      type: "markdown",
      source: `**\`total += n\`** 은 \`total = total + n\` 과 같은 뜻이에요. 같은 패턴이 많이 나와서 줄여 쓰는 거예요.

비슷한 문법:
- \`x += 1\` → \`x = x + 1\`
- \`x -= 1\` → \`x = x - 1\`
- \`x *= 2\` → \`x = x * 2\``,
    },
    {
      type: "markdown",
      source: `## 🌀 while 반복문 — 조건이 거짓이 될 때까지

횟수를 미리 모르고 "어떤 조건이 만족하는 동안" 반복하고 싶을 땐 \`while\` 을 써요.

\`\`\`python
while 조건:
    반복할 코드
\`\`\``,
    },
    {
      type: "code",
      source: `# 10 이상이 될 때까지 2배씩 늘리기
x = 1

while x < 10:
    print(x)
    x = x * 2

print(f"끝났을 때 x = {x}")`,
    },
    {
      type: "markdown",
      source: `**주의**: \`while\` 은 조건이 **절대 거짓이 안 되면 무한 반복** 합니다!

\`\`\`python
while True:
    print("멈출 수 없어!")    # ⚠️ 브라우저가 멈출 수 있어요
\`\`\`

\`while\` 을 쓸 땐 **루프 안에서 조건을 바꾸는 것**을 꼭 확인하세요.`,
    },
    {
      type: "markdown",
      source: `## 🚨 break 와 continue

반복문을 완전히 **중단**하거나, 한 번을 **건너뛸** 수 있어요:

- **\`break\`** : 반복문을 즉시 **탈출** (완전히 끝)
- **\`continue\`** : 이번 반복만 건너뛰고 **다음 반복** 으로 이동`,
    },
    {
      type: "code",
      source: `# break 예시: 5를 만나면 멈춤
for i in range(10):
    if i == 5:
        break
    print(i)

print("---")

# continue 예시: 짝수만 건너뜀 (홀수만 출력)
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**1부터 50까지 중에서 3의 배수만** 골라서 출력하세요. 또한 **그 합계** 도 마지막에 출력하세요.

예상 출력:
\`\`\`
3
6
9
12
...
48
합계: 408
\`\`\``,
    },
    {
      type: "code",
      source: `# 1부터 50까지 중 3의 배수만 출력하고, 합계도 구하세요
`,
      hints: [
        "`for n in range(1, 51):` 로 1~50까지 반복하세요.",
        "`n % 3 == 0` 이면 3의 배수예요.",
        "합계 저장용 변수 `total = 0` 을 만들고 `total += n` 으로 누적하세요. `continue` 로 3의 배수 아닌 것은 건너뛰세요.",
      ],
      solution: `total = 0

for n in range(1, 51):
    if n % 3 != 0:
        continue
    print(n)
    total += n

print(f"합계: {total}")`,
    },
    {
      type: "markdown",
      source: `## 🪆 중첩 반복문

반복문 **안에 반복문** 을 넣을 수 있어요. 구구단 전체를 한 번에 만들어볼까요?`,
    },
    {
      type: "code",
      source: `# 구구단 2단 ~ 9단 전체
for dan in range(2, 10):
    print(f"── {dan}단 ──")
    for i in range(1, 10):
        print(f"{dan} x {i} = {dan * i}")
    print()`,
    },
    {
      type: "markdown",
      source: `바깥쪽 반복이 **한 번** 돌 때마다 안쪽 반복이 **9번** 돌아요.
총 8 × 9 = **72번** 의 \`print\` 가 실행됩니다.

중첩 반복문은 **2차원 데이터** (표, 격자, 이미지 픽셀 등) 를 다룰 때 많이 써요.`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 5 완료!

오늘 배운 것:
- ✅ \`for ... in range(N)\` — 횟수 반복
- ✅ \`for ... in 리스트\` — 리스트 순회
- ✅ \`while 조건\` — 조건 반복
- ✅ \`break\` / \`continue\` — 반복 제어
- ✅ 누적 계산 패턴 (\`total += n\`)
- ✅ 중첩 반복문

**다음 챕터에서는**: 여러 값을 한 번에 다루는 **리스트와 딕셔너리** 를 배워요.

아래에서 자유롭게 실험해보세요:`,
    },
    {
      type: "code",
      source: `# 여기서 자유롭게 실험해보세요
`,
    },
  ],
  quiz: {
    title: "챕터 5 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 마지막에 출력되는 숫자는?",
        code: `for i in range(5):\n    print(i)`,
        options: ["5", "4", "0", "에러가 난다"],
        correctIndex: 1,
        explanation: "range(5)는 0, 1, 2, 3, 4를 만들어요. 5는 포함하지 않으니 마지막은 4.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 total의 값은?",
        code: `total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)`,
        options: ["10", "6", "3", "4"],
        correctIndex: 1,
        explanation: "range(1,4)는 1,2,3. total = 0+1+2+3 = 6.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 몇 개의 숫자가 출력될까요?",
        code: `for i in range(10):\n    if i == 3:\n        break\n    print(i)`,
        options: ["10개", "3개", "4개", "1개"],
        correctIndex: 1,
        explanation: "i가 0, 1, 2일 때 print 실행. i=3이면 break로 반복 탈출. 따라서 3개(0,1,2).",
      },
      {
        type: "multiple-choice",
        question: "`continue` 와 `break` 의 차이는?",
        options: ["둘 다 반복을 완전히 끝낸다", "continue는 다음 반복으로, break는 완전히 끝낸다", "break는 다음 반복으로, continue는 완전히 끝낸다", "둘 다 같은 뜻이다"],
        correctIndex: 1,
        explanation: "continue는 이번 반복만 건너뛰고 다음으로 넘어가요. break는 반복문 자체를 완전히 끝내요.",
      },
    ],
  } satisfies Quiz,
};

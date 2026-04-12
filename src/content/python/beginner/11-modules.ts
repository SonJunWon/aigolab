import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson11: Lesson = {
  id: "python-beginner-11",
  language: "python",
  track: "beginner",
  order: 11,
  title: "코드 도구 상자 — 모듈",
  subtitle: "import 로 Python의 풍부한 라이브러리 활용하기",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 📦 코드 도구 상자 — 모듈

Python에는 **이미 만들어진 엄청난 양의 코드**가 있어요. 수학 계산, 날짜 처리, 난수 생성 등을 직접 만들 필요 없이 **가져다 쓰면** 돼요.

이렇게 미리 만들어진 코드 묶음을 **모듈(module)** 이라고 불러요.

이번 챕터에서 배울 것:
- \`import\` 로 모듈 불러오기
- \`from ... import ...\` 로 특정 기능만 가져오기
- 자주 쓰는 표준 라이브러리: **math**, **random**, **datetime**
- \`as\` 로 별칭 주기`,
    },
    {
      type: "markdown",
      source: `## 📥 import 기본

\`import 모듈이름\` 으로 불러오고, \`모듈이름.함수()\` 로 써요.`,
    },
    {
      type: "code",
      source: `import math

print(math.pi)           # 3.141592...
print(math.sqrt(16))     # 4.0 (제곱근)
print(math.ceil(3.2))    # 4 (올림)
print(math.floor(3.8))   # 3 (내림)`,
    },
    {
      type: "markdown",
      source: `## 🎯 from ... import — 특정 기능만 가져오기

매번 \`math.pi\` 처럼 모듈 이름을 붙이기 귀찮으면 **직접 이름을 가져올** 수 있어요.`,
    },
    {
      type: "code",
      source: `from math import pi, sqrt

# 이제 math. 없이 바로 사용
print(pi)           # 3.141592...
print(sqrt(25))     # 5.0`,
    },
    {
      type: "markdown",
      source: `## 🏷️ as — 별칭(alias) 주기

긴 이름을 짧게 줄여서 쓸 수 있어요.

\`\`\`python
import datetime as dt
import math as m
\`\`\``,
    },
    {
      type: "code",
      source: `import math as m

print(m.pi)
print(m.factorial(5))   # 5! = 120`,
    },
    {
      type: "markdown",
      source: `---

## 🔧 자주 쓰는 표준 라이브러리

### 1. math — 수학 함수

| 함수 | 설명 |
|---|---|
| \`math.pi\` | 원주율 (3.14159...) |
| \`math.sqrt(x)\` | 제곱근 |
| \`math.pow(x, y)\` | x의 y제곱 |
| \`math.ceil(x)\` | 올림 |
| \`math.floor(x)\` | 내림 |
| \`math.factorial(n)\` | n! (팩토리얼) |
| \`math.gcd(a, b)\` | 최대공약수 |`,
    },
    {
      type: "markdown",
      source: `### 2. random — 난수 생성`,
    },
    {
      type: "code",
      source: `import random

# 1~10 사이 랜덤 정수
print(random.randint(1, 10))

# 0~1 사이 랜덤 실수
print(random.random())

# 리스트에서 랜덤 선택
colors = ["빨강", "파랑", "초록", "노랑"]
print(random.choice(colors))

# 리스트 순서 섞기
nums = [1, 2, 3, 4, 5]
random.shuffle(nums)
print(nums)`,
    },
    {
      type: "markdown",
      source: `### 3. datetime — 날짜/시간`,
    },
    {
      type: "code",
      source: `from datetime import datetime, timedelta

# 현재 시간
now = datetime.now()
print(f"지금: {now}")
print(f"연도: {now.year}, 월: {now.month}, 일: {now.day}")

# 날짜 포맷팅
formatted = now.strftime("%Y년 %m월 %d일 %H시 %M분")
print(formatted)

# 날짜 계산
tomorrow = now + timedelta(days=1)
print(f"내일: {tomorrow.strftime('%Y-%m-%d')}")`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**주사위 시뮬레이터** 를 만들어보세요.

\`random\` 모듈을 사용해서:
1. 주사위 2개를 굴림
2. 각 주사위 결과와 합을 출력
3. 합이 7이면 "럭키 세븐!" 출력`,
    },
    {
      type: "code",
      source: `import random

# 주사위 2개 굴려서 결과 출력
`,
      hints: [
        "`random.randint(1, 6)` 으로 1~6 사이 랜덤 정수를 만들 수 있어요.",
        "주사위 2개니까 `dice1 = random.randint(1, 6)`, `dice2 = random.randint(1, 6)` 두 개.",
        "`if dice1 + dice2 == 7:` 로 럭키 세븐 체크.",
      ],
      solution: `import random

dice1 = random.randint(1, 6)
dice2 = random.randint(1, 6)
total = dice1 + dice2

print(f"주사위 1: {dice1}")
print(f"주사위 2: {dice2}")
print(f"합계: {total}")

if total == 7:
    print("럭키 세븐!")`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**D-day 계산기** 를 만들어보세요.

목표 날짜까지 남은 일수를 계산해서 출력하세요.`,
    },
    {
      type: "code",
      source: `from datetime import datetime

# 목표 날짜 (연말)
target = datetime(2026, 12, 31)

# 오늘부터 목표까지 남은 일수를 계산하세요
`,
      hints: [
        "`datetime.now()` 로 오늘 날짜를 구하세요.",
        "두 날짜의 차이: `diff = target - now` → `diff.days` 가 남은 일수.",
        "`print(f\"D-{diff.days}\")` 로 출력.",
      ],
      solution: `from datetime import datetime

target = datetime(2026, 12, 31)
now = datetime.now()
diff = target - now

print(f"목표: {target.strftime('%Y년 %m월 %d일')}")
print(f"오늘부터 D-{diff.days}")`,
    },
    {
      type: "markdown",
      source: `## 🌐 외부 패키지 설치 (참고)

표준 라이브러리 외에도 **수만 개의 외부 패키지**가 있어요.
이 노트북에서는 \`micropip\` 으로 일부 패키지를 설치할 수 있습니다:

\`\`\`python
import micropip
await micropip.install("패키지이름")
\`\`\`

**브라우저 Python의 제한**: 모든 패키지가 되는 건 아니에요.
순수 Python으로 된 패키지만 가능하고, C 확장이 필요한 패키지는 안 됩니다.

이미 내장된 인기 패키지: \`numpy\`, \`pandas\`, \`matplotlib\`, \`sympy\` 등`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 11 완료 — 전 과정 완결!

오늘 배운 것:
- ✅ \`import\` 와 \`from ... import\` 로 모듈 사용
- ✅ \`as\` 로 별칭 주기
- ✅ **math** — 수학 함수 (pi, sqrt, factorial 등)
- ✅ **random** — 난수 생성 (randint, choice, shuffle)
- ✅ **datetime** — 날짜/시간 처리 (now, strftime, timedelta)

---

## 🏆 Python 입문 + 기초 완성 과정을 모두 마쳤습니다!

11챕터를 통해 Python의 핵심 개념을 모두 배웠어요:

| 영역 | 배운 것 |
|---|---|
| **기초** | print, 변수, 자료형, 형변환 |
| **제어 흐름** | 조건문, 반복문 |
| **자료 구조** | 리스트, 딕셔너리 |
| **코드 구조화** | 함수, 클래스 |
| **안전한 코딩** | 예외 처리 |
| **도구 활용** | 표준 라이브러리, 모듈 |

이제 **간단한 프로그램은 스스로 만들 수 있어요**. 축하합니다! 🎉🐍

**다음 단계 추천**:
- 작은 프로젝트를 직접 만들어보세요 (계산기, 퀴즈 게임, 가계부 등)
- 관심 분야를 정해 깊이 들어가보세요 (웹, 데이터 분석, AI 등)

아래에서 자유롭게 코딩해보세요:`,
    },
    {
      type: "code",
      source: `# 축하합니다! 자유롭게 코딩해보세요 🎉🐍
`,
    },
  ],
  quiz: {
    title: "챕터 11 퀴즈 (최종)",
    questions: [
      {
        type: "multiple-choice",
        question: "`from math import pi` 와 `import math` 의 차이는?",
        options: [
          "둘 다 같은 결과",
          "전자는 `pi` 만 가져오고 바로 쓸 수 있고, 후자는 `math.pi` 로 써야 함",
          "전자는 에러가 나는 문법",
          "후자가 더 빠름",
        ],
        correctIndex: 1,
        explanation: "`from math import pi` 는 pi만 직접 가져와서 `pi` 로 쓸 수 있고, `import math` 는 모듈 전체를 가져와서 `math.pi` 로 써야 해요.",
      },
      {
        type: "predict-output",
        question: "`random.randint(1, 6)` 이 절대 반환하지 않는 값은?",
        code: `import random\nprint(random.randint(1, 6))`,
        options: ["0", "1", "3", "6"],
        correctIndex: 0,
        explanation: "randint(1, 6)은 1 이상 6 이하 정수를 반환해요. 0은 범위 밖이라 나올 수 없어요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `import math\nprint(math.floor(3.9))`,
        options: ["3", "4", "3.9", "에러가 난다"],
        correctIndex: 0,
        explanation: "floor()는 내림이에요. 3.9를 내리면 3.",
      },
      {
        type: "multiple-choice",
        question: "`import math as m` 에서 `as m` 의 역할은?",
        options: [
          "math 모듈을 삭제",
          "math 모듈에 m이라는 별칭을 주어 `m.pi` 처럼 짧게 쓸 수 있게 함",
          "math의 모든 함수를 m으로 시작하게 변경",
          "m이라는 새 모듈을 생성",
        ],
        correctIndex: 1,
        explanation: "`as`는 별칭(alias)을 주는 거예요. `math.pi` 대신 `m.pi` 로 짧게 쓸 수 있어요.",
      },
    ],
  } satisfies Quiz,
};

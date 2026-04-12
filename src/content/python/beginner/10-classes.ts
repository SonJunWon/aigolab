import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson10: Lesson = {
  id: "python-beginner-10",
  language: "python",
  track: "beginner",
  order: 10,
  title: "나만의 타입 만들기 — 클래스",
  subtitle: "class 로 데이터와 기능을 하나로 묶기",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 🏗️ 나만의 타입 만들기 — 클래스

지금까지 \`int\`, \`str\`, \`list\`, \`dict\` 같은 **기본 타입**을 썼어요.
하지만 실제 프로그래밍에서는 "학생", "상품", "계좌" 같은 **나만의 타입**이 필요해요.

**클래스(class)** 는 **데이터(속성)** 와 **기능(메서드)** 을 하나로 묶는 틀이에요.

이번 챕터에서 배울 것:
- \`class\` 로 나만의 타입 정의
- \`__init__\` — 초기화 (생성자)
- \`self\` — 자기 자신을 가리킴
- **메서드** — 클래스 안의 함수
- **상속** 기초 — 기존 클래스를 확장`,
    },
    {
      type: "markdown",
      source: `## 🧱 클래스 없이 vs 클래스로

딕셔너리로도 데이터를 묶을 수 있지만, **기능(함수)은 따로** 관리해야 해요.`,
    },
    {
      type: "code",
      source: `# 딕셔너리 방식 (나쁘진 않지만 기능이 분산됨)
student = {"이름": "철수", "점수들": [85, 92, 78]}

def get_average(student):
    return sum(student["점수들"]) / len(student["점수들"])

print(get_average(student))`,
    },
    {
      type: "markdown",
      source: `클래스를 쓰면 **데이터와 기능이 하나로** 묶여요:`,
    },
    {
      type: "code",
      source: `class Student:
    def __init__(self, name, scores):
        self.name = name
        self.scores = scores

    def average(self):
        return sum(self.scores) / len(self.scores)

# 사용
s = Student("철수", [85, 92, 78])
print(f"{s.name}의 평균: {s.average()}")`,
    },
    {
      type: "markdown",
      source: `## 📐 클래스 기본 구조

\`\`\`python
class 클래스이름:
    def __init__(self, 매개변수들):
        self.속성 = 매개변수

    def 메서드(self):
        ...
\`\`\`

**3가지 핵심**:
1. **\`class\`** 키워드로 정의 (이름은 대문자로 시작하는 관례)
2. **\`__init__\`** — 객체가 만들어질 때 자동 호출 (초기화)
3. **\`self\`** — "나 자신" 을 가리킴. 모든 메서드의 첫 매개변수`,
    },
    {
      type: "code",
      source: `class Dog:
    def __init__(self, name, breed):
        self.name = name      # 속성: 이름
        self.breed = breed    # 속성: 품종
        self.tricks = []      # 속성: 기술 목록 (빈 리스트로 시작)

    def learn_trick(self, trick):
        self.tricks.append(trick)
        print(f"{self.name}이(가) '{trick}'을 배웠어요!")

    def show_tricks(self):
        if self.tricks:
            print(f"{self.name}의 기술: {', '.join(self.tricks)}")
        else:
            print(f"{self.name}은 아직 배운 기술이 없어요.")

# 객체(인스턴스) 만들기
my_dog = Dog("바둑이", "시바견")
print(f"이름: {my_dog.name}, 품종: {my_dog.breed}")

my_dog.learn_trick("앉아")
my_dog.learn_trick("손")
my_dog.show_tricks()`,
    },
    {
      type: "markdown",
      source: `### 🤔 self 가 뭐예요?

\`self\` 는 **지금 이 객체 자기 자신**을 가리켜요.

\`\`\`python
my_dog.learn_trick("앉아")
\`\`\`

이 호출이 내부적으로는 이렇게 작동해요:
\`\`\`python
Dog.learn_trick(my_dog, "앉아")
#              ↑ self 에 my_dog 이 들어감
\`\`\`

그래서 \`self.tricks\` = \`my_dog.tricks\` 예요.`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

**은행 계좌 클래스** \`BankAccount\` 를 만들어보세요.

**속성**:
- \`owner\` (소유자 이름)
- \`balance\` (잔액, 초기값 0)

**메서드**:
- \`deposit(amount)\` — 입금 (잔액 증가 + 메시지 출력)
- \`withdraw(amount)\` — 출금 (잔액 부족하면 경고 + 실패)
- \`show_balance()\` — 잔액 표시`,
    },
    {
      type: "code",
      source: `# BankAccount 클래스를 만들어보세요

# 테스트
account = BankAccount("김철수")
account.show_balance()
account.deposit(10000)
account.withdraw(3000)
account.withdraw(50000)
account.show_balance()`,
      hints: [
        "`class BankAccount:` 로 시작하고 `__init__(self, owner):` 에서 `self.owner = owner`, `self.balance = 0` 설정.",
        "`deposit(self, amount)` 안에서 `self.balance += amount` 하고 메시지 출력.",
        "`withdraw` 에서 `if amount > self.balance:` 체크 → 잔액 부족 경고, `else:` → 차감.",
      ],
      solution: `class BankAccount:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0

    def deposit(self, amount):
        self.balance += amount
        print(f"{amount}원 입금. 잔액: {self.balance}원")

    def withdraw(self, amount):
        if amount > self.balance:
            print(f"잔액 부족! 현재 잔액: {self.balance}원")
        else:
            self.balance -= amount
            print(f"{amount}원 출금. 잔액: {self.balance}원")

    def show_balance(self):
        print(f"{self.owner}님의 잔액: {self.balance}원")

account = BankAccount("김철수")
account.show_balance()
account.deposit(10000)
account.withdraw(3000)
account.withdraw(50000)
account.show_balance()`,
    },
    {
      type: "markdown",
      source: `## 🧬 상속 — 기존 클래스를 확장

**상속(inheritance)** 은 기존 클래스를 바탕으로 **새 클래스를 만드는** 거예요. 공통 기능은 재사용하고, 다른 부분만 추가하거나 덮어쓰기.`,
    },
    {
      type: "code",
      source: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(f"{self.name}이(가) 소리를 냅니다.")

# Animal 을 상속받는 Cat, Dog
class Cat(Animal):
    def speak(self):    # 덮어쓰기 (오버라이드)
        print(f"{self.name}: 야옹!")

class Dog(Animal):
    def speak(self):
        print(f"{self.name}: 멍멍!")

    def fetch(self):    # Dog 만의 고유 메서드
        print(f"{self.name}이(가) 공을 가져옵니다!")

animals = [Cat("나비"), Dog("바둑이"), Cat("냥이")]

for animal in animals:
    animal.speak()`,
    },
    {
      type: "markdown",
      source: `**상속의 장점**:
- \`Cat\` 과 \`Dog\` 모두 \`__init__\` 을 안 써도 \`Animal\` 의 것을 자동으로 물려받음
- \`speak()\` 만 각자 다르게 재정의 (오버라이드)
- 같은 \`speak()\` 호출인데 객체 타입에 따라 다른 결과 → **다형성(polymorphism)**`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

아래 \`Shape\` 클래스를 상속받아 \`Rectangle\` (직사각형) 과 \`Circle\` (원) 클래스를 만들어보세요.

- \`Rectangle(width, height)\` — 넓이 = width × height
- \`Circle(radius)\` — 넓이 = π × radius² (\`math.pi\` 사용)

둘 다 \`area()\` 메서드가 각자의 공식으로 동작해야 해요.`,
    },
    {
      type: "code",
      source: `import math

class Shape:
    def area(self):
        return 0

# Rectangle 과 Circle 클래스를 만들어보세요

# 테스트
r = Rectangle(5, 3)
c = Circle(4)
print(f"직사각형 넓이: {r.area()}")
print(f"원 넓이: {c.area():.2f}")`,
      hints: [
        "`class Rectangle(Shape):` 로 시작하고 `__init__(self, width, height):` 에서 속성 저장.",
        "`def area(self): return self.width * self.height` — Shape의 area를 덮어씀.",
        "Circle도 같은 패턴: `__init__(self, radius):`, `area(self): return math.pi * self.radius ** 2`.",
      ],
      solution: `import math

class Shape:
    def area(self):
        return 0

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2

r = Rectangle(5, 3)
c = Circle(4)
print(f"직사각형 넓이: {r.area()}")
print(f"원 넓이: {c.area():.2f}")`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 10 완료!

오늘 배운 것:
- ✅ \`class\` 로 나만의 타입 정의
- ✅ \`__init__\` 으로 초기화, \`self\` 로 자기 참조
- ✅ **메서드** — 클래스 안의 함수
- ✅ **상속** — 기존 클래스 확장
- ✅ **오버라이드** — 부모 메서드 재정의
- ✅ **다형성** — 같은 메서드, 다른 동작

**다음 챕터에서는**: Python이 가진 **표준 라이브러리 도구 상자** 를 열어봐요.

아래에서 자유롭게 실험해보세요:`,
    },
    {
      type: "code",
      source: `# 여기서 자유롭게 실험해보세요
`,
    },
  ],
  quiz: {
    title: "챕터 10 퀴즈",
    questions: [
      {
        type: "multiple-choice",
        question: "클래스에서 `self` 는 무엇을 가리킬까요?",
        options: [
          "클래스 자체",
          "현재 함수",
          "현재 객체(인스턴스) 자기 자신",
          "부모 클래스",
        ],
        correctIndex: 2,
        explanation: "self는 메서드를 호출한 그 객체 자신을 가리켜요. my_dog.speak()에서 self = my_dog.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `class Counter:\n    def __init__(self):\n        self.count = 0\n    def click(self):\n        self.count += 1\n\nc = Counter()\nc.click()\nc.click()\nc.click()\nprint(c.count)`,
        options: ["0", "1", "3", "에러가 난다"],
        correctIndex: 2,
        explanation: "click()을 3번 호출했으니 count가 0→1→2→3. 결과는 3.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `class Animal:\n    def sound(self):\n        return "..."\n\nclass Cat(Animal):\n    def sound(self):\n        return "야옹"\n\nc = Cat()\nprint(c.sound())`,
        options: ["...", "야옹", "에러가 난다", "None"],
        correctIndex: 1,
        explanation: "Cat이 Animal의 sound()를 오버라이드했어요. Cat 인스턴스는 \"야옹\"을 반환.",
      },
      {
        type: "multiple-choice",
        question: "`__init__` 메서드의 역할은?",
        options: [
          "객체를 삭제할 때 실행",
          "객체가 만들어질 때 자동으로 실행 (초기화)",
          "클래스를 상속할 때 실행",
          "메서드를 호출할 때마다 실행",
        ],
        correctIndex: 1,
        explanation: "__init__은 생성자로, 객체가 만들어지는 순간 자동으로 호출돼서 속성을 초기화해요.",
      },
    ],
  } satisfies Quiz,
};

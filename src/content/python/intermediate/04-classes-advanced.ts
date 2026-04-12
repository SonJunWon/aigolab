import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson04: Lesson = {
  id: "python-intermediate-04",
  language: "python",
  track: "intermediate",
  order: 4,
  title: "클래스 마스터하기",
  subtitle: "특수 메서드, @property, dataclass",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 클래스 마스터하기

Java/C#의 클래스와 Python 클래스는 겉보기엔 비슷하지만, Python만의 **특수 메서드(dunder methods)** 시스템이 핵심입니다.
\`__init__\` 도 사실 그중 하나였어요.

이번 챕터에서 다룰 내용:
- 특수 메서드: \`__str__\`, \`__repr__\`, \`__len__\`, \`__eq__\`, \`__lt__\`
- \`__getitem__\` — 객체를 인덱싱 가능하게
- \`@property\` — Python 스타일의 getter/setter
- \`@staticmethod\`, \`@classmethod\`
- \`dataclass\` — 보일러플레이트 없는 데이터 클래스
- \`dataclass\`의 \`field()\`, \`default_factory\``,
    },
    {
      type: "markdown",
      source: `## 특수 메서드 (Dunder Methods)

Python에서 \`+\`, \`==\`, \`len()\`, \`print()\` 같은 **내장 연산자/함수가 객체와 상호작용하는 방법**을
특수 메서드로 정의합니다. Java의 \`toString()\`, \`equals()\`와 비슷하지만 훨씬 체계적이에요.

| 연산 | 호출되는 메서드 |
|---|---|
| \`print(obj)\`, \`str(obj)\` | \`__str__\` |
| \`repr(obj)\`, REPL 출력 | \`__repr__\` |
| \`len(obj)\` | \`__len__\` |
| \`obj1 == obj2\` | \`__eq__\` |
| \`obj1 < obj2\` | \`__lt__\` |
| \`obj[key]\` | \`__getitem__\` |
| \`obj1 + obj2\` | \`__add__\` |`,
    },
    {
      type: "code",
      source: `class Book:
    def __init__(self, title: str, author: str, pages: int):
        self.title = title
        self.author = author
        self.pages = pages

    def __str__(self):
        """사용자 친화적 문자열 (print, str)"""
        return f"'{self.title}' by {self.author}"

    def __repr__(self):
        """개발자용 문자열 (디버깅, REPL)"""
        return f"Book({self.title!r}, {self.author!r}, {self.pages})"

    def __len__(self):
        return self.pages

    def __eq__(self, other):
        if not isinstance(other, Book):
            return NotImplemented
        return self.title == other.title and self.author == other.author

b = Book("파이썬 완벽 가이드", "김저자", 450)
print(b)          # __str__
print(repr(b))    # __repr__
print(len(b))     # __len__
print(b == Book("파이썬 완벽 가이드", "김저자", 300))  # __eq__: True (페이지 달라도 같은 책)`,
    },
    {
      type: "markdown",
      source: `## __lt__ — 정렬 가능하게 만들기

\`__lt__\` (less than)만 정의하면 \`sorted()\`를 쓸 수 있어요.
\`functools.total_ordering\`을 쓰면 \`__eq__\`과 \`__lt__\`만으로 나머지 비교 연산자(\`<=\`, \`>\`, \`>=\`)가 자동 생성됩니다.`,
    },
    {
      type: "code",
      source: `from functools import total_ordering

@total_ordering
class Student:
    def __init__(self, name: str, gpa: float):
        self.name = name
        self.gpa = gpa

    def __eq__(self, other):
        return self.gpa == other.gpa

    def __lt__(self, other):
        return self.gpa < other.gpa

    def __repr__(self):
        return f"{self.name}(GPA:{self.gpa})"

students = [Student("철수", 3.5), Student("영희", 3.9), Student("민수", 3.2)]
print(sorted(students))                # GPA 오름차순
print(sorted(students, reverse=True))  # GPA 내림차순
print(Student("A", 3.5) >= Student("B", 3.2))  # True (total_ordering 덕분)`,
    },
    {
      type: "markdown",
      source: `## __getitem__ — 객체를 인덱싱 가능하게

\`obj[key]\`를 쓸 수 있게 해주는 메서드입니다. 리스트나 딕셔너리처럼 동작하는 커스텀 컨테이너를 만들 수 있어요.`,
    },
    {
      type: "code",
      source: `class Config:
    def __init__(self, **kwargs):
        self._data = kwargs

    def __getitem__(self, key):
        return self._data[key]

    def __len__(self):
        return len(self._data)

    def __repr__(self):
        return f"Config({self._data})"

config = Config(host="localhost", port=8080, debug=True)
print(config["host"])    # localhost
print(config["port"])    # 8080
print(len(config))       # 3`,
    },
    {
      type: "markdown",
      source: `## @property — Python 스타일 getter/setter

Java에서는 \`getX()\`/\`setX()\` 패턴을 쓰지만, Python에서는 \`@property\`로
**속성처럼 보이는 메서드**를 만듭니다. 호출 시 괄호가 필요 없어요.

> Python 철학: "처음에는 public 속성으로 시작하고, 나중에 로직이 필요하면 @property로 바꾸면 된다."
> API를 바꾸지 않아도 되므로 **처음부터 getter/setter를 안 써도 됩니다.**`,
    },
    {
      type: "code",
      source: `class Temperature:
    def __init__(self, celsius: float):
        self._celsius = celsius  # 관례: _ 접두사 = "건드리지 마세요"

    @property
    def celsius(self) -> float:
        """getter — 읽기"""
        return self._celsius

    @celsius.setter
    def celsius(self, value: float):
        """setter — 유효성 검사 포함"""
        if value < -273.15:
            raise ValueError("절대영도 이하는 불가능합니다!")
        self._celsius = value

    @property
    def fahrenheit(self) -> float:
        """읽기 전용 계산 속성"""
        return self._celsius * 9/5 + 32

t = Temperature(100)
print(f"{t.celsius}°C = {t.fahrenheit}°F")   # 괄호 없이 속성처럼 사용

t.celsius = 0
print(f"{t.celsius}°C = {t.fahrenheit}°F")

try:
    t.celsius = -300  # 유효성 검사에 걸림
except ValueError as e:
    print(f"에러: {e}")`,
    },
    {
      type: "markdown",
      source: `## @staticmethod, @classmethod

| | 첫 번째 인자 | 용도 |
|---|---|---|
| 일반 메서드 | \`self\` (인스턴스) | 인스턴스 데이터 접근 |
| \`@classmethod\` | \`cls\` (클래스) | 팩토리 메서드, 클래스 변수 접근 |
| \`@staticmethod\` | 없음 | 클래스와 관련된 유틸리티 함수 |`,
    },
    {
      type: "code",
      source: `class Date:
    def __init__(self, year: int, month: int, day: int):
        self.year = year
        self.month = month
        self.day = day

    def __repr__(self):
        return f"{self.year}-{self.month:02d}-{self.day:02d}"

    @classmethod
    def from_string(cls, date_str: str):
        """팩토리 메서드: 문자열에서 Date 생성"""
        year, month, day = map(int, date_str.split("-"))
        return cls(year, month, day)   # cls = Date

    @staticmethod
    def is_leap_year(year: int) -> bool:
        """윤년 판별 — 인스턴스/클래스 데이터 불필요"""
        return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

d = Date.from_string("2024-03-15")   # classmethod로 생성
print(d)
print(Date.is_leap_year(2024))  # True
print(Date.is_leap_year(2023))  # False`,
    },
    {
      type: "markdown",
      source: `## dataclass — 보일러플레이트 제거

\`dataclasses.dataclass\`는 \`__init__\`, \`__repr__\`, \`__eq__\`을 **자동 생성**해줍니다.
Java의 \`record\`, Kotlin의 \`data class\`, Scala의 \`case class\`와 같은 목적이에요.`,
    },
    {
      type: "code",
      source: `from dataclasses import dataclass

# 일반 클래스 — 보일러플레이트가 많음
class PointOld:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
    def __repr__(self):
        return f"PointOld(x={self.x}, y={self.y})"
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

# dataclass — 같은 기능, 코드 1/3
@dataclass
class Point:
    x: float
    y: float

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
print(p1)         # Point(x=1.0, y=2.0) — __repr__ 자동
print(p1 == p2)   # True — __eq__ 자동`,
    },
    {
      type: "code",
      source: `from dataclasses import dataclass, field

@dataclass
class Player:
    name: str
    level: int = 1                           # 기본값
    hp: int = 100
    inventory: list = field(default_factory=list)  # 가변 기본값은 field() 필수!

    @property
    def is_alive(self) -> bool:
        return self.hp > 0

p1 = Player("용사")
p2 = Player("마법사", level=5, hp=80)

print(p1)
print(p2)
print(f"{p1.name} 생존: {p1.is_alive}")

p1.inventory.append("나무 검")
print(f"{p1.name}의 인벤토리: {p1.inventory}")
print(f"{p2.name}의 인벤토리: {p2.inventory}")  # 독립적!`,
    },
    {
      type: "markdown",
      source: `> **왜 \`field(default_factory=list)\`를 써야 할까?**
>
> \`inventory: list = []\` 로 쓰면 **모든 인스턴스가 같은 리스트 객체를 공유**합니다.
> (Python의 유명한 함정: mutable default argument)
> \`default_factory=list\`는 인스턴스마다 **새 리스트를 생성**해줍니다.`,
    },
    {
      type: "markdown",
      source: `## dataclass 정렬: order=True

\`@dataclass(order=True)\`를 쓰면 필드 순서대로 비교 연산자가 자동 생성됩니다.`,
    },
    {
      type: "code",
      source: `from dataclasses import dataclass

@dataclass(order=True)
class Version:
    major: int
    minor: int
    patch: int

versions = [Version(2, 1, 0), Version(1, 9, 5), Version(2, 0, 3)]
print(sorted(versions))
# [Version(major=1, minor=9, patch=5), Version(major=2, minor=0, patch=3), Version(major=2, minor=1, patch=0)]

print(Version(2, 0, 0) > Version(1, 9, 9))  # True — major가 더 크니까`,
    },
    {
      type: "markdown",
      source: `## 미션 1: Vector 클래스 만들기

2D 벡터 클래스를 만들어서 **연산자 오버로딩**을 구현하세요.

요구사항:
- \`Vector(x, y)\`로 생성
- \`v1 + v2\` — 벡터 덧셈 (\`__add__\`)
- \`print(v)\` — \`"Vector(3, 4)"\` 형식 (\`__str__\`)
- \`v1 == v2\` — 좌표가 같으면 True (\`__eq__\`)
- \`abs(v)\` — 벡터의 크기 (\`__abs__\`, \`math.sqrt\` 사용)`,
    },
    {
      type: "code",
      source: `import math

# Vector 클래스를 만드세요

# 테스트
v1 = Vector(3, 4)
v2 = Vector(1, 2)
v3 = v1 + v2
print(v3)            # Vector(4, 6)
print(v1 == Vector(3, 4))  # True
print(abs(v1))       # 5.0 (3-4-5 삼각형)`,
      hints: [
        "`__add__`는 `return Vector(self.x + other.x, self.y + other.y)`",
        "`__abs__`는 `return math.sqrt(self.x**2 + self.y**2)`",
        "`__eq__`에서는 `isinstance(other, Vector)` 체크를 먼저 하세요.",
      ],
      solution: `import math

class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __repr__(self):
        return self.__str__()

    def __eq__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __abs__(self):
        return math.sqrt(self.x**2 + self.y**2)

v1 = Vector(3, 4)
v2 = Vector(1, 2)
v3 = v1 + v2
print(v3)            # Vector(4, 6)
print(v1 == Vector(3, 4))  # True
print(abs(v1))       # 5.0`,
    },
    {
      type: "markdown",
      source: `## 미션 2: dataclass 기반 학생 관리

\`@dataclass\`로 학생 클래스를 만들고, GPA 기준으로 정렬하는 시스템을 구현하세요.

요구사항:
- \`Student\` dataclass: name(str), major(str), gpa(float)
- \`StudentRegistry\` 클래스: 학생 추가, GPA 상위 N명 조회, 전공별 그룹핑
- \`sorted()\`로 GPA 내림차순 정렬`,
    },
    {
      type: "code",
      source: `from dataclasses import dataclass

# Student dataclass와 StudentRegistry 클래스를 만드세요

# 테스트
registry = StudentRegistry()
registry.add(Student("김철수", "컴공", 3.8))
registry.add(Student("이영희", "수학", 3.95))
registry.add(Student("박민수", "컴공", 3.5))
registry.add(Student("정지은", "수학", 3.7))
registry.add(Student("최동현", "컴공", 4.0))

print("=== GPA 상위 3명 ===")
for s in registry.top(3):
    print(f"  {s.name} ({s.major}) - GPA: {s.gpa}")

print("\\n=== 전공별 학생 ===")
for major, students in registry.by_major().items():
    names = ", ".join(s.name for s in students)
    print(f"  {major}: {names}")`,
      hints: [
        "StudentRegistry는 내부에 `self._students: list[Student] = []`를 가지세요.",
        "`top(n)`: `sorted(self._students, key=lambda s: s.gpa, reverse=True)[:n]`",
        "`by_major()`: 딕셔너리를 만들고 학생을 전공별로 그룹핑. `defaultdict(list)` 쓰면 편합니다.",
      ],
      solution: `from dataclasses import dataclass
from collections import defaultdict

@dataclass
class Student:
    name: str
    major: str
    gpa: float

class StudentRegistry:
    def __init__(self):
        self._students: list[Student] = []

    def add(self, student: Student):
        self._students.append(student)

    def top(self, n: int) -> list[Student]:
        return sorted(self._students, key=lambda s: s.gpa, reverse=True)[:n]

    def by_major(self) -> dict[str, list[Student]]:
        groups = defaultdict(list)
        for s in self._students:
            groups[s.major].append(s)
        return dict(groups)

registry = StudentRegistry()
registry.add(Student("김철수", "컴공", 3.8))
registry.add(Student("이영희", "수학", 3.95))
registry.add(Student("박민수", "컴공", 3.5))
registry.add(Student("정지은", "수학", 3.7))
registry.add(Student("최동현", "컴공", 4.0))

print("=== GPA 상위 3명 ===")
for s in registry.top(3):
    print(f"  {s.name} ({s.major}) - GPA: {s.gpa}")

print("\\n=== 전공별 학생 ===")
for major, students in registry.by_major().items():
    names = ", ".join(s.name for s in students)
    print(f"  {major}: {names}")`,
    },
    {
      type: "markdown",
      source: `## 챕터 4 완료!

이번 챕터에서 배운 것:
- 특수 메서드로 연산자 오버로딩 (\`__add__\`, \`__eq__\`, \`__str__\` 등)
- \`__getitem__\`으로 인덱싱 가능한 객체
- \`@property\`로 Java식 getter/setter 대신 Python스러운 속성 관리
- \`@classmethod\` 팩토리 패턴, \`@staticmethod\` 유틸리티
- \`@dataclass\`로 보일러플레이트 제거
- \`field(default_factory=...)\`로 가변 기본값 안전하게 처리

다음 챕터에서는 Python의 **이터레이터와 제너레이터**를 배워봅시다.`,
    },
  ],
  quiz: {
    title: "챕터 4 퀴즈 — 클래스 마스터하기",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: int\n    y: int\n\np1 = Point(1, 2)\np2 = Point(1, 2)\nprint(p1 == p2)`,
        options: ["True", "False", "에러가 난다", "None"],
        correctIndex: 0,
        explanation:
          "dataclass는 __eq__를 자동 생성하여 모든 필드를 비교합니다. x와 y가 모두 같으므로 True.",
      },
      {
        type: "multiple-choice",
        question:
          "일반 클래스에서 `inventory: list = []`를 기본값으로 쓰면 발생하는 문제는?",
        options: [
          "SyntaxError가 발생한다",
          "모든 인스턴스가 같은 리스트 객체를 공유한다",
          "리스트가 자동으로 복사된다",
          "None이 기본값으로 설정된다",
        ],
        correctIndex: 1,
        explanation:
          "Python에서 가변 객체를 기본값으로 쓰면 함수/클래스 정의 시 한 번만 생성되어 모든 호출/인스턴스가 공유합니다. dataclass에서는 field(default_factory=list)를 사용해야 합니다.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `class C:\n    @property\n    def value(self):\n        return 42\n\nobj = C()\nprint(obj.value)`,
        options: ["42", "<bound method>", "에러가 난다", "None"],
        correctIndex: 0,
        explanation:
          "@property 데코레이터 덕분에 value는 괄호 없이 속성처럼 접근할 수 있고, 42를 반환합니다.",
      },
      {
        type: "multiple-choice",
        question: "`@classmethod`와 `@staticmethod`의 차이는?",
        options: [
          "차이가 없다, 이름만 다르다",
          "classmethod는 첫 인자로 클래스(cls)를 받고, staticmethod는 아무 것도 안 받는다",
          "staticmethod는 인스턴스에서만, classmethod는 클래스에서만 호출 가능하다",
          "classmethod는 상속이 안 되고, staticmethod는 상속된다",
        ],
        correctIndex: 1,
        explanation:
          "@classmethod는 첫 인자로 클래스(cls)를 받아 팩토리 메서드 등에 활용합니다. @staticmethod는 self도 cls도 안 받아 클래스와 관련된 순수 유틸리티 함수에 씁니다.",
      },
    ],
  } satisfies Quiz,
};

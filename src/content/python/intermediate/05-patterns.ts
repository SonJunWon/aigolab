import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson05: Lesson = {
  id: "python-intermediate-05",
  language: "python",
  track: "intermediate",
  order: 5,
  title: "실전 Python 패턴",
  subtitle: "with문, collections, 관용구 모음",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# 실전 Python 패턴

다른 언어에서 넘어온 개발자가 Python 코드를 "Pythonic"하게 쓰려면 알아야 할 **실전 패턴과 관용구**를 총정리합니다.

이번 챕터에서 다룰 것:
- \`with\` 문과 Context Manager
- \`contextlib\`로 간결한 컨텍스트 매니저 만들기
- 커스텀 예외 클래스
- \`collections\` 모듈: Counter, defaultdict, namedtuple
- 딕셔너리 병합 기법
- 핵심 내장 함수: enumerate, zip, reversed, sorted
- Walrus operator \`:=\`
- Python 관용구 모음`,
    },
    {
      type: "markdown",
      source: `## Context Manager: \`with\` 문

Java/C#에서 \`try-finally\`로 리소스를 정리하던 패턴, Python에서는 \`with\`로 깔끔하게 처리합니다.

\`\`\`java
// Java 스타일
FileReader fr = null;
try {
    fr = new FileReader("file.txt");
    // ... 사용
} finally {
    if (fr != null) fr.close();
}
\`\`\`

Python의 \`with\`는 블록을 벗어나면 **자동으로 정리(cleanup)**됩니다.`,
    },
    {
      type: "code",
      source: `# with 문 기본 — 파일 자동 닫기
# (실제 파일이 없어도 개념만 이해하세요)

# try/finally 방식 (구식)
f = None
try:
    f = open("example.txt", "w")
    f.write("hello")
finally:
    if f:
        f.close()

# with 문 방식 (Pythonic)
with open("example.txt", "w") as f:
    f.write("hello")
# <- 여기서 f.close() 자동 호출

print("파일이 닫혔는가?", f.closed)  # True`,
    },
    {
      type: "markdown",
      source: `## 커스텀 Context Manager 만들기

\`__enter__\`와 \`__exit__\` 메서드를 구현하면 어떤 객체든 \`with\`와 함께 쓸 수 있습니다.

- \`__enter__\`: \`with\` 블록 진입 시 호출, 반환값이 \`as\` 변수에 바인딩
- \`__exit__\`: 블록 종료 시 호출 (예외 발생 여부 무관)`,
    },
    {
      type: "code",
      source: `import time

class Timer:
    """실행 시간을 측정하는 컨텍스트 매니저"""
    def __enter__(self):
        self.start = time.time()
        return self  # as 변수에 바인딩될 객체

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.elapsed = time.time() - self.start
        print(f"실행 시간: {self.elapsed:.4f}초")
        return False  # 예외를 전파 (True면 삼킴)

# 사용
with Timer() as t:
    total = sum(range(1_000_000))

print(f"합계: {total}")
print(f"기록된 시간: {t.elapsed:.4f}초")`,
    },
    {
      type: "markdown",
      source: `## contextlib.contextmanager — yield 기반 간편 버전

클래스를 만드는 게 번거롭다면, \`@contextmanager\` 데코레이터로 **제너레이터 함수 하나**로 끝낼 수 있습니다.

\`yield\` **앞** = \`__enter__\`, \`yield\` **뒤** = \`__exit__\``,
    },
    {
      type: "code",
      source: `from contextlib import contextmanager
import time

@contextmanager
def timer(label="작업"):
    start = time.time()
    yield  # 여기서 with 블록 실행
    elapsed = time.time() - start
    print(f"[{label}] {elapsed:.4f}초")

# 사용
with timer("리스트 컴프리헨션"):
    squares = [x**2 for x in range(500_000)]

with timer("제곱합 계산"):
    total = sum(x**2 for x in range(500_000))`,
    },
    {
      type: "markdown",
      source: `## 커스텀 예외 클래스

\`Exception\`을 상속해서 도메인에 맞는 예외를 만들면, 에러 처리가 명확해집니다.`,
    },
    {
      type: "code",
      source: `# 커스텀 예외 정의
class ValidationError(Exception):
    """입력값 검증 실패"""
    pass

class InsufficientBalanceError(Exception):
    """잔액 부족"""
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        super().__init__(
            f"잔액 {balance}원으로 {amount}원을 출금할 수 없습니다"
        )

# 사용
def withdraw(balance, amount):
    if amount <= 0:
        raise ValidationError("출금액은 양수여야 합니다")
    if amount > balance:
        raise InsufficientBalanceError(balance, amount)
    return balance - amount

try:
    result = withdraw(1000, 5000)
except InsufficientBalanceError as e:
    print(f"에러: {e}")
    print(f"  현재 잔액: {e.balance}원, 요청 금액: {e.amount}원")`,
    },
    {
      type: "markdown",
      source: `## collections 모듈

표준 라이브러리 \`collections\`에는 일반 dict/list보다 **특화된 자료구조**가 있습니다.`,
    },
    {
      type: "code",
      source: `from collections import Counter, defaultdict, namedtuple

# --- Counter: 빈도 세기 ---
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
count = Counter(words)
print("Counter:", count)
print("가장 흔한 2개:", count.most_common(2))

# --- defaultdict: 기본값 자동 생성 ---
# 일반 dict라면 KeyError → defaultdict는 기본값 제공
grouped = defaultdict(list)
students = [("A반", "철수"), ("B반", "영희"), ("A반", "민수"), ("B반", "지영")]
for cls, name in students:
    grouped[cls].append(name)  # 키 없어도 자동으로 빈 list 생성

print("그룹:", dict(grouped))

# --- namedtuple: 가벼운 불변 데이터 클래스 ---
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(f"Point: x={p.x}, y={p.y}")
print(f"언패킹: {p[0]}, {p[1]}")`,
    },
    {
      type: "markdown",
      source: `## 딕셔너리 병합

Python 버전에 따라 여러 방법이 있습니다.`,
    },
    {
      type: "code",
      source: `d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}

# 방법 1: ** 언패킹 (Python 3.5+)
merged = {**d1, **d2}
print("** 언패킹:", merged)  # b는 d2의 값으로 덮어씀

# 방법 2: | 연산자 (Python 3.9+)
merged2 = d1 | d2
print("| 연산자:", merged2)

# 방법 3: |= 로 제자리 업데이트
d1_copy = d1.copy()
d1_copy |= d2
print("|= 업데이트:", d1_copy)

# 참고: 충돌 시 오른쪽(뒤쪽) 값이 우선`,
    },
    {
      type: "markdown",
      source: `## 핵심 내장 함수 모음

다른 언어에서 오면 놓치기 쉬운 **Python 내장 함수**들입니다.`,
    },
    {
      type: "code",
      source: `# --- enumerate: 인덱스 + 값 동시에 ---
fruits = ["사과", "바나나", "체리"]
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

print()

# --- zip: 여러 리스트를 동시에 순회 ---
names = ["철수", "영희", "민수"]
scores = [85, 92, 78]
for name, score in zip(names, scores):
    print(f"{name}: {score}점")

print()

# --- sorted with key: 커스텀 정렬 ---
items = [("바나나", 3000), ("사과", 1500), ("체리", 5000)]
by_price = sorted(items, key=lambda x: x[1])
print("가격순:", by_price)

by_name_desc = sorted(items, key=lambda x: x[0], reverse=True)
print("이름 역순:", by_name_desc)

# --- reversed: 역순 이터레이터 ---
print("역순:", list(reversed(range(5))))`,
    },
    {
      type: "markdown",
      source: `## Walrus Operator \`:=\` (Python 3.8+)

**대입과 동시에 값을 사용**할 수 있는 연산자입니다. "바다코끼리 연산자"라고 부릅니다.

C/Java의 \`if ((n = getValue()) > 0)\` 과 비슷하지만, Python에서는 \`:=\`를 씁니다.`,
    },
    {
      type: "code",
      source: `# Walrus operator 실전 예시

# 1) while 루프에서 입력 처리 패턴
data = [1, 5, 3, 8, 2, 7, 4]
# 4보다 큰 값만 제곱해서 수집
result = [squared for x in data if (squared := x**2) > 16]
print("제곱 > 16인 것:", result)

# 2) 길이 체크와 동시에 사용
words = ["hi", "", "hello", "", "world"]
non_empty = [word for word in words if (n := len(word)) > 0]
print("비어있지 않은 단어:", non_empty)

# 3) 함수 호출 결과 재사용 (호출 1번으로 충분)
import re
text = "Contact: user@example.com for info"
if (match := re.search(r'\\w+@\\w+\\.\\w+', text)):
    print(f"이메일 발견: {match.group()}")`,
    },
    {
      type: "markdown",
      source: `## Python 관용구 정리표

| 비Pythonic | Pythonic | 설명 |
|---|---|---|
| \`temp = a; a = b; b = temp\` | \`a, b = b, a\` | 변수 스왑 |
| \`if len(my_list) == 0:\` | \`if not my_list:\` | 빈 컨테이너 체크 |
| \`s = ""; for x in lst: s += x + ","\` | \`", ".join(lst)\` | 문자열 결합 |
| \`if key in d: v = d[key] else: v = 0\` | \`v = d.get(key, 0)\` | 기본값 조회 |
| LBYL: \`if key in d: use(d[key])\` | EAFP: \`try: use(d[key]) except KeyError: ...\` | 허가보다 용서 |

**EAFP** (Easier to Ask for Forgiveness than Permission) 는 Python의 핵심 철학입니다.`,
    },
    {
      type: "code",
      source: `# 관용구 직접 비교

# 1) 변수 스왑
a, b = 1, 2
a, b = b, a
print(f"스왑: a={a}, b={b}")

# 2) 빈 리스트 체크 — 'not' 이 Pythonic
my_list = []
if not my_list:
    print("리스트가 비어있습니다")

# 3) 문자열 결합 — join 이 O(n), += 은 O(n^2)
fruits = ["사과", "바나나", "체리"]
print(", ".join(fruits))

# 4) dict.get 기본값
config = {"host": "localhost"}
port = config.get("port", 8080)
print(f"port = {port}")

# 5) EAFP 패턴
data = {"name": "Python"}
try:
    print(data["version"])
except KeyError:
    print("version 키 없음 — 기본값 사용")`,
    },
    {
      type: "markdown",
      source: `## 미션 1: Counter로 빈출 단어 찾기

텍스트에서 **가장 많이 등장하는 단어 3개**를 찾아보세요.

요구사항:
1. 텍스트를 소문자로 변환하고 \`.split()\`으로 단어 분리
2. \`Counter\`를 사용해서 빈도 집계
3. \`.most_common(3)\`으로 상위 3개 출력`,
    },
    {
      type: "code",
      source: `from collections import Counter

text = """
Python is a great language Python is easy to learn
Python has many libraries Python is used for web development
data science machine learning and Python is the best choice
for beginners Python Python Python
"""

# 가장 많이 등장하는 단어 3개를 찾아보세요
`,
      hints: [
        "`text.lower().split()`으로 단어 리스트를 만드세요.",
        "`Counter(words)`로 빈도를 세고, `.most_common(3)`을 호출하세요.",
        "결과를 for 루프로 순회하면 `(단어, 횟수)` 튜플이 나옵니다.",
      ],
      solution: `from collections import Counter

text = """
Python is a great language Python is easy to learn
Python has many libraries Python is used for web development
data science machine learning and Python is the best choice
for beginners Python Python Python
"""

words = text.lower().split()
counter = Counter(words)

print("=== 가장 많이 등장하는 단어 TOP 3 ===")
for word, count in counter.most_common(3):
    print(f"  {word}: {count}회")`,
    },
    {
      type: "markdown",
      source: `## 미션 2: 타이머 컨텍스트 매니저 만들기

\`@contextmanager\` 데코레이터를 사용해서 **코드 실행 시간을 측정하는 컨텍스트 매니저**를 만드세요.

요구사항:
1. \`contextlib.contextmanager\`를 사용
2. \`yield\` 전후로 시간 측정
3. 라벨을 인자로 받아서 출력에 포함
4. 두 가지 작업의 실행 시간을 비교해보세요`,
    },
    {
      type: "code",
      source: `from contextlib import contextmanager
import time

# measure_time(label) 컨텍스트 매니저를 만드세요

# 테스트: 리스트 컴프리헨션 vs 일반 루프 속도 비교
# with measure_time("리스트 컴프리헨션"):
#     result1 = [x**2 for x in range(300_000)]
#
# with measure_time("일반 for 루프"):
#     result2 = []
#     for x in range(300_000):
#         result2.append(x**2)
`,
      hints: [
        "`@contextmanager`를 함수 위에 붙이고, `def measure_time(label):`로 시작하세요.",
        "`yield` 앞에서 `start = time.time()`을 기록하세요.",
        "`yield` 뒤에서 `time.time() - start`를 계산하고 `print`로 출력하세요.",
      ],
      solution: `from contextlib import contextmanager
import time

@contextmanager
def measure_time(label):
    start = time.time()
    yield
    elapsed = time.time() - start
    print(f"[{label}] 실행 시간: {elapsed:.4f}초")

# 테스트: 리스트 컴프리헨션 vs 일반 루프 속도 비교
with measure_time("리스트 컴프리헨션"):
    result1 = [x**2 for x in range(300_000)]

with measure_time("일반 for 루프"):
    result2 = []
    for x in range(300_000):
        result2.append(x**2)

print(f"결과 길이: {len(result1)}, {len(result2)}")`,
    },
    {
      type: "markdown",
      source: `## Intermediate Track 완료!

축하합니다! Python 중급 트랙을 모두 마쳤습니다.

이 트랙에서 다룬 내용:
- 리스트/딕셔너리 컴프리헨션
- 제너레이터와 이터레이터
- 데코레이터와 클로저
- 타입 힌트와 데이터 클래스
- 실전 패턴과 관용구

### 다음 단계 추천

| 분야 | 추천 프레임워크/도구 | 설명 |
|---|---|---|
| 웹 개발 | Flask, FastAPI, Django | REST API부터 풀스택까지 |
| 데이터 과학 | pandas, numpy, matplotlib | 데이터 분석과 시각화 |
| 머신러닝 | scikit-learn, PyTorch | ML/DL 모델 구축 |
| 자동화 | selenium, requests, BeautifulSoup | 웹 스크래핑, 업무 자동화 |
| 테스트 | pytest, unittest | 테스트 주도 개발 |

Python의 진정한 힘은 **풍부한 생태계**에 있습니다. 관심 분야를 골라 깊이 파고들어 보세요!`,
    },
    {
      type: "code",
      source: `# 마지막 자유 실험 공간
# 이번 트랙에서 배운 모든 것을 활용해보세요!
`,
    },
  ],
  quiz: {
    title: "챕터 5 퀴즈 — 실전 Python 패턴",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `from collections import Counter\nfruits = ["apple", "banana", "apple", "apple", "banana"]\nc = Counter(fruits)\nprint(c.most_common(1)[0])`,
        options: [
          "('apple', 3)",
          "apple",
          "3",
          "[('apple', 3)]",
        ],
        correctIndex: 0,
        explanation:
          "Counter.most_common(1)은 [('apple', 3)]을 반환합니다. [0]으로 첫 번째 요소를 꺼내면 튜플 ('apple', 3)이 됩니다.",
      },
      {
        type: "multiple-choice",
        question:
          "컨텍스트 매니저의 `__exit__` 메서드가 `True`를 반환하면 어떻게 되나요?",
        options: [
          "with 블록이 다시 실행된다",
          "with 블록 안에서 발생한 예외가 억제(무시)된다",
          "프로그램이 즉시 종료된다",
          "__enter__가 다시 호출된다",
        ],
        correctIndex: 1,
        explanation:
          "__exit__가 True를 반환하면 with 블록 내부에서 발생한 예외가 전파되지 않고 억제됩니다. False(기본값)면 예외가 그대로 전파됩니다.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `d1 = {"a": 1, "b": 2}\nd2 = {"b": 99, "c": 3}\nresult = d1 | d2\nprint(result["b"])`,
        options: ["2", "99", "101", "KeyError"],
        correctIndex: 1,
        explanation:
          "| 연산자로 딕셔너리를 병합하면, 키가 겹칠 때 오른쪽(d2)의 값이 우선합니다. d2의 b가 99이므로 결과는 99입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "다음 중 Pythonic한 코드가 아닌 것은?",
        options: [
          'a, b = b, a',
          'if not my_list:',
          'if len(my_list) == 0:',
          '", ".join(names)',
        ],
        correctIndex: 2,
        explanation:
          "`if len(my_list) == 0:`은 동작하지만 Pythonic하지 않습니다. 빈 리스트는 falsy이므로 `if not my_list:`가 관용적인 표현입니다.",
      },
    ],
  } satisfies Quiz,
};

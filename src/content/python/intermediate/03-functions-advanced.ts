import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson03: Lesson = {
  id: "python-intermediate-03",
  language: "python",
  track: "intermediate",
  order: 3,
  title: "함수의 진짜 힘",
  subtitle: "*args, **kwargs, lambda, 클로저, 데코레이터",
  estimatedMinutes: 30,
  cells: [
    {
      type: "markdown",
      source: `# 함수의 진짜 힘

다른 언어에서 함수는 이미 익숙하시죠. Python 함수에는 **다른 언어에 없거나 문법이 크게 다른** 강력한 기능들이 있습니다.

이번 챕터에서 다룰 내용:
- \`*args\`, \`**kwargs\` — 가변 인자
- \`lambda\` — 익명 함수
- \`map()\`, \`filter()\` vs 리스트 컴프리헨션
- **클로저** — 함수가 함수를 반환할 때
- **데코레이터** — \`@\` 문법으로 함수 감싸기
- \`functools.wraps\`
- 함수 타입 힌트`,
    },
    {
      type: "markdown",
      source: `## *args — 위치 인자를 튜플로 받기

Java의 가변인자(\`int... nums\`)와 비슷하지만, Python은 \`*\` 하나로 끝납니다.
\`*args\`는 관례적 이름이고, 실제로는 \`*\` 뒤에 아무 이름이나 쓸 수 있어요.`,
    },
    {
      type: "code",
      source: `def total(*args):
    print(f"타입: {type(args)}")  # tuple
    print(f"값: {args}")
    return sum(args)

print(total(1, 2, 3))
print(total(10, 20, 30, 40, 50))`,
    },
    {
      type: "markdown",
      source: `## **kwargs — 키워드 인자를 딕셔너리로 받기

\`**kwargs\`는 이름=값 형태의 인자를 모두 딕셔너리로 모아줍니다.
JavaScript의 \`{...options}\` 패턴과 비슷한 역할이에요.`,
    },
    {
      type: "code",
      source: `def build_profile(name, **kwargs):
    profile = {"name": name}
    profile.update(kwargs)
    return profile

user = build_profile("김철수", age=30, city="서울", job="개발자")
print(user)
# {'name': '김철수', 'age': 30, 'city': '서울', 'job': '개발자'}`,
    },
    {
      type: "code",
      source: `# *args와 **kwargs를 함께 쓰기
# 순서: 일반 -> *args -> **kwargs
def debug_call(func_name, *args, **kwargs):
    print(f"호출: {func_name}")
    print(f"  위치 인자: {args}")
    print(f"  키워드 인자: {kwargs}")

debug_call("connect", "localhost", 8080, timeout=30, retry=True)`,
    },
    {
      type: "markdown",
      source: `## lambda — 익명 함수

\`lambda\`는 **한 줄짜리 이름 없는 함수**입니다. \`def\` 없이 바로 함수를 만들 수 있어요.

\`\`\`python
lambda 매개변수: 표현식
\`\`\`

Java의 \`(x) -> x * 2\`, JavaScript의 \`(x) => x * 2\` 에 해당합니다.
단, Python lambda는 **표현식 하나만** 가능 (여러 줄 불가).`,
    },
    {
      type: "code",
      source: `# sorted()에서 정렬 기준으로 자주 쓰임
students = [
    {"name": "영희", "grade": 92},
    {"name": "철수", "grade": 85},
    {"name": "민수", "grade": 97},
]

# grade 기준으로 정렬
by_grade = sorted(students, key=lambda s: s["grade"], reverse=True)
for s in by_grade:
    print(f'{s["name"]}: {s["grade"]}점')`,
    },
    {
      type: "markdown",
      source: `## map(), filter() vs 리스트 컴프리헨션

다른 언어에서 익숙한 \`map\`/\`filter\`도 있지만, Python에서는 **리스트 컴프리헨션이 더 Pythonic**합니다.`,
    },
    {
      type: "code",
      source: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map + filter 방식
evens_doubled = list(map(lambda x: x * 2, filter(lambda x: x % 2 == 0, numbers)))

# 리스트 컴프리헨션 — 같은 결과, 더 읽기 쉬움
evens_doubled2 = [x * 2 for x in numbers if x % 2 == 0]

print(evens_doubled)   # [4, 8, 12, 16, 20]
print(evens_doubled2)  # [4, 8, 12, 16, 20]
# 둘 다 같지만, 컴프리헨션이 Python 커뮤니티에서 선호됨`,
    },
    {
      type: "markdown",
      source: `## 클로저 (Closure) — 상태를 기억하는 함수

함수 안에서 함수를 만들어 반환하면, **내부 함수가 외부 함수의 변수를 기억**합니다.
이를 **클로저**라고 해요. JavaScript에서 자주 쓰이는 그 클로저와 같은 개념입니다.`,
    },
    {
      type: "code",
      source: `def make_multiplier(n):
    def multiply(x):
        return x * n    # n은 외부 함수의 변수 — 클로저가 캡처
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))   # 10
print(triple(5))   # 15
print(double(7))   # 14`,
    },
    {
      type: "markdown",
      source: `## 데코레이터 — 함수를 감싸는 함수

데코레이터는 **기존 함수를 수정하지 않고 기능을 추가**하는 패턴입니다.
Java의 어노테이션과 비슷해 보이지만, 실제로는 **함수를 인자로 받아 새 함수를 반환**하는 것이에요.

\`\`\`python
@decorator
def func():
    ...
# 이것은 func = decorator(func) 와 완전히 동일
\`\`\``,
    },
    {
      type: "code",
      source: `import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"[{func.__name__}] 실행 시간: {elapsed:.4f}초")
        return result
    return wrapper

@timer
def slow_add(a, b):
    time.sleep(0.1)  # 일부러 느리게
    return a + b

result = slow_add(3, 5)
print(f"결과: {result}")`,
    },
    {
      type: "markdown",
      source: `## functools.wraps — 데코레이터의 함정 피하기

데코레이터를 적용하면 원래 함수의 \`__name__\`, \`__doc__\` 등이 wrapper 것으로 바뀝니다.
\`functools.wraps\`를 쓰면 원본 함수의 메타데이터를 보존할 수 있어요.`,
    },
    {
      type: "code",
      source: `from functools import wraps

def logger(func):
    @wraps(func)  # 이걸 빼면 __name__이 "wrapper"로 나옴
    def wrapper(*args, **kwargs):
        print(f">>> {func.__name__} 호출됨, args={args}")
        result = func(*args, **kwargs)
        print(f"<<< {func.__name__} 반환값: {result}")
        return result
    return wrapper

@logger
def add(a, b):
    """두 수를 더합니다."""
    return a + b

print(add(3, 5))
print(f"함수 이름: {add.__name__}")  # @wraps 덕분에 "add"
print(f"독스트링: {add.__doc__}")    # @wraps 덕분에 원본 유지`,
    },
    {
      type: "markdown",
      source: `## 타입 힌트 — 함수 시그니처를 명확하게

Python 3.5+부터 타입 힌트를 지원합니다. **런타임에 강제되지 않지만**, IDE와 mypy 같은 도구가 활용해요.`,
    },
    {
      type: "code",
      source: `from typing import Optional, Union

def greet(name: str, times: int = 1) -> str:
    return (f"안녕, {name}! " * times).strip()

def find_user(user_id: int) -> Optional[dict]:
    """유저를 찾으면 dict, 없으면 None"""
    users = {1: {"name": "철수"}, 2: {"name": "영희"}}
    return users.get(user_id)

def parse_input(value: Union[str, int]) -> int:
    """문자열이든 정수든 정수로 변환"""
    return int(value)

print(greet("Python", 3))
print(find_user(1))
print(find_user(99))
print(parse_input("42"))`,
    },
    {
      type: "markdown",
      source: `## 미션 1: retry 데코레이터 만들기

예외가 발생하면 **N번까지 재시도**하는 데코레이터를 만들어보세요.

요구사항:
- \`retry(max_attempts)\` — 인자를 받는 데코레이터
- 함수 호출 시 예외가 나면 재시도, \`max_attempts\`번 모두 실패하면 마지막 예외를 raise
- 각 시도마다 "시도 n/N..." 메시지 출력
- \`functools.wraps\` 사용`,
    },
    {
      type: "code",
      source: `from functools import wraps

# retry 데코레이터를 만드세요

# 테스트용: 3번 중 랜덤으로 실패하는 함수
import random

@retry(max_attempts=5)
def unstable_api():
    if random.random() < 0.7:
        raise ConnectionError("서버 응답 없음")
    return {"status": "ok"}

result = unstable_api()
print(f"성공: {result}")`,
      hints: [
        "데코레이터가 인자를 받으려면 함수를 3겹으로 중첩해야 합니다: retry(max_attempts) -> decorator(func) -> wrapper(*args, **kwargs)",
        "wrapper 안에서 for 루프로 max_attempts만큼 시도하고, try/except로 감싸세요.",
        "마지막 시도까지 실패하면 `raise`로 예외를 다시 던지세요.",
      ],
      solution: `from functools import wraps
import random

def retry(max_attempts=3):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(1, max_attempts + 1):
                try:
                    print(f"시도 {attempt}/{max_attempts}...")
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    print(f"  실패: {e}")
            raise last_exception
        return wrapper
    return decorator

@retry(max_attempts=5)
def unstable_api():
    if random.random() < 0.7:
        raise ConnectionError("서버 응답 없음")
    return {"status": "ok"}

result = unstable_api()
print(f"성공: {result}")`,
    },
    {
      type: "markdown",
      source: `## 미션 2: lambda + sorted로 다중 기준 정렬

직원 목록을 **부서별 오름차순, 같은 부서 내에서는 연봉 내림차순**으로 정렬하세요.

\`sorted()\`의 \`key\` 인자에 \`lambda\`를 써서 **튜플을 반환**하면 다중 기준 정렬이 됩니다.
(튜플은 첫 번째 원소로 먼저 비교, 같으면 두 번째로 비교)`,
    },
    {
      type: "code",
      source: `employees = [
    {"name": "김철수", "dept": "개발", "salary": 5500},
    {"name": "이영희", "dept": "기획", "salary": 4800},
    {"name": "박민수", "dept": "개발", "salary": 6200},
    {"name": "정지은", "dept": "기획", "salary": 5100},
    {"name": "최동현", "dept": "개발", "salary": 5800},
    {"name": "한수진", "dept": "디자인", "salary": 4500},
]

# sorted + lambda로 부서별 오름차순, 연봉 내림차순 정렬하세요

for emp in sorted_employees:
    print(f'{emp["dept"]:4s} | {emp["name"]} | {emp["salary"]}만원')`,
      hints: [
        "다중 기준 정렬: `key=lambda e: (기준1, 기준2)` 형태의 튜플을 반환하세요.",
        "연봉 내림차순은 `-e[\"salary\"]`처럼 음수를 쓰면 됩니다 (숫자일 때만 가능).",
        "`sorted_employees = sorted(employees, key=lambda e: (e['dept'], -e['salary']))`",
      ],
      solution: `employees = [
    {"name": "김철수", "dept": "개발", "salary": 5500},
    {"name": "이영희", "dept": "기획", "salary": 4800},
    {"name": "박민수", "dept": "개발", "salary": 6200},
    {"name": "정지은", "dept": "기획", "salary": 5100},
    {"name": "최동현", "dept": "개발", "salary": 5800},
    {"name": "한수진", "dept": "디자인", "salary": 4500},
]

sorted_employees = sorted(employees, key=lambda e: (e["dept"], -e["salary"]))

for emp in sorted_employees:
    print(f'{emp["dept"]:4s} | {emp["name"]} | {emp["salary"]}만원')`,
    },
    {
      type: "markdown",
      source: `## 챕터 3 완료!

이번 챕터에서 배운 것:
- \`*args\`, \`**kwargs\`로 유연한 함수 시그니처
- \`lambda\`와 \`sorted()\`, \`map()\`, \`filter()\`
- 리스트 컴프리헨션이 map/filter보다 Pythonic
- 클로저로 상태를 캡처하는 함수 만들기
- 데코레이터 \`@\` 문법과 직접 작성법
- \`functools.wraps\`로 메타데이터 보존
- 타입 힌트 (\`->\`, \`Optional\`, \`Union\`)

다음 챕터에서는 **클래스의 진짜 파이썬다운 사용법**을 배워봅시다.`,
    },
  ],
  quiz: {
    title: "챕터 3 퀴즈 — 함수의 진짜 힘",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `def f(*args, **kwargs):\n    print(len(args), len(kwargs))\n\nf(1, 2, 3, x=10, y=20)`,
        options: ["5 0", "3 2", "2 3", "에러가 난다"],
        correctIndex: 1,
        explanation:
          "1, 2, 3은 위치 인자로 args 튜플에 (길이 3), x=10, y=20은 키워드 인자로 kwargs 딕셔너리에 (길이 2) 들어갑니다.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `make = lambda x: lambda y: x + y\nadd5 = make(5)\nprint(add5(3))`,
        options: ["8", "5", "3", "에러가 난다"],
        correctIndex: 0,
        explanation:
          "make(5)는 lambda y: 5 + y를 반환합니다. 이 함수에 3을 넣으면 5 + 3 = 8. 이것이 클로저입니다.",
      },
      {
        type: "multiple-choice",
        question:
          "데코레이터에서 `functools.wraps`를 사용하는 이유는?",
        options: [
          "데코레이터 실행 속도를 높이기 위해",
          "원래 함수의 __name__, __doc__ 등 메타데이터를 보존하기 위해",
          "데코레이터가 인자를 받을 수 있게 하기 위해",
          "데코레이터를 여러 번 중첩할 수 있게 하기 위해",
        ],
        correctIndex: 1,
        explanation:
          "@wraps(func)는 wrapper 함수의 __name__, __doc__ 등을 원본 func의 것으로 덮어써서, 디버깅이나 help() 호출 시 원래 함수 정보가 나오게 합니다.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `nums = [1, 2, 3, 4, 5]\nresult = list(filter(lambda x: x > 3, nums))\nprint(result)`,
        options: ["[1, 2, 3]", "[4, 5]", "[True, False]", "[3, 4, 5]"],
        correctIndex: 1,
        explanation:
          "filter는 조건이 True인 요소만 남깁니다. x > 3인 것은 4와 5이므로 [4, 5]가 됩니다.",
      },
    ],
  } satisfies Quiz,
};

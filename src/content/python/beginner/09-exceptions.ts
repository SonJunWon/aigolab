import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson09: Lesson = {
  id: "python-beginner-09",
  language: "python",
  track: "beginner",
  order: 9,
  title: "에러를 다루는 법 — 예외 처리",
  subtitle: "try/except 로 프로그램이 죽지 않게 지키기",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 🛡️ 에러를 다루는 법 — 예외 처리

프로그램에서 에러가 나면 **그 즉시 멈춰버려요**. 하지만 실제 서비스에서는 에러가 나도 **계속 동작**해야 할 때가 많죠.

- 사용자가 숫자 대신 글자를 입력했을 때
- 존재하지 않는 파일을 열려 했을 때
- 0으로 나누기를 했을 때

\`try/except\` 로 **에러를 잡아서 처리**하는 법을 배워봅시다.

이번 챕터에서 배울 것:
- \`try\` / \`except\` 기본 구조
- **여러 종류의 에러** 잡기
- \`finally\` — 에러든 아니든 반드시 실행
- \`raise\` — 일부러 에러 일으키기`,
    },
    {
      type: "markdown",
      source: `## 💥 에러 없이는 — 프로그램이 멈춤

아래 코드는 0으로 나누기 에러로 멈춰요. 두 번째 \`print\` 는 실행되지 않아요.`,
    },
    {
      type: "code",
      source: `print("시작")
result = 10 / 0      # ← 여기서 멈춤
print("끝")          # ← 실행 안 됨`,
    },
    {
      type: "markdown",
      source: `## 🛡️ try/except — 에러를 잡아서 처리

\`\`\`python
try:
    위험할 수 있는 코드
except:
    에러가 나면 실행할 코드
\`\`\``,
    },
    {
      type: "code",
      source: `print("시작")

try:
    result = 10 / 0
except:
    print("에러가 발생했지만, 프로그램은 계속 돌아가요!")

print("끝")   # ← 이제 실행돼요!`,
    },
    {
      type: "markdown",
      source: `## 🎯 에러 종류별로 잡기

\`except\` 뒤에 에러 타입을 써주면 **특정 에러만** 잡을 수 있어요.`,
    },
    {
      type: "code",
      source: `# 에러 종류별 처리
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        print("0으로 나눌 수 없어요!")
        return None
    except TypeError:
        print("숫자만 넣어주세요!")
        return None

print(safe_divide(10, 3))
print(safe_divide(10, 0))
print(safe_divide("10", 3))`,
    },
    {
      type: "markdown",
      source: `### 에러 메시지 가져오기

\`except 에러타입 as 변수:\` 로 **에러 객체** 를 변수(\`e\`) 에 담을 수 있어요.
\`e\` 를 \`f"..."\` 안에 넣으면 에러 메시지가 들어가요.

> 🌐 **참고**: Python 의 에러 메시지는 **영어로 고정**돼 있어요.
> (\`invalid literal for int() with base 10: '안녕'\` 같이)
> 사용자에게 한국어로 보여주고 싶으면 직접 메시지를 작성해야 해요 — 다음 예제 참고.`,
    },
    {
      type: "code",
      source: `# 방법 1: Python 의 원본 에러 메시지 그대로 (영어)
try:
    number = int("안녕")
except ValueError as e:
    print(f"변환 실패: {e}")
    # 출력 → 변환 실패: invalid literal for int() with base 10: '안녕'
    #         ↑ 한글 ↑   ↑ Python 이 만든 영어 메시지 ↑`,
    },
    {
      type: "markdown",
      source: `### 한국어로 친절하게 알려주기

영어 메시지가 어색하면 **\`as e\` 를 빼고** 우리가 직접 한국어 메시지를 출력하면 돼요.`,
    },
    {
      type: "code",
      source: `# 방법 2: 우리가 한국어로 친절하게
text = "안녕"
try:
    number = int(text)
except ValueError:
    print(f"'{text}' 는 숫자로 바꿀 수 없어요. 숫자로 된 문자열만 가능해요.")
    # 출력 → '안녕' 는 숫자로 바꿀 수 없어요. 숫자로 된 문자열만 가능해요.

# 두 방법을 합치면 — 사용자에겐 한국어, 로그엔 원본 영어
try:
    number = int("hello")
except ValueError as e:
    print("⚠️ 입력값이 숫자가 아니에요.")        # 사용자용
    print(f"   (개발자 로그: {e})")              # 디버깅용`,
    },
    {
      type: "markdown",
      source: `## 🔒 finally — 무조건 실행

\`finally\` 블록은 **에러가 나든 안 나든** 반드시 실행돼요. 정리 작업에 쓰여요.`,
    },
    {
      type: "code",
      source: `def process(value):
    try:
        result = 100 / value
        print(f"결과: {result}")
    except ZeroDivisionError:
        print("0으로 나눌 수 없어요!")
    finally:
        print("처리 완료 (항상 실행)")

print("--- 정상 ---")
process(5)
print("--- 에러 ---")
process(0)`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

숫자 문자열 리스트가 있어요. 각 값을 정수로 변환하고, **변환에 실패하면 건너뛰는** 함수를 만들어보세요.

입력: \`["10", "hello", "30", "world", "50"]\`
출력: \`[10, 30, 50]\``,
    },
    {
      type: "code",
      source: `values = ["10", "hello", "30", "world", "50"]

# 변환 가능한 것만 골라서 정수 리스트 만들기
`,
      hints: [
        "빈 리스트를 만들고 반복문으로 하나씩 시도하세요.",
        "`try: result.append(int(v))` → `except ValueError: pass` 패턴을 쓰세요.",
        "`pass` 는 '아무것도 하지 않음'이에요. except 블록에서 에러를 무시할 때 써요.",
      ],
      solution: `values = ["10", "hello", "30", "world", "50"]

result = []
for v in values:
    try:
        result.append(int(v))
    except ValueError:
        pass

print(result)`,
    },
    {
      type: "markdown",
      source: `## 🚨 raise — 일부러 에러 일으키기

때로는 **의도적으로 에러를 일으켜야** 할 때가 있어요. 잘못된 입력이 들어왔을 때 명확하게 알려주는 거죠.`,
    },
    {
      type: "code",
      source: `def set_age(age):
    if age < 0:
        raise ValueError("나이는 음수일 수 없어요!")
    if age > 200:
        raise ValueError("나이가 너무 커요!")
    print(f"나이가 {age}로 설정되었습니다.")

try:
    set_age(25)      # OK
    set_age(-5)      # raise 발생
except ValueError as e:
    print(f"에러: {e}")`,
    },
    {
      type: "markdown",
      source: `## 🧩 else 블록

\`try/except\` 에는 \`else\` 도 붙일 수 있어요. **에러가 안 났을 때만** 실행돼요.

\`\`\`python
try:
    위험한 코드
except 에러타입:
    에러 시 실행
else:
    에러 없을 때만 실행
finally:
    항상 실행
\`\`\``,
    },
    {
      type: "code",
      source: `def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("에러: 0으로 나눌 수 없어요!")
    else:
        print(f"성공: {result}")
    finally:
        print("---")

divide(10, 3)
divide(10, 0)`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

**안전한 딕셔너리 조회 함수** \`safe_get(dictionary, key)\` 를 만들어보세요.

- 키가 있으면 값을 반환
- **없으면 \`KeyError\` 를 잡아서** \`"키를 찾을 수 없습니다: {key}"\` 를 출력하고 \`None\` 반환`,
    },
    {
      type: "code",
      source: `# safe_get 함수를 만들어보세요

data = {"name": "철수", "age": 25}

# 테스트
print(safe_get(data, "name"))
print(safe_get(data, "email"))`,
      hints: [
        "`def safe_get(dictionary, key):` 로 시작하고 `try: return dictionary[key]` 를 쓰세요.",
        "`except KeyError:` 로 잡고 메시지 출력 후 `return None`.",
        "사실 `.get()` 메서드가 같은 기능이지만, 예외 처리 연습이 목적이에요.",
      ],
      solution: `def safe_get(dictionary, key):
    try:
        return dictionary[key]
    except KeyError:
        print(f"키를 찾을 수 없습니다: {key}")
        return None

data = {"name": "철수", "age": 25}

print(safe_get(data, "name"))
print(safe_get(data, "email"))`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 9 완료!

오늘 배운 것:
- ✅ \`try/except\` 로 에러 잡기
- ✅ 에러 종류별 처리 (\`ZeroDivisionError\`, \`ValueError\`, \`TypeError\`, \`KeyError\`)
- ✅ \`as e\` 로 에러 메시지 가져오기
- ✅ \`finally\` — 항상 실행되는 정리 코드
- ✅ \`raise\` — 의도적으로 에러 일으키기
- ✅ \`else\` — 에러 없을 때만 실행

**다음 챕터에서는**: 나만의 타입을 만드는 **클래스(class)** 를 배워요.

아래에서 자유롭게 실험해보세요:`,
    },
    {
      type: "code",
      source: `# 여기서 자유롭게 실험해보세요
`,
    },
  ],
  quiz: {
    title: "챕터 9 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `try:\n    print("A")\n    x = 1 / 0\n    print("B")\nexcept:\n    print("C")\nprint("D")`,
        options: ["A B C D", "A C D", "A B D", "C D"],
        correctIndex: 1,
        explanation: "\"A\" 출력 후 에러 → except로 점프해서 \"C\" 출력 → try/except 끝나고 \"D\" 출력. \"B\"는 에러 이후라 실행 안 됨.",
      },
      {
        type: "multiple-choice",
        question: "`finally` 블록은 언제 실행될까요?",
        options: [
          "에러가 났을 때만",
          "에러가 안 났을 때만",
          "에러가 나든 안 나든 항상",
          "return 이 있을 때만",
        ],
        correctIndex: 2,
        explanation: "finally는 에러 여부와 관계없이 항상 실행돼요. 정리 작업에 적합합니다.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `try:\n    num = int("hello")\nexcept ValueError:\n    num = 0\nprint(num)`,
        options: ["hello", "0", "None", "에러가 난다"],
        correctIndex: 1,
        explanation: "int(\"hello\")는 ValueError. except에서 num=0으로 설정. 결과는 0.",
      },
      {
        type: "multiple-choice",
        question: "`raise` 키워드의 역할은?",
        options: [
          "에러를 무시한다",
          "에러를 잡는다",
          "일부러 에러를 발생시킨다",
          "프로그램을 종료한다",
        ],
        correctIndex: 2,
        explanation: "raise는 의도적으로 에러를 일으켜요. 잘못된 입력을 감지했을 때 명확히 알려주는 용도.",
      },
    ],
  } satisfies Quiz,
};

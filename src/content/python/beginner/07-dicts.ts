import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson07: Lesson = {
  id: "python-beginner-07",
  language: "python",
  track: "beginner",
  order: 7,
  title: "이름표를 붙이자 — 딕셔너리",
  subtitle: "key: value 쌍으로 데이터를 정리하기",
  estimatedMinutes: 20,
  cells: [
    {
      type: "markdown",
      source: `# 🏷️ 이름표를 붙이자 — 딕셔너리

리스트는 **순서(번호)** 로 값을 찾았죠. 하지만 "이 학생의 점수" 처럼 **이름으로** 찾고 싶을 때가 있어요.

- 이름 → 전화번호
- 상품명 → 가격
- 나라 → 수도

이럴 때 **딕셔너리(dict)** 를 써요. **키(key)** 로 **값(value)** 을 찾는 구조입니다.

이번 챕터에서 배울 것:
- \`{키: 값}\` 으로 딕셔너리 만들기
- 값 **조회, 추가, 수정, 삭제**
- \`for\` 로 딕셔너리 순회
- 실전 예제: 단어장, 성적표`,
    },
    {
      type: "markdown",
      source: `## 📦 딕셔너리 만들기

중괄호 \`{ }\` 안에 \`키: 값\` 쌍을 넣어요.`,
    },
    {
      type: "code",
      source: `student = {
    "이름": "김철수",
    "나이": 20,
    "전공": "컴퓨터공학",
}

print(student)
print(type(student))`,
    },
    {
      type: "markdown",
      source: `## 🔍 값 조회

\`딕셔너리[키]\` 로 값을 꺼내요.`,
    },
    {
      type: "code",
      source: `student = {"이름": "김철수", "나이": 20, "전공": "컴퓨터공학"}

print(student["이름"])    # 김철수
print(student["나이"])    # 20

# 없는 키를 쓰면 KeyError!
# print(student["학번"])  # ← 에러!

# .get() 을 쓰면 없을 때 기본값 반환 (에러 안 남)
print(student.get("학번", "정보 없음"))`,
    },
    {
      type: "markdown",
      source: `## ✏️ 값 추가 / 수정 / 삭제

| 동작 | 방법 | 예시 |
|---|---|---|
| **추가** | \`d[새키] = 값\` | \`student["학번"] = "2024001"\` |
| **수정** | \`d[기존키] = 새값\` | \`student["나이"] = 21\` |
| **삭제** | \`del d[키]\` | \`del student["전공"]\` |
| **안전 삭제** | \`d.pop(키, 기본)\` | \`student.pop("전공", None)\` |`,
    },
    {
      type: "code",
      source: `student = {"이름": "김철수", "나이": 20}

# 추가
student["전공"] = "컴퓨터공학"
print(student)

# 수정
student["나이"] = 21
print(student)

# 삭제
del student["전공"]
print(student)`,
    },
    {
      type: "markdown",
      source: `## 🔁 딕셔너리 순회

\`for\` 로 키, 값, 또는 둘 다 순회할 수 있어요.`,
    },
    {
      type: "code",
      source: `prices = {"사과": 1500, "바나나": 1000, "오렌지": 2000}

# 키만 순회
for fruit in prices:
    print(fruit)

print("---")

# 키와 값을 함께 순회
for fruit, price in prices.items():
    print(f"{fruit}: {price}원")`,
    },
    {
      type: "markdown",
      source: `유용한 메서드:
- \`.keys()\` — 모든 키
- \`.values()\` — 모든 값
- \`.items()\` — (키, 값) 쌍
- \`키 in 딕셔너리\` — 키 존재 여부`,
    },
    {
      type: "code",
      source: `prices = {"사과": 1500, "바나나": 1000, "오렌지": 2000}

print(list(prices.keys()))
print(list(prices.values()))
print("사과" in prices)     # True
print("포도" in prices)     # False`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 1

아래 딕셔너리에서 **모든 상품의 총 가격**을 구하세요.

출력: \`총 가격: 8500원\``,
    },
    {
      type: "code",
      source: `shop = {"노트": 1500, "펜": 2000, "지우개": 500, "자": 1000, "풀": 3500}

# 모든 상품 가격의 합계를 구해서 출력하세요
`,
      hints: [
        "`total = 0` 을 만들고 `.values()` 로 가격만 순회하세요.",
        "`for price in shop.values(): total += price`",
        "또는 한 줄로: `sum(shop.values())`",
      ],
      solution: `shop = {"노트": 1500, "펜": 2000, "지우개": 500, "자": 1000, "풀": 3500}

total = sum(shop.values())
print(f"총 가격: {total}원")`,
    },
    {
      type: "markdown",
      source: `## 🎓 실전 예제: 성적표

딕셔너리는 **구조화된 데이터** 를 다루기에 아주 좋아요.`,
    },
    {
      type: "code",
      source: `# 여러 학생의 성적을 딕셔너리의 리스트로 관리
students = [
    {"이름": "김철수", "점수": 85},
    {"이름": "이영희", "점수": 92},
    {"이름": "박민수", "점수": 78},
    {"이름": "정지원", "점수": 95},
]

# 평균 계산
total = sum(s["점수"] for s in students)
avg = total / len(students)
print(f"평균 점수: {avg}")

# 90점 이상만 출력
print("\\n우수 학생:")
for s in students:
    if s["점수"] >= 90:
        print(f"  {s['이름']}: {s['점수']}점")`,
    },
    {
      type: "markdown",
      source: `## ✏️ 직접 해보기 — 미션 2

단어장 딕셔너리가 있어요. 사용자가 영어 단어를 입력하면 한국어 뜻을 출력하는 코드를 만들어보세요.

\`word\` 변수에 \`"apple"\` 이 들어있으면 \`"사과"\` 를 출력, 없는 단어면 \`"모르는 단어입니다"\` 를 출력.`,
    },
    {
      type: "code",
      source: `vocab = {"apple": "사과", "banana": "바나나", "cat": "고양이", "dog": "강아지"}
word = "apple"

# word 가 vocab 에 있으면 뜻을 출력, 없으면 "모르는 단어입니다" 출력
`,
      hints: [
        "`in` 키워드로 키가 딕셔너리에 있는지 확인할 수 있어요: `if word in vocab:`",
        "`vocab[word]` 로 뜻을 꺼내세요.",
        "또는 한 줄로: `print(vocab.get(word, \"모르는 단어입니다\"))`",
      ],
      solution: `vocab = {"apple": "사과", "banana": "바나나", "cat": "고양이", "dog": "강아지"}
word = "apple"

if word in vocab:
    print(vocab[word])
else:
    print("모르는 단어입니다")`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 7 완료!

오늘 배운 것:
- ✅ \`{키: 값}\` 으로 딕셔너리 만들기
- ✅ \`[키]\` 로 조회, \`.get()\` 으로 안전 조회
- ✅ 추가, 수정, 삭제
- ✅ \`.keys()\`, \`.values()\`, \`.items()\` 로 순회
- ✅ \`in\` 으로 키 존재 여부 확인
- ✅ 딕셔너리 리스트로 구조화된 데이터 관리

**다음 챕터에서는**: 반복되는 코드를 묶어서 재사용하는 **함수(function)** 를 배워요.

아래에서 자유롭게 실험해보세요:`,
    },
    {
      type: "code",
      source: `# 여기서 자유롭게 실험해보세요
`,
    },
  ],
  quiz: {
    title: "챕터 7 퀴즈",
    questions: [
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `d = {"a": 1, "b": 2, "c": 3}\nprint(d["b"])`,
        options: ["1", "2", "3", "에러가 난다"],
        correctIndex: 1,
        explanation: "딕셔너리에서 키 \"b\"에 해당하는 값은 2예요.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `d = {"x": 10}\nd["y"] = 20\nd["x"] = 30\nprint(d)`,
        options: [
          '{"x": 10, "y": 20}',
          '{"x": 30, "y": 20}',
          '{"x": 10}',
          "에러가 난다",
        ],
        correctIndex: 1,
        explanation: "d[\"y\"]=20은 추가, d[\"x\"]=30은 기존 값 수정. 결과는 {\"x\": 30, \"y\": 20}.",
      },
      {
        type: "predict-output",
        question: "이 코드를 실행하면 무엇이 출력될까요?",
        code: `d = {"a": 1, "b": 2}\nprint(d.get("c", 0))`,
        options: ["None", "0", "에러가 난다", "\"c\""],
        correctIndex: 1,
        explanation: ".get()은 키가 없으면 두 번째 인자(기본값)를 반환해요. 여기서는 0.",
      },
      {
        type: "multiple-choice",
        question: "딕셔너리에서 키가 존재하는지 확인하는 올바른 방법은?",
        options: [
          'if "name" == d:',
          'if "name" in d:',
          'if d.has("name"):',
          'if d.find("name"):',
        ],
        correctIndex: 1,
        explanation: "`in` 키워드로 딕셔너리에 해당 키가 있는지 확인해요.",
      },
    ],
  } satisfies Quiz,
};

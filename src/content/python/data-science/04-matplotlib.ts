import type { Lesson } from "../../../types/lesson";
import type { Quiz } from "../../../types/quiz";

export const lesson04: Lesson = {
  id: "python-ds-04",
  language: "python",
  track: "data-science" as any,
  order: 4,
  title: "Matplotlib — 데이터 시각화",
  subtitle: "차트와 그래프로 데이터를 눈에 보이게 만들어봅시다",
  estimatedMinutes: 25,
  cells: [
    {
      type: "markdown",
      source: `# 📈 Matplotlib — 데이터 시각화

데이터를 숫자로만 보면 패턴을 놓치기 쉬워요.
**시각화(Visualization)**를 하면 데이터의 이야기가 한눈에 보입니다!

이번 챕터에서 배울 것:
- **라인 차트** — 시간에 따른 변화
- **바 차트** — 카테고리별 비교
- **산점도** — 두 변수의 관계
- **히스토그램** — 분포 확인

> 🎉 **이제 브라우저에서 그래프가 바로 표시됩니다!** (v3.17.0 부터)
> \`plt.show()\` 호출 안 해도 자동으로 셀 출력에 PNG 로 렌더링돼요.
> 우측의 **↓ PNG** 버튼으로 그림 파일 다운로드도 가능합니다.
>
> 🇰🇷 한국어 폰트(NanumGothic) 자동 적용 — 한국어 라벨도 깨끗하게 표시됩니다 (v3.17.1 부터).`,
    },
    {
      type: "code",
      source: `import matplotlib
# matplotlib 버전 확인 — 이 환경에서는 그래프가 셀 출력에 PNG 로 자동 표시됨
print("Matplotlib 버전:", matplotlib.__version__)
print("백엔드:", matplotlib.get_backend())
print("→ 다음 셀들을 실행하면 그래프가 바로 보입니다!")`,
    },
    {
      type: "markdown",
      source: `## 📦 기본 import

Matplotlib의 pyplot 모듈을 \`plt\`로 불러오는 것이 관례입니다.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

# 이 환경에서는 plt.show() 안 해도 자동으로 그래프가 셀에 표시돼요.
# (Jupyter 의 %matplotlib inline 과 비슷한 동작)

print("plt 준비 완료! 아래 셀들을 실행하면 그래프가 바로 나옵니다 🎨")`,
    },
    {
      type: "markdown",
      source: `## 📉 라인 차트 (Line Chart)

시간에 따른 변화를 보여줄 때 가장 많이 사용합니다.
\`plt.plot()\`으로 그려요.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

# 월별 매출 데이터
months = ["1월", "2월", "3월", "4월", "5월", "6월"]
sales = [120, 135, 148, 162, 155, 178]

# 라인 차트 그리기
plt.figure(figsize=(8, 5))
plt.plot(months, sales, marker="o", color="blue", linewidth=2)

# 제목과 라벨
plt.title("월별 매출 추이", fontsize=16)
plt.xlabel("월")
plt.ylabel("매출 (만원)")
plt.grid(True, alpha=0.3)

# 그래프는 셀 출력에 자동으로 PNG 로 표시됩니다 (plt.show() 호출 불필요)

print("=== 라인 차트 ===")
print("아래에 그래프가 자동으로 표시됩니다 ↓")
print()
print("데이터 미리보기:")
for m, s in zip(months, sales):
    bar = "█" * (s // 10)
    print(f"  {m}: {s:>3}만원 {bar}")`,
    },
    {
      type: "markdown",
      source: `### 💡 여러 라인 그리기

\`plt.plot()\`을 여러 번 호출하면 한 그래프에 여러 라인을 그릴 수 있어요.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

months = ["1월", "2월", "3월", "4월", "5월", "6월"]
product_a = [120, 135, 148, 162, 155, 178]
product_b = [80, 95, 110, 105, 120, 130]

plt.figure(figsize=(8, 5))
plt.plot(months, product_a, marker="o", label="상품 A")
plt.plot(months, product_b, marker="s", label="상품 B")

plt.title("상품별 월별 매출")
plt.xlabel("월")
plt.ylabel("매출 (만원)")
plt.legend()  # 범례 표시
plt.grid(True, alpha=0.3)

# 그래프 ↓ 자동 표시

print("=== 다중 라인 차트 ===")
print("데이터 미리보기:")
for i, m in enumerate(months):
    print(f"  {m}: A={product_a[i]:>3}, B={product_b[i]:>3}")`,
    },
    {
      type: "markdown",
      source: `## 📊 바 차트 (Bar Chart)

카테고리별 비교에 가장 적합합니다.
\`plt.bar()\` 또는 \`plt.barh()\` (수평)를 사용해요.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

# 프로그래밍 언어별 인기도
languages = ["Python", "JavaScript", "Java", "C++", "Go"]
popularity = [85, 78, 65, 45, 42]
colors = ["#3776ab", "#f7df1e", "#f89820", "#00599c", "#00add8"]

plt.figure(figsize=(8, 5))
plt.bar(languages, popularity, color=colors)

plt.title("프로그래밍 언어 인기도", fontsize=16)
plt.xlabel("언어")
plt.ylabel("인기도 점수")

# 각 막대 위에 숫자 표시
for i, v in enumerate(popularity):
    plt.text(i, v + 1, str(v), ha="center", fontweight="bold")

# 그래프 ↓ 자동 표시

print("=== 바 차트 ===")
print("텍스트 미리보기:")
for lang, pop in zip(languages, popularity):
    bar = "█" * (pop // 5)
    print(f"  {lang:>12}: {pop:>2} {bar}")`,
    },
    {
      type: "markdown",
      source: `## 🔵 산점도 (Scatter Plot)

두 변수 사이의 **관계(상관관계)**를 파악할 때 사용합니다.
\`plt.scatter()\`로 그려요.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

# 공부 시간 vs 시험 점수
np.random.seed(42)
study_hours = np.random.uniform(1, 10, 30)
scores = study_hours * 8 + np.random.normal(0, 5, 30) + 20
scores = np.clip(scores, 0, 100)

plt.figure(figsize=(8, 5))
plt.scatter(study_hours, scores, alpha=0.7, color="coral", edgecolors="black")

plt.title("공부 시간 vs 시험 점수", fontsize=16)
plt.xlabel("공부 시간")
plt.ylabel("시험 점수")
plt.grid(True, alpha=0.3)

# 그래프 ↓ 자동 표시

print("=== 산점도 ===")
print(f"학생 수: {len(study_hours)}명")
print(f"공부 시간 범위: {study_hours.min():.1f} ~ {study_hours.max():.1f}시간")
print(f"점수 범위: {scores.min():.1f} ~ {scores.max():.1f}점")
print(f"상관계수: {np.corrcoef(study_hours, scores)[0,1]:.3f}")`,
    },
    {
      type: "markdown",
      source: `## 📊 히스토그램 (Histogram)

데이터의 **분포**를 확인할 때 사용합니다.
\`plt.hist()\`로 그려요.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

# 학생 100명의 시험 점수 (정규분포)
np.random.seed(42)
scores = np.random.normal(loc=75, scale=10, size=100)
scores = np.clip(scores, 0, 100)

plt.figure(figsize=(8, 5))
plt.hist(scores, bins=10, color="skyblue", edgecolor="black", alpha=0.7)

plt.title("시험 점수 분포", fontsize=16)
plt.xlabel("점수")
plt.ylabel("학생 수")
plt.axvline(np.mean(scores), color="red", linestyle="--", label=f"평균: {np.mean(scores):.1f}")
plt.legend()

# 그래프 ↓ 자동 표시

print("=== 히스토그램 ===")
print(f"학생 수: {len(scores)}명")
print(f"평균: {np.mean(scores):.1f}")
print(f"표준편차: {np.std(scores):.1f}")
print(f"최소~최대: {np.min(scores):.1f} ~ {np.max(scores):.1f}")
print()
print("간이 분포:")
hist, edges = np.histogram(scores, bins=5)
for i in range(len(hist)):
    bar = "█" * hist[i]
    print(f"  {edges[i]:5.1f}~{edges[i+1]:5.1f}: {hist[i]:>2}명 {bar}")`,
    },
    {
      type: "markdown",
      source: `## 🧩 서브플롯 (Subplots) — 여러 그래프 한번에

\`plt.subplots()\`로 여러 그래프를 나란히 배치할 수 있어요.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
x = np.linspace(0, 10, 50)

# 2x2 서브플롯
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

# 라인 차트
axes[0, 0].plot(x, np.sin(x), color="blue")
axes[0, 0].set_title("sin(x)")

# 바 차트
categories = ["A", "B", "C", "D"]
values = [25, 40, 30, 55]
axes[0, 1].bar(categories, values, color="orange")
axes[0, 1].set_title("카테고리별")

# 산점도
axes[1, 0].scatter(np.random.randn(50), np.random.randn(50), alpha=0.5)
axes[1, 0].set_title("산점도")

# 히스토그램
axes[1, 1].hist(np.random.normal(0, 1, 200), bins=15, color="green", alpha=0.7)
axes[1, 1].set_title("히스토그램")

fig.suptitle("다양한 차트 유형", fontsize=16)
plt.tight_layout()

# 4 개 서브플롯이 한 figure 로 ↓ 자동 표시됩니다

print("=== 2x2 서브플롯 ===")
print("4가지 차트: 라인, 바, 산점도, 히스토그램")`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 1 — 월별 매출 라인 차트 코드 작성

아래 데이터로 **라인 차트** 코드를 완성하세요.
- x축: 월, y축: 매출
- 제목: "2024년 상반기 매출"
- 마커: 동그라미("o"), 색상: "green"
- 그리드 표시`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt

months = ["1월", "2월", "3월", "4월", "5월", "6월"]
sales = [230, 245, 260, 278, 295, 310]

# 그래프 크기 설정
plt.figure(figsize=(8, 5))

# 라인 차트 그리기
___

# 제목과 라벨 설정
___
___
___

# 그리드 표시
___

# 그래프 ↓ 자동 표시

# 텍스트 미리보기
print("=== 월별 매출 미리보기 ===")
for m, s in zip(months, sales):
    bar = "█" * (s // 20)
    print(f"  {m}: {s}만원 {bar}")`,
      hints: [
        '라인 차트: `plt.plot(months, sales, marker="o", color="green")`',
        '제목: `plt.title("2024년 상반기 매출")`, 라벨: `plt.xlabel("월")`, `plt.ylabel("매출 (만원)")`',
        "그리드: `plt.grid(True, alpha=0.3)`",
      ],
      solution: `import matplotlib.pyplot as plt

months = ["1월", "2월", "3월", "4월", "5월", "6월"]
sales = [230, 245, 260, 278, 295, 310]

plt.figure(figsize=(8, 5))

plt.plot(months, sales, marker="o", color="green", linewidth=2)

plt.title("2024년 상반기 매출", fontsize=16)
plt.xlabel("월")
plt.ylabel("매출 (만원)")

plt.grid(True, alpha=0.3)

# 그래프 ↓ 자동 표시

print("=== 월별 매출 미리보기 ===")
for m, s in zip(months, sales):
    bar = "█" * (s // 20)
    print(f"  {m}: {s}만원 {bar}")`,
    },
    {
      type: "markdown",
      source: `## ✏️ 미션 2 — 카테고리별 바 차트

아래 데이터로 **바 차트** 코드를 완성하세요.
- 각 바 위에 숫자 표시
- 제목: "부서별 프로젝트 수"
- 적절한 색상 지정`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt

departments = ["개발", "디자인", "마케팅", "영업", "인사"]
projects = [12, 8, 15, 10, 5]

plt.figure(figsize=(8, 5))

# 바 차트 그리기
___

# 각 바 위에 숫자 표시
for i, v in enumerate(projects):
    ___

# 제목과 라벨
___
___
___

# 그래프 ↓ 자동 표시

print("=== 부서별 프로젝트 수 ===")
for dept, proj in zip(departments, projects):
    bar = "█" * proj
    print(f"  {dept:>4}: {proj:>2}개 {bar}")`,
      hints: [
        '바 차트: `plt.bar(departments, projects, color=["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"])`',
        '숫자 표시: `plt.text(i, v + 0.3, str(v), ha="center", fontweight="bold")`',
        '`plt.title("부서별 프로젝트 수")`, `plt.xlabel("부서")`, `plt.ylabel("프로젝트 수")`',
      ],
      solution: `import matplotlib.pyplot as plt

departments = ["개발", "디자인", "마케팅", "영업", "인사"]
projects = [12, 8, 15, 10, 5]

plt.figure(figsize=(8, 5))

plt.bar(departments, projects, color=["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"])

for i, v in enumerate(projects):
    plt.text(i, v + 0.3, str(v), ha="center", fontweight="bold")

plt.title("부서별 프로젝트 수", fontsize=16)
plt.xlabel("부서")
plt.ylabel("프로젝트 수")

# 그래프 ↓ 자동 표시

print("=== 부서별 프로젝트 수 ===")
for dept, proj in zip(departments, projects):
    bar = "█" * proj
    print(f"  {dept:>4}: {proj:>2}개 {bar}")`,
    },
    {
      type: "markdown",
      source: `## 🎉 챕터 4 완료!

오늘 배운 것:
- ✅ plt.plot() — 라인 차트
- ✅ plt.bar() — 바 차트
- ✅ plt.scatter() — 산점도
- ✅ plt.hist() — 히스토그램
- ✅ plt.subplots() — 여러 그래프 배치
- ✅ 제목, 라벨, 범례, 그리드 설정

> 💡 **브라우저 환경 팁**: 이제 \`plt.show()\` 호출 없이도 그래프가 셀 출력에 PNG 로 자동 표시됩니다.
> 한글 폰트(NanumGothic) 도 자동 적용되니 한국어 라벨도 깨끗하게 보여요.
> 더 복잡한 인터랙티브 시각화(슬라이더·hover) 는 Jupyter / Plotly 등 별도 환경이 필요합니다.
> 실제 데이터 분석 업무의 대부분은 **시각화 전 단계** (집계·정제·결합) 가 차지하니, 후반 챕터(6~10) 가 훨씬 더 실무에 가까워요.

**다음 챕터에서는**: 지금까지 배운 모든 것을 합쳐서 **데이터 분석 파이프라인**을 만들어봅니다! 🔬`,
    },
  ],
  quiz: {
    title: "챕터 4 퀴즈 — Matplotlib",
    questions: [
      {
        type: "multiple-choice",
        question: "라인 차트를 그리는 matplotlib 함수는?",
        options: ["plt.bar()", "plt.scatter()", "plt.plot()", "plt.hist()"],
        correctIndex: 2,
        explanation:
          "plt.plot()이 라인 차트를 그리는 함수입니다. bar()는 바 차트, scatter()는 산점도, hist()는 히스토그램이에요.",
      },
      {
        type: "multiple-choice",
        question: "그래프에 범례(legend)를 표시하려면 어떻게 해야 하나요?",
        options: [
          "plt.plot()에 label 파라미터 설정 + plt.legend() 호출",
          "plt.title()에 범례 텍스트 포함",
          "plt.legend()만 호출하면 자동 생성",
          "범례는 자동으로 항상 표시됨",
        ],
        correctIndex: 0,
        explanation:
          'plt.plot(..., label="이름")으로 라벨을 설정하고 plt.legend()를 호출해야 범례가 표시됩니다.',
      },
      {
        type: "multiple-choice",
        question: "데이터의 분포를 확인하기에 가장 적합한 차트는?",
        options: ["라인 차트", "바 차트", "산점도", "히스토그램"],
        correctIndex: 3,
        explanation:
          "히스토그램(plt.hist)은 데이터가 어떤 범위에 얼마나 분포하는지 보여주는 데 최적화되어 있습니다.",
      },
      {
        type: "predict-output",
        question: "plt.subplots(2, 3)은 어떤 레이아웃을 만드나요?",
        code: `fig, axes = plt.subplots(2, 3)`,
        options: [
          "2개의 그래프",
          "3개의 그래프",
          "2행 3열, 총 6개의 그래프",
          "3행 2열, 총 6개의 그래프",
        ],
        correctIndex: 2,
        explanation:
          "subplots(2, 3)은 2행 3열 레이아웃으로 총 6개의 서브플롯 공간을 만듭니다.",
      },
    ],
  } satisfies Quiz,
};

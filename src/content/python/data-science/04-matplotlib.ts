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
      source: `## 🧩 Figure 의 구조 — 용어 미리 알고 가기

matplotlib 그림은 **러시아 인형(마트료시카)** 처럼 겹친 구조예요.

\`\`\`
Figure (그림창 전체)
  └── Axes (좌표축이 있는 하나의 그래프)
       ├── X / Y axis (축)
       │     ├── ticks (눈금)
       │     └── axis label (축 이름)
       ├── Line / Markers (그래프 본체)
       ├── Grid (격자)
       ├── Legend (범례)
       └── Title (제목)
\`\`\`

용어를 알아두면 옵션 이름이 자연스럽게 와닿아요:
- \`plt.xlabel(...)\` = X axis 의 label 설정
- \`plt.title(...)\` = Figure(또는 Axes)의 title 설정
- \`plt.legend()\` = legend 표시
- \`plt.grid(True)\` = grid 표시`,
    },
    {
      type: "markdown",
      source: `## 🛠️ 두 가지 그리는 방식 — 함수형 vs 객체지향

matplotlib 에는 같은 그래프를 그리는 **두 가지 스타일**이 있어요.

| 스타일 | 특징 | 추천 |
|------|------|------|
| **함수형** \`plt.plot(...)\` | 짧고 직관적, 빠르게 시작 | 1개 그래프 |
| **객체지향** \`fig, ax = plt.subplots()\` | 명시적, 여러 그래프 관리 쉬움 | 실무·논문 |

아래 셀에서 같은 그래프를 두 방식으로 그려 보고 차이를 느껴보세요.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 4, 50)
y = -x**3 + 4*x**2 - 5

# ── 방식 1: 함수형 (Stateful API) ──
plt.figure(figsize=(5, 3))
plt.plot(x, y)
plt.title("함수형 스타일 — plt.plot")
plt.xlabel("X")
plt.ylabel("Y")

# ── 방식 2: 객체지향 (Object-Oriented API) ──
fig, ax = plt.subplots(figsize=(5, 3))
ax.plot(x, y)
ax.set_title("객체지향 스타일 — fig, ax = plt.subplots()")
ax.set_xlabel("X")
ax.set_ylabel("Y")

print("두 figure 가 위에서 차례로 표시됩니다 ↑")
print("실무에선 객체지향 방식을 더 권장 — 여러 axes 를 명시적으로 다룰 수 있어요.")`,
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
      source: `### ⚡ 한 줄로 합치기 (단축 문법)

\`plt.plot(x, y1, x, y2)\` 처럼 인자를 이어서 넣으면 한 줄로 여러 그래프를 그릴 수 있어요.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 4, 50)
y1 = -x**3 + 4*x**2 - 5
y2 = 2*y1 + 1

# ── 두 줄로 ──
# plt.plot(x, y1)
# plt.plot(x, y2)

# ── 한 줄로 (동일한 결과) ──
plt.plot(x, y1, x, y2)
plt.title("한 줄로 두 그래프")
plt.legend(["y1", "y1·2 + 1"])

print("plt.plot(x, y1, x, y2) — 인자만 늘리면 됨 ↑")`,
    },
    {
      type: "markdown",
      source: `### 🪟 여러 Figure 따로 그리기

같은 셀에서 \`plt.figure(N)\` 를 호출해 **별개의 그림창** 을 만들 수 있어요.
서브플롯(\`subplots\`)이 한 figure 안에 여러 axes 를 두는 것과는 다릅니다.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 4, 50)
y = -x**3 + 4*x**2 - 5

plt.figure(1)         # 첫 번째 figure
plt.plot(x, y)
plt.title("Figure 1 — 원본")

plt.figure(2)         # 두 번째 figure (별개의 창)
plt.plot(x, -y)
plt.title("Figure 2 — 부호 반전")

print("위에 두 개의 독립된 그래프가 차례로 표시됩니다.")
print("plt.figure(1) 과 plt.figure(2) 의 숫자가 서로 달라야 분리됨!")`,
    },
    {
      type: "markdown",
      source: `### ⚙️ Figure 옵션 — 크기·해상도·배경색

\`plt.figure(figsize=..., dpi=..., facecolor=...)\` 로 그림창의 외형을 조정합니다.

- \`figsize=(가로, 세로)\` — 인치 단위
- \`dpi=숫자\` — 인치당 픽셀 수 (높을수록 선명/큰 이미지)
- \`facecolor='색상'\` — 배경색. \`'0.5'\` 처럼 회색 강도(0=검정, 1=흰색) 도 가능`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 4, 50)
y = -x**3 + 4*x**2 - 5

# ── 옵션 없음 (기본) ──
plt.figure()
plt.plot(x, y)
plt.title("기본 옵션")

# ── figsize + dpi + facecolor 지정 ──
plt.figure(figsize=(4, 2), dpi=150, facecolor='0.85')
plt.plot(x, y)
plt.title("figsize=(4,2), dpi=150, facecolor='0.85'")

print("두 figure 의 크기·해상도·배경색을 비교해 보세요 ↑")
print("dpi 가 높을수록 PNG 파일 크기도 커집니다 (다운로드 시 확인).")`,
    },
    {
      type: "markdown",
      source: `### ⚠️ 자주 만나는 에러 — x, y 길이 불일치

\`plt.plot(x, y)\` 에서 **x 와 y 의 원소 갯수가 다르면 에러** 가 나요.
실수로 한쪽만 \`+1\` 해놓는 일이 흔합니다.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt

# 의도적으로 길이가 다른 두 리스트
x = [1, 2, 3, 4, 5]                 # 5개
y = [10, 20, 30, 40, 50, 60]        # 6개  ← 한 개 더 많음!

print(f"x 길이: {len(x)}개")
print(f"y 길이: {len(y)}개")
print()

try:
    plt.plot(x, y)
    print("✅ 그래프가 그려졌어요. (이 줄이 보이면 길이가 같다는 뜻)")
except ValueError as e:
    print("⚠️  ValueError 발생!")
    print(f"   메시지: {e}")
    print()
    print("💡 해결법:")
    print("   x 와 y 의 원소 개수를 동일하게 맞추세요.")
    print("   예: y = [10, 20, 30, 40, 50]   ← 5개로")
finally:
    # try 안에서 plt.plot 이 figure 를 만들었을 수 있으니 정리
    plt.close("all")

# ── 길이 맞춰서 다시 그려보기 ──
print()
print("─" * 30)
print("길이 맞춰서 정상 실행:")
y_fixed = [10, 20, 30, 40, 50]      # 이제 5개
plt.plot(x, y_fixed, marker="o")
plt.title("정상적으로 그려진 그래프")
plt.grid(True, alpha=0.3)`,
    },
    {
      type: "markdown",
      source: `### 🎨 라인·마커 상세 옵션 모음

\`plt.plot()\` 의 인자 한 줄로 색상·선·마커를 동시에 지정할 수 있어요.

| 약어 | 정식 이름 | 의미 |
|------|----------|------|
| \`c\` | \`color\` | 색상 (\`'r'\`, \`'#FF0000'\`, \`'red'\`) |
| \`ls\` | \`linestyle\` | 선 스타일 (\`'-'\`, \`'--'\`, \`':'\`, \`'-.'\`) |
| \`lw\` | \`linewidth\` | 선 굵기 |
| \`marker\` | (동일) | \`'o'\`, \`'*'\`, \`'+'\`, \`'s'\`, \`'^'\` 등 |
| \`ms\` | \`markersize\` | 마커 크기 |
| \`mfc\` | \`markerfacecolor\` | 마커 안쪽 색 |
| \`mec\` | \`markeredgecolor\` | 마커 테두리 색 |
| \`mew\` | \`markeredgewidth\` | 마커 테두리 굵기 |
| \`markevery\` | (동일) | 몇 개마다 마커 표시 (1=전부, 5=5개당 1번) |`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 4, 50)
y = -x**3 + 4*x**2 - 5

# ── 옵션 단계별 누적 비교 ──

# (1) 기본
plt.figure(figsize=(7, 3))
plt.plot(x, y)
plt.title("(1) 기본 plt.plot(x, y)")
plt.grid(True, alpha=0.3)

# (2) 색상 + 굵기
plt.figure(figsize=(7, 3))
plt.plot(x, y, color="red", lw=3)
plt.title("(2) color='red', lw=3 — 색·굵기")
plt.grid(True, alpha=0.3)

# (3) + 라인 스타일 (점선)
plt.figure(figsize=(7, 3))
plt.plot(x, y, color="red", lw=3, linestyle="--")
plt.title("(3) + linestyle='--' — 점선")
plt.grid(True, alpha=0.3)

# (4) + 마커 (모든 점에)
plt.figure(figsize=(7, 3))
plt.plot(x, y, color="red", lw=2, linestyle="-", marker="o", ms=8)
plt.title("(4) + marker='o', ms=8 — 모든 점에 마커")
plt.grid(True, alpha=0.3)

# (5) + markevery — 5개마다 한 번
plt.figure(figsize=(7, 3))
plt.plot(x, y, color="red", lw=2, marker="*", ms=14, markevery=5)
plt.title("(5) + markevery=5 — 5개마다 별 마커")
plt.grid(True, alpha=0.3)

# (6) + 마커 색·테두리 세부 (mfc / mec / mew)
plt.figure(figsize=(7, 3))
plt.plot(
    x, y,
    color="navy",    lw=2,
    marker="o",      ms=12, markevery=5,
    mfc="orange",    # 마커 안쪽 색 (face)
    mec="navy",      # 마커 테두리 색 (edge)
    mew=2,           # 테두리 굵기
)
plt.title("(6) + mfc='orange', mec='navy', mew=2")
plt.grid(True, alpha=0.3)

print("위 6개 그래프를 차례로 비교해 보세요 — 옵션이 하나씩 추가될 때마다")
print("그래프가 어떻게 변하는지 보면 옵션 이름이 자연스럽게 와닿아요.")`,
    },
    {
      type: "markdown",
      source: `### ✨ 단축 문자열 — \`'r-+'\`

색상 + 라인스타일 + 마커를 **한 문자열로 압축** 할 수 있어요.

| 위치 | 의미 | 예 |
|------|------|------|
| 1글자 | 색상 | \`r\`(빨강), \`g\`(초록), \`b\`(파랑), \`k\`(검정), \`y\`(노랑) |
| 다음 | 라인 | \`-\`(직선), \`--\`(점선), \`:\`(점), \`-.\`(쇄선) |
| 다음 | 마커 | \`o\`, \`*\`, \`+\`, \`s\`, \`^\`, \`x\` |

예: \`'r-+'\` = 빨강 + 직선 + 더하기 마커.`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

x = np.arange(0, 2*np.pi, 0.05)

# ── 같은 결과를 두 가지 방식으로 ──
# (a) 옵션 키워드로
plt.figure(figsize=(7, 3))
plt.plot(x, np.sin(x), color='b', linestyle='-')
plt.plot(x, np.cos(x), color='r', linestyle='--')
plt.title("(a) 키워드 인자")
plt.legend(["sin", "cos"])

# (b) 단축 문자열로 ← 더 짧음
plt.figure(figsize=(7, 3))
plt.plot(x, np.sin(x), 'b-', x, np.cos(x), 'r--')
plt.title("(b) 단축 문자열 'b-' / 'r--'")
plt.legend(["sin", "cos"])

print("같은 그래프를 키워드 vs 단축 문자열로 ↑")
print("코드가 훨씬 짧아짐 — 빠른 탐색용 시각화에 유용.")`,
    },
    {
      type: "markdown",
      source: `### 🔍 표시 영역 제어 — xlim / ylim / axis

기본은 데이터 전체가 보이지만, **특정 구간만 확대** 하거나 **축 비율을 1:1** 로 맞출 수 있어요.

| 함수 | 효과 |
|------|------|
| \`plt.xlim(min, max)\` | x 축 범위 제한 |
| \`plt.ylim(min, max)\` | y 축 범위 제한 |
| \`plt.axis('tight')\` | 데이터에 딱 맞게 (여백 최소) |
| \`plt.axis('equal')\` | x·y 축 단위 길이 동일 (원이 진짜 원으로 보임) |
| \`plt.axis('off')\` | 축 자체 숨기기 |`,
    },
    {
      type: "code",
      source: `import matplotlib.pyplot as plt
import numpy as np

x = np.arange(0, 2*np.pi, 0.01)
sin_y = np.sin(x)
cos_y = np.cos(x)

# ── 1. 기본 (전체 범위) ──
plt.figure(figsize=(7, 3))
plt.plot(x, sin_y, 'b', x, cos_y, 'r--')
plt.title("기본 — 전체 데이터 표시")
plt.legend(["sin", "cos"])

# ── 2. 특정 구간만 (1 ≤ x ≤ 5, -0.75 ≤ y ≤ 0.75) ──
plt.figure(figsize=(7, 3))
plt.plot(x, sin_y, 'b', x, cos_y, 'r--')
plt.xlim(1, 5)
plt.ylim(-0.75, 0.75)
plt.title("xlim(1,5) + ylim(-0.75, 0.75) — 일부 확대")
plt.legend(["sin", "cos"])

# ── 3. axis('equal') — x·y 축 길이 동일 ──
plt.figure(figsize=(7, 3))
plt.plot(x, sin_y, 'b', x, cos_y, 'r--')
plt.axis('equal')
plt.title("axis('equal') — 축 단위 길이 1:1")
plt.legend(["sin", "cos"])

print("같은 데이터를 세 가지 영역 설정으로 ↑")
print("axis('equal') 은 원·정사각형이 왜곡 없이 보이게 할 때 필수.")`,
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

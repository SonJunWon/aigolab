# Changelog

이 파일은 AIGoLab의 주요 변경 사항을 기록합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) 기준이며,
버전 번호는 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 따릅니다.

---

## [Unreleased]

(다음 릴리즈에 포함될 변경 사항을 여기에 누적합니다)

---

## [3.20.0] - 2026-04-15

### Added — ML 트랙 Ch07 이론·회귀 트리 보강 + 15번째 AI 프로젝트 (아주대 lec06 인사이트)
외부 대학 강의(아주대 기계학습개론 lec06 — Decision Tree) 자료를 Ch07 에 흡수. 기존 breadth 중심 구성에 **depth (원리 이해) + 회귀 트리** 를 더해 lec06 을 온전히 커버.

**Ch07 '트리와 앙상블' — 이론 섹션 신설**
- '🧮 트리는 어떻게 분기를 고를까? — 지니와 정보이득' 섹션 신설
  - 지니 불순도 공식을 평문으로 설명 (완전 순수 → 0, 반반 → 0.5)
  - numpy 로 지니 함수를 **직접 구현** 하고 순수/반반/편향 3가지 케이스로 값 체감
  - iris petal_length 를 임계값으로 훑으며 **정보이득 최대점** 직접 탐색 → sklearn 의 루트 분기와 일치함을 확인
  - criterion='gini' vs 'entropy' vs 'log_loss' 결과 비교

**Ch07 '회귀 트리' 섹션 신설**
- '🎯 회귀 트리 — 숫자 예측도 트리로' 섹션
- \`load_diabetes\` + DecisionTreeRegressor: 분류 트리와 **fit/predict 인터페이스가 완전히 동일** 함을 체험
- max_depth 별 train/test R² 비교 → 회귀에서도 같은 과적합 곡선
- 회귀 트리의 feature_importances_ 출력 (bmi·s5 가 상위 — 의학적으로 말이 되는 결과)
- '하나의 공식' 원칙: 모델 클래스만 바뀌고 코드 구조는 동일

**Ch07 퀴즈 +2문항**
- predict-output: 지니 계산 (반반 분포 → 0.5)
- 회귀 트리 인터페이스 개념 확인

**15번째 AI 프로젝트 — '당뇨병 진행도 예측 — 회귀 트리' 신설 🩺**
- 난이도: **intermediate**, 50분 예상
- 8 STEP: 데이터 로드 → EDA(피처·타깃 상관) → train/test 분리 → DecisionTreeRegressor → **R²·MSE 직접 계산 vs sklearn** → max_depth 튜닝(자동 과적합 진단) → feature_importances + LinearReg/DecisionTree/RandomForest 3단 비교 → 정리
- 회귀 지표(R², MSE, RMSE)의 의미를 공식·sklearn 양쪽으로 확인
- 분류 프로젝트(iris-knn) 와 짝을 이루는 **회귀 전용** 프로젝트

### Impact
- Ch07 이 **breadth 만 있던 상태에서 원리 + 회귀까지 depth 를 확보**
- 학습자가 '분류·회귀는 같은 공식의 두 얼굴' 이라는 scikit-learn 의 핵심 철학을 체감
- 회귀 트리가 우리 트랙에 최초 등장 — 비선형 회귀·해석 가능 회귀의 진입점 확보

### 기존 사용자에게
**새로고침 (Cmd/Ctrl+Shift+R)** → lessonHash 자동 갱신으로 Ch07 신규 섹션이 즉시 반영됩니다.

---

## [3.19.0] - 2026-04-15

### Added — ML 실습 트랙 보강 (아주대 lec05 인사이트 반영)
외부 대학 강의(아주대 기계학습개론 lec05) 자료를 우리 ML 트랙에 흡수. 기존 챕터 3개 보강 + 14번째 AI 프로젝트 신설. 챕터 번호 재배치 없이 자연스럽게 확장.

**Ch01 선형 회귀 — scikit-learn 모듈 지도 추가**
- 'scikit-learn 한눈에 — 모델 family 지도' 섹션: linear_model / tree / ensemble / neighbors / svm / cluster / model_selection / metrics / datasets 의 역할을 표로 정리
- 모든 모델이 `fit → predict` 의 **하나의 공식** 을 따른다는 것을 도입부에 명시
- 대표 모델 종합 import 셀로 이름·경로 패턴 눈에 익히기

**Ch02 분류 — KNN 섹션 신규**
- '이웃을 보고 따라하는 분류기' 로 KNN 원리 설명 (lazy learning)
- k=1/3/5/15/50 의 wine 분류 정확도 비교 — k 가 성능을 가르는 감각
- `StandardScaler` 적용 전후 비교: 거리 기반 모델에서 전처리의 중요성 시연
- Mission 2 를 2모델 → **3모델 (LogReg / DT / KNN) 비교** 로 확장, KNN 만 표준화된 X 를 받는 실전 패턴
- 퀴즈 2문항 추가: KNN 원리 + 스케일링 이유

**Ch03 모델 평가 — 적합성·일반화 + 정확도 본질**
- '잠깐 — 정확도는 원래 어떻게 계산될까?' 섹션: \`(y_pred == y_test).mean()\` 과 \`accuracy_score\` 가 정확히 같은 값을 낸다는 것을 직접 확인
- '적합성과 일반화 — 과적합 vs 과소적합' 섹션: 과소적합/적합/과적합 증상표 + KNN 의 k 를 바꿔가며 train vs test 점수 추적 → 자동 진단 (matplotlib 없이 숫자 기반으로 '그래프' 상상)
- 퀴즈 2문항 추가: 과적합 진단 + k=1 의 train 100% 현상

**14번째 AI 프로젝트 — 'iris KNN 분류 — 이웃에게 물어보기' 신설**
- 기존 Decision Tree iris 프로젝트와 짝을 이루는 KNN 버전 (같은 데이터·다른 모델 비교 훈련용)
- 8 STEP: 모델 family import → EDA → train_test_split 의미 → KNN 학습 → 직접 정확도 계산 vs accuracy_score → **k 튜닝(1~100)으로 최적 k 탐색** → 확률 기반 새 꽃 예측 → 배운 것 정리
- stratify, random_state, predict_proba 등 lec05 흐름을 Pyodide 제약 하에서 재현 (seaborn 없는 환경에서 numpy EDA 로 대체)

### Impact
- ML 트랙 학습자가 `sklearn` 라이브러리 지도 → KNN → 하이퍼파라미터 튜닝의 흐름을 일관된 용어로 경험
- 과적합/과소적합을 **수식·시각화 없이 숫자 표로 체감** 하는 방식 확립 (Pyodide 친화)
- lec05 의 '직접 정확도 계산' 습관이 편의 함수의 **본질** 이라는 관점으로 흡수됨

### 기존 사용자에게
**새로고침 (Cmd/Ctrl+Shift+R)** → lessonHash 자동 갱신으로 Ch01/02/03 신규 셀이 즉시 반영됩니다 (v3.18.5 에 도입된 보호 로직).

---

## [3.18.5] - 2026-04-15

### Fixed — lesson 콘텐츠 해시로 잘못된 IndexedDB 자동 무효화 (최종)
v3.18.4 의 markdown 시그니처 검증으로도 부족했던 이유: v3.18.1 머지가 옛 saved 의 markdown 도 새 lesson 의 markdown 으로 교체해서 IndexedDB 에 저장 → 시그니처가 이미 일치.

**근본 해결:**
1. `StoredNotebook` 에 `lessonHash?: string` 필드 추가 (`db.ts`)
2. `notebookRepo.computeLessonHash()` djb2 hash 함수 추가 — lesson 의 모든 셀 source 합쳐 32-bit hex 생성
3. `useAutoSave` 가 `lessonHash` 받아서 저장 시 함께 기록
4. `LessonPage` 에서 lesson hash 계산해 useAutoSave 에 전달
5. 머지 검증에 `saved.lessonHash !== currentLessonHash` 추가

**효과:**
- ✅ saved 에 `lessonHash` 없으면 (legacy 데이터) 무조건 무효화
- ✅ lesson 콘텐츠가 한 글자라도 바뀌면 hash 다름 → 자동 무효화
- ✅ 향후 콘텐츠 변경 시 동일 보호

### 기존 사용자에게
**새로고침 (Cmd/Ctrl+Shift+R)** → saved 에 lessonHash 없음 → lesson 원본 재로드 → 다음 저장 시 hash 함께 기록 → 정상 운영.

---

## [3.18.4] - 2026-04-15

### Fixed — v3.18.1~3.18.2 동안 잘못 매칭된 IndexedDB 데이터 자동 무효화

**증상 (사용자 보고 스크린샷 2장):**
- 새 lesson 의 인트로 셀 위치에 옛 v3.17.x 코드가 표시 ("Jupyter/Colab 가서 보세요")
- "두 가지 그리는 방식" markdown 새 콘텐츠 아래에 옛 라인 차트 코드가 표시
- 챕터 4 전체가 markdown 은 새것, code 는 옛것이 뒤죽박죽

**원인 (정확한 흐름):**
1. v3.18.0: 신규 9개 셀 추가 → 사용자 IndexedDB 옛 10개 ≠ 새 18개 (불일치)
2. v3.18.1: 큐 매칭으로 옛 saved code 10개를 새 lesson 18 위치에 강제 끼워넣음 → **잘못 매칭된 18개가 IndexedDB 에 저장됨**
3. v3.18.3: code 셀 개수만 검증 → 18 == 18 일치 → 잘못된 옛 코드를 머지로 그대로 가져옴 ❌

**수정 (v3.18.4):**
머지 검증을 두 단계로 강화 — code 셀 개수 + **markdown 시그니처** 둘 다 일치해야 머지:

\`\`\`ts
const lessonMdSignature = lesson.cells
  .filter((c) => c.type === "markdown")
  .map((c) => c.source)
  .join("\\n---\\n");
const savedMdSignature = saved.cells
  .filter((c) => c.type === "markdown")
  .map((c) => c.source)
  .join("\\n---\\n");

const useOriginal =
  !saved ||
  saved.cells.length === 0 ||
  savedCodeCells.length !== lessonCodeCells.length ||
  savedMdSignature !== lessonMdSignature;  // ← NEW

if (useOriginal) {
  loadCells(lesson.cells, lesson.language);  // 잘못된 머지 대신 원본
}
\`\`\`

**효과:**
- ✅ markdown 텍스트가 한 글자라도 바뀌면 → 자동 무효화 → lesson 원본 사용
- ✅ v3.18.1~3.18.2 의 잘못된 매칭 결과가 자동으로 무효화됨
- ✅ 향후 비슷한 콘텐츠 변경에서도 안전
- ⚠️ markdown 변경 시 사용자 코드 손실은 여전 (셀별 ID 시스템이 진짜 해결책, 다음 milestone)

### 기존 사용자에게
**새로고침 (Cmd/Ctrl+Shift+R) 한 번** → markdown 시그니처 불일치 감지 → 자동으로 lesson 원본 재로드. 챕터 4 가 깨끗하게 정리됩니다. 콘솔에 \`[lesson] 콘텐츠 변경 감지 — lesson 원본 재로드\` 메시지 확인 가능.

---

## [3.18.3] - 2026-04-15

### Fixed — v3.18.1 머지 로직이 신규 셀 추가 시 코드를 잘못 매칭

**증상 (사용자 보고 + 스크린샷):**
- 04강에서 "x, y 길이 불일치" 셀에 **미션 1 빈칸 채우기 코드** 가 들어가 있음 → NameError ('___' 이름 못 찾음)
- "라인·마커 상세 옵션" 셀에 **미션 2 빈칸 채우기 코드** 가 들어가 있음 → 같은 NameError

**원인:**
v3.18.1 의 큐 기반 머지 로직은 saved 의 code 셀들을 lesson 의 code 위치에 **순서대로** 매칭. v3.18.0 에서 신규 셀 9개가 **중간에** 추가되면서 매칭이 어긋남:
- 옛 saved code 순서: [라인, 다중라인, 바, 산점도, 히스토그램, 서브플롯, 미션1, 미션2]
- 새 lesson code 순서: [라인, 다중라인, ★단축, ★figure옵션, ★길이불일치, ★상세옵션, ★단축문자열, ★표시영역, 바, ..., 미션1, 미션2]
- 매칭 결과: 옛 "미션1" 코드가 새 "길이 불일치" 위치에, 옛 "미션2" 코드가 새 "상세 옵션" 위치에 들어감
- markdown 제목은 새 섹션 (Figure 구조 등) 인데 code 는 빈칸 미션 코드 → NameError

**수정 (v3.18.3):**
**셀 개수가 lesson 과 다르면 saved 무시하고 lesson 원본 사용** — 사용자 코드는 손실되지만 콘텐츠 일관성 100% 보장.

```ts
if (savedCodeCells.length === lessonCodeCells.length) {
  // 정확히 같음 → 안전하게 머지
} else {
  // 다름 → lesson 원본만 (사용자 코드 손실)
  console.warn("[lesson] 콘텐츠 구조 변경 감지 — 원본으로 재로드");
  loadCells(lesson.cells, lesson.language);
}
```

### 트레이드오프
- ✅ **잘못된 매칭 절대 발생 안 함** (NameError 같은 혼란 없음)
- ⚠️ 콘텐츠 업데이트 시 사용자가 그 챕터에 작성한 코드는 lesson 원본으로 덮여짐
- 향후 셀별 ID 시스템을 도입하면 정확한 매칭 가능 (다음 mile stone)

### 기존 사용자에게 (v3.18.0 ~ v3.18.2 동안 옛 미션 코드를 본 분)
새로고침 (Cmd/Ctrl+Shift+R) 한 번 → 모든 셀이 lesson 원본으로 깔끔하게 재로드됩니다. NameError 사라집니다.

---

## [3.18.2] - 2026-04-15

### Fixed — 04강 신규 두 예제 안정화 (사용자 보고)

**1. ⚠️ 자주 만나는 에러 — x, y 길이 불일치**

기존 문제:
- `try` 안에서 `plt.plot()` 이 ValueError 전에 figure 를 만들 수 있음 → 자동 캡처가 빈 figure 를 PNG 로 잡을 위험
- numpy `linspace(0, 10, 100)` 사용 — 첫 셀에 numpy 의존성 부담

수정:
- 명시적 `list` 사용: `x = [1,2,3,4,5]`, `y = [10,20,30,40,50,60]` (5개 vs 6개)
- `try`/`except`/**`finally: plt.close("all")`** 패턴으로 잔존 figure 정리
- "에러 발생 → 길이 맞춰서 다시 그려보기" 까지 한 셀에 — 학습 흐름 완결

**2. 🎨 라인·마커 상세 옵션**

기존 문제:
- 9개 옵션을 한 번에 적용 → 무엇이 어떤 효과인지 식별 어려움
- `mfc='y'`(노랑) + 흰 배경 → 마커 안색 거의 안 보임
- multi-line 함수 호출 가독성 낮음

수정:
- **6단계 누적 비교**: (1) 기본 → (2) 색·굵기 → (3) +라인스타일 → (4) +마커 → (5) +markevery → (6) +mfc/mec/mew
- 색상을 navy/orange 등 대비 강한 색으로 (가독성 ↑)
- 마커 크기 8~14 로 조정 (이전 ms=20 은 너무 큼)
- 50점 데이터 + figsize=(7,3) 으로 적당한 비율
- 각 figure 가 어떤 옵션 추가됐는지 title 에 명시

### 결과
- 길이 불일치 예제는 ValueError 깔끔히 잡고 → 정상 그래프까지 한 흐름
- 상세 옵션은 6개 그래프 비교로 옵션 효과를 시각적으로 명확히 학습

---

## [3.18.1] - 2026-04-15

### Fixed — 레슨 콘텐츠 업데이트가 기존 사용자에게 반영 안 되던 문제
**증상:** v3.18.0 에서 04강 (Matplotlib) 에 9개 신규 섹션을 추가했지만, 한 번이라도 그 챕터를 열어본 사용자는 옛 콘텐츠만 계속 표시. "추가된 내용이 안 보인다" 사용자 보고.

**원인 (LessonPage 머지 로직):**
이전 로직은 두 분기였음:
- 셀 개수 일치 → 사용자 source 그대로 (markdown 텍스트 변경 무시)
- 셀 개수 불일치 → 저장본만 표시 (신규 셀·힌트 모두 누락)

→ 콘텐츠 업데이트가 **어느 경우에도 반영 안 됨**.

**수정 (v3.18.1):**
새 머지 전략 — **markdown 은 항상 lesson 의 최신 콘텐츠 사용, code 셀 source 만 사용자 저장본에서 복원**.

```ts
// saved 의 code 셀들을 큐로 만들고
const savedCodeQueue = saved.cells.filter((c) => c.type === "code").map((c) => c.source);
let qIdx = 0;

// lesson 을 base 로 순회하며 code 셀이면 큐에서 source 가져옴
const merged = lesson.cells.map((lessonCell) => {
  if (lessonCell.type === "code" && qIdx < savedCodeQueue.length) {
    return { ...lessonCell, source: savedCodeQueue[qIdx++] };
  }
  return lessonCell;  // markdown 또는 신규 code 셀 → lesson 원본
});
```

**효과:**
- ✅ 콘텐츠 업데이트(markdown 텍스트, 신규 섹션) 가 즉시 반영됨
- ✅ 사용자가 작성한 code 셀은 그대로 보존
- ✅ 셀 개수가 늘어도 신규 셀이 정상 추가됨
- ✅ 힌트·정답 항상 최신 (lesson 원본 사용)

### 기존 사용자에게
v3.18.0 의 신규 섹션 (Figure 구조, OO API 등) 이 이번 릴리즈부터 자동으로 보입니다. 새로고침 (Cmd/Ctrl+Shift+R) 한 번만 하면 됨.

---

## [3.18.0] - 2026-04-15

### Added — 데이터 과학 04강 (Matplotlib) 보완 (아주대 강의 자료 참고)
사용자가 제공한 아주대학교 기계학습개론 lec04 (PDF + ipynb) 와 비교 분석 후, 빠진 핵심 개념·예제 7개 섹션 추가.

### 신규 섹션 (위치: 기본 import → 라인 차트 사이 + 다중 라인 → 바 차트 사이)

1. **🧩 Figure 의 구조** — figure/axes/ticks/grid/legend/title 의 anatomy 시각적 설명. 옵션 이름이 자연스레 와닿도록.
2. **🛠️ 두 가지 그리는 방식** — 함수형 (`plt.plot`) vs 객체지향 (`fig, ax = plt.subplots(); ax.plot`) 비교. 실무에서 OO 가 권장되는 이유.
3. **⚡ 한 줄로 합치기** — `plt.plot(x, y1, x, y2)` 단축 문법.
4. **🪟 여러 Figure 따로** — `plt.figure(1); plt.figure(2)` 로 별개의 그림창. 서브플롯과의 차이.
5. **⚙️ Figure 옵션** — `figsize`, `dpi`, `facecolor` 동시 시연. 해상도/배경색 조정.
6. **⚠️ 자주 만나는 에러** — x·y 길이 불일치 시 ValueError 의도적 시연. 디버깅 감각 기르기.
7. **🎨 라인·마커 상세 옵션** — `markevery`, `mfc`, `mec`, `mew`, `lw`, `ms` 등 9개 옵션 표 + 종합 예제.
8. **✨ 단축 문자열** — `'r-+'`, `'b-'`, `'r--'` 등 압축 표기. 키워드 vs 단축 비교.
9. **🔍 표시 영역 제어** — `xlim`, `ylim`, `axis('equal'/'tight'/'off')`. sin/cos 예제로 효과 시연.

### 분석 결과 — Pyodide 환경에서 **불가능한** 것 (참고)
ipynb 후반부 (CIFAR10 + CNN PyTorch) 는 우리 환경에서 **물리적 불가능**:
- `import torch`, `torchvision` 미포함
- `torch.cuda` — 브라우저엔 GPU 없음
- 데이터셋 다운로드 / Google Drive 마운트 미지원

→ 향후 v4 트랙 (딥러닝) 또는 AI 강의에서 **Jupyter/Colab 안내** 로 처리할 영역.

### 보완된 학습 흐름
```
이전: 인트로 → import → 라인 → 다중라인 → 바 → 산점도 → ...
이후: 인트로 → import → ★Figure구조 → ★OO API → 라인 → 다중라인 →
      ★단축 → ★여러 figure → ★figure 옵션 → ★에러 → ★상세 옵션 →
      ★단축 문자열 → ★표시 영역 → 바 → 산점도 → ...
```

### 결과
- 04강이 한 단계 더 깊고 체계적인 시각화 강의로 강화
- 실무에서 자주 쓰는 OO 스타일 + 단축 문법까지 다룸
- 디버깅 시 자주 만나는 에러를 미리 체험

---

## [3.17.4] - 2026-04-15

### Improved — Python 입문 09강 '에러 메시지 가져오기' 예제 개선
**증상:** 사용자 보고 — 예제 출력 `변환 실패: invalid literal for int() with base 10: '안녕'` 가 한국어+영어 섞여 어색.

**원인 (실은 Python 의 정상 동작):**
- `except ValueError as e:` 로 잡은 예외 객체 `e` 의 메시지는 **Python 이 영어로 생성**
- f"변환 실패: {e}" 가 한국어 prefix 와 영어 메시지를 자연스레 합침
- 에러 메시지가 영어인 이유를 레슨이 설명 안 했음 → 학습자에겐 "이상한 답" 으로 보임

**수정:**
1. **마크다운 추가**: "Python 의 에러 메시지는 영어로 고정. 한국어로 보여주려면 직접 작성해야 한다" 명시
2. **코드 셀 분리** — 두 패턴을 명확히 보여줌:
   - **방법 1 (원본 영어)**: 출력 주석에 영어/한국어 부분을 화살표로 라벨링
   - **방법 2 (한국어 친절)**: `as e` 빼고 우리가 작성한 한국어 메시지
   - **방법 3 (조합)**: 사용자엔 한국어, 개발자 로그엔 원본 영어
3. **새 마크다운 셀**: "한국어로 친절하게 알려주기" 헤더 추가

### 결과
학습자가 영어 메시지에 당황하지 않고 **"이게 정상이고 원하면 이렇게 한국어로 바꿀 수 있다"** 를 자연스럽게 익힘. 실무 패턴(사용자 메시지 + 디버깅 로그) 까지 한 번에 배움.

---

## [3.17.3] - 2026-04-15

### Fixed — Python 입문 08강 퀴즈에서 \n 이 글자 그대로 표시
**증상:** Python 입문 챕터 8 (함수) 의 퀴즈 2번·3번 옵션이 `10\n10`, `👋 철수\n🎉 영희` 처럼 백슬래시+n 이 글자 그대로 보였음. 사용자 보고.

**원인:**
1. 옵션 문자열이 `"10\\n10"` 으로 작성됨 — JS 에서 `\\n` 은 백슬래시+n 두 글자
2. QuizQuestion 의 옵션 `<span>` 에 `whitespace-pre-line` 이 없어서 실제 줄바꿈도 한 줄로 합쳐졌음

**수정:**
1. `08-functions.ts` 의 옵션 6개를 `\\n` → `\n` (실제 줄바꿈 문자) 로 변경
2. `QuizQuestion.tsx` 의 옵션 `<span>` 에 `whitespace-pre-line` 추가 — 향후 다른 퀴즈에도 줄바꿈 정상 렌더

**결과:** "10\n10" 같은 두 줄 출력 옵션이 실제 두 줄로 표시됨.

---

## [3.17.2] - 2026-04-15

### Fixed — 데이터 시각화 레슨의 잔여 "Jupyter/Colab 가서 보세요" 정리
v3.17.0 에서 첫 라인 차트만 정리하고 산점도·히스토그램·서브플롯·미션 셀들이 누락. 사용자 보고로 발견.

**수정 위치:**
- `04-matplotlib.ts` — 6개 셀의 `# plt.show()` 주석 → `# 그래프 ↓ 자동 표시` (산점도, 히스토그램, 미션 1·2, 솔루션 2개)
- `04-matplotlib.ts` — 산점도 / 히스토그램 셀의 `print("=== ... 코드 실행 완료 ===")` → `print("=== ... ===")`
- `05-data-pipeline.ts` — markdown 안내 `(Jupyter/Colab에서 실행하면 그래프를 볼 수 있어요!)` 제거 + 시각화 셀 정리
- `10-mini-project.ts` — 마무리 안내 `"이 환경은 시각화 제약이 있어요"` → `"matplotlib 정적 그래프까지 지원돼요. 인터랙티브는 Jupyter 로"`

### 결과
이제 데이터 시각화 레슨 전체에서 잘못된 안내가 모두 제거됨. 사용자가 실행 시 항상 "그래프 ↓ 자동 표시" 안내 + 실제 그래프 PNG 가 함께 표시.

---

## [3.17.1] - 2026-04-15

### Fixed — 한글 폰트 자동 지원 + UserWarning 억제 + 레슨 print 정리
v3.17.0 그래프 표시 직후 후속 polish.

**증상 (사용자 스크린샷 확인):**
1. 한국어 라벨이 모두 □ 로 표시 (`월별 매출 추이` → `□□ □□ □□`)
2. `<exec>:19: UserWarning: Glyph N missing from current font` 가 8줄씩 빨간색으로 노이즈
3. 레슨 코드의 `print("Jupyter/Colab에서 plt.show() 주석 해제하면...")` 안내문 그대로 남아 있음

**수정:**

1. **한글 폰트 (NanumGothic) 번들** — `public/fonts/NanumGothic-Regular.ttf` (2.0MB, OFL 라이선스, OFL.txt 포함)

2. **워커 init 단계에서 폰트 fetch + Pyodide FS 에 배치** — `/home/pyodide/fonts/NanumGothic-Regular.ttf`

3. **matplotlib 사용 셀에 setup 코드 자동 prepend** — 정규식 `\bmatplotlib\b|\bpyplot\b|\bplt\b` 로 감지. 사용 안 하는 셀은 비용 0.
   ```python
   # 자동 prepend (1회만 실행, sys.modules 플래그로 idempotent)
   matplotlib.font_manager.fontManager.addfont(font_path)
   matplotlib.rcParams["font.family"] = "NanumGothic"
   matplotlib.rcParams["axes.unicode_minus"] = False
   warnings.filterwarnings("ignore", message="Glyph .* missing from current font")
   warnings.filterwarnings("ignore", category=UserWarning, module="matplotlib")
   ```

4. **레슨 04-matplotlib.ts 의 print 안내문 정리** — `"Jupyter/Colab에서 plt.show() 주석을 해제하면 그래프가 나옵니다"` → `"아래에 그래프가 자동으로 표시됩니다 ↓"` (4곳 수정)

5. **레슨 마무리 안내 텍스트도 업데이트** — "이 환경에서는 그래프가 렌더링되지 않아..." → "이제 plt.show() 없이도 자동 표시됩니다. 한글 폰트도 자동 적용."

### 결과
- ✅ 한글 라벨 정상 표시 (`월별 매출 추이`, `매출 (만원)`, `1월`~`6월` 등 모두 깨끗하게)
- ✅ Glyph missing UserWarning 사라짐 (8줄 노이즈 제거)
- ✅ 레슨 print 가 더 이상 "Jupyter 가서 보세요" 라고 잘못 안내하지 않음
- ⚠️ 워커 init 시 폰트 2MB 추가 다운로드 (1회, 캐싱됨)

### 라이선스 (OFL)
NanumGothic 은 NHN Corp. 의 SIL Open Font License 1.1 폰트. 재배포 자유. `public/fonts/OFL.txt` 에 라이선스 전문 포함.

---

## [3.17.0] - 2026-04-15

### Added — 🎨 matplotlib 그래프 브라우저 내 자동 표시
브라우저 안에서 matplotlib 그래프가 PNG 이미지로 셀 출력에 자동 렌더링됩니다. `plt.show()` 호출 안 해도 되고, Jupyter/Colab 으로 안 가도 됨.

### 동작 원리
1. 사용자 코드 실행 직후 워커가 Python 스니펫으로 `plt.get_fignums()` 호출
2. 열린 figure 들을 각각 `fig.savefig(BytesIO, format="png", dpi=100)` 로 PNG 캡처
3. base64 로 인코딩 → `postMessage({ type: "figure", cellId, dataUrl })`
4. 메인 스레드가 `<img src="data:image/png;base64,...">` 로 셀 출력에 추가
5. `plt.close("all")` 로 다음 셀에 figure 잔재 안 남김

### 적용 범위 (3개 출력 컴포넌트 모두)
- 📓 **노트북 레슨** (`CellOutput`) — Python 트랙 모든 챕터
- 📚 **AI 강의 인라인 코드** (`InlineCodeRunner`) — 코드 셀 있는 강의
- 🖥️ **프로젝트 IDE** (`OutputPanel`) — IDE 모드 프로젝트

### 새 기능
- 그래프 옆 **↓ PNG 다운로드** 버튼
- 흰색 배경 보더 + 라이트/다크 모드 모두 가독성 OK
- `OutputChunk.stream = "figure"` + `OutputLine.stream = "figure"` + `dataUrl` 필드
- `RunCallbacks.onFigure` 콜백 추가 (Python 런타임 전용)

### 변경 파일
- `public/pyodide-worker.js` — figure 자동 캡처 스니펫
- `src/types/notebook.ts` — `OutputChunk` 에 `figure` stream + `dataUrl` 필드
- `src/store/fileStore.ts` — `OutputLine` 에 동일 추가
- `src/runtime/types.ts` — `RunCallbacks.onFigure`
- `src/runtime/pythonRunner.ts` — figure 메시지 핸들러
- `src/runtime/runCell.ts`, `src/runtime/fileRunner.ts` — onFigure 콜백 연결
- `src/components/notebook/CellOutput.tsx` — `FigureBlock` 추가
- `src/components/course/InlineCodeRunner.tsx` — figure 렌더 추가
- `src/components/ide/OutputPanel.tsx` — figure 렌더 추가
- `src/content/python/data-science/04-matplotlib.ts` — 안내 텍스트 업데이트

### 데이터 과학 04강 안내 변경
- 이전: "이 환경에서는 그래프가 직접 렌더링되지 않습니다. Jupyter/Colab 가서 보세요."
- 이후: "🎉 이제 브라우저에서 그래프가 바로 표시됩니다! plt.show() 안 해도 자동 렌더링."
- 한국어 글자 폰트 부재 안내 추가 (□ 로 보일 수 있음, 영어 라벨 권장)

### 알려진 제약
- **한국어 폰트 없음** — DejaVu Sans 기본. 한글 글자는 □ 로 표시됨. 영어 또는 숫자 라벨 사용 권장. 한국어 폰트 추가는 별도 작업.
- **인터랙티브 위젯 없음** — `plt.ion()`, 마우스 이벤트, 슬라이더 등은 미지원 (정적 PNG)
- **3D plot, animation** — savefig 로 단일 프레임만 캡처됨

### 기타
v3.16.1 의 `MPLBACKEND=Agg` 강제는 그대로 유지 — Agg 백엔드가 PNG 캡처에 가장 잘 맞음.

---

## [3.16.1] - 2026-04-15

### Fixed — matplotlib `import matplotlib.pyplot as plt` 시 ModuleNotFoundError
- **증상**: 데이터 과학 트랙 04강(Matplotlib) 의 라인 차트 셀에서
  `import matplotlib.pyplot as plt` 가 ModuleNotFoundError 로 실패. 패키지 자동 로드는 성공("📦 matplotlib already loaded") 했는데 임포트 자체에서 막힘.
- **원인**: Pyodide 0.28 의 matplotlib 은 import 시 기본 백엔드로
  `matplotlib_pyodide` (HTML5 캔버스) 를 찾으려 함. 이 패키지는 별도 micropip
  설치가 필요한데 학습 환경엔 없으므로 ModuleNotFoundError 발생.
- **수정**: `public/pyodide-worker.js` 의 `initPyodide()` 직후 환경변수
  `MPLBACKEND=Agg` 를 설정. matplotlib 은 첫 import 직전에 한 번만
  이 변수를 읽으므로, 워커 init 단계에서 강제하면 모든 셀의
  `import matplotlib.pyplot` 가 헤드리스 백엔드(Agg) 로 안전하게 동작.
- **결과**:
  - ✅ matplotlib import 에러 사라짐
  - ✅ `plt.figure()`, `plt.plot()`, `plt.title()` 등 호출은 정상 동작 (메모리상 figure 생성)
  - ⚠️ 그래프 자체는 여전히 표시 안 됨 (헤드리스) — 레슨 안내대로 Jupyter/Colab 에서 확인
  - ⚠️ 한국어 글자 (`월별`, `1월`) 는 폰트 부재로 UserWarning 가능 (치명 아님)

### 향후 옵션
실제로 브라우저 안에서 matplotlib 그래프를 표시하려면 `matplotlib_pyodide`
를 추가 로드하고 OutputPanel 에 캔버스 영역을 만드는 별도 기능이 필요함
(v3.17.0 후보).

---

## [3.16.0] - 2026-04-14

### Added — 구독 모델 Phase 2A: 관리자 모드 + 실제 접근 제어
Phase 1 (v3.15.0) 에서 UI 배지만 있던 상태에서 **실제 차단**이 동작하는 단계로. 관리자가 사용자별로 번들 권한을 체크박스로 부여/회수할 수 있습니다.

### 권한 체계 (하이브리드)
- **환경변수 슈퍼 관리자**: `VITE_ADMIN_EMAILS` — 절대 권한, 코드 공개 안 됨
- **DB 기반 관리자·사용자**: `user_entitlements` 테이블 — 운영 시 관리자가 UI 로 편집

### 번들 5종 (옵션 B)
- `all-pro` — 전체 PRO (아래 3개 묶음 = 정식 구독)
- `ai-courses-pro` — AI 강의 07~10
- `python-advanced` — Python 중급·데이터 과학·ML 실습
- `projects-pro` — AI 프로젝트 11개
- `admin` — 관리자 모드 접근

### Supabase 스키마 (`supabase/migrations/v3.16.0_entitlements.sql`)
- `profiles.email` 컬럼 추가 + 백필 + trigger 업데이트
- `user_entitlements` 테이블 (user_id × entitlement 유니크, 만료일·메모·출처·감사 필드)
- `public.is_admin()` SECURITY DEFINER 함수 (RLS 재귀 방지)
- RLS: 본인 read, admin read-all + write-all, admin read-all profiles
- 부트스트랩: `gyumsonsam@gmail.com` 에 admin + all-pro 자동 부여

### 새 파일 (10개)
- `supabase/migrations/v3.16.0_entitlements.sql`
- `.env.example` (VITE_ADMIN_EMAILS 문서화)
- `src/types/entitlement.ts` (타입 + 라벨 + 설명)
- `src/lib/adminEmails.ts` (env 파싱)
- `src/content/access.ts` (`canAccessCourse/Project/Lesson/Track`, `isAdmin`)
- `src/storage/supabaseEntitlementsRepo.ts` (load·list·grant·revoke)
- `src/hooks/useEntitlements.ts` (DB + env 자동 병합)
- `src/pages/AdminPage.tsx` (대시보드 · 검색 · 체크박스 편집 · toast)

### 통합 변경
- Paywall 통합 4개 페이지 (HomePage / CoursesPage / CurriculumPage / ProjectsPage) 가 이제 `canAccess*()` 로 실제 권한 확인. 권한 있으면 배지·모달 안 뜸
- NavBar 에 관리자일 때 "🛡️ 관리자" 링크 표시 (desktop + mobile)
- App 라우트에 `/admin` 추가 (비관리자 접근 시 안내 화면)

### UX 세부사항
- 관리자 페이지: 이메일·닉네임 검색, 4개 통계 카드 (전체/All PRO/부분 PRO/관리자), 사용자 클릭 → 아코디언 체크박스
- ENV 기반 혜택은 체크박스에 "ENV (고정)" 배지 + disabled — DB 에서 변경 불가 명시
- 저장 중 opacity 60%, 결과 toast 2.5초 표시
- 모바일 대응 (카드 반응형, 통계 2×2 그리드)

### 배포 절차
1. Supabase Dashboard → SQL Editor 에서 `supabase/migrations/v3.16.0_entitlements.sql` 실행 (이메일 확인)
2. Vercel Environment Variables 에 `VITE_ADMIN_EMAILS=gyumsonsam@gmail.com` 추가
3. 로컬 `.env.local` 에도 동일하게 추가
4. 배포 후 해당 이메일로 로그인 → NavBar 에 🛡️ 관리자 링크 등장 확인

### 다음 단계 (Phase 3)
- 결제 연동 (포트원 / 토스페이먼츠)
- 가격 페이지 + 쿠폰 + 이용약관·환불정책·정기결제 동의 UI
- Paywall 모달 CTA 를 가격 페이지로 교체

---

## [3.15.0] - 2026-04-14

### Added — 구독 모델 Phase 1: 콘텐츠 티어링 + Paywall UI
AIGoLab 을 부분 구독 모델로 전환하는 첫 단계. **결제 연동 없이 UI 구분만 먼저** — 어떤 콘텐츠가 PRO 인지 사용자에게 명시하고, 출시 전 피드백을 수집합니다.

**분류 기준 (`src/content/tier.ts`)**

FREE (무료):
- AI 강의 01~06 (what-is-ai / ml-basics / data-and-ai / deep-learning-basics / nlp-basics / generative-ai — 생성형 AI·LLM 원리까지)
- Python 입문 트랙 전체
- JavaScript 입문 / SQL 입문 전체
- AI 프로젝트 2개: `iris-classification`, `titanic-survival`
- 마이페이지 / Playground / Python IDE / 홈 / 약관 / 로그인

PRO (곧 오픈 예정):
- AI 강의 07~10 (prompt-engineering / computer-vision / ai-ethics / ai-agents)
- Python 중급 · 데이터 과학 · ML 실습 트랙 전체
- AI 프로젝트 11개 (iris·titanic 제외)

### 새 컴포넌트
- `src/content/tier.ts` — 유일한 분류 기준 (isLessonPro / isCoursePro / isProjectPro / isTrackPro)
- `src/components/paywall/ProBadge.tsx` — 🔒 PRO 배지 (sm/md/lg, outline/solid)
- `src/components/paywall/PaywallModal.tsx` — 바텀시트/센터 모달, 모바일 대응, 혜택 3줄 + CTA
- `src/components/paywall/usePaywall.tsx` — 페이지 레벨 훅 (`showPaywall`, `modal`)

### 통합 지점 (5개 페이지)
- **HomePage**: 트랙 선택 버튼에 🔒 배지 + 클릭 시 paywall 인터셉트. "이어서 학습" 배너도 PRO 트랙이면 인터셉트
- **CoursesPage**: AI 강의 07~10 에 🔒 배지 + 전체 카드를 button 으로 변경해 paywall 인터셉트
- **CurriculumPage**: PRO 트랙 URL 직접 접근 시 상단에 설명 배너, 개별 챕터 Link → button 으로 교체, 🔒 표시
- **ProjectsPage**: 11개 PRO 프로젝트에 🔒 배지, "프로젝트 시작하기" CTA 를 PRO 면 "🔒 PRO 전용 — 곧 오픈 예정" 버튼으로 교체

### UX 원칙 (Phase 1)
- **콘텐츠 접근은 여전히 가능** — 직접 URL 치면 LessonPage / CourseDetailPage / ProjectWorkPage 열림. Phase 1 은 "표시만" 하는 단계 (Phase 2 에서 enforce)
- **이유**: 결제 전에 사용자가 "이 분류가 납득되는지" 피드백을 관찰하기 위함
- **배지 스타일**: 🔒 PRO 아이콘 + amber/yellow 그라디언트 — 기존 브랜드 violet 과 대비되어 눈에 띔
- **모바일 대응**: PaywallModal 은 모바일에서 바텀시트, 데스크탑에서는 센터 모달
- **접근성**: `role="dialog"`, `aria-modal`, `aria-labelledby`

### Why (비즈니스)
- Python 입문 / JS / SQL / AI 기초는 계속 무료로 유지해 **온보딩 깔때기 폭을 넓게**
- 중·고급 콘텐츠 (ML 실습·데이터 과학·고급 AI 강의·프로젝트) 를 PRO 로 묶어 **수익화 전환 지점 확보**
- 13개 프로젝트 중 2개 (iris·titanic) 만 무료로 둔 것은 **"맛보기 충분, 실무 깊이는 PRO"** 공식

### 다음 단계 (Phase 2~3)
- Phase 2: Supabase `subscriptions` 테이블 + `useSubscription()` 훅 + 관리자 수동 pro 지정
- Phase 3: 포트원/토스페이먼츠 결제 연동 + 웹훅 + 가격 페이지
- Phase 3: 이용약관·환불·정기결제 동의 UI

---

## [3.14.0] - 2026-04-14

### Improved — C3: 모바일 UX 정밀화
모바일 (<640px) 에서 주요 페이지의 여백·크기·드로어 UX 개선.

**ProjectsPage (리스트)**
- 카테고리 필터 8개가 모바일에서 4줄로 wrap 되던 문제 → **가로 스크롤** (snap-x) 로 전환, 스크롤바 숨김
- 아코디언 헤더: 데스크탑은 그대로, 모바일은
  - 아이콘 축소 (`text-4xl` → `text-3xl sm:text-4xl`)
  - 태그 `+N` 축약 + 우측 "약 X분 · N단계" 메타를 태그 줄에 인라인 배치
  - 우측 시간·단계 블록은 `sm:block` 으로 데스크탑 전용
- 외부 패딩: `px-6 py-12` → `px-4 py-6 sm:px-6 sm:py-12`

**ProjectWorkPage (IDE)**
- 모바일 가이드 드로어 폭 확장: `w-[85%] max-w-[360px]` → `w-[92%] max-w-[420px]`
- 파일 트리 드로어: `w-60` → `w-[72%] max-w-[260px]` (폰에 비례)
- 모바일 드로어 우상단에 **명시적 닫기 버튼 (×)** 추가 — 기존엔 backdrop 탭만 가능해서 발견성 낮음

**CourseDetailPage (강의)**
- 외부 패딩: `px-6 py-12` → `px-4 py-6 sm:px-6 sm:py-12`
- 제목: `text-3xl` → `text-2xl sm:text-3xl` (아이콘 `text-4xl` → `text-3xl sm:text-4xl`)
- 섹션 간격: `space-y-8` → `space-y-6 sm:space-y-8`
- "다음 강의" 카드: 모바일에서 아이콘·제목 축소, truncate 적용
- 메타 정보 영역: `flex-wrap gap-x-3 gap-y-1` 로 줄바꿈 대응

**Added — `.scrollbar-hide` 유틸리티**
- `src/index.css` 에 크로스 브라우저 스크롤바 숨김 CSS 추가
- 가로 스크롤 카테고리 필터에 적용

### Why
- 오디트 결과 ProjectsPage 카테고리 필터가 7~8개로 늘어난 후 (v3.12.0 data-analysis 추가) 모바일에서 **4줄로 wrap 되어 카드보다 많은 공간 차지**
- ProjectWorkPage 모바일 드로어 닫기 방법이 **backdrop 탭뿐** 이라 발견성 낮음 — 첫 방문자가 갇히는 느낌
- CourseDetailPage 의 `px-6 max-w-3xl` 경직성 → 320px 폰에서 콘텐츠 가독성 저하

### ⚠️ 참고
이 릴리즈는 **로직 변경 없이 CSS/레이아웃만** 수정. LessonPage 는 v3.x 에서 이미 모바일 오버플로 메뉴가 구현되어 있어 이번 릴리즈 범위에서 제외. 실기기 UX 검증은 배포 후 수동으로 권장.

---

## [3.13.0] - 2026-04-14

### Added — B2: 고객 이탈 예측 프로젝트 (13번째 AI 프로젝트)
ML 실습 트랙 Ch10 (SaaS Churn 예측) 을 프로젝트 IDE 모드로 이식.

**새 프로젝트**: `churn-prediction` (카테고리: classification)
- 시나리오: SaaS 데이터 사이언티스트 → CEO 에게 이탈 예측 모델 + 액션 권고 브리핑
- 8 STEP + 🎯 결과 해설
  - STEP 1: 가상 고객 2000명 생성 (규칙 + 노이즈로 churn 타깃)
  - STEP 2: 📊 EDA — 피처 × 이탈 관계 + 계약 유형별 이탈률
  - STEP 3: 🔪 훈련/테스트 분할 (`stratify=y` 필수)
  - STEP 4: 🛠️ 전처리 파이프라인 (ColumnTransformer: Scaler + OneHot)
  - STEP 5: 🥇 모델 3종 5-fold CV 비교 (Logistic / RF / GradientBoosting, F1 스코어)
  - STEP 6: 🎯 최종 모델 학습 + Confusion Matrix + AUC-ROC
  - STEP 7: 🔍 permutation_importance 로 모델 해석
  - STEP 8: 📉 임계값 스윕 + 📝 CEO 경영진 보고서 f-string 조립
  - 🎯 결과 해설: 각 스텝의 숫자 해석 + 한계 표 + 5가지 시도 변형

**ML 실습 트랙 총복습 체감**:
- **불균형 데이터 대응**: stratify + class_weight + F1
- **누수 없는 파이프라인**: ColumnTransformer + Pipeline
- **모델 해석**: permutation_importance ("왜 이렇게 예측했나")
- **임계값 조정**: precision/recall 트레이드오프를 비즈니스 의사결정에 연결
- **경영진 보고**: 숫자 + 기여 요인 + 권장 액션까지 f-string 조립

### Why
- 기존 레슨(Ch10) 은 **노트북 스타일 이론 흐름** — 읽기는 좋지만 "직접 짜는 체감" 부족
- 프로젝트 IDE 모드에선 STEP 단위 **힌트→스니펫→정답 점진 공개 + 결과 해설** 제공
- 레슨(이론) + 프로젝트(실습) 이중 트랙 — B1 (v3.12.0) 과 동일한 구조

### 콘텐츠 현황
- AI 프로젝트 **13개** (classification 4개·NLP 4개·unsupervised 2개·timeseries 1개·anomaly 1개·generative(nlp편입)·data-analysis 1개)

---

## [3.12.0] - 2026-04-14

### Added — B1: e-commerce EDA 프로젝트 (12번째 AI 프로젝트)
데이터 과학 트랙 Ch10 (3-테이블 e-commerce EDA) 을 프로젝트 IDE 모드로 이식.

**새 프로젝트**: `ecommerce-eda`
- 시나리오: 신규 분석가로 입사 → CEO 에게 인사이트 3가지 브리핑
- 7 STEP + 🎯 결과 해설
  - STEP 1: 3개 가상 테이블 (users/products/orders) 생성, 결측 섞기
  - STEP 2: 결측 정제 + 3-way merge + 파생 컬럼 (amount/month/dow)
  - STEP 3: 전체·지역별 기초 지표 (groupby + agg)
  - STEP 4: 💎 카테고리 인사이트 (점유율 + 객단가)
  - STEP 5: 🗺️ 지역 × 카테고리 피벗 테이블
  - STEP 6: 🏆 VIP 고객 파레토 분석 (cumsum 누적 비율)
  - STEP 7: 📝 CEO 용 최종 보고서 조립 (f-string)
  - 🎯 결과 해설: 출력 해석 + 한계 + 5가지 시도 변형

**데이터 분석 도구 총출동**: `fillna` / `merge` / `pivot_table` / `groupby.agg()` / `cumsum` / `nunique` / `.dt` accessor

### Added — 신규 카테고리 "data-analysis" (📊)
- `ProjectCategory` 유니온에 `"data-analysis"` 추가
- `ProjectsPage` 카테고리 필터에 "데이터 분석" 버튼 추가 (📊)
- 기존 분류/NLP/추천·군집/시계열/이상탐지/생성모델 6개 + 데이터 분석 = 7개 카테고리

### Why
- 기존 레슨(Ch10) 은 **이론·순서 중심의 노트북** — 한 번에 읽기 좋지만 **직접 손으로 짜는 체감** 은 떨어짐
- IDE 모드 프로젝트로 이식하면 STEP 단위 힌트→스니펫→정답 점진 공개 + 결과 해설까지 제공 가능
- 레슨 파일은 **유지** (이론용) 하고 프로젝트는 **실습 강화용** — 두 가지 학습 경로 제공

---

## [3.11.0] - 2026-04-14

### Added — AI 강의 인라인 코드 셀 "🎯 결과 해설" 6개
v3.7.0 프로젝트의 해설 패턴을 AI 강의에도 이식. 각 강의의 `type: "code"` 섹션 바로 뒤에 `type: "text"` 해설 섹션을 추가했습니다.

**해설 구조 (공통)**
- 출력 의미 역추적 — 숫자/문장/ASCII 아트가 왜 그렇게 나왔는지
- 이 구현의 한계 표 — 진짜 프로덕션은 어떻게 다른가
- 🧪 지금 시도해 볼 것 — 3~4개의 구체적 변형 실험
- 🏁 배운 것 — 강의 맥락에 연결되는 take-away

**대상 강의 6개**
- **02 머신러닝 기초** (선형 회귀 직접 구현) — `a, b` 의 실무 의미, 최소제곱법, 이상치 민감성
- **06 생성형 AI** (바이그램 언어모델) — Next-Token Prediction, 조건부 확률, LLM 과의 규모 차이
- **07 프롬프트 엔지니어링** (품질 점검기) — 6기둥 역추적, 키워드 매칭의 한계, 실전 프롬프트로 확장
- **08 컴퓨터 비전** (에지 검출 커널) — 커널 = 질문지, 특징맵의 의미, CNN 학습과의 연결
- **09 AI 윤리** (편향 시뮬레이션) — 실력과 가중치의 수학적 역전, 대리 변수 문제, 해결 방향
- **10 AI 에이전트** (ReAct 루프) — Tool Use 로 환각 제거, graceful fail, 진짜 Claude Code 와의 공통 구조

### Why
- 실행 결과를 보고 "그래서 뭐?" 에 멈추던 학습자가 **출력의 의미 → 한계 → 다음 실험** 으로 이어지도록
- 프로젝트 IDE 모드 (v3.7.0) 에서 검증된 패턴을 강의 인라인 셀에도 일관 적용

---

## [3.10.1] - 2026-04-14

### Fixed — ProjectsPage 카테고리 리셋 + CTA 위치
- 증상 1: 카테고리 필터 (예: NLP) 선택 후 프로젝트 카드 클릭해 펼치면 필터가 "전체" 로 자동 리셋
  - 원인: `toggle()` 에서 `setSearchParams({ open: next })` 로 전체 쿼리 덮어씀 → `cat` 파라미터 유실
  - 수정: 기존 `URLSearchParams` 를 복사해 `open` 만 토글 → `cat` 유지
- 증상 2: 펼친 카드의 "🚀 프로젝트 시작하기" 버튼이 맨 아래 → 긴 설명 스크롤해야 보임
  - 수정: CTA 를 펼친 본문 **맨 위** 로 이동 + 그림자 강조

---

## [3.10.0] - 2026-04-14

### Added — C1: AI 프로젝트 카테고리 필터 + C5: Open Graph 보강
- **`ProjectCategory` 타입** 신설 (classification / nlp / unsupervised / timeseries / anomaly / generative)
- 11개 프로젝트 모두 카테고리 할당
- `ProjectsPage` 상단에 **카테고리 필터 버튼** (6 카테고리 + 전체, 각 개수 배지)
- URL `?cat=nlp` 지원 (딥링크·뒤로가기 동기화)
- `index.html` OG 메타 업데이트: og:image 추가, description 에 11개 프로젝트/10강 반영, twitter:image 추가

---

## [3.9.1] - 2026-04-14

### Fixed — multi-line import 로 인한 SyntaxError (카드 이상 탐지 등)
- 증상: `from sklearn.metrics import (\n ... \n)` 같은 multi-line import 가 있는 프로젝트 실행 시 `SyntaxError: '(' was never closed`
- 원인: fileRunner 가 패키지 선로드 마커용 import 를 **한 줄씩** 추출해 prepend — multi-line 의 첫 줄만 가져가 괄호 안 닫힘
- 수정: `extractImportBlocks()` 함수로 **괄호 균형 + 백슬래시 줄잇기** 모두 인식해 블록 단위로 추출

---

## [3.9.0] - 2026-04-14

### Added — 부족한 패러다임 채우는 신규 AI 프로젝트 3개 (총 8 → 11개)

#### 📈 시계열 매출 예측 (`time-series-forecast`)
- 첫 시계열 프로젝트. 365일 매출 데이터를 트렌드·계절성·노이즈로 분해
- 이동평균(rolling mean), 요일별 계절성 자동 발견, 선형회귀 트렌드 + 계절성 보정
- MAE / MAPE 평가 + ASCII 차트 시각화

#### 🔍 카드 이상 거래 탐지 (`anomaly-detection`)
- 99% 정상 + 1% 사기 환경 — 첫 극단적 불균형 데이터
- Z-score 통계 방법 + IsolationForest 비지도 ML
- 정확도 함정 + Recall/Precision 트레이드오프 + 임계값 조정

#### 📝 마르코프 텍스트 생성기 (`markov-text`)
- 첫 생성 모델 — ML 라이브러리 없이 순수 Python
- Bigram + Trigram n-gram 모델 + 가중 무작위 샘플링
- LLM(ChatGPT) 의 본질(다음 토큰 확률 예측) 의 가장 단순한 형태

각 프로젝트 7단계 (6 STEP + 결과 해설), stepMarker + snippet + solution 완비.

---

## [3.8.1] - 2026-04-14

### Fixed — 라이트 모드에서 회색 배경 + 글자 안 보이는 영역 수정
- 증상: 라이트 모드 전환 시 다음 영역에서 어두운 배경 잔존 + 글자 가독성 저하
  - 위쪽 NavBar (\`bg-brand-bg/95\`)
  - 메인 홈의 학습 코너 카드 (\`bg-brand-panel/80\`, \`/40\`)
  - 코딩 실습의 "이어서 학습" 배너 (\`bg-gradient-to-r from-colab-panel\`)
- 원인: 기존 라이트 모드 CSS 가 \`.bg-brand-bg\` 단일 클래스만 매칭. 투명도 변형(\`/95\`, \`/80\`, \`/60\` 등)과 그라디언트는 누락.
- 수정: \`index.css\` 의 라이트 모드 오버라이드를 패턴 매칭(\`[class*="bg-brand-bg"]\`)으로 확장 — 모든 투명도 변형 + 어두운 색 그라디언트(\`bg-gradient*colab-panel*\` 등)를 한 번에 평탄화.

---

## [3.8.0] - 2026-04-14

### Added — 트렌디 신규 AI 프로젝트 3개 (총 5 → 8개)

#### 🧭 프롬프트 품질 분류기 (`prompt-classifier`)
- AI 강의 07 (프롬프트 엔지니어링) Master Protocol 6기둥 자동 채점
- 등급(S/A/B/C) 매핑 + 기둥별 ✅/❌ 진단 + 자동 개선 제안
- LLM 시대의 메타 도구 — 프롬프트를 LLM 에 보내기 전 검증

#### 🤖 미니 챗봇 (`mini-chatbot`)
- AI 강의 10 (에이전트) 의 의도 분류 + 도구 호출 패턴
- 7개 의도 (greeting/time/math/weather/help/thanks/bye) + 응답 생성기
- 시간·계산 등은 실제 함수 호출 (도구 사용)
- v2 에서 메모리(이름 기억) + 새 의도 추가로 확장

#### 📊 K-means 고객 세그먼트 (`customer-segmentation`)
- ML Ch4 (클러스터링) 의 비지도 학습 첫 프로젝트
- 기존 5개 프로젝트는 모두 분류·추천 → **첫 비지도 학습**
- RFM 분석 + StandardScaler + KMeans(k=4)
- 자동 라벨링 (VIP/활성/일반/이탈위험) + 신규 고객 즉시 분류 + 마케팅 액션 추천

각 프로젝트:
- 7단계 (6 STEP + 결과 해설)
- 모든 STEP 에 stepMarker + snippet + solution
- 결과 해설은 풍부한 마크다운 + 시도해 볼 변형 + 한계 비교

---

## [3.7.1] - 2026-04-14

### Fixed — 감성 분석기 SyntaxError (f-string 따옴표 충돌)
- 증상: 감성 분석기 ▶ 실행 시 `SyntaxError: invalid syntax` (line 80)
- 원인: starter 코드의 \`print(f"\\n📝 \\"{result['text']}\\"")\` 에서 JS 백틱 안의
  \`\\"\` 가 결과 문자열에 그냥 \`"\` 로 들어가, Python f-string 외부 따옴표가 일찍 종료됨
- 수정: 외부 따옴표를 작은따옴표로 변경 — \`print(f'\\n📝 "{result["text"]}"')\`

---

## [3.7.0] - 2026-04-14

### Added — 5개 프로젝트 모두 "🎯 결과 해설" 단계 추가
실행 결과의 숫자만 보고 의미를 짐작하기 어렵다는 피드백 반영. 각 프로젝트 단계 마지막에 출력 해석 가이드 신설.

#### 🌸 아이리스 — 결과 해설
- 패키지 로드 메시지 의미
- 데이터 크기 (150, 4) 의 분해
- 정확도 100% 가 왜 가능했는지 (vs 실무 데이터)
- 새 데이터 예측의 의미 + 시도해 볼 변형 예시

#### 🚢 타이타닉 — 결과 해설
- 특성 중요도 1위 = 성별 → 영화의 "여성·어린이 우선" 이 데이터에 새겨진 증거
- DecisionTree vs RandomForest 차이 해석
- 윤리 관점 ([AI 강의 09] 와 연결)

#### 🎬 영화 추천 — 결과 해설
- 코사인 유사도 0.67 이 무엇을 뜻하는지
- 추천 동률 다수가 정상인 이유
- 콘텐츠 기반 추천의 한계 + 넷플릭스 실제 구조

#### 🔢 손글씨 숫자 인식 — 결과 해설
- 정확도 98%+ 의 의미
- 혼동 행렬 읽는 법 (대각선 = 맞춤, 외각 = 헷갈림)
- 자주 헷갈리는 숫자 쌍 (4↔9, 8↔2 등)
- 미니 모델 vs MNIST vs 상용 OCR 비교표

#### 💬 감성 분석기 — 결과 해설
- 정확도 80% 가 단순 모델 치고 좋은 이유
- 부정어 처리 (안/못/없) 의 효과 시각화
- 잘 안 잡히는 한계 (반어법, 혼합 감정)
- 사전 확장으로 직접 개선해 보는 가이드

각 해설은:
- **펼치면 풍부한 마크다운** (출력 예시 + 의미 + 시도해 볼 것)
- **stepMarker 없음** — 실행 후 단계라 에디터 스크롤 안 함
- **체크 가능** — 진행률 100% 달성에 포함

---

## [3.6.2] - 2026-04-14

### Fixed — IDE 모드에서 sklearn 여전히 로드 안 되던 문제 (v3.6.1 후속)
- v3.6.1 에서 worker 가 `loadPackagesFromImports(code)` 를 호출하도록 고쳤지만,
  IDE 모드에선 worker 에 전달되는 `code` 가 `runpy.run_path(...)` 래퍼였기 때문에
  사용자 파일 내부의 `import sklearn` 을 감지 못해 여전히 로드 실패했음.
- **수정**: `fileRunner` 가 모든 .py 파일의 **top-level import 문** 을 스캔해
  worker 로 보내는 runCode 맨 앞에 prepend. 이제 worker 의 AST 스캔이 사용자
  코드의 외부 패키지(sklearn, pandas, numpy, matplotlib 등) 를 감지해 선로드.
- 프로젝트 파일 내 상호 import (예: `from utils import X`) 는 제외 — sys.path
  설정 전이라 선로드 대상이 아님.

---

## [3.6.1] - 2026-04-14

### Fixed — sklearn / pandas / matplotlib 자동 로드 (핫픽스)
- **pyodide-worker.js**: `runPythonAsync` 전에 `loadPackagesFromImports(code)` 호출 추가
  - 증상: 아이리스·타이타닉 등 ML 프로젝트 실행 시 `ModuleNotFoundError: No module named 'sklearn'` 발생
  - 원인: Pyodide 의 `runPythonAsync` 는 패키지 자동 로드를 수행하지 않음. 별도 호출 필요.
  - 수정: 코드의 import 를 스캔해 Pyodide repodata 에 등록된 패키지(numpy, pandas, scipy, scikit-learn, matplotlib 등) 를 선로드.
  - UX: 로딩 중 진행 메시지를 stdout 으로 노출 ("📦 Loading scikit-learn..." 등)

### Changed — 에러 힌트 개선
- `errorTranslator.ts`: \`ModuleNotFoundError\` 의 힌트를 Pyodide 내장 패키지인지 여부에 따라 분기
  - 내장 패키지 (sklearn, pandas 등) 는 "한 번 더 ▶ 실행" / "🔄 런타임 재시작" 가이드
  - 기타 패키지는 기존 micropip 설치 안내

---

## [3.6.0] - 2026-04-14

### Added — AI 프로젝트 교육 구조 전면 개편 ("보면서 코딩" 모드)

**새로운 흐름**: 리스트(아코디언 브리핑) → 프로젝트 시작하기 → IDE + 우측 가이드 패널 (3-column). 기존 "읽기 전용 상세 페이지" 제거.

#### 🧩 라우트
- \`/projects/:id/work\` — **프로젝트 모드 IDE** (신규)
- \`/projects/:id\` (구) — \`/projects?open=:id\` 로 자동 리다이렉트 (외부 링크 보존)
- \`/projects?open=:id\` — 특정 프로젝트 펼친 상태 딥링크 지원

#### 📋 \`ProjectsPage\` 아코디언 개편
- 한 번에 하나의 프로젝트만 펼침 (아코디언)
- 펼친 카드: 설명 + 단계 개요 + **🚀 프로젝트 시작하기** CTA
- URL 쿼리 동기화 (브라우저 뒤로가기·북마크·공유 가능)

#### 🛠️ \`ProjectWorkPage\` (신규) — 3-Column IDE
- **좌**: 파일 트리 (접이식) / **중**: 에디터 + 출력 (크기 조절 가능) / **우**: 가이드 패널 (접이식)
- 상단바: \`← 목록\` / \`Run·Stop\` / \`↺ 재시작\` / 패널 토글 / Pyodide 상태
- 패널 상태 localStorage 지속성 (\`project_work_panels\`)
- 모바일: 가이드·트리 오버레이 드로어

#### 🎯 \`ProjectGuidePanel\` (신규) — 우측 가이드
- **아코디언** 단계 카드 (한 번에 하나 펼침) — 완료 시 다음 자동 펼침
- 프로젝트 소개 접이식 헤더
- 진행률 바 + 재시작 (localStorage 진행도)
- **3단 점진 공개**: 💡 힌트 / 📋 스니펫 / 👀 정답 — 스니펫·정답에 **복사 버튼**
- 단계 클릭 시 에디터에서 \`## STEP N:\` 앵커로 **자동 스크롤 + 하이라이트**

#### 🔗 가이드 ↔ 에디터 스크롤 동기화
- starter 코드에 \`## STEP N: 제목\` 앵커 주석 삽입
- 가이드 단계 클릭 → Monaco \`revealLineInCenter\` + \`deltaDecorations\` 로 해당 영역 3초간 강조
- 사용자가 코드 편집해도 앵커 주석이 남아있으면 동작 (강건)

### Changed
- \`ProjectStep\` 타입 확장: \`snippet\` (부분 코드), \`stepMarker\` (앵커 이름) 필드 추가
- 5개 프로젝트 starter 파일 모두 \`## STEP N: 제목\` 포맷으로 앵커 주석 전환
- 5개 프로젝트 모든 step 에 \`stepMarker\` 및 \`snippet\` 추가
- \`IdeEditor\` 에 \`onEditorReady\` prop 추가 — 외부에서 Monaco 인스턴스 접근 가능

### Removed
- \`ProjectStepCard\` (v3.5.0 내장형) — \`ProjectGuidePanel\` 로 대체

---

## [3.5.0] - 2026-04-14

### Added — AI 프로젝트 스캐폴딩 (단계별 가이드 강화)
- \`ProjectStep\` 타입 신설 — title / description(md) / hint / solution(code) / checkpoint
- \`Project.steps\` 을 \`(string | ProjectStep)[]\` 로 확장 (하위 호환)
- **\`ProjectStepCard\` 컴포넌트** 신규 — 펼침 카드, 완료 체크박스, 💡 힌트 / 👀 정답 토글
- \`ProjectDetailPage\` 개편
  - 진행률 바 (n/total + %)
  - localStorage 기반 단계별 진행도 저장 (\`project_progress_<id>\`)
  - 완주 축하 배너 (100% 도달 시)
  - ↺ 진행도 초기화 버튼

### Changed — 기존 5개 프로젝트 리치화
- 🌸 아이리스 꽃 분류 — 6단계 × (설명 + 힌트 + 정답 코드)
- 🚢 타이타닉 생존자 예측 — 6단계, 모델 2종 비교 + 특성 중요도
- 🎬 영화 추천 시스템 — 6단계, 원핫 → 코사인 유사도 → 추천
- 🔢 손글씨 숫자 인식 — 6단계, SVM + 혼동 행렬 + 오분류 분석
- 💬 감성 분석기 — 6단계, 부정어 처리 + 정답 레이블 평가

---

## [3.4.0] - 2026-04-14

### Added — Python ML 실습 트랙 10강 체제 완성 (5강 신규)
- **Ch6 특성 전처리와 인코딩** — OneHot/Ordinal, Standard/MinMax/Robust Scaler, SimpleImputer, **ColumnTransformer + Pipeline**, 데이터 누수 방지 + 미션
- **Ch7 트리와 앙상블** — DecisionTree (\`export_text\`), 과적합 제어, **RandomForest**, \`feature_importances_\`, 모델군 비교 + 미션
- **Ch8 부스팅과 정규화** — 배깅 vs 부스팅, GradientBoosting/HistGradientBoosting, Ridge/Lasso/ElasticNet, RidgeCV/LassoCV + 미션
- **Ch9 모델 해석과 불균형 데이터** — \`permutation_importance\` (모델 무관), ROC/AUC (ASCII 곡선), class_weight / stratify, 임계값 조정 + 미션
- **Ch10 미니 프로젝트 — 고객 이탈 예측** — EDA → 전처리(ColumnTransformer) → 3모델 비교(교차검증) → 선택·해석 → 임계값 조정 → 경영진 리포트 조립 + 도전 미션

### Changed — 트랙 메타
- \`languages.ts\` ml-practice 설명: "10강 완주 코스" / \`estimatedHours: 5 → 10\`
- Ch5 마무리 셀 추가 — "전반 5강 마무리 + 후반 5강 예고" 리프레이밍

---

## [3.3.0] - 2026-04-14

### Added — Python 데이터 과학 트랙 10강 체제 완성 (5강 신규)
- **Ch6 데이터 정제와 품질** — 결측값·중복·이상치(IQR)·타입 변환·범주형 통일 + 미션
- **Ch7 문자열과 날짜 데이터** — \`.str\` 벡터화·정규식 extract / \`.dt\` 접근자 / \`resample\` + 미션
- **Ch8 데이터 합치기** — \`merge\` (inner/left/outer) / \`concat\` / \`pivot\` / \`melt\` + 3-way 미션
- **Ch9 그룹 분석 심화** — \`pivot_table(margins)\` / named \`agg\` / \`transform\` / \`rank\` / \`cumsum\` / \`pct_change\` + 미션
- **Ch10 미니 프로젝트 — 3-테이블 e-commerce EDA** — users/products/orders 결합 → 카테고리 인사이트 + 지역 × 카테고리 피벗 + VIP(파레토) 발굴 + 요일 패턴 + 도전 미션

### Changed — 트랙 메타
- \`languages.ts\` 데이터 과학 트랙 설명: "10강 완주 코스" / \`estimatedHours: 5 → 10\`
- Ch5 마무리 셀: "트랙 완료" → "전반 5강 마무리 + 후반 5강 예고" 로 리프레이밍
- Ch4 Matplotlib 마무리 셀: 브라우저 렌더링 제약을 "시각화 전 단계가 더 실무적" 이라는 긍정 맥락으로 보강

---

## [3.2.0] - 2026-04-14

### Added — AI 강의 3강 추가 (트랙 완주, 총 10강)
- **강의 08 "컴퓨터 비전 입문"** — 이미지 = 숫자 배열 / 커널 필터 / 합성곱 / CNN 계층 / 전이학습 + 순수 Python 7×7 이미지에 3×3 에지 검출 커널 직접 적용 실습
- **강의 09 "AI 윤리와 책임"** — 편향·프라이버시·저작권·규제(EU AI Act) + 편향된 과거 채용 데이터로 학습한 AI 가 실력 동등한 여성 지원자를 차별하는 시뮬레이션 실습
- **강의 10 "AI 에이전트 — 도구를 쓰는 AI"** — LLM+도구+루프+기억 / Function Calling / RAG / MCP / 실전 에이전트 투어 + ReAct 루프 직접 구현 실습
- 체인 연결: 07 → 08 → 09 → 10
- AI 강의 트랙 공식 완주 (01~10)

---

## [3.1.0] - 2026-04-14

### Added — AI 강의 강화 (실습 렌더러 + 트렌드 콘텐츠 2강)
- **`code` 섹션 렌더러** — AI 강의 본문에 Pyodide 기반 인라인 코드 실행기 삽입 가능
  - `src/components/course/InlineCodeRunner.tsx` 신규 (Monaco 에디터 + 실행/원본복귀/출력지우기)
  - Python 런타임 싱글톤 공유로 강의 전환 시 재로딩 없음
  - 에러 번역(translateError) 재사용
- **강의 02 "머신러닝 기초"** — 선형 회귀를 최소제곱법으로 **직접 실행** 하는 실습 섹션 추가
- **강의 06 "생성형 AI와 LLM의 원리"** — ChatGPT 작동 원리(다음 토큰 예측), 토큰화, Transformer, 환각 설명 + 바이그램 언어모델 직접 구현 실습
- **강의 07 "프롬프트 엔지니어링 실전"** — Master Protocol 6기둥(RCTFCE) + Before/After 리라이팅 + 프롬프트 품질 자동 점검기 실습 + 고급 기법(Few-shot, CoT, Persona, Self-Check)
- `course05` → `course06` → `course07` nextCourseId 체인 연결
- CoursesPage 안내 문구: "준비중" → "브라우저에서 바로 실행되는 Python 실습"

### Changed
- `CourseSection` 타입에 `code` / `codeLanguage` / `codeHint` 필드 추가

---

## [3.0.0] - 2026-04-14

> 🎉 **Multi-Language Milestone** — Python 단일 언어에서 **Python + JavaScript + SQL** 3개 언어 플랫폼으로 확장 완료.

### Added — SQL 입문 트랙 마무리 (3.0.0-5 4/4)
- 챕터 10 미니 프로젝트: Chinook 베스트셀러 분석 (6개 비즈니스 질문 + 종합 미션 2개)
- 4단 연쇄 JOIN, SELECT 내부 서브쿼리 비율 계산, \`ROW_NUMBER() OVER\`, \`strftime\`, \`HAVING\` 총동원
- SQL 입문 트랙 10챕터 공식 완주

### 🏆 v3.0.0 마일스톤 요약 (v2.1.0 → v3.0.0)
**인프라**
- \`LanguageRuntime\` 추상 인터페이스 — Python/JS/SQL 공통
- JavaScript 런타임 (Web Worker + console 캡처 + Python 호환 \`print()\`)
- SQL 런타임 (sql.js + Chinook DB + React 표 렌더러)
- 셰도잉 사전 경고, 런타임 재시작 버튼, 에러 박스 회복 안내

**콘텐츠**
- Python 입문 (기존)
- JavaScript 입문 11챕터 (~250셀, 22 미션, 44 퀴즈)
- SQL 입문 10챕터 (SELECT부터 윈도우·미니 프로젝트까지 완주 가능)

**UX**
- 코딩 실습 2단계 네비게이션 (언어 → 트랙)
- 한국어 IME 자동 페어 따옴표 중복 입력 수정
- 메인 화면 배지 정리

---

## [2.8.0] - 2026-04-14

### Added — SQL 입문 트랙 세 번째 묶음 (3.0.0-5 3/4)
- 챕터 7: \`GROUP BY\`, \`HAVING\`, 여러 컬럼 그룹화, SELECT 문 작성 순서 완성
- 챕터 8: \`INNER JOIN\` / \`LEFT JOIN\`, 테이블 별칭, 3개 이상 연쇄 JOIN, JOIN+집계
- 챕터 9: 서브쿼리 (WHERE/SELECT/FROM), \`ROW_NUMBER() OVER (PARTITION BY ...)\` 맛보기

---

## [2.7.0] - 2026-04-14

### Added — SQL 입문 트랙 두 번째 묶음 (3.0.0-5 2/4)
- 챕터 4: 컬럼 가공 — \`||\` 결합, UPPER/LOWER/LENGTH/SUBSTR/TRIM/REPLACE, ROUND/ABS, \`CASE WHEN\`
- 챕터 5: \`LIKE\` (\`%\`/\`_\`) + NULL 본질 + \`COALESCE\`
- 챕터 6: \`COUNT/SUM/AVG/MIN/MAX\` + 조건부 집계 + GROUP BY 미리보기

---

## [2.6.0] - 2026-04-14

### Added — SQL 입문 트랙 첫 묶음 (3.0.0-5 1/4)
- 코딩 실습에 SQL 카드 활성화
- 챕터 1: SELECT 기초, AS, 표현식 컬럼, Chinook DB 소개
- 챕터 2: WHERE, AND/OR/NOT, BETWEEN, IN, IS NULL
- 챕터 3: ORDER BY (ASC/DESC), 다중 컬럼 정렬, LIMIT/OFFSET 페이징

---

## [2.5.0] - 2026-04-14

### Added — SQL 런타임 (3.0.0-4)
- sql.js (SQLite WASM) 기반 SQL 런타임
- Web Worker 격리 실행 (\`public/sql-worker.js\`)
- Chinook 샘플 DB 자동 로드 (~1MB)
- SELECT 결과 React 표 렌더링 (sticky 헤더, NULL 표시, 100행 안전 제한)
- INSERT/UPDATE 등은 "N개 행 영향" 텍스트 출력
- \`OutputChunk\` 에 \`table\` 스트림 타입 추가

---

## [2.4.0] - 2026-04-14

### Added — JavaScript 입문 트랙 11챕터 완성 (3.0.0-3)
- 챕터 1~3: console.log, 변수, 데이터 타입, 연산자 (=== vs ==)
- 챕터 4~6: if/else/switch, for/while/break/continue, 배열 + map/filter/reduce
- 챕터 7~9: 객체, 함수 + 화살표 + 클로저, 문자열 메서드
- 챕터 10~11: try/catch/throw, To-Do 미니 프로젝트
- 총 ~250 셀, 22 미션, 44 퀴즈

### Changed
- 셰도잉 사전 경고 (Python) — 빌트인·다른 셀 정의와 충돌 시 노란 경고
- 헤더에 🔄 런타임 재시작 버튼 (회복 수단)
- 에러 박스에 회복 안내 (RecoveryHint) 통합
- 한글 IME 자동 페어 따옴표 중복 입력 수정 (\`autoClosingOvertype: "always"\`)
- LessonPage가 lesson.language에 맞는 런타임 자동 init

---

## [2.3.0] - 2026-04-14

### Added — JavaScript 런타임 (3.0.0-2)
- Web Worker 기반 JS 런타임 (\`public/javascript-worker.js\`)
- console.log/warn/error 캡처, Python 호환 \`print()\` 제공
- 마지막 표현식 값 자동 반환 (Jupyter 스타일)
- 풍부한 \`formatValue\` (Map/Set/Date/RegExp/순환 참조 안전)
- 셀 단위 스코프 격리

---

## [2.2.0] - 2026-04-14

### Added — 다중 언어 인프라 (3.0.0-1)
- \`LanguageRuntime\` 인터페이스 + 타입 시스템
- \`runtime/registry.ts\` — 언어별 런타임 레지스트리
- \`useLanguageRuntime(lang)\` 훅 — 언어 인식 상태 구독
- \`notebookStore.language\` 필드 + \`loadCells(cells, language)\`

### Changed
- \`pythonRunner\` 가 \`LanguageRuntime\` 명시 구현 (동작 무변경)
- \`runCell\` 이 registry 기반으로 작동
- \`usePyodideStatus\` 는 \`useLanguageRuntime("python")\` 의 deprecated alias
- Language 타입에서 ruby/go 제거, sql 추가
- 코딩 실습 페이지: Python/JavaScript/SQL 카드 (당시 JS·SQL은 coming-soon)

---

## [2.1.0] - 2026-04-13

도메인 전환, 모바일 대응, IDE 강화, 학습 활동 추적, 프로필 시스템을 한꺼번에 도입한 대규모 업데이트.

### Added — 신규 기능

**프로필 & 활동 추적 (D 라인)**
- 프로필 편집: 닉네임 + 아바타 이모지 (16개 프리셋 + 직접 입력 10자)
- 가입 시 DB Trigger로 자동 프로필 생성 (이메일 `@` 앞부분 + 🙂)
- 학습 시간 누적 추적 (30초 버퍼 + visibility pause + unload flush)
- 연속 학습일 (스트릭) 카운터 + 최장 스트릭 — 5분 체류 또는 1개 완료 기준
- 13주 GitHub 스타일 활동 히트맵
- 최근 활동 피드 (퀴즈 풀이 + 강의 수료, 상대 시간 표기)

**IDE 확장 (E 라인)**
- 파일 이름 변경 (✏ 버튼 + 더블클릭)
- 수정됨(dirty) 표시 — 탭/파일트리에 노란 점, 헤더에 프로젝트 저장 상태
- 프로젝트 ZIP 내보내기 (폴더 구조 보존)
- 프로젝트 ZIP 가져오기 (스마트 파싱: 공통 루트 strip, 텍스트 파일만, 시스템 노이즈 제외)
- 기본 프로젝트로 전체 초기화 버튼
- 파일/폴더 드래그 앤 드롭으로 폴더 간 이동

**도메인 & 약관 (F 라인)**
- 커스텀 도메인 `aigolab.co.kr` 전환
- 전역 푸터 (운영자 정보 + 정책 링크)
- 개인정보처리방침 페이지 (`/privacy`)
- 이용약관 페이지 (`/terms`)

### Changed — 기존 기능 개선

**반응형 (C 라인)**
- NavBar: 햄버거 메뉴 도입 (`md` 미만)
- 레슨 페이지 헤더: 모바일 오버플로 메뉴 (⋯)
- IDE: 사이드바 모바일 드로어 + 터치 드래그 리사이즈

**기타**
- NavBar에 이메일 대신 닉네임 + 아바타 표시 (데스크탑 + 모바일 드로어)
- 마이페이지 통계 카드 4개 → 6개 확장 (스트릭 / 학습 시간 추가)
- DefaultAvatar 컴포넌트로 아바타 렌더링 일원화 (이모지 우선, 이니셜 폴백)
- 프로젝트 자동 저장 로직: dirty 추적 기반으로 재구성

### Infrastructure

- 새 Supabase 테이블: `daily_activity` (학습 시간/완료 카운트), `profiles` (닉네임/아바타)
- 테이블 모두 RLS 적용 (본인 데이터만 쓰기, 프로필은 공개 조회)
- DB Trigger `handle_new_user` — 가입 시 자동 프로필 생성
- 기존 사용자 백필 1회 실행

---

## [2.0.0] - 2026-04-13

대규모 콘텐츠 추가 (Phase B) 및 인증·진도 동기화 인프라 완성 시점의 기준 릴리즈.

### Highlights

- 코딩 실습 26챕터 (입문/중급/데이터과학/ML 실습 4트랙)
- AI 강의 5개 + ML 프로젝트 5개
- 미션 52개, 퀴즈 116문제
- Supabase 인증 (이메일 + Google) + 진도 서버 동기화
- Playground, 멀티파일 IDE, 마이페이지 + 수료증
- SEO + Google Analytics (GA4)
- 라이트/다크 테마

### Note

이전 버전(`v1.x`)의 상세 변경 이력은 git 커밋 메시지에 기록되어 있습니다.

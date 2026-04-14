# Changelog

이 파일은 AIGoLab의 주요 변경 사항을 기록합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) 기준이며,
버전 번호는 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 따릅니다.

---

## [Unreleased]

(다음 릴리즈에 포함될 변경 사항을 여기에 누적합니다)

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

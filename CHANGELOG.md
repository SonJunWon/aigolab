# Changelog

이 파일은 AIGoLab의 주요 변경 사항을 기록합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) 기준이며,
버전 번호는 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 따릅니다.

---

## [Unreleased]

(다음 릴리즈에 포함될 변경 사항을 여기에 누적합니다)

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

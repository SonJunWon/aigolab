# AIGoLab v4 — AI 엔지니어링 트랙 ROADMAP

**작성일**: 2026-04-15
**상태**: 🟢 Phase 1 착수 준비 완료
**목표 버전**: v4.0.0 ~ v4.3.0 (순차 릴리즈)

---

## 🎯 미션

**"학생이 돈 한 푼 안 쓰고 현대 AI 앱 개발 전 과정을 손으로 배운다."**

- 학생 부담: **0원** (무료 티어 조합으로 100% 커버)
- 플랫폼 부담: **0원** (BYOK — 학생 브라우저에서 직접 LLM 호출)
- 실습 깊이: 단순 체험이 아니라 **Agent · Reasoning · RAG** 의 실제 제작

---

## 📚 전체 12강 구성

세 축 (Reasoning · Agent · Knowledge) 을 단계적으로 쌓고 종합 프로젝트로 마무리.

| 장 | 제목 | 주 모델 | 대체 | 핵심 도구 | Phase |
|---|---|---|---|---|---|
| **Ch01** | AI 가 브라우저에 산다 — 입문 훅 | 🌐 WebLLM (Llama 3.2 1B) | — | @mlc-ai/web-llm | **1** |
| **Ch02** | 프롬프트 엔지니어링 기초 | 🔷 Gemini 2.0 Flash | Groq Llama | @google/generative-ai | **1** |
| **Ch03** | 구조화 출력 (JSON Mode, Schema) | 🔷 Gemini | OpenRouter Llama 3.1 | zod, Gemini responseSchema | **2** |
| **Ch04** | Chain-of-Thought 와 Reasoning | ⚡ Groq Llama 3.3 70B | OpenRouter DeepSeek R1:free | groq-sdk | **2** |
| **Ch05** | Tool Calling 기초 | 🔷 Gemini | Groq | FunctionDeclarationSchema | **2** |
| **Ch06** | 단일 에이전트 — 이메일 초안 에이전트 | ⚡ Groq | Gemini | 플랫폼 통합 SDK | **3** |
| **Ch07** | 멀티 에이전트 협업 | 🔀 Gemini + Groq 혼용 | — | Swimlane 컴포넌트 | **3** |
| **Ch08** | 임베딩과 벡터 공간 (Ch11 PCA 재활용) | 🤗 Transformers.js | Cohere Embed | @xenova/transformers | **4** |
| **Ch09** | RAG 기초 — 청킹·검색·답변 | 🔷 Gemini + 로컬 임베딩 | — | hnswlib-wasm | **4** |
| **Ch10** | Hybrid RAG + Re-ranking | 🟢 Cohere Rerank | OpenRouter | cohere-ai | **4** |
| **Ch11** | LLM 생태계 비교 실습 | 🔀 전부 나란히 | — | 통합 SDK multiplex | **5** |
| **Ch12** | 종합 프로젝트 — 학원 전용 AI 튜터 | 🎓 학생 선택 | — | Supabase (Enterprise) | **5** |

### 챕터 배치 의도
- **Ch01~02 (Phase 1)**: 진입 장벽 제로. 키 없어도 WebLLM 으로 체험.
- **Ch03~05 (Phase 2)**: 텍스트 API 호출의 3대 패턴 (구조화·추론·툴).
- **Ch06~07 (Phase 3)**: 에이전트 축. 실제 "일하는 AI" 체험.
- **Ch08~10 (Phase 4)**: 지식 축. RAG 의 단계적 고도화.
- **Ch11~12 (Phase 5)**: 통합·종합. 종합 프로젝트로 마무리.

---

## 🧰 주 모델 2강 확정

### 🔷 Google Gemini 2.0 Flash
- **역할**: 텍스트 품질·한국어·멀티모달·Tool calling 의 기본값
- **무료 한도**: 일 1,500 req (Flash), 월 100만 토큰 수준
- **SDK**: `@google/generative-ai` (TypeScript, 브라우저 호환)
- **API 키 발급**: [ai.google.dev](https://ai.google.dev) → 1분

### ⚡ Groq
- **역할**: 속도 (500+ tok/s) — 에이전트·CoT 연쇄 호출의 즉각 피드백
- **무료 한도**: 일 14,400 req
- **모델**: Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B
- **SDK**: `groq-sdk`
- **API 키 발급**: [console.groq.com](https://console.groq.com) → 1분

이 두 개가 **전체 실습의 ~80% 를 커버**. 나머지는 비교 학습용.

---

## 🛡️ 다양성 전략 — "한 공급자에 종속되지 않는다"

각 챕터에 **주 모델 + 대체 모델** 을 지정. 통합 SDK 의 `task` 기반 라우팅으로 공급자가 바뀌어도 학생 코드는 변경 없음.

```ts
// 학생이 쓰는 코드 — provider 를 모름
import { chat } from "@aigolab/llm";
const r = await chat({ messages, task: "reasoning" });
```

```yaml
# 플랫폼 운영자가 관리 — routes.yaml
tasks:
  fast:        [groq/llama-3.3-70b, cerebras/llama-3.3-70b]
  reasoning:   [groq/llama-3.3-70b, openrouter/deepseek-r1:free]
  multimodal:  [gemini/gemini-2.0-flash]
  embedding:   [local/transformers-js, cohere/embed-v3]
  rerank:      [cohere/rerank-v3]
  offline:     [webllm/llama-3.2-3b]   # 최후의 보루
```

### 3단계 페일오버
1. 학생의 주 provider 키 → 무료 티어 호출
2. 할당량 소진/장애 시 대체 provider 자동 전환
3. 모든 외부 서비스 불가 시 **WebLLM (브라우저 내)** — 수업은 절대 멈추지 않음

---

## 💳 Subscription Tier 연동 (기존 tier.ts 재활용)

| Tier | 접근 범위 |
|---|---|
| **Free** | Ch01~02 전체 + 시뮬레이션 녹화본 재생 |
| **Pro (BYOK)** | 전 챕터 + 학생 키로 호출 + 저장·내보내기 |
| **Pro Plus** (신규) | 플랫폼 제공 토큰 월 N회 (키 없이 편히 실습) |
| **Enterprise** | Ch12 Supabase 연동 + 자체 RAG KB + 관리자 대시보드 |

v3.16.0 에 도입된 PRO 잠금 인프라 재사용 — 신규 tier 하나만 추가.

---

## 📦 Phase 분할 — 릴리즈 목표

### Phase 1 · **v4.0.0** (~1 주)
**기반 + 입문**: 통합 SDK 설계·구현, Ch01 (WebLLM), Ch02 (Gemini)
- 핵심 컴포넌트: LLM 어댑터 추상화, 키 관리 UI, 녹화/재생 기본
- 성공 지표: 사용자가 Gemini 키 넣고 Ch02 셀 하나 실행해 응답 받기

### Phase 2 · **v4.1.0** (~2 주)
**텍스트 패턴 3종**: Ch03 구조화 출력, Ch04 CoT, Ch05 Tool Calling
- 신규 컴포넌트: Thought Stream 셀, JSON Schema 비주얼 에디터
- 성공 지표: 학생이 CoT 로 reasoning 문제를 풀고 단계 개입 체험

### Phase 3 · **v4.2.0** (~2 주)
**에이전트 축**: Ch06 단일 에이전트, Ch07 멀티 에이전트
- 신규 컴포넌트: Agent Trace Viewer, Swimlane 다이어그램
- 16·17번째 AI 프로젝트 신설: "이메일 에이전트", "조사·집필·검토 삼각팀"
- 성공 지표: 학생이 자기 Tool 함수를 정의해 에이전트에 붙여 실행

### Phase 4 · **v4.3.0** (~2 주)
**지식 축**: Ch08 임베딩, Ch09 RAG 기초, Ch10 Hybrid
- 신규 컴포넌트: Embedding Space Viewer (Ch11 PCA 재활용), KB Studio, Citation Trail
- 18번째 AI 프로젝트: "내 PDF 에게 질문하기"
- 성공 지표: 학생이 자기 문서 5장 올려 RAG 챗봇 구축

### Phase 5 · **v4.4.0 ~ v4.5.0** (~2 주)
**통합·종합**: Ch11 생태계 비교, Ch12 종합 프로젝트
- Supabase 벡터 DB 연동 (Enterprise)
- 19번째 AI 프로젝트: "학원 전용 AI 튜터"
- 성공 지표: Enterprise 고객이 자체 KB 로 실제 운영 가능

---

## 🎓 학습자 성과 지표

**전체 트랙 완주 시 학생이 할 수 있어야 할 것**:
1. ✅ OpenAI / Gemini / Groq / Cohere API 자유롭게 호출
2. ✅ JSON Schema 로 구조화 출력 강제 · 파싱
3. ✅ Chain-of-Thought 로 복잡한 추론 문제 해결
4. ✅ Tool calling 으로 외부 함수 연동 에이전트 구축
5. ✅ 멀티 에이전트 협업 패턴 설계
6. ✅ 문서 → 청킹 → 임베딩 → 검색 → 답변 의 RAG 전체 구축
7. ✅ Hybrid 검색 + Rerank 로 RAG 품질 개선
8. ✅ 새 LLM 공급자 등장 시 **1시간 내 이주** 가능

---

## 🚨 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| 무료 티어 정책 변경 | 전 챕터 영향 | 통합 SDK 추상화 + routes.yaml 한 줄 교체 |
| WebLLM 모델 다운로드 실패 (느린 인터넷) | Ch01 이탈 | 시뮬레이션 모드로 자동 전환 |
| Gemini 지역 제한 | 일부 사용자 | Groq 를 대체 기본값으로 |
| API 키 노출 (학생 실수) | 보안 | localStorage 암호화 + 키 차단 가이드 |
| 한국어 품질 기대 미달 (Groq) | 학습 몰입 ↓ | Ch02 는 Gemini 고정, Groq 는 Ch04+ |
| Google/Groq 동시 장애 | 강의 중단 | WebLLM + 시뮬레이션 녹화본 페일오버 |
| 학생 API 비용 실수 발생 | 민원 | 무료 티어 외 호출 차단 옵션 기본값 ON |

---

## 📁 문서 구조

```
.planning/v4-ai-engineering/
├── ROADMAP.md                   # 이 문서 (전체 12강 개요)
├── v4.0/
│   └── PLAN.md                  # Phase 1 상세 설계
├── v4.1/                        # (Phase 2 시작 시 작성)
├── v4.2/
├── v4.3/
├── v4.4/
└── shared/
    ├── LLM_PROVIDERS.md         # 공급자 비교표 유지보수
    └── SIMULATION_FORMAT.md     # 녹화본 JSON 스키마
```

---

## ✅ Phase 1 착수 체크리스트

- [x] ROADMAP 작성
- [ ] Phase 1 PLAN.md 작성 (다음 단계)
- [ ] 통합 SDK 폴더 구조 설계
- [ ] Gemini / Groq SDK 브라우저 호환 확인
- [ ] WebLLM 초기 로딩 UX 설계
- [ ] API 키 암호화 저장 전략 확정
- [ ] 시뮬레이션 녹화 포맷 v1 정의

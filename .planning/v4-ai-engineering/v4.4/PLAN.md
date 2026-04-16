# Phase 3 — v4.4.0 상세 설계

**작성일**: 2026-04-16
**범위**: Ch06 단일 에이전트 · Ch07 멀티 에이전트 협업
**목표 릴리즈**: v4.4.0
**상태**: 📝 기획 단계
**참조**: [ROADMAP.md](../ROADMAP.md), [Phase 2 PLAN](../v4.3/PLAN.md)

---

## 🎯 Phase 3 목표 (Goal-Backward)

> **Ch06 스토리**: 학생이 "이메일 초안을 써줘" 라고 자연어 입력하면 → 에이전트가
> 스스로 **목적 파악 → 정보 수집 (tool) → 초안 작성 → 검토** 사이클을 돌며
> 완성된 이메일을 output 으로 줌. **AgentTraceViewer** 에 전체 사고·행동 로그가
> 단계별로 시각화.

> **Ch07 스토리**: **3명의 전문 에이전트** (조사자·집필자·검토자) 가 하나의 주제에 대해
> 순차적으로 작업을 넘기며 **최종 블로그 글** 을 완성. 각 에이전트의 턴이
> **Swimlane 다이어그램** 으로 실시간 표시.

핵심 메시지: **CoT(생각) + Tool(행동) + Schema(구조) = Agent**.
Phase 2 에서 배운 세 기법의 **조합** 이 에이전트의 전부라는 걸 체감시킨다.

---

## 📐 아키텍처 — Phase 2 재조합, 신규 최소화

Phase 3 에서 **SDK 자체는 거의 건드리지 않는다**. 대부분 **레슨 패턴 + UI 컴포넌트**.

### 신규 UI 컴포넌트 2개

```
src/components/notebook/
  ├── AgentTraceViewer.tsx   ← Ch06: 단일 에이전트 사고·행동 타임라인
  └── SwimlaneDiagram.tsx    ← Ch07: 멀티 에이전트 순차 턴 시각화
```

### SDK 확장 — 최소

- `chatWithTools` 의 `onStep` 결과를 UI 에 바인딩하는 **패턴** 만 레슨에서 가르침
- 멀티 에이전트는 **오케스트레이션 코드** 가 학생 코드에 있음 (프레임워크 주입 아님)
- 별도 "Agent SDK" 는 만들지 않음 — **레슨이 곧 패턴 설명**

---

## 🧩 Task Breakdown

### T1. AgentTraceViewer 컴포넌트

**목적**: `chatWithTools` 의 `onStep` 이벤트를 타임라인으로 시각화.

- 각 step 을 카드로 표시: `[🧠 생각] → [🔧 도구: getWeather] → [📨 결과: {...}]`
- 보라색 세로 타임라인 바 + 각 카드 좌측 점(dot)
- 스트리밍 중에는 마지막 카드에 pulse 애니메이션
- Props: `steps: Array<{type, content, timestamp}>` + `streaming: boolean`
- 레슨에서 직접 `<AgentTraceViewer>` 를 렌더하지 않음 — **LlmCodeCell 이 AgentTraceViewer 로 onStep 을 자동 렌더** 하는 방식은 후속. Ch06 에선 console.log 기반으로 먼저 보여주고, 하단에 시각화 보너스 제공.

실제로는 **OutputChunk 에 "agent-step" stream 타입** 을 추가하고 runCell 이 onStep 을 이 스트림으로 라우팅. CellOutput 에서 AgentTraceViewer 로 렌더.

### T2. SwimlaneDiagram 컴포넌트

**목적**: 멀티 에이전트의 턴별 작업을 수평 레인(lane) 으로 표시.

- 3~5개 레인 (각 에이전트 = 1 레인)
- 세로 타임라인, 가로 레인
- 각 턴: 에이전트 이름 + 요약 + 산출물 preview
- Props: `lanes: {name, color}[]`, `turns: {lane, summary, detail}[]`
- Ch07 에서 학생이 멀티 에이전트 결과를 이 포맷으로 가공해 출력하는 패턴

### T3. OutputChunk 확장 — "agent-step" stream 타입

기존 thought / progress 처럼 LLM 셀 결과에 에이전트 단계를 자동 표시:
```ts
stream: "agent-step"
agentStep?: {
  type: "think" | "tool-call" | "tool-result" | "answer";
  agentName?: string;
  content: string;
  meta?: Record<string, unknown>;
}
```

### T4. runCell 확장 — onStep → agentStep 배선

`chatWithTools` 의 `onStep` 을 OutputChunk "agent-step" 으로 notebookStore 에 전달.
학생 코드에서 `chatWithTools(..., { onStep })` 하면 자동으로 AgentTraceViewer 가 렌더.

### T5. Ch06 레슨 — "이메일 초안 에이전트"

**구성 (40분)**:
1. 📖 에이전트란 무엇인가 — think-act-observe 루프
2. 📖 Ch05 복기 — chatWithTools 가 이미 에이전트의 뼈대
3. 🤖 최소 에이전트 — 3 tool (검색, 계산, 메모장) + chatWithTools
4. 📖 에이전트 프롬프트 설계 — system 에 목표·제약·도구 사용 지침
5. 🤖 이메일 에이전트 — tool: getContacts, getSchedule, draftEmail + "내일 회의 참석자에게 안내 메일 써줘"
6. 📖 AgentTraceViewer 로 사고·행동 시각화
7. 🤖 동일 에이전트를 trace 시각화 포함해 실행
8. 📖 에이전트의 안전 — 도구 권한·승인·로그 감사
9. 🤖 미션: 학생이 자기 tool 3개 정의 + 에이전트 구현
10. 📝 퀴즈 5문항

### T6. Ch07 레슨 — "조사·집필·검토 삼각팀"

**구성 (50분)**:
1. 📖 왜 멀티 에이전트인가 — 한 에이전트의 한계 (전문성·context 폭발)
2. 📖 역할 분리 패턴: Router · Specialist · Critic
3. 🤖 2-에이전트 체인 — 조사자 → 집필자 (결과를 다음 에이전트 input 으로)
4. 📖 메시지 전달 프로토콜 — JSON 계약 (responseSchema 재활용)
5. 🤖 3-에이전트 파이프라인 — 조사자 → 집필자 → 검토자 (피드백 루프)
6. 📖 SwimlaneDiagram 으로 턴 시각화
7. 🤖 동일 파이프라인 + Swimlane 출력
8. 📖 멀티 에이전트 위험 — 연쇄 환각·비용 폭증·교착
9. 🤖 미션: 3-에이전트로 블로그 글 완성 (주제 자유)
10. 📝 퀴즈 5문항

### T7. tier/access — 변경 불요 (Ch06~07 자동 pro)

### T8. 빌드 검증 + v4.4.0 릴리즈

---

## 📦 의존성 — 신규 없음

Phase 2 에서 추가한 zod 외 새 패키지 불요. 모든 기능이 기존 SDK 조합.

---

## 📝 작업 순서

1. **T3** OutputChunk agent-step 타입 + store 액션 (30분)
2. **T1** AgentTraceViewer 컴포넌트 (1시간)
3. **T4** runCell onStep 배선 (30분)
4. **T5** Ch06 레슨 작성 (3시간)
5. **T2** SwimlaneDiagram 컴포넌트 (1시간)
6. **T6** Ch07 레슨 작성 (4시간)
7. **T8** 빌드 검증 + 릴리즈

**예상 총 공수**: 10~12 시간 (2~3 세션)

---

## ⚠️ 리스크

| 리스크 | 확률 | 영향 | 대응 |
|---|---|---|---|
| chatWithTools 가 3+ tool 조합에서 무한 루프 | 🟡 중 | 중 | maxIterations 기본 5 + 프롬프트에 명시적 종결 조건 |
| 멀티 에이전트 비용 (chat 여러 번) | 🟡 중 | 소 | Free tier 한도 내에서 가능하도록 max 반복 제한 |
| Swimlane 렌더가 LLM 셀 결과와 잘 안 맞음 | 🟡 중 | 소 | 첫 버전은 console.log 기반, 시각 컴포넌트는 보너스 |
| 학생이 에이전트 개념을 어려워함 | 🟢 낮 | 중 | Ch05 복기 + 최소 예시 → 점진 확장 |

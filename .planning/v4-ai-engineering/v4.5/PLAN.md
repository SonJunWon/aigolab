# Phase 4 — v4.5.0 상세 설계

**작성일**: 2026-04-16
**범위**: Ch08 임베딩 · Ch09 RAG 기초 · Ch10 Hybrid RAG
**목표 릴리즈**: v4.5.0
**상태**: 📝 기획 단계

---

## 🎯 Phase 4 목표

> **Ch08**: 학생이 "문장을 숫자 벡터로 바꿀 수 있다"를 체감. 브라우저 내 임베딩 모델(Transformers.js)로 유사도 검색.
> **Ch09**: 학생이 문서 5장을 올려 "청킹 → 임베딩 → 벡터 저장 → 질문 → 검색 → LLM 답변" RAG 전체 파이프라인 완성.
> **Ch10**: BM25 키워드 검색 + 벡터 검색 Hybrid, 결과 re-ranking 으로 RAG 품질 끌어올리기.

---

## 📐 아키텍처 신규 모듈

```
src/lib/llm/
  ├── embedding.ts        ← Transformers.js 래핑, embed(texts) → number[][]
  └── vectorStore.ts      ← 인메모리 벡터 스토어 (코사인 유사도)
```

### 의존성
- `@huggingface/transformers ^4.1.0` — 브라우저 내 임베딩 (ONNX Runtime WASM)
  - 모델: `Xenova/all-MiniLM-L6-v2` (22MB, 384차원, 다국어 지원)
  - 동적 import 로 Ch08 열 때만 로드
- `hnswlib-wasm` 은 Ch10 Hybrid 에서 선택적 사용 (기본은 인메모리 brute-force로 충분)

---

## 🧩 Task Breakdown

### T1. embedding.ts — 브라우저 내 임베딩

```ts
export async function embed(
  texts: string[],
  opts?: { model?: string; onProgress?: ProgressCallback }
): Promise<number[][]>
```
- 동적 `import("@huggingface/transformers")` → `pipeline("feature-extraction", model)`
- 싱글턴 파이프라인 캐시 (WebLLM 엔진과 같은 패턴)
- 첫 실행 시 모델 다운로드 (~22MB) → onProgress 로 진행률

### T2. vectorStore.ts — 인메모리 벡터 스토어

```ts
interface VectorDoc { id: string; text: string; embedding: number[]; meta?: Record<string, unknown> }

class VectorStore {
  add(docs: VectorDoc[]): void
  search(query: number[], topK?: number): Array<VectorDoc & { score: number }>
  size: number
}

function cosineSimilarity(a: number[], b: number[]): number
```
- Ch09 에서 학생이 직접 사용
- 순수 JS 구현 (brute-force cosine) — 문서 수백 건 수준에 충분
- Ch10 에서 hnswlib-wasm 옵션 소개 (수만 건 이상)

### T3. Runtime 주입 — embed + VectorStore

학생 코드에서 import 없이:
```ts
const vectors = await embed(["안녕하세요", "반갑습니다"]);
const store = new VectorStore();
```

### T4. Ch08 레슨 — "임베딩과 벡터 공간"

(35분) 텍스트 → 숫자 벡터 변환, 코사인 유사도, 시각화

### T5. Ch09 레슨 — "RAG 기초: 청킹·검색·답변"

(45분) 문서 청킹 → embed → VectorStore → 질문 embed → 검색 → LLM context 주입 → 답변

### T6. Ch10 레슨 — "Hybrid RAG + Re-ranking"

(40분) BM25 키워드 매칭 + 벡터 검색 결합 → LLM re-ranking → 최종 답변 품질 개선

### T7. 빌드 + 릴리즈

---

## 📝 작업 순서

1. npm install @huggingface/transformers
2. T1 embedding.ts + T2 vectorStore.ts
3. T3 Runtime 주입
4. T4 Ch08 레슨
5. T5 Ch09 레슨
6. T6 Ch10 레슨
7. T7 빌드 + v4.5.0

**예상 총 공수**: 8~10 시간 (2~3 세션)

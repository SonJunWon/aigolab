/**
 * 인메모리 벡터 스토어 — 문서 수백 건 수준에서 brute-force 코사인 검색.
 *
 * Ch09 RAG 에서 학생이 직접 사용. hnswlib-wasm 은 Ch10 에서 선택적 소개.
 */

import { cosineSimilarity } from "./embedding";

export interface VectorDoc {
  id: string;
  text: string;
  embedding: number[];
  meta?: Record<string, unknown>;
}

export interface SearchResult extends VectorDoc {
  score: number;
}

export class VectorStore {
  private docs: VectorDoc[] = [];

  /** 문서 추가 (임베딩이 이미 계산된 상태) */
  add(docs: VectorDoc[]): void {
    this.docs.push(...docs);
  }

  /** 쿼리 벡터로 가장 유사한 topK 문서 검색 */
  search(queryEmbedding: number[], topK = 3): SearchResult[] {
    const scored = this.docs.map((doc) => ({
      ...doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  /** 현재 저장된 문서 수 */
  get size(): number {
    return this.docs.length;
  }

  /** 전체 초기화 */
  clear(): void {
    this.docs = [];
  }
}

/**
 * 브라우저 내 임베딩 — Transformers.js (Hugging Face).
 *
 * 모델: `Xenova/all-MiniLM-L6-v2` (22MB, 384차원, 다국어).
 * 첫 호출 시 ONNX 모델 다운로드 → IndexedDB 캐시. 이후 수 초 내 준비.
 * 동적 import 로 Ch08 열 때만 번들 로드.
 */

import type { ProgressCallback } from "./types";

const DEFAULT_MODEL = "Xenova/all-MiniLM-L6-v2";

let pipelinePromise: Promise<(texts: string[]) => Promise<number[][]>> | null = null;

function getEmbeddingPipeline(
  model: string,
  onProgress?: ProgressCallback,
): Promise<(texts: string[]) => Promise<number[][]>> {
  if (pipelinePromise) return pipelinePromise;

  pipelinePromise = (async () => {
    onProgress?.({
      provider: "webllm", // 재사용 — 실제론 transformers.js
      phase: "downloading",
      progress: 0,
      message: `임베딩 모델 로드 중: ${model}`,
    });

    const { pipeline } = await import("@huggingface/transformers");
    const pipe = await pipeline("feature-extraction", model, {
      progress_callback: (info: { status: string; progress?: number }) => {
        const progress = typeof info.progress === "number" ? info.progress / 100 : 0;
        onProgress?.({
          provider: "webllm",
          phase: info.status === "done" ? "ready" : "downloading",
          progress: Math.min(1, progress),
          message: `${info.status}${info.progress ? ` ${Math.round(info.progress)}%` : ""}`,
        });
      },
    });

    onProgress?.({ provider: "webllm", phase: "ready", progress: 1, message: "임베딩 모델 준비 완료" });

    // 래핑: 텍스트 배열 → 임베딩 벡터 배열
    return async (texts: string[]): Promise<number[][]> => {
      const results: number[][] = [];
      for (const text of texts) {
        const output = await pipe(text, { pooling: "mean", normalize: true });
        // output 은 Tensor — .tolist() 로 JS 배열 변환
        const arr = (output as { tolist: () => number[][] }).tolist();
        results.push(arr[0]);
      }
      return results;
    };
  })();

  pipelinePromise.catch(() => {
    pipelinePromise = null; // 실패 시 재시도 가능
  });

  return pipelinePromise;
}

/**
 * 텍스트 배열 → 임베딩 벡터 배열.
 * 첫 호출 시 22MB 모델 다운로드 (캐시 후 재사용).
 */
export async function embed(
  texts: string[],
  opts?: { model?: string; onProgress?: ProgressCallback },
): Promise<number[][]> {
  const fn = await getEmbeddingPipeline(opts?.model ?? DEFAULT_MODEL, opts?.onProgress);
  return fn(texts);
}

/** 코사인 유사도 (0~1, 정규화된 벡터 기준 dot product) */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

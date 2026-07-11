/**
 * 강의 정리 — AI 정리 (기획 3-3).
 *
 * 구조화 출력(responseSchema)으로 고정 스키마 정리본 생성.
 * 긴 전사는 맵-리듀스: 구간별 압축 요약 → 전체 종합 (고급1 C4 컴팩션 패턴).
 * 정리 언어는 한국어 고정 (강의가 외국어여도 정리는 한국어 — 기획 미결정 2번 채택안).
 */

import { chat } from "../llm";
import type { LectureSummary } from "./types";

/** 이 길이(자)를 넘으면 맵-리듀스 경로 */
const DIRECT_LIMIT = 14_000;
/** 맵 단계 구간 크기(자) */
const MAP_CHUNK = 10_000;

const SUMMARY_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "강의 내용을 대표하는 한국어 제목" },
    oneLiner: { type: "string", description: "한 줄 요약" },
    keyConcepts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          explanation: { type: "string" },
          example: { type: "string" },
        },
        required: ["name", "explanation"],
      },
    },
    outline: {
      type: "array",
      description: "타임라인 목차 — 전사의 [m:ss] 타임스탬프를 time 에 인용",
      items: {
        type: "object",
        properties: {
          time: { type: "string" },
          heading: { type: "string" },
          summary: { type: "string" },
        },
        required: ["time", "heading", "summary"],
      },
    },
    terms: {
      type: "array",
      items: {
        type: "object",
        properties: { term: { type: "string" }, definition: { type: "string" } },
        required: ["term", "definition"],
      },
    },
    actionItems: { type: "array", items: { type: "string" } },
    quotes: { type: "array", items: { type: "string" } },
    myBookmarks: { type: "array", items: { type: "string" } },
  },
  required: ["title", "oneLiner", "keyConcepts", "outline", "terms", "actionItems", "quotes", "myBookmarks"],
};

const SYSTEM = `너는 강의 노트 정리 전문가다. 전사(음성→텍스트 변환) 원문으로 학습용 정리본을 만든다.
규칙:
- 정리는 반드시 한국어로 (강의가 외국어여도).
- 전사 오류로 보이는 고유명사·숫자는 그대로 두되 (추정) 표시를 붙인다.
- 내용을 지어내지 않는다. 전사에 없는 것은 쓰지 않는다.
- outline 의 time 은 전사에 있는 [m:ss] 타임스탬프를 인용한다.`;

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  return `${m}:${String(sec % 60).padStart(2, "0")}`;
}

/**
 * 라이브 구간 요약 — 녹음 중 5분 청크가 변환되는 즉시 2~4개 불릿으로.
 * 최종 정리(summarizeTranscript)와 별개의 가벼운 경로 (task: fast).
 */
export async function quickChunkSummary(chunkTranscript: string): Promise<string[]> {
  const res = await chat({
    task: "fast",
    messages: [
      {
        role: "system",
        content:
          "강의 전사 구간(약 5분)의 핵심을 한국어 불릿 2~4개로 요약하라. 개념 정의·숫자·이름은 보존. 잡담 제외. 내용이 거의 없으면 불릿 1개로 '(내용 없음/잡담 구간)'.",
      },
      { role: "user", content: chunkTranscript },
    ],
    responseSchema: {
      type: "object",
      properties: { bullets: { type: "array", items: { type: "string" } } },
      required: ["bullets"],
    },
  });
  const bullets = (res.json as { bullets?: string[] } | undefined)?.bullets;
  return Array.isArray(bullets) && bullets.length ? bullets : [(res.text ?? "").slice(0, 120)];
}

/** 맵 단계 — 구간을 정보 보존형 압축 요약 (인수인계 문서 스타일) */
async function mapChunk(text: string, idx: number, total: number): Promise<string> {
  const res = await chat({
    task: "fast",
    messages: [
      {
        role: "system",
        content:
          "전사 구간을 압축하라. 보존 필수: 핵심 주장, 개념 정의, 구체 숫자·이름, 예시, 타임스탬프. 잡담·반복 제거. 한국어로.",
      },
      { role: "user", content: `(구간 ${idx + 1}/${total})\n${text}` },
    ],
  });
  return res.text ?? "";
}

/**
 * 전사 → 구조화 정리본.
 * bookmarks(초 단위)가 있으면 해당 시점 주변 내용을 myBookmarks 로 강조.
 */
export async function summarizeTranscript(
  transcript: string,
  bookmarks: number[],
): Promise<LectureSummary> {
  // 맵-리듀스: 길면 구간 압축 먼저
  let material = transcript;
  if (transcript.length > DIRECT_LIMIT) {
    const chunks: string[] = [];
    for (let i = 0; i < transcript.length; i += MAP_CHUNK) {
      chunks.push(transcript.slice(i, i + MAP_CHUNK));
    }
    const mapped: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      mapped.push(await mapChunk(chunks[i], i, chunks.length));
    }
    material = mapped.join("\n\n");
  }

  const bookmarkLine = bookmarks.length
    ? `\n\n[수강자 북마크 시점] ${bookmarks.map(fmtTime).join(", ")} — 이 시점 주변 내용을 myBookmarks 에 각각 1줄로 요약하라.`
    : "\n\n[수강자 북마크 없음] myBookmarks 는 빈 배열로.";

  const res = await chat({
    task: "reasoning",
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: `다음 강의 전사를 정리본 스키마로 정리하라.${bookmarkLine}\n\n───\n${material}` },
    ],
    responseSchema: SUMMARY_SCHEMA,
  });

  const json = res.json as LectureSummary | undefined;
  if (!json || typeof json.title !== "string") {
    throw new Error("정리본 생성 실패 — 응답이 스키마와 다릅니다. 다시 시도해주세요.");
  }
  return json;
}

import type { Lesson, LessonSummary } from "../../../types/lesson";
// ── 01~12: 전부 일반 사용자 친화 버전으로 대체 ─────────────────────────
// 기존 코드 중심 강의(01-webllm-intro.ts … 12-capstone-project.ts)는 파일로
// 그대로 보존돼 있고(삭제 안 함), 향후 "개발자 심화" 트랙에서 재사용할 수 있다.
// 복원하려면 아래 friendly import 를 원래 코드판 import 로 되돌리면 된다.
// 친화 콘텐츠를 beginner 트랙의 기존 id·order 로 슬롯에 끼워, URL·진도·권한·
// 무료/PRO 게이팅(tier.ts)이 전부 그대로 유지된다.
import { lesson01 as fr01 } from "../friendly-preview/01-ai-in-browser";
import { lesson02 as fr02 } from "../friendly-preview/02-how-to-ask";
import { lesson03 as fr03 } from "../friendly-preview/03-structured-output";
import { lesson04 as fr04 } from "../friendly-preview/04-step-by-step";
import { lesson05 as fr05 } from "../friendly-preview/05-tools";
import { lesson06 as fr06 } from "../friendly-preview/06-single-agent";
import { lesson07 as fr07 } from "../friendly-preview/07-multi-agent";
import { lesson08 as fr08 } from "../friendly-preview/08-embeddings";
import { lesson09 as fr09 } from "../friendly-preview/09-rag-basics";
import { lesson10 as fr10 } from "../friendly-preview/10-hybrid-rag";
import { lesson11 as fr11 } from "../friendly-preview/11-llm-comparison";
import { lesson12 as fr12 } from "../friendly-preview/12-capstone";

/**
 * 친화 콘텐츠(친화-미리보기 트랙의 Lesson)를 beginner 트랙 슬롯으로 변환.
 * id·track·order 를 기존 코드판 값으로 덮어써 라우팅/진도/엔타이틀먼트를 보존한다.
 */
const asBeginner = (fr: Lesson, id: string, order: number): Lesson => ({
  ...fr,
  id,
  track: "beginner",
  order,
});

/**
 * AI 엔지니어링 트랙 (beginner) — 12강 전부 친화 버전.
 * 기존 코드 강의는 ./NN-*.ts 파일로 보존(향후 "개발자 심화" 트랙용).
 * 바이브코딩 워크샵은 workshops/index.ts 에서 별도 관리 → /ai-dev/workshop 라우트.
 */
export const LESSONS: Lesson[] = [
  asBeginner(fr01, "ai-eng-01-webllm-intro", 1),
  asBeginner(fr02, "ai-eng-02-gemini-prompting", 2),
  asBeginner(fr03, "ai-eng-03-structured-output", 3),
  asBeginner(fr04, "ai-eng-04-chain-of-thought", 4),
  asBeginner(fr05, "ai-eng-05-tool-calling", 5),
  asBeginner(fr06, "ai-eng-06-single-agent", 6),
  asBeginner(fr07, "ai-eng-07-multi-agent", 7),
  asBeginner(fr08, "ai-eng-08-embeddings", 8),
  asBeginner(fr09, "ai-eng-09-rag-basics", 9),
  asBeginner(fr10, "ai-eng-10-hybrid-rag", 10),
  asBeginner(fr11, "ai-eng-11-llm-comparison", 11),
  asBeginner(fr12, "ai-eng-12-capstone-project", 12),
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));

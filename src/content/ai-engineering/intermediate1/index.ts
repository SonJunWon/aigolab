import type { Lesson, LessonSummary } from "../../../types/lesson";
// ── 01~08: 전부 일반 사용자 친화 버전으로 대체 ─────────────────────────
// 기존 코드 중심 강의(01-knowledge-vs-twin.ts … 08-capstone-domain-twin.ts)는
// 파일로 그대로 보존돼 있고(삭제 안 함), 향후 "개발자 심화" 트랙에서 재사용 가능.
// 복원하려면 아래 friendly import 를 원래 코드판 import 로 되돌리면 된다.
// 친화 콘텐츠를 intermediate1 트랙의 기존 id·order 로 슬롯에 끼워, URL·진도·권한·
// PRO 게이팅(tier.ts)이 전부 그대로 유지된다.
import { lesson01 as fr01 } from "../friendly-intermediate1/01-knowledge-vs-twin";
import { lesson02 as fr02 } from "../friendly-intermediate1/02-context-engineering";
import { lesson03 as fr03 } from "../friendly-intermediate1/03-persistent-knowledge-base";
import { lesson04 as fr04 } from "../friendly-intermediate1/04-chunking-indexing";
import { lesson05 as fr05 } from "../friendly-intermediate1/05-advanced-retrieval-rerank";
import { lesson06 as fr06 } from "../friendly-intermediate1/06-accurate-citation";
import { lesson07 as fr07 } from "../friendly-intermediate1/07-multiturn-knowledge-update";
import { lesson08 as fr08 } from "../friendly-intermediate1/08-capstone-domain-twin";

/**
 * 친화 콘텐츠를 intermediate1 트랙 슬롯으로 변환.
 * id·track·order 를 기존 코드판 값으로 덮어써 라우팅/진도/엔타이틀먼트를 보존한다.
 */
const asIntermediate1 = (fr: Lesson, id: string, order: number): Lesson => ({
  ...fr,
  id,
  track: "intermediate1",
  order,
});

/**
 * AI 엔지니어링 — 중급1 "지식과 컨텍스트" 트랙. 8강 전부 친화 버전.
 * 척추 개념: 런타임 지식 트윈(학습된 뇌 ↔ 컨텍스트 트윈).
 * 기존 코드 강의는 ./NN-*.ts 파일로 보존(향후 "개발자 심화" 트랙용).
 */
export const LESSONS: Lesson[] = [
  asIntermediate1(fr01, "ai-eng-m1-01-knowledge-vs-twin", 1),
  asIntermediate1(fr02, "ai-eng-m1-02-context-engineering", 2),
  asIntermediate1(fr03, "ai-eng-m1-03-persistent-kb", 3),
  asIntermediate1(fr04, "ai-eng-m1-04-chunking-indexing", 4),
  asIntermediate1(fr05, "ai-eng-m1-05-advanced-retrieval-rerank", 5),
  asIntermediate1(fr06, "ai-eng-m1-06-accurate-citation", 6),
  asIntermediate1(fr07, "ai-eng-m1-07-multiturn-update", 7),
  asIntermediate1(fr08, "ai-eng-m1-08-capstone-domain-twin", 8),
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));

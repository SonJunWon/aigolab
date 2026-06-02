import type { Lesson, LessonSummary } from "../../../types/lesson";
// ── 01~07: 전부 일반 사용자 친화 버전으로 대체 ─────────────────────────
// 기존 코드 중심 강의(01-robust-agent.ts … 07-capstone-deployable-agent.ts)는
// 파일로 그대로 보존돼 있고(삭제 안 함), 향후 "개발자 심화" 트랙에서 재사용 가능.
// 복원하려면 아래 friendly import 를 원래 코드판 import 로 되돌리면 된다.
// 친화 콘텐츠를 intermediate2 트랙의 기존 id·order 로 슬롯에 끼워, URL·진도·권한·
// PRO 게이팅(tier.ts)이 전부 그대로 유지된다.
import { lesson01 as fr01 } from "../friendly-intermediate2/01-robust-agent";
import { lesson02 as fr02 } from "../friendly-intermediate2/02-orchestration";
import { lesson03 as fr03 } from "../friendly-intermediate2/03-memory-context";
import { lesson04 as fr04 } from "../friendly-intermediate2/04-real-tools-hitl";
import { lesson05 as fr05 } from "../friendly-intermediate2/05-evaluation-observability";
import { lesson06 as fr06 } from "../friendly-intermediate2/06-cost-speed-security";
import { lesson07 as fr07 } from "../friendly-intermediate2/07-capstone-deployable-agent";

/**
 * 친화 콘텐츠를 intermediate2 트랙 슬롯으로 변환.
 * id·track·order 를 기존 코드판 값으로 덮어써 라우팅/진도/엔타이틀먼트를 보존한다.
 */
const asIntermediate2 = (fr: Lesson, id: string, order: number): Lesson => ({
  ...fr,
  id,
  track: "intermediate2",
  order,
});

/**
 * AI 엔지니어링 — 중급2 "에이전틱" 트랙. 7강 전부 친화 버전.
 * 척추 개념: 지식 트윈(중급1)에 손발을 단다 — 도구·오케스트레이션·HITL·평가·운영.
 * 기존 코드 강의는 ./NN-*.ts 파일로 보존(향후 "개발자 심화" 트랙용).
 */
export const LESSONS: Lesson[] = [
  asIntermediate2(fr01, "ai-eng-m2-01-robust-agent", 1),
  asIntermediate2(fr02, "ai-eng-m2-02-orchestration", 2),
  asIntermediate2(fr03, "ai-eng-m2-03-memory-context", 3),
  asIntermediate2(fr04, "ai-eng-m2-04-real-tools-hitl", 4),
  asIntermediate2(fr05, "ai-eng-m2-05-evaluation-observability", 5),
  asIntermediate2(fr06, "ai-eng-m2-06-cost-speed-security", 6),
  asIntermediate2(fr07, "ai-eng-m2-07-capstone-deployable-agent", 7),
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));

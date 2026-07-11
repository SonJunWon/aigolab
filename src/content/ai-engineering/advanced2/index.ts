import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lessonA01 } from "./story/01-limit-of-one";
import { lessonA02 } from "./story/02-division-of-labor";
import { lessonA03 } from "./story/03-orchestration-zoo";
import { lessonA04 } from "./story/04-handoff-contract";
import { lessonA05 } from "./story/05-trust-and-verify";
import { lessonA06 } from "./story/06-failure-clinic";
import { lessonB01 } from "./handling/01-team-anatomy";
import { lessonB02 } from "./handling/02-job-description";
import { lessonB03 } from "./handling/03-pipeline-delegation";
import { lessonB04 } from "./handling/04-parallel-delegation";
import { lessonB05 } from "./handling/05-verification-team";
import { lessonB06 } from "./handling/06-team-automation";
import { lessonB07 } from "./handling/07-team-scorecard";
import { lessonB08 } from "./handling/08-capstone-manual";
import { lessonC01 } from "./building/01-spawn-revolution";
import { lessonC02 } from "./building/02-role-registry";
import { lessonC03 } from "./building/03-pipeline-fanout";
import { lessonC04 } from "./building/04-supervisor-loop";
import { lessonC05 } from "./building/05-output-contract";
import { lessonC06 } from "./building/06-trace-nervous-system";
import { lessonC07 } from "./building/07-review-company-design";
import { lessonC08 } from "./building/08-finder-verifier";
import { lessonC09 } from "./building/09-eval-budget-safety";
import { lessonC10 } from "./building/10-capstone-newsroom";

/**
 * AI 엔지니어링 — 고급2 "AI 에이전트 엔지니어링 ② 멀티에이전트 시스템".
 *
 * 척추 개념: "말 한 마리는 짐을 끌고, 마차단은 도시를 옮긴다" — 멀티에이전트 = 조직 설계.
 * 근본 동인은 컨텍스트 물리학(좁은 책상). 5대 설계 축(분업·역할·지휘·전달·신뢰)을
 * 3개 깊이로 확대해 가는 3중 시리즈 (고급1 하네스 엔지니어링의 후속):
 *   시리즈 A "팀의 탄생"    (story/,    A1~A6, 누구나·코드 0줄·무료)   ← 완성
 *   시리즈 B "팀 지휘하기"  (handling/, B1~B8, AI 활용 비개발자·PRO)   ← 완성 (위임·병렬·검증·자동화 운용)
 *   시리즈 C "팀 만들기"    (building/, C1~C10, 개발자·PRO,
 *                            C7~C10 = 실전 아크 '자동 코드리뷰 회사')  ← 완성 (agent-as-tool부터 뉴스룸 일반화까지)
 *
 * order 대역: A=1~6, B=11~18, C=21~30 (고급1과 동일한 시리즈 간 여유 슬롯).
 * 기획: AI앱개발/AI 엔지니어링 트랙/AI엔지니어링-고급2/01-고급2-멀티에이전트-커리큘럼.md
 */
export const LESSONS: Lesson[] = [
  lessonA01,
  lessonA02,
  lessonA03,
  lessonA04,
  lessonA05,
  lessonA06,
  lessonB01,
  lessonB02,
  lessonB03,
  lessonB04,
  lessonB05,
  lessonB06,
  lessonB07,
  lessonB08,
  lessonC01,
  lessonC02,
  lessonC03,
  lessonC04,
  lessonC05,
  lessonC06,
  lessonC07,
  lessonC08,
  lessonC09,
  lessonC10,
];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));

import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-what-is-mcp";
import { lesson02 } from "./02-expose-twin";
import { lesson03 } from "./03-consume-tools";
import { lesson04 } from "./04-notion";
import { lesson05 } from "./05-figma";
import { lesson06 } from "./06-gamma";
import { lesson07 } from "./07-slack";

/**
 * AI 엔지니어링 — MCP 특별강의 (가교 특강 3강 + 도구별 적용편).
 * 중급1(지식 트윈)을 표준(MCP)으로 외부와 연결해 중급2(에이전틱)로 잇는다.
 * 01~03: 개념·노출·소비 / 04~: 도구별 실전 적용편(직장인용 따라하기).
 *   04 노션(문서) · 05 피그마(디자인→코드) · 06 감마(리포트→발표) · 07 슬랙(협업·발행).
 * 친화 스타일(카드·비유·ai-try·퀴즈). 기획: AI앱개발/.../MCP-특별강의/.
 */
export const LESSONS: Lesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05, lesson06, lesson07];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));

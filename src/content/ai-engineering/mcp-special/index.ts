import type { Lesson, LessonSummary } from "../../../types/lesson";
import { lesson01 } from "./01-what-is-mcp";
import { lesson02 } from "./02-expose-twin";
import { lesson03 } from "./03-consume-tools";
import { lesson04 } from "./04-notion";
import { lesson05 } from "./05-figma";
import { lesson06 } from "./06-gamma";
import { lesson07 } from "./07-slack";
import { lesson08 } from "./08-telegram";
import { lesson09 } from "./09-github";
import { lesson10 } from "./10-gmail-calendar";
import { lesson11 } from "./11-supabase";
import { lesson12 } from "./12-vercel";
import { lesson13 } from "./13-sentry";
import { lesson14 } from "./14-stripe";
import { lesson15 } from "./15-playwright";
import { lesson16 } from "./16-obsidian";
import { lesson17 } from "./17-filesystem";
import { lesson18 } from "./18-linear";
import { lesson19 } from "./19-google-drive";
import { lesson20 } from "./20-atlassian";

/**
 * AI 엔지니어링 — MCP 특별강의 (가교 특강 3강 + 도구별 적용편).
 * 중급1(지식 트윈)을 표준(MCP)으로 외부와 연결해 중급2(에이전틱)로 잇는다.
 * 01~03: 개념·노출·소비 / 04~: 도구별 실전 적용편(직장인용 따라하기).
 *   04 노션(문서) · 05 피그마(디자인→코드) · 06 감마(리포트→발표) · 07 슬랙(협업·발행)
 *   · 08 텔레그램(알림·커뮤니티 MCP 고르는 법) · 09 깃허브(코드·PR·툴셋 스코핑)
 *   · 10 지메일+캘린더(메일·일정 비서·초안 중심 HITL) · 11 수파베이스(DB 조회·운영금지·읽기전용)
 *   · 12 버셀(배포·로그 진단·배포는 사람 승인) · 13 센트리(에러 진단·Seer 근본원인)
 *   · 14 스트라이프(결제·구독·금전은 테스트+제한키+HITL) · 15 플레이라이트(브라우저 자동화·QA·접근성트리)
 *   · 16 옵시디언(세컨드 브레인 트윈·백링크) · 17 파일시스템(로컬·MCP 첫 실습·경로 스코핑)
 *   · 18 리니어(액션→이슈·PM 출력) · 19 구글 드라이브(사내 문서 RAG 트윈)
 *   · 20 아틀라시안(Confluence 위키 트윈+Jira 이슈 출력·카탈로그 마무리).
 * 친화 스타일(카드·비유·ai-try·퀴즈). 기획: AI앱개발/.../MCP-특별강의/.
 */
export const LESSONS: Lesson[] = [lesson01, lesson02, lesson03, lesson04, lesson05, lesson06, lesson07, lesson08, lesson09, lesson10, lesson11, lesson12, lesson13, lesson14, lesson15, lesson16, lesson17, lesson18, lesson19, lesson20];

export const LESSON_SUMMARIES: LessonSummary[] = LESSONS.map((l) => ({
  id: l.id,
  order: l.order,
  title: l.title,
  subtitle: l.subtitle,
  estimatedMinutes: l.estimatedMinutes,
}));

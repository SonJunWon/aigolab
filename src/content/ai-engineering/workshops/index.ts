import type { Lesson, LessonSummary } from "../../../types/lesson";
import { workshopW00Windows } from "./w00-windows";
import { workshopW00Mac } from "./w00-mac";
import { workshopW01 } from "./w01-chatbot";
import { workshopW02 } from "./w02-doc-qa";
import { workshopW03 } from "./w03-translator";
import { workshopW04 } from "./w04-youtube-planner";
import { workshopW05 } from "./w05-subtitle-generator";
import { workshopW06 } from "./w06-image-analyzer";
import { workshopW07 } from "./w07-shortform-maker";
import { workshopW08 } from "./w08-blog-writer";
import { workshopW09 } from "./w09-sentiment-dashboard";
import { workshopW10 } from "./w10-email-assistant";
import { workshopW11 } from "./w11-flashcard-generator";
import { workshopW12 } from "./w12-ai-saas";
import { workshopW13 } from "./w13-blog-platform";
import { workshopW14 } from "./w14-team-memo";
import { workshopW15 } from "./w15-support-chatbot";
import { workshopW16 } from "./w16-deploy-master";
import { workshopW17 } from "./w17-portfolio-builder";
import { workshopW18 } from "./w18-todo-planner";
import { workshopW19 } from "./w19-code-reviewer";
import { workshopW20 } from "./w20-recipe-app";
import { workshopW21 } from "./w21-news-curator";
import { workshopW22 } from "./w22-travel-planner";
import { workshopW23 } from "./w23-interview-coach";
import { workshopW24 } from "./w24-dashboard-builder";
import { workshopW25 } from "./w25-marketplace";
import { workshopW26 } from "./w26-thumbnail-studio";
import { workshopW27 } from "./w27-podcast-maker";
import { workshopW28 } from "./w28-presentation-maker";
import { workshopW29 } from "./w29-social-media-manager";
import { workshopW30 } from "./w30-web-scraper";
import { workshopW31 } from "./w31-workflow-automation";
import { workshopW32 } from "./w32-multi-agent-debate";
import { workshopW33 } from "./w33-personal-assistant";
import { workshopW34 } from "./w34-contract-analyzer";
import { workshopW35 } from "./w35-finance-coach";
import { workshopW36 } from "./w36-course-platform";
import { workshopW37 } from "./w37-form-builder";
import { workshopW38 } from "./w38-nocode-builder";
import { workshopW39 } from "./w39-community-platform";
import { workshopW40 } from "./w40-startup-launchpad";

/**
 * 바이브코딩 워크샵 W00~W40 (총 42개 레슨).
 *
 * Phase 1 (W01~W06): 기초 — API 호출 + 결과 표시
 * Phase 2 (W07~W11): 실전 — 완성도 있는 단독 앱
 * Phase 3 (W12~W16): 풀스택 — DB + 인증 + 배포
 * Phase 4 (W17~W21): 통합 — 외부 서비스 연동
 * Phase 5 (W22~W26): 크리에이터 — 콘텐츠 제작 도구
 * Phase 6 (W27~W31): AI 에이전트 — 자동화 + 멀티에이전트
 * Phase 7 (W32~W36): 수익화 — 결제 연동 + 실무 도구
 * Phase 8 (W37~W40): 최종 종합 — 앱을 만드는 앱 → SaaS 런칭
 */
export const WORKSHOP_LESSONS: Lesson[] = [
  workshopW00Windows,
  workshopW00Mac,
  workshopW01,
  workshopW02,
  workshopW03,
  workshopW04,
  workshopW05,
  workshopW06,
  workshopW07,
  workshopW08,
  workshopW09,
  workshopW10,
  workshopW11,
  workshopW12,
  workshopW13,
  workshopW14,
  workshopW15,
  workshopW16,
  workshopW17,
  workshopW18,
  workshopW19,
  workshopW20,
  workshopW21,
  workshopW22,
  workshopW23,
  workshopW24,
  workshopW25,
  workshopW26,
  workshopW27,
  workshopW28,
  workshopW29,
  workshopW30,
  workshopW31,
  workshopW32,
  workshopW33,
  workshopW34,
  workshopW35,
  workshopW36,
  workshopW37,
  workshopW38,
  workshopW39,
  workshopW40,
];

export const WORKSHOP_SUMMARIES: LessonSummary[] = WORKSHOP_LESSONS.map(
  (l) => ({
    id: l.id,
    order: l.order,
    title: l.title,
    subtitle: l.subtitle,
    estimatedMinutes: l.estimatedMinutes,
  }),
);

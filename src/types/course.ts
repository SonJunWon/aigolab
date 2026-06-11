/**
 * AI 강의 코너 타입 정의.
 */

import type { Quiz } from "./quiz";
import type { Language } from "./lesson";

export type SectionType = "text" | "video" | "slide" | "link" | "code";

export interface CourseSection {
  /** 섹션 타입 */
  type: SectionType;
  /** 섹션 제목 (선택) */
  title?: string;
  /** 본문 — 마크다운(text) 또는 설명문(video/link/code 보조 설명) */
  content: string;
  /** 영상 URL (type="video" 시 YouTube URL) */
  videoUrl?: string;
  /** 이미지 URL 배열 (type="slide" 시) */
  images?: string[];
  /** 외부 링크 URL (type="link" 시) */
  linkUrl?: string;
  /** 외부 링크 설명 */
  linkLabel?: string;
  /** 실행할 초기 코드 (type="code" 시 필수) */
  code?: string;
  /** 코드 언어 (type="code" 시, 기본 python) */
  codeLanguage?: Language;
  /** 코드 블록 하단에 표시할 힌트 (선택) */
  codeHint?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  /** 강의 카테고리 */
  category: "ai-basics" | "ml" | "dl" | "data";
  /** 난이도 */
  level: "beginner" | "intermediate" | "advanced";
  /** 예상 시간 (분) */
  estimatedMinutes: number;
  /** 강의 순서 (로드맵 내) */
  order: number;
  /** 강의 섹션들 */
  sections: CourseSection[];
  /** 강의 끝 퀴즈 */
  quiz?: Quiz;
  /** 다음 추천 강의 ID */
  nextCourseId?: string;
}

export interface CourseSummary {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  category: Course["category"];
  level: Course["level"];
  estimatedMinutes: number;
  order: number;
}

/**
 * AI 강의 메뉴의 상위 묶음(코스 그룹).
 * /courses 는 그룹 카드 목록, /courses/group/:groupId 는 그룹 내 강의 목록.
 * - status "available": courseIds 의 강의들을 묶어 제공.
 * - status "coming-soon": 메뉴에만 노출(준비 중), courseIds 비어 있음.
 */
export interface CourseGroup {
  /** 그룹 슬러그 (예: "ai-overview", "deep-learning") */
  id: string;
  /** 메뉴 표시 순서 (0 = AI 살펴보기) */
  order: number;
  title: string;
  subtitle: string;
  icon: string;
  /** 카드 그라데이션 (tailwind from-…/to-…) */
  color: string;
  status: "available" | "coming-soon";
  /** 소속 강의 Course.id 목록 (available 그룹) */
  courseIds: string[];
  /** 카드에 표시할 키워드 태그 */
  tags: string[];
}

/**
 * AI 강의 코너 타입 정의.
 */

import type { Quiz } from "./quiz";

export type SectionType = "text" | "video" | "slide" | "link" | "code";

export interface CourseSection {
  /** 섹션 타입 */
  type: SectionType;
  /** 섹션 제목 (선택) */
  title?: string;
  /** 본문 — 텍스트(마크다운), 코드, 슬라이드 설명 등 */
  content: string;
  /** 영상 URL (type="video" 시 YouTube URL) */
  videoUrl?: string;
  /** 이미지 URL 배열 (type="slide" 시) */
  images?: string[];
  /** 외부 링크 URL (type="link" 시) */
  linkUrl?: string;
  /** 외부 링크 설명 */
  linkLabel?: string;
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

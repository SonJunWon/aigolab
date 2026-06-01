/**
 * 공통 마크다운 렌더링 컴포넌트.
 *
 * 한국어/CJK 전처리:
 *   CommonMark에서 **bold** 닫는 ** 뒤에 단어 문자가 공백 없이 붙으면 파싱 실패.
 *   → **의 위치를 쌍으로 파싱해서 닫는 ** 뒤에만 공백 삽입.
 *   (regex 기반은 여는/닫는 구분 불가로 깨지므로 토큰 기반 처리)
 */

import { useMemo } from "react";
import MarkdownIt from "markdown-it";
import { lookupGlossary } from "../content/ai-engineering/glossary";
import { sanitizeHtml } from "../lib/sanitizeHtml";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

const WORD_CHAR = /[가-힣a-zA-Z0-9]/;

/**
 * 한 줄 안에서 ** 위치를 찾아 쌍으로 처리.
 * 닫는 ** 바로 뒤에 단어 문자가 오면 공백 삽입.
 */
function preprocessLine(line: string): string {
  // ** 위치 찾기
  const positions: number[] = [];
  let i = 0;
  while (i < line.length - 1) {
    if (line[i] === "*" && line[i + 1] === "*" && (i + 2 >= line.length || line[i + 2] !== "*")) {
      // *** 이상은 건너뜀
      if (i === 0 || line[i - 1] !== "*") {
        positions.push(i);
      }
      i += 2;
    } else {
      i++;
    }
  }

  if (positions.length < 2) return line;

  // 뒤에서부터 처리 (인덱스 안 꼬이게)
  let result = line;
  for (let j = positions.length - 1; j >= 1; j -= 2) {
    // j = 닫는 ** 인덱스 (1, 3, 5...)
    const closePos = positions[j];
    const afterClose = closePos + 2;
    if (afterClose < result.length && WORD_CHAR.test(result[afterClose])) {
      result = result.slice(0, afterClose) + " " + result.slice(afterClose);
    }
  }

  return result;
}

function preprocess(text: string): string {
  return text
    .split("\n")
    .map((line) => preprocessLine(line))
    .join("\n");
}

interface Props {
  content: string;
  className?: string;
}

/**
 * ==용어== 패턴 → 용어 사전 툴팁 HTML 변환.
 * 호버 시 팝업으로 중학생 수준의 설명 표시.
 */
function injectGlossaryTooltips(html: string): string {
  return html.replace(/==([^=]+)==/g, (_, term: string) => {
    const entry = lookupGlossary(term.trim());
    if (!entry) return term; // 사전에 없으면 그냥 텍스트
    // HTML 속성에 안전하게 넣기 위해 이스케이프
    const desc = `${entry.ko} — ${entry.desc}`
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<span class="glossary-term" data-desc="${desc}" tabindex="0">${term.trim()}</span>`;
  });
}

/**
 * 친화 강의 카드 변환 — 특정 이모지로 시작하는 blockquote 를 카드 div 로 변환.
 * 예: `> 🃏 ...` → <div class="lesson-card lc-default">...</div>
 */
const CARD_MAP: Array<[string, string]> = [
  ["🎯", "lc-key"],   // 딱 하나만 기억하세요 (강조)
  ["🎬", "lc-case"],  // 샘플 사례
  ["🖼️", "lc-image"], // 이미지 제안 (점선)
  ["🤖", "lc-ai"],    // AI 입력 안내(셀로 대체되지만 잔존 시)
  ["📝", "lc-quiz"],  // 직접 답해보기
  ["🃏", "lc-default"],
];
function convertCards(html: string): string {
  return html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (whole, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/^\s+/, "");
    for (const [emoji, cls] of CARD_MAP) {
      if (text.startsWith(emoji)) {
        return `<div class="lesson-card ${cls}">${inner}</div>`;
      }
    }
    return whole; // 일반 인용문은 그대로
  });
}

export function Markdown({ content, className = "md-prose" }: Props) {
  const html = useMemo(() => {
    try {
      const rendered = md.render(preprocess(content));
      const withGlossary = injectGlossaryTooltips(rendered);
      const withCards = convertCards(withGlossary);
      return sanitizeHtml(withCards);
    } catch {
      // 렌더링 실패 시 원문도 sanitize 후 반환 (원문에 HTML 엔티티가 섞여있을 수 있음)
      return sanitizeHtml(content);
    }
  }, [content]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

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

export function Markdown({ content, className = "md-prose" }: Props) {
  const html = useMemo(() => {
    try {
      return md.render(preprocess(content));
    } catch {
      return content;
    }
  }, [content]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

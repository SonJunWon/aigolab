/**
 * 마크다운 렌더러 출력물을 `dangerouslySetInnerHTML` 에 넘기기 전에
 * 반드시 통과시켜야 하는 공용 sanitizer.
 *
 * 배경:
 *   마크다운 라이브러리(markdown-it / marked) 는 `html: true` 옵션 시
 *   raw HTML 을 그대로 통과시킨다. 사용자 입력(마크다운 워크스페이스,
 *   노트북 셀) 에 `<img src=x onerror=...>` 가 섞이면 같은 오리진에서
 *   스크립트가 실행되어 localStorage 의 암호화된 API 키를
 *   `decryptString()` 경유로 평문 추출할 수 있음.
 *
 * 정책:
 *   - DOMPurify 기본 프로필 (script / event handler / javascript: URL 제거)
 *   - `data-*` 속성은 허용 (글로서리 툴팁이 `data-desc` 사용)
 *   - `class`, `tabindex`, 기본 표준 속성 허용
 *   - `<a>` 에 `target="_blank"` 가 오면 자동으로 `rel="noopener noreferrer"` 추가
 */

import DOMPurify from "dompurify";

// target="_blank" 링크에 rel="noopener noreferrer" 강제 주입.
// DOMPurify 의 hook 은 setConfig 에 포함되지 않으므로 모듈 로드 시 1회 등록.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node instanceof Element && node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
});

/**
 * 마크다운 렌더러 출력 HTML 을 안전하게 정화한다.
 * 표준 마크다운 구조(br, p, a, img, pre, code, table, details 등) 는 유지.
 * 스크립트 / 이벤트 핸들러 / javascript: URL / 위험한 속성은 제거.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    // 글로서리 툴팁이 쓰는 data-* 속성 허용 (DOMPurify 기본값이지만 명시)
    ALLOW_DATA_ATTR: true,
    // 자체 종결 태그 정상 처리
    USE_PROFILES: { html: true },
  });
}

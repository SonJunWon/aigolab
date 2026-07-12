/**
 * 강의 노트 → PDF 저장.
 *
 * 방식: 숨김 iframe 에 인쇄 전용 HTML 문서를 만들고 print() 호출 →
 * 브라우저 인쇄 다이얼로그에서 'PDF로 저장'.
 *
 * jsPDF 등 라이브러리 대신 인쇄 렌더를 쓰는 이유:
 *   - 한글 폰트 임베드 불필요(브라우저가 시스템 폰트로 벡터 렌더 — 파일 작고 텍스트 선택 가능)
 *   - 페이지 분할·머리글을 CSS(@media print)로 제어
 *   - 외부 의존성 0
 */

import type { Lecture, LectureNote } from "./types";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const fmtDur = (sec: number) => {
  const m = Math.floor(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60}분` : `${m}분`;
};

const CSS = `
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif;
    color: #111; margin: 0; font-size: 11pt; line-height: 1.6;
  }
  h1 { font-size: 18pt; margin: 0 0 4pt; }
  .meta { color: #555; font-size: 9pt; margin-bottom: 14pt; }
  .oneliner { font-size: 12pt; font-weight: 600; padding: 8pt 10pt; background: #f4f4f4; border-left: 3pt solid #333; margin-bottom: 14pt; }
  h2 { font-size: 12pt; margin: 16pt 0 6pt; padding-bottom: 3pt; border-bottom: 1px solid #ccc; }
  .concept { border: 1px solid #ddd; padding: 6pt 8pt; margin-bottom: 6pt; break-inside: avoid; }
  .concept b { display: block; margin-bottom: 2pt; }
  .concept .ex { color: #555; font-size: 9.5pt; }
  ul, ol { margin: 4pt 0; padding-left: 16pt; }
  li { margin-bottom: 3pt; }
  .tl time { font-family: "SF Mono", Consolas, monospace; font-size: 9pt; color: #333; background: #eee; padding: 0 4pt; margin-right: 6pt; }
  blockquote { margin: 4pt 0; padding-left: 8pt; border-left: 2pt solid #bbb; color: #444; font-style: italic; }
  .transcript { page-break-before: always; }
  .transcript pre { white-space: pre-wrap; font-size: 8.5pt; line-height: 1.5; color: #333; font-family: inherit; }
  .footer { margin-top: 18pt; padding-top: 6pt; border-top: 1px solid #ccc; color: #888; font-size: 8pt; }
  section { break-inside: auto; }
`;

/** 노트 1건의 인쇄용 HTML 본문 생성 */
export function noteToPrintHtml(note: LectureNote, lecture?: Lecture | null): string {
  const s = note.summary;
  const metaParts = [
    lecture ? `강의: ${esc(lecture.title)}${lecture.speaker ? ` (${esc(lecture.speaker)})` : ""}` : null,
    note.sessionLabel ? `회차: ${esc(note.sessionLabel)}` : null,
    note.source ? `출처: ${esc(note.source)}` : null,
    `녹음: ${note.recordedAt.slice(0, 16).replace("T", " ")}`,
    `길이: ${fmtDur(note.durationSec)}`,
    note.tags.length ? `태그: ${note.tags.map((t) => `#${esc(t)}`).join(" ")}` : null,
  ].filter(Boolean);

  const sections: string[] = [
    `<h1>${esc(note.title)}</h1>`,
    `<div class="meta">${metaParts.join(" · ")}</div>`,
  ];

  if (s) {
    sections.push(`<div class="oneliner">💡 ${esc(s.oneLiner)}</div>`);
    if (s.keyConcepts.length) {
      sections.push(
        `<section><h2>핵심 개념</h2>${s.keyConcepts
          .map((c) => `<div class="concept"><b>${esc(c.name)}</b>${esc(c.explanation)}${c.example ? `<div class="ex">예: ${esc(c.example)}</div>` : ""}</div>`)
          .join("")}</section>`,
      );
    }
    if (s.outline.length) {
      sections.push(
        `<section><h2>타임라인</h2><ul class="tl">${s.outline
          .map((o) => `<li><time>${esc(o.time)}</time><b>${esc(o.heading)}</b> — ${esc(o.summary)}</li>`)
          .join("")}</ul></section>`,
      );
    }
    if (s.myBookmarks.length) {
      sections.push(`<section><h2>🔖 내 북마크</h2><ul>${s.myBookmarks.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></section>`);
    }
    if (s.terms.length) {
      sections.push(`<section><h2>용어</h2><ul>${s.terms.map((t) => `<li><b>${esc(t.term)}</b> — ${esc(t.definition)}</li>`).join("")}</ul></section>`);
    }
    if (s.actionItems.length) {
      sections.push(`<section><h2>액션 아이템</h2><ul>${s.actionItems.map((a) => `<li>☐ ${esc(a)}</li>`).join("")}</ul></section>`);
    }
    if (s.quotes.length) {
      sections.push(`<section><h2>인용</h2>${s.quotes.map((q) => `<blockquote>${esc(q)}</blockquote>`).join("")}</section>`);
    }
  } else {
    sections.push(`<p><i>AI 정리본 없음 — 원문 전사만 포함합니다.</i></p>`);
  }

  sections.push(
    `<section class="transcript"><h2>부록 — 원문 전사</h2><pre>${esc(note.transcript)}</pre></section>`,
    `<div class="footer">AIGoLab 강의 정리 · 개인 학습 목적 보관용 — 배포·게시 금지</div>`,
  );
  return sections.join("\n");
}

/**
 * 인쇄 다이얼로그 호출 — 숨김 iframe 방식 (팝업 차단 회피).
 * 브라우저 다이얼로그에서 '대상: PDF로 저장'을 선택하면 다운로드된다.
 * 제안 파일명은 문서 title 을 따른다 (Chrome 기준).
 */
export function printNoteAsPdf(note: LectureNote, lecture?: Lecture | null): void {
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<title>${esc(note.title)}</title><style>${CSS}</style></head>
<body>${noteToPrintHtml(note, lecture)}</body></html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(html);
  doc.close();

  const win = iframe.contentWindow!;
  const cleanup = () => setTimeout(() => iframe.remove(), 1000);
  win.onafterprint = cleanup;
  // 렌더 완료 후 인쇄 (이미지·폰트 없는 문서라 짧은 지연으로 충분)
  setTimeout(() => { win.focus(); win.print(); }, 150);
  // afterprint 미지원/미발화 대비 — 늦은 청소
  setTimeout(() => { if (document.body.contains(iframe)) iframe.remove(); }, 60_000);
}

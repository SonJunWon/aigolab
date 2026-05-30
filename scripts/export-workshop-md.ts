/**
 * 워크샵/레슨 본문을 로그인 없이 검토할 수 있게 .md 파일로 추출한다.
 *
 * 실행: npx tsx scripts/export-workshop-md.ts
 * 출력: ../content-review/<파일명>.md  (Obsidian 볼트 루트라 바로 열림)
 *
 * - 모든 셀(markdown/code/llm-code)의 source 를 순서대로 이어붙임.
 * - 본문에서 쓰인 ==용어== 를 모아 글로서리 정의(툴팁 내용)를 부록으로 첨부.
 * - 퀴즈도 함께 출력.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { workshopW00Windows } from "../src/content/ai-engineering/workshops/w00-windows";
import { workshopW00Mac } from "../src/content/ai-engineering/workshops/w00-mac";
import { GLOSSARY } from "../src/content/ai-engineering/glossary";
import type { Lesson } from "../src/types/lesson";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../../content-review");

function lessonToMarkdown(lesson: Lesson): string {
  const parts: string[] = [];
  parts.push(`> 🔎 이 문서는 **검토용 추출본** 입니다. 실제 레슨 화면과 동일한 본문이며,`);
  parts.push(`> \`==용어==\` 는 앱에서 보라색 점선 + 툴팁으로 표시됩니다(맨 아래 용어 사전 참고).`);
  parts.push(`>`);
  parts.push(`> - **레슨 ID**: \`${lesson.id}\`  ·  **제목**: ${lesson.title}`);
  parts.push(`> - **소요**: 약 ${lesson.estimatedMinutes}분  ·  셀 ${lesson.cells.length}개`);
  parts.push("\n---\n");

  lesson.cells.forEach((cell, i) => {
    if (cell.type === "markdown") {
      parts.push(cell.source);
    } else {
      const lang = cell.type === "llm-code" ? "(LLM 셀)" : "(코드 셀)";
      parts.push(`\n\`\`\`\n[셀 ${i + 1} ${lang}]\n${cell.source}\n\`\`\`\n`);
    }
    parts.push("\n");
  });

  // ── 퀴즈 ──
  if (lesson.quiz) {
    parts.push("\n---\n\n## 📝 퀴즈: " + lesson.quiz.title + "\n");
    lesson.quiz.questions.forEach((q, i) => {
      parts.push(`**Q${i + 1}. ${q.question}**\n`);
      if ("options" in q && Array.isArray(q.options)) {
        q.options.forEach((o: string, oi: number) => {
          const mark = "correctIndex" in q && q.correctIndex === oi ? " ✅" : "";
          parts.push(`- ${o}${mark}`);
        });
      }
      if ("explanation" in q && q.explanation) parts.push(`\n  > ${q.explanation}`);
      parts.push("");
    });
  }

  // ── 사용된 용어 사전 부록 ──
  const joined = lesson.cells.map((c) => c.source).join("\n");
  const used = new Set<string>();
  for (const m of joined.matchAll(/==([^=]+)==/g)) used.add(m[1].trim());
  if (used.size > 0) {
    parts.push("\n---\n\n## 📚 이 레슨에서 쓰인 용어 (툴팁 내용)\n");
    for (const term of Array.from(used).sort()) {
      const entry = GLOSSARY[term] ?? Object.values(GLOSSARY).find(
        (e) => e.ko.toLowerCase() === term.toLowerCase(),
      );
      if (entry) parts.push(`- **${term}** (${entry.ko}) — ${entry.desc}`);
      else parts.push(`- **${term}** — ⚠️ 글로서리 미등록(툴팁 안 뜸)`);
    }
  }

  return parts.join("\n");
}

mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  { lesson: workshopW00Windows, file: "W00-windows-내PC를-AI작업실로.md" },
  { lesson: workshopW00Mac, file: "W00-mac-내맥을-AI작업실로.md" },
];
for (const { lesson, file } of targets) {
  const md = `# ${lesson.title}\n\n_${lesson.subtitle}_\n\n` + lessonToMarkdown(lesson);
  const out = resolve(OUT_DIR, file);
  writeFileSync(out, md, "utf-8");
  console.log(`[export] ${file}  (${md.length.toLocaleString()} chars) → ${out}`);
}

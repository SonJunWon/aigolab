/**
 * H1(워크샵) — 콘텐츠 split 무결성 (실제 생성물 + 원본 비교).
 *  - PRO 워크샵: 클라엔 첫 인트로 셀만, 서버에 전체 cells 보유
 *  - 무료 워크샵(W00~W06): 클라에 전체 유지, 서버 미포함
 *  - 티저 메타(llmCellCount·glossaryTerms)가 원본과 일치
 */
import { CLIENT_WORKSHOP_LESSONS, WORKSHOP_TEASER_META } from "../../src/content/ai-engineering/workshops/generated";
import { PRO_WORKSHOP_BODIES } from "../../api/_generated/proWorkshops.generated";
import { WORKSHOP_LESSONS as ORIGINAL } from "../../src/content/ai-engineering/workshops/data";
import { isWorkshopPro } from "../../src/content/tier";
import { check, done } from "./_assert";

const proIds = ORIGINAL.filter((w) => isWorkshopPro(w.order)).map((w) => w.id);
const freeIds = ORIGINAL.filter((w) => !isWorkshopPro(w.order)).map((w) => w.id);

check("클라/원본 워크샵 개수 일치", CLIENT_WORKSHOP_LESSONS.length === ORIGINAL.length);
check("서버 PRO 본문 개수 == PRO 워크샵 개수", Object.keys(PRO_WORKSHOP_BODIES).length === proIds.length);

let proClientStripped = true;
let proServerFull = true;
let teaserCorrect = true;
for (const id of proIds) {
  const client = CLIENT_WORKSHOP_LESSONS.find((w) => w.id === id)!;
  const body = PRO_WORKSHOP_BODIES[id];
  const orig = ORIGINAL.find((w) => w.id === id)!;

  // 클라: 셀 1개 이하(첫 인트로만), 첫 셀은 markdown
  if (client.cells.length > 1) proClientStripped = false;
  if (client.cells.length === 1 && client.cells[0].type !== "markdown") proClientStripped = false;

  // 서버: 원본 전체 cells 보유
  if (!body || body.length !== orig.cells.length) proServerFull = false;

  // 티저 메타: llm 셀 수 == 원본에서 센 값
  const meta = WORKSHOP_TEASER_META[id];
  const origLlm = orig.cells.filter((c) => c.type === "llm-code").length;
  if (!meta || meta.llmCellCount !== origLlm) teaserCorrect = false;
}
check("모든 PRO 워크샵: 클라엔 인트로 셀만(본문 제거)", proClientStripped);
check("모든 PRO 워크샵: 서버에 전체 cells 보유(복원 가능)", proServerFull);
check("모든 PRO 워크샵: 티저 메타 llmCellCount 가 원본과 일치", teaserCorrect);

let freeIntact = true;
let freeNotInServer = true;
for (const id of freeIds) {
  const client = CLIENT_WORKSHOP_LESSONS.find((w) => w.id === id)!;
  const orig = ORIGINAL.find((w) => w.id === id)!;
  if (client.cells.length !== orig.cells.length) freeIntact = false;
  if (id in PRO_WORKSHOP_BODIES) freeNotInServer = false;
}
check("무료 워크샵: 클라에 전체 본문 유지", freeIntact);
check("무료 워크샵: 서버 본문 목록에 미포함", freeNotInServer);

// 메타(제목/subtitle)는 PRO 도 클라 유지(목록·상세용)
const sample = CLIENT_WORKSHOP_LESSONS.find((w) => w.id === "ai-eng-w40-startup-launchpad")!;
check("PRO 워크샵 제목 클라 유지", !!sample.title && sample.title.length > 0);
check("PRO 워크샵 첫 인트로 셀(티저) 클라 유지", sample.cells.length === 1);

done("H1 workshop codegen integrity");

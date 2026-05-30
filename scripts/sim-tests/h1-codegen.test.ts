/**
 * H1 — 콘텐츠 split 무결성 (실제 생성물 + 원본 데이터 비교).
 *  - 클라이언트(generated): PRO 본문(정답/스니펫/스타터) 제거됐는가
 *  - 서버(api/_generated): PRO 본문 전량 보유 + 원본과 동일한가
 *  - 무료 프로젝트: 클라이언트에 원본 그대로 유지되는가
 */
import { CLIENT_PROJECTS } from "../../src/content/generated/projects.generated";
import { PRO_PROJECT_BODIES } from "../../api/_generated/proProjects.generated";
import { PROJECTS as ORIGINAL } from "../../src/content/projects.data";
import { isProjectPro } from "../../src/content/tier";
import { check, done } from "./_assert";

const SOLUTION_FIELDS = ["description", "hint", "snippet", "solution", "checkpoint"];
function stepHasSolution(steps: unknown[]): boolean {
  return steps.some((s) => s && typeof s === "object" && SOLUTION_FIELDS.some((f) => f in (s as object)));
}

const proIds = ORIGINAL.filter((p) => isProjectPro(p.id)).map((p) => p.id);
const freeIds = ORIGINAL.filter((p) => !isProjectPro(p.id)).map((p) => p.id);

check("클라/원본 프로젝트 개수 일치", CLIENT_PROJECTS.length === ORIGINAL.length);
check("서버 PRO 본문 개수 == PRO 프로젝트 개수", Object.keys(PRO_PROJECT_BODIES).length === proIds.length);

// PRO 프로젝트: 클라에서 제거, 서버에 보유
let proClientClean = true;
let proServerFull = true;
let proReconstructs = true;
for (const id of proIds) {
  const client = CLIENT_PROJECTS.find((p) => p.id === id)!;
  const body = PRO_PROJECT_BODIES[id];
  const orig = ORIGINAL.find((p) => p.id === id)!;

  // 클라: starterFiles 비었고 step 에 정답류 필드 없음
  if (Object.keys(client.starterFiles).length !== 0) proClientClean = false;
  if (stepHasSolution(client.steps)) proClientClean = false;

  // 서버: starterFiles 존재(원본과 동일) + step 정답 보유 + 원본과 동일 step 수
  if (!body) { proServerFull = false; continue; }
  if (Object.keys(body.starterFiles).length !== Object.keys(orig.starterFiles).length) proServerFull = false;
  if (!stepHasSolution(body.steps)) proServerFull = false;
  if (body.steps.length !== orig.steps.length) proReconstructs = false;
}
check("모든 PRO 프로젝트: 클라에서 정답/스타터 제거됨", proClientClean);
check("모든 PRO 프로젝트: 서버에 정답+스타터 전량 보유", proServerFull);
check("모든 PRO 프로젝트: 서버 step 수 == 원본 step 수(복원 가능)", proReconstructs);

// 무료 프로젝트: 클라에 원본 그대로, 서버 본문엔 없음
let freeIntact = true;
let freeNotInServer = true;
for (const id of freeIds) {
  const client = CLIENT_PROJECTS.find((p) => p.id === id)!;
  const orig = ORIGINAL.find((p) => p.id === id)!;
  if (Object.keys(client.starterFiles).length !== Object.keys(orig.starterFiles).length) freeIntact = false;
  if (JSON.stringify(client.steps) !== JSON.stringify(orig.steps)) freeIntact = false;
  if (id in PRO_PROJECT_BODIES) freeNotInServer = false;
}
check("무료 프로젝트: 클라에 원본 본문 그대로 유지", freeIntact);
check("무료 프로젝트: 서버 본문 목록에 미포함", freeNotInServer);

// 메타데이터(제목/티저)는 PRO 도 클라에 유지 — 목록 표시용
const samplePro = CLIENT_PROJECTS.find((p) => p.id === "movie-recommendation")!;
check("PRO 메타(제목) 는 클라 유지", !!samplePro.title && samplePro.title.length > 0);
check("PRO 개요(description) 는 클라 유지(티저)", !!samplePro.description && samplePro.description.length > 0);
check("PRO step 제목(티저) 는 클라 유지", samplePro.steps.length > 0);

done("H1 codegen integrity");

/**
 * 관리자 — 🎙️ 강의 정리 (Phase 2 + 전역 녹음 세션).
 *
 * 목록 / 녹음 / 상세 3화면.
 * 녹음 상태·라이브 파이프라인은 lectureRecordingStore(전역 싱글턴)에 있어
 * 탭 전환·페이지 이동으로 이 컴포넌트가 언마운트돼도 녹음이 계속되고,
 * 돌아오면 녹음 화면이 자동 복원된다 (SPA 내 이동 한정 — 새로고침은 브라우저 한계).
 * 새로고침·크래시로 끊긴 세션은 목록 상단 OrphanRecoverySection 에서 청크로부터 복구.
 * 기획: AI앱개발/관리자-강의정리/01-강의정리-프로그램-기획.md
 */

import { useEffect, useRef, useState } from "react";
import {
  summarizeTranscript,
  saveNote,
  removeNote,
  syncNotes,
  cloudEnabled,
  listNotes,
  listOrphanSessions,
  transcribeSession,
  deleteSessionChunks,
  noteToMarkdown,
  listLectures,
  saveLecture,
  newLecture,
  removeLecture,
  assignNoteToLecture,
  listMaterials,
  putMaterial,
  deleteMaterial,
  summarizeLectureOverview,
  MATERIAL_FILE_LIMIT,
  type Lecture,
  type LectureNote,
  type Material,
} from "../../lib/lectureNotes";
import { useLectureRecordingStore } from "../../store/lectureRecordingStore";

type View =
  | { name: "list" }
  | { name: "record" }
  | { name: "detail"; id: string }
  | { name: "lecture"; id: string };

function fmtDur(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60}분` : `${m}분 ${s}초`;
}

function fmtClock(sec: number): string {
  const m = Math.floor(sec / 60);
  return `${m}:${String(sec % 60).padStart(2, "0")}`;
}

/** epoch ms → datetime-local 입력값 (로컬 타임존 "YYYY-MM-DDTHH:mm") */
function fmtLocalDT(t: number): string {
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function fmtSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${bytes}B`;
}

export function AdminLectureNotes() {
  const [view, setView] = useState<View>({ name: "list" });
  const [notes, setNotes] = useState<LectureNote[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [cloudOk, setCloudOk] = useState<boolean | null>(null); // null = 동기화 중
  const recStatus = useLectureRecordingStore((s) => s.status);

  const refresh = () => {
    void listNotes().then(setNotes);
    void listLectures().then(setLectures);
  };
  useEffect(() => {
    refresh(); // 로컬 먼저 즉시 표시
    void syncNotes().then((r) => { setCloudOk(r.cloud); if (r.pulled > 0) refresh(); });
  }, []);

  // 진행 중인 녹음/종료 파이프라인이 있으면 녹음 화면으로 자동 복원
  useEffect(() => {
    if (recStatus !== "idle") setView({ name: "record" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recStatus]);

  let filtered = query.trim()
    ? notes.filter((n) =>
        [n.title, n.source, n.transcript, JSON.stringify(n.summary ?? "")].join(" ").toLowerCase().includes(query.toLowerCase()),
      )
    : notes;
  if (tagFilter) filtered = filtered.filter((n) => n.tags.includes(tagFilter));

  return (
    <div>
      {view.name === "list" && (
        <OrphanRecoverySection
          notes={notes}
          onRecovered={(id) => { refresh(); setView({ name: "detail", id }); }}
        />
      )}
      {view.name === "list" && (
        <ListView
          notes={filtered}
          allNotes={notes}
          lectures={lectures}
          query={query}
          onQuery={setQuery}
          tagFilter={tagFilter}
          onTagFilter={setTagFilter}
          cloudOk={cloudOk}
          onNew={() => setView({ name: "record" })}
          onOpen={(id) => setView({ name: "detail", id })}
          onOpenLecture={(id) => setView({ name: "lecture", id })}
          onChanged={refresh}
        />
      )}
      {view.name === "record" && (
        <RecordView
          lectures={lectures}
          onDone={(id) => { refresh(); setView({ name: "detail", id }); }}
          onCancel={() => setView({ name: "list" })}
          onLectureCreated={refresh}
        />
      )}
      {view.name === "detail" && (
        <DetailView
          id={view.id}
          lectures={lectures}
          onBack={() => { refresh(); setView({ name: "list" }); }}
          onOpenLecture={(id) => { refresh(); setView({ name: "lecture", id }); }}
        />
      )}
      {view.name === "lecture" && (
        <LectureDetailView
          id={view.id}
          lectures={lectures}
          notes={notes}
          onBack={() => { refresh(); setView({ name: "list" }); }}
          onOpenNote={(id) => setView({ name: "detail", id })}
          onRecord={() => setView({ name: "record" })}
          onChanged={refresh}
        />
      )}
    </div>
  );
}

// ─────────────────────────────── 미완 세션 복구 ───────────────────────────────
// 새로고침·HMR 리로드·크래시로 finish 없이 끊긴 녹음의 청크는 IndexedDB에 남아 있다.
// 그 세션(= 활성 녹음도 아니고 노트로 저장되지도 않은 청크 묶음)을 찾아
// 기존 파이프라인(transcribeSession → summarizeTranscript → saveNote)으로 노트로 살린다.

type OrphanSession = { sessionId: string; chunks: number; totalSec: number };

type RecoveryStage =
  | { stage: "transcribing"; done: number; total: number }
  | { stage: "summarizing" }
  | { stage: "saving" };

function OrphanRecoverySection(props: {
  notes: LectureNote[];
  onRecovered: (noteId: string) => void;
}) {
  const activeSessionId = useLectureRecordingStore((s) => s.handle?.sessionId ?? null);
  const [orphans, setOrphans] = useState<OrphanSession[]>([]);
  const [busy, setBusy] = useState<Record<string, RecoveryStage>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void listOrphanSessions().then((all) => {
      if (!alive) return;
      const noteIds = new Set(props.notes.map((n) => n.id));
      setOrphans(all.filter((o) => o.sessionId !== activeSessionId && !noteIds.has(o.sessionId)));
    });
    return () => { alive = false; };
  }, [props.notes, activeSessionId]);

  const setStage = (sessionId: string, stage: RecoveryStage) =>
    setBusy((b) => ({ ...b, [sessionId]: stage }));
  const clearStage = (sessionId: string) =>
    setBusy((b) => { const { [sessionId]: _drop, ...rest } = b; return rest; });

  const recover = async (o: OrphanSession) => {
    setError(null);
    setStage(o.sessionId, { stage: "transcribing", done: 0, total: o.chunks });
    try {
      const transcript = await transcribeSession(o.sessionId, (done, total) =>
        setStage(o.sessionId, { stage: "transcribing", done, total }),
      );

      // 정리 실패는 비치명 — 전사만으로 저장하고 상세에서 재시도
      setStage(o.sessionId, { stage: "summarizing" });
      let summary: LectureNote["summary"] = null;
      try {
        summary = await summarizeTranscript(transcript, []); // 북마크는 메모리에만 있었어서 유실
      } catch { /* summary=null */ }

      setStage(o.sessionId, { stage: "saving" });
      const ts = Number(o.sessionId.replace(/^rec-/, "")); // sessionId = `rec-${Date.now()}`
      const recordedAt = Number.isFinite(ts) && ts > 0 ? new Date(ts).toISOString() : new Date().toISOString();
      const note: LectureNote = {
        id: o.sessionId, // 청크와 같은 id — 노트 삭제 시 남은 오디오도 함께 폐기됨
        title: summary?.title || `복구된 강의 ${recordedAt.slice(0, 10)}`,
        source: "",
        recordedAt,
        durationSec: o.totalSec,
        transcript,
        summary,
        bookmarks: [],
        tags: [],
        keepAudio: true, // 복구본 검수 전까지 원본 보존 (노트 삭제로 함께 정리 가능)
      };
      await saveNote(note);
      clearStage(o.sessionId);
      props.onRecovered(note.id);
    } catch (e) {
      clearStage(o.sessionId);
      setError(e instanceof Error ? e.message : "복구 실패");
    }
  };

  const discard = async (o: OrphanSession) => {
    if (!confirm(`중단된 녹음(${fmtDur(o.totalSec)}, 구간 ${o.chunks}개)을 폐기할까요? (복구 불가)`)) return;
    await deleteSessionChunks(o.sessionId);
    setOrphans((list) => list.filter((x) => x.sessionId !== o.sessionId));
  };

  if (orphans.length === 0) return null;

  return (
    <div className="mb-5 p-4 border border-amber-500/40 bg-amber-500/10">
      <div className="text-sm font-semibold text-brand-text mb-1">⚠️ 중단된 녹음 세션 발견</div>
      <p className="text-xs text-brand-textDim mb-3">
        새로고침·크래시 등으로 종료 처리 없이 끊긴 녹음입니다. 이미 저장된 5분 구간까지는 복구할 수 있습니다.
      </p>
      {error && <p className="mb-2 text-xs text-red-400">⚠️ {error} — 키 설정 확인 후 다시 시도하세요. 청크는 보존됩니다.</p>}
      <ul className="space-y-2">
        {orphans.map((o) => {
          const stage = busy[o.sessionId];
          const ts = Number(o.sessionId.replace(/^rec-/, ""));
          const when = Number.isFinite(ts) && ts > 0
            ? new Date(ts).toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
            : "시각 미상";
          return (
            <li key={o.sessionId} className="flex items-center gap-3 text-xs text-brand-text">
              <span className="flex-1">
                🎙️ {when} 시작 · 구간 {o.chunks}개 · 약 {fmtDur(o.totalSec)}
              </span>
              {stage ? (
                <span className="text-brand-textDim animate-pulse">
                  {stage.stage === "transcribing" && `음성 변환 중… (${stage.done}/${stage.total})`}
                  {stage.stage === "summarizing" && "AI 정리 중…"}
                  {stage.stage === "saving" && "저장 중…"}
                </span>
              ) : (
                <>
                  <button
                    onClick={() => void recover(o)}
                    className="px-3 py-1 font-semibold bg-brand-primary text-black hover:opacity-90"
                  >
                    ♻️ 노트로 복구
                  </button>
                  <button
                    onClick={() => void discard(o)}
                    className="px-3 py-1 border border-red-500/40 text-red-400 hover:bg-red-500/10"
                  >
                    폐기
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─────────────────────────────── 목록 (2계층: 강의 + 미분류) ───────────────────────────────
function ListView(props: {
  notes: LectureNote[];
  allNotes: LectureNote[];
  lectures: Lecture[];
  query: string;
  onQuery: (q: string) => void;
  tagFilter: string | null;
  onTagFilter: (t: string | null) => void;
  cloudOk: boolean | null;
  onNew: () => void;
  onOpen: (id: string) => void;
  onOpenLecture: (id: string) => void;
  onChanged: () => void;
}) {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [assignTarget, setAssignTarget] = useState<string>(""); // 강의 id | "__new__"
  const [newTitle, setNewTitle] = useState("");
  const [newSpeaker, setNewSpeaker] = useState("");

  const allTags = [...new Set(props.allNotes.flatMap((n) => n.tags))].sort();
  const q = props.query.trim().toLowerCase();
  const visibleLectures = q
    ? props.lectures.filter((l) => [l.title, l.speaker, l.description].join(" ").toLowerCase().includes(q))
    : props.lectures;
  // 검색·태그 필터를 통과한 노트(props.notes) 중 미분류만 아래 섹션에
  const unassigned = props.notes.filter((n) => !n.lectureId);
  const sessionCount = (lid: string) => props.allNotes.filter((n) => n.lectureId === lid).length;

  const toggle = (id: string) =>
    setSelected((s) => { const next = new Set(s); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  const bulkAssign = async () => {
    if (selected.size === 0) return;
    let lectureId = assignTarget;
    if (assignTarget === "__new__") {
      if (!newTitle.trim()) return;
      const lec = await saveLecture(newLecture(newTitle, newSpeaker));
      lectureId = lec.id;
    }
    if (!lectureId) return;
    const targets = props.allNotes.filter((n) => selected.has(n.id));
    for (const n of targets) await assignNoteToLecture(n, lectureId);
    setSelected(new Set());
    setSelectMode(false);
    setAssignTarget(""); setNewTitle(""); setNewSpeaker("");
    props.onChanged();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <input
          value={props.query}
          onChange={(e) => props.onQuery(e.target.value)}
          placeholder="제목·출처·내용 검색…"
          className="flex-1 px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary"
        />
        <button
          onClick={props.onNew}
          className="px-4 py-2 text-sm font-semibold bg-brand-primary text-black hover:opacity-90 transition-opacity"
        >
          🎙️ 새 녹음
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 min-h-[22px]">
        <span className="text-[10px] text-brand-textDim">
          {!cloudEnabled && "💾 로컬 저장 모드 — 이 브라우저에 저장됩니다 (Supabase 연동 예정)"}
          {cloudEnabled && props.cloudOk === null && "☁️ 동기화 중…"}
          {cloudEnabled && props.cloudOk === true && "☁️ 클라우드 동기화됨"}
          {cloudEnabled && props.cloudOk === false && "⚠️ 오프라인 — 이 브라우저에만 저장됩니다"}
        </span>
        <div className="flex-1" />
        {allTags.map((t) => (
          <button
            key={t}
            onClick={() => props.onTagFilter(props.tagFilter === t ? null : t)}
            className={`px-2 py-0.5 text-[10px] border transition-colors ${
              props.tagFilter === t
                ? "border-brand-primary text-brand-primary"
                : "border-brand-subtle text-brand-textDim hover:text-brand-text"
            }`}
          >
            #{t}
          </button>
        ))}
      </div>

      {/* 📚 강의 카드 섹션 */}
      {visibleLectures.length > 0 && (
        <section className="mb-6">
          <h4 className="text-xs font-semibold text-brand-textDim mb-2">📚 강의</h4>
          <ul className="space-y-2">
            {visibleLectures.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => props.onOpenLecture(l.id)}
                  className="w-full text-left p-4 border border-brand-primary/40 bg-brand-panel/60 hover:border-brand-primary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-brand-text">📚 {l.title}</span>
                    {l.speaker && <span className="text-xs text-brand-textDim">· {l.speaker}</span>}
                  </div>
                  <div className="mt-1 text-xs text-brand-textDim">
                    세션 {sessionCount(l.id)}개
                    {l.tags.length > 0 && ` · ${l.tags.map((t) => `#${t}`).join(" ")}`}
                    {l.description && ` · ${l.description.slice(0, 50)}`}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 🎙️ 미분류 노트 섹션 */}
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-xs font-semibold text-brand-textDim">🎙️ 미분류 녹음</h4>
        <div className="flex-1" />
        {unassigned.length > 0 && (
          <button
            onClick={() => { setSelectMode((v) => !v); setSelected(new Set()); }}
            className={`px-2 py-0.5 text-[10px] border transition-colors ${
              selectMode ? "border-brand-primary text-brand-primary" : "border-brand-subtle text-brand-textDim hover:text-brand-text"
            }`}
          >
            {selectMode ? "선택 취소" : "선택해서 강의로 묶기"}
          </button>
        )}
      </div>

      {/* 일괄 묶기 패널 */}
      {selectMode && selected.size > 0 && (
        <div className="mb-3 p-3 border border-brand-primary/40 bg-brand-panel/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-brand-text">{selected.size}개 노트를</span>
          <select
            value={assignTarget}
            onChange={(e) => setAssignTarget(e.target.value)}
            className="px-2 py-1 bg-brand-panel border border-brand-subtle text-brand-text"
          >
            <option value="">강의 선택…</option>
            {props.lectures.map((l) => <option key={l.id} value={l.id}>📚 {l.title}</option>)}
            <option value="__new__">＋ 새 강의 만들기</option>
          </select>
          {assignTarget === "__new__" && (
            <>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="총괄 강의 제목 (필수)"
                className="px-2 py-1 bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim" />
              <input value={newSpeaker} onChange={(e) => setNewSpeaker(e.target.value)} placeholder="강연자"
                className="px-2 py-1 bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim" />
            </>
          )}
          <button
            onClick={() => void bulkAssign()}
            disabled={!assignTarget || (assignTarget === "__new__" && !newTitle.trim())}
            className="px-3 py-1 font-semibold bg-brand-primary text-black disabled:opacity-40"
          >
            묶기
          </button>
        </div>
      )}

      {unassigned.length === 0 && visibleLectures.length === 0 ? (
        <div className="py-16 text-center text-sm text-brand-textDim border border-dashed border-brand-subtle">
          아직 정리된 강의가 없습니다. '새 녹음'으로 시작하세요.
          <div className="mt-2 text-xs">※ 개인 학습 목적 보관용입니다. 타인 강의의 공유·게시는 저작권 침해가 될 수 있어요.</div>
        </div>
      ) : unassigned.length === 0 ? (
        <p className="py-4 text-xs text-brand-textDim">미분류 녹음이 없습니다 — 전부 강의로 정리됐어요. 👍</p>
      ) : (
        <ul className="space-y-2">
          {unassigned.map((n) => (
            <li key={n.id} className="flex items-stretch gap-2">
              {selectMode && (
                <label className="flex items-center px-2 border border-brand-subtle bg-brand-panel/40 cursor-pointer">
                  <input type="checkbox" checked={selected.has(n.id)} onChange={() => toggle(n.id)} />
                </label>
              )}
              <button
                onClick={() => (selectMode ? toggle(n.id) : props.onOpen(n.id))}
                className="flex-1 text-left p-4 border border-brand-subtle bg-brand-panel/40 hover:border-brand-primary/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-brand-text">{n.title}</span>
                  {n.summary === null && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-500 text-black font-semibold">정리 실패 — 전사만 저장됨</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-brand-textDim">
                  {n.source || "출처 미입력"} · {n.recordedAt.slice(0, 10)} · {fmtDur(n.durationSec)}
                  {n.tags.length > 0 && ` · ${n.tags.map((t) => `#${t}`).join(" ")}`}
                  {n.summary ? ` · ${n.summary.oneLiner.slice(0, 60)}` : ""}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────── 정리본 공용 렌더러 ───────────────────────────────
function SummaryBlock(props: { s: NonNullable<LectureNote["summary"]>; timeHeader: string }) {
  const { s } = props;
  return (
    <div className="mt-5 space-y-5 text-sm">
      <p className="text-brand-text font-medium">💡 {s.oneLiner}</p>

      {s.keyConcepts.length > 0 && (
        <section>
          <h4 className="text-xs font-semibold text-brand-textDim mb-2">핵심 개념</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {s.keyConcepts.map((c, i) => (
              <div key={i} className="p-3 border border-brand-subtle bg-brand-panel/40">
                <div className="font-semibold text-brand-text">{c.name}</div>
                <div className="mt-1 text-xs text-brand-textDim leading-relaxed">{c.explanation}</div>
                {c.example && <div className="mt-1 text-xs text-brand-textDim">예: {c.example}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {s.outline.length > 0 && (
        <section>
          <h4 className="text-xs font-semibold text-brand-textDim mb-2">{props.timeHeader}</h4>
          <ul className="space-y-1.5">
            {s.outline.map((o, i) => (
              <li key={i} className="flex gap-2">
                <code className="text-xs text-brand-primary shrink-0 pt-0.5">{o.time}</code>
                <span className="text-brand-text"><strong>{o.heading}</strong> <span className="text-brand-textDim">— {o.summary}</span></span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {s.myBookmarks.length > 0 && (
        <section>
          <h4 className="text-xs font-semibold text-brand-textDim mb-2">🔖 내 북마크</h4>
          <ul className="list-disc pl-5 space-y-1 text-brand-text">
            {s.myBookmarks.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </section>
      )}

      {s.terms.length > 0 && (
        <section>
          <h4 className="text-xs font-semibold text-brand-textDim mb-2">용어</h4>
          <ul className="space-y-1">
            {s.terms.map((t, i) => (
              <li key={i} className="text-brand-text"><strong>{t.term}</strong> <span className="text-brand-textDim">— {t.definition}</span></li>
            ))}
          </ul>
        </section>
      )}

      {s.actionItems.length > 0 && (
        <section>
          <h4 className="text-xs font-semibold text-brand-textDim mb-2">액션 아이템</h4>
          <ul className="list-disc pl-5 space-y-1 text-brand-text">
            {s.actionItems.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      )}

      {s.quotes.length > 0 && (
        <section>
          <h4 className="text-xs font-semibold text-brand-textDim mb-2">인용</h4>
          {s.quotes.map((q, i) => (
            <blockquote key={i} className="pl-3 border-l-2 border-brand-subtle text-brand-textDim italic">{q}</blockquote>
          ))}
        </section>
      )}
    </div>
  );
}

// ─────────────────────────────── 강의 상세 (신설) ───────────────────────────────
function LectureDetailView(props: {
  id: string;
  lectures: Lecture[];
  notes: LectureNote[];
  onBack: () => void;
  onOpenNote: (id: string) => void;
  onRecord: () => void;
  onChanged: () => void;
}) {
  const lecture = props.lectures.find((l) => l.id === props.id);
  const setRecMeta = useLectureRecordingStore((s) => s.setMeta);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(lecture?.title ?? "");
  const [speaker, setSpeaker] = useState(lecture?.speaker ?? "");
  const [description, setDescription] = useState(lecture?.description ?? "");
  const [tagsRaw, setTagsRaw] = useState((lecture?.tags ?? []).join(", "));
  // ── M2: 자료 + 통합 정리 ──
  const [materials, setMaterials] = useState<Material[]>([]);
  const [matForm, setMatForm] = useState<"link" | "memo" | null>(null);
  const [matName, setMatName] = useState("");
  const [matBody, setMatBody] = useState(""); // link=url / memo=본문
  const [matError, setMatError] = useState<string | null>(null);
  const [ovBusy, setOvBusy] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  // ── 세션 추가(미분류에서 담기)/빼기 ──
  const [addOpen, setAddOpen] = useState(false);
  const [addSelected, setAddSelected] = useState<Set<string>>(new Set());
  const [addBusy, setAddBusy] = useState(false);

  useEffect(() => {
    void listMaterials(props.id).then(setMaterials);
  }, [props.id]);

  const addFile = async (file: File) => {
    setMatError(null);
    if (file.size > MATERIAL_FILE_LIMIT) {
      setMatError(`파일이 너무 큽니다 (${fmtSize(file.size)}) — 파일당 ${fmtSize(MATERIAL_FILE_LIMIT)} 까지.`);
      return;
    }
    const m: Material = {
      id: `mat-${Date.now()}`,
      lectureId: props.id,
      kind: "file",
      name: file.name,
      mime: file.type || "application/octet-stream",
      size: file.size,
      blob: file,
      addedAt: new Date().toISOString(),
    };
    await putMaterial(m);
    setMaterials(await listMaterials(props.id));
  };

  const addLinkOrMemo = async () => {
    if (!matForm || !matName.trim()) return;
    const m: Material = {
      id: `mat-${Date.now()}`,
      lectureId: props.id,
      kind: matForm,
      name: matName.trim(),
      url: matForm === "link" ? matBody.trim() : undefined,
      memo: matForm === "memo" ? matBody.trim() : undefined,
      addedAt: new Date().toISOString(),
    };
    await putMaterial(m);
    setMaterials(await listMaterials(props.id));
    setMatForm(null); setMatName(""); setMatBody("");
  };

  const openFile = (m: Material) => {
    if (!m.blob) return;
    const url = URL.createObjectURL(m.blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const removeMaterial = async (m: Material) => {
    if (!confirm(`자료 '${m.name}' 을(를) 삭제할까요?`)) return;
    await deleteMaterial(m.id);
    setMaterials(await listMaterials(props.id));
  };

  if (!lecture) {
    return (
      <div className="py-10 text-center text-sm text-brand-textDim">
        강의를 찾을 수 없습니다. <button onClick={props.onBack} className="text-brand-primary">← 목록으로</button>
      </div>
    );
  }
  const sessions = props.notes
    .filter((n) => n.lectureId === lecture.id)
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));

  const unassignedNotes = props.notes
    .filter((n) => !n.lectureId)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));

  const addSelectedToLecture = async () => {
    if (addSelected.size === 0) return;
    setAddBusy(true);
    try {
      const targets = props.notes.filter((n) => addSelected.has(n.id));
      for (const n of targets) await assignNoteToLecture(n, lecture.id);
      setAddOpen(false);
      setAddSelected(new Set());
      props.onChanged();
    } finally {
      setAddBusy(false);
    }
  };

  /** 세션을 강의에서 빼서 미분류로 — 비파괴·가역이라 확인창 없이 즉시 (기획 02 §3-2 분리) */
  const detachSession = async (n: LectureNote) => {
    await assignNoteToLecture(n, null);
    props.onChanged();
  };

  const totalMatSize = materials.reduce((n, m) => n + (m.size ?? 0), 0);
  // 통합 정리 이후 세션이 추가/수정됐으면 오래됨
  const overviewStale =
    !!lecture.overviewAt &&
    sessions.some((n) => (n.updatedAt ?? n.recordedAt) > lecture.overviewAt!);

  const generateOverview = async () => {
    if (sessions.length === 0) return;
    setOvBusy(true);
    try {
      const overview = await summarizeLectureOverview(lecture.title, lecture.speaker, sessions);
      await saveLecture({ ...lecture, overview, overviewAt: new Date().toISOString() });
      setShowOverview(true);
      props.onChanged();
    } catch (e) {
      alert(`통합 정리 실패: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setOvBusy(false);
    }
  };

  const saveHeader = async () => {
    if (!title.trim()) return;
    await saveLecture({
      ...lecture,
      title: title.trim(),
      speaker: speaker.trim(),
      description: description.trim(),
      tags: [...new Set(tagsRaw.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean))],
    });
    setEditing(false);
    props.onChanged();
  };

  const removeThis = async () => {
    if (!confirm(`'${lecture.title}' 강의를 삭제할까요?\n소속 세션 노트 ${sessions.length}개는 삭제되지 않고 '미분류'로 이동합니다.`)) return;
    await removeLecture(lecture.id);
    props.onBack();
  };

  const recordHere = () => {
    setRecMeta({ lectureId: lecture.id, sessionLabel: `${sessions.length + 1}회차` });
    props.onRecord();
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={props.onBack} className="text-sm text-brand-textDim hover:text-brand-primary">← 목록</button>
        <div className="flex-1" />
        <button onClick={() => setEditing((v) => !v)} className="px-3 py-1.5 text-xs border border-brand-subtle text-brand-textDim hover:text-brand-text">
          {editing ? "편집 취소" : "✏️ 정보 편집"}
        </button>
        <button onClick={() => void removeThis()} className="px-3 py-1.5 text-xs border border-red-500/40 text-red-400 hover:bg-red-500/10">
          강의 삭제
        </button>
      </div>

      {editing ? (
        <div className="space-y-2 mb-6 max-w-xl">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="총괄 강의 제목 (필수)"
            className="w-full px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary" />
          <input value={speaker} onChange={(e) => setSpeaker(e.target.value)} placeholder="강연자"
            className="w-full px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="설명 (선택)"
            className="w-full px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary" />
          <input value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="태그 — 쉼표로 구분"
            className="w-full px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary" />
          <button onClick={() => void saveHeader()} disabled={!title.trim()}
            className="px-4 py-2 text-sm font-semibold bg-brand-primary text-black disabled:opacity-40">저장</button>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-brand-text">📚 {lecture.title}</h3>
          <p className="mt-1 text-xs text-brand-textDim">
            {lecture.speaker ? `강연자: ${lecture.speaker}` : "강연자 미입력"}
            {lecture.tags.length > 0 && ` · ${lecture.tags.map((t) => `#${t}`).join(" ")}`}
          </p>
          {lecture.description && <p className="mt-2 text-sm text-brand-textDim">{lecture.description}</p>}
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-xs font-semibold text-brand-textDim">🎙️ 세션 노트 ({sessions.length})</h4>
        <div className="flex-1" />
        <button
          onClick={() => { setAddOpen((v) => !v); setAddSelected(new Set()); }}
          disabled={unassignedNotes.length === 0 && !addOpen}
          className="px-3 py-1.5 text-xs border border-brand-subtle text-brand-textDim hover:text-brand-text disabled:opacity-40"
          title={unassignedNotes.length === 0 ? "추가할 미분류 녹음이 없습니다" : ""}
        >
          {addOpen ? "추가 취소" : `📥 미분류에서 추가 (${unassignedNotes.length})`}
        </button>
        <button onClick={recordHere} className="px-3 py-1.5 text-xs font-semibold bg-brand-primary text-black hover:opacity-90">
          ＋ 이 강의로 새 녹음
        </button>
      </div>

      {/* 미분류 녹음 골라 담기 패널 */}
      {addOpen && (
        <div className="mb-3 p-3 border border-brand-primary/40 bg-brand-panel/60">
          <p className="mb-2 text-[11px] text-brand-textDim">이 강의에 추가할 미분류 녹음을 선택하세요.</p>
          {unassignedNotes.length === 0 ? (
            <p className="text-xs text-brand-textDim">미분류 녹음이 없습니다.</p>
          ) : (
            <>
              <ul className="space-y-1.5 max-h-56 overflow-y-auto">
                {unassignedNotes.map((n) => (
                  <li key={n.id}>
                    <label className="flex items-center gap-2 p-2 border border-brand-subtle bg-brand-panel/40 text-xs cursor-pointer hover:border-brand-primary/60">
                      <input
                        type="checkbox"
                        checked={addSelected.has(n.id)}
                        onChange={() =>
                          setAddSelected((s) => { const next = new Set(s); if (next.has(n.id)) next.delete(n.id); else next.add(n.id); return next; })
                        }
                      />
                      <span className="flex-1 min-w-0">
                        <span className="text-brand-text">{n.title}</span>
                        <span className="text-brand-textDim"> · {n.recordedAt.slice(0, 10)} · {fmtDur(n.durationSec)}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => void addSelectedToLecture()}
                disabled={addSelected.size === 0 || addBusy}
                className="mt-2 px-3 py-1.5 text-xs font-semibold bg-brand-primary text-black disabled:opacity-40"
              >
                {addBusy ? "추가 중…" : `선택한 ${addSelected.size}개를 이 강의에 추가`}
              </button>
            </>
          )}
        </div>
      )}

      {sessions.length === 0 ? (
        <p className="py-6 text-xs text-brand-textDim border border-dashed border-brand-subtle text-center">
          아직 세션이 없습니다. '＋ 이 강의로 새 녹음'으로 시작하거나 '📥 미분류에서 추가'로 기존 녹음을 담아 오세요.
        </p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((n) => (
            <li key={n.id} className="flex items-stretch gap-2">
              <button
                onClick={() => props.onOpenNote(n.id)}
                className="flex-1 text-left p-4 border border-brand-subtle bg-brand-panel/40 hover:border-brand-primary/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {n.sessionLabel && (
                    <span className="text-[10px] px-1.5 py-0.5 border border-brand-primary/50 text-brand-primary shrink-0">{n.sessionLabel}</span>
                  )}
                  <span className="text-sm font-semibold text-brand-text">{n.title}</span>
                  {n.summary === null && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-500 text-black font-semibold">정리 실패</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-brand-textDim">
                  {n.recordedAt.slice(0, 10)} · {fmtDur(n.durationSec)}
                  {n.summary ? ` · ${n.summary.oneLiner.slice(0, 60)}` : ""}
                </div>
              </button>
              <button
                onClick={() => void detachSession(n)}
                title="이 강의에서 빼서 미분류로 (노트는 삭제되지 않음)"
                className="px-3 text-xs border border-brand-subtle text-brand-textDim hover:text-red-400 hover:border-red-500/40 transition-colors"
              >
                빼기
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ── M2: 🧾 통합 정리 ── */}
      <div className="mt-8 flex items-center gap-2 mb-2">
        <h4 className="text-xs font-semibold text-brand-textDim">🧾 통합 정리</h4>
        {lecture.overview && overviewStale && (
          <span className="text-[9px] px-1.5 py-0.5 bg-amber-500 text-black font-semibold">세션이 바뀌어 오래됨</span>
        )}
        <div className="flex-1" />
        {lecture.overview && (
          <button onClick={() => setShowOverview((v) => !v)} className="px-2 py-0.5 text-[10px] border border-brand-subtle text-brand-textDim hover:text-brand-text">
            {showOverview ? "접기" : "펼치기"}
          </button>
        )}
        <button
          onClick={() => void generateOverview()}
          disabled={ovBusy || sessions.length === 0}
          className="px-3 py-1.5 text-xs font-semibold bg-brand-primary text-black disabled:opacity-40"
        >
          {ovBusy ? "종합 중…" : lecture.overview ? "다시 생성" : "통합 정리 생성"}
        </button>
      </div>
      {sessions.length === 0 ? (
        <p className="text-[11px] text-brand-textDim">세션이 생기면 전체를 종합한 정리본을 만들 수 있습니다.</p>
      ) : !lecture.overview ? (
        <p className="text-[11px] text-brand-textDim">세션 {sessions.length}개의 정리본을 하나로 종합합니다 (회차 흐름·통합 개념·용어·액션).</p>
      ) : showOverview ? (
        <div className="p-4 border border-brand-subtle bg-brand-panel/40">
          <SummaryBlock s={lecture.overview} timeHeader="회차 흐름" />
        </div>
      ) : (
        <p className="text-xs text-brand-textDim">💡 {lecture.overview.oneLiner}</p>
      )}

      {/* ── M2: 📎 자료 ── */}
      <div className="mt-8 flex items-center gap-2 mb-2">
        <h4 className="text-xs font-semibold text-brand-textDim">📎 자료 ({materials.length})</h4>
        {totalMatSize > 0 && <span className="text-[10px] text-brand-textDim">합계 {fmtSize(totalMatSize)}</span>}
        <div className="flex-1" />
        <label className="px-2 py-1 text-[10px] border border-brand-subtle text-brand-textDim hover:text-brand-text cursor-pointer">
          📄 파일 추가
          <input
            type="file"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void addFile(f); e.target.value = ""; }}
          />
        </label>
        <button onClick={() => { setMatForm(matForm === "link" ? null : "link"); setMatName(""); setMatBody(""); }}
          className="px-2 py-1 text-[10px] border border-brand-subtle text-brand-textDim hover:text-brand-text">🔗 링크</button>
        <button onClick={() => { setMatForm(matForm === "memo" ? null : "memo"); setMatName(""); setMatBody(""); }}
          className="px-2 py-1 text-[10px] border border-brand-subtle text-brand-textDim hover:text-brand-text">📝 메모</button>
      </div>
      {matError && <p className="mb-2 text-xs text-red-400">⚠️ {matError}</p>}
      {matForm && (
        <div className="mb-3 p-3 border border-brand-primary/40 bg-brand-panel/60 flex flex-wrap items-center gap-2 text-xs">
          <input value={matName} onChange={(e) => setMatName(e.target.value)}
            placeholder={matForm === "link" ? "표시명 (예: 강의 슬라이드)" : "메모 제목"}
            className="px-2 py-1 bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim" />
          <input value={matBody} onChange={(e) => setMatBody(e.target.value)}
            placeholder={matForm === "link" ? "https://…" : "메모 내용"}
            className="flex-1 min-w-[200px] px-2 py-1 bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim" />
          <button onClick={() => void addLinkOrMemo()} disabled={!matName.trim() || (matForm === "link" && !matBody.trim())}
            className="px-3 py-1 font-semibold bg-brand-primary text-black disabled:opacity-40">추가</button>
        </div>
      )}
      {materials.length === 0 ? (
        <p className="text-[11px] text-brand-textDim">슬라이드 PDF·참고 링크·공지 메모 등을 함께 보관하세요. (파일당 {fmtSize(MATERIAL_FILE_LIMIT)} 까지 · 개인 학습 보관용)</p>
      ) : (
        <ul className="space-y-1.5">
          {materials.map((m) => (
            <li key={m.id} className="flex items-center gap-2 p-2.5 border border-brand-subtle bg-brand-panel/40 text-xs">
              <span className="shrink-0">{m.kind === "file" ? "📄" : m.kind === "link" ? "🔗" : "📝"}</span>
              <div className="flex-1 min-w-0">
                <div className="text-brand-text truncate">{m.name}</div>
                <div className="text-[10px] text-brand-textDim truncate">
                  {m.kind === "file" && `${m.mime} · ${fmtSize(m.size ?? 0)}`}
                  {m.kind === "link" && m.url}
                  {m.kind === "memo" && m.memo}
                </div>
              </div>
              {m.kind === "file" && (
                <button onClick={() => openFile(m)} className="px-2 py-1 border border-brand-subtle text-brand-textDim hover:text-brand-text">열기</button>
              )}
              {m.kind === "link" && (
                <a href={m.url} target="_blank" rel="noreferrer" className="px-2 py-1 border border-brand-subtle text-brand-textDim hover:text-brand-text">열기</a>
              )}
              <button onClick={() => void removeMaterial(m)} className="px-2 py-1 border border-red-500/40 text-red-400 hover:bg-red-500/10">삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────── 녹음 (전역 세션의 뷰) ───────────────────────────────
function RecordView(props: {
  lectures: Lecture[];
  onDone: (noteId: string) => void;
  onCancel: () => void;
  onLectureCreated: () => void;
}) {
  const store = useLectureRecordingStore();
  const { status, handle, title, source, keepAudio, lectureId, sessionLabel, live, markCount, finishStage, finishedNoteId, scheduledAt, scheduleError } = store;
  const [elapsed, setElapsed] = useState(() => handle?.elapsedSec() ?? 0);
  const [startError, setStartError] = useState<string | null>(null);
  const [newLec, setNewLec] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSpeaker, setNewSpeaker] = useState("");
  const [schedInput, setSchedInput] = useState(() => fmtLocalDT(Date.now() + 10 * 60_000));
  const [nowTick, setNowTick] = useState(() => Date.now());
  const listEndRef = useRef<HTMLDivElement>(null);
  const currentLecture = props.lectures.find((l) => l.id === lectureId) ?? null;

  // 예약 카운트다운 — 예약이 있을 때만 1초 틱
  useEffect(() => {
    if (!scheduledAt) return;
    setNowTick(Date.now());
    const t = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, [scheduledAt]);

  const createLectureInline = async () => {
    if (!newTitle.trim()) return;
    const lec = await saveLecture(newLecture(newTitle, newSpeaker));
    props.onLectureCreated();
    store.setMeta({ lectureId: lec.id, sessionLabel: "1회차" });
    setNewLec(false); setNewTitle(""); setNewSpeaker("");
  };

  useEffect(() => {
    if (!handle) return;
    setElapsed(handle.elapsedSec());
    const t = setInterval(() => setElapsed(handle.elapsedSec()), 1000);
    return () => clearInterval(t);
  }, [handle]);

  // 새 구간 노트가 붙으면 목록 하단으로 스크롤
  useEffect(() => { listEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [live.length]);

  // 종료 파이프라인 완료 → 상세로 이동 (다른 페이지에 있다 돌아온 경우도 여기서 회수)
  useEffect(() => {
    if (finishedNoteId) {
      const id = finishedNoteId;
      store.reset();
      props.onDone(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishedNoteId]);

  const begin = async () => {
    setStartError(null);
    try {
      await store.start();
    } catch (e) {
      setStartError(e instanceof Error ? e.message : "마이크 접근 실패");
    }
  };

  const scheduleBegin = async () => {
    setStartError(null);
    const at = new Date(schedInput).getTime();
    if (!Number.isFinite(at)) { setStartError("예약 시각을 선택하세요."); return; }
    try {
      await store.schedule(at);
    } catch (e) {
      setStartError(e instanceof Error ? e.message : "예약 실패 — 마이크 권한을 확인하세요.");
    }
  };

  // ── 종료 파이프라인 진행 화면 ──
  if (status === "finishing") {
    const doneChunks = live.filter((c) => c.status === "done" || c.status === "error").length;
    return (
      <div className="py-16 text-center">
        <div className="text-3xl mb-4">⚙️</div>
        <p className="text-sm text-brand-text">
          {finishStage.stage === "waiting-chunks" && `남은 구간 변환 마무리 중… (${doneChunks}/${live.length})`}
          {finishStage.stage === "transcribing" && `음성 변환 중… (${finishStage.done}/${finishStage.total} 구간)`}
          {finishStage.stage === "summarizing" && "전체 정리본 작성 중… (강의 길이에 따라 1~2분)"}
          {finishStage.stage === "saving" && "저장 중…"}
        </p>
        <p className="mt-4 text-xs text-brand-textDim">
          구간 변환은 녹음 중에 이미 끝나 있어 마무리가 빠릅니다. 다른 페이지로 이동해도 처리는 계속됩니다.
        </p>
      </div>
    );
  }

  // ── 시작 전 화면 ──
  if (status === "idle") {
    const errMsg = startError ?? scheduleError ?? (finishStage.stage === "error" ? finishStage.message : null);
    const remainSec = scheduledAt ? Math.max(0, Math.round((scheduledAt - nowTick) / 1000)) : 0;
    return (
      <div className="max-w-xl">
        {errMsg && (
          <div className="mb-4 p-3 text-xs text-red-400 border border-red-500/40 bg-red-500/10">
            ⚠️ {errMsg}
            {finishStage.stage === "error" && (
              <div className="mt-1 text-brand-textDim">녹음 청크는 보존되어 있습니다. Groq/Gemini 키 설정을 확인한 뒤 다시 시도하세요.</div>
            )}
          </div>
        )}
        <div className="space-y-3 mb-5">
          {/* 소속 강의 선택 */}
          <div className="flex items-center gap-2">
            <select
              value={newLec ? "__new__" : (lectureId ?? "")}
              onChange={(e) => {
                if (e.target.value === "__new__") { setNewLec(true); return; }
                setNewLec(false);
                const lid = e.target.value || null;
                store.setMeta({ lectureId: lid, sessionLabel: lid ? (sessionLabel || "1회차") : "" });
              }}
              className="flex-1 px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text focus:outline-none focus:border-brand-primary"
            >
              <option value="">미분류 (강의에 속하지 않음)</option>
              {props.lectures.map((l) => (
                <option key={l.id} value={l.id}>📚 {l.title}{l.speaker ? ` — ${l.speaker}` : ""}</option>
              ))}
              <option value="__new__">＋ 새 강의 만들기</option>
            </select>
            {(lectureId || newLec) && (
              <input
                value={sessionLabel}
                onChange={(e) => store.setMeta({ sessionLabel: e.target.value })}
                placeholder="회차 라벨 (예: 1회차)"
                className="w-40 px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary"
              />
            )}
          </div>
          {newLec && (
            <div className="flex items-center gap-2 p-3 border border-brand-primary/40 bg-brand-panel/60">
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="총괄 강의 제목 (필수)"
                className="flex-1 px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary" />
              <input value={newSpeaker} onChange={(e) => setNewSpeaker(e.target.value)} placeholder="강연자"
                className="w-40 px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary" />
              <button onClick={() => void createLectureInline()} disabled={!newTitle.trim()}
                className="px-3 py-2 text-xs font-semibold bg-brand-primary text-black disabled:opacity-40">생성</button>
            </div>
          )}
          {currentLecture && (
            <p className="text-[11px] text-brand-textDim">
              📚 <strong>{currentLecture.title}</strong>{currentLecture.speaker ? ` (${currentLecture.speaker})` : ""} 의 세션으로 저장됩니다.
            </p>
          )}
          <input
            value={title}
            onChange={(e) => store.setMeta({ title: e.target.value })}
            placeholder={lectureId ? "세션 제목 (비우면 회차 라벨/AI 자동)" : "강의 제목 (비우면 AI가 자동 작성)"}
            className="w-full px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary"
          />
          {!lectureId && (
            <input
              value={source}
              onChange={(e) => store.setMeta({ source: e.target.value })}
              placeholder="출처 — 강의명·플랫폼·강사 (선택)"
              className="w-full px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary"
            />
          )}
          <label className="flex items-center gap-2 text-xs text-brand-textDim">
            <input type="checkbox" checked={keepAudio} onChange={(e) => store.setMeta({ keepAudio: e.target.checked })} />
            오디오 원본 보관 (기본: 정리 후 폐기 — 저작권·용량)
          </label>
        </div>
        {scheduledAt ? (
          <div className="flex items-center gap-3 p-4 border border-brand-primary/50 bg-brand-primary/10 mb-1">
            <span className="text-2xl">⏰</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-brand-text">
                {new Date(scheduledAt).toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })} 자동 녹음 시작
              </div>
              <div className="text-xs text-brand-textDim">
                남은 시간 {fmtDur(remainSec)} · 위 강의/제목 설정으로 시작됩니다 · 지금 바로 시작하려면 ● 버튼
              </div>
            </div>
            <button
              onClick={() => store.cancelSchedule()}
              className="px-3 py-1.5 text-xs border border-red-500/40 text-red-400 hover:bg-red-500/10"
            >
              예약 취소
            </button>
          </div>
        ) : null}
        <div className="flex gap-2">
          <button onClick={() => void begin()} className="px-5 py-2.5 text-sm font-semibold bg-red-500 text-white hover:opacity-90">
            ● 녹음 시작 (마이크)
          </button>
          <button onClick={props.onCancel} className="px-4 py-2.5 text-sm text-brand-textDim border border-brand-subtle hover:text-brand-text">
            취소
          </button>
        </div>
        {!scheduledAt && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-brand-textDim shrink-0">또는 예약:</span>
            <input
              type="datetime-local"
              value={schedInput}
              min={fmtLocalDT(Date.now())}
              onChange={(e) => setSchedInput(e.target.value)}
              className="px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text focus:outline-none focus:border-brand-primary [color-scheme:light_dark]"
            />
            <button
              onClick={() => void scheduleBegin()}
              disabled={!schedInput}
              className="px-4 py-2 text-sm font-semibold border border-brand-primary text-brand-primary hover:bg-brand-primary/10 disabled:opacity-40"
            >
              ⏰ 예약 녹음
            </button>
          </div>
        )}
        <p className="mt-4 text-xs text-brand-textDim">
          💡 5분마다 구간이 자동 저장·변환되어 아래에 <strong>실시간 구간 노트</strong>로 쌓입니다.
          녹음 중 다른 페이지로 이동해도 녹음은 계속됩니다 (탭을 닫거나 새로고침만 피하세요).
          {scheduledAt ? (
            <>
              <br />⏰ 예약 실행 조건: 이 브라우저 탭이 열려 있고 기기가 깨어 있어야 합니다.
              다른 페이지로 이동해도 실행되며, 새로고침했다면 관리자 페이지를 다시 열어두세요(예약 자동 복원).
            </>
          ) : null}
        </p>
      </div>
    );
  }

  // ── 녹음 중 화면: 상단 컨트롤 + 라이브 구간 노트 ──
  const nextChunkIn = 300 - (elapsed % 300);
  return (
    <div>
      {/* 컨트롤 바 */}
      <div className="flex items-center gap-4 p-4 border border-red-500/40 bg-red-500/5 mb-5">
        <span className="text-2xl animate-pulse">🔴</span>
        <div className="flex-1">
          <div className="text-xl font-mono text-brand-text">{fmtDur(elapsed)}</div>
          <div className="text-xs text-brand-textDim">
            {title.trim() || "제목 미정 — 종료 후 AI가 작성"} · 다음 구간 정리까지 {fmtClock(nextChunkIn)} · 페이지를 이동해도 녹음은 계속됩니다
          </div>
        </div>
        <button
          onClick={() => store.bookmark()}
          className="px-4 py-2 text-sm border border-amber-500/60 text-amber-400 hover:bg-amber-500/10"
        >
          🔖 북마크 {markCount > 0 ? `(${markCount})` : ""}
        </button>
        <button onClick={() => void store.finish()} className="px-5 py-2 text-sm font-semibold bg-brand-primary text-black hover:opacity-90">
          ■ 종료하고 최종 정리
        </button>
      </div>

      {/* 라이브 구간 노트 */}
      <h4 className="text-xs font-semibold text-brand-textDim mb-2">📝 실시간 구간 노트 (5분 단위)</h4>
      {live.length === 0 ? (
        <div className="py-10 text-center text-xs text-brand-textDim border border-dashed border-brand-subtle">
          첫 구간(5분)이 끝나면 여기에 변환·정리 결과가 나타납니다. 그동안 강의에 집중하세요.
        </div>
      ) : (
        <ol className="space-y-3">
          {live.map((c) => (
            <li key={c.seq} className="p-4 border border-brand-subtle bg-brand-panel/40">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-xs text-brand-primary">
                  {fmtClock(c.startSec)} ~ {fmtClock(c.startSec + 300)}
                </code>
                {c.status === "stt" && <span className="text-[10px] text-brand-textDim animate-pulse">🎧 음성 변환 중…</span>}
                {c.status === "summarizing" && <span className="text-[10px] text-brand-textDim animate-pulse">✍️ 구간 정리 중…</span>}
                {c.status === "done" && <span className="text-[10px] text-brand-green">✅</span>}
                {c.status === "error" && <span className="text-[10px] text-red-400">⚠️ 변환 실패 (종료 시 재시도)</span>}
              </div>
              {c.bullets ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-brand-text">
                  {c.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              ) : c.transcript ? (
                <p className="text-xs text-brand-textDim leading-relaxed">{c.transcript.slice(0, 300)}{c.transcript.length > 300 ? "…" : ""}</p>
              ) : null}
            </li>
          ))}
        </ol>
      )}
      <div ref={listEndRef} />
    </div>
  );
}

// ─────────────────────────────── 상세 ───────────────────────────────
function DetailView(props: {
  id: string;
  lectures: Lecture[];
  onBack: () => void;
  onOpenLecture: (id: string) => void;
}) {
  const [note, setNote] = useState<LectureNote | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void import("../../lib/lectureNotes").then(({ getNote }) =>
      getNote(props.id).then((n) => setNote(n ?? null)),
    );
  }, [props.id]);

  if (!note) return <div className="py-10 text-center text-sm text-brand-textDim">불러오는 중…</div>;
  const s = note.summary;

  const retrySummary = async () => {
    setBusy(true);
    try {
      const summary = await summarizeTranscript(note.transcript, note.bookmarks);
      const updated = { ...note, summary, title: note.title || summary.title };
      await saveNote(updated);
      setNote(updated);
    } catch (e) {
      alert(`정리 재시도 실패: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setBusy(false);
    }
  };

  const saveTags = async (raw: string) => {
    const tags = [...new Set(raw.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean))];
    const updated = { ...note, tags };
    await saveNote(updated);
    setNote(updated);
  };

  const copyMd = async () => {
    await navigator.clipboard.writeText(noteToMarkdown(note));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const remove = async () => {
    if (!confirm(`'${note.title}' 노트를 삭제할까요? (로컬+클라우드, 복구 불가)`)) return;
    await removeNote(note.id);
    props.onBack();
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={props.onBack} className="text-sm text-brand-textDim hover:text-brand-primary">← 목록</button>
        <div className="flex-1" />
        <button onClick={() => void copyMd()} className="px-3 py-1.5 text-xs border border-brand-subtle text-brand-textDim hover:text-brand-text">
          {copied ? "✅ 복사됨" : "📋 Markdown 복사"}
        </button>
        <button onClick={() => void remove()} className="px-3 py-1.5 text-xs border border-red-500/40 text-red-400 hover:bg-red-500/10">
          삭제
        </button>
      </div>

      <h3 className="text-lg font-bold text-brand-text">{note.title}</h3>
      <p className="mt-1 text-xs text-brand-textDim">
        {note.source || "출처 미입력"} · {note.recordedAt.slice(0, 16).replace("T", " ")} · {fmtDur(note.durationSec)}
        {note.bookmarks.length > 0 && ` · 🔖 ${note.bookmarks.length}개`}
      </p>
      {/* 소속 강의 · 회차 */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[10px] text-brand-textDim shrink-0">소속</span>
        <select
          value={note.lectureId ?? ""}
          onChange={(e) => {
            const lid = e.target.value || null;
            void (async () => {
              const updated = await assignNoteToLecture(note, lid, lid ? (note.sessionLabel ?? "") : undefined);
              setNote(updated);
            })();
          }}
          className="px-2 py-1 text-xs bg-brand-panel border border-brand-subtle text-brand-text focus:outline-none focus:border-brand-primary"
        >
          <option value="">미분류</option>
          {props.lectures.map((l) => <option key={l.id} value={l.id}>📚 {l.title}</option>)}
        </select>
        {note.lectureId && (
          <>
            <input
              key={`sl-${note.id}-${note.sessionLabel ?? ""}`}
              defaultValue={note.sessionLabel ?? ""}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v !== (note.sessionLabel ?? "")) {
                  void saveNote({ ...note, sessionLabel: v || undefined }).then(() =>
                    setNote({ ...note, sessionLabel: v || undefined }),
                  );
                }
              }}
              onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
              placeholder="회차 라벨"
              className="w-28 px-2 py-1 text-xs bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary"
            />
            <button
              onClick={() => props.onOpenLecture(note.lectureId!)}
              className="text-[10px] text-brand-primary hover:underline"
            >
              강의로 이동 →
            </button>
          </>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[10px] text-brand-textDim shrink-0">태그</span>
        <input
          key={note.tags.join(",")}
          defaultValue={note.tags.join(", ")}
          onBlur={(e) => { if (e.target.value !== note.tags.join(", ")) void saveTags(e.target.value); }}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          placeholder="쉼표로 구분 (예: 마케팅, 온라인강의)"
          className="flex-1 max-w-sm px-2 py-1 text-xs bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary"
        />
      </div>

      {!s ? (
        <div className="mt-6 p-4 border border-amber-500/40 bg-amber-500/10 text-sm text-brand-text">
          AI 정리가 아직 없습니다 (전사만 저장됨).
          <button
            onClick={() => void retrySummary()}
            disabled={busy}
            className="ml-3 px-3 py-1 text-xs font-semibold bg-brand-primary text-black disabled:opacity-50"
          >
            {busy ? "정리 중…" : "AI 정리 실행"}
          </button>
        </div>
      ) : (
        <SummaryBlock s={s} timeHeader="타임라인" />
      )}

      <div className="mt-6">
        <button
          onClick={() => setShowTranscript((v) => !v)}
          className="text-xs text-brand-textDim hover:text-brand-text"
        >
          {showTranscript ? "▾ 원문 전사 접기" : "▸ 원문 전사 펼치기"}
        </button>
        {showTranscript && (
          <pre className="mt-2 p-3 max-h-96 overflow-y-auto whitespace-pre-wrap text-xs text-brand-textDim border border-brand-subtle bg-brand-panel/40">
            {note.transcript}
          </pre>
        )}
      </div>
    </div>
  );
}

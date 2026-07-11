/**
 * 관리자 — 🎙️ 강의 정리 (Phase 2 + 전역 녹음 세션).
 *
 * 목록 / 녹음 / 상세 3화면.
 * 녹음 상태·라이브 파이프라인은 lectureRecordingStore(전역 싱글턴)에 있어
 * 탭 전환·페이지 이동으로 이 컴포넌트가 언마운트돼도 녹음이 계속되고,
 * 돌아오면 녹음 화면이 자동 복원된다 (SPA 내 이동 한정 — 새로고침은 브라우저 한계).
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
  noteToMarkdown,
  type LectureNote,
} from "../../lib/lectureNotes";
import { useLectureRecordingStore } from "../../store/lectureRecordingStore";

type View = { name: "list" } | { name: "record" } | { name: "detail"; id: string };

function fmtDur(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60}분` : `${m}분 ${s}초`;
}

function fmtClock(sec: number): string {
  const m = Math.floor(sec / 60);
  return `${m}:${String(sec % 60).padStart(2, "0")}`;
}

export function AdminLectureNotes() {
  const [view, setView] = useState<View>({ name: "list" });
  const [notes, setNotes] = useState<LectureNote[]>([]);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [cloudOk, setCloudOk] = useState<boolean | null>(null); // null = 동기화 중
  const recStatus = useLectureRecordingStore((s) => s.status);

  const refresh = () => { void listNotes().then(setNotes); };
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
        <ListView
          notes={filtered}
          allNotes={notes}
          query={query}
          onQuery={setQuery}
          tagFilter={tagFilter}
          onTagFilter={setTagFilter}
          cloudOk={cloudOk}
          onNew={() => setView({ name: "record" })}
          onOpen={(id) => setView({ name: "detail", id })}
        />
      )}
      {view.name === "record" && (
        <RecordView
          onDone={(id) => { refresh(); setView({ name: "detail", id }); }}
          onCancel={() => setView({ name: "list" })}
        />
      )}
      {view.name === "detail" && (
        <DetailView
          id={view.id}
          onBack={() => { refresh(); setView({ name: "list" }); }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────── 목록 ───────────────────────────────
function ListView(props: {
  notes: LectureNote[];
  allNotes: LectureNote[];
  query: string;
  onQuery: (q: string) => void;
  tagFilter: string | null;
  onTagFilter: (t: string | null) => void;
  cloudOk: boolean | null;
  onNew: () => void;
  onOpen: (id: string) => void;
}) {
  const allTags = [...new Set(props.allNotes.flatMap((n) => n.tags))].sort();
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
          🎙️ 새 강의
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

      {props.notes.length === 0 ? (
        <div className="py-16 text-center text-sm text-brand-textDim border border-dashed border-brand-subtle">
          아직 정리된 강의가 없습니다. '새 강의'로 첫 녹음을 시작하세요.
          <div className="mt-2 text-xs">※ 개인 학습 목적 보관용입니다. 타인 강의의 공유·게시는 저작권 침해가 될 수 있어요.</div>
        </div>
      ) : (
        <ul className="space-y-2">
          {props.notes.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => props.onOpen(n.id)}
                className="w-full text-left p-4 border border-brand-subtle bg-brand-panel/40 hover:border-brand-primary/60 transition-colors"
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

// ─────────────────────────────── 녹음 (전역 세션의 뷰) ───────────────────────────────
function RecordView(props: { onDone: (noteId: string) => void; onCancel: () => void }) {
  const store = useLectureRecordingStore();
  const { status, handle, title, source, keepAudio, live, markCount, finishStage, finishedNoteId } = store;
  const [elapsed, setElapsed] = useState(() => handle?.elapsedSec() ?? 0);
  const [startError, setStartError] = useState<string | null>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

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
    const errMsg = startError ?? (finishStage.stage === "error" ? finishStage.message : null);
    return (
      <div className="max-w-xl">
        {errMsg && (
          <div className="mb-4 p-3 text-xs text-red-400 border border-red-500/40 bg-red-500/10">
            ⚠️ {errMsg}
            <div className="mt-1 text-brand-textDim">녹음 청크는 보존되어 있습니다. Groq/Gemini 키 설정을 확인한 뒤 다시 시도하세요.</div>
          </div>
        )}
        <div className="space-y-3 mb-5">
          <input
            value={title}
            onChange={(e) => store.setMeta({ title: e.target.value })}
            placeholder="강의 제목 (비우면 AI가 자동 작성)"
            className="w-full px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary"
          />
          <input
            value={source}
            onChange={(e) => store.setMeta({ source: e.target.value })}
            placeholder="출처 — 강의명·플랫폼·강사 (선택)"
            className="w-full px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary"
          />
          <label className="flex items-center gap-2 text-xs text-brand-textDim">
            <input type="checkbox" checked={keepAudio} onChange={(e) => store.setMeta({ keepAudio: e.target.checked })} />
            오디오 원본 보관 (기본: 정리 후 폐기 — 저작권·용량)
          </label>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void begin()} className="px-5 py-2.5 text-sm font-semibold bg-red-500 text-white hover:opacity-90">
            ● 녹음 시작 (마이크)
          </button>
          <button onClick={props.onCancel} className="px-4 py-2.5 text-sm text-brand-textDim border border-brand-subtle hover:text-brand-text">
            취소
          </button>
        </div>
        <p className="mt-4 text-xs text-brand-textDim">
          💡 5분마다 구간이 자동 저장·변환되어 아래에 <strong>실시간 구간 노트</strong>로 쌓입니다.
          녹음 중 다른 페이지로 이동해도 녹음은 계속됩니다 (탭을 닫거나 새로고침만 피하세요).
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
function DetailView(props: { id: string; onBack: () => void }) {
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
              <h4 className="text-xs font-semibold text-brand-textDim mb-2">타임라인</h4>
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

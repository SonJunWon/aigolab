/**
 * 관리자 — 🎙️ 강의 정리 (Phase 1 MVP).
 *
 * 목록 / 녹음 / 상세 3화면. 파이프라인: 녹음 → Groq Whisper STT → chat() 정리 → IndexedDB 저장.
 * 오디오 원본은 정리 성공 시 기본 폐기('원본 보관' 체크 시 유지).
 * 기획: AI앱개발/관리자-강의정리/01-강의정리-프로그램-기획.md
 */

import { useEffect, useRef, useState } from "react";
import {
  startRecording,
  transcribeSession,
  summarizeTranscript,
  putNote,
  listNotes,
  deleteNote,
  deleteSessionChunks,
  noteToMarkdown,
  type RecorderHandle,
  type LectureNote,
  type PipelineStage,
} from "../../lib/lectureNotes";

type View = { name: "list" } | { name: "record" } | { name: "detail"; id: string };

function fmtDur(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60}분` : `${m}분 ${s}초`;
}

export function AdminLectureNotes() {
  const [view, setView] = useState<View>({ name: "list" });
  const [notes, setNotes] = useState<LectureNote[]>([]);
  const [query, setQuery] = useState("");

  const refresh = () => { void listNotes().then(setNotes); };
  useEffect(refresh, []);

  const filtered = query.trim()
    ? notes.filter((n) =>
        [n.title, n.source, n.transcript, JSON.stringify(n.summary ?? "")].join(" ").toLowerCase().includes(query.toLowerCase()),
      )
    : notes;

  return (
    <div>
      {view.name === "list" && (
        <ListView
          notes={filtered}
          query={query}
          onQuery={setQuery}
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
  query: string;
  onQuery: (q: string) => void;
  onNew: () => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
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

// ─────────────────────────────── 녹음 ───────────────────────────────
function RecordView(props: { onDone: (noteId: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [keepAudio, setKeepAudio] = useState(false);
  const [rec, setRec] = useState<RecorderHandle | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [markCount, setMarkCount] = useState(0);
  const [stage, setStage] = useState<PipelineStage>({ stage: "idle" });
  const recRef = useRef<RecorderHandle | null>(null);

  useEffect(() => {
    if (!rec) return;
    const t = setInterval(() => setElapsed(rec.elapsedSec()), 1000);
    return () => clearInterval(t);
  }, [rec]);

  // 녹음 중 이탈 방지 (기획 7. 브라우저 제약)
  useEffect(() => {
    if (!rec) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [rec]);

  const begin = async () => {
    try {
      const handle = await startRecording();
      recRef.current = handle;
      setRec(handle);
    } catch (e) {
      setStage({ stage: "error", message: e instanceof Error ? e.message : "마이크 접근 실패" });
    }
  };

  const finish = async () => {
    const handle = recRef.current;
    if (!handle) return;
    setRec(null);
    try {
      const { durationSec, bookmarks } = await handle.stop();
      setStage({ stage: "transcribing", done: 0, total: 1 });
      const transcript = await transcribeSession(handle.sessionId, (done, total) =>
        setStage({ stage: "transcribing", done, total }),
      );

      // 정리 실패해도 전사는 살린다 — 실패를 결과로 (고급1 C2 원칙)
      setStage({ stage: "summarizing" });
      let summary: LectureNote["summary"] = null;
      try {
        summary = await summarizeTranscript(transcript, bookmarks);
      } catch { /* summary=null 로 저장, 상세에서 재시도 */ }

      setStage({ stage: "saving" });
      const note: LectureNote = {
        id: handle.sessionId,
        title: title.trim() || summary?.title || `강의 노트 ${new Date().toLocaleDateString("ko-KR")}`,
        source: source.trim(),
        recordedAt: new Date().toISOString(),
        durationSec,
        transcript,
        summary,
        bookmarks,
        tags: [],
        keepAudio,
      };
      await putNote(note);
      if (!keepAudio) await deleteSessionChunks(handle.sessionId); // 원본 기본 폐기
      props.onDone(note.id);
    } catch (e) {
      setStage({ stage: "error", message: e instanceof Error ? e.message : "파이프라인 실패" });
    }
  };

  // 파이프라인 진행 화면
  if (stage.stage !== "idle" && stage.stage !== "error") {
    return (
      <div className="py-16 text-center">
        <div className="text-3xl mb-4">⚙️</div>
        <p className="text-sm text-brand-text">
          {stage.stage === "transcribing" && `음성 변환 중… (${stage.done}/${stage.total} 구간)`}
          {stage.stage === "summarizing" && "AI 정리 중… (강의 길이에 따라 1~2분)"}
          {stage.stage === "saving" && "저장 중…"}
        </p>
        {stage.stage === "transcribing" && (
          <div className="mt-4 mx-auto max-w-xs h-1.5 bg-brand-subtle">
            <div
              className="h-full bg-brand-primary transition-all"
              style={{ width: `${stage.total ? Math.round((stage.done / stage.total) * 100) : 0}%` }}
            />
          </div>
        )}
        <p className="mt-4 text-xs text-brand-textDim">이 탭을 닫지 마세요.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      {stage.stage === "error" && (
        <div className="mb-4 p-3 text-xs text-red-400 border border-red-500/40 bg-red-500/10">
          ⚠️ {stage.message}
          <div className="mt-1 text-brand-textDim">녹음 청크는 보존되어 있습니다. Groq 키 설정을 확인한 뒤 다시 시도하세요.</div>
        </div>
      )}

      {!rec ? (
        <>
          <div className="space-y-3 mb-5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="강의 제목 (비우면 AI가 자동 작성)"
              className="w-full px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary"
            />
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="출처 — 강의명·플랫폼·강사 (선택)"
              className="w-full px-3 py-2 text-sm bg-brand-panel border border-brand-subtle text-brand-text placeholder:text-brand-textDim focus:outline-none focus:border-brand-primary"
            />
            <label className="flex items-center gap-2 text-xs text-brand-textDim">
              <input type="checkbox" checked={keepAudio} onChange={(e) => setKeepAudio(e.target.checked)} />
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
            💡 5분마다 자동 저장되어 브라우저가 꺼져도 그 시점까지 보존됩니다. 녹음 중 탭은 열어두세요.
            변환은 내 Groq 키(무료 한도)로 처리됩니다.
          </p>
        </>
      ) : (
        <div className="py-10 text-center">
          <div className="text-4xl mb-3 animate-pulse">🔴</div>
          <div className="text-2xl font-mono text-brand-text">{fmtDur(elapsed)}</div>
          <div className="mt-1 text-xs text-brand-textDim">{title.trim() || "제목 미정 — 종료 후 AI가 작성"}</div>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => { rec.bookmark(); setMarkCount((c) => c + 1); }}
              className="px-4 py-2 text-sm border border-amber-500/60 text-amber-400 hover:bg-amber-500/10"
            >
              🔖 북마크 {markCount > 0 ? `(${markCount})` : ""}
            </button>
            <button onClick={() => void finish()} className="px-5 py-2 text-sm font-semibold bg-brand-primary text-black hover:opacity-90">
              ■ 종료하고 정리 시작
            </button>
          </div>
        </div>
      )}
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
      await putNote(updated);
      setNote(updated);
    } catch (e) {
      alert(`정리 재시도 실패: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setBusy(false);
    }
  };

  const copyMd = async () => {
    await navigator.clipboard.writeText(noteToMarkdown(note));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const remove = async () => {
    if (!confirm(`'${note.title}' 노트를 삭제할까요? (복구 불가)`)) return;
    await deleteNote(note.id);
    await deleteSessionChunks(note.id);
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

/**
 * 강의 노트 오디오 플레이어 — IndexedDB에 보관된 녹음 청크(5분 단위 완결형 webm)를 이어서 재생.
 *
 * 청크가 각각 독립된 webm 파일이므로 <audio> 하나를 두고 청크를 순차 전환하며,
 * UI는 세션 전체를 하나의 타임라인(전역 초)으로 보여준다.
 * keepAudio=false 로 저장된 노트는 원본이 이미 폐기되어 재생 불가 — 안내만 표시.
 */

import { useEffect, useRef, useState } from "react";
import {
  getSessionChunks,
  deleteSessionChunks,
  downloadSessionAudio,
  saveNote,
  type LectureNote,
} from "../../lib/lectureNotes";

const RATES = [0.75, 1, 1.25, 1.5, 1.75, 2];

interface Seg {
  url: string;
  startSec: number;
  durationSec: number;
  bytes: number;
}

function fmtTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

export function LectureAudioPlayer(props: {
  note: LectureNote;
  /** 오디오 원본 삭제 후 갱신된 노트 전달 (keepAudio=false 반영) */
  onAudioDeleted: (updated: LectureNote) => void;
}) {
  const { note } = props;
  const [segs, setSegs] = useState<Seg[] | null>(null); // null = 로딩 중
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [pos, setPos] = useState(0); // 전역 재생 위치(초)
  const [downloading, setDownloading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // 청크 전환(src 교체) 직후 loadedmetadata 에서 적용할 청크 내 오프셋 / 재생 재개 여부
  const pendingOffset = useRef(0);
  const resumeOnLoad = useRef(false);

  useEffect(() => {
    let alive = true;
    let urls: string[] = [];
    setSegs(null);
    setIdx(0);
    setPos(0);
    setPlaying(false);
    void getSessionChunks(note.id).then((chunks) => {
      if (!alive) return;
      urls = chunks.map((c) => URL.createObjectURL(c.blob));
      setSegs(
        chunks.map((c, i) => ({
          url: urls[i],
          startSec: c.startSec,
          durationSec: c.durationSec,
          bytes: c.blob.size,
        })),
      );
    });
    return () => {
      alive = false;
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [note.id]);

  if (segs === null) return null;

  if (segs.length === 0) {
    return (
      <p className="mt-3 text-[11px] text-brand-textDim">
        🔇 오디오 원본이 없는 노트입니다 — 녹음 시 "오디오 원본 보관"이 켜져 있어야 다시 들을 수 있습니다.
      </p>
    );
  }

  const last = segs[segs.length - 1];
  const total = last.startSec + last.durationSec;
  const totalBytes = segs.reduce((sum, s) => sum + s.bytes, 0);

  const seekTo = (sec: number) => {
    const clamped = Math.max(0, Math.min(sec, total - 0.1));
    let i = segs.findIndex((s) => clamped < s.startSec + s.durationSec);
    if (i < 0) i = segs.length - 1;
    const offset = Math.max(0, clamped - segs[i].startSec);
    const a = audioRef.current;
    if (i === idx && a && a.readyState >= 1) {
      a.currentTime = offset;
    } else {
      pendingOffset.current = offset;
      resumeOnLoad.current = !!a && !a.paused;
      setIdx(i);
    }
    setPos(clamped);
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.playbackRate = rate;
      void a.play();
    } else {
      a.pause();
    }
  };

  const changeRate = (r: number) => {
    setRate(r);
    const a = audioRef.current;
    if (a) a.playbackRate = r;
  };

  const onLoaded = () => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = rate;
    if (pendingOffset.current > 0) a.currentTime = pendingOffset.current;
    pendingOffset.current = 0;
    if (resumeOnLoad.current) {
      resumeOnLoad.current = false;
      void a.play();
    }
  };

  const onEnded = () => {
    if (idx + 1 < segs.length) {
      pendingOffset.current = 0;
      resumeOnLoad.current = true;
      setIdx(idx + 1);
    } else {
      setPlaying(false);
      setPos(total);
    }
  };

  const download = async () => {
    setDownloading(true);
    try {
      await downloadSessionAudio(note);
    } catch (e) {
      alert(`다운로드 실패: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setDownloading(false);
    }
  };

  const deleteAudio = async () => {
    if (!confirm("보관된 오디오 원본을 삭제할까요? (노트·전사·정리본은 유지, 오디오만 복구 불가)")) return;
    audioRef.current?.pause();
    await deleteSessionChunks(note.id);
    const updated: LectureNote = { ...note, keepAudio: false };
    await saveNote(updated);
    setSegs([]);
    props.onAudioDeleted(updated);
  };

  const btn = "px-2 py-1 text-xs border border-brand-subtle text-brand-textDim hover:text-brand-text";

  return (
    <div className="mt-4 p-3 border border-brand-subtle bg-brand-panel/40">
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="w-9 h-9 shrink-0 text-sm font-semibold bg-brand-primary text-black hover:opacity-90"
          title={playing ? "일시정지" : "재생"}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={() => seekTo(pos - 10)} className={btn} title="10초 뒤로">⏪ 10</button>
        <button onClick={() => seekTo(pos + 10)} className={btn} title="10초 앞으로">10 ⏩</button>
        <span className="shrink-0 text-xs font-mono text-brand-text">
          {fmtTime(pos)} <span className="text-brand-textDim">/ {fmtTime(total)}</span>
        </span>
        <input
          type="range"
          min={0}
          max={Math.floor(total)}
          step={1}
          value={Math.min(Math.floor(pos), Math.floor(total))}
          onChange={(e) => seekTo(Number(e.target.value))}
          className="flex-1 min-w-24 accent-brand-primary"
        />
      </div>

      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-brand-textDim mr-0.5">배속</span>
        {RATES.map((r) => (
          <button
            key={r}
            onClick={() => changeRate(r)}
            className={`px-2 py-0.5 text-[11px] border ${
              rate === r
                ? "border-brand-primary text-brand-primary font-semibold bg-brand-primary/10"
                : "border-brand-subtle text-brand-textDim hover:text-brand-text"
            }`}
          >
            {r}x
          </button>
        ))}
        {note.bookmarks.length > 0 && (
          <>
            <span className="ml-2 text-[10px] text-brand-textDim">북마크</span>
            {note.bookmarks.map((b, i) => (
              <button
                key={`${b}-${i}`}
                onClick={() => seekTo(b)}
                className="px-2 py-0.5 text-[11px] border border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
              >
                🔖 {fmtTime(b)}
              </button>
            ))}
          </>
        )}
        <div className="flex-1" />
        <span className="text-[10px] text-brand-textDim">{(totalBytes / (1024 * 1024)).toFixed(1)}MB</span>
        <button
          onClick={() => void download()}
          disabled={downloading}
          title={segs.length > 1 ? `원본 무손실 — 5분 구간 ${segs.length}개를 ZIP 하나로` : "원본 무손실 webm"}
          className="px-2 py-0.5 text-[11px] border border-brand-subtle text-brand-textDim hover:text-brand-text disabled:opacity-50"
        >
          {downloading ? "준비 중…" : "⬇ 다운로드"}
        </button>
        <button
          onClick={() => void deleteAudio()}
          className="px-2 py-0.5 text-[11px] border border-red-500/40 text-red-400 hover:bg-red-500/10"
        >
          오디오 삭제
        </button>
      </div>

      <audio
        ref={audioRef}
        src={segs[idx].url}
        preload="metadata"
        onLoadedMetadata={onLoaded}
        onTimeUpdate={(e) => setPos(segs[idx].startSec + e.currentTarget.currentTime)}
        onEnded={onEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="hidden"
      />
    </div>
  );
}

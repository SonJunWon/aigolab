import { useEffect, useRef, useState } from "react";
import { useProfileStore } from "../store/profileStore";

const PRESET_EMOJIS = [
  "🙂", "🐍", "🚀", "🎯",
  "⭐", "🔥", "🎨", "🧠",
  "📚", "🎓", "💡", "🌟",
  "🎭", "🎬", "⚡", "🌈",
];

const MAX_CUSTOM_EMOJI_LEN = 10;
const MIN_NICK = 2;
const MAX_NICK = 20;

interface Props {
  /** 현재 로그인 사용자 ID */
  userId: string;
  /** 모달 닫기 콜백 */
  onClose: () => void;
}

export function ProfileEditModal({ userId, onClose }: Props) {
  const currentNickname = useProfileStore((s) => s.nickname) ?? "";
  const currentEmoji = useProfileStore((s) => s.avatarEmoji) ?? "🙂";
  const save = useProfileStore((s) => s.save);

  const [nickname, setNickname] = useState(currentNickname);
  const [selectedEmoji, setSelectedEmoji] = useState(currentEmoji);
  const [customEmoji, setCustomEmoji] = useState(
    PRESET_EMOJIS.includes(currentEmoji) ? "" : currentEmoji
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  // 모달 외부 클릭 시 닫기
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current && !saving) onClose();
  };

  // 커스텀 이모지 입력 시 자동으로 선택
  const handleCustomChange = (v: string) => {
    const clipped = v.slice(0, MAX_CUSTOM_EMOJI_LEN);
    setCustomEmoji(clipped);
    if (clipped.trim()) setSelectedEmoji(clipped);
  };

  // 프리셋 클릭 시
  const handlePresetClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    setCustomEmoji(""); // 프리셋 고르면 커스텀 비움
  };

  // 유효성 검사
  const trimmedNick = nickname.trim();
  const nickValid =
    trimmedNick.length >= MIN_NICK && trimmedNick.length <= MAX_NICK;
  const finalEmoji = selectedEmoji.trim();
  const emojiValid = finalEmoji.length > 0;
  const canSave = nickValid && emojiValid && !saving;

  // 저장
  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const result = await save(userId, trimmedNick, finalEmoji);
    setSaving(false);
    if (result.error) {
      setError("저장에 실패했어요. 네트워크를 확인하고 다시 시도해주세요.");
      return;
    }
    onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="프로필 편집"
    >
      <div className="w-full max-w-md rounded-2xl bg-brand-panel border border-brand-subtle shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-subtle">
          <h2 className="text-base font-semibold text-brand-text">프로필 편집</h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-brand-textDim hover:text-brand-text hover:bg-brand-hover disabled:opacity-50 transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* 미리보기 */}
          <div className="flex items-center justify-center flex-col gap-2">
            <div
              className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center overflow-hidden"
              style={{ fontSize: 40 }}
            >
              <span className="leading-none">{finalEmoji || "?"}</span>
            </div>
            <div className="text-sm text-brand-textDim">
              {trimmedNick || <span className="italic">닉네임 입력 필요</span>}
            </div>
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-xs font-medium text-brand-textDim uppercase tracking-wider mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={MAX_NICK + 5} // 시각적 여유, 저장 시 trim
              placeholder="2~20자"
              className="w-full px-3 py-2 text-sm rounded-lg bg-brand-bg border border-brand-subtle text-brand-text focus:outline-none focus:border-brand-primary transition-colors"
            />
            <div className="mt-1 flex justify-between text-[11px] text-brand-textDim">
              <span>
                {!nickValid && trimmedNick.length < MIN_NICK
                  ? `${MIN_NICK}자 이상 입력`
                  : !nickValid && trimmedNick.length > MAX_NICK
                  ? `${MAX_NICK}자 이하`
                  : " "}
              </span>
              <span>
                {trimmedNick.length}/{MAX_NICK}
              </span>
            </div>
          </div>

          {/* 아바타 이모지 */}
          <div>
            <label className="block text-xs font-medium text-brand-textDim uppercase tracking-wider mb-2">
              아바타 이모지
            </label>
            <div className="grid grid-cols-8 gap-1.5">
              {PRESET_EMOJIS.map((e) => {
                const isSel = selectedEmoji === e && !customEmoji;
                return (
                  <button
                    key={e}
                    onClick={() => handlePresetClick(e)}
                    className={`aspect-square rounded-lg text-xl flex items-center justify-center transition-all
                      ${
                        isSel
                          ? "bg-brand-primary/25 ring-2 ring-brand-primary"
                          : "bg-brand-bg hover:bg-brand-hover border border-brand-subtle"
                      }`}
                    aria-label={`이모지 ${e}`}
                    aria-pressed={isSel}
                  >
                    {e}
                  </button>
                );
              })}
            </div>

            {/* 기타 입력 */}
            <div className="mt-3">
              <label className="block text-[11px] text-brand-textDim mb-1">
                기타 (직접 입력, 최대 {MAX_CUSTOM_EMOJI_LEN}자)
              </label>
              <input
                type="text"
                value={customEmoji}
                onChange={(e) => handleCustomChange(e.target.value)}
                placeholder="예: 🐙"
                maxLength={MAX_CUSTOM_EMOJI_LEN}
                className={`w-full px-3 py-2 text-sm rounded-lg bg-brand-bg border text-brand-text focus:outline-none transition-colors ${
                  customEmoji.trim()
                    ? "border-brand-primary"
                    : "border-brand-subtle focus:border-brand-primary"
                }`}
              />
              {customEmoji.trim() && (
                <p className="mt-1 text-[11px] text-brand-primary">
                  ✓ 직접 입력한 이모지 사용 중
                </p>
              )}
            </div>
          </div>

          {/* 에러 */}
          {error && (
            <div className="px-3 py-2 rounded-lg bg-brand-red/15 border border-brand-red/30 text-xs text-brand-red">
              {error}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-brand-subtle">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs rounded-lg text-brand-textDim hover:text-brand-text hover:bg-brand-hover disabled:opacity-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-4 py-2 text-xs rounded-lg bg-brand-primary text-white font-medium hover:bg-brand-primaryDim disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

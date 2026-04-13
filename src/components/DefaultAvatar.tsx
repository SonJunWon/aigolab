/**
 * 사용자 아바타.
 * 우선순위:
 *   1. avatarEmoji가 있으면 이모지 표시
 *   2. 없으면 닉네임/이메일 첫 글자 (대문자)
 */

interface Props {
  avatarEmoji?: string | null;
  nickname?: string | null;
  email?: string | null;
  /** 픽셀 단위 크기 (width == height). 기본 32 */
  size?: number;
  /** 추가 클래스 */
  className?: string;
}

export function DefaultAvatar({
  avatarEmoji,
  nickname,
  email,
  size = 32,
  className = "",
}: Props) {
  const hasEmoji = !!avatarEmoji && avatarEmoji.trim().length > 0;

  // 이니셜: 닉네임 > 이메일 @ 앞 > "?"
  const initialSource =
    (nickname && nickname.trim()) ||
    (email ? email.split("@")[0] : "") ||
    "?";
  const initial = initialSource.charAt(0).toUpperCase();

  // 이모지는 폰트 크기를 약간 크게 (원 안을 꽉 채우도록)
  const fontSize = hasEmoji ? Math.floor(size * 0.6) : Math.floor(size * 0.45);

  return (
    <div
      className={`shrink-0 rounded-full bg-brand-primary/20 flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size, fontSize }}
      aria-hidden="true"
    >
      {hasEmoji ? (
        <span className="leading-none">{avatarEmoji}</span>
      ) : (
        <span className="text-brand-primary font-medium leading-none">
          {initial}
        </span>
      )}
    </div>
  );
}

/**
 * 🔒 PRO 배지 — 유료 콘텐츠 표시.
 *
 * 사용 예:
 *   <ProBadge />                          // 기본 (inline pill)
 *   <ProBadge size="sm" />                // 작은 사이즈 (카드 태그 줄)
 *   <ProBadge size="lg" variant="solid" /> // 강조 (페이지 헤더)
 */

interface Props {
  size?: "sm" | "md" | "lg";
  /** outline: 얇은 테두리 / solid: 채워진 그라디언트 */
  variant?: "outline" | "solid";
  className?: string;
}

export function ProBadge({ size = "md", variant = "outline", className = "" }: Props) {
  const sizeCls = {
    sm: "text-[9px] px-1.5 py-0.5",
    md: "text-[10px] px-2 py-0.5",
    lg: "text-xs px-2.5 py-1",
  }[size];

  const variantCls =
    variant === "solid"
      ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-semibold shadow-sm"
      : "border border-amber-400/60 bg-amber-400/10 text-amber-400";

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full font-medium tracking-wide ${sizeCls} ${variantCls} ${className}`}
      title="PRO 전용 콘텐츠 — 곧 오픈 예정"
    >
      🔒 PRO
    </span>
  );
}

/**
 * Paywall 모달 — 유료 콘텐츠 클릭 시 표시.
 *
 * Phase 1: "곧 오픈 예정" 안내 + 무료 콘텐츠로 유도.
 * Phase 2 이후: 실제 가격 페이지 / 결제 버튼으로 교체 예정.
 */

import { Link } from "react-router-dom";

export interface PaywallContext {
  /** 표시할 콘텐츠 제목 — "프롬프트 엔지니어링", "SaaS Churn 예측" 등 */
  title: string;
  /** 배지에 보여줄 카테고리 — "AI 강의", "AI 프로젝트", "Python 중급" 등 */
  kind: string;
  /** 아이콘 (선택) — 이모지 */
  icon?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  context: PaywallContext | null;
}

export function PaywallModal({ open, onClose, context }: Props) {
  if (!open || !context) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-brand-panel border border-brand-subtle shadow-2xl overflow-hidden animate-paywall-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 그라디언트 헤더 */}
        <div className="relative bg-gradient-to-br from-amber-400/20 via-brand-primary/20 to-transparent px-6 py-7 text-center">
          <div className="text-5xl mb-2">🔒</div>
          <div className="text-[11px] tracking-[0.2em] text-amber-400 font-semibold uppercase mb-1">
            PRO 전용 콘텐츠
          </div>
          <h2 id="paywall-title" className="text-xl font-bold text-brand-text leading-tight">
            {context.icon} {context.title}
          </h2>
          <div className="text-xs text-brand-textDim mt-1.5">
            {context.kind}
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full text-brand-textDim hover:text-brand-text hover:bg-brand-hover flex items-center justify-center"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="px-6 py-5 space-y-4">
          <div className="text-sm text-brand-text leading-relaxed">
            이 콘텐츠는 곧 출시될 <strong className="text-amber-400">AIGoLab PRO</strong> 에서
            만나볼 수 있습니다.
          </div>

          <div className="rounded-xl border border-brand-subtle bg-brand-bg/50 p-4 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-brand-primary shrink-0 mt-0.5">✓</span>
              <span className="text-brand-text">
                AI 강의 전체 + AI 프로젝트 13개
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-brand-primary shrink-0 mt-0.5">✓</span>
              <span className="text-brand-text">
                Python 중급 · 데이터 과학 · ML 실습 트랙 전체
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-brand-primary shrink-0 mt-0.5">✓</span>
              <span className="text-brand-text">
                오픈 시점에 얼리버드 혜택 (정가 대비 할인 예정)
              </span>
            </div>
          </div>

          <p className="text-[11px] text-brand-textDim text-center leading-relaxed">
            지금은 무료 콘텐츠로 먼저 기초를 다져보세요.
            <br />
            PRO 출시 소식은 이메일·공지로 안내드립니다.
          </p>
        </div>

        {/* 푸터 CTA */}
        <div className="px-6 pb-6 pt-2 space-y-2">
          <Link
            to="/"
            onClick={onClose}
            className="block w-full text-center py-3 rounded-xl bg-brand-primary text-white font-medium text-sm hover:bg-brand-primaryDim transition-colors"
          >
            무료 콘텐츠 둘러보기
          </Link>
          <button
            onClick={onClose}
            className="block w-full text-center py-2.5 text-xs text-brand-textDim hover:text-brand-text transition-colors"
          >
            나중에
          </button>
        </div>
      </div>

      <style>{`
        @keyframes paywall-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-paywall-in { animation: paywall-in 220ms ease-out; }
        @media (max-width: 640px) {
          @keyframes paywall-in {
            from { opacity: 0; transform: translateY(100%); }
            to   { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>
    </div>
  );
}

/**
 * 상세 페이지(레슨·프로젝트·강의) 진입 시 권한 없으면 표시하는 잠금 화면.
 *
 * 목록 페이지는 소프트 잠금 (카드 흐리게 + 클릭 시 paywall 모달) 을 쓰지만,
 * 상세 페이지는 URL 직접 입력으로 들어온 경우가 많아 **하드 잠금** 이 맞음.
 * 콘텐츠 본문을 전혀 렌더하지 않고 이 화면으로 대체한다.
 */

import { Link } from "react-router-dom";

interface Props {
  /** 콘텐츠 아이콘 (이모지) */
  icon?: string;
  /** 잠긴 콘텐츠 제목 — "Python 중급 · 01 파일 I/O" 등 */
  title: string;
  /** 카테고리 — "코딩 실습 레슨", "AI 프로젝트", "AI 강의" */
  kind: string;
  /** 뒤로 갈 목록 페이지 경로 */
  backTo: string;
  /** 뒤로 갈 목록 페이지 라벨 — "← 커리큘럼으로", "← 프로젝트 목록" */
  backLabel: string;
}

export function LockedContentScreen({ icon, title, kind, backTo, backLabel }: Props) {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-xl px-6 py-16">
        {/* 상단 네비 */}
        <nav className="mb-10">
          <Link
            to={backTo}
            className="text-sm text-brand-textDim hover:text-brand-primary transition-colors"
          >
            {backLabel}
          </Link>
        </nav>

        {/* 잠금 카드 */}
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/10 via-transparent to-transparent p-8 sm:p-10">
          <div className="flex items-start gap-4 mb-6">
            {icon && <div className="text-5xl shrink-0">{icon}</div>}
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-xs font-semibold mb-3">
                <span>🔒</span>
                <span>PRO 전용 · {kind}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-brand-text leading-snug break-keep">
                {title}
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-brand-textDim leading-relaxed mb-6">
            이 콘텐츠는{" "}
            <strong className="text-brand-text">AIGoLab PRO</strong> 출시와
            함께 이용할 수 있습니다. 목록 페이지에서 무료 콘텐츠를 확인하거나,
            PRO 오픈 소식을 기다려 주세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={backTo}
              className="flex-1 text-center px-5 py-3 rounded-xl bg-brand-accent text-white font-medium hover:brightness-110 transition-all"
            >
              목록으로 돌아가기
            </Link>
            <Link
              to="/"
              className="flex-1 text-center px-5 py-3 rounded-xl border border-brand-subtle text-brand-text hover:border-brand-accent/50 hover:text-brand-accent transition-colors"
            >
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

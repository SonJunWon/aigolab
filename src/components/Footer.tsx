import { Link } from "react-router-dom";

/**
 * 전역 푸터.
 * - 개인정보보호법상 필요한 정보(대표자, 주소, 연락처) 게시
 * - NavBar가 보이는 페이지에서만 노출 (전체화면 페이지 제외)
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-subtle bg-brand-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-sm text-brand-textDim">
          {/* 서비스 소개 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">AI</span>
              </div>
              <span className="text-base font-semibold text-brand-text">
                AIGoLab
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              AI를 시작하는 가장 쉬운 실험실.
              <br />
              브라우저에서 바로 시작하는 AI 학습 플랫폼.
            </p>
          </div>

          {/* 운영자 정보 */}
          <div>
            <h3 className="text-xs font-medium text-brand-text uppercase tracking-wider mb-2">
              운영자 정보
            </h3>
            <dl className="space-y-1 text-xs">
              <div className="flex gap-2">
                <dt className="shrink-0 text-brand-textDim/70">대표자</dt>
                <dd>손준원 (Son Joon Won)</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-brand-textDim/70">주소</dt>
                <dd>경기도 수원시 영통구 광교호수공원로 155</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-brand-textDim/70">문의</dt>
                <dd>
                  <a
                    href="mailto:gyumsonsam@gmail.com"
                    className="hover:text-brand-primary transition-colors"
                  >
                    gyumsonsam@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* 고객 지원 & 정책 */}
          <div>
            <h3 className="text-xs font-medium text-brand-text uppercase tracking-wider mb-2">
              고객 지원
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  to="/notices"
                  className="hover:text-brand-primary transition-colors"
                >
                  공지사항
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-brand-primary transition-colors"
                >
                  자주 묻는 질문 (FAQ)
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-brand-primary transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-brand-primary transition-colors"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-8 pt-4 border-t border-brand-subtle text-[11px] text-brand-textDim/70 text-center">
          © 2026 AIGoLab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

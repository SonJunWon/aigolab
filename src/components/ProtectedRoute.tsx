/**
 * 로그인 필수 라우트 래퍼.
 *
 * 비로그인 사용자가 접근하면 로그인 유도 화면을 표시합니다.
 * "로그인 없이 둘러보기" 옵션은 제공하지 않고, 회원가입/로그인으로 안내합니다.
 */

import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  // 아직 세션 복원 중이면 로딩 표시
  if (!initialized) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-brand-textDim text-sm">로딩 중...</div>
      </div>
    );
  }

  // 로그인된 사용자는 바로 통과
  if (user) {
    return <>{children}</>;
  }

  // 비로그인 — 회원가입/로그인 유도
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 아이콘 */}
        <div className="text-5xl mb-4">🔐</div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold mb-2">로그인이 필요합니다</h1>
        <p className="text-sm text-brand-textDim leading-relaxed mb-8">
          이 콘텐츠를 이용하려면 회원가입 또는 로그인이 필요해요.
          <br />
          가입하면 학습 진도가 저장되고, 모든 콘텐츠를 이용할 수 있습니다.
        </p>

        {/* CTA 버튼 */}
        <div className="space-y-3">
          <Link
            to="/auth"
            className="block w-full py-3 rounded-xl text-center font-semibold text-sm text-white
                       bg-gradient-to-r from-brand-accent to-cyan-500
                       hover:brightness-110 transition-all shadow-lg shadow-brand-accent/20"
          >
            회원가입 / 로그인 →
          </Link>

          <Link
            to="/"
            className="block w-full py-3 rounded-xl text-center text-sm text-brand-textDim
                       border border-brand-subtle hover:border-brand-textDim transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>

        {/* 혜택 안내 */}
        <div className="mt-10 text-left space-y-3">
          <h2 className="text-xs font-medium text-brand-textDim uppercase tracking-wider text-center mb-4">
            회원 혜택
          </h2>
          {[
            { icon: "📚", text: "42개 워크샵 + 12강 AI 엔지니어링 전체 이용" },
            { icon: "💾", text: "학습 진도 자동 저장 — 어디서든 이어서 학습" },
            { icon: "🧪", text: "Playground · IDE 코딩 도구 무제한 사용" },
            { icon: "📊", text: "진도 대시보드로 학습 현황 한눈에 파악" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-brand-panel/40">
              <span className="text-lg shrink-0">{item.icon}</span>
              <span className="text-sm text-brand-textDim">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

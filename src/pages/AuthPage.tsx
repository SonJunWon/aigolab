import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type Mode = "login" | "signup";

export function AuthPage() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 이미 로그인돼 있으면 홈으로
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    if (mode === "login") {
      const result = await signIn(email, password);
      if (result.error) setError(result.error);
    } else {
      const result = await signUp(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(
          "가입 완료! 이메일에서 확인 링크를 클릭한 후 로그인하세요."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1
              className="text-3xl font-bold"
              style={{
                background:
                  "linear-gradient(to right, #7C3AED, #a78bfa, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AIGoLab
            </h1>
          </Link>
          <p className="text-sm text-brand-textDim mt-1">
            AI를 시작하는 가장 쉬운 실험실
          </p>
        </div>

        {/* 탭 */}
        <div className="flex mb-6 border-b border-brand-subtle">
          <button
            onClick={() => {
              setMode("login");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
              mode === "login"
                ? "text-brand-primary border-brand-primary"
                : "text-brand-textDim border-transparent hover:text-brand-text"
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
              mode === "signup"
                ? "text-brand-primary border-brand-primary"
                : "text-brand-textDim border-transparent hover:text-brand-text"
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-brand-textDim mb-1.5">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-lg bg-brand-panel border border-brand-subtle
                         text-brand-text text-sm placeholder:text-brand-textDim/50
                         focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-brand-textDim mb-1.5">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full px-4 py-2.5 rounded-lg bg-brand-panel border border-brand-subtle
                         text-brand-text text-sm placeholder:text-brand-textDim/50
                         focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>

          {/* 에러/성공 메시지 */}
          {error && (
            <div className="px-4 py-2 rounded-lg bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs">
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-2 rounded-lg bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-brand-primary text-white text-sm font-medium
                       hover:bg-brand-primaryDim disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            {loading
              ? "처리 중..."
              : mode === "login"
              ? "로그인"
              : "회원가입"}
          </button>
        </form>

        {/* 구분선 + Google 로그인 */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-brand-subtle" />
          <span className="text-xs text-brand-textDim">또는</span>
          <div className="flex-1 h-px bg-brand-subtle" />
        </div>

        <button
          onClick={async () => {
            setError("");
            const result = await signInWithGoogle();
            if (result.error) setError(result.error);
          }}
          disabled={loading}
          className="mt-4 w-full flex items-center justify-center gap-3 py-2.5 rounded-lg
                     border border-brand-subtle bg-brand-panel text-brand-text text-sm
                     hover:bg-brand-hover hover:border-brand-textDim transition-colors
                     disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google로 로그인
        </button>

        {/* 게스트 안내 */}
        <div className="mt-8 pt-6 border-t border-brand-subtle text-center">
          <Link
            to="/"
            className="text-xs text-brand-textDim hover:text-brand-accent transition-colors"
          >
            로그인 없이 둘러보기 →
          </Link>
          <p className="text-[10px] text-brand-textDim/50 mt-2">
            비로그인 시 학습 진도는 이 브라우저에만 저장됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

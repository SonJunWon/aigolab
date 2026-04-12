import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type Mode = "login" | "signup";

export function AuthPage() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);

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

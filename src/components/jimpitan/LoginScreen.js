"use client";

export default function LoginScreen({
  username,
  password,
  loginError,
  isLoading,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -top-35 -right-30 h-[380px] w-[380px] rounded-full"
        style={{ background: "radial-gradient(circle, #1f7a4d22, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-25 h-[360px] w-[360px] rounded-full"
        style={{ background: "radial-gradient(circle, #c1652f1c, transparent 70%)" }}
      />

      <div className="animate-pop-in relative w-full max-w-[380px] rounded-[22px] border border-card-border bg-white p-[38px_32px] shadow-[0_24px_60px_-24px_rgba(28,36,32,0.3)]">
        {/* Logo */}
        <div className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-[15px] bg-gradient-to-br from-brand to-brand-deep shadow-[0_10px_20px_-8px_#1f7a4d66]">
          <span className="font-display text-[22px] font-extrabold text-white">J</span>
        </div>

        <div className="font-display mb-1 text-[23px] font-extrabold tracking-tight">
          Jimpitan Online
        </div>
        <div className="mb-6 text-sm text-muted">Masuk menggunakan akun Anda</div>

        <form onSubmit={onSubmit}>
          <div className="mb-[14px]">
            <label className="mb-1.5 block text-[13px] font-semibold text-label">
              Username
            </label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={onUsernameChange}
              placeholder="mis. kelompok4"
              autoComplete="username"
              className="w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-[15px] transition-colors focus:border-brand focus:outline-none"
            />
          </div>

          <div className="mb-2">
            <label className="mb-1.5 block text-[13px] font-semibold text-label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-[15px] transition-colors focus:border-brand focus:outline-none"
            />
          </div>

          {loginError ? (
            <div className="animate-fade-in-up mt-2 mb-1 rounded-[8px] bg-danger-bg px-3 py-2 text-[13px] font-semibold text-danger">
              {loginError}
            </div>
          ) : null}

          <div className="mt-3 mb-[18px] flex items-center gap-2 text-xs text-muted-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7v5M8 5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Sistem akan mendeteksi hak akses Anda secara otomatis.
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-[10px] border-none bg-brand py-[13px] text-[15px] font-bold text-white shadow-[0_10px_20px_-10px_#1f7a4d80] transition-[background,transform] duration-150 hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memverifikasi…" : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}

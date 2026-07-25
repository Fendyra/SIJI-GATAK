"use client";

import { useState } from "react";

export default function LoginScreen({
  username,
  password,
  loginError,
  isLoading,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-[#f9fafb] p-4 sm:p-6 font-sans">
      {/* Background Ornaments (Dots & Blobs) */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-tr-full bg-brand/5 hidden sm:block" />
      <div
        className="pointer-events-none absolute right-4 bottom-4 h-48 w-48 opacity-20 hidden sm:block"
        style={{
          backgroundImage: "radial-gradient(#1f7a4d 2px, transparent 2px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="animate-pop-in relative w-full max-w-[420px] rounded-3xl bg-white p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {/* Logo Section */}
        <div className="mb-2 flex flex-col items-center text-center">
          <div className="-mt-2 sm:-mt-2 flex flex-col items-center justify-center">
            <img
              src="/logo.png"
              alt="Logo SIJI GATAK"
              className="h-40 sm:h-52 w-auto object-contain scale-110"
            />
          </div>
          <p className="-mt-10 sm:-mt-14 mb-4 sm:mb-6 text-xs sm:text-sm font-medium text-gray-500 relative z-10">
            Sistem Informasi Jimpitan<br />Dusun Gatak
          </p>
        </div>

        {/* Greeting Section */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Selamat datang!</h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">Silakan masuk untuk melanjutkan</p>
        </div>

        <form onSubmit={onSubmit}>
          {/* Username Input */}
          <div className="mb-3 sm:mb-4">
            <label className="mb-1 sm:mb-1.5 block text-[13px] sm:text-sm font-bold text-gray-800">
              Email atau Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={onUsernameChange}
                placeholder="Masukkan email atau username"
                autoComplete="username"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 sm:py-3 pr-4 pl-10 sm:pl-11 text-[14px] sm:text-[15px] font-medium text-gray-900 transition-all focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4 sm:mb-5">
            <label className="mb-1 sm:mb-1.5 block text-[13px] sm:text-sm font-bold text-gray-800">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
                </svg>
              </div>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={onPasswordChange}
                placeholder="Masukkan password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 sm:py-3 pr-10 sm:pr-11 pl-10 sm:pl-11 text-[14px] sm:text-[15px] font-medium text-gray-900 transition-all focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="mb-5 sm:mb-6 flex items-center">
            <label className="flex cursor-pointer items-center gap-2">
              <div
                className={`flex h-[18px] w-[18px] sm:h-5 sm:w-5 items-center justify-center rounded border transition-colors ${rememberMe ? "border-brand bg-brand" : "border-gray-300 bg-white"
                  }`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3 sm:h-3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span className="text-[13px] sm:text-sm font-semibold text-gray-800 select-none" onClick={() => setRememberMe(!rememberMe)}>Ingat saya</span>
            </label>
          </div>

          {loginError ? (
            <div className="mb-3 sm:mb-4 rounded-lg bg-red-50 p-2.5 sm:p-3 text-[13px] sm:text-sm font-medium text-red-600">
              {loginError}
            </div>
          ) : null}

          {/* Submit Button */}
          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-none bg-[#166534] py-3 sm:py-3.5 text-[14px] sm:text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#14532d] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memverifikasi...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Masuk
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px] transition-transform group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <div className="text-[11px] text-gray-400">
          &copy; 2026 SIJI GATAK &ndash; KKN UPNYK 84.036
        </div>
      </div>
    </div>
  );
}

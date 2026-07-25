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
    <div className="relative flex min-h-screen items-center justify-center bg-[#f9fafb] p-6 font-sans">
      {/* Background Ornaments (Dots & Blobs) */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-tr-full bg-brand/5" />
      <div
        className="pointer-events-none absolute right-4 bottom-4 h-48 w-48 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#1f7a4d 2px, transparent 2px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="animate-pop-in relative w-full max-w-[420px] rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
        
        {/* Logo Section */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 flex flex-col items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Logo SIJI GATAK" 
              className="h-24 w-auto object-contain"
            />
          </div>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Sistem Informasi Jimpitan<br />Dusun Gatak
          </p>
        </div>

        {/* Greeting Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Selamat datang!</h2>
          <p className="mt-1 text-sm text-gray-500">Silakan masuk untuk melanjutkan</p>
        </div>

        <form onSubmit={onSubmit}>
          {/* Username Input */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-bold text-gray-800">
              Email atau Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-[15px] font-medium text-gray-900 transition-all focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-bold text-gray-800">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-11 pl-11 text-[15px] font-medium text-gray-900 transition-all focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.28 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l4.2 4.2 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.14-.06.27-.06.4 0 1.66 1.34 3 3 3 .15 0 .28-.02.42-.06l2.61 2.61c-.88.36-1.85.57-2.88.57-2.76 0-5-2.24-5-5 0-1.03.21-2 .57-2.88z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="mb-6 flex items-center">
            <label className="flex cursor-pointer items-center gap-2">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                  rememberMe ? "border-brand bg-brand" : "border-gray-300 bg-white"
                }`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span className="text-sm font-semibold text-gray-800 select-none" onClick={() => setRememberMe(!rememberMe)}>Ingat saya</span>
            </label>
          </div>

          {loginError ? (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
              {loginError}
            </div>
          ) : null}

          {/* Submit Button */}
          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-none bg-[#166534] py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-[#14532d] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memverifikasi...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Masuk
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className=" transition-transform group-hover:translate-x-1">
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
        <div className="mb-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500">
          Sistem Informasi Jimpitan Online Dusun Gatak
        </div>
        <div className="text-[11px] text-gray-400">
          &copy; 2026 SIJI GATAK &ndash; KKN UPNYK 84.036
        </div>
      </div>
    </div>
  );
}

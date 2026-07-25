"use client";

import useJimpitanViewModel from "./useJimpitanViewModel";
import LoginScreen from "./LoginScreen";
import PetugasShell from "./petugas/PetugasShell";
import AdminShell from "./admin/AdminShell";
import Toast from "./Toast";
import { useState } from "react";

function ProfileModal({ currentUser, onClose, onSave }) {
  const [nama, setNama] = useState(currentUser?.nama || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setIsLoading(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan profil");

      onSave(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/40 p-5" onClick={onClose}>
      <div className="w-full max-w-[400px] animate-pop-in rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center gap-4 border-b border-[#e6e1d3] pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f5ee] text-xl font-bold text-[#1f7a4d]">
            {currentUser?.nama?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-display text-lg font-extrabold text-[#1c2420]">Profil Akun</h3>
            <div className="text-[12px] font-bold text-brand uppercase tracking-wider">{currentUser?.role === "admin" ? "Admin System" : `Petugas ${currentUser?.kelompok?.nama || ""}`}</div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-danger-bg p-3 text-[13px] font-bold text-danger text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-muted-2">Username</label>
            <input
              type="text"
              value={currentUser?.username || ""}
              disabled
              className="w-full rounded-xl border border-input-border bg-gray-100 px-3 py-2.5 text-[14px] font-semibold text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-[11px] text-muted-2">Username tidak dapat diubah</p>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-muted-2">Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full rounded-xl border border-input-border bg-white px-3 py-2.5 text-[14px] font-semibold focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-muted-2">Ganti Password (Opsional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kosongkan jika tidak ingin ganti"
              className="w-full rounded-xl border border-input-border bg-white px-3 py-2.5 text-[14px] font-semibold focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-gray-100 py-3 text-[14px] font-bold text-gray-600 active:scale-95 transition-transform disabled:opacity-70"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-brand py-3 text-[14px] font-bold text-white shadow-brand active:scale-95 transition-transform disabled:opacity-70"
            >
              {isLoading ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const PETUGAS_SCREENS = ["dashboard", "list", "scan", "detail", "riwayat"];

export default function JimpitanApp() {
  const {
    vm,
    screen, setScreen,
    username, setUsername,
    password, setPassword,
    loginError,
    isLoading,
    isCheckingSession,
    currentUser, setCurrentUser,
    isProfileOpen, setIsProfileOpen,
    toast,
    handleLogin,
    showToast
  } = useJimpitanViewModel();

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div style={{ width: 40, height: 40, border: "4px solid #e0e0e0", borderTop: "4px solid #1f7a4d", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isLoginScreen = screen === "login";
  const isPetugasShell = currentUser?.role === "petugas" && PETUGAS_SCREENS.includes(screen);
  const isAdminShell = screen.startsWith("admin-");

  return (
    <div className="min-h-screen bg-cream text-ink">
      {isLoading && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ width: 40, height: 40, border: "4px solid #e0e0e0", borderTop: "4px solid #1f7a4d", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      {isLoginScreen ? (
        <LoginScreen username={username} password={password} loginError={loginError} isLoading={isLoading}
          onUsernameChange={(e) => setUsername(e.target.value)} onPasswordChange={(e) => setPassword(e.target.value)} onSubmit={handleLogin} />
      ) : null}
      {isPetugasShell ? <PetugasShell vm={vm} /> : null}
      {isAdminShell ? <AdminShell vm={vm} /> : null}
      {isProfileOpen && (
        <ProfileModal
          currentUser={currentUser}
          onClose={() => setIsProfileOpen(false)}
          onSave={(updatedUser) => {
            setCurrentUser(updatedUser);
            setIsProfileOpen(false);
            showToast("Profil berhasil diperbarui.");
          }}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}

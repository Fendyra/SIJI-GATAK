"use client";

import { useState, useRef, useEffect } from "react";
import {
  AdminDashboard,
  JadwalRondaScreen,
  KelompokScreen,
  RumahScreen,
  QrScreen,
  PetugasAkunScreen,
  RiwayatTransaksiScreen,
  RekapScreen,
  SettingScreen,
  AdminPetugasDetailScreen,
} from "./screens";
import { RiwayatDetailScreen } from "../petugas/screens/RiwayatDetailScreen";

export default function AdminShell({ vm }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className={`flex min-h-screen ${vm.isMobile ? "flex-col" : "flex-row"}`}>
      {vm.isDesktop ? (
        <div className="sticky top-0 flex h-screen w-[240px] flex-shrink-0 flex-col overflow-y-auto border-r border-card-border bg-white px-4 py-6">
          <div className="flex items-center gap-2.5 px-2 pb-5 mb-2">
            <div className="flex h-[40px] w-[50px] flex-shrink-0 items-center justify-center">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain scale-[1.7]" />
            </div>
            <div>
              <div className="font-display text-[15px] leading-tight font-extrabold text-gray-900 tracking-tight">Jimpitan Online</div>
              <div className="text-[11px] text-gray-500 font-medium">Panel Admin</div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {vm.adminNavItems.map((item) => (
              <button
                key={item.key}
                onClick={item.onClick}
                className="cursor-pointer rounded-[10px] border-none px-3 py-2.5 text-left text-[13px] font-bold transition-[background,box-shadow,color] hover:bg-[#f0f9f4]"
                style={{ background: item.bg, color: item.color, boxShadow: item.accentShadow }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="border-t border-card-border pt-4 mt-4">
            <button
              onClick={vm.openProfile}
              className="mb-2.5 w-full cursor-pointer flex flex-col items-start rounded-xl p-2 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="text-[13px] font-bold text-gray-900">{vm.adminName || "Admin Utama"}</div>
              <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Edit Profil
              </div>
            </button>
            <button
              onClick={vm.logout}
              className="w-full cursor-pointer rounded-xl border border-red-100 bg-[#fff5f5] px-3 py-2.5 text-center text-[13px] font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      ) : null}

      {vm.isMobile ? (
        <div className="sticky top-0 z-30 border-b border-card-border bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-10 flex-shrink-0 items-center justify-center">
                <img src="/logo.png" alt="Logo" className="h-full w-full object-contain scale-[1.5]" />
              </div>
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                  className="flex flex-col items-start text-left cursor-pointer hover:opacity-80 transition-opacity rounded-lg"
                >
                  <div className="text-[14px] font-extrabold flex items-center gap-1.5 text-gray-900">
                    Jimpitan Online 
                    <div className="flex items-center text-brand">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                    Panel Admin · {vm.adminName || "Admin"}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </button>

                {/* Custom Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                  <div className="absolute top-[110%] left-0 w-[220px] bg-[#4b4d52] rounded-2xl shadow-xl py-2 z-50 overflow-hidden border border-gray-700">
                    {vm.adminNavItems.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => {
                          item.onClick();
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[14px] transition-colors cursor-pointer border-none
                          ${vm.mobileNavValue === item.key 
                            ? "bg-brand text-white font-bold" 
                            : "text-gray-200 font-medium hover:bg-gray-700"
                          }`}
                      >
                        {vm.mobileNavValue === item.key && (
                          <span className="mr-2">✓</span>
                        )}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button onClick={vm.logout} className="cursor-pointer border-none bg-transparent text-[13px] font-bold text-red-600 hover:text-red-700 transition-colors">
              Keluar
            </button>
          </div>
        </div>
      ) : null}

      <div className="min-w-0 flex-1 overflow-y-auto" style={{ padding: vm.contentPadding }}>
        {vm.isAdminDashboard ? <AdminDashboard vm={vm} /> : null}
        {vm.isJadwalRonda ? <JadwalRondaScreen vm={vm} /> : null}
        {vm.isKelompok ? <KelompokScreen vm={vm} /> : null}
        {vm.isAdminRumah ? <RumahScreen vm={vm} /> : null}
        {vm.isQr ? <QrScreen vm={vm} /> : null}
        {vm.isPetugasAkun ? <PetugasAkunScreen vm={vm} /> : null}
        {vm.isAdminRiwayat ? <RiwayatTransaksiScreen vm={vm} /> : null}
        {vm.isRiwayatDetail ? <RiwayatDetailScreen vm={vm} /> : null}
        {vm.isRekap ? <RekapScreen vm={vm} /> : null}
        {vm.isSetting ? <SettingScreen vm={vm} /> : null}
        {vm.isAdminPetugasDetail ? <AdminPetugasDetailScreen vm={vm} /> : null}
      </div>
    </div>
  );
}

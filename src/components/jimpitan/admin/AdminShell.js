"use client";

import {
  AdminDashboard,
  RtScreen,
  KelompokScreen,
  RumahScreen,
  QrScreen,
  PetugasAkunScreen,
  RiwayatTransaksiScreen,
  RekapScreen,
  SettingScreen,
} from "./screens";

export default function AdminShell({ vm }) {
  return (
    <div className={`flex min-h-screen ${vm.isMobile ? "flex-col" : "flex-row"}`}>
      {vm.isDesktop ? (
        <div className="sticky top-0 flex h-screen w-[240px] flex-shrink-0 flex-col overflow-y-auto border-r border-card-border bg-white px-4 py-6">
          <div className="flex items-center gap-2.5 px-2 pb-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand to-brand-deep shadow-[0_6px_14px_-6px_#1f7a4d80]">
              <span className="font-display text-base font-extrabold text-white">J</span>
            </div>
            <div>
              <div className="font-display text-sm leading-tight font-extrabold">Jimpitan Online</div>
              <div className="text-[11px] text-muted-2">Panel Admin</div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {vm.adminNavItems.map((item) => (
              <button
                key={item.key}
                onClick={item.onClick}
                className="cursor-pointer rounded-[10px] border-none px-3 py-2.5 text-left text-[13px] font-bold transition-[background,box-shadow] hover:bg-[#f1efe7]"
                style={{ background: item.bg, color: item.color, boxShadow: item.accentShadow }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="border-t border-card-border pt-3.5">
            <button
              onClick={vm.openProfile}
              className="mb-2.5 w-full cursor-pointer flex flex-col items-start rounded-xl p-2 text-left hover:bg-[#f1efe7] transition-colors"
            >
              <div className="text-[13px] font-bold">{vm.adminName || "Admin"}</div>
              <div className="text-[11px] text-muted-2 font-semibold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Edit Profil
              </div>
            </button>
            <button
              onClick={vm.logout}
              className="w-full cursor-pointer rounded-[10px] border border-danger-border bg-danger-bg px-3 py-2.5 text-center text-[13px] font-bold text-danger hover:bg-[#fbeee0]"
            >
              Keluar
            </button>
          </div>
        </div>
      ) : null}

      {vm.isMobile ? (
        <div className="sticky top-0 z-20 border-b border-card-border bg-white px-[18px] py-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <button onClick={vm.openProfile} className="text-left cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-start rounded-lg p-1 -ml-1">
              <div className="text-[15px] font-extrabold flex items-center gap-1.5">
                Jimpitan Online 
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1f7a4d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="text-[11px] text-muted-2 font-semibold">Panel Admin · {vm.adminName || "Admin"}</div>
            </button>
            <button onClick={vm.logout} className="cursor-pointer border-none bg-transparent text-[13px] font-bold text-danger">
              Keluar
            </button>
          </div>
          <select
            value={vm.mobileNavValue}
            onChange={vm.onMobileNavChange}
            className="w-full rounded-[10px] border border-input-border bg-green-bg px-2.5 py-2.5 font-sans text-[13px] font-bold text-brand"
          >
            {vm.adminNavItems.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="min-w-0 flex-1 overflow-y-auto" style={{ padding: vm.contentPadding }}>
        {vm.isAdminDashboard ? <AdminDashboard vm={vm} /> : null}
        {vm.isRt ? <RtScreen vm={vm} /> : null}
        {vm.isKelompok ? <KelompokScreen vm={vm} /> : null}
        {vm.isAdminRumah ? <RumahScreen vm={vm} /> : null}
        {vm.isQr ? <QrScreen vm={vm} /> : null}
        {vm.isPetugasAkun ? <PetugasAkunScreen vm={vm} /> : null}
        {vm.isAdminRiwayat ? <RiwayatTransaksiScreen vm={vm} /> : null}
        {vm.isRekap ? <RekapScreen vm={vm} /> : null}
        {vm.isSetting ? <SettingScreen vm={vm} /> : null}
      </div>
    </div>
  );
}

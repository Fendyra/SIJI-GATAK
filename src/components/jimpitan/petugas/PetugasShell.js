"use client";

import React from "react";
import { Dashboard, ScanScreen, DetailScreen, RiwayatScreen, SuccessScreen, RiwayatDetailScreen } from "./screens";

const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconBox = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
const IconQr = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>;
const IconList = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>;
const IconHistory = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;

export default function PetugasShell({ vm }) {

  return (
    <div className={`flex min-h-screen ${vm.isMobile ? "flex-col" : "flex-row"}`}>
      {vm.isDesktop ? (
        <div className="sticky top-0 flex h-screen w-[240px] flex-shrink-0 flex-col border-r border-card-border bg-white px-4 py-6">
          <div className="flex items-center gap-2.5 px-2 pb-5">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain scale-125" />
            </div>
            <div>
              <div className="font-display text-sm leading-tight font-extrabold text-gray-900">Jimpitan Online</div>
              <div className="text-[11px] text-muted-2">Dusun Gatak</div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {vm.petugasNavItems.map((item) => {
              const Icon = item.key === "dashboard" ? IconHome : item.key === "scan" ? IconQr : IconHistory;
              
              return (
                <button
                  key={item.key}
                  onClick={item.onClick}
                  className="flex items-center gap-3 cursor-pointer rounded-[10px] border-none px-3 py-[11px] text-left text-[14px] font-bold transition-[background,box-shadow] hover:bg-[#f1efe7] mb-1"
                  style={{ background: item.bg, color: item.color, boxShadow: item.accentShadow }}
                >
                  <Icon />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="flex-1" />
          <div className="border-t border-card-border pt-3.5">
            <button
              onClick={vm.openProfile}
              className="mb-2.5 w-full cursor-pointer flex flex-col items-start rounded-xl p-2 text-left hover:bg-[#f1efe7] transition-colors"
            >
              <div className="text-[13px] font-bold">{vm.petugasName}</div>
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
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-card-border bg-white px-[18px] py-3.5">
          <button onClick={vm.openProfile} className="text-left cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 rounded-lg -ml-1">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain scale-125" />
            </div>
            <div className="flex flex-col">
              <div className="text-[14px] font-extrabold flex items-center gap-1.5 text-gray-900">
                Jimpitan Online 
              </div>
              <div className="text-[10px] text-muted-2 font-semibold mt-0.5">
                {vm.petugasName}{vm.kelompok ? ` · ${vm.kelompok}` : ""}
              </div>
            </div>
          </button>
          <button onClick={vm.logout} className="cursor-pointer border-none bg-transparent text-[13px] font-bold text-danger">
            Keluar
          </button>
        </div>
      ) : null}

      <div className="min-w-0 flex-1 overflow-y-auto flex flex-col" style={{ padding: vm.contentPadding }}>
        <div className="flex-1">
          {vm.isDashboard ? <Dashboard vm={vm} /> : null}
          {vm.isScan ? <ScanScreen vm={vm} /> : null}
          {vm.isDetail ? <DetailScreen vm={vm} /> : null}
          {vm.isPetugasRiwayat ? <RiwayatScreen vm={vm} /> : null}
          {vm.isSuccess ? <SuccessScreen vm={vm} /> : null}
          {vm.isRiwayatDetail ? <RiwayatDetailScreen vm={vm} /> : null}
        </div>
        
        {/* FOOTER */}
        <div className="mt-8 border-t border-gray-100 pt-6 pb-2 flex flex-col items-center justify-center gap-3">
          <div className="text-[12px] text-gray-400 font-medium text-center">Sistem Informasi Jimpitan &middot; Dikembangkan dengan ❤️ untuk Dusun Gatak</div>
          <a href="#" className="flex items-center gap-2 bg-gradient-to-r from-brand to-brand-deep px-4 py-2 rounded-xl text-white shadow-md shadow-brand/20 hover:scale-105 hover:shadow-lg transition-all duration-300 group cursor-pointer no-underline mb-4 sm:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
            <span className="font-bold text-[13px] tracking-wide">Kelompok KKN UPNYK 84.036</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-300"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      </div>

      {vm.isMobile ? (
        <div className="fixed right-0 bottom-0 left-0 z-10 flex border-t border-card-border bg-white px-1.5 py-2 justify-around">
          {vm.petugasNavItems.map((item) => {
            const Icon = item.key === "dashboard" ? IconHome : item.key === "scan" ? IconQr : IconHistory;
            const color = item.active ? "#1f7a4d" : "#8a8578";
            
            return (
              <button
                key={item.key}
                onClick={item.onClick}
                className="flex-1 cursor-pointer flex flex-col items-center justify-center border-none bg-transparent py-1.5 text-[10.5px] font-bold gap-1.5 transition-colors"
                style={{ color }}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

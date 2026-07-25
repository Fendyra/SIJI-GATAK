"use client";

import React, { useState } from "react";
import { Dashboard, ListScreen, ScanScreen, DetailScreen, RiwayatScreen } from "./screens";

const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconBox = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
const IconQr = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>;
const IconList = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>;
const IconHistory = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;

export default function PetugasShell({ vm }) {
  const [openMenus, setOpenMenus] = useState({ pengambilan: true });
  const toggleMenu = (key) => setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));

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
              const Icon = item.key === "dashboard" ? IconHome : item.key === "pengambilan" ? IconBox : IconHistory;
              
              if (item.isAccordion) {
                const isOpen = openMenus[item.key];
                return (
                  <div key={item.key} className="flex flex-col mb-1">
                    <button
                      onClick={() => toggleMenu(item.key)}
                      className="flex items-center justify-between cursor-pointer rounded-[10px] border-none px-3 py-[11px] text-left text-[14px] font-bold transition-[background,box-shadow] hover:bg-[#f1efe7]"
                      style={{ background: item.bg, color: item.color, boxShadow: item.accentShadow }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon />
                        {item.label}
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    {isOpen && (
                      <div className="flex flex-col mt-1.5 ml-[22px] border-l-2 border-[#eaf3ec] pl-2 py-1 gap-1">
                        {item.subItems.map(sub => {
                          const SubIcon = sub.key === "scan" ? IconQr : sub.key === "list" ? IconList : IconHistory;
                          return (
                            <button
                              key={sub.key}
                              onClick={sub.onClick}
                              className="flex items-center gap-2.5 cursor-pointer rounded-[8px] border-none px-3 py-2 text-left text-[13px] font-bold transition-colors hover:bg-[#f1efe7]"
                              style={{ background: sub.bg, color: sub.color }}
                            >
                              <SubIcon />
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
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
                {vm.petugasName} · {vm.rt}
              </div>
            </div>
          </button>
          <button onClick={vm.logout} className="cursor-pointer border-none bg-transparent text-[13px] font-bold text-danger">
            Keluar
          </button>
        </div>
      ) : null}

      <div className="min-w-0 flex-1 overflow-y-auto" style={{ padding: vm.contentPadding }}>
        {vm.isDashboard ? <Dashboard vm={vm} /> : null}
        {vm.isList ? <ListScreen vm={vm} /> : null}
        {vm.isScan ? <ScanScreen vm={vm} /> : null}
        {vm.isDetail ? <DetailScreen vm={vm} /> : null}
        {vm.isPetugasRiwayat ? <RiwayatScreen vm={vm} /> : null}
      </div>

      {vm.isMobile ? (
        <div className="fixed right-0 bottom-0 left-0 z-10 flex border-t border-card-border bg-white px-1.5 py-2">
          {vm.petugasNavItems.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              className="flex-1 cursor-pointer border-none bg-transparent py-2 text-xs font-bold"
              style={{ color: item.mobileColor }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

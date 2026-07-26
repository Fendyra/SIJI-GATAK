import React, { useState } from "react";
import { QRScanner } from "../components/QRScanner";
import { Stepper } from "../../ui/SharedUI";

const SvgHouse = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="50" fill="#f1efe7" />
    <path d="M60 40L35 60V85H85V60L60 40Z" fill="#eaf3ec" stroke="#1f7a4d" strokeWidth="3" strokeLinejoin="round" />
    <rect x="52" y="65" width="16" height="20" fill="none" stroke="#1f7a4d" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="25" cy="75" r="10" fill="#1f7a4d" />
    <circle cx="95" cy="75" r="10" fill="#1f7a4d" />
    <path d="M40 85H80" stroke="#1f7a4d" strokeWidth="4" strokeLinecap="round" />
    <path d="M85 90C90 90 95 95 95 100C85 100 80 95 85 90Z" fill="#85b99a" />
  </svg>
);

const IconInfo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);

export function ScanScreen({ vm }) {
  const [isManualMode, setIsManualMode] = useState(false);

  const handleScan = (decodedText) => {
    vm.onQrScanned(decodedText);
  };

  return (
    <div className="max-w-[480px] w-full mx-auto">
      <div className="mb-6">
        <div className="font-display text-[22px] font-extrabold text-gray-900 mb-1">Pengambilan Jimpitan</div>
        <div className="text-[13px] font-medium text-muted-2">
          {vm.kelompok} · {vm.rt}
        </div>
      </div>

      <Stepper currentStep={1} />

      {!isManualMode ? (
        <>
          <div className="bg-white border border-card-border rounded-[20px] p-4 sm:p-5 mb-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <h2 className="text-[17px] font-extrabold text-gray-900 mb-1">Scan QR Rumah</h2>
            <p className="text-[13px] text-muted-2 mb-4">Arahkan kamera ke QR code di rumah untuk melanjutkan</p>
            
            <div className="max-w-[360px] mx-auto w-full">
              <QRScanner onScan={handleScan} />
            </div>
          </div>

          <div className="bg-[#eaf3ec] rounded-[14px] p-4 flex items-start gap-3 mb-6 border border-[#c2e0cd]">
            <div className="text-brand mt-0.5">
              <IconInfo />
            </div>
            <div>
              <div className="text-[13px] font-bold text-brand mb-0.5">Tips scanning</div>
              <div className="text-[12px] text-brand/80 leading-relaxed">
                Pastikan pencahayaan cukup dan QR code tidak buram
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-gray-200" />
            <div className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Atau</div>
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>

          <button
            onClick={() => setIsManualMode(true)}
            className="w-full flex items-center justify-center gap-2 cursor-pointer rounded-[14px] border border-brand bg-white px-6 py-3.5 text-[14px] font-bold text-brand transition-colors hover:bg-brand/5 active:scale-[0.98]"
          >
            <IconEdit />
            Masukkan kode secara manual
          </button>
        </>
      ) : (
        <>
          <div className="bg-white border border-card-border rounded-[20px] p-4 sm:p-5 mb-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-extrabold text-gray-900">Pencarian Manual</h2>
              <button 
                onClick={() => setIsManualMode(false)}
                className="text-[12px] font-bold text-brand hover:underline cursor-pointer bg-transparent border-none"
              >
                Kembali ke Scanner
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <input
                type="text"
                value={vm.search}
                onChange={vm.onSearchChange}
                placeholder="Cari nama atau alamat rumah..."
                className="w-full rounded-[14px] border border-input-border pl-10 pr-4 py-3.5 font-sans text-[13px] font-semibold outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors bg-gray-50 focus:bg-white"
                autoFocus
              />
            </div>
          </div>

          {!vm.search && vm.filteredHouses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <SvgHouse />
              <div className="mt-6 text-[15px] font-extrabold text-gray-900">Belum ada rumah yang ditampilkan</div>
              <div className="mt-2 text-[13px] text-muted-2 text-center max-w-[300px]">
                Data rumah untuk kelompok ini belum tersedia.
              </div>
            </div>
          )}

          {(vm.filteredHouses.length > 0 || vm.search) && (
            <div className="flex flex-col gap-2.5">
              {vm.filteredHouses.map((h, index) => (
                <div
                  key={h.id}
                  onClick={h.onClick}
                  className="animate-fade-in-up flex items-center justify-between rounded-[14px] border border-card-border bg-white px-4 py-3.5 transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-16px_rgba(28,36,32,0.35)]"
                  style={{ cursor: h.cursor, opacity: h.rowOpacity, animationDelay: `${index * 10}ms` }}
                >
                  <div>
                    <div className="text-sm font-bold">{h.nama}</div>
                    <div className="text-xs text-muted-2">{h.alamat}</div>
                  </div>
                  <div
                    className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold"
                    style={{ background: h.statusBg, color: h.statusColor }}
                  >
                    {h.statusLabel}
                  </div>
                </div>
              ))}
              {vm.noHousesFound ? (
                <div className="py-10 text-center text-[13px] text-muted">Rumah tidak ditemukan.</div>
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  );
}

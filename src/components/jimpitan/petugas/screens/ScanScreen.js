import React, { useState } from "react";
import { QRScanner } from "../components/QRScanner";

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

export function ScanScreen({ vm }) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScan = (decodedText) => {
    setIsScannerOpen(false);
    vm.onQrScanned(decodedText);
  };

  return (
    <div className="max-w-[800px] w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="font-display text-2xl font-extrabold text-gray-900 mb-1">Pengambilan Jimpitan</div>
          <div className="text-[13px] text-muted-2">
            {vm.kelompok} · {vm.rt}
          </div>
        </div>
      </div>

      <div className="bg-white border border-card-border rounded-[16px] p-5 mb-8 shadow-sm">
        <h2 className="text-lg font-extrabold text-gray-900 mb-1.5">Scan QR Rumah</h2>
        <p className="text-[13px] text-muted-2 mb-4">Scan QR code di rumah untuk mencatat pengambilan jimpitan</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex-shrink-0 flex items-center justify-center gap-2.5 cursor-pointer rounded-[12px] border-none bg-brand px-6 py-3.5 text-[14px] font-bold text-white transition-transform hover:bg-brand-dark active:scale-[0.98] sm:w-auto w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
            Scan QR Rumah
          </button>
          
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              type="text"
              value={vm.search}
              onChange={vm.onSearchChange}
              placeholder="Cari nama atau alamat rumah..."
              className="w-full rounded-[12px] border border-card-border pl-10 pr-4 py-3.5 font-sans text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors bg-white"
            />
          </div>
        </div>
      </div>

      {!vm.search && !isScannerOpen && vm.filteredHouses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <SvgHouse />
          <div className="mt-6 text-[15px] font-extrabold text-gray-900">Belum ada rumah yang ditampilkan</div>
          <div className="mt-2 text-[13px] text-muted-2 text-center max-w-[300px]">
            Data rumah untuk kelompok ini belum tersedia.
          </div>
        </div>
      )}

      {isScannerOpen && (
        <div className="mb-8">
          <QRScanner onScan={handleScan} onClose={() => setIsScannerOpen(false)} />
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
            <div className="py-[30px] text-center text-[13px] text-muted-2">Rumah tidak ditemukan.</div>
          ) : null}
        </div>
      )}
    </div>
  );
}

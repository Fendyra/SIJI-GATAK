import React from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
export function ScanScreen({ vm }) {
  return (
    <div className="max-w-[480px]">
      <button onClick={vm.goToList} className="mb-4 cursor-pointer border-none bg-transparent p-0 text-[13px] font-bold text-muted">
        ‹ Kembali
      </button>
      <div className="font-display mb-1 text-xl font-extrabold">Scan QR Rumah</div>
      <div className="mb-[22px] text-[13px] text-muted">
        Arahkan kamera ke QR Code yang tertempel di rumah warga.
      </div>

      <div className="relative mb-5 flex aspect-square items-center justify-center overflow-hidden rounded-[18px] bg-ink">
        <div
          className={`flex h-[68%] w-[68%] items-center justify-center rounded-2xl border-[3px] border-dashed border-white/33 ${
            vm.isScanning ? "animate-scan-pulse" : ""
          }`}
        >
          {vm.isScanning ? (
            <div className="animate-scan-pulse text-[13px] font-bold text-white/67">Memindai…</div>
          ) : null}
          {vm.isScanIdle ? (
            <div className="text-[13px] font-bold text-white/33">Area Pemindaian</div>
          ) : null}
        </div>
      </div>

      {vm.isScanEmpty ? (
        <div className="mb-3.5 rounded-[10px] bg-green-bg px-3.5 py-3 text-center text-[13px] font-bold text-brand">
          Semua rumah pada rute sudah diambil hari ini.
        </div>
      ) : null}

      <button
        onClick={vm.simulateScan}
        disabled={vm.isScanning}
        className="mb-2.5 w-full cursor-pointer rounded-xl border-none bg-brand py-[15px] text-[15px] font-bold text-white transition-transform hover:bg-brand-dark active:scale-[0.98] disabled:cursor-default disabled:opacity-70"
      >
        {vm.scanButtonLabel}
      </button>
      <button
        onClick={vm.goToList}
        className="w-full cursor-pointer rounded-xl border border-input-border bg-white py-[13px] text-sm font-bold text-ink"
      >
        Cari Manual
      </button>
    </div>
  );
}

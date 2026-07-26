"use client";

import React, { useEffect, useRef, useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";

// ─── Shared Modal Overlay ────────────────────────────────────────────────────
export function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-5" onClick={onClose}>
      <div className="w-full max-w-[420px] animate-pop-in rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, subtitle }) {
  return (
    <div className="mb-5">
      <div className="text-base font-extrabold">{title}</div>
      {subtitle && <div className="text-xs text-muted-2 mt-0.5">{subtitle}</div>}
    </div>
  );
}

export function ModalFooter({ onCancel, onSave, saveLabel = "Simpan" }) {
  return (
    <div className="flex gap-2.5 mt-5">
      <button onClick={onCancel} className="flex-1 cursor-pointer rounded-[10px] border border-input-border bg-white py-[11px] text-[13px] font-bold">Batal</button>
      <button onClick={onSave} className="flex-1 cursor-pointer rounded-[10px] border-none bg-brand py-[11px] text-[13px] font-bold text-white hover:bg-brand-dark">{saveLabel}</button>
    </div>
  );
}

export function ConfirmDelete({ title, subtitle, onCancel, onConfirm }) {
  return (
    <Modal onClose={onCancel}>
      <ModalHeader title={title} subtitle={subtitle} />
      <p className="text-[13px] text-muted mb-5">Tindakan ini tidak dapat dibatalkan.</p>
      <div className="flex gap-2.5">
        <button onClick={onCancel} className="flex-1 cursor-pointer rounded-[10px] border border-input-border bg-white py-[11px] text-[13px] font-bold">Batal</button>
        <button onClick={onConfirm} className="flex-1 cursor-pointer rounded-[10px] border-none bg-danger py-[11px] text-[13px] font-bold text-white">Hapus</button>
      </div>
    </Modal>
  );
}

export function InputField({ label, type = "text", value, onChange, placeholder, min }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[13px] font-bold text-label">{label}</label>
      <input type={type} value={value || ""} onChange={onChange} placeholder={placeholder} min={min}
        className="w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-sm" />
    </div>
  );
}

export function SelectField({ label, value, onChange, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[13px] font-bold text-label">{label}</label>
      <select value={value || ""} onChange={onChange} className="w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-sm bg-white">
        {children}
      </select>
    </div>
  );
}

// ─── QR Code Canvas Component ────────────────────────────────────────────────
export function QrCanvas({ value, size = 120, id }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!value || !canvasRef.current) return;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: { dark: "#1c2420", light: "#ffffff" },
      });
    });
  }, [value, size]);

  return <canvas ref={canvasRef} id={id} width={size} height={size} style={{ borderRadius: 8 }} />;
}

export function downloadQr(canvasId, filename) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ─── AdminDashboard ──────────────────────────────────────────────────────────

// ─── Stepper ─────────────────────────────────────────────────────────────────
export function Stepper({ currentStep }) {
  const steps = [
    { num: 1, title: "Scan QR", subtitle: "Pindai QR rumah" },
    { num: 2, title: "Konfirmasi", subtitle: "Cek detail data" },
    { num: 3, title: "Selesai", subtitle: "Simpan transaksi" },
  ];

  return (
    <div className="mb-6 flex items-center justify-between rounded-[16px] border border-card-border bg-white p-3 md:p-5 shadow-sm overflow-x-auto whitespace-nowrap">
      {steps.map((step, index) => {
        const isActive = step.num === currentStep;
        const isPast = step.num < currentStep;
        return (
          <React.Fragment key={step.num}>
            <div className="flex items-center gap-3">
              <div 
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors ${isActive ? 'bg-brand text-white' : isPast ? 'bg-brand/20 text-brand' : 'bg-gray-100 text-gray-400'}`}
              >
                {step.num}
              </div>
              <div className="flex flex-col">
                <span className={`text-[13px] font-extrabold ${isActive || isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.title}
                </span>
                <span className="text-[11px] text-muted-2 hidden sm:block">{step.subtitle}</span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-2 md:mx-4 flex-1 h-[2px] w-4 md:w-8 bg-gray-100 rounded-full" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function CorrectionModal({ vm }) {
  if (!vm.isCorrectionOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-5 animate-fade-in" onClick={vm.closeCorrection}>
      <div className="w-full max-w-[360px] rounded-[24px] bg-white p-6 shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 text-xl font-black text-gray-900 tracking-tight">Koreksi Data</div>
        <div className="mb-6 text-[13.5px] text-muted-2 leading-relaxed">
          Sesuaikan nominal atau batalkan transaksi untuk <span className="font-bold text-gray-900">{vm.correctionHouseName}</span>.
        </div>
        
        <label className="mb-2 block text-[13px] font-extrabold text-gray-700 uppercase tracking-wide">Nominal Baru (Rp)</label>
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
          <input 
            type="number" 
            value={vm.correctionNominal} 
            onChange={vm.onCorrectionNominalChange}
            className="w-full rounded-[14px] bg-gray-50 border-2 border-transparent px-10 py-3.5 font-sans text-[17px] font-black text-gray-900 outline-none focus:border-brand focus:bg-white transition-colors" 
          />
        </div>
        
        <div className="flex flex-col gap-3">
          <button onClick={vm.saveCorrection} className="w-full cursor-pointer rounded-[14px] border-none bg-brand py-3.5 text-[15px] font-extrabold text-white hover:bg-brand-dark transition-colors shadow-[0_4px_12px_-4px_rgba(31,122,77,0.4)]">
            Simpan Perubahan
          </button>
          <div className="flex gap-3">
            <button onClick={vm.closeCorrection} className="flex-1 cursor-pointer rounded-[14px] bg-gray-100 py-3.5 text-[14px] font-bold text-gray-600 hover:bg-gray-200 transition-colors">
              Tutup
            </button>
            <button onClick={vm.deleteTransaction} className="flex-1 cursor-pointer rounded-[14px] bg-[#fef2f2] py-3.5 text-[14px] font-bold text-red-600 hover:bg-red-100 transition-colors">
              Hapus Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

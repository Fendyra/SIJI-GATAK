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

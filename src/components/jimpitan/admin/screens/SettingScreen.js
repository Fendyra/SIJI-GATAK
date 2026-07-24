import React, { useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField, SelectField, QrCanvas, downloadQr } from "../../ui/SharedUI";

export function SettingScreen({ vm }) {
  const total = (Number(vm.persentaseRt) || 0) + (Number(vm.persentaseRonda) || 0);
  const isValid = total === 100;

  return (
    <div className="max-w-[520px]">
      <div className="font-display mb-0.5 text-xl font-extrabold">Pengaturan Sistem</div>
      <div className="mb-[18px] text-[13px] text-muted">Nominal jimpitan default dan pembagian kas</div>

      <div className="rounded-2xl border border-card-border bg-white p-[22px]">
        <label className="mb-2 block text-[13px] font-bold text-label">Nominal Jimpitan Default</label>
        <input type="number" value={vm.nominalDefaultSetting} onChange={vm.onNominalDefaultChange}
          className="mb-1.5 w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-lg font-bold" />
        <div className="mb-[22px] text-xs text-muted-2">Perubahan tidak memengaruhi transaksi yang sudah tercatat.</div>

        <div className="mb-4 border-t border-card-border pt-[18px]">
          <div className="mb-3 text-[13px] font-bold text-label">Persentase Pembagian Kas</div>
          <div className="flex gap-3 mb-2">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-muted-2">Kas RT (%)</label>
              <input type="number" value={vm.persentaseRt} onChange={vm.onPersentaseRtChange} min="0" max="100"
                className="w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-base font-bold" />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-muted-2">Kas Ronda (%)</label>
              <input type="number" value={vm.persentaseRonda} onChange={vm.onPersentaseRondaChange} min="0" max="100"
                className="w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-base font-bold" />
            </div>
          </div>
          {!isValid && <div className="text-xs font-semibold text-danger">Total harus 100% (saat ini: {total}%)</div>}
          {isValid && <div className="text-xs font-semibold text-brand">✓ Total 100% — valid</div>}
        </div>

        <button onClick={vm.saveSetting} className="w-full cursor-pointer rounded-[10px] border-none bg-brand py-[13px] text-[15px] font-bold text-white hover:bg-brand-dark">
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}

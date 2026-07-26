import React from "react";
import { Stepper } from "../../ui/SharedUI";

export function DetailScreen({ vm }) {
  const h = vm.selectedHouse;
  return (
    <div className="max-w-[480px] w-full mx-auto">
      <div className="mb-6">
        <div className="font-display text-[22px] font-extrabold text-gray-900 mb-1">Pengambilan Jimpitan</div>
        <div className="text-[13px] font-medium text-muted-2">
          {vm.kelompok} · {vm.rt}
        </div>
      </div>

      <Stepper currentStep={2} />

      <button onClick={vm.goToList} className="mb-4 cursor-pointer border-none bg-transparent p-0 text-[13px] font-bold text-muted transition-colors hover:text-brand">
        ‹ Kembali ke Pindai QR
      </button>

      <div className="mb-4 rounded-2xl border border-card-border bg-white p-[22px]">
        <div
          className="mb-3 inline-block rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ background: h.statusBg, color: h.statusColor }}
        >
          {h.statusLabel}
        </div>
        <div className="font-display text-[19px] font-extrabold">{h.nama}</div>
        <div className="mb-1 text-[13px] text-muted">{h.alamat}</div>
        <div className="text-xs text-muted-2">{vm.rt}</div>
      </div>

      {vm.isEditableSelected ? (
        <div className="rounded-2xl border border-card-border bg-[#f8f9fa] p-5 shadow-inner">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <label className="text-[14px] font-extrabold text-gray-900">Konfirmasi Nominal</label>
          </div>
          
          <div className="relative mb-5">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-[16px] font-bold text-gray-400">Rp</span>
            </div>
            <input
              type="number"
              value={vm.nominalInput}
              onChange={vm.onNominalChange}
              className="w-full rounded-[14px] border-2 border-brand/20 bg-white pl-12 pr-4 py-3.5 font-display text-[20px] font-extrabold text-brand outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={vm.saveKosong}
              className="flex-1 cursor-pointer rounded-xl border border-input-border bg-white py-3.5 text-[14px] font-bold text-warn transition-colors hover:bg-warn/5 active:scale-[0.98]"
            >
              Rumah Kosong
            </button>
            <button
              onClick={vm.saveSudah}
              className="flex-[2] cursor-pointer rounded-xl border-none bg-brand py-3.5 text-[14px] font-bold text-white transition-transform hover:bg-brand-dark active:scale-[0.98] shadow-[0_4px_12px_rgba(31,122,77,0.25)]"
            >
              Simpan Transaksi
            </button>
          </div>
        </div>
      ) : null}
      {vm.isReadonlySelected ? (
        <div className="rounded-2xl border border-card-border bg-white p-[22px]">
          <div className="mb-2 flex justify-between text-[13px]">
            <span className="text-muted-2">Waktu</span>
            <span className="font-bold">{h.lastTime}</span>
          </div>
          <div className="mb-4 flex justify-between text-[13px]">
            <span className="text-muted-2">Nominal</span>
            <span className="font-bold">{h.nominalDisplay}</span>
          </div>
          <button
            onClick={() => vm.editTransactionForHouse(h.id)}
            className="w-full cursor-pointer rounded-xl border border-input-border bg-white py-3 text-sm font-bold text-brand hover:bg-gray-50 transition-colors"
          >
            Koreksi Transaksi
          </button>
        </div>
      ) : null}
    </div>
  );
}

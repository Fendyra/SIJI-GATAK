import React from "react";
export function DetailScreen({ vm }) {
  const h = vm.selectedHouse;
  return (
    <div className="max-w-[480px]">
      <button onClick={vm.goToList} className="mb-4 cursor-pointer border-none bg-transparent p-0 text-[13px] font-bold text-muted">
        ‹ Kembali
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
        <div className="rounded-2xl border border-card-border bg-white p-[22px]">
          <label className="mb-2 block text-[13px] font-bold text-label">Nominal Diterima</label>
          <input
            type="number"
            value={vm.nominalInput}
            onChange={vm.onNominalChange}
            className="mb-4 w-full rounded-[10px] border border-input-border px-3.5 py-[13px] font-sans text-lg font-bold"
          />
          <button
            onClick={vm.saveSudah}
            className="mb-2.5 w-full cursor-pointer rounded-xl border-none bg-brand py-[15px] text-[15px] font-bold text-white transition-transform hover:bg-brand-dark active:scale-[0.98]"
          >
            Simpan Transaksi
          </button>
          <button
            onClick={vm.saveKosong}
            className="w-full cursor-pointer rounded-xl border border-input-border bg-white py-[13px] text-sm font-bold text-warn"
          >
            Tandai Rumah Kosong
          </button>
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

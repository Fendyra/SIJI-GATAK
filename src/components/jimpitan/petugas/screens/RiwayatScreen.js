import React from "react";
export function RiwayatScreen({ vm }) {
  return (
    <div className="max-w-[720px]">
      <div className="font-display mb-0.5 text-xl font-extrabold">Riwayat & Tracking Harian</div>
      <div className="mb-[18px] text-[13px] text-muted flex items-center gap-3">
        <span>Tanggal:</span>
        <input 
          type="date" 
          value={vm.riwayatDate}
          onChange={vm.onRiwayatDateChange}
          className="rounded-lg border border-input-border bg-white px-2 py-1 text-sm font-bold"
        />
      </div>

      <div className="mb-4 flex gap-2">
        {vm.riwayatFilters.map((f) => (
          <button
            key={f.key}
            onClick={f.onClick}
            className="cursor-pointer rounded-full border border-input-border px-3.5 py-2 text-[13px] font-bold"
            style={{ background: f.bg, color: f.color }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2.5">
        {vm.riwayatFiltered.map((t, index) => (
          <div
            key={t.id}
            onClick={() => t.id && vm.openCorrection(t)}
            className="animate-fade-in-up flex items-center justify-between rounded-[14px] border border-card-border bg-white px-4 py-3.5 cursor-pointer hover:bg-gray-50"
            style={{ animationDelay: `${index * 10}ms` }}
          >
            <div>
              <div className="text-sm font-bold">{t.nama}</div>
              <div className="text-xs text-muted-2">{t.time}</div>
            </div>
            <div
              className="rounded-full px-2.5 py-1 text-[13px] font-extrabold"
              style={{ background: t.statusBg, color: t.statusColor }}
            >
              {t.displayValue}
            </div>
          </div>
        ))}
      </div>
      {vm.noRiwayat ? (
        <div className="py-[30px] text-center text-[13px] text-muted-2">Belum ada transaksi.</div>
      ) : null}

      <div className="flex items-center justify-between rounded-[14px] bg-green-bg p-4">
        <div className="text-[13px] font-bold text-brand-deep">Total Terkumpul</div>
        <div className="text-[17px] font-extrabold text-brand-deep">{vm.totalTerkumpulDisplay}</div>
      </div>

      {vm.isCorrectionOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-5" onClick={vm.closeCorrection}>
          <div className="w-full max-w-[380px] rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-1 text-base font-extrabold">Koreksi Transaksi</div>
            <div className="mb-[18px] text-xs text-muted-2">{vm.correctionHouseName}</div>
            <label className="mb-2 block text-[13px] font-bold text-[#6f7d74]">Nominal</label>
            <input type="number" value={vm.correctionNominal} onChange={vm.onCorrectionNominalChange}
              className="mb-4 w-full rounded-[10px] border border-[#e6e1d3] px-3.5 py-3 font-sans text-base font-bold" />
            <div className="flex gap-2.5">
              <button onClick={vm.closeCorrection} className="flex-1 cursor-pointer rounded-[10px] border border-[#e6e1d3] bg-white py-[11px] text-[13px] font-bold text-[#1c2420]">Batal</button>
              <button onClick={vm.deleteTransaction} className="flex-1 cursor-pointer rounded-[10px] border border-[#fce4e4] bg-[#fdf2f2] py-[11px] text-[13px] font-bold text-[#e04f4f] hover:bg-[#fce4e4]">Hapus</button>
              <button onClick={vm.saveCorrection} className="flex-1 cursor-pointer rounded-[10px] border-none bg-[#1f7a4d] py-[11px] text-[13px] font-bold text-white hover:bg-[#165a38]">Simpan</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

import React from "react";
export function ListScreen({ vm }) {
  return (
    <div className="max-w-[720px]">
      <div className="font-display mb-0.5 text-xl font-extrabold">Pengambilan Jimpitan</div>
      <div className="mb-[18px] text-[13px] text-muted">
        {vm.kelompok} · {vm.rt}
      </div>

      <button
        onClick={vm.openScan}
        className="mb-3.5 w-full cursor-pointer rounded-xl border-none bg-brand py-[15px] text-[15px] font-bold text-white transition-transform hover:bg-brand-dark active:scale-[0.98]"
      >
        Scan QR Rumah
      </button>

      <input
        type="text"
        value={vm.search}
        onChange={vm.onSearchChange}
        placeholder="Cari nama atau alamat rumah…"
        className="mb-4 w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-sm"
      />

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
      </div>
      {vm.noHousesFound ? (
        <div className="py-[30px] text-center text-[13px] text-muted-2">Rumah tidak ditemukan.</div>
      ) : null}
    </div>
  );
}

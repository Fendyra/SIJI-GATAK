import React from "react";
export function ListScreen({ vm }) {
  return (
    <div className="max-w-[720px] w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="font-display text-2xl font-extrabold text-gray-900 mb-1">Daftar Rumah</div>
          <div className="text-[13px] text-muted-2">
            {vm.kelompok} · {vm.rt}
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <input
          type="text"
          value={vm.search}
          onChange={vm.onSearchChange}
          placeholder="Cari nama atau alamat rumah…"
          className="w-full rounded-[12px] border border-card-border pl-10 pr-4 py-3.5 font-sans text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors bg-white shadow-sm"
        />
      </div>

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

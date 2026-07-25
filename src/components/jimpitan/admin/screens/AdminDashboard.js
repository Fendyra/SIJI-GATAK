import React, { useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField, SelectField, QrCanvas, downloadQr } from "../../ui/SharedUI";

export function AdminDashboard({ vm }) {
  return (
    <div className="max-w-[960px]">
      <div className="font-display mb-0.5 text-[22px] font-extrabold flex justify-between items-center">
        <span>Ringkasan</span>
        <div className="flex gap-2">
          <select 
            value={vm.adminDashboardMonth} 
            onChange={(e) => vm.setAdminDashboardMonth(e.target.value)}
            className="rounded-lg border border-input-border bg-white px-3 py-1.5 text-sm font-bold text-brand-deep cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {[...Array(12)].map((_, i) => {
              const val = (i + 1).toString().padStart(2, '0');
              const label = new Date(2000, i, 1).toLocaleString('id-ID', { month: 'long' });
              return <option key={val} value={val}>{label}</option>;
            })}
          </select>
          <select
            value={vm.adminDashboardYear}
            onChange={(e) => vm.setAdminDashboardYear(e.target.value)}
            className="rounded-lg border border-input-border bg-white px-3 py-1.5 text-sm font-bold text-brand-deep cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {[...Array(5)].map((_, i) => {
              const year = (new Date().getFullYear() - 2) + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
      </div>
      <div className="mb-[22px] text-sm text-muted">{vm.today} · Data ringkasan berdasarkan periode terpilih</div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="min-w-[160px] flex-1 rounded-[14px] border border-card-border bg-white p-[18px]">
          <div className="mb-1.5 text-xs font-semibold text-muted-2">Total Rumah</div>
          <div className="font-display text-[22px] font-extrabold">{vm.totalRumahAdmin}</div>
        </div>
        <div className="min-w-[160px] flex-1 rounded-[14px] border border-card-border bg-white p-[18px]">
          <div className="mb-1.5 text-xs font-semibold text-muted-2">Total Kelompok</div>
          <div className="font-display text-[22px] font-extrabold">{vm.totalKelompok}</div>
        </div>
        <div className="min-w-[160px] flex-1 rounded-[14px] border border-card-border bg-white p-[18px]">
          <div className="mb-1.5 text-xs font-semibold text-muted-2">Total Pemasukan Bulan Ini</div>
          <div className="font-display text-[22px] font-extrabold text-brand">{vm.totalPemasukanDisplay}</div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-card-border bg-white p-[22px]">
        <div className="mb-4 text-sm font-bold text-label">Tren Pemasukan 7 Hari Terakhir</div>
        <div className="flex h-[140px] items-end gap-2.5">
          {vm.trendBars.map((bar, i) => (
            <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div className="relative w-full max-w-[34px] rounded-t-md bg-brand transition-all duration-500" style={{ height: `${bar.heightPct}%` }}>
                {bar.total > 0 && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {toRupiah(bar.total)}
                  </div>
                )}
              </div>
              <div className="text-[11px] font-semibold text-muted-2">{bar.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-card-border bg-white p-[22px]">
        <div className="mb-3.5 text-sm font-bold text-label">Progres Pengambilan Hari Ini per RT</div>
        <div className="flex flex-col gap-3">
          {vm.rtProgress.map((rt) => (
            <div key={rt.nama}>
              <div className="mb-1.5 flex justify-between text-[13px]">
                <span className="font-bold">{rt.nama}</span>
                <span className="text-muted">{rt.doneCount}/{rt.totalCount} rumah</span>
              </div>
              <div className="h-2 overflow-hidden rounded-md bg-[#f1efe7]">
                <div className="h-full rounded-md bg-brand transition-all duration-700" style={{ width: `${rt.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RtScreen ────────────────────────────────────────────────────────────────

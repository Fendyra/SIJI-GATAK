import React, { useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField, SelectField, QrCanvas, downloadQr } from "../../ui/SharedUI";

export function RiwayatTransaksiScreen({ vm }) {
  const [detailData, setDetailData] = useState(null);

  return (
    <div className="max-w-[960px]">
      <div className="font-display mb-0.5 text-xl font-extrabold">Riwayat Transaksi</div>
      <div className="mb-4 text-[13px] text-muted">Seluruh transaksi dari semua petugas &amp; periode</div>

      <div className="mb-4 flex flex-col gap-3">
        <div className="flex bg-[#f1efe7] p-1 rounded-xl w-max">
          <button
            onClick={() => vm.setAdminRiwayatMode("semua")}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold cursor-pointer transition-colors ${vm.adminRiwayatMode === "semua" ? "bg-white shadow-sm text-brand" : "text-muted-2"}`}
          >
            Semua Riwayat
          </button>
          <button
            onClick={() => vm.setAdminRiwayatMode("harian")}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold cursor-pointer transition-colors ${vm.adminRiwayatMode === "harian" ? "bg-white shadow-sm text-brand" : "text-muted-2"}`}
          >
            Tracking Harian
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select value={vm.riwayatKelompokFilter} onChange={vm.onRiwayatKelompokFilterChange} className="rounded-lg border border-input-border px-2.5 py-[9px] font-sans text-[13px] focus:outline-none focus:border-brand">
            {vm.kelompokFilterOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {vm.adminRiwayatMode === "harian" && (
            <input 
              type="date" 
              value={vm.adminRiwayatDate}
              onChange={vm.onAdminRiwayatDateChange}
              className="rounded-lg border border-input-border bg-white px-2.5 py-[7px] text-sm font-bold focus:outline-none focus:border-brand"
            />
          )}
          <select value={vm.adminRiwayatFilter} onChange={vm.onAdminRiwayatFilterChange} className="rounded-lg border border-input-border px-2.5 py-[9px] font-sans text-[13px] focus:outline-none focus:border-brand">
            <option value="all">Semua Status</option>
            <option value="sudah">Sudah</option>
            <option value="kosong">Kosong</option>
            {vm.adminRiwayatMode === "harian" && <option value="belum">Belum</option>}
          </select>
        </div>
      </div>
      
      {vm.adminRiwayatMode === "harian" && vm.riwayatKelompokFilter === "all" && (
        <div className="mb-4 text-sm text-warn bg-warn/10 p-3 rounded-lg border border-warn/20">
          Pilih salah satu Kelompok Ronda untuk melihat daftar Tracking Harian.
        </div>
      )}

      <div className="overflow-hidden rounded-[14px] border border-card-border bg-white">
        {vm.adminRiwayatFiltered.map((t) => {
          // Fallback properties depending on which view we are in
          const houseName = t.nama_penghuni || t.nama;
          const groupName = t.rt || t.kelompok; // actually t.kelompok should exist on both now

          return (
            <div key={t.txId || t.id} onClick={() => setDetailData(t)} className="flex cursor-pointer items-center justify-between gap-2.5 border-b border-[#f1efe7] px-[18px] py-3.5 transition-colors last:border-b-0 hover:bg-[#f9f8f3]">
              <div>
                <div className="text-sm font-bold">{houseName}</div>
                <div className="text-xs text-muted-2">{t.kelompok} · {t.time || t.lastTime}</div>
              </div>
              <div className="rounded-full px-2.5 py-1 text-[13px] font-extrabold whitespace-nowrap" style={{ background: t.statusBg, color: t.statusColor }}>{t.displayValue}</div>
            </div>
          );
        })}
      </div>
      {vm.noAdminRiwayat ? <div className="py-[30px] text-center text-[13px] text-muted-2">Tidak ada transaksi.</div> : null}

      {/* DETAIL MODAL */}
      {detailData ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-5" onClick={() => setDetailData(null)}>
          <div className="w-full max-w-[400px] animate-pop-in rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 border-b border-gray-100 pb-4">
              <div className="text-lg font-extrabold text-gray-900">Detail Transaksi</div>
              <div className="text-sm text-gray-500 mt-0.5">Informasi lengkap penarikan jimpitan</div>
            </div>
            
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <div className="text-[11px] font-bold text-gray-400 mb-1">Nama Warga</div>
                <div className="text-[14px] font-bold text-gray-900">{detailData.nama_penghuni || detailData.nama}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-bold text-gray-400 mb-1">Kelompok</div>
                  <div className="text-[14px] font-bold text-gray-900">{detailData.kelompok || "-"}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 mb-1">Status / Nominal</div>
                  <div className="inline-flex rounded-md px-2 py-0.5 text-[12px] font-extrabold" style={{ background: detailData.statusBg, color: detailData.statusColor }}>
                    {detailData.displayValue}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 mb-1">Waktu Penarikan</div>
                  <div className="text-[14px] font-bold text-gray-900">{detailData.time || detailData.lastTime || "-"}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 mb-1">Petugas Pencatat</div>
                  <div className="text-[14px] font-bold text-gray-900">{detailData.petugas || "-"}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button onClick={() => setDetailData(null)} className="flex-1 cursor-pointer rounded-xl border border-gray-200 bg-white py-2.5 text-[13px] font-bold text-gray-600 hover:bg-gray-50">Tutup</button>
              <button onClick={() => {
                const dataToCorrect = detailData;
                setDetailData(null);
                vm.openCorrection(dataToCorrect);
              }} className="flex-1 cursor-pointer rounded-xl border-none bg-brand py-2.5 text-[13px] font-bold text-white hover:bg-brand-dark">Koreksi Transaksi</button>
            </div>
          </div>
        </div>
      ) : null}

      {/* CORRECTION MODAL */}
      {vm.isCorrectionOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5" onClick={vm.closeCorrection}>
          <div className="w-full max-w-[380px] animate-pop-in rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-1 text-base font-extrabold">Koreksi Transaksi</div>
            <div className="mb-[18px] text-xs text-muted-2">{vm.correctionHouseName}</div>
            <label className="mb-2 block text-[13px] font-bold text-label">Nominal</label>
            <input type="number" value={vm.correctionNominal} onChange={vm.onCorrectionNominalChange}
              className="mb-4 w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-base font-bold" />
            <div className="flex gap-2.5">
              <button onClick={vm.closeCorrection} className="flex-1 cursor-pointer rounded-[10px] border border-input-border bg-white py-[11px] text-[13px] font-bold">Batal</button>
              <button onClick={vm.deleteTransaction} className="flex-1 cursor-pointer rounded-[10px] border border-danger-border bg-danger-bg py-[11px] text-[13px] font-bold text-danger hover:bg-opacity-80">Hapus</button>
              <button onClick={vm.saveCorrection} className="flex-1 cursor-pointer rounded-[10px] border-none bg-brand py-[11px] text-[13px] font-bold text-white hover:bg-brand-dark">Simpan</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── RekapScreen ─────────────────────────────────────────────────────────────

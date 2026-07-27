import React, { useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField, SelectField, QrCanvas, downloadQr } from "../../ui/SharedUI";

export function RumahScreen({ vm }) {
  const [activeRt, setActiveRt] = React.useState("Semua");

  const isModalOpen = vm.modalType === "tambah-rumah" || vm.modalType === "ubah-rumah";
  const isDeleteOpen = vm.modalType === "hapus-rumah";
  const d = vm.modalData;

  const groupOrder = ["RT 3", "RT 4", "Dukuhan"];
  const groupColors = {
    "RT 3":    { bg: "#e8f5ee", color: "#1f7a4d", activeBg: "#1f7a4d", activeText: "#ffffff" },
    "RT 4":    { bg: "#e8f0fb", color: "#2563eb", activeBg: "#2563eb", activeText: "#ffffff" },
    "Dukuhan": { bg: "#fef3e2", color: "#b45309", activeBg: "#b45309", activeText: "#ffffff" },
  };

  // Build counts per group from ALL houses (not filtered by search)
  const allGrouped = vm.rumahAdminRows.reduce((acc, h) => {
    const key = h.rt || "Lainnya";
    if (!acc[key]) acc[key] = [];
    acc[key].push(h);
    return acc;
  }, {});

  // Apply RT filter on top of search results
  const displayRows = activeRt === "Semua"
    ? vm.rumahAdminRows
    : vm.rumahAdminRows.filter((h) => h.rt === activeRt);

  // Available RT tabs derived from actual data
  const availableTabs = ["Semua", ...groupOrder.filter(k => allGrouped[k])];

  return (
    <div className="max-w-[900px]">
      {/* Header */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <div className="font-display text-xl font-extrabold">Data Rumah</div>
          <div className="text-[13px] text-muted">Pilih kelompok untuk melihat daftar warga</div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="rounded-[10px] border border-card-border bg-white px-4 py-2.5 text-[13px] font-bold text-muted">
            Total: <span className="text-ink">{vm.rumahAdminRows.length} rumah</span>
          </div>
          <button onClick={() => vm.openModal("tambah-rumah")} className="cursor-pointer rounded-[10px] border-none bg-brand px-[18px] py-[11px] text-[13px] font-bold text-white hover:bg-brand-dark">
            + Tambah Rumah
          </button>
        </div>
      </div>

      {/* Filter Tab Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {availableTabs.map((tab) => {
          const isActive = activeRt === tab;
          const gc = groupColors[tab];
          const count = tab === "Semua" ? vm.rumahAdminRows.length : (allGrouped[tab]?.length || 0);

          if (tab === "Semua") {
            return (
              <button key="Semua" onClick={() => setActiveRt("Semua")}
                className="flex cursor-pointer items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-[13px] font-bold transition-all"
                style={{ background: isActive ? "#1c2420" : "#ffffff", color: isActive ? "#ffffff" : "#4a544d", border: isActive ? "none" : "1.5px solid #e6e1d3" }}>
                Semua
                <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold"
                  style={{ background: isActive ? "#ffffff30" : "#f1efe7", color: isActive ? "#ffffff" : "#6f7d74" }}>
                  {count}
                </span>
              </button>
            );
          }

          return (
            <button key={tab} onClick={() => setActiveRt(tab)}
              className="flex cursor-pointer items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-[13px] font-bold transition-all"
              style={{
                background: isActive ? gc.activeBg : gc.bg,
                color: isActive ? gc.activeText : gc.color,
                border: "none",
                boxShadow: isActive ? `0 4px 14px -4px ${gc.color}66` : "none",
              }}>
              {tab}
              <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold"
                style={{ background: isActive ? "#ffffff30" : gc.color + "20", color: isActive ? "#fff" : gc.color }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <input type="text" value={vm.rumahSearch} onChange={vm.onRumahSearchChange}
        placeholder={`Cari nama warga${activeRt !== "Semua" ? ` di ${activeRt}` : " di semua kelompok"}…`}
        className="mb-4 w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-sm" />

      {/* List */}
      {displayRows.length === 0 ? (
        <div className="rounded-[14px] border border-card-border bg-white py-12 text-center text-[13px] text-muted-2">
          {vm.rumahSearch ? `Tidak ada hasil untuk "${vm.rumahSearch}".` : `Belum ada data untuk ${activeRt}.`}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] border border-card-border bg-white">
          {/* Group header strip if single RT is selected */}
          {activeRt !== "Semua" && (() => {
            const gc = groupColors[activeRt] || { bg: "#f1efe7", color: "#6f7d74" };
            return (
              <div className="flex items-center gap-2.5 border-b border-[#f1efe7] px-[18px] py-3" style={{ background: gc.bg }}>
                <div className="text-sm font-extrabold" style={{ color: gc.color }}>{activeRt}</div>
                <div className="rounded-full px-2.5 py-0.5 text-[11px] font-extrabold"
                  style={{ background: gc.color + "20", color: gc.color }}>
                  {displayRows.length} warga
                </div>
              </div>
            );
          })()}

          {displayRows.map((h, idx) => (
            <div key={h.id}
              className={`flex items-center justify-between gap-2.5 px-[18px] py-3.5 transition-colors hover:bg-[#f9f8f3] ${idx < displayRows.length - 1 ? "border-b border-[#f1efe7]" : ""}`}>
              <div className="min-w-0">
                <div className="text-sm font-bold">{h.nama}</div>
                <div className="text-xs text-muted-2">
                  {h.rt || "Lainnya"}
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <button onClick={h.onEdit} className="cursor-pointer rounded-lg border border-input-border bg-white px-3 py-[7px] text-xs font-bold">Ubah</button>
                <button onClick={h.onDelete} className="cursor-pointer rounded-lg border border-danger-border bg-white px-3 py-[7px] text-xs font-bold text-danger">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={vm.closeModal}>
          <ModalHeader title={d.id ? "Ubah Data Rumah" : "Tambah Rumah Baru"} />
          <InputField label="Nama Penghuni / Kepala Keluarga" value={d.nama_penghuni} onChange={(e) => vm.onModalDataChange("nama_penghuni", e.target.value)} placeholder="mis. Bpk. Slamet Riyadi" />
          <InputField label="Alamat" value={d.alamat} onChange={(e) => vm.onModalDataChange("alamat", e.target.value)} placeholder="mis. Jl. Mawar No. 12" />
          <SelectField label="RT" value={d.rt_id} onChange={(e) => vm.onModalDataChange("rt_id", e.target.value)}>
            <option value="">-- Pilih RT --</option>
            {vm.rtList.map((r) => <option key={r.id} value={r.id}>{r.nama}</option>)}
          </SelectField>

          <InputField label="Nominal Jimpitan Default (Rp)" type="number" value={d.nominal_default} onChange={(e) => vm.onModalDataChange("nominal_default", e.target.value)} placeholder="500" min="0" />
          <ModalFooter onCancel={vm.closeModal} onSave={vm.saveRumah} saveLabel={d.id ? "Simpan Perubahan" : "Tambah Rumah"} />
        </Modal>
      )}

      {isDeleteOpen && (
        <ConfirmDelete title="Nonaktifkan Rumah?" subtitle={`${d.nama} — data historis transaksi tetap tersimpan`} onCancel={vm.closeModal} onConfirm={() => vm.deleteRumah(d.id)} />
      )}
    </div>
  );
}

// ─── QrScreen ────────────────────────────────────────────────────────────────

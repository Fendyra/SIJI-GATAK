import React, { useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField, SelectField, QrCanvas, downloadQr } from "../../ui/SharedUI";

export function KelompokScreen({ vm }) {
  const isModalOpen = vm.modalType === "tambah-kelompok" || vm.modalType === "ubah-kelompok";
  const isDeleteOpen = vm.modalType === "hapus-kelompok";
  const d = vm.modalData;

  return (
    <div className="max-w-[860px]">
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <div className="font-display text-xl font-extrabold">Data Kelompok</div>
          <div className="text-[13px] text-muted">Regu petugas piket &amp; jadwal rotasi</div>
        </div>
        <button onClick={() => vm.openModal("tambah-kelompok")} className="cursor-pointer rounded-[10px] border-none bg-brand px-[18px] py-[11px] text-[13px] font-bold text-white hover:bg-brand-dark">
          + Tambah Kelompok
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {vm.kelompokRows.length === 0 ? (
          <div className="rounded-[14px] border border-card-border bg-white py-10 text-center text-[13px] text-muted-2">Belum ada kelompok.</div>
        ) : vm.kelompokRows.map((k, index) => (
          <div key={k.id} className="animate-fade-in-up rounded-[14px] border border-card-border bg-white px-[18px] py-4" style={{ animationDelay: `${index * 10}ms` }}>
            <div className="flex flex-wrap items-start justify-between gap-2.5">
              <div>
                <div className="text-sm font-bold">{k.nama}</div>
                <div className="mb-1.5 text-xs text-muted-2">Jadwal: {k.jadwal || "-"} · {k.rt?.nama || "-"}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={k.onEdit} className="cursor-pointer rounded-lg border border-input-border bg-white px-3 py-[7px] text-xs font-bold">Ubah</button>
                <button onClick={k.onDelete} className="cursor-pointer rounded-lg border border-danger-border bg-white px-3 py-[7px] text-xs font-bold text-danger">Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={vm.closeModal}>
          <ModalHeader title={d.id ? "Ubah Kelompok" : "Tambah Kelompok Baru"} />
          <InputField label="Nama Kelompok" value={d.nama} onChange={(e) => vm.onModalDataChange("nama", e.target.value)} placeholder="mis. Ronda Melati" />
          <SelectField label="RT" value={d.rt_id} onChange={(e) => vm.onModalDataChange("rt_id", e.target.value)}>
            <option value="">-- Pilih RT --</option>
            {vm.rtList.map((r) => <option key={r.id} value={r.id}>{r.nama}</option>)}
          </SelectField>
          <InputField label="Jadwal Ronda" value={d.jadwal} onChange={(e) => vm.onModalDataChange("jadwal", e.target.value)} placeholder="mis. Senin, Rabu, Jumat" />
          <ModalFooter onCancel={vm.closeModal} onSave={vm.saveKelompok} saveLabel={d.id ? "Simpan Perubahan" : "Tambah Kelompok"} />
        </Modal>
      )}

      {isDeleteOpen && (
        <ConfirmDelete title="Hapus Kelompok?" subtitle={d.nama} onCancel={vm.closeModal} onConfirm={() => vm.deleteKelompok(d.id)} />
      )}
    </div>
  );
}

// ─── RumahScreen ─────────────────────────────────────────────────────────────

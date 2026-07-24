import React, { useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField, SelectField, QrCanvas, downloadQr } from "../../ui/SharedUI";

export function RtScreen({ vm }) {
  const isModalOpen = vm.modalType === "tambah-rt" || vm.modalType === "ubah-rt";
  const isDeleteOpen = vm.modalType === "hapus-rt";
  const d = vm.modalData;

  return (
    <div className="max-w-[860px]">
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <div className="font-display text-xl font-extrabold">Data RT</div>
          <div className="text-[13px] text-muted">Wilayah administratif rumah warga</div>
        </div>
        <button onClick={() => vm.openModal("tambah-rt")} className="cursor-pointer rounded-[10px] border-none bg-brand px-[18px] py-[11px] text-[13px] font-bold text-white hover:bg-brand-dark">
          + Tambah RT
        </button>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-card-border bg-white">
        {vm.rtRows.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-muted-2">Belum ada data RT. Klik "+ Tambah RT" untuk menambahkan.</div>
        ) : vm.rtRows.map((r) => (
          <div key={r.id} className="flex items-center justify-between border-b border-[#f1efe7] px-[18px] py-3.5 transition-colors last:border-b-0 hover:bg-[#f9f8f3]">
            <div>
              <div className="text-sm font-bold">{r.nama}</div>
              <div className="text-xs text-muted-2">Ketua: {r.ketua || "-"} · {r.jumlahRumah} rumah</div>
            </div>
            <div className="flex gap-2">
              <button onClick={r.onEdit} className="cursor-pointer rounded-lg border border-input-border bg-white px-3 py-[7px] text-xs font-bold">Ubah</button>
              <button onClick={r.onDelete} className="cursor-pointer rounded-lg border border-danger-border bg-white px-3 py-[7px] text-xs font-bold text-danger">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={vm.closeModal}>
          <ModalHeader title={d.id ? "Ubah Data RT" : "Tambah RT Baru"} />
          <InputField label="Nama RT" value={d.nama} onChange={(e) => vm.onModalDataChange("nama", e.target.value)} placeholder="mis. RT 03" />
          <InputField label="Ketua RT" value={d.ketua} onChange={(e) => vm.onModalDataChange("ketua", e.target.value)} placeholder="mis. Bpk. Slamet" />
          <ModalFooter onCancel={vm.closeModal} onSave={vm.saveRt} saveLabel={d.id ? "Simpan Perubahan" : "Tambah RT"} />
        </Modal>
      )}

      {isDeleteOpen && (
        <ConfirmDelete title="Hapus RT?" subtitle={d.nama} onCancel={vm.closeModal} onConfirm={() => vm.deleteRt(d.id)} />
      )}
    </div>
  );
}

// ─── KelompokScreen ──────────────────────────────────────────────────────────

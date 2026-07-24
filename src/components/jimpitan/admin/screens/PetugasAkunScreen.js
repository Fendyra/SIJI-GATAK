import React, { useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField, SelectField, QrCanvas, downloadQr } from "../../ui/SharedUI";

export function PetugasAkunScreen({ vm }) {
  const isModalOpen = vm.modalType === "tambah-petugas" || vm.modalType === "ubah-petugas";
  const isAdd = vm.modalType === "tambah-petugas";
  const d = vm.modalData;

  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: prev[group] === undefined ? false : !prev[group] // default is true
    }));
  };
  
  // Group Petugas by role/kelompok
  const groupedPetugas = vm.petugasRows.reduce((acc, p) => {
    const group = p.role === "admin" ? "Admin System" : (p.kelompok || "Petugas Tanpa Kelompok");
    if (!acc[group]) acc[group] = [];
    acc[group].push(p);
    return acc;
  }, {});

  const groupKeys = Object.keys(groupedPetugas).sort((a, b) => {
    if (a === "Admin System") return -1;
    if (b === "Admin System") return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="max-w-[860px]">
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <div className="font-display text-xl font-extrabold">Akun Petugas</div>
          <div className="text-[13px] text-muted">Kelola akun pengguna dengan peran Petugas atau Admin</div>
        </div>
        <button onClick={() => vm.openModal("tambah-petugas", { role: "petugas" })} className="cursor-pointer rounded-[10px] border-none bg-brand px-[18px] py-[11px] text-[13px] font-bold text-white hover:bg-brand-dark">
          + Tambah Akun
        </button>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-card-border bg-white">
        {groupKeys.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-muted-2">Belum ada akun petugas.</div>
        ) : groupKeys.map((group) => {
          const isOpen = openGroups[group] !== false; // default to open
          return (
            <div key={group} className="border-b border-card-border last:border-b-0">
              <div 
                onClick={() => toggleGroup(group)}
                className="flex cursor-pointer items-center justify-between bg-[#fcfbfa] px-[18px] py-3.5 transition-colors hover:bg-[#f6f4ee]"
              >
                <div className="text-[13px] font-extrabold text-brand flex items-center gap-2">
                  {group} 
                  <span className="flex items-center justify-center min-w-[20px] h-[20px] rounded-full bg-brand/10 px-1.5 text-[11px] font-bold text-brand">
                    {groupedPetugas[group].length}
                  </span>
                </div>
                <div className={`transform transition-transform duration-300 text-brand ${isOpen ? 'rotate-180' : ''}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
              
              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col bg-white">
                  {groupedPetugas[group].map((p, idx) => (
                    <div key={p.id} className={`flex items-center justify-between gap-2.5 px-[18px] py-3.5 transition-colors hover:bg-[#f9f8f3] ${idx !== 0 ? 'border-t border-[#f1efe7]' : ''}`}>
                      <div className="pl-2">
                        <div className="text-sm font-bold">{p.nama}</div>
                        <div className="text-xs text-muted-2">@{p.username} · {p.role}</div>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        <div className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: p.statusBg, color: p.statusColor }}>{p.statusLabel}</div>
                        <button onClick={p.onEdit} className="cursor-pointer rounded-lg border border-input-border bg-white px-3 py-[7px] text-xs font-bold transition-colors hover:border-brand hover:text-brand">Ubah</button>
                        <button onClick={p.onToggle} className="cursor-pointer rounded-lg border border-input-border bg-white px-3 py-[7px] text-xs font-bold transition-colors hover:border-danger hover:text-danger">{p.toggleLabel}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <Modal onClose={vm.closeModal}>
          <ModalHeader title={isAdd ? "Tambah Akun Baru" : "Ubah Data Akun"} subtitle={isAdd ? "Akun baru akan bisa login menggunakan email yang diisi." : undefined} />
          <InputField label="Nama Lengkap" value={d.nama} onChange={(e) => vm.onModalDataChange("nama", e.target.value)} placeholder="mis. Budi Santoso" />
          {isAdd && <>
            <InputField label="Email (digunakan untuk login)" type="email" value={d.email} onChange={(e) => vm.onModalDataChange("email", e.target.value)} placeholder="mis. budi@gmail.com" />
            <InputField label="Password" type="password" value={d.password} onChange={(e) => vm.onModalDataChange("password", e.target.value)} placeholder="min. 6 karakter" />
            <SelectField label="Role" value={d.role} onChange={(e) => vm.onModalDataChange("role", e.target.value)}>
              <option value="petugas">Petugas</option>
              <option value="admin">Admin/Pengurus</option>
            </SelectField>
          </>}
          {(isAdd ? d.role !== "admin" : true) && (
            <SelectField label="Kelompok Ronda" value={d.kelompok_id} onChange={(e) => vm.onModalDataChange("kelompok_id", e.target.value)}>
              <option value="">-- Pilih Kelompok (opsional untuk admin) --</option>
              {vm.kelompokList.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </SelectField>
          )}
          <ModalFooter onCancel={vm.closeModal} onSave={vm.savePetugas} saveLabel={isAdd ? "Buat Akun" : "Simpan Perubahan"} />
        </Modal>
      )}
    </div>
  );
}

// ─── RiwayatTransaksiScreen ──────────────────────────────────────────────────

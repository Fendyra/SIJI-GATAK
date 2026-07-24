"use client";

import React, { useEffect, useRef, useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";

// ─── Shared Modal Overlay ────────────────────────────────────────────────────
function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-5" onClick={onClose}>
      <div className="w-full max-w-[420px] animate-pop-in rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle }) {
  return (
    <div className="mb-5">
      <div className="text-base font-extrabold">{title}</div>
      {subtitle && <div className="text-xs text-muted-2 mt-0.5">{subtitle}</div>}
    </div>
  );
}

function ModalFooter({ onCancel, onSave, saveLabel = "Simpan" }) {
  return (
    <div className="flex gap-2.5 mt-5">
      <button onClick={onCancel} className="flex-1 cursor-pointer rounded-[10px] border border-input-border bg-white py-[11px] text-[13px] font-bold">Batal</button>
      <button onClick={onSave} className="flex-1 cursor-pointer rounded-[10px] border-none bg-brand py-[11px] text-[13px] font-bold text-white hover:bg-brand-dark">{saveLabel}</button>
    </div>
  );
}

function ConfirmDelete({ title, subtitle, onCancel, onConfirm }) {
  return (
    <Modal onClose={onCancel}>
      <ModalHeader title={title} subtitle={subtitle} />
      <p className="text-[13px] text-muted mb-5">Tindakan ini tidak dapat dibatalkan.</p>
      <div className="flex gap-2.5">
        <button onClick={onCancel} className="flex-1 cursor-pointer rounded-[10px] border border-input-border bg-white py-[11px] text-[13px] font-bold">Batal</button>
        <button onClick={onConfirm} className="flex-1 cursor-pointer rounded-[10px] border-none bg-danger py-[11px] text-[13px] font-bold text-white">Hapus</button>
      </div>
    </Modal>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, min }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[13px] font-bold text-label">{label}</label>
      <input type={type} value={value || ""} onChange={onChange} placeholder={placeholder} min={min}
        className="w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-sm" />
    </div>
  );
}

function SelectField({ label, value, onChange, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-[13px] font-bold text-label">{label}</label>
      <select value={value || ""} onChange={onChange} className="w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-sm bg-white">
        {children}
      </select>
    </div>
  );
}

// ─── QR Code Canvas Component ────────────────────────────────────────────────
function QrCanvas({ value, size = 120, id }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!value || !canvasRef.current) return;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: { dark: "#1c2420", light: "#ffffff" },
      });
    });
  }, [value, size]);

  return <canvas ref={canvasRef} id={id} width={size} height={size} style={{ borderRadius: 8 }} />;
}

function downloadQr(canvasId, filename) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ─── AdminDashboard ──────────────────────────────────────────────────────────
export function AdminDashboard({ vm }) {
  return (
    <div className="max-w-[960px]">
      <div className="font-display mb-0.5 text-[22px] font-extrabold">Ringkasan</div>
      <div className="mb-[22px] text-sm text-muted">{vm.today} · Periode berjalan (bulan ini)</div>

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
                  {activeRt === "Semua" ? `${h.rt} · ` : ""}{h.kelompok || "-"}
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
          <SelectField label="Kelompok Ronda" value={d.kelompok_id} onChange={(e) => vm.onModalDataChange("kelompok_id", e.target.value)}>
            <option value="">-- Pilih Kelompok --</option>
            {vm.kelompokList.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </SelectField>
          <InputField label="Nominal Jimpitan Default (Rp)" type="number" value={d.nominal_default} onChange={(e) => vm.onModalDataChange("nominal_default", e.target.value)} placeholder="2000" min="0" />
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
export function QrScreen({ vm }) {
  async function downloadAll() {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    const canvases = document.querySelectorAll("[data-qr-canvas]");
    canvases.forEach((canvas) => {
      const nama = canvas.getAttribute("data-nama") || "rumah";
      const dataUrl = canvas.toDataURL("image/png");
      const base64 = dataUrl.split(",")[1];
      zip.file(`${nama}.png`, base64, { base64: true });
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.download = "QR-Code-Rumah.zip";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  // Group by RT
  const grouped = vm.qrHouses.reduce((acc, h) => {
    const key = h.rt || "Lainnya";
    if (!acc[key]) acc[key] = [];
    acc[key].push(h);
    return acc;
  }, {});
  const groupOrder = ["RT 3", "RT 4", "Dukuhan"];
  const sortedGroups = [
    ...groupOrder.filter(k => grouped[k]),
    ...Object.keys(grouped).filter(k => !groupOrder.includes(k)).sort(),
  ];
  const groupColors = {
    "RT 3":    { bg: "#e8f5ee", color: "#1f7a4d" },
    "RT 4":    { bg: "#e8f0fb", color: "#2563eb" },
    "Dukuhan": { bg: "#fef3e2", color: "#b45309" },
  };

  return (
    <div className="max-w-[960px]">
      <div className="font-display mb-0.5 text-xl font-extrabold">QR Code Rumah</div>
      <div className="mb-[18px] text-[13px] text-muted">Unduh atau cetak QR Code identitas rumah — dikelompokkan per RT / Kampung</div>
      <div className="mb-5 flex flex-wrap gap-2.5">
        <button onClick={downloadAll} className="cursor-pointer rounded-[10px] border-none bg-brand px-[18px] py-[11px] text-[13px] font-bold text-white hover:bg-brand-dark">
          Unduh Semua QR (ZIP)
        </button>
      </div>

      <div className="flex flex-col gap-7">
        {sortedGroups.map((rtName) => {
          const houses = grouped[rtName];
          const gcolor = groupColors[rtName] || { bg: "#f1efe7", color: "#6f7d74" };
          return (
            <div key={rtName}>
              {/* Group header */}
              <div className="mb-3 flex items-center gap-2.5">
                <div className="text-sm font-extrabold" style={{ color: gcolor.color }}>{rtName}</div>
                <div className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{ background: gcolor.color + "22", color: gcolor.color }}>
                  {houses.length} rumah
                </div>
                <div className="h-px flex-1" style={{ background: gcolor.color + "33" }} />
              </div>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
                {houses.map((h, index) => {
                  const canvasId = `qr-canvas-${h.id}`;
                  return (
                    <div key={h.id} className="animate-fade-in-up rounded-[14px] border border-card-border bg-white p-3.5 text-center transition-[transform,box-shadow] hover:-translate-y-[3px] hover:shadow-[0_12px_26px_-16px_rgba(28,36,32,0.35)]"
                      style={{ animationDelay: `${index * 10}ms` }}>
                      <div className="mb-2 flex aspect-square w-full items-center justify-center rounded-[10px] bg-[#f6f4ee]">
                        <QrCanvas value={h.qr_code} size={110} id={canvasId} />
                        <canvas data-qr-canvas="true" data-nama={h.nama?.replace(/[^a-zA-Z0-9 ]/g, "") || "rumah"} id={`qr-dl-${h.id}`} style={{ display: "none" }} />
                      </div>
                      <div className="text-[13px] font-bold leading-tight">{h.nama}</div>
                      <div className="mb-2.5 text-[10px] text-muted-2">{h.alamat || rtName}</div>
                      <button onClick={() => downloadQr(canvasId, h.nama || "rumah")}
                        className="w-full cursor-pointer rounded-lg border border-input-border bg-white py-[7px] text-xs font-bold hover:bg-green-bg">
                        Unduh PNG
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PetugasAkunScreen ───────────────────────────────────────────────────────
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
export function RiwayatTransaksiScreen({ vm }) {
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
        {vm.adminRiwayatFiltered.map((t) => (
          <div key={t.id} onClick={t.onClick} className="flex cursor-pointer items-center justify-between gap-2.5 border-b border-[#f1efe7] px-[18px] py-3.5 transition-colors last:border-b-0 hover:bg-[#f9f8f3]">
            <div>
              <div className="text-sm font-bold">{t.nama}</div>
              <div className="text-xs text-muted-2">{t.kelompok} · {t.time}</div>
            </div>
            <div className="rounded-full px-2.5 py-1 text-[13px] font-extrabold whitespace-nowrap" style={{ background: t.statusBg, color: t.statusColor }}>{t.displayValue}</div>
          </div>
        ))}
      </div>
      {vm.noAdminRiwayat ? <div className="py-[30px] text-center text-[13px] text-muted-2">Tidak ada transaksi.</div> : null}

      {vm.isCorrectionOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-5" onClick={vm.closeCorrection}>
          <div className="w-full max-w-[380px] rounded-2xl bg-white p-6" onClick={vm.stopPropagation}>
            <div className="mb-1 text-base font-extrabold">Koreksi Transaksi</div>
            <div className="mb-[18px] text-xs text-muted-2">{vm.correctionHouseName}</div>
            <label className="mb-2 block text-[13px] font-bold text-label">Nominal</label>
            <input type="number" value={vm.correctionNominal} onChange={vm.onCorrectionNominalChange}
              className="mb-4 w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-base font-bold" />
            <div className="flex gap-2.5">
              <button onClick={vm.closeCorrection} className="flex-1 cursor-pointer rounded-[10px] border border-input-border bg-white py-[11px] text-[13px] font-bold">Batal</button>
              <button onClick={vm.saveCorrection} className="flex-1 cursor-pointer rounded-[10px] border-none bg-brand py-[11px] text-[13px] font-bold text-white hover:bg-brand-dark">Simpan</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── RekapScreen ─────────────────────────────────────────────────────────────
export function RekapScreen({ vm }) {
  function exportExcel() {
    import("xlsx").then(({ utils, writeFile }) => {
      const rows = [
        ["Rekapitulasi Jimpitan Online", "", ""],
        ["Periode:", vm.rekapPeriode === "harian" ? "Harian (Hari Ini)" : "Bulanan (Bulan Ini)", ""],
        [],
        ["RINGKASAN", "", ""],
        ["Total Terkumpul", vm.rekapTotalDisplay, ""],
        ["Rumah Sudah Bayar", vm.rekapSudahCount, ""],
        ["Rumah Belum/Kosong", vm.rekapBelumCount, ""],
        [`Kas RT (${vm.rekapPersentase?.rt || 60}%)`, vm.rekapKasRtDisplay, ""],
        [`Kas Ronda (${vm.rekapPersentase?.ronda || 40}%)`, vm.rekapKasRondaDisplay, ""],
        [],
        ["REKAP PER RT", "", ""],
        ["Nama RT", "Total Terkumpul", ""],
        ...(vm.rekapPerRt || []).map((r) => [r.nama, r.display, ""]),
        [],
        ["REKAP PER KELOMPOK", "", ""],
        ["Nama Kelompok", "Total Terkumpul", ""],
        ...(vm.rekapPerKelompok || []).map((k) => [k.nama, k.display, ""]),
      ];
      const ws = utils.aoa_to_sheet(rows);
      ws["!cols"] = [{ wch: 30 }, { wch: 20 }, { wch: 10 }];
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Rekap Jimpitan");
      writeFile(wb, `Rekap-Jimpitan-${vm.rekapPeriode}-${new Date().toISOString().split("T")[0]}.xlsx`);
    });
  }

  function exportPdf() {
    const printWindow = window.open("", "_blank");
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rekap Jimpitan Online</title>
        <style>
          body { font-family: sans-serif; font-size: 13px; color: #1c2420; padding: 24px; }
          h1 { font-size: 18px; margin-bottom: 4px; }
          .sub { color: #6f7d74; font-size: 12px; margin-bottom: 24px; }
          .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
          .stat { border: 1px solid #e6e1d3; border-radius: 10px; padding: 14px 18px; min-width: 140px; }
          .stat-label { font-size: 11px; color: #8a8578; margin-bottom: 4px; }
          .stat-value { font-size: 18px; font-weight: 800; }
          .green { color: #1f7a4d; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { text-align: left; border-bottom: 2px solid #1f7a4d; padding: 8px 12px; font-size: 12px; color: #1f7a4d; }
          td { padding: 8px 12px; border-bottom: 1px solid #f1efe7; }
          h2 { font-size: 14px; margin: 20px 0 8px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>Laporan Jimpitan Online</h1>
        <div class="sub">Periode: ${vm.rekapPeriode === "harian" ? "Harian" : "Bulanan"} &nbsp;|&nbsp; Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
        <div class="stats">
          <div class="stat"><div class="stat-label">Total Terkumpul</div><div class="stat-value green">${vm.rekapTotalDisplay}</div></div>
          <div class="stat"><div class="stat-label">Rumah Sudah Bayar</div><div class="stat-value">${vm.rekapSudahCount}</div></div>
          <div class="stat"><div class="stat-label">Rumah Belum/Kosong</div><div class="stat-value">${vm.rekapBelumCount}</div></div>
          <div class="stat"><div class="stat-label">Kas RT (${vm.rekapPersentase?.rt || 60}%)</div><div class="stat-value green">${vm.rekapKasRtDisplay}</div></div>
          <div class="stat"><div class="stat-label">Kas Ronda (${vm.rekapPersentase?.ronda || 40}%)</div><div class="stat-value green">${vm.rekapKasRondaDisplay}</div></div>
        </div>
        <h2>Rekap per RT</h2>
        <table>
          <tr><th>RT</th><th>Total</th></tr>
          ${(vm.rekapPerRt || []).map((r) => `<tr><td>${r.nama}</td><td>${r.display}</td></tr>`).join("")}
        </table>
        <h2>Rekap per Kelompok</h2>
        <table>
          <tr><th>Kelompok</th><th>Total</th></tr>
          ${(vm.rekapPerKelompok || []).map((k) => `<tr><td>${k.nama}</td><td>${k.display}</td></tr>`).join("")}
        </table>
      </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); };
  }

  return (
    <div className="max-w-[900px]">
      <div className="font-display mb-0.5 text-xl font-extrabold">Rekapitulasi &amp; Laporan</div>
      <div className="mb-[18px] text-[13px] text-muted">Pilih periode, lalu ekspor laporan</div>

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <select value={vm.rekapPeriode} onChange={vm.onRekapPeriodeChange} className="rounded-lg border border-input-border px-2.5 py-[9px] font-sans text-[13px]">
          <option value="harian">Harian (Hari Ini)</option>
          <option value="bulanan">Bulanan (Bulan Ini)</option>
        </select>
        <button onClick={exportPdf} className="cursor-pointer rounded-lg border border-input-border bg-white px-4 py-2.5 text-[13px] font-bold hover:bg-[#f9f8f3]">🖨️ Ekspor PDF</button>
        <button onClick={exportExcel} className="cursor-pointer rounded-lg border border-brand bg-green-bg px-4 py-2.5 text-[13px] font-bold text-brand hover:bg-[#d4eddc]">📊 Ekspor Excel</button>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="min-w-[160px] flex-1 rounded-[14px] border border-card-border bg-white p-[18px]">
          <div className="mb-1.5 text-xs font-semibold text-muted-2">Total Pemasukan</div>
          <div className="font-display text-xl font-extrabold text-brand">{vm.rekapTotalDisplay}</div>
        </div>
        <div className="min-w-[160px] flex-1 rounded-[14px] border border-card-border bg-white p-[18px]">
          <div className="mb-1.5 text-xs font-semibold text-muted-2">Rumah Sudah Bayar</div>
          <div className="font-display text-xl font-extrabold">{vm.rekapSudahCount}</div>
        </div>
        <div className="min-w-[160px] flex-1 rounded-[14px] border border-card-border bg-white p-[18px]">
          <div className="mb-1.5 text-xs font-semibold text-muted-2">Rumah Belum/Kosong</div>
          <div className="font-display text-xl font-extrabold text-warn">{vm.rekapBelumCount}</div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-card-border bg-white p-[22px]">
        <div className="mb-3.5 text-sm font-bold text-label">Pembagian Kas</div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[140px] rounded-[12px] bg-green-bg p-4">
            <div className="text-xs font-semibold text-brand-deep mb-1">Kas RT ({vm.rekapPersentase?.rt || 60}%)</div>
            <div className="font-display text-lg font-extrabold text-brand-deep">{vm.rekapKasRtDisplay}</div>
          </div>
          <div className="flex-1 min-w-[140px] rounded-[12px] bg-warn-bg p-4">
            <div className="text-xs font-semibold text-warn mb-1">Kas Ronda ({vm.rekapPersentase?.ronda || 40}%)</div>
            <div className="font-display text-lg font-extrabold text-warn">{vm.rekapKasRondaDisplay}</div>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-card-border bg-white p-[22px]">
        <div className="mb-3.5 text-sm font-bold text-label">Rekap per RT</div>
        <div className="flex flex-col gap-3">
          {(vm.rekapPerRt || []).map((r) => (
            <div key={r.nama} className="flex items-center justify-between">
              <span className="text-[13px] font-bold">{r.nama}</span>
              <span className="text-[13px] text-muted">{r.display}</span>
            </div>
          ))}
          {(vm.rekapPerRt || []).length === 0 && <div className="text-[13px] text-muted-2">Belum ada data.</div>}
        </div>
      </div>

      <div className="rounded-2xl border border-card-border bg-white p-[22px]">
        <div className="mb-3.5 text-sm font-bold text-label">Rekap per Kelompok</div>
        <div className="flex flex-col gap-3">
          {(vm.rekapPerKelompok || []).map((k) => (
            <div key={k.nama} className="flex items-center justify-between">
              <span className="text-[13px] font-bold">{k.nama}</span>
              <span className="text-[13px] text-muted">{k.display}</span>
            </div>
          ))}
          {(vm.rekapPerKelompok || []).length === 0 && <div className="text-[13px] text-muted-2">Belum ada data.</div>}
        </div>
      </div>
    </div>
  );
}

// ─── SettingScreen ───────────────────────────────────────────────────────────
export function SettingScreen({ vm }) {
  const total = (Number(vm.persentaseRt) || 0) + (Number(vm.persentaseRonda) || 0);
  const isValid = total === 100;

  return (
    <div className="max-w-[520px]">
      <div className="font-display mb-0.5 text-xl font-extrabold">Pengaturan Sistem</div>
      <div className="mb-[18px] text-[13px] text-muted">Nominal jimpitan default dan pembagian kas</div>

      <div className="rounded-2xl border border-card-border bg-white p-[22px]">
        <label className="mb-2 block text-[13px] font-bold text-label">Nominal Jimpitan Default</label>
        <input type="number" value={vm.nominalDefaultSetting} onChange={vm.onNominalDefaultChange}
          className="mb-1.5 w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-lg font-bold" />
        <div className="mb-[22px] text-xs text-muted-2">Perubahan tidak memengaruhi transaksi yang sudah tercatat.</div>

        <div className="mb-4 border-t border-card-border pt-[18px]">
          <div className="mb-3 text-[13px] font-bold text-label">Persentase Pembagian Kas</div>
          <div className="flex gap-3 mb-2">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-muted-2">Kas RT (%)</label>
              <input type="number" value={vm.persentaseRt} onChange={vm.onPersentaseRtChange} min="0" max="100"
                className="w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-base font-bold" />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-muted-2">Kas Ronda (%)</label>
              <input type="number" value={vm.persentaseRonda} onChange={vm.onPersentaseRondaChange} min="0" max="100"
                className="w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-base font-bold" />
            </div>
          </div>
          {!isValid && <div className="text-xs font-semibold text-danger">Total harus 100% (saat ini: {total}%)</div>}
          {isValid && <div className="text-xs font-semibold text-brand">✓ Total 100% — valid</div>}
        </div>

        <button onClick={vm.saveSetting} className="w-full cursor-pointer rounded-[10px] border-none bg-brand py-[13px] text-[15px] font-bold text-white hover:bg-brand-dark">
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}

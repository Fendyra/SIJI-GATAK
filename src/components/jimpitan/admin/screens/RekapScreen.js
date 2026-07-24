import React, { useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField, SelectField, QrCanvas, downloadQr } from "../../ui/SharedUI";

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

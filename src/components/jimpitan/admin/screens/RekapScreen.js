import React, { useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField, SelectField, QrCanvas, downloadQr } from "../../ui/SharedUI";

export function RekapScreen({ vm }) {
  const [filterRt, setFilterRt] = useState("Semua RT");
  const [showAllRt, setShowAllRt] = useState(false);
  const [showAllKelompok, setShowAllKelompok] = useState(false);

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
        ["REKAP PER RT", "", "", "", "", ""],
        ["Nama RT", "Total Pemasukan", "Sudah Bayar", "Belum/Kosong", "Total Rumah", "Progress"],
        ...(vm.rekapPerRt || []).map((r) => [
          r.nama, 
          r.display, 
          r.sudahBayar, 
          r.belumKosong, 
          r.totalRumah,
          `${r.progress?.toFixed(1)}%`
        ]),
        [],
        ["REKAP PER KELOMPOK", "", "", "", "", ""],
        ["Nama Kelompok", "Total Pemasukan", "Sudah Bayar", "Belum/Kosong", "Total Rumah", "Progress"],
        ...(vm.rekapPerKelompok || []).map((k) => [
          k.nama, 
          k.display, 
          k.sudahBayar, 
          k.belumKosong, 
          k.totalRumah,
          `${k.progress?.toFixed(1)}%`
        ]),
      ];
      const ws = utils.aoa_to_sheet(rows);
      ws["!cols"] = [{ wch: 25 }, { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
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
          <tr><th>RT</th><th>Total Pemasukan</th><th>Sudah Bayar</th><th>Belum/Kosong</th><th>Total Rumah</th><th>Progress</th></tr>
          ${(vm.rekapPerRt || []).map((r) => `<tr><td>${r.nama}</td><td>${r.display}</td><td>${r.sudahBayar}</td><td>${r.belumKosong}</td><td>${r.totalRumah}</td><td>${r.progress?.toFixed(1)}%</td></tr>`).join("")}
        </table>
        <h2>Rekap per Kelompok</h2>
        <table>
          <tr><th>Kelompok</th><th>Total Pemasukan</th><th>Sudah Bayar</th><th>Belum/Kosong</th><th>Total Rumah</th><th>Progress</th></tr>
          ${(vm.rekapPerKelompok || []).map((k) => `<tr><td>${k.nama}</td><td>${k.display}</td><td>${k.sudahBayar}</td><td>${k.belumKosong}</td><td>${k.totalRumah}</td><td>${k.progress?.toFixed(1)}%</td></tr>`).join("")}
        </table>
      </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); };
  }

  const pctRt = vm.rekapPersentase?.rt || 60;
  const pctRonda = vm.rekapPersentase?.ronda || 40;
  const totalRumahAll = vm.rekapSudahCount + vm.rekapBelumCount || 1;
  const pctSudah = (vm.rekapSudahCount / totalRumahAll) * 100;
  const pctBelum = (vm.rekapBelumCount / totalRumahAll) * 100;

  // Filtered RT
  const filteredRekapRt = filterRt === "Semua RT" ? vm.rekapPerRt : (vm.rekapPerRt || []).filter(r => r.nama === filterRt);

  // Derived Activity Data
  const highestRt = (vm.rekapPerRt || []).slice().sort((a, b) => b.total - a.total)[0];
  const txTodayCount = (vm.transactions || []).filter(t => t.status === "sudah" && new Date(t.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <div className="max-w-[1200px] pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="font-display text-[24px] font-extrabold text-gray-900">Rekapitulasi &amp; Laporan</div>
          <div className="text-[14px] text-muted-2 mt-0.5">Pantau pemasukan jimpitan dan kelola laporan dengan mudah.</div>
        </div>
      </div>

      {/* FILTER & EXPORT ACTION BAR */}
      <div className="bg-white rounded-2xl border border-card-border p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <div className="text-[11px] font-bold text-gray-400 mb-1 ml-1">Periode</div>
            <div className="relative">
              <select value={vm.rekapPeriode} onChange={vm.onRekapPeriodeChange} className="appearance-none bg-white border border-gray-200 text-[13px] text-gray-700 font-bold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:border-brand cursor-pointer">
                <option value="harian">Harian (Hari Ini)</option>
                <option value="bulanan">Bulanan (Bulan Ini)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-[11px] font-bold text-gray-400 mb-1 ml-1">Pilih RT / Kampung</div>
            <div className="relative">
              <select value={filterRt} onChange={(e) => setFilterRt(e.target.value)} className="appearance-none bg-white border border-gray-200 text-[13px] text-gray-700 font-bold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:border-brand cursor-pointer">
                <option value="Semua RT">Semua RT</option>
                {(vm.rekapPerRt || []).map(r => (
                  <option key={r.nama} value={r.nama}>{r.nama}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportPdf} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-brand bg-white text-brand font-bold text-[13px] hover:bg-brand/5 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Ekspor PDF
          </button>
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-brand bg-brand text-white font-bold text-[13px] hover:bg-brand-deep transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Ekspor Excel
          </button>
          
          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-gray-100">
             <div>
               <div className="text-[11px] font-bold text-gray-400 mb-0.5">Terakhir diperbarui</div>
               <div className="flex items-center gap-1.5 text-[12px] font-bold text-brand">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                 {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-card-border p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="z-10 relative">
            <div className="text-[13px] font-bold text-gray-500 mb-1">Total Pemasukan</div>
            <div className="font-display text-[26px] font-extrabold text-brand mb-1 leading-tight">{vm.rekapTotalDisplay}</div>
            <div className="text-[11px] font-medium text-brand bg-brand/10 inline-flex px-2 py-0.5 rounded-full items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
              Terkumpul periode ini
            </div>
          </div>
          <div className="w-14 h-14 rounded-full bg-[#f0f9f4] flex items-center justify-center text-brand z-10 relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line><path d="M13 17l2-2 4 4"></path></svg>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#f0f9f4] rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
        </div>

        <div className="bg-white rounded-2xl border border-card-border p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="z-10 relative">
            <div className="text-[13px] font-bold text-gray-500 mb-1">Rumah Sudah Bayar</div>
            <div className="font-display text-[26px] font-extrabold text-gray-900 mb-1 leading-tight">{vm.rekapSudahCount}</div>
            <div className="text-[11px] font-medium text-gray-500">
              ({pctSudah.toFixed(1)}%) dari {totalRumahAll} rumah
            </div>
          </div>
          <div className="w-14 h-14 rounded-full bg-[#f0f9f4] flex items-center justify-center text-brand z-10 relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#f0f9f4] rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
        </div>

        <div className="bg-white rounded-2xl border border-card-border p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="z-10 relative">
            <div className="text-[13px] font-bold text-gray-500 mb-1">Rumah Belum/Kosong</div>
            <div className="font-display text-[26px] font-extrabold text-gray-900 mb-1 leading-tight">{vm.rekapBelumCount}</div>
            <div className="text-[11px] font-medium text-gray-500">
              ({pctBelum.toFixed(1)}%) dari {totalRumahAll} rumah
            </div>
          </div>
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 z-10 relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
        </div>
      </div>

      {/* SPLIT VIEW 1: KAS & RT */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Pembagian Kas */}
        <div className="bg-white rounded-2xl border border-card-border shadow-sm p-6 lg:w-[400px] shrink-0">
          <div className="font-bold text-[16px] text-gray-900 mb-8">Pembagian Kas</div>
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-8">
            
            <div className="relative w-[180px] h-[180px] rounded-full shadow-inner flex-shrink-0" style={{ background: `conic-gradient(#86efac 0% ${pctRt}%, #fed7aa ${pctRt}% 100%)` }}>
              <div className="absolute inset-0 m-4 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="font-display font-extrabold text-[15px] text-gray-900 leading-tight">{vm.rekapTotalDisplay}</span>
                <span className="text-[11px] font-bold text-gray-400 mt-0.5">Total</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="bg-[#f0f9f4] rounded-xl p-3.5 flex items-center justify-between border border-[#d4eddc]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#86efac]"></div>
                    <div className="text-[12px] font-bold text-brand">Kas RT ({pctRt}%)</div>
                  </div>
                  <div className="font-display text-[16px] font-extrabold text-gray-900">{vm.rekapKasRtDisplay}</div>
                </div>
                <div className="text-brand font-bold text-sm bg-white px-2 py-1 rounded-md shadow-sm">{pctRt}%</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-3.5 flex items-center justify-between border border-orange-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#fed7aa]"></div>
                    <div className="text-[12px] font-bold text-orange-600">Kas Ronda ({pctRonda}%)</div>
                  </div>
                  <div className="font-display text-[16px] font-extrabold text-gray-900">{vm.rekapKasRondaDisplay}</div>
                </div>
                <div className="text-orange-600 font-bold text-sm bg-white px-2 py-1 rounded-md shadow-sm">{pctRonda}%</div>
              </div>
            </div>

          </div>
        </div>

        {/* Rekap per RT */}
        <div className="bg-white rounded-2xl border border-card-border shadow-sm p-6 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-[16px] text-gray-900">Rekap per RT</div>
            <button onClick={() => setShowAllRt(!showAllRt)} className="text-[12px] font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors cursor-pointer">
              {showAllRt ? "Tampilkan Sedikit" : "Lihat Semua"}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 pt-2 text-[12px] font-bold text-gray-400 font-sans">RT</th>
                  <th className="pb-3 pt-2 text-[12px] font-bold text-gray-400 font-sans">Total Pemasukan</th>
                  <th className="pb-3 pt-2 text-[12px] font-bold text-gray-400 font-sans">Sudah Bayar</th>
                  <th className="pb-3 pt-2 text-[12px] font-bold text-gray-400 font-sans">Belum/Kosong</th>
                  <th className="pb-3 pt-2 text-[12px] font-bold text-gray-400 font-sans text-right">Progress</th>
                </tr>
              </thead>
              <tbody>
                {(filteredRekapRt || []).length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-[13px] text-gray-400">Tidak ada data untuk filter yang dipilih.</td>
                  </tr>
                ) : (filteredRekapRt || []).slice(0, showAllRt ? undefined : 5).map((r, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <td className="py-3.5 text-[13px] font-bold text-gray-900">{r.nama}</td>
                    <td className="py-3.5 text-[13px] font-bold text-gray-600">{r.display}</td>
                    <td className="py-3.5 text-[13px] font-bold text-gray-900">{r.sudahBayar} <span className="text-gray-400 font-medium">/ {r.totalRumah}</span></td>
                    <td className="py-3.5 text-[13px] font-bold text-gray-600">{r.belumKosong}</td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-[100px] h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand rounded-full transition-all duration-1000" style={{ width: `${r.progress}%` }}></div>
                        </div>
                        <div className="text-[12px] font-bold text-gray-700 w-10 text-right">{r.progress?.toFixed(1)}%</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showAllRt && (filteredRekapRt || []).length > 5 && (
            <div onClick={() => setShowAllRt(true)} className="mt-auto pt-4 text-brand font-bold text-[13px] cursor-pointer hover:underline inline-flex items-center gap-1 w-max">
              Lihat Semua RT <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          )}
        </div>
      </div>

      {/* SPLIT VIEW 2: KELOMPOK & AKTIVITAS */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Rekap per Kelompok */}
        <div className="bg-white rounded-2xl border border-card-border shadow-sm p-6 flex-[2] overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-[16px] text-gray-900">Rekap per Kelompok</div>
            <button onClick={() => setShowAllKelompok(!showAllKelompok)} className="text-[12px] font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors cursor-pointer">
              {showAllKelompok ? "Tampilkan Sedikit" : "Lihat Semua"}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 pt-2 text-[12px] font-bold text-gray-400 font-sans">Kelompok</th>
                  <th className="pb-3 pt-2 text-[12px] font-bold text-gray-400 font-sans">Total Rumah</th>
                  <th className="pb-3 pt-2 text-[12px] font-bold text-gray-400 font-sans">Total Pemasukan</th>
                  <th className="pb-3 pt-2 text-[12px] font-bold text-gray-400 font-sans">Sudah Bayar</th>
                  <th className="pb-3 pt-2 text-[12px] font-bold text-gray-400 font-sans">Belum/Kosong</th>
                  <th className="pb-3 pt-2 text-[12px] font-bold text-gray-400 font-sans text-right">Progress</th>
                </tr>
              </thead>
              <tbody>
                {(vm.rekapPerKelompok || []).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-[13px] text-gray-400">Belum ada data kelompok.</td>
                  </tr>
                ) : (vm.rekapPerKelompok || []).slice(0, showAllKelompok ? undefined : 5).map((k, i) => (
                  <tr key={i} onClick={() => vm.setSelectedRekapKelompok(k)} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                    <td className="py-3.5 text-[13px] font-bold text-gray-900 group-hover:text-brand transition-colors">{k.nama}</td>
                    <td className="py-3.5 text-[13px] font-bold text-gray-600">{k.totalRumah}</td>
                    <td className="py-3.5 text-[13px] font-bold text-gray-600">{k.display}</td>
                    <td className="py-3.5 text-[13px] font-bold text-gray-900">{k.sudahBayar}</td>
                    <td className="py-3.5 text-[13px] font-bold text-gray-600">{k.belumKosong}</td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-[80px] h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand rounded-full transition-all duration-1000" style={{ width: `${k.progress}%` }}></div>
                        </div>
                        <div className="text-[12px] font-bold text-gray-700 w-10 text-right">{k.progress?.toFixed(1)}%</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showAllKelompok && (vm.rekapPerKelompok || []).length > 5 && (
            <div onClick={() => setShowAllKelompok(true)} className="mt-4 pt-2 text-brand font-bold text-[13px] cursor-pointer hover:underline inline-flex items-center gap-1">
              Lihat Semua Kelompok <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          )}
        </div>

        {/* Ringkasan Aktivitas (Data Valid) */}
        <div className="bg-white rounded-2xl border border-card-border shadow-sm p-6 flex-1 lg:max-w-[320px]">
          <div className="font-bold text-[16px] text-gray-900 mb-6">Ringkasan Aktivitas</div>
          <div className="flex flex-col gap-6 relative">
            <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-100 z-0"></div>
            
            <div className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#f0f9f4] flex items-center justify-center text-brand shrink-0 border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div className="pt-0.5 w-full">
                <div className="flex justify-between items-start">
                  <div className="text-[13px] font-bold text-gray-900">Pemasukan tertinggi</div>
                  <div className="text-[11px] font-bold text-gray-400 pt-0.5">{highestRt ? "Terkini" : ""}</div>
                </div>
                <div className="text-[12px] text-gray-500 mt-0.5">{highestRt ? `${highestRt.nama} - ${highestRt.display}` : "Belum ada"}</div>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#f0f9f4] flex items-center justify-center text-brand shrink-0 border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div className="pt-0.5 w-full">
                <div className="flex justify-between items-start">
                  <div className="text-[13px] font-bold text-gray-900">Data Rumah Terdaftar</div>
                  <div className="text-[11px] font-bold text-gray-400 pt-0.5">Selalu up-to-date</div>
                </div>
                <div className="text-[12px] text-gray-500 mt-0.5">Total {totalRumahAll} rumah tercatat</div>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#f0f9f4] flex items-center justify-center text-brand shrink-0 border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div className="pt-0.5 w-full">
                <div className="flex justify-between items-start">
                  <div className="text-[13px] font-bold text-gray-900">Riwayat Penarikan Hari Ini</div>
                  <div className="text-[11px] font-bold text-gray-400 pt-0.5">Hari ini</div>
                </div>
                <div className="text-[12px] text-gray-500 mt-0.5">{txTodayCount > 0 ? `${txTodayCount} pembayaran` : "Belum ada"}</div>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#f0f9f4] flex items-center justify-center text-brand shrink-0 border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div className="pt-0.5 w-full">
                <div className="flex justify-between items-start">
                  <div className="text-[13px] font-bold text-gray-900">Status Laporan</div>
                  <div className="text-[11px] font-bold text-gray-400 pt-0.5">Real-time</div>
                </div>
                <div className="text-[12px] text-gray-500 mt-0.5">Siap diunduh PDF / Excel</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM TIP */}
      <div className="mt-6 bg-[#f0f9f4] rounded-2xl p-5 border border-[#d4eddc] flex items-start gap-3">
        <div className="text-brand shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path></svg>
        </div>
        <div>
          <div className="text-[13px] font-bold text-brand mb-0.5">Tips</div>
          <div className="text-[12px] text-green-800/80">Gunakan filter periode untuk melihat perbandingan pemasukan antar periode dengan lebih akurat. Data akan otomatis disesuaikan.</div>
        </div>
      </div>

      {/* KELOMPOK DETAIL MODAL (Existing logic) */}
      {vm.selectedRekapKelompok ? (
        <Modal onClose={() => vm.setSelectedRekapKelompok(null)}>
          <ModalHeader title={`Detail ${vm.selectedRekapKelompok.nama}`} subtitle="Penarikan Jimpitan Berdasarkan Kelompok" />
          <div className="mb-4">
            <div className="text-sm font-bold">Total Terkumpul</div>
            <div className="font-display text-xl font-extrabold text-brand">{vm.selectedRekapKelompok.display}</div>
          </div>
          <div className="text-xs font-bold text-label mb-2">Histori Sesi</div>
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {vm.selectedRekapKelompok.sesiList?.map((s) => (
              <div key={s.tanggal} className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs">{new Date(s.tanggal).toLocaleDateString("id-ID")}</span>
                <span className="text-xs font-bold text-brand">{toRupiah(s.total)}</span>
              </div>
            ))}
          </div>
          <ModalFooter onCancel={() => vm.setSelectedRekapKelompok(null)} onSave={() => vm.setSelectedRekapKelompok(null)} saveLabel="Tutup" />
        </Modal>
      ) : null}
    </div>
  );
}

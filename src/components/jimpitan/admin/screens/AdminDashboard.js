import React from "react";
import { toRupiah } from "@/lib/jimpitanData";

const COLORS = ["#1f7a4d", "#3b82f6", "#8b5cf6", "#f59e0b", "#9ca3af", "#ef4444", "#10b981"];

export function AdminDashboard({ vm }) {
  // Generate Conic Gradient for Donut Chart
  let currentPct = 0;
  const conicStops = vm.distribusiRtWithPct.map((rt, i) => {
    const start = currentPct;
    currentPct += rt.pct;
    return `${COLORS[i % COLORS.length]} ${start}% ${currentPct}%`;
  }).join(", ");
  const donutStyle = { background: `conic-gradient(${conicStops})` };

  return (
    <div className="max-w-[1100px] mx-auto pb-10">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="font-display text-[24px] font-extrabold flex items-center gap-2">
            Selamat datang, {vm.adminName}! <span className="text-xl">👋</span>
          </div>
          <div className="text-[14px] text-muted-2 mt-0.5">Berikut ringkasan jimpitan Dusun Gatak</div>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white border border-input-border rounded-xl px-3.5 py-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-2 leading-none mb-0.5">Periode</span>
              <select 
                value={vm.adminDashboardMonth} 
                onChange={(e) => vm.setAdminDashboardMonth(e.target.value)}
                className="text-[13px] font-extrabold text-brand-deep cursor-pointer focus:outline-none bg-transparent appearance-none leading-none pr-4"
              >
                {[...Array(12)].map((_, i) => {
                  const val = (i + 1).toString().padStart(2, '0');
                  const label = new Date(2000, i, 1).toLocaleString('id-ID', { month: 'short' });
                  return <option key={val} value={val}>{label} 2026</option>;
                })}
              </select>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4a544d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-ml-2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div className="flex items-center gap-2 bg-white border border-input-border rounded-xl px-3.5 py-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-2 leading-none mb-0.5">Tahun</span>
              <select
                value={vm.adminDashboardYear}
                onChange={(e) => vm.setAdminDashboardYear(e.target.value)}
                className="text-[13px] font-extrabold text-brand-deep cursor-pointer focus:outline-none bg-transparent appearance-none leading-none pr-4"
              >
                {[...Array(5)].map((_, i) => {
                  const year = (new Date().getFullYear() - 2) + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4a544d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-ml-2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-card-border p-[20px] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-muted-2 mb-1 flex items-center gap-1">Total Pemasukan <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
            <div className="font-display text-[26px] font-extrabold text-brand leading-tight mb-2">{vm.totalPemasukanDisplay}</div>
            <div className="text-[11px] font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded inline-flex items-center gap-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              12.5% dari bulan lalu
            </div>
          </div>
          <div className="w-[46px] h-[46px] rounded-full bg-[#e8f3ec] text-brand flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-card-border p-[20px] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-muted-2 mb-1 flex items-center gap-1">Total Rumah <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
            <div className="font-display text-[26px] font-extrabold text-gray-900 leading-tight mb-2">{vm.totalRumahAdmin}</div>
            <div className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-flex items-center gap-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              3 rumah dari bulan lalu
            </div>
          </div>
          <div className="w-[46px] h-[46px] rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-card-border p-[20px] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-muted-2 mb-1 flex items-center gap-1">Total Kelompok <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
            <div className="font-display text-[26px] font-extrabold text-gray-900 leading-tight mb-2">{vm.totalKelompok}</div>
            <div className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded inline-flex items-center gap-0.5">
              Sama seperti bulan lalu
            </div>
          </div>
          <div className="w-[46px] h-[46px] rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-card-border p-[20px] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-muted-2 mb-1 flex items-center gap-1">Transaksi Bulan Ini <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
            <div className="font-display text-[26px] font-extrabold text-gray-900 leading-tight mb-2">{vm.transaksiBulanIniCount}</div>
            <div className="text-[11px] font-semibold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded inline-flex items-center gap-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              18 transaksi dari bulan lalu
            </div>
          </div>
          <div className="w-[46px] h-[46px] rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl border border-card-border shadow-sm flex flex-col p-[22px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[14px] font-bold text-gray-900">Tren Pemasukan</h3>
            <select 
              value={vm.trendFilter || "minggu"} 
              onChange={(e) => vm.setTrendFilter(e.target.value)}
              className="text-[12px] font-bold text-muted-2 bg-transparent outline-none cursor-pointer"
            >
              <option value="minggu">7 Hari Terakhir</option>
              <option value="bulan">1 Bulan Terakhir</option>
              <option value="tahun">1 Tahun Terakhir</option>
            </select>
          </div>
          
          <div className="relative h-[220px] w-full flex-1 border-b border-gray-100 flex items-end">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f7a4d" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1f7a4d" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Build coordinates for SVG */}
              {(() => {
                const len = vm.trendBars.length;
                if(len === 0) return null;
                const points = vm.trendBars.map((b, i) => {
                  const x = (i / (len - 1)) * 100;
                  const y = 100 - b.heightPct;
                  return `${x},${y}`;
                }).join(" ");
                const areaPoints = `0,100 ${points} 100,100`;
                
                return (
                  <>
                    <polygon points={areaPoints} fill="url(#trendGradient)" />
                    <polyline points={points} fill="none" stroke="#1f7a4d" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    {vm.trendBars.map((b, i) => {
                      const x = (i / (len - 1)) * 100;
                      const y = 100 - b.heightPct;
                      return (
                        <g key={i} className="group cursor-pointer">
                          <circle cx={x} cy={y} r="1.5" fill="#fff" stroke="#1f7a4d" strokeWidth="0.8" vectorEffect="non-scaling-stroke" className="transition-all group-hover:r-[2.5]" />
                          <rect x={x - (100 / (len * 2))} y="0" width={100 / len} height="100" fill="transparent" />
                          <text x={x} y={y - 8} textAnchor="middle" fontSize="4" className="font-bold fill-gray-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-white">
                            {toRupiah(b.total)}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="flex justify-between items-center mt-3 px-2">
            {vm.trendBars.map((b, i) => {
              const len = vm.trendBars.length;
              // Show fewer labels if there are many data points (e.g., month view)
              if (len > 12 && i % Math.ceil(len / 6) !== 0 && i !== len - 1) return null;
              return <div key={i} className="text-[10px] font-bold text-muted-2 text-center">{b.label}</div>;
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
            <div className="text-center">
              <div className="text-[11px] font-semibold text-muted-2 mb-1">Rata-rata harian</div>
              <div className="text-[16px] font-extrabold text-brand">{toRupiah(vm.trenSummary.rataRataHarian)}</div>
            </div>
            <div className="text-center border-l border-r border-gray-100">
              <div className="text-[11px] font-semibold text-muted-2 mb-1">Pemasukan tertinggi</div>
              <div className="text-[16px] font-extrabold text-brand">{toRupiah(vm.trenSummary.pemasukanTertinggi)}</div>
            </div>
            <div className="text-center">
              <div className="text-[11px] font-semibold text-muted-2 mb-1">Pemasukan terendah</div>
              <div className="text-[16px] font-extrabold text-danger">{toRupiah(vm.trenSummary.pemasukanTerendah)}</div>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl border border-card-border shadow-sm flex flex-col p-[22px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[14px] font-bold text-gray-900 flex items-center gap-1.5">Distribusi Pemasukan per RT <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></h3>
            <select className="text-[12px] font-bold text-muted-2 bg-transparent outline-none cursor-pointer">
              <option>Berdasarkan Nominal</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
            {vm.distribusiRtWithPct.length > 0 ? (
              <>
                <div className="flex-1 max-w-[240px] flex flex-col gap-3.5 order-2 sm:order-1 w-full">
                  {vm.distribusiRtWithPct.map((rt, i) => (
                    <div key={rt.nama} className="flex items-start gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <div>
                        <div className="text-[13px] font-bold text-gray-900 leading-none mb-1">{rt.nama}</div>
                        <div className="text-[11px] font-medium text-muted-2 leading-none">{toRupiah(rt.total)} ({rt.pct}%)</div>
                      </div>
                    </div>
                  ))}
                  <div className="text-[11px] font-medium text-muted-2 mt-2 pt-2 border-t border-gray-100 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    Persentase dihitung dari total pemasukan bulan ini
                  </div>
                </div>
                <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] shrink-0 order-1 sm:order-2">
                  <div className="w-full h-full rounded-full" style={donutStyle}></div>
                  <div className="absolute inset-0 m-auto w-[65%] h-[65%] bg-white rounded-full flex flex-col items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                    <span className="text-[11px] font-bold text-muted-2 mb-0.5">Total</span>
                    <span className="text-[16px] sm:text-[18px] font-extrabold text-gray-900">{vm.totalPemasukanDisplay}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-sm font-bold text-muted-2 w-full">Belum ada data distribusi pemasukan</div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress RT */}
        <div className="bg-white rounded-2xl border border-card-border shadow-sm flex flex-col p-[22px]">
          <h3 className="text-[14px] font-bold text-gray-900 mb-5">Progres Pengambilan Hari ini per RT</h3>
          <div className="flex items-center text-[11px] font-bold text-muted-2 border-b border-gray-100 pb-2 mb-4">
            <div className="w-[100px]">RT</div>
            <div className="flex-1">Dukuhan</div>
            <div className="w-[60px] text-right">Progres</div>
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            {vm.rtProgress.map((rt) => (
              <div key={rt.nama} className="flex items-center gap-4 group">
                <div className="w-[100px] text-[13px] font-extrabold text-gray-900">{rt.nama}</div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-brand transition-all duration-700 relative" style={{ width: `${rt.pct}%` }}>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <div className="w-[80px] text-[11px] font-bold text-muted-2 text-right">{rt.doneCount}/{rt.totalCount} rumah</div>
                </div>
                <div className="w-[60px] text-[13px] font-extrabold text-gray-900 text-right">{rt.pct}%</div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity" onClick={vm.goToAdminRiwayat}>
            <span className="text-[12px] font-bold text-gray-900">Lihat detail progres</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </div>

        {/* Transaksi Terbaru */}
        <div className="bg-white rounded-2xl border border-card-border shadow-sm flex flex-col p-[22px]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[14px] font-bold text-gray-900">Transaksi Terbaru</h3>
            <button onClick={vm.goToAdminRiwayat} className="text-[11px] font-bold bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">Lihat semua</button>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            {vm.transaksiTerbaru.length > 0 ? (
              vm.transaksiTerbaru.map((t) => (
                <div key={t.id} onClick={vm.goToAdminRiwayat} className="flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-display font-extrabold text-[14px] shrink-0">
                    {t.nama.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-extrabold text-gray-900 truncate flex items-center gap-1.5">
                      {t.nama} <span className="text-[11px] font-medium text-muted-2 truncate">- {t.alamat || "Alamat tidak tersedia"}</span>
                    </div>
                    <div className="text-[11px] font-medium text-muted-2 mt-0.5">{t.date}, {t.time}</div>
                  </div>
                  <div className="text-right shrink-0 pr-1">
                    <div className="text-[13px] font-extrabold text-brand">{toRupiah(t.nominal)}</div>
                    <div className="text-[9px] font-bold text-brand bg-brand/10 inline-block px-1.5 py-0.5 rounded mt-0.5">Berhasil</div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-sm font-bold text-muted-2 w-full">Belum ada transaksi bulan ini</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

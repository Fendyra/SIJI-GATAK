import React, { useState, useEffect } from "react";
import { toRupiah } from "@/lib/jimpitanData";

export function Dashboard({ vm }) {
  const [chartScale, setChartScale] = useState("minggu"); // "minggu", "bulan", "tahun"
  const [backendTrendBars, setBackendTrendBars] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const kelId = vm.currentUser?.kelompok_id;
        if (!kelId) return;
        
        let periode = chartScale === "minggu" ? "mingguan" : chartScale === "bulan" ? "bulanan" : "tahunan";
        const res = await vm.apiFetch(`/api/rekap?periode=${periode}&kelompok_id=${kelId}`);
        const trx = res.transaksi || [];
        
        let bars = [];
        if (chartScale === "minggu") {
          bars = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((label, index) => {
            const total = trx.filter(t => {
              const d = new Date(t.created_at);
              let day = d.getDay();
              day = day === 0 ? 6 : day - 1; // Map Sun(0)->6, Mon(1)->0
              return day === index && t.status === "sudah";
            }).reduce((sum, t) => sum + t.nominal, 0);
            return { label, total };
          });
        } else if (chartScale === "bulan") {
          bars = ["M1", "M2", "M3", "M4"].map((label, index) => {
             const total = trx.filter(t => {
                const d = new Date(t.created_at);
                const weekIndex = Math.min(Math.floor((d.getDate() - 1) / 7), 3);
                return weekIndex === index && t.status === "sudah";
             }).reduce((sum, t) => sum + t.nominal, 0);
             return { label, total };
          });
        } else if (chartScale === "tahun") {
          bars = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"].map((label, index) => {
             const total = trx.filter(t => {
                const d = new Date(t.created_at);
                return d.getMonth() === index && t.status === "sudah";
             }).reduce((sum, t) => sum + t.nominal, 0);
             return { label, total };
          });
        }
        if (isMounted) setBackendTrendBars(bars);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [chartScale, vm.currentUser]);

  // SVG Donut Chart calculations for "Status Pengambilan"
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  const selesaiPct = vm.totalHouses ? (vm.sudahCount / vm.totalHouses) * 100 : 0;
  const belumPct = vm.totalHouses ? (vm.pendingCount / vm.totalHouses) * 100 : 0;
  const kosongPct = vm.totalHouses ? (vm.kosongCount / vm.totalHouses) * 100 : 0;
  
  const selesaiDash = (selesaiPct / 100) * circumference;
  const belumDash = (belumPct / 100) * circumference;
  const kosongDash = (kosongPct / 100) * circumference;
  
  const selesaiOffset = 0;
  const belumOffset = -selesaiDash;
  const kosongOffset = -(selesaiDash + belumDash);

  const chartBars = backendTrendBars || [];
  
  // Calculate max scale with nice rounded steps (kelipatan yang jelas)
  const rawMax = Math.max(...chartBars.map(b => b.total), 1000);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  let step = Math.ceil(rawMax / magnitude / 4) * magnitude;
  // Ensure minimum step is nice so we don't get Rp1k repeated
  if (step < 1000) step = 1000;
  const maxChartValue = Math.max(step * 4, 4000);

  // SVG Line Chart calculations for "Ringkasan Nominal"
  const chartHeight = 160;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;
  const netWidth = chartWidth - paddingX * 2;
  const netHeight = chartHeight - paddingY * 2;
  
  // Create points for line chart
  const points = chartBars.map((bar, i) => {
    const x = paddingX + (i / (chartBars.length - 1)) * netWidth;
    const y = chartHeight - paddingY - (bar.total / maxChartValue) * netHeight;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="max-w-[1000px]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="animate-fade-in-up font-display mb-1 text-[28px] font-extrabold flex items-center gap-2 text-gray-900">
            Selamat bertugas, {vm.firstName}
          </div>
          <div className="animate-fade-in-up text-sm font-medium text-gray-500" style={{ animationDelay: "0.05s" }}>
            {vm.today} • {vm.kelompok} • {vm.rt}
          </div>
        </div>
      </div>

      {/* 4 Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Progres Card (Green) */}
        <div className="animate-fade-in-up flex flex-col justify-between rounded-[20px] bg-[#2e7d32] p-5 text-white shadow-md relative overflow-hidden" style={{ animationDelay: "0.15s" }}>
          <div className="font-bold text-[15px] mb-4">Progres Hari Ini</div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative h-[72px] w-[72px] flex-shrink-0">
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="188.5"
                  strokeDashoffset={188.5 - (188.5 * vm.progressPct) / 100}
                  transform="rotate(-90 36 36)"
                  style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold font-display">
                {vm.progressPct}%
              </div>
            </div>
            <div>
              <div className="text-[17px] font-extrabold font-display leading-tight">{vm.doneCount} dari {vm.totalHouses}<br/>rumah</div>
              <div className="text-[12px] text-white/80 font-medium">sudah dikunjungi</div>
            </div>
          </div>
          <button 
            onClick={vm.goToList}
            className="mt-5 w-full bg-white text-[#2e7d32] rounded-xl py-2.5 text-[13px] font-bold shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer border-none"
          >
            Mulai Pengambilan <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        {/* Terkumpul Card */}
        <div className="animate-fade-in-up flex flex-col justify-center rounded-[20px] bg-white border border-gray-100 p-5 shadow-sm" style={{ animationDelay: "0.2s" }}>
          <div className="font-bold text-[15px] mb-4 text-gray-800">Terkumpul Hari Ini</div>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#e8f5e9] text-[#2e7d32] font-display font-black text-xl">
              Rp
            </div>
            <div>
              <div className="text-[22px] font-extrabold text-[#2e7d32] font-display leading-tight">{vm.totalTerkumpulDisplay}</div>
              <div className="text-[12px] text-gray-400 font-medium leading-snug">Total nominal<br/>jimpitan</div>
            </div>
          </div>
        </div>

        {/* Rumah Kosong Card */}
        <div className="animate-fade-in-up flex flex-col justify-center rounded-[20px] bg-white border border-gray-100 p-5 shadow-sm" style={{ animationDelay: "0.25s" }}>
          <div className="font-bold text-[15px] mb-4 text-gray-800">Rumah Kosong</div>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#fff3e0] text-[#f57c00]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </div>
            <div>
              <div className="text-[22px] font-extrabold text-[#f57c00] font-display leading-tight">{vm.kosongCount}</div>
              <div className="text-[12px] text-gray-400 font-medium leading-snug">Rumah tidak<br/>ditemukan</div>
            </div>
          </div>
        </div>

        {/* Belum Diambil Card */}
        <div className="animate-fade-in-up flex flex-col justify-center rounded-[20px] bg-white border border-gray-100 p-5 shadow-sm" style={{ animationDelay: "0.3s" }}>
          <div className="font-bold text-[15px] mb-4 text-gray-800">Belum Diambil</div>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#e3f2fd] text-[#1976d2]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </div>
            <div>
              <div className="text-[22px] font-extrabold text-[#1976d2] font-display leading-tight">{vm.pendingCount}</div>
              <div className="text-[12px] text-gray-400 font-medium leading-snug">Rumah belum<br/>dikunjungi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Line Chart */}
        <div className="animate-fade-in-up lg:col-span-2 rounded-[20px] bg-white border border-gray-100 p-6 shadow-sm flex flex-col" style={{ animationDelay: "0.35s" }}>
          <div className="flex justify-between items-center mb-6">
            <div className="font-bold text-gray-800 text-[16px]">Ringkasan Nominal</div>
            <select
              value={chartScale}
              onChange={(e) => setChartScale(e.target.value)}
              className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="minggu">Minggu Ini</option>
              <option value="bulan">Bulan Ini</option>
              <option value="tahun">Tahun Ini</option>
            </select>
          </div>
          
          <div className="flex-1 w-full overflow-hidden relative min-h-[220px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full" preserveAspectRatio="none">
              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingY + ratio * netHeight;
                let yLabel = "Rp0";
                if (i < 4) {
                  const val = maxChartValue * (1 - ratio);
                  yLabel = val >= 1000000 ? `Rp${(val/1000000).toFixed(1)}m` : `Rp${Math.round(val/1000)}k`;
                }
                return (
                  <g key={i}>
                    <line x1={paddingX} y1={y} x2={chartWidth} y2={y} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4,4" />
                    <text x={paddingX - 5} y={y + 3} textAnchor="end" fontSize="10" fill="#9ca3af" fontWeight="600">
                      {yLabel}
                    </text>
                  </g>
                );
              })}
              
              {/* X Axis Labels */}
              {chartBars.map((bar, i) => {
                const x = paddingX + (i / (chartBars.length - 1)) * netWidth;
                return (
                  <text key={i} x={x} y={chartHeight - 2} textAnchor="middle" fontSize="10" fill="#9ca3af" fontWeight="600">
                    {bar.label}
                  </text>
                );
              })}
              
              {/* Data Line */}
              <polyline 
                points={points}
                fill="none"
                stroke="#2e7d32"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data Points */}
              {chartBars.map((bar, i) => {
                const x = paddingX + (i / (chartBars.length - 1)) * netWidth;
                const y = chartHeight - paddingY - (bar.total / maxChartValue) * netHeight;
                return (
                  <circle key={i} cx={x} cy={y} r="4" fill="#2e7d32" stroke="#fff" strokeWidth="2" />
                );
              })}
            </svg>
          </div>
          <div className="mt-4 flex justify-center items-center gap-2 text-xs font-bold text-gray-500">
            <div className="w-4 h-0.5 bg-[#2e7d32]"></div> Terkumpul
          </div>
        </div>

        {/* Donut Chart */}
        <div className="animate-fade-in-up rounded-[20px] bg-white border border-gray-100 p-6 shadow-sm flex flex-col" style={{ animationDelay: "0.4s" }}>
          <div className="font-bold text-gray-800 text-[16px] mb-6">Status Pengambilan</div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-[160px] h-[160px] mb-8">
              <svg width="160" height="160" viewBox="0 0 160 160">
                {/* Background circle */}
                <circle cx="80" cy="80" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="18" />
                
                {/* Kosong (Orange) */}
                {kosongPct > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="#f57c00"
                    strokeWidth="18"
                    strokeDasharray={`${kosongDash} ${circumference}`}
                    strokeDashoffset={kosongOffset}
                    transform="rotate(-90 80 80)"
                  />
                )}
                
                {/* Belum (Blue) */}
                {belumPct > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="#1976d2"
                    strokeWidth="18"
                    strokeDasharray={`${belumDash} ${circumference}`}
                    strokeDashoffset={belumOffset}
                    transform="rotate(-90 80 80)"
                  />
                )}
                
                {/* Selesai (Green) */}
                {selesaiPct > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="#2e7d32"
                    strokeWidth="18"
                    strokeDasharray={`${selesaiDash} ${circumference}`}
                    strokeDashoffset={selesaiOffset}
                    transform="rotate(-90 80 80)"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-display text-2xl font-black text-gray-900">{Math.round(selesaiPct)}%</div>
                <div className="text-[11px] font-bold text-gray-500">Selesai</div>
              </div>
            </div>
            
            <div className="w-full flex flex-col gap-3 px-2">
              <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#2e7d32]"></div> Selesai</div>
                <div>{vm.sudahCount} ({Math.round(selesaiPct)}%)</div>
              </div>
              <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#1976d2]"></div> Belum Diambil</div>
                <div>{vm.pendingCount} ({Math.round(belumPct)}%)</div>
              </div>
              <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#f57c00]"></div> Rumah Kosong</div>
                <div>{vm.kosongCount} ({Math.round(kosongPct)}%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section (Aksi Cepat) */}
      <div className="animate-fade-in-up rounded-[20px] bg-white border border-gray-100 p-6 shadow-sm" style={{ animationDelay: "0.45s" }}>
        <div className="font-bold text-gray-800 text-[16px] mb-4">Aksi Cepat</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={vm.openScan}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-[#2e7d32] hover:bg-[#f1f8f2] cursor-pointer transition-colors group text-left bg-white"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2e7d32] rounded-xl flex items-center justify-center text-white shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><rect x="7" y="7" width="10" height="10" rx="1"></rect></svg>
              </div>
              <div>
                <div className="font-bold text-[15px] text-gray-900 group-hover:text-[#2e7d32]">Mulai Pengambilan</div>
                <div className="text-[12px] font-medium text-gray-500">Scan QR rumah untuk memulai</div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#2e7d32] transition-colors"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
          
          <button 
            onClick={() => vm.goToRiwayat ? vm.goToRiwayat() : null}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-[#2e7d32] hover:bg-[#f1f8f2] cursor-pointer transition-colors group text-left bg-white"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e8f5e9] text-[#2e7d32] rounded-xl flex items-center justify-center shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </div>
              <div>
                <div className="font-bold text-[15px] text-gray-900 group-hover:text-[#2e7d32]">Lihat Riwayat</div>
                <div className="text-[12px] font-medium text-gray-500">Lihat daftar pengambilan sebelumnya</div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#2e7d32] transition-colors"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

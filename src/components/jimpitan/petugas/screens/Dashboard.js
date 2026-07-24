import React from "react";
export function Dashboard({ vm }) {
  return (
    <div className="max-w-[720px]">
      <div className="animate-fade-in-up font-display mb-0.5 text-[23px] font-extrabold">
        Selamat bertugas, {vm.firstName}
      </div>
      <div className="animate-fade-in-up mb-[22px] text-sm text-muted" style={{ animationDelay: "0.05s" }}>
        {vm.today} · {vm.kelompok} · {vm.rt}
      </div>

      <div
        className="animate-fade-in-up mb-4 flex flex-wrap items-center gap-[22px] rounded-[18px] border border-card-border bg-white p-[22px] shadow-[0_12px_30px_-20px_rgba(28,36,32,0.2)]"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="relative h-[104px] w-[104px] flex-shrink-0">
          <svg width="104" height="104" viewBox="0 0 104 104">
            <circle cx="52" cy="52" r="44" fill="none" stroke="#f1efe7" strokeWidth="12" />
            <circle
              cx="52"
              cy="52"
              r="44"
              fill="none"
              stroke="#1f7a4d"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="276.5"
              strokeDashoffset={vm.progressDashOffset}
              transform="rotate(-90 52 52)"
              style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)" }}
            />
          </svg>
          <div className="font-display absolute inset-0 flex items-center justify-center text-xl font-extrabold text-ink">
            {vm.progressPct}%
          </div>
        </div>
        <div className="min-w-[180px] flex-1">
          <div className="mb-1.5 text-sm font-bold text-label">Progres Pengambilan Hari Ini</div>
          <div className="mb-3.5 text-[13px] text-muted">
            {vm.doneCount} dari {vm.totalHouses} rumah sudah dikunjungi
          </div>
          <button
            onClick={vm.goToList}
            className="w-full cursor-pointer rounded-xl border-none bg-brand py-3.5 text-[15px] font-bold text-white shadow-[0_10px_20px_-12px_#1f7a4d80] transition-[background,transform] duration-150 hover:bg-brand-dark active:scale-[0.98]"
          >
            Mulai Pengambilan
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="animate-fade-in-up min-w-[140px] flex-1 rounded-[14px] border border-card-border bg-white p-4" style={{ animationDelay: "0.15s" }}>
          <div className="mb-1.5 text-xs font-semibold text-muted-2">Terkumpul Hari Ini</div>
          <div className="font-display text-xl font-extrabold text-brand">{vm.totalTerkumpulDisplay}</div>
        </div>
        <div className="animate-fade-in-up min-w-[140px] flex-1 rounded-[14px] border border-card-border bg-white p-4" style={{ animationDelay: "0.2s" }}>
          <div className="mb-1.5 text-xs font-semibold text-muted-2">Rumah Kosong</div>
          <div className="font-display text-xl font-extrabold text-warn">{vm.kosongCount}</div>
        </div>
        <div className="animate-fade-in-up min-w-[140px] flex-1 rounded-[14px] border border-card-border bg-white p-4" style={{ animationDelay: "0.25s" }}>
          <div className="mb-1.5 text-xs font-semibold text-muted-2">Belum Diambil</div>
          <div className="font-display text-xl font-extrabold">{vm.pendingCount}</div>
        </div>
      </div>
    </div>
  );
}

"use client";

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

export function ListScreen({ vm }) {
  return (
    <div className="max-w-[720px]">
      <div className="font-display mb-0.5 text-xl font-extrabold">Pengambilan Jimpitan</div>
      <div className="mb-[18px] text-[13px] text-muted">
        {vm.kelompok} · {vm.rt}
      </div>

      <button
        onClick={vm.openScan}
        className="mb-3.5 w-full cursor-pointer rounded-xl border-none bg-brand py-[15px] text-[15px] font-bold text-white transition-transform hover:bg-brand-dark active:scale-[0.98]"
      >
        Scan QR Rumah
      </button>

      <input
        type="text"
        value={vm.search}
        onChange={vm.onSearchChange}
        placeholder="Cari nama atau alamat rumah…"
        className="mb-4 w-full rounded-[10px] border border-input-border px-3.5 py-3 font-sans text-sm"
      />

      <div className="flex flex-col gap-2.5">
        {vm.filteredHouses.map((h, index) => (
          <div
            key={h.id}
            onClick={h.onClick}
            className="animate-fade-in-up flex items-center justify-between rounded-[14px] border border-card-border bg-white px-4 py-3.5 transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-16px_rgba(28,36,32,0.35)]"
            style={{ cursor: h.cursor, opacity: h.rowOpacity, animationDelay: `${index * 10}ms` }}
          >
            <div>
              <div className="text-sm font-bold">{h.nama}</div>
              <div className="text-xs text-muted-2">{h.alamat}</div>
            </div>
            <div
              className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold"
              style={{ background: h.statusBg, color: h.statusColor }}
            >
              {h.statusLabel}
            </div>
          </div>
        ))}
      </div>
      {vm.noHousesFound ? (
        <div className="py-[30px] text-center text-[13px] text-muted-2">Rumah tidak ditemukan.</div>
      ) : null}
    </div>
  );
}

export function ScanScreen({ vm }) {
  return (
    <div className="max-w-[480px]">
      <button onClick={vm.goToList} className="mb-4 cursor-pointer border-none bg-transparent p-0 text-[13px] font-bold text-muted">
        ‹ Kembali
      </button>
      <div className="font-display mb-1 text-xl font-extrabold">Scan QR Rumah</div>
      <div className="mb-[22px] text-[13px] text-muted">
        Arahkan kamera ke QR Code yang tertempel di rumah warga.
      </div>

      <div className="relative mb-5 flex aspect-square items-center justify-center overflow-hidden rounded-[18px] bg-ink">
        <div
          className={`flex h-[68%] w-[68%] items-center justify-center rounded-2xl border-[3px] border-dashed border-white/33 ${
            vm.isScanning ? "animate-scan-pulse" : ""
          }`}
        >
          {vm.isScanning ? (
            <div className="animate-scan-pulse text-[13px] font-bold text-white/67">Memindai…</div>
          ) : null}
          {vm.isScanIdle ? (
            <div className="text-[13px] font-bold text-white/33">Area Pemindaian</div>
          ) : null}
        </div>
      </div>

      {vm.isScanEmpty ? (
        <div className="mb-3.5 rounded-[10px] bg-green-bg px-3.5 py-3 text-center text-[13px] font-bold text-brand">
          Semua rumah pada rute sudah diambil hari ini.
        </div>
      ) : null}

      <button
        onClick={vm.simulateScan}
        disabled={vm.isScanning}
        className="mb-2.5 w-full cursor-pointer rounded-xl border-none bg-brand py-[15px] text-[15px] font-bold text-white transition-transform hover:bg-brand-dark active:scale-[0.98] disabled:cursor-default disabled:opacity-70"
      >
        {vm.scanButtonLabel}
      </button>
      <button
        onClick={vm.goToList}
        className="w-full cursor-pointer rounded-xl border border-input-border bg-white py-[13px] text-sm font-bold text-ink"
      >
        Cari Manual
      </button>
    </div>
  );
}

export function DetailScreen({ vm }) {
  const h = vm.selectedHouse;
  return (
    <div className="max-w-[480px]">
      <button onClick={vm.goToList} className="mb-4 cursor-pointer border-none bg-transparent p-0 text-[13px] font-bold text-muted">
        ‹ Kembali
      </button>

      <div className="mb-4 rounded-2xl border border-card-border bg-white p-[22px]">
        <div
          className="mb-3 inline-block rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ background: h.statusBg, color: h.statusColor }}
        >
          {h.statusLabel}
        </div>
        <div className="font-display text-[19px] font-extrabold">{h.nama}</div>
        <div className="mb-1 text-[13px] text-muted">{h.alamat}</div>
        <div className="text-xs text-muted-2">{vm.rt}</div>
      </div>

      {vm.isEditableSelected ? (
        <div className="rounded-2xl border border-card-border bg-white p-[22px]">
          <label className="mb-2 block text-[13px] font-bold text-label">Nominal Diterima</label>
          <input
            type="number"
            value={vm.nominalInput}
            onChange={vm.onNominalChange}
            className="mb-4 w-full rounded-[10px] border border-input-border px-3.5 py-[13px] font-sans text-lg font-bold"
          />
          <button
            onClick={vm.saveSudah}
            className="mb-2.5 w-full cursor-pointer rounded-xl border-none bg-brand py-[15px] text-[15px] font-bold text-white transition-transform hover:bg-brand-dark active:scale-[0.98]"
          >
            Simpan Transaksi
          </button>
          <button
            onClick={vm.saveKosong}
            className="w-full cursor-pointer rounded-xl border border-input-border bg-white py-[13px] text-sm font-bold text-warn"
          >
            Tandai Rumah Kosong
          </button>
        </div>
      ) : null}
      {vm.isReadonlySelected ? (
        <div className="rounded-2xl border border-card-border bg-white p-[22px]">
          <div className="mb-2 flex justify-between text-[13px]">
            <span className="text-muted-2">Waktu</span>
            <span className="font-bold">{h.lastTime}</span>
          </div>
          <div className="mb-4 flex justify-between text-[13px]">
            <span className="text-muted-2">Nominal</span>
            <span className="font-bold">{h.nominalDisplay}</span>
          </div>
          <div className="border-t border-card-border pt-3 text-xs text-muted-2">
            Transaksi sudah tercatat. Koreksi data hanya dapat dilakukan oleh Admin.
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function RiwayatScreen({ vm }) {
  return (
    <div className="max-w-[720px]">
      <div className="font-display mb-0.5 text-xl font-extrabold">Riwayat & Tracking Harian</div>
      <div className="mb-[18px] text-[13px] text-muted flex items-center gap-3">
        <span>Tanggal:</span>
        <input 
          type="date" 
          value={vm.riwayatDate}
          onChange={vm.onRiwayatDateChange}
          className="rounded-lg border border-input-border bg-white px-2 py-1 text-sm font-bold"
        />
      </div>

      <div className="mb-4 flex gap-2">
        {vm.riwayatFilters.map((f) => (
          <button
            key={f.key}
            onClick={f.onClick}
            className="cursor-pointer rounded-full border border-input-border px-3.5 py-2 text-[13px] font-bold"
            style={{ background: f.bg, color: f.color }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2.5">
        {vm.riwayatFiltered.map((t, index) => (
          <div
            key={t.id}
            className="animate-fade-in-up flex items-center justify-between rounded-[14px] border border-card-border bg-white px-4 py-3.5"
            style={{ animationDelay: `${index * 10}ms` }}
          >
            <div>
              <div className="text-sm font-bold">{t.nama}</div>
              <div className="text-xs text-muted-2">{t.time}</div>
            </div>
            <div
              className="rounded-full px-2.5 py-1 text-[13px] font-extrabold"
              style={{ background: t.statusBg, color: t.statusColor }}
            >
              {t.displayValue}
            </div>
          </div>
        ))}
      </div>
      {vm.noRiwayat ? (
        <div className="py-[30px] text-center text-[13px] text-muted-2">Belum ada transaksi.</div>
      ) : null}

      <div className="flex items-center justify-between rounded-[14px] bg-green-bg p-4">
        <div className="text-[13px] font-bold text-brand-deep">Total Terkumpul</div>
        <div className="text-[17px] font-extrabold text-brand-deep">{vm.totalTerkumpulDisplay}</div>
      </div>
    </div>
  );
}

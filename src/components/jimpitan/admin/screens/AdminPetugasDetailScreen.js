import React from "react";
import { toRupiah } from "@/lib/jimpitanData";

const IconArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export function AdminPetugasDetailScreen({ vm }) {
  const p = vm.petugasDetailAccount;
  if (!p) return null;

  const totalCollected = vm.petugasDetailHistory
    .filter(tx => tx.status === 'sudah')
    .reduce((sum, tx) => sum + (tx.nominal || 0), 0);

  return (
    <div className="w-full relative min-h-full flex flex-col max-w-[800px] mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={vm.goToAdminPetugas}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-card-border cursor-pointer transition-colors hover:bg-gray-50 active:scale-95 shadow-sm"
        >
          <IconArrowLeft />
        </button>
        <div>
          <div className="font-display text-xl font-extrabold text-gray-900 tracking-tight leading-tight">Tracking Kinerja Petugas</div>
          <div className="text-[13px] text-muted-2 leading-tight">Histori pengambilan jimpitan</div>
        </div>
      </div>

      {/* Petugas Summary Card */}
      <div className="rounded-[20px] bg-white border border-card-border p-5 shadow-sm mb-6 relative overflow-hidden flex flex-col md:flex-row gap-6 md:items-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-[100px] pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10 flex-1">
          <div className="w-[60px] h-[60px] rounded-full flex flex-shrink-0 items-center justify-center bg-gray-100 text-gray-400 border-2 border-white shadow-sm">
            <IconUser />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[20px] font-black tracking-tight text-gray-900 mb-0.5">{p.nama}</div>
            <div className="text-[14px] font-semibold text-muted-2 mb-2">
              Kelompok {p.kelompok || p.kelompok?.nama || "-"}
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-[12px] font-extrabold tracking-wide uppercase" style={{ background: p.aktif ? "#e8f3ec" : "#f1efe7", color: p.aktif ? "#1f7a4d" : "#8a8578" }}>
              {p.aktif ? "Aktif" : "Nonaktif"}
            </div>
          </div>
        </div>

        <div className="md:border-l md:border-gray-100 md:pl-6 relative z-10 flex flex-col min-w-[150px]">
          <div className="text-[12px] font-bold text-muted-2 mb-1 uppercase tracking-wide">Total Terkumpul</div>
          <div className="text-[24px] font-black text-brand tracking-tight">{toRupiah(totalCollected)}</div>
          <div className="text-[12px] font-semibold text-muted-2 mt-1">Dari {vm.petugasDetailHistory.length} catatan transaksi</div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="flex-1 flex flex-col">
        <div className="text-[15px] font-extrabold text-gray-900 mb-3 px-1">Riwayat Pengambilan Terakhir</div>
        
        <div className="bg-white rounded-[20px] border border-card-border overflow-hidden shadow-sm">
          {vm.petugasDetailHistory.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <IconClock />
              </div>
              <div className="text-[15px] font-bold text-gray-800">Sedang memuat data...</div>
              <div className="text-[13px] text-muted-2 mt-1">Atau belum ada riwayat transaksi.</div>
            </div>
          ) : (
            <div className="flex flex-col">
              {vm.petugasDetailHistory.map((tx, idx) => {
                const isDone = tx.status === 'sudah';
                const isEmpty = tx.status === 'kosong';
                
                let date;
                if (tx.time && tx.time.includes(":")) {
                  date = new Date();
                  const [h, m] = tx.time.split(":");
                  date.setHours(h, m, 0, 0);
                } else {
                  date = new Date(tx.created_at || Date.now());
                }

                const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
                const dateStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
                const timeStr = tx.time || date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

                return (
                  <div 
                    key={tx.id} 
                    onClick={() => vm.openCorrection(tx)}
                    className="flex flex-col sm:flex-row sm:items-center cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 px-6 py-4 gap-4"
                  >
                    {/* Date Block */}
                    <div className="w-auto sm:w-24 flex flex-row sm:flex-col items-center sm:items-start justify-start flex-shrink-0 sm:border-r border-gray-100 sm:pr-4">
                      <div className="text-[11px] font-extrabold uppercase text-muted-2 tracking-wider mr-2 sm:mr-0">{dayName},</div>
                      <div className="text-[14px] sm:text-[15px] font-black text-gray-900">{dateStr}</div>
                    </div>
                    
                    {/* Content Block */}
                    <div className="flex-1 flex justify-between items-center bg-gray-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                      <div>
                        <div className="text-[15px] font-bold text-gray-900 mb-0.5">
                          {tx.nama || "Rumah Tidak Diketahui"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-2">
                          <IconClock />
                          <span>Pukul {timeStr}</span>
                          <span className="mx-1">•</span>
                          <span>Kel. {tx.kelompok || "Tidak diketahui"}</span>
                        </div>
                      </div>
                      
                      {/* Status / Nominal */}
                      <div className="flex flex-col items-end justify-center ml-4">
                        <div className={`text-[15px] font-black tracking-tight ${isDone ? 'text-brand' : isEmpty ? 'text-amber-500' : 'text-gray-400'}`}>
                          {isDone ? toRupiah(tx.nominal) : isEmpty ? "Kosong" : "Belum"}
                        </div>
                        {isDone && (
                          <div className="text-[9px] font-extrabold text-brand bg-brand-light/50 px-2 py-0.5 rounded flex items-center gap-1 mt-1 uppercase tracking-wider">
                            <IconCheck /> Selesai
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

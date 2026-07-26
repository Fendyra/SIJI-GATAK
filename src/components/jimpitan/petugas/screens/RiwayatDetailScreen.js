import React from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { CorrectionModal, TransactionInvoiceModal } from "../../ui/SharedUI";

const IconArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export function RiwayatDetailScreen({ vm }) {
  const h = vm.riwayatDetailHouse;
  if (!h) return null;

  return (
    <div className="max-w-[720px] w-full pb-20 relative min-h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => vm.isAdminShell ? vm.goToAdminRiwayat() : vm.goToRiwayat()}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-card-border cursor-pointer transition-colors hover:bg-gray-50 active:scale-95"
        >
          <IconArrowLeft />
        </button>
        <div>
          <div className="font-display text-xl font-extrabold text-gray-900 tracking-tight leading-tight">Detail Riwayat</div>
          <div className="text-[13px] text-muted-2 leading-tight">Tracking spesifik rumah</div>
        </div>
      </div>

      {/* House Summary Card */}
      <div className="rounded-[20px] bg-white border border-card-border p-5 shadow-sm mb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-[100px] pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-[52px] h-[52px] rounded-full flex flex-shrink-0 items-center justify-center font-display font-extrabold text-[22px] bg-brand-light text-brand">
            {h.nama ? h.nama.charAt(0).toUpperCase() : "-"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-black tracking-tight text-gray-900 mb-0.5">{h.nama}</div>
            <div className="text-[13px] font-semibold text-muted-2">
              Kelompok {h.kelompok || vm.kelompok}
            </div>
            
            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => vm.openCorrection(h)}
                className="flex-1 cursor-pointer bg-brand hover:bg-brand-dark transition-colors text-white py-2.5 px-4 rounded-xl text-[13px] font-bold shadow-sm"
              >
                Koreksi Hari Ini
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="flex-1 flex flex-col">
        <div className="text-[14px] font-extrabold text-gray-900 mb-3 px-1">Tracking Pembayaran Terakhir</div>
        
        <div className="bg-white rounded-[20px] border border-card-border overflow-hidden">
          {vm.riwayatDetailHistory.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <IconClock />
              </div>
              <div className="text-[14px] font-bold text-gray-800">Sedang memuat data...</div>
              <div className="text-[12px] text-muted-2 mt-1">Atau belum ada riwayat transaksi.</div>
            </div>
          ) : (
            <div className="flex flex-col">
              {vm.riwayatDetailHistory.map((tx, idx) => {
                const isDone = tx.status === 'sudah';
                const isEmpty = tx.status === 'kosong';
                
                // Construct Date object safely
                let date;
                if (tx.time && tx.time.includes(":")) {
                  // tx.time might just be "HH:MM" if it's from normalizeTx without date logic but wait, normalizeTx in api fetches uses created_at.
                  // If created_at is available on tx, use it, else fallback
                  date = new Date();
                  const [h, m] = tx.time.split(":");
                  date.setHours(h, m, 0, 0);
                } else {
                  date = new Date(tx.created_at || Date.now());
                }

                const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
                const dateStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
                const timeStr = tx.time || date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

                return (
                  <div 
                    key={tx.id} 
                    onClick={() => vm.openInvoice(tx)}
                    className="flex items-stretch cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 px-5 py-4"
                  >
                    {/* Date Block */}
                    <div className="w-16 flex flex-col items-center justify-center flex-shrink-0 border-r border-gray-100 pr-4 mr-4">
                      <div className="text-[11px] font-extrabold uppercase text-muted-2 tracking-wider">{dayName}</div>
                      <div className="text-[16px] font-black text-gray-900">{dateStr.split(' ')[0]}</div>
                    </div>
                    
                    {/* Content Block */}
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <div className="text-[14px] font-bold text-gray-900 mb-0.5">
                          {isDone ? toRupiah(tx.nominal) : isEmpty ? "Rumah Kosong" : "Belum Diambil"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-2">
                          <IconClock />
                          <span>{timeStr}</span>
                        </div>
                      </div>
                      
                      {/* Status Badge & Action */}
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); vm.openInvoice(tx); }}
                          className="cursor-pointer text-[12px] font-bold text-brand border border-brand bg-white hover:bg-brand hover:text-white px-3 py-1.5 rounded-full transition-colors shadow-sm"
                        >
                          Lihat Invoice
                        </button>
                        {isDone ? (
                          <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand">
                            <IconCheck />
                          </div>
                        ) : isEmpty ? (
                          <div className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Kosong
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <CorrectionModal vm={vm} />
      <TransactionInvoiceModal vm={vm} />
    </div>
  );
}

import React from "react";
import { CorrectionModal } from "../../ui/SharedUI";

const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export function RiwayatScreen({ vm }) {
  // Format the date for the display pill
  const dateObj = vm.riwayatDate ? new Date(vm.riwayatDate) : new Date();
  const formattedDate = dateObj.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-[720px] w-full pb-20 relative min-h-full flex flex-col">
      
      {/* Header & Date Picker */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-display text-2xl font-extrabold text-gray-900 mb-1">Riwayat</div>
          <div className="text-[13px] text-muted-2">Tracking harian jimpitan</div>
        </div>
        <div className="relative group">
          <input 
            type="date" 
            value={vm.riwayatDate}
            onChange={vm.onRiwayatDateChange}
            onClick={(e) => {
              try { e.target.showPicker(); } catch (err) {}
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex items-center gap-2 bg-white border border-card-border rounded-full px-4 py-2.5 text-sm font-bold text-gray-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] group-hover:bg-gray-50 transition-colors">
            <IconCalendar />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Modern Filter Pills */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 mb-6 -mx-1 px-1">
        {vm.riwayatFilters.map((f) => (
          <button
            key={f.key}
            onClick={f.onClick}
            className="whitespace-nowrap cursor-pointer rounded-full px-5 py-2 text-[13.5px] font-bold transition-all duration-300"
            style={{ 
              background: f.bg === 'transparent' ? '#ffffff' : f.bg, 
              color: f.color,
              boxShadow: f.bg !== 'transparent' ? '0 4px 12px -4px rgba(31,122,77,0.3)' : '0 2px 6px -2px rgba(0,0,0,0.05)',
              border: f.bg === 'transparent' ? '1px solid #e6e1d3' : '1px solid transparent'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List of Houses */}
      <div className="flex-1 flex flex-col gap-3">
        {vm.riwayatFiltered.map((t, index) => {
          const isDone = t.status === 'sudah';
          const isEmpty = t.status === 'kosong';
          const isPending = t.status === 'belum';
          
          return (
            <div
              key={t.id}
              onClick={() => vm.openRiwayatDetail(t)}
              className="animate-fade-in-up group flex items-center gap-4 rounded-[20px] bg-white p-4 cursor-pointer transition-all duration-200 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.1)] active:scale-[0.98] border border-transparent hover:border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.04)]"
              style={{ animationDelay: `${index * 15}ms` }}
            >
              {/* Avatar Initial */}
              <div 
                className={`w-[46px] h-[46px] rounded-full flex flex-shrink-0 items-center justify-center font-display font-extrabold text-[18px] transition-colors`}
                style={{
                  backgroundColor: isDone ? '#eaf3ec' : isEmpty ? '#fbeee0' : '#f4f4f5',
                  color: isDone ? '#1f7a4d' : isEmpty ? '#d97706' : '#a1a1aa'
                }}
              >
                {t.nama.charAt(0).toUpperCase()}
              </div>
              
              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-extrabold text-gray-900 truncate tracking-tight">{t.nama}</div>
                <div className="flex items-center gap-1.5 text-muted-2 text-[12.5px] mt-0.5 font-medium">
                  {isPending ? (
                    <span>Belum diambil</span>
                  ) : (
                    <>
                      <IconClock />
                      <span>{t.time}</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Status / Value */}
              <div className="flex flex-col items-end">
                <div 
                  className={`text-[16px] font-black tracking-tight ${isDone ? 'text-brand' : isEmpty ? 'text-amber-500' : 'text-gray-300'}`}
                >
                  {t.displayValue}
                </div>
                {isDone && (
                  <div className="text-[10px] font-extrabold text-brand bg-brand-light/50 px-2 py-0.5 rounded-md mt-1 uppercase tracking-wider">
                    Selesai
                  </div>
                )}
                {isEmpty && (
                  <div className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md mt-1 uppercase tracking-wider">
                    Kosong
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {vm.noRiwayat && (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div className="text-[15px] font-extrabold text-gray-900">Belum ada aktivitas</div>
            <div className="text-[13px] text-muted-2 mt-1">Data transaksi akan muncul di sini.</div>
          </div>
        )}
      </div>

      {/* Floating Total Summary */}
      <div className="fixed bottom-6 left-0 right-0 z-10 px-4 md:left-[240px] md:px-10 pointer-events-none">
        <div className="mx-auto flex max-w-[720px] items-center justify-between rounded-2xl bg-gray-900 px-6 py-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] pointer-events-auto border border-gray-800">
          <div>
            <span className="text-white/60 text-[12px] font-bold uppercase tracking-wider mb-0.5">Total Terkumpul</span>
            <div className="text-white text-[13px] font-semibold">{formattedDate}</div>
          </div>
          <div className="text-[22px] font-black tracking-tight text-white">
            {vm.riwayatTotalTerkumpulDisplay}
          </div>
        </div>
      </div>

      {/* Modern Correction Modal */}
      <CorrectionModal vm={vm} />
    </div>
  );
}

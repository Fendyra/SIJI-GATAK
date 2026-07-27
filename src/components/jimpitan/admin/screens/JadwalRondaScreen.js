import React from "react";

export function JadwalRondaScreen({ vm }) {
  // Filter only 'petugas' role (exclude admin)
  const petugasOnly = vm.petugasRows.filter(p => p.role === "petugas");

  // Group by Kelompok ID to ensure consistent grouping
  const groupedByKelompok = petugasOnly.reduce((acc, p) => {
    const groupId = p.kelompok_id || "unassigned";
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(p);
    return acc;
  }, {});

  return (
    <div className="max-w-[1000px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <div className="font-display text-[22px] font-extrabold text-gray-900">Jadwal Petugas Ronda</div>
          <div className="text-[13px] text-muted-2 mt-1">Daftar anggota yang bertugas di setiap malamnya</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {vm.kelompokList.map((kelompok) => {
          const members = groupedByKelompok[kelompok.id] || [];
          return (
            <div key={kelompok.id} className="bg-white rounded-[16px] border border-card-border overflow-hidden shadow-sm flex flex-col h-full">
              <div className="bg-brand/5 px-5 py-3.5 border-b border-card-border flex items-center justify-between">
                <div>
                  <div className="font-bold text-[14px] text-brand-deep">{kelompok.nama}</div>
                  <div className="text-[11px] text-muted font-medium mt-0.5">{kelompok.jadwal || "Tidak ada hari"}</div>
                </div>
                <div className="rounded-full bg-white border border-brand/20 text-brand px-2.5 py-0.5 text-[11px] font-extrabold">
                  {members.length} Orang
                </div>
              </div>
              <div className="flex-1 p-0 overflow-y-auto max-h-[400px]">
                {members.length === 0 ? (
                  <div className="py-8 text-center text-[12px] text-muted-2">Belum ada anggota</div>
                ) : (
                  members.map((p, idx) => (
                    <div key={p.id} className={`flex items-center justify-between px-5 py-3 transition-colors hover:bg-gray-50 ${idx !== 0 ? 'border-t border-[#f1efe7]' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[11px] font-extrabold shrink-0">
                          {idx + 1}
                        </div>
                        <div className={`text-[13px] font-bold ${p.aktif ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                          {p.nama}
                        </div>
                        {!p.aktif && (
                          <div className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">Off</div>
                        )}
                      </div>
                      <button 
                        onClick={p.onToggle}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${p.aktif ? 'bg-brand' : 'bg-gray-300'}`}
                        title={p.aktif ? 'Klik untuk mengubah status jadi Off' : 'Klik untuk mengaktifkan kembali'}
                      >
                        <span className="sr-only">Toggle status</span>
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${p.aktif ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

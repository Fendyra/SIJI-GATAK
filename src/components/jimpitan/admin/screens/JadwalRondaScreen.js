import React, { useState } from "react";
import { ConfirmDelete } from "../../ui/SharedUI";

const DAYS = [
  { key: "Senin", short: "Sen" },
  { key: "Selasa", short: "Sel" },
  { key: "Rabu", short: "Rab" },
  { key: "Kamis", short: "Kam" },
  { key: "Jumat", short: "Jum" },
  { key: "Sabtu", short: "Sab" },
  { key: "Minggu", short: "Min" },
];

function getDayIndex(jadwalStr) {
  if (!jadwalStr) return -1;
  const str = jadwalStr.toLowerCase();
  return DAYS.findIndex(d => str.includes(d.key.toLowerCase()));
}

export function JadwalRondaScreen({ vm }) {
  const [activeTab, setActiveTab] = useState("Kalender Jadwal");

  // Filter only 'petugas' role (exclude admin)
  const petugasOnly = vm.petugasRows.filter(p => p.role === "petugas");

  // Group by Kelompok ID
  const groupedByKelompok = petugasOnly.reduce((acc, p) => {
    const groupId = p.kelompok_id || "unassigned";
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(p);
    return acc;
  }, {});

  return (
    <div className="max-w-[1200px] pb-10">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="font-display text-[24px] font-extrabold text-gray-900">Jadwal Petugas Ronda</div>
          <div className="text-[14px] text-muted-2 mt-0.5">Kelola jadwal ronda petugas di setiap malamnya</div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-input-border text-gray-700 font-bold text-[13px] rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Impor Jadwal
          </button>
          <button className="flex items-center gap-2 bg-brand text-white font-bold text-[13px] rounded-xl px-4 py-2 hover:bg-brand-deep transition-colors shadow-sm shadow-brand/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Buat Jadwal
          </button>
        </div>
      </div>

      {/* TABS & FILTERS */}
      <div className="bg-white rounded-t-2xl border-x border-t border-card-border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b">
        <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto">
          {["Kalender Jadwal", "Daftar per Malam", "Ringkasan Petugas"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 pb-1 border-b-2 font-bold text-[13px] whitespace-nowrap transition-colors ${activeTab === tab ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab === "Kalender Jadwal" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
              {tab === "Daftar per Malam" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>}
              {tab === "Ringkasan Petugas" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button className="px-3 py-1 text-[11px] font-bold rounded-md bg-white shadow-sm text-gray-900">Mingguan</button>
            <button className="px-3 py-1 text-[11px] font-bold rounded-md text-gray-500 hover:text-gray-900">Bulanan</button>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold text-[12px] rounded-lg px-3 py-1.5 hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Filter
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      {activeTab === "Kalender Jadwal" && (
        <div className="bg-white rounded-b-2xl border-x border-b border-card-border shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/30">
                  <th className="py-4 px-5 w-[240px] text-[12px] font-extrabold text-gray-900">Kelompok Malam</th>
                  {DAYS.map(day => (
                    <th key={day.key} className="py-4 px-3 text-center border-l border-gray-100/50">
                      <div className="text-[12px] font-extrabold text-gray-900">{day.short}</div>
                    </th>
                  ))}
                  <th className="py-4 px-3 w-[60px] border-l border-gray-100/50"></th>
                </tr>
              </thead>
              <tbody>
                {vm.kelompokList.map((kelompok, idx) => {
                  const members = groupedByKelompok[kelompok.id] || [];
                  const dayIndex = getDayIndex(kelompok.jadwal);
                  
                  return (
                    <tr key={kelompok.id} className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/10'}`}>
                      {/* Kelompok Header Column */}
                      <td className="py-5 px-5 align-top">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[13px] font-extrabold text-gray-900">{kelompok.nama}</div>
                            <div className="text-[11px] font-bold text-brand mt-0.5">{members.length} petugas</div>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-brand/5 text-brand flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                          </div>
                        </div>
                      </td>

                      {/* Day Columns */}
                      {DAYS.map((day, dIdx) => {
                        const isMatch = dIdx === dayIndex;
                        return (
                          <td key={day.key} className="py-3 px-2 align-top border-l border-gray-100/50">
                            {isMatch ? (
                              <div className="flex flex-col gap-2">
                                {members.map(m => (
                                  <div key={m.id} className="flex items-center gap-2 group p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
                                    <div className="relative shrink-0">
                                      <div className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px] font-extrabold font-display">
                                        {m.nama.substring(0, 2).toUpperCase()}
                                      </div>
                                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${m.aktif ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    </div>
                                    <div className={`flex-1 text-[12px] font-bold truncate ${m.aktif ? 'text-gray-800' : 'text-gray-400 line-through'}`}>{m.nama}</div>
                                    
                                    {/* Inline Actions on Hover */}
                                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 bg-white rounded-md shadow-sm border border-gray-100 p-0.5">
                                      <button onClick={(e) => { e.stopPropagation(); m.onToggle(); }} className={`p-1 rounded ${m.aktif ? 'text-gray-400 hover:text-brand hover:bg-brand/10' : 'text-brand bg-brand/10'}`} title="Ubah Status">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); m.onDelete(); }} className="p-1 rounded text-gray-400 hover:text-danger hover:bg-danger/10" title="Hapus">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="w-full h-full min-h-[40px]"></div>
                            )}
                          </td>
                        );
                      })}

                      {/* Options Column */}
                      <td className="py-5 px-3 align-top border-l border-gray-100/50 text-center">
                        <button onClick={() => vm.showToast("Kelola detail Kelompok dapat dilakukan di menu Data Kelompok")} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER LEGEND */}
          <div className="bg-gray-50/50 border-t border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              Klik tombol aksi saat hover untuk mengubah status atau menghapus petugas.
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Aktif
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div> Tidak Aktif
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Daftar per Malam" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
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
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={p.onToggle}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${p.aktif ? 'bg-brand' : 'bg-gray-300'}`}
                            title={p.aktif ? 'Klik untuk mengubah status jadi Off' : 'Klik untuk mengaktifkan kembali'}
                          >
                            <span className="sr-only">Toggle status</span>
                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${p.aktif ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                          <button 
                            onClick={p.onDelete}
                            className="text-gray-400 hover:text-danger hover:bg-danger/10 p-1 rounded-md transition-colors cursor-pointer"
                            title="Hapus Petugas"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "Ringkasan Petugas" && (
        <div className="bg-white rounded-[16px] border border-card-border p-6 mt-5 shadow-sm">
          <div className="font-bold text-brand-deep mb-4">Total Petugas: {petugasOnly.length} Orang</div>
          <div className="flex gap-4">
            <div className="p-4 bg-green-50 rounded-xl flex-1 border border-green-100">
              <div className="text-green-600 font-bold text-[24px] font-display">{petugasOnly.filter(p => p.aktif).length}</div>
              <div className="text-green-800 text-[12px] font-medium">Petugas Aktif</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl flex-1 border border-gray-100">
              <div className="text-gray-600 font-bold text-[24px] font-display">{petugasOnly.filter(p => !p.aktif).length}</div>
              <div className="text-gray-600 text-[12px] font-medium">Petugas Nonaktif (Off)</div>
            </div>
          </div>
        </div>
      )}

      {vm.modalType === "hapus-petugas" && (
        <ConfirmDelete 
          title="Hapus Akun Petugas" 
          message={`Apakah Anda yakin ingin menghapus akun ${vm.modalData?.nama}? Akun yang dihapus tidak dapat dipulihkan.`} 
          onConfirm={vm.deletePetugas} 
          onCancel={vm.closeModal} 
        />
      )}
    </div>
  );
}

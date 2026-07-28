import React, { useState, useMemo } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField, SelectField, QrCanvas, downloadQr } from "../../ui/SharedUI";

export function RumahScreen({ vm }) {
  const isModalOpen = vm.modalType === "tambah-rumah" || vm.modalType === "ubah-rumah";
  const isDeleteOpen = vm.modalType === "hapus-rumah";
  const d = vm.modalData;

  const [activeRt, setActiveRt] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Process data: search, filter by RT, sort
  const processedData = useMemo(() => {
    let filtered = vm.rumahAdminRows || [];
    
    // Filter by RT Tab
    if (activeRt !== "Semua") {
      filtered = filtered.filter(h => h.rt_id === activeRt || h.rt === activeRt);
    }
    
    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(h => 
        (h.nama_penghuni || "").toLowerCase().includes(q) || 
        (h.rt || "").toLowerCase().includes(q)
      );
    }
    
    // Sort A-Z
    filtered.sort((a, b) => (a.nama_penghuni || "").localeCompare(b.nama_penghuni || ""));
    
    return filtered;
  }, [vm.rumahAdminRows, activeRt, searchQuery]);

  // Available RT tabs derived from actual data
  const availableTabs = useMemo(() => {
    const tabs = new Set();
    (vm.rumahAdminRows || []).forEach(h => {
      if (h.rt) tabs.add(h.rt);
    });
    // Ensure standard ordering if possible
    const sorted = Array.from(tabs).sort();
    return ["Semua", ...sorted];
  }, [vm.rumahAdminRows]);

  // Pagination
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => { if (safeCurrentPage < totalPages) setCurrentPage(safeCurrentPage + 1); };
  const handlePrevPage = () => { if (safeCurrentPage > 1) setCurrentPage(safeCurrentPage - 1); };

  // Handle Tab change
  const handleTabChange = (tab) => {
    setActiveRt(tab);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1200px] pb-10">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="font-display text-[24px] font-extrabold text-gray-900">Data Rumah</div>
          <div className="text-[14px] text-muted-2 mt-0.5">Kelola data rumah warga dalam setiap kelompok</div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[320px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input 
              type="text" 
              placeholder="Cari nama warga, RT, atau dukuhan..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all bg-white"
            />
          </div>
          <button onClick={() => vm.openModal("tambah-rumah")} className="flex items-center justify-center gap-2 bg-brand text-white font-bold text-[13px] rounded-xl px-4 py-2.5 hover:bg-brand-deep transition-colors shadow-sm shadow-brand/20 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Tambah Rumah
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-card-border shadow-sm flex flex-col overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            {availableTabs.map((tab) => {
              const isActive = activeRt === tab;
              return (
                <button 
                  key={tab} 
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center gap-2 pb-1 border-b-2 font-bold text-[13px] whitespace-nowrap transition-colors ${isActive ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-5 w-[60px] text-[12px] font-bold text-gray-500 font-display text-center">
                  <div className="w-4 h-4 rounded border border-gray-300 mx-auto"></div>
                </th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 font-display">Nama Warga</th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 font-display text-center">RT / Dukuhan</th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 font-display text-center">No. Rumah</th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 font-display text-center">Status</th>
                <th className="py-4 px-5 w-[140px] text-[12px] font-bold text-gray-500 font-display text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-[13px] text-gray-400">Tidak ada data ditemukan.</td>
                </tr>
              ) : paginatedData.map((h, idx) => {
                const initial = (h.nama_penghuni || "?").charAt(0).toUpperCase();
                
                return (
                  <tr key={h.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-5 text-center">
                      <div className="w-4 h-4 rounded border border-gray-300 mx-auto bg-gray-50/50"></div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-display font-extrabold text-[12px] shrink-0 border border-gray-200">
                          {initial}
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-gray-900">{h.nama_penghuni || "-"}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{h.rt || "Dukuhan"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="text-[13px] text-gray-600">{h.rt || "-"}</div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="text-[13px] text-gray-600">-</div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-green-100 text-green-700">
                        Aktif
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={h.onEdit} className="flex items-center justify-center w-8 h-8 border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <button onClick={h.onDelete} className="flex items-center justify-center w-8 h-8 border border-red-100 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-gray-500 font-medium">
          <div>
            Menampilkan {totalItems === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} data
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">10 / halaman</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
              <button 
                onClick={handlePrevPage}
                disabled={safeCurrentPage === 1}
                className={`p-1.5 rounded-lg border ${safeCurrentPage === 1 ? 'border-gray-100 text-gray-300' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button className="w-7 h-7 rounded-lg bg-green-50 text-green-700 border border-green-200 font-bold flex items-center justify-center text-[12px]">
                {safeCurrentPage}
              </button>
              {totalPages > safeCurrentPage && (
                <button className="w-7 h-7 rounded-lg text-gray-500 font-medium flex items-center justify-center text-[12px]">
                  {safeCurrentPage + 1}
                </button>
              )}
              {totalPages > safeCurrentPage + 1 && (
                <>
                  <span className="text-gray-400 mx-1">...</span>
                  <button className="w-7 h-7 rounded-lg text-gray-500 font-medium flex items-center justify-center text-[12px]">
                    {totalPages}
                  </button>
                </>
              )}
              <button 
                onClick={handleNextPage}
                disabled={safeCurrentPage >= totalPages}
                className={`p-1.5 rounded-lg border ${safeCurrentPage >= totalPages ? 'border-gray-100 text-gray-300' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={vm.closeModal}>
          <ModalHeader title={d.id ? "Ubah Data Rumah" : "Tambah Data Rumah"} />
          <InputField label="Nama Penghuni (Kepala Keluarga)" value={d.nama_penghuni} onChange={(e) => vm.onModalDataChange("nama_penghuni", e.target.value)} />
          <InputField label="Alamat / Blok" value={d.alamat} onChange={(e) => vm.onModalDataChange("alamat", e.target.value)} />
          
          <SelectField label="RT / Dukuhan" value={d.rt_id} onChange={(e) => vm.onModalDataChange("rt_id", e.target.value)}>
            <option value="">-- Pilih RT --</option>
            {vm.rtList.map((r) => (
              <option key={r.id} value={r.id}>{r.nama}</option>
            ))}
          </SelectField>

          <SelectField label="Kelompok Ronda" value={d.kelompok_id} onChange={(e) => vm.onModalDataChange("kelompok_id", e.target.value)}>
            <option value="">-- Pilih Kelompok Ronda --</option>
            {vm.kelompokList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </SelectField>

          <ModalFooter onCancel={vm.closeModal} onSave={vm.saveRumah} saveLabel={d.id ? "Simpan Perubahan" : "Simpan Data"} />
        </Modal>
      )}

      {isDeleteOpen && (
        <ConfirmDelete title="Hapus Data Rumah" subtitle={`Nama: ${d.nama}`} onCancel={vm.closeModal} onConfirm={() => vm.deleteRumah(d.id)} />
      )}
    </div>
  );
}

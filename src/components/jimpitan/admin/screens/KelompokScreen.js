import React, { useState, useMemo } from "react";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField } from "../../ui/SharedUI";

// Mapping colors for days based on the mockup
const DAY_COLORS = {
  senin: { bg: "bg-blue-100", text: "text-blue-600", iconBg: "bg-blue-500", iconText: "text-white" },
  selasa: { bg: "bg-yellow-100", text: "text-yellow-600", iconBg: "bg-yellow-500", iconText: "text-white" },
  rabu: { bg: "bg-orange-100", text: "text-orange-600", iconBg: "bg-orange-500", iconText: "text-white" },
  kamis: { bg: "bg-purple-100", text: "text-purple-600", iconBg: "bg-purple-500", iconText: "text-white" },
  jumat: { bg: "bg-green-100", text: "text-green-600", iconBg: "bg-green-600", iconText: "text-white" },
  sabtu: { bg: "bg-purple-100", text: "text-purple-600", iconBg: "bg-purple-500", iconText: "text-white" },
  minggu: { bg: "bg-blue-100", text: "text-blue-600", iconBg: "bg-blue-500", iconText: "text-white" },
  default: { bg: "bg-gray-100", text: "text-gray-600", iconBg: "bg-gray-500", iconText: "text-white" },
};

function getDayColor(jadwalStr) {
  if (!jadwalStr) return DAY_COLORS.default;
  const lower = jadwalStr.toLowerCase();
  for (const day of Object.keys(DAY_COLORS)) {
    if (lower.includes(day)) return DAY_COLORS[day];
  }
  return DAY_COLORS.default;
}

export function KelompokScreen({ vm }) {
  const isModalOpen = vm.modalType === "tambah-kelompok" || vm.modalType === "ubah-kelompok";
  const isDeleteOpen = vm.modalType === "hapus-kelompok";
  const d = vm.modalData;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Filter only petugas
  const petugasOnly = useMemo(() => vm.petugasRows.filter(p => p.role === "petugas"), [vm.petugasRows]);
  
  // Calculate members per group
  const membersCountMap = useMemo(() => {
    const map = {};
    petugasOnly.forEach(p => {
      const gId = p.kelompok_id;
      if (gId) map[gId] = (map[gId] || 0) + 1;
    });
    return map;
  }, [petugasOnly]);

  // Process data: search & sort
  const processedData = useMemo(() => {
    let filtered = vm.kelompokRows;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(k => k.nama.toLowerCase().includes(q));
    }
    filtered.sort((a, b) => {
      if (sortOrder === "asc") return a.nama.localeCompare(b.nama);
      return b.nama.localeCompare(a.nama);
    });
    return filtered;
  }, [vm.kelompokRows, searchQuery, sortOrder]);

  // Pagination
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => { if (safeCurrentPage < totalPages) setCurrentPage(safeCurrentPage + 1); };
  const handlePrevPage = () => { if (safeCurrentPage > 1) setCurrentPage(safeCurrentPage - 1); };

  return (
    <div className="max-w-[1200px] pb-10">
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="font-display text-[24px] font-extrabold text-gray-900">Data Kelompok</div>
          <div className="text-[14px] text-muted-2 mt-0.5">Kelola data kelompok jimpitan.</div>
        </div>
        <button onClick={() => vm.openModal("tambah-kelompok")} className="flex items-center gap-2 bg-brand text-white font-bold text-[13px] rounded-xl px-4 py-2.5 hover:bg-brand-deep transition-colors shadow-sm shadow-brand/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Tambah Kelompok
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-card-border shadow-sm flex flex-col overflow-hidden">
        {/* Search and Sort Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input 
              type="text" 
              placeholder="Cari kelompok..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 font-bold text-[13px] rounded-xl px-4 py-2 hover:bg-gray-50 focus:outline-none transition-colors appearance-none pr-8 cursor-pointer relative"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
              }}
            >
              <option value="asc">Urutkan: Nama A-Z</option>
              <option value="desc">Urutkan: Nama Z-A</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-5 w-[60px] text-[12px] font-bold text-gray-500 font-display">No</th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 font-display">Nama Kelompok</th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 font-display">Jumlah Petugas</th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 font-display">Hari Jadwal Piket</th>
                <th className="py-4 px-5 w-[200px] text-[12px] font-bold text-gray-500 font-display text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-[13px] text-gray-400">Tidak ada data ditemukan.</td>
                </tr>
              ) : paginatedData.map((k, idx) => {
                const count = membersCountMap[k.id] || 0;
                const colors = getDayColor(k.jadwal);
                const actualIndex = startIndex + idx + 1;
                
                return (
                  <tr key={k.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-5 text-[13px] font-medium text-gray-500">{actualIndex}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.iconBg} ${colors.iconText} shadow-sm`}>
                          {k.jadwal && k.jadwal.toLowerCase().includes('selasa') ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                          )}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-gray-900">{k.nama}</div>
                          <div className="text-[12px] text-gray-400 mt-0.5">Piket malam hari</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-[13px] font-medium text-gray-600">{count} petugas</td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold ${colors.bg} ${colors.text}`}>
                        {k.jadwal || "-"}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={k.onEdit} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[12px] font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                          Edit
                        </button>
                        <button onClick={k.onDelete} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-100 bg-red-50 rounded-lg text-[12px] font-bold text-red-600 hover:bg-red-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          Hapus
                        </button>
                        <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
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
            Menampilkan {totalItems === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} kelompok
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handlePrevPage}
              disabled={safeCurrentPage === 1}
              className={`p-1.5 rounded-lg border ${safeCurrentPage === 1 ? 'border-gray-100 text-gray-300' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button className="w-8 h-8 rounded-lg bg-brand text-white font-bold flex items-center justify-center">
              {safeCurrentPage}
            </button>
            <button 
              onClick={handleNextPage}
              disabled={safeCurrentPage >= totalPages}
              className={`p-1.5 rounded-lg border ${safeCurrentPage >= totalPages ? 'border-gray-100 text-gray-300' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={vm.closeModal}>
          <ModalHeader title={d.id ? "Ubah Kelompok" : "Tambah Kelompok Baru"} />
          <InputField label="Nama Kelompok" value={d.nama} onChange={(e) => vm.onModalDataChange("nama", e.target.value)} placeholder="mis. Ronda Melati" />
          <InputField label="Jadwal Ronda" value={d.jadwal} onChange={(e) => vm.onModalDataChange("jadwal", e.target.value)} placeholder="mis. Senin, Rabu, Jumat" />
          <ModalFooter onCancel={vm.closeModal} onSave={vm.saveKelompok} saveLabel={d.id ? "Simpan Perubahan" : "Tambah Kelompok"} />
        </Modal>
      )}

      {isDeleteOpen && (
        <ConfirmDelete title="Hapus Kelompok?" subtitle={d.nama} onCancel={vm.closeModal} onConfirm={() => vm.deleteKelompok(d.id)} />
      )}
    </div>
  );
}

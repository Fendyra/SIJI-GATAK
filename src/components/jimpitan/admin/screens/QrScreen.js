import React, { useState, useMemo } from "react";
import { QrCanvas, downloadQr } from "../../ui/SharedUI";

export function QrScreen({ vm }) {
  const [activeRt, setActiveRt] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Process data: search & filter
  const processedData = useMemo(() => {
    let filtered = vm.qrHouses || [];
    
    // Filter by RT Tab
    if (activeRt !== "Semua") {
      filtered = filtered.filter(h => h.rt === activeRt);
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
  }, [vm.qrHouses, activeRt, searchQuery]);

  // Available RT tabs
  const availableTabs = useMemo(() => {
    const tabs = new Set();
    (vm.qrHouses || []).forEach(h => {
      if (h.rt) tabs.add(h.rt);
    });
    return ["Semua", ...Array.from(tabs).sort()];
  }, [vm.qrHouses]);

  // Pagination
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => { if (safeCurrentPage < totalPages) setCurrentPage(safeCurrentPage + 1); };
  const handlePrevPage = () => { if (safeCurrentPage > 1) setCurrentPage(safeCurrentPage - 1); };
  const handlePageClick = (page) => { setCurrentPage(page); };

  async function downloadAll() {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    
    // Only download the currently filtered list so it aligns with "Cetak Semua" expectation
    processedData.forEach((h) => {
      const canvasId = `qr-canvas-${h.id}`;
      const canvas = document.getElementById(canvasId);
      if (canvas) {
        const nama = (h.nama_penghuni || "rumah").replace(/[^a-zA-Z0-9 ]/g, "");
        const dataUrl = canvas.toDataURL("image/png");
        const base64 = dataUrl.split(",")[1];
        zip.file(`${nama}.png`, base64, { base64: true });
      }
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.download = "QR-Code-Rumah.zip";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function printAll() {
    window.print();
  }

  const resetFilter = () => {
    setActiveRt("Semua");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1200px] pb-10">
      {/* HEADER */}
      <div className="mb-6">
        <div className="font-display text-[24px] font-extrabold text-gray-900">QR Code Rumah</div>
        <div className="text-[14px] text-muted-2 mt-0.5">Unduh atau cetak QR Code identitas rumah yang dikelompokkan per RT / Kampung.</div>
      </div>

      {/* TOP CONTROLS BOX */}
      <div className="bg-white rounded-2xl border border-card-border shadow-sm p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 sm:gap-10">
          <div>
            <div className="text-[12px] font-bold text-gray-400 mb-1">Pilih RT / Kampung</div>
            <select 
              value={activeRt} 
              onChange={(e) => { setActiveRt(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-[14px] font-bold text-gray-800 outline-none cursor-pointer pr-4 border border-gray-200 rounded-lg px-3 py-1.5 focus:border-brand"
            >
              {availableTabs.map(tab => (
                <option key={tab} value={tab}>{tab === "Semua" ? "Semua RT" : tab}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[12px] font-bold text-gray-400 mb-1">Total Rumah</div>
            <div className="font-display text-[24px] font-extrabold text-gray-900 leading-none">
              {totalItems} <span className="text-[13px] text-gray-500 font-medium">rumah</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={printAll} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-brand text-brand font-bold text-[13px] hover:bg-brand/5 transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Cetak Semua
          </button>
          <button onClick={downloadAll} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-bold text-[13px] hover:bg-brand-deep transition-colors shadow-sm shadow-brand/20 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Unduh Semua (ZIP)
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT CONTENT */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl border border-card-border p-2.5 flex justify-between items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                type="text" 
                placeholder="Cari nama warga..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-transparent text-[13px] focus:outline-none placeholder-gray-400"
              />
            </div>
            <div className="flex items-center gap-1 border-l border-gray-100 pl-3">
              <button className="p-2 rounded-lg bg-green-50 text-brand">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </button>
              <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {paginatedData.length === 0 ? (
              <div className="col-span-full py-16 text-center text-gray-400 text-[13px]">
                Tidak ada data QR code ditemukan.
              </div>
            ) : paginatedData.map((h, index) => {
              const canvasId = `qr-canvas-${h.id}`;
              const qrUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${h.qr_code?.split('/').pop()}`;
              
              return (
                <div key={h.id} className="bg-white rounded-2xl border border-card-border shadow-sm p-4 flex flex-col items-center relative group hover:shadow-md transition-shadow">
                  <div className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                  </div>
                  
                  <div className="w-[120px] h-[120px] bg-[#f6f4ee] rounded-xl flex items-center justify-center mb-4 mt-2">
                    <QrCanvas value={qrUrl} size={100} id={canvasId} />
                  </div>
                  
                  <div className="text-center w-full mb-4">
                    <div className="text-[14px] font-bold text-gray-900 truncate px-2">{h.nama_penghuni || "-"}</div>
                    <div className="text-[11px] text-gray-400 mt-1">{h.rt || "Dukuhan"}</div>
                  </div>
                  
                  <button 
                    onClick={() => downloadQr(canvasId, h.nama_penghuni || "rumah")}
                    className="w-full py-2 rounded-xl border border-gray-200 text-brand font-bold text-[12px] flex items-center justify-center gap-1.5 hover:bg-brand hover:text-white transition-colors hover:border-brand"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Unduh PNG
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination Footer */}
          {paginatedData.length > 0 && (
            <div className="bg-white rounded-2xl border border-card-border p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-gray-500 font-medium">
              <div>
                Menampilkan {totalItems === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} rumah
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{itemsPerPage} / halaman</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                <div className="flex items-center gap-1 border-l border-gray-100 pl-3">
                  <button 
                    onClick={handlePrevPage}
                    disabled={safeCurrentPage === 1}
                    className={`p-1.5 rounded-lg border ${safeCurrentPage === 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer'} transition-colors`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNum = safeCurrentPage - 2 + i;
                    if (safeCurrentPage <= 3) pageNum = i + 1;
                    else if (safeCurrentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <button 
                          key={pageNum}
                          onClick={() => handlePageClick(pageNum)}
                          className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-[12px] cursor-pointer transition-colors ${
                            safeCurrentPage === pageNum 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button 
                    onClick={handleNextPage}
                    disabled={safeCurrentPage >= totalPages}
                    className={`p-1.5 rounded-lg border ${safeCurrentPage >= totalPages ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer'} transition-colors`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-5">
          {/* Ringkasan */}
          <div className="bg-white rounded-2xl border border-card-border shadow-sm p-5">
            <div className="font-bold text-[14px] text-gray-900 mb-4">Ringkasan</div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  Total Rumah
                </div>
                <div className="font-bold text-[14px] text-gray-900">{vm.qrHouses?.length || 0}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  Total RT
                </div>
                <div className="font-bold text-[14px] text-gray-900">{availableTabs.length > 1 ? availableTabs.length - 1 : 0}</div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-2xl border border-card-border shadow-sm p-5">
            <div className="font-bold text-[14px] text-gray-900 mb-4">Filter</div>
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-[12px] font-medium text-gray-500 mb-1.5">RT / Kampung</div>
                <select 
                  value={activeRt}
                  onChange={(e) => { setActiveRt(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-white border border-gray-200 text-[13px] text-gray-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  {availableTabs.map(tab => (
                    <option key={tab} value={tab}>{tab === "Semua" ? "Semua RT" : tab}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-[12px] font-medium text-gray-500 mb-1.5">Status</div>
                <select 
                  className="w-full bg-white border border-gray-200 text-[13px] text-gray-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  <option value="Semua">Semua</option>
                  <option value="Aktif">Aktif</option>
                </select>
              </div>
              <button onClick={resetFilter} className="w-full mt-2 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 2v6h6"></path></svg>
                Reset Filter
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
            <div className="flex items-center gap-2 text-green-700 font-bold text-[13px] mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path></svg>
              Tips
            </div>
            <div className="text-[12px] text-green-800/80 leading-relaxed">
              Gunakan tombol "Unduh Semua (ZIP)" untuk mendapatkan semua file gambar QR Code sekaligus dalam format ZIP untuk dicetak secara massal.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

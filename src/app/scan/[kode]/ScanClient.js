"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScanClient({ rumah, kode, petugasId, kelompokId, petugas }) {
  const router = useRouter();
  const [nominal, setNominal] = useState(rumah.nominal_default || 2000);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submitTransaksi(isKosong) {
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      if (!petugasId || !kelompokId) {
        throw new Error("Data petugas tidak lengkap. Harap login ulang.");
      }

      // 1. Get or create today's session
      const tanggalLokal = new Date().toLocaleDateString("en-CA");
      const sesiRes = await fetch("/api/sesi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kelompok_id: kelompokId, petugas_id: petugasId, tanggal: tanggalLokal }),
      });
      const sesiData = await sesiRes.json();
      if (!sesiRes.ok) throw new Error(sesiData.error || "Gagal membuat sesi ronda");
      const sesiId = sesiData.data.id;

      // 2. Submit transaction
      const finalNominal = isKosong ? 0 : Number(nominal);
      const res = await fetch("/api/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sesi_id: sesiId,
          petugas_id: petugasId,
          rumah_id: rumah.id,
          nominal: finalNominal,
          status: isKosong ? "kosong" : "sudah"
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan transaksi");

      setSuccess(true);
      // Wait a bit and redirect to the dashboard/scan page or let user scan again
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f3ed] p-6 text-center font-sans text-[#1c2420]">
        <div className="mb-4 text-5xl">✅</div>
        <h1 className="mb-2 text-xl font-extrabold text-[#1f7a4d]">Berhasil Disimpan!</h1>
        <p className="mb-8 text-sm text-[#6f7d74]">Data jimpitan untuk {rumah.nama_penghuni} telah dicatat.</p>
        
        <div className="flex w-full max-w-[320px] flex-col gap-3">
          <button 
            onClick={() => router.push("/scan")} 
            className="w-full rounded-[14px] bg-[#1f7a4d] py-4 text-[15px] font-bold text-white shadow-lg active:scale-95 transition-transform"
          >
            📸 Scan Rumah Berikutnya
          </button>
          <button 
            onClick={() => router.push("/")} 
            className="w-full rounded-[14px] border-2 border-[#e6e1d3] bg-transparent py-3.5 text-[15px] font-bold text-[#1c2420] active:bg-[#e6e1d3] transition-colors"
          >
            🏠 Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f3ed] p-5 pb-10 font-sans text-[#1c2420]">
      {/* Petugas Profile Header */}
      {petugas && (
        <div className="mb-4 flex items-center justify-between rounded-[18px] bg-white p-3.5 shadow-sm border border-[#e6e1d3] transition-transform active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f5ee] text-lg font-bold text-[#1f7a4d]">
              {petugas.nama.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="text-[14px] font-bold text-[#1c2420] leading-tight mb-0.5">{petugas.nama}</div>
              <div className="text-[11px] font-bold tracking-wide uppercase text-[#6f7d74]">
                {petugas.role === "admin" ? "Admin System" : `Petugas ${petugas.kelompokNama}`}
              </div>
            </div>
          </div>
          <button 
            onClick={() => router.push("/")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fdf2f2] text-[#e04f4f] hover:bg-[#fce4e4] active:bg-[#fce4e4] transition-colors"
            title="Tutup & Kembali"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      )}

      <div className="mb-6 mt-2 text-center">
        <div className="text-[13px] font-bold uppercase tracking-widest text-[#6f7d74] mb-1">
          Input Jimpitan
        </div>
        <div className="text-[22px] font-extrabold font-display">
          Rumah {rumah.nama_penghuni}
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-6 rounded-[20px] border border-[#e6e1d3] bg-white p-5 shadow-sm">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#a19c8f]">
            Detail Rumah
          </div>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-[#6f7d74]">Kepala Keluarga</span>
            <span className="font-bold">{rumah.nama_penghuni}</span>
          </div>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-[#6f7d74]">Alamat</span>
            <span className="font-bold text-right w-1/2 line-clamp-1">{rumah.alamat || "-"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6f7d74]">Grup</span>
            <span className="font-bold">{rumah.rt?.nama} / {rumah.kelompok?.nama}</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-center text-sm font-bold text-[#6f7d74]">
            Nominal Jimpitan (Rp)
          </label>
          <div className="relative mx-auto max-w-[200px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[#a19c8f]">Rp</span>
            <input
              type="number"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              className="w-full rounded-[16px] border-2 border-[#e6e1d3] bg-white py-4 pl-12 pr-4 text-center text-2xl font-extrabold focus:border-[#1f7a4d] focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-[12px] bg-[#fdf2f2] p-3 text-center text-[13px] font-bold text-[#e04f4f]">
            {error}
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={() => submitTransaksi(false)}
          disabled={isLoading}
          className="w-full rounded-[16px] bg-[#1f7a4d] py-[18px] text-[16px] font-extrabold text-white shadow-[0_8px_20px_-8px_#1f7a4d] active:scale-95 transition-transform disabled:opacity-70"
        >
          {isLoading ? "Menyimpan..." : "✅ Simpan (Ada Isinya)"}
        </button>
        <button
          onClick={() => submitTransaksi(true)}
          disabled={isLoading}
          className="w-full rounded-[16px] border-2 border-[#e6e1d3] bg-white py-[16px] text-[16px] font-extrabold text-[#6f7d74] active:bg-[#f5f3ed] transition-colors disabled:opacity-70"
        >
          ❌ Jimpitan Kosong (Rp0)
        </button>
      </div>
    </div>
  );
}

import React, { useRef } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Stepper } from "../../ui/SharedUI";

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);

const IconShare = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);

const DetailRow = ({ label, value, valueClass = "text-gray-900" }) => (
  <div className="flex mb-3 last:mb-0">
    <div className="w-[140px] text-[13px] text-muted-2 flex-shrink-0">{label}</div>
    <div className="text-[13px] text-muted-2 mr-2">:</div>
    <div className={`text-[13px] font-semibold ${valueClass}`}>{value}</div>
  </div>
);

export default function SuccessScreen({ vm }) {
  const tx = vm.lastSavedTx;
  const receiptRef = useRef(null);

  if (!tx) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Tidak ada data transaksi terakhir.</p>
      </div>
    );
  }

  const isKosong = tx.status === "kosong";
  const statusColor = isKosong ? "text-warn" : "text-brand";
  const statusBg = isKosong ? "bg-warn/10" : "bg-[#e8f3ec]";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bukti Jimpitan',
          text: `Bukti Transaksi Jimpitan\nNominal: ${toRupiah(tx.nominal)}\nRumah: ${tx.nama_penghuni}\nWaktu: ${tx.waktu}`,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      alert("Fitur bagikan tidak didukung di peramban ini.");
    }
  };

  return (
    <div className="max-w-[480px] w-full mx-auto pb-10">
      <div className="mb-6">
        <div className="font-display text-[22px] font-extrabold text-gray-900 mb-1">Pengambilan Jimpitan</div>
        <div className="text-[13px] font-medium text-muted-2">
          {vm.kelompok}
        </div>
      </div>

      <Stepper currentStep={3} />

      <div className="flex items-center justify-between mb-4 mt-2">
        <button onClick={vm.goToDashboard} className="cursor-pointer border-none bg-transparent p-0 text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-[15px] font-extrabold text-brand">Detail Transaksi</div>
        <div className="w-5" /> {/* spacer for center alignment */}
      </div>

      <div ref={receiptRef} className="bg-[#f8f9fa] -mx-4 px-4 py-2 sm:mx-0 sm:px-0 sm:bg-transparent">
        {/* Status Card */}
        <div className="bg-white border border-card-border rounded-[16px] p-4 mb-4 shadow-sm flex items-start justify-between">
          <div className="flex gap-3">
            <div className={`mt-0.5 ${statusColor}`}>
              <IconCheck />
            </div>
            <div>
              <div className={`text-[15px] font-extrabold ${statusColor}`}>
                {isKosong ? "Rumah Kosong" : "Transaksi Berhasil"}
              </div>
              <div className="text-[11px] font-medium text-muted-2 mt-0.5">{tx.waktu}</div>
            </div>
          </div>
          {tx.id && (
            <div className="text-[11px] font-bold text-muted-2 mt-1 uppercase">
              #{tx.id.split("-")[0]}-{tx.id.split("-")[1]?.substring(0,6) || "TRX"}
            </div>
          )}
        </div>

        {/* Informasi Rumah */}
        <div className="bg-white border border-card-border rounded-[16px] p-4 sm:p-5 mb-4 shadow-sm">
          <div className="text-[14px] font-extrabold text-gray-900 mb-4">Informasi Rumah</div>
          <DetailRow label="Nama Kepala Keluarga" value={tx.nama_penghuni} />
          <DetailRow label="Alamat" value={tx.alamat || "-"} />
          <DetailRow label="Kelompok" value={tx.kelompok} />
          <DetailRow label="RT / RW" value={tx.rt_rw} />
        </div>

        {/* Informasi Transaksi */}
        <div className="bg-white border border-card-border rounded-[16px] p-4 sm:p-5 mb-4 shadow-sm">
          <div className="text-[14px] font-extrabold text-gray-900 mb-4">Informasi Transaksi</div>
          <DetailRow 
            label="Nominal Jimpitan" 
            value={isKosong ? "Rp0" : toRupiah(tx.nominal)} 
            valueClass={isKosong ? "text-gray-900" : "text-brand"} 
          />
          <DetailRow label="Metode Input" value={tx.metode} />
          <DetailRow label="Petugas" value={tx.petugas} />
          <DetailRow label="Waktu Transaksi" value={tx.waktu} />
          <div className="flex mt-3">
            <div className="w-[140px] text-[13px] text-muted-2 flex-shrink-0">Status</div>
            <div className="text-[13px] text-muted-2 mr-2">:</div>
            <div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusBg} ${statusColor}`}>
                {isKosong ? "Kosong" : "Berhasil"}
              </span>
            </div>
          </div>
        </div>

        {/* Riwayat Perubahan */}
        <div className="bg-white border border-card-border rounded-[16px] p-4 sm:p-5 mb-6 shadow-sm">
          <div className="text-[14px] font-extrabold text-gray-900 mb-4">Riwayat Perubahan</div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center gap-1">
            <div className="text-gray-400 font-bold">-</div>
            <div className="text-[12px] text-muted-2">Tidak ada perubahan data</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={vm.goToDashboard}
          className="flex-1 cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-brand bg-white py-3.5 text-[14px] font-bold text-brand transition-colors hover:bg-brand/5 active:scale-[0.98]"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19L21 7l-1.4-1.4z" />
        </svg>
          Selesai
        </button>
        <button
          onClick={handleShare}
          className="flex-1 cursor-pointer flex items-center justify-center gap-2 rounded-xl border-none bg-brand py-3.5 text-[14px] font-bold text-white transition-transform hover:bg-brand-dark active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" fill-rule="evenodd" d="M7.25 18h12.5c.69 0 1.25-.56 1.25-1.25V4.25C21 3.56 20.44 3 19.75 3H7.25C6.56 3 6 3.56 6 4.25v12.5c0 .69.56 1.25 1.25 1.25m12.25-1.5h-12v-12h12zM5.75 21H18v-1.5H5.75c-.69 0-1.25-.56-1.25-1.25V6H3v12.25A2.755 2.755 0 0 0 5.75 21" clip-rule="evenodd" />
          </svg>
          Salin Bukti
        </button>
      </div>
    </div>
  );
}

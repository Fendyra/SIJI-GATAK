import React from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Stepper } from "../../ui/SharedUI";

export default function SuccessScreen({ vm }) {
  const tx = vm.lastSavedTx;

  if (!tx) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Tidak ada data transaksi terakhir.</p>
      </div>
    );
  }

  const isKosong = tx.status === "kosong";

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-6 text-center">
      <Stepper currentStep={3} />
      
      <div className="mt-8 mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-light">
        {isKosong ? (
          <svg className="h-12 w-12 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <path d="M9 22V12h6v10"></path>
          </svg>
        ) : (
          <svg className="h-12 w-12 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>
      
      <h2 className="mb-2 text-2xl font-extrabold text-gray-900">
        {isKosong ? "Rumah Kosong Tersimpan" : "Transaksi Berhasil!"}
      </h2>
      <p className="mb-8 text-sm text-gray-500">
        Data pengambilan jimpitan telah dicatat di sistem.
      </p>

      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-left">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama Warga</p>
          <p className="text-base font-bold text-gray-900">{tx.nama_penghuni}</p>
        </div>
        
        {tx.alamat && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Alamat</p>
            <p className="text-sm font-medium text-gray-700">{tx.alamat}</p>
          </div>
        )}

        {!isKosong && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nominal Diterima</p>
            <p className="text-xl font-extrabold text-brand">{toRupiah(tx.nominal)}</p>
          </div>
        )}
      </div>

      <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
        <button
          onClick={vm.goToDashboard}
          className="w-full rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition-transform active:scale-[0.98]"
        >
          Kembali ke Dashboard
        </button>
        <button
          onClick={vm.goToRiwayat}
          className="w-full rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Lihat Riwayat Transaksi
        </button>
      </div>
    </div>
  );
}

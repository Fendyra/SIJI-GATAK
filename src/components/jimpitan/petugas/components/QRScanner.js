"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export function QRScanner({ onScan, onClose }) {
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    // We use a unique ID for the QR reader div
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    const qrCodeSuccessCallback = (decodedText) => {
      // Pause scanner immediately upon success to prevent double scanning
      if (html5QrCode.isScanning) {
        html5QrCode.pause();
      }
      onScan(decodedText);
    };

    const qrCodeErrorCallback = () => {
      // Ignore background errors
    };

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      qrCodeSuccessCallback,
      qrCodeErrorCallback
    ).catch((err) => {
      console.error("Camera start error:", err);
      setError("Gagal mengakses kamera. Pastikan browser memiliki izin akses kamera.");
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        }).catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full max-w-[400px] mx-auto">
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium w-full text-center">
          {error}
        </div>
      ) : (
        <div className="w-full relative rounded-2xl overflow-hidden border-2 border-brand bg-black">
          <div id="qr-reader" className="w-full h-full" style={{ minHeight: "300px" }}></div>
        </div>
      )}
      <button 
        onClick={onClose}
        className="mt-6 px-6 py-2.5 rounded-full bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors"
      >
        Batalkan Pemindaian
      </button>
    </div>
  );
}

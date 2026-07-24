"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CameraScannerPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let html5QrCode;
    
    // Import dynamically to avoid SSR issues with window/navigator
    import("html5-qrcode").then(({ Html5Qrcode }) => {
      html5QrCode = new Html5Qrcode("reader");
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // Pause scanner to prevent multiple scans
          if (html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
              // Extract code from URL if it's a full URL
              let targetUrl = decodedText;
              
              if (decodedText.startsWith("http")) {
                targetUrl = decodedText;
              } else if (decodedText.startsWith("QR-")) {
                targetUrl = `/scan/${decodedText}`;
              } else {
                setError("Format QR Code tidak dikenali: " + decodedText);
                return;
              }
              
              // Navigate to the scan result page
              window.location.href = targetUrl;
            }).catch(err => console.error(err));
          }
        },
        (errorMessage) => {
          // Ignore frequent scan errors (no qr code found)
        }
      ).catch((err) => {
        console.error("Camera start failed:", err);
        setError("Gagal mengakses kamera. Pastikan Anda memberikan izin kamera.");
      });
    });

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1c2420] p-6 text-white font-sans">
      <div className="mb-6 text-center">
        <h1 className="font-display text-xl font-extrabold mb-2">Scan QR Code Rumah</h1>
        <p className="text-sm text-gray-400">Arahkan kamera ke stiker QR rumah</p>
      </div>

      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-black relative">
        <div id="reader" className="w-full"></div>
      </div>
      
      {error && (
        <div className="mt-4 text-center text-sm font-bold text-red-400">
          {error}
        </div>
      )}

      <button 
        onClick={() => router.push("/")}
        className="mt-8 rounded-xl border border-gray-600 px-6 py-3 text-sm font-bold text-gray-300 active:bg-gray-800 transition-colors"
      >
        Tutup
      </button>
    </div>
  );
}

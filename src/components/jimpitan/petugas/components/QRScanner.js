"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import jsQR from "jsqr";

const IconFlashlight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H9.5L8 10h8l-1.5-8z"/><path d="M8 10v4h8v-4"/><path d="M12 14v8"/></svg>
);

const IconImage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);

const IconSparkle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

export function QRScanner({ onScan }) {
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    const qrCodeSuccessCallback = (decodedText) => {
      if (html5QrCode.isScanning) html5QrCode.pause();
      onScan(decodedText);
    };

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, aspectRatio: 1.0 }, // No internal qrbox since we use custom overlay
      qrCodeSuccessCallback,
      () => {} // Ignore continuous scanning errors
    ).then(() => {
      // Check if torch is supported
      if (html5QrCode.getRunningTrackCameraCapabilities()?.torchFeature()?.isSupported()) {
        setTorchSupported(true);
      }
    }).catch((err) => {
      console.error("Camera start error:", err);
      setError("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
      }
    };
  }, [onScan]);

  const toggleTorch = () => {
    if (!scannerRef.current || !torchSupported) {
      alert("Fitur senter tidak didukung pada perangkat/browser ini.");
      return;
    }
    const html5QrCode = scannerRef.current;
    if (html5QrCode.isScanning) {
      html5QrCode.applyVideoConstraints({
        advanced: [{ torch: !torchOn }]
      }).then(() => setTorchOn(!torchOn))
        .catch(() => alert("Gagal mengaktifkan senter."));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        // Resize large images for better performance
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);
        
        const imageData = context.getImageData(0, 0, width, height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code && code.data) {
          onScan(code.data);
        } else {
          // If the image is inverted, we could try again with "attemptBoth" but it's slower.
          alert("Tidak dapat menemukan QR Code pada gambar tersebut.");
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="w-full">
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-[16px] text-[13px] font-bold w-full text-center">
          {error}
        </div>
      ) : (
        <div className="relative w-full aspect-[4/5] rounded-[16px] overflow-hidden bg-black flex items-center justify-center">
          
          {/* Camera feed */}
          <div id="qr-reader" className="absolute inset-0 object-cover w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full" />
          
          {/* Dark Overlay with cutout effect */}
          <div className="absolute inset-0 z-10 pointer-events-none" style={{
            background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))',
            maskImage: 'radial-gradient(circle, transparent 20%, black 21%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 20%, black 21%)'
          }} />

          {/* Fallback dark overlay if mask isn't supported - we just use a border frame instead */}
          <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
             <div className="w-[65%] aspect-square relative">
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />

                {/* Animated Scanning Line */}
                <div className="absolute w-full h-[2px] bg-brand top-1/2 shadow-[0_0_8px_2px_rgba(31,122,77,0.5)] animate-scan-line" />
             </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-5 left-0 right-0 z-20 px-5 flex items-center justify-between">
            <button 
              onClick={toggleTorch}
              className={`w-[46px] h-[46px] rounded-full flex items-center justify-center transition-colors cursor-pointer ${torchOn ? 'bg-brand text-white' : 'bg-white text-gray-900'}`}
            >
              <IconFlashlight />
            </button>
            
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-ink/70 backdrop-blur-sm text-white text-[11px] font-bold">
              <IconSparkle />
              <span>Pastikan QR code berada di dalam kotak</span>
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-[46px] h-[46px] rounded-full bg-white flex items-center justify-center text-gray-900 transition-colors cursor-pointer hover:bg-gray-100"
            >
              <IconImage />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </div>

          <style jsx>{`
            @keyframes scanLine {
              0% { top: 10%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 90%; opacity: 0; }
            }
            .animate-scan-line {
              animation: scanLine 2.5s infinite linear;
            }
            /* Hide the default html5-qrcode elements */
            #qr-reader__dashboard_section_csr { display: none !important; }
            #qr-reader__dashboard_section_swaplink { display: none !important; }
            #qr-reader__status_span { display: none !important; }
          `}</style>
        </div>
      )}
    </div>
  );
}

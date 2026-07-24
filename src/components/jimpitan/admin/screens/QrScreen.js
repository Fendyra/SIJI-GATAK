import React, { useState } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { Modal, ModalHeader, ModalFooter, ConfirmDelete, InputField, SelectField, QrCanvas, downloadQr } from "../../ui/SharedUI";

export function QrScreen({ vm }) {
  async function downloadAll() {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    const canvases = document.querySelectorAll("[data-qr-canvas]");
    canvases.forEach((canvas) => {
      const nama = canvas.getAttribute("data-nama") || "rumah";
      const dataUrl = canvas.toDataURL("image/png");
      const base64 = dataUrl.split(",")[1];
      zip.file(`${nama}.png`, base64, { base64: true });
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.download = "QR-Code-Rumah.zip";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  // Group by RT
  const grouped = vm.qrHouses.reduce((acc, h) => {
    const key = h.rt || "Lainnya";
    if (!acc[key]) acc[key] = [];
    acc[key].push(h);
    return acc;
  }, {});
  const groupOrder = ["RT 3", "RT 4", "Dukuhan"];
  const sortedGroups = [
    ...groupOrder.filter(k => grouped[k]),
    ...Object.keys(grouped).filter(k => !groupOrder.includes(k)).sort(),
  ];
  const groupColors = {
    "RT 3":    { bg: "#e8f5ee", color: "#1f7a4d" },
    "RT 4":    { bg: "#e8f0fb", color: "#2563eb" },
    "Dukuhan": { bg: "#fef3e2", color: "#b45309" },
  };

  return (
    <div className="max-w-[960px]">
      <div className="font-display mb-0.5 text-xl font-extrabold">QR Code Rumah</div>
      <div className="mb-[18px] text-[13px] text-muted">Unduh atau cetak QR Code identitas rumah — dikelompokkan per RT / Kampung</div>
      <div className="mb-5 flex flex-wrap gap-2.5">
        <button onClick={downloadAll} className="cursor-pointer rounded-[10px] border-none bg-brand px-[18px] py-[11px] text-[13px] font-bold text-white hover:bg-brand-dark">
          Unduh Semua QR (ZIP)
        </button>
      </div>

      <div className="flex flex-col gap-7">
        {sortedGroups.map((rtName) => {
          const houses = grouped[rtName];
          const gcolor = groupColors[rtName] || { bg: "#f1efe7", color: "#6f7d74" };
          return (
            <div key={rtName}>
              {/* Group header */}
              <div className="mb-3 flex items-center gap-2.5">
                <div className="text-sm font-extrabold" style={{ color: gcolor.color }}>{rtName}</div>
                <div className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{ background: gcolor.color + "22", color: gcolor.color }}>
                  {houses.length} rumah
                </div>
                <div className="h-px flex-1" style={{ background: gcolor.color + "33" }} />
              </div>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
                {houses.map((h, index) => {
                  const canvasId = `qr-canvas-${h.id}`;
                  return (
                    <div key={h.id} className="animate-fade-in-up rounded-[14px] border border-card-border bg-white p-3.5 text-center transition-[transform,box-shadow] hover:-translate-y-[3px] hover:shadow-[0_12px_26px_-16px_rgba(28,36,32,0.35)]"
                      style={{ animationDelay: `${index * 10}ms` }}>
                      <div className="mb-2 flex aspect-square w-full items-center justify-center rounded-[10px] bg-[#f6f4ee]">
                        <QrCanvas value={`${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${h.qr_code?.split('/').pop()}`} size={110} id={canvasId} />
                        <canvas data-qr-canvas="true" data-nama={h.nama?.replace(/[^a-zA-Z0-9 ]/g, "") || "rumah"} id={`qr-dl-${h.id}`} style={{ display: "none" }} />
                      </div>
                      <div className="text-[13px] font-bold leading-tight">{h.nama}</div>
                      <div className="mb-2.5 text-[10px] text-muted-2">{h.alamat || rtName}</div>
                      <button onClick={() => downloadQr(canvasId, h.nama || "rumah")}
                        className="w-full cursor-pointer rounded-lg border border-input-border bg-white py-[7px] text-xs font-bold hover:bg-green-bg">
                        Unduh PNG
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PetugasAkunScreen ───────────────────────────────────────────────────────

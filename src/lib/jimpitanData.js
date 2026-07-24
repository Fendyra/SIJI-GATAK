/**
 * jimpitanData.js
 * ---------------
 * Utility helpers dan konstanta referensi untuk development.
 * Data nyata kini diambil dari Supabase melalui API Routes.
 * File ini TIDAK lagi digunakan sebagai state utama aplikasi.
 */

/**
 * Format angka ke format Rupiah Indonesia
 * @param {number} n
 * @returns {string} contoh: "Rp2.000"
 */
export function toRupiah(n) {
  return "Rp" + Number(n || 0).toLocaleString("id-ID");
}

/**
 * Konfigurasi warna per status rumah
 */
export const STATUS_CONFIG = {
  sudah: { label: "Sudah", bg: "#e8f3ec", color: "#1f7a4d" },
  kosong: { label: "Kosong", bg: "#fbeee0", color: "#b5691f" },
  belum: { label: "Belum", bg: "#f1efe7", color: "#8a8578" },
};

// ================================================================
// DATA SEED REFERENSI (hanya untuk keperluan development/testing)
// Lihat: src/lib/supabase/schema.sql untuk seed database nyata
// ================================================================

export const SEED_RT = [
  { nama: "RT 03", ketua: "Bpk. Slamet Riyadi" },
  { nama: "RT 04", ketua: "Bpk. Joko Purnomo" },
  { nama: "RT 05", ketua: "Ibu Endang Suryani" },
];

export const SEED_KELOMPOK = [
  { nama: "Ronda Melati", rt: "RT 03", jadwal: "Senin, Rabu, Jumat" },
  { nama: "Ronda Kenanga", rt: "RT 04", jadwal: "Selasa, Kamis" },
  { nama: "Ronda Cempaka", rt: "RT 05", jadwal: "Sabtu, Minggu" },
];

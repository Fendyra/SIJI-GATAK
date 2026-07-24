import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ScanClient from "./ScanClient";

export const metadata = {
  title: "Scan QR - Jimpitan Online",
};

export default async function ScanPage({ params }) {
  const resolvedParams = await params;
  const kode = resolvedParams.kode;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, redirect to main page for login
  if (!user) {
    redirect(`/?redirect=/scan/${kode}`);
  }

  // Fetch house data based on QR code
  // Use admin client here so we can bypass RLS for reading house via QR
  // (In case petugas scans a QR from a different kelompok)
  const supabaseAdmin = await createAdminClient();
  const { data: rumah } = await supabaseAdmin
    .from("rumah")
    .select(`
      id, nama_penghuni, alamat, nominal_default, aktif,
      rt:rt_id(id, nama),
      kelompok:kelompok_id(id, nama)
    `)
    .like("qr_code", `%${kode}%`)
    .eq("aktif", true)
    .single();

  // Fetch petugas details (we need ini for session and transaction)
  const { data: petugas } = await supabase
    .from("petugas")
    .select("id, kelompok_id, role, nama, kelompok:kelompok_id(nama)")
    .eq("id", user.id)
    .single();

  if (!rumah) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f3ed] p-6 text-center font-sans text-[#1c2420]">
        <div className="mb-4 text-4xl">⚠️</div>
        <h1 className="mb-2 text-xl font-extrabold">Rumah Tidak Ditemukan</h1>
        <p className="mb-6 text-sm text-[#6f7d74]">Kode QR tidak valid atau rumah sudah dinonaktifkan.</p>
        <a href="/" className="rounded-xl bg-[#1f7a4d] px-6 py-3 font-bold text-white no-underline">
          Kembali ke Dashboard
        </a>
      </div>
    );
  }

  const petugasProps = petugas ? {
    id: petugas.id,
    nama: petugas.nama,
    role: petugas.role,
    kelompokNama: petugas.kelompok?.nama || "Admin System"
  } : null;

  return <ScanClient 
    rumah={rumah} 
    kode={kode} 
    petugasId={petugas?.id} 
    kelompokId={petugas?.kelompok_id || rumah.kelompok?.id} 
    petugas={petugasProps}
  />;
}

import { createClient } from "@/lib/supabase/server";

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { kode } = params; // e.g. QR-12345-ABCD

    // Find the house where the QR code ends with this code
    const { data: rumah, error } = await supabase
      .from("rumah")
      .select(`
        id, nama_penghuni, alamat, nominal_default, aktif,
        rt:rt_id(id, nama),
        kelompok:kelompok_id(id, nama)
      `)
      .like("qr_code", `%${kode}%`)
      .eq("aktif", true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json({ error: "Rumah tidak ditemukan atau tidak aktif." }, { status: 404 });
      }
      throw error;
    }

    return Response.json({ data: rumah });
  } catch (err) {
    console.error("[GET /api/scan/[kode]]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

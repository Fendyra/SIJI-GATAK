import { createClient, createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
/**
 * GET /api/transaksi
 * Query params:
 *   - sesi_id: filter per sesi
 *   - kelompok_id: filter per kelompok (join via sesi)
 *   - tanggal: YYYY-MM-DD
 *   - status: 'sudah' | 'kosong'
 *   - limit: jumlah data (default 100)
 *   - offset: untuk pagination
 */
export async function GET(request) {
  try {
    const supabase = await createAdminClient();
    const { searchParams } = request.nextUrl;

    const sesiId = searchParams.get("sesi_id");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const tanggal = searchParams.get("tanggal");

    let query = supabase
      .from("transaksi")
      .select(`
        id, nominal, status, catatan, created_at,
        rumah:rumah_id(id, nama_penghuni, alamat, qr_code),
        petugas:petugas_id(id, nama),
        sesi:sesi_id(id, tanggal, kelompok:kelompok_id(id, nama))
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (sesiId) query = query.eq("sesi_id", sesiId);
    if (status) query = query.eq("status", status);
    if (tanggal) {
      // Filter berdasarkan tanggal via sesi_ronda
      const { data: sesiData } = await supabase
        .from("sesi_ronda")
        .select("id")
        .eq("tanggal", tanggal);
      if (sesiData?.length) {
        query = query.in("sesi_id", sesiData.map((s) => s.id));
      }
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return Response.json({ data, total: count });
  } catch (err) {
    console.error("[GET /api/transaksi]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/transaksi
 * Body: { sesi_id, rumah_id, petugas_id, nominal, status, catatan? }
 * Simpan transaksi jimpitan baru
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { sesi_id, rumah_id, petugas_id, nominal, status, catatan } = body;

    if (!sesi_id || !rumah_id || !petugas_id) {
      return Response.json(
        { error: "sesi_id, rumah_id, dan petugas_id wajib diisi." },
        { status: 400 }
      );
    }

    if (!["sudah", "kosong"].includes(status)) {
      return Response.json(
        { error: "status harus 'sudah' atau 'kosong'." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("transaksi")
      .insert({
        sesi_id,
        rumah_id,
        petugas_id,
        nominal: status === "kosong" ? 0 : (Number(nominal) || 0),
        status,
        catatan: catatan || null,
      })
      .select(`
        id, nominal, status, catatan, created_at,
        rumah:rumah_id(id, nama_penghuni, alamat),
        petugas:petugas_id(id, nama)
      `)
      .single();

    if (error) throw error;

    return Response.json({ data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/transaksi]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/transaksi
 * Body: { id, nominal, status }
 * Koreksi transaksi yang sudah ada (hanya admin)
 */
export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const { id, nominal, status } = await request.json();

    if (!id) {
      return Response.json({ error: "id transaksi wajib diisi." }, { status: 400 });
    }

    const updates = {};
    if (nominal !== undefined) updates.nominal = Number(nominal) || 0;
    if (status !== undefined) updates.status = status;

    const { data, error } = await supabase
      .from("transaksi")
      .update(updates)
      .eq("id", id)
      .select("id, nominal, status, created_at")
      .single();

    if (error) throw error;

    return Response.json({ data });
  } catch (err) {
    console.error("[PATCH /api/transaksi]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/transaksi?id=xxx
 * Hapus transaksi (digunakan saat petugas melakukan pembatalan)
 */
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "id transaksi wajib diisi." }, { status: 400 });
    }

    const { error } = await supabase
      .from("transaksi")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/transaksi]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

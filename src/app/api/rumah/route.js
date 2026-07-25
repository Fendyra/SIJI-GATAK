import { createClient, createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
/**
 * GET /api/rumah
 * Query params:
 *   - kelompok_id: filter per kelompok
 *   - rt_id: filter per RT
 *   - search: cari nama_penghuni / alamat
 *   - aktif: 'true' | 'false' (default: 'true')
 */
export async function GET(request) {
  try {
    const supabase = await createAdminClient();
    const { searchParams } = request.nextUrl;

    let query = supabase
      .from("rumah")
      .select(`
        id, nama_penghuni, alamat, nominal_default, qr_code, aktif, created_at,
        rt:rt_id(id, nama),
        kelompok:kelompok_id(id, nama)
      `)
      .order("nama_penghuni", { ascending: true });

    const kelompokId = searchParams.get("kelompok_id");
    const rtId = searchParams.get("rt_id");
    const search = searchParams.get("search");
    const aktif = searchParams.get("aktif");

    if (kelompokId) query = query.eq("kelompok_id", kelompokId);
    if (rtId) query = query.eq("rt_id", rtId);
    if (aktif !== null) query = query.eq("aktif", aktif !== "false");
    if (search) {
      query = query.or(
        `nama_penghuni.ilike.%${search}%,alamat.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    return Response.json({ data });
  } catch (err) {
    console.error("[GET /api/rumah]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/rumah
 * Body: { nama_penghuni, alamat, rt_id, kelompok_id, nominal_default }
 * QR code di-generate otomatis dari prefix + timestamp unik
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { nama_penghuni, alamat, rt_id, kelompok_id, nominal_default } = body;

    if (!nama_penghuni || !rt_id || !kelompok_id) {
      return Response.json(
        { error: "nama_penghuni, rt_id, dan kelompok_id wajib diisi." },
        { status: 400 }
      );
    }

    // Generate QR code unik (hanya menyimpan ID, URL akan dibentuk dinamis di klien)
    const qr_code = `QR-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const { data, error } = await supabase
      .from("rumah")
      .insert({
        nama_penghuni,
        alamat: alamat || "",
        rt_id,
        kelompok_id,
        nominal_default: nominal_default || 2000,
        qr_code,
        aktif: true,
      })
      .select(`
        id, nama_penghuni, alamat, nominal_default, qr_code, aktif,
        rt:rt_id(id, nama),
        kelompok:kelompok_id(id, nama)
      `)
      .single();

    if (error) throw error;

    return Response.json({ data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/rumah]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/rumah
 * Body: { id, nama_penghuni?, alamat?, rt_id?, kelompok_id?, nominal_default?, aktif? }
 */
export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const { id, ...fields } = await request.json();

    if (!id) {
      return Response.json({ error: "id rumah wajib diisi." }, { status: 400 });
    }

    const allowed = ["nama_penghuni", "alamat", "rt_id", "kelompok_id", "nominal_default", "aktif"];
    const updates = {};
    allowed.forEach((f) => { if (fields[f] !== undefined) updates[f] = fields[f]; });

    const { data, error } = await supabase
      .from("rumah")
      .update(updates)
      .eq("id", id)
      .select(`
        id, nama_penghuni, alamat, nominal_default, qr_code, aktif,
        rt:rt_id(id, nama), kelompok:kelompok_id(id, nama)
      `)
      .single();

    if (error) throw error;
    return Response.json({ data });
  } catch (err) {
    console.error("[PATCH /api/rumah]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/rumah
 * Query: ?id=UUID
 * Soft delete: set aktif=false
 */
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "id rumah wajib diisi." }, { status: 400 });
    }

    // Soft delete — nonaktifkan rumah agar data historis tetap tersimpan
    const { error } = await supabase
      .from("rumah")
      .update({ aktif: false })
      .eq("id", id);

    if (error) throw error;
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/rumah]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

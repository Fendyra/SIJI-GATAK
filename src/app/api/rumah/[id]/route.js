import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/rumah/[id]
 * Ambil satu rumah beserta data RT dan kelompok
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("rumah")
      .select(`
        id, nama_penghuni, alamat, nominal_default, qr_code, aktif, created_at,
        rt:rt_id(id, nama),
        kelompok:kelompok_id(id, nama)
      `)
      .eq("id", id)
      .single();

    if (error) {
      return Response.json({ error: "Rumah tidak ditemukan." }, { status: 404 });
    }

    return Response.json({ data });
  } catch (err) {
    console.error("[GET /api/rumah/[id]]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/rumah/[id]
 * Update data rumah (nama, alamat, kelompok, nominal, aktif)
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const allowedFields = ["nama_penghuni", "alamat", "rt_id", "kelompok_id", "nominal_default", "aktif"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) updates[field] = body[field];
    });

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "Tidak ada field yang diupdate." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("rumah")
      .update(updates)
      .eq("id", id)
      .select(`
        id, nama_penghuni, alamat, nominal_default, qr_code, aktif,
        rt:rt_id(id, nama),
        kelompok:kelompok_id(id, nama)
      `)
      .single();

    if (error) throw error;

    return Response.json({ data });
  } catch (err) {
    console.error("[PUT /api/rumah/[id]]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/rumah/[id]
 * Nonaktifkan rumah (soft delete — set aktif = false)
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from("rumah")
      .update({ aktif: false })
      .eq("id", id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/rumah/[id]]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

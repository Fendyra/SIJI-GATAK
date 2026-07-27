import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
/**
 * GET /api/kelompok
 * Ambil semua kelompok beserta data RT-nya
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("kelompok")
      .select(`id, nama, jadwal, rt:rt_id(id, nama)`)
      .order("nama", { ascending: true });

    if (error) throw error;

    return Response.json({ data });
  } catch (err) {
    console.error("[GET /api/kelompok]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/kelompok
 * Body: { nama, rt_id, jadwal? }
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { nama, jadwal } = await request.json();

    if (!nama) {
      return Response.json({ error: "nama wajib diisi." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("kelompok")
      .insert({ nama, rt_id: null, jadwal: jadwal || "" })
      .select(`id, nama, jadwal, rt:rt_id(id, nama)`)
      .single();

    if (error) throw error;

    return Response.json({ data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/kelompok]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/kelompok
 * Body: { id, nama?, jadwal? }
 */
export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const { id, nama, jadwal } = await request.json();

    if (!id) {
      return Response.json({ error: "id kelompok wajib diisi." }, { status: 400 });
    }

    const updates = {};
    if (nama !== undefined) updates.nama = nama;
    if (jadwal !== undefined) updates.jadwal = jadwal;
    updates.rt_id = null;

    const { data, error } = await supabase
      .from("kelompok")
      .update(updates)
      .eq("id", id)
      .select("id, nama, jadwal, rt:rt_id(id, nama)")
      .single();

    if (error) throw error;
    return Response.json({ data });
  } catch (err) {
    console.error("[PATCH /api/kelompok]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/kelompok
 * Query: ?id=UUID
 */
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "id kelompok wajib diisi." }, { status: 400 });
    }

    const { error } = await supabase.from("kelompok").delete().eq("id", id);
    if (error) throw error;
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/kelompok]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

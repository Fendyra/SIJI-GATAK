import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/rt
 * Ambil semua data RT
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("rt")
      .select("id, nama, ketua, created_at")
      .order("nama", { ascending: true });

    if (error) throw error;

    return Response.json({ data });
  } catch (err) {
    console.error("[GET /api/rt]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/rt
 * Body: { nama, ketua? }
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { nama, ketua } = await request.json();

    if (!nama) {
      return Response.json({ error: "nama RT wajib diisi." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("rt")
      .insert({ nama, ketua: ketua || "" })
      .select("id, nama, ketua")
      .single();

    if (error) throw error;

    return Response.json({ data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/rt]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/rt
 * Body: { id, nama?, ketua? }
 */
export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const { id, nama, ketua } = await request.json();

    if (!id) {
      return Response.json({ error: "id RT wajib diisi." }, { status: 400 });
    }

    const updates = {};
    if (nama !== undefined) updates.nama = nama;
    if (ketua !== undefined) updates.ketua = ketua;

    const { data, error } = await supabase
      .from("rt")
      .update(updates)
      .eq("id", id)
      .select("id, nama, ketua")
      .single();

    if (error) throw error;
    return Response.json({ data });
  } catch (err) {
    console.error("[PATCH /api/rt]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/rt
 * Query: ?id=UUID
 */
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "id RT wajib diisi." }, { status: 400 });
    }

    const { error } = await supabase.from("rt").delete().eq("id", id);
    if (error) throw error;
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/rt]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/sesi
 * Query params:
 *   - kelompok_id: wajib untuk petugas
 *   - tanggal: format YYYY-MM-DD (default: hari ini)
 *
 * Cari atau buat sesi ronda hari ini untuk kelompok tertentu.
 */
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;

    const kelompok_id = searchParams.get("kelompok_id");
    const tanggal = searchParams.get("tanggal") || new Date().toISOString().split("T")[0];

    if (!kelompok_id) {
      return Response.json({ error: "kelompok_id wajib diisi." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("sesi_ronda")
      .select(`
        id, tanggal, created_at,
        kelompok:kelompok_id(id, nama),
        petugas:petugas_id(id, nama, username)
      `)
      .eq("kelompok_id", kelompok_id)
      .eq("tanggal", tanggal)
      .maybeSingle();

    if (error) throw error;

    return Response.json({ data });
  } catch (err) {
    console.error("[GET /api/sesi]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/sesi
 * Body: { kelompok_id, petugas_id, tanggal? }
 * Buat sesi ronda baru (atau kembalikan yang sudah ada hari ini)
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { kelompok_id, petugas_id } = body;
    const tanggal = body.tanggal || new Date().toISOString().split("T")[0];

    if (!kelompok_id || !petugas_id) {
      return Response.json(
        { error: "kelompok_id dan petugas_id wajib diisi." },
        { status: 400 }
      );
    }

    // Upsert: kalau sudah ada sesi hari ini untuk kelompok+petugas ini, kembalikan yang ada
    const { data, error } = await supabase
      .from("sesi_ronda")
      .upsert(
        { kelompok_id, petugas_id, tanggal },
        { onConflict: "kelompok_id,petugas_id,tanggal", ignoreDuplicates: false }
      )
      .select(`
        id, tanggal,
        kelompok:kelompok_id(id, nama),
        petugas:petugas_id(id, nama)
      `)
      .single();

    if (error) throw error;

    return Response.json({ data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/sesi]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

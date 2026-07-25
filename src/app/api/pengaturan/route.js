import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
/**
 * GET /api/pengaturan
 * Ambil pengaturan global (singleton)
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pengaturan")
      .select("*")
      .single();

    if (error) throw error;

    return Response.json({ data });
  } catch (err) {
    console.error("[GET /api/pengaturan]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/pengaturan
 * Body: { nominal_default_global?, persentase_kas_rt?, persentase_kas_ronda? }
 * Update pengaturan global (hanya admin)
 */
export async function PUT(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { nominal_default_global, persentase_kas_rt, persentase_kas_ronda } = body;

    // Validasi persentase harus total 100%
    if (persentase_kas_rt !== undefined && persentase_kas_ronda !== undefined) {
      if (persentase_kas_rt + persentase_kas_ronda !== 100) {
        return Response.json(
          { error: "Total persentase RT + Ronda harus 100%." },
          { status: 400 }
        );
      }
    }

    const updates = { updated_at: new Date().toISOString() };
    if (nominal_default_global !== undefined) updates.nominal_default_global = Number(nominal_default_global);
    if (persentase_kas_rt !== undefined) updates.persentase_kas_rt = Number(persentase_kas_rt);
    if (persentase_kas_ronda !== undefined) updates.persentase_kas_ronda = Number(persentase_kas_ronda);

    const { data, error } = await supabase
      .from("pengaturan")
      .update(updates)
      .eq("id", 1)
      .select("*")
      .single();

    if (error) throw error;

    return Response.json({ data });
  } catch (err) {
    console.error("[PUT /api/pengaturan]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

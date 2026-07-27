import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/me
 * Mendapatkan detail user (petugas) yang sedang login berdasarkan sesi cookie Supabase.
 */
export async function GET(request) {
  try {
    const supabase = await createClient();
    
    // Get session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return Response.json({ user: null }, { status: 401 });
    }

    const { data: petugas, error: petugasError } = await supabase
      .from("petugas")
      .select(`
        id,
        nama,
        username,
        role,
        kelompok_id,
        kelompok:kelompok_id (
          nama
        )
      `)
      .eq("id", user.id)
      .single();

    if (petugasError || !petugas) {
      return Response.json({ user: null }, { status: 401 });
    }

    // Map to currentUser format
    const currentUser = {
      id: petugas.id,
      nama: petugas.nama,
      username: petugas.username,
      role: petugas.role,
      kelompok_id: petugas.kelompok_id,
      kelompok: petugas.kelompok?.nama || "",
      rt: "",
    };

    return Response.json({ user: currentUser });
  } catch (err) {
    console.error("[GET /api/auth/me]", err);
    return Response.json({ error: err.message, user: null }, { status: 500 });
  }
}

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * GET /api/petugas
 * Ambil semua akun petugas beserta kelompok dan RT
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("petugas")
      .select(`
        id, nama, username, role, aktif, created_at,
        kelompok:kelompok_id(id, nama, rt:rt_id(id, nama))
      `)
      .order("nama", { ascending: true });

    if (error) throw error;

    return Response.json({ data });
  } catch (err) {
    console.error("[GET /api/petugas]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/petugas
 * Body: { nama, username, password, kelompok_id, role? }
 * Buat akun petugas baru via Supabase Auth + insert profil
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, username, email, password, kelompok_id, role = "petugas" } = body;

    if (!nama || !password) {
      return Response.json(
        { error: "nama dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Tentukan email untuk Supabase Auth
    // Jika email disediakan langsung, gunakan itu. Jika tidak, konversi dari username.
    let authEmail;
    if (email && email.includes("@")) {
      authEmail = email.trim().toLowerCase();
    } else if (username) {
      authEmail = `${username.trim().toLowerCase()}@jimpitan.internal`;
    } else {
      return Response.json({ error: "email atau username wajib diisi." }, { status: 400 });
    }

    const finalUsername = username || (email ? email.trim().split("@")[0].toLowerCase() : "");

    // Gunakan admin client untuk membuat user Auth (bypass RLS)
    const adminSupabase = await createAdminClient();

    const { data: authUser, error: authError } =
      await adminSupabase.auth.admin.createUser({
        email: authEmail,
        password,
        email_confirm: true,
      });

    if (authError) {
      if (authError.message?.includes("already registered")) {
        return Response.json({ error: "Email/username sudah digunakan." }, { status: 409 });
      }
      throw authError;
    }

    // Insert profil petugas
    const { data: profil, error: profilError } = await adminSupabase
      .from("petugas")
      .insert({
        id: authUser.user.id,
        nama,
        username: finalUsername,
        kelompok_id: kelompok_id || null,
        role,
        aktif: true,
      })
      .select(`
        id, nama, username, role, aktif,
        kelompok:kelompok_id(id, nama)
      `)
      .single();

    if (profilError) {
      await adminSupabase.auth.admin.deleteUser(authUser.user.id);
      throw profilError;
    }

    return Response.json({ data: profil }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/petugas]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/petugas
 * Body: { id, aktif?, kelompok_id?, nama? }
 * Update status atau data akun petugas (hanya admin)
 */
export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const { id, ...updates } = await request.json();

    if (!id) {
      return Response.json({ error: "id petugas wajib diisi." }, { status: 400 });
    }

    const allowedFields = ["nama", "aktif", "kelompok_id", "role"];
    const safeUpdates = {};
    allowedFields.forEach((f) => {
      if (updates[f] !== undefined) safeUpdates[f] = updates[f];
    });

    const { data, error } = await supabase
      .from("petugas")
      .update(safeUpdates)
      .eq("id", id)
      .select(`id, nama, username, role, aktif, kelompok:kelompok_id(id, nama)`)
      .single();

    if (error) throw error;

    return Response.json({ data });
  } catch (err) {
    console.error("[PATCH /api/petugas]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

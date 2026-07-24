import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nama, password } = await request.json();

    // 1. Update password via Auth API (if provided)
    if (password && password.trim().length > 0) {
      const { error: updateAuthError } = await supabase.auth.updateUser({
        password: password.trim(),
      });
      if (updateAuthError) {
        return Response.json({ error: "Gagal mengubah password: " + updateAuthError.message }, { status: 400 });
      }
    }

    // 2. Update profil (nama) via Admin Client
    // We must use Admin Client because RLS prevents Petugas from updating the petugas table
    if (nama && nama.trim().length > 0) {
      const supabaseAdmin = await createAdminClient();
      const { error: updateProfilError } = await supabaseAdmin
        .from("petugas")
        .update({ nama: nama.trim() })
        .eq("id", user.id);

      if (updateProfilError) {
        return Response.json({ error: "Gagal mengubah nama: " + updateProfilError.message }, { status: 400 });
      }
    }

    // Fetch updated user data
    const { data: profil } = await supabase
      .from("petugas")
      .select("id, nama, username, role, aktif, kelompok_id, kelompok(nama, rt(nama))")
      .eq("id", user.id)
      .single();

    return Response.json({ success: true, data: profil });
  } catch (err) {
    console.error("[PATCH /api/profile]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

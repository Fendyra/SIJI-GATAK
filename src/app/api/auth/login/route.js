import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/login
 * Body: { username, password, role }
 * Login via Supabase Auth (email = username@jimpitan.internal)
 */
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { error: "Username dan password harus diisi." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Cek apakah input berupa email (mengandung @) atau username biasa
    let email = username.trim().toLowerCase();
    if (!email.includes("@")) {
      // Jika tidak mengandung @, kita anggap sebagai username dan konversi ke email internal
      email = `${email}@jimpitan.internal`;
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      return Response.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    // Ambil profil petugas
    const { data: profil, error: profilError } = await supabase
      .from("petugas")
      .select("id, nama, username, role, aktif, kelompok_id, kelompok(nama, rt(nama))")
      .eq("id", authData.user.id)
      .single();

    if (profilError || !profil) {
      return Response.json(
        { error: "Profil pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    if (!profil.aktif) {
      await supabase.auth.signOut();
      return Response.json(
        { error: "Akun Anda tidak aktif. Hubungi admin." },
        { status: 403 }
      );
    }

    return Response.json({
      user: {
        id: profil.id,
        nama: profil.nama,
        username: profil.username,
        role: profil.role,
        kelompok_id: profil.kelompok_id,
        kelompok: profil.kelompok?.nama || null,
        rt: profil.kelompok?.rt?.nama || null,
      },
    });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return Response.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}

/**
 * POST /api/auth/logout
 */
export async function DELETE() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return Response.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/auth/login]", err);
    return Response.json({ error: "Gagal logout." }, { status: 500 });
  }
}

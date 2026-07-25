import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
/**
 * GET /api/rekap
 * Query params:
 *   - periode: 'harian' | 'bulanan' (default: 'harian')
 *   - tanggal: YYYY-MM-DD (untuk harian, default: hari ini)
 *   - bulan: YYYY-MM (untuk bulanan, default: bulan ini)
 *   - kelompok_id: filter per kelompok (opsional)
 *
 * Returns: ringkasan total terkumpul, per-RT, per-kelompok, dan daftar transaksi
 */
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;

    const periode = searchParams.get("periode") || "harian";
    const kelompokId = searchParams.get("kelompok_id");

    // Tentukan rentang tanggal
    let dateFrom, dateTo;
    const now = new Date();

    if (periode === "harian") {
      const tanggal = searchParams.get("tanggal") || now.toISOString().split("T")[0];
      dateFrom = `${tanggal}T00:00:00`;
      dateTo = `${tanggal}T23:59:59`;
    } else {
      // bulanan
      const bulan = searchParams.get("bulan") || now.toISOString().slice(0, 7);
      const [year, month] = bulan.split("-").map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      dateFrom = `${bulan}-01T00:00:00`;
      dateTo = `${bulan}-${String(lastDay).padStart(2, "0")}T23:59:59`;
    }

    // Ambil semua transaksi dalam periode
    let txQuery = supabase
      .from("transaksi")
      .select(`
        id, nominal, status, created_at,
        rumah:rumah_id(id, nama_penghuni, rt:rt_id(id, nama)),
        petugas:petugas_id(id, nama),
        sesi:sesi_id(id, tanggal, kelompok:kelompok_id(id, nama))
      `)
      .gte("created_at", dateFrom)
      .lte("created_at", dateTo)
      .order("created_at", { ascending: false });

    if (kelompokId) {
      // Filter via sesi
      const { data: sesiIds } = await supabase
        .from("sesi_ronda")
        .select("id")
        .eq("kelompok_id", kelompokId);
      if (sesiIds?.length) {
        txQuery = txQuery.in("sesi_id", sesiIds.map((s) => s.id));
      }
    }

    const { data: transaksi, error: txError } = await txQuery;
    if (txError) throw txError;

    // Ambil pengaturan persentase
    const { data: setting } = await supabase
      .from("pengaturan")
      .select("persentase_kas_rt, persentase_kas_ronda, nominal_default_global")
      .single();

    const pctRt = setting?.persentase_kas_rt || 60;
    const pctRonda = setting?.persentase_kas_ronda || 40;

    // Hitung total
    const txSudah = transaksi?.filter((t) => t.status === "sudah") || [];
    const totalTerkumpul = txSudah.reduce((sum, t) => sum + t.nominal, 0);
    const kasRt = Math.round((totalTerkumpul * pctRt) / 100);
    const kasRonda = Math.round((totalTerkumpul * pctRonda) / 100);

    // Rekapitulasi per RT
    const perRt = {};
    txSudah.forEach((t) => {
      const rtNama = t.rumah?.rt?.nama || "Tidak Diketahui";
      if (!perRt[rtNama]) perRt[rtNama] = { nama: rtNama, total: 0, count: 0 };
      perRt[rtNama].total += t.nominal;
      perRt[rtNama].count += 1;
    });

    // Rekapitulasi per Kelompok
    const perKelompok = {};
    txSudah.forEach((t) => {
      const kId = t.sesi?.kelompok?.id || "unknown";
      const kNama = t.sesi?.kelompok?.nama || "Tidak Diketahui";
      
      if (!perKelompok[kId]) {
        perKelompok[kId] = {
          id: kId,
          nama: kNama,
          total: 0,
          count: 0,
          sesi: {},
          petugas: {},
        };
      }
      perKelompok[kId].total += t.nominal;
      perKelompok[kId].count += 1;

      // Group by Sesi (Tanggal)
      const tgl = t.sesi?.tanggal || "Tidak Diketahui";
      if (!perKelompok[kId].sesi[tgl]) {
        perKelompok[kId].sesi[tgl] = { tanggal: tgl, total: 0, count: 0 };
      }
      perKelompok[kId].sesi[tgl].total += t.nominal;
      perKelompok[kId].sesi[tgl].count += 1;

      // Group by Petugas
      const pNama = t.petugas?.nama || "Admin / Tidak Diketahui";
      if (!perKelompok[kId].petugas[pNama]) {
        perKelompok[kId].petugas[pNama] = { nama: pNama, total: 0, count: 0 };
      }
      perKelompok[kId].petugas[pNama].total += t.nominal;
      perKelompok[kId].petugas[pNama].count += 1;
    });

    // Convert objects to array for easier consumption in React
    const kelompokArray = Object.values(perKelompok).map(k => ({
      ...k,
      sesiList: Object.values(k.sesi).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)),
      petugasList: Object.values(k.petugas).sort((a, b) => b.count - a.count), // sort by highest scan count
    }));

    return Response.json({
      data: {
        periode,
        totalTerkumpul,
        kasRt,
        kasRonda,
        persentase: { rt: pctRt, ronda: pctRonda },
        jumlahSudah: txSudah.length,
        jumlahKosong: transaksi?.filter((t) => t.status === "kosong").length || 0,
        perRt: Object.values(perRt).sort((a, b) => b.total - a.total),
        perKelompok: kelompokArray.sort((a, b) => b.total - a.total),
        transaksi: transaksi || [],
      },
    });
  } catch (err) {
    console.error("[GET /api/rekap]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

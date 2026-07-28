require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DATA = {
  "Malam Senin": [
    "Agus", "Andreas", "Budi Santoso", "Faisal", "Heri T", "Huda", "Mujiyanto", "Paryanto", "Paryanto Gendut", "Sarjono", "Suhardi 03", "Suhardi 04", "Suripto", "Teguh S", "Triyono", "Umbar", "Yunanto Gombong"
  ],
  "Malam Selasa": [
    "Afis", "Andi Sudianto", "Annes", "Aryo", "Bambang", "Budi Wilono", "Fikri", "Jumadi", "Muji Hartono", "Nurdiyanto", "Sudiyono", "Sugiyono", "Sunaryo", "Wiratno", "Yuli"
  ],
  "Malam Rabu": [
    "Agus", "Amri", "Aris", "Baskoro", "Budiyono", "Danang", "Edi", "Fandi", "Heru", "Jakiman", "Margono", "Marjuki", "Maryadi", "Samiyo", "Susanto", "Tri Haryanto"
  ],
  "Malam Kamis": [
    "Bagus", "Bowo Bengkel", "Joko", "Kholis", "Mei", "Nanto", "Riyan", "Ruli", "Samijo", "Sarwidi", "Tharom", "Thoyib"
  ],
  "Malam Jumat": [
    "Bowo", "Dwi", "Kalimi", "Margono", "Muryadi", "Pak Eko", "Paryono", "Sarjono", "Sudaryono", "Tri W", "Untung", "Wijiyono"
  ],
  "Malam Sabtu": [
    "Agus", "Bangun", "Darmadi Pemuda", "Dwi Hannik", "Jayadi", "Muna", "Noto", "Pamungkas", "Rafi", "Rizky", "Rohmat", "Roneld", "Slamet BJ", "Sumadi", "Suroto", "Tikun", "Triyanto", "Wawan", "Yakobus", "Yudi"
  ],
  "Malam Minggu": [
    "Ari", "Arkham", "Darno", "Darto", "Eko", "Galih", "Maryoto", "Mujiyo", "Rendi", "Sugeng", "Sugi", "Sumadi", "Yanu"
  ]
};

const INACTIVE = ["Pamungkas", "Rizky", "Yakobus"];

async function main() {
  console.log("Deleting old petugas...");
  await supabase.from("users").delete().eq("role", "petugas");

  console.log("Ensuring Kelompok exists...");
  const kelompokMap = {};
  for (const [kName, _] of Object.entries(DATA)) {
    let { data: kData } = await supabase.from("kelompok").select("id").eq("nama", `Kelompok ${kName}`).single();
    if (!kData) {
      const { data: newK } = await supabase.from("kelompok").insert({
        nama: `Kelompok ${kName}`,
        jadwal: kName.split(" ")[1] // e.g. "Senin"
      }).select("id").single();
      kData = newK;
    } else {
      await supabase.from("kelompok").update({ jadwal: kName.split(" ")[1] }).eq("id", kData.id);
    }
    kelompokMap[kName] = kData.id;
  }

  console.log("Inserting Petugas...");
  for (const [kName, members] of Object.entries(DATA)) {
    const kId = kelompokMap[kName];
    for (let i = 0; i < members.length; i++) {
      let rawName = members[i];
      let cleanName = rawName.replace(" - ?x", "").replace(" - Off", "").replace("- ?", "").replace("- Pemuda", " Pemuda").trim();
      const isActive = !INACTIVE.includes(cleanName);
      
      const firstName = cleanName.split(" ")[0].toLowerCase();
      const username = `${firstName}_${kName.split(" ")[1].toLowerCase()}`;
      const password = `${firstName}${i + 1}`;

      await supabase.from("users").insert({
        nama: cleanName,
        username: username,
        password: password,
        role: "petugas",
        kelompok_id: kId,
        aktif: isActive
      });
    }
  }

  console.log("Done seeding Petugas!");
}

main().catch(console.error);

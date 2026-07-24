const rt4Data = [
  "Sudaryana", "Budi Marsigit", "Nurrohmadi", "Nurdiyanto", "Mujiyono", "Wagilah", "Mugono", "Wiratno", "Riyo Wardoyo", "Tarom", "Waliyo", "Agus Yati", "Kholil", "Arif Fajar", "Agus", "Jamilah", "Anes", "Rustamaji", "Slamet Gamber", "Soto Pak Tomo", "Toko Buah", "Roti Bakar", "Kost Ujung Selatan", "Batako", "Bowo Rosok", "Aloy Bengkel", "Wagiyo", "Bangun Febrianto", "Suroto", "Sugeng Waluyo", "Pujo Wiyono", "Muryadi", "Boiman", "Rohmad", "Jayadi", "Teguh Subagiyo", "Yudianto", "Dwi Armadayanto", "Heri Sonya", "Gunardi", "Robet", "Samiyo", "Ronald Sadubun", "Wawan", "Yakobus", "Burgerax", "Untung Pratitis", "Sudiyono Riyadi", "Eko", "Huda", "Rumah Pak Gati", "Kalimi", "Wijiyono", "Eko Hayu", "Maryoto", "Muji Hartanto", "Triyadi", "Suhardi", "Prinanggalih", "Bu Romlah", "Andi Sudiyanto", "Sudiman", "Subardiman", "Ruli Nurmansyah", "Budi Miliyono", "Triyono", "Wahyu Danang", "Tri Haryanto", "Latif Paryanto", "Triyanto Pegu", "Joko Karsiman", "Hafizin", "Sukiman", "Harto", "Sugiyono", "Sarjono", "Darto"
];

const rt3Data = [
  "Rina", "Sudiyono", "Fikri", "Sudinem", "Bayu", "Toyib", "Warso Utomo", "Sarijo", "Amri", "Samijo", "Margono", "Noto Utomo", "Sumaryadi", "Marjuki", "Sarwidi", "Yono", "Ponirah Parjo", "Sarjono Tengong", "Slamet", "Adit", "Supardi", "Sunaryo", "Sumadi Somo", "Wardiyono", "Edi", "Umbar", "Suhar", "Rafi", "Tri Widodo", "Heru Pracoyo", "Yulianto", "Bagus", "Yanu", "Budi Mitra", "Anwar", "Sumadi", "Tri Wahono", "Kanadental", "Aris", "Apotik ProGo", "Yuli", "Dwi", "Heri", "Aryo", "Suroto", "Warmindo", "Darno", "Suripto", "Paryanto Gendut", "Susanto", "Ruko Bu Mei", "Ahas", "ZT Audio"
];

const dukuhanData = [
  "Bowo Rapi", "Bambang", "Maryono", "Jumadi", "Mujianto", "Darmadi", "Pamungkas", "Tugimin", "Muna", "Miwan", "Budiyono", "Kholis", "Sukiwan", "Adi Sumarto", "Sugeng", "Nanto", "Rian", "Jakiman", "May Priyambodo", "Wandi Susilo"
];

const API_BASE = "http://127.0.0.1:3000/api";

async function findOrCreateRT(nama) {
  const res = await fetch(`${API_BASE}/rt`);
  const json = await res.json();
  const existing = json.data.find(r => r.nama.toLowerCase() === nama.toLowerCase());
  
  if (existing) return existing.id;

  console.log(`Creating RT: ${nama}`);
  const postRes = await fetch(`${API_BASE}/rt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, ketua: "-" })
  });
  const postJson = await postRes.json();
  return postJson.data.id;
}

async function findOrCreateKelompok(nama, rt_id) {
  const res = await fetch(`${API_BASE}/kelompok`);
  const json = await res.json();
  const existing = json.data.find(k => k.nama.toLowerCase() === nama.toLowerCase());
  
  if (existing) return existing.id;

  console.log(`Creating Kelompok: ${nama}`);
  const postRes = await fetch(`${API_BASE}/kelompok`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, rt_id, jadwal: "-" })
  });
  const postJson = await postRes.json();
  return postJson.data.id;
}

async function seedRumah(names, rtName, rtId, kelompokId) {
  let count = 0;
  for (const nama of names) {
    const res = await fetch(`${API_BASE}/rumah`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama_penghuni: nama,
        alamat: rtName,
        rt_id: rtId,
        kelompok_id: kelompokId,
        nominal_default: 2000
      })
    });
    
    if (res.ok) {
      count++;
      console.log(`[+] Added: ${nama} (${rtName})`);
    } else {
      const err = await res.json();
      console.error(`[-] Failed: ${nama}`, err);
    }
    
    // Add small delay to avoid overwhelming the server
    await new Promise(r => setTimeout(r, 50));
  }
  return count;
}

async function run() {
  try {
    console.log("Starting data seed...");
    
    const rt4Id = await findOrCreateRT("RT 4");
    const kel4Id = await findOrCreateKelompok("Warga RT 4", rt4Id);
    
    const rt3Id = await findOrCreateRT("RT 3");
    const kel3Id = await findOrCreateKelompok("Warga RT 3", rt3Id);
    
    const dukuhanId = await findOrCreateRT("Dukuhan");
    const kelDukuhanId = await findOrCreateKelompok("Warga Dukuhan", dukuhanId);
    
    let total = 0;
    
    console.log("\n--- Seeding RT 4 ---");
    total += await seedRumah(rt4Data, "RT 4", rt4Id, kel4Id);
    
    console.log("\n--- Seeding RT 3 ---");
    total += await seedRumah(rt3Data, "RT 3", rt3Id, kel3Id);
    
    console.log("\n--- Seeding Dukuhan ---");
    total += await seedRumah(dukuhanData, "Dukuhan", dukuhanId, kelDukuhanId);
    
    console.log(`\n🎉 Selesai! Berhasil menambahkan ${total} rumah.`);
    
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

run();

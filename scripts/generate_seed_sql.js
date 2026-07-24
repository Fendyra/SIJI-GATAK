const fs = require('fs');

const rt4Data = [
  "Sudaryana", "Budi Marsigit", "Nurrohmadi", "Nurdiyanto", "Mujiyono", "Wagilah", "Mugono", "Wiratno", "Riyo Wardoyo", "Tarom", "Waliyo", "Agus Yati", "Kholil", "Arif Fajar", "Agus", "Jamilah", "Anes", "Rustamaji", "Slamet Gamber", "Soto Pak Tomo", "Toko Buah", "Roti Bakar", "Kost Ujung Selatan", "Batako", "Bowo Rosok", "Aloy Bengkel", "Wagiyo", "Bangun Febrianto", "Suroto", "Sugeng Waluyo", "Pujo Wiyono", "Muryadi", "Boiman", "Rohmad", "Jayadi", "Teguh Subagiyo", "Yudianto", "Dwi Armadayanto", "Heri Sonya", "Gunardi", "Robet", "Samiyo", "Ronald Sadubun", "Wawan", "Yakobus", "Burgerax", "Untung Pratitis", "Sudiyono Riyadi", "Eko", "Huda", "Rumah Pak Gati", "Kalimi", "Wijiyono", "Eko Hayu", "Maryoto", "Muji Hartanto", "Triyadi", "Suhardi", "Prinanggalih", "Bu Romlah", "Andi Sudiyanto", "Sudiman", "Subardiman", "Ruli Nurmansyah", "Budi Miliyono", "Triyono", "Wahyu Danang", "Tri Haryanto", "Latif Paryanto", "Triyanto Pegu", "Joko Karsiman", "Hafizin", "Sukiman", "Harto", "Sugiyono", "Sarjono", "Darto"
];

const rt3Data = [
  "Rina", "Sudiyono", "Fikri", "Sudinem", "Bayu", "Toyib", "Warso Utomo", "Sarijo", "Amri", "Samijo", "Margono", "Noto Utomo", "Sumaryadi", "Marjuki", "Sarwidi", "Yono", "Ponirah Parjo", "Sarjono Tengong", "Slamet", "Adit", "Supardi", "Sunaryo", "Sumadi Somo", "Wardiyono", "Edi", "Umbar", "Suhar", "Rafi", "Tri Widodo", "Heru Pracoyo", "Yulianto", "Bagus", "Yanu", "Budi Mitra", "Anwar", "Sumadi", "Tri Wahono", "Kanadental", "Aris", "Apotik ProGo", "Yuli", "Dwi", "Heri", "Aryo", "Suroto", "Warmindo", "Darno", "Suripto", "Paryanto Gendut", "Susanto", "Ruko Bu Mei", "Ahas", "ZT Audio"
];

const dukuhanData = [
  "Bowo Rapi", "Bambang", "Maryono", "Jumadi", "Mujianto", "Darmadi", "Pamungkas", "Tugimin", "Muna", "Miwan", "Budiyono", "Kholis", "Sukiwan", "Adi Sumarto", "Sugeng", "Nanto", "Rian", "Jakiman", "May Priyambodo", "Wandi Susilo"
];

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateQrCode() {
  const qr_id = `QR-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  return `http://localhost:3000/scan/${qr_id}`;
}

let sql = `-- Migration: Insert 150 Data Warga\n\n`;

function processGroup(groupName, data) {
  const rtId = generateId();
  const kelId = generateId();

  sql += `-- ==========================================\n`;
  sql += `-- GROUP: ${groupName}\n`;
  sql += `-- ==========================================\n\n`;

  sql += `INSERT INTO rt (id, nama, ketua) VALUES ('${rtId}', '${groupName}', '-');\n\n`;
  
  sql += `INSERT INTO kelompok (id, nama, rt_id, jadwal) VALUES ('${kelId}', 'Warga ${groupName}', '${rtId}', '-');\n\n`;

  sql += `INSERT INTO rumah (id, nama_penghuni, alamat, rt_id, kelompok_id, nominal_default, qr_code, aktif) VALUES\n`;
  
  const values = data.map(nama => {
    const safeNama = nama.replace(/'/g, "''");
    return `  ('${generateId()}', '${safeNama}', '${groupName}', '${rtId}', '${kelId}', 2000, '${generateQrCode()}', true)`;
  });

  sql += values.join(",\n") + ";\n\n";
}

processGroup("RT 4", rt4Data);
processGroup("RT 3", rt3Data);
processGroup("Dukuhan", dukuhanData);

fs.writeFileSync('scripts/seed_warga.sql', sql);
console.log("SQL file generated at scripts/seed_warga.sql");

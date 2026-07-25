import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const rt4 = [
"Sudaryana", "Budi Marsigit", "Nurrohmadi", "Nurdiyanto", "Mujiyono", "Wagilah", "Mugono", "Wiratno", "Riyo Wardoyo", "Tarom", "Waliyo", "Agus Yati", "Kholil", "Arif Fajar", "Agus ", "Jamilah", "Anes", "Rustamaji", "Slamet Gamber", "Soto Pak Tomo", "Toko Buah", "Roti Bakar", "Kost Ujung Selatan", "Batako", "Bowo Rosok", "Aloy Bengkel", "Wagiyo", "Bangun Febrianto", "Suroto", "Sugeng Waluyo", "Pujo Wiyono", "Muryadi", "Boiman", "Rohmad", "Jayadi", "Teguh Subagiyo", "Yudianto", "Dwi Armadayanto", "Heri Sonya", "Gunardi", "Robet", "Samiyo", "Ronald Sadubun", "Wawan ", "Yakobus", "Burgerax", "Untung Pratitis", "Sudiyono Riyadi", "Eko ", "Huda", "Rumah Pak Gati", "Kalimi", "Wijiyono", "Eko Hayu", "Maryoto", "Muji Hartanto", "Triyadi", "Suhardi", "Prinanggalih", "Bu Romlah", "Andi Sudiyanto", "Sudiman", "Subardiman", "Ruli Nurmansyah", "Budi Miliyono", "Triyono", "Wahyu Danang ", "Tri Haryanto", "Latif Paryanto", "Triyanto Pegu", "Joko Karsiman", "Hafizin", "Sukiman", "Harto", "Sugiyono", "Sarjono", "Darto"
];

const rt3 = [
"Rina", "Sudiyono", "Fikri ", "Sudinem", "Bayu", "Toyib", "Warso Utomo", "Sarijo", "Amri", "Samijo", "Margono", "Noto Utomo", "Sumaryadi", "Marjuki", "Sarwidi", "Yono", "Ponirah Parjo", "Sarjono Tengong", "Slamet", "Adit", "Supardi", "Sunaryo", "Sumadi Somo", "Wardiyono", "Edi ", "Umbar", "Suhar", "Rafi", "Tri Widodo", "Heru Pracoyo", "Yulianto", "Bagus", "Yanu", "Budi Mitra", "Anwar", "Sumadi", "Tri Wahono", "Kanadental", "Aris", "Apotik ProGo", "Yuli", "Dwi ", "Heri", "Aryo", "Suroto", "Warmindo", "Darno", "Suripto", "Paryanto Gendut", "Susanto", "Ruko Bu Mei", "Ahas ", "ZT Audio"
];

const dukuhan = [
"Bowo Rapi", "Bambang", "Maryono", "Jumadi", "Mujianto", "Darmadi", "Pamungkas", "Tugimin", "Muna", "Miwan", "Budiyono", "Kholis ", "Sukiwan", "Adi Sumarto", "Sugeng", "Nanto", "Rian", "Jakiman", "May Priyambodo", "Wandi Susilo"
];

async function run() {
  console.log("Fetching RT and Kelompok...");
  const { data: rts } = await supabase.from('rt').select('*');
  const { data: kelompoks } = await supabase.from('kelompok').select('*');
  
  if (!rts || !kelompoks) {
    console.error("Failed to fetch RT/Kelompok");
    return;
  }
  
  // Find or create RTs
  const rtIds = {};
  for (const rtName of ["RT 3", "RT 4", "Dukuhan"]) {
    let rt = rts.find(r => r.nama.toLowerCase() === rtName.toLowerCase());
    if (!rt) {
      console.log(`Creating ${rtName}...`);
      const { data: newRt } = await supabase.from('rt').insert({ nama: rtName, ketua: '-' }).select().single();
      rt = newRt;
    }
    rtIds[rtName] = rt.id;
  }
  
  // Use first kelompok or null
  const kelompokId = kelompoks.length > 0 ? kelompoks[0].id : null;
  console.log("Using Kelompok ID:", kelompokId);
  
  const allHouses = [
    ...rt4.map(name => ({ nama_penghuni: name.trim(), rt_id: rtIds["RT 4"], kelompok_id: kelompokId, nominal_default: 2000 })),
    ...rt3.map(name => ({ nama_penghuni: name.trim(), rt_id: rtIds["RT 3"], kelompok_id: kelompokId, nominal_default: 2000 })),
    ...dukuhan.map(name => ({ nama_penghuni: name.trim(), rt_id: rtIds["Dukuhan"], kelompok_id: kelompokId, nominal_default: 2000 }))
  ];
  
  // Generate QR codes
  allHouses.forEach((h, i) => {
    h.qr_code = `HOUSE-${Date.now()}-${Math.floor(Math.random()*1000)}-${i}`;
    h.aktif = true;
  });
  
  console.log(`Deleting old houses...`);
  await supabase.from('rumah').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  console.log(`Inserting ${allHouses.length} houses...`);
  
  // Chunking to avoid large inserts
  const chunkSize = 50;
  for (let i = 0; i < allHouses.length; i += chunkSize) {
    const chunk = allHouses.slice(i, i + chunkSize);
    const { error } = await supabase.from('rumah').insert(chunk);
    if (error) {
      console.error("Insert error:", error);
    } else {
      console.log(`Inserted chunk ${Math.floor(i/chunkSize) + 1}`);
    }
  }
  
  console.log("Done!");
}

run();

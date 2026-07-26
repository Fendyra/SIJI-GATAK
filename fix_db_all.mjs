import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data: kelompoks } = await supabase.from('kelompok').select('*');
  const rtToKelompok = {};
  for (const k of kelompoks) {
    if (!rtToKelompok[k.rt_id]) rtToKelompok[k.rt_id] = k.id;
    if (k.id === '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c') rtToKelompok[k.rt_id] = k.id; // harold
    if (k.id === '34239906-f458-47c8-a72a-d1d7fde0b436') rtToKelompok[k.rt_id] = k.id; // fendyra
    if (k.id === '2650c1f8-be3b-4da1-a2ac-4d18d6e87ca7') rtToKelompok[k.rt_id] = k.id; // arif
  }
  
  const { data: rumahs } = await supabase.from('rumah').select('id, rt_id');
  let count = 0;
  for (const r of rumahs) {
    const kid = rtToKelompok[r.rt_id];
    if (kid) {
      await supabase.from('rumah').update({ kelompok_id: kid }).eq('id', r.id);
      count++;
    }
  }
  console.log("Updated", count, "houses with correct kelompok_id");
}
run();

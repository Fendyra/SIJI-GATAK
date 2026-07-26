import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const fendyraKelompok = '34239906-f458-47c8-a72a-d1d7fde0b436';
  const { data, error } = await supabase.from('rumah').update({ kelompok_id: fendyraKelompok }).neq('id', '00000000-0000-0000-0000-000000000000');
  console.log("Update error:", error);
  console.log("Houses updated successfully for Fendyra.");
}
run();

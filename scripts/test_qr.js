const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const envObj = {};
env.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    envObj[key] = value.join('=').trim();
  }
});

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  envObj.NEXT_PUBLIC_SUPABASE_URL,
  envObj.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  const { data, error } = await supabase
    .from("rumah")
    .select("*")
    .like("qr_code", "%QR-1784810747811-33ZN%");
    
  console.log("Data:", data);
  console.log("Error:", error);
  
  const { count } = await supabase.from("rumah").select("*", { count: "exact", head: true });
  console.log("Total rumah count:", count);
}
test();

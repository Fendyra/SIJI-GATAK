import JimpitanAppWrapper from "@/components/jimpitan/JimpitanAppWrapper";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  return <JimpitanApp hasSession={!!session} />;
}

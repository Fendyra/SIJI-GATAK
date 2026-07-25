"use client";

import dynamic from "next/dynamic";

// Disable SSR untuk JimpitanApp karena bergantung pada API browser
const JimpitanApp = dynamic(() => import("@/components/jimpitan/JimpitanApp"), {
  ssr: false,
});

export default function JimpitanAppWrapper({ hasSession }) {
  return <JimpitanApp hasSession={hasSession} />;
}

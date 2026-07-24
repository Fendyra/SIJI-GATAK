"use client";

import dynamic from "next/dynamic";

// Disable SSR untuk JimpitanApp karena bergantung pada:
// - window.innerWidth (isMobile detection)
// - Date.toLocaleDateString dengan locale "id-ID"
// - Supabase session dari cookies
// Keduanya menyebabkan hydration mismatch jika di-render di server.
const JimpitanApp = dynamic(() => import("@/components/jimpitan/JimpitanApp"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f3ed",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "4px solid #e0e0e0",
            borderTop: "4px solid #1f7a4d",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "#1f7a4d", fontWeight: 600, fontSize: 14 }}>
          Memuat Jimpitan Online…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  ),
});

export default function Home() {
  return <JimpitanApp />;
}

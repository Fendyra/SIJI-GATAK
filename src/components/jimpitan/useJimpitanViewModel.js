"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toRupiah } from "@/lib/jimpitanData";
import { createClient } from "@/lib/supabase/client";

const ADMIN_NAV_DEFS = [
  { key: "admin-dashboard", label: "Dashboard" },
  { key: "admin-jadwal", label: "Jadwal Petugas" },
  { key: "admin-kelompok", label: "Data Kelompok" },
  { key: "admin-rumah", label: "Data Rumah" },
  { key: "admin-qr", label: "QR Code Rumah" },
  { key: "admin-petugas", label: "Akun Petugas" },
  { key: "admin-riwayat", label: "Riwayat Transaksi" },
  { key: "admin-rekap", label: "Rekapitulasi & Laporan" },
  { key: "admin-setting", label: "Pengaturan" },
];

function normalizeRumah(r) {
  return {
    id: r.id,
    nama: r.nama_penghuni,
    nama_penghuni: r.nama_penghuni,
    alamat: r.alamat || "",
    rt: r.rt?.nama || "",
    rt_id: r.rt_id || r.rt?.id || null,
    kelompok: r.kelompok?.nama || "",
    kelompok_id: r.kelompok_id || r.kelompok?.id || null,
    nominalDefault: r.nominal_default,
    nominal_default: r.nominal_default,
    qr_code: r.qr_code,
    aktif: r.aktif,
    status: r.status || "belum",
    lastNominal: r.lastNominal ?? null,
    lastTime: r.lastTime ?? null,
  };
}

function normalizeTx(t) {
  return {
    id: t.id,
    houseId: t.rumah_id || t.rumah?.id,
    nama: t.rumah?.nama_penghuni || t.nama || "",
    kelompok: t.sesi?.kelompok?.nama || t.kelompok || "",
    nominal: t.nominal,
    status: t.status,
    time: t.created_at
      ? new Date(t.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      : "",
  };
}

function ProfileModal({ currentUser, onClose, onSave }) {
  const [nama, setNama] = useState(currentUser?.nama || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan profil");

      onSave(data.data); // Return updated user data
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/40 p-5" onClick={onClose}>
      <div className="w-full max-w-[400px] animate-pop-in rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center gap-4 border-b border-[#e6e1d3] pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f5ee] text-xl font-bold text-[#1f7a4d]">
            {currentUser?.nama?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-display text-lg font-extrabold text-[#1c2420]">Profil Akun</h3>
            <div className="text-[12px] font-bold text-brand uppercase tracking-wider">{currentUser?.role === "admin" ? "Admin System" : `Petugas ${currentUser?.kelompok?.nama || ""}`}</div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-danger-bg p-3 text-[13px] font-bold text-danger text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-muted-2">Username</label>
            <input
              type="text"
              value={currentUser?.username || ""}
              disabled
              className="w-full rounded-xl border border-input-border bg-gray-100 px-3 py-2.5 text-[14px] font-semibold text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-[11px] text-muted-2">Username tidak dapat diubah</p>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-muted-2">Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full rounded-xl border border-input-border bg-white px-3 py-2.5 text-[14px] font-semibold focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-muted-2">Ganti Password (Opsional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kosongkan jika tidak ingin ganti"
              className="w-full rounded-xl border border-input-border bg-white px-3 py-2.5 text-[14px] font-semibold focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-gray-100 py-3 text-[14px] font-bold text-gray-600 active:scale-95 transition-transform disabled:opacity-70"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-brand py-3 text-[14px] font-bold text-white shadow-brand active:scale-95 transition-transform disabled:opacity-70"
            >
              {isLoading ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function useJimpitanViewModel(hasSession = true) {
  const [screen, setScreen] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(hasSession);

  const [currentUser, setCurrentUser] = useState(null);
  const [activeSesiId, setActiveSesiId] = useState(null);
  const [houses, setHouses] = useState([]);
  const [rawHouses, setRawHouses] = useState([]); // for riwayat
  const [rtList, setRtList] = useState([]);
  const [kelompokList, setKelompokList] = useState([]);
  const [petugasAccounts, setPetugasAccounts] = useState([]);
  const [nominalDefaultSetting, setNominalDefaultSetting] = useState(500);
  const [persentaseRt, setPersentaseRt] = useState(60);
  const [persentaseRonda, setPersentaseRonda] = useState(40);
  const [transactions, setTransactions] = useState([]);
  const [rekapData, setRekapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trendBarsData, setTrendBarsData] = useState([]);
  const [lastSavedTx, setLastSavedTx] = useState(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});

  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [nominalInput, setNominalInput] = useState(500);
  const [isScannerUsed, setIsScannerUsed] = useState(false);
  const [search, setSearch] = useState("");
  const [scanState, setScanState] = useState("idle");
  const [scanQrInput, setScanQrInput] = useState("");
  const [riwayatFilter, setRiwayatFilter] = useState("all");
  const [riwayatDate, setRiwayatDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [riwayatTransactions, setRiwayatTransactions] = useState([]);
  const [rumahSearch, setRumahSearch] = useState("");
  const [riwayatKelompokFilter, setRiwayatKelompokFilter] = useState("all");
  const [adminRiwayatFilter, setAdminRiwayatFilter] = useState("all");
  const [adminRiwayatMode, setAdminRiwayatMode] = useState("semua");
  const [adminRiwayatDate, setAdminRiwayatDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [adminRiwayatTransactions, setAdminRiwayatTransactions] = useState([]);
  
  const currentJsMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const currentJsYear = new Date().getFullYear().toString();
  const [adminDashboardMonth, setAdminDashboardMonth] = useState(currentJsMonth);
  const [adminDashboardYear, setAdminDashboardYear] = useState(currentJsYear);
  const [adminDashboardPemasukan, setAdminDashboardPemasukan] = useState(0);

  const [correctionTxId, setCorrectionTxId] = useState(null);
  const [correctionNominal, setCorrectionNominal] = useState(0);
  const [rekapPeriode, setRekapPeriode] = useState("harian");
  const [selectedRekapKelompok, setSelectedRekapKelompok] = useState(null);
  const [toast, setToast] = useState(null);

  const [riwayatDetailHouse, setRiwayatDetailHouse] = useState(null);
  const [riwayatDetailHistory, setRiwayatDetailHistory] = useState([]);
  
  const [petugasDetailAccount, setPetugasDetailAccount] = useState(null);
  const [petugasDetailHistory, setPetugasDetailHistory] = useState([]);

  const toastTimer = useRef(null);
  const scanTimer = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 860);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Fetch Riwayat for Petugas when date changes
  useEffect(() => {
    async function fetchRiwayatData() {
      if (!currentUser?.kelompok_id || rawHouses.length === 0) return;
      try {
        const txRes = await apiFetch(`/api/transaksi?kelompok_id=${currentUser.kelompok_id}&tanggal=${riwayatDate}&limit=500`);
        const txList = txRes.data || [];
        
        const txMap = {};
        txList.forEach((t) => { txMap[t.rumah_id || t.rumah?.id] = t; });
        
        const mergedHouses = rawHouses.map((h) => {
          const tx = txMap[h.id];
          return {
            ...h,
            status: tx ? tx.status : "belum",
            lastNominal: tx ? tx.nominal : 0,
            lastTime: tx ? new Date(tx.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "",
          };
        });
        
        setRiwayatTransactions(mergedHouses);
      } catch (err) {
        console.error("fetchRiwayatData error:", err);
      }
    }
    if (currentUser?.role === "petugas") {
      fetchRiwayatData();
    }
  }, [riwayatDate, currentUser, rawHouses]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (scanTimer.current) clearTimeout(scanTimer.current);
    };
  }, []);

  function showToast(msg) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      ...options,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Terjadi kesalahan.");
    return json;
  }

  // Fetch Riwayat Harian for Admin
  useEffect(() => {
    async function fetchAdminRiwayatHarian() {
      if (adminRiwayatMode !== "harian" || riwayatKelompokFilter === "all" || !riwayatKelompokFilter) return;
      try {
        const sesiRes = await apiFetch(`/api/sesi?kelompok_id=${riwayatKelompokFilter}&tanggal=${adminRiwayatDate}`);
        let txList = [];
        if (sesiRes.data?.id) {
          const txRes = await apiFetch(`/api/transaksi?sesi_id=${sesiRes.data.id}`);
          txList = txRes.data || [];
        }
        
        const txMap = {};
        txList.forEach((t) => { txMap[t.rumah_id || t.rumah?.id] = t; });
        
        const mergedHouses = houses.map((h) => {
          const tx = txMap[h.id];
          return {
            ...h,
            status: tx ? tx.status : "belum",
            lastNominal: tx ? tx.nominal : 0,
            lastTime: tx ? new Date(tx.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "",
          };
        });
        
        setAdminRiwayatTransactions(mergedHouses);
      } catch (err) {
        console.error("fetchAdminRiwayatHarian error:", err);
      }
    }
    if (currentUser?.role === "admin") {
      fetchAdminRiwayatHarian();
    }
  }, [adminRiwayatMode, adminRiwayatDate, riwayatKelompokFilter, currentUser, houses, kelompokList]);

  const fetchTrend = useCallback(async () => {
    try {
      const days = [];
      const dayLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push({ dateStr: d.toISOString().split("T")[0], label: dayLabels[d.getDay()] });
      }
      const isPetugas = currentUser?.role !== "admin" && currentUser?.kelompok_id;
      const results = await Promise.allSettled(
        days.map((d) => {
          let url = `/api/rekap?periode=harian&tanggal=${d.dateStr}`;
          if (isPetugas) url += `&kelompok_id=${currentUser.kelompok_id}`;
          return apiFetch(url);
        })
      );
      const bars = results.map((r, i) => ({
        label: days[i].label,
        total: r.status === "fulfilled" ? (r.value.data?.totalTerkumpul || 0) : 0,
      }));
      const maxTotal = Math.max(...bars.map((b) => b.total), 1);
      setTrendBarsData(bars.map((b) => ({
        label: b.label,
        heightPct: Math.max(Math.round((b.total / maxTotal) * 100), 4),
        total: b.total,
      })));
    } catch {
      setTrendBarsData([65, 80, 45, 90, 70, 55, 100].map((v, i) => ({
        heightPct: v,
        label: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i],
        total: 0,
      })));
    }
  }, [currentUser]);

  const fetchAllData = useCallback(async (user, silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [rtRes, kelompokRes, settingRes] = await Promise.all([
        apiFetch("/api/rt"),
        apiFetch("/api/kelompok"),
        apiFetch("/api/pengaturan"),
      ]);
      setRtList(rtRes.data || []);
      setKelompokList(kelompokRes.data || []);
      if (settingRes.data) {
        setNominalDefaultSetting(settingRes.data.nominal_default_global);
        setPersentaseRt(settingRes.data.persentase_kas_rt);
        setPersentaseRonda(settingRes.data.persentase_kas_ronda);
      }
      if (user.role === "admin") {
        const [rumahRes, petugasRes, txRes] = await Promise.all([
          apiFetch("/api/rumah"),
          apiFetch("/api/petugas"),
          apiFetch("/api/transaksi?limit=200"),
        ]);
        setHouses((rumahRes.data || []).map(normalizeRumah));
        setPetugasAccounts(petugasRes.data || []);
        setTransactions((txRes.data || []).map(normalizeTx));
        fetchTrend();
      } else {
        if (!user.kelompok_id) return;
        const tanggalLokal = new Date().toLocaleDateString("en-CA");
        
        // Parallelize API fetches to reduce loading time
        const [rumahRes, sesiRes, txRes] = await Promise.all([
          apiFetch(`/api/rumah`),
          apiFetch("/api/sesi", {
            method: "POST",
            body: JSON.stringify({ kelompok_id: user.kelompok_id, petugas_id: user.id, tanggal: tanggalLokal }),
          }),
          apiFetch(`/api/transaksi?tanggal=${tanggalLokal}&kelompok_id=${user.kelompok_id}&limit=1000`)
        ]);

        const rawHousesData = (rumahRes.data || []).map(normalizeRumah);
        setRawHouses(rawHousesData);
        
        const sesiId = sesiRes.data?.id;
        setActiveSesiId(sesiId);
        
        const txList = txRes.data || [];
        setTransactions(txList.map(normalizeTx));
          const txMap = {};
          txList.forEach((t) => { txMap[t.rumah_id || t.rumah?.id] = t; });
          setHouses(rawHousesData.map((h) => {
            const tx = txMap[h.id];
            if (!tx) return h;
            return {
              ...h,
              status: tx.status,
              lastNominal: tx.nominal,
              lastTime: new Date(tx.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            };
          }));
          fetchTrend();
      }
    } catch (err) {
      console.error("fetchAllData error:", err);
      showToast("Gagal memuat data: " + err.message);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [fetchTrend]);

  const fetchRekap = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch(`/api/rekap?periode=${rekapPeriode}`);
      setRekapData(res.data);
    } catch (err) {
      showToast("Gagal memuat rekap: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [rekapPeriode]);

  useEffect(() => {
    if (screen === "admin-rekap") fetchRekap();
  }, [screen, fetchRekap]);

  const fetchAdminDashboardPemasukan = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/rekap?periode=bulanan&bulan=${adminDashboardYear}-${adminDashboardMonth}`);
      setAdminDashboardPemasukan(res.data?.totalTerkumpul || 0);
    } catch (err) {
      setAdminDashboardPemasukan(0);
    }
  }, [adminDashboardMonth, adminDashboardYear]);

  useEffect(() => {
    if (screen === "admin-dashboard" && currentUser?.role === "admin") {
      fetchAdminDashboardPemasukan();
    }
  }, [screen, currentUser, fetchAdminDashboardPemasukan]);

  // Supabase Realtime Sync for Petugas
  useEffect(() => {
    if (!currentUser || currentUser.role === "admin") return;
    
    const supabase = createClient();
    const channel = supabase
      .channel('realtime:transaksi')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transaksi' },
        (payload) => {
          // Hanya refresh jika transaksi terkait dengan kelompok yang sama
          // (Karena payload hanya berisi kolom transaksi, kita bisa refresh diam-diam)
          console.log("Realtime event received:", payload);
          fetchAllData(currentUser, true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, fetchAllData]);

  // Check existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await apiFetch("/api/auth/me");
        if (res.user) {
          setCurrentUser(res.user);
          await fetchAllData(res.user);
          
          const searchParams = new URLSearchParams(window.location.search);
          const redirectUrl = searchParams.get("redirect");
          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
          
          setScreen(res.user.role === "admin" ? "admin-dashboard" : "dashboard");
        }
      } catch (err) {
        // Not logged in, stay on login screen
      } finally {
        setIsCheckingSession(false);
      }
    }
    // Only check if we are currently unauthenticated
    if (!currentUser && screen === "login") {
      checkSession();
    } else {
      setIsCheckingSession(false);
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) { setLoginError("Username dan password harus diisi."); return; }
    setLoginError("");
    setIsLoading(true);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const user = res.user;
      setCurrentUser(user);
      await fetchAllData(user);
      
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get("redirect");
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
      
      setScreen(user.role === "admin" ? "admin-dashboard" : "dashboard");
    } catch (err) {
      setLoginError(err.message || "Login gagal. Periksa username dan password.");
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try { await apiFetch("/api/auth/login", { method: "DELETE" }); } catch (_) {}
    setScreen("login"); setCurrentUser(null); setActiveSesiId(null);
    setHouses([]); setTransactions([]); setPassword(""); setUsername("");
    setSearch(""); setRumahSearch(""); setScanState("idle");
    setRekapData(null); setModalType(null); setModalData({});
  }

  function goTo(next) { setScreen(next); setSearch(""); }
  function goToAdmin(next) { setScreen(next); setRumahSearch(""); }
  function openScan() { window.location.href = "/scan"; }

  function openModal(type, data = {}) { setModalType(type); setModalData(data); }
  function closeModal() { setModalType(null); setModalData({}); }

  // ── CRUD RT ───────────────────────────────────────────────────────────────
  async function saveRt() {
    const { id, nama, ketua } = modalData;
    if (!nama?.trim()) { showToast("Nama RT harus diisi."); return; }
    setIsLoading(true);
    try {
      if (id) {
        const res = await apiFetch("/api/rt", { method: "PATCH", body: JSON.stringify({ id, nama: nama.trim(), ketua: ketua || "" }) });
        setRtList(rtList.map((r) => r.id === id ? res.data : r));
        showToast("Data RT berhasil diperbarui.");
      } else {
        const res = await apiFetch("/api/rt", { method: "POST", body: JSON.stringify({ nama: nama.trim(), ketua: ketua || "" }) });
        setRtList([...rtList, res.data]);
        showToast("RT berhasil ditambahkan.");
      }
      closeModal();
    } catch (err) { showToast("Gagal: " + err.message); }
    finally { setIsLoading(false); }
  }

  async function deleteRt(id) {
    setIsLoading(true);
    try {
      await apiFetch(`/api/rt?id=${id}`, { method: "DELETE" });
      setRtList(rtList.filter((r) => r.id !== id));
      showToast("RT berhasil dihapus."); closeModal();
    } catch (err) { showToast("Gagal hapus: " + err.message); }
    finally { setIsLoading(false); }
  }

  // ── CRUD Kelompok ─────────────────────────────────────────────────────────
  async function saveKelompok() {
    const { id, nama, jadwal } = modalData;
    if (!nama?.trim()) { showToast("Nama harus diisi."); return; }
    setIsLoading(true);
    try {
      if (id) {
        const res = await apiFetch("/api/kelompok", { method: "PATCH", body: JSON.stringify({ id, nama: nama.trim(), jadwal: jadwal || "" }) });
        setKelompokList(kelompokList.map((k) => k.id === id ? res.data : k));
        showToast("Kelompok berhasil diperbarui.");
      } else {
        const res = await apiFetch("/api/kelompok", { method: "POST", body: JSON.stringify({ nama: nama.trim(), jadwal: jadwal || "" }) });
        setKelompokList([...kelompokList, res.data]);
        showToast("Kelompok berhasil ditambahkan.");
      }
      closeModal();
    } catch (err) { showToast("Gagal: " + err.message); }
    finally { setIsLoading(false); }
  }

  async function deleteKelompok(id) {
    setIsLoading(true);
    try {
      await apiFetch(`/api/kelompok?id=${id}`, { method: "DELETE" });
      setKelompokList(kelompokList.filter((k) => k.id !== id));
      showToast("Kelompok berhasil dihapus."); closeModal();
    } catch (err) { showToast("Gagal hapus: " + err.message); }
    finally { setIsLoading(false); }
  }

  // ── CRUD Rumah ────────────────────────────────────────────────────────────
  async function saveRumah() {
    const { id, nama_penghuni, alamat, rt_id, nominal_default } = modalData;
    if (!nama_penghuni?.trim() || !rt_id) { showToast("Nama penghuni dan RT harus diisi."); return; }
    setIsLoading(true);
    try {
      if (id) {
        const res = await apiFetch("/api/rumah", { method: "PATCH", body: JSON.stringify({ id, nama_penghuni: nama_penghuni.trim(), alamat: alamat || "", rt_id, nominal_default: Number(nominal_default) || 500 }) });
        setHouses(houses.map((h) => h.id === id ? normalizeRumah(res.data) : h));
        showToast("Data rumah berhasil diperbarui.");
      } else {
        const res = await apiFetch("/api/rumah", { method: "POST", body: JSON.stringify({ nama_penghuni: nama_penghuni.trim(), alamat: alamat || "", rt_id, nominal_default: Number(nominal_default) || 500 }) });
        setHouses([...houses, normalizeRumah(res.data)]);
        showToast("Rumah berhasil ditambahkan.");
      }
      closeModal();
    } catch (err) { showToast("Gagal: " + err.message); }
    finally { setIsLoading(false); }
  }

  async function deleteRumah(id) {
    setIsLoading(true);
    try {
      await apiFetch(`/api/rumah?id=${id}`, { method: "DELETE" });
      setHouses(houses.filter((h) => h.id !== id));
      showToast("Rumah berhasil dinonaktifkan."); closeModal();
    } catch (err) { showToast("Gagal hapus: " + err.message); }
    finally { setIsLoading(false); }
  }

  // ── CRUD Petugas ──────────────────────────────────────────────────────────
  async function savePetugas() {
    const { id, nama, username, password: pwd, kelompok_id, role: pRole } = modalData;
    if (id) {
      if (!nama?.trim()) { showToast("Nama harus diisi."); return; }
      setIsLoading(true);
      try {
        const res = await apiFetch("/api/petugas", { method: "PATCH", body: JSON.stringify({ id, nama: nama.trim(), kelompok_id }) });
        setPetugasAccounts(petugasAccounts.map((p) => p.id === id ? { ...p, ...res.data } : p));
        showToast("Akun petugas berhasil diperbarui."); closeModal();
      } catch (err) { showToast("Gagal: " + err.message); }
      finally { setIsLoading(false); }
    } else {
      if (!nama?.trim() || !username?.trim() || !pwd?.trim()) { showToast("Nama, username, dan password harus diisi."); return; }
      if (!kelompok_id && pRole !== "admin") { showToast("Kelompok harus dipilih untuk petugas."); return; }
      setIsLoading(true);
      try {
        const res = await apiFetch("/api/petugas", {
          method: "POST",
          body: JSON.stringify({ nama: nama.trim(), username: username.trim(), password: pwd, kelompok_id: kelompok_id || null, role: pRole || "petugas" }),
        });
        setPetugasAccounts([...petugasAccounts, res.data]);
        showToast("Akun berhasil dibuat."); closeModal();
      } catch (err) { showToast("Gagal: " + err.message); }
      finally { setIsLoading(false); }
    }
  }

  async function toggleAccountStatus(id) {
    const p = petugasAccounts.find((acc) => acc.id === id);
    if (!p) return;
    try {
      const res = await apiFetch("/api/petugas", { method: "PATCH", body: JSON.stringify({ id, aktif: !p.aktif }) });
      setPetugasAccounts(petugasAccounts.map((acc) => acc.id === id ? { ...acc, aktif: res.data.aktif } : acc));
      showToast(`Akun ${res.data.aktif ? "diaktifkan" : "dinonaktifkan"}.`);
    } catch (err) { showToast("Gagal update status: " + err.message); }
  }

  async function deletePetugas() {
    if (!modalData.id) return;
    setIsLoading(true);
    try {
      await apiFetch(`/api/petugas?id=${modalData.id}`, { method: "DELETE" });
      setPetugasAccounts(petugasAccounts.filter((p) => p.id !== modalData.id));
      showToast("Petugas berhasil dihapus.");
      closeModal();
    } catch (err) {
      showToast("Gagal menghapus petugas: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function resolveQr(qrCode) {
    let qr = (qrCode || "").trim();
    // Jika qr berupa URL lengkap (misal: https://sijigatak.vercel.app/scan/CODE123), ekstrak kode terakhirnya
    if (qr.includes("/scan/")) {
      qr = qr.split("/scan/").pop();
    }
    qr = qr.toUpperCase();
    return houses.find((h) => h.qr_code?.toUpperCase() === qr) || null;
  }

  function onQrScanned(qrCode) {
    if (!qrCode) return;
    setIsScannerUsed(true);
    setScanState("scanning");
    scanTimer.current = setTimeout(() => {
      const house = resolveQr(qrCode);
      if (!house) { setScanState("not_found"); showToast("QR Code tidak dikenali."); return; }
      if (house.status !== "belum") { setSelectedHouseId(house.id); setScreen("detail"); setScanState("idle"); return; }
      
      const defaultNominal = house.nominal_default || 500;
      setSelectedHouseId(house.id); 
      setNominalInput(defaultNominal);
      setScreen("detail");
      setScanState("idle");
    }, 600);
  }

  async function autoSaveTransaction(house, nominal, status) {
    if (!currentUser) return;
    if (!activeSesiId) { showToast("Sesi ronda belum aktif. Coba logout dan login ulang."); return; }
    setIsLoading(true);
    try {
      const res = await apiFetch("/api/transaksi", {
        method: "POST",
        body: JSON.stringify({ sesi_id: activeSesiId, rumah_id: house.id, petugas_id: currentUser.id, nominal, status }),
      });
      const newTx = normalizeTx(res.data);
      const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      setHouses((prev) => prev.map((h) => h.id === house.id ? { ...h, status, lastNominal: nominal, lastTime: time } : h));
      if (rawHouses.length > 0) {
        setRiwayatTransactions((prev) => prev.map((h) => h.id === house.id ? { ...h, status, lastNominal: nominal, lastTime: time } : h));
      }
      setTransactions((prev) => [newTx, ...prev]);
      setScreen("dashboard");
      showToast("Scan berhasil! Transaksi tersimpan.");
    } catch (err) { showToast("Gagal menyimpan transaksi: " + err.message); }
    finally { setIsLoading(false); }
  }

  function simulateScan() {
    const pending = houses.filter((h) => h.status === "belum");
    if (pending.length === 0) { setScanState("empty"); return; }
    onQrScanned(pending[0].qr_code);
  }

  function selectHouseManual(id) {
    setIsScannerUsed(false);
    const house = houses.find((h) => h.id === id);
    if (!house) return;
    if (house.status !== "belum") return; // Hanya yang belum bisa di klik
    setScreen("detail"); setSelectedHouseId(id); setNominalInput(house.nominal_default || 500);
  }

  function editTransactionForHouse(houseId) {
    const tx = transactions.find((t) => t.houseId === houseId);
    if (tx) openCorrection(tx);
  }

  async function saveTransaction(status) {
    const house = houses.find((h) => h.id === selectedHouseId);
    if (!house || !currentUser) return;
    if (!activeSesiId) { showToast("Sesi ronda belum aktif. Coba logout dan login ulang."); return; }
    const nominal = status === "sudah" ? Number(nominalInput) || 0 : 0;
    setIsLoading(true);
    try {
      const res = await apiFetch("/api/transaksi", {
        method: "POST",
        body: JSON.stringify({ sesi_id: activeSesiId, rumah_id: house.id, petugas_id: currentUser.id, nominal, status }),
      });
      const newTx = normalizeTx(res.data);
      const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      setHouses((prev) => prev.map((h) => h.id === house.id ? { ...h, status, lastNominal: nominal, lastTime: time } : h));
      if (rawHouses.length > 0) {
        setRiwayatTransactions((prev) => prev.map((h) => h.id === house.id ? { ...h, status, lastNominal: nominal, lastTime: time } : h));
      }
      setTransactions((prev) => [newTx, ...prev]);
      
      const now = new Date();
      const dateFormatted = now.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
      const timeFormatted = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      
      setLastSavedTx({
        id: newTx.id,
        nama_penghuni: house.nama_penghuni,
        alamat: house.alamat,
        kelompok: currentUser.kelompok_nama || "Kelompok",
        rt_rw: `RT ${currentUser.rt} / RW ${currentUser.rw}`,
        nominal: nominal,
        status: status,
        metode: isScannerUsed ? "Scan QR Code" : "Input Manual",
        petugas: currentUser.nama || currentUser.username || "Petugas",
        waktu: `${dateFormatted} · ${timeFormatted}`
      });
      setScreen("success");
      
    } catch (err) { showToast("Gagal menyimpan transaksi: " + err.message); }
    finally { setIsLoading(false); }
  }
  async function fetchRiwayatDetailHistory(houseId) {
    try {
      const res = await apiFetch(`/api/transaksi?rumah_id=${houseId}&limit=14`);
      setRiwayatDetailHistory(res.data ? res.data.map(normalizeTx) : []);
    } catch (err) {
      showToast("Gagal memuat histori pembayaran: " + err.message);
    }
  }

  function openRiwayatDetail(t) {
    setRiwayatDetailHouse(t);
    setRiwayatDetailHistory([]);
    setScreen("riwayat-detail");
    fetchRiwayatDetailHistory(t.houseId || t.id);
  }

  async function fetchPetugasDetailHistory(petugasId) {
    try {
      const res = await apiFetch(`/api/transaksi?petugas_id=${petugasId}&limit=50`);
      setPetugasDetailHistory(res.data ? res.data.map(normalizeTx) : []);
    } catch (err) {
      showToast("Gagal memuat histori petugas: " + err.message);
    }
  }

  function openPetugasDetail(petugas) {
    setPetugasDetailAccount(petugas);
    setPetugasDetailHistory([]);
    setScreen("admin-petugas-detail");
    fetchPetugasDetailHistory(petugas.id);
  }

  function openCorrection(t) {
    let txId = null;
    let nominal = 0;
    
    if (t.houseId !== undefined || t.rumah_id !== undefined) {
      txId = t.id;
      nominal = t.nominal;
    } else {
      // 1. If we are in RiwayatDetailScreen, just take the first transaction in history!
      let tx = riwayatDetailHistory.length > 0 ? riwayatDetailHistory[0] : null;
      
      // 2. Fallback to global transactions array (used in admin view)
      if (!tx) tx = transactions.find((tx) => (tx.houseId === t.id || tx.rumah_id === t.id));
      
      if (tx) {
        txId = tx.id;
        nominal = tx.nominal;
      }
    }
    
    if (txId) {
      setCorrectionTxId(txId);
      setCorrectionNominal(nominal);
    } else {
      alert("Data transaksi belum tersedia untuk dikoreksi.");
      showToast("Data transaksi tidak ditemukan.");
    }
  }
  
  const [invoiceTx, setInvoiceTx] = useState(null);
  function openInvoice(tx) {
    if (!tx) return;
    if (tx.status === 'sudah') {
      setInvoiceTx(tx);
    } else {
      openCorrection(tx);
    }
  }
  function closeInvoice() { setInvoiceTx(null); }
  function openCorrectionFromInvoice() {
    if (invoiceTx) {
      openCorrection(invoiceTx);
      closeInvoice();
    }
  }
  function closeCorrection() { setCorrectionTxId(null); }

  async function saveCorrection() {
    if (!correctionTxId) return;
    setIsLoading(true);
    try {
      const res = await apiFetch("/api/transaksi", {
        method: "PATCH",
        body: JSON.stringify({ id: correctionTxId, nominal: Number(correctionNominal) || 0, status: "sudah" }),
      });
      const updateFn = (prev) => prev.map((t) => t.id === correctionTxId ? { ...t, nominal: res.data.nominal, status: res.data.status } : t);
      setTransactions(updateFn);
      setRiwayatDetailHistory(updateFn);
      setPetugasDetailHistory(updateFn);
      setCorrectionTxId(null);
      showToast("Transaksi berhasil dikoreksi.");
    } catch (err) { showToast("Gagal koreksi: " + err.message); }
    finally { setIsLoading(false); }
  }

  async function deleteTransaction() {
    if (!correctionTxId) return;
    setIsLoading(true);
    try {
      await apiFetch(`/api/transaksi?id=${correctionTxId}`, { method: "DELETE" });
      
      let houseId = transactions.find(t => t.id === correctionTxId)?.rumah_id;
      if (!houseId) houseId = riwayatDetailHistory.find(t => t.id === correctionTxId)?.rumah_id;
      if (!houseId) houseId = petugasDetailHistory.find(t => t.id === correctionTxId)?.rumah_id;
      
      const filterFn = (prev) => prev.filter(t => t.id !== correctionTxId);
      setTransactions(filterFn);
      setRiwayatDetailHistory(filterFn);
      setPetugasDetailHistory(filterFn);
      
      if (houseId) {
        setHouses((prev) => prev.map((h) => h.id === houseId ? { ...h, status: "belum", lastNominal: 0, lastTime: "" } : h));
      }
      
      // Update rawHouses as well for riwayat
      if (rawHouses.length > 0 && houseId) {
        setRiwayatTransactions((prev) => prev.map((h) => 
          h.id === houseId ? { ...h, status: "belum", lastNominal: 0, lastTime: "" } : h
        ));
      }
      
      closeCorrection();
      showToast("Transaksi berhasil dihapus.");
    } catch (err) {
      showToast("Gagal menghapus: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveSetting() {
    if (persentaseRt + persentaseRonda !== 100) { showToast("Total persentase RT + Ronda harus 100%."); return; }
    setIsLoading(true);
    try {
      await apiFetch("/api/pengaturan", {
        method: "PUT",
        body: JSON.stringify({ nominal_default_global: Number(nominalDefaultSetting), persentase_kas_rt: Number(persentaseRt), persentase_kas_ronda: Number(persentaseRonda) }),
      });
      showToast("Pengaturan berhasil disimpan.");
    } catch (err) { showToast("Gagal simpan: " + err.message); }
    finally { setIsLoading(false); }
  }

  // ── DERIVED VIEW MODEL ────────────────────────────────────────────────────
  const total = houses.length;
  const doneHouses = houses.filter((h) => h.status !== "belum").length;
  const kosongCount = houses.filter((h) => h.status === "kosong").length;
  const pendingCount = houses.filter((h) => h.status === "belum").length;
  const progressPct = total > 0 ? Math.round((doneHouses / total) * 100) : 0;
  const totalTerkumpul = transactions.filter((t) => t.status === "sudah").reduce((sum, t) => sum + t.nominal, 0);

  const petugasActiveKey = screen === "detail" ? "scan" : screen; // maps detail screen to scan menu
  const petugasNavItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "scan", label: "Pengambilan" },
    { key: "riwayat", label: "Riwayat Transaksi" },
  ].map((item) => {
    const active = petugasActiveKey === item.key;
    return { ...item, active, bg: active ? "#eaf3ec" : "transparent", color: active ? "#1f7a4d" : "#4a544d", mobileColor: active ? "#1f7a4d" : "#8a8578", accentShadow: active ? "inset 3px 0 0 #1f7a4d" : "none", onClick: () => goTo(item.key) };
  });

  const adminNavItems = ADMIN_NAV_DEFS.map((item) => {
    const active = screen === item.key;
    return { ...item, bg: active ? "#eaf3ec" : "transparent", color: active ? "#1f7a4d" : "#4a544d", accentShadow: active ? "inset 3px 0 0 #1f7a4d" : "none", onClick: () => goToAdmin(item.key) };
  });

  const housesView = houses.map((h) => {
    const label = h.status === "sudah" ? "Sudah" : h.status === "kosong" ? "Kosong" : "Belum";
    const bg = h.status === "sudah" ? "#e8f3ec" : h.status === "kosong" ? "#fbeee0" : "#f1efe7";
    const color = h.status === "sudah" ? "#1f7a4d" : h.status === "kosong" ? "#b5691f" : "#8a8578";
    return { ...h, statusLabel: label, statusBg: bg, statusColor: color, rowOpacity: h.status === "belum" ? 1 : 0.85, cursor: h.status === "belum" ? "pointer" : "default", onClick: () => selectHouseManual(h.id) };
  });

  const q = search.trim().toLowerCase();
  const filteredHouses = q ? housesView.filter((h) => h.nama.toLowerCase().includes(q) || h.alamat.toLowerCase().includes(q)) : housesView;

  const rq = rumahSearch.trim().toLowerCase();
  const rumahAdminRows = housesView.filter((h) => !rq || h.nama.toLowerCase().includes(rq) || h.alamat.toLowerCase().includes(rq) || h.rt.toLowerCase().includes(rq) || h.kelompok.toLowerCase().includes(rq));

  const selectedHouseRaw = houses.find((h) => h.id === selectedHouseId) || null;
  const isEditableSelected = !!selectedHouseRaw && selectedHouseRaw.status === "belum";
  const selectedHouse = selectedHouseRaw
    ? { ...selectedHouseRaw, statusLabel: selectedHouseRaw.status === "sudah" ? "Sudah" : selectedHouseRaw.status === "kosong" ? "Kosong" : "Belum", statusBg: selectedHouseRaw.status === "sudah" ? "#e8f3ec" : selectedHouseRaw.status === "kosong" ? "#fbeee0" : "#f1efe7", statusColor: selectedHouseRaw.status === "sudah" ? "#1f7a4d" : selectedHouseRaw.status === "kosong" ? "#b5691f" : "#8a8578", nominalDisplay: toRupiah(selectedHouseRaw.lastNominal) }
    : {};

  const riwayatFilters = [
    { key: "all", label: "Semua" }, { key: "sudah", label: "Sudah" }, { key: "kosong", label: "Kosong" }, { key: "belum", label: "Belum" }
  ].map((f) => ({ ...f, bg: riwayatFilter === f.key ? "#1f7a4d" : "#ffffff", color: riwayatFilter === f.key ? "#ffffff" : "#4a544d", onClick: () => setRiwayatFilter(f.key) }));

  const riwayatSource = riwayatFilter === "all" ? riwayatTransactions : riwayatTransactions.filter((t) => t.status === riwayatFilter);
  const riwayatFiltered = riwayatSource.map((t) => ({ ...t, displayValue: t.status === "sudah" ? toRupiah(t.lastNominal) : t.status === "kosong" ? "Kosong" : "Belum", statusBg: t.status === "sudah" ? "#e8f3ec" : t.status === "kosong" ? "#fbeee0" : "#f1efe7", statusColor: t.status === "sudah" ? "#1f7a4d" : t.status === "kosong" ? "#b5691f" : "#8a8578" }));

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const totalPemasukanBulanIni = transactions.filter((t) => t.status === "sudah").reduce((sum, t) => sum + t.nominal, 0);
  const sudahCount = houses.filter((h) => h.status === "sudah").length;

  const transaksiBulanIniCount = transactions.filter((t) => t.status === "sudah").length;

  const validTrendTotals = trendBarsData.map(b => b.total).filter(t => t > 0);
  const rataRataHarian = validTrendTotals.length ? validTrendTotals.reduce((a,b)=>a+b,0) / validTrendTotals.length : 0;
  const pemasukanTertinggi = validTrendTotals.length ? Math.max(...validTrendTotals) : 0;
  const pemasukanTerendah = validTrendTotals.length ? Math.min(...validTrendTotals) : 0;
  const trenSummary = { rataRataHarian, pemasukanTertinggi, pemasukanTerendah };

  const distribusiRt = rtList.map(r => {
    const rtHouses = houses.filter(h => h.rt === r.nama);
    const rtTotal = transactions.filter(t => rtHouses.some(h => h.id === t.houseId) && t.status === "sudah").reduce((sum, t) => sum + t.nominal, 0);
    return { nama: r.nama, total: rtTotal };
  }).filter(r => r.total > 0).sort((a,b) => b.total - a.total);
  const totalDistribusi = distribusiRt.reduce((sum, r) => sum + r.total, 0);
  const distribusiRtWithPct = distribusiRt.map(r => ({
    ...r,
    pct: totalDistribusi > 0 ? Math.round((r.total / totalDistribusi) * 100) : 0
  }));

  const transaksiTerbaru = [...transactions]
    .filter(t => t.status === "sudah")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map(t => {
      const h = houses.find(h => h.id === t.houseId || h.id === t.rumah_id);
      return {
        id: t.id,
        nama: t.nama || h?.nama_penghuni || "Warga",
        alamat: h?.alamat || "",
        rt: h?.rt || "",
        nominal: t.nominal,
        time: new Date(t.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        date: new Date(t.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      };
    });

  const rtProgress = rtList.map((rt) => {
    const rtHouses = houses.filter((h) => h.rt === rt.nama);
    const done = rtHouses.filter((h) => h.status !== "belum").length;
    return { nama: rt.nama, doneCount: done, totalCount: rtHouses.length, pct: rtHouses.length ? Math.round((done / rtHouses.length) * 100) : 0 };
  });

  const petugasRows = petugasAccounts.map((p) => ({
    ...p,
    kelompok: p.kelompok?.nama || "-",
    kelompok_id: p.kelompok?.id || null,
    statusLabel: p.aktif ? "Aktif" : "Nonaktif",
    statusBg: p.aktif ? "#e8f3ec" : "#f1efe7",
    statusColor: p.aktif ? "#1f7a4d" : "#8a8578",
    toggleLabel: p.aktif ? "Nonaktifkan" : "Aktifkan",
    onToggle: () => toggleAccountStatus(p.id),
    onEdit: () => openModal("ubah-petugas", { id: p.id, nama: p.nama, kelompok_id: p.kelompok?.id || null }),
    onDelete: () => openModal("hapus-petugas", p),
  }));

  const kelompokFilterOptions = [
    { value: "all", label: "Semua Kelompok" },
    ...kelompokList.map((k) => ({ value: k.id, label: k.nama })),
  ];

  let adminRiwayatSource = transactions;
  if (adminRiwayatMode === "harian" && riwayatKelompokFilter !== "all") {
    adminRiwayatSource = adminRiwayatTransactions;
  } else if (riwayatKelompokFilter !== "all") {
    adminRiwayatSource = transactions.filter((t) => t.kelompok === kelompokList.find(k => k.id === riwayatKelompokFilter)?.nama);
  }
  
  if (adminRiwayatFilter !== "all") {
    adminRiwayatSource = adminRiwayatSource.filter((t) => t.status === adminRiwayatFilter);
  }
  
  const adminRiwayatFiltered = adminRiwayatSource.map((t) => ({ 
    ...t, 
    displayValue: t.status === "sudah" ? toRupiah(t.nominal || t.lastNominal) : t.status === "kosong" ? "Kosong" : "Belum", 
    statusBg: t.status === "sudah" ? "#e8f3ec" : t.status === "kosong" ? "#fbeee0" : "#f1efe7", 
    statusColor: t.status === "sudah" ? "#1f7a4d" : t.status === "kosong" ? "#b5691f" : "#8a8578",
    onClick: () => adminRiwayatMode === "harian" ? openRiwayatDetail(t) : openCorrection(t)
  }));

  const rekapTotal = rekapData?.totalTerkumpul ?? totalTerkumpul;
  const rekapSudahCount = rekapData?.jumlahSudah ?? houses.filter((h) => h.status === "sudah").length;
  const rekapBelumCount = rekapData?.jumlahKosong ?? houses.filter((h) => h.status !== "sudah").length;
  const rekapKasRt = rekapData?.kasRt ?? Math.round((rekapTotal * persentaseRt) / 100);
  const rekapKasRonda = rekapData?.kasRonda ?? Math.round((rekapTotal * persentaseRonda) / 100);
  const rekapPersentase = rekapData?.persentase ?? { rt: persentaseRt, ronda: persentaseRonda };
  const rekapPerRt = (rekapData?.perRt ?? rtList.map((r) => {
    const rtHouses = houses.filter((h) => h.rt === r.nama);
    const rtTotal = transactions.filter((t) => rtHouses.some((h) => h.id === t.houseId) && t.status === "sudah").reduce((sum, t) => sum + t.nominal, 0);
    return { nama: r.nama, total: rtTotal };
  }));
  const rekapPerKelompok = (rekapData?.perKelompok ?? kelompokList.map((k) => {
    const kTotal = transactions.filter((t) => t.kelompok === k.nama && t.status === "sudah").reduce((sum, t) => sum + t.nominal, 0);
    return { nama: k.nama, total: kTotal };
  }));

  const rtRows = rtList.map((r) => ({
    ...r,
    jumlahRumah: houses.filter((h) => h.rt === r.nama).length,
    onEdit: () => openModal("ubah-rt", { id: r.id, nama: r.nama, ketua: r.ketua || "" }),
    onDelete: () => openModal("hapus-rt", { id: r.id, nama: r.nama }),
  }));

  const kelompokRows = kelompokList.map((k) => ({
    ...k,
    onEdit: () => openModal("ubah-kelompok", { id: k.id, nama: k.nama, rt_id: k.rt?.id || "", jadwal: k.jadwal || "" }),
    onDelete: () => openModal("hapus-kelompok", { id: k.id, nama: k.nama }),
  }));

  const rumahAdminRowsWithActions = rumahAdminRows.map((h) => ({
    ...h,
    onEdit: () => openModal("ubah-rumah", { id: h.id, nama_penghuni: h.nama_penghuni, alamat: h.alamat, rt_id: h.rt_id, kelompok_id: h.kelompok_id, nominal_default: h.nominal_default }),
    onDelete: () => openModal("hapus-rumah", { id: h.id, nama: h.nama }),
  }));

  const vm = {
    isMobile, isDesktop: !isMobile, isLoading, contentPadding: isMobile ? "16px 16px 96px 16px" : "32px 40px", logout,
    isDashboard: screen === "dashboard", isList: screen === "list", isScan: screen === "scan", isDetail: screen === "detail", isPetugasRiwayat: screen === "riwayat", isSuccess: screen === "success", isRiwayatDetail: screen === "riwayat-detail",
    petugasNavItems, currentUser,
    petugasName: currentUser?.nama || "", firstName: currentUser?.nama?.split(" ")[0] || "", adminName: currentUser?.nama || "", kelompok: currentUser?.kelompok || "", rt: currentUser?.rt || "", today,
    progressPct, progressDashOffset: 276.5 - (276.5 * progressPct) / 100, doneCount: doneHouses, totalHouses: total, totalTerkumpulDisplay: toRupiah(totalTerkumpul), kosongCount, pendingCount, sudahCount,
    totalTerkumpul, apiFetch,
    riwayatTotalTerkumpulDisplay: toRupiah(riwayatTransactions.filter((h) => h.status === "sudah").reduce((sum, h) => sum + (h.lastNominal || 0), 0)),
    goToList: () => goTo("scan"), goToRiwayat: () => goTo("riwayat"), goToDashboard: () => goTo("dashboard"), openScan, simulateScan, openRiwayatDetail, riwayatDetailHouse, riwayatDetailHistory,
    scanQrInput, onScanQrChange: (e) => setScanQrInput(e.target.value), onQrScanned,
    lastSavedTx,
    search, onSearchChange: (e) => setSearch(e.target.value), filteredHouses, noHousesFound: filteredHouses.length === 0,
    isScanning: scanState === "scanning", isScanIdle: scanState === "idle", isScanEmpty: scanState === "empty", isScanNotFound: scanState === "not_found",
    scanButtonLabel: scanState === "scanning" ? "Memindai…" : "Simulasikan Scan Berhasil",
    trendBars: trendBarsData.length > 0 ? (() => {
      const bars = [...trendBarsData];
      bars[bars.length - 1] = { ...bars[bars.length - 1], total: totalTerkumpul };
      return bars;
    })() : [65, 80, 45, 90, 70, 55, 100].map((v, i) => ({ heightPct: v, label: ["Sen","Sel","Rab","Kam","Jum","Sab","Min"][i], total: i === 6 ? totalTerkumpul : 0 })),
    selectedHouse, isEditableSelected, isReadonlySelected: !!selectedHouseRaw && !isEditableSelected, editTransactionForHouse,
    nominalInput, onNominalChange: (e) => setNominalInput(e.target.value), saveSudah: () => saveTransaction("sudah"), saveKosong: () => saveTransaction("kosong"),
    riwayatFilters, riwayatFiltered, noRiwayat: riwayatFiltered.length === 0,
    isAdminDashboard: screen === "admin-dashboard", isJadwalRonda: screen === "admin-jadwal", isKelompok: screen === "admin-kelompok",
    isAdminRumah: screen === "admin-rumah", isQr: screen === "admin-qr", isPetugasAkun: screen === "admin-petugas",
    isAdminRiwayat: screen === "admin-riwayat", isRekap: screen === "admin-rekap", isSetting: screen === "admin-setting",
    isAdminPetugasDetail: screen === "admin-petugas-detail", isAdminShell: screen.startsWith("admin-"),
    goToAdminRiwayat: () => goTo("admin-riwayat"), goToAdminPetugas: () => goTo("admin-petugas"),
    openPetugasDetail, petugasDetailAccount, petugasDetailHistory,
    adminNavItems, mobileNavValue: screen, onMobileNavChange: (e) => goToAdmin(e.target.value),
    adminDashboardMonth, setAdminDashboardMonth,
    adminDashboardYear, setAdminDashboardYear,
    totalRumahAdmin: total, totalKelompok: kelompokList.length, totalPemasukanDisplay: toRupiah(adminDashboardPemasukan),
    transaksiBulanIniCount, trenSummary, distribusiRtWithPct, transaksiTerbaru,
    rtProgress,
    rtRows, kelompokRows, rtList, kelompokList,
    rumahSearch, onRumahSearchChange: (e) => setRumahSearch(e.target.value),
    rumahAdminRows: rumahAdminRowsWithActions, noRumahAdminFound: rumahAdminRows.length === 0,
    riwayatDate, onRiwayatDateChange: (e) => setRiwayatDate(e.target.value),
    riwayatKelompokFilter, onRiwayatKelompokFilterChange: (e) => setRiwayatKelompokFilter(e.target.value),
    adminRiwayatFilter, onAdminRiwayatFilterChange: (e) => setAdminRiwayatFilter(e.target.value),
    adminRiwayatMode, setAdminRiwayatMode,
    adminRiwayatDate, onAdminRiwayatDateChange: (e) => setAdminRiwayatDate(e.target.value),
    adminRiwayatFiltered, noAdminRiwayat: adminRiwayatFiltered.length === 0,
    qrHouses: houses, petugasRows,
    kelompokFilterOptions,
    isCorrectionOpen: !!correctionTxId, correctionHouseName: (transactions.find((t) => t.id === correctionTxId) || {}).nama || "",
    correctionNominal, onCorrectionNominalChange: (e) => setCorrectionNominal(e.target.value), openCorrection, closeCorrection, saveCorrection, deleteTransaction, saveSetting,
    invoiceTx, openInvoice, closeInvoice, openCorrectionFromInvoice,
    rekapPeriode, onRekapPeriodeChange: (e) => setRekapPeriode(e.target.value),
    selectedRekapKelompok, setSelectedRekapKelompok,
    rekapTotalDisplay: toRupiah(rekapTotal), rekapSudahCount, rekapBelumCount,
    rekapKasRtDisplay: toRupiah(rekapKasRt), rekapKasRondaDisplay: toRupiah(rekapKasRonda), rekapPersentase,
    rekapPerRt: Array.isArray(rekapPerRt) ? rekapPerRt.map((r) => ({ ...r, display: toRupiah(r.total) })) : [],
    rekapPerKelompok: Array.isArray(rekapPerKelompok) ? rekapPerKelompok.map((k) => ({ ...k, display: toRupiah(k.total) })) : [],
    rekapRawData: rekapData,
    nominalDefaultSetting, onNominalDefaultChange: (e) => setNominalDefaultSetting(e.target.value),
    persentaseRt, onPersentaseRtChange: (e) => setPersentaseRt(Number(e.target.value)),
    persentaseRonda, onPersentaseRondaChange: (e) => setPersentaseRonda(Number(e.target.value)), saveSetting,
    modalType, modalData, onModalDataChange: (field, value) => setModalData((prev) => ({ ...prev, [field]: value })),
    closeModal, saveRt, deleteRt, saveKelompok, deleteKelompok, saveRumah, deleteRumah, savePetugas, deletePetugas, openModal,
    openProfile: () => setIsProfileOpen(true),
    stopPropagation: (e) => e.stopPropagation(),
  };

    return {
    vm,
    screen, setScreen,
    username, setUsername,
    password, setPassword,
    loginError, setLoginError,
    isLoading, setIsLoading,
    isCheckingSession,
    currentUser, setCurrentUser,
    isProfileOpen, setIsProfileOpen,
    toast, setToast,
    handleLogin,
    showToast
  };
}

-- ================================================================
-- SCHEMA DATABASE — Jimpitan Online (KKN Siji Gatak)
-- ================================================================
-- Jalankan script ini di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- 1. TABEL RT
-- ================================================================
CREATE TABLE IF NOT EXISTS rt (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama       TEXT NOT NULL,
  ketua      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 2. TABEL KELOMPOK RONDA
-- ================================================================
CREATE TABLE IF NOT EXISTS kelompok (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama       TEXT NOT NULL,
  rt_id      UUID REFERENCES rt(id) ON DELETE SET NULL,
  jadwal     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 3. TABEL RUMAH
-- ================================================================
CREATE TABLE IF NOT EXISTS rumah (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_penghuni    TEXT NOT NULL,
  alamat           TEXT,
  rt_id            UUID REFERENCES rt(id) ON DELETE SET NULL,
  kelompok_id      UUID REFERENCES kelompok(id) ON DELETE SET NULL,
  nominal_default  INTEGER NOT NULL DEFAULT 2000,
  qr_code          TEXT UNIQUE NOT NULL DEFAULT '',
  aktif            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 4. TABEL PETUGAS (profil; auth dikelola Supabase Auth)
-- ================================================================
CREATE TABLE IF NOT EXISTS petugas (
  id           UUID PRIMARY KEY,  -- sama dengan auth.users.id
  nama         TEXT NOT NULL,
  username     TEXT UNIQUE NOT NULL,
  kelompok_id  UUID REFERENCES kelompok(id) ON DELETE SET NULL,
  role         TEXT NOT NULL DEFAULT 'petugas' CHECK (role IN ('admin', 'petugas')),
  aktif        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 5. TABEL SESI RONDA (satu sesi = satu malam ronda oleh satu petugas)
-- ================================================================
CREATE TABLE IF NOT EXISTS sesi_ronda (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kelompok_id  UUID REFERENCES kelompok(id) ON DELETE SET NULL,
  petugas_id   UUID REFERENCES petugas(id) ON DELETE SET NULL,
  tanggal      DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kelompok_id, petugas_id, tanggal)
);

-- ================================================================
-- 6. TABEL TRANSAKSI JIMPITAN
-- ================================================================
CREATE TABLE IF NOT EXISTS transaksi (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesi_id     UUID REFERENCES sesi_ronda(id) ON DELETE CASCADE,
  rumah_id    UUID REFERENCES rumah(id) ON DELETE CASCADE,
  petugas_id  UUID REFERENCES petugas(id) ON DELETE SET NULL,
  nominal     INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'sudah' CHECK (status IN ('sudah', 'kosong')),
  catatan     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 7. TABEL PENGATURAN (singleton — selalu id = 1)
-- ================================================================
CREATE TABLE IF NOT EXISTS pengaturan (
  id                      INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  nominal_default_global  INTEGER NOT NULL DEFAULT 2000,
  persentase_kas_rt       INTEGER NOT NULL DEFAULT 60,
  persentase_kas_ronda    INTEGER NOT NULL DEFAULT 40,
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data awal pengaturan
INSERT INTO pengaturan (id, nominal_default_global, persentase_kas_rt, persentase_kas_ronda)
VALUES (1, 2000, 60, 40)
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- INDEXES untuk performa query
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_rumah_kelompok ON rumah(kelompok_id);
CREATE INDEX IF NOT EXISTS idx_rumah_rt ON rumah(rt_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_sesi ON transaksi(sesi_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_rumah ON transaksi(rumah_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_created ON transaksi(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sesi_tanggal ON sesi_ronda(tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_sesi_kelompok ON sesi_ronda(kelompok_id);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE rt          ENABLE ROW LEVEL SECURITY;
ALTER TABLE kelompok    ENABLE ROW LEVEL SECURITY;
ALTER TABLE rumah       ENABLE ROW LEVEL SECURITY;
ALTER TABLE petugas     ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesi_ronda  ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi   ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengaturan  ENABLE ROW LEVEL SECURITY;

-- Helper function: ambil role dari tabel petugas
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM petugas WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function: ambil kelompok_id dari tabel petugas
CREATE OR REPLACE FUNCTION get_my_kelompok()
RETURNS UUID AS $$
  SELECT kelompok_id FROM petugas WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- ----------------------------------------------------------------
-- POLICY: rt
-- Admin: full access | Petugas: read only
-- ----------------------------------------------------------------
CREATE POLICY "Admin full access rt" ON rt
  FOR ALL USING (get_my_role() = 'admin');

CREATE POLICY "Petugas read rt" ON rt
  FOR SELECT USING (get_my_role() = 'petugas');

-- ----------------------------------------------------------------
-- POLICY: kelompok
-- Admin: full access | Petugas: hanya kelompoknya sendiri
-- ----------------------------------------------------------------
CREATE POLICY "Admin full access kelompok" ON kelompok
  FOR ALL USING (get_my_role() = 'admin');

CREATE POLICY "Petugas read own kelompok" ON kelompok
  FOR SELECT USING (id = get_my_kelompok());

-- ----------------------------------------------------------------
-- POLICY: rumah
-- Admin: full access | Petugas: hanya rumah dalam kelompoknya
-- ----------------------------------------------------------------
CREATE POLICY "Admin full access rumah" ON rumah
  FOR ALL USING (get_my_role() = 'admin');

CREATE POLICY "Petugas read own kelompok rumah" ON rumah
  FOR SELECT USING (kelompok_id = get_my_kelompok());

-- ----------------------------------------------------------------
-- POLICY: petugas
-- Admin: full access | Petugas: baca profil sendiri saja
-- ----------------------------------------------------------------
CREATE POLICY "Admin full access petugas" ON petugas
  FOR ALL USING (get_my_role() = 'admin');

CREATE POLICY "Petugas read own profile" ON petugas
  FOR SELECT USING (id = auth.uid());

-- ----------------------------------------------------------------
-- POLICY: sesi_ronda
-- Admin: full access | Petugas: hanya sesi miliknya (hari ini)
-- ----------------------------------------------------------------
CREATE POLICY "Admin full access sesi" ON sesi_ronda
  FOR ALL USING (get_my_role() = 'admin');

CREATE POLICY "Petugas manage own sesi" ON sesi_ronda
  FOR ALL USING (petugas_id = auth.uid());

-- ----------------------------------------------------------------
-- POLICY: transaksi
-- Admin: full access | Petugas: insert & update sesi miliknya
-- ----------------------------------------------------------------
CREATE POLICY "Admin full access transaksi" ON transaksi
  FOR ALL USING (get_my_role() = 'admin');

CREATE POLICY "Petugas manage own transaksi" ON transaksi
  FOR ALL USING (petugas_id = auth.uid());

-- ----------------------------------------------------------------
-- POLICY: pengaturan
-- Admin: full access | Petugas: read only
-- ----------------------------------------------------------------
CREATE POLICY "Admin full access pengaturan" ON pengaturan
  FOR ALL USING (get_my_role() = 'admin');

CREATE POLICY "Petugas read pengaturan" ON pengaturan
  FOR SELECT USING (get_my_role() = 'petugas');

-- ================================================================
-- SEED DATA AWAL (contoh untuk development)
-- Hapus atau komentari bagian ini sebelum production
-- ================================================================

-- Seed RT
INSERT INTO rt (id, nama, ketua) VALUES
  ('11111111-0000-0000-0000-000000000001', 'RT 03', 'Bpk. Slamet Riyadi'),
  ('11111111-0000-0000-0000-000000000002', 'RT 04', 'Bpk. Joko Purnomo'),
  ('11111111-0000-0000-0000-000000000003', 'RT 05', 'Ibu Endang Suryani')
ON CONFLICT (id) DO NOTHING;

-- Seed Kelompok
INSERT INTO kelompok (id, nama, rt_id, jadwal) VALUES
  ('22222222-0000-0000-0000-000000000001', 'Ronda Melati',  '11111111-0000-0000-0000-000000000001', 'Senin, Rabu, Jumat'),
  ('22222222-0000-0000-0000-000000000002', 'Ronda Kenanga', '11111111-0000-0000-0000-000000000002', 'Selasa, Kamis'),
  ('22222222-0000-0000-0000-000000000003', 'Ronda Cempaka', '11111111-0000-0000-0000-000000000003', 'Sabtu, Minggu')
ON CONFLICT (id) DO NOTHING;

-- Seed Rumah
INSERT INTO rumah (id, nama_penghuni, alamat, rt_id, kelompok_id, nominal_default, qr_code, aktif) VALUES
  (uuid_generate_v4(), 'Bpk. Slamet Riyadi',   'Jl. Mawar No. 12', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 2000, 'QR-RT03-001', TRUE),
  (uuid_generate_v4(), 'Ibu Sri Wahyuni',       'Jl. Mawar No. 14', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 2000, 'QR-RT03-002', TRUE),
  (uuid_generate_v4(), 'Bpk. Agus Setiawan',   'Jl. Mawar No. 16', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 2000, 'QR-RT03-003', TRUE),
  (uuid_generate_v4(), 'Ibu Siti Aminah',       'Jl. Mawar No. 18', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 2000, 'QR-RT03-004', TRUE),
  (uuid_generate_v4(), 'Bpk. Bambang Hermawan', 'Jl. Melati No. 3', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 2000, 'QR-RT03-005', TRUE),
  (uuid_generate_v4(), 'Ibu Dwi Lestari',       'Jl. Melati No. 5', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 2000, 'QR-RT03-006', TRUE),
  (uuid_generate_v4(), 'Bpk. Hendra Gunawan',  'Jl. Melati No. 7', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 2000, 'QR-RT03-007', TRUE),
  (uuid_generate_v4(), 'Ibu Yuni Kartika',      'Jl. Melati No. 9', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 2000, 'QR-RT03-008', TRUE),
  (uuid_generate_v4(), 'Bpk. Joko Purnomo',    'Jl. Anggrek No. 2','11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 2000, 'QR-RT04-001', TRUE),
  (uuid_generate_v4(), 'Ibu Rina Marlina',      'Jl. Anggrek No. 4','11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 2000, 'QR-RT04-002', TRUE),
  (uuid_generate_v4(), 'Bpk. Wahyu Nugroho',   'Jl. Anggrek No. 6','11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 2000, 'QR-RT04-003', TRUE),
  (uuid_generate_v4(), 'Ibu Endang Suryani',   'Jl. Anggrek No. 8','11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003', 2000, 'QR-RT05-001', TRUE)
ON CONFLICT (qr_code) DO NOTHING;

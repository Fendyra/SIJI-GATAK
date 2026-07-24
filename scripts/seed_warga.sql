-- Migration: Insert 150 Data Warga
-- Jalankan di Supabase SQL Editor
-- LANGKAH 1: Hapus data dummy/lama (opsional, skip jika ingin mempertahankan)
-- ============================================================

DELETE FROM transaksi WHERE TRUE;
DELETE FROM sesi_ronda WHERE TRUE;
DELETE FROM rumah WHERE TRUE;
DELETE FROM kelompok WHERE TRUE;
DELETE FROM rt WHERE TRUE;

-- ============================================================
-- LANGKAH 2: Insert data RT, Kelompok, dan Rumah nyata
-- ============================================================

-- ==========================================
-- GROUP: RT 4
-- ==========================================

INSERT INTO rt (id, nama, ketua) VALUES ('e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'RT 4', '-');

INSERT INTO kelompok (id, nama, rt_id, jadwal) VALUES ('a3d05806-402c-40cd-bc85-24b11c075a72', 'Warga RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', '-');

INSERT INTO rumah (id, nama_penghuni, alamat, rt_id, kelompok_id, nominal_default, qr_code, aktif) VALUES
  ('05f634b6-1845-4cea-ab96-265348f4e7bb', 'Sudaryana', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-RVLH', true),
  ('e9d5a26d-93b6-4b3b-b164-7f4b5489d259', 'Budi Marsigit', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-MHT8', true),
  ('f279942f-2b3b-4173-8fa5-39267f1b1a06', 'Nurrohmadi', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-ZX3N', true),
  ('c195761b-968b-4277-9c81-b09c648b93b0', 'Nurdiyanto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-98CM', true),
  ('9dc275e5-d3e0-422c-bc24-12b80af68ce7', 'Mujiyono', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-WOR9', true),
  ('326fa828-e181-4789-b785-32de3dface3a', 'Wagilah', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-UJ8Y', true),
  ('ac231c96-fbb9-4461-8362-82ffef39e7b2', 'Mugono', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-GVVM', true),
  ('f9ccba79-0b65-4605-8034-6fa07a2f3428', 'Wiratno', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-I61T', true),
  ('a814fbb5-dd3e-452d-8b99-9a2f64b52d35', 'Riyo Wardoyo', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-9XF9', true),
  ('3eea58cf-1321-442e-9314-5adf5c038ba5', 'Tarom', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-S644', true),
  ('99ff509a-06cb-4b56-9e28-0a83fcca5e78', 'Waliyo', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-NFQX', true),
  ('2f40f220-fe3e-486e-954f-1a45390ecbf8', 'Agus Yati', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-QE1B', true),
  ('e9691bce-6536-46cc-9401-2695fceae40f', 'Kholil', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-DVJK', true),
  ('9504a48b-980f-41cc-a7e5-945a1aaa24c2', 'Arif Fajar', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-N1Z4', true),
  ('0da8d24a-5123-4324-986e-fe920182acb9', 'Agus', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-L1K1', true),
  ('0f5396ae-c4eb-4c9a-8c99-0f5991edac1b', 'Jamilah', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-DV6O', true),
  ('ce3d73b5-5dfc-4531-9766-e1b0eb42e3e0', 'Anes', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-QDZG', true),
  ('adad7da7-b449-4086-9eae-a017a6958d4d', 'Rustamaji', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-JHNY', true),
  ('769bef6b-16af-45d5-8310-84fe904860b3', 'Slamet Gamber', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-4YPY', true),
  ('c95462b5-65fc-4192-a7f8-79ec438a1b6f', 'Soto Pak Tomo', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-6NXK', true),
  ('050880a2-3dc7-468f-afd4-ae9075d02dcb', 'Toko Buah', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-KX21', true),
  ('808cb979-4509-4b71-95ac-6c414b2deab6', 'Roti Bakar', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-97CZ', true),
  ('931c666a-dffb-40c3-b6b7-4ec7145178ff', 'Kost Ujung Selatan', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-MXXZ', true),
  ('fb97b9c9-7bc5-4d95-82a0-7ee2db4f5731', 'Batako', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-4R25', true),
  ('08c35084-fb19-4f6d-8262-856c8df58719', 'Bowo Rosok', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-U4L7', true),
  ('49c6b309-0c94-41b8-9e88-2f4b46a0cda4', 'Aloy Bengkel', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-DB0J', true),
  ('11e9e519-ae26-4e40-ac05-aebb18f0bbdb', 'Wagiyo', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-M4NU', true),
  ('41ba036b-8f9b-41b7-ab41-9653b9412b14', 'Bangun Febrianto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-7W27', true),
  ('b7cb7493-d3b6-4dd2-881d-3a5edddcd278', 'Suroto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-QXY0', true),
  ('36d65eb8-9bd4-4d97-988d-6043bd2e8ddf', 'Sugeng Waluyo', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-45WU', true),
  ('e76070d8-2389-4c09-9050-f7bcb8d4ff64', 'Pujo Wiyono', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-J9PA', true),
  ('e6488afb-163f-451b-b1b9-76ba9a7bfc63', 'Muryadi', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-DK08', true),
  ('d9cd1bef-d96f-443d-a1bc-136eb2782883', 'Boiman', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-K7YR', true),
  ('2ba15580-b68e-439c-81c9-42904e7fdc98', 'Rohmad', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-J726', true),
  ('45a40505-2a18-410d-8ced-f3107168da5c', 'Jayadi', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-AL72', true),
  ('0258648d-8af0-4f70-b55a-d784a57f2f06', 'Teguh Subagiyo', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-J13J', true),
  ('8edfe510-54c7-444d-9935-c9d1a36dc0d2', 'Yudianto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-42T0', true),
  ('98a67af3-9bef-46e5-b837-63f9ff23d9d3', 'Dwi Armadayanto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-6TZV', true),
  ('cf6b4dbd-c15a-4c5e-adc2-b34faf4e0c01', 'Heri Sonya', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-LX2F', true),
  ('da9ac1e5-3052-4255-9bf8-7b28150dcb1b', 'Gunardi', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-BTS9', true),
  ('2c1130cd-5cda-4e3e-8567-fc3c422268ef', 'Robet', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-6RZU', true),
  ('514c9ee1-73b1-41cd-8c0c-24399c130bc8', 'Samiyo', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-ANNN', true),
  ('e32a388b-ba64-4914-a2a0-c43f7b699295', 'Ronald Sadubun', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-CKQB', true),
  ('a58f87d8-c47b-49e9-9d77-e2fee9d22ed4', 'Wawan', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-M4UW', true),
  ('ed9efd04-d84a-4638-a1d4-2f6b90d1e2ec', 'Yakobus', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-M67E', true),
  ('d384defc-31c5-412c-88b4-d3437dc8677f', 'Burgerax', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-BNQ6', true),
  ('31e3ee18-104e-4fee-9a2c-df8484541fef', 'Untung Pratitis', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-PML0', true),
  ('ef5b83b1-2101-44e7-b349-e3d4356beb92', 'Sudiyono Riyadi', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-WC4I', true),
  ('31de84a3-d070-4a58-ac67-f6d9809ca338', 'Eko', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-990C', true),
  ('10aaa056-d090-42d6-b81a-49be0aa46c95', 'Huda', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-VCB1', true),
  ('08c7fd23-7f42-4f1d-a312-4c6a96e4daea', 'Rumah Pak Gati', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-5770', true),
  ('04e78a76-b6c0-490d-a3c5-de07b7c031e1', 'Kalimi', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-OZ9W', true),
  ('86c12aa4-3147-4af6-95f4-a9127242a610', 'Wijiyono', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-D4KY', true),
  ('ecbcd373-b211-4b4b-8e2c-30bc6526f953', 'Eko Hayu', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-VX8U', true),
  ('e900c46c-aa50-45d2-ad2f-ba5ede4f95a2', 'Maryoto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-5WUH', true),
  ('d4f1cbce-341a-4adc-a627-b3b9f744f803', 'Muji Hartanto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-XAIA', true),
  ('cb8d9177-5fc0-4f55-90c7-8269a86dfedf', 'Triyadi', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-5CY8', true),
  ('063d39d8-42b3-40af-abdf-f5876dc8be9d', 'Suhardi', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-4O3W', true),
  ('d04cde29-a4ce-43d6-b4a7-adbd63bc377a', 'Prinanggalih', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-IYJ4', true),
  ('af621424-ff43-4a43-8343-8694f6866561', 'Bu Romlah', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-Z1HM', true),
  ('bd007489-d58a-478c-8c0e-09c11560af6a', 'Andi Sudiyanto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-JQN6', true),
  ('f63a749c-625a-45f7-bb82-618ccac6cdbb', 'Sudiman', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-2RT0', true),
  ('61aba922-3ba5-49f8-8d28-c94134773b12', 'Subardiman', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-TX0S', true),
  ('7510809a-19ac-46f4-a88d-9427c49e13ce', 'Ruli Nurmansyah', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-YXZV', true),
  ('4d4b4bf6-173b-4454-8871-9a2d9d4905cd', 'Budi Miliyono', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-FQ4O', true),
  ('24aeb5c7-200a-4327-a8fd-8869bf5ae35e', 'Triyono', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-5N4H', true),
  ('a858eb08-d00f-4fda-aec6-1ca3027c93f2', 'Wahyu Danang', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-5FKW', true),
  ('46c78a92-5216-4014-a295-de1f9f077285', 'Tri Haryanto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-638E', true),
  ('e0f38901-7d3c-4992-8c94-553ce002c542', 'Latif Paryanto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-FBTE', true),
  ('17024971-28ac-4852-8d73-c610a786b557', 'Triyanto Pegu', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-8Q8L', true),
  ('da5f350d-7287-43f7-a067-6749109a3c9c', 'Joko Karsiman', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-RXWB', true),
  ('2bd08fe4-b42d-46dc-9828-462c1cce71c7', 'Hafizin', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-OPX3', true),
  ('fe7cd724-8679-48f2-8d0e-680638895a86', 'Sukiman', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-6N13', true),
  ('057f67a3-596a-4134-b0d2-c4e74932edeb', 'Harto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-ZE4M', true),
  ('35725cbb-d8a6-4342-9d84-24eb3e85b9f4', 'Sugiyono', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-3GP7', true),
  ('e92eb746-0ff9-41d1-8fba-29bda0a04b5b', 'Sarjono', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-DD1G', true),
  ('7c1aec63-fd2e-4379-bf4c-d0bc19b084aa', 'Darto', 'RT 4', 'e80c09fb-d51e-45a5-819f-e45f8c2cd8b9', 'a3d05806-402c-40cd-bc85-24b11c075a72', 2000, 'http://localhost:3000/scan/QR-1784810747811-TX8E', true);

-- ==========================================
-- GROUP: RT 3
-- ==========================================

INSERT INTO rt (id, nama, ketua) VALUES ('9d110d81-2daf-466f-9086-9b619a28cbb8', 'RT 3', '-');

INSERT INTO kelompok (id, nama, rt_id, jadwal) VALUES ('4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 'Warga RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '-');

INSERT INTO rumah (id, nama_penghuni, alamat, rt_id, kelompok_id, nominal_default, qr_code, aktif) VALUES
  ('07d6a17b-6b1a-45be-a7c1-a7da4f52c61f', 'Rina', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-HUO4', true),
  ('2c9aa628-df24-4277-9d22-7188a1f3f344', 'Sudiyono', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-9RJU', true),
  ('94a1aa31-fd06-4abf-8dfb-93692959a43f', 'Fikri', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-LFM5', true),
  ('dd8acc2a-f5e7-466e-bcec-dc338c73df52', 'Sudinem', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-IIUT', true),
  ('63770582-b2cb-4dab-8ff2-c9e2afa4495f', 'Bayu', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-V7QA', true),
  ('4f3e26be-3e08-4bfd-92a9-122436e15525', 'Toyib', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-0AJW', true),
  ('7ae69d34-c180-450b-82a8-f524be39ddfa', 'Warso Utomo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-0Y5C', true),
  ('90824727-aeda-4922-8394-134d54b1d3ed', 'Sarijo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-GFSK', true),
  ('0b594c59-41e4-4040-aea1-b6a36907d439', 'Amri', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-MNN8', true),
  ('aa374f54-e57e-4822-a712-ad8ad04d3adb', 'Samijo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-4WKZ', true),
  ('57070d6c-8fdc-40d1-93f0-98ec3b401109', 'Margono', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-DELZ', true),
  ('a383c278-58e6-43b9-9a4b-fbf09af2ea62', 'Noto Utomo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-Q1K8', true),
  ('d6e47ace-1fae-4a85-8a17-69b9d0cad44c', 'Sumaryadi', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-DLGJ', true),
  ('77798a64-6693-47a8-840a-fd89a00b5c16', 'Marjuki', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-SPX1', true),
  ('ecd16fd3-058f-4472-b44d-c9f4eb19b49d', 'Sarwidi', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-8H2O', true),
  ('39886d01-c871-424c-891e-b87e32173f72', 'Yono', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-VFOV', true),
  ('8ad1b609-71a2-4d24-9ee5-0ae6f83f0537', 'Ponirah Parjo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-R8QY', true),
  ('c7ab3060-2b27-4aa9-b782-c8cdfcfd1796', 'Sarjono Tengong', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-YYAC', true),
  ('b7672e99-7e7d-4edf-87ec-c374990ea763', 'Slamet', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-Y0H0', true),
  ('431ef2d5-29bb-4684-af20-91c6f913d046', 'Adit', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-33ZN', true),
  ('aa1c834f-f6a7-4b74-a327-7983e396a554', 'Supardi', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-E5PB', true),
  ('eeac601b-7b4d-4f69-90a9-b9c138f07480', 'Sunaryo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-1JCQ', true),
  ('8e5810fa-054c-4aaa-9ea0-06189c3ddc35', 'Sumadi Somo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-7UTX', true),
  ('28a27b40-038f-4515-a3eb-213be8d419ba', 'Wardiyono', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-E95S', true),
  ('d899943b-4c83-447b-b8fc-28323addb1e5', 'Edi', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-CPHG', true),
  ('6921bdae-f666-4ae5-ba12-268c92c9b852', 'Umbar', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-3AJO', true),
  ('d1b6caec-2fd1-4947-aa45-6fdd3b6dfcd9', 'Suhar', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-20G4', true),
  ('dac79805-c57c-415c-ae0c-b51b185784bc', 'Rafi', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-KPK2', true),
  ('a7f35a26-85cb-41c1-b45a-d56250a55980', 'Tri Widodo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-9Y3U', true),
  ('97fc88fe-cc6e-4646-b2dc-35d9c1fde0a0', 'Heru Pracoyo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-YH4X', true),
  ('cc42e439-a305-48e4-8e9c-8cab5955e6ce', 'Yulianto', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-G6SF', true),
  ('8cd93dc1-9a16-44c0-be15-cd3dfb4d59be', 'Bagus', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-09T1', true),
  ('48c1635e-b1e4-4912-af9b-421b6a105a69', 'Yanu', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-LO43', true),
  ('fa126dd2-58a6-48a8-8265-5ef53704f988', 'Budi Mitra', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-VLEE', true),
  ('9e87df27-4263-4b4d-82d5-aa0c864d9782', 'Anwar', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-YLGM', true),
  ('8c584e7e-dc4c-49ec-8e3f-2e167040ff11', 'Sumadi', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-ROZB', true),
  ('f688ec44-9efe-4752-8119-175e6458fb4e', 'Tri Wahono', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-K9RQ', true),
  ('39374fbf-cb68-4b6b-aad3-dd8e42a70e6e', 'Kanadental', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-X687', true),
  ('8e9a8112-96c4-4bc5-bc00-66270531d1ca', 'Aris', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-K2NV', true),
  ('cad26967-6eba-49fd-8a0c-37440259b3b7', 'Apotik ProGo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-VA5I', true),
  ('65e181c0-0fe6-4f79-9eb1-fdcc7ecfaaae', 'Yuli', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-04R2', true),
  ('103f8a2c-66fe-4e86-bf14-1cf596e02482', 'Dwi', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-AO7M', true),
  ('9b7fe228-0791-45c7-b89c-2ba8b8bf4367', 'Heri', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-3NJS', true),
  ('4e442362-849e-4ea2-8f3c-01c81478fea6', 'Aryo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-96DF', true),
  ('ac8450b7-39bd-479c-8f93-7f82b5c4157d', 'Suroto', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-ROQY', true),
  ('b523268e-3fb5-47e1-a58d-44a1b296529b', 'Warmindo', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-ECVC', true),
  ('33321cd2-80c4-4564-9704-7dfda31ca0e7', 'Darno', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-YRUO', true),
  ('a9b0f0db-f253-45ee-b8bb-ab9f7b73ed1a', 'Suripto', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-HF84', true),
  ('c378a172-b968-44d7-83ae-ea5746856dcc', 'Paryanto Gendut', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-RE2F', true),
  ('db4eb094-bd62-4a37-b25d-1b458024700a', 'Susanto', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-XDBE', true),
  ('d13aa97d-c47d-46e3-9245-81c97d29920c', 'Ruko Bu Mei', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-3F0X', true),
  ('59fbf6f9-2c25-442a-9b1f-a85462fac3ae', 'Ahas', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-DL67', true),
  ('e567c669-3f4b-4811-9244-7d5f0033dd9d', 'ZT Audio', 'RT 3', '9d110d81-2daf-466f-9086-9b619a28cbb8', '4bc16bbb-1b9a-442f-ad20-1a5160ecb91c', 2000, 'http://localhost:3000/scan/QR-1784810747811-TNDZ', true);

-- ==========================================
-- GROUP: Dukuhan
-- ==========================================

INSERT INTO rt (id, nama, ketua) VALUES ('bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', 'Dukuhan', '-');

INSERT INTO kelompok (id, nama, rt_id, jadwal) VALUES ('34239906-f458-47c8-a72a-d1d7fde0b436', 'Warga Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '-');

INSERT INTO rumah (id, nama_penghuni, alamat, rt_id, kelompok_id, nominal_default, qr_code, aktif) VALUES
  ('a935a7d8-9cb5-4479-91a4-e83b4867a226', 'Bowo Rapi', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-WCIW', true),
  ('8488a7af-93e5-4f85-bd59-fed6f40f6c99', 'Bambang', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-LX8R', true),
  ('dfaaa515-95ff-450c-ae89-f3e02a9c6f07', 'Maryono', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-U10J', true),
  ('3891c9d7-c682-4489-a7da-4a80c2560f1f', 'Jumadi', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-TKQ1', true),
  ('c914c1a6-ab96-4eab-be67-5c2a161daf4b', 'Mujianto', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-DQAD', true),
  ('08eef7d1-60a9-4d00-9b7c-8a8c5ae31dde', 'Darmadi', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-BXXC', true),
  ('e4f47579-23da-4201-b4fa-0d01f3086550', 'Pamungkas', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-CETD', true),
  ('4282eb0f-1103-4403-8689-61b8df552509', 'Tugimin', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-YCE9', true),
  ('532352fc-3437-4cc7-834d-90952be817c4', 'Muna', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-BYWR', true),
  ('9df078c6-0786-4e03-9f7f-dff06fcb0880', 'Miwan', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-HZQJ', true),
  ('50bf84fb-4946-4dcd-97f0-ffd2674ff246', 'Budiyono', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-OI1B', true),
  ('97b391da-61c7-44b8-af9d-0bb9897bf0ee', 'Kholis', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-BX35', true),
  ('8aaeb995-3837-403e-9c8a-ce622da67b7f', 'Sukiwan', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-XOV4', true),
  ('3030e180-45ab-40c9-a0d2-90c313e2a447', 'Adi Sumarto', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-381C', true),
  ('c8820cc2-dcbb-47ce-a52e-6290264bb578', 'Sugeng', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-WEQX', true),
  ('dc0f5b16-2c3f-44b6-a9a7-6f05353a0aa8', 'Nanto', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-UPJX', true),
  ('e331636b-b02d-436d-84ca-e323f1ddbcb9', 'Rian', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-KIL4', true),
  ('31505ca0-3621-4ee6-b103-c55a3b5f974b', 'Jakiman', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-2PNV', true),
  ('9f00b987-f8ab-4074-a518-b77feef7928a', 'May Priyambodo', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-DLVE', true),
  ('fac8b21e-04c0-4c6c-acab-a4de5b783288', 'Wandi Susilo', 'Dukuhan', 'bbe3f8a4-d4aa-4d02-8fcf-bdbcf85ab7ea', '34239906-f458-47c8-a72a-d1d7fde0b436', 2000, 'http://localhost:3000/scan/QR-1784810747812-RM3W', true);


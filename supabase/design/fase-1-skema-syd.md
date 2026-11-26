# Desain skema dan pelaksanaan `syd_*` (revisi 3)

Dokumen ini mencatat keputusan skema, pelaksanaan Fase 2, dan pemindahan kode Fase 3.
Tabel kanonik `syd_*` sudah dibuat di Supabase remote; migrasi kode aplikasi sedang diverifikasi.

Project: `biyurtytnwlmxuninybb` (dipakai bersama aplikasi lain).

Revisi 2: `category_features` dilebur ke `categories` sebagai array; `tshirt_size`,
`running_experience`, `bib_number`, `bib_assigned_at`, `finish_time` dihapus; consent
digabung jadi satu field; `admin_users` tidak di-rename.

Revisi 3: `min_age`, `max_age`, `health_warning` dihapus dari kategori; `allergies`
dihapus dari registrasi; `nationality` dan `id_number` opsional (tidak dipakai form).

## 1. Peta tabel

| Sekarang | Baru | Perubahan |
|---|---|---|
| `categories` (5) | `syd_categories` | + `features text[]` (dari `category_features`) |
| `category_features` (26) | **dilebur** ke `syd_categories.features` | tabel tidak dibuat |
| `registrations` (12) | **tidak disalin** | akan dihapus setelah pemindahan kode dan backup terverifikasi |
| `registrations_v2` (84) | **`syd_registrations`** | tabel kanonik tunggal |
| `transactions_history` (16) | `syd_transactions` | + `external_order_id` UNIQUE, `signature_verified` |
| `contact_messages` (8) | `syd_contact_messages` | |
| `admin_users` (3) | **tetap `admin_users`** | tidak di-rename |
| `syd_bib_counters` | **dibatalkan** | tidak diperlukan karena BIB dihapus |

Tidak disentuh: `ss_events`, `ss_members`, `ss_registrations`, `ss_users`, `events`,
`participants`, `ra_routes`, `ra_submissions`, `ritw_transactions_history`.

## 2. Keputusan desain

| # | Keputusan | Alasan / catatan |
|---|---|---|
| D1 | Identifier publik tunggal `registration_number` (contoh `SYD26-MQA123500`) | menghapus duplikasi dengan `unique_code` |
| D2 | `unique_code` tidak dibuat; nilainya dimigrasi ke `registration_number` | kode & email sudah memakai format `SYD26-…` |
| D3 | `instagram` nullable, `strava_url` wajib untuk pendaftaran baru | baris lama tanpa URL Strava tetap memakai string kosong |
| D4 | Status bayar: `pending, paid, failed, expired, refunded, cancelled` | gabungan v1 + v2 |
| D5 | `external_order_id` UNIQUE di `syd_registrations` dan `syd_transactions` | webhook Midtrans bisa terpanggil berulang |
| D6 | **Consent satu kolom: `consent_given_at timestamptz`** | `NULL` = belum setuju; nilai = waktu setuju. Satu kolom, tetap menyimpan jejak waktu |
| D7 | **Tidak ada BIB di database** | kolom `bib_number`/`bib_assigned_at` + tabel counter dihapus |
| D8 | **Tidak ada `finish_time`** | pencatatan hasil lomba di luar aplikasi |
| D9 | `nationality` & `id_number` tetap ada tapi **opsional**; `allergies` dihapus; `ip_address` dipertahankan | kolom tidak dipakai form sekarang, tapi berguna bila diaktifkan lagi |
| D10 | Reuse `public.update_updated_at_column()` | fungsi sudah ada |
| D11 | `admin_users` tidak di-rename, **tetapi policy RLS-nya diperbaiki** | policy lama rekursif → query anon error 500 |

### Konsekuensi yang perlu Anda sadari
| Dampak | Keterangan |
|---|---|
| Data `tshirt_size`, `running_experience`, `finish_time`, `bib_number` | **tidak** disalin ke `syd_registrations`; nilainya masih tersimpan utuh di `syd_registrations_archive_v1` |
| Nomor BIB | tidak lagi dibuat otomatis; kolom BIB di tabel admin harus dihapus di Fase 3 |
| `agreed_*` lama | dipetakan: `true` → `consent_given_at = agreed_at`, selain itu `NULL` |
| Fitur "Termasuk" | tersimpan sebagai array teks; urutan array = urutan tampil |

## 3. Struktur tabel

### 3.1 `syd_categories`
| Kolom | Tipe | Aturan |
|---|---|---|
| id | uuid | PK, `gen_random_uuid()` |
| name | varchar(100) | NOT NULL |
| description | text | NOT NULL |
| price | integer | NOT NULL, `>= 0` |
| distance | varchar(50) | NOT NULL |
| image_url | varchar(500) | |
| **features** | **text[]** | NOT NULL DEFAULT `'{}'`, index GIN |
| recommended | boolean | DEFAULT false |
| max_participants | integer | `> 0` |
| current_participants | integer | DEFAULT 0, `>= 0`, `<= max_participants` |
| display_order | integer | DEFAULT 0 |
| is_active | boolean | DEFAULT true |
| created_at / updated_at | timestamptz | DEFAULT now() + trigger |

Contoh isi `features`: `{"BIB Number","Refreshment","Medical","Doorprize","Digital Certificate"}`

### 3.2 `syd_registrations` (kanonik)
| Kolom | Tipe | Aturan |
|---|---|---|
| id | uuid | PK |
| registration_number | varchar(30) | NOT NULL, UNIQUE |
| category_id | uuid | NOT NULL, FK → `syd_categories` ON DELETE RESTRICT |
| full_name | varchar(255) | NOT NULL |
| email | varchar(255) | NOT NULL + CHECK format |
| phone | varchar(20) | NOT NULL |
| date_of_birth | date | NOT NULL, `<= CURRENT_DATE - 10 years` |
| gender | varchar(10) | CHECK `male/female/other` |
| instagram | varchar(255) | nullable |
| strava_url | text | nullable, CHECK `^https://(www\.)?strava\.com/` |
| nationality | varchar(50) | **opsional**, tanpa default (tidak dipakai form) |
| id_number | varchar(50) | **opsional** (tidak dipakai form) |
| emergency_contact_name | varchar(255) | NOT NULL |
| emergency_contact_phone | varchar(20) | NOT NULL |
| emergency_contact_relationship | varchar(255) | NOT NULL |
| medical_conditions | text | |
| total_amount | integer | NOT NULL, `>= 0` |
| payment_status | varchar(20) | DEFAULT `pending`, CHECK 6 nilai |
| payment_method | varchar(50) | |
| external_order_id | varchar(100) | UNIQUE |
| external_transaction_id | varchar(100) | |
| payment_date | timestamptz | |
| **consent_given_at** | timestamptz | `NULL` = belum setuju |
| ip_address | inet | |
| created_at / updated_at | timestamptz | DEFAULT now() + trigger |

Dihapus dari desain: `tshirt_size`, `running_experience`, `bib_number`, `bib_assigned_at`,
`finish_time`, `agreed_to_terms`, `agreed_to_privacy_policy`, `agreed_at`.

### 3.3 `syd_transactions`
`id` uuid PK · `registration_id` uuid NOT NULL FK ON DELETE CASCADE ·
`external_order_id` varchar(100) NOT NULL UNIQUE · `external_transaction_id` varchar(100) ·
`status` varchar(30) · `status_code` varchar(5) · `payment_type` varchar(50) ·
`fraud_status` varchar(20) · `amount` integer NOT NULL `>= 0` · `currency` varchar(3) DEFAULT `IDR` ·
`signature_verified` boolean DEFAULT false · `gateway_response` jsonb · `time` timestamptz ·
`created_at` / `updated_at` timestamptz

### 3.4 `syd_contact_messages`
`id` uuid PK · `name` text NOT NULL · `email` text NOT NULL · `category` text ·
`subject` text · `message` text NOT NULL · `is_read` boolean DEFAULT false · `created_at` timestamptz

### 3.5 `admin_users` (tidak di-rename)
Struktur tetap: `id, name, username, email, password_hash, is_active, last_login, created_at, updated_at`.
Yang berubah hanya **policy RLS**-nya (lihat bagian 4).

## 4. Rencana RLS

| Tabel | anon | service_role |
|---|---|---|
| `syd_categories` | SELECT | all |
| `syd_registrations` | **deny** | all |
| `syd_transactions` | **deny** | all |
| `syd_contact_messages` | INSERT saja | all |
| `admin_users` | deny (policy rekursif dihapus) | all |

Kondisi sekarang yang diperbaiki: `registrations` & `transactions_history` punya policy
`Enable read access for all users (USING true)` → **anon bisa membaca PII**;
`admin_users` punya policy rekursif → query anon error 500.

## 5. Alur Midtrans (tanpa BIB)

```
POST /api/registrations
  insert syd_registrations (payment_status='pending',
                            external_order_id='SYD-<registration_number>-<ts>',
                            consent_given_at=now())
  createSnapTransaction() → token + redirect_url

POST /api/webhooks/midtrans   (signature WAJIB divalidasi semua environment)
  find by external_order_id
  upsert syd_transactions ON CONFLICT (external_order_id)
  update syd_registrations: payment_status, payment_method,
                           external_transaction_id, payment_date
  if paid → increment syd_categories.current_participants (sekali saja, idempotent)
  kirim email (skip bila sudah pernah terkirim)
```

## 6. Pemetaan data lama

| Sumber | Tujuan | Catatan |
|---|---|---|
| `category_features.feature` | `syd_categories.features` | `array_agg(feature ORDER BY display_order)` per kategori |
| `registrations_v2.unique_code` (84) | `syd_registrations.registration_number` | |
| `registrations_v2.instagram` | `syd_registrations.instagram` | `''` → `NULL` |
| `agreed_to_terms` & `agreed_to_privacy_policy` | `consent_given_at` | keduanya `true` → `agreed_at`; selain itu `NULL` |
| `transactions_history` | `syd_transactions` | `external_order_id = 'legacy-' || id` |
| `tshirt_size`, `running_experience`, `finish_time`, `bib_number`, `allergies` | **tidak disalin** ke `syd_registrations` | |
| `nationality`, `id_number` | disalin bila terisi (opsional) | |
| `categories.min_age`, `max_age`, `health_warning` | **tidak disalin** ke `syd_categories` | tabel `categories` lama tidak diarsipkan; nilai ini hilang setelah Fase 2 |

## 7. File migrasi

| File | Isi | Status |
|---|---|---|
| `20261126130000_syd_create_tables.sql` | 4 tabel + index + trigger | ✅ diterapkan |
| `20261126130100_syd_migrate_data.sql` | gabung features, salin 84 registrasi v2 | ✅ diterapkan |
| `20261126130200_syd_rls.sql` | RLS baru + tutup celah PII & anonymous write | ✅ diterapkan |
| `20261127125900_syd_migrate_contact_messages.sql` | salin riwayat pesan kontak lama secara idempotent | ✅ diterapkan; 8 baris |
| `20261127130000_syd_revoke_legacy_catalog_access.sql` | cabut akses anon ke katalog tabel lama setelah kode pindah | ✅ diterapkan; tabel sumber tetap utuh |
| `20261127140000_syd_drop_legacy_tables.sql` | hapus 6 tabel legacy setelah row count cocok dengan backup | ✅ diterapkan; keenam tabel sudah dihapus |

### Kenapa compatibility view dibatalkan
Rencana awal memakai view bernama lama agar kode tidak perlu diubah. Ini **tidak
dilayani** karena `category_features` yang ditulis admin (INSERT/DELETE) tidak bisa
diwakili oleh view di atas kolom array. Karena itu urutannya menjadi:
Fase 2 menambah objek baru → Fase 3 pindahkan kode ke `syd_*` → tahap pembersihan
berikutnya menghapus tabel lama yang tidak lagi dipakai. Data `registrations` v1 tidak
disalin dan tetap tersedia di backup pra-Fase-2.

## 8. Status persetujuan (final)

Legenda: ✅ disetujui · ✔️ disetujui dengan perubahan

| # | Butir | Status |
|---|---|---|
| A1 | `admin_users` tetap tanpa prefix | ✅ |
| A2 | `category_features` → `syd_categories.features text[]` | ✅ |
| A3 | hapus `tshirt_size`, `running_experience`, `finish_time`, `bib_number`, `bib_assigned_at` | ✅ |
| A4 | consent → `consent_given_at` | ✅ |
| A5 | `unique_code` → `registration_number` | ✅ |
| A6 | `instagram` opsional, **`strava_url` WAJIB (NOT NULL)** | ✔️ |
| A7 | BIB tidak dibuat sistem | ✅ |
| A8 | policy rekursif `admin_users` diperbaiki | ✅ |
| A9 | **`registrations` v1 DIHAPUS** (tidak diarsipkan) | ✔️ |
| A10 | nama tabel `syd_*` | ✅ |
| A11 | hapus `min_age`, `max_age`, `health_warning` | ✅ |
| A12 | `nationality`/`id_number` opsional, `allergies` dihapus | ✅ |
| A13 | `syd_transactions.external_order_id` UNIQUE | ✅ |
| A14 | tutup celah policy pada tabel lama | ✅ |

## 9. Log eksekusi Fase 2 — 2026-11-26

Backup: `~/Documents/Project/NextJs/syd-db-backups/2026-11-26/pre-fase2_{schema,data}.sql`

Dijalankan dalam **satu transaksi** (`BEGIN … COMMIT`) dengan `ON_ERROR_STOP=1`:

| Hasil | Nilai |
|---|---|
| `syd_categories` | 5 baris, semua punya `features` |
| `syd_registrations` | 84 baris (v2 saja; v1 tidak disalin) |
| `syd_transactions` | 0 baris (16 transaksi lama semuanya milik registrasi v1) |
| RLS | aktif di 4 tabel baru |
| anon → `syd_registrations` / `syd_transactions` / `syd_contact_messages` | **401 privilege denied** |
| anon → `syd_categories` | 206, 5 baris (dibutuhkan halaman register) |
| anon → `registrations` | **0 baris** (sebelumnya 12 — bocor PII) |
| anon → `transactions_history` | **0 baris** (sebelumnya 16) |
| anon → `admin_users` | 200 / 0 baris (sebelumnya HTTP 500 rekursif) |

### Konsekuensi data (disetujui)
- 12 registrasi v1 dan 16 transaksi lamanya **tidak** disalin; nilai lengkapnya tetap ada di backup `pre-fase2_data.sql`.
- Tabel `registrations` dan `transactions_history` lama telah **di-DROP** pada Fase 4 setelah row count cocok dengan backup terverifikasi.
- `strava_url` untuk 84 baris lama diisi string kosong `''`; CHECK mengizinkan `''` khusus data lama, sedangkan form baru wajib mengisi URL Strava valid.

## 10. Log pemindahan kode Fase 3 — 2026-11-27

- Service kontak dan inbox admin memakai `syd_contact_messages`; 8 pesan lama telah disalin.
- `GET /api/contact` yang sebelumnya mengembalikan seluruh pesan dihapus. Endpoint inbox
  admin, aksi ubah/hapus pesan, serta API admin kategori dan registrasi mensyaratkan sesi admin.
- Endpoint pendaftaran baru memakai `syd_registrations` dan Midtrans; webhook memverifikasi
  signature dan menyinkronkan `syd_transactions`.
- `transactions_history` (jamak) adalah tabel historis yang tidak dipakai kode aplikasi aktif;
  16 baris lamanya terkait registrasi v1 dan tidak disalin. Jalur pembayaran aktif menulis ke
  `syd_transactions` (0 baris sebelum transaksi Midtrans baru diterima). Jangan disamakan
  dengan `ritw_transactions_history`, tabel milik aplikasi lain.
- Verifikasi remote: kedua tabel katalog lama tidak lagi dapat dibaca role `anon`;
  `syd_categories` tetap dapat dibaca untuk halaman pendaftaran.
- Referensi katalog legacy pada halaman formulir v1 yang tidak aktif juga diarahkan ke
  `syd_categories`, sehingga kode sumber tidak bergantung pada `categories` lama.
- Migrasi remote dijalankan melalui `supabase db query --linked --file`, tanpa Docker.
- Validasi lokal: `npx tsc --noEmit`, ESLint pada file yang diubah, dan `npm run build`
  berhasil.

## 11. Pembersihan Fase 4 — 2026-11-27

Migrasi hanya dijalankan setelah jumlah baris pada tabel legacy cocok dengan dua backup
pra-Fase-2 (`pre-fase2_data.sql` dan `02_data.sql`):

| Tabel legacy | Baris terverifikasi di backup | Hasil |
|---|---:|---|
| `categories` | 5 | dihapus; 5 baris ada di `syd_categories` |
| `category_features` | 26 | dihapus; fitur digabung ke `syd_categories.features` |
| `registrations_v2` | 84 | dihapus; 84 baris ada di `syd_registrations` |
| `registrations` | 12 | dihapus; data hanya ada di backup |
| `transactions_history` | 16 | dihapus; seluruhnya terkait registrasi v1 dan ada di backup |
| `contact_messages` | 8 | dihapus; 8 baris ada di `syd_contact_messages` |

Migrasi memakai transaksi dan tidak menggunakan `CASCADE`. Sebelum drop, migrasi menolak
berjalan jika jumlah baris salah satu tabel berubah dari jumlah pada backup. Foreign key
legacy dihapus dengan urutan child-first. `admin_users` dan tabel aplikasi lain, termasuk
`ritw_transactions_history`, tidak disentuh. Setelah migrasi, verifikasi remote menunjukkan
5 kategori, 84 registrasi, dan 8 pesan kontak tetap ada di tabel `syd_*`.

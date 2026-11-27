# Supabase — alur kerja tanpa Docker

Database project ini **dipakai bersama aplikasi lain** pada project Supabase yang sama
(`biyurtytnwlmxuninybb`). Karena itu:

- Jangan pernah `DROP`/`ALTER` tabel milik aplikasi lain (`ss_*`, `ra_*`, `ritw_*`, `events`, `participants`).
- Semua perubahan skema **hanya** untuk tabel aplikasi ini.
- Tidak ada uji lokal: migrasi dijalankan langsung ke database remote.

## Perintah yang tersedia

| Perintah | Fungsi | Butuh Docker? |
|---|---|---|
| `npm run gen:types` | Regenerasi `src/types/supabase.ts` dari skema remote | Tidak |
| `npm run db:backup` | Dump skema ke `../syd-db-backups/<tanggal>/schema.sql` (butuh `SUPABASE_DB_URL`) | Tidak |
| `npm run db:apply -- <file.sql>` | Jalankan satu file SQL langsung via `psql` (butuh `SUPABASE_DB_URL`) | Tidak |
| `supabase db query --linked --file <file.sql>` | Jalankan SQL pada project remote yang tertaut melalui Supabase CLI | Tidak |

## Variabel yang dibutuhkan

`SUPABASE_DB_URL` (jangan commit) contoh bentuknya:

```
postgresql://postgres.<ref>:<password>@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

## Alur perubahan skema

1. `npm run db:backup` — snapshot sebelum perubahan.
2. Tambah file baru di `supabase/migrations/` dengan nama `<YYYYMMDDHHMMSS>_<deskripsi>.sql`.
3. Jalankan `supabase db query --linked --file supabase/migrations/<file>.sql`
   (CLI harus sudah login dan project tertaut). Alternatifnya, gunakan `npm run db:apply`
   bila `psql` dan `SUPABASE_DB_URL` tersedia.
4. Verifikasi dengan query SQL langsung, lalu `npm run gen:types`.

## Catatan tentang riwayat migrasi

Tabel `supabase_migrations.schema_migrations` dipakai bersama aplikasi lain dan saat ini
hanya berisi `20260720063537_baseline_schema` (milik aplikasi `ss_*`). Jangan menjalankan
`supabase db push` atau `supabase migration repair` tanpa berkoordinasi — entri tambahan di tabel itu membuat
`db pull`/`db diff` milik aplikasi lain gagal.

`design/schema-snapshot-2026-11-26.sql` adalah **snapshot** skema public saat 2026-11-26
(tanpa tabel `ss_*`). Ini file referensi, **bukan migrasi** — jangan dijalankan.

## Contoh aman menjalankan migrasi

Jalur langsung via Supabase CLI tidak memerlukan Docker:

```bash
supabase db query --linked --file supabase/migrations/<file>.sql
```

Alternatif menggunakan PostgreSQL client: bungkus dalam satu transaksi agar gagal di tengah jalan tidak meninggalkan skema setengah jadi:

```bash
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 \
  -c "BEGIN" -f supabase/migrations/<file>.sql -c "COMMIT"
```

Bila ada error, transaksi otomatis di-rollback (`ON_ERROR_STOP=1` menghentikan sesi).

## Riwayat eksekusi

| Tanggal | File | Hasil |
|---|---|---|
| 2026-11-26 | `20261126130000_syd_create_tables.sql` | 4 tabel `syd_*` dibuat |
| 2026-11-26 | `20261126130100_syd_migrate_data.sql` | 5 kategori + 84 registrasi disalin |
| 2026-11-26 | `20261126130200_syd_rls.sql` | RLS aktif, celah PII & policy rekursif ditutup |
| 2026-11-27 | `20261127125900_syd_migrate_contact_messages.sql` | 8 pesan kontak disalin; tabel lama dipertahankan |
| 2026-11-27 | `20261127130000_syd_revoke_legacy_catalog_access.sql` | akses anon ke `categories` dan `category_features` dicabut |
| 2026-11-27 | `20261127140000_syd_drop_legacy_tables.sql` | 6 tabel legacy dihapus setelah row count cocok dengan backup |

Backup sebelum eksekusi: `../syd-db-backups/2026-11-26/pre-fase2_{schema,data}.sql`

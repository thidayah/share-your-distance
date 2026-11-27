-- =============================================================================
-- Fase 2 — RLS untuk tabel `syd_*` + penutupan celah keamanan yang aktif
--
-- Temuan yang ditutup:
--   1. anon bisa membaca SELURUH registrations & transactions_history
--      (policy "Enable read access for all users" USING (true)) -> PII bocor.
--   2. anon bisa INSERT ke categories & category_features
--      (policy INSERT dengan WITH CHECK true).
--   3. policy admin_users rekursif (auth.uid() IN (SELECT ... FROM admin_users))
--      -> setiap query anon berakhir HTTP 500.
--
-- Catatan: aplikasi membaca katalog kategori dari browser memakai anon key
-- (src/app/register/[id]/page.tsx), jadi `syd_categories` HARUS tetap bisa
-- dibaca anon. Selain itu semua akses lewat service_role (bypass RLS).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Tabel baru: RLS aktif, hanya katalog yang boleh dibaca publik
-- ---------------------------------------------------------------------------
ALTER TABLE public.syd_categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syd_registrations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syd_transactions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syd_contact_messages  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS syd_categories_public_read ON public.syd_categories;
CREATE POLICY syd_categories_public_read
    ON public.syd_categories
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Data pribadi: tidak ada policy = tidak ada akses untuk anon/authenticated.
DROP POLICY IF EXISTS syd_registrations_no_public ON public.syd_registrations;
DROP POLICY IF EXISTS syd_transactions_no_public  ON public.syd_transactions;
DROP POLICY IF EXISTS syd_contact_messages_no_public ON public.syd_contact_messages;

-- Defense in depth: cabut hak tabel langsung.
REVOKE ALL ON public.syd_categories       FROM anon, authenticated;
REVOKE ALL ON public.syd_registrations    FROM anon, authenticated;
REVOKE ALL ON public.syd_transactions     FROM anon, authenticated;
REVOKE ALL ON public.syd_contact_messages FROM anon, authenticated;

GRANT SELECT ON public.syd_categories TO anon, authenticated;
GRANT ALL ON public.syd_categories       TO service_role;
GRANT ALL ON public.syd_registrations    TO service_role;
GRANT ALL ON public.syd_transactions     TO service_role;
GRANT ALL ON public.syd_contact_messages TO service_role;

-- ---------------------------------------------------------------------------
-- 2. Tabel lama: tutup celah yang sedang aktif
--    (hanya policy; struktur & data tidak diubah)
-- ---------------------------------------------------------------------------

-- 2a. PII: hentikan pembacaan publik atas data pendaftar & transaksi.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.registrations;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.transactions_history;

-- 2b. Anonymous write: tidak ada kode yang membutuhkannya
--     (admin memakai service_role).
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.categories;
DROP POLICY IF EXISTS "Enable insert for public" ON public.category_features;

-- 2c. Policy rekursif pada admin_users.
DROP POLICY IF EXISTS "Admin users can view all admin users" ON public.admin_users;

-- CATATAN: policy SELECT publik pada `categories` & `category_features` SENGAJA
-- dipertahankan sampai kode dipindahkan ke `syd_categories` (Fase 3), karena
-- halaman /register/[id] masih membacanya dari browser dengan anon key.

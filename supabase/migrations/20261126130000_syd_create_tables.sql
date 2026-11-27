-- =============================================================================
-- Fase 2 (draft, revisi 2) — CREATE tabel aplikasi dengan prefix `syd_`
--
-- Sifat: ADDITIVE. Tidak mengubah/menghapus tabel yang sudah ada.
-- Belum dijalankan ke database.
--
-- Revisi 2 (permintaan pemilik proyek):
--   * `category_features` dilebur ke `syd_categories.features` (array)
--   * kolom dihapus: tshirt_size, running_experience, bib_number,
--     bib_assigned_at, finish_time
--   * consent digabung jadi satu kolom: consent_given_at
--   * tabel `admin_users` TIDAK di-rename (tetap `public.admin_users`)
--   * tabel `syd_bib_counters` dihapus dari desain (tidak ada BIB lagi)
--   * revisi 3: `syd_categories` tanpa min_age/max_age/health_warning;
--     `syd_registrations` tanpa `allergies`; `nationality` & `id_number` opsional
--
-- Project Supabase ini dipakai bersama aplikasi lain. File ini HANYA membuat
-- objek ber-prefix `syd_`.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Kategori (fitur "Termasuk" disimpan sebagai array di sini)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.syd_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name character varying(100) NOT NULL,
    description text NOT NULL,
    price integer NOT NULL,
    distance character varying(50) NOT NULL,
    image_url character varying(500),
    features text[] NOT NULL DEFAULT '{}'::text[],
    recommended boolean DEFAULT false,
    max_participants integer,
    current_participants integer DEFAULT 0,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT syd_categories_price_check CHECK (price >= 0),
    CONSTRAINT syd_categories_current_participants_check CHECK (current_participants >= 0),
    CONSTRAINT syd_categories_max_participants_check CHECK (max_participants > 0),
    CONSTRAINT syd_categories_valid_participants CHECK (
        max_participants IS NULL OR current_participants <= max_participants
    )
);

CREATE INDEX IF NOT EXISTS idx_syd_categories_display_order ON public.syd_categories USING btree (display_order);
CREATE INDEX IF NOT EXISTS idx_syd_categories_recommended ON public.syd_categories USING btree (recommended);
CREATE INDEX IF NOT EXISTS idx_syd_categories_features ON public.syd_categories USING gin (features);

-- ---------------------------------------------------------------------------
-- 2. Registrasi (kanonik, gabungan v1 + v2)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.syd_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number character varying(30) NOT NULL,
    category_id uuid NOT NULL
        CONSTRAINT syd_registrations_category_id_fkey
        REFERENCES public.syd_categories (id) ON DELETE RESTRICT,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    date_of_birth date NOT NULL,
    gender character varying(10),
    instagram character varying(255),
    strava_url text NOT NULL,
    -- Opsional: tidak dikumpulkan form saat ini (nullable, tanpa default)
    nationality character varying(50),
    id_number character varying(50),
    emergency_contact_name character varying(255) NOT NULL,
    emergency_contact_phone character varying(20) NOT NULL,
    emergency_contact_relationship character varying(255) NOT NULL,
    medical_conditions text,
    total_amount integer NOT NULL,
    payment_status character varying(20) DEFAULT 'pending',
    payment_method character varying(50),
    external_order_id character varying(100),
    external_transaction_id character varying(100),
    payment_date timestamp with time zone,
    consent_given_at timestamp with time zone,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT syd_registrations_registration_number_key UNIQUE (registration_number),
    -- Format baru: SYD26-MQA123500 (SYD + 2 digit tahun + 3 huruf + 6 angka).
    -- Pola longgar dipakai agar nomor lama v1 (SYD25-0001) tetap valid saat migrasi.
    CONSTRAINT syd_registrations_registration_number_format_check CHECK (
        registration_number ~ '^SYD[0-9]{2}-[A-Z0-9]{4,12}$'
    ),
    CONSTRAINT syd_registrations_external_order_id_key UNIQUE (external_order_id),
    CONSTRAINT syd_registrations_email_format_check CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT syd_registrations_gender_check CHECK (
        gender IS NULL OR gender IN ('male', 'female', 'other')
    ),
    CONSTRAINT syd_registrations_payment_status_check CHECK (
        payment_status IN ('pending', 'paid', 'failed', 'expired', 'refunded', 'cancelled')
    ),
    CONSTRAINT syd_registrations_total_amount_check CHECK (total_amount >= 0),
    -- Strava wajib. String kosong hanya dipakai baris lama yang belum punya data.
    CONSTRAINT syd_registrations_strava_url_check CHECK (
        strava_url = '' OR strava_url ~* '^https://(www\.)?strava\.com/'
    ),
    -- Batas umur tidak lagi diatur kategori (min_age/max_age dihapus), jadi
    -- database hanya memastikan tanggal lahir bukan tanggal masa depan.
    CONSTRAINT syd_registrations_valid_dob_check CHECK (date_of_birth <= CURRENT_DATE)
);

CREATE INDEX IF NOT EXISTS idx_syd_registrations_created_at ON public.syd_registrations USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_syd_registrations_payment_status ON public.syd_registrations USING btree (payment_status);
CREATE INDEX IF NOT EXISTS idx_syd_registrations_category_id ON public.syd_registrations USING btree (category_id);
CREATE INDEX IF NOT EXISTS idx_syd_registrations_email ON public.syd_registrations USING btree (email);
CREATE INDEX IF NOT EXISTS idx_syd_registrations_phone ON public.syd_registrations USING btree (phone);
CREATE INDEX IF NOT EXISTS idx_syd_registrations_category_status ON public.syd_registrations USING btree (category_id, payment_status);

-- ---------------------------------------------------------------------------
-- 3. Transaksi Midtrans
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.syd_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id uuid NOT NULL
        CONSTRAINT syd_transactions_registration_id_fkey
        REFERENCES public.syd_registrations (id) ON DELETE CASCADE,
    external_order_id character varying(100) NOT NULL,
    external_transaction_id character varying(100),
    status character varying(30),
    status_code character varying(5),
    payment_type character varying(50),
    fraud_status character varying(20),
    amount integer NOT NULL,
    currency character varying(3) DEFAULT 'IDR',
    signature_verified boolean DEFAULT false,
    gateway_response jsonb,
    time timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT syd_transactions_external_order_id_key UNIQUE (external_order_id),
    CONSTRAINT syd_transactions_amount_check CHECK (amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_syd_transactions_registration_id ON public.syd_transactions USING btree (registration_id);
CREATE INDEX IF NOT EXISTS idx_syd_transactions_external_transaction_id ON public.syd_transactions USING btree (external_transaction_id);
CREATE INDEX IF NOT EXISTS idx_syd_transactions_status ON public.syd_transactions USING btree (status);

-- ---------------------------------------------------------------------------
-- 4. Pesan kontak
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.syd_contact_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    category text,
    subject text,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_syd_contact_messages_created_at ON public.syd_contact_messages USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_syd_contact_messages_is_read ON public.syd_contact_messages USING btree (is_read);

-- ---------------------------------------------------------------------------
-- 5. Trigger updated_at (memakai fungsi yang sudah ada di database)
--    admin_users tidak dibuat ulang — tabel itu tetap dipakai apa adanya.
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS update_syd_categories_updated_at ON public.syd_categories;
CREATE TRIGGER update_syd_categories_updated_at
    BEFORE UPDATE ON public.syd_categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_syd_registrations_updated_at ON public.syd_registrations;
CREATE TRIGGER update_syd_registrations_updated_at
    BEFORE UPDATE ON public.syd_registrations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_syd_transactions_updated_at ON public.syd_transactions;
CREATE TRIGGER update_syd_transactions_updated_at
    BEFORE UPDATE ON public.syd_transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- Fase 2 — salin data lama ke tabel `syd_*`
--
-- Additive & idempotent: aman dijalankan ulang (ON CONFLICT DO NOTHING).
-- Sumber dibiarkan utuh; tidak ada tabel lama yang diubah.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Kategori (+ fitur digabung menjadi array, urut display_order)
-- ---------------------------------------------------------------------------
INSERT INTO public.syd_categories (
    id, name, description, price, distance, image_url, features,
    recommended, max_participants, current_participants,
    display_order, is_active, created_at, updated_at
)
SELECT
    c.id,
    c.name,
    c.description,
    c.price,
    c.distance,
    c.image_url,
    COALESCE(
        (
            SELECT array_agg(f.feature ORDER BY f.display_order, f.feature)
            FROM public.category_features f
            WHERE f.category_id = c.id
        ),
        '{}'::text[]
    ),
    COALESCE(c.recommended, false),
    c.max_participants,
    COALESCE(c.current_participants, 0),
    COALESCE(c.display_order, 0),
    COALESCE(c.is_active, true),
    c.created_at,
    c.updated_at
FROM public.categories c
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Registrasi v2 (84 baris) — unique_code menjadi registration_number
--    Data v1 (12 baris) TIDAK disalin: tabel lama akan dihapus (keputusan A9).
-- ---------------------------------------------------------------------------
INSERT INTO public.syd_registrations (
    id, registration_number, category_id, full_name, email, phone, date_of_birth,
    gender, instagram, strava_url, nationality, id_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    medical_conditions, total_amount, payment_status, payment_method,
    external_order_id, external_transaction_id, payment_date,
    consent_given_at, ip_address, created_at, updated_at
)
SELECT
    r.id,
    r.unique_code,
    r.category_id,
    r.full_name,
    r.email,
    r.phone,
    r.date_of_birth,
    NULLIF(r.gender, ''),
    NULLIF(r.instagram, ''),
    '',
    NULL,
    NULL,
    COALESCE(NULLIF(r.emergency_contact_name, ''), '-'),
    COALESCE(NULLIF(r.emergency_contact_phone, ''), '-'),
    COALESCE(NULLIF(r.emergency_contact_relationship, ''), '-'),
    r.medical_conditions,
    r.total_amount,
    COALESCE(r.payment_status, 'pending'),
    NULL,
    NULL,
    NULL,
    r.payment_date,
    NULL,
    NULL,
    COALESCE(r.registration_date, r.created_at),
    r.updated_at
FROM public.registrations_v2 r
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 4. Riwayat transaksi (16 baris)
-- ---------------------------------------------------------------------------
INSERT INTO public.syd_transactions (
    id, registration_id, external_order_id, external_transaction_id,
    status, status_code, payment_type, fraud_status,
    amount, currency, signature_verified, gateway_response, time,
    created_at, updated_at
)
SELECT
    t.id,
    t.registration_id,
    'legacy-' || t.id::text,
    t.external_transaction_id,
    t.status,
    NULL,
    t.payment_type,
    NULL,
    t.amount,
    COALESCE(t.currency, 'IDR'),
    false,
    t.gateway_response,
    t.time,
    t.created_at,
    t.updated_at
FROM public.transactions_history t
WHERE EXISTS (
    SELECT 1 FROM public.syd_registrations sr WHERE sr.id = t.registration_id
)
ON CONFLICT DO NOTHING;

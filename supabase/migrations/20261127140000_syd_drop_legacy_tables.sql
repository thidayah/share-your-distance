-- Remove the old Share Your Distance tables only after verifying their
-- contents still match the pre-Fase-2 backups.
BEGIN;

DO $$
DECLARE
    expected record;
    actual_rows bigint;
BEGIN
    FOR expected IN
        SELECT * FROM (VALUES
            ('categories', 5::bigint),
            ('category_features', 26::bigint),
            ('registrations_v2', 84::bigint),
            ('registrations', 12::bigint),
            ('transactions_history', 16::bigint),
            ('contact_messages', 8::bigint)
        ) AS expected_counts(table_name, row_count)
    LOOP
        IF to_regclass(format('public.%I', expected.table_name)) IS NULL THEN
            CONTINUE;
        END IF;

        EXECUTE format('SELECT count(*) FROM public.%I', expected.table_name)
        INTO actual_rows;

        IF actual_rows <> expected.row_count THEN
            RAISE EXCEPTION
                'Refusing to drop public.%: expected % rows from verified backup, found %',
                expected.table_name, expected.row_count, actual_rows;
        END IF;
    END LOOP;
END
$$;

-- Drop referencing tables first; do not use CASCADE so unexpected dependencies
-- fail the migration instead of being removed implicitly.
DROP TABLE IF EXISTS public.category_features;
DROP TABLE IF EXISTS public.registrations_v2;
DROP TABLE IF EXISTS public.transactions_history;
DROP TABLE IF EXISTS public.registrations;
DROP TABLE IF EXISTS public.contact_messages;
DROP TABLE IF EXISTS public.categories;

COMMIT;

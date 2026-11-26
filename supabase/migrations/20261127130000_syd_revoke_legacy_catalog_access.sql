-- The frontend and admin APIs now read the syd_categories catalog.
-- Retire anonymous access to the legacy catalog tables; keep their data intact
-- until the separately approved legacy-table cleanup.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.category_features;

REVOKE ALL ON public.categories FROM anon, authenticated;
REVOKE ALL ON public.category_features FROM anon, authenticated;

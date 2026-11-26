-- Preserve the existing contact inbox when the application switches tables.
-- Re-runnable without duplicating any message IDs.
INSERT INTO public.syd_contact_messages (
    id, name, email, category, subject, message, is_read, created_at
)
SELECT
    id, name, email, category, subject, message, COALESCE(is_read, false), created_at
FROM public.contact_messages
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- SYD baseline — snapshot of the SHARED Supabase project `biyurtytnwlmxuninybb`
-- taken 2026-11-26 with pg_dump 17.2 (schema only, no owners/ACLs).
--
-- The database is shared with other applications. This file intentionally
-- EXCLUDES the four `ss_*` tables, which belong to another app and are already
-- tracked by migration `20260720063537_baseline_schema`.
--
-- It includes the public schema exactly as it exists on the remote project:
--   app tables : categories, category_features, registrations, registrations_v2,
--                transactions_history, contact_messages, admin_users
--   foreign    : events, participants, ra_routes, ra_submissions,
--                ritw_transactions_history  (kept for local parity so that
--                `supabase db diff --linked` stays clean; never modified here)
--
-- This migration is recorded as APPLIED on the remote project
-- (`supabase migration repair --status applied <version>`); it exists so that a
-- local `supabase db reset` reproduces the remote schema faithfully. Future
-- schema changes must be added as NEW migrations.
-- =============================================================================

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone,
    is_active boolean DEFAULT true
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    price integer NOT NULL,
    distance character varying(50) NOT NULL,
    image_url character varying(500),
    recommended boolean DEFAULT false,
    max_participants integer,
    current_participants integer DEFAULT 0,
    min_age integer,
    max_age integer,
    health_warning text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    CONSTRAINT categories_current_participants_check CHECK ((current_participants >= 0)),
    CONSTRAINT categories_max_age_check CHECK ((max_age >= 0)),
    CONSTRAINT categories_max_participants_check CHECK ((max_participants > 0)),
    CONSTRAINT categories_min_age_check CHECK ((min_age >= 0)),
    CONSTRAINT categories_price_check CHECK ((price >= 0)),
    CONSTRAINT valid_age_range CHECK (((max_age IS NULL) OR (min_age IS NULL) OR (max_age >= min_age))),
    CONSTRAINT valid_participants CHECK (((max_participants IS NULL) OR (current_participants <= max_participants)))
);


--
-- Name: category_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid NOT NULL,
    feature text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    category text,
    subject text,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    is_read boolean DEFAULT false
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    date date NOT NULL,
    location character varying(255) NOT NULL,
    distance character varying(50) NOT NULL,
    elevation character varying(50),
    price integer DEFAULT 0 NOT NULL,
    max_participants integer DEFAULT 100 NOT NULL,
    current_participants integer DEFAULT 0 NOT NULL,
    registration_open boolean DEFAULT true,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone_number character varying(20) NOT NULL,
    birth_date date NOT NULL,
    gender character varying(10),
    emergency_contact_name character varying(255),
    emergency_contact_phone character varying(20),
    medical_notes text,
    registration_date timestamp with time zone DEFAULT now(),
    unique_code character varying(20) NOT NULL,
    payment_status character varying(20) DEFAULT 'pending'::character varying,
    payment_amount integer NOT NULL,
    payment_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT participants_gender_check CHECK (((gender)::text = ANY ((ARRAY['male'::character varying, 'female'::character varying, 'other'::character varying])::text[]))),
    CONSTRAINT participants_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'expired'::character varying, 'cancelled'::character varying])::text[])))
);


--
-- Name: ra_routes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ra_routes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    city text,
    distance_km numeric,
    thumbnail_url text,
    gpx_file_url text,
    geojson jsonb NOT NULL,
    start_lat double precision,
    start_lng double precision,
    status text DEFAULT 'approved'::text,
    created_at timestamp with time zone DEFAULT now(),
    category text,
    source_url text
);


--
-- Name: ra_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ra_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    location text,
    strava_url text NOT NULL,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registrations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    registration_number character varying(20) NOT NULL,
    category_id uuid NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    date_of_birth date NOT NULL,
    gender character varying(10),
    nationality character varying(50) DEFAULT 'Indonesian'::character varying,
    id_number character varying(50),
    tshirt_size character varying(5),
    running_experience character varying(100),
    emergency_contact_name character varying(100) NOT NULL,
    emergency_contact_phone character varying(20) NOT NULL,
    emergency_contact_relationship character varying(50) NOT NULL,
    medical_conditions text,
    allergies text,
    total_amount integer NOT NULL,
    payment_status character varying(20) DEFAULT 'pending'::character varying,
    payment_method character varying(50),
    external_payment_id character varying(100),
    payment_date timestamp with time zone,
    bib_number character varying(30),
    bib_assigned_at timestamp with time zone,
    finish_time timestamp with time zone,
    agreed_to_terms boolean DEFAULT false NOT NULL,
    agreed_to_privacy_policy boolean DEFAULT false NOT NULL,
    agreed_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    ip_address inet,
    CONSTRAINT email_format_check CHECK (((email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)),
    CONSTRAINT registrations_gender_check CHECK (((gender)::text = ANY ((ARRAY['male'::character varying, 'female'::character varying, 'other'::character varying])::text[]))),
    CONSTRAINT registrations_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'failed'::character varying, 'refunded'::character varying, 'cancelled'::character varying])::text[]))),
    CONSTRAINT registrations_total_amount_check CHECK ((total_amount >= 0)),
    CONSTRAINT registrations_tshirt_size_check CHECK (((tshirt_size)::text = ANY ((ARRAY['XS'::character varying, 'S'::character varying, 'M'::character varying, 'L'::character varying, 'XL'::character varying, 'XXL'::character varying])::text[]))),
    CONSTRAINT valid_age_check CHECK ((date_of_birth <= (CURRENT_DATE - '10 years'::interval)))
);


--
-- Name: registrations_v2; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registrations_v2 (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    date_of_birth date NOT NULL,
    gender character varying(10),
    instagram character varying(255) NOT NULL,
    emergency_contact_name character varying(255),
    emergency_contact_phone character varying(20),
    emergency_contact_relationship character varying(255),
    medical_conditions text,
    registration_date timestamp with time zone DEFAULT now(),
    unique_code character varying(20) NOT NULL,
    payment_status character varying(20) DEFAULT 'pending'::character varying,
    payment_date timestamp with time zone,
    total_amount integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT registrations_v2_gender_check CHECK (((gender)::text = ANY ((ARRAY['male'::character varying, 'female'::character varying, 'other'::character varying])::text[]))),
    CONSTRAINT registrations_v2_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'expired'::character varying, 'cancelled'::character varying])::text[])))
);


--
-- Name: ritw_transactions_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ritw_transactions_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    participant_id uuid NOT NULL,
    transaction_id character varying(100) NOT NULL,
    transaction_status character varying,
    payment_type character varying(50) NOT NULL,
    gross_amount integer NOT NULL,
    transaction_time timestamp with time zone,
    raw_response jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT ritw_transactions_history_gross_amount_check CHECK ((gross_amount >= 0))
);


--
-- Name: transactions_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    registration_id uuid NOT NULL,
    external_transaction_id character varying(100) NOT NULL,
    payment_type character varying(50) NOT NULL,
    amount integer NOT NULL,
    currency character varying(3) DEFAULT 'IDR'::character varying,
    gateway_response jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    "time" timestamp with time zone,
    status character varying,
    CONSTRAINT payment_transactions_amount_check CHECK ((amount >= 0))
);


--
-- Name: admin_users admin_users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_key UNIQUE (email);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_key UNIQUE (username);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: category_features category_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_features
    ADD CONSTRAINT category_features_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: participants participants_unique_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_unique_code_key UNIQUE (unique_code);


--
-- Name: transactions_history payment_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions_history
    ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);


--
-- Name: ra_routes ra_routes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ra_routes
    ADD CONSTRAINT ra_routes_pkey PRIMARY KEY (id);


--
-- Name: ra_routes ra_routes_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ra_routes
    ADD CONSTRAINT ra_routes_slug_key UNIQUE (slug);


--
-- Name: ra_submissions ra_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ra_submissions
    ADD CONSTRAINT ra_submissions_pkey PRIMARY KEY (id);


--
-- Name: registrations registrations_bib_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_bib_number_key UNIQUE (bib_number);


--
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- Name: registrations registrations_registration_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_registration_number_key UNIQUE (registration_number);


--
-- Name: registrations_v2 registrations_v2_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations_v2
    ADD CONSTRAINT registrations_v2_pkey PRIMARY KEY (id);


--
-- Name: registrations_v2 registrations_v2_unique_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations_v2
    ADD CONSTRAINT registrations_v2_unique_code_key UNIQUE (unique_code);


--
-- Name: ritw_transactions_history ritw_transactions_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ritw_transactions_history
    ADD CONSTRAINT ritw_transactions_history_pkey PRIMARY KEY (id);


--
-- Name: idx_admin_users_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_users_created_at ON public.admin_users USING btree (created_at);


--
-- Name: idx_admin_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_users_email ON public.admin_users USING btree (email);


--
-- Name: idx_admin_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_users_username ON public.admin_users USING btree (username);


--
-- Name: idx_categories_display_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_display_order ON public.categories USING btree (display_order);


--
-- Name: idx_categories_price; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_price ON public.categories USING btree (price);


--
-- Name: idx_categories_recommended; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_recommended ON public.categories USING btree (recommended);


--
-- Name: idx_category_features_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_category_features_category_id ON public.category_features USING btree (category_id);


--
-- Name: idx_events_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_date ON public.events USING btree (date);


--
-- Name: idx_events_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_location ON public.events USING btree (location);


--
-- Name: idx_events_registration_open; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_registration_open ON public.events USING btree (registration_open);


--
-- Name: idx_participants_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participants_email ON public.participants USING btree (email);


--
-- Name: idx_participants_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participants_event_id ON public.participants USING btree (event_id);


--
-- Name: idx_participants_event_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participants_event_status ON public.participants USING btree (event_id, payment_status);


--
-- Name: idx_participants_payment_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participants_payment_status ON public.participants USING btree (payment_status);


--
-- Name: idx_participants_phone_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participants_phone_number ON public.participants USING btree (phone_number);


--
-- Name: idx_participants_registration_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participants_registration_date ON public.participants USING btree (registration_date);


--
-- Name: idx_participants_unique_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participants_unique_code ON public.participants USING btree (unique_code);


--
-- Name: idx_payment_transactions_external_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payment_transactions_external_id ON public.transactions_history USING btree (external_transaction_id);


--
-- Name: idx_payment_transactions_registration_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payment_transactions_registration_id ON public.transactions_history USING btree (registration_id);


--
-- Name: idx_registrations_bib_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_bib_number ON public.registrations USING btree (bib_number);


--
-- Name: idx_registrations_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_category_id ON public.registrations USING btree (category_id);


--
-- Name: idx_registrations_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_created_at ON public.registrations USING btree (created_at);


--
-- Name: idx_registrations_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_email ON public.registrations USING btree (email);


--
-- Name: idx_registrations_payment_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_payment_status ON public.registrations USING btree (payment_status);


--
-- Name: idx_registrations_registration_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_registration_number ON public.registrations USING btree (registration_number);


--
-- Name: idx_registrations_v2_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_v2_category_id ON public.registrations_v2 USING btree (category_id);


--
-- Name: idx_registrations_v2_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_v2_email ON public.registrations_v2 USING btree (email);


--
-- Name: idx_registrations_v2_event_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_v2_event_status ON public.registrations_v2 USING btree (category_id, payment_status);


--
-- Name: idx_registrations_v2_payment_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_v2_payment_status ON public.registrations_v2 USING btree (payment_status);


--
-- Name: idx_registrations_v2_phone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_v2_phone ON public.registrations_v2 USING btree (phone);


--
-- Name: idx_registrations_v2_registration_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_v2_registration_date ON public.registrations_v2 USING btree (registration_date);


--
-- Name: idx_registrations_v2_unique_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_registrations_v2_unique_code ON public.registrations_v2 USING btree (unique_code);


--
-- Name: admin_users update_admin_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: transactions_history update_payment_transactions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON public.transactions_history FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: registrations update_registrations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON public.registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: category_features category_features_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_features
    ADD CONSTRAINT category_features_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: participants participants_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: transactions_history payment_transactions_registration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions_history
    ADD CONSTRAINT payment_transactions_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.registrations(id) ON DELETE CASCADE;


--
-- Name: registrations registrations_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;


--
-- Name: registrations_v2 registrations_v2_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registrations_v2
    ADD CONSTRAINT registrations_v2_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: ritw_transactions_history ritw_transactions_history_participant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ritw_transactions_history
    ADD CONSTRAINT ritw_transactions_history_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: ra_routes Admin can manage routes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage routes" ON public.ra_routes USING ((auth.role() = 'authenticated'::text));


--
-- Name: ra_submissions Admin can manage submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage submissions" ON public.ra_submissions USING ((auth.role() = 'authenticated'::text));


--
-- Name: admin_users Admin users can view all admin users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin users can view all admin users" ON public.admin_users USING ((auth.uid() IN ( SELECT admin_users_1.id
   FROM public.admin_users admin_users_1)));


--
-- Name: ra_submissions Anyone can submit routes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit routes" ON public.ra_submissions FOR INSERT WITH CHECK (true);


--
-- Name: categories Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for authenticated users only" ON public.categories FOR INSERT WITH CHECK (true);


--
-- Name: category_features Enable insert for public; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for public" ON public.category_features FOR INSERT WITH CHECK (true);


--
-- Name: categories Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true);


--
-- Name: category_features Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.category_features FOR SELECT USING (true);


--
-- Name: registrations Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.registrations FOR SELECT USING (true);


--
-- Name: transactions_history Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.transactions_history FOR SELECT USING (true);


--
-- Name: ra_routes Public can view published routes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view published routes" ON public.ra_routes FOR SELECT USING ((status = 'published'::text));


--
-- Name: admin_users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

--
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- Name: category_features; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.category_features ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

--
-- Name: participants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

--
-- Name: ra_routes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ra_routes ENABLE ROW LEVEL SECURITY;

--
-- Name: ra_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ra_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: registrations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

--
-- Name: registrations_v2; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.registrations_v2 ENABLE ROW LEVEL SECURITY;

--
-- Name: ritw_transactions_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ritw_transactions_history ENABLE ROW LEVEL SECURITY;

--
-- Name: transactions_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.transactions_history ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


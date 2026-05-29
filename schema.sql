-- Disable all row level security for custom database authentication
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Custom Auth Users)
create table public.profiles (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  password_hash text not null,
  full_name text not null,
  phone_number text not null unique,
  role text not null check (role in ('student', 'admin')) default 'student',
  university_name text,
  college_name text,
  degree text,
  department_stream text,
  semester text,
  academic_session text,
  major_subject text,
  roll_number text,
  registration_number text,
  gender text,
  date_of_birth text,
  full_address text,
  city text,
  state text,
  pincode text,
  profile_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create database unique indexes for email and phone
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_number_idx ON public.profiles (phone_number);

-- 2. INTERNSHIPS TABLE
create table public.internships (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  requirements text[] default '{}'::text[],
  duration text not null default '3 Months',
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. QUESTIONS TABLE
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  internship_id uuid references public.internships(id) on delete cascade not null,
  question_text text not null,
  options jsonb not null, -- Array of strings e.g. ["Option A", "Option B", ...]
  correct_option_index integer not null check (correct_option_index >= 0 and correct_option_index <= 3),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TEST RESULTS TABLE
create table public.test_results (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  internship_id uuid references public.internships(id) on delete cascade not null,
  score integer not null,
  total_questions integer not null,
  percentage numeric(5, 2) not null,
  passed boolean not null,
  reference_number text,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Disable Row Level Security (RLS) on all tables to bypass Supabase Auth dependencies
alter table public.profiles disable row level security;
alter table public.internships disable row level security;
alter table public.questions disable row level security;
alter table public.test_results disable row level security;


-- ============================================================
-- DEFAULT ADMIN ACCOUNT SEED
-- Email   : admin@skillintern.com
-- Password: Shiwam@99
-- Hash    : SHA-256("Shiwam@99" + "skillintern-secure-salt-2026")
-- ============================================================
-- Run this in Supabase SQL Editor after creating the tables above.
-- Uses DO $$ ... END $$ so the INSERT is skipped if the admin already exists.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE email = 'admin@skillintern.com'
  ) THEN
    INSERT INTO public.profiles (email, password_hash, full_name, phone_number, department_stream, role)
    VALUES (
      'admin@skillintern.com',
      '789f3da85898dbd87df2003f8a2628910802bdeae2a2ba803aef231b38508990',
      'Super Admin',
      '0000000000',
      'Platform Administration',
      'admin'
    );
  END IF;
END $$;

-- ============================================================
-- PROFILE COMPLETION MIGRATION (For existing databases)
-- ============================================================
-- Run these queries in the Supabase SQL Editor if you already have the profiles table created.
--
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university_name text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college_name text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS degree text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department_stream text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS semester text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS academic_session text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS major_subject text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roll_number text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS registration_number text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_address text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pincode text;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completed boolean default false;

-- ============================================================
-- DATABASE SECURITY HARDENING
-- ============================================================

-- 1. Secure existing SECURITY DEFINER function public.rls_auto_enable() if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid 
    WHERE proname = 'rls_auto_enable' AND nspname = 'public'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM public, anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO postgres, service_role';
  END IF;
END $$;

-- 2. Prevent default EXECUTE privileges from being granted to PUBLIC for all future functions
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM authenticated;


-- 7. HTML DOCUMENT TEMPLATES TABLE
create table public.document_templates (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  name text not null,
  html_content text not null,
  is_visible boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Disable Row Level Security (RLS)
alter table public.document_templates disable row level security;






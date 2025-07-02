/*
  # Admin Panel Initial Migration (2024-07-10)
  This migration sets up only the tables and RLS needed for the frontend/admin panel.
  (events and blog_posts tables have been removed)
*/

-- ENUM Types
CREATE TYPE role_enum AS ENUM ('admin', 'super_admin');
CREATE TYPE program_status_enum AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE business_stage_enum AS ENUM ('idea', 'startup', 'existing');
CREATE TYPE application_status_enum AS ENUM ('pending', 'approved', 'rejected', 'waitlist');
CREATE TYPE graduation_status_enum AS ENUM ('enrolled', 'graduated', 'dropped_out');
CREATE TYPE testimonial_rating_enum AS ENUM ('1', '2', '3', '4', '5');
CREATE TYPE contact_status_enum AS ENUM ('new', 'in_progress', 'resolved', 'archived');
CREATE TYPE newsletter_status_enum AS ENUM ('active', 'unsubscribed', 'bounced');

-- 1. Tables

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role role_enum DEFAULT 'admin' NOT NULL,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  duration text NOT NULL,
  format text NOT NULL,
  max_participants integer DEFAULT 30,
  current_participants integer DEFAULT 0,
  start_date date,
  end_date date,
  application_deadline date,
  status program_status_enum DEFAULT 'upcoming' NOT NULL,
  featured boolean DEFAULT false,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  phone text,
  age integer,
  location text,
  business_idea text,
  business_stage business_stage_enum NOT NULL,
  program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
  application_status application_status_enum DEFAULT 'pending' NOT NULL,
  graduation_status graduation_status_enum DEFAULT 'enrolled' NOT NULL,
  notes text,
  applied_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_email_program UNIQUE (email, program_id)
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants(id) ON DELETE CASCADE,
  name text NOT NULL,
  business_name text,
  location text,
  quote text NOT NULL,
  achievement text,
  program_completed text,
  rating testimonial_rating_enum,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT false,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  subject text,
  message text NOT NULL,
  status contact_status_enum DEFAULT 'new' NOT NULL,
  admin_notes text,
  responded_at timestamptz,
  responded_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  name text,
  status newsletter_status_enum DEFAULT 'active' NOT NULL,
  source text DEFAULT 'website',
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for foreign key columns (for performance)
CREATE INDEX IF NOT EXISTS idx_participants_program_id ON participants(program_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_participant_id ON testimonials(participant_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_responded_by ON contact_submissions(responded_by);

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to each table
DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['admin_users', 'programs', 'participants', 'testimonials', 'contact_submissions', 'newsletter_subscribers']
  LOOP
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at();', tbl);
  END LOOP;
END;
$$;

-- 2. RLS (Row Level Security)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Public read access for programs, testimonials (published only)
CREATE POLICY "Public read access" ON programs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT TO anon, authenticated USING (is_published = true);

-- Public insert for contact forms and newsletter
CREATE POLICY "Public insert access" ON contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public insert access" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin full access (for service role or authenticated admin)
CREATE POLICY "Admin full access" ON admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON programs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON participants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON newsletter_subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Admin Authentication Function
-- SECURITY NOTE: For best practice, password hash verification should be done in the application layer using a strong algorithm (e.g., bcrypt). 
-- This function should only be used to fetch user data by username/email. Do NOT store or compare plain text passwords in SQL.
DROP FUNCTION IF EXISTS authenticate_admin(text, text);
CREATE OR REPLACE FUNCTION authenticate_admin(
  username_input text,
  password_input text
)
RETURNS TABLE(
  user_id uuid,
  username text,
  email text,
  full_name text,
  role text,
  success boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record admin_users%ROWTYPE;
BEGIN
  SELECT * INTO admin_record
  FROM admin_users
  WHERE admin_users.username = username_input
    AND admin_users.is_active = true;

  IF admin_record.id IS NOT NULL AND admin_record.password_hash = password_input THEN
    UPDATE admin_users 
    SET last_login = now(), updated_at = now()
    WHERE id = admin_record.id;
    RETURN QUERY SELECT
      admin_record.id,
      admin_record.username,
      admin_record.email,
      admin_record.full_name,
      admin_record.role,
      true;
  ELSE
    RETURN QUERY SELECT
      null::uuid,
      null::text,
      null::text,
      null::text,
      null::text,
      false;
  END IF;
END;
$$;

-- 5. Sample Admin User
INSERT INTO admin_users (username, email, password_hash, full_name, role)
VALUES ('impactinitiativenepal', 'admin@impactinitiativenepal.com', '@impact2025', 'Impact Initiative Nepal Admin', 'admin')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  is_active = true,
  updated_at = now();

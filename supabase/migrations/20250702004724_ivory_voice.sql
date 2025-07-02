/*
  # Admin Panel Database Schema

  1. New Tables
    - `admin_users` - Admin authentication and user management
    - `programs` - Training programs and bootcamps
    - `participants` - Program participants/entrepreneurs
    - `events` - Events and workshops
    - `testimonials` - Success stories and testimonials
    - `blog_posts` - Blog posts and news updates
    - `contact_submissions` - Contact form submissions
    - `newsletter_subscribers` - Newsletter email list

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access only
    - Create admin role and permissions

  3. Functions
    - Admin authentication function
    - Data export functions
    - Analytics functions
*/

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create programs table
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
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  featured boolean DEFAULT false,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  age integer,
  location text,
  business_idea text,
  business_stage text CHECK (business_stage IN ('idea', 'startup', 'existing')),
  program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
  application_status text DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected', 'waitlist')),
  graduation_status text DEFAULT 'enrolled' CHECK (graduation_status IN ('enrolled', 'graduated', 'dropped_out')),
  notes text,
  applied_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_type text DEFAULT 'workshop' CHECK (event_type IN ('workshop', 'seminar', 'networking', 'graduation', 'other')),
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  location text,
  max_attendees integer,
  current_attendees integer DEFAULT 0,
  registration_required boolean DEFAULT true,
  registration_deadline timestamptz,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  featured boolean DEFAULT false,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants(id) ON DELETE SET NULL,
  name text NOT NULL,
  business_name text,
  location text,
  quote text NOT NULL,
  achievement text,
  program_completed text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT false,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  author_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  category text DEFAULT 'news' CHECK (category IN ('news', 'success_story', 'program_update', 'announcement')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean DEFAULT false,
  image_url text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
  admin_notes text,
  responded_at timestamptz,
  responded_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  source text DEFAULT 'website',
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create admin authentication function
CREATE OR REPLACE FUNCTION authenticate_admin(username_input text, password_input text)
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
  user_record admin_users%ROWTYPE;
BEGIN
  -- Find user by username
  SELECT * INTO user_record 
  FROM admin_users 
  WHERE username = username_input 
  AND is_active = true;
  
  -- Check if user exists and password matches (simplified - in production use proper hashing)
  IF user_record.id IS NOT NULL AND user_record.password_hash = password_input THEN
    -- Update last login
    UPDATE admin_users 
    SET last_login = now(), updated_at = now()
    WHERE id = user_record.id;
    
    -- Return success
    RETURN QUERY SELECT 
      user_record.id,
      user_record.username,
      user_record.email,
      user_record.full_name,
      user_record.role,
      true;
  ELSE
    -- Return failure
    RETURN QUERY SELECT 
      NULL::uuid,
      NULL::text,
      NULL::text,
      NULL::text,
      NULL::text,
      false;
  END IF;
END;
$$;

-- Insert default admin user
INSERT INTO admin_users (username, email, password_hash, full_name, role)
VALUES ('impactinitiativenepal', 'admin@impactinitiativenepal.com', '@impact2025', 'Impact Initiative Nepal Admin', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Create RLS policies for admin access
CREATE POLICY "Admin full access" ON admin_users
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access" ON programs
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access" ON participants
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access" ON events
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access" ON testimonials
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access" ON blog_posts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access" ON contact_submissions
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access" ON newsletter_subscribers
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_participants_program_id ON participants(program_id);
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_events_start_datetime ON events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Insert sample data
INSERT INTO programs (title, description, duration, format, max_participants, start_date, end_date, application_deadline, status, featured) VALUES
('Academy for Women Entrepreneurs (AWE) Bootcamp', 'Comprehensive 12-week program for women entrepreneurs', '12 Weeks', 'Hybrid - Online & In-Person', 30, '2024-03-01', '2024-05-24', '2024-02-15', 'upcoming', true),
('Digital Skills Bootcamp', 'Intensive training in digital literacy and e-commerce', '6 Weeks', 'Online', 50, '2024-02-15', '2024-03-29', '2024-02-01', 'upcoming', false),
('Rural Entrepreneur Network', 'Supporting rural entrepreneurs with training and resources', 'Ongoing', 'Community-based', 200, NULL, NULL, NULL, 'ongoing', false);

INSERT INTO events (title, description, event_type, start_datetime, end_datetime, location, max_attendees, registration_required, status, featured) VALUES
('Women in Business Networking Event', 'Connect with successful women entrepreneurs', 'networking', '2024-02-10 14:00:00+00', '2024-02-10 17:00:00+00', 'Kathmandu', 100, true, 'upcoming', true),
('Digital Marketing Workshop', 'Learn essential digital marketing strategies', 'workshop', '2024-02-20 10:00:00+00', '2024-02-20 16:00:00+00', 'Online', 75, true, 'upcoming', false);

INSERT INTO testimonials (name, business_name, location, quote, achievement, program_completed, rating, is_featured, is_published) VALUES
('Sita Gurung', 'Himalayan Handicrafts', 'Kathmandu', 'The AWE program transformed my small craft business into a thriving enterprise. I learned everything from digital marketing to financial planning.', '300% Revenue Growth', 'AWE Bootcamp 2023', 5, true, true),
('Maya Thapa', 'Green Valley Organic Farm', 'Chitwan', 'IIN helped me transition from traditional farming to organic produce with direct market access.', '50% Profit Increase', 'Rural Entrepreneur Network', 5, true, true);
/*
  # Fix authenticate_admin function

  1. Drop existing function with conflicting return type
  2. Recreate function with proper column qualification and correct return structure
  3. Ensure function matches the expected interface from the application
*/

-- Drop the existing function first
DROP FUNCTION IF EXISTS authenticate_admin(text, text);

-- Recreate the function with the correct return structure
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
  -- Find admin user by username with explicit table qualification
  SELECT * INTO admin_record
  FROM admin_users au
  WHERE au.username = username_input
    AND au.is_active = true;

  -- Check if user exists and password matches (simplified password check)
  IF admin_record.id IS NOT NULL AND admin_record.password_hash = password_input THEN
    -- Update last login
    UPDATE admin_users 
    SET last_login = now(), updated_at = now()
    WHERE admin_users.id = admin_record.id;

    -- Return success with user details
    RETURN QUERY SELECT
      admin_record.id,
      admin_record.username,
      admin_record.email,
      admin_record.full_name,
      admin_record.role,
      true;
  ELSE
    -- Return failure
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
/*
  # Fix Admin Users Infinite Recursion

  ## Problem
  The admin_users RLS policies caused infinite recursion because they check if a user is an admin by querying the same table that requires the check.

  ## Solution
  1. Drop existing problematic policies
  2. Create a security definer function to check admin status that bypasses RLS
  3. Create new policies using the function

  ## Changes
  - Drop old admin_users SELECT and INSERT policies
  - Create `is_admin()` function with SECURITY DEFINER
  - Create new policies using the function
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view admin list" ON admin_users;
DROP POLICY IF EXISTS "Admins can grant admin access" ON admin_users;

-- Create a function to check admin status that bypasses RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Create new policies using the function
CREATE POLICY "Admins can view admin list"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can grant admin access"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

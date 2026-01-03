/*
  # Fix Admin Users Policy - Final Fix

  ## Problem
  The previous policy still had recursion because it checked admin_users to determine if user can view admin_users.

  ## Solution
  Allow ANY authenticated user to check if THEY are an admin (select their own row only).
  This breaks the recursion because we don't need to check admin status to read your own admin status.

  ## Changes
  - Drop all existing admin_users policies
  - Create simple policy: users can only see their own admin status
  - Keep the admin-only INSERT policy using the SECURITY DEFINER function
*/

-- Drop all existing policies on admin_users
DROP POLICY IF EXISTS "Users can check own admin status" ON admin_users;
DROP POLICY IF EXISTS "Admins can view admin list" ON admin_users;
DROP POLICY IF EXISTS "Admins can grant admin access" ON admin_users;

-- Allow users to check ONLY their own admin status (no recursion)
CREATE POLICY "Users can view own admin status"
  ON admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Keep admin-only INSERT using the SECURITY DEFINER function
CREATE POLICY "Admins can grant admin access"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

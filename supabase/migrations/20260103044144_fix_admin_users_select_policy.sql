/*
  # Fix Admin Users SELECT Policy

  ## Problem
  The SELECT policy for admin_users still causes recursion because it requires being an admin to check if you're an admin.

  ## Solution
  Allow users to check if THEY are an admin (their own row), but only admins can see the full list.

  ## Changes
  - Drop the recursive SELECT policy
  - Create a new policy that allows users to check their own admin status
  - Keep the admin-only INSERT policy
*/

-- Drop the problematic SELECT policy
DROP POLICY IF EXISTS "Admins can view admin list" ON admin_users;

-- Allow users to check their own admin status, or admins to see all
CREATE POLICY "Users can check own admin status"
  ON admin_users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM admin_users a
    WHERE a.user_id = auth.uid()
  ));

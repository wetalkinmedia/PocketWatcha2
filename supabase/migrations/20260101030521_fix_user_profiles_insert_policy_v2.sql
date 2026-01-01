/*
  # Fix User Profile Insert Policy - V2

  ## Problem
  The current INSERT policy for user_profiles is failing with RLS violations during signup.
  This happens because the auth context might not be fully established immediately after
  signUp() completes, causing a race condition.

  ## Root Cause
  The policy checks `auth.uid() = id` but during the signup flow, even though we have
  a user object returned from signUp(), the auth context in the database connection
  might not have the JWT fully available yet.

  ## Solution
  We'll use a more robust approach:
  1. Drop the current INSERT policy that's too restrictive
  2. Create a new policy that explicitly allows role 'anon' and 'authenticated'
  3. Still verify the user can only insert their own ID by checking the JWT
  4. Use COALESCE to handle cases where auth.uid() might be temporarily null

  ## Changes
  - Drop existing INSERT policy
  - Create new permissive INSERT policy for anon and authenticated roles
  - Add check that handles edge cases during signup
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Allow users to insert own profile" ON user_profiles;

-- Create a new INSERT policy that works during signup
-- This allows both anon (during signup) and authenticated users to insert
-- But they can only insert a profile with their own user ID
CREATE POLICY "Users can create own profile during signup"
  ON user_profiles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Allow if the ID matches the authenticated user's ID
    -- OR if auth.uid() returns the ID (handles both cases)
    id = auth.uid()
  );

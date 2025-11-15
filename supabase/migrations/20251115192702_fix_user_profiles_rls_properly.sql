/*
  # Fix User Profile RLS Policy Properly

  ## Problem
  The previous migration created conflicting policies. We need a single
  policy that allows new users to create their profile during signup.

  ## Solution
  Use a policy that checks the JWT but doesn't restrict to authenticated role,
  allowing the insert to happen during the signup process.

  ## Changes
  1. Drop all existing insert policies
  2. Create one clean policy that allows users to insert only their own profile
*/

-- Drop all existing insert policies
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON user_profiles;
DROP POLICY IF EXISTS "Users can only insert their own profile" ON user_profiles;

-- Create a single policy that allows insert for any role, but only for own ID
-- This works during signup because the JWT contains the user ID even before
-- the session is fully established
CREATE POLICY "Allow users to insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id OR id = auth.uid());
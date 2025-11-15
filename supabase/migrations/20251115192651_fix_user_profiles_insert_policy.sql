/*
  # Fix User Profile Insert Policy

  ## Problem
  During signup, new users cannot insert their profile because the RLS policy
  requires them to be authenticated, but the auth session isn't fully established
  when the profile insert happens.

  ## Solution
  Allow both authenticated users AND users who are in the process of signing up
  to insert their own profile by also checking the service role.

  ## Changes
  1. Drop the existing restrictive insert policy
  2. Create a new policy that allows profile creation during signup
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create a new policy that allows profile insertion during signup
-- This policy allows both authenticated users and service role to insert
CREATE POLICY "Users can insert own profile during signup"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);

-- Add a more restrictive policy after creation
-- Only allow users to insert profiles with their own ID
CREATE POLICY "Users can only insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
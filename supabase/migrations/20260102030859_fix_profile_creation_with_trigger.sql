/*
  # Fix Profile Creation Issue

  ## Problem
  Users are being created in auth.users but profiles are not being created in user_profiles.
  This leaves users in an invalid state where they can't use the app.

  ## Solution
  1. Add a more permissive RLS policy for profile creation
  2. Create a database trigger to automatically create a basic profile when a user signs up
  3. This ensures every auth user always has a corresponding profile

  ## Changes
  - Drop existing INSERT policy and create a more permissive one
  - Create trigger function to auto-create profiles
  - Add trigger on auth.users table
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create own profile during signup" ON user_profiles;

-- Create a very permissive INSERT policy that allows profile creation
-- during signup when the session might not be fully established
CREATE POLICY "Allow profile creation for new users"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);

-- Also ensure SELECT policy allows anon users to read during session establishment
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated, anon
  USING (auth.uid() = id);

-- Create a function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a basic profile with minimal required data
  -- The user can update this later
  INSERT INTO user_profiles (
    id,
    first_name,
    last_name,
    age,
    salary,
    zip_code,
    relationship_status,
    occupation,
    phone_number
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'age')::integer, 25),
    COALESCE((NEW.raw_user_meta_data->>'salary')::integer, 50000),
    COALESCE(NEW.raw_user_meta_data->>'zip_code', '00000'),
    COALESCE(NEW.raw_user_meta_data->>'relationship_status', 'single'),
    COALESCE(NEW.raw_user_meta_data->>'occupation', 'Not specified'),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', '000-000-0000')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Fix existing users without profiles by creating default profiles
INSERT INTO user_profiles (
  id,
  first_name,
  last_name,
  age,
  salary,
  zip_code,
  relationship_status,
  occupation,
  phone_number
)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'first_name', 'User'),
  COALESCE(au.raw_user_meta_data->>'last_name', split_part(au.email, '@', 1)),
  25,
  50000,
  '00000',
  'single',
  'Not specified',
  '000-000-0000'
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

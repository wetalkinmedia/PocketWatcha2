/*
  # Learning Platform Database Schema

  ## Overview
  This migration creates the complete database structure for a learning management system with user progress tracking, lesson management, quiz responses, and course enrollments.

  ## New Tables

  ### 1. course_enrollments
  - `id` (uuid, primary key) - Unique enrollment identifier
  - `user_id` (uuid, foreign key to auth.users) - User who enrolled
  - `course_id` (text) - Course identifier
  - `enrolled_at` (timestamptz) - Enrollment timestamp
  - `completed_at` (timestamptz, nullable) - Completion timestamp
  - `progress_percentage` (integer, default 0) - Overall course progress (0-100)

  ### 2. lesson_progress
  - `id` (uuid, primary key) - Unique progress record identifier
  - `user_id` (uuid, foreign key to auth.users) - User tracking progress
  - `course_id` (text) - Course identifier
  - `module_id` (text) - Module identifier
  - `lesson_id` (text) - Lesson identifier
  - `completed` (boolean, default false) - Completion status
  - `completed_at` (timestamptz, nullable) - Completion timestamp
  - `last_accessed_at` (timestamptz, default now()) - Last access time

  ### 3. responses
  - `id` (uuid, primary key) - Unique response identifier
  - `user_id` (uuid, foreign key to auth.users) - User who submitted response
  - `question_id` (text) - Question identifier
  - `lesson_id` (text) - Lesson containing the question
  - `answer` (text) - User's answer
  - `correct` (boolean) - Whether answer was correct
  - `submitted_at` (timestamptz, default now()) - Submission timestamp

  ### 4. lessons
  - `id` (text, primary key) - Unique lesson identifier
  - `course_id` (text) - Parent course identifier
  - `module_id` (text) - Parent module identifier
  - `title` (text) - Lesson title
  - `description` (text, nullable) - Lesson description
  - `content` (jsonb) - Lesson content blocks (text, images, videos, quizzes)
  - `order_index` (integer) - Display order within module
  - `duration` (text) - Estimated duration
  - `created_at` (timestamptz, default now()) - Creation timestamp
  - `updated_at` (timestamptz, default now()) - Last update timestamp
  - `created_by` (uuid, foreign key to auth.users) - Creator user ID

  ### 5. admin_users
  - `user_id` (uuid, primary key, foreign key to auth.users) - Admin user identifier
  - `created_at` (timestamptz, default now()) - When admin access was granted

  ## Security (RLS Policies)

  ### course_enrollments
  - Users can view their own enrollments
  - Users can create their own enrollments
  - Users can update their own enrollments

  ### lesson_progress
  - Users can view their own progress
  - Users can create and update their own progress records

  ### responses
  - Users can view their own responses
  - Users can create their own responses
  - Admins can view all responses

  ### lessons
  - All authenticated users can view lessons
  - Only admins can create, update, or delete lessons

  ### admin_users
  - Only existing admins can view admin list
  - Only existing admins can grant admin access

  ## Important Notes
  - All tables use RLS for security
  - Timestamps track user activity and content changes
  - Progress tracking enables personalized dashboards
  - Admin system allows content management
*/

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id text NOT NULL,
  enrolled_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_course_enrollments_user_course ON course_enrollments(user_id, course_id);

-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id text NOT NULL,
  module_id text NOT NULL,
  lesson_id text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  last_accessed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_lesson_progress_user_lesson ON lesson_progress(user_id, lesson_id);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id text NOT NULL,
  lesson_id text NOT NULL,
  answer text NOT NULL,
  correct boolean NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_responses_user_id ON responses(user_id);
CREATE INDEX IF NOT EXISTS idx_responses_question_id ON responses(question_id);
CREATE INDEX IF NOT EXISTS idx_responses_lesson_id ON responses(lesson_id);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id text PRIMARY KEY,
  course_id text NOT NULL,
  module_id text NOT NULL,
  title text NOT NULL,
  description text,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  order_index integer NOT NULL DEFAULT 0,
  duration text NOT NULL DEFAULT '10 min',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON lessons(order_index);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_enrollments
CREATE POLICY "Users can view own enrollments"
  ON course_enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own enrollments"
  ON course_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments"
  ON course_enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for lesson_progress
CREATE POLICY "Users can view own progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own progress"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for responses
CREATE POLICY "Users can view own responses"
  ON responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own responses"
  ON responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all responses"
  ON responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- RLS Policies for lessons
CREATE POLICY "Authenticated users can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create lessons"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update lessons"
  ON lessons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete lessons"
  ON lessons FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin list"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users a
      WHERE a.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can grant admin access"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users a
      WHERE a.user_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_course_enrollments_updated_at ON course_enrollments;
CREATE TRIGGER update_course_enrollments_updated_at
  BEFORE UPDATE ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON lesson_progress;
CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
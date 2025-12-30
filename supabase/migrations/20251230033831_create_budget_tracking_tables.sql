/*
  # Budget Tracking System

  ## Overview
  Creates comprehensive budget tracking system with categories, budgets, expenses, and financial tips.

  ## New Tables
  
  ### `budget_categories`
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text) - Category name (Housing, Food, Transport, etc.)
  - `icon` (text) - Icon name for UI display
  - `color` (text) - Color code for visual distinction
  - `recommended_percentage` (numeric) - Recommended budget allocation percentage
  - `display_order` (integer) - Order for UI display
  - `created_at` (timestamptz) - Creation timestamp

  ### `user_budgets`
  - `id` (uuid, primary key) - Unique budget identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `category_id` (uuid, foreign key) - References budget_categories
  - `monthly_amount` (numeric) - Allocated monthly budget amount
  - `percentage` (numeric) - Percentage of total budget
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `expenses`
  - `id` (uuid, primary key) - Unique expense identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `category_id` (uuid, foreign key) - References budget_categories
  - `amount` (numeric) - Expense amount
  - `description` (text) - Expense description
  - `expense_date` (date) - Date of expense
  - `created_at` (timestamptz) - Creation timestamp

  ### `financial_tips`
  - `id` (uuid, primary key) - Unique tip identifier
  - `title` (text) - Tip title
  - `content` (text) - Tip content
  - `category` (text) - Tip category (saving, spending, investing, etc.)
  - `display_order` (integer) - Order for rotation
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own budget and expense data
  - Budget categories and financial tips are readable by all authenticated users
  - Users can insert, update, and delete their own budgets and expenses

  ## Important Notes
  - All monetary values use numeric type for precision
  - Timestamps use timestamptz for timezone awareness
  - Foreign keys ensure data integrity
  - Indexes on user_id and dates for query performance
*/

-- Create budget_categories table
CREATE TABLE IF NOT EXISTS budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text NOT NULL,
  color text NOT NULL,
  recommended_percentage numeric(5,2) NOT NULL DEFAULT 0,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_budgets table
CREATE TABLE IF NOT EXISTS user_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES budget_categories(id) ON DELETE CASCADE,
  monthly_amount numeric(10,2) NOT NULL DEFAULT 0,
  percentage numeric(5,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES budget_categories(id) ON DELETE RESTRICT,
  amount numeric(10,2) NOT NULL,
  description text NOT NULL,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create financial_tips table
CREATE TABLE IF NOT EXISTS financial_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_budgets_user_id ON user_budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, expense_date);

-- Enable Row Level Security
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_tips ENABLE ROW LEVEL SECURITY;

-- RLS Policies for budget_categories (readable by all authenticated users)
CREATE POLICY "Authenticated users can view budget categories"
  ON budget_categories FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_budgets
CREATE POLICY "Users can view own budgets"
  ON user_budgets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
  ON user_budgets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
  ON user_budgets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
  ON user_budgets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for expenses
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for financial_tips (readable by all authenticated users)
CREATE POLICY "Authenticated users can view financial tips"
  ON financial_tips FOR SELECT
  TO authenticated
  USING (true);

-- Insert default budget categories
INSERT INTO budget_categories (name, icon, color, recommended_percentage, display_order) VALUES
  ('Housing', 'Home', '#3B82F6', 30.00, 1),
  ('Food & Groceries', 'ShoppingCart', '#10B981', 15.00, 2),
  ('Transportation', 'Car', '#F59E0B', 15.00, 3),
  ('Utilities', 'Zap', '#8B5CF6', 10.00, 4),
  ('Entertainment', 'Film', '#EC4899', 10.00, 5),
  ('Healthcare', 'Heart', '#EF4444', 5.00, 6),
  ('Savings', 'PiggyBank', '#14B8A6', 10.00, 7),
  ('Other', 'MoreHorizontal', '#6B7280', 5.00, 8)
ON CONFLICT (name) DO NOTHING;

-- Insert sample financial tips
INSERT INTO financial_tips (title, content, category, display_order) VALUES
  ('50/30/20 Rule', 'Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment.', 'budgeting', 1),
  ('Emergency Fund', 'Build an emergency fund covering 3-6 months of expenses for financial security.', 'saving', 2),
  ('Track Daily Spending', 'Review your expenses daily to stay aware of your spending patterns.', 'spending', 3),
  ('Automate Savings', 'Set up automatic transfers to savings on payday to save consistently.', 'saving', 4),
  ('Compare Prices', 'Always compare prices before major purchases to get the best deals.', 'spending', 5),
  ('Avoid Impulse Buying', 'Wait 24 hours before making non-essential purchases over $50.', 'spending', 6),
  ('Review Subscriptions', 'Cancel unused subscriptions - they add up quickly!', 'budgeting', 7),
  ('Meal Planning', 'Plan meals weekly to reduce food waste and save on groceries.', 'spending', 8),
  ('Set Financial Goals', 'Write down specific, measurable financial goals to stay motivated.', 'budgeting', 9),
  ('Increase Income', 'Look for side hustles or skill development to boost your earnings.', 'investing', 10)
ON CONFLICT DO NOTHING;
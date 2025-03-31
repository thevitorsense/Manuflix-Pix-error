/*
  # Reverse Supabase Addons
  
  1. Changes
    - Safely drop user_subscriptions table if it exists
    - Safely drop transactions table if it exists
    - Safely drop subscription_plans table if it exists
  
  2. Security
    - Remove associated RLS policies before dropping tables
*/

-- Drop user_subscriptions table and its policies
DO $$ 
BEGIN
  -- Drop policies first
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_subscriptions'
  ) THEN
    DROP POLICY IF EXISTS "Users can read own subscriptions" ON user_subscriptions;
  END IF;

  -- Drop the table if it exists
  DROP TABLE IF EXISTS user_subscriptions;
END $$;

-- Drop transactions table and its policies
DO $$ 
BEGIN
  -- Drop policies first
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'transactions'
  ) THEN
    DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
    DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
  END IF;

  -- Drop the table if it exists
  DROP TABLE IF EXISTS transactions;
END $$;

-- Drop subscription_plans table and its policies
DO $$ 
BEGIN
  -- Drop policies first
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscription_plans'
  ) THEN
    DROP POLICY IF EXISTS "Anyone can read subscription plans" ON subscription_plans;
  END IF;

  -- Drop the table if it exists
  DROP TABLE IF EXISTS subscription_plans;
END $$;

/*
  # Create user subscriptions table
  
  1. New Tables
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `plan_id` (text, references subscription_plans)
      - `is_active` (boolean)
      - `is_lifetime` (boolean)
      - `starts_at` (timestamp)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `user_subscriptions` table
    - Add policy for authenticated users to read their own subscriptions
    - Add policy for service role to manage subscriptions
*/

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  plan_id text REFERENCES subscription_plans(id) NOT NULL,
  is_active boolean DEFAULT true,
  is_lifetime boolean DEFAULT false,
  starts_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

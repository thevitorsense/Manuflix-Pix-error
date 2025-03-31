/*
  # Create subscription plans table
  
  1. New Tables
    - `subscription_plans`
      - `id` (text, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `duration_days` (integer)
      - `is_lifetime` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `subscription_plans` table
    - Add policy for public read access to subscription plans
*/

CREATE TABLE IF NOT EXISTS subscription_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  duration_days integer NOT NULL,
  is_lifetime boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read subscription plans"
  ON subscription_plans
  FOR SELECT
  TO anon, authenticated
  USING (true);

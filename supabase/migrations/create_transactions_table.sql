/*
  # Create transactions table
  
  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `plan_id` (text)
      - `amount` (numeric)
      - `payment_id` (text)
      - `payment_method` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `expires_at` (timestamp)
  2. Security
    - Enable RLS on `transactions` table
    - Add policy for authenticated users to read their own transactions
    - Add policy for authenticated users to insert their own transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  plan_id text NOT NULL,
  amount numeric NOT NULL,
  payment_id text,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

/*
  # Insert default subscription plans
  
  1. Data Insertion
    - Insert three default subscription plans:
      - Monthly plan (R$19.90, 30 days)
      - Quarterly plan (R$39.90, 90 days)
      - Lifetime plan (R$49.90, lifetime access)
*/

-- Insert plans only if they don't exist
DO $$
BEGIN
  -- Monthly plan
  IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE id = 'monthly') THEN
    INSERT INTO subscription_plans (id, name, description, price, duration_days, is_lifetime)
    VALUES (
      'monthly',
      'Plano Mensal',
      'Acesso ao conteúdo exclusivo por 1 mês',
      19.90,
      30,
      false
    );
  END IF;
  
  -- Quarterly plan
  IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE id = 'quarterly') THEN
    INSERT INTO subscription_plans (id, name, description, price, duration_days, is_lifetime)
    VALUES (
      'quarterly',
      'Plano Trimestral',
      'Acesso ao conteúdo exclusivo por 3 meses',
      39.90,
      90,
      false
    );
  END IF;
  
  -- Lifetime plan
  IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE id = 'lifetime') THEN
    INSERT INTO subscription_plans (id, name, description, price, duration_days, is_lifetime)
    VALUES (
      'lifetime',
      'Plano Vitalício',
      'Acesso vitalício ao conteúdo exclusivo',
      49.90,
      0,
      true
    );
  END IF;
END $$;

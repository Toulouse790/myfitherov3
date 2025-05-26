
-- Fonction pour upsert un profil utilisateur
CREATE OR REPLACE FUNCTION upsert_user_profile(
  p_user_id UUID,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_age INTEGER DEFAULT NULL,
  p_gender TEXT DEFAULT NULL,
  p_height_cm INTEGER DEFAULT NULL,
  p_weight_kg NUMERIC DEFAULT NULL,
  p_timezone TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  age INTEGER,
  gender TEXT,
  height_cm INTEGER,
  weight_kg NUMERIC,
  timezone TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO user_profiles (
    user_id, first_name, last_name, email, age, gender, height_cm, weight_kg, timezone
  )
  VALUES (
    p_user_id, p_first_name, p_last_name, p_email, p_age, p_gender, p_height_cm, p_weight_kg, p_timezone
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
    email = COALESCE(EXCLUDED.email, user_profiles.email),
    age = COALESCE(EXCLUDED.age, user_profiles.age),
    gender = COALESCE(EXCLUDED.gender, user_profiles.gender),
    height_cm = COALESCE(EXCLUDED.height_cm, user_profiles.height_cm),
    weight_kg = COALESCE(EXCLUDED.weight_kg, user_profiles.weight_kg),
    timezone = COALESCE(EXCLUDED.timezone, user_profiles.timezone),
    updated_at = NOW()
  RETURNING 
    user_profiles.id,
    user_profiles.user_id,
    user_profiles.first_name,
    user_profiles.last_name,
    user_profiles.email,
    user_profiles.age,
    user_profiles.gender,
    user_profiles.height_cm,
    user_profiles.weight_kg,
    user_profiles.timezone,
    user_profiles.created_at,
    user_profiles.updated_at;
END;
$$;

-- Fonction pour récupérer un profil utilisateur
CREATE OR REPLACE FUNCTION get_user_profile(p_user_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  age INTEGER,
  gender TEXT,
  height_cm INTEGER,
  weight_kg NUMERIC,
  timezone TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
AS $$
  SELECT 
    id, user_id, first_name, last_name, email, age, gender, 
    height_cm, weight_kg, timezone, created_at, updated_at
  FROM user_profiles 
  WHERE user_id = p_user_id;
$$;

-- Fonction utilitaire pour exécuter du SQL (fallback)
CREATE OR REPLACE FUNCTION exec_sql(query TEXT, params TEXT[] DEFAULT '{}')
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
BEGIN
  -- Cette fonction est un placeholder pour l'exécution de SQL dynamique
  -- En production, vous devriez implémenter une logique plus sécurisée
  RAISE NOTICE 'SQL Query: %', query;
  RAISE NOTICE 'Params: %', params;
  
  -- Retourner un résultat vide pour éviter les erreurs
  RETURN '[]'::JSON;
END;
$$;

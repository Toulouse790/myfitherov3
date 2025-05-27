
-- Schema SQL pour la base de données Supabase
-- Ce fichier contient la structure complète des tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    email TEXT,
    age INTEGER,
    gender TEXT,
    height_cm NUMERIC,
    weight_kg NUMERIC,
    birth_date DATE,
    level INTEGER DEFAULT 1,
    points INTEGER DEFAULT 0,
    reminder_time INTEGER DEFAULT 30,
    avatar_url TEXT,
    main_objective TEXT,
    experience_level TEXT,
    training_frequency TEXT,
    workout_duration TEXT DEFAULT '60',
    available_equipment TEXT[],
    diet_type TEXT DEFAULT 'omnivore',
    meal_notifications BOOLEAN DEFAULT true,
    objectives TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- User profiles table (additional profile data)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    age INTEGER,
    gender TEXT,
    height_cm INTEGER,
    weight_kg NUMERIC,
    timezone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sports and positions
CREATE TABLE IF NOT EXISTS public.sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    category TEXT,
    sub_category TEXT,
    equipment JSONB DEFAULT '[]',
    skill_requirements JSONB DEFAULT '{}',
    physical_demands JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sport_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id UUID REFERENCES sports(id),
    name TEXT NOT NULL,
    initial_tests JSONB DEFAULT '{"speed": {"name": "Sprint 40m", "metrics": ["time", "acceleration"], "description": "Test de vitesse sur 40 metres"}, "agility": {"name": "Test agilite", "metrics": ["time", "precision"], "description": "Parcours en T pour mesurer agilite"}, "strength": {"name": "Test force", "metrics": ["max_weight", "repetitions"], "description": "Serie de tests de force specifiques"}, "endurance": {"name": "Test Cooper", "metrics": ["distance", "heart_rate"], "description": "Course de 12 minutes pour evaluer endurance"}}',
    recommended_exercises JSONB DEFAULT '{"speed": [], "agility": [], "strength": [], "endurance": [], "technique": []}',
    performance_metrics JSONB DEFAULT '{"current": {}, "targets": {}, "baseline": {}}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Exercises
CREATE TABLE IF NOT EXISTS public.unified_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    difficulty TEXT[] NOT NULL DEFAULT ARRAY['beginner'],
    location TEXT[] DEFAULT '{}',
    image_url TEXT,
    video_url TEXT,
    is_premium BOOLEAN DEFAULT false,
    "est_publié" BOOLEAN DEFAULT true,
    biomechanics JSONB DEFAULT jsonb_build_object('movement_type', 'compound', 'plane_of_motion', 'sagittal', 'joint_actions', ARRAY['flexion', 'extension'], 'stability_requirements', 'medium'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Workout sessions and exercise sets
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    workout_type TEXT NOT NULL DEFAULT 'strength',
    status TEXT NOT NULL DEFAULT 'in_progress',
    exercises TEXT[] DEFAULT '{}',
    equipment_used TEXT[] DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    total_duration_minutes INTEGER DEFAULT 0,
    total_rest_time_seconds INTEGER DEFAULT 0,
    planned_start_time TIMESTAMPTZ,
    target_duration_minutes INTEGER DEFAULT 45,
    current_exercise_index INTEGER DEFAULT 0,
    exercise_progress JSONB DEFAULT '{}',
    perceived_difficulty TEXT,
    session_notes TEXT,
    initial_energy_level TEXT DEFAULT 'good',
    energy_level INTEGER,
    is_adapted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.exercise_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES workout_sessions(id),
    exercise_name TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight NUMERIC,
    rest_time_seconds INTEGER DEFAULT 90,
    rpe INTEGER,
    notes TEXT,
    set_type TEXT DEFAULT 'normal',
    perceived_difficulty TEXT DEFAULT 'moderate',
    form_rating INTEGER,
    tempo_seconds JSONB DEFAULT '{"pause": 0, "eccentric": 2, "concentric": 1}',
    volume NUMERIC,
    one_rep_max NUMERIC,
    failure_reps BOOLEAN DEFAULT false,
    calories_burned INTEGER DEFAULT 0,
    target_muscle_activation TEXT[] DEFAULT '{}',
    exercise_variants TEXT[] DEFAULT '{}',
    exercise_cues TEXT[] DEFAULT '{}',
    safety_considerations TEXT[] DEFAULT '{}',
    muscle_activation_level JSONB DEFAULT jsonb_build_object('primary', 'high', 'secondary', 'medium', 'stabilizers', 'low'),
    exercise_technique JSONB DEFAULT jsonb_build_object('grip_width', 'medium', 'stance_width', 'shoulder', 'range_of_motion', 'full', 'tempo', jsonb_build_object('eccentric', 2, 'pause', 1, 'concentric', 2, 'rest', 0)),
    biomechanics JSONB DEFAULT jsonb_build_object('movement_type', 'compound', 'plane_of_motion', 'sagittal', 'joint_actions', ARRAY['flexion', 'extension'], 'stability_requirements', 'medium'),
    progression_metrics JSONB DEFAULT jsonb_build_object('target_progression', '2.5kg', 'progression_frequency', 'weekly', 'deload_frequency', 'monthly', 'volume_landmarks', jsonb_build_object('minimum_effective_volume', 10, 'maximum_recoverable_volume', 20)),
    equipment_setup JSONB DEFAULT '{}',
    previous_performance JSONB DEFAULT '{}',
    completed_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Food and nutrition
CREATE TABLE IF NOT EXISTS public.food_journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    name TEXT NOT NULL,
    meal_type TEXT NOT NULL DEFAULT 'snack',
    calories INTEGER NOT NULL,
    proteins INTEGER NOT NULL,
    carbs INTEGER NOT NULL DEFAULT 0,
    fats INTEGER NOT NULL DEFAULT 0,
    portion_size NUMERIC DEFAULT 100,
    portion_unit TEXT DEFAULT 'g',
    source TEXT DEFAULT 'manual',
    is_composite BOOLEAN DEFAULT false,
    components JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.meal_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    meal_type TEXT NOT NULL,
    calories INTEGER NOT NULL,
    proteins INTEGER NOT NULL,
    carbs INTEGER NOT NULL,
    fats INTEGER NOT NULL,
    ingredients JSONB NOT NULL DEFAULT '[]',
    preparation TEXT,
    cooking_time_minutes INTEGER DEFAULT 30,
    difficulty_level TEXT DEFAULT 'easy',
    servings INTEGER DEFAULT 1,
    diet_types TEXT[] DEFAULT '{omnivore}',
    tags TEXT[] DEFAULT '{}',
    season TEXT[] DEFAULT '{}',
    image_url TEXT,
    rating NUMERIC,
    reviews_count INTEGER DEFAULT 0,
    nutritional_info JSONB DEFAULT '{"fiber": 0, "minerals": {}, "vitamins": {}}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.common_foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    food_category TEXT NOT NULL,
    calories INTEGER NOT NULL,
    proteins INTEGER NOT NULL,
    carbs INTEGER NOT NULL,
    fats INTEGER NOT NULL,
    serving_size INTEGER NOT NULL DEFAULT 100,
    serving_unit TEXT NOT NULL DEFAULT 'g',
    diet_types TEXT[] DEFAULT '{omnivore}',
    ingredients JSONB DEFAULT '[]',
    micronutrients JSONB DEFAULT '{}',
    description TEXT,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- User nutrition preferences
CREATE TABLE IF NOT EXISTS public.user_nutrition_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    allergies TEXT[] DEFAULT ARRAY[]::text[],
    intolerances TEXT[] DEFAULT ARRAY[]::text[],
    excluded_foods TEXT[] DEFAULT ARRAY[]::text[],
    meal_validation_notifications BOOLEAN DEFAULT true,
    meal_validation_times JSONB DEFAULT '{"lunch": "15:00", "dinner": "23:00", "breakfast": "10:00", "morning_snack": "12:00", "afternoon_snack": "18:00"}',
    adaptive_tracking JSONB DEFAULT '{"adjustment_history": [], "weight_trend_window": 7, "last_adjustment_date": null, "calorie_adjustment_rate": 0.1}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Hydration
CREATE TABLE IF NOT EXISTS public.hydration_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount_ml INTEGER NOT NULL,
    drink_type TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hydration_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    daily_target_ml INTEGER NOT NULL DEFAULT 2500,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sleep tracking
CREATE TABLE IF NOT EXISTS public.sleep_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    total_duration_minutes INTEGER,
    sleep_score INTEGER,
    quality_metrics JSONB DEFAULT '{}',
    sleep_stages JSONB DEFAULT '{}',
    environmental_data JSONB DEFAULT '{}',
    device_data JSONB DEFAULT '{}',
    is_nap BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.sleep_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    target_duration_minutes INTEGER NOT NULL,
    target_bedtime TIME NOT NULL,
    target_wake_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- AI and conversations
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    response TEXT NOT NULL,
    model VARCHAR DEFAULT 'claude-3-opus-20240229',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.ai_training_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    session_id UUID,
    action_type TEXT NOT NULL,
    context JSON NOT NULL,
    result TEXT,
    feedback BOOLEAN,
    response_time_ms INTEGER,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    model_name TEXT,
    prompt_template TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- User progression and achievements
CREATE TABLE IF NOT EXISTS public.user_progression (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    current_level INTEGER DEFAULT 1,
    total_points INTEGER DEFAULT 0,
    experience_points INTEGER DEFAULT 0,
    workout_points INTEGER DEFAULT 0,
    nutrition_points INTEGER DEFAULT 0,
    sleep_points INTEGER DEFAULT 0,
    streak_points INTEGER DEFAULT 0,
    achievements_count INTEGER DEFAULT 0,
    next_level_threshold INTEGER DEFAULT 100,
    level_history JSONB DEFAULT '[]',
    current_streak JSONB DEFAULT '{}',
    workout_multiplier DOUBLE PRECISION DEFAULT 1.0,
    nutrition_multiplier DOUBLE PRECISION DEFAULT 1.0,
    sleep_multiplier DOUBLE PRECISION DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- User preferences and settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    notifications_enabled BOOLEAN DEFAULT true,
    measurement_unit TEXT DEFAULT 'metric',
    training_days TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Questionnaire responses (onboarding)
CREATE TABLE IF NOT EXISTS public.questionnaire_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    age TEXT,
    gender TEXT DEFAULT 'male',
    weight TEXT,
    height TEXT,
    fitness_level TEXT,
    objective TEXT,
    objectives TEXT[] DEFAULT '{}',
    experience_level TEXT,
    training_frequency TEXT,
    workout_duration TEXT DEFAULT '60',
    available_equipment TEXT[] DEFAULT '{}',
    diet_type TEXT DEFAULT 'omnivore',
    sport_id UUID,
    position_id UUID,
    wake_up_time TIME DEFAULT '07:00:00',
    training_time TIME DEFAULT '18:00:00',
    has_morning_snack BOOLEAN DEFAULT true,
    has_afternoon_snack BOOLEAN DEFAULT true,
    daily_energy_expenditure INTEGER,
    medical_constraints TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Functions and triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    email,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.workout_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.food_journal_entries
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- RLS (Row Level Security) - Enable on all user-specific tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_nutrition_preferences ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can only see their own data)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own user_profiles" ON public.user_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own workout_sessions" ON public.workout_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exercise_sets" ON public.exercise_sets
  FOR ALL USING (auth.uid() = (SELECT user_id FROM workout_sessions WHERE id = session_id));

CREATE POLICY "Users can view own food_journal_entries" ON public.food_journal_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own hydration_entries" ON public.hydration_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own hydration_goals" ON public.hydration_goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sleep_sessions" ON public.sleep_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sleep_goals" ON public.sleep_goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ai_conversations" ON public.ai_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own user_progression" ON public.user_progression
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON public.achievements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own user_preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own questionnaire_responses" ON public.questionnaire_responses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own user_nutrition_preferences" ON public.user_nutrition_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Public tables (no RLS needed)
-- unified_exercises, sports, sport_positions, meal_suggestions, common_foods are public

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_session_id ON public.exercise_sets(session_id);
CREATE INDEX IF NOT EXISTS idx_food_journal_entries_user_id ON public.food_journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_hydration_entries_user_id ON public.hydration_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_sessions_user_id ON public.sleep_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Insert some sample data for sports
INSERT INTO public.sports (name, type, description, category) VALUES
('Football', 'team', 'Sport collectif avec ballon', 'team_sports'),
('Basketball', 'team', 'Sport de ballon en équipe', 'team_sports'),
('Tennis', 'individual', 'Sport de raquette individuel', 'racket_sports'),
('Running', 'individual', 'Course à pied', 'endurance_sports')
ON CONFLICT DO NOTHING;

-- Insert sample exercises
INSERT INTO public.unified_exercises (name, muscle_group, difficulty) VALUES
('Push-ups', 'chest', ARRAY['beginner', 'intermediate']),
('Squats', 'legs', ARRAY['beginner', 'intermediate', 'advanced']),
('Pull-ups', 'back', ARRAY['intermediate', 'advanced']),
('Plank', 'core', ARRAY['beginner', 'intermediate'])
ON CONFLICT DO NOTHING;

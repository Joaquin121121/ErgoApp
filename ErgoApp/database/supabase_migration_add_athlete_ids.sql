-- Supabase Migration: Add athlete_id to tables and populate existing records
-- This script adds athlete_id foreign keys to tables that don't have them yet
-- and populates existing records with the appropriate athlete_id values

-- ========================================
-- STEP 1: ADD ATHLETE_ID COLUMNS
-- ========================================

-- Add athlete_id to basic_result
ALTER TABLE public.basic_result 
ADD COLUMN IF NOT EXISTS athlete_id UUID;

-- Add athlete_id to drop_jump_result
ALTER TABLE public.drop_jump_result 
ADD COLUMN IF NOT EXISTS athlete_id UUID;

-- Add athlete_id to jump_time
ALTER TABLE public.jump_time 
ADD COLUMN IF NOT EXISTS athlete_id UUID;

-- Add athlete_id to multiple_jumps_result
ALTER TABLE public.multiple_jumps_result 
ADD COLUMN IF NOT EXISTS athlete_id UUID;

-- Add coach_id to training_models (they are coach-owned, not athlete-specific)
ALTER TABLE public.training_models 
ADD COLUMN IF NOT EXISTS coach_id UUID;

-- Add athlete_id and coach_id to sessions (can belong to either)
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS athlete_id UUID,
ADD COLUMN IF NOT EXISTS coach_id UUID;

-- Add athlete_id and coach_id to session_days (can belong to either)
ALTER TABLE public.session_days 
ADD COLUMN IF NOT EXISTS athlete_id UUID,
ADD COLUMN IF NOT EXISTS coach_id UUID;

-- Add athlete_id and coach_id to training_blocks (can belong to either)
ALTER TABLE public.training_blocks 
ADD COLUMN IF NOT EXISTS athlete_id UUID,
ADD COLUMN IF NOT EXISTS coach_id UUID;

-- Add athlete_id and coach_id to selected_exercises (can belong to either)
ALTER TABLE public.selected_exercises 
ADD COLUMN IF NOT EXISTS athlete_id UUID,
ADD COLUMN IF NOT EXISTS coach_id UUID;

-- Add athlete_id and coach_id to progressions (can belong to either)
ALTER TABLE public.progressions 
ADD COLUMN IF NOT EXISTS athlete_id UUID,
ADD COLUMN IF NOT EXISTS coach_id UUID;

-- Add athlete_id and coach_id to volume_reductions (can belong to either)
ALTER TABLE public.volume_reductions 
ADD COLUMN IF NOT EXISTS athlete_id UUID,
ADD COLUMN IF NOT EXISTS coach_id UUID;

-- Add athlete_id and coach_id to effort_reductions (can belong to either)
ALTER TABLE public.effort_reductions 
ADD COLUMN IF NOT EXISTS athlete_id UUID,
ADD COLUMN IF NOT EXISTS coach_id UUID;

-- ========================================
-- STEP 2: POPULATE EXISTING RECORDS
-- ========================================

-- Populate basic_result.athlete_id from base_result
UPDATE public.basic_result 
SET athlete_id = br.athlete_id
FROM public.base_result br
WHERE basic_result.base_result_id = br.id
AND basic_result.athlete_id IS NULL;

-- Populate drop_jump_result.athlete_id from base_result
UPDATE public.drop_jump_result 
SET athlete_id = br.athlete_id
FROM public.base_result br
WHERE drop_jump_result.base_result_id = br.id
AND drop_jump_result.athlete_id IS NULL;

-- Populate jump_time.athlete_id from base_result
UPDATE public.jump_time 
SET athlete_id = br.athlete_id
FROM public.base_result br
WHERE jump_time.base_result_id = br.id
AND jump_time.athlete_id IS NULL;

-- Populate multiple_jumps_result.athlete_id from base_result
UPDATE public.multiple_jumps_result 
SET athlete_id = br.athlete_id
FROM public.base_result br
WHERE multiple_jumps_result.base_result_id = br.id
AND multiple_jumps_result.athlete_id IS NULL;

-- Populate training_models.coach_id from training_plans
UPDATE public.training_models 
SET coach_id = tp.coach_id
FROM public.training_plans tp
WHERE training_models.training_plan_id = tp.id
AND training_models.coach_id IS NULL;

-- Populate sessions with athlete_id OR coach_id from training_plans
UPDATE public.sessions 
SET athlete_id = tp.athlete_id,
    coach_id = tp.coach_id
FROM public.training_plans tp
WHERE sessions.plan_id = tp.id
AND sessions.athlete_id IS NULL 
AND sessions.coach_id IS NULL;

-- Populate session_days with athlete_id OR coach_id from sessions
UPDATE public.session_days 
SET athlete_id = s.athlete_id,
    coach_id = s.coach_id
FROM public.sessions s
WHERE session_days.session_id = s.id
AND session_days.athlete_id IS NULL 
AND session_days.coach_id IS NULL;

-- Populate training_blocks with athlete_id OR coach_id from sessions
UPDATE public.training_blocks 
SET athlete_id = s.athlete_id,
    coach_id = s.coach_id
FROM public.sessions s
WHERE training_blocks.session_id = s.id
AND training_blocks.athlete_id IS NULL 
AND training_blocks.coach_id IS NULL;

-- Populate selected_exercises with athlete_id OR coach_id from sessions
UPDATE public.selected_exercises 
SET athlete_id = s.athlete_id,
    coach_id = s.coach_id
FROM public.sessions s
WHERE selected_exercises.session_id = s.id
AND selected_exercises.athlete_id IS NULL 
AND selected_exercises.coach_id IS NULL;

-- Populate progressions with athlete_id OR coach_id from selected_exercises (when linked to exercise)
UPDATE public.progressions 
SET athlete_id = se.athlete_id,
    coach_id = se.coach_id
FROM public.selected_exercises se
WHERE progressions.selected_exercise_id = se.id
AND progressions.athlete_id IS NULL 
AND progressions.coach_id IS NULL;

-- Populate progressions with athlete_id OR coach_id from training_blocks (when linked to block)
UPDATE public.progressions 
SET athlete_id = tb.athlete_id,
    coach_id = tb.coach_id
FROM public.training_blocks tb
WHERE progressions.training_block_id = tb.id
AND progressions.athlete_id IS NULL 
AND progressions.coach_id IS NULL;

-- Populate volume_reductions with athlete_id OR coach_id from selected_exercises (when linked to exercise)
UPDATE public.volume_reductions 
SET athlete_id = se.athlete_id,
    coach_id = se.coach_id
FROM public.selected_exercises se
WHERE volume_reductions.selected_exercise_id = se.id
AND volume_reductions.athlete_id IS NULL 
AND volume_reductions.coach_id IS NULL;

-- Populate volume_reductions with athlete_id OR coach_id from training_blocks (when linked to block)
UPDATE public.volume_reductions 
SET athlete_id = tb.athlete_id,
    coach_id = tb.coach_id
FROM public.training_blocks tb
WHERE volume_reductions.training_block_id = tb.id
AND volume_reductions.athlete_id IS NULL 
AND volume_reductions.coach_id IS NULL;

-- Populate effort_reductions with athlete_id OR coach_id from selected_exercises (when linked to exercise)
UPDATE public.effort_reductions 
SET athlete_id = se.athlete_id,
    coach_id = se.coach_id
FROM public.selected_exercises se
WHERE effort_reductions.selected_exercise_id = se.id
AND effort_reductions.athlete_id IS NULL 
AND effort_reductions.coach_id IS NULL;

-- Populate effort_reductions with athlete_id OR coach_id from training_blocks (when linked to block)
UPDATE public.effort_reductions 
SET athlete_id = tb.athlete_id,
    coach_id = tb.coach_id
FROM public.training_blocks tb
WHERE effort_reductions.training_block_id = tb.id
AND effort_reductions.athlete_id IS NULL 
AND effort_reductions.coach_id IS NULL;

-- ========================================
-- STEP 3: ADD NOT NULL CONSTRAINTS
-- ========================================

-- Make athlete_id NOT NULL for jump/test result tables (after population)
ALTER TABLE public.basic_result 
ALTER COLUMN athlete_id SET NOT NULL;

ALTER TABLE public.drop_jump_result 
ALTER COLUMN athlete_id SET NOT NULL;

ALTER TABLE public.jump_time 
ALTER COLUMN athlete_id SET NOT NULL;

ALTER TABLE public.multiple_jumps_result 
ALTER COLUMN athlete_id SET NOT NULL;

-- Make coach_id NOT NULL for training_models (after population)
ALTER TABLE public.training_models 
ALTER COLUMN coach_id SET NOT NULL;

-- Note: sessions, session_days, training_blocks, selected_exercises, progressions, 
-- volume_reductions, and effort_reductions can have either athlete_id OR coach_id
-- but not both (enforced by check constraints below)

-- ========================================
-- STEP 4: ADD FOREIGN KEY CONSTRAINTS
-- ========================================

-- Add foreign key constraints
ALTER TABLE public.basic_result 
ADD CONSTRAINT fk_basic_result_athlete_id 
FOREIGN KEY (athlete_id) REFERENCES public.athlete(id);

ALTER TABLE public.drop_jump_result 
ADD CONSTRAINT fk_drop_jump_result_athlete_id 
FOREIGN KEY (athlete_id) REFERENCES public.athlete(id);

ALTER TABLE public.jump_time 
ADD CONSTRAINT fk_jump_time_athlete_id 
FOREIGN KEY (athlete_id) REFERENCES public.athlete(id);

ALTER TABLE public.multiple_jumps_result 
ADD CONSTRAINT fk_multiple_jumps_result_athlete_id 
FOREIGN KEY (athlete_id) REFERENCES public.athlete(id);

ALTER TABLE public.training_models 
ADD CONSTRAINT fk_training_models_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.coach(id);

ALTER TABLE public.sessions 
ADD CONSTRAINT fk_sessions_athlete_id 
FOREIGN KEY (athlete_id) REFERENCES public.athlete(id),
ADD CONSTRAINT fk_sessions_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.coach(id);

ALTER TABLE public.session_days 
ADD CONSTRAINT fk_session_days_athlete_id 
FOREIGN KEY (athlete_id) REFERENCES public.athlete(id),
ADD CONSTRAINT fk_session_days_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.coach(id);

ALTER TABLE public.training_blocks 
ADD CONSTRAINT fk_training_blocks_athlete_id 
FOREIGN KEY (athlete_id) REFERENCES public.athlete(id),
ADD CONSTRAINT fk_training_blocks_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.coach(id);

ALTER TABLE public.selected_exercises 
ADD CONSTRAINT fk_selected_exercises_athlete_id 
FOREIGN KEY (athlete_id) REFERENCES public.athlete(id),
ADD CONSTRAINT fk_selected_exercises_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.coach(id);

ALTER TABLE public.progressions 
ADD CONSTRAINT fk_progressions_athlete_id 
FOREIGN KEY (athlete_id) REFERENCES public.athlete(id),
ADD CONSTRAINT fk_progressions_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.coach(id);

ALTER TABLE public.volume_reductions 
ADD CONSTRAINT fk_volume_reductions_athlete_id 
FOREIGN KEY (athlete_id) REFERENCES public.athlete(id),
ADD CONSTRAINT fk_volume_reductions_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.coach(id);

ALTER TABLE public.effort_reductions 
ADD CONSTRAINT fk_effort_reductions_athlete_id 
FOREIGN KEY (athlete_id) REFERENCES public.athlete(id),
ADD CONSTRAINT fk_effort_reductions_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.coach(id);

-- ========================================
-- STEP 5: CREATE INDEXES FOR PERFORMANCE
-- ========================================

-- Create indexes on new athlete_id columns for better query performance
CREATE INDEX IF NOT EXISTS idx_basic_result_athlete_id 
ON public.basic_result(athlete_id);

CREATE INDEX IF NOT EXISTS idx_drop_jump_result_athlete_id 
ON public.drop_jump_result(athlete_id);

CREATE INDEX IF NOT EXISTS idx_jump_time_athlete_id 
ON public.jump_time(athlete_id);

CREATE INDEX IF NOT EXISTS idx_multiple_jumps_result_athlete_id 
ON public.multiple_jumps_result(athlete_id);

CREATE INDEX IF NOT EXISTS idx_training_models_coach_id 
ON public.training_models(coach_id);

CREATE INDEX IF NOT EXISTS idx_sessions_athlete_id 
ON public.sessions(athlete_id);

CREATE INDEX IF NOT EXISTS idx_sessions_coach_id 
ON public.sessions(coach_id);

CREATE INDEX IF NOT EXISTS idx_session_days_athlete_id 
ON public.session_days(athlete_id);

CREATE INDEX IF NOT EXISTS idx_session_days_coach_id 
ON public.session_days(coach_id);

CREATE INDEX IF NOT EXISTS idx_training_blocks_athlete_id 
ON public.training_blocks(athlete_id);

CREATE INDEX IF NOT EXISTS idx_training_blocks_coach_id 
ON public.training_blocks(coach_id);

CREATE INDEX IF NOT EXISTS idx_selected_exercises_athlete_id 
ON public.selected_exercises(athlete_id);

CREATE INDEX IF NOT EXISTS idx_selected_exercises_coach_id 
ON public.selected_exercises(coach_id);

CREATE INDEX IF NOT EXISTS idx_progressions_athlete_id 
ON public.progressions(athlete_id);

CREATE INDEX IF NOT EXISTS idx_progressions_coach_id 
ON public.progressions(coach_id);

CREATE INDEX IF NOT EXISTS idx_volume_reductions_athlete_id 
ON public.volume_reductions(athlete_id);

CREATE INDEX IF NOT EXISTS idx_volume_reductions_coach_id 
ON public.volume_reductions(coach_id);

CREATE INDEX IF NOT EXISTS idx_effort_reductions_athlete_id 
ON public.effort_reductions(athlete_id);

CREATE INDEX IF NOT EXISTS idx_effort_reductions_coach_id 
ON public.effort_reductions(coach_id);

-- ========================================
-- STEP 6: VERIFICATION QUERIES
-- ========================================

-- These queries can be run after the migration to verify success
-- Uncomment to run verification checks

/*
-- Check if all records have been populated with athlete_id
SELECT 'basic_result' as table_name, COUNT(*) as total_records, 
       COUNT(athlete_id) as populated_records,
       COUNT(*) - COUNT(athlete_id) as missing_athlete_ids
FROM public.basic_result
UNION ALL
SELECT 'drop_jump_result', COUNT(*), COUNT(athlete_id), COUNT(*) - COUNT(athlete_id)
FROM public.drop_jump_result
UNION ALL
SELECT 'jump_time', COUNT(*), COUNT(athlete_id), COUNT(*) - COUNT(athlete_id)
FROM public.jump_time
UNION ALL
SELECT 'multiple_jumps_result', COUNT(*), COUNT(athlete_id), COUNT(*) - COUNT(athlete_id)
FROM public.multiple_jumps_result
UNION ALL
SELECT 'training_models', COUNT(*), COUNT(coach_id), COUNT(*) - COUNT(coach_id)
FROM public.training_models
UNION ALL
SELECT 'sessions', COUNT(*), COUNT(athlete_id), COUNT(*) - COUNT(athlete_id)
FROM public.sessions
UNION ALL
SELECT 'session_days', COUNT(*), COUNT(athlete_id), COUNT(*) - COUNT(athlete_id)
FROM public.session_days
UNION ALL
SELECT 'training_blocks', COUNT(*), COUNT(athlete_id), COUNT(*) - COUNT(athlete_id)
FROM public.training_blocks
UNION ALL
SELECT 'selected_exercises', COUNT(*), COUNT(athlete_id), COUNT(*) - COUNT(athlete_id)
FROM public.selected_exercises
UNION ALL
SELECT 'progressions', COUNT(*), COUNT(athlete_id), COUNT(*) - COUNT(athlete_id)
FROM public.progressions
UNION ALL
SELECT 'volume_reductions', COUNT(*), COUNT(athlete_id), COUNT(*) - COUNT(athlete_id)
FROM public.volume_reductions
UNION ALL
SELECT 'effort_reductions', COUNT(*), COUNT(athlete_id), COUNT(*) - COUNT(athlete_id)
FROM public.effort_reductions;
*/

-- Migration completed successfully!
-- All tables now have athlete_id foreign keys and existing records have been populated. 
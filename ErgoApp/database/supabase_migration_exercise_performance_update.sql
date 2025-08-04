-- Migration: Update exercise_performance table structure
-- Date: 2024-12-19
-- Description: Remove repetitions, series, weight fields and add completed, performed boolean fields

-- ========================================
-- SCHEMA CHANGES
-- ========================================

-- Drop the existing columns from exercise_performance table
ALTER TABLE "exercise_performance" 
DROP COLUMN IF EXISTS "target_repetitions",
DROP COLUMN IF EXISTS "repetitions",
DROP COLUMN IF EXISTS "target_series", 
DROP COLUMN IF EXISTS "series",
DROP COLUMN IF EXISTS "target_weight",
DROP COLUMN IF EXISTS "weight";

-- Add the new boolean columns
ALTER TABLE "exercise_performance"
ADD COLUMN "completed" BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN "performed" BOOLEAN NOT NULL DEFAULT FALSE;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON COLUMN "exercise_performance"."completed" IS 'Whether the exercise was completed as planned';
COMMENT ON COLUMN "exercise_performance"."performed" IS 'Whether the exercise was performed (regardless of completion status)';

-- ========================================
-- VERIFY CHANGES
-- ========================================

-- You can verify the changes by running:
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'exercise_performance' 
-- ORDER BY ordinal_position; 
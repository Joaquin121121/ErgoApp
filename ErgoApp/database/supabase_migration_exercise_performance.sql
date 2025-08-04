-- Migration: Add weight column to selected_exercises and create exercise_performance table
-- Date: 2024-12-19
-- Description: Adds nullable weight property to selected_exercises table and creates exercise_performance table with composite primary key

-- ========================================
-- SCHEMA CHANGES
-- ========================================

-- Add weight column to selected_exercises table
ALTER TABLE "selected_exercises" 
ADD COLUMN "weight" REAL;

-- Create exercise_performance table
CREATE TABLE IF NOT EXISTS "exercise_performance" (
    "athlete_session_performance_id" UUID NOT NULL,
    "selected_exercise_id" UUID NOT NULL,
    "target_repetitions" INTEGER,
    "repetitions" INTEGER,
    "target_series" INTEGER,
    "series" INTEGER,
    "target_weight" REAL,
    "weight" REAL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "last_changed" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("athlete_session_performance_id", "selected_exercise_id"),
    FOREIGN KEY ("athlete_session_performance_id") REFERENCES "athlete_session_performance"("id") ON DELETE CASCADE,
    FOREIGN KEY ("selected_exercise_id") REFERENCES "selected_exercises"("id") ON DELETE CASCADE
);

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger to automatically update last_changed on exercise_performance
CREATE OR REPLACE FUNCTION set_last_changed_exercise_performance()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_changed = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_last_changed_exercise_performance
    BEFORE UPDATE ON "exercise_performance"
    FOR EACH ROW
    EXECUTE FUNCTION set_last_changed_exercise_performance();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on exercise_performance table
ALTER TABLE "exercise_performance" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access exercise_performance records for their own athletes
CREATE POLICY "Users can access their own exercise performance data" ON "exercise_performance"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "athlete_session_performance" asp
            JOIN "athlete" a ON asp.athlete_id = a.id
            WHERE asp.id = "exercise_performance".athlete_session_performance_id
            AND a.coach_id = auth.uid()
        )
    );

-- ========================================
-- INDEXES
-- ========================================

-- Performance indexes for exercise_performance table
CREATE INDEX IF NOT EXISTS idx_exercise_performance_last_changed ON "exercise_performance"("last_changed");
CREATE INDEX IF NOT EXISTS idx_exercise_performance_deleted_at ON "exercise_performance"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_exercise_performance_deleted_last_changed ON "exercise_performance"("deleted_at", "last_changed");
CREATE INDEX IF NOT EXISTS idx_exercise_performance_athlete_session ON "exercise_performance"("athlete_session_performance_id");
CREATE INDEX IF NOT EXISTS idx_exercise_performance_selected_exercise ON "exercise_performance"("selected_exercise_id");

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_exercise_performance_session_exercise_deleted ON "exercise_performance"("athlete_session_performance_id", "selected_exercise_id", "deleted_at");

-- ========================================
-- CASCADING SOFT DELETE TRIGGERS
-- ========================================

-- Function to cascade soft deletes from athlete_session_performance to exercise_performance
CREATE OR REPLACE FUNCTION cascade_soft_delete_athlete_session_performance()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.deleted_at IS DISTINCT FROM NEW.deleted_at THEN
        UPDATE "exercise_performance" 
        SET deleted_at = NEW.deleted_at,
            last_changed = NOW()
        WHERE athlete_session_performance_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cascade_soft_delete_athlete_session_performance
    AFTER UPDATE OF deleted_at ON "athlete_session_performance"
    FOR EACH ROW
    EXECUTE FUNCTION cascade_soft_delete_athlete_session_performance();

-- Function to cascade soft deletes from selected_exercises to exercise_performance
CREATE OR REPLACE FUNCTION cascade_soft_delete_selected_exercises()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.deleted_at IS DISTINCT FROM NEW.deleted_at THEN
        UPDATE "exercise_performance" 
        SET deleted_at = NEW.deleted_at,
            last_changed = NOW()
        WHERE selected_exercise_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update existing trigger or create new one for selected_exercises
DROP TRIGGER IF EXISTS cascade_soft_delete_selected_exercises ON "selected_exercises";
CREATE TRIGGER cascade_soft_delete_selected_exercises
    AFTER UPDATE OF deleted_at ON "selected_exercises"
    FOR EACH ROW
    EXECUTE FUNCTION cascade_soft_delete_selected_exercises();

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE "exercise_performance" IS 'Tracks individual exercise performance within training sessions';
COMMENT ON COLUMN "exercise_performance"."athlete_session_performance_id" IS 'Reference to the athlete session performance record';
COMMENT ON COLUMN "exercise_performance"."selected_exercise_id" IS 'Reference to the selected exercise in the training plan';
COMMENT ON COLUMN "exercise_performance"."target_repetitions" IS 'Target number of repetitions for this exercise';
COMMENT ON COLUMN "exercise_performance"."repetitions" IS 'Actual number of repetitions performed';
COMMENT ON COLUMN "exercise_performance"."target_series" IS 'Target number of series/sets for this exercise';
COMMENT ON COLUMN "exercise_performance"."series" IS 'Actual number of series/sets performed';
COMMENT ON COLUMN "exercise_performance"."target_weight" IS 'Target weight for this exercise (nullable)';
COMMENT ON COLUMN "exercise_performance"."weight" IS 'Actual weight used for this exercise (nullable)';
COMMENT ON COLUMN "selected_exercises"."weight" IS 'Default weight for this exercise in the training plan (nullable)'; 
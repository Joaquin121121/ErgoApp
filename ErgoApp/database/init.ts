import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";
import { DatabaseInstance } from "../adapters/DatabaseAdapter";

// Database schema SQL - inline since expo-file-system is not available
const SCHEMA_SQL = `
-- SQLite version of public schema tables

-- Function replacement for set_last_changed
-- SQLite doesn't support functions like PostgreSQL, but we can use triggers to achieve similar functionality

-- Base tables

CREATE TABLE IF NOT EXISTS "athlete" (
    "id" UUID PRIMARY KEY,
    "coach_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TEXT,
    "country" TEXT,
    "state" TEXT,
    "gender" TEXT CHECK (gender IN ('M', 'F', 'O', '')),
    "height" TEXT,
    "height_unit" TEXT CHECK (height_unit IN ('cm', 'ft')),
    "weight" TEXT,
    "weight_unit" TEXT CHECK (weight_unit IN ('kgs', 'lbs')),
    "discipline" TEXT,
    "category" TEXT,
    "institution" TEXT,
    "comments" TEXT,
    "email" TEXT,
    "character" TEXT,
    "notifications" TEXT,
    "objectives" TEXT,
    "gamification_features" TEXT,
    "current_training_plan" TEXT,
    "wellness_data" TEXT,
    "session_performance_data" TEXT,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("coach_id") REFERENCES "coach"("id")
);

CREATE TABLE IF NOT EXISTS "coach" (
    "email" TEXT NOT NULL UNIQUE,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "info" TEXT,
    "specialty" TEXT,
    "id" UUID PRIMARY KEY,
    "created_at" TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "base_result" (
    "id" UUID PRIMARY KEY,
    "takeoff_foot" TEXT NOT NULL CHECK (takeoff_foot IN ('right', 'left', 'both')),
    "sensitivity" REAL NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "athlete_id" UUID NOT NULL,
    FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id")
);

CREATE TABLE IF NOT EXISTS "basic_result" (
    "id" UUID PRIMARY KEY,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    "type" TEXT NOT NULL CHECK (type IN ('cmj', 'abalakov', 'squatJump', 'custom')),
    "load" REAL NOT NULL,
    "loadunit" TEXT NOT NULL CHECK (loadunit IN ('kgs', 'lbs')),
    "base_result_id" UUID NOT NULL,
    "bosco_result_id" UUID,
    FOREIGN KEY ("base_result_id") REFERENCES "base_result"("id"),
    FOREIGN KEY ("bosco_result_id") REFERENCES "bosco_result"("id")
);

CREATE TABLE IF NOT EXISTS "bosco_result" (
    "id" UUID PRIMARY KEY,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    "athlete_id" UUID,
    FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id")
);

CREATE TABLE IF NOT EXISTS "drop_jump_result" (
    "id" UUID PRIMARY KEY,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    "height" TEXT NOT NULL,
    "stiffness" NUMERIC NOT NULL,
    "base_result_id" UUID NOT NULL,
    "multiple_drop_jump_id" UUID,
    FOREIGN KEY ("base_result_id") REFERENCES "base_result"("id"),
    FOREIGN KEY ("multiple_drop_jump_id") REFERENCES "multiple_drop_jump_result"("id")
);

CREATE TABLE IF NOT EXISTS "event" (
    "id" UUID PRIMARY KEY,
    "event_type" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_date" TIMESTAMP NOT NULL,
    "duration" INTEGER,
    "last_changed" TIMESTAMP,
    "coach_id" UUID NOT NULL,
    "deleted_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("coach_id") REFERENCES "coach"("id")
);

CREATE TABLE IF NOT EXISTS "events_athletes" (
    "event_id" UUID NOT NULL,
    "athlete_id" UUID NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    PRIMARY KEY ("event_id", "athlete_id"),
    FOREIGN KEY ("event_id") REFERENCES "event"("id"),
    FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id")
);

CREATE TABLE IF NOT EXISTS "jump_time" (
    "id" UUID PRIMARY KEY,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "base_result_id" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "time" REAL NOT NULL,
    "deleted" BOOLEAN NOT NULL,
    "floor_time" REAL,
    "stiffness" REAL,
    "performance" REAL,
    "last_changed" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    FOREIGN KEY ("base_result_id") REFERENCES "base_result"("id")
);

CREATE TABLE IF NOT EXISTS "multiple_drop_jump_result" (
    "id" UUID PRIMARY KEY,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    "height_unit" TEXT NOT NULL CHECK (height_unit IN ('cm', 'ft')),
    "takeoff_foot" TEXT NOT NULL CHECK (takeoff_foot IN ('right', 'left', 'both')),
    "best_height" TEXT NOT NULL,
    "athlete_id" UUID NOT NULL,
    FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id")
);

CREATE TABLE IF NOT EXISTS "multiple_jumps_result" (
    "id" UUID PRIMARY KEY,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    "criteria" TEXT NOT NULL CHECK (criteria IN ('numberOfJumps', 'stiffness', 'time')),
    "criteria_value" NUMERIC,
    "base_result_id" UUID NOT NULL,
    FOREIGN KEY ("base_result_id") REFERENCES "base_result"("id")
);

-- Base exercises table
CREATE TABLE IF NOT EXISTS "exercises" (
    "id" UUID PRIMARY KEY,
    "name" TEXT NOT NULL,
    "video_ref" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP
);

-- Training plans table
CREATE TABLE IF NOT EXISTS "training_plans" (
    "id" UUID PRIMARY KEY,
    "n_of_weeks" INTEGER NOT NULL DEFAULT 4,
    "n_of_sessions" INTEGER NOT NULL DEFAULT 0,
    "user_id" UUID,
    "athlete_id" UUID,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "coach"("id"),
    FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id")
);

-- Training models table
CREATE TABLE IF NOT EXISTS "training_models" (
    "id" UUID PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "training_plan_id" UUID NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    FOREIGN KEY ("training_plan_id") REFERENCES "training_plans"("id")
);

-- Sessions table
CREATE TABLE IF NOT EXISTS "sessions" (
    "id" UUID PRIMARY KEY,
    "plan_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    FOREIGN KEY ("plan_id") REFERENCES "training_plans"("id")
);

-- Session days table (for the days array)
CREATE TABLE IF NOT EXISTS "session_days" (
    "id" UUID PRIMARY KEY,
    "session_id" UUID NOT NULL,
    "day_name" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    FOREIGN KEY ("session_id") REFERENCES "sessions"("id")
);

-- Training blocks table
CREATE TABLE IF NOT EXISTS "training_blocks" (
    "id" UUID PRIMARY KEY,
    "session_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "series" INTEGER NOT NULL DEFAULT 3,
    "repetitions" TEXT NOT NULL DEFAULT '8-12',
    "effort" INTEGER NOT NULL DEFAULT 70,
    "block_model" TEXT NOT NULL DEFAULT 'sequential' CHECK (block_model IN ('sequential', 'series')),
    "comments" TEXT,
    "rest_time" INTEGER NOT NULL DEFAULT 60,
    "index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    FOREIGN KEY ("session_id") REFERENCES "sessions"("id")
);

-- Selected exercises table
CREATE TABLE IF NOT EXISTS "selected_exercises" (
    "id" UUID PRIMARY KEY,
    "session_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "block_id" UUID, -- NULL if exercise is directly in session
    "series" INTEGER NOT NULL DEFAULT 3,
    "repetitions" TEXT NOT NULL DEFAULT '8-12',
    "effort" INTEGER NOT NULL DEFAULT 70,
    "rest_time" INTEGER NOT NULL DEFAULT 60,
    "comments" TEXT,
    "index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    FOREIGN KEY ("session_id") REFERENCES "sessions"("id"),
    FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id"),
    FOREIGN KEY ("block_id") REFERENCES "training_blocks"("id")
);

-- Progressions table (for both selected exercises and training blocks)
CREATE TABLE IF NOT EXISTS "progressions" (
    "id" UUID PRIMARY KEY,
    "selected_exercise_id" UUID,
    "training_block_id" UUID,
    "series" INTEGER NOT NULL,
    "repetitions" TEXT NOT NULL,
    "effort" INTEGER NOT NULL,
    "week_number" INTEGER NOT NULL DEFAULT 1, -- To maintain order of progressions
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    FOREIGN KEY ("selected_exercise_id") REFERENCES "selected_exercises"("id"),
    FOREIGN KEY ("training_block_id") REFERENCES "training_blocks"("id"),
    
    -- Ensure progression belongs to either exercise or block, not both
    CHECK (
        (selected_exercise_id IS NOT NULL AND training_block_id IS NULL) OR
        (selected_exercise_id IS NULL AND training_block_id IS NOT NULL)
    )
);

-- Volume reductions table
CREATE TABLE IF NOT EXISTS "volume_reductions" (
    "id" UUID PRIMARY KEY,
    "selected_exercise_id" UUID,
    "training_block_id" UUID,
    "fatigue_level" TEXT NOT NULL,
    "reduction_percentage" INTEGER NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    FOREIGN KEY ("selected_exercise_id") REFERENCES "selected_exercises"("id"),
    FOREIGN KEY ("training_block_id") REFERENCES "training_blocks"("id"),
    
    -- Ensure reduction belongs to either exercise or block, not both
    CHECK (
        (selected_exercise_id IS NOT NULL AND training_block_id IS NULL) OR
        (selected_exercise_id IS NULL AND training_block_id IS NOT NULL)
    )
);

-- Effort reductions table
CREATE TABLE IF NOT EXISTS "effort_reductions" (
    "id" UUID PRIMARY KEY,
    "selected_exercise_id" UUID,
    "training_block_id" UUID,
    "effort_level" TEXT NOT NULL,
    "reduction_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    FOREIGN KEY ("selected_exercise_id") REFERENCES "selected_exercises"("id"),
    FOREIGN KEY ("training_block_id") REFERENCES "training_blocks"("id"),
    
    -- Ensure reduction belongs to either exercise or block, not both
    CHECK (
        (selected_exercise_id IS NOT NULL AND training_block_id IS NULL) OR
        (selected_exercise_id IS NULL AND training_block_id IS NOT NULL)
    )
);

-- Athlete weekly stats table for wellness and performance tracking
CREATE TABLE IF NOT EXISTS "athlete_weekly_stats" (
    "athlete_id" TEXT NOT NULL,  -- Using TEXT for UUID in SQLite
    "week_start_date" DATE NOT NULL,
    -- Wellness metrics (with checks between 1-10)
    "sleep" DECIMAL(3,1) CHECK (sleep >= 1 AND sleep <= 10),
    "nutrition" DECIMAL(3,1) CHECK (nutrition >= 1 AND nutrition <= 10),
    "fatigue" DECIMAL(3,1) CHECK (fatigue >= 1 AND fatigue <= 10),

    -- Metadata
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP,
    -- Constraints
    PRIMARY KEY ("athlete_id", "week_start_date"),
    -- Ensure week_start_date is always a Monday (SQLite uses strftime)
    CONSTRAINT week_starts_monday CHECK (strftime('%w', week_start_date) = '1'),
    FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id") ON DELETE CASCADE
);

-- Athlete session performance table for tracking training session performance
CREATE TABLE IF NOT EXISTS "athlete_session_performance" (
    "week_start_date" DATE NOT NULL,
    "session_id" TEXT NOT NULL,
    -- Performance metrics
    "performance" INTEGER NOT NULL CHECK (performance >= 0),
    "completed_exercises" INTEGER NOT NULL CHECK (completed_exercises >= 0),
    "athlete_id" TEXT NOT NULL,
    -- Metadata
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP,
    -- Constraints
    PRIMARY KEY ("session_id", "week_start_date"),
    -- Ensure week_start_date is always a Monday (SQLite uses strftime)
    CONSTRAINT session_week_starts_monday CHECK (strftime('%w', week_start_date) = '1'),
    FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id") ON DELETE CASCADE,
    FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE
);
`;

const TRIGGERS_SQL = `
-- Triggers to simulate last_changed functionality

-- athlete table
CREATE TRIGGER IF NOT EXISTS set_last_changed_athlete
AFTER UPDATE ON "athlete"
BEGIN
    UPDATE "athlete" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- base_result table
CREATE TRIGGER IF NOT EXISTS set_last_changed_base_result
AFTER UPDATE ON "base_result"
BEGIN
    UPDATE "base_result" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- basic_result table
CREATE TRIGGER IF NOT EXISTS set_last_changed_basic_result
AFTER UPDATE ON "basic_result"
BEGIN
    UPDATE "basic_result" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- bosco_result table
CREATE TRIGGER IF NOT EXISTS set_last_changed_bosco_result
AFTER UPDATE ON "bosco_result"
BEGIN
    UPDATE "bosco_result" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- coach table
CREATE TRIGGER IF NOT EXISTS set_last_changed_coach
AFTER UPDATE ON "coach"
BEGIN
    UPDATE "coach" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- drop_jump_result table
CREATE TRIGGER IF NOT EXISTS set_last_changed_drop_jump_result
AFTER UPDATE ON "drop_jump_result"
BEGIN
    UPDATE "drop_jump_result" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- event table
CREATE TRIGGER IF NOT EXISTS set_last_changed_event
AFTER UPDATE ON "event"
BEGIN
    UPDATE "event" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- jump_time table
CREATE TRIGGER IF NOT EXISTS set_last_changed_jump_time
AFTER UPDATE ON "jump_time"
BEGIN
    UPDATE "jump_time" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- multiple_drop_jump_result table
CREATE TRIGGER IF NOT EXISTS set_last_changed_multiple_drop_jump_result
AFTER UPDATE ON "multiple_drop_jump_result"
BEGIN
    UPDATE "multiple_drop_jump_result" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- multiple_jumps_result table
CREATE TRIGGER IF NOT EXISTS set_last_changed_multiple_jumps_result
AFTER UPDATE ON "multiple_jumps_result"
BEGIN
    UPDATE "multiple_jumps_result" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- events_athletes table
CREATE TRIGGER IF NOT EXISTS set_last_changed_events_athletes
AFTER UPDATE ON "events_athletes"
BEGIN
    UPDATE "events_athletes" SET last_changed = CURRENT_TIMESTAMP WHERE event_id = NEW.event_id AND athlete_id = NEW.athlete_id;
END;

-- exercises table
CREATE TRIGGER IF NOT EXISTS set_last_changed_exercises
AFTER UPDATE ON "exercises"
BEGIN
    UPDATE "exercises" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- training_plans table
CREATE TRIGGER IF NOT EXISTS set_last_changed_training_plans
AFTER UPDATE ON "training_plans"
BEGIN
    UPDATE "training_plans" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- training_models table
CREATE TRIGGER IF NOT EXISTS set_last_changed_training_models
AFTER UPDATE ON "training_models"
BEGIN
    UPDATE "training_models" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- sessions table
CREATE TRIGGER IF NOT EXISTS set_last_changed_sessions
AFTER UPDATE ON "sessions"
BEGIN
    UPDATE "sessions" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- session_days table
CREATE TRIGGER IF NOT EXISTS set_last_changed_session_days
AFTER UPDATE ON "session_days"
BEGIN
    UPDATE "session_days" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- training_blocks table
CREATE TRIGGER IF NOT EXISTS set_last_changed_training_blocks
AFTER UPDATE ON "training_blocks"
BEGIN
    UPDATE "training_blocks" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- selected_exercises table
CREATE TRIGGER IF NOT EXISTS set_last_changed_selected_exercises
AFTER UPDATE ON "selected_exercises"
BEGIN
    UPDATE "selected_exercises" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- progressions table
CREATE TRIGGER IF NOT EXISTS set_last_changed_progressions
AFTER UPDATE ON "progressions"
BEGIN
    UPDATE "progressions" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- volume_reductions table
CREATE TRIGGER IF NOT EXISTS set_last_changed_volume_reductions
AFTER UPDATE ON "volume_reductions"
BEGIN
    UPDATE "volume_reductions" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- effort_reductions table
CREATE TRIGGER IF NOT EXISTS set_last_changed_effort_reductions
AFTER UPDATE ON "effort_reductions"
BEGIN
    UPDATE "effort_reductions" SET last_changed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- athlete_weekly_stats table
CREATE TRIGGER IF NOT EXISTS set_last_changed_athlete_weekly_stats
AFTER UPDATE ON "athlete_weekly_stats"
FOR EACH ROW
BEGIN
    UPDATE "athlete_weekly_stats" 
    SET last_changed = CURRENT_TIMESTAMP
    WHERE athlete_id = NEW.athlete_id 
    AND week_start_date = NEW.week_start_date;
END;

-- athlete_session_performance table
CREATE TRIGGER IF NOT EXISTS set_last_changed_athlete_session_performance
AFTER UPDATE ON "athlete_session_performance"
FOR EACH ROW
BEGIN
    UPDATE "athlete_session_performance" 
    SET last_changed = CURRENT_TIMESTAMP
    WHERE session_id = NEW.session_id 
    AND week_start_date = NEW.week_start_date;
END;
`;

const INDEXES_SQL = `
-- ========================================
-- PERFORMANCE INDEXES
-- ========================================

-- Primary indexes for sync performance (last_changed fields)
-- These are critical for incremental sync operations
CREATE INDEX IF NOT EXISTS idx_exercises_last_changed ON "exercises"("last_changed");
CREATE INDEX IF NOT EXISTS idx_training_plans_last_changed ON "training_plans"("last_changed");
CREATE INDEX IF NOT EXISTS idx_training_models_last_changed ON "training_models"("last_changed");
CREATE INDEX IF NOT EXISTS idx_sessions_last_changed ON "sessions"("last_changed");
CREATE INDEX IF NOT EXISTS idx_session_days_last_changed ON "session_days"("last_changed");
CREATE INDEX IF NOT EXISTS idx_training_blocks_last_changed ON "training_blocks"("last_changed");
CREATE INDEX IF NOT EXISTS idx_selected_exercises_last_changed ON "selected_exercises"("last_changed");
CREATE INDEX IF NOT EXISTS idx_progressions_last_changed ON "progressions"("last_changed");
CREATE INDEX IF NOT EXISTS idx_volume_reductions_last_changed ON "volume_reductions"("last_changed");
CREATE INDEX IF NOT EXISTS idx_effort_reductions_last_changed ON "effort_reductions"("last_changed");
CREATE INDEX IF NOT EXISTS idx_events_athletes_last_changed ON "events_athletes"("last_changed");

-- Soft deletion indexes (deleted_at fields)
-- These optimize queries that filter out deleted records
CREATE INDEX IF NOT EXISTS idx_exercises_deleted_at ON "exercises"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_training_plans_deleted_at ON "training_plans"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_training_models_deleted_at ON "training_models"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_sessions_deleted_at ON "sessions"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_session_days_deleted_at ON "session_days"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_training_blocks_deleted_at ON "training_blocks"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_selected_exercises_deleted_at ON "selected_exercises"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_progressions_deleted_at ON "progressions"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_volume_reductions_deleted_at ON "volume_reductions"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_effort_reductions_deleted_at ON "effort_reductions"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_events_athletes_deleted_at ON "events_athletes"("deleted_at");

-- Foreign key indexes for join performance
CREATE INDEX IF NOT EXISTS idx_training_plans_user_id ON "training_plans"("user_id");
CREATE INDEX IF NOT EXISTS idx_training_models_training_plan_id ON "training_models"("training_plan_id");
CREATE INDEX IF NOT EXISTS idx_sessions_plan_id ON "sessions"("plan_id");
CREATE INDEX IF NOT EXISTS idx_session_days_session_id ON "session_days"("session_id");
CREATE INDEX IF NOT EXISTS idx_training_blocks_session_id ON "training_blocks"("session_id");
CREATE INDEX IF NOT EXISTS idx_selected_exercises_session_id ON "selected_exercises"("session_id");
CREATE INDEX IF NOT EXISTS idx_selected_exercises_exercise_id ON "selected_exercises"("exercise_id");
CREATE INDEX IF NOT EXISTS idx_selected_exercises_block_id ON "selected_exercises"("block_id");
CREATE INDEX IF NOT EXISTS idx_progressions_selected_exercise_id ON "progressions"("selected_exercise_id");
CREATE INDEX IF NOT EXISTS idx_progressions_training_block_id ON "progressions"("training_block_id");
CREATE INDEX IF NOT EXISTS idx_volume_reductions_selected_exercise_id ON "volume_reductions"("selected_exercise_id");
CREATE INDEX IF NOT EXISTS idx_volume_reductions_training_block_id ON "volume_reductions"("training_block_id");
CREATE INDEX IF NOT EXISTS idx_effort_reductions_selected_exercise_id ON "effort_reductions"("selected_exercise_id");
CREATE INDEX IF NOT EXISTS idx_effort_reductions_training_block_id ON "effort_reductions"("training_block_id");
CREATE INDEX IF NOT EXISTS idx_events_athletes_event_id ON "events_athletes"("event_id");
CREATE INDEX IF NOT EXISTS idx_events_athletes_athlete_id ON "events_athletes"("athlete_id");

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_athlete_weekly_stats_date ON "athlete_weekly_stats"("week_start_date");
CREATE INDEX IF NOT EXISTS idx_athlete_session_performance_date ON "athlete_session_performance"("week_start_date");

-- Indexes for sync performance
CREATE INDEX IF NOT EXISTS idx_athlete_weekly_stats_last_changed ON "athlete_weekly_stats"("last_changed");
CREATE INDEX IF NOT EXISTS idx_athlete_weekly_stats_deleted_at ON "athlete_weekly_stats"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_athlete_weekly_stats_deleted_last_changed ON "athlete_weekly_stats"("deleted_at", "last_changed");
CREATE INDEX IF NOT EXISTS idx_athlete_session_performance_last_changed ON "athlete_session_performance"("last_changed");
CREATE INDEX IF NOT EXISTS idx_athlete_session_performance_deleted_at ON "athlete_session_performance"("deleted_at");
CREATE INDEX IF NOT EXISTS idx_athlete_session_performance_deleted_last_changed ON "athlete_session_performance"("deleted_at", "last_changed");

-- Composite index for athlete-specific queries
CREATE INDEX IF NOT EXISTS idx_athlete_weekly_stats_athlete_date ON "athlete_weekly_stats"("athlete_id", "week_start_date");
CREATE INDEX IF NOT EXISTS idx_athlete_session_performance_athlete_date ON "athlete_session_performance"("athlete_id", "week_start_date");
`;

const CASCADE_TRIGGERS_SQL = `
-- ========================================
-- CASCADING SOFT DELETE TRIGGERS
-- ========================================

-- Parent: athlete
CREATE TRIGGER IF NOT EXISTS cascade_soft_delete_athlete
AFTER UPDATE OF deleted_at ON "athlete"
FOR EACH ROW
BEGIN
    UPDATE "base_result" SET deleted_at = NEW.deleted_at WHERE athlete_id = NEW.id;
    UPDATE "bosco_result" SET deleted_at = NEW.deleted_at WHERE athlete_id = NEW.id;
    UPDATE "events_athletes" SET deleted_at = NEW.deleted_at WHERE athlete_id = NEW.id;
    UPDATE "multiple_drop_jump_result" SET deleted_at = NEW.deleted_at WHERE athlete_id = NEW.id;
    UPDATE "athlete_weekly_stats" SET deleted_at = NEW.deleted_at WHERE athlete_id = NEW.id;
    UPDATE "athlete_session_performance" SET deleted_at = NEW.deleted_at WHERE athlete_id = NEW.id;
END;

-- Parent: base_result
CREATE TRIGGER IF NOT EXISTS cascade_soft_delete_base_result
AFTER UPDATE OF deleted_at ON "base_result"
FOR EACH ROW
BEGIN
    UPDATE "basic_result" SET deleted_at = NEW.deleted_at WHERE base_result_id = NEW.id;
    UPDATE "drop_jump_result" SET deleted_at = NEW.deleted_at WHERE base_result_id = NEW.id;
    UPDATE "jump_time" SET deleted_at = NEW.deleted_at WHERE base_result_id = NEW.id;
    UPDATE "multiple_jumps_result" SET deleted_at = NEW.deleted_at WHERE base_result_id = NEW.id;
END;

-- Parent: bosco_result
CREATE TRIGGER IF NOT EXISTS cascade_soft_delete_bosco_result
AFTER UPDATE OF deleted_at ON "bosco_result"
FOR EACH ROW
BEGIN
    UPDATE "basic_result" SET deleted_at = NEW.deleted_at WHERE bosco_result_id = NEW.id;
END;

-- Parent: multiple_drop_jump_result
CREATE TRIGGER IF NOT EXISTS cascade_soft_delete_multiple_drop_jump_result
AFTER UPDATE OF deleted_at ON "multiple_drop_jump_result"
FOR EACH ROW
BEGIN
    UPDATE "drop_jump_result" SET deleted_at = NEW.deleted_at WHERE multiple_drop_jump_id = NEW.id;
END;

-- Parent: event
CREATE TRIGGER IF NOT EXISTS cascade_soft_delete_event
AFTER UPDATE OF deleted_at ON "event"
FOR EACH ROW
BEGIN
    UPDATE "events_athletes" SET deleted_at = NEW.deleted_at WHERE event_id = NEW.id;
END;

-- Parent: training_plans
CREATE TRIGGER IF NOT EXISTS cascade_soft_delete_training_plans
AFTER UPDATE OF deleted_at ON "training_plans"
FOR EACH ROW
BEGIN
    UPDATE "training_models" SET deleted_at = NEW.deleted_at WHERE training_plan_id = NEW.id;
    UPDATE "sessions" SET deleted_at = NEW.deleted_at WHERE plan_id = NEW.id;
END;

-- Parent: sessions
CREATE TRIGGER IF NOT EXISTS cascade_soft_delete_sessions
AFTER UPDATE OF deleted_at ON "sessions"
FOR EACH ROW
BEGIN
    UPDATE "session_days" SET deleted_at = NEW.deleted_at WHERE session_id = NEW.id;
    UPDATE "training_blocks" SET deleted_at = NEW.deleted_at WHERE session_id = NEW.id;
    UPDATE "selected_exercises" SET deleted_at = NEW.deleted_at WHERE session_id = NEW.id;
    UPDATE "athlete_session_performance" SET deleted_at = NEW.deleted_at WHERE session_id = NEW.id;
END;

-- Parent: training_blocks
CREATE TRIGGER IF NOT EXISTS cascade_soft_delete_training_blocks
AFTER UPDATE OF deleted_at ON "training_blocks"
FOR EACH ROW
BEGIN
    UPDATE "selected_exercises" SET deleted_at = NEW.deleted_at WHERE block_id = NEW.id;
    UPDATE "progressions" SET deleted_at = NEW.deleted_at WHERE training_block_id = NEW.id;
    UPDATE "volume_reductions" SET deleted_at = NEW.deleted_at WHERE training_block_id = NEW.id;
    UPDATE "effort_reductions" SET deleted_at = NEW.deleted_at WHERE training_block_id = NEW.id;
END;

-- Parent: exercises
CREATE TRIGGER IF NOT EXISTS cascade_soft_delete_exercises
AFTER UPDATE OF deleted_at ON "exercises"
FOR EACH ROW
BEGIN
    UPDATE "selected_exercises" SET deleted_at = NEW.deleted_at WHERE exercise_id = NEW.id;
END;

-- Parent: selected_exercises
CREATE TRIGGER IF NOT EXISTS cascade_soft_delete_selected_exercises
AFTER UPDATE OF deleted_at ON "selected_exercises"
FOR EACH ROW
BEGIN
    UPDATE "progressions" SET deleted_at = NEW.deleted_at WHERE selected_exercise_id = NEW.id;
    UPDATE "volume_reductions" SET deleted_at = NEW.deleted_at WHERE selected_exercise_id = NEW.id;
    UPDATE "effort_reductions" SET deleted_at = NEW.deleted_at WHERE selected_exercise_id = NEW.id;
END;
`;

const INDEX_MANAGEMENT_TRIGGERS_SQL = `
-- ========================================
-- INDEX MANAGEMENT TRIGGERS
-- ========================================

-- Auto-assign index for training_blocks on insert (unified session indexing)
CREATE TRIGGER IF NOT EXISTS auto_index_training_blocks_insert
AFTER INSERT ON "training_blocks"
FOR EACH ROW
WHEN NEW."index" = 0
BEGIN
    UPDATE "training_blocks" 
    SET "index" = (
        SELECT MAX(unified_index) + 1 FROM (
            SELECT COALESCE(MAX("index"), 0) as unified_index
            FROM "training_blocks" 
            WHERE "session_id" = NEW.session_id 
            AND "deleted_at" IS NULL
            AND "id" != NEW.id
            
            UNION ALL
            
            SELECT COALESCE(MAX("index"), 0) as unified_index
            FROM "selected_exercises" 
            WHERE "session_id" = NEW.session_id 
            AND "block_id" IS NULL
            AND "deleted_at" IS NULL
        )
    )
    WHERE "id" = NEW.id;
END;

-- Auto-assign index for selected_exercises on insert (session-level - unified indexing)
CREATE TRIGGER IF NOT EXISTS auto_index_selected_exercises_session_insert
AFTER INSERT ON "selected_exercises"
FOR EACH ROW
WHEN NEW."index" = 0 AND NEW.block_id IS NULL
BEGIN
    UPDATE "selected_exercises" 
    SET "index" = (
        SELECT MAX(unified_index) + 1 FROM (
            SELECT COALESCE(MAX("index"), 0) as unified_index
            FROM "training_blocks" 
            WHERE "session_id" = NEW.session_id 
            AND "deleted_at" IS NULL
            
            UNION ALL
            
            SELECT COALESCE(MAX("index"), 0) as unified_index
            FROM "selected_exercises" 
            WHERE "session_id" = NEW.session_id 
            AND "block_id" IS NULL
            AND "deleted_at" IS NULL
            AND "id" != NEW.id
        )
    )
    WHERE "id" = NEW.id;
END;

-- Auto-assign index for selected_exercises on insert (block-level - separate indexing)
CREATE TRIGGER IF NOT EXISTS auto_index_selected_exercises_block_insert
AFTER INSERT ON "selected_exercises"
FOR EACH ROW
WHEN NEW."index" = 0 AND NEW.block_id IS NOT NULL
BEGIN
    UPDATE "selected_exercises" 
    SET "index" = (
        SELECT COALESCE(MAX("index"), 0) + 1 
        FROM "selected_exercises" 
        WHERE "block_id" = NEW.block_id 
        AND "deleted_at" IS NULL
        AND "id" != NEW.id
    )
    WHERE "id" = NEW.id;
END;

-- Update training_plans.n_of_sessions when a session is inserted
CREATE TRIGGER IF NOT EXISTS update_plan_sessions_count_insert
AFTER INSERT ON "sessions"
FOR EACH ROW
BEGIN
    UPDATE "training_plans" 
    SET "n_of_sessions" = (
        SELECT COUNT(*) 
        FROM "sessions" 
        WHERE "plan_id" = NEW.plan_id 
        AND "deleted_at" IS NULL
    )
    WHERE "id" = NEW.plan_id;
END;

-- Update training_plans.n_of_sessions when a session is soft deleted or restored
CREATE TRIGGER IF NOT EXISTS update_plan_sessions_count_delete
AFTER UPDATE OF deleted_at ON "sessions"
FOR EACH ROW
WHEN OLD.deleted_at IS DISTINCT FROM NEW.deleted_at
BEGIN
    UPDATE "training_plans" 
    SET "n_of_sessions" = (
        SELECT COUNT(*) 
        FROM "sessions" 
        WHERE "plan_id" = NEW.plan_id 
        AND "deleted_at" IS NULL
    )
    WHERE "id" = NEW.plan_id;
END;
`;

/**
 * Executes SQL statements in batches to avoid overwhelming the database
 */
async function executeSQLBatch(
  db: DatabaseInstance,
  sql: string,
  batchName: string
): Promise<void> {
  const statements = sql
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);

  console.log(`Executing ${statements.length} ${batchName} statements...`);

  for (const statement of statements) {
    try {
      await db.execute(statement);
    } catch (error) {
      console.error(`Error executing ${batchName} statement:`, statement);
      console.error(error);
      throw error;
    }
  }

  console.log(`✅ ${batchName} completed successfully`);
}

/**
 * Checks if the database has been initialized by looking for a key table
 */
async function isDatabaseInitialized(db: DatabaseInstance): Promise<boolean> {
  try {
    const result = await db.select(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='coach'"
    );
    return result.length > 0;
  } catch (error) {
    console.error("Error checking database initialization:", error);
    return false;
  }
}

/**
 * Initializes the database with all tables, triggers, and indexes
 * Safe to call multiple times - will only run if database is not already initialized
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log("🔄 Initializing database...");

    const db = await getDatabaseInstance();

    // Check if database is already initialized
    const isInitialized = await isDatabaseInitialized(db);
    if (isInitialized) {
      console.log("✅ Database already initialized");
      return;
    }

    console.log("📋 Creating database schema...");

    // Execute schema creation in batches
    await executeSQLBatch(db, SCHEMA_SQL, "schema");
    await executeSQLBatch(db, TRIGGERS_SQL, "triggers");
    await executeSQLBatch(db, INDEXES_SQL, "indexes");
    await executeSQLBatch(db, CASCADE_TRIGGERS_SQL, "cascade triggers");
    await executeSQLBatch(
      db,
      INDEX_MANAGEMENT_TRIGGERS_SQL,
      "index management triggers"
    );

    console.log("✅ Database initialization completed successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

/**
 * Forces database reinitialization by dropping all tables and recreating them
 * WARNING: This will destroy all data!
 */
export async function resetDatabase(): Promise<void> {
  try {
    console.log("🔄 Resetting database...");

    const db = await getDatabaseInstance();

    // Get all table names
    const tables = await db.select(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );

    // Drop all tables
    for (const table of tables) {
      await db.execute(`DROP TABLE IF EXISTS "${table.name}"`);
    }

    console.log("🗑️ All tables dropped");

    // Reinitialize
    await initializeDatabase();

    console.log("✅ Database reset completed successfully");
  } catch (error) {
    console.error("❌ Database reset failed:", error);
    throw error;
  }
}

/**
 * Gets database statistics and health information
 */
export async function getDatabaseInfo(): Promise<{
  tables: string[];
  version: string;
  pageSize: number;
  totalPages: number;
}> {
  try {
    const db = await getDatabaseInstance();

    const [tables, version, pageSize, totalPages] = await Promise.all([
      db.select(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      ),
      db.select("SELECT sqlite_version() as version"),
      db.select("PRAGMA page_size"),
      db.select("PRAGMA page_count"),
    ]);

    return {
      tables: tables.map((t) => t.name),
      version: version[0]?.version || "Unknown",
      pageSize: pageSize[0]?.page_size || 0,
      totalPages: totalPages[0]?.page_count || 0,
    };
  } catch (error) {
    console.error("Error getting database info:", error);
    throw error;
  }
}

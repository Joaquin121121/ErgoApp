-- Migration to update athlete_weekly_stats table structure
-- Changes:
-- 1. Add UUID id field as primary key
-- 2. Change week_start_date to date
-- 3. Remove composite primary key constraint
-- 4. Remove week_starts_monday constraint
-- 5. Update indexes and triggers

-- Step 1: Create new table with updated structure
CREATE TABLE "athlete_weekly_stats_new" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "athlete_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    -- Wellness metrics (with checks between 1-10)
    "sleep" DECIMAL(3,1) CHECK (sleep >= 1 AND sleep <= 10),
    "nutrition" DECIMAL(3,1) CHECK (nutrition >= 1 AND nutrition <= 10),
    "fatigue" DECIMAL(3,1) CHECK (fatigue >= 1 AND fatigue <= 10),
    -- Metadata
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "last_changed" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP,
    FOREIGN KEY ("athlete_id") REFERENCES "athlete"("id") ON DELETE CASCADE
);

-- Step 2: Copy data from old table to new table
INSERT INTO "athlete_weekly_stats_new" (
    "athlete_id", 
    "date", 
    "sleep", 
    "nutrition", 
    "fatigue", 
    "created_at", 
    "last_changed", 
    "deleted_at"
)
SELECT 
    "athlete_id", 
    "week_start_date" as "date", 
    "sleep", 
    "nutrition", 
    "fatigue", 
    "created_at", 
    "last_changed", 
    "deleted_at"
FROM "athlete_weekly_stats";

-- Step 3: Drop old table
DROP TABLE "athlete_weekly_stats";

-- Step 4: Rename new table to original name
ALTER TABLE "athlete_weekly_stats_new" RENAME TO "athlete_weekly_stats";

-- Step 5: Drop old indexes
DROP INDEX IF EXISTS idx_athlete_weekly_stats_date;
DROP INDEX IF EXISTS idx_athlete_weekly_stats_last_changed;
DROP INDEX IF EXISTS idx_athlete_weekly_stats_deleted_at;
DROP INDEX IF EXISTS idx_athlete_weekly_stats_deleted_last_changed;
DROP INDEX IF EXISTS idx_athlete_weekly_stats_athlete_date;

-- Step 6: Create new indexes
CREATE INDEX idx_athlete_weekly_stats_date ON "athlete_weekly_stats"("date");
CREATE INDEX idx_athlete_weekly_stats_last_changed ON "athlete_weekly_stats"("last_changed");
CREATE INDEX idx_athlete_weekly_stats_deleted_at ON "athlete_weekly_stats"("deleted_at");
CREATE INDEX idx_athlete_weekly_stats_deleted_last_changed ON "athlete_weekly_stats"("deleted_at", "last_changed");
CREATE INDEX idx_athlete_weekly_stats_athlete_date ON "athlete_weekly_stats"("athlete_id", "date");

-- Step 7: Drop old trigger
DROP TRIGGER IF EXISTS set_last_changed_athlete_weekly_stats ON "athlete_weekly_stats";

-- Step 8: Create new trigger function
CREATE OR REPLACE FUNCTION update_athlete_weekly_stats_last_changed()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_changed = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Create new trigger
CREATE TRIGGER set_last_changed_athlete_weekly_stats
    BEFORE UPDATE ON "athlete_weekly_stats"
    FOR EACH ROW
    EXECUTE FUNCTION update_athlete_weekly_stats_last_changed(); 
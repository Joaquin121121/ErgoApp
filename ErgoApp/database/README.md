# Database Initialization

This folder contains the database initialization system for the ErgoApp SQLite database.

## Files

- `schema.sql` - Complete database schema with tables, triggers, and indexes
- `init.ts` - TypeScript initialization functions for setting up the database

## Usage

### Basic Initialization

The simplest way to initialize the database is to call `initializeDatabase()` in your app's main component:

```typescript
import { useEffect } from 'react';
import { initializeDatabase } from '../database/init';

export default function App() {
  useEffect(() => {
    initializeDatabase()
      .then(() => console.log('Database ready'))
      .catch(error => console.error('Database initialization failed:', error));
  }, []); // Empty dependency array ensures this runs once on app start

  return (
    // Your app content
  );
}
```

### Available Functions

#### `initializeDatabase(): Promise<void>`

- Initializes the database with all tables, triggers, and indexes
- Safe to call multiple times - will only run if database is not already initialized
- Automatically detects if database is already set up

#### `resetDatabase(): Promise<void>`

- **WARNING: This will destroy all data!**
- Drops all tables and recreates them from scratch
- Useful for development or when schema changes require a fresh start

#### `getDatabaseInfo(): Promise<DatabaseInfo>`

- Returns database statistics and health information
- Includes table list, SQLite version, page size, and total pages

### Example with Error Handling

```typescript
import { useEffect, useState } from 'react';
import { initializeDatabase, getDatabaseInfo } from '../database/init';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        const info = await getDatabaseInfo();
        console.log('Database initialized with tables:', info.tables);
        setDbReady(true);
      } catch (error) {
        console.error('Database setup failed:', error);
        setDbError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    setupDatabase();
  }, []);

  if (dbError) {
    return <div>Database Error: {dbError}</div>;
  }

  if (!dbReady) {
    return <div>Setting up database...</div>;
  }

  return (
    // Your app content
  );
}
```

### Integration with Existing App

For the ErgoApp, you can add the initialization to your main layout or index file:

```typescript
// In app/_layout.tsx or app/index.tsx
import { useEffect } from 'react';
import { initializeDatabase } from '../database/init';

export default function RootLayout() {
  useEffect(() => {
    // Initialize database on app start
    initializeDatabase().catch(console.error);
  }, []);

  return (
    // Your existing layout
  );
}
```

## Features

- **Automatic Detection**: Only initializes if database is not already set up
- **Batch Execution**: Executes SQL statements in batches for better performance
- **Error Handling**: Comprehensive error handling and logging
- **Safe Operations**: Uses `CREATE TABLE IF NOT EXISTS` for all tables
- **Complete Schema**: Includes all tables, triggers, indexes, and constraints from schema.sql

## Database Schema

The initialization creates the following main table groups:

### Core Tables

- `coach` - Coach information
- `athlete` - Athlete profiles and data

### Test Results

- `base_result` - Base test result data
- `basic_result` - CMJ, squat jump, Abalakov results
- `bosco_result` - Bosco test results
- `drop_jump_result` - Drop jump test data
- `jump_time` - Individual jump timing data

### Training Plans

- `training_plans` - Training plan definitions
- `sessions` - Training sessions
- `exercises` - Exercise library
- `selected_exercises` - Exercises selected for sessions
- `training_blocks` - Exercise blocks within sessions

### Performance Tracking

- `athlete_weekly_stats` - Weekly wellness metrics
- `athlete_session_performance` - Session performance data

### Events

- `event` - Training events and competitions
- `events_athletes` - Event-athlete relationships

All tables include:

- Soft deletion support (`deleted_at` column)
- Automatic timestamp management (`created_at`, `last_changed`)
- Proper foreign key relationships
- Performance indexes for sync operations
- Cascading soft delete triggers

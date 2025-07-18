# Database Adapter System

This directory contains the database adapter system that provides a unified interface for database operations in the Expo React Native environment.

## Overview

The adapter system provides a unified interface for SQLite database operations using Expo SQLite:

- **Expo**: Uses Expo SQLite for React Native database operations

## Architecture

```
DatabaseAdapter (interface)
└── ExpoAdapter (Expo implementation)
```

## Usage

### Basic Usage

```typescript
import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";

// Returns Expo database instance
const db = await getDatabaseInstance();

// Use the unified interface for database operations
const results = await db.select("SELECT * FROM users WHERE id = ?", [userId]);
await db.execute("INSERT INTO users (name, email) VALUES (?, ?)", [
  name,
  email,
]);
```

### Manual Platform Selection

```typescript
import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";

// Explicitly specify expo platform (optional, as it's the default)
const db = await getDatabaseInstance("sqlite:ergolab.db", "expo");
```

### Using in Parsers

```typescript
import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";
import { DatabaseInstance } from "../adapters/DatabaseAdapter";

export const getEvents = async (coachId: string): Promise<Event[]> => {
  try {
    const db = await getDatabaseInstance();
    const events = await db.select(
      "SELECT * FROM event WHERE coach_id = ? AND deleted_at IS NULL",
      [coachId]
    );
    return events.map(transformEvent);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// For functions that accept external database instances
export const addEvent = async (
  event: Omit<Event, "id">,
  coachId: string,
  pushRecord: (records: PendingRecord[]) => Promise<void>,
  externalDb?: DatabaseInstance // Use DatabaseInstance type
): Promise<PendingRecord> => {
  const dbToUse = externalDb || (await getDatabaseInstance());
  // ... rest of implementation
};
```

## Platform Detection

The system automatically detects the React Native/Expo environment based on:

1. **Expo**: Checks for `window.expo` or `navigator.product === "ReactNative"`
2. **Default**: Falls back to Expo for React Native environments

## Interface

### DatabaseAdapter

```typescript
interface DatabaseAdapter {
  load(dbPath: string): Promise<DatabaseInstance>;
}
```

### DatabaseInstance

```typescript
interface DatabaseInstance {
  select(query: string, params?: any[]): Promise<any[]>;
  execute(query: string, params?: any[]): Promise<any>;
}
```

## Implementation Details

### Expo Adapter

- Uses Expo SQLite transaction-based API
- Converts callback-based operations to Promise-based
- Handles graceful fallback with mock implementation for development/testing
- Automatically strips `sqlite:` prefix from database paths

## Setup

To use the adapter system in your Expo project:

1. **Install expo-sqlite**:

   ```bash
   npx expo install expo-sqlite
   ```

2. **Import and use**:

   ```typescript
   import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";

   const db = await getDatabaseInstance("ergolab.db");
   ```

## Migration Guide

To migrate existing database code:

1. **Replace database imports**:

   ```typescript
   // Old direct SQLite usage
   import * as SQLite from "expo-sqlite";

   // New adapter usage
   import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";
   import { DatabaseInstance } from "../adapters/DatabaseAdapter";
   ```

2. **Update database initialization**:

   ```typescript
   // Old
   const db = SQLite.openDatabase("ergolab.db");

   // New
   const db = await getDatabaseInstance("ergolab.db");
   ```

3. **Update function signatures**:

   ```typescript
   // Old
   export const myFunction = async (externalDb?: any) => {

   // New
   export const myFunction = async (externalDb?: DatabaseInstance) => {
   ```

## Benefits

1. **Unified interface**: Consistent API for database operations
2. **Type safety**: Proper TypeScript interfaces for database operations
3. **Maintainability**: Centralized database handling logic
4. **Flexibility**: Easy to extend or modify database behavior
5. **Development support**: Mock implementation for testing and development

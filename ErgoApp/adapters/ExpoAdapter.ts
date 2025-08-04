import {
  DatabaseAdapter,
  DatabaseInstance,
  DatabaseResult,
} from "./DatabaseAdapter";

// Conditional import for expo-sqlite - will be available in Expo environment
let SQLite: any;
try {
  SQLite = require("expo-sqlite");
} catch (error) {
  // expo-sqlite not available, will use mock implementation
  SQLite = null;
}

// Check if we're using the modern expo-sqlite API (SDK 50+)
const isModernSQLite = SQLite && typeof SQLite.openDatabaseAsync === "function";

class ExpoDatabaseInstance implements DatabaseInstance {
  constructor(private db: any, private isModern: boolean = false) {}

  async select(query: string, params?: any[]): Promise<any[]> {
    if (this.isModern) {
      // Modern expo-sqlite API (SDK 50+)
      try {
        const result = await this.db.getAllAsync(query, params || []);
        return result || [];
      } catch (error) {
        console.error("Modern SQLite select error:", error);
        throw error;
      }
    } else {
      // Legacy expo-sqlite API
      return new Promise((resolve, reject) => {
        this.db.transaction((tx: any) => {
          tx.executeSql(
            query,
            params || [],
            (_: any, { rows }: any) => {
              resolve(rows._array);
            },
            (_: any, error: any) => {
              reject(error);
              return false;
            }
          );
        });
      });
    }
  }

  async execute(query: string, params?: any[]): Promise<any> {
    if (this.isModern) {
      // Modern expo-sqlite API (SDK 50+)
      try {
        const result = await this.db.runAsync(query, params || []);
        return {
          rowsAffected: result.changes,
          lastInsertRowId: result.lastInsertRowId,
        };
      } catch (error) {
        console.error("Modern SQLite execute error:", error);
        throw error;
      }
    } else {
      // Legacy expo-sqlite API
      return new Promise((resolve, reject) => {
        this.db.transaction((tx: any) => {
          tx.executeSql(
            query,
            params || [],
            (_: any, result: any) => {
              resolve({
                rowsAffected: result.rowsAffected,
                lastInsertRowId: result.insertId,
              });
            },
            (_: any, error: any) => {
              reject(error);
              return false;
            }
          );
        });
      });
    }
  }
}

export class ExpoAdapter implements DatabaseAdapter {
  async load(dbPath: string): Promise<DatabaseInstance> {
    // Extract database name from path (remove sqlite: prefix if present)
    const dbName = dbPath.replace(/^sqlite:/, "");

    if (SQLite) {
      try {
        if (isModernSQLite) {
          // Modern expo-sqlite API (SDK 50+)
          console.log("🔧 Using modern expo-sqlite API (SDK 50+)");
          const db = await SQLite.openDatabaseAsync(dbName);
          return new ExpoDatabaseInstance(db, true);
        } else {
          // Legacy expo-sqlite API (SDK < 50)
          console.log("🔧 Using legacy expo-sqlite API");
          const db = SQLite.openDatabase(dbName);
          return new ExpoDatabaseInstance(db, false);
        }
      } catch (error) {
        console.error("Error opening SQLite database:", error);
        console.log("🔧 Falling back to mock database");
        return this.createMockDatabase();
      }
    } else {
      console.log("🔧 expo-sqlite not available, using mock database");
      return this.createMockDatabase();
    }
  }

  private createMockDatabase(): DatabaseInstance {
    // Fallback mock implementation for development/testing
    const mockDb = {
      transaction: (callback: (tx: any) => void) => {
        const tx = {
          executeSql: (
            query: string,
            params: any[],
            success: any,
            error: any
          ) => {
            console.log("Mock Expo SQL:", query, params);
            success(null, {
              rows: { _array: [] },
              rowsAffected: 0,
              insertId: 0,
            });
          },
        };
        callback(tx);
      },
    };
    return new ExpoDatabaseInstance(mockDb, false);
  }
}

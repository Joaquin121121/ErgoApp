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

class ExpoDatabaseInstance implements DatabaseInstance {
  constructor(private db: any) {}

  async select(query: string, params?: any[]): Promise<any[]> {
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

  async execute(query: string, params?: any[]): Promise<any> {
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

export class ExpoAdapter implements DatabaseAdapter {
  async load(dbPath: string): Promise<DatabaseInstance> {
    // Extract database name from path (remove sqlite: prefix if present)
    const dbName = dbPath.replace(/^sqlite:/, "");

    if (SQLite) {
      // Open the SQLite database using expo-sqlite
      const db = SQLite.openDatabase(dbName);
      return new ExpoDatabaseInstance(db);
    } else {
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
      return new ExpoDatabaseInstance(mockDb);
    }
  }
}

// Database adapter interface for cross-platform compatibility
export interface DatabaseAdapter {
  load(dbPath: string): Promise<DatabaseInstance>;
}

export interface DatabaseInstance {
  select(query: string, params?: any[]): Promise<any[]>;
  execute(query: string, params?: any[]): Promise<any>;
}

export interface DatabaseResult {
  rowsAffected: number;
  lastInsertRowId?: number;
}

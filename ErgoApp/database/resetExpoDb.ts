import * as FileSystem from "expo-file-system";
import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";
import { initializeDatabase } from "./init";

/**
 * Information about the database file deletion operation
 */
export interface DbResetResult {
  success: boolean;
  message: string;
  filePath?: string;
  fileExisted: boolean;
  reinitializeSuccess?: boolean;
  error?: string;
}

/**
 * Resets the Expo SQLite database by deleting the database file from the file system
 * and optionally reinitializing it with a fresh schema.
 *
 * @param dbName - Name of the database file (default: 'ergolab.db')
 * @param reinitialize - Whether to create a fresh database after deletion (default: true)
 * @returns Promise<DbResetResult> with detailed information about the operation
 */
export async function resetExpoDb(
  dbName: string = "ergolab.db",
  reinitialize: boolean = true
): Promise<DbResetResult> {
  console.log("🔄 Starting Expo database reset process...");
  console.log(`📁 Database name: ${dbName}`);
  console.log(`🔄 Reinitialize after deletion: ${reinitialize}`);

  const result: DbResetResult = {
    success: false,
    message: "",
    fileExisted: false,
    reinitializeSuccess: false,
  };

  try {
    // Construct the full database file path
    // Expo SQLite stores databases in the document directory
    const dbFileName = dbName.endsWith(".db") ? dbName : `${dbName}.db`;
    const dbPath = `${FileSystem.documentDirectory}SQLite/${dbFileName}`;

    result.filePath = dbPath;
    console.log(`📍 Database file path: ${dbPath}`);

    // Check if the database file exists
    console.log("🔍 Checking if database file exists...");
    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    result.fileExisted = fileInfo.exists;

    if (fileInfo.exists) {
      console.log("✅ Database file found");
      if ("size" in fileInfo) {
        console.log(`📊 File size: ${fileInfo.size} bytes`);
      }
      if ("modificationTime" in fileInfo && fileInfo.modificationTime) {
        console.log(
          `📅 Modified: ${new Date(fileInfo.modificationTime).toISOString()}`
        );
      }

      // Delete the database file
      console.log("🗑️ Deleting database file...");
      await FileSystem.deleteAsync(dbPath, { idempotent: false });
      console.log("✅ Database file deleted successfully");

      // Verify deletion
      const verifyInfo = await FileSystem.getInfoAsync(dbPath);
      if (verifyInfo.exists) {
        throw new Error("Database file still exists after deletion attempt");
      }
      console.log("✅ Deletion verified - file no longer exists");
    } else {
      console.log("ℹ️ Database file does not exist - nothing to delete");
    }

    // Also check and clean up any potential WAL and SHM files
    const walPath = `${dbPath}-wal`;
    const shmPath = `${dbPath}-shm`;

    const [walInfo, shmInfo] = await Promise.all([
      FileSystem.getInfoAsync(walPath),
      FileSystem.getInfoAsync(shmPath),
    ]);

    if (walInfo.exists) {
      console.log("🗑️ Deleting WAL file...");
      await FileSystem.deleteAsync(walPath, { idempotent: false });
      console.log("✅ WAL file deleted");
    }

    if (shmInfo.exists) {
      console.log("🗑️ Deleting SHM file...");
      await FileSystem.deleteAsync(shmPath, { idempotent: false });
      console.log("✅ SHM file deleted");
    }

    result.success = true;
    result.message = result.fileExisted
      ? "Database file deleted successfully"
      : "No database file found to delete";

    // Reinitialize database if requested
    if (reinitialize) {
      console.log("🔄 Reinitializing database with fresh schema...");
      try {
        await initializeDatabase();
        result.reinitializeSuccess = true;
        result.message += " and reinitialized with fresh schema";
        console.log("✅ Database reinitialized successfully");
      } catch (initError) {
        console.error("❌ Failed to reinitialize database:", initError);
        result.reinitializeSuccess = false;
        result.message += " but failed to reinitialize";
        result.error =
          initError instanceof Error
            ? initError.message
            : "Unknown initialization error";
      }
    }

    console.log("✅ Database reset process completed successfully");
    return result;
  } catch (error) {
    console.error("❌ Database reset failed:", error);

    result.success = false;
    result.error =
      error instanceof Error ? error.message : "Unknown error occurred";
    result.message = `Failed to reset database: ${result.error}`;

    return result;
  }
}

/**
 * Gets information about the current database file without modifying it
 *
 * @param dbName - Name of the database file (default: 'ergolab.db')
 * @returns Promise with database file information
 */
export async function getDbFileInfo(dbName: string = "ergolab.db") {
  console.log("📊 Getting database file information...");

  try {
    const dbFileName = dbName.endsWith(".db") ? dbName : `${dbName}.db`;
    const dbPath = `${FileSystem.documentDirectory}SQLite/${dbFileName}`;

    console.log(`📍 Checking path: ${dbPath}`);

    const fileInfo = await FileSystem.getInfoAsync(dbPath);

    if (fileInfo.exists) {
      const info = {
        exists: true,
        path: dbPath,
        size: "size" in fileInfo ? fileInfo.size : 0,
        modificationTime:
          "modificationTime" in fileInfo ? fileInfo.modificationTime : 0,
        modificationDate:
          "modificationTime" in fileInfo && fileInfo.modificationTime
            ? new Date(fileInfo.modificationTime).toISOString()
            : null,
      };

      console.log("✅ Database file info:", info);
      return info;
    } else {
      console.log("ℹ️ Database file does not exist");
      return {
        exists: false,
        path: dbPath,
        size: 0,
        modificationTime: 0,
        modificationDate: null,
      };
    }
  } catch (error) {
    console.error("❌ Failed to get database file info:", error);
    throw error;
  }
}

/**
 * Lists all files in the SQLite directory
 * Useful for debugging and understanding what database-related files exist
 */
export async function listSqliteFiles() {
  console.log("📂 Listing SQLite directory contents...");

  try {
    const sqliteDir = `${FileSystem.documentDirectory}SQLite/`;
    console.log(`📍 SQLite directory: ${sqliteDir}`);

    const dirInfo = await FileSystem.getInfoAsync(sqliteDir);

    if (!dirInfo.exists) {
      console.log("ℹ️ SQLite directory does not exist");
      return [];
    }

    const files = await FileSystem.readDirectoryAsync(sqliteDir);
    console.log(`📁 Found ${files.length} files in SQLite directory:`);

    const fileDetails = await Promise.all(
      files.map(async (fileName) => {
        const filePath = `${sqliteDir}${fileName}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        return {
          name: fileName,
          path: filePath,
          size: "size" in fileInfo ? fileInfo.size : 0,
          modificationTime:
            "modificationTime" in fileInfo ? fileInfo.modificationTime : 0,
          modificationDate:
            "modificationTime" in fileInfo && fileInfo.modificationTime
              ? new Date(fileInfo.modificationTime).toISOString()
              : "Unknown",
        };
      })
    );

    fileDetails.forEach((file) => {
      console.log(
        `  📄 ${file.name} (${file.size} bytes, modified: ${file.modificationDate})`
      );
    });

    return fileDetails;
  } catch (error) {
    console.error("❌ Failed to list SQLite files:", error);
    throw error;
  }
}

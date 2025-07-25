import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";
import { TableName, tablesInfo } from "../constants/dbMetadata";
import { supabase } from "../utils/supabase";
import { useState } from "react";
import { SyncMetadata, PendingRecord } from "../types/Sync";
import { useSyncContext } from "../contexts/SyncContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useDatabaseSync = () => {
  const SYNC_METADATA_KEY = "syncMetadata";
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "complete" | "error"
  >("idle");
  const { setSyncing } = useSyncContext();

  const getInitialSyncMetadata = async (): Promise<SyncMetadata> => {
    const storedMetadata = await AsyncStorage.getItem(SYNC_METADATA_KEY);
    if (storedMetadata) {
      return JSON.parse(storedMetadata);
    } else {
      const initialMetadata: SyncMetadata = {
        lastSync: "1970-01-01T00:00:00.000Z",
        pendingRecords: [],
      };
      await AsyncStorage.setItem(
        SYNC_METADATA_KEY,
        JSON.stringify(initialMetadata)
      );
      return initialMetadata;
    }
  };

  const updateSyncMetadata = async (metadata: Partial<SyncMetadata>) => {
    const currentMetadata = await getInitialSyncMetadata();
    const updatedMetadata = {
      ...currentMetadata,
      ...metadata,
    };
    await AsyncStorage.setItem(
      SYNC_METADATA_KEY,
      JSON.stringify(updatedMetadata)
    );
  };

  const resetSyncMetadata = async () => {
    await AsyncStorage.removeItem(SYNC_METADATA_KEY);
  };

  const batchUpsertToLocal = async (
    db: any,
    tableName: string,
    records: any[]
  ) => {
    if (records.length === 0) return;

    const BATCH_SIZE = 100;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);

      try {
        for (const record of batch) {
          const fields = Object.keys(record)
            .map((field) => `"${field}"`)
            .join(", ");
          const placeholders = Object.keys(record)
            .map(() => "?")
            .join(", ");
          const values = Object.values(record);

          await db.execute(
            `INSERT OR REPLACE INTO ${String(
              tableName
            )} (${fields}) VALUES (${placeholders})`,
            values
          );
        }
      } catch (error) {
        console.log(records);
        console.error(
          `Error batch upserting to local ${String(tableName)}:`,
          error
        );
        throw error;
      }
    }
  };

  const resolveConflicts = (
    localRecords: any[],
    remoteRecords: any[],
    tableName: TableName
  ): { localWins: any[]; remoteWins: any[] } => {
    // Get the primary key(s) for this table
    const primaryKeys = tablesInfo.get(tableName)?.split(",") || ["id"];

    // Create a map key from the primary key fields
    const createMapKey = (record: any): string => {
      return primaryKeys.map((pk) => record[pk]).join("|");
    };

    const remoteRecordMap = new Map(
      remoteRecords.map((record) => [createMapKey(record), record])
    );

    const localWins: any[] = [];
    const remoteWins: any[] = [];

    // Process local records and check for conflicts
    for (const localRecord of localRecords) {
      const mapKey = createMapKey(localRecord);
      const remoteRecord = remoteRecordMap.get(mapKey);

      if (remoteRecord) {
        const localRecordDate = new Date(localRecord.last_changed);
        const remoteRecordDate = new Date(remoteRecord.last_changed);
        if (localRecordDate.getTime() > remoteRecordDate.getTime()) {
          localWins.push(localRecord);
          remoteRecordMap.delete(mapKey); // Remove from remote processing
        } else {
          remoteWins.push(remoteRecord);
        }
      } else {
        // No conflict - local record wins
        localWins.push(localRecord);
      }
    }

    // Add remaining remote records (no conflicts)
    remoteRecordMap.forEach((remoteRecord) => {
      remoteWins.push(remoteRecord);
    });

    return { localWins, remoteWins };
  };

  const fullScaleSync = async () => {
    try {
      setSyncStatus("syncing");
      setSyncing(true);
      const db = await getDatabaseInstance();
      const metadata = await getInitialSyncMetadata();
      const lastSync = metadata.lastSync;
      const tableNames = Array.from(tablesInfo.keys());

      const tableDataPromises = tableNames.map(async (tableName) => {
        const [localRecords, remoteResponse] = await Promise.all([
          db.select(
            `SELECT * FROM ${String(tableName)} WHERE last_changed > ?`,
            [lastSync]
          ),
          supabase
            .from(String(tableName))
            .select("*")
            .gt("last_changed", lastSync),
        ]);

        if (remoteResponse.error) {
          console.error(
            `Error fetching remote dirty records for ${String(tableName)}:`,
            remoteResponse.error
          );
          return {
            tableName,
            localRecords,
            remoteRecords: [],
          };
        }

        return {
          tableName,
          localRecords,
          remoteRecords: remoteResponse.data || [],
        };
      });

      const tableDataResults = await Promise.all(tableDataPromises);

      // 2. Process conflicts and prepare sync operations in parallel
      const syncOperations = tableDataResults.map(
        ({ tableName, localRecords, remoteRecords }) => {
          const { localWins, remoteWins } = resolveConflicts(
            localRecords,
            remoteRecords,
            tableName as TableName
          );

          return {
            tableName,
            localWins,
            remoteWins,
          };
        }
      );

      // 3. BATCH DATABASE OPERATIONS - Push local changes to remote in parallel
      const remoteSyncPromises = syncOperations.map(
        async ({ tableName, localWins }) => {
          if (localWins.length === 0) return;

          const BATCH_SIZE = 100;
          const batchPromises = [];

          for (let i = 0; i < localWins.length; i += BATCH_SIZE) {
            const batch = localWins.slice(i, i + BATCH_SIZE);
            // Determine the conflict resolution strategy for upsert
            const primaryKeys = tablesInfo
              .get(tableName as TableName)
              ?.split(",") || ["id"];
            const conflictColumns = primaryKeys.join(",");

            batchPromises.push(
              supabase
                .from(String(tableName))
                .upsert(batch, { onConflict: conflictColumns })
                .then(({ error }) => {
                  if (error) {
                    console.error(
                      `Error pushing batch to remote ${String(tableName)}:`,
                      error
                    );
                  }
                })
            );
          }

          await Promise.all(batchPromises);
        }
      );

      // Wait for all remote sync operations to complete
      await Promise.all(remoteSyncPromises);

      // 4. BATCH DATABASE OPERATIONS - Pull remote changes to local sequentially
      // to respect foreign key constraints
      for (const { tableName, remoteWins } of syncOperations) {
        await batchUpsertToLocal(db, tableName, remoteWins);
      }

      await updateSyncMetadata({
        lastSync: new Date().toISOString(),
        pendingRecords: [],
      });
    } catch (error) {
      setSyncStatus("error");
      console.error("Error syncing database:", error);
    } finally {
      setSyncStatus("complete");
      setSyncing(false);
    }
  };

  const pushRecord = async (record: PendingRecord | PendingRecord[]) => {
    const records = Array.isArray(record) ? record : [record];
    const currentMetadata = await getInitialSyncMetadata();
    await updateSyncMetadata({
      pendingRecords: [...currentMetadata.pendingRecords, ...records],
    });
    await syncPendingRecords();
  };

  const syncPendingRecords = async () => {
    try {
      setSyncStatus("syncing");
      const db = await getDatabaseInstance();
      const metadata = await getInitialSyncMetadata();
      const pendingRecords = metadata.pendingRecords;

      if (pendingRecords.length === 0) return;

      for (const record of pendingRecords) {
        const { tableName, id } = record;

        // Get the primary key(s) for this table
        const primaryKeys = tablesInfo.get(tableName)?.split(",") || ["id"];

        let whereClause: string;
        let whereValues: any[];
        let remoteFilter: any;

        if (typeof id === "string") {
          // Single primary key
          whereClause = "id = ?";
          whereValues = [id];
          remoteFilter = { id };
        } else {
          // Composite primary key
          const conditions = primaryKeys.map((pk) => `${pk} = ?`);
          whereClause = conditions.join(" AND ");
          whereValues = primaryKeys.map((pk) => id[pk]);
          remoteFilter = id;
        }

        const localRows = await db.select(
          `SELECT * FROM ${String(tableName)} WHERE ${whereClause}`,
          whereValues
        );

        if (!localRows || localRows.length === 0) {
          console.warn(
            `No local record found for ${String(tableName)} with keys:`,
            id
          );
          continue;
        }
        const recordData = localRows[0];

        try {
          // Build remote query for composite keys
          let remoteQuery = supabase.from(String(tableName)).select("*");

          if (typeof id === "string") {
            remoteQuery = remoteQuery.eq("id", id);
          } else {
            // Apply each filter condition for composite keys
            for (const [key, value] of Object.entries(id)) {
              remoteQuery = remoteQuery.eq(key, value);
            }
          }

          const { data: remoteRecords, error: fetchError } = await remoteQuery;

          if (fetchError) {
            console.error(
              `Error fetching remote record from ${String(tableName)}:`,
              fetchError
            );
            throw fetchError;
          }

          // Resolve conflicts
          console.log("passing in", [recordData], remoteRecords || []);
          const { localWins, remoteWins } = resolveConflicts(
            [recordData],
            remoteRecords || [],
            tableName
          );
          console.log("Local wins:", localWins);

          // Push local winner to remote
          if (localWins.length > 0) {
            console.log("Upserting to remote:", localWins[0]);

            // Determine the conflict resolution strategy for upsert
            let conflictColumns: string;
            if (typeof id === "string") {
              conflictColumns = "id";
            } else {
              conflictColumns = primaryKeys.join(",");
            }

            const { error } = await supabase
              .from(String(tableName))
              .upsert(localWins[0], { onConflict: conflictColumns });

            if (error) {
              console.error(
                `Error syncing pending record to ${String(tableName)}:`,
                error
              );
              console.log("localWins", localWins);
              throw error;
            }
          }

          // Pull remote winner to local
          if (remoteWins.length > 0) {
            await batchUpsertToLocal(db, String(tableName), remoteWins);
          }
        } catch (error) {
          console.error(`Failed to sync pending record:`, error);
          throw error;
        }
      }

      // Clear pending records after successful sync
      await updateSyncMetadata({ pendingRecords: [] });
    } catch (error) {
      setSyncStatus("error");
      console.error("Error syncing pending records:", error);
    } finally {
      setSyncStatus("complete");
    }
  };

  return {
    fullScaleSync,
    pushRecord,
    syncPendingRecords,
    resetSyncMetadata,
    syncStatus,
  };
};

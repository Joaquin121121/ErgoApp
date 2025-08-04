import {
  TableName,
  tablesInfo,
  buildAccessWhereClause,
  getTableAccessControl,
} from "../constants/dbMetadata";
import { supabase } from "../utils/supabase";
import { useState } from "react";
import { SyncMetadata, PendingRecord } from "../types/Sync";
import { useSyncContext } from "../contexts/SyncContext";
import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeDatabase } from "../database/init";

export const useDatabaseSync = () => {
  const SYNC_METADATA_KEY = "syncMetadata";
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "complete" | "error"
  >("idle");
  const { setSyncing } = useSyncContext();

  const getInitialSyncMetadata = async (): Promise<SyncMetadata> => {
    try {
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
    } catch (error) {
      console.error("Error getting initial sync metadata:", error);
      const initialMetadata: SyncMetadata = {
        lastSync: "1970-01-01T00:00:00.000Z",
        pendingRecords: [],
      };
      return initialMetadata;
    }
  };

  const updateSyncMetadata = async (metadata: Partial<SyncMetadata>) => {
    try {
      const currentMetadata = await getInitialSyncMetadata();
      const updatedMetadata = {
        ...currentMetadata,
        ...metadata,
      };
      await AsyncStorage.setItem(
        SYNC_METADATA_KEY,
        JSON.stringify(updatedMetadata)
      );
    } catch (error) {
      console.error("Error updating sync metadata:", error);
    }
  };

  const resetSyncMetadata = async () => {
    try {
      await AsyncStorage.removeItem(SYNC_METADATA_KEY);
    } catch (error) {
      console.error("Error resetting sync metadata:", error);
    }
  };

  const ensureDependenciesExist = async (
    db: any,
    tableName: string,
    records: any[],
    allowedAthleteIds: string[]
  ): Promise<void> => {
    // For base_result, ensure athletes exist by checking if they need to be synced
    if (tableName === "base_result" && records.length > 0) {
      const athleteIds = Array.from(new Set(records.map((r) => r.athlete_id)));

      for (const athleteId of athleteIds) {
        // First check if this athlete is even in scope for this user
        if (!allowedAthleteIds.includes(athleteId)) {
          continue;
        }

        const exists = await db.select(
          "SELECT id, deleted_at FROM athlete WHERE id = ?",
          [athleteId]
        );
      }
    }
  };

  const isAthleteAllowed = (
    athleteId: string,
    allowedAthleteIds: string[]
  ): boolean => {
    return (
      allowedAthleteIds.length === 0 || allowedAthleteIds.includes(athleteId)
    );
  };

  const validateForeignKeyDependencies = async (
    db: any,
    tableName: string,
    records: any[],
    allowedAthleteIds: string[] = []
  ): Promise<any[]> => {
    if (records.length === 0) return records;

    // Check dependencies exist first
    await ensureDependenciesExist(db, tableName, records, allowedAthleteIds);

    switch (tableName) {
      case "base_result": {
        // Check that all athlete_id values exist in the athlete table AND are in allowed scope
        const validRecords = [];

        for (const record of records) {
          // First check access control - only process records for allowed athletes
          if (
            allowedAthleteIds.length > 0 &&
            !allowedAthleteIds.includes(record.athlete_id)
          ) {
            continue;
          }

          const athleteExists = await db.select(
            "SELECT id, deleted_at FROM athlete WHERE id = ?",
            [record.athlete_id]
          );

          if (
            athleteExists &&
            athleteExists.length > 0 &&
            !athleteExists[0].deleted_at
          ) {
            validRecords.push(record);
          }
        }

        return validRecords;
      }

      case "basic_result": {
        const validRecords = [];
        for (const record of records) {
          // First check access control - only process records for allowed athletes
          if (!isAthleteAllowed(record.athlete_id, allowedAthleteIds)) {
            continue;
          }

          const [athleteExists, baseResultExists] = await Promise.all([
            db.select(
              "SELECT id FROM athlete WHERE id = ? AND deleted_at IS NULL",
              [record.athlete_id]
            ),
            db.select(
              "SELECT id FROM base_result WHERE id = ? AND deleted_at IS NULL",
              [record.base_result_id]
            ),
          ]);

          if (athleteExists?.length > 0 && baseResultExists?.length > 0) {
            validRecords.push(record);
          }
        }
        return validRecords;
      }

      case "drop_jump_result": {
        const validRecords = [];
        for (const record of records) {
          // First check access control - only process records for allowed athletes
          if (!isAthleteAllowed(record.athlete_id, allowedAthleteIds)) {
            continue;
          }

          const [athleteExists, baseResultExists] = await Promise.all([
            db.select(
              "SELECT id FROM athlete WHERE id = ? AND deleted_at IS NULL",
              [record.athlete_id]
            ),
            db.select(
              "SELECT id FROM base_result WHERE id = ? AND deleted_at IS NULL",
              [record.base_result_id]
            ),
          ]);

          if (athleteExists?.length > 0 && baseResultExists?.length > 0) {
            validRecords.push(record);
          }
        }
        return validRecords;
      }

      case "jump_time": {
        const validRecords = [];
        for (const record of records) {
          // First check access control - only process records for allowed athletes
          if (!isAthleteAllowed(record.athlete_id, allowedAthleteIds)) {
            console.log(
              `⚠️ Skipping jump_time ${record.id} - athlete ${record.athlete_id} not in allowed scope for this user`
            );
            continue;
          }

          const [athleteExists, baseResultExists] = await Promise.all([
            db.select(
              "SELECT id FROM athlete WHERE id = ? AND deleted_at IS NULL",
              [record.athlete_id]
            ),
            db.select(
              "SELECT id FROM base_result WHERE id = ? AND deleted_at IS NULL",
              [record.base_result_id]
            ),
          ]);

          if (athleteExists?.length > 0 && baseResultExists?.length > 0) {
            validRecords.push(record);
          } else {
            console.warn(
              `Skipping jump_time record ${record.id} - dependencies not found locally`
            );
          }
        }
        return validRecords;
      }

      case "multiple_jumps_result": {
        const validRecords = [];
        for (const record of records) {
          // First check access control - only process records for allowed athletes
          if (!isAthleteAllowed(record.athlete_id, allowedAthleteIds)) {
            console.log(
              `⚠️ Skipping multiple_jumps_result ${record.id} - athlete ${record.athlete_id} not in allowed scope for this user`
            );
            continue;
          }

          const [athleteExists, baseResultExists] = await Promise.all([
            db.select(
              "SELECT id FROM athlete WHERE id = ? AND deleted_at IS NULL",
              [record.athlete_id]
            ),
            db.select(
              "SELECT id FROM base_result WHERE id = ? AND deleted_at IS NULL",
              [record.base_result_id]
            ),
          ]);

          if (athleteExists?.length > 0 && baseResultExists?.length > 0) {
            validRecords.push(record);
          } else {
            console.warn(
              `Skipping multiple_jumps_result record ${record.id} - dependencies not found locally`
            );
          }
        }
        return validRecords;
      }

      case "bosco_result": {
        const validRecords = [];
        for (const record of records) {
          if (!record.athlete_id) {
            // If no athlete_id, skip validation (might be valid in some cases)
            validRecords.push(record);
            continue;
          }

          // First check access control - only process records for allowed athletes
          if (!isAthleteAllowed(record.athlete_id, allowedAthleteIds)) {
            console.log(
              `⚠️ Skipping bosco_result ${record.id} - athlete ${record.athlete_id} not in allowed scope for this user`
            );
            continue;
          }

          const athleteExists = await db.select(
            "SELECT id FROM athlete WHERE id = ? AND deleted_at IS NULL",
            [record.athlete_id]
          );

          if (athleteExists?.length > 0) {
            validRecords.push(record);
          } else {
            console.warn(
              `Skipping bosco_result record ${record.id} - athlete ${record.athlete_id} not found locally`
            );
          }
        }
        return validRecords;
      }

      case "athlete": {
        // For athlete role, allow syncing their own record even if coach doesn't exist locally
        // For coach role, validate that coach exists
        const validRecords = [];
        for (const record of records) {
          // If this is an athlete syncing their own record, skip coach validation
          if (
            allowedAthleteIds.length > 0 &&
            allowedAthleteIds.includes(record.id)
          ) {
            validRecords.push(record);
            continue;
          }

          // For coach role or other cases, validate coach exists
          const coachExists = await db.select(
            "SELECT id FROM coach WHERE id = ? AND deleted_at IS NULL",
            [record.coach_id]
          );

          if (coachExists?.length > 0) {
            validRecords.push(record);
          }
        }
        return validRecords;
      }

      case "training_plans": {
        const validRecords = [];
        for (const record of records) {
          const checks = [];

          if (record.coach_id) {
            checks.push(
              db.select(
                "SELECT id FROM coach WHERE id = ? AND deleted_at IS NULL",
                [record.coach_id]
              )
            );
          }

          if (record.athlete_id) {
            checks.push(
              db.select(
                "SELECT id FROM athlete WHERE id = ? AND deleted_at IS NULL",
                [record.athlete_id]
              )
            );
          }

          if (checks.length === 0) {
            validRecords.push(record);
            continue;
          }

          const results = await Promise.all(checks);

          // For athlete role, we should be more lenient about coach dependencies
          // Since athletes sync their own data, they may not have coach records locally
          const isAthleteRole =
            allowedAthleteIds.length > 0 &&
            allowedAthleteIds.includes(record.athlete_id);

          if (isAthleteRole) {
            // For athlete role, only require that the athlete exists locally
            const athleteIndex = record.coach_id ? 1 : 0;
            const athleteExists = record.athlete_id
              ? results[athleteIndex]?.length > 0
              : true;

            if (athleteExists || !record.athlete_id) {
              validRecords.push(record);
            } else {
              console.warn(
                `Skipping training_plans record ${record.id} - athlete dependency not found locally`
              );
            }
          } else {
            // For coach role, require all dependencies
            const allExist = results.every((result) => result?.length > 0);

            if (allExist) {
              validRecords.push(record);
            } else {
              console.warn(
                `Skipping training_plans record ${record.id} - dependencies not found locally`
              );
            }
          }
        }
        return validRecords;
      }

      case "sessions": {
        const validRecords = [];
        for (const record of records) {
          // First check if this record is in scope for this user (access control)
          // Get the coachId from the allowedAthleteIds context (we need to pass it properly)
          // For now, we'll be more lenient and check if the training plan exists
          const trainingPlanCheck = await db.select(
            "SELECT id FROM training_plans WHERE id = ? AND deleted_at IS NULL",
            [record.plan_id]
          );

          // Check if training plan exists (required dependency)
          const trainingPlanExists = trainingPlanCheck?.length > 0;

          // Check access control - record is valid if:
          // 1. Training plan exists AND
          // 2. Either athlete_id is in allowedAthleteIds OR we have coach access to this record
          const hasAthleteAccess =
            record.athlete_id && allowedAthleteIds.includes(record.athlete_id);
          const hasCoachAccess = record.coach_id; // If coach_id exists, assume coach has access

          const hasAccess = hasAthleteAccess || hasCoachAccess;

          if (trainingPlanExists && hasAccess) {
            validRecords.push(record);
          } else {
            console.warn(
              `Skipping sessions record ${record.id} - dependencies not found locally or access denied`
            );
          }
        }
        return validRecords;
      }

      case "events_athletes": {
        // Check that both event and athlete exist and are in allowed scope
        const validRecords = [];
        console.log(
          `Validating ${records.length} events_athletes records for foreign key dependencies...`
        );

        for (const record of records) {
          console.log(
            `Checking events_athletes with event_id ${record.event_id} and athlete_id ${record.athlete_id}`
          );

          // First check access control - only process records for allowed athletes
          if (
            allowedAthleteIds.length > 0 &&
            !allowedAthleteIds.includes(record.athlete_id)
          ) {
            console.log(
              `⚠️ Skipping events_athletes - athlete ${record.athlete_id} not in allowed scope for this user`
            );
            continue;
          }

          const [eventExists, athleteExists] = await Promise.all([
            db.select(
              "SELECT id FROM event WHERE id = ? AND deleted_at IS NULL",
              [record.event_id]
            ),
            db.select(
              "SELECT id FROM athlete WHERE id = ? AND deleted_at IS NULL",
              [record.athlete_id]
            ),
          ]);

          if (eventExists?.length > 0 && athleteExists?.length > 0) {
            validRecords.push(record);
            console.log(
              `✓ events_athletes - both event ${record.event_id} and athlete ${record.athlete_id} found`
            );
          } else {
            console.warn(
              `✗ Skipping events_athletes - dependencies not found locally (event: ${
                eventExists?.length > 0
              }, athlete: ${athleteExists?.length > 0})`
            );
          }
        }

        console.log(
          `events_athletes validation complete: ${validRecords.length}/${records.length} records valid`
        );
        return validRecords;
      }

      // Add more cases as needed for other tables with foreign key dependencies
      default:
        return records;
    }
  };

  // BOOLEAN CONVERSION: Convert boolean values from Supabase (true/false) to SQLite (1/0)
  // Called when pulling data FROM Supabase TO SQLite during sync operations
  const convertBooleansForSQLite = (
    tableName: string,
    records: any[]
  ): any[] => {
    const booleanFieldsByTable: Record<string, string[]> = {
      jump_time: ["deleted"],
      progressions: ["completed"],
      exercise_performance: ["completed", "performed"],
    };

    const booleanFields = booleanFieldsByTable[tableName];
    if (!booleanFields) return records;

    return records.map((record) => {
      const convertedRecord = { ...record };
      for (const field of booleanFields) {
        if (
          field in convertedRecord &&
          typeof convertedRecord[field] === "boolean"
        ) {
          convertedRecord[field] = convertedRecord[field] ? 1 : 0;
        }
      }
      return convertedRecord;
    });
  };

  // BOOLEAN CONVERSION: Convert boolean values from SQLite (1/0) to Supabase (true/false)
  // Called when pushing data FROM SQLite TO Supabase during sync operations
  const convertBooleansForSupabase = (
    tableName: string,
    records: any[]
  ): any[] => {
    const booleanFieldsByTable: Record<string, string[]> = {
      jump_time: ["deleted"],
      progressions: ["completed"],
      exercise_performance: ["completed", "performed"],
    };

    const booleanFields = booleanFieldsByTable[tableName];
    if (!booleanFields) return records;

    return records.map((record) => {
      const convertedRecord = { ...record };
      for (const field of booleanFields) {
        if (
          field in convertedRecord &&
          typeof convertedRecord[field] === "number"
        ) {
          convertedRecord[field] = convertedRecord[field] === 1 ? true : false;
        }
      }
      return convertedRecord;
    });
  };

  const batchUpsertToLocal = async (
    db: any,
    tableName: string,
    records: any[],
    allowedAthleteIds: string[] = []
  ) => {
    if (records.length === 0) return;

    // Validate foreign key dependencies first
    const validRecords = await validateForeignKeyDependencies(
      db,
      tableName,
      records,
      allowedAthleteIds
    );

    if (validRecords.length === 0) return;

    // Convert boolean values for SQLite storage
    const convertedRecords = convertBooleansForSQLite(tableName, validRecords);

    const BATCH_SIZE = 100;

    for (let i = 0; i < convertedRecords.length; i += BATCH_SIZE) {
      const batch = convertedRecords.slice(i, i + BATCH_SIZE);

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

  // Fetch remote records with access control
  const fetchRemoteRecordsWithAccessControl = async (
    tableName: TableName,
    lastSync: string,
    coachId: string,
    athleteIds: string[]
  ) => {
    try {
      // Special handling for athlete role (when coachId is empty)
      if (!coachId && athleteIds.length > 0) {
        return await fetchRemoteRecordsForAthlete(
          tableName,
          lastSync,
          athleteIds
        );
      }

      const accessControl = getTableAccessControl(tableName);

      // Handle special cases with RPC functions
      if (accessControl.type === "special") {
        return await handleSpecialRemoteQuery(
          tableName,
          lastSync,
          coachId,
          athleteIds
        );
      }

      // Build the base query
      let query = supabase
        .from(String(tableName))
        .select("*")
        .gt("last_changed", lastSync)
        .is("deleted_at", null);

      // Apply access control filters based on type
      switch (accessControl.type) {
        case "coach_only":
          // Only use coachId if it's not empty (to avoid UUID errors)
          if (!coachId) {
            return { data: [], error: null }; // No access for coach-only tables without coachId
          }
          query = query.eq("coach_id", coachId);
          break;

        case "athlete_only":
          if (athleteIds.length === 0) {
            return { data: [], error: null }; // No access
          }
          query = query.in("athlete_id", athleteIds);
          break;

        case "coach_and_athlete":
          if (athleteIds.length === 0) {
            // Only use coachId if it's not empty (to avoid UUID errors)
            if (!coachId) {
              return { data: [], error: null }; // No access if no coachId and no athleteIds
            }
            query = query.eq("coach_id", coachId);
          } else {
            // Use Supabase's .or() method for efficient OR queries
            if (coachId) {
              // Include both coach and athlete conditions if coachId is available
              const orConditions = [
                `coach_id.eq.${coachId}`,
                `athlete_id.in.(${athleteIds.join(",")})`,
              ];
              query = query.or(orConditions.join(","));
            } else {
              // Only use athlete_id if coachId is empty (athlete role)
              query = query.in("athlete_id", athleteIds);
            }
          }
          break;

        default:
          throw new Error(
            `Unknown access control type for table: ${tableName}`
          );
      }

      return await query;
    } catch (error) {
      console.error(`Error fetching remote records for ${tableName}:`, error);
      return { data: [], error };
    }
  };

  // Fetch remote records specifically for athlete role
  const fetchRemoteRecordsForAthlete = async (
    tableName: TableName,
    lastSync: string,
    athleteIds: string[]
  ) => {
    try {
      const accessControl = getTableAccessControl(tableName);

      // Handle special cases
      if (accessControl.type === "special") {
        return await handleSpecialRemoteQueryForAthlete(
          tableName,
          lastSync,
          athleteIds
        );
      }

      // Build the base query
      let query = supabase
        .from(String(tableName))
        .select("*")
        .gt("last_changed", lastSync)
        .is("deleted_at", null);

      // Apply athlete-specific access control
      switch (accessControl.type) {
        case "coach_only":
          // Athletes don't access coach-only tables
          return { data: [], error: null };

        case "athlete_only":
          query = query.in("athlete_id", athleteIds);
          break;

        case "coach_and_athlete":
          // For athlete role, only filter by athlete_id
          query = query.in("athlete_id", athleteIds);
          break;

        default:
          throw new Error(
            `Unknown access control type for table: ${tableName}`
          );
      }

      return await query;
    } catch (error) {
      console.error(`Error fetching remote records for ${tableName}:`, error);
      return { data: [], error };
    }
  };

  // Handle special remote queries for athlete role
  const handleSpecialRemoteQueryForAthlete = async (
    tableName: TableName,
    lastSync: string,
    athleteIds: string[]
  ) => {
    switch (tableName) {
      case "athlete":
        // Athlete accesses their own record
        const athleteResult = await supabase
          .from("athlete")
          .select("*")
          .gt("last_changed", lastSync)
          .is("deleted_at", null)
          .in("id", athleteIds);

        return athleteResult;

      case "coach":
        // Athletes don't access coach records directly
        return { data: [], error: null };

      case "exercises":
        // All exercises are global - same as coach access
        return await supabase
          .from("exercises")
          .select("*")
          .gt("last_changed", lastSync)
          .is("deleted_at", null);

      case "events_athletes":
        // Athlete accesses events_athletes records where they are the athlete
        return await supabase
          .from("events_athletes")
          .select("*")
          .gt("last_changed", lastSync)
          .is("deleted_at", null)
          .in("athlete_id", athleteIds);

      case "athlete_session_performance":
        // Athlete accesses their own performance data
        return await supabase
          .from("athlete_session_performance")
          .select("*")
          .gt("last_changed", lastSync)
          .is("deleted_at", null)
          .in("athlete_id", athleteIds);

      default:
        throw new Error(`Unhandled special case for athlete: ${tableName}`);
    }
  };

  // Handle special cases with RPC functions
  const handleSpecialRemoteQuery = async (
    tableName: TableName,
    lastSync: string,
    coachId: string,
    athleteIds: string[]
  ) => {
    switch (tableName) {
      case "events_athletes":
        // Only call RPC if coachId is available, otherwise return empty
        if (!coachId) {
          return { data: [], error: null };
        }
        return await supabase.rpc("get_accessible_events_athletes", {
          p_coach_id: coachId,
          p_athlete_ids: athleteIds,
          p_last_sync: lastSync,
        });

      case "exercises":
        // All exercises are global - simple query
        return await supabase
          .from("exercises")
          .select("*")
          .gt("last_changed", lastSync)
          .is("deleted_at", null);

      case "coach":
        // Coach accesses their own record - only if coachId is available
        if (!coachId) {
          return { data: [], error: null };
        }
        return await supabase
          .from("coach")
          .select("*")
          .gt("last_changed", lastSync)
          .is("deleted_at", null)
          .eq("id", coachId);

      case "athlete":
        // Coach accesses their athletes - only if coachId is available
        if (!coachId) {
          return { data: [], error: null };
        }
        return await supabase
          .from("athlete")
          .select("*")
          .gt("last_changed", lastSync)
          .is("deleted_at", null)
          .eq("coach_id", coachId);

      case "athlete_session_performance":
        // Only athlete_id field, no coach_id
        if (athleteIds.length === 0) {
          return { data: [], error: null };
        }
        return await supabase
          .from("athlete_session_performance")
          .select("*")
          .gt("last_changed", lastSync)
          .is("deleted_at", null)
          .in("athlete_id", athleteIds);

      default:
        throw new Error(`Unhandled special case: ${tableName}`);
    }
  };

  // Fetch local records with access control
  const fetchLocalRecordsWithAccessControl = async (
    db: any,
    tableName: TableName,
    lastSync: string,
    coachId: string,
    athleteIds: string[]
  ) => {
    try {
      // Special handling for athlete role (when coachId is empty)
      if (!coachId && athleteIds.length > 0) {
        return await fetchLocalRecordsForAthlete(
          db,
          tableName,
          lastSync,
          athleteIds
        );
      }

      const { whereClause, params } = buildAccessWhereClause(
        tableName,
        coachId,
        athleteIds
      );

      const query = `
        SELECT * FROM ${String(tableName)} 
        WHERE last_changed > ? 
        AND deleted_at IS NULL 
        AND (${whereClause})
      `;

      return await db.select(query, [lastSync, ...params]);
    } catch (error) {
      console.error(`Error fetching local records for ${tableName}:`, error);
      return [];
    }
  };

  // Fetch local records specifically for athlete role
  const fetchLocalRecordsForAthlete = async (
    db: any,
    tableName: TableName,
    lastSync: string,
    athleteIds: string[]
  ) => {
    const accessControl = getTableAccessControl(tableName);
    let whereClause: string;
    let params: any[];

    switch (tableName) {
      case "athlete":
        whereClause = `id IN (${athleteIds.map(() => "?").join(",")})`;
        params = athleteIds;
        break;

      case "coach":
        return [];

      case "exercises":
        whereClause = "1 = 1";
        params = [];
        break;

      default:
        // For most tables, use athlete_id based access
        if (accessControl.type === "athlete_only") {
          whereClause = `athlete_id IN (${athleteIds
            .map(() => "?")
            .join(",")})`;
          params = athleteIds;
        } else if (accessControl.type === "coach_and_athlete") {
          // For coach_and_athlete tables, only check athlete_id when role is athlete
          whereClause = `athlete_id IN (${athleteIds
            .map(() => "?")
            .join(",")})`;
          params = athleteIds;
        } else if (accessControl.type === "coach_only") {
          // Athletes don't access coach-only tables
          return [];
        } else if (accessControl.type === "special") {
          // Handle other special cases that might not have athlete_id
          const specialRule = getTableAccessControl(tableName).rule;
          if (specialRule && specialRule.type === "global") {
            // Global access - no filtering
            whereClause = "1 = 1";
            params = [];
          } else {
            // Default to athlete_id filtering for special cases
            whereClause = `athlete_id IN (${athleteIds
              .map(() => "?")
              .join(",")})`;
            params = athleteIds;
          }
        } else {
          // Unknown access control - return empty to be safe
          console.warn(
            `Unknown access control for table ${tableName} in athlete mode`
          );
          return [];
        }
    }

    const query = `
      SELECT * FROM ${String(tableName)} 
      WHERE last_changed > ? 
      AND deleted_at IS NULL 
      AND (${whereClause})
    `;

    return await db.select(query, [lastSync, ...params]);
  };

  const fullScaleSync = async (email: string, role: "coach" | "athlete") => {
    try {
      let athleteIds: string[] = [];
      let coachId = "";

      if (role === "coach") {
        const { data: coach } = await supabase
          .from("coach")
          .select("*")
          .eq("email", email);
        if (!coach || coach.length === 0) {
          console.warn("Coach not found for email:", email);
          return;
        }
        coachId = coach[0].id;
        const { data: athleteData } = await supabase
          .from("athlete")
          .select("*")
          .eq("coach_id", coachId);
        athleteIds = athleteData?.map((athlete) => athlete.id) || [];
      } else if (role === "athlete") {
        const { data: athlete } = await supabase
          .from("athlete")
          .select("*")
          .eq("email", email);
        if (!athlete || athlete.length === 0) {
          console.warn("Athlete not found for email:", email);
          return;
        }
        athleteIds = [athlete[0].id];
        // For athletes, we don't use coachId for access control - they access their own data directly
        coachId = ""; // Clear coachId to prevent coach-based filtering for athlete role
      } else {
        console.error("Invalid role:", role);
        return;
      }

      setSyncStatus("syncing");
      setSyncing(true);

      try {
        await initializeDatabase();
      } catch (error) {
        console.error("❌ Database initialization failed:", error);
        setSyncStatus("error");
        setSyncing(false);
        return;
      }

      const db = await getDatabaseInstance();
      const metadata = await getInitialSyncMetadata();
      const lastSync = metadata.lastSync || "1970-01-01T00:00:00.000Z";
      const tableNames = Array.from(tablesInfo.keys());

      // 1. Fetch all table data with access control in parallel
      const tableDataPromises = tableNames.map(async (tableName) => {
        const [localRecords, remoteResponse] = await Promise.all([
          fetchLocalRecordsWithAccessControl(
            db,
            tableName as TableName,
            lastSync,
            coachId,
            athleteIds
          ),
          fetchRemoteRecordsWithAccessControl(
            tableName as TableName,
            lastSync,
            coachId,
            athleteIds
          ),
        ]);

        if (remoteResponse.error) {
          console.error(
            `Error fetching remote records for ${String(tableName)}:`,
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

          // Convert boolean values for Supabase
          const convertedLocalWins = convertBooleansForSupabase(
            tableName,
            localWins
          );

          console.log(
            `📤 Preparing to upsert ${convertedLocalWins.length} records to Supabase table: ${tableName}`
          );
          if (convertedLocalWins.length > 0) {
            // Log first record to see the structure
            console.log(
              `📤 Sample record being sent to Supabase:`,
              JSON.stringify(convertedLocalWins[0], null, 2)
            );
          }

          const BATCH_SIZE = 100;
          const batchPromises = [];

          for (let i = 0; i < convertedLocalWins.length; i += BATCH_SIZE) {
            const batch = convertedLocalWins.slice(i, i + BATCH_SIZE);
            // Determine the conflict resolution strategy for upsert
            const primaryKeys = tablesInfo
              .get(tableName as TableName)
              ?.split(",") || ["id"];
            const conflictColumns = primaryKeys.join(",");

            console.log(
              `📤 Upserting batch ${
                Math.floor(i / BATCH_SIZE) + 1
              } to ${tableName} (${
                batch.length
              } records, conflict: ${conflictColumns})`
            );

            batchPromises.push(
              supabase
                .from(String(tableName))
                .upsert(batch, { onConflict: conflictColumns })
                .then(({ error, data, status, statusText }) => {
                  if (error) {
                    console.error(
                      `❌ Error pushing batch to remote ${String(tableName)}:`,
                      error
                    );
                    console.error(`❌ Error details:`, {
                      message: error.message,
                      details: error.details,
                      hint: error.hint,
                      code: error.code,
                    });
                  } else {
                    console.log(
                      `✅ Successfully upserted batch to ${tableName} (status: ${status})`
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
        if (remoteWins.length > 0) {
          await batchUpsertToLocal(db, tableName, remoteWins, athleteIds);
        }
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

        if (typeof id === "string") {
          // Single primary key
          whereClause = "id = ?";
          whereValues = [id];
        } else {
          // Composite primary key
          const conditions = primaryKeys.map((pk) => `${pk} = ?`);
          whereClause = conditions.join(" AND ");
          whereValues = primaryKeys.map((pk) => id[pk]);
        }

        const localRows = await db.select(
          `SELECT * FROM ${String(tableName)} WHERE ${whereClause}`,
          whereValues
        );

        if (!localRows || localRows.length === 0) {
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
          const { localWins, remoteWins } = resolveConflicts(
            [recordData],
            remoteRecords || [],
            tableName
          );

          // Push local winner to remote
          if (localWins.length > 0) {
            // Convert boolean values for Supabase
            const convertedWinner = convertBooleansForSupabase(tableName, [
              localWins[0],
            ])[0];

            // Determine the conflict resolution strategy for upsert
            let conflictColumns: string;
            if (typeof id === "string") {
              conflictColumns = "id";
            } else {
              conflictColumns = primaryKeys.join(",");
            }

            console.log(
              `📤 Upserting pending record to ${tableName}:`,
              JSON.stringify(convertedWinner, null, 2)
            );

            const { error, data, status } = await supabase
              .from(String(tableName))
              .upsert(convertedWinner, { onConflict: conflictColumns });

            if (error) {
              console.error(
                `❌ Error syncing pending record to ${String(tableName)}:`,
                error
              );
              console.error(`❌ Pending record error details:`, {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
              });
              throw error;
            } else {
              console.log(
                `✅ Successfully upserted pending record to ${tableName} (status: ${status})`
              );
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

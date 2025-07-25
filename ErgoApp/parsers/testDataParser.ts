import type {
  StudyType,
  CompletedStudy,
  JumpTime,
  BoscoResult,
  MultipleJumpsResult,
  MultipleDropJumpResult,
  CMJResult,
  SquatJumpResult,
  AbalakovResult,
  CustomStudyResult,
} from "../types/Studies";
import { v4 as uuidv4 } from "uuid";
import { PendingRecord } from "../types/Sync";
import { TableName } from "../constants/dbMetadata";
import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";
import { DatabaseInstance } from "../adapters/DatabaseAdapter";

export const deleteTest = async (
  testId: string,
  studyType: StudyType,
  pushRecord: (records: PendingRecord[]) => Promise<void>,
  db?: DatabaseInstance
) => {
  const dbToUse = db || (await getDatabaseInstance());
  const now = new Date().toISOString();

  try {
    if (studyType === "bosco") {
      await dbToUse.execute(
        `UPDATE bosco_result 
        SET deleted_at = ?
        WHERE id = ?`,
        [now, testId]
      );
      pushRecord([{ tableName: "bosco_result" as TableName, id: testId }]);
    } else if (studyType === "multipleDropJump") {
      await dbToUse.execute(
        `UPDATE multiple_drop_jump_result 
        SET deleted_at = ?
        WHERE id = ?`,
        [now, testId]
      );
      pushRecord([
        { tableName: "multiple_drop_jump_result" as TableName, id: testId },
      ]);
    } else {
      await dbToUse.execute(
        `UPDATE base_result 
        SET deleted_at = ?
        WHERE id = ?`,
        [now, testId]
      );
      pushRecord([{ tableName: "base_result" as TableName, id: testId }]);
    }
    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
};

const createBaseResult = async (
  db: DatabaseInstance,
  athleteId: string,
  takeoffFoot: string,
  sensitivity: number
): Promise<PendingRecord> => {
  const baseResultId = uuidv4();
  const currentTimestamp = new Date().toISOString();

  await db.execute(
    `INSERT INTO base_result (id, created_at, last_changed, athlete_id, takeoff_foot, sensitivity)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      baseResultId,
      currentTimestamp,
      currentTimestamp,
      athleteId,
      takeoffFoot,
      sensitivity,
    ]
  );

  return {
    tableName: "base_result",
    id: baseResultId,
  };
};

const createJumpTimes = async (
  db: DatabaseInstance,
  baseResultId: string,
  times: JumpTime[]
): Promise<PendingRecord[]> => {
  const jumpTimeRecords: PendingRecord[] = [];
  const currentTimestamp = new Date().toISOString();

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const jumpTimeId = uuidv4();

    await db.execute(
      `INSERT INTO jump_time (id, created_at, last_changed, base_result_id, time, deleted, floor_time, stiffness, performance, "index")
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jumpTimeId,
        currentTimestamp,
        currentTimestamp,
        baseResultId,
        time.time,
        time.deleted,
        time.floorTime || null,
        time.stiffness || null,
        time.performance || null,
        i,
      ]
    );

    jumpTimeRecords.push({
      tableName: "jump_time",
      id: jumpTimeId,
    });
  }

  return jumpTimeRecords;
};

export const addBasicResult = async (
  study: CompletedStudy,
  athleteId: string,
  pushRecord: (records: PendingRecord[]) => Promise<void>,
  externalDb?: DatabaseInstance
): Promise<string | PendingRecord[]> => {
  console.log("addingBasicResultProps", study, athleteId, externalDb);
  const pendingRecords: PendingRecord[] = [];
  const dbToUse = externalDb || (await getDatabaseInstance());
  const isManagingTransaction = !externalDb;

  try {
    const result = study.results as
      | CMJResult
      | SquatJumpResult
      | AbalakovResult
      | CustomStudyResult;

    if (isManagingTransaction) {
      await dbToUse.execute("BEGIN TRANSACTION");
    }

    try {
      const baseResultRecord = await createBaseResult(
        dbToUse,
        athleteId,
        result.takeoffFoot,
        result.sensitivity
      );
      pendingRecords.push(baseResultRecord);
      const baseResultId = baseResultRecord.id as string;

      const basicResultId = uuidv4();
      const currentTimestamp = new Date().toISOString();

      await dbToUse.execute(
        `INSERT INTO basic_result (id, created_at, last_changed, type, load, loadunit, base_result_id, bosco_result_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          basicResultId,
          currentTimestamp,
          currentTimestamp,
          result.type,
          result.load,
          result.loadUnit,
          baseResultId,
          null,
        ]
      );
      pendingRecords.push({
        tableName: "basic_result",
        id: basicResultId,
      });

      const jumpTimeRecords = await createJumpTimes(
        dbToUse,
        baseResultId,
        result.times
      );
      pendingRecords.push(...jumpTimeRecords);

      if (isManagingTransaction) {
        await dbToUse.execute("COMMIT");
        pushRecord(pendingRecords);
        return basicResultId;
      }
      return pendingRecords;
    } catch (innerError) {
      if (isManagingTransaction) {
        await dbToUse.execute("ROLLBACK");
      }
      throw innerError;
    }
  } catch (error) {
    console.error("Error adding basic result:", error);
    return [];
  }
};

export const addBoscoResult = async (
  study: CompletedStudy,
  athleteId: string,
  pushRecord: (records: PendingRecord[]) => Promise<void>,
  externalDb?: DatabaseInstance
): Promise<string | PendingRecord[]> => {
  const pendingRecords: PendingRecord[] = [];
  const dbToUse = externalDb || (await getDatabaseInstance());
  const isManagingTransaction = !externalDb;

  try {
    const result = study.results as BoscoResult;

    const currentTimestamp = new Date().toISOString();

    if (isManagingTransaction) {
      await dbToUse.execute("BEGIN TRANSACTION");
    }

    try {
      const boscoResultId = uuidv4();

      await dbToUse.execute(
        `INSERT INTO bosco_result (id, created_at, last_changed, athlete_id)
         VALUES (?, ?, ?, ?)`,
        [boscoResultId, currentTimestamp, currentTimestamp, athleteId]
      );

      pendingRecords.push({
        tableName: "bosco_result",
        id: boscoResultId,
      });

      const tests = [
        { type: "cmj", data: result.cmj },
        { type: "squatJump", data: result.squatJump },
        { type: "abalakov", data: result.abalakov },
      ];

      for (const test of tests) {
        const baseResultRecord = await createBaseResult(
          dbToUse,
          athleteId,
          test.data.takeoffFoot,
          test.data.sensitivity
        );
        const baseResultId = baseResultRecord.id as string;
        pendingRecords.push(baseResultRecord);

        const basicResultId = uuidv4();
        await dbToUse.execute(
          `INSERT INTO basic_result (id, created_at, last_changed, type, load, loadunit, base_result_id, bosco_result_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            basicResultId,
            currentTimestamp,
            currentTimestamp,
            test.type,
            test.data.load,
            test.data.loadUnit,
            baseResultId,
            boscoResultId,
          ]
        );

        pendingRecords.push({
          tableName: "basic_result",
          id: basicResultId,
        });

        const jumpTimeRecords = await createJumpTimes(
          dbToUse,
          baseResultId,
          test.data.times
        );
        pendingRecords.push(...jumpTimeRecords);
      }

      if (isManagingTransaction) {
        await dbToUse.execute("COMMIT");
        pushRecord(pendingRecords);
        return boscoResultId;
      }
      return pendingRecords;
    } catch (innerError) {
      if (isManagingTransaction) {
        await dbToUse.execute("ROLLBACK");
      }
      throw innerError;
    }
  } catch (error) {
    console.error("Error adding Bosco result:", error);
    return [];
  }
};

export const addMultipleJumpsResult = async (
  study: CompletedStudy,
  athleteId: string,
  pushRecord: (records: PendingRecord[]) => Promise<void>,
  externalDb?: DatabaseInstance
): Promise<string | PendingRecord[]> => {
  const pendingRecords: PendingRecord[] = [];
  const dbToUse = externalDb || (await getDatabaseInstance());
  const isManagingTransaction = !externalDb;

  try {
    const result = study.results as MultipleJumpsResult;

    if (isManagingTransaction) {
      await dbToUse.execute("BEGIN TRANSACTION");
    }

    try {
      const baseResultRecord = await createBaseResult(
        dbToUse,
        athleteId,
        result.takeoffFoot,
        result.sensitivity
      );
      const baseResultId = baseResultRecord.id as string;
      pendingRecords.push(baseResultRecord);

      const multipleJumpsResultId = uuidv4();
      const currentTimestamp = new Date().toISOString();

      await dbToUse.execute(
        `INSERT INTO multiple_jumps_result (id, created_at, last_changed, criteria, criteria_value, base_result_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          multipleJumpsResultId,
          currentTimestamp,
          currentTimestamp,
          result.criteria,
          result.criteriaValue,
          baseResultId,
        ]
      );

      pendingRecords.push({
        tableName: "multiple_jumps_result",
        id: multipleJumpsResultId,
      });

      const jumpTimeRecords = await createJumpTimes(
        dbToUse,
        baseResultId,
        result.times
      );
      pendingRecords.push(...jumpTimeRecords);

      if (isManagingTransaction) {
        await dbToUse.execute("COMMIT");
        pushRecord(pendingRecords);
        return multipleJumpsResultId;
      }
      return pendingRecords;
    } catch (innerError) {
      if (isManagingTransaction) {
        await dbToUse.execute("ROLLBACK");
      }
      throw innerError;
    }
  } catch (error) {
    console.error("Error adding multiple jumps result:", error);
    return [];
  }
};

export const addMultipleDropJumpResult = async (
  study: CompletedStudy,
  athleteId: string,
  pushRecord: (records: PendingRecord[]) => Promise<void>,
  externalDb?: DatabaseInstance
): Promise<string | PendingRecord[]> => {
  const pendingRecords: PendingRecord[] = [];
  const dbToUse = externalDb || (await getDatabaseInstance());
  const isManagingTransaction = !externalDb;

  try {
    const result = study.results as MultipleDropJumpResult;

    if (isManagingTransaction) {
      await dbToUse.execute("BEGIN TRANSACTION");
    }

    try {
      const multipleDropJumpResultId = uuidv4();
      const currentTimestamp = new Date().toISOString();

      // Based on the database schema, the table has: height_unit, takeoff_foot, best_height, athlete_id
      await dbToUse.execute(
        `INSERT INTO multiple_drop_jump_result (id, created_at, last_changed, height_unit, takeoff_foot, best_height, athlete_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          multipleDropJumpResultId,
          currentTimestamp,
          currentTimestamp,
          result.heightUnit,
          result.takeoffFoot,
          result.bestHeight,
          athleteId,
        ]
      );

      pendingRecords.push({
        tableName: "multiple_drop_jump_result",
        id: multipleDropJumpResultId,
      });

      for (const dropJumpResult of result.dropJumps) {
        const baseResultRecord = await createBaseResult(
          dbToUse,
          athleteId,
          dropJumpResult.takeoffFoot,
          dropJumpResult.sensitivity
        );
        const baseResultId = baseResultRecord.id as string;
        pendingRecords.push(baseResultRecord);

        const dropJumpResultId = uuidv4();
        // Based on the database schema, the table has: height, stiffness, base_result_id, multiple_drop_jump_id
        await dbToUse.execute(
          `INSERT INTO drop_jump_result (id, created_at, last_changed, height, stiffness, base_result_id, multiple_drop_jump_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            dropJumpResultId,
            currentTimestamp,
            currentTimestamp,
            dropJumpResult.height,
            dropJumpResult.stiffness,
            baseResultId,
            multipleDropJumpResultId,
          ]
        );

        pendingRecords.push({
          tableName: "drop_jump_result",
          id: dropJumpResultId,
        });

        const jumpTimeRecords = await createJumpTimes(
          dbToUse,
          baseResultId,
          dropJumpResult.times
        );
        pendingRecords.push(...jumpTimeRecords);
      }

      if (isManagingTransaction) {
        await dbToUse.execute("COMMIT");
        pushRecord(pendingRecords);
        return multipleDropJumpResultId;
      }
      return pendingRecords;
    } catch (innerError) {
      if (isManagingTransaction) {
        await dbToUse.execute("ROLLBACK");
      }
      throw innerError;
    }
  } catch (error) {
    console.error("Error adding multiple drop jump result:", error);
    return [];
  }
};

export const addResult = async (
  study: CompletedStudy,
  athleteId: string,
  pushRecord: (records: PendingRecord[]) => Promise<void>,
  db?: DatabaseInstance
): Promise<string | PendingRecord[]> => {
  const resultType = study.results.type;

  if (resultType === "bosco") {
    return await addBoscoResult(study, athleteId, pushRecord, db);
  } else if (resultType === "multipleJumps") {
    return await addMultipleJumpsResult(study, athleteId, pushRecord, db);
  } else if (resultType === "multipleDropJump") {
    return await addMultipleDropJumpResult(study, athleteId, pushRecord, db);
  } else {
    return await addBasicResult(study, athleteId, pushRecord, db);
  }
};

export const addMultipleResults = async (
  data: {
    studies: CompletedStudy[];
    ids: string[];
  },
  pushRecord: (records: PendingRecord[]) => Promise<void>
): Promise<PendingRecord[]> => {
  console.log(data);
  if (data.studies.length !== data.ids.length) {
    return [];
  }

  const db = await getDatabaseInstance();
  try {
    await db.execute("BEGIN TRANSACTION");
    console.log("beginning transaction");

    const operationResults: PendingRecord[] = [];
    for (let i = 0; i < data.studies.length; i++) {
      const study = data.studies[i];
      const athleteId = data.ids[i];
      const result = await addResult(study, athleteId, pushRecord, db);
      if (!Array.isArray(result)) {
        continue;
      }
      operationResults.push(...result);
    }
    console.log("committing");
    await db.execute("COMMIT");
    console.log("committed");
    pushRecord(operationResults);
    return operationResults;
  } catch (error) {
    console.error(
      "Critical error during multiple results addition, attempting rollback:",
      error
    );
    try {
      await db.execute("ROLLBACK");
      console.log("Rollback successful after critical error.");
    } catch (rollbackError) {
      console.error("Failed to rollback after critical error:", rollbackError);
    }
    return [];
  }
};

import { Athlete, transformToAthlete } from "../types/Athletes";
import { DbBaseResult, DbJumpTime } from "../dbtypes/Tests";
import {
  CMJResult,
  SquatJumpResult,
  AbalakovResult,
  CustomStudyResult,
  BaseResult,
  JumpTime,
  CompletedStudy,
  studyInfoLookup,
  MultipleJumpsResult,
  DropJumpResult,
  MultipleDropJumpResult,
  BoscoResult,
} from "../types/Studies";
import { v4 as uuidv4 } from "uuid";
import { PendingRecord } from "../types/Sync";
import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";
import { DatabaseInstance } from "../adapters/DatabaseAdapter";

const calculateAverages = (jumpTimes: JumpTime[]) => {
  const validTimes = jumpTimes.filter((t) => !t.deleted);
  let avgFloorTime = 0;
  let avgStiffness = 0;
  let avgPerformance = 0;
  let performanceDrop = 0;
  const avgFlightTime =
    validTimes.length > 0
      ? validTimes.reduce((sum, t) => sum + t.time, 0) / validTimes.length
      : 0;
  const avgHeightReached =
    avgFlightTime > 0 ? (9.81 * avgFlightTime ** 2 * 100) / 8 : 0;
  if (validTimes.some((t) => t.floorTime)) {
    avgFloorTime =
      validTimes.reduce((sum, t) => sum + (t.floorTime || 0), 0) /
      validTimes.length;
  }
  if (validTimes.some((t) => t.stiffness)) {
    avgStiffness =
      validTimes.reduce((sum, t) => sum + (t.stiffness || 0), 0) /
      validTimes.length;
  }
  if (validTimes.some((t) => t.performance)) {
    avgPerformance =
      validTimes.reduce((sum, t) => sum + (t.performance || 0), 0) /
      validTimes.length;
    performanceDrop =
      ((Math.max(...validTimes.map((t) => t.performance || 0)) -
        avgPerformance) /
        Math.max(...validTimes.map((t) => t.performance || 0))) *
      100;
  }
  return {
    avgFlightTime,
    avgHeightReached,
    avgFloorTime,
    avgStiffness,
    avgPerformance,
    performanceDrop,
  };
};

const processBasicResults = async (
  db: DatabaseInstance,
  baseResultMap: Map<string, DbBaseResult>,
  jumpTimeMap: Map<string, DbJumpTime[]>,
  athletesMap: Map<string, Athlete>
) => {
  const basicResults = await db.select(`
      SELECT br.* 
      FROM basic_result br
      WHERE br.deleted_at IS NULL
      AND br.bosco_result_id IS NULL
    `);
  for (const basicResult of basicResults) {
    const baseResult = baseResultMap.get(basicResult.base_result_id);
    if (!baseResult) continue;

    const athleteId = baseResult.athlete_id;
    const athlete = athletesMap.get(athleteId);
    if (!athlete) continue;

    const jumpTimesForResult = jumpTimeMap.get(baseResult.id) || [];

    const processedTimes: JumpTime[] = jumpTimesForResult.map((jt) => ({
      time: jt.time,
      deleted: jt.deleted ?? false,
      floorTime: jt.floor_time || undefined,
      stiffness: jt.stiffness || undefined,
      performance: jt.performance || undefined,
      baseResultId: baseResult.id,
    }));

    const {
      avgFlightTime,
      avgHeightReached,
      avgFloorTime,
      avgStiffness,
      avgPerformance,
      performanceDrop,
    } = calculateAverages(processedTimes);

    let studyResult:
      | CMJResult
      | SquatJumpResult
      | AbalakovResult
      | CustomStudyResult;

    const baseStudyResult: BaseResult = {
      times: processedTimes,
      avgFlightTime,
      avgHeightReached,
      avgFloorTime,
      avgStiffness,
      avgPerformance,
      performanceDrop,
      takeoffFoot: baseResult.takeoff_foot as "right" | "left" | "both",
      sensitivity: baseResult.sensitivity,
    };

    if (basicResult.type === "cmj") {
      studyResult = {
        ...baseStudyResult,
        type: "cmj",
        load: basicResult.load,
        loadUnit: basicResult.loadunit,
      } as CMJResult;
    } else if (basicResult.type === "squatJump") {
      studyResult = {
        ...baseStudyResult,
        type: "squatJump",
        load: basicResult.load,
        loadUnit: basicResult.loadunit,
      } as SquatJumpResult;
    } else if (basicResult.type === "abalakov") {
      studyResult = {
        ...baseStudyResult,
        type: "abalakov",
        load: basicResult.load,
        loadUnit: basicResult.loadunit,
      } as AbalakovResult;
    } else {
      studyResult = {
        ...baseStudyResult,
        type: "custom",
        load: basicResult.load,
        loadUnit: basicResult.loadunit,
      } as CustomStudyResult;
    }

    const studyInfo =
      studyResult.type === "custom"
        ? {
            name: "Custom Study",
            description: "Custom Study",
            preview: { equipment: ["Alfombra de Contacto"] },
          }
        : studyInfoLookup[studyResult.type as keyof typeof studyInfoLookup];
    const completedStudy: CompletedStudy = {
      id: basicResult.id,
      studyInfo,
      date: new Date(baseResult.created_at),
      results: studyResult,
    };

    athlete.completedStudies.push(completedStudy);
  }
};

const processMultipleJumpsResults = async (
  db: DatabaseInstance,
  baseResultMap: Map<string, DbBaseResult>,
  jumpTimeMap: Map<string, DbJumpTime[]>,
  athletesMap: Map<string, Athlete>
) => {
  const multipleJumpsResults = await db.select(`
      SELECT mjr.* 
      FROM multiple_jumps_result mjr
      WHERE mjr.deleted_at IS NULL
    `);

  for (const multipleJumpsResult of multipleJumpsResults) {
    const baseResult = baseResultMap.get(multipleJumpsResult.base_result_id);
    if (!baseResult) continue;

    const athlete = athletesMap.get(baseResult.athlete_id);
    if (!athlete) continue;

    const jumpTimesForResult = jumpTimeMap.get(baseResult.id) || [];
    const processedTimes: JumpTime[] = jumpTimesForResult.map((jt) => ({
      time: jt.time,
      deleted: jt.deleted ?? false,
      floorTime: jt.floor_time || undefined,
      stiffness: jt.stiffness || undefined,
      performance: jt.performance ?? undefined,
      baseResultId: baseResult.id,
    }));

    const {
      avgFlightTime,
      avgHeightReached,
      avgFloorTime,
      avgStiffness,
      avgPerformance,
      performanceDrop,
    } = calculateAverages(processedTimes);

    const multipleJumpsStudyResult: MultipleJumpsResult = {
      type: "multipleJumps",
      times: processedTimes,
      avgFlightTime,
      avgHeightReached,
      avgFloorTime: avgFloorTime || 0,
      avgStiffness: avgStiffness || 0,
      avgPerformance: avgPerformance || 0,
      performanceDrop: performanceDrop || 0,
      takeoffFoot: baseResult.takeoff_foot as "right" | "left" | "both",
      sensitivity: baseResult.sensitivity,
      criteria: multipleJumpsResult.criteria,
      criteriaValue: multipleJumpsResult.criteria_value,
    };

    const studyInfo = studyInfoLookup.multipleJumps;
    const completedStudy: CompletedStudy = {
      id: multipleJumpsResult.id,
      studyInfo,
      date: new Date(baseResult.created_at),
      results: multipleJumpsStudyResult,
    };

    athlete.completedStudies.push(completedStudy);
  }
};

const processMultipleDropJumpResults = async (
  db: DatabaseInstance,
  baseResultMap: Map<string, DbBaseResult>,
  jumpTimeMap: Map<string, DbJumpTime[]>,
  athletesMap: Map<string, Athlete>
) => {
  const multipleDropJumpResults = await db.select(`
      SELECT mdjr.* 
      FROM multiple_drop_jump_result mdjr
      WHERE mdjr.deleted_at IS NULL
    `);

  for (const multipleDropJumpResult of multipleDropJumpResults) {
    const athlete = athletesMap.get(multipleDropJumpResult.athlete_id);
    if (!athlete) continue;

    const dropJumpResults = await db.select(
      `
      SELECT djr.* 
      FROM drop_jump_result djr
      WHERE djr.multiple_drop_jump_id = ? AND djr.deleted_at IS NULL
    `,
      [multipleDropJumpResult.id]
    );

    const processedDropJumps: DropJumpResult[] = [];

    for (const dropJumpResult of dropJumpResults) {
      const baseResult = baseResultMap.get(dropJumpResult.base_result_id);
      if (!baseResult) continue;

      const jumpTimesForResult = jumpTimeMap.get(baseResult.id) || [];
      const processedTimes: JumpTime[] = jumpTimesForResult.map((jt) => ({
        time: jt.time,
        deleted: jt.deleted ?? false,
        floorTime: jt.floor_time || undefined,
        stiffness: jt.stiffness || undefined,
        performance: jt.performance ?? undefined,
        baseResultId: baseResult.id,
      }));

      const {
        avgFlightTime,
        avgHeightReached,
        avgFloorTime,
        avgStiffness,
        avgPerformance,
        performanceDrop,
      } = calculateAverages(processedTimes);

      const processedDropJump: DropJumpResult = {
        type: "dropJump",
        times: processedTimes,
        avgFlightTime,
        avgHeightReached,
        avgFloorTime: avgFloorTime || 0,
        avgStiffness: avgStiffness || 0,
        avgPerformance: avgPerformance || 0,
        performanceDrop: performanceDrop || 0,
        takeoffFoot: baseResult.takeoff_foot as "right" | "left" | "both",
        sensitivity: baseResult.sensitivity,
        height: dropJumpResult.height,
        stiffness: dropJumpResult.stiffness,
      };

      processedDropJumps.push(processedDropJump);
    }

    if (processedDropJumps.length === 0) continue;

    const maxAvgHeightReached = Math.max(
      ...processedDropJumps.map((dj) => dj.avgHeightReached)
    );

    const multipleDropJumpStudyResult: MultipleDropJumpResult = {
      type: "multipleDropJump",
      dropJumps: processedDropJumps,
      heightUnit: multipleDropJumpResult.height_unit as "cm" | "ft",
      maxAvgHeightReached,
      takeoffFoot: multipleDropJumpResult.takeoff_foot as
        | "right"
        | "left"
        | "both",
      bestHeight: multipleDropJumpResult.best_height,
    };

    const studyInfo = studyInfoLookup.multipleDropJump;
    const completedStudy: CompletedStudy = {
      id: multipleDropJumpResult.id,
      studyInfo,
      date: new Date(multipleDropJumpResult.created_at),
      results: multipleDropJumpStudyResult,
    };

    athlete.completedStudies.push(completedStudy);
  }
};

const processBoscoResults = async (
  db: DatabaseInstance,
  baseResultMap: Map<string, DbBaseResult>,
  jumpTimeMap: Map<string, DbJumpTime[]>,
  athletesMap: Map<string, Athlete>
) => {
  const boscoResults = await db.select(`
      SELECT br.* 
      FROM bosco_result br
      WHERE br.deleted_at IS NULL
    `);

  for (const boscoResult of boscoResults) {
    const athlete = athletesMap.get(boscoResult.athlete_id);
    if (!athlete) continue;

    const basicResults = await db.select(
      `
      SELECT br.* 
      FROM basic_result br
      WHERE br.bosco_result_id = ? AND br.deleted_at IS NULL
    `,
      [boscoResult.id]
    );

    const cmjBasicResult = basicResults.find((br) => br.type === "cmj");
    const squatJumpBasicResult = basicResults.find(
      (br) => br.type === "squatJump"
    );
    const abalakovBasicResult = basicResults.find(
      (br) => br.type === "abalakov"
    );

    if (!cmjBasicResult || !squatJumpBasicResult || !abalakovBasicResult) {
      continue;
    }

    const createBoscoSubResult = (
      basicResult: any,
      type: "cmj" | "squatJump" | "abalakov"
    ): any => {
      const baseResult = baseResultMap.get(basicResult.base_result_id);
      if (!baseResult) return null;

      const jumpTimesForResult = jumpTimeMap.get(baseResult.id) || [];
      const processedTimes: JumpTime[] = jumpTimesForResult.map((jt) => ({
        time: jt.time,
        deleted: jt.deleted ?? false,
        floorTime: jt.floor_time || undefined,
        stiffness: jt.stiffness || undefined,
        performance: jt.performance ?? undefined,
        baseResultId: baseResult.id,
      }));

      const {
        avgFlightTime,
        avgHeightReached,
        avgFloorTime,
        avgStiffness,
        avgPerformance,
        performanceDrop,
      } = calculateAverages(processedTimes);

      return {
        type,
        times: processedTimes,
        avgFlightTime,
        avgHeightReached,
        avgFloorTime,
        avgStiffness,
        avgPerformance,
        performanceDrop,
        takeoffFoot: baseResult.takeoff_foot as "right" | "left" | "both",
        sensitivity: baseResult.sensitivity,
        load: basicResult.load,
        loadUnit: basicResult.loadunit,
      };
    };

    const cmjResult = createBoscoSubResult(cmjBasicResult, "cmj");
    const squatJumpResult = createBoscoSubResult(
      squatJumpBasicResult,
      "squatJump"
    );
    const abalakovResult = createBoscoSubResult(
      abalakovBasicResult,
      "abalakov"
    );

    if (!cmjResult || !squatJumpResult || !abalakovResult) {
      continue;
    }

    const boscoStudyResult: BoscoResult = {
      type: "bosco",
      cmj: cmjResult as CMJResult,
      squatJump: squatJumpResult as SquatJumpResult,
      abalakov: abalakovResult as AbalakovResult,
    };

    const studyInfo = studyInfoLookup.bosco;
    const completedStudy: CompletedStudy = {
      id: boscoResult.id,
      studyInfo,
      date: new Date(boscoResult.created_at),
      results: boscoStudyResult,
    };

    athlete.completedStudies.push(completedStudy);
  }
};

export const getAthletes = async (coachId: string): Promise<Athlete[]> => {
  try {
    const db = await getDatabaseInstance();

    let query =
      "SELECT * FROM athlete WHERE deleted_at IS NULL AND coach_id = ?";
    const athletes = await db.select(query, [coachId]);
    console.log("athletes", athletes);
    console.log("coachId", coachId);
    if (athletes.length === 0) {
      return [];
    }
    let athletesMap = new Map<string, Athlete>();
    athletes.forEach((athlete) => {
      const athleteObj = transformToAthlete({
        id: athlete.id,
        name: athlete.name,
        birthDate: athlete.birth_date,
        country: athlete.country,
        state: athlete.state,
        gender: athlete.gender,
        height: athlete.height,
        heightUnit: athlete.height_unit,
        weight: athlete.weight,
        weightUnit: athlete.weight_unit,
        discipline: athlete.discipline,
        category: athlete.category,
        institution: athlete.institution,
        comments: athlete.comments,
        completedStudies: [],
        sessionPerformanceData: [],
        wellnessData: [],
        performanceData: [],
      });
      if (athleteObj) {
        athletesMap.set(athlete.id, athleteObj);
      }
    });
    const athleteIds = Array.from(athletesMap.keys());
    const placeholders = athleteIds.map(() => "?").join(", ");

    const baseResults = await db.select(
      `SELECT br.* 
   FROM base_result br
   WHERE br.deleted_at IS NULL AND br.athlete_id IN (${placeholders})`,
      athleteIds
    );
    console.log("baseResults", baseResults);

    const baseResultMap = new Map<string, DbBaseResult>();
    baseResults.forEach((br: DbBaseResult) => {
      baseResultMap.set(br.id, br);
    });

    const jumpTimes = await db.select(`
      SELECT jt.* 
      FROM jump_time jt
      ORDER BY jt.base_result_id, jt."index"
    `);

    const jumpTimeMap = new Map<string, DbJumpTime[]>();
    jumpTimes.forEach((jt: DbJumpTime) => {
      if (!jumpTimeMap.has(jt.base_result_id)) {
        jumpTimeMap.set(jt.base_result_id, []);
      }
      jumpTimeMap.get(jt.base_result_id)!.push(jt);
    });

    await processBasicResults(db, baseResultMap, jumpTimeMap, athletesMap);
    await processBoscoResults(db, baseResultMap, jumpTimeMap, athletesMap);
    await processMultipleJumpsResults(
      db,
      baseResultMap,
      jumpTimeMap,
      athletesMap
    );
    await processMultipleDropJumpResults(
      db,
      baseResultMap,
      jumpTimeMap,
      athletesMap
    );

    return Array.from(athletesMap.values());
  } catch (error) {
    console.error("Error fetching athletes:", error);
    return [];
  }
};

export const saveAthleteInfo = async (
  athlete: Athlete,
  coachId: string,
  pushRecord: (records: PendingRecord[]) => Promise<void>,
  externalDb?: DatabaseInstance
): Promise<PendingRecord> => {
  const dbToUse = externalDb || (await getDatabaseInstance());
  const isManagingTransaction = !externalDb;

  try {
    if (isManagingTransaction) {
      await dbToUse.execute("BEGIN TRANSACTION");
    }

    try {
      const existingAthlete = await dbToUse.select(
        "SELECT id FROM athlete WHERE id = ?",
        [athlete.id]
      );

      const birthDateFormatted = athlete.birthDate
        ? athlete.birthDate.toISOString().split("T")[0]
        : null;

      if (existingAthlete.length > 0) {
        await dbToUse.execute(
          `UPDATE athlete 
           SET name = ?, birth_date = ?, country = ?, state = ?, gender = ?, 
               height = ?, height_unit = ?, weight = ?, weight_unit = ?, 
               discipline = ?, category = ?, institution = ?, comments = ?,
               last_changed = ?,
               coach_id = ?
           WHERE id = ?`,
          [
            athlete.name,
            birthDateFormatted,
            athlete.country,
            athlete.state,
            athlete.gender,
            athlete.height,
            athlete.heightUnit,
            athlete.weight,
            athlete.weightUnit,
            athlete.discipline,
            athlete.category,
            athlete.institution,
            athlete.comments,
            new Date().toISOString(),
            coachId,
            athlete.id,
          ]
        );
      } else {
        await dbToUse.execute(
          `INSERT INTO athlete (id, name, birth_date, country, state, gender, 
                               height, height_unit, weight, weight_unit, 
                               discipline, category, institution, comments, 
                               created_at, last_changed, coach_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            athlete.id,
            athlete.name,
            birthDateFormatted,
            athlete.country,
            athlete.state,
            athlete.gender,
            athlete.height,
            athlete.heightUnit,
            athlete.weight,
            athlete.weightUnit,
            athlete.discipline,
            athlete.category,
            athlete.institution,
            athlete.comments,
            new Date().toISOString(),
            new Date().toISOString(),
            coachId,
          ]
        );
      }

      if (isManagingTransaction) {
        await dbToUse.execute("COMMIT");
        await pushRecord([{ tableName: "athlete", id: athlete.id }]);
      }

      return { tableName: "athlete", id: athlete.id };
    } catch (innerError) {
      if (isManagingTransaction) {
        await dbToUse.execute("ROLLBACK");
      }
      throw innerError;
    }
  } catch (error) {
    console.error("Error saving athlete info:", error);
    throw error;
  }
};

export const saveAllAthletes = async (
  athleteInfo: Athlete[],
  coachId: string,
  pushRecord: (records: PendingRecord[]) => Promise<void>
): Promise<string> => {
  if (!athleteInfo || !coachId || athleteInfo.length === 0) {
    return "error";
  }
  const db = await getDatabaseInstance();
  const pendingRecords: PendingRecord[] = [];
  try {
    await db.execute("BEGIN TRANSACTION");

    for (let i = 0; i < athleteInfo.length; i++) {
      const athlete = athleteInfo[i];

      try {
        const result = await saveAthleteInfo(athlete, coachId, pushRecord, db);
        pendingRecords.push(result);
      } catch (error) {
        await db.execute("ROLLBACK");
        return "error";
      }
    }

    await db.execute("COMMIT");
    pushRecord(pendingRecords);
    return "success";
  } catch (error) {
    console.error(error);
    try {
      await db.execute("ROLLBACK");
      console.log("ROLLBACK");
    } catch (error) {
      console.error(error);
    }
    return "error";
  }
};

export const deleteAthlete = async (
  athleteId: string,
  pushRecord: (records: PendingRecord[]) => Promise<void>
): Promise<void> => {
  try {
    const db = await getDatabaseInstance();

    await db.execute(`UPDATE athlete SET deleted_at = ? WHERE id = ?`, [
      new Date().toISOString(),
      athleteId,
    ]);

    pushRecord([{ tableName: "athlete", id: athleteId }]);
  } catch (error) {
    console.error("Error deleting athlete:", error);
    throw error;
  }
};

export const getAthleteDataAsUser = async (
  email: string
): Promise<Athlete | null> => {
  try {
    const db = await getDatabaseInstance();

    // Fetch athlete data by email
    const athletes = await db.select(
      `SELECT * FROM athlete 
       WHERE email = ? AND deleted_at IS NULL 
       LIMIT 1`,
      [email]
    );

    if (athletes.length === 0) {
      return null;
    }

    const athleteData = athletes[0];

    // Transform database data to Athlete interface
    const athlete = transformToAthlete({
      id: athleteData.id,
      name: athleteData.name,
      birthDate: athleteData.birth_date,
      country: athleteData.country,
      state: athleteData.state,
      gender: athleteData.gender,
      height: athleteData.height,
      heightUnit: athleteData.height_unit,
      weight: athleteData.weight,
      weightUnit: athleteData.weight_unit,
      discipline: athleteData.discipline,
      category: athleteData.category,
      institution: athleteData.institution,
      comments: athleteData.comments,
      character: athleteData.character,
      email: athleteData.email,
      completedStudies: [],
      sessionPerformanceData: [],
      wellnessData: [],
      performanceData: [],
    });

    if (!athlete) {
      return null;
    }

    // Create a Map for processing (following existing pattern)
    const athletesMap = new Map<string, Athlete>();
    athletesMap.set(athlete.id, athlete);

    // Fetch and process test results (following existing pattern)
    const baseResults = await db.select(
      `SELECT br.* 
       FROM base_result br
       WHERE br.deleted_at IS NULL AND br.athlete_id = ?`,
      [athlete.id]
    );

    if (baseResults.length > 0) {
      const baseResultMap = new Map<string, DbBaseResult>();
      baseResults.forEach((br: DbBaseResult) => {
        baseResultMap.set(br.id, br);
      });

      const jumpTimes = await db.select(
        `
        SELECT jt.* 
        FROM jump_time jt
        WHERE jt.base_result_id IN (${baseResults.map(() => "?").join(", ")})
        ORDER BY jt.base_result_id, jt."index"
      `,
        baseResults.map((br) => br.id)
      );

      const jumpTimeMap = new Map<string, DbJumpTime[]>();
      jumpTimes.forEach((jt: DbJumpTime) => {
        if (!jumpTimeMap.has(jt.base_result_id)) {
          jumpTimeMap.set(jt.base_result_id, []);
        }
        jumpTimeMap.get(jt.base_result_id)!.push(jt);
      });

      // Process all test results (following existing pattern)
      await processBasicResults(db, baseResultMap, jumpTimeMap, athletesMap);
      await processBoscoResults(db, baseResultMap, jumpTimeMap, athletesMap);
      await processMultipleJumpsResults(
        db,
        baseResultMap,
        jumpTimeMap,
        athletesMap
      );
      await processMultipleDropJumpResults(
        db,
        baseResultMap,
        jumpTimeMap,
        athletesMap
      );
    }

    return athletesMap.get(athlete.id) || null;
  } catch (error) {
    console.error("Error fetching athlete data by email:", error);
    return null;
  }
};

export const setAthleteDataAsUser = async (
  athlete: Athlete,
  pushRecord: (records: PendingRecord[]) => Promise<void>
): Promise<"success" | "error"> => {
  try {
    const db = await getDatabaseInstance();

    await db.execute("BEGIN TRANSACTION");

    try {
      const existingAthlete = await db.select(
        "SELECT id FROM athlete WHERE id = ?",
        [athlete.id]
      );

      const birthDateFormatted = athlete.birthDate
        ? athlete.birthDate.toISOString().split("T")[0]
        : null;

      if (existingAthlete.length > 0) {
        // Update existing athlete
        await db.execute(
          `UPDATE athlete 
           SET name = ?, birth_date = ?, country = ?, state = ?, gender = ?, 
               height = ?, height_unit = ?, weight = ?, weight_unit = ?, 
               discipline = ?, category = ?, institution = ?, comments = ?,
               character = ?, email = ?, last_changed = ?
           WHERE id = ?`,
          [
            athlete.name,
            birthDateFormatted,
            athlete.country,
            athlete.state,
            athlete.gender,
            athlete.height,
            athlete.heightUnit,
            athlete.weight,
            athlete.weightUnit,
            athlete.discipline,
            athlete.category,
            athlete.institution,
            athlete.comments,
            athlete.character,
            athlete.email,
            new Date().toISOString(),
            athlete.id,
          ]
        );
      } else {
        // Insert new athlete (though this case is less likely for user updates)
        await db.execute(
          `INSERT INTO athlete (id, name, birth_date, country, state, gender, 
                               height, height_unit, weight, weight_unit, 
                               discipline, category, institution, comments, 
                               character, email, created_at, last_changed, coach_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            athlete.id,
            athlete.name,
            birthDateFormatted,
            athlete.country,
            athlete.state,
            athlete.gender,
            athlete.height,
            athlete.heightUnit,
            athlete.weight,
            athlete.weightUnit,
            athlete.discipline,
            athlete.category,
            athlete.institution,
            athlete.comments,
            athlete.character,
            athlete.email,
            new Date().toISOString(),
            new Date().toISOString(),
            "", // coach_id can be empty for user updates
          ]
        );
      }

      await db.execute("COMMIT");
      await pushRecord([{ tableName: "athlete", id: athlete.id }]);

      return "success";
    } catch (innerError) {
      await db.execute("ROLLBACK");
      throw innerError;
    }
  } catch (error) {
    console.error("Error updating athlete data:", error);
    return "error";
  }
};

export default getAthletes;

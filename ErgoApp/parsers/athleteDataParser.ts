import {
  Athlete,
  transformToAthlete,
  WellnessData,
  ExercisePerformanceData,
  SessionPerformanceData,
} from "../types/Athletes";
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
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { PendingRecord } from "../types/Sync";
import { getDatabaseInstance } from "../adapters/DatabaseAdapterFactory";
import { DatabaseInstance } from "../adapters/DatabaseAdapter";
import { getTrainingPlanForAthlete } from "./trainingDataParser";
import { Progression } from "../types/trainingPlan";

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
  console.log("avgFlightTime", avgFlightTime);
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
      deleted: jt.deleted === "false" ? false : true,
      floorTime: jt.floor_time || undefined,
      stiffness: jt.stiffness || undefined,
      performance: jt.performance || undefined,
      baseResultId: baseResult.id,
    }));

    console.log("processedTimes", processedTimes);
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

    console.log("baseStudyResult", baseStudyResult);

    if (basicResult.type === "cmj") {
      studyResult = {
        ...baseStudyResult,
        type: "cmj",
        load: basicResult.load,
        loadUnit: basicResult.load_unit,
      } as CMJResult;
    } else if (basicResult.type === "squatJump") {
      studyResult = {
        ...baseStudyResult,
        type: "squatJump",
        load: basicResult.load,
        loadUnit: basicResult.load_unit,
      } as SquatJumpResult;
    } else if (basicResult.type === "abalakov") {
      studyResult = {
        ...baseStudyResult,
        type: "abalakov",
        load: basicResult.load,
        loadUnit: basicResult.load_unit,
      } as AbalakovResult;
    } else {
      studyResult = {
        ...baseStudyResult,
        type: "custom",
        load: basicResult.load,
        loadUnit: basicResult.load_unit,
      } as CustomStudyResult;
    }

    const studyInfo =
      studyResult.type === "custom"
        ? {
            name: "Custom Study",
            description: "Custom Study",
            preview: { equipment: ["Plataforma de Contacto"] },
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
      deleted: jt.deleted === "false" ? false : true,
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
        deleted: jt.deleted === "false" ? false : true,
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
        deleted: jt.deleted === "false" ? false : true,
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
        loadUnit: basicResult.load_unit,
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

const processWellnessData = async (
  db: DatabaseInstance,
  athletesMap: Map<string, Athlete>
) => {
  const athleteIds = Array.from(athletesMap.keys());
  const placeholders = athleteIds.map(() => "?").join(", ");

  const wellnessData = await db.select(
    `
    SELECT * FROM athlete_weekly_stats WHERE athlete_id IN (${placeholders}) AND deleted_at IS NULL
  `,
    [...athleteIds]
  );

  wellnessData.forEach((wd: any) => {
    const athlete = athletesMap.get(wd.athlete_id);
    if (athlete) {
      athlete.wellnessData?.push({
        id: wd.id,
        date: wd.date,
        sleep: wd.sleep,
        nutrition: wd.nutrition,
        fatigue: wd.fatigue,
      });
    }
  });
  return athletesMap;
};

const processPerformanceData = async (
  db: DatabaseInstance,
  athletesMap: Map<string, Athlete>
) => {
  const athleteIds = Array.from(athletesMap.keys());
  const placeholders = athleteIds.map(() => "?").join(", ");

  const performanceData = await db.select(
    `SELECT * FROM athlete_session_performance WHERE athlete_id IN (${placeholders}) AND deleted_at IS NULL`,
    [...athleteIds]
  );

  // Get all exercise performance data for these athlete session performances
  const performanceIds = performanceData.map((pd) => pd.id);
  const exercisePerformancePlaceholders = performanceIds
    .map(() => "?")
    .join(", ");

  let exercisePerformanceData: any[] = [];
  if (performanceIds.length > 0) {
    exercisePerformanceData = await db.select(
      `SELECT ep.*, se.exercise_id, e.name as exercise_name
       FROM exercise_performance ep
       JOIN selected_exercises se ON ep.selected_exercise_id = se.id
       JOIN exercises e ON se.exercise_id = e.id
       WHERE ep.athlete_session_performance_id IN (${exercisePerformancePlaceholders}) 
       AND ep.deleted_at IS NULL
       AND se.deleted_at IS NULL
       AND e.deleted_at IS NULL`,
      [...performanceIds]
    );
  }

  // Group exercise performance data by athlete_session_performance_id
  const exercisePerformanceMap = new Map<string, any[]>();
  exercisePerformanceData.forEach((epd: any) => {
    if (!exercisePerformanceMap.has(epd.athlete_session_performance_id)) {
      exercisePerformanceMap.set(epd.athlete_session_performance_id, []);
    }
    exercisePerformanceMap.get(epd.athlete_session_performance_id)!.push(epd);
  });

  performanceData.forEach((pd: any) => {
    const athlete = athletesMap.get(pd.athlete_id);
    if (athlete) {
      // Get exercise performance data for this session performance
      const exercisePerformances = exercisePerformanceMap.get(pd.id) || [];

      const exercisePerformanceData = exercisePerformances.map((ep) => ({
        selectedExerciseId: ep.selected_exercise_id,
        exerciseName: ep.exercise_name,
        completed: ep.completed,
        performed: ep.performed,
      }));

      athlete.sessionPerformanceData?.push({
        id: pd.id,
        sessionDayName: pd.day_name,
        sessionId: pd.session_id,
        week: pd.week_start_date,
        performance: pd.performance,
        completedExercises: pd.completed_exercises,
        alternativeDate: pd.alternative_date,
        exercisePerformanceData,
      });
    }
  });
  return athletesMap;
};

const processTargets = async (
  db: DatabaseInstance,
  athletesMap: Map<string, Athlete>
) => {
  const athleteIds = Array.from(athletesMap.keys());
  const placeholders = athleteIds.map(() => "?").join(", ");

  const targetsData = await db.select(
    `SELECT * FROM targets WHERE athlete_id IN (${placeholders}) AND deleted_at IS NULL`,
    [...athleteIds]
  );

  targetsData.forEach((td: any) => {
    const athlete = athletesMap.get(td.athlete_id);
    if (athlete) {
      if (!athlete.targets) {
        athlete.targets = [];
      }
      athlete.targets.push({
        target: td.target,
        exerciseId: td.exercise_id,
        currentState: td.current_state,
        comment: td.comment || undefined,
        metric: td.metric as any,
        targetDate: new Date(td.target_date),
      });
    }
  });
  return athletesMap;
};

export const savePollResults = async (
  athleteId: string,
  wellnessData: WellnessData,
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
      const id = wellnessData.id;

      // Insert new record
      await dbToUse.execute(
        `INSERT INTO athlete_weekly_stats (id, athlete_id, date, sleep, nutrition, fatigue, created_at, last_changed)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          athleteId,
          new Date().toISOString(),
          wellnessData.sleep,
          wellnessData.nutrition,
          wellnessData.fatigue,
          new Date().toISOString(),
          new Date().toISOString(),
        ]
      );

      if (isManagingTransaction) {
        await dbToUse.execute("COMMIT");
        await pushRecord([
          {
            tableName: "athlete_weekly_stats",
            id,
          },
        ]);
      }

      return {
        tableName: "athlete_weekly_stats",
        id,
      };
    } catch (innerError) {
      if (isManagingTransaction) {
        await dbToUse.execute("ROLLBACK");
      }
      throw innerError;
    }
  } catch (error) {
    console.error("Error saving poll results:", error);
    throw error;
  }
};

export const saveSessionPerformance = async (
  athleteId: string,
  sessionPerformance: SessionPerformanceData,
  progressions: Progression[],
  pushRecord: (records: PendingRecord[]) => Promise<void>,
  externalDb?: DatabaseInstance
): Promise<PendingRecord> => {
  const dbToUse = externalDb || (await getDatabaseInstance());
  const isManagingTransaction = !externalDb;

  try {
    if (isManagingTransaction) {
      await dbToUse.execute("BEGIN TRANSACTION");
    }
    const weekStartDate =
      typeof sessionPerformance.week === "string"
        ? sessionPerformance.week
        : sessionPerformance.week.toISOString().split("T")[0];

    const alternativeDate =
      typeof sessionPerformance.alternativeDate === "string"
        ? sessionPerformance.alternativeDate
        : sessionPerformance.alternativeDate?.toISOString().split("T")[0];

    try {
      const existingRecord = await dbToUse.select(
        "SELECT id FROM athlete_session_performance WHERE athlete_id = ? AND session_id = ? AND week_start_date = ? AND day_name = ? AND deleted_at IS NULL",
        [
          athleteId,
          sessionPerformance.sessionId,
          weekStartDate,
          sessionPerformance.sessionDayName,
        ]
      );

      let recordId: string;

      if (existingRecord.length > 0) {
        // Update existing record
        recordId = existingRecord[0].id;
        await dbToUse.execute(
          `UPDATE athlete_session_performance 
           SET performance = ?, completed_exercises = ?, day_name = ?, alternative_date = ?, last_changed = ?
           WHERE id = ?`,
          [
            sessionPerformance.performance,
            sessionPerformance.completedExercises,
            sessionPerformance.sessionDayName,
            alternativeDate,
            new Date().toISOString(),
            recordId,
          ]
        );
      } else {
        // Insert new record
        recordId = uuidv4();
        await dbToUse.execute(
          `INSERT INTO athlete_session_performance (id, athlete_id, session_id, week_start_date, day_name, performance, completed_exercises, alternative_date, created_at, last_changed)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            recordId,
            athleteId,
            sessionPerformance.sessionId,
            weekStartDate,
            sessionPerformance.sessionDayName,
            sessionPerformance.performance,
            sessionPerformance.completedExercises,
            alternativeDate,
            new Date().toISOString(),
            new Date().toISOString(),
          ]
        );
      }

      // Handle exercise performance data if provided
      if (sessionPerformance.exercisePerformanceData) {
        // First, delete existing exercise performance records for this session
        await dbToUse.execute(
          `UPDATE exercise_performance 
           SET deleted_at = ?, last_changed = ?
           WHERE athlete_session_performance_id = ?`,
          [new Date().toISOString(), new Date().toISOString(), recordId]
        );

        // Insert new exercise performance records
        for (const exercisePerf of sessionPerformance.exercisePerformanceData) {
          // Check if record already exists (might have been soft deleted above)
          const existingExercisePerf = await dbToUse.select(
            `SELECT athlete_session_performance_id, selected_exercise_id 
             FROM exercise_performance 
             WHERE athlete_session_performance_id = ? AND selected_exercise_id = ?`,
            [recordId, exercisePerf.selectedExerciseId]
          );

          if (existingExercisePerf.length > 0) {
            // Update existing record (restore from soft delete if needed)
            await dbToUse.execute(
              `UPDATE exercise_performance 
               SET completed = ?, performed = ?, deleted_at = NULL, last_changed = ?
               WHERE athlete_session_performance_id = ? AND selected_exercise_id = ?`,
              [
                exercisePerf.completed,
                exercisePerf.performed,
                new Date().toISOString(),
                recordId,
                exercisePerf.selectedExerciseId,
              ]
            );
          } else {
            // Insert new record
            await dbToUse.execute(
              `INSERT INTO exercise_performance (athlete_session_performance_id, selected_exercise_id, completed, performed, created_at, last_changed)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [
                recordId,
                exercisePerf.selectedExerciseId,
                exercisePerf.completed,
                exercisePerf.performed,
                new Date().toISOString(),
                new Date().toISOString(),
              ]
            );
          }
        }
      }

      // Handle progressions if provided
      if (progressions && progressions.length > 0) {
        for (const progression of progressions) {
          // Build the query and parameters dynamically based on optional fields
          let query: string;
          let params: any[];

          const hasCompleted = progression.completed !== undefined;
          const hasWeight =
            progression.weight !== undefined && progression.weight !== null;
          const hasWeightUnit =
            progression.weightUnit !== undefined &&
            progression.weightUnit !== null;

          if (hasCompleted && hasWeight && hasWeightUnit) {
            query =
              "UPDATE progressions SET series = ?, repetitions = ?, effort = ?, completed = ?, weight = ?, weight_unit = ?, last_changed = ? WHERE id = ?";
            params = [
              progression.series,
              progression.repetitions,
              progression.effort,
              progression.completed,
              progression.weight,
              progression.weightUnit,
              new Date().toISOString(),
              progression.id,
            ];
          } else if (hasCompleted && hasWeight) {
            query =
              "UPDATE progressions SET series = ?, repetitions = ?, effort = ?, completed = ?, weight = ?, last_changed = ? WHERE id = ?";
            params = [
              progression.series,
              progression.repetitions,
              progression.effort,
              progression.completed,
              progression.weight,
              new Date().toISOString(),
              progression.id,
            ];
          } else if (hasCompleted && hasWeightUnit) {
            query =
              "UPDATE progressions SET series = ?, repetitions = ?, effort = ?, completed = ?, weight_unit = ?, last_changed = ? WHERE id = ?";
            params = [
              progression.series,
              progression.repetitions,
              progression.effort,
              progression.completed,
              progression.weightUnit,
              new Date().toISOString(),
              progression.id,
            ];
          } else if (hasWeight && hasWeightUnit) {
            query =
              "UPDATE progressions SET series = ?, repetitions = ?, effort = ?, weight = ?, weight_unit = ?, last_changed = ? WHERE id = ?";
            params = [
              progression.series,
              progression.repetitions,
              progression.effort,
              progression.weight,
              progression.weightUnit,
              new Date().toISOString(),
              progression.id,
            ];
          } else if (hasCompleted) {
            query =
              "UPDATE progressions SET series = ?, repetitions = ?, effort = ?, completed = ?, last_changed = ? WHERE id = ?";
            params = [
              progression.series,
              progression.repetitions,
              progression.effort,
              progression.completed,
              new Date().toISOString(),
              progression.id,
            ];
          } else if (hasWeight) {
            query =
              "UPDATE progressions SET series = ?, repetitions = ?, effort = ?, weight = ?, last_changed = ? WHERE id = ?";
            params = [
              progression.series,
              progression.repetitions,
              progression.effort,
              progression.weight,
              new Date().toISOString(),
              progression.id,
            ];
          } else if (hasWeightUnit) {
            query =
              "UPDATE progressions SET series = ?, repetitions = ?, effort = ?, weight_unit = ?, last_changed = ? WHERE id = ?";
            params = [
              progression.series,
              progression.repetitions,
              progression.effort,
              progression.weightUnit,
              new Date().toISOString(),
              progression.id,
            ];
          } else {
            query =
              "UPDATE progressions SET series = ?, repetitions = ?, effort = ?, last_changed = ? WHERE id = ?";
            params = [
              progression.series,
              progression.repetitions,
              progression.effort,
              new Date().toISOString(),
              progression.id,
            ];
          }

          await dbToUse.execute(query, params);
        }
      }

      if (isManagingTransaction) {
        await dbToUse.execute("COMMIT");
        const recordsToPush: PendingRecord[] = [
          {
            tableName: "athlete_session_performance",
            id: recordId,
          },
        ];

        // Add progression records if they were updated
        if (progressions && progressions.length > 0) {
          for (const progression of progressions) {
            recordsToPush.push({
              tableName: "progressions",
              id: progression.id,
            });
          }
        }

        await pushRecord(recordsToPush);
      }

      return {
        tableName: "athlete_session_performance",
        id: recordId,
      };
    } catch (innerError) {
      if (isManagingTransaction) {
        await dbToUse.execute("ROLLBACK");
      }
      throw innerError;
    }
  } catch (error) {
    console.error("Error saving session performance:", error);
    throw error;
  }
};

export const saveAthleteDataAsUser = async (
  athleteData: Athlete,
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
      // Format birth_date properly for database storage
      const birthDateString =
        athleteData.birthDate instanceof Date
          ? athleteData.birthDate.toISOString().split("T")[0]
          : typeof athleteData.birthDate === "string"
          ? athleteData.birthDate
          : null;

      // Check if athlete record exists
      const existingRecord = await dbToUse.select(
        "SELECT id FROM athlete WHERE id = ? AND deleted_at IS NULL",
        [athleteData.id]
      );

      const currentTimestamp = new Date().toISOString();

      if (existingRecord.length > 0) {
        // Update existing athlete record
        await dbToUse.execute(
          `UPDATE athlete 
           SET name = ?, birth_date = ?, country = ?, state = ?, gender = ?, 
               height = ?, height_unit = ?, weight = ?, weight_unit = ?, 
               discipline = ?, category = ?, institution = ?, comments = ?, 
               email = ?, streak = ?, character = ?, last_changed = ?
           WHERE id = ? AND deleted_at IS NULL`,
          [
            athleteData.name,
            birthDateString,
            athleteData.country,
            athleteData.state,
            athleteData.gender,
            athleteData.height,
            athleteData.heightUnit,
            athleteData.weight,
            athleteData.weightUnit,
            athleteData.discipline,
            athleteData.category,
            athleteData.institution,
            athleteData.comments,
            athleteData.email || null,
            athleteData.streak || 0,
            athleteData.character || null,
            currentTimestamp,
            athleteData.id,
          ]
        );
      } else {
        // Insert new athlete record (though this case should be rare for user updates)
        await dbToUse.execute(
          `INSERT INTO athlete (id, coach_id, name, birth_date, country, state, gender, 
                                height, height_unit, weight, weight_unit, discipline, 
                                category, institution, comments, email, streak, character, created_at, last_changed)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            athleteData.id,
            athleteData.coachId || null,
            athleteData.name,
            birthDateString,
            athleteData.country,
            athleteData.state,
            athleteData.gender,
            athleteData.height,
            athleteData.heightUnit,
            athleteData.weight,
            athleteData.weightUnit,
            athleteData.discipline,
            athleteData.category,
            athleteData.institution,
            athleteData.comments,
            athleteData.email || null,
            athleteData.streak || 0,
            athleteData.character || null,
            currentTimestamp,
            currentTimestamp,
          ]
        );
      }

      if (isManagingTransaction) {
        await dbToUse.execute("COMMIT");
        await pushRecord([
          {
            tableName: "athlete",
            id: athleteData.id,
          },
        ]);
      }

      return {
        tableName: "athlete",
        id: athleteData.id,
      };
    } catch (innerError) {
      if (isManagingTransaction) {
        await dbToUse.execute("ROLLBACK");
      }
      throw innerError;
    }
  } catch (error) {
    console.error("Error saving athlete data:", error);
    throw error;
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
        email: athlete.email,
        character: athlete.character,
        streak: athlete.streak || 0,
        completedStudies: [],
        sessionPerformanceData: [],
        wellnessData: [],
        performanceData: [],
        targets: [],
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
    await processWellnessData(db, athletesMap);
    await processPerformanceData(db, athletesMap);
    await processTargets(db, athletesMap);

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
               email = ?, character = ?, streak = ?, last_changed = ?,
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
            athlete.email,
            athlete.character,
            athlete.streak || 0,
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
                               email, character, streak, created_at, last_changed, coach_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            athlete.email,
            athlete.character,
            athlete.streak || 0,
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

export const getAthleteAsUser = async (
  email: string
): Promise<Athlete | null> => {
  try {
    const db = await getDatabaseInstance();

    // First, find the athlete by email
    const athletes = await db.select(
      "SELECT * FROM athlete WHERE email = ? AND deleted_at IS NULL",
      [email]
    );

    console.log("athlete by email", athletes);
    console.log("email", email);

    if (athletes.length === 0) {
      return null;
    }

    const athlete = athletes[0];
    let athletesMap = new Map<string, Athlete>();

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
      email: athlete.email,
      character: athlete.character,
      streak: athlete.streak || 0,
      completedStudies: [],
      sessionPerformanceData: [],
      wellnessData: [],
      performanceData: [],
      targets: [],
    });

    if (!athleteObj) {
      return null;
    }

    athletesMap.set(athlete.id, athleteObj);

    const baseResults = await db.select(
      `SELECT br.* 
       FROM base_result br
       WHERE br.deleted_at IS NULL AND br.athlete_id = ?`,
      [athlete.id]
    );
    console.log("baseResults", baseResults);

    const baseResultMap = new Map<string, DbBaseResult>();
    baseResults.forEach((br: DbBaseResult) => {
      baseResultMap.set(br.id, br);
    });

    const jumpTimes = await db.select(
      `
      SELECT jt.* 
      FROM jump_time jt
      WHERE jt.athlete_id = ?
      ORDER BY jt.base_result_id, jt."index"
    `,
      [athlete.id]
    );

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
    await processWellnessData(db, athletesMap);
    await processPerformanceData(db, athletesMap);
    await processTargets(db, athletesMap);

    const result = athletesMap.get(athlete.id);

    if (result) {
      const trainingPlan = await getTrainingPlanForAthlete(athlete.id, db);
      result.currentTrainingPlan = trainingPlan[0];
    }
    return result || null;
  } catch (error) {
    console.error("Error fetching athlete as user:", error);
    return null;
  }
};

export default getAthletes;

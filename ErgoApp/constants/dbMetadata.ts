export const tablesInfo = new Map([
  ["coach", "id"], // Coach must come before athlete due to foreign key
  ["athlete", "id"],
  // Test-related tables that depend on athlete
  ["base_result", "id"], // Base result depends on athlete and must come before all tables that reference it
  ["bosco_result", "id"], // Bosco result depends on athlete
  ["event", "id"], // Event depends on coach and athlete
  ["events_athletes", "event_id,athlete_id"], // Events-athletes junction table with composite primary key
  ["multiple_drop_jump_result", "id"], // Multiple drop jump result depends on athlete
  ["athlete_weekly_stats", "id"], // Athlete weekly stats depends on athlete - UUID primary key
  // All tables below reference base_result and must come after it
  ["basic_result", "id"], // References base_result and bosco_result
  ["drop_jump_result", "id"], // References base_result and multiple_drop_jump_result
  ["multiple_jumps_result", "id"], // References base_result
  ["jump_time", "id"], // References base_result
  // Training-related tables
  ["exercises", "id"], // Exercises must come before selected_exercises and targets
  ["training_plans", "id"], // Training plans must come before sessions and models
  ["training_models", "id"], // Models reference training_plans
  ["sessions", "id"], // Sessions reference training_plans
  ["athlete_session_performance", "id"], // Athlete session performance now has its own UUID primary key
  ["session_days", "id"], // Session days reference sessions
  ["training_blocks", "id"], // Training blocks reference sessions
  ["selected_exercises", "id"], // Selected exercises reference sessions, exercises, and training_blocks
  ["progressions", "id"], // Progressions reference selected_exercises or training_blocks
  ["volume_reductions", "id"], // Volume reductions reference selected_exercises or training_blocks
  ["effort_reductions", "id"], // Effort reductions reference selected_exercises or training_blocks
  ["targets", "id"], // Targets reference athlete and exercises
]);

export type TableName =
  | "coach"
  | "athlete"
  | "base_result"
  | "bosco_result"
  | "event"
  | "events_athletes"
  | "multiple_drop_jump_result"
  | "athlete_weekly_stats"
  | "athlete_session_performance"
  | "basic_result"
  | "drop_jump_result"
  | "multiple_jumps_result"
  | "jump_time"
  | "exercises"
  | "training_plans"
  | "training_models"
  | "sessions"
  | "session_days"
  | "training_blocks"
  | "selected_exercises"
  | "progressions"
  | "volume_reductions"
  | "effort_reductions"
  | "targets";

// Access control metadata for secure data syncing
// Updated to reflect the actual database schema from parsedMigrations.sql
export const tableAccessControl = {
  // Tables with only coach_id
  coachOnly: new Set<TableName>(["event", "training_models"]),

  // Tables with only athlete_id
  athleteOnly: new Set<TableName>([
    "base_result",
    "bosco_result",
    "basic_result",
    "drop_jump_result",
    "multiple_drop_jump_result",
    "multiple_jumps_result",
    "jump_time",
    "athlete_weekly_stats",
    "targets",
  ]),

  // Tables with both coach_id and athlete_id
  coachAndAthlete: new Set<TableName>([
    "training_plans",
    "sessions",
    "session_days",
    "training_blocks",
    "selected_exercises",
    "progressions",
    "volume_reductions",
    "effort_reductions",
  ]),

  // Tables with neither coach_id nor athlete_id (need special handling)
  noDirectAccess: new Set<TableName>([
    "coach", // Access by own ID, not coach_id
    "athlete", // Access by coach relationship
    "athlete_session_performance", // Only athlete_id, no coach_id
  ]),

  // Special access rules
  special: {
    // Junction table - needs custom logic
    events_athletes: {
      type: "junction" as const,
      athleteField: "athlete_id" as const,
      parentTable: "event" as const,
      parentField: "event_id" as const,
    },

    // Global exercises - accessible to all coaches
    exercises: {
      type: "global" as const,
      accessRule: "1 = 1" as const, // All exercises are global for now
    },

    // Coach table - user accesses their own record
    coach: {
      type: "self" as const,
      accessRule: "id = ?" as const, // Coach accesses their own record
    },

    // Athlete table - coach accesses their athletes
    athlete: {
      type: "coach_owns_athlete" as const,
      accessRule: "coach_id = ?" as const,
    },

    // Athlete session performance - only athlete_id, no coach_id
    athlete_session_performance: {
      type: "athlete_only_indirect" as const,
      accessRule: "athlete_id IN (?)" as const,
    },
  },
} as const;

// Helper function to get access control info for a table
export function getTableAccessControl(tableName: TableName) {
  if (tableAccessControl.coachOnly.has(tableName)) {
    return { type: "coach_only" as const, fields: ["coach_id"] as const };
  }

  if (tableAccessControl.athleteOnly.has(tableName)) {
    return { type: "athlete_only" as const, fields: ["athlete_id"] as const };
  }

  if (tableAccessControl.coachAndAthlete.has(tableName)) {
    return {
      type: "coach_and_athlete" as const,
      fields: ["coach_id", "athlete_id"] as const,
    };
  }

  if (tableAccessControl.noDirectAccess.has(tableName)) {
    return {
      type: "special" as const,
      rule: tableAccessControl.special[
        tableName as keyof typeof tableAccessControl.special
      ],
    };
  }

  if (
    tableAccessControl.special[
      tableName as keyof typeof tableAccessControl.special
    ]
  ) {
    return {
      type: "special" as const,
      rule: tableAccessControl.special[
        tableName as keyof typeof tableAccessControl.special
      ],
    };
  }

  return { type: "unknown" as const };
}

// Helper function to build WHERE clause for access control
export function buildAccessWhereClause(
  tableName: TableName,
  coachId: string,
  athleteIds: string[]
): { whereClause: string; params: any[] } {
  const accessControl = getTableAccessControl(tableName);

  switch (accessControl.type) {
    case "coach_only":
      return {
        whereClause: "coach_id = ?",
        params: [coachId],
      };

    case "athlete_only":
      if (athleteIds.length === 0) {
        return { whereClause: "1 = 0", params: [] }; // No access
      }
      return {
        whereClause: `athlete_id IN (${athleteIds.map(() => "?").join(",")})`,
        params: athleteIds,
      };

    case "coach_and_athlete":
      if (athleteIds.length === 0) {
        return {
          whereClause: "coach_id = ?",
          params: [coachId],
        };
      }
      return {
        whereClause: `coach_id = ? OR athlete_id IN (${athleteIds
          .map(() => "?")
          .join(",")})`,
        params: [coachId, ...athleteIds],
      };

    case "special":
      return handleSpecialAccessCase(
        tableName,
        accessControl.rule,
        coachId,
        athleteIds
      );

    default:
      throw new Error(`Unknown access control for table: ${tableName}`);
  }
}

// Handle special access control cases
function handleSpecialAccessCase(
  tableName: TableName,
  rule: any,
  coachId: string,
  athleteIds: string[]
): { whereClause: string; params: any[] } {
  switch (tableName) {
    case "events_athletes":
      // Junction table: sync if athlete belongs to coach OR event belongs to coach
      if (athleteIds.length === 0) {
        return {
          whereClause: `event_id IN (SELECT id FROM event WHERE coach_id = ?)`,
          params: [coachId],
        };
      }
      return {
        whereClause: `
          athlete_id IN (${athleteIds.map(() => "?").join(",")}) 
          OR event_id IN (SELECT id FROM event WHERE coach_id = ?)
        `,
        params: [...athleteIds, coachId],
      };

    case "exercises":
      // All exercises are global for now (no coach_id field in current schema)
      return {
        whereClause: "1 = 1", // All exercises accessible
        params: [],
      };

    case "coach":
      // Coach accesses their own record
      return {
        whereClause: "id = ?",
        params: [coachId],
      };

    case "athlete":
      // Coach accesses their athletes
      return {
        whereClause: "coach_id = ?",
        params: [coachId],
      };

    case "athlete_session_performance":
      // Only athlete_id field, no coach_id
      if (athleteIds.length === 0) {
        return { whereClause: "1 = 0", params: [] }; // No access
      }
      return {
        whereClause: `athlete_id IN (${athleteIds.map(() => "?").join(",")})`,
        params: athleteIds,
      };

    default:
      throw new Error(`Unhandled special access case: ${tableName}`);
  }
}

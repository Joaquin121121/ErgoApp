import { PlanState } from "./trainingPlan";
import { CompletedStudy } from "./Studies";
import { Objective } from "./Objective";
import { DayName } from "./trainingPlan";

export interface Athlete {
  id: string;
  name: string;
  birthDate: Date;
  country: string;
  state: string;
  gender: "M" | "F" | "O" | "";
  height: string;
  heightUnit: "cm" | "ft";
  weight: string;
  weightUnit: "kg" | "lb";
  discipline: string;
  category: string;
  institution: string;
  comments: string;
  completedStudies: CompletedStudy[];
  calendar?: Event[];
  character?: string;
  notifications?: Notification[];
  objectives?: Objective[];
  email?: string;
  streak?: number;
  targets?: Target[];
  currentTrainingPlan?: PlanState;
  wellnessData?: WellnessData[];
  sessionPerformanceData?: SessionPerformanceData[];
  performanceData?: PerformanceData[];
  coachId?: string;
  deletedAt?: Date | null;
}

export interface WellnessData {
  id: string;
  date: Date | string;
  sleep: number;
  nutrition: number;
  fatigue: number;
}

export interface Target {
  target: number;
  exerciseId?: string;
  currentState: number;
  comment?: string;
  metric:
    | "repetitions"
    | "time"
    | "distance"
    | "weight"
    | "cmjResult"
    | "squatJumpResult"
    | "abalakovResult"
    | "dropJumpResult"
    | "multipleJumpsResult"
    | "other";
  targetDate: Date;
}

export interface SessionPerformanceData {
  id: string;
  sessionDayName: DayName;
  sessionId: string;
  week: Date | string;
  performance: number;
  completedExercises: number;
  alternativeDate?: Date | string;
  exercisePerformanceData: ExercisePerformanceData[];
}

export interface PerformanceData {
  week: Date | string;
  attendance: string;
  completedExercises: string;
  performance: string;
}

export interface ExercisePerformanceData {
  selectedExerciseId: string;
  exerciseName: string;
  completed: boolean;
  performed: boolean;
}

export function isAthlete(value: unknown): value is Athlete {
  if (!value || typeof value !== "object") {
    return false;
  }

  const athlete = value as Record<string, unknown>;

  // Check required string fields
  const stringFields: (keyof Athlete)[] = [
    "name",
    "country",
    "state",
    "height",
    "weight",
    "discipline",
    "category",
    "institution",
    "comments",
  ];

  if (!stringFields.every((field) => typeof athlete[field] === "string")) {
    return false;
  }

  // Check birthDate
  if (
    !(athlete.birthDate instanceof Date) ||
    isNaN(athlete.birthDate.getTime())
  ) {
    return false;
  }

  // Check gender
  if (!["M", "F", "O", ""].includes(athlete.gender as string)) {
    return false;
  }

  // Check heightUnit
  if (!["cm", "ft"].includes(athlete.heightUnit as string)) {
    return false;
  }

  // Check weightUnit
  if (!["kg", "lb"].includes(athlete.weightUnit as string)) {
    return false;
  }

  // Check completedStudies is an array
  if (!Array.isArray(athlete.completedStudies)) {
    return false;
  }

  // Validate each completed study
  const isValidCompletedStudy = (study: unknown): study is CompletedStudy => {
    return typeof study === "object" && study !== null;
    // Additional validation should be added based on CompletedStudy interface
  };

  if (!athlete.completedStudies.every(isValidCompletedStudy)) {
    return false;
  }

  return true;
}

export function transformToAthlete(data: unknown): Athlete | null {
  try {
    if (!data || typeof data !== "object") {
      return null;
    }

    const input = data as Record<string, unknown>;

    // Handle birthDate with proper type checking
    let birthDate: Date;
    if (input.birthDate instanceof Date) {
      birthDate = input.birthDate;
    } else if (
      typeof input.birthDate === "string" ||
      typeof input.birthDate === "number"
    ) {
      birthDate = new Date(input.birthDate);
    } else {
      birthDate = new Date();
    }

    if (isNaN(birthDate.getTime())) {
      birthDate = new Date();
    }

    // Transform gender to match the union type
    let gender: "M" | "F" | "O" | "" = "";
    if (typeof input.gender === "string") {
      if (["M", "F", "O", ""].includes(input.gender)) {
        gender = input.gender as "M" | "F" | "O" | "";
      }
    }

    // Transform height and weight units
    const heightUnit =
      typeof input.heightUnit === "string" &&
      ["cm", "ft"].includes(input.heightUnit)
        ? (input.heightUnit as "cm" | "ft")
        : "cm";

    const weightUnit =
      typeof input.weightUnit === "string" &&
      ["kg", "lb"].includes(input.weightUnit)
        ? (input.weightUnit as "kg" | "lb")
        : "kg";

    // Handle completedStudies array
    const completedStudies = Array.isArray(input.completedStudies)
      ? input.completedStudies.filter(
          (study): study is CompletedStudy =>
            typeof study === "object" && study !== null
        )
      : [];

    // Handle targets array
    const targets = Array.isArray(input.targets)
      ? input.targets.filter(
          (target): target is Target =>
            typeof target === "object" && target !== null
        )
      : [];

    const athlete: Athlete = {
      id: String(input.id),
      name: String(input.name || ""),
      birthDate,
      country: String(input.country || ""),
      state: String(input.state || ""),
      gender,
      height: String(input.height || ""),
      heightUnit,
      weight: String(input.weight || ""),
      weightUnit,
      discipline: String(input.discipline || ""),
      category: String(input.category || ""),
      institution: String(input.institution || ""),
      comments: String(input.comments || ""),
      completedStudies,
      email: typeof input.email === "string" ? input.email : undefined,
      character:
        typeof input.character === "string" ? input.character : undefined,
      streak: typeof input.streak === "number" ? input.streak : 0,
      targets,
      deletedAt:
        input.deletedAt && input.deletedAt instanceof Date
          ? input.deletedAt
          : null,
      wellnessData: input.wellnessData
        ? (input.wellnessData as WellnessData[])
        : [],
      performanceData: input.performanceData
        ? (input.performanceData as PerformanceData[])
        : [],
      sessionPerformanceData: input.sessionPerformanceData
        ? (input.sessionPerformanceData as SessionPerformanceData[])
        : [],
    };

    return isAthlete(athlete) ? athlete : null;
  } catch (error) {
    console.error("Error transforming athlete data:", error);
    return null;
  }
}

export const genders = [
  { label: "male", id: "M" },
  { label: "female", id: "F" },
  { label: "other", id: "O" },
];

export const athleteAgeRanges = [
  {
    id: 1,
    name: "Pre-infantil",
    label: "Pre-infantil (8-10)",
    minAge: 8,
    maxAge: 10,
    description: "Iniciación deportiva",
  },
  {
    id: 2,
    label: "Infantil (11-13)",
    minAge: 11,
    maxAge: 13,
    description: "Desarrollo básico",
  },
  {
    id: 3,
    label: "Cadete (14-15)",
    minAge: 14,
    maxAge: 15,
    description: "Desarrollo intermedio",
  },
  {
    id: 4,
    label: "Juvenil (16-17)",
    minAge: 16,
    maxAge: 17,
    description: "Desarrollo avanzado",
  },
  {
    id: 5,
    label: "Sub-23 (18-22)",
    minAge: 18,
    maxAge: 22,
    description: "Alto rendimiento juvenil",
  },
  {
    id: 6,
    label: "Senior (23-39)",
    minAge: 23,
    maxAge: 39,
    description: "Máximo rendimiento",
  },
  {
    id: 7,
    label: "+40",
    minAge: 40,
    maxAge: 49,
    description: "Categoría máster primera década",
  },
  {
    id: 8,
    label: "+50",
    minAge: 50,
    maxAge: 59,
    description: "Categoría máster segunda década",
  },
  {
    id: 9,
    label: "+60",
    minAge: 60,
    maxAge: 120,
    description: "Categoría máster tercera década",
  },
];

export const initialAthlete: Athlete = {
  id: "",
  name: "",
  birthDate: new Date(),
  country: "",
  state: "",
  gender: "",
  height: "",
  heightUnit: "cm",
  weight: "",
  weightUnit: "kg",
  discipline: "",
  category: "",
  institution: "",
  comments: "",
  completedStudies: [],
  calendar: [],
  character: "",
  notifications: [],
  objectives: [],
  email: "",
  streak: 0,
  targets: [],
  currentTrainingPlan: undefined,
  wellnessData: [],
  sessionPerformanceData: [],
  performanceData: [],
  deletedAt: null,
};

import { StudyType } from "./Studies";

export interface PerformanceObjective {
  athleteId: string;
  exerciseId: string;
  metric: "repetitions" | "time" | "distance" | "weight" | "other";
  lastBestPerformance: number;
  target: number;
  targetDate: Date;
}

export interface TestObjective {
  athleteId: string;
  testType: StudyType;
  lastBestPerformance: number;
  target: number;
  targetDate: Date;
}

export type Objective = PerformanceObjective | TestObjective;

import { SessionPerformanceData } from "../types/Athletes";
import { DayName } from "../types/trainingPlan";
import { findMonday } from "../utils/utils";

// Types for calendar data structure

export interface DayData extends SessionPerformanceData {
  completed?: boolean;
  sessionName?: string;
  expired?: boolean;
}

export interface WeekData extends Record<DayName, DayData> {}

export interface CalendarData {
  [weekKey: string]: WeekData;
}

export const dayTranslations = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const inverseDayTranslations = {
  Lunes: "monday",
  Martes: "tuesday",
  Miércoles: "wednesday",
  Jueves: "thursday",
  Viernes: "friday",
  Sábado: "saturday",
  Domingo: "sunday",
};

// Helper function to generate week ranges for n weeks starting from a specific date
export const generateWeeks = (
  nOfWeeks: number,
  startDate: Date
): CalendarData => {
  const weeks: CalendarData = {};

  // Clone the start date to avoid modifying the original
  let currentDate = new Date(startDate);

  for (let week = 0; week < nOfWeeks; week++) {
    // Find the Monday of the current week
    const mondayDate = findMonday(currentDate);

    const startDateStr = `${mondayDate.getDate()}/${
      mondayDate.getMonth() + 1
    }/${mondayDate.getFullYear()}`;

    // Calculate end date (Sunday - 6 days after Monday)
    const endDate = new Date(mondayDate);
    endDate.setDate(mondayDate.getDate() + 6);
    const endDateStr = `${endDate.getDate()}/${
      endDate.getMonth() + 1
    }/${endDate.getFullYear()}`;

    const weekKey = `${startDateStr}-${endDateStr}`;
    // Create individual objects for each day to avoid shared references
    weeks[weekKey] = {
      monday: {
        id: "",
        sessionId: "",
        week: startDateStr,
        performance: 0,
        completedExercises: 0,
        sessionDayName: "monday",
        exercisePerformanceData: [],
      },
      tuesday: {
        id: "",
        sessionId: "",
        week: startDateStr,
        performance: 0,
        completedExercises: 0,
        sessionDayName: "tuesday",
        exercisePerformanceData: [],
      },
      wednesday: {
        id: "",
        sessionId: "",
        week: startDateStr,
        performance: 0,
        completedExercises: 0,
        sessionDayName: "wednesday",
        exercisePerformanceData: [],
      },
      thursday: {
        id: "",
        sessionId: "",
        week: startDateStr,
        performance: 0,
        completedExercises: 0,
        sessionDayName: "thursday",
        exercisePerformanceData: [],
      },
      friday: {
        id: "",
        sessionId: "",
        week: startDateStr,
        performance: 0,
        completedExercises: 0,
        sessionDayName: "friday",
        exercisePerformanceData: [],
      },
      saturday: {
        id: "",
        sessionId: "",
        week: startDateStr,
        performance: 0,
        completedExercises: 0,
        sessionDayName: "saturday",
        exercisePerformanceData: [],
      },
      sunday: {
        id: "",
        sessionId: "",
        week: startDateStr,
        performance: 0,
        completedExercises: 0,
        sessionDayName: "sunday",
        exercisePerformanceData: [],
      },
    };

    // Move to next week (Monday of next week)
    currentDate.setDate(mondayDate.getDate() + 7);
  }

  console.log("weeks", Object.keys(weeks));
  return weeks;
};

export const calendarData: CalendarData = generateWeeks(
  8,
  new Date(2025, 6, 21)
);

export const getCurrentWeekIndex = (calendarData: CalendarData) => {
  console.log("calendarData", calendarData);
  const sortedWeeks = Object.keys(calendarData).sort((a, b) => {
    const [dayA] = a.split("-")[0].split("/").reverse();
    const [dayB] = b.split("-")[0].split("/").reverse();
    return parseInt(dayA) - parseInt(dayB);
  });

  const today = new Date();
  const initialWeekIndex = sortedWeeks.findIndex((weekRange) => {
    const [startDate] = weekRange.split("-");
    const [day, month, year] = startDate.split("/").map(Number);
    const weekStart = new Date(year, month - 1, day);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return today >= weekStart && today <= weekEnd;
  });

  return { initialWeekIndex, sortedWeeks };
};

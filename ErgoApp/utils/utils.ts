import { Event } from "../types/Events";
import { Athlete, SessionPerformanceData } from "../types/Athletes";
import { Coach } from "../types/Coach";
import {
  RangeEntry,
  VolumeReduction,
  EffortReduction,
  Progression,
  DisplayProgressionCollection,
  TrainingBlock,
  SelectedExercise,
  Session,
  Exercise,
  PlanState,
  DayName,
  DisplaySelectedExercise,
} from "../types/trainingPlan";
import {
  CalendarData,
  generateWeeks,
  dayTranslations,
  DayData,
} from "../scripts/calendarData";
import {
  CompletedStudy,
  StudyType,
  studyTypes,
  CMJResult,
  SquatJumpResult,
  MultipleJumpsResult,
  MultipleDropJumpResult,
  BaseResult,
} from "../types/Studies";
import { TestValueHistory } from "../types/trainingPlan";
export function formatDateString(date: Date): string {
  return new Date(date)
    .toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(
      /(\b|\s)([a-zA-ZáéíóúüñÁÉÍÓÚÜÑ])([a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]*)/g,
      (match, boundary, firstChar, rest, i) =>
        i > 0 && match.length > 3
          ? boundary + firstChar.toUpperCase() + rest
          : match
    )
    .replace(/,/g, "");
}

export function formatDateDDMMYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();

  if (year === currentYear) {
    return `${day}/${month}`;
  } else {
    return `${day}/${month}/${year}`;
  }
}

export function getTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function findMonday(date: Date): Date {
  // Clone the date to avoid modifying the original
  const currentDate = new Date(date);

  // Find the Monday of the current week
  const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysToMonday = dayOfWeek === 0 ? -6 : -(dayOfWeek - 1);

  const mondayDate = new Date(currentDate);
  mondayDate.setDate(currentDate.getDate() + daysToMonday);

  return mondayDate;
}

export function camelToNatural(camelCase: string): string {
  // Handle Spanish characters in addition to regular capitals
  const words = camelCase
    .replace(/([A-ZÁÉÍÓÚÑÜáéíóúñü])/g, " $1")
    .trim()
    // Don't lowercase parts that look like acronyms (including Spanish ones)
    .replace(/([A-ZÁÉÍÓÚÑÜ]{2,})/g, (match) => match)
    .split(" ");

  // Capitalize first letter of each word, preserve acronyms and Spanish characters
  return words
    .map((word) => {
      // Check if it's an acronym (including Spanish characters)
      if (word.match(/^[A-ZÁÉÍÓÚÑÜ]{2,}$/)) {
        return word; // Keep acronyms as is
      }

      // Special handling for Spanish lowercase first characters
      const firstChar = word.charAt(0);
      const rest = word.slice(1);

      // Map of lowercase to uppercase Spanish characters
      const spanishUppercase: { [key: string]: string } = {
        á: "Á",
        é: "É",
        í: "Í",
        ó: "Ó",
        ú: "Ú",
        ñ: "Ñ",
        ü: "Ü",
      };

      // Capitalize first character, handling Spanish special characters
      const upperFirst =
        spanishUppercase[firstChar.toLowerCase()] || firstChar.toUpperCase();

      return upperFirst + rest;
    })
    .join(" ");
}
export const naturalToCamelCase = (text: string): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s_-]/g, " ")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word, i) =>
      i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
};

export function getSecondsBetweenDates(date1: Date, date2: Date) {
  // Obtenemos la diferencia en milisegundos
  const diffInMs = date2.getTime() - date1.getTime();

  // Convertimos milisegundos a segundos (dividiendo por 1000)
  const diffInSeconds = diffInMs / 1000;

  return diffInSeconds;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const getPerformanceDrop = (validPerformances: number[]) => {
  const sortedPerformances = [...validPerformances].sort((a, b) => b - a);

  const highestTwo = sortedPerformances.slice(0, 2);
  const lowestTwo = sortedPerformances.slice(-2);

  const avgHighest = (highestTwo[0] + highestTwo[1]) / 2;
  const avgLowest = (lowestTwo[0] + lowestTwo[1]) / 2;

  const decline = ((avgHighest - avgLowest) / avgHighest) * 100;
  return decline;
};

export function ftToCm(heightStr: string): number {
  const [feet, inches = "0"] = heightStr.split("'");
  const feetNum = parseInt(feet);
  const inchesNum = parseInt(inches);

  if (isNaN(feetNum) || isNaN(inchesNum)) {
    return 0;
  }

  // Convert feet to cm (1 foot = 30.48 cm)
  // Convert inches to cm (1 inch = 2.54 cm)
  const totalCm = Math.round(feetNum * 30.48 + inchesNum * 2.54);

  return totalCm;
}

export function formatMinutesToHoursAndMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function validateHHMM(value: string) {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(value);
}

/**
 * Creates a date with the correct local timezone
 * Prevents timezone offset issues when creating/updating events
 */
export const createLocalDate = (
  dateStr: string | Date,
  timeStr?: string
): Date => {
  const date = new Date(dateStr);

  if (timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
  }

  // Create a date string in YYYY-MM-DD format
  const localDateStr = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  // Create a time string in HH:MM format
  const localTimeStr =
    timeStr ||
    `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;

  // Combine them to create a local datetime string with timezone offset
  const result = new Date(`${localDateStr}T${localTimeStr}:00`);

  // Add the timezone offset to compensate
  const timezoneOffset = result.getTimezoneOffset();
  result.setMinutes(result.getMinutes() + timezoneOffset);

  return result;
};

/**
 * Creates a date ISO string that preserves the exact time specified
 * Completely bypasses timezone issues by directly building the ISO string
 */
export const createTimezoneIndependentDate = (
  dateStr: string | Date,
  timeStr?: string
): string => {
  const date = new Date(dateStr);

  // Extract date parts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Extract time parts
  let hours, minutes;
  if (timeStr) {
    [hours, minutes] = timeStr.split(":").map((s) => s.padStart(2, "0"));
  } else {
    hours = String(date.getHours()).padStart(2, "0");
    minutes = String(date.getMinutes()).padStart(2, "0");
  }

  // Get the timezone offset in hours and minutes
  const tzOffset = -date.getTimezoneOffset();
  const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60);
  const tzOffsetMinutes = Math.abs(tzOffset) % 60;

  // Format the timezone string (e.g., +03:00, -05:30)
  const tzOffsetStr = `${tzOffset >= 0 ? "+" : "-"}${String(
    tzOffsetHours
  ).padStart(2, "0")}:${String(tzOffsetMinutes).padStart(2, "0")}`;

  // Build the ISO string with the explicit timezone offset
  return `${year}-${month}-${day}T${hours}:${minutes}:00${tzOffsetStr}`;
};

export const findOverlappingEvents = (
  events: Event[],
  newEvent: Event
): number | string | false => {
  const newEventStart = new Date(newEvent.date);
  const newEventDuration = newEvent.duration || 0; // Default to 0 if duration is missing
  const newEventEnd = new Date(
    newEventStart.getTime() + newEventDuration * 60000
  );
  const newEventDay = newEventStart.toDateString(); // Get YYYY-MM-DD for comparison

  for (const event of events) {
    // Skip comparing the event with itself if it's already in the list (e.g., during updates)
    if (event.id === newEvent.id) {
      continue;
    }

    const eventStart = new Date(event.date);

    // Check if the event is on the same day
    if (eventStart.toDateString() === newEventDay) {
      const eventDuration = event.duration || 0; // Default to 0 if duration is missing
      const eventEnd = new Date(eventStart.getTime() + eventDuration * 60000);

      // Check for overlap: (StartA < EndB) and (EndA > StartB)
      if (eventStart < newEventEnd && eventEnd > newEventStart) {
        return event.id; // Return the ID of the overlapping event
      }
    }
  }

  return false; // No overlap found
};

export function getReductionFromRangeEntries(
  type: "volume" | "effort",
  rangeEntries: RangeEntry[]
): VolumeReduction | EffortReduction {
  if (!rangeEntries) return { id: "" };
  const reductionObject: VolumeReduction | EffortReduction = { id: "" };

  rangeEntries.forEach((entry) => {
    const [min, max] = entry.range;
    const label = min === max ? `${min}` : `${min}-${max}`;

    reductionObject[label] = entry.percentageDrop;
  });

  return reductionObject;
}

export const validateReps = (
  input: string,
  seriesN: number | string
): { value: string; error: string } => {
  // Convert seriesN to number if it's a string
  const seriesNNum = Number(seriesN);

  // First check if it's a single positive integer
  if (/^[1-9]\d*$/.test(input)) {
    return { value: input, error: "" };
  }

  // For multiple series, check format
  if (seriesNNum <= 1) {
    return { value: "", error: "Solo se permite un número para una serie" };
  }

  // Check for mixed separators (reject things like "5-8/7")
  if (input.includes("-") && input.includes("/")) {
    return { value: "", error: "No se pueden mezclar separadores - y /" };
  }

  // Determine separator and trim input accordingly
  let trimmedInput = input;
  let separator: string | null = null;

  if (input.includes("-")) {
    separator = "-";
    // For hyphen separator, trim to only first 2 parts (e.g., "5-8-9" becomes "5-8")
    const parts = input.split("-");
    if (parts.length > 2) {
      trimmedInput = parts.slice(0, 2).join("-");
    }
  } else if (input.includes("/")) {
    separator = "/";
    // For slash separator, trim to match seriesN (e.g., "5/6/7" with seriesN=2 becomes "5/6")
    const parts = input.split("/");
    if (parts.length > seriesNNum) {
      trimmedInput = parts.slice(0, seriesNNum).join("/");
    }
  } else {
    return {
      value: "",
      error: "Formato inválido. Use números, rangos (5-8) o series (5/6/7)",
    };
  }

  // Split and validate each part of the trimmed input
  const parts = trimmedInput.split(separator);

  // For hyphen (-) separator, should have exactly 2 parts after trimming
  if (separator === "-" && parts.length !== 2) {
    return { value: "", error: "El formato de rango debe ser: número-número" };
  }

  // For slash (/) separator, should match seriesN after trimming
  if (separator === "/" && parts.length !== seriesNNum) {
    return {
      value: "",
      error: `Debe especificar ${seriesNNum} repeticiones separadas por /`,
    };
  }

  // Check each part is a valid positive number
  for (const part of parts) {
    const num = parseInt(part);
    if (isNaN(num) || num <= 0) {
      return {
        value: "",
        error: "Todos los números deben ser positivos y válidos",
      };
    }
  }

  return { value: trimmedInput, error: "" };
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const initializeSelectedExerciseFromTrainingBlockData = (
  exercise: Exercise,
  trainingBlock: TrainingBlock
) => {
  return {
    type: "selectedExercise",
    id: "",
    sessionId: "",
    name: exercise.name,
    exerciseId: exercise.id,
    series: trainingBlock.series,
    repetitions: trainingBlock.repetitions,
    effort: trainingBlock.effort,
    restTime: trainingBlock.restTime,
    progression: trainingBlock.progression,
    comments: trainingBlock.comments,
    blockId: trainingBlock.id,
  };
};
export const generateInitialProgression = (
  nOfWeeks: number,
  seriesN: number,
  repetitions: string,
  effort: number
) => {
  const progression: Progression[] = [];

  for (let i = 0; i < nOfWeeks; i++) {
    // Calculate progressive effort (increase by 5 each week)
    const currentEffort = Math.min(10, effort + i);

    // Handle progressive repetitions
    let currentReps = repetitions;
    if (repetitions.includes("-") || repetitions.includes("/")) {
      // Handle range format (e.g., "6-8" or "6/8")
      const separator = repetitions.includes("-") ? "-" : "/";
      const [start, end] = repetitions.split(separator).map(Number);
      const newStart = start + i * 2;
      const newEnd = end + i * 2;
      currentReps = `${newStart}${separator}${newEnd}`;
    } else {
      // Handle single number format
      const repNum = parseInt(repetitions);
      currentReps = (repNum + i * 2).toString();
    }

    progression.push({
      id: "",
      series: seriesN,
      repetitions: currentReps,
      effort: currentEffort,
      completed: false,
    });
  }

  return progression;
};

export const formatProgression = (progression: Progression[]) => {
  return progression.map((p) => {
    return {
      id: p.id,
      series: p.series.toString(),
      repetitions: p.repetitions,
      effort: p.effort.toString(),
    };
  });
};

export const initializeDisplayProgressionCollection = (
  trainingBlock: TrainingBlock
) => {
  return trainingBlock.selectedExercises.reduce((acc, exercise) => {
    acc[exercise.id] = formatProgression(exercise.progression);
    return acc;
  }, {} as DisplayProgressionCollection);
};

export const initializeDisplayProgressionForSelectedExercise = (
  selectedExercise: SelectedExercise
) => {
  return formatProgression(selectedExercise.progression);
};

export function isSameWeek(
  date1: string | Date,
  date2: string | Date
): boolean {
  // Parse dates as ISO strings to avoid timezone issues
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Get UTC date components to avoid timezone offset issues
  const startOfWeek1 = new Date(
    Date.UTC(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate())
  );
  const startOfWeek2 = new Date(
    Date.UTC(d2.getUTCFullYear(), d2.getUTCMonth(), d2.getUTCDate())
  );

  // Set both dates to the start of their respective weeks (Monday) in UTC
  startOfWeek1.setUTCDate(
    startOfWeek1.getUTCDate() - ((startOfWeek1.getUTCDay() + 6) % 7)
  );
  startOfWeek2.setUTCDate(
    startOfWeek2.getUTCDate() - ((startOfWeek2.getUTCDay() + 6) % 7)
  );

  // Compare the year and week number using UTC
  const year1 = startOfWeek1.getUTCFullYear();
  const year2 = startOfWeek2.getUTCFullYear();
  const week1 = getWeekNumberUTC(startOfWeek1);
  const week2 = getWeekNumberUTC(startOfWeek2);

  return year1 === year2 && week1 === week2;
}

// Helper function to get the week number using UTC to avoid timezone issues
function getWeekNumberUTC(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const days = Math.floor((date.valueOf() - start.valueOf()) / 86400000);
  return Math.ceil((days + start.getUTCDay() + 1) / 7);
}

export function formatIsoToSpanishDate(isoDate: string | Date): string {
  return new Date(isoDate)
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .slice(0, 2)
    .join("/");
}

export function spanishDateToIso(date: string): string {
  // Expects input as "DD/MM" or "DD/MM/YYYY"
  const parts = date.split("/");
  if (parts.length === 2) {
    // If year is missing, use current year
    const [day, month] = parts;
    const year = new Date().getFullYear();
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  } else if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  throw new Error("Invalid date format");
}

export function getFormattedDate(day: string, weekRange: string): string {
  const [startDate] = weekRange.split("-");
  const [startDay, startMonth, startYear] = startDate.trim().split("/");

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = weekDays.indexOf(day);

  const date = new Date(
    parseInt(startYear),
    parseInt(startMonth) - 1,
    parseInt(startDay)
  );
  date.setDate(date.getDate() + dayIndex);

  const formattedDay = date.getDate().toString().padStart(2, "0");
  const formattedMonth = (date.getMonth() + 1).toString().padStart(2, "0");

  return `${
    dayTranslations[day as keyof typeof dayTranslations]
  } ${formattedDay}/${formattedMonth}`;
}

export function countTotalExercises(session: Session): number {
  console.log("counting total exercises from session", session);
  let count = 0;
  session.exercises.forEach((exercise) => {
    if (exercise.type === "trainingBlock") {
      exercise.selectedExercises.forEach((selectedExercise) => {
        count +=
          getCurrentProgression(selectedExercise)?.series ||
          selectedExercise.series;
      });
    } else {
      count += getCurrentProgression(exercise)?.series || exercise.series;
    }
  });
  return count;
}

export function ratioToPercentage(ratio: string): number {
  const [firstNum, secondNum] = ratio.split("/");
  const firstNumNum = Number(firstNum);
  const secondNumNum = Number(secondNum);
  return (firstNumNum / secondNumNum) * 100;
}

/**
 * Safely gets a property value from an Athlete or Coach object
 * @param obj - The object to get the property from (can be null)
 * @param key - The property key to access
 * @returns The property value as a string, or empty string if not found
 */
export const getPropertyValue = (
  obj: Athlete | Coach | null,
  key: string
): string => {
  if (!obj) return "";

  // Type guard to check if the property exists on the object
  if (key in obj) {
    const value = (obj as any)[key];
    return String(value || "");
  }

  return "";
};

/**
 * Calculates age from a birth date
 * @param birthDate - The birth date as Date object or ISO string (e.g., "2025-07-21T00:00:00.000Z")
 * @returns The age in years, or 0 if invalid date or future date
 */
export const getAge = (birthDate: Date | string): number => {
  try {
    // Convert to Date object if it's a string
    const birth =
      typeof birthDate === "string" ? new Date(birthDate) : birthDate;

    // Check if the date is valid
    if (isNaN(birth.getTime())) {
      return 0;
    }

    const today = new Date();

    // Validate the date is not in the future
    if (birth > today) {
      return 0; // Return 0 instead of throwing error
    }

    // Calculate age
    let age = today.getFullYear() - birth.getFullYear();

    // Adjust age if birthday hasn't occurred this year
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return Math.max(0, age); // Ensure age is never negative
  } catch (error) {
    console.error("Error calculating age:", error);
    return 0;
  }
};

export const getCurrentDayName = (date?: Date): DayName => {
  const today = date || new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Map JavaScript's getDay() (0=Sunday, 1=Monday, etc.) to our DayName type
  const dayMap: DayName[] = [
    "sunday", // 0
    "monday", // 1
    "tuesday", // 2
    "wednesday", // 3
    "thursday", // 4
    "friday", // 5
    "saturday", // 6
  ];

  return dayMap[currentDay];
};

export const getCurrentWeekRange = (): string => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate Monday of current week
  const monday = new Date(today);
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1; // If Sunday, go back 6 days
  monday.setDate(today.getDate() - daysToMonday);

  // Calculate Sunday of current week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // Format dates as DD/M/YYYY
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return `${formatDate(monday)}-${formatDate(sunday)}`;
};

export const getCalendarDataFromTrainingPlan = (
  trainingPlan: PlanState,
  sessionPerformanceData: SessionPerformanceData[]
): CalendarData => {
  const { startDate, nOfWeeks } = calculateDateRange(
    trainingPlan,
    sessionPerformanceData
  );
  const weeks = generateWeeks(nOfWeeks, startDate);

  return populateCalendarWithSessions(
    weeks,
    trainingPlan.sessions,
    sessionPerformanceData
  );
};

// Extract date range calculation
const calculateDateRange = (
  trainingPlan: PlanState,
  sessionPerformanceData: SessionPerformanceData[]
) => {
  if (sessionPerformanceData.length === 0) {
    return {
      startDate: new Date(),
      nOfWeeks: trainingPlan.nOfWeeks,
    };
  }

  const dates = sessionPerformanceData.map((data) => new Date(data.week));
  const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const latestDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const weeksDiff =
    Math.ceil(
      (latestDate.getTime() - earliestDate.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    ) + 2;

  return { startDate: earliestDate, nOfWeeks: weeksDiff };
};

// Extract main population logic
const populateCalendarWithSessions = (
  weeks: CalendarData,
  sessions: Session[],
  sessionPerformanceData: SessionPerformanceData[]
): CalendarData => {
  // Pre-compute lookups to avoid repeated work
  const sessionIdToName = new Map(sessions.map((s) => [s.id, s.name]));
  const sessionIdToDays = new Map(sessions.map((s) => [s.id, s.days]));

  // Step 1: Pre-populate all scheduled days with their expected session names
  populateScheduledSessions(weeks, sessions);

  // Step 2: Process performance data and mark completed sessions
  Object.keys(weeks).forEach((weekKey) => {
    const weekStartDate = spanishDateToIso(weekKey.split("-")[0]);
    const weekPerformanceData = getPerformanceDataForWeek(
      weekStartDate,
      sessionPerformanceData
    );

    populateWeekWithSessions(
      weeks[weekKey],
      weekPerformanceData,
      sessionIdToName
    );
  });

  // Step 3: Handle alternative dates - clear sessionName from originally scheduled days
  handleAlternativeDates(weeks, sessionIdToDays);

  return weeks;
};

// Pre-populate all scheduled days with their expected session names and IDs
const populateScheduledSessions = (
  weeks: CalendarData,
  sessions: Session[]
): void => {
  Object.keys(weeks).forEach((weekKey) => {
    const weekData = weeks[weekKey];

    sessions.forEach((session) => {
      session.days.forEach((dayName) => {
        // Only set session data if the day doesn't already have a sessionId (not completed)
        const dayData = weekData[dayName];
        if (dayData && dayData.sessionId === "") {
          weekData[dayName] = {
            ...dayData,
            sessionId: session.id,
            sessionName: session.name,
          };
        }
      });
    });
  });
};

// Extract performance data grouping - simplified approach
const getPerformanceDataForWeek = (
  weekStartDate: string,
  sessionPerformanceData: SessionPerformanceData[]
): SessionPerformanceData[] => {
  return sessionPerformanceData.filter((data) =>
    isSameWeek(weekStartDate, data.week)
  );
};

// Extract week population logic
const populateWeekWithSessions = (
  weekData: CalendarData[string],
  performanceData: SessionPerformanceData[],
  sessionIdToName: Map<string, string>
): void => {
  performanceData.forEach((sessionData) => {
    const dayNameToUse = sessionData.alternativeDate
      ? getCurrentDayName(parseAlternativeDate(sessionData.alternativeDate))
      : sessionData.sessionDayName;

    weekData[dayNameToUse] = {
      ...sessionData,
      sessionName: sessionIdToName.get(sessionData.sessionId),
      completed: true,
    };
  });
};

// Extract alternative date parsing
const parseAlternativeDate = (alternativeDate: Date | string): Date => {
  if (typeof alternativeDate === "string") {
    const [year, month, day] = alternativeDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return alternativeDate;
};

// Extract alternative date handling
const handleAlternativeDates = (
  weeks: CalendarData,
  sessionIdToDays: Map<string, DayName[]>
): void => {
  Object.entries(weeks).forEach(([weekKey, weekData]) => {
    const alternativeDateSessions = Object.values(weekData).filter(
      (day: any) => day.alternativeDate && day.sessionId !== ""
    );

    alternativeDateSessions.forEach((altSession: any) => {
      const originalDayName = altSession.sessionDayName;
      const sessionDays = sessionIdToDays.get(altSession.sessionId) || [];

      if (sessionDays.includes(originalDayName)) {
        const originalDay = weekData[originalDayName as keyof typeof weekData];
        if (originalDay && !originalDay.completed) {
          weekData[originalDayName as keyof typeof weekData] = {
            ...originalDay,
            sessionName: "",
          };
        }
      }
    });
  });
};

export const spanishPositionalSuffixFactory = (
  number: number,
  gender: "male" | "female"
): string => {
  // Handle special cases for 1st
  if (number === 1) {
    return gender === "male" ? "1er" : "1era";
  }

  // Handle special cases for 2nd
  if (number === 2) {
    return gender === "male" ? "2do" : "2da";
  }

  // Handle special cases for 3rd
  if (number === 3) {
    return gender === "male" ? "3er" : "3era";
  }

  // For numbers 4 and above, use the standard pattern
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  // Special cases for numbers ending in 1, 2, 3 (but not 11, 12, 13)
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    // Numbers 11-13 use the standard suffix
    return gender === "male" ? `${number}º` : `${number}ª`;
  }

  if (lastDigit === 1) {
    return gender === "male" ? `${number}er` : `${number}era`;
  }

  if (lastDigit === 2) {
    return gender === "male" ? `${number}do` : `${number}da`;
  }

  if (lastDigit === 3) {
    return gender === "male" ? `${number}er` : `${number}era`;
  }

  // Default case for all other numbers
  return gender === "male" ? `${number}º` : `${number}ª`;
};

export const getExercisesArray = (
  exercises: (SelectedExercise | TrainingBlock)[]
): DisplaySelectedExercise[] => {
  const result: DisplaySelectedExercise[] = [];

  exercises.forEach((item) => {
    if (item.type === "selectedExercise") {
      // If it's a SelectedExercise, add it directly to the result
      result.push(item as DisplaySelectedExercise);
    } else if (item.type === "trainingBlock") {
      // If it's a TrainingBlock, add all its exercises with the blockId
      const trainingBlock = item as TrainingBlock;
      trainingBlock.selectedExercises.forEach((exercise) => {
        result.push({
          ...exercise,
          blockId: trainingBlock.id,
        });
      });
    }
  });

  return result;
};
export function calculatePercentageDifference(
  value1: number,
  value2: number,
  options: {
    precision?: number;
    positiveColor?: string;
    negativeColor?: string;
    zeroThreshold?: number;
  } = {}
): {
  content: string;
  icon: string;
  iconColor: string;
} {
  const {
    precision = 2,
    positiveColor = "#00A859",
    negativeColor = "#e81d23",
    zeroThreshold = 0,
  } = options;

  // Calculate percentage difference
  const percentageDiff = ((value2 - value1) / value1) * 100;
  const absPercentageDiff = Math.round(Math.abs(percentageDiff));

  // Return empty object if difference is below threshold
  if (absPercentageDiff <= zeroThreshold) {
    return {
      content: "",
      icon: "",
      iconColor: "",
    };
  }

  return {
    content: `${absPercentageDiff}%`,
    icon: percentageDiff > 0 ? "▲" : percentageDiff < 0 ? "▼" : "",
    iconColor:
      percentageDiff === 0
        ? ""
        : percentageDiff > 0
        ? positiveColor
        : negativeColor,
  };
}

export const getTestStatsSummary = (
  completedStudies: CompletedStudy[]
): TestValueHistory[] => {
  const statsSummary: TestValueHistory[] = [];

  // Filter and sort tests by type
  const cmjTests = completedStudies
    .filter((study) => study.results.type === "cmj")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const squatJumpTests = completedStudies
    .filter((study) => study.results.type === "squatJump")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const abalakovTests = completedStudies
    .filter((study) => study.results.type === "abalakov")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const boscoTests = completedStudies
    .filter((study) => study.results.type === "bosco")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const multipleDropJumpTests = completedStudies
    .filter((study) => study.results.type === "multipleDropJump")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const multipleJumpsTests = completedStudies
    .filter((study) => study.results.type === "multipleJumps")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Add height values for all test types with at least one test
  const testArrays = [
    { tests: cmjTests, type: "cmj" as StudyType },
    { tests: squatJumpTests, type: "squatJump" as StudyType },
    { tests: abalakovTests, type: "abalakov" as StudyType },
    { tests: multipleDropJumpTests, type: "multipleDropJump" as StudyType },
    { tests: multipleJumpsTests, type: "multipleJumps" as StudyType },
  ];

  testArrays.forEach(({ tests, type }) => {
    if (tests.length > 0) {
      const latestTest = tests[0];
      let currentValue: number;

      // Get the appropriate height value based on test type
      if (type === "multipleDropJump") {
        currentValue = (latestTest.results as MultipleDropJumpResult)
          .maxAvgHeightReached;
      } else {
        currentValue = (latestTest.results as BaseResult).avgHeightReached;
      }

      const testValueHistory: TestValueHistory = {
        testType: type,
        currentValue,
        currentValueDate: new Date(latestTest.date),
        valueType: "height",
      };

      // If there are more than one test, add past value comparison
      if (tests.length > 1) {
        const pastTest = tests[1];
        let pastValue: number;

        if (type === "multipleDropJump") {
          pastValue = (pastTest.results as MultipleDropJumpResult)
            .maxAvgHeightReached;
        } else {
          pastValue = (pastTest.results as BaseResult).avgHeightReached;
        }

        const difference = currentValue - pastValue;
        const percentageChange =
          pastValue !== 0 ? (difference / pastValue) * 100 : 0;

        testValueHistory.pastValue = pastValue;
        testValueHistory.pastValueDate = new Date(pastTest.date);
        testValueHistory.difference = difference;
        testValueHistory.percentageChange = percentageChange;
      }

      statsSummary.push(testValueHistory);
    }
  });

  // Add RSI values for multipleJumps tests
  if (multipleJumpsTests.length > 0) {
    const latestTest = multipleJumpsTests[0];
    const currentValue = (latestTest.results as MultipleJumpsResult)
      .avgStiffness;

    const rsiValueHistory: TestValueHistory = {
      testType: "multipleJumps",
      currentValue,
      currentValueDate: new Date(latestTest.date),
      valueType: "RSI",
    };

    // If there are more than one test, add past value comparison
    if (multipleJumpsTests.length > 1) {
      const pastTest = multipleJumpsTests[1];
      const pastValue = (pastTest.results as MultipleJumpsResult).avgStiffness;

      const difference = currentValue - pastValue;
      const percentageChange =
        pastValue !== 0 ? (difference / pastValue) * 100 : 0;

      rsiValueHistory.pastValue = pastValue;
      rsiValueHistory.pastValueDate = new Date(pastTest.date);
      rsiValueHistory.difference = difference;
      rsiValueHistory.percentageChange = percentageChange;
    }

    statsSummary.push(rsiValueHistory);
  }

  // Add ECR values for same-day CMJ and SquatJump pairs
  const sameDayPairs: Array<{
    cmj: CompletedStudy;
    squatJump: CompletedStudy;
    date: Date;
  }> = [];

  // Find same-day pairs
  cmjTests.forEach((cmjTest) => {
    const cmjDate = new Date(cmjTest.date);
    const sameDaySquatJump = squatJumpTests.find((sjTest) => {
      const sjDate = new Date(sjTest.date);
      return cmjDate.toDateString() === sjDate.toDateString();
    });

    if (sameDaySquatJump) {
      sameDayPairs.push({
        cmj: cmjTest,
        squatJump: sameDaySquatJump,
        date: cmjDate,
      });
    }
  });

  // Sort pairs by date (newest first)
  sameDayPairs.sort((a, b) => b.date.getTime() - a.date.getTime());

  if (sameDayPairs.length > 0) {
    const latestPair = sameDayPairs[0];
    const cmjValue = (latestPair.cmj.results as CMJResult).avgHeightReached;
    const squatJumpValue = (latestPair.squatJump.results as SquatJumpResult)
      .avgHeightReached;
    const ecrValue = (1 - squatJumpValue / cmjValue) * 100;

    const ecrValueHistory: TestValueHistory = {
      testType: "cmj", // Using cmj as the primary test type for ECR
      currentValue: ecrValue,
      currentValueDate: latestPair.date,
      valueType: "ECR",
    };

    // If there are more than one pair, add past value comparison
    if (sameDayPairs.length > 1) {
      const pastPair = sameDayPairs[1];
      const pastCmjValue = (pastPair.cmj.results as CMJResult).avgHeightReached;
      const pastSquatJumpValue = (pastPair.squatJump.results as SquatJumpResult)
        .avgHeightReached;
      const pastEcrValue = (1 - pastSquatJumpValue / pastCmjValue) * 100;

      const difference = ecrValue - pastEcrValue;
      const percentageChange =
        pastEcrValue !== 0 ? (difference / pastEcrValue) * 100 : 0;

      ecrValueHistory.pastValue = pastEcrValue;
      ecrValueHistory.pastValueDate = pastPair.date;
      ecrValueHistory.difference = difference;
      ecrValueHistory.percentageChange = percentageChange;
    }

    statsSummary.push(ecrValueHistory);
  }

  return statsSummary;
};

/**
 * Smoothens a curve by adding intermediate points if the array has fewer than 5 elements
 * @param data - Array of numeric values to smoothen
 * @returns Array with at least 5 points, with intermediate values interpolated
 */
export const smoothenCurve = (data: number[]): number[] => {
  if (!data || data.length === 0) {
    return [5, 5, 5, 5, 5];
  }

  if (data.length === 1) {
    return Array(5).fill(data[0]);
  }

  if (data.length >= 5) {
    return data;
  }

  // For arrays with 2-4 elements, add intermediate points
  const result = [...data];

  while (result.length < 5) {
    for (let i = 0; i < result.length - 1 && result.length < 5; i++) {
      const current = result[i];
      const next = result[i + 1];
      const interpolated = (current + next) / 2;
      result.splice(i + 1, 0, interpolated);
    }
    // If still not enough points, repeat the last value
    while (result.length < 5) {
      result.push(result[result.length - 1]);
    }
  }

  return result.slice(0, 5);
};

/**
 * Organizes completed studies by study type and sorts them by date (closest to today first)
 * @param completedStudies - Array of completed studies
 * @returns Array of objects with key (studyType) and data (CompletedStudy[]) properties
 */
export const getTestsForAthlete = (
  completedStudies: CompletedStudy[]
): Array<{ key: StudyType; data: CompletedStudy[] }> => {
  const result: Record<Exclude<StudyType, "bosco">, CompletedStudy[]> = {
    cmj: [],
    squatJump: [],
    abalakov: [],
    multipleDropJump: [],
    multipleJumps: [],
    custom: [],
  };

  // Group studies by type
  completedStudies.forEach((study) => {
    const studyType = study.results.type;
    if (studyType === "bosco") return;
    if (studyType in result) {
      result[studyType as Exclude<StudyType, "bosco">].push(study);
    }
  });
  // Sort each array by date (closest to today first)
  Object.keys(result).forEach((key) => {
    const studyType = key as Exclude<StudyType, "bosco">;
    result[studyType].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      const today = new Date().getTime();

      // Calculate distance from today (absolute value)
      const distanceA = Math.abs(dateA - today);
      const distanceB = Math.abs(dateB - today);

      return distanceA - distanceB;
    });
  });

  // Convert to array of objects with key and data properties, filtering out empty arrays
  return Object.entries(result)
    .filter(([_, data]) => data.length > 0)
    .map(([key, data]) => ({
      key: key as StudyType,
      data,
    }));
};

export const getCurrentProgression = (
  currentExercise: DisplaySelectedExercise | null
): Progression | null => {
  if (
    !currentExercise ||
    !currentExercise.progression ||
    currentExercise.progression.length === 0
  )
    return null;

  const currentProgressionIndex = currentExercise.progression.findLastIndex(
    (progression) => progression.completed
  );

  if (currentProgressionIndex === -1) return currentExercise.progression[0];
  const nextProgressionIndex = currentProgressionIndex + 1;
  if (nextProgressionIndex < currentExercise.progression.length) {
    return currentExercise.progression[nextProgressionIndex];
  }
  return currentExercise.progression[currentProgressionIndex];
};

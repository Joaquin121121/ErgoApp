import React, { createContext, useContext, useState, useEffect } from "react";
import { CalendarData } from "../scripts/calendarData";
import { useUser } from "./UserContext";
import { Athlete } from "../types/Athletes";
import { getCalendarDataFromTrainingPlan } from "../utils/utils";

interface CalendarContextType {
  calendarData: CalendarData | null;
  setCalendarData: React.Dispatch<React.SetStateAction<CalendarData | null>>;
  loading: boolean;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(false);
  const { userData } = useUser();
  const athleteData = userData as Athlete;

  useEffect(() => {
    if (
      !athleteData ||
      !athleteData.currentTrainingPlan ||
      !athleteData.sessionPerformanceData
    ) {
      setCalendarData(null);
      return;
    }

    setLoading(true);

    try {
      const data = getCalendarDataFromTrainingPlan(
        athleteData.currentTrainingPlan,
        athleteData.sessionPerformanceData
      );
      console.log("data", data);
      setCalendarData(data);
    } catch (error) {
      console.error("Error generating calendar data:", error);
      setCalendarData(null);
    } finally {
      setLoading(false);
    }
  }, [athleteData]);

  return (
    <CalendarContext.Provider
      value={{
        calendarData,
        setCalendarData,
        loading,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): CalendarContextType {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}

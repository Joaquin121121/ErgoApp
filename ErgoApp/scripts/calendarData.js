export const dayTranslations = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
};

// Helper function to generate dates for 8 weeks
const generateWeeks = () => {
  const weeks = {};
  const activities = ["Yoga", "HIIT", "Musculación"];
  const times = ["09:00", "10:00", "11:00"];

  // Start from the first date in original data
  let currentDate = new Date(2024, 9, 16); // Month is 0-based, so 9 is October

  for (let week = 0; week < 8; week++) {
    const startDate = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/2024`;

    // Calculate end date (5 days later)
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 5);
    const endDateStr = `${endDate.getDate()}/${endDate.getMonth() + 1}/2024`;

    const weekKey = `${startDate}-${endDateStr}`;
    weeks[weekKey] = {
      Monday: {
        scheduledActivities: [
          {
            name: activities[week % 3],
            time: times[week % 3],
          },
        ],
        scheduledStudies: [],
      },
      Tuesday: {
        scheduledActivities: [
          {
            name: activities[(week + 1) % 3],
            time: times[(week + 1) % 3],
          },
        ],
        scheduledStudies: [],
      },
      Wednesday: {
        scheduledActivities: [
          {
            name: activities[(week + 2) % 3],
            time: times[(week + 2) % 3],
          },
        ],
        scheduledStudies: [],
      },
      Thursday: {
        scheduledActivities: [
          {
            name: activities[week % 3],
            time: times[week % 3],
          },
        ],
        scheduledStudies: [],
      },
      Friday: {
        scheduledActivities: [
          {
            name: activities[(week + 1) % 3],
            time: times[(week + 1) % 3],
          },
        ],
        scheduledStudies: [],
      },
      Saturday: {
        scheduledActivities: [
          {
            name: activities[(week + 2) % 3],
            time: times[(week + 2) % 3],
          },
        ],
        scheduledStudies: [],
      },
    };

    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeks;
};

export const calendarData = generateWeeks();

export const dayTranslations = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
};

export const inverseDayTranslations = {
  Lunes: "Monday",
  Martes: "Tuesday",
  Miércoles: "Wednesday",
  Jueves: "Thursday",
  Viernes: "Friday",
  Sábado: "Saturday",
};

// Helper function to generate dates for 8 weeks
const generateWeeks = () => {
  const weeks = {};
  const activities = ["Yoga", "HIIT", "Musculación"];
  const times = ["09:00", "10:00", "11:00"];
  const durations = ["01:00", "00:45", "01:30"];
  const places = ["Sala Principal", "Gimnasio Central", "Sala de Pesas"];

  // Study session data
  const studySession = {
    name: "Antropometría",
    time: "14:00",
    place: "Consultorio Médico",
    athletes: [
      "Juan Pérez",
      "María García",
      "Carlos Rodríguez",
      "Ana Martínez",
    ],
  };

  // Start from October 16, 2024
  let currentDate = new Date(2024, 9, 16);

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
            duration: durations[week % 3],
            attendance: Math.floor(Math.random() * 6) + 15, // Random attendance between 15-20
            place: places[week % 3],
          },
        ],
        scheduledStudies: week % 4 === 0 ? [studySession] : [], // Add study session every 4th week
      },
      Tuesday: {
        scheduledActivities: [
          {
            name: activities[(week + 1) % 3],
            time: times[(week + 1) % 3],
            duration: durations[(week + 1) % 3],
            attendance: Math.floor(Math.random() * 6) + 15,
            place: places[(week + 1) % 3],
          },
        ],
        scheduledStudies: [],
      },
      Wednesday: {
        scheduledActivities: [
          {
            name: activities[(week + 2) % 3],
            time: times[(week + 2) % 3],
            duration: durations[(week + 2) % 3],
            attendance: Math.floor(Math.random() * 6) + 15,
            place: places[(week + 2) % 3],
          },
        ],
        scheduledStudies: [],
      },
      Thursday: {
        scheduledActivities: [
          {
            name: activities[week % 3],
            time: times[week % 3],
            duration: durations[week % 3],
            attendance: Math.floor(Math.random() * 6) + 15,
            place: places[week % 3],
          },
        ],
        scheduledStudies: [],
      },
      Friday: {
        scheduledActivities: [
          {
            name: activities[(week + 1) % 3],
            time: times[(week + 1) % 3],
            duration: durations[(week + 1) % 3],
            attendance: Math.floor(Math.random() * 6) + 15,
            place: places[(week + 1) % 3],
          },
        ],
        scheduledStudies: [],
      },
      Saturday: {
        scheduledActivities: [
          {
            name: activities[(week + 2) % 3],
            time: times[(week + 2) % 3],
            duration: durations[(week + 2) % 3],
            attendance: Math.floor(Math.random() * 6) + 15,
            place: places[(week + 2) % 3],
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

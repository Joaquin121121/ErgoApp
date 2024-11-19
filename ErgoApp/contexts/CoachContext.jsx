import { createContext, useState, useEffect } from "react";

const CoachContext = createContext();

export function CoachProvider({ children }) {
  const [coachInfo, setCoachInfo] = useState({
    name: "",
    classes: [],
    athletes: [
      {
        name: "Joaquín Berrini",
        age: 28,
        sport: "Football",
        category: "Amateur",
        character: "Roger",
      },
      {
        name: "Maria Garcia",
        age: 24,
        sport: "Basketball",
        category: "Semi-Pro",
        character: "Emily",
      },
      {
        name: "John Smith",
        age: 19,
        sport: "Soccer",
        category: "Amateur",
        character: "Luke",
      },
      {
        name: "Sarah Wilson",
        age: 22,
        sport: "Tennis",
        category: "Professional",
        character: "Sophie",
      },
      {
        name: "David Lee",
        age: 25,
        sport: "Swimming",
        category: "Amateur",
        character: "Roger",
      },
      {
        name: "Ana Martinez",
        age: 21,
        sport: "Volleyball",
        category: "Semi-Pro",
        character: "Emily",
      },
      {
        name: "James Brown",
        age: 27,
        sport: "Rugby",
        category: "Amateur",
        character: "Luke",
      },
      {
        name: "Emma Davis",
        age: 23,
        sport: "Athletics",
        category: "Professional",
        character: "Sophie",
      },
      {
        name: "Lucas Wang",
        age: 20,
        sport: "Baseball",
        category: "Amateur",
        character: "Roger",
      },
      {
        name: "Sofia Costa",
        age: 26,
        sport: "Hockey",
        category: "Semi-Pro",
        character: "Emily",
      },
    ],
    notifications: [],
  });

  useEffect(() => {
    console.log(coachInfo);
  }, [coachInfo]);

  return (
    <CoachContext.Provider value={{ coachInfo, setCoachInfo }}>
      {children}
    </CoachContext.Provider>
  );
}

export default CoachContext;

import { createContext, useState, useEffect } from "react";

const ClassContext = createContext();

export function ClassProvider({ children }) {
  const [classInfo, setClassInfo] = useState({
    name: "",
    time: [],
    duration: "",
    attendance: 0,
    relativeAttendance: "",
    place: "",
    difficulty: "",
    description: "",
  });

  useEffect(() => {
    console.log(classInfo);
  }, [classInfo]);

  return (
    <ClassContext.Provider value={{ classInfo, setClassInfo }}>
      {children}
    </ClassContext.Provider>
  );
}

export default ClassContext;

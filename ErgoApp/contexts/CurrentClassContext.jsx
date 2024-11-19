import { createContext, useState, useEffect } from "react";

const CurrentClassContext = createContext();

export function CurrentClassProvider({ children }) {
  const [initialExercises, setInitialExercises] = useState([
    {
      key: "0",
      name: "Press de Banca",
      instructions: [
        "6-8 repeticiones",
        "3 sets",
        "20kg por lado",
        "cerca del fallo muscular",
      ],
      categories: {
        reps: "6-8",
        sets: "3",
        weight: "20",
      },
    },
    {
      key: "1",
      name: "Sentadillas",
      instructions: [
        "8-10 repeticiones",
        "4 sets",
        "25kg por lado",
        "profundidad paralela",
      ],
      categories: {
        reps: "8-10",
        sets: "4",
        weight: "25",
      },
    },
    {
      key: "2",
      name: "Peso Muerto",
      instructions: [
        "5-6 repeticiones",
        "3 sets",
        "30kg por lado",
        "mantener espalda recta",
      ],
      categories: {
        reps: "5-6",
        sets: "3",
        weight: "30",
      },
    },
    {
      key: "3",
      name: "Remo con Barra",
      instructions: [
        "8-12 repeticiones",
        "3 sets",
        "15kg por lado",
        "codos cerca del cuerpo",
      ],
      categories: {
        reps: "8-12",
        sets: "3",
        weight: "15",
      },
    },
    {
      key: "4",
      name: "Press Militar",
      instructions: [
        "6-8 repeticiones",
        "4 sets",
        "15kg por lado",
        "control en el movimiento",
      ],
      categories: {
        reps: "6-8",
        sets: "4",
        weight: "15",
      },
    },
    {
      key: "5",
      name: "Dominadas",
      instructions: [
        "6-10 repeticiones",
        "3 sets",
        "peso corporal",
        "hasta mentón sobre barra",
      ],
      categories: {
        reps: "6-10",
        sets: "3",
        weight: "0",
      },
    },
    {
      key: "6",
      name: "Fondos en Paralelas",
      instructions: [
        "8-12 repeticiones",
        "3 sets",
        "peso corporal",
        "90 grados de flexión",
      ],
      categories: {
        reps: "8-12",
        sets: "3",
        weight: "0",
      },
    },
  ]);
  const [exercises, setExercises] = useState(initialExercises);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [skippedExercises, setSkippedExercises] = useState([]);

  const reset = () => {
    setExercises(initialExercises);
    setActiveIndex(0);
    setCompletedExercises([]);
    setSkippedExercises([]);
  };

  return (
    <CurrentClassContext.Provider
      value={{
        initialExercises,
        setInitialExercises,
        exercises,
        setExercises,
        activeIndex,
        setActiveIndex,
        completedExercises,
        setCompletedExercises,
        skippedExercises,
        setSkippedExercises,
        reset,
      }}
    >
      {children}
    </CurrentClassContext.Provider>
  );
}

export default CurrentClassContext;

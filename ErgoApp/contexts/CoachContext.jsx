import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        feelings: {
          feeding: 3,
          sleep: 4,
          fatigue: 2,
        },
        trainingSolutions: {
          target: [
            "Mejorar la resistencia cardiovascular",
            "Mantener un alto rendimiento durante todo el partido",
          ],
          additionals: [
            "Incorporar ejercicios de agilidad con cambios rápidos de dirección",
            "Realizar entrenamiento de fuerza específico para prevenir lesiones",
          ],
        },
      },
      {
        name: "Maria Garcia",
        age: 24,
        sport: "Basketball",
        category: "Semi-Pro",
        character: "Emily",
        feelings: {
          feeding: 4,
          sleep: 3,
          fatigue: 3,
        },
        trainingSolutions: {
          target: ["Desarrollar explosividad", "Potencia en saltos verticales"],
          additionals: [
            "Implementar ejercicios de tiro bajo presión",
            "Trabajar en ejercicios de manejo de balón avanzados",
          ],
        },
      },
      {
        name: "John Smith",
        age: 19,
        sport: "Soccer",
        category: "Amateur",
        character: "Luke",
        feelings: {
          feeding: 5,
          sleep: 4,
          fatigue: 2,
        },
        trainingSolutions: {
          target: [
            "Mejorar la técnica de control de balón",
            "Perfeccionar pases precisos",
          ],
          additionals: [
            "Realizar ejercicios de coordinación con balón",
            "Incorporar entrenamiento de velocidad con sprints cortos",
          ],
        },
      },
      {
        name: "Sarah Wilson",
        age: 22,
        sport: "Tennis",
        category: "Professional",
        character: "Sophie",
        feelings: {
          feeding: 4,
          sleep: 5,
          fatigue: 1,
        },
        trainingSolutions: {
          target: [
            "Optimizar la potencia",
            "Mejorar precisión en los servicios",
          ],
          additionals: [
            "Practicar movimientos laterales rápidos en la cancha",
            "Fortalecer los músculos del core para mejor estabilidad",
          ],
        },
      },
      {
        name: "David Lee",
        age: 25,
        sport: "Swimming",
        category: "Amateur",
        character: "Roger",
        feelings: {
          feeding: 3,
          sleep: 3,
          fatigue: 4,
        },
        trainingSolutions: {
          target: [
            "Mejorar la técnica de respiración",
            "Aumentar eficiencia en el agua",
          ],
          additionals: [
            "Realizar ejercicios de resistencia fuera del agua",
            "Practicar ejercicios de flexibilidad para hombros",
          ],
        },
      },
      {
        name: "Ana Martinez",
        age: 21,
        sport: "Volleyball",
        category: "Semi-Pro",
        character: "Emily",
        feelings: {
          feeding: 5,
          sleep: 4,
          fatigue: 2,
        },
        trainingSolutions: {
          target: [
            "Aumentar la altura del salto vertical",
            "Lograr remates más efectivos",
          ],
          additionals: [
            "Mejorar la coordinación mano-ojo para recepción",
            "Fortalecer los músculos de las piernas para mejor impulso",
          ],
        },
      },
      {
        name: "James Brown",
        age: 27,
        sport: "Rugby",
        category: "Amateur",
        character: "Luke",
        feelings: {
          feeding: 4,
          sleep: 3,
          fatigue: 3,
        },
        trainingSolutions: {
          target: ["Desarrollar fuerza física", "Lograr tackles más efectivos"],
          additionals: [
            "Mejorar la velocidad en sprints cortos",
            "Practicar ejercicios de agilidad con cambios de dirección",
          ],
        },
      },
      {
        name: "Emma Davis",
        age: 23,
        sport: "Athletics",
        category: "Professional",
        character: "Sophie",
        feelings: {
          feeding: 5,
          sleep: 5,
          fatigue: 1,
        },
        trainingSolutions: {
          target: [
            "Optimizar la técnica de carrera",
            "Alcanzar máxima eficiencia",
          ],
          additionals: [
            "Implementar entrenamiento de fuerza específico",
            "Realizar ejercicios de flexibilidad avanzados",
          ],
        },
      },
      {
        name: "Lucas Wang",
        age: 20,
        sport: "Baseball",
        category: "Amateur",
        character: "Roger",
        feelings: {
          feeding: 3,
          sleep: 4,
          fatigue: 3,
        },
        trainingSolutions: {
          target: [
            "Mejorar la precisión",
            "Aumentar velocidad en los lanzamientos",
          ],
          additionals: [
            "Fortalecer los músculos del brazo y hombro",
            "Practicar ejercicios de coordinación ojo-mano",
          ],
        },
      },
      {
        name: "Sofia Costa",
        age: 26,
        sport: "Hockey",
        category: "Semi-Pro",
        character: "Emily",
        feelings: {
          feeding: 4,
          sleep: 4,
          fatigue: 2,
        },
        trainingSolutions: {
          target: [
            "Desarrollar mejor control del stick",
            "Mejorar precisión en los tiros",
          ],
          additionals: [
            "Mejorar la velocidad de patinaje y giros",
            "Realizar ejercicios de resistencia específicos",
          ],
        },
      },
    ],
    notifications: [],
  });

  const [selectedAthlete, setSelectedAthlete] = useState("");

  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const persistedCoachInfo = await AsyncStorage.getItem("coachInfo");
        const persistedSelectedAthlete = await AsyncStorage.getItem(
          "selectedAthlete"
        );

        if (persistedCoachInfo) {
          setCoachInfo(JSON.parse(persistedCoachInfo));
        }
        if (persistedSelectedAthlete) {
          setSelectedAthlete(persistedSelectedAthlete);
        }
      } catch (error) {
        console.error("Error loading persisted data:", error);
      }
    };

    loadPersistedData();
  }, []);

  useEffect(() => {
    const persistData = async () => {
      try {
        await AsyncStorage.setItem("coachInfo", JSON.stringify(coachInfo));
      } catch (error) {
        console.error("Error persisting coachInfo:", error);
      }
    };

    persistData();
  }, [coachInfo]);

  useEffect(() => {
    const persistSelectedAthlete = async () => {
      try {
        await AsyncStorage.setItem("selectedAthlete", selectedAthlete);
      } catch (error) {
        console.error("Error persisting selectedAthlete:", error);
      }
    };

    persistSelectedAthlete();
  }, [selectedAthlete]);

  return (
    <CoachContext.Provider
      value={{
        coachInfo,
        setCoachInfo,
        selectedAthlete,
        setSelectedAthlete,
      }}
    >
      {children}
    </CoachContext.Provider>
  );
}

export default CoachContext;

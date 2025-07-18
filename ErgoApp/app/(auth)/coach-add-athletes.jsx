import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";

import React, { useState, useEffect, useContext } from "react";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon";
import icons from "../../scripts/icons";
import TonalButton from "../../components/TonalButton";
import { router } from "expo-router";

const CoachAddAthletes = () => {
  const { coachInfo, setCoachInfo } = useContext(CoachContext);

  const [search, setSearch] = useState("");
  const [searchArray, setSearchArray] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);

  const athletes = [
    {
      uid: "FvXhb7WwHzbfkVQBCKG4nG9xAPy1",
      name: "Joaquín Del Río",
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
      uid: "a1",
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
      uid: "a2",
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
      uid: "a3",
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
      uid: "a4",
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
        target: ["Optimizar la potencia", "Mejorar precisión en los servicios"],
        additionals: [
          "Practicar movimientos laterales rápidos en la cancha",
          "Fortalecer los músculos del core para mejor estabilidad",
        ],
      },
    },
    {
      uid: "a5",
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
      uid: "a6",
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
      uid: "a7",
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
      uid: "a8",
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
      uid: "a9",
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
      uid: "a10",
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
  ];

  const onPress = (athlete) => {
    if (selectedAthletes.includes(athlete.name)) {
      setSelectedAthletes(selectedAthletes.filter((e) => e !== athlete.name));
    } else {
      setSelectedAthletes([...selectedAthletes, athlete.name]);
    }
  };

  const onSave = () => {
    const athletesToAdd = selectedAthletes
      .map((athlete) => athletes.find((e) => e.name === athlete))
      .filter((athlete) => athlete !== undefined);
    setCoachInfo({ ...coachInfo, athletes: athletesToAdd });
    console.log(athletesToAdd);
    router.push("/coachHome");
  };

  useEffect(() => {
    setSearchArray(
      athletes.filter((athlete) =>
        athlete.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    console.log(selectedAthletes);
  }, [selectedAthletes]);

  return (
    <>
      <ScrollView>
        <View className="mt-20">
          <Text className="font-pregular text-h3 self-center">
            Seleccionar Atletas
          </Text>
          <FormField
            placeholder="Buscar atleta..."
            value={search}
            handleChangeText={(e) => setSearch(e)}
            otherStyles="self-center  w-[90vw] mb-4"
            icon="search"
          />

          {searchArray.map((e) => (
            <TouchableOpacity key={e.uid} onPress={() => onPress(e)}>
              <View
                className={
                  selectedAthletes.includes(e.name)
                    ? "self-center mb-4 bg-white w-[85vw] rounded-2xl shadow-sm h-40 border border-secondary"
                    : "self-center mb-4 bg-white w-[85vw] rounded-2xl shadow-sm h-40"
                }
              >
                <Text className="font-pregular text-h3 self-center mt-2 mb-4">
                  {e.name}
                </Text>
                <View className="flex flex-1 flex-row justify-evenly items-start mb-4">
                  <View className="flex items-center overflow-hidden justify-center h-20 w-20 rounded-full">
                    <Icon icon={e.character} size={80} style="mt-4" />
                  </View>
                  <View>
                    <Text className="font-pregular text-sm text-darkGray mb-2">
                      - {e.age} años
                    </Text>
                    <Text className="font-pregular text-sm text-darkGray mb-2">
                      - {e.sport}
                    </Text>
                    <Text className="font-pregular text-sm text-darkGray mb-2">
                      - {e.category}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TonalButton
        title="Guardar"
        onPress={onSave}
        icon="checkWhite"
        containerStyles="absolute bottom-8 left-24"
      />
    </>
  );
};

export default CoachAddAthletes;

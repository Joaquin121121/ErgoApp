export const categories = {
  sports: [
    "Salud/Estética",
    "Fútbol",
    "Tenis",
    "Rugby",
    "Básquet",
    "Vóley",
    "Running",
    "Ciclismo Ruta",
    "Mountain Bike",
    "Natación",
    "Atletismo Velocidad",
    "Artes Marciales",
    "Atletismo Lanzamientos",
    "Fisicoculturismo",
    "Gimnasia Deportiva",
    "Hándbol",
    "Judo",
    "Patín Artístico",
    "Patín Carrera",
    "Hockey",
    "Snowboard",
    "Béisbol",
    "Tenis de Mesa",
    "Golf",
    "Surf",
    "Squash",
    "Pádel",
    "Softball",
    "Atletismo Salto",
  ],
  competitionLevels: ["Internacional", "Nacional", "Regional", "Local", "Otro"],
  trainingTargets: [
    "Disminución de grasa",
    "Incremento de masa muscular",
    "Mejora de resistencia general",
    "Mejora de fuerza",
    "Mejora de velocidad",
    "Mejora de capacidad de salto",
    "Resistencia específica deporte",
  ],
  /* When updating stuides don´t forget to update components */
  studies: [
    {
      name: "Screening",
      duration: "15 minutos",
      equipment: "Sin Equipamiento",
      value: "screening",
      focus: "Patrones Motores",
      characteristics: {
        /* Nombre y descripción, key corresponde a nombre de ícono */
        lightbulb: ["Foco", "Evaluación de patrones motores"],
        search: ["Analiza", "Cómo se produce la fuerza"],
        tools: ["Equipamiento", "Sin necesidad de equipamiento"],
      },
      description:
        "El Screening es una evaluación de patrones motores que permite identificar desbalances musculares y disfunciones en la postura. Es una herramienta fundamental para prevenir lesiones y mejorar el rendimiento deportivo.",
      movements: [
        {
          name: "Flexión de Brazos",
          parameters: [
            {
              character: "good",
              description: "Cabeza centrada y estable",
            },
            {
              character: "good",
              description: "Hombros hacia abajo lejos de las orejas",
            },
            {
              character: "good",
              description: "Codos en diagonal hacia atrás",
            },
            {
              character: "good",
              description: "Espalda baja y caderas en una posición neutral",
            },
            {
              character: "good",
              description:
                "Piernas alineadas con las caderas y se mantienen estables",
            },
          ],
        },
        {
          name: "Sentadillas",
          parameters: [
            {
              character: "bad",
              description: "Hiper extensión dorsal",
            },
            {
              character: "bad",
              description: "Hiper extensión Lumbar",
            },
            {
              character: "good",
              description:
                "Llega al menos a colocar los muslos paralelos al piso",
            },
            {
              character: "bad",
              description: "Valgo de Rodillas",
            },
            {
              character: "good",
              description: "Alineación de Cabeza y parte dorsal del tronco",
            },
          ],
        },
        {
          name: "Estocada con Rotación",
          parameters: [
            {
              character: "good",
              description: "Alineación de las caderas",
            },
            {
              character: "good",
              description: "Rotación de la cintura escapular",
            },
            {
              character: "bad",
              description:
                "Valgo de rodilla en el momento de aplicación de fuerza",
            },
            {
              character: "good",
              description: "Activación de zona media y no rotación lumbar",
            },
            {
              character: "good",
              description: "Alineación de rodillas y pies",
            },
          ],
        },
        {
          name: "Sentadilla a 1 pierna",
          parameters: [
            {
              character: "good",
              description: "Puede levantarse a 1 pierna desde el banco",
            },
            {
              character: "good",
              description: "Hombros y caderas están alineadas",
            },
            {
              character: "good",
              description: "Codos pegados al cuerpo",
            },
            {
              character: "good",
              description: "Espalda baja y caderas en una posición neutral",
            },
            {
              character: "good",
              description:
                "Piernas alineadas con las caderas y se mantienen estables",
            },
          ],
        },
        {
          name: "Sentadilla de Arranque",
          parameters: [
            {
              character: "good",
              description: "Brazos extendidos",
            },
            {
              character: "good",
              description: "Bastón sobre la cabeza todo el recorrido",
            },
            {
              character: "bad",
              description: "Valgo de rodilla",
            },
            {
              character: "bad",
              description: "Se elevan los talones",
            },
            {
              character: "good",
              description: "Llega hasta colocar los muslos paralelos al piso",
            },
          ],
        },
        {
          name: "Puente Frontal",
          parameters: [
            {
              character: "good",
              description: "Puede realizar respitación diafragmática",
            },
            {
              character: "good",
              description: "Bracing Abdominal",
            },
            {
              character: "good",
              description: "Activación de Transverso abdominal",
            },
            {
              character: "good",
              description: "Pies, rodillas, caderas y hombros alineados",
            },
            {
              character: "good",
              description: "Espalda recta y en posición neutra",
            },
            {
              character: "good",
              description: "Cabeza en posición neutra",
            },
          ],
        },
        {
          name: "Press Postural",
          parameters: [
            {
              character: "good",
              description: "Zona Lumbar neutra",
            },
            {
              character: "good",
              description: "Bracing Abdominal",
            },
            {
              character: "good",
              description: "Zona dorsal con escápulas apoyadas contra la pared",
            },
            {
              character: "good",
              description:
                "Llega a la extensión completa de miembros inferiores",
            },
            {
              character: "bad",
              description: "Los brazos se separan de la pared",
            },
          ],
        },
      ],
    },
    {
      name: "Antropometría",
      value: "antropometry",
      equipment: "Especializado",
      duration: "20 minutos",
      focus: "Composición Corporal",
    },
  ],
  genders: ["Masculino", "Femenino", "Otro"],
};

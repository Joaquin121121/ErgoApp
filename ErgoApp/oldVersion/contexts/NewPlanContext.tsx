import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  Progression,
  VolumeReduction,
  EffortReduction,
  TrainingBlock,
  Session,
  PlanState,
  NewPlanContextType,
  SelectedExercise,
  defaultTrainingBlock,
  defaultPlanState,
  Exercise,
  TrainingModel,
} from "../types/trainingPlan";
import { v4 as uuidv4 } from "uuid";
import {
  addTrainingPlan,
  addTrainingModel,
  addSelectedExercise,
  updateTrainingPlan,
  updateTrainingModel,
  addSession as parserAddSession,
  updateSession as parserUpdateSession,
  deleteSession as parserDeleteSession,
  addTrainingBlock as parserAddTrainingBlock,
  updateTrainingBlock as parserUpdateTrainingBlock,
  deleteTrainingBlock as parserDeleteTrainingBlock,
  deleteSelectedExercise as parserDeleteSelectedExercise,
  updateProgression as parserUpdateProgression,
  deleteTrainingModel as parserDeleteTrainingModel,
  updateSelectedExercise as parserUpdateSelectedExercise,
  moveExerciseToIndex as parserMoveExerciseToIndex,
  moveExerciseToIndexWithinBlock as parserMoveExerciseToIndexWithinBlock,
} from "../parsers/trainingDataParser";
import { useUser } from "./UserContext";
import { useDatabaseSync } from "../hooks/useDatabaseSync";
import Database from "@tauri-apps/plugin-sql";
import { useTrainingModels } from "./TrainingModelsContext";
import { useStudyContext } from "./StudyContext";
import { useAthletes } from "./AthletesContext";
import { useSyncContext } from "./SyncContext";

// Create context
const NewPlanContext = createContext<NewPlanContextType | undefined>(undefined);

export const NewPlanProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const { fullScaleSync, syncPendingRecords, pushRecord } = useDatabaseSync();
  const { enqueueOperation } = useSyncContext();
  const [planState, setPlanState] = useState<PlanState>({
    ...defaultPlanState,
    id: uuidv4(),
  });
  const { athletes, setAthletes } = useAthletes();
  const [model, setModel] = useState<TrainingModel>({
    ...planState,
    name: "",
    description: "",
    id: uuidv4(),
    trainingPlanId: uuidv4(),
  });

  const [currentExercisesDisplay, setCurrentExercisesDisplay] = useState<
    (SelectedExercise | TrainingBlock)[]
  >([]);

  const [isNewModel, setIsNewModel] = useState<boolean>(true);
  const [isNewTrainingPlan, setIsNewTrainingPlan] = useState<boolean>(true);

  const { trainingModels, setTrainingModels } = useTrainingModels();
  const [currentExerciseBlock, setCurrentExerciseBlock] =
    useState<TrainingBlock | null>(null);
  const [currentSelectedExercise, setCurrentSelectedExercise] =
    useState<SelectedExercise | null>(null);

  const { athlete, setAthlete } = useStudyContext();
  const { syncSpecificAthlete } = useAthletes();
  const saveSelectedExercise = async (
    sessionIndex: number,
    currentSelectedExercise: SelectedExercise,
    isModel: boolean = false,
    blockId?: string
  ) => {
    if (!currentSelectedExercise) return;

    const currentPlan = isModel ? model : planState;
    const setCurrentPlan = isModel ? setModel : setPlanState;
    const id = uuidv4();
    const updatedSelectedExercise = {
      ...currentSelectedExercise,
      id,
    };
    enqueueOperation({
      name: "addSelectedExercise",
      execute: async () =>
        await addSelectedExercise(
          updatedSelectedExercise,
          currentPlan.sessions[sessionIndex].id,
          blockId || null,
          pushRecord,
          undefined
        ),
      status: "pending",
    });

    const processedExercise = {
      ...currentSelectedExercise,
      id,
      sessionId: currentPlan.sessions[sessionIndex].id,
    };
    const updatedSessions = [...currentPlan.sessions];
    if (!updatedSessions[sessionIndex]) return; // guard
    if (blockId) {
      updatedSessions[sessionIndex].exercises = updatedSessions[
        sessionIndex
      ].exercises.map((exercise) =>
        exercise.id === blockId
          ? {
              ...exercise,
              selectedExercises: [
                ...(exercise as TrainingBlock).selectedExercises,
                processedExercise,
              ],
            }
          : exercise
      );
    } else {
      updatedSessions[sessionIndex].exercises = [
        ...updatedSessions[sessionIndex].exercises,
        processedExercise,
      ];
    }
    setCurrentSelectedExercise(null);
    const updatedCurrentPlan = { ...currentPlan, sessions: updatedSessions };
    setCurrentExercisesDisplay(updatedSessions[sessionIndex].exercises);
    setCurrentPlan(updatedCurrentPlan);
  };

  const updateWeeks = async (weeks: number, isModel: boolean = false) => {
    let relevantPlanState;
    if (isModel) {
      relevantPlanState = {
        ...Object.fromEntries(
          Object.entries(model).filter(
            ([key]) => !["trainingPlanId", "name", "description"].includes(key)
          )
        ),
        id: model.trainingPlanId,
        nOfWeeks: weeks,
      };
    } else {
      relevantPlanState = {
        ...planState,
        nOfWeeks: weeks,
      };
    }
    await updateTrainingPlan(relevantPlanState, pushRecord);
    if (isModel) {
      setModel({ ...model, nOfWeeks: weeks });
    } else {
      setPlanState({ ...planState, nOfWeeks: weeks });
    }
  };

  const updateNOfSessions = async (n: number, isModel: boolean = false) => {
    let relevantPlanState;
    if (isModel) {
      relevantPlanState = {
        ...Object.fromEntries(
          Object.entries(model).filter(
            ([key]) => !["trainingPlanId", "name", "description"].includes(key)
          )
        ),
        id: model.trainingPlanId,
        nOfSessions: n,
      };
    } else {
      relevantPlanState = {
        ...planState,
        nOfSessions: n,
      };
    }
    await updateTrainingPlan(relevantPlanState, pushRecord);
    if (isModel) {
      setModel({ ...model, nOfSessions: n });
    } else {
      setPlanState({ ...planState, nOfSessions: n });
    }
  };

  const updateModelName = async (name: string) => {
    const updatedModel = {
      ...model,
      name,
    };
    await updateTrainingModel(updatedModel, pushRecord);
    setModel(updatedModel);
  };

  const updateModelDescription = async (description: string) => {
    const updatedModel = {
      ...model,
      description,
    };
    await updateTrainingModel(updatedModel, pushRecord);
    setModel(updatedModel);
  };

  const addSession = async (
    session: Omit<Session, "id" | "planId">,
    isModel: boolean = false,
    initialCreation: boolean = false
  ): Promise<PlanState | TrainingModel> => {
    const currentPlan = isModel ? model : planState;
    const setCurrentPlan = isModel ? setModel : setPlanState;
    const completeSession: Session = {
      ...session,
      id: uuidv4(),
      planId: isModel ? model.trainingPlanId : planState.id,
    };
    if ((isModel && !isNewModel) || (!isModel && !isNewTrainingPlan)) {
      await parserAddSession(
        completeSession,
        isModel ? model.trainingPlanId : planState.id,
        pushRecord,
        undefined
      );
    }

    const updatedPlan = {
      ...currentPlan,
      sessions: [...currentPlan.sessions, completeSession],
    };
    if (!initialCreation) {
      updatedPlan.nOfSessions = currentPlan.sessions.length + 1;
    }

    setCurrentPlan(updatedPlan);

    if (initialCreation) {
      return updatedPlan;
    }

    if (isModel) {
      setTrainingModels(
        trainingModels.map((model) =>
          model.id === currentPlan.id
            ? {
                ...model,
                sessions: [...model.sessions, completeSession],
                nOfSessions: model.sessions.length + 1,
              }
            : model
        )
      );
    } else {
      setAthletes([
        ...athletes.map((athlete) =>
          athlete.id === athlete.id
            ? {
                ...athlete,
                currentTrainingPlan: updatedPlan,
                nOfSessions: updatedPlan.sessions.length,
              }
            : athlete
        ),
      ]);
    }
  };

  const moveExerciseToIndex = async (
    sessionIndex: number,
    exerciseId: string,
    newIndex: number,
    isModel: boolean = false
  ) => {
    const currentPlan = isModel ? model : planState;
    const setCurrentPlan = isModel ? setModel : setPlanState;
    const updatedSessions = [...currentPlan.sessions];
    const session = updatedSessions[sessionIndex];

    // Find the exercise or training block to move
    const exerciseToMoveIndex = session.exercises.findIndex(
      (ex) => ex.id === exerciseId
    );
    if (exerciseToMoveIndex === -1) return;

    const exerciseToMove = session.exercises[exerciseToMoveIndex];

    // Create new exercises array with the exercise/block moved to the new position
    const updatedExercises = [...session.exercises];
    updatedExercises.splice(exerciseToMoveIndex, 1); // Remove from current position
    updatedExercises.splice(newIndex, 0, exerciseToMove); // Insert at new position

    updatedSessions[sessionIndex] = { ...session, exercises: updatedExercises };

    setCurrentExercisesDisplay(updatedExercises);

    await parserMoveExerciseToIndex(
      exerciseId,
      newIndex,
      session.id,
      "session",
      pushRecord
    );

    setCurrentPlan({ ...currentPlan, sessions: updatedSessions });
    // Update the context state for other components
    if (isModel) {
      setTrainingModels(
        trainingModels.map((model) =>
          model.id === currentPlan.id
            ? { ...model, sessions: updatedSessions }
            : model
        )
      );
    } else {
      setAthletes([
        ...athletes.map((athlete) =>
          athlete.id === athlete.id
            ? {
                ...athlete,
                currentTrainingPlan: {
                  ...currentPlan,
                  sessions: updatedSessions,
                },
              }
            : athlete
        ),
      ]);
      setAthlete({
        ...athlete,
        currentTrainingPlan: {
          ...currentPlan,
          sessions: updatedSessions,
        },
      });
    }
  };

  const moveExerciseToIndexWithinBlock = async (
    sessionIndex: number,
    blockId: string,
    exerciseId: string,
    newIndex: number,
    isModel: boolean = false
  ) => {
    const currentPlan = isModel ? model : planState;
    const setCurrentPlan = isModel ? setModel : setPlanState;
    const updatedSessions = [...currentPlan.sessions];
    const session = updatedSessions[sessionIndex];
    const block = session.exercises.find(
      (e) => e.id === blockId
    ) as TrainingBlock;

    // Find the exercise to move within the block
    const exerciseToMoveIndex = block.selectedExercises.findIndex(
      (ex) => ex.id === exerciseId
    );
    if (exerciseToMoveIndex === -1) return;

    const exerciseToMove = block.selectedExercises[exerciseToMoveIndex];

    // Create new selectedExercises array with the exercise moved to the new position
    const updatedSelectedExercises = [...block.selectedExercises];
    updatedSelectedExercises.splice(exerciseToMoveIndex, 1); // Remove from current position
    updatedSelectedExercises.splice(newIndex, 0, exerciseToMove); // Insert at new position

    const updatedBlock = {
      ...block,
      selectedExercises: updatedSelectedExercises,
    };

    // Update the session with the modified block
    const updatedSession = { ...session, exercises: [...session.exercises] };
    const blockIndex = updatedSession.exercises.findIndex(
      (e) => e.id === blockId
    );
    updatedSession.exercises[blockIndex] = updatedBlock;
    updatedSessions[sessionIndex] = updatedSession;

    setCurrentExercisesDisplay(updatedSessions[sessionIndex].exercises);

    await parserMoveExerciseToIndexWithinBlock(
      exerciseId,
      newIndex,
      blockId,
      pushRecord
    );

    setCurrentPlan({ ...currentPlan, sessions: updatedSessions });

    // Update the context state for other components
    if (!isModel) {
      setAthletes([
        ...athletes.map((athlete) =>
          athlete.id === athlete.id
            ? {
                ...athlete,
                currentTrainingPlan: {
                  ...currentPlan,
                  sessions: updatedSessions,
                },
              }
            : athlete
        ),
      ]);
      setAthlete({
        ...athlete,
        currentTrainingPlan: {
          ...currentPlan,
          sessions: updatedSessions,
        },
      });
    } else {
      setTrainingModels(
        trainingModels.map((model) =>
          model.id === currentPlan.id
            ? { ...model, sessions: updatedSessions }
            : model
        )
      );
    }
  };

  const updateSession = async (
    session: Session,
    isModel: boolean = false,
    initialCreation: boolean = false
  ): Promise<PlanState | TrainingModel> => {
    const currentPlan = isModel ? model : planState;
    const setCurrentPlan = isModel ? setModel : setPlanState;

    const updatedSessions = currentPlan.sessions.map((s) =>
      s.id === session.id ? session : s
    );
    const updatedPlan = { ...currentPlan, sessions: updatedSessions };
    if ((isModel && !isNewModel) || (!isModel && !isNewTrainingPlan)) {
      await parserUpdateSession(session, pushRecord);
    }
    setCurrentPlan(updatedPlan);
    if (initialCreation) {
      return;
    }
    if (isModel) {
      setTrainingModels(
        trainingModels.map((model) =>
          model.id === currentPlan.id
            ? {
                ...model,
                sessions: updatedSessions,
              }
            : model
        )
      );
    } else {
      setAthletes([
        ...athletes.map((athlete) =>
          athlete.id === athlete.id
            ? {
                ...athlete,
                currentTrainingPlan: updatedPlan,
              }
            : athlete
        ),
      ]);
    }
    return updatedPlan;
  };

  const removeSession = async (index: number, isModel: boolean = false) => {
    const currentPlan = isModel ? model : planState;
    const setCurrentPlan = isModel ? setModel : setPlanState;
    const sessionToDelete = currentPlan.sessions[index];

    const updatedSessions = currentPlan.sessions.filter(
      (s) => s.id !== sessionToDelete.id
    );
    const updatedPlan = { ...currentPlan, sessions: updatedSessions };

    await parserDeleteSession(sessionToDelete.id, pushRecord);
    setCurrentPlan(updatedPlan);

    if (isModel) {
      setTrainingModels(
        trainingModels.map((model) =>
          model.id === currentPlan.id
            ? {
                ...model,
                sessions: updatedSessions,
                nOfSessions: updatedSessions.length,
              }
            : model
        )
      );
    } else {
      setAthletes([
        ...athletes.map((athlete) =>
          athlete.id === athlete.id
            ? {
                ...athlete,
                currentTrainingPlan: updatedPlan,
                nOfSessions: updatedPlan.sessions.length,
              }
            : athlete
        ),
      ]);
    }
  };

  const addTrainingBlock = async (
    sessionIndex: number,
    exerciseData: Exercise[],
    trainingBlock: Omit<TrainingBlock, "id" | "selectedExercises">,
    isModel: boolean = false
  ) => {
    const currentPlan = isModel ? model : planState;
    const setCurrentPlan = isModel ? setModel : setPlanState;

    const processedSelectedExercises: SelectedExercise[] = exerciseData.map(
      (exercise) => ({
        id: uuidv4(),
        type: "selectedExercise",
        sessionId: currentPlan.sessions[sessionIndex].id,
        name: exercise.name,
        exerciseId: exercise.id,
        series: trainingBlock.series,
        repetitions: trainingBlock.repetitions,
        effort: trainingBlock.effort,
        reduceVolume: trainingBlock.reduceVolume,
        reduceEffort: trainingBlock.reduceEffort,
        restTime: trainingBlock.restTime,
        progression: trainingBlock.progression,
        comments: "",
      })
    );

    const processedTrainingBlock: TrainingBlock = {
      ...trainingBlock,
      id: uuidv4(),
      type: "trainingBlock",
      sessionId: currentPlan.sessions[sessionIndex].id,
      selectedExercises: processedSelectedExercises,
    };

    const updatedSessions = [...currentPlan.sessions];
    updatedSessions[sessionIndex].exercises = [
      ...updatedSessions[sessionIndex].exercises,
      processedTrainingBlock,
    ];

    enqueueOperation({
      name: "addTrainingBlock",
      execute: async () =>
        await parserAddTrainingBlock(
          processedTrainingBlock,
          currentPlan.sessions[sessionIndex].id,
          pushRecord,
          undefined
        ),
      status: "pending",
    });

    const updatedPlan = { ...currentPlan, sessions: updatedSessions };

    setCurrentPlan(updatedPlan);
    setCurrentExercisesDisplay(updatedSessions[sessionIndex].exercises);
    return updatedPlan;
  };

  const updateTrainingBlock = async (
    block: TrainingBlock,
    isModel: boolean = false
  ): Promise<PlanState | TrainingModel> => {
    const currentPlan = isModel ? model : planState;
    const setCurrentPlan = isModel ? setModel : setPlanState;

    const updatedSessions: Session[] = [...currentPlan.sessions];
    const session = updatedSessions.find(
      (session) => session.id === block.sessionId
    );
    if (!session) return;
    session.exercises = session.exercises.map((exercise) =>
      exercise.id === block.id ? block : exercise
    );

    setCurrentExercisesDisplay(session.exercises);

    await parserUpdateTrainingBlock(block, pushRecord);

    setCurrentPlan({ ...currentPlan, sessions: updatedSessions });
    return { ...currentPlan, sessions: updatedSessions };
  };

  const removeExercise = async (
    //Also good for removing blocks
    sessionIndex: number,
    exerciseId: string,
    blockId?: string,
    isModel: boolean = false
  ) => {
    const currentPlan = isModel ? model : planState;
    const setCurrentPlan = isModel ? setModel : setPlanState;
    const updatedSessions = [...currentPlan.sessions];
    let updatedPlan;

    if (blockId) {
      const updatedBlock = (
        updatedSessions[sessionIndex].exercises.find(
          (block) => block.id === blockId
        ) as TrainingBlock
      ).selectedExercises.filter((exercise) => exercise.id !== exerciseId);
      updatedSessions[sessionIndex].exercises = updatedSessions[
        sessionIndex
      ].exercises.map((block) =>
        block.id === blockId
          ? { ...block, selectedExercises: updatedBlock }
          : block
      );
    } else {
      updatedSessions[sessionIndex].exercises = updatedSessions[
        sessionIndex
      ].exercises.filter((exercise) => exercise.id !== exerciseId);
    }
    updatedPlan = { ...currentPlan, sessions: updatedSessions };
    setCurrentExercisesDisplay(updatedSessions[sessionIndex].exercises);
    await parserDeleteSelectedExercise(exerciseId, pushRecord);
    setCurrentPlan(updatedPlan);
  };

  const resetPlan = () => {
    setPlanState({ ...defaultPlanState, id: uuidv4() });
    setIsNewTrainingPlan(true);
  };

  const resetModelState = () => {
    setModel({
      ...defaultPlanState,
      id: uuidv4(),
      trainingPlanId: uuidv4(),
      name: "",
      description: "",
    });
    setIsNewModel(true);
  };

  const updateProgression = async (
    sessionIndex: number,
    exerciseId: string,
    progressionIndex: number,
    progression: Progression,
    isModel: boolean = false,
    blockId?: string
  ) => {
    const currentPlan = isModel ? model : planState;
    const setCurrentPlan = isModel ? setModel : setPlanState;

    await parserUpdateProgression(progression, pushRecord);
    const updatedSessions = [...currentPlan.sessions];
    const exercise = blockId
      ? ((
          updatedSessions[sessionIndex].exercises.find(
            (block) => block.id === blockId
          ) as TrainingBlock
        ).selectedExercises.find(
          (exercise) => exercise.id === exerciseId
        ) as SelectedExercise)
      : updatedSessions[sessionIndex].exercises.find(
          (exercise) => exercise.id === exerciseId
        );
    if (!exercise) return;
    exercise.progression[progressionIndex] = progression;

    setCurrentPlan({ ...currentPlan, sessions: updatedSessions });
    if (isModel) {
      setTrainingModels(
        trainingModels.map((model) =>
          model.id === currentPlan.id
            ? { ...model, sessions: updatedSessions }
            : model
        )
      );
    }
  };

  // Manual save functions - call these explicitly when user wants to create/save
  const saveNewTrainingPlan = async (updatedPlan?: PlanState) => {
    const planToSave = updatedPlan || planState;
    planToSave.athleteId = athlete?.id;
    enqueueOperation({
      name: "addTrainingPlan",
      execute: async () =>
        await addTrainingPlan(planToSave, user.id, pushRecord),
      status: "pending",
    });
    setPlanState(planToSave);
    const updatedAthlete = { ...athlete, currentTrainingPlan: planToSave };
    syncSpecificAthlete(updatedAthlete);
    setAthlete(updatedAthlete);
    setIsNewTrainingPlan(false);
  };

  const saveNewTrainingModel = async (updatedModel?: TrainingModel) => {
    const modelToSave = updatedModel || model;
    enqueueOperation({
      name: "addTrainingModel",
      execute: async () =>
        await addTrainingModel(modelToSave, user.id, pushRecord),
      status: "pending",
    });
    setTrainingModels([...trainingModels, modelToSave]);
    setModel(modelToSave);
    setIsNewModel(false);
  };
  const resetIds = (plan: PlanState) => {
    return {
      ...plan,
      id: uuidv4(),
      sessions: plan.sessions.map((session) => ({
        ...session,
        id: uuidv4(),
        exercises: session.exercises.map((exercise) => ({
          ...exercise,
          id: uuidv4(),
          progression: exercise.progression.map((progression) => ({
            ...progression,
            id: uuidv4(),
          })),
          reduceVolume: exercise.reduceVolume,
          reduceEffort: exercise.reduceEffort,
          ...(exercise.type === "trainingBlock" && {
            selectedExercises: exercise.selectedExercises.map(
              (selectedExercise) => ({
                ...selectedExercise,
                id: uuidv4(),
                progression: selectedExercise.progression.map(
                  (progression) => ({
                    ...progression,
                    id: uuidv4(),
                  })
                ),
                reduceVolume: selectedExercise.reduceVolume,
                reduceEffort: selectedExercise.reduceEffort,
              })
            ),
          }),
        })),
      })),
    };
  };

  const createTrainingPlanFromModel = async (planState: PlanState) => {
    const currentAthlete = { ...athlete };
    const planToSave = resetIds(planState);
    planToSave.athleteId = currentAthlete?.id;
    console.log("saving plan", planToSave);
    await addTrainingPlan(planToSave, user.id, pushRecord);
    const newAthlete = { ...currentAthlete, currentTrainingPlan: planToSave };
    syncSpecificAthlete(newAthlete);
    setAthlete(newAthlete);
    setPlanState(planToSave);
  };

  const deleteTrainingModel = async (modelId: string) => {
    await parserDeleteTrainingModel(modelId, pushRecord);
    setTrainingModels(trainingModels.filter((model) => model.id !== modelId));
    resetModelState();
  };

  const updateSelectedExercise = async (
    sessionIndex: number,
    exerciseId: string,
    exercise: SelectedExercise,
    blockId?: string,
    isModel: boolean = false
  ) => {
    const currentPlan = isModel ? model : planState;
    const setCurrentPlan = isModel ? setModel : setPlanState;

    await parserUpdateSelectedExercise(exercise, pushRecord);
    const updatedSessions = [...currentPlan.sessions];
    if (blockId) {
      const block = updatedSessions[sessionIndex].exercises.find(
        (e) => e.id === blockId
      ) as TrainingBlock;
      const selectedExercise = block.selectedExercises.find(
        (e) => e.id === exerciseId
      );
      if (!selectedExercise) return;
      selectedExercise.restTime = exercise.restTime;
    } else {
      const selectedExercise = updatedSessions[sessionIndex].exercises.find(
        (e) => e.id === exerciseId
      ) as SelectedExercise;
      if (!selectedExercise) return;
      selectedExercise.restTime = exercise.restTime;
    }

    setCurrentPlan({ ...currentPlan, sessions: updatedSessions });
    if (isModel) {
      setTrainingModels(
        trainingModels.map((model) =>
          model.id === currentPlan.id
            ? { ...model, sessions: updatedSessions }
            : model
        )
      );
    }
  };

  return (
    <NewPlanContext.Provider
      value={{
        planState,
        setPlanState,
        updateWeeks,
        addSession,
        updateSession,
        removeSession,
        addTrainingBlock,
        updateTrainingBlock,
        removeExercise,
        resetPlan,
        updateNOfSessions,
        currentExerciseBlock,
        setCurrentExerciseBlock,
        currentSelectedExercise,
        setCurrentSelectedExercise,
        model,
        saveSelectedExercise,
        setModel,
        resetModelState,
        updateProgression,
        saveNewTrainingPlan,
        createTrainingPlanFromModel,
        saveNewTrainingModel,
        isNewModel,
        isNewTrainingPlan,
        setIsNewModel,
        setIsNewTrainingPlan,
        updateModelName,
        updateModelDescription,
        deleteTrainingModel,
        updateSelectedExercise,
        moveExerciseToIndex,
        moveExerciseToIndexWithinBlock,
        currentExercisesDisplay,
        setCurrentExercisesDisplay,
      }}
    >
      {children}
    </NewPlanContext.Provider>
  );
};

export const useNewPlan = (): NewPlanContextType => {
  const context = useContext(NewPlanContext);
  if (context === undefined) {
    throw new Error("useNewPlan must be used within a NewPlanProvider");
  }
  return context;
};

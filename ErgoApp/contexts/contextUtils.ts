import { useUser } from "./UserContext";
import { useStudyContext } from "./StudyContext";

export type ContextKey = "user" | "test";

export const useContextAccessor = (context: ContextKey) => {
  const { userData, setUserData } = useUser();
  const { study, setStudy } = useStudyContext();

  const contexts = {
    user: { get: userData, set: setUserData },
    test: { get: study, set: setStudy },
  };
  return {
    getData: () => contexts[context].get,
    setData: (data: any) => contexts[context].set(data),
  };
};

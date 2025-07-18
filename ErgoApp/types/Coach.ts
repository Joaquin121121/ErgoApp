export interface Coach {
  name: string;
  info: string;
  specialty: string;
  image: string;
  email: string;
  password: string;
}

export const initialCoach: Coach = {
  name: "",
  info: "",
  specialty: "",
  image: "",
  email: "",
  password: "",
};

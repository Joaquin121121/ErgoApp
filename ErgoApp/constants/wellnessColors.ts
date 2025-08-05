import { MaterialCommunityIcons } from "@expo/vector-icons";

export const wellnessColors = {
  sleep: {
    veryLight: "#E6D4F7",
    light: "#8A2BE2",
    dark: "#6A1B9A",
  },
  nutrition: {
    veryLight: "#FFE0B2",
    light: "#FF9501",
    dark: "#E65100",
  },
  fatigue: {
    veryLight: "#FFCDD2",
    light: "#E81D23",
    dark: "#C62828",
  },
} as const;

export type WellnessType = keyof typeof wellnessColors;
export type ColorTone = "light" | "dark" | "veryLight";

export const wellnessTranslations = {
  sleep: "Sueño",
  nutrition: "Nutrición",
  fatigue: "Fatiga",
} as const;
export const iconsMap: Record<
  WellnessType,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  nutrition: "silverware-fork-knife",
  sleep: "moon-waning-crescent",
  fatigue: "speedometer",
};

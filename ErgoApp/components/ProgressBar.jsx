import React from "react";
import { View } from "react-native";

// Helper function to convert Tailwind color classes to their hex values
const getTailwindColor = (colorClass) => {
  const tailwindColors = {
    primary: "white",
    secondary: "#E81D23",
    tertiary: "#333333",
    gray: "#d9d9d9",
    darkGray: "#9E9E9E",
    offWhite: "#F5F5F5",
    lightRed: "#FFC1C1",
    fire: "#FF9501",
    yellow: "#FFD700",
    green: "#00A859",
    blue: "#0989FF",
    // Add more color mappings as needed
  };

  return tailwindColors[colorClass] || "#00A859"; // Default to green if color not found
};

const ProgressBar = ({
  onLayout,
  progress = 0,
  color = "bg-emerald-600", // Default Tailwind green color if none provided
  height = 8, // Default height in pixels
  width = "100%", // Default to full width
  style, // Additional styles
}) => {
  // Ensure progress stays between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View
      style={[
        {
          backgroundColor: "#D9D9D9",
          borderRadius: 4,
          overflow: "hidden",
          height,
          width,
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: getTailwindColor(color),
          height: "100%",
          borderRadius: 4,
        }}
        onLayout={onLayout}
      />
    </View>
  );
};

export default ProgressBar;

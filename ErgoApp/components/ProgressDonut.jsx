import React, { useEffect } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

const ProgressDonut = ({
  progress = 75, // Value between 0-100
  size = 200,
  strokeWidth = 25,
  progressColor = "#00A859",
  backgroundColor = "#D9D9D9",
  duration = 1000, // Animation duration in ms
}) => {
  // Create animated value for rotation
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    // Animate progress when component mounts or progress changes
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Calculate sizes
  const innerSize = size - strokeWidth * 2;
  const radius = size / 2;
  const center = radius - strokeWidth;

  // Calculate rotation based on progress
  const rotation = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background Circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderWidth: strokeWidth,
            borderColor: backgroundColor,
          },
        ]}
      />

      {/* Progress Circle - First Half */}
      <Animated.View
        style={[
          styles.progressCircle,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderWidth: strokeWidth,
            borderColor: progressColor,
            transform: [{ rotate: rotation }],
          },
        ]}
      />

      {/* Inner Circle (white background) */}
      <View
        style={[
          styles.innerCircle,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: "white",
          },
        ]}
      >
        <Text className="font-psemibold text-green text-h2">{`${Math.round(
          progress
        )}%`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
  },
  progressCircle: {
    position: "absolute",
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
    transform: [{ rotate: "0deg" }],
  },
  innerCircle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProgressDonut;

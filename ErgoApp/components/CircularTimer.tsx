import { View, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";
import ProgressiveDumbbellIcon from "./ProgressiveDumbbellIcon";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularTimerProps {
  seconds: number;
  totalSeconds: number;
  isCompleted?: boolean;
}

const CircularTimer = ({
  seconds,
  totalSeconds,
  isCompleted = false,
}: CircularTimerProps) => {
  const progress =
    totalSeconds > 0 ? (totalSeconds - seconds) / totalSeconds : 0;

  // Animated value for smooth progress transitions
  const animatedProgress = useRef(new Animated.Value(0)).current;

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return minutes > 0
      ? `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
      : `${remainingSeconds}`;
  };

  const size = 120;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;

  // Continuously animate progress - updates every frame for smooth movement
  useEffect(() => {
    const startTime = Date.now();
    const initialSeconds = seconds;
    let animationId: number;

    const animateProgress = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const currentSeconds = Math.max(0, initialSeconds - elapsed);
      const currentProgress =
        totalSeconds > 0 ? (totalSeconds - currentSeconds) / totalSeconds : 0;

      // Ensure progress stays at 1 (complete) when timer runs out
      const finalProgress = Math.min(1, Math.max(0, currentProgress));
      animatedProgress.setValue(finalProgress);

      if (currentSeconds > 0) {
        animationId = requestAnimationFrame(animateProgress);
      } else {
        // When timer runs out, ensure we stay at the final state (progress = 1)
        animatedProgress.setValue(1);
      }
    };

    if (seconds > 0) {
      animateProgress();
    } else {
      // If seconds is already 0, set to final state immediately
      animatedProgress.setValue(1);
    }

    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [seconds, totalSeconds, animatedProgress]);

  // Calculate animated stroke dash offset
  const animatedStrokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View className="flex flex-row items-center justify-center mb-12">
      <View
        className="relative items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Svg width={size} height={size} className="absolute">
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#FFC1C1"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E81D23"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={animatedStrokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <Text className="text-secondary font-pmedium text-5xl pt-4 pl-2">
          {formatTime(Math.max(0, seconds))}{" "}
        </Text>
      </View>
      {/* Time text outside the circle */}
    </View>
  );
};

export default CircularTimer;

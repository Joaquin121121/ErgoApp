import React from "react";
import { Animated } from "react-native";
import Svg, { Path, Defs, ClipPath, Rect } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface ProgressiveDumbbellIconProps {
  progress: number | Animated.Value; // 0 to 1 or animated value
  size?: number;
}

const ProgressiveDumbbellIcon = ({
  progress,
  size = 24,
}: ProgressiveDumbbellIconProps) => {
  // Handle both number and Animated.Value
  const isAnimated = progress instanceof Animated.Value;

  // For animated values, create interpolated values for the clip path
  const animatedY = isAnimated
    ? (progress as Animated.Value).interpolate({
        inputRange: [0, 1],
        outputRange: [0, -960],
      })
    : -960 + 960 * (1 - (progress as number));

  const animatedHeight = isAnimated
    ? (progress as Animated.Value).interpolate({
        inputRange: [0, 1],
        outputRange: [0, 960],
      })
    : 960 * (progress as number);

  return (
    <Svg width={size} height={size} viewBox="0 -960 960 960">
      <Defs>
        {/* Clip path for progressive fill */}
        <ClipPath id="progressClip">
          {isAnimated ? (
            <AnimatedRect
              x="0"
              y={animatedY}
              width="960"
              height={animatedHeight}
            />
          ) : (
            <Rect
              x="0"
              y={animatedY as number}
              width="960"
              height={animatedHeight as number}
            />
          )}
        </ClipPath>
      </Defs>

      {/* Background dumbbell (outline/unfilled) */}
      <Path
        d="m826-585-42-42 45-45-157-157-45 45-43-43 30-31q23-23 57-22.5t57 23.5l129 129q23 23 23 56.5T857-615l-31 30ZM346-104q-23 23-56.5 23T233-104L90-247q-17-17.38-17-42.69T90-332l44-44 43 42-45 45 157 157 45-45 42 43-30 30Zm397-308 85-85-331-331-85 85 331 331ZM463-132l86-86-331-331-86 86 331 331Zm9-248 109-109-92-92-109 109 92 92Zm33 290q-16.93 17-41.97 17Q438-73 421-90L90-421q-17-16.93-17-41.97Q73-488 90-505l85-86q17.38-17 42.69-17T260-591l77 77 110-110-77-77q-17-16.93-17-41.97Q353-768 370-785l85-86q17.38-17 42.69-17T540-871l331 331q17 17.38 17 42.69T871-455l-86 85q-16.93 17-41.97 17Q718-353 701-370l-77-77-110 110 77 77q17 17.38 17 42.69T591-175l-86 85Z"
        fill="#FFC1C1"
      />

      {/* Progressive fill */}
      <Path
        d="m826-585-42-42 45-45-157-157-45 45-43-43 30-31q23-23 57-22.5t57 23.5l129 129q23 23 23 56.5T857-615l-31 30ZM346-104q-23 23-56.5 23T233-104L90-247q-17-17.38-17-42.69T90-332l44-44 43 42-45 45 157 157 45-45 42 43-30 30Zm397-308 85-85-331-331-85 85 331 331ZM463-132l86-86-331-331-86 86 331 331Zm9-248 109-109-92-92-109 109 92 92Zm33 290q-16.93 17-41.97 17Q438-73 421-90L90-421q-17-16.93-17-41.97Q73-488 90-505l85-86q17.38-17 42.69-17T260-591l77 77 110-110-77-77q-17-16.93-17-41.97Q353-768 370-785l85-86q17.38-17 42.69-17T540-871l331 331q17 17.38 17 42.69T871-455l-86 85q-16.93 17-41.97 17Q718-353 701-370l-77-77-110 110 77 77q17 17.38 17 42.69T591-175l-86 85Z"
        fill="#E81D23"
        clipPath="url(#progressClip)"
      />
    </Svg>
  );
};

export default ProgressiveDumbbellIcon;

import React, { useEffect, useRef, useState } from "react";
import { Dimensions, View, Text } from "react-native";
import { CartesianChart, Line, Area } from "victory-native";
import { Circle, Group } from "@shopify/react-native-skia";
import { smoothenCurve, formatIsoToSpanishDate } from "../utils/utils";

interface CustomAreaChartProps {
  data: number[];
  color: string;
  yMin: number;
  yMax: number;
  width?: number;
  height?: number;
  xInitialLabel?: string[];
  xLabelColor?: string;
}

const CustomAreaChart: React.FC<CustomAreaChartProps> = ({
  data,
  color,
  yMin,
  yMax,
  width = Dimensions.get("window").width * 0.45,
  height = 120,
  xInitialLabel,
  xLabelColor,
}) => {
  // Animation for the glowing dot using state-based animation
  const [glowOpacity, setGlowOpacity] = useState(0.2);
  const animationDirection = useRef(1); // 1 for increasing, -1 for decreasing

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowOpacity((prev) => {
        const step = 0.02; // Small step for smooth animation
        let newOpacity = prev + step * animationDirection.current;

        // Reverse direction when reaching bounds
        if (newOpacity >= 0.4) {
          animationDirection.current = -1;
          newOpacity = 0.4;
        } else if (newOpacity <= 0.2) {
          animationDirection.current = 1;
          newOpacity = 0.2;
        }

        return newOpacity;
      });
    }, 100); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  // Process chart data
  const chartData = smoothenCurve(data);

  // Prepare data for Victory Native with proper domain constraints
  const victoryData = chartData.map((y, i) => ({ x: i + 1, y }));

  // Get current date for absolute positioning at the end
  const currentDate = formatIsoToSpanishDate(new Date().toISOString());

  const chartHeight =
    xInitialLabel && xInitialLabel.length > 0 ? height - 25 : height; // Reserve space for labels

  return (
    <View style={{ width, height }}>
      <View style={{ width, height: chartHeight }}>
        <CartesianChart
          data={victoryData}
          xKey="x"
          yKeys={["y"]}
          domainPadding={{ top: 10, bottom: 10, right: 10 }}
          domain={{ y: [yMin, yMax] }}
          axisOptions={{
            font: undefined,
            tickCount: 0,
            lineColor: "transparent",
            labelColor: "transparent",
          }}
        >
          {({ points, chartBounds }) => {
            // Get the latest (rightmost) point
            const latestPoint = points.y[points.y.length - 1];

            return (
              <>
                <Area
                  points={points.y}
                  y0={chartBounds.bottom}
                  color={color}
                  opacity={0.3}
                  animate={{ type: "timing", duration: 1000 }}
                  curveType="natural"
                />
                <Line
                  points={points.y}
                  color={color}
                  strokeWidth={2}
                  animate={{ type: "timing", duration: 1000 }}
                  curveType="natural"
                />

                {/* Glowing dot on the latest data point */}
                {latestPoint &&
                  typeof latestPoint.x === "number" &&
                  typeof latestPoint.y === "number" && (
                    <Group>
                      {/* Outer glow circle - animated */}
                      <Circle
                        cx={latestPoint.x}
                        cy={latestPoint.y}
                        r={8}
                        color={color}
                        opacity={glowOpacity}
                      />
                      {/* Middle glow circle - animated with different intensity */}
                      <Circle
                        cx={latestPoint.x}
                        cy={latestPoint.y}
                        r={5}
                        color={color}
                        opacity={glowOpacity}
                      />
                      {/* Inner solid circle - always visible */}
                      <Circle
                        cx={latestPoint.x}
                        cy={latestPoint.y}
                        r={3}
                        color={color}
                        opacity={1}
                      />
                    </Group>
                  )}
              </>
            );
          }}
        </CartesianChart>
      </View>

      {/* X-axis labels */}
      {xInitialLabel && xInitialLabel.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            paddingTop: 5,
            width: width,
            position: "relative",
          }}
        >
          {/* Distribute xInitialLabel items evenly */}
          {xInitialLabel &&
            xInitialLabel.map((label, index) => {
              let position = {};

              if (xInitialLabel.length === 1) {
                // Single label: place at start
                position = {
                  position: "absolute",
                  left: 0,
                };
              } else {
                // Multiple labels: distribute evenly across available width (leaving space for current date)
                const totalLabels = xInitialLabel.length;
                const spacing = 80 / (totalLabels - 1); // Use 80% of width to leave space for current date
                const leftPosition = index * spacing;

                position = {
                  position: "absolute",
                  left: `${leftPosition}%`,
                  transform: [
                    {
                      translateX: index === 0 ? 0 : -50,
                    },
                  ],
                };
              }

              return (
                <View key={index} style={position}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: xLabelColor,
                      fontFamily: "Poppins-Regular",
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </Text>
                </View>
              );
            })}

          {/* Current date always positioned absolutely at the end */}
          <View
            style={{
              position: "absolute",
              right: 0,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: xLabelColor,
                fontFamily: "Poppins-Regular",
                textAlign: "center",
              }}
            >
              {currentDate}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default CustomAreaChart;

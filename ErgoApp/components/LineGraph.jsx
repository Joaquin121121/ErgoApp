import React, { useMemo } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Svg, {
  Path,
  Circle,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { useContext } from "react";

const LineGraph = ({ stat, maxValues }) => {
  const { user } = useContext(UserContext);
  const { currentValue, previousValues, target } =
    user["stats"][stat.toLowerCase()];

  const parsedPreviousValues = useMemo(() => {
    return (previousValues || [{ date: user["registryDate"], value: 0 }]).sort(
      (a, b) => {
        const [dayA, monthA, yearA] = a.date.split("/");
        const [dayB, monthB, yearB] = b.date.split("/");
        return (
          new Date(`${yearA}-${monthA}-${dayA}`) -
          new Date(`${yearB}-${monthB}-${dayB}`)
        );
      }
    );
  }, [previousValues, user["registryDate"]]);

  // Setup dimensions
  const PADDING = 40;
  const screenWidth = Dimensions.get("window").width - 40;
  const graphHeight = 220;
  const graphWidth = screenWidth - PADDING * 2;

  // Get target position and value
  const targetX = PADDING + graphWidth * 0.9;
  const virtualTarget = target || currentValue * 1.25;

  // Calculate Y-axis range and maxValue
  const { minValue, maxValue, xScaleFactor, dataPoints } = useMemo(() => {
    const allValues = [
      ...parsedPreviousValues.map((p) => p.value),
      currentValue,
    ];
    const minVal = Math.min(...allValues);

    let maxVal;
    if (target) {
      maxVal = target;
    } else {
      const defaultMax = currentValue * 1.5;
      maxVal =
        maxValues && maxValues[stat.toLowerCase()]
          ? Math.min(maxValues[stat.toLowerCase()], defaultMax)
          : defaultMax;
    }

    // Calculate scale factor
    let scaleFactor = 1;
    const points = parsedPreviousValues.map((pv) => ({
      date: pv.date,
      value: pv.value,
    }));

    if (points.length >= 2) {
      const lastTwo = points.slice(-2);
      const lastY =
        graphHeight -
        PADDING -
        ((lastTwo[1].value - minVal) / (maxVal - minVal)) *
          (graphHeight - PADDING * 2);
      const prevY =
        graphHeight -
        PADDING -
        ((lastTwo[0].value - minVal) / (maxVal - minVal)) *
          (graphHeight - PADDING * 2);
      const targetY =
        graphHeight -
        PADDING -
        ((virtualTarget - minVal) / (maxVal - minVal)) *
          (graphHeight - PADDING * 2);

      const currentSlope = (lastY - prevY) / graphWidth;
      const yDiff = targetY - lastY;
      const requiredX = yDiff / currentSlope;

      scaleFactor = (targetX - PADDING) / requiredX;
      scaleFactor = Math.min(scaleFactor, 0.7);
    }

    return {
      minValue: minVal,
      maxValue: maxVal,
      xScaleFactor: scaleFactor,
      dataPoints: points,
    };
  }, [
    parsedPreviousValues,
    currentValue,
    target,
    maxValues,
    stat,
    virtualTarget,
  ]);

  // Memoized helper functions
  const getY = useMemo(
    () => (value) => {
      return (
        graphHeight -
        PADDING -
        ((value - minValue) / (maxValue - minValue)) *
          (graphHeight - PADDING * 2)
      );
    },
    [minValue, maxValue, graphHeight, PADDING]
  );

  const getX = useMemo(
    () => (index, totalPoints) => {
      const baseX = (index * graphWidth) / (totalPoints - 1);
      return PADDING + baseX * xScaleFactor;
    },
    [graphWidth, PADDING, xScaleFactor]
  );

  // Memoized path data
  const { pathData, fillPathData } = useMemo(() => {
    let pData = "";
    let fPathData = "";

    dataPoints.forEach((point, index) => {
      const x = getX(index, dataPoints.length);
      const y = getY(point.value);

      if (index === 0) {
        pData += `M ${x} ${y}`;
        fPathData += `M ${x} ${y}`;
      } else {
        pData += ` L ${x} ${y}`;
        fPathData += ` L ${x} ${y}`;
      }
    });

    const lastX = getX(dataPoints.length - 1, dataPoints.length);
    fPathData += ` L ${lastX} ${graphHeight - PADDING}`;
    fPathData += ` L ${PADDING} ${graphHeight - PADDING}`;
    fPathData += " Z";

    return { pathData: pData, fillPathData: fPathData };
  }, [dataPoints, getX, getY]);

  // Memoized Y-axis ticks
  const yAxisTicks = useMemo(() => {
    const ticks = [];
    const numTicks = 2;
    for (let i = 0; i <= numTicks; i++) {
      const value = minValue + (maxValue - minValue) * (i / numTicks);
      ticks.push(value);
    }
    return ticks;
  }, [minValue, maxValue]);
  const statLabels = {
    cmj: "Altura (cm)",
    rsi: "RSI",
    dsi: "DSI",
    fuerza: "Fuerza",
    resistencia: "Resistencia",
    explosividad: "Explosividad",
    agilidad: "Agilidad",
    salto: "Salto",
    balance: "Balance",
  };

  return (
    <View className="bg-white w-100 shadow-sm">
      <Svg
        className="self-center"
        width={screenWidth}
        height={graphHeight + 20}
      >
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#00A859" stopOpacity="0.3" />
            <Stop offset="1" stopColor="#00A859" stopOpacity="0.7" />
          </LinearGradient>
        </Defs>

        {/* X axis label */}
        <SvgText
          x={screenWidth / 2}
          y={graphHeight}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
        >
          Fecha
        </SvgText>

        {/* Rest of the elements */}
        <Line
          x1={PADDING}
          y1={graphHeight - PADDING}
          x2={screenWidth - PADDING}
          y2={graphHeight - PADDING}
          stroke="#d9d9d9"
          strokeWidth="1"
        />
        <Line
          x1={PADDING}
          y1={PADDING}
          x2={PADDING}
          y2={graphHeight - PADDING}
          stroke="#d9d9d9"
          strokeWidth="1"
        />

        {/* Gradient fill */}
        <Path d={fillPathData} fill="url(#gradient)" />

        {/* Y-axis labels */}
        {yAxisTicks.map((tick, index) => (
          <SvgText
            key={`label-y-${index}`}
            x={PADDING - 8}
            y={getY(tick)}
            textAnchor="end"
            alignmentBaseline="middle"
            fontSize="10"
            fill="#666"
          >
            {tick.toFixed(1)}
          </SvgText>
        ))}

        {/* X-axis labels */}
        {dataPoints.map((point, index) => {
          const [day, month] = point.date.split("/");
          return (
            <SvgText
              key={`label-x-${index}`}
              x={getX(index, dataPoints.length)}
              y={graphHeight - PADDING + 15}
              textAnchor="middle"
              fontSize="10"
              fill="#666"
            >
              {`${day}/${month}`}
            </SvgText>
          );
        })}

        {/* Line */}
        <Path d={pathData} fill="none" stroke="#00A859" strokeWidth="2" />

        {/* Data points */}
        {dataPoints.map((point, index) => (
          <Circle
            key={`point-${index}`}
            cx={getX(index, dataPoints.length)}
            cy={getY(point.value)}
            r="4"
            fill="#00A859"
          />
        ))}

        {/* Target point and label - only if real target exists */}
        {target && (
          <>
            <SvgText
              x={targetX}
              y={getY(target) - 15}
              textAnchor="middle"
              fontSize="10"
              fill="#E81D23"
            >
              Objetivo
            </SvgText>
            <Circle cx={targetX} cy={getY(target)} r="4" fill="#E81D23" />
          </>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default React.memo(LineGraph);

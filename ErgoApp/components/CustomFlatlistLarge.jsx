import React, { useState, useRef, useCallback } from "react";
import {
  View,
  useWindowDimensions,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";

const CustomFlatlistLarge = ({
  data,
  renderContent,
  activeIndex,
  setActiveIndex,
  onItemChange,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // Calculate dimensions based on TrainingSession component
  const ITEM_WIDTH = screenWidth * 0.9; // w-[90vw] from TrainingSession
  const ITEM_HEIGHT = 300; // Approximate total height of TrainingSession
  const SIDE_SPACING = (screenWidth - ITEM_WIDTH) / 2;

  const styles = StyleSheet.create({
    container: {
      marginTop: 8,
      marginBottom: 8,
    },
    carouselContainer: {
      width: screenWidth,
      height: ITEM_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
    },
    itemContainer: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
    },
    indicatorsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
      gap: 8,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 0,
  }).current;

  const onViewableItemsChangedRef = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      const newIndex = parseInt(viewableItems[0].item.key);
      setActiveIndex(newIndex);
      onItemChange?.(newIndex);
    }
  }).current;

  const renderItem = useCallback(
    ({ item, index }) => {
      const inputRange = [
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
        (index + 1) * ITEM_WIDTH,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.95, 1, 0.95],
        extrapolate: "clamp",
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.7, 1, 0.7],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={[
            styles.itemContainer,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          {renderContent(item)}
        </Animated.View>
      );
    },
    [ITEM_WIDTH, scrollX]
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [ITEM_WIDTH]
  );

  const indicators = data.map((_, index) => (
    <View
      key={index}
      style={[
        styles.indicator,
        {
          backgroundColor: index === activeIndex ? "#E81D23" : "#D9D9D9",
        },
      ]}
    />
  ));

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
          renderToHardwareTextureAndroid
          snapToInterval={ITEM_WIDTH}
          snapToAlignment="center"
          keyExtractor={(item) => item.key.toString()}
          renderItem={renderItem}
          onViewableItemsChanged={onViewableItemsChangedRef}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={getItemLayout}
          contentContainerStyle={{
            paddingHorizontal: SIDE_SPACING,
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        />
      </View>
      <View style={styles.indicatorsContainer}>{indicators}</View>
    </View>
  );
};

export default CustomFlatlistLarge;

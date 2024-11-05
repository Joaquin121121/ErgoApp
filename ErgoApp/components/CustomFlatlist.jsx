import React, { useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  useWindowDimensions,
  StyleSheet,
  Animated,
} from "react-native";

const CustomFlatlist = ({
  // Required props
  data,
  renderContent = (item) => item,
  activeIndex,
  setActiveIndex,
  // Optional props with defaults
  itemWidthPercentage = 0.85,
  slideDistance = 8,
  scaleRange = [0.9, 1, 0.9],
  onItemChange,
  containerStyle,
  itemStyle,
  showIndicators = true,
  indicatorActiveColor = "#E81D23", // Changed to explicit color instead of "secondary"
  indicatorInactiveColor = "#D9D9D9", // Changed to explicit color instead of "gray"
  indicatorContainerStyle,
  indicatorStyle,
  height = 180,
}) => {
  // Initialize activeIndex as 0 to highlight first dot

  const { width: screenWidth } = useWindowDimensions();
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Calculate dimensions
  const ITEM_WIDTH = screenWidth * itemWidthPercentage;
  const SIDE_PADDING = (screenWidth - ITEM_WIDTH) / 2;
  const SLIDE_DISTANCE = ITEM_WIDTH / slideDistance;

  const styles = StyleSheet.create({
    container: {
      height,
      position: "relative",
    },
    flatList: {
      overflow: "visible",
    },
    itemContainer: {
      width: ITEM_WIDTH,
    },
    indicatorsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      marginTop: 8,
    },
    indicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
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

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: "clamp",
      });

      const translateX = scrollX.interpolate({
        inputRange,
        outputRange: [SLIDE_DISTANCE, 0, -SLIDE_DISTANCE],
        extrapolate: "clamp",
      });

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: scaleRange,
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={[
            styles.itemContainer,
            itemStyle,
            {
              opacity,
              transform: [{ translateX }, { scale }],
            },
          ]}
        >
          {renderContent(item)}
        </Animated.View>
      );
    },
    [ITEM_WIDTH, SLIDE_DISTANCE, scaleRange, itemStyle, renderContent, scrollX]
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [ITEM_WIDTH]
  );

  // Make sure we're showing dots for the correct number of items
  const indicators = data.map((_, index) => (
    <View
      key={index}
      style={[
        styles.indicator,
        indicatorStyle,
        {
          backgroundColor:
            index === activeIndex
              ? indicatorActiveColor
              : indicatorInactiveColor,
        },
      ]}
    />
  ));

  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <Animated.FlatList
          ref={flatListRef}
          style={styles.flatList}
          contentContainerStyle={{
            paddingHorizontal: SIDE_PADDING,
            display: "flex",
            alignItems: "center",
          }}
          data={data}
          horizontal
          keyExtractor={useCallback((item) => item.key.toString(), [])}
          renderItem={renderItem}
          snapToInterval={ITEM_WIDTH}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChangedRef}
          viewabilityConfig={viewabilityConfig}
          showsHorizontalScrollIndicator={false}
          getItemLayout={getItemLayout}
          bounces={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          initialScrollIndex={0}
          removeClippedSubviews={false}
        />
      </View>
      {showIndicators && indicators.length > 0 && (
        <View style={[styles.indicatorsContainer, indicatorContainerStyle]}>
          {indicators}
        </View>
      )}
    </>
  );
};

export default CustomFlatlist;

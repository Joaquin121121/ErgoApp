import React, { useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  useWindowDimensions,
  StyleSheet,
  Animated,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItem,
  ViewabilityConfig,
} from "react-native";

interface CustomFlatlistItem {
  key: string | number;
  [key: string]: any;
}

interface CustomFlatlistProps {
  data: CustomFlatlistItem[];
  renderContent?: (item: CustomFlatlistItem) => React.ReactNode;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  itemWidthPercentage?: number;
  slideDistance?: number;
  scaleRange?: [number, number, number];
  onItemChange?: (index: number) => void;
  containerStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  showIndicators?: boolean;
  indicatorActiveColor?: string;
  indicatorInactiveColor?: string;
  indicatorContainerStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
  height?: number;
  large?: boolean;
}

const CustomFlatlist: React.FC<CustomFlatlistProps> = ({
  data,
  renderContent = (item: CustomFlatlistItem) => item,
  activeIndex,
  setActiveIndex,
  itemWidthPercentage = 0.85,
  slideDistance = 8,
  scaleRange = [0.9, 1, 0.9],
  onItemChange,
  containerStyle,
  itemStyle,
  showIndicators = true,
  indicatorActiveColor = "#E81D23",
  indicatorInactiveColor = "#D9D9D9",
  indicatorContainerStyle,
  indicatorStyle,
  height = 180,
  large = false,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const flatListRef = useRef<FlatList<CustomFlatlistItem>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const isScrolling = useRef<boolean>(false);

  const ITEM_WIDTH = screenWidth * itemWidthPercentage;
  const SIDE_PADDING = large
    ? (screenWidth - ITEM_WIDTH) / 4
    : (screenWidth - ITEM_WIDTH) / 2;
  const SLIDE_DISTANCE = ITEM_WIDTH / slideDistance;

  // For large mode, calculate the exact right padding needed
  const RIGHT_PADDING = large
    ? screenWidth - (ITEM_WIDTH + SIDE_PADDING)
    : SIDE_PADDING;

  const styles = StyleSheet.create({
    wrapper: {
      marginTop: 8,
      width: screenWidth,
      alignItems: "center",
    },
    container: {
      height,
      position: "relative",
      zIndex: 1,
      width: "100%",
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
      position: "relative",
      zIndex: 2,
      width: "100%",
    },
    indicator: {
      width: 12,
      height: 12,
      borderRadius: 75,
    },
  });

  const viewabilityConfig = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 0,
  }).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const maxOffset = (data.length - 1) * ITEM_WIDTH;
        const currentOffset = event.nativeEvent.contentOffset.x;

        if (currentOffset > maxOffset && !isScrolling.current) {
          isScrolling.current = true;
          flatListRef.current?.scrollToOffset({
            offset: maxOffset,
            animated: true,
          });
          setTimeout(() => {
            isScrolling.current = false;
          }, 100);
        }
      },
    }
  );

  const onViewableItemsChangedRef = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: Array<{ item: CustomFlatlistItem }>;
    }) => {
      if (viewableItems?.length > 0) {
        const newIndex = parseInt(viewableItems[0].item.key.toString());
        setActiveIndex(newIndex);
        onItemChange?.(newIndex);
      }
    }
  ).current;

  const renderItem: ListRenderItem<CustomFlatlistItem> = useCallback(
    ({ item, index }) => {
      const inputRange = [
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
        (index + 1) * ITEM_WIDTH,
      ];

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.7, 1, 0.7],
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
          {renderContent(item) as React.ReactNode}
        </Animated.View>
      );
    },
    [ITEM_WIDTH, SLIDE_DISTANCE, scaleRange, itemStyle, renderContent, scrollX]
  );

  const getItemLayout = useCallback(
    (_: CustomFlatlistItem[] | null | undefined, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [ITEM_WIDTH]
  );

  const indicators = data.map((_, index: number) => (
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
    <View style={styles.wrapper}>
      <View style={[styles.container, containerStyle]}>
        <Animated.FlatList<CustomFlatlistItem>
          ref={flatListRef}
          style={styles.flatList}
          contentContainerStyle={{
            paddingLeft: SIDE_PADDING,
            paddingRight: RIGHT_PADDING,
          }}
          data={data}
          horizontal
          keyExtractor={useCallback(
            (item: CustomFlatlistItem) => item.key.toString(),
            []
          )}
          renderItem={renderItem}
          snapToInterval={ITEM_WIDTH}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChangedRef}
          viewabilityConfig={viewabilityConfig}
          showsHorizontalScrollIndicator={false}
          getItemLayout={getItemLayout as any}
          bounces={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          initialScrollIndex={0}
          removeClippedSubviews={false}
        />
      </View>
      {showIndicators && indicators.length > 0 && data.length > 1 && (
        <View style={[styles.indicatorsContainer, indicatorContainerStyle]}>
          {indicators}
        </View>
      )}
    </View>
  );
};

export default CustomFlatlist;

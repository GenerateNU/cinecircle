import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";

/**
 * Simple Carousel Component
 * - Uses ScrollView with horizontal pagination
 * - Works without react-native-reanimated-carousel
 */
interface CarouselProps {
  components: React.ReactNode[]; 
  width: number; 
  height: number; 
}

export default function MyCarousel({ components, width, height }: CarouselProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselWidth = (width / 100) * screenWidth;
  const carouselHeight = (height / 100) * screenHeight;

  return (
    <View style={[styles.carouselContainer, { width: carouselWidth, height: carouselHeight }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / carouselWidth
          );
          setCurrentIndex(newIndex);
        }}
        style={{ width: carouselWidth, height: carouselHeight }}
      >
        {components.map((component, index) => (
          <View key={index} style={[styles.carouselItem, { width: carouselWidth }]}>
            {component}
          </View>
        ))}
      </ScrollView>
      
      {/* Pagination Dots */}
      {components.length > 1 && (
        <View style={styles.pagination}>
          {components.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  carouselItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeDot: {
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
});

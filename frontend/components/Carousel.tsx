import React from "react";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions, View, StyleSheet } from "react-native";

/**
 * TO USE 
 * - Components must be an array 
 * - width and height are the percent of the screen you want to fill 
 *   e.g 30 would be 30%
 */
interface CarouselProps {
  components: React.ReactNode[]; 
  width: number; 
  height: number; 
}

export default function MyCarousel({ components, width, height }: CarouselProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const carouselWidth = (width / 100) * screenWidth;
  const carouselHeight = (height / 100) * screenHeight;

  return (
    <View style={[styles.carouselContainer, { width: carouselWidth, height: carouselHeight }]}>
      <Carousel
        loop
        width={carouselWidth}
        height={carouselHeight}
        data={components}
        scrollAnimationDuration={800}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            {item}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  carouselItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink", //for testing 
    borderRadius: "16",
    marginHorizontal: 10,
   
  },
});

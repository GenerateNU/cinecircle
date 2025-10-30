import React from "react";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions, View, StyleSheet } from "react-native";

interface CarouselProps {
  components: React.ReactNode[];
  width: number; // percentage of screen width
  height: number; // percentage of screen height
}

export default function MyCarousel({ components, width, height }: CarouselProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const carouselWidth = (width / 100) * screenWidth;
  const carouselHeight = (height / 100) * screenHeight;

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        mode="horizontal"
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
    width: "auto", 
    height: "25vw", 
  },
  carouselItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink", //for testing 
    borderRadius: "25px",
    marginHorizontal: 10,
   
  },
});

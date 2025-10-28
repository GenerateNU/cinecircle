import React from "react";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions, View } from "react-native";
import "./Carousel.css";

interface CarouselProps {
  components: React.ReactNode[];
  width: number; // percentage of screen width
  height: number; // percentage of screen height
}

export default function MyCarousel({
  components,
  width,
  height,
}: CarouselProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const carouselWidth = (width / 100) * screenWidth;
  const carouselHeight = (height / 100) * screenHeight;

  return (
    <Carousel
      width={carouselWidth}
      height={carouselHeight}
      data={components}
      scrollAnimationDuration={1000}
      renderItem={({ item }) => (
        <div className = "carousel-item">
          {item}
        </div>
      )}
    />
  );
}


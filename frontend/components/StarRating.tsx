import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { styles } from "../styles/StarRating.styles";

interface StarRatingProps {
  maxStars?: number;
  initialRating?: number;
  rating?: number;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({ 
  maxStars = 5, 
  initialRating = 0, 
  rating: controlledRating, 
  onRatingChange 
}: StarRatingProps) {
  const [internalRating, setInternalRating] = useState(initialRating);
  
  const rating = controlledRating !== undefined ? controlledRating : internalRating;
  const isInteractive = onRatingChange !== undefined;

  const handleStarPress = (selectedRating: number) => {
    if (!isInteractive) return;
    
    setInternalRating(selectedRating);
    onRatingChange(selectedRating);
  };

  const getStarFillPercentage = (starNumber: number) => {
    if (rating >= starNumber) return 100;
    if (rating < starNumber - 1) return 0;
    return (rating - (starNumber - 1)) * 100;
  };

  const StarIcon = ({ fillPercentage }: { fillPercentage: number }) => {
    const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
    
    return (
      <Svg width={32} height={32} viewBox="0 0 24 24">
        <Defs>
          <LinearGradient id={`grad-${fillPercentage}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset={`${fillPercentage}%`} stopColor="#FFD700" stopOpacity="1" />
            <Stop offset={`${fillPercentage}%`} stopColor="#D1D5DB" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d={starPath}
          fill={`url(#grad-${fillPercentage})`}
        />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      {[...Array(maxStars)].map((_, index) => {
        const starNumber = index + 1;
        const fillPercentage = getStarFillPercentage(starNumber);
        const StarContainer = isInteractive ? TouchableOpacity : View;
        
        return (
          <StarContainer
            key={index}
            onPress={isInteractive ? () => handleStarPress(starNumber) : undefined}
            activeOpacity={isInteractive ? 0.7 : 1}
          >
            <StarIcon fillPercentage={fillPercentage} />
          </StarContainer>
        );
      })}
    </View>
  );
}
import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
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
  onRatingChange,
}: StarRatingProps) {
  const [internalRating, setInternalRating] = useState(initialRating);

  const rating = controlledRating !== undefined ? controlledRating : internalRating;
  const isInteractive = onRatingChange !== undefined;

  const handleStarPress = (selectedRating: number) => {
    if (!isInteractive) return;

    const newRating = selectedRating === rating ? 0 : selectedRating;

    setInternalRating(newRating);
    onRatingChange(newRating);
  };

  const isFilled = (starNumber: number) => starNumber <= rating;

  return (
    <View style={styles.container}>
      {[...Array(maxStars)].map((_, index) => {
        const starNumber = index + 1;
        const StarContainer = isInteractive ? TouchableOpacity : View;

        return (
          <StarContainer
            key={index}
            onPress={isInteractive ? () => handleStarPress(starNumber) : undefined}
            activeOpacity={isInteractive ? 0.7 : 1}
            style={isFilled(starNumber) ? styles.filledStarContainer : styles.emptyStarContainer}
          >
            <MaterialIcons
              name={isFilled(starNumber) ? "star" : "star-border"}
              style={isFilled(starNumber) ? styles.starFilled : styles.starEmpty}
            />
          </StarContainer>
        );
      })}
    </View>
  );
}

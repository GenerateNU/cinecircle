import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Svg, { Path, Defs, RadialGradient, Stop, ClipPath, Rect, G } from "react-native-svg";
import { styles } from "../styles/StarRating.styles";

interface StarRatingProps {
  maxStars?: number;
  initialRating?: number;
  rating?: number;
  onRatingChange?: (rating: number) => void;
  size?: 16 | 24; // Size in pixels (16x16 or 24x24)
}

export default function StarRating({ 
  maxStars = 5, 
  initialRating = 0, 
  rating: controlledRating, 
  onRatingChange,
  size = 24
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

  const StarIcon = ({ fillPercentage, index }: { fillPercentage: number; index: number }) => {
    const starPath = "M8.62402 0.767822C8.84878 0.0774778 9.82505 0.0774786 10.0498 0.767822L11.5684 5.44165C11.7357 5.95668 12.2163 6.30591 12.7578 6.30591H17.6719C18.3984 6.30591 18.7001 7.2353 18.1123 7.66235L14.1367 10.551C13.6988 10.8693 13.5154 11.4336 13.6826 11.9485L15.2012 16.6223C15.4256 17.3131 14.6356 17.8876 14.0479 17.4612L10.0713 14.5725C9.63324 14.2543 9.04059 14.2543 8.60254 14.5725L4.62598 17.4612C4.03824 17.8876 3.2482 17.3131 3.47266 16.6223L4.99121 11.9485C5.15844 11.4336 4.97504 10.8693 4.53711 10.551L0.561523 7.66235C-0.0262619 7.2353 0.275411 6.30591 1.00195 6.30591H5.91602C6.45755 6.30591 6.93813 5.95668 7.10547 5.44165L8.62402 0.767822Z";
    
    const radialGradientId = `radial-gradient-${index}`;
    const clipPathId = `clip-${index}`;
    const viewBoxWidth = 19;
    const clipWidth = (viewBoxWidth * fillPercentage) / 100;
    
    return (
      <Svg width={size} height={size} viewBox="0 0 19 18">
        <Defs>
          {/* Radial gradient for filled stars */}
          <RadialGradient 
            id={radialGradientId}
            cx="50%" 
            cy="50%" 
            r="50%"
            gradientUnits="objectBoundingBox"
          >
            <Stop offset="0%" stopColor="#FEF0C1" />
            <Stop offset="100%" stopColor="#F6BF01" />
          </RadialGradient>
          
          {/* Clip path for partial fills - left to right */}
          <ClipPath id={clipPathId}>
            <Rect x="0" y="0" width={clipWidth} height="18" />
          </ClipPath>
        </Defs>
        
        {/* Background star (gray/empty) */}
        <Path
          d={starPath}
          fill="#E5E7EB"
          stroke="#CF9D06"
          strokeWidth="0.5"
        />
        
        {/* Foreground star (gold/filled) - clipped to show partial */}
        {fillPercentage > 0 && (
          <G clipPath={`url(#${clipPathId})`}>
            <Path
              d={starPath}
              fill={`url(#${radialGradientId})`}
              stroke="#CF9D06"
              strokeWidth="0.5"
            />
          </G>
        )}
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
            <StarIcon fillPercentage={fillPercentage} index={index} />
          </StarContainer>
        );
      })}
    </View>
  );
}
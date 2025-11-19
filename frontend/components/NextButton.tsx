import { TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/NextButton.styles"

interface NextButtonProps {
  title?: string;
  onPress: () => void;
  size?: "xs" | "small" | "medium" | "large";
  variation?: "variation1" | "variation2";
  disabled?: boolean;
}

export default function NextButton({ 
  title = "Next", 
  onPress, 
  size = "medium", 
  variation = "variation1",
  disabled = false 
}: NextButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        styles[size], 
        styles[variation],
        disabled && styles.disabled
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[
        styles.text, 
        variation === "variation1" ? styles.textVariation1 : styles.textVariation2,
        disabled && styles.disabledText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
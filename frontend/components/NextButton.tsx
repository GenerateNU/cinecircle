import { TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/NextButton.styles"

interface NextButtonProps {
  title?: string;
  onPress: () => void;
  size?: "xs" | "small" | "medium" | "large";
  variation?: "variation1" | "variation2";
}

export default function NextButton({ title = "Next", onPress, size = "medium", variation = "variation2" }: NextButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[size], styles[variation]]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, variation === "variation1" ? styles.textVariation1 : styles.textVariation2]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { styles } from "../styles/NextButton.styles"

interface NextButtonProps {
  onPress: () => void;
  size?: "xs" | "small" | "medium" | "large";
}


export default function NextButton({ onPress, size = "medium" }: NextButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[size]]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>Next</Text>
    </TouchableOpacity>
  );
}

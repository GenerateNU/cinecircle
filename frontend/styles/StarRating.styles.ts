import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.0125,
  },
  filledStarContainer: {
    opacity: 1,
  },
  emptyStarContainer: {
    opacity: 0.3,
  },
  star: {
    fontSize: width * 0.07,
    color: "#9A0169",
  },
});
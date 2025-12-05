import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: width * 0.03,
  },
  reactionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.03,
  },
});
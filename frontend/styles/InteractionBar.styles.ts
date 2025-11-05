import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.03,
    paddingVertical: height * 0.01,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.015,
    minWidth: width * 0.03,
  },
  icon: {
    fontSize: width * 0.05,
    color: "#666",
  },
  likedIcon: {
    fontSize: width * 0.05,
    color: "#9A0169",
  },
  count: {
    fontSize: width * 0.0325,
    color: "#666",
    fontWeight: "500",
  },
});
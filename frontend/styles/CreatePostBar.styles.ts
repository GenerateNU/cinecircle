import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.012,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  backWrapper: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
    fontSize: width * 0.05,
    color: "#9A0169",
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
  },

  title: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "#000",
  },

  disabled: {
    backgroundColor: "#d0d0d0",
  },

  nextText: {
    color: "#fff",
    fontSize: width * 0.035,
    fontWeight: "600",
  },

  disabledText: {
    color: "#999",
  },
});
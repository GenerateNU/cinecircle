import { StyleSheet, Dimensions } from "react-native";

const {width, height} = Dimensions.get("window");

export const styles = StyleSheet.create({
  button: {
    borderColor: "#9A0169",
    borderRadius: width * 0.025,
    borderWidth: width * 0.005,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.012,
    alignSelf: "flex-start",
  },
  xs: {
    paddingHorizontal: width * 0.075,
  },
  small: {
    paddingHorizontal: width * 0.2,
  },
  medium: {
    paddingHorizontal: width * 0.3, 
  },
  large: {
    paddingHorizontal: width * 0.42
  },
  text: {
    color: "#9A0169",
    fontWeight: "500",
    fontSize: width * 0.045
  },
});
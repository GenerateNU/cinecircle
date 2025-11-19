import { StyleSheet, Dimensions } from "react-native";

const {width, height} = Dimensions.get("window");

export const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    borderWidth: width * 0.005,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.009,
  },
  variation1: {
    borderColor: "#DE5837",
    backgroundColor: "#F7D5CD",
  },
  variation2: {
    borderColor: "#561202",
    backgroundColor: "#AB2504",
  },
  xs: {
    width: width * 0.25, 
  },
  small: {
    width: width * 0.45, 
  },
  medium: {
    width: width * 0.75,   
  },
  large: {
    width: width * 0.85,
  },
  text: {
    fontWeight: "400",
    fontSize: width * 0.035
  },
  textVariation1: {
    color: "#D62E05",
  },
  textVariation2: {
    color: "#FFFFFF",
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#ccc',
    },
    disabledText: {
    color: '#666',
    },
});
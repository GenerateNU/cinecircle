import { StyleSheet, Dimensions } from "react-native";

const {width, height} = Dimensions.get("window");

export const styles = StyleSheet.create({
  button: {
    borderRadius: width * 0.025,
    borderWidth: width * 0.005,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.012,
    alignSelf: "flex-start",
  },
  variation1: {
    borderColor: "#5C013F",
    backgroundColor: "#9A0169",
  },
  variation2: {
    borderColor: "#C45AA2",
    backgroundColor: "#C45AA233",
  },
  xs: {
    width: width * 0.25, 
  },
  small: {
    width: width * 0.45, 
  },
  medium: {
    width: width * 0.65,   
  },
  large: {
    width: width * 0.85,
  },
  text: {
    fontWeight: "400",
    fontSize: width * 0.045
  },
  textVariation1: {
    color: "#FFFFFF",
  },
  textVariation2: {
    color: "#C45AA2CC",
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#ccc',
    },
    disabledText: {
    color: '#666',
    },
});
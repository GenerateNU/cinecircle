import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1, // 1 = "thin", not hard-coded 1px
    borderTopColor: "#9A0169",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.015,
  },
  item: { alignItems: "center", justifyContent: "center" },
  postButton: { color: "#000", fontSize: width * 0.105},
  activeIcon: { 
    color: "#9A0169", 
    fontWeight: "600",
    fontSize: width * 0.07 
  },
  icon: { 
    color: "#9A0169", 
    fontWeight: "100", 
    opacity: 0.6, 
    fontSize: width * 0.07
  },
});
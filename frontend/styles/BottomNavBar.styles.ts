import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bar: {
    height: 60,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingBottom: 10,
    paddingTop: 10,
    justifyContent: "space-around",
  },
  item: { alignItems: "center", justifyContent: "center" },
  activeIcon: { color: "#9A0169", fontWeight: "600" },
  icon: { color: "#9A0169", fontWeight: "100", opacity: 0.6, },
});
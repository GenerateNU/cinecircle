import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  title: {
      fontSize: width * 0.06,
      fontWeight: "500",
      marginBottom: height * 0.03,
      color: '#D62E05'
  },
  button: {
    width: "100%",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#16737C",
    backgroundColor: "#E0F7FA",
    justifyContent: "space-between",
    paddingVertical: height * 0.011,
    paddingHorizontal: width * 0.015,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  text: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  arrow: {
    fontSize: 18,
    color: "#00BFA5",
  },
  dropdown: {
    width: "100%",
    marginTop: 8,
    gap: 8,
  },
  dropdownItem: {
    paddingVertical: height * 0.011,
    paddingHorizontal: width * 0.015,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#16737C",
  },
  selectedItem: {
    backgroundColor: "#E0F7FA",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  selectedText: {
    color: "#16737C",
    fontWeight: "600",
  },
});
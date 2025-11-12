import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  // darker unliked heart
  icon: {
    fontSize: 28,
    color: "#555", // previously #ccc — darker gray
  },
  likedIcon: {
    fontSize: 28,
    color: "#e63946",
  },
  emailText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
  },
});

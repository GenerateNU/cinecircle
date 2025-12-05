import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 4,
  },

  starContainer: {
    marginHorizontal: 6,
  },

  filledStarContainer: {
    padding: 4,
  },

  emptyStarContainer: {
    padding: 4,
  },

  starFilled: {
    fontSize: 30,
    color: "#F6BF01",  
  },

  starEmpty: {
    fontSize: 30,
    color: "#C4C4C4",  
  },
});

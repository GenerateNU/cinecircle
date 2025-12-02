import { StyleSheet } from "react-native";

const baseButton = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 4,
  minWidth: 42,
  borderWidth: 1,
  borderColor: "transparent",
};

export const styles = StyleSheet.create({
  reactionButton: {
    ...baseButton,
  },
  reactionButtonSelected: {
    ...baseButton,
    borderColor: "#FFB6A4",
    borderStyle: "solid",
    borderWidth: 1,
    // shadowColor: "#FF0000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 3.5,
    // elevation: 3,
    boxShadow: "2px 2px 3.5px 0 rgba(255, 0, 0, 0.15) inset, -2px -2px 3.5px 0 rgba(255, 0, 0, 0.30) inset, 0 2px 2px 0 rgba(255, 236, 231, 0.70) inset",
  },
  reactionEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: "#000",
    fontFamily: "Figtree",
    fontWeight: "400",
    minWidth: 12,
    textAlign: "center",
  },
  selectedCount: {
    color: "#C2391F",
  },
});

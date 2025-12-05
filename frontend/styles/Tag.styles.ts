import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        alignItems: "center",
        backgroundColor: "#D1E9EB",
        borderWidth: 1.5,
        borderRadius: 48,
        borderColor: 'rgba(27, 144, 155, 0.80)',
        paddingVertical: height * 0.006,
        paddingHorizontal: width * 0.04,
        shadowColor: 'rgba(0, 106, 107, 0.20)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    text: {
        color: "#1B909B",
        fontWeight: "400",
        fontSize: width * 0.04
    },
    pressed: {
        color: "#FFFFFF",
        backgroundColor: "#1B909B",
        borderColor: "rgba(0, 106, 107, 0.80)",
    },
    pressedText: {
        color: "#FFFFFF"
    }
})
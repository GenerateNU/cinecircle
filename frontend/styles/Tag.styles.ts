import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderRadius: width * 0.05,
        borderColor: '#16737C',
        paddingVertical: height * 0.006,
        paddingHorizontal: width * 0.04,
    },
    text: {
        color: "#333",
        fontWeight: "400",
        fontSize: width * 0.04
    },
    pressed: {
        backgroundColor: "#E0F7FA",
        borderColor: "#16737C",
    },
    pressedText: {
        color: "#16737C",
    }
})
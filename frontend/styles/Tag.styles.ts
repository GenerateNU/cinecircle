import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: width * 0.05,
        borderColor: '#333',
        paddingVertical: height * 0.005,
        paddingHorizontal: width * 0.04,
    },
    text: {
        fontWeight: "400",
        fontSize: width * 0.04
    },
    pressed: {
        color: "#FFFFFF",
        backgroundColor: "#9A0169",
        borderColor: "#9A0169",
    },
    pressedText: {
        color: "#FFFFFF"
    }
})
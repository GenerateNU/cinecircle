import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        alignItems: "center",
        backgroundColor: "#F4E5F0",
        borderWidth: 2,
        borderRadius: width * 0.05,
        borderColor: '#9A0169CC',
        paddingVertical: height * 0.006,
        paddingHorizontal: width * 0.04,
    },
    text: {
        color: "#9A0169",
        fontWeight: "400",
        fontSize: width * 0.04
    },
    pressed: {
        color: "#FFFFFF",
        backgroundColor: "#9A0169",
        borderColor: "#5C013F",
    },
    pressedText: {
        color: "#FFFFFF"
    }
})
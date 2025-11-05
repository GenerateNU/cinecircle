import { Dimensions, StyleSheet } from "react-native"

const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
    title: {
        fontSize: width * 0.05,
        fontWeight: "500",
        marginBottom: height * 0.02,
        color: '#000'
    },
    field: {
        fontSize: width * 0.04,
        fontWeight: '500',
        marginBottom: height * 0.006,
        color: '#000'
    },
    input: {
        fontSize: width * 0.035,
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.03,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        marginBottom: height * 0.005
    },
    subtext: {
        fontSize: width * 0.035,
        color: '#888888',
        marginTop: height * 0.005,
    },
});

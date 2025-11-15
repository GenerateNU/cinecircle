import { Dimensions, StyleSheet } from "react-native"

const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
    title: {
        fontSize: width * 0.06,
        fontWeight: "500",
        marginBottom: height * 0.0025,
        color: '#D62E05'
    },
    titleWrapper: {
        marginBottom: height * 0.03,
    },
    field: {
        fontSize: width * 0.0425,
        fontWeight: '500',
        marginBottom: height * 0.006,
        color: '#D62E05'
    },
    input: {
        fontSize: width * 0.035,
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.03,
        borderWidth: 1,
        borderColor: '#D62E05',
        borderRadius: 4,
        marginBottom: height * 0.005
    },
    subtext: {
        fontSize: width * 0.03,
        color: '#888888',
        marginTop: height * 0.005,
    },
});

import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: height * 0.08,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: '600',
        color: '#9A0169',
        marginTop: height * 0.015,
        fontSize: width * 0.08,
    },
    buttonContainer: {
        gap: height * 0.02,
        alignItems: 'center',
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
        marginBottom: height * 0.02,
    }
});
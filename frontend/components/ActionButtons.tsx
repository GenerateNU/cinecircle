import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
export default function ActionButtons() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonIcon}>:bell:</Text>
                <Text style={styles.buttonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonIcon}>:eye:</Text>
                <Text style={styles.buttonText}>Watch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonIcon}>:bookmark:</Text>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007AFF',
    },
    buttonIcon: {
        fontSize: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 4,
    },
});

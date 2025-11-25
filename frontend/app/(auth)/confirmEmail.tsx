import { View, Text, StyleSheet } from 'react-native';

export default function ConfirmEmail() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Check your email! 📧</Text>
            <Text style={styles.message}>
                We've sent a confirmation link to your email address. 
                Please click the link to verify your account.
            </Text>
            <Text style={styles.submessage}>
                Once confirmed, you'll automatically continue to the next step.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        marginBottom: 12,
        lineHeight: 24,
    },
    submessage: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        marginTop: 8,
    },
});
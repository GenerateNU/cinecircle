import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ConfirmEmail() {
    useEffect(() => {
        // Listen for auth state changes (including email confirmation)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // When email is confirmed, Supabase fires an auth state change
            if (session?.user?.email_confirmed_at) {
                router.replace('/onboarding/username');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

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
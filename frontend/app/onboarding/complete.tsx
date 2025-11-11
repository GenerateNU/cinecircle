import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useOnboarding } from './_layout';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Complete() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data, resetData } = useOnboarding();
    const { user, setOnboardingComplete } = useAuth();

    useEffect(() => {
        // Automatically create profile when screen loads
        createProfile();
    }, []);

    const createProfile = async () => {
        if (!user) {
            setError('No user found');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Create user profile in database
            const { error: insertError } = await supabase
                .from('UserProfile')
                .insert({
                    id: user.id,
                    username: data.username,
                    profile_picture: data.profilePicture,
                    country: data.country,
                    city: data.city,
                    primary_language: data.language,
                    secondary_languages: data.secondaryLanguages || [],
                    favorite_genres: data.genres || [],
                });

            if (insertError) throw insertError;

            // Mark onboarding as complete
            setOnboardingComplete(true);
            
            // Clear onboarding data
            resetData();

            // We can put an animation or an incentive here
            setTimeout(() => {
                router.replace('/');
            }, 1000);

        } catch (err: any) {
            console.error('Error creating profile:', err);
            setError(err.message || 'Failed to create profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Creating your profile...</Text>
                <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Oops! Something went wrong</Text>
                <Text style={styles.error}>{error}</Text>
                <Text style={styles.retry} onPress={createProfile}>
                    Tap to retry
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>All set! 🎉</Text>
            <Text style={styles.subtitle}>Welcome to CineCircle</Text>
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
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: { 
        fontSize: 18, 
        color: '#666',
        textAlign: 'center',
    },
    loader: {
        marginTop: 20,
    },
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginVertical: 20,
    },
    retry: {
        fontSize: 16,
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
});
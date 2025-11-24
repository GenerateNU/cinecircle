import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useOnboarding } from './_layout';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/userService';

export default function Complete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data, resetData } = useOnboarding();
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    completeOnboarding();
  }, []);

  const completeOnboarding = async () => {
    if (!user) {
      setError('No user found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Update user profile via backend API
      await updateUserProfile({
        username: data.username,
        primaryLanguage: data.primaryLanguage,
        secondaryLanguage: data.secondaryLanguage,
        profilePicture: data.profilePicture,
        country: data.country,
        city: data.city,
        favoriteGenres: data.favoriteGenres,
        onboardingCompleted: true,
      });

      // Refresh profile in AuthContext to get updated data
      await refreshProfile();
      
      // Clear onboarding data
      resetData();

      // Show success message briefly before redirect
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 1500);
    } catch (err: any) {
      console.error('Error completing onboarding:', err);
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Creating your profile...</Text>
        <ActivityIndicator size="large" color="#9A0169" style={styles.loader} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Oops! Something went wrong</Text>
        <Text style={styles.error}>{error}</Text>
        <Text style={styles.retry} onPress={completeOnboarding}>
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
    backgroundColor: '#fff',
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
    color: '#ff3b30',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  retry: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
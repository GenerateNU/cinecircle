import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, profileLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Wait for both auth and profile to load
    if (loading || profileLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const atRoot = !segments.length;

    // Case 1: Not authenticated -> redirect to auth
    if (!user) {
      if (!inAuthGroup) {
        router.replace('/(auth)/welcome');
      }
      return;
    }

    // Case 2: Authenticated but no profile yet -> wait
    if (!profile) {
      return;
    }

    // Case 3: Authenticated with profile, onboarding incomplete
    if (!profile.onboardingCompleted) {
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)/username');
      }
      return;
    }

    // Case 4: Authenticated and onboarding complete
    if (profile.onboardingCompleted) {
      if (inOnboardingGroup || inAuthGroup || atRoot) {
        router.replace('/(tabs)/movies');
      }
    }
  }, [user, profile, loading, profileLoading, segments]);

  // Show loading while guard evaluates routing
  if (loading || profileLoading || !segments.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CineCircle</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
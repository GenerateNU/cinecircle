import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9A0169" />
      </View>
    );
  }

  // Not authenticated -> go to auth
  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // Authenticated but needs onboarding
  if (profile && !profile.onboardingCompleted) {
    return <Redirect href="/(onboarding)/username" />;
  }

  // Fully onboarded -> go to tabs
  return <Redirect href="/(tabs)/home" />;
}
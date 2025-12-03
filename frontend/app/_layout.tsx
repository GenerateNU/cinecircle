import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, Text, ActivityIndicator } from 'react-native';
import tw from 'twrnc';

function RootNavigator() {
  const { user, profile, loading, profileLoading } = useAuth();

  // Show loading screen while checking auth
  if (loading || profileLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`text-2xl font-bold mb-4`}>CineCircle</Text>
        <ActivityIndicator size="large" color="#9A0169" />
      </View>
    );
  }

  const isAuthenticated = !!user;
  const needsOnboarding = isAuthenticated && profile !== null && !profile.onboardingCompleted;
  const isFullyOnboarded = isAuthenticated && profile !== null && profile.onboardingCompleted === true;

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Protected: Only accessible when NOT authenticated */}
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        {/* Protected: Only accessible when authenticated but needs onboarding */}
        <Stack.Protected guard={needsOnboarding}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>

        {/* Protected: Only accessible when fully authenticated and onboarded */}
        <Stack.Protected guard={isFullyOnboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="movies/[movieId]" options={{ headerShown: false }} />
          <Stack.Screen name="events" options={{ headerShown: false }} />
          <Stack.Screen name="profilePage" options={{ headerShown: false }} />
          <Stack.Screen name="search" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Index is always accessible - it handles initial routing */}
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
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
  const needsOnboarding =
    isAuthenticated && profile !== null && !profile.onboardingCompleted;
  const isFullyOnboarded =
    isAuthenticated && profile !== null && profile.onboardingCompleted === true;

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animation: 'slide_from_right',
        }}
      >
        {/* Protected: Only accessible when NOT authenticated */}
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
        </Stack.Protected>

        {/* Protected: Only accessible when authenticated but needs onboarding */}
        <Stack.Protected guard={needsOnboarding}>
          <Stack.Screen
            name="(onboarding)"
            options={{ gestureEnabled: false }}
          />
        </Stack.Protected>

        {/* Protected: Only accessible when fully authenticated and onboarded */}
        <Stack.Protected guard={isFullyOnboarded}>
          <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="movies/[movieId]" />
          <Stack.Screen name="events" />
          <Stack.Screen name="profilePage" />
          <Stack.Screen name="search" />
        </Stack.Protected>

        {/* Index is always accessible - it handles initial routing */}
        <Stack.Screen name="index" options={{ gestureEnabled: false }} />
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

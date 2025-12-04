import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, Text, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { supabase } from '../lib/supabase';
import { useURL } from 'expo-linking';
import { useEffect } from 'react';

function RootNavigator() {
  const { user, profile, loading, profileLoading } = useAuth();
  const url = useURL();

  useEffect(() => {
    if (!url) return;
  
    console.log("Deep link received:", url);
  
    const hashIndex = url.indexOf('#');
  
    if (hashIndex === -1) {
      console.log("No hash detected in URL.");
      return;
    }
  
    // get everything after #
    const hash = url.substring(hashIndex + 1);
    const params = Object.fromEntries(new URLSearchParams(hash));
  
    const access_token = params.access_token;
    const refresh_token = params.refresh_token;
  
  
    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ data, error }) => {
          if (error) console.error("Session set error:", error);
          else console.log("Session restored:", data.session);
  
        });
    } else {
      console.log("No tokens found in hash params.");
    }
  }, [url]);
  


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

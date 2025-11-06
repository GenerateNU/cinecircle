import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Slot, useSegments, Stack, router } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';
import BottomNavBar from '../components/BottomNavBar';

function RootLayoutContent() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inOnboarding = segments[0] === 'onboarding';
    const onLoginScreen = segments[0] === 'login';
    const mainAppRoutes = ['movies', 'events', 'profile', 'profilePage'];
    const inMainApp = mainAppRoutes.includes(segments[0]);

    if (!user && !inOnboarding && !onLoginScreen) {
      router.replace('/onboarding/welcome');
    } else if (user && (inOnboarding || onLoginScreen)) {
      router.replace('/homes');
    }
  }, [user, loading, segments]);

  // Splash while checking session
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.title}>CineCircle</Text>
        <Text>Loading…</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  // Logged in -> mount Router navigator
  return (
    <SafeAreaProvider>
      <Slot />
      {user && <BottomNavBar />}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { OnboardingGuard } from '../components/OnboardingGuard';
import BottomNavBar from '../components/BottomNavBar';

function RootLayoutContent() {
  const { user, loading } = useAuth();
  const segments = useSegments();

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

  const inTabsGroup = segments[0] === '(tabs)';

  return (
    <SafeAreaProvider>
      <OnboardingGuard>
        <Stack screenOptions={{ headerShown: false }} />
        {user && inTabsGroup && <BottomNavBar />}
      </OnboardingGuard>
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
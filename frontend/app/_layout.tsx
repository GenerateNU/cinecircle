import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthForm from '../components/AuthForm';
import { AuthProvider, useAuth } from '../context/AuthContext';
import BottomNavBar from '../components/BottomNavBar';

function RootLayoutContent() {
  const { user, loading } = useAuth();

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

  // Not logged in -> show Auth form
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CineCircle Frontend</Text>
        <AuthForm onAuthSuccess={() => {}} />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Logged in -> mount Router navigator
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="profilePage/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profilePage/settings"
          options={{ headerShown: false, presentation: 'modal' }}
        />
      </Stack>
      <BottomNavBar />
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

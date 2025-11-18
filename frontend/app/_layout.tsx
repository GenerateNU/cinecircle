import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';
import BottomNavBar from '../components/BottomNavBar';

function RootLayoutContent() {
  const { user } = useAuth();

  return (
    <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
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
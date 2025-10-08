import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import AuthForm from './components/AuthForm';
import UserDashboard from './components/UserDashboard';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CineCircle Frontend</Text>
      <NavigationContainer>
        <RootNavigator />
        {!user ? (
          <AuthForm onAuthSuccess={setUser} />
        ) : (
          <UserDashboard user={user} onSignOut={() => setUser(null)} />
        )}
      </NavigationContainer>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});

import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './lib/supabase';
import AuthForm from './components/AuthForm';
import UserDashboard from './components/UserDashboard';
import PostScreen from './PostScreen';

const Stack = createNativeStackNavigator();

function AuthScreen({ onAuthSuccess }: { onAuthSuccess: (user: any) => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CineCircle Frontend</Text>
      <AuthForm onAuthSuccess={onAuthSuccess} />
      <StatusBar style="auto" />
    </View>
  );
}

function DashboardScreen({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CineCircle Frontend</Text>
      <UserDashboard user={user} onSignOut={onSignOut} />
      <StatusBar style="auto" />
    </View>
  );
}

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth">
            {(props) => <AuthScreen {...props} onAuthSuccess={setUser} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Dashboard">
              {(props) => <DashboardScreen {...props} user={user} onSignOut={() => setUser(null)} />}
            </Stack.Screen>
            <Stack.Screen 
              name="PostScreen" 
              component={PostScreen}
              options={{ headerShown: true, title: 'Create Post' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});
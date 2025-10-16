import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import AuthForm from './components/AuthForm';
import UserDashboard from './components/UserDashboard';
import ProfilePage from './components/ProfilePage';
import PostScreen from './components/PostScreen';

// ✅ React Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Define routes for our stack
export type RootStackParamList = {
  Dashboard: { user: any; onSignOut: () => void };
  Profile: undefined;
  Post: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
    });
  }, []);

  // ⛔️ Not logged in → show AuthForm
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CineCircle Frontend</Text>
        <AuthForm onAuthSuccess={setUser} />
        <StatusBar style="auto" />
      </View>
    );
  }

  // ✅ Logged in → load navigation container
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Dashboard"
          children={() => (
            <UserDashboard user={user} onSignOut={() => setUser(null)} />
          )}
        />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Post" component={PostScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

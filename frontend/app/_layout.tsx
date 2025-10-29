// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../context/AuthContext';

export default function RootLayout() {
  const [user, setUser] = useState<any | null>(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setBooted(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Splash while checking session
  if (!booted) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.title}>CineCircle</Text>
        <Text>Loading…</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  // Not logged in → show Auth form
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CineCircle Frontend</Text>
        <AuthForm onAuthSuccess={setUser} />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Logged in → provide context and mount a Router navigator
  return (
    <SafeAreaProvider>
    <AuthContext.Provider value={{ user, signOut }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="profilePage/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="profilePage/settings"
          options={{ headerShown: false, presentation: 'modal' }}
        />
      </Stack>
    </AuthContext.Provider>
    <StatusBar style="auto" />
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});

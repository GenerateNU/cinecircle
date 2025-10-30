// frontend/App.tsx
import React, { useEffect, useState, createContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { supabase } from './lib/supabase';
import AuthForm from './components/AuthForm';

// Optional: expose the authed user to screens via context
export const AuthContext = createContext<{
  user: any;
  signOut: () => Promise<void>;
}>({
  user: null,
  signOut: async () => {},
});

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    // initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setBooted(true);
    });

    // listen for auth state changes
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

  // simple splash while checking session
  if (!booted) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.title}>CineCircle</Text>
        <Text>Loading…</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  // Not logged in → show Auth form (no navigation container needed)
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CineCircle Frontend</Text>
        <AuthForm onAuthSuccess={setUser} />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Logged in → hand over to Expo Router pages via <Slot />
  return (
    <GestureHandlerRootView>
    <SafeAreaProvider>
      <AuthContext.Provider value={{ user, signOut }}>
        <Slot />
      </AuthContext.Provider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});

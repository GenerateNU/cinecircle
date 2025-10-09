import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProjectNavigator from './ProjectNavigator';
import LoginNavigator from './LoginNavigator';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes and update user state accordingly
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
       listener?.subscription?.unsubscribe(); 
    };
  }, []);

  if (isLoading) {
    return null; // or a loading screen
  }

  return user ? (
    <Stack.Navigator>
      <Stack.Screen
        name="Project"
        component={ProjectNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  ) : <LoginNavigator />;
}
import { Stack } from 'expo-router';
import { useURL } from 'expo-linking';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import * as Linking from "expo-linking";

export default function AuthLayout() {
  const url = useURL(); // captures deep links like cinecircle://username#...

  useEffect(() => {
    if (!url) return;
  
    console.log("Deep link received:", url);
  
    const parsed = Linking.parse(url);
    const { access_token, refresh_token } = parsed.queryParams ?? {};

  
    if (access_token && refresh_token && typeof access_token === 'string' && typeof refresh_token === 'string') {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      }).then(({ data, error }) => {
        if (error) console.error("Session set error:", error);
        else console.log("Session restored:", data.session);
      });
    } else {
      console.log("No tokens found in URL.");
    }
  
  }, [url]);


  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
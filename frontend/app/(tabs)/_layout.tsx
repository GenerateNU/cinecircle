import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="movies" />
      <Stack.Screen name="post" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
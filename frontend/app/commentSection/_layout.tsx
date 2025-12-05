import { Stack } from 'expo-router';

export default function CommentSectionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="thread" />
    </Stack>
  );
}

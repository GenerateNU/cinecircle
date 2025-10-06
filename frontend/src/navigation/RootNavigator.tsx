import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProjectNavigator from './ProjectNavigator';
import LoginNavigator from './LoginNavigator';

const Stack = createNativeStackNavigator();

// Navigates user to the log in screen if seesion is not found (i.e. user not logged in)
export default function RootNavigator() {

  /*
  WHEN AUTH IS IMPLEMENTED
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null; // or some loading screen
  }
  
  return session ? (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="project" component={ProjectNavigator} />
    </Stack.Navigator>
  ) : <LoginNavigator />;
  */

  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="project" component={ProjectNavigator} />
    </Stack.Navigator>
  );
}
import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/login/SpalshScreen';
import LoginScreen from '../screens/login/LoginScreen';
import OnboardingScreen from '../screens/login/OnboardingScreen';
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import EventsScreen from '../screens/events/EventsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function CineCircleNavigator() {
  return (
    <Stack.Navigator initialRouteName="splash">
      <Stack.Screen
        name="splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{
          header: (props) => (
            <SafeAreaView > 
              <Text>
                Log In
              </Text>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          header: (props) => (
            <SafeAreaView > 
              <Text>
                Home
              </Text>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="search"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Stack.Screen
        name="events"
        component={EventsScreen}
        options={{ title: 'Events' }}
      />
      <Stack.Screen
        name="profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

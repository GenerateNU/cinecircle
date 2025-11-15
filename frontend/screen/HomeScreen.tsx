// frontend/screen/HomeScreen.tsx
import React from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import tw from 'twrnc';

import SearchBar from '../components/SearchBar';

export type HomeScreenProps = {
  user?: any;
  onSignOut?: () => Promise<void>;
};

export default function HomeScreen({ user, onSignOut }: HomeScreenProps) {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Top: centered SearchBar */}
      <View style={tw`w-full items-center`}>
        <View style={[tw`w-full`, { maxWidth: 720, alignSelf: 'center' }]}>
          <SearchBar placeholder="Search movies, events, people..." />
        </View>
      </View>

      {/* Main scrollable content */}
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={[tw`px-5 pb-28`, { paddingTop: 8 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Optional: show who’s signed in */}
        {!!user && (
          <Text style={tw`text-sm text-gray-500 mt-2`}>Signed in as {user.email}</Text>
        )}

        {/* Hero / welcome */}
        <View style={tw`mt-3`}>
          <Text style={tw`text-2xl font-bold text-black`}>Welcome 👋</Text>
          <Text style={tw`text-base text-gray-500 mt-1`}>
            Discover new films, browse events, and connect with your community.
          </Text>
        </View>

        {/* Quick actions */}
        <View style={tw`mt-6 flex-row justify-between`}>
          <TouchableOpacity
            onPress={() => router.push('/movies')}
            style={tw`flex-1 mr-2 p-4 rounded-2xl bg-gray-100`}
          >
            <Text style={tw`text-base font-semibold text-black`}>Browse Movies</Text>
            <Text style={tw`text-xs text-gray-500 mt-1`}>Trending & new releases</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/events')}
            style={tw`flex-1 ml-2 p-4 rounded-2xl bg-gray-100`}
          >
            <Text style={tw`text-base font-semibold text-black`}>Find Events</Text>
            <Text style={tw`text-xs text-gray-500 mt-1`}>Local screenings & meetups</Text>
          </TouchableOpacity>
        </View>

        {/* Featured section placeholder */}
        <View style={tw`mt-8`}>
          <Text style={tw`text-xl font-semibold text-black`}>Featured This Week</Text>
          <View style={tw`mt-3 flex-row`}>
            <View style={tw`flex-1 h-28 mr-2 rounded-2xl bg-gray-100`} />
            <View style={tw`flex-1 h-28 ml-2 rounded-2xl bg-gray-100`} />
          </View>
        </View>

        {/* Recommendations */}
        <View style={tw`mt-8`}>
          <Text style={tw`text-xl font-semibold text-black`}>Recommendations</Text>
          <View style={tw`mt-3`}>
            <View style={tw`h-20 rounded-2xl bg-gray-100 mb-3`} />
            <View style={tw`h-20 rounded-2xl bg-gray-100 mb-3`} />
            <View style={tw`h-20 rounded-2xl bg-gray-100`} />
          </View>
        </View>

        {/* Optional: sign out button */}
        {onSignOut && (
          <TouchableOpacity
            onPress={onSignOut}
            style={tw`mt-8 self-start px-4 py-2 rounded-xl bg-gray-200`}
          >
            <Text style={tw`text-black`}>Sign out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

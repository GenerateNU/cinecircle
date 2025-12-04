import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import SearchBar from '../components/SearchBar';
import TabToggle from '../components/TabToggle';
import SectionHeader from '../components/SectionHeader';
import CommentSection from '../app/commentSection/commentSection';

export type HomeScreenProps = {
  user?: any;
  onSignOut?: () => Promise<void>;
};

export default function HomeScreen({ user, onSignOut }: HomeScreenProps) {
  const screenWidth = Dimensions.get('window').width;
  const heroHeight = Math.min(screenWidth * 0.6, 320);
  const primaryNavColor = '#D62E05';
  const inactiveNavColor = '#979797';
  const navOptions = ['For You', 'Friends', 'Trending', 'Country'];
  const navTabs = navOptions.map(label => ({ key: label, label }));
  const quickActionButtons = [
    {
      label: 'Browse Movies',
      icon: <Feather name="film" size={18} color="#FFF" />,
      onPress: () => router.push('movies'),
    },
    {
      label: 'Find Events',
      icon: <Feather name="map-pin" size={18} color="#FFF" />,
      onPress: () => router.push('events'),
    },
    {
      label: 'Profile',
      icon: <Feather name="user" size={18} color="#FFF" />,
      onPress: () => router.push('profile'),
    },
  ];
  const [activeNav, setActiveNav] = React.useState(navOptions[0]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <SearchBar
        placeholder="Search posts..."
        onPress={() =>
          router.push({
            pathname: '/search',
            params: { origin: 'home', defaultCategory: 'posts' },
          })
        }
      />
      <CommentSection targetType="post" targetId="1348bdf8asfqwer" />
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={[tw`pb-28`]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View style={{ paddingBottom: 16 }}>
          <View style={{ position: 'relative' }}>
            <ImageBackground
              source={{
                uri: 'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
              }}
              style={{ width: screenWidth, height: heroHeight }}
              resizeMode="cover"
            >
              <View
                style={[tw`flex-1`, { backgroundColor: 'rgba(0,0,0,0.25)' }]}
              />
            </ImageBackground>
          </View>
        </View>

        {/* Category nav */}
        <TabToggle
          tabs={navTabs}
          activeTab={activeNav}
          onTabChange={setActiveNav}
          activeColor={primaryNavColor}
          inactiveColor={inactiveNavColor}
          indicatorColor={primaryNavColor}
          containerStyle={tw`px-5`}
        />

        {/* Feed area under nav */}
        <View style={tw`mt-6 px-5`}>
          {activeNav === 'For You' ? (
            <View>
              <SectionHeader title="For You" size="large" />
              <Text style={tw`text-sm text-gray-500 mt-2`}>
                Your personalized feed will appear here soon.
              </Text>
            </View>
          ) : (
            <View>
              <SectionHeader title={activeNav} size="large" />
              <Text style={tw`text-sm text-gray-500`}>
                Content for {activeNav} will appear here.
              </Text>
            </View>
          )}
        </View>

        {/* Optional: show who's signed in */}
        {!!user && (
          <Text style={tw`text-sm text-gray-500 mt-4 px-5`}>
            Signed in as {user.email}
          </Text>
        )}

        {/* Optional: sign out button */}
        {onSignOut && (
          <TouchableOpacity
            onPress={onSignOut}
            style={tw`mt-8 self-start px-4 py-2 rounded-xl bg-gray-200 ml-5`}
          >
            <Text style={tw`text-black`}>Sign out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

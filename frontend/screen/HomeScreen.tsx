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
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../components/SearchBar';
import TabToggle from '../components/TabToggle';
import SectionHeader from '../components/SectionHeader';
import Carousel from '../components/Carousel';

export type HomeScreenProps = {
  user?: any;
  onSignOut?: () => Promise<void>;
};

export default function HomeScreen({ user, onSignOut }: HomeScreenProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const heroHeight = Math.min(screenWidth * 0.6, 320);
  const heroHeightPercent = (heroHeight / screenHeight) * 100;
  const primaryNavColor = '#D62E05';
  const inactiveNavColor = '#979797';
  const navOptions = ['For You', 'Friends', 'Trending', 'Country'];
  const navTabs = navOptions.map(label => ({ key: label, label }));
  const heroSlides = [
    {
      uri: 'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      title: 'Across the Spider-Verse',
      subtitle: 'Miles and Gwen swing across the multiverse.',
    },
    {
      uri: 'https://image.tmdb.org/t/p/original/AtFG8L1Jf3GOMcxNnTvMXLfxJ9v.jpg',
      title: 'Dune: Part Two',
      subtitle: 'Paul and Chani stride through Arrakis dunes.',
    },
    {
      uri: 'https://image.tmdb.org/t/p/original/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
      title: 'Oppenheimer',
      subtitle: 'The Trinity test ignites the desert horizon.',
    },
    {
      uri: 'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
      title: 'The Batman',
      subtitle: 'Batman surveys Gotham from the skyline.',
    },
    {
      uri: 'https://image.tmdb.org/t/p/original/euYcyqv5J19t1SYwQ8d3tNbBlPR.jpg',
      title: 'Mad Max: Fury Road',
      subtitle: 'Furiosa leads the rig through the sandstorm.',
    },
    {
      uri: 'https://image.tmdb.org/t/p/original/wC4H1Z0YvSuFAvauGmDx5hOaP6F.jpg',
      title: 'La La Land',
      subtitle: 'Seb and Mia dance above the city lights.',
    },
    {
      uri: 'https://image.tmdb.org/t/p/original/s9Mqz1TQO2wy7h0T4z9NJ1ONwW3.jpg',
      title: 'Everything Everywhere All at Once',
      subtitle: 'Evelyn spirals through the multiverse.',
    },
    {
      uri: 'https://image.tmdb.org/t/p/original/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
      title: 'Wonder Woman',
      subtitle: 'Diana crosses No Man’s Land.',
    },
  ];
  const heroComponents = heroSlides.map(slide => (
    <ImageBackground
      source={{ uri: slide.uri }}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
      imageStyle={{ borderRadius: 12 }}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.15)']}
        style={{ flex: 1, padding: 16, justifyContent: 'flex-end', borderRadius: 12 }}
      >
        <Text style={tw`text-white text-xl font-semibold mb-1`}>{slide.title}</Text>
        <Text style={tw`text-white text-sm`}>{slide.subtitle}</Text>
      </LinearGradient>
    </ImageBackground>
  ));
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
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={[tw`pb-28`]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero carousel */}
        <View style={{ paddingBottom: 16 }}>
          <Carousel
            width={100}
            height={heroHeightPercent}
            components={heroComponents}
          />
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

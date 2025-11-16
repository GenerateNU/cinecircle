import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Animated,
  Pressable,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';

import ActionButtons from '../components/ActionButtons';
import HomeSearchBar from '../components/HomeSearchBar';
import TabToggle from '../components/TabToggle';
import SectionHeader from '../components/SectionHeader';

export type HomeScreenProps = {
  user?: any;
  onSignOut?: () => Promise<void>;
};

type MockPost = {
  id: string;
  author: string;
  handle: string;
  timestamp: string;
  content: string;
  image?: string;
  comments: number;
  reactions: {
    spicy: number;
    sparkle: number;
    brain: number;
    boom: number;
  };
};

const mockFeedPosts: MockPost[] = [
  {
    id: '1',
    author: 'Lena Morales',
    handle: '@lena_watches',
    timestamp: '2 hours ago',
    content:
      'Caught an early screening of “City Lights Redux” and it absolutely floored me. The score alone deserves an award.',
    image: 'https://image.tmdb.org/t/p/w780/uQWcV9dZic5GZ0mAnmrgrf7a0Jm.jpg',
    comments: 24,
    reactions: { spicy: 12, sparkle: 30, brain: 6, boom: 3 },
  },
  {
    id: '2',
    author: 'Marcus O.',
    handle: '@marcus_onfilm',
    timestamp: '5 hours ago',
    content:
      'Hosting a rooftop noir night next Friday. Drop your must-watch detective picks and I’ll add them to the reel!',
    comments: 17,
    reactions: { spicy: 4, sparkle: 11, brain: 9, boom: 2 },
  },
  {
    id: '3',
    author: 'The Midnight Club',
    handle: '@midnightclub',
    timestamp: 'Yesterday',
    content:
      'Photo dump from our latest community meetup. We screened “Past Lives” under the stars and nobody wanted to leave.',
    image: 'https://image.tmdb.org/t/p/w780/kdPMUMJzyYAc4roD52qavX0nLIC.jpg',
    comments: 42,
    reactions: { spicy: 21, sparkle: 48, brain: 18, boom: 10 },
  },
  {
    id: '4',
    author: 'Heidi Tran',
    handle: '@heidi_tran',
    timestamp: '2 days ago',
    content:
      'Working through every Palme d’Or winner this fall. “Shoplifters” still sits at the top for me—what should be next?',
    comments: 9,
    reactions: { spicy: 2, sparkle: 7, brain: 14, boom: 1 },
  },
];

export default function HomeScreen({ user, onSignOut }: HomeScreenProps) {
  const screenWidth = Dimensions.get('window').width;
  const heroHeight = Math.min(screenWidth * 0.6, 320);
  const primaryNavColor = '#D62E05';
  const inactiveNavColor = '#979797';
  const navOptions = ['For You', 'Friends', 'Trending', 'Country'];
  const navTabs = navOptions.map((label) => ({ key: label, label }));
  const quickActionButtons = [
    {
      label: 'Browse Movies',
      icon: <Feather name="film" size={18} color="#FFF" />,
      onPress: () => router.push('/movies'),
    },
    {
      label: 'Find Events',
      icon: <Feather name="map-pin" size={18} color="#FFF" />,
      onPress: () => router.push('/events'),
    },
    {
      label: 'Profile',
      icon: <Feather name="user" size={18} color="#FFF" />,
      onPress: () => router.push('/profile'),
    },
  ];
  const [activeNav, setActiveNav] = React.useState(navOptions[0]);
  const [showSearchBar, setShowSearchBar] = React.useState(false);
  const iconOpacity = React.useRef(new Animated.Value(1)).current;
  const searchOpacity = React.useRef(new Animated.Value(0)).current;

  const handleToggleSearch = () => {
    if (!showSearchBar) {
      Animated.timing(iconOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowSearchBar(true);
        searchOpacity.setValue(0);
        Animated.timing(searchOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      Animated.timing(searchOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowSearchBar(false);
        iconOpacity.setValue(0);
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const renderMockPosts = () =>
    mockFeedPosts.map((post) => (
      <View
        key={post.id}
        style={tw`mb-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm`}
      >
        <View style={tw`flex-row justify-between items-start`}>
          <View>
            <Text style={tw`text-base font-semibold text-black`}>
              {post.author}
            </Text>
            <Text style={tw`text-xs text-gray-400`}>
              {post.handle} • {post.timestamp}
            </Text>
          </View>
          <Feather name='globe' size={16} color='#979797' />
        </View>
        <Text style={tw`text-sm text-gray-900 mt-3`}>{post.content}</Text>
        {post.image && (
          <Image
            source={{ uri: post.image }}
            style={tw`w-full h-44 rounded-2xl mt-3`}
            resizeMode='cover'
          />
        )}
        <View style={tw`flex-row justify-between items-center mt-4`}>
          <View style={tw`flex-row items-center`}>
            <Feather name='message-circle' size={16} color={primaryNavColor} />
            <Text style={tw`text-xs text-gray-600 ml-2`}>
              {post.comments} comments
            </Text>
          </View>
          <View style={tw`flex-row`}>
            {[
              { emoji: '🌶️', count: post.reactions.spicy },
              { emoji: '✨', count: post.reactions.sparkle },
              { emoji: '🧠', count: post.reactions.brain },
              { emoji: '🧨', count: post.reactions.boom },
            ].map((reaction, idx) => (
              <View
                key={`${post.id}-${reaction.emoji}`}
                style={[tw`flex-row items-center`, idx === 0 ? undefined : tw`ml-4`]}
              >
                <Text style={{ fontSize: 14 }}>{reaction.emoji}</Text>
                <Text style={tw`text-xs text-gray-600 ml-1`}>
                  {reaction.count}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    ));

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={[tw`pb-28`]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image with search affordance */}
        <View style={{ paddingBottom: 16 }}>
          <View style={{ position: 'relative' }}>
            <ImageBackground
              source={{
                uri: 'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
              }}
              style={{ width: screenWidth, height: heroHeight }}
              resizeMode='cover'
            >
              <View
                style={[tw`flex-1`, { backgroundColor: 'rgba(0,0,0,0.25)' }]}
              />
            </ImageBackground>
            <Animated.View
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                opacity: iconOpacity,
              }}
              pointerEvents={showSearchBar ? 'none' : 'auto'}
            >
              <TouchableOpacity onPress={handleToggleSearch} activeOpacity={0.7}>
                <Feather name='search' size={22} color='#FFFFFF' />
              </TouchableOpacity>
            </Animated.View>
            {showSearchBar && (
              <View
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
              >
                <Pressable style={{ flex: 1 }} onPress={handleToggleSearch} />
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    top: 64,
                    opacity: searchOpacity,
                  }}
                >
                  <HomeSearchBar placeholder='Search movies, events, people...' />
                </Animated.View>
              </View>
            )}
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
            <View style={tw`mt-1`}>
              <View style={tw`mt-1`}>{renderMockPosts()}</View>
            </View>
          ) : (
            <View>
              <SectionHeader title={activeNav} size='large' />
              <Text style={tw`text-sm text-gray-500`}>
                Content for {activeNav} will appear here.
              </Text>
            </View>
          )}
        </View>

        {/* Quick actions */}
        <View style={tw`mt-2 px-5`}>
          <ActionButtons buttons={quickActionButtons} />
        </View>

        {/* Optional: show who’s signed in */}
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
    </View>
  );
}

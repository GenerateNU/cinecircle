import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Image,
  Animated,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';

import SearchBar from '../components/SearchBar';
import ActionButtons from '../components/ActionButtons';
import TabToggle from '../components/TabToggle';
import SectionHeader from '../components/SectionHeader';
import { getHomeFeed, type HomeFeedItem } from '../services/feedService';

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
  const navTabs = navOptions.map((label) => ({ key: label, label }));
  const fallbackPostImages = [
    'https://image.tmdb.org/t/p/w780/Af4bXE63pVsb2FtbW8uYIyPBadD.jpg',
    'https://image.tmdb.org/t/p/w780/c0nUX6Q1ZB0P2t1Jo6EeFSVnOGQ.jpg',
  ];
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
  const [feedItems, setFeedItems] = React.useState<HomeFeedItem[]>([]);
  const [loadingFeed, setLoadingFeed] = React.useState(false);
  const [feedError, setFeedError] = React.useState<string | null>(null);
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

  React.useEffect(() => {
    let isMounted = true;

    const loadFeed = async () => {
      setLoadingFeed(true);
      setFeedError(null);
      try {
        const response = await getHomeFeed(25);
        if (!isMounted) return;
        const items = response.data ?? [];
        setFeedItems(items.filter((item) => item.type?.includes('post')));
      } catch (error) {
        if (!isMounted) return;
        const message =
          error instanceof Error ? error.message : 'Failed to load feed';
        setFeedError(message);
      } finally {
        if (isMounted) setLoadingFeed(false);
      }
    };

    loadFeed();
    return () => {
      isMounted = false;
    };
  }, []);

  const renderFeedPosts = () => {
    if (loadingFeed) {
      return (
        <View style={tw`py-6 items-center`}>
          <ActivityIndicator size="small" color={primaryNavColor} />
          <Text style={tw`text-xs text-gray-500 mt-2`}>Loading posts...</Text>
        </View>
      );
    }

    if (feedError) {
      return (
        <Text style={tw`text-sm text-red-500 py-4`}>
          {feedError}
        </Text>
      );
    }

    if (feedItems.length === 0) {
      return (
        <Text style={tw`text-sm text-gray-500 py-4`}>
          No posts yet. Follow more friends to populate your feed.
        </Text>
      );
    }

    return feedItems.map((item, index) => {
      const post = item.data;
      const createdAt = post.createdAt
        ? new Date(post.createdAt).toLocaleString()
        : 'Just now';
      const userIdentifier = post.userId
        ? `User ${String(post.userId).slice(0, 6)}`
        : 'Community Member';
      const authorLabel = post.username || userIdentifier;
      const fallbackImage =
        index < fallbackPostImages.length
          ? fallbackPostImages[index]
          : undefined;
      const imageUri = post.imageUrl || fallbackImage;
      return (
        <View
          key={post.id ?? `${post.userId ?? 'post'}-${index}`}
          style={tw`mb-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm`}
        >
          <View style={tw`flex-row justify-between items-start mb-2`}>
            <View>
              <Text style={tw`text-base font-semibold text-black`}>
                {authorLabel}
              </Text>
              <Text style={tw`text-xs text-gray-400 mt-0.5`}>{createdAt}</Text>
            </View>
            <Feather name="globe" size={16} color="#979797" />
          </View>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={tw`w-full h-40 rounded-2xl mt-3 mb-3`}
              resizeMode="cover"
            />
          )}
          <Text style={tw`text-sm text-gray-900 mt-2`}>
            {post.content || 'Shared an update'}
          </Text>
          <View style={tw`flex-row justify-between items-center mt-3`}>
            <View style={tw`flex-row items-center`}>
              <Feather name="message-circle" size={16} color="#D62E05" />
              <Text style={tw`text-xs text-gray-600 ml-2`}>
                {(
                  post.commentsCount ??
                  post.commentCount ??
                  (Array.isArray(post.comments) ? post.comments.length : 0)
                )}{' '}
                comments
              </Text>
            </View>
            <View style={tw`flex-row items-center`}>
              {[
                { emoji: '🌶️', count: post.spicyCount ?? post.pepperCount ?? 0 },
                { emoji: '✨', count: post.sparkleCount ?? post.sparkCount ?? 0 },
                { emoji: '🧠', count: post.brainCount ?? post.smartCount ?? 0 },
                { emoji: '🧨', count: post.dynamiteCount ?? post.boomCount ?? 0 },
              ].map((reaction, idx) => (
                <View
                  key={`${reaction.emoji}-${idx}`}
                  style={[
                    tw`flex-row items-center`,
                    idx === 0 ? undefined : tw`ml-4`,
                  ]}
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
      );
    });
  };

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
                  <SearchBar placeholder='Search movies, events, people...' />
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
            <View>{renderFeedPosts()}</View>
          ) : (
            <View>
              <SectionHeader title={activeNav} size='large' />
              <Text style={tw`text-sm text-gray-500`}>
                Content for {activeNav} will appear here.
              </Text>
            </View>
          )}
        </View>

        {/* Optional: show who’s signed in */}
        {!!user && (
          <Text style={tw`text-sm text-gray-500 mt-4 px-5`}>
            Signed in as {user.email}
          </Text>
        )}

        {/* Quick actions */}
        <View style={tw`mt-6`}>
          <ActionButtons buttons={quickActionButtons} />
        </View>

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

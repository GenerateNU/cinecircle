import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles as bottomNavStyles } from '../../styles/BottomNavBar.styles';
import tw from 'twrnc';
import { User, TabKey } from '../../lib/profilePage/_types';
import { formatCount } from '../../lib/profilePage/_utils';
import MoviesGrid from './components/MoviesGrid';
import PostsList from './components/PostsList';
import EventsList from './components/EventsList';
import BadgesGrid from './components/BadgesGrid';
import Avatar from '../../components/Avatar';
import SectionHeader from '../../components/SectionHeader';
import { getFollowers, getFollowing } from '../../services/followService';
import type { components } from '../../types/api-generated';
import { getUserProfile } from '../../services/userService';

type UserProfile = components['schemas']['UserProfile'] & {
  moviesToWatch?: string[];
  moviesCompleted?: string[];
  eventsSaved?: string[];
  eventsAttended?: string[];
};

type Props = {
  user?: User;
  isMe?: boolean;
  onFollow?: () => Promise<void> | void;
  onUnfollow?: () => Promise<void> | void;
  isFollowing?: boolean;
  profileUserId?: string;
  profileData?: UserProfile | null;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.2);
const AVATAR_SIZE = 100;
const AVATAR_RADIUS = AVATAR_SIZE / 2;

// BottomNavBar height buffer
const NAV_HEIGHT = 64;

const ACCENT_COLOR = '#D62E05';
const BUTTON_COLOR = '#F7D5CD';
const EDIT_BUTTON_ACCENT = '#DE5837';

const ProfilePage = ({
  user: userProp,
  isMe = true,
  onFollow,
  onUnfollow,
  isFollowing = false,
  profileUserId,
  profileData = null,
}: Props) => {
  const [activeTab, setActiveTab] = useState<TabKey>('movies');
  const [profile, setProfile] = useState<UserProfile | null>(profileData);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(isMe);
  const [error, setError] = useState<string | null>(null);
  const targetUserId = isMe ? profile?.userId : profileUserId;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollBottomPadding = NAV_HEIGHT + insets.bottom + 32;

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.push('/(tabs)/home');
    }
  }, [navigation]);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile (returns id, email, role)
      const profileRes = await getUserProfile();
      if (profileRes.userProfile?.userId) {
        setProfile(profileRes.userProfile);

        // Fetch followers and following counts in parallel
        try {
          const [followersRes, followingRes] = await Promise.all([
            getFollowers(profileRes.userProfile.userId),
            getFollowing(profileRes.userProfile.userId),
          ]);
          setFollowersCount(followersRes.followers?.length || 0);
          setFollowingCount(followingRes.following?.length || 0);
        } catch (err) {
          console.error('Failed to fetch follow counts:', err);
          // Not critical, continue with 0 counts
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isMe) {
        fetchProfileData();
      }
    }, [fetchProfileData, isMe])
  );

  useEffect(() => {
    if (!isMe) {
      setLoading(false);
      setError(null);
    }
  }, [isMe]);

  useEffect(() => {
    if (!isMe) return;
    // When other screens emit follow status changes we refresh counts for the logged-in user.
    const sub = DeviceEventEmitter.addListener('followStatusChanged', () => {
      fetchProfileData();
    });
    return () => {
      sub.remove();
    };
  }, [fetchProfileData, isMe]);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  const resolvedDisplayName = isMe
    ? profile?.displayName?.trim() ||
      profile?.username?.trim() ||
      'user'
    : userProp?.name?.trim() ||
      userProp?.username?.trim() ||
      'user';

  const derivedBio = isMe
    ? profile?.bio?.trim() ||
      profile?.favoriteMovies?.[0]?.trim() ||
      'No Bio'
    : userProp?.bio || 'No Bio';

  const displayUser: User = isMe && profile
    ? {
        name: resolvedDisplayName || 'User',
        username: profile.username || 'user',
        bio: derivedBio,
        followers: followersCount,
        following: followingCount,
        profilePic:
          profile.profilePicture ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            resolvedDisplayName || 'User'
          )}&size=200&background=667eea&color=fff`,
      }
    : userProp
    ? {
        ...userProp,
        name: userProp.name || resolvedDisplayName || 'User',
        username: userProp.username || resolvedDisplayName || 'user',
        bio: derivedBio,
        followers: userProp.followers ?? 0,
        following: userProp.following ?? 0,
        profilePic:
          userProp.profilePic ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            resolvedDisplayName || 'User'
          )}&size=200&background=667eea&color=fff`,
      }
    : {
        name: 'User',
        username: 'user',
        bio: 'Movie enthusiast',
        followers: 0,
        following: 0,
        profilePic:
          'https://ui-avatars.com/api/?name=User&size=200&background=667eea&color=fff',
      };

  if (loading) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={tw`mt-4 text-gray-600`}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
        <Text style={tw`text-red-600 text-center mb-4`}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-black px-6 py-3 rounded-lg`}
          onPress={fetchProfileData}
        >
          <Text style={tw`text-white font-semibold`}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const u = displayUser;

  return (
      <View style={tw`flex-1 bg-white`}>
        {/* All content scrolls, including the gray header */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
          nestedScrollEnabled
        >
        {/* Scrollable gray header band */}
        <View
          style={[
            tw`w-full`,
            { height: HEADER_HEIGHT, backgroundColor: '#E9EBEF' },
          ]}
        >
          <View
            style={[
              tw`flex-row justify-between px-4`,
              { paddingTop: Math.max(insets.top, 12) },
            ]}
          >
            {/* Back button for visiting another user's profile */}
            {!isMe ? (
              <TouchableOpacity
                onPress={handleBack}
                style={[
                  tw`flex-row items-center rounded-xl`,
                  {
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    backgroundColor: BUTTON_COLOR,
                    borderColor: ACCENT_COLOR,
                    borderWidth: 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="chevron-back" size={20} color={ACCENT_COLOR} />
                <Text
                  style={[
                    tw`ml-1 font-semibold`,
                    { color: ACCENT_COLOR },
                  ]}
                >
                  Back
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={tw`w-10 h-10`} />
            )}

            {/* Settings button top-right */}
            {isMe ? (
              <TouchableOpacity
                onPress={() => router.push('/profilePage/accountSettings')}
                style={tw`w-10 h-10 items-center justify-center rounded-full`}
                accessibilityRole="button"
                accessibilityLabel="Open settings"
              >
                <View
                  style={[
                    tw`w-10 h-10 items-center justify-center rounded-xl`,
                    {
                      backgroundColor: BUTTON_COLOR,
                      borderColor: ACCENT_COLOR,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Ionicons
                    name="settings-outline"
                    size={22}
                    color={ACCENT_COLOR}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <View style={tw`w-10 h-10`} />
            )}
          </View>
        </View>

        {/* Profile block (avatar overlaps the gray header) */}
        <View style={tw`px-5`}>
          <View
            style={[
              tw`self-start`,
              {
                marginTop: -AVATAR_RADIUS,
              },
            ]}
          >
            <Avatar uri={u.profilePic} size={AVATAR_SIZE} />
          </View>

          {/* Name & Username */}
          <Text style={tw`mt-3 text-[28px] font-extrabold text-black`}>
            {u.name}
          </Text>
          <Text style={tw`mt-1 text-[20px] font-semibold text-[#9A9A9A]`}>
            @{u.username}
          </Text>

          {/* Bio */}
          <Text style={tw`mt-[10px] px-1.5 leading-5 text-[#555]`}>
            {u.bio}
          </Text>

          {/* Stats row */}
          <View style={tw`mt-[14px] flex-row items-center`}>
            {/* Followers tile routes to own list or the other user's list */}
            <TouchableOpacity
              style={tw`flex-1`}
              accessibilityRole="button"
              accessibilityLabel="View followers"
              onPress={() => {
                if (isMe) {
                  router.push('/profilePage/followers');
                } else if (targetUserId) {
                  router.push({
                    pathname: '/profilePage/user/[userId]/followers',
                    params: {
                      userId: targetUserId,
                      username: displayUser.username,
                      name: displayUser.name,
                    },
                  });
                }
              }}
              disabled={!isMe && !targetUserId}
            >
              <Text>
                {formatCount(u.followers)}{' '}
                <Text style={tw`font-semibold`}>Followers</Text>
              </Text>
            </TouchableOpacity>
            {/* Following tile follows same pattern (self vs other) */}
            <TouchableOpacity
              style={tw`flex-1`}
              accessibilityRole="button"
              accessibilityLabel="View people you follow"
              onPress={() => {
                if (isMe) {
                  router.push('/profilePage/following');
                } else if (targetUserId) {
                  router.push({
                    pathname: '/profilePage/user/[userId]/following',
                    params: {
                      userId: targetUserId,
                      username: displayUser.username,
                      name: displayUser.name,
                    },
                  });
                }
              }}
              disabled={!isMe && !targetUserId}
            >
              <Text style={tw`text-center`}>
                {formatCount(u.following)}{' '}
                <Text style={tw`font-semibold`}>Following</Text>
              </Text>
            </TouchableOpacity>
            <View style={tw`flex-1 items-end`}>
              <Text style={tw`font-semibold`}>WhatsApp</Text>
            </View>
          </View>

          {/* Primary action button */}
          <View style={tw`mt-3 self-center w-[88%]`}>
            {isMe ? (
              // Logged-in user sees edit button
              <TouchableOpacity
                onPress={() => router.push('/profilePage/settings')}
                style={[
                  tw`items-center justify-center px-[18px] py-[10px]`,
                  {
                    borderColor: EDIT_BUTTON_ACCENT,
                    borderWidth: 1,
                    backgroundColor: BUTTON_COLOR,
                    borderRadius: 8,
                  },
                ]}
              >
                <Text
                  style={[
                    tw`font-semibold text-center`,
                    { color: EDIT_BUTTON_ACCENT },
                  ]}
                >
                  Edit Profile
                </Text>
              </TouchableOpacity>
            ) : (
              // Viewing someone else: show follow/unfollow with disabled states when callbacks missing
              <TouchableOpacity
                disabled={
                  (isFollowing && !onUnfollow) ||
                  (!isFollowing && !onFollow)
                }
                onPress={() =>
                  (isFollowing ? onUnfollow?.() : onFollow?.()) ?? undefined
                }
                style={[
                  tw`items-center justify-center px-[18px] py-[10px]`,
                  {
                    borderColor: '#801C03',
                    borderWidth: 1,
                    backgroundColor: '#D62E05',
                    borderRadius: 8,
                    opacity:
                      (isFollowing && !onUnfollow) ||
                      (!isFollowing && !onFollow)
                        ? 0.6
                        : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    tw`font-semibold text-center`,
                    { color: '#F7D5CD' },
                  ]}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

        </View>

        {/* Tabs row */}
          <View
            style={tw`mt-[18px] flex-row justify-around border-y border-[#ddd] py-[10px]`}
          >
          <TouchableOpacity
            style={[
              tw`items-center pb-1.5 border-b-2`,
              activeTab === 'movies'
                ? { borderColor: ACCENT_COLOR }
                : { borderColor: 'transparent' },
            ]}
            onPress={() => setActiveTab('movies')}
          >
            <MaterialIcons name="movie" size={20} color={ACCENT_COLOR} />
            <Text
              style={[
                tw`mt-0.5 text-[12px]`,
                activeTab === 'movies' && tw`font-bold`,
                { color: ACCENT_COLOR },
              ]}
            >
              Movies
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`items-center pb-1.5 border-b-2`,
              activeTab === 'posts'
                ? { borderColor: ACCENT_COLOR }
                : { borderColor: 'transparent' },
            ]}
            onPress={() => setActiveTab('posts')}
          >
            <FontAwesome5 name="th-large" size={18} color={ACCENT_COLOR} />
            <Text
              style={[
                tw`mt-0.5 text-[12px]`,
                activeTab === 'posts' && tw`font-bold`,
                { color: ACCENT_COLOR },
              ]}
            >
              Posts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`items-center pb-1.5 border-b-2`,
              activeTab === 'events'
                ? { borderColor: ACCENT_COLOR }
                : { borderColor: 'transparent' },
            ]}
            onPress={() => setActiveTab('events')}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={ACCENT_COLOR}
            />
            <Text
              style={[
                tw`mt-0.5 text-[12px]`,
                activeTab === 'events' && tw`font-bold`,
                { color: ACCENT_COLOR },
              ]}
            >
              Events
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`items-center pb-1.5 border-b-2`,
              activeTab === 'badges'
                ? { borderColor: ACCENT_COLOR }
                : { borderColor: 'transparent' },
            ]}
            onPress={() => setActiveTab('badges')}
          >
            <MaterialIcons
              name="emoji-events"
              size={20}
              color={ACCENT_COLOR}
            />
            <Text
              style={[
                tw`mt-0.5 text-[12px]`,
                activeTab === 'badges' && tw`font-bold`,
                { color: ACCENT_COLOR },
              ]}
            >
              Badges
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab-specific content */}
        <View style={tw`px-4 pt-3`}>
          {activeTab === 'movies' && (
            <MoviesGrid
              userId={targetUserId ?? null}
              moviesToWatch={profile?.moviesToWatch}
              moviesCompleted={profile?.moviesCompleted}
            />
          )}
          {activeTab === 'posts' && <PostsList user={u} userId={targetUserId ?? null} />}
          {activeTab === 'events' && (
            <EventsList
              userId={targetUserId ?? null}
              eventsSaved={profile?.eventsSaved}
              eventsAttended={profile?.eventsAttended}
            />
          )}
          {activeTab === 'badges' && <BadgesGrid />}
        </View>

        {/* Create Post CTA (only on Posts tab) */}
        {activeTab === 'posts' && (
          <TouchableOpacity
            style={tw`bg-black mx-5 my-5 rounded-[8px] px-3 py-3`}
            onPress={() => router.push('/post')}
          >
            <Text style={tw`text-white text-center text-[16px]`}>
              ➕ Create a Post
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Inline bottom nav so it remains visible when viewing another user's profile */}
      {!isMe && (
        <View
          style={[
            bottomNavStyles.bar,
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {[
            { route: '/(tabs)/home', icon: 'home' as const, label: 'Home' },
            { route: '/(tabs)/movies', icon: 'confirmation-number' as const, label: 'Movies' },
            { route: '/(tabs)/post', icon: 'add-circle' as const, label: 'Create post' },
            { route: '/(tabs)/events', icon: 'place' as const, label: 'Events' },
            { route: '/(tabs)/profile', icon: 'account-circle' as const, label: 'Profile' },
          ].map((item) => {
            const isActive = item.route === '/(tabs)/profile';
            return (
              <TouchableOpacity
                key={item.route}
                onPress={() => router.navigate(item.route)}
                style={[bottomNavStyles.item, { overflow: 'visible' }]}
                accessibilityRole="button"
                accessibilityLabel={`Go to ${item.label}`}
              >
                <MaterialIcons
                  name={item.icon}
                  style={isActive ? bottomNavStyles.activeIcon : bottomNavStyles.icon}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default ProfilePage;

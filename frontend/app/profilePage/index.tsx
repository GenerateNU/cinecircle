import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { User, TabKey } from './types';
import { formatCount } from './utils';
import MoviesGrid from './components/MoviesGrid';
import PostsList from './components/PostsList';
import EventsList from './components/EventsList';
import BadgesGrid from './components/BadgesGrid';
import BottomNavBar from '../../components/BottomNavBar';
import Avatar from '../../components/Avatar';
import ActionButtons from '../../components/ActionButtons';
import SectionHeader from '../../components/SectionHeader';
import { getUserProfileBasic } from '../../services/userService';
import { getFollowers, getFollowing } from '../../services/followService';
import type { UserProfileBasic } from '../../types/models';

type Props = {
  user?: User;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.2);
const AVATAR_SIZE = 100;
const AVATAR_RADIUS = AVATAR_SIZE / 2;

// BottomNavBar height buffer
const NAV_HEIGHT = 64;

const ProfilePage = ({ user: userProp }: Props) => {
  const [activeTab, setActiveTab] = useState<TabKey>('movies');
  const [profile, setProfile] = useState<UserProfileBasic | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile (returns id, email, role)
      const profileRes = await getUserProfileBasic();
      if (profileRes.user?.id) {
        setProfile(profileRes.user);

        // Fetch followers and following counts in parallel
        try {
          const [followersRes, followingRes] = await Promise.all([
            getFollowers(profileRes.user.id),
            getFollowing(profileRes.user.id),
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
  };

  // Build display user from real data + placeholders for missing fields
  const displayUser: User = profile
    ? {
        // Use email as name/username since backend doesn't have these fields yet
        name: profile.email?.split('@')[0] || 'User',
        username: profile.email?.split('@')[0] || 'user',
        bio: 'Movie enthusiast', // Placeholder - backend doesn't have bio field
        followers: followersCount,
        following: followingCount,
        profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          profile.email || 'User'
        )}&size=200&background=667eea&color=fff`, // Generated avatar
      }
    : userProp || {
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
      <ScrollView contentContainerStyle={{ paddingBottom: NAV_HEIGHT + 32 }}>
        {/* Scrollable gray header band */}
        <View
          style={[
            tw`w-full`,
            { height: HEADER_HEIGHT, backgroundColor: '#E9EBEF' },
          ]}
        >
          {/* Settings button top-right */}
          <View style={tw`flex-row justify-end px-4 pt-3`}>
            <TouchableOpacity
              onPress={() => router.push('/profilePage/settings')}
              style={tw`w-10 h-10 items-center justify-center rounded-full`}
              accessibilityRole="button"
              accessibilityLabel="Open settings"
            >
              <Ionicons name="settings-outline" size={24} color="#000" />
            </TouchableOpacity>
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
            <Text style={tw`flex-1`}>
              {formatCount(u.followers)}{' '}
              <Text style={tw`font-semibold`}>Followers</Text>
            </Text>
            <Text style={tw`flex-1 text-center`}>
              {formatCount(u.following)}{' '}
              <Text style={tw`font-semibold`}>Following</Text>
            </Text>
            <View style={tw`flex-1 items-end`}>
              <Text style={tw`font-semibold`}>WhatsApp</Text>
            </View>
          </View>

          {/* Quick actions from shared components */}
          <View style={tw`mt-4`}>
            <ActionButtons />
          </View>

          {/* Buttons */}
          <View style={tw`mt-3 self-center w-[88%] flex-row gap-3`}>
            <TouchableOpacity
              style={tw`flex-1 items-center justify-center border border-black bg-transparent px-[18px] py-[10px] rounded-none`}
            >
              <Text style={tw`text-black font-semibold text-center`}>
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 items-center justify-center border border-black bg-transparent px-[18px] py-[10px] rounded-none`}
            >
              <Text style={tw`text-black font-semibold text-center`}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Activity header */}
        <View style={tw`px-5 mt-6`}>
          <SectionHeader title="Your Activity" size="small" />
        </View>

        {/* Tabs row */}
        <View
          style={tw`mt-[18px] flex-row justify-around border-y border-[#ddd] py-[10px]`}
        >
          <TouchableOpacity
            style={[
              tw`items-center pb-1.5 border-b-2`,
              activeTab === 'movies'
                ? tw`border-black`
                : tw`border-transparent`,
            ]}
            onPress={() => setActiveTab('movies')}
          >
            <MaterialIcons name="movie" size={20} />
            <Text
              style={tw`mt-0.5 text-[12px] ${
                activeTab === 'movies' ? 'font-bold text-black' : 'text-[#333]'
              }`}
            >
              Movies
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`items-center pb-1.5 border-b-2`,
              activeTab === 'posts' ? tw`border-black` : tw`border-transparent`,
            ]}
            onPress={() => setActiveTab('posts')}
          >
            <FontAwesome5 name="th-large" size={18} />
            <Text
              style={tw`mt-0.5 text-[12px] ${
                activeTab === 'posts' ? 'font-bold text-black' : 'text-[#333]'
              }`}
            >
              Posts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`items-center pb-1.5 border-b-2`,
              activeTab === 'events'
                ? tw`border-black`
                : tw`border-transparent`,
            ]}
            onPress={() => setActiveTab('events')}
          >
            <Ionicons name="calendar-outline" size={20} />
            <Text
              style={tw`mt-0.5 text-[12px] ${
                activeTab === 'events' ? 'font-bold text-black' : 'text-[#333]'
              }`}
            >
              Events
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`items-center pb-1.5 border-b-2`,
              activeTab === 'badges'
                ? tw`border-black`
                : tw`border-transparent`,
            ]}
            onPress={() => setActiveTab('badges')}
          >
            <MaterialIcons name="emoji-events" size={20} />
            <Text
              style={tw`mt-0.5 text-[12px] ${
                activeTab === 'badges' ? 'font-bold text-black' : 'text-[#333]'
              }`}
            >
              Badges
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab-specific content */}
        <View style={tw`px-4 pt-3`}>
          {activeTab === 'movies' && <MoviesGrid />}
          {activeTab === 'posts' && <PostsList user={u} />}
          {activeTab === 'events' && <EventsList />}
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

      {/* Persistent bottom navigation */}
      <View
        style={tw`absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white`}
      >
        <BottomNavBar />
      </View>
    </View>
  );
};

export default ProfilePage;

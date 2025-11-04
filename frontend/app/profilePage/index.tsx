import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import BottomNavBar from '../../components/BottomNavBar';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { User, TabKey } from './types';
import { formatCount } from './utils';
import MoviesGrid from './components/MoviesGrid';
import PostsList from './components/PostsList';
import EventsList from './components/EventsList';
import BadgesGrid from './components/BadgesGrid';

type Props = {
  user?: User;
};

const fallbackUser: User = {
  name: 'Kaamil Thobani',
  username: 'kaamil_t',
  bio: 'South Asian cinema enthusiast 🎬 | SRK forever ❤️',
  followers: 1520,
  following: 24,
  profilePic: 'https://i.pravatar.cc/150?img=3',
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.2);
const AVATAR_SIZE = 100;
const AVATAR_RADIUS = AVATAR_SIZE / 2;

// BottomNavBar height buffer
const NAV_HEIGHT = 64;

const ProfilePage = ({ user }: Props) => {
  const u = { ...fallbackUser, ...(user || {}) };
  const [activeTab, setActiveTab] = useState<TabKey>('movies');

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
          <Image
            source={{ uri: u.profilePic }}
            style={[
              {
                marginTop: -AVATAR_RADIUS,
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: AVATAR_RADIUS,
              },
              tw`self-start`,
            ]}
          />

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

      {/* Bottom nav remains absolute; we left paddingBottom on ScrollView */}
      <BottomNavBar />
    </View>
  );
};

export default ProfilePage;

import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import BottomNavBar from '../../components/BottomNavBar';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';

type User = {
  name: string;
  username: string;
  bio?: string;
  followers?: number;
  following?: number;
  profilePic?: string;
};

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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.2);
const AVATAR_SIZE = 100;
const AVATAR_RADIUS = AVATAR_SIZE / 2;

// BottomNavBar height buffer
const NAV_HEIGHT = 64;

type TabKey = 'movies' | 'posts' | 'events' | 'badges';

const ProfilePage = ({ user }: Props) => {
  const u = { ...fallbackUser, ...(user || {}) };
  const [activeTab, setActiveTab] = useState<TabKey>('movies');

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* All content scrolls, including the gray header */}
      <ScrollView contentContainerStyle={{ paddingBottom: NAV_HEIGHT + 32 }}>
        {/* Scrollable gray header band */}
        <View style={[tw`w-full`, { height: HEADER_HEIGHT, backgroundColor: '#E9EBEF' }]}>
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
              { marginTop: -AVATAR_RADIUS, width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_RADIUS },
              tw`self-start`,
            ]}
          />

          {/* Name & Username */}
          <Text style={tw`mt-3 text-[28px] font-extrabold text-black`}>{u.name}</Text>
          <Text style={tw`mt-1 text-[20px] font-semibold text-[#9A9A9A]`}>@{u.username}</Text>

          {/* Bio */}
          <Text style={tw`mt-[10px] px-1.5 leading-5 text-[#555]`}>{u.bio}</Text>

          {/* Stats row */}
          <View style={tw`mt-[14px] flex-row items-center`}>
            <Text style={tw`flex-1`}>
              {formatCount(u.followers)} <Text style={tw`font-semibold`}>Followers</Text>
            </Text>
            <Text style={tw`flex-1 text-center`}>
              {formatCount(u.following)} <Text style={tw`font-semibold`}>Following</Text>
            </Text>
            <View style={tw`flex-1 items-end`}>
              <Text style={tw`font-semibold`}>WhatsApp</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={tw`mt-3 self-center w-[88%] flex-row gap-3`}>
            <TouchableOpacity style={tw`flex-1 items-center justify-center border border-black bg-transparent px-[18px] py-[10px] rounded-none`}>
              <Text style={tw`text-black font-semibold text-center`}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-1 items-center justify-center border border-black bg-transparent px-[18px] py-[10px] rounded-none`}>
              <Text style={tw`text-black font-semibold text-center`}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs row */}
        <View style={tw`mt-[18px] flex-row justify-around border-y border-[#ddd] py-[10px]`}>
          <TouchableOpacity
            style={[tw`items-center pb-1.5 border-b-2`, activeTab === 'movies' ? tw`border-black` : tw`border-transparent`]}
            onPress={() => setActiveTab('movies')}
          >
            <MaterialIcons name="movie" size={20} />
            <Text style={tw`mt-0.5 text-[12px] ${activeTab === 'movies' ? 'font-bold text-black' : 'text-[#333]'}`}>Movies</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[tw`items-center pb-1.5 border-b-2`, activeTab === 'posts' ? tw`border-black` : tw`border-transparent`]}
            onPress={() => setActiveTab('posts')}
          >
            <FontAwesome5 name="th-large" size={18} />
            <Text style={tw`mt-0.5 text-[12px] ${activeTab === 'posts' ? 'font-bold text-black' : 'text-[#333]'}`}>Posts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[tw`items-center pb-1.5 border-b-2`, activeTab === 'events' ? tw`border-black` : tw`border-transparent`]}
            onPress={() => setActiveTab('events')}
          >
            <Ionicons name="calendar-outline" size={20} />
            <Text style={tw`mt-0.5 text-[12px] ${activeTab === 'events' ? 'font-bold text-black' : 'text-[#333]'}`}>Events</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[tw`items-center pb-1.5 border-b-2`, activeTab === 'badges' ? tw`border-black` : tw`border-transparent`]}
            onPress={() => setActiveTab('badges')}
          >
            <MaterialIcons name="emoji-events" size={20} />
            <Text style={tw`mt-0.5 text-[12px] ${activeTab === 'badges' ? 'font-bold text-black' : 'text-[#333]'}`}>Badges</Text>
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
          <TouchableOpacity style={tw`bg-black mx-5 my-5 rounded-[8px] px-3 py-3`} onPress={() => router.push('/post')}>
            <Text style={tw`text-white text-center text-[16px]`}>➕ Create a Post</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom nav remains absolute; we left paddingBottom on ScrollView */}
      <BottomNavBar />
    </View>
  );
};

/* ===== Tab Content Components ===== */

const MoviesGrid = () => {
  const posters = [
    'https://image.tmdb.org/t/p/w185/9O1Iy9od7VwG9N0e6N4l1EuY1r8.jpg',
    'https://image.tmdb.org/t/p/w185/6bCplVkhowCjTHXWv49UjRPn0eK.jpg',
    'https://image.tmdb.org/t/p/w185/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    'https://image.tmdb.org/t/p/w185/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'https://image.tmdb.org/t/p/w185/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    'https://image.tmdb.org/t/p/w185/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  ];
  const itemWidth = (SCREEN_WIDTH - 16 * 2 - 8 * 2) / 3; // padding & gaps
  return (
    <View style={tw`mb-4`}>
      <FlatList
        data={posters}
        keyExtractor={(uri, idx) => uri + idx}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={[tw`h-40 rounded-[6px] mb-2`, { width: itemWidth }]} />
        )}
      />
    </View>
  );
};

const PostsList = ({ user }: { user: User }) => {
  const posts = [
    { id: '1', text: 'SRK in his lover era again and I’m not surviving this one.', likes: '1.2k', comments: '340', shares: '120' },
    { id: '2', text: 'Watched “3 Idiots” again — it still hits like the first time.', likes: '980', comments: '210', shares: '75' },
  ];
  return (
    <View>
      {posts.map((p) => (
        <View key={p.id} style={tw`flex-row rounded-[8px] bg-white mb-[10px] border-b border-[#eee] p-[15px]`}>
          <Image source={{ uri: user.profilePic }} style={tw`w-10 h-10 rounded-full mr-2.5`} />
          <View style={tw`flex-1`}>
            <Text style={tw`font-semibold`}>{user.name}</Text>
            <Text style={tw`text-[#333] my-1.5`}>{p.text}</Text>
            <View style={tw`flex-row justify-between w-4/5`}>
              <Text>❤️ {p.likes}</Text>
              <Text>💬 {p.comments}</Text>
              <Text>🔁 {p.shares}</Text>
              <Text>📤</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const EventsList = () => {
  const events = [
    { id: 'e1', title: 'Bollywood Night Screening', date: 'Sat, Nov 2', time: '7:00 PM', location: 'Cineplex Downtown' },
    { id: 'e2', title: 'SRK Fan Meetup', date: 'Sun, Nov 10', time: '3:00 PM', location: 'City Park Amphitheater' },
  ];
  return (
    <View style={tw`gap-3`}>
      {events.map((ev) => (
        <View key={ev.id} style={tw`rounded-[8px] border border-[#e5e5e5] bg-white p-3`}>
          <Text style={tw`text-[16px] font-bold`}>{ev.title}</Text>
          <Text style={tw`mt-1 text-[#333]`}><Ionicons name="calendar-outline" size={14} /> {ev.date} • {ev.time}</Text>
          <Text style={tw`mt-0.5 text-[#333]`}><Ionicons name="location-outline" size={14} /> {ev.location}</Text>
          <View style={tw`mt-2 flex-row gap-2`}>
            <TouchableOpacity style={tw`bg-black rounded-[6px] px-3 py-2`}>
              <Text style={tw`text-white font-semibold`}>Add to Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`rounded-[6px] border border-black bg-transparent px-3 py-2`}>
              <Text style={tw`text-black font-semibold`}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const BadgesGrid = () => {
  const badges = [
    { id: 'b1', label: 'Critic', icon: <MaterialIcons name="rate-review" size={20} /> },
    { id: 'b2', label: 'Marathoner', icon: <MaterialIcons name="timer" size={20} /> },
    { id: 'b3', label: 'Blockbuster', icon: <MaterialIcons name="local-movies" size={20} /> },
    { id: 'b4', label: 'Butter Popcorn', icon: <MaterialIcons name="local-play" size={20} /> },
    { id: 'b5', label: 'Indie Lover', icon: <MaterialIcons name="theaters" size={20} /> },
    { id: 'b6', label: 'Festival Goer', icon: <MaterialIcons name="festival" size={20} /> },
  ];
  return (
    <View style={tw`flex-row flex-wrap gap-3`}>
      {badges.map((b) => (
        <View key={b.id} style={tw`w-[30%] aspect-square items-center justify-center rounded-[10px] border border-[#e5e5e5] bg-white`}>
          <View style={tw`mb-1.5`}>{b.icon}</View>
          <Text style={tw`text-[12px] font-semibold text-center`}>{b.label}</Text>
        </View>
      ))}
    </View>
  );
};

/* ===== Helpers ===== */

function formatCount(n?: number) {
  if (n === undefined || n === null) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

export default ProfilePage;

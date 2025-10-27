import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.2); // ~1/5 screen
const AVATAR_SIZE = 100;
const AVATAR_RADIUS = AVATAR_SIZE / 2;

type TabKey = 'movies' | 'posts' | 'events' | 'badges';

const ProfilePage = ({ user }: Props) => {
  const u = { ...fallbackUser, ...(user || {}) };

  const [activeTab, setActiveTab] = useState<TabKey>('movies');

  return (
    <View style={styles.screen}>
      {/* Light gray band */}
      <View style={[styles.topBand, { height: HEADER_HEIGHT }]} />

      {/* Scrollable content (pad bottom for fixed nav) */}
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Invisible spacer so content starts below band */}
        <View style={{ height: HEADER_HEIGHT }} />

        {/* Profile block */}
        <View style={styles.profileContainer}>
          {/* Avatar bisecting the band boundary */}
          <Image
            source={{ uri: u.profilePic }}
            style={[
              styles.profileImage,
              {
                marginTop: -AVATAR_RADIUS,
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: AVATAR_RADIUS,
              },
            ]}
          />

          {/* Name & Username */}
          <Text style={styles.name}>{u.name}</Text>
          <Text style={styles.username}>@{u.username}</Text>

          {/* Bio */}
          <Text style={styles.bio}>{u.bio}</Text>

          {/* Stats row: Followers | Following | WhatsApp */}
          <View style={styles.statsRow}>
            <Text style={styles.statCell}>
              {formatCount(u.followers)}{' '}
              <Text style={styles.statLabel}>Followers</Text>
            </Text>
            <Text style={[styles.statCell, styles.statCenter]}>
              {formatCount(u.following)}{' '}
              <Text style={styles.statLabel}>Following</Text>
            </Text>
            <View style={[styles.statCell, styles.statRight]}>
              <Text style={styles.whatsappLabel}>WhatsApp</Text>
            </View>
          </View>

          {/* Buttons (square outline) */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonOutlineSquare}>
              <Text style={styles.buttonOutlineSquareText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOutlineSquare}>
              <Text style={styles.buttonOutlineSquareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs row */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'movies' && styles.tabActive]}
            onPress={() => setActiveTab('movies')}
          >
            <MaterialIcons name="movie" size={20} />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'movies' && styles.tabLabelActive,
              ]}
            >
              Movies
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
            onPress={() => setActiveTab('posts')}
          >
            <FontAwesome5 name="th-large" size={18} />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'posts' && styles.tabLabelActive,
              ]}
            >
              Posts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'events' && styles.tabActive]}
            onPress={() => setActiveTab('events')}
          >
            <Ionicons name="calendar-outline" size={20} />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'events' && styles.tabLabelActive,
              ]}
            >
              Events
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'badges' && styles.tabActive]}
            onPress={() => setActiveTab('badges')}
          >
            <MaterialIcons name="emoji-events" size={20} />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'badges' && styles.tabLabelActive,
              ]}
            >
              Badges
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab-specific content */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          {activeTab === 'movies' && <MoviesGrid />}
          {activeTab === 'posts' && <PostsList user={u} />}
          {activeTab === 'events' && <EventsList />}
          {activeTab === 'badges' && <BadgesGrid />}
        </View>

        {/* Create Post CTA (only show on Posts tab; optional) */}
        {activeTab === 'posts' && (
          <TouchableOpacity
            style={styles.postCTA}
            onPress={() => router.push('/post')}
          >
            <Text style={styles.postCTAText}>➕ Create a Post</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

/* ===== Tab Content Components ===== */

const MoviesGrid = () => {
  // simple 3-column grid using placeholder posters
  const posters = [
    'https://image.tmdb.org/t/p/w185/9O1Iy9od7VwG9N0e6N4l1EuY1r8.jpg',
    'https://image.tmdb.org/t/p/w185/6bCplVkhowCjTHXWv49UjRPn0eK.jpg',
    'https://image.tmdb.org/t/p/w185/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    'https://image.tmdb.org/t/p/w185/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'https://image.tmdb.org/t/p/w185/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    'https://image.tmdb.org/t/p/w185/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  ];
  return (
    <View style={{ marginBottom: 16 }}>
      <FlatList
        data={posters}
        keyExtractor={(uri, idx) => uri + idx}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{
              width: (Dimensions.get('window').width - 16 * 2 - 8 * 2) / 3, // padding & gaps
              height: 160,
              borderRadius: 6,
              marginBottom: 8,
            }}
          />
        )}
      />
    </View>
  );
};

const PostsList = ({ user }: { user: User }) => {
  const posts = [
    {
      id: '1',
      text: 'SRK in his lover era again and I’m not surviving this one.',
      likes: '1.2k',
      comments: '340',
      shares: '120',
    },
    {
      id: '2',
      text: 'Watched “3 Idiots” again — it still hits like the first time.',
      likes: '980',
      comments: '210',
      shares: '75',
    },
  ];
  return (
    <View>
      {posts.map(p => (
        <View key={p.id} style={styles.postContainer}>
          <Image source={{ uri: user.profilePic }} style={styles.postProfile} />
          <View style={{ flex: 1 }}>
            <Text style={styles.postName}>{user.name}</Text>
            <Text style={styles.postText}>{p.text}</Text>
            <View style={styles.postActions}>
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
    {
      id: 'e1',
      title: 'Bollywood Night Screening',
      date: 'Sat, Nov 2',
      time: '7:00 PM',
      location: 'Cineplex Downtown',
    },
    {
      id: 'e2',
      title: 'SRK Fan Meetup',
      date: 'Sun, Nov 10',
      time: '3:00 PM',
      location: 'City Park Amphitheater',
    },
  ];
  return (
    <View style={{ gap: 12 }}>
      {events.map(ev => (
        <View
          key={ev.id}
          style={{
            borderWidth: 1,
            borderColor: '#e5e5e5',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text style={{ fontWeight: '700', fontSize: 16 }}>{ev.title}</Text>
          <Text style={{ marginTop: 4, color: '#333' }}>
            <Ionicons name="calendar-outline" size={14} /> {ev.date} • {ev.time}
          </Text>
          <Text style={{ marginTop: 2, color: '#333' }}>
            <Ionicons name="location-outline" size={14} /> {ev.location}
          </Text>
          <View style={{ marginTop: 8, flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={styles.chipBtn}>
              <Text style={styles.chipBtnText}>Add to Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chipBtnOutline}>
              <Text style={styles.chipBtnOutlineText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const BadgesGrid = () => {
  const badges = [
    {
      id: 'b1',
      label: 'Critic',
      icon: <MaterialIcons name="rate-review" size={20} />,
    },
    {
      id: 'b2',
      label: 'Marathoner',
      icon: <MaterialIcons name="timer" size={20} />,
    },
    {
      id: 'b3',
      label: 'Blockbuster',
      icon: <MaterialIcons name="local-movies" size={20} />,
    },
    {
      id: 'b4',
      label: 'Butter Popcorn',
      icon: <MaterialIcons name="local-play" size={20} />,
    },
    {
      id: 'b5',
      label: 'Indie Lover',
      icon: <MaterialIcons name="theaters" size={20} />,
    },
    {
      id: 'b6',
      label: 'Festival Goer',
      icon: <MaterialIcons name="festival" size={20} />,
    },
  ];
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {badges.map(b => (
        <View
          key={b.id}
          style={{
            width: '30%',
            aspectRatio: 1,
            borderWidth: 1,
            borderColor: '#e5e5e5',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
          <View style={{ marginBottom: 6 }}>{b.icon}</View>
          <Text
            style={{ fontSize: 12, fontWeight: '600', textAlign: 'center' }}
          >
            {b.label}
          </Text>
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

/* ===== Styles ===== */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  // Light gray top band
  topBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E9EBEF',
  },

  profileContainer: {
    paddingHorizontal: 20,
  },

  // Avatar sits left and is bisected by band boundary via negative marginTop
  profileImage: {
    alignSelf: 'flex-start',
  },

  // Typography hierarchy
  name: {
    marginTop: 12,
    fontSize: 28, // biggest on page
    fontWeight: '800',
    color: '#000',
  },
  username: {
    marginTop: 4,
    fontSize: 20, // second biggest
    color: '#9A9A9A', // light gray
    fontWeight: '600',
  },
  bio: {
    marginTop: 10,
    color: '#555',
    lineHeight: 20,
    paddingHorizontal: 6, // whitespace left/right
  },

  // Stats row
  statsRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCell: {
    flex: 1,
  },
  statCenter: {
    alignItems: 'center',
    textAlign: 'center',
  },
  statRight: {
    alignItems: 'flex-end',
  },
  statLabel: { fontWeight: '600' },
  whatsappLabel: { fontWeight: '600' },

  // Square outline buttons (equal width & centered row)
  buttonRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignSelf: 'center', // center the whole row
    width: '88%', // control total row width
    gap: 12, // RN >=0.71 supports gap; otherwise use space-between
  },
  buttonOutlineSquare: {
    flex: 1, // equal widths
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 0, // square corners
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutlineSquareText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Tabs
  tabContainer: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  tab: {
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#000',
  },
  tabLabel: { fontSize: 12, marginTop: 2, color: '#333' },
  tabLabelActive: { fontWeight: '700', color: '#000' },

  // Example posts (used in Posts tab)
  postContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  postProfile: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postName: { fontWeight: '600' },
  postText: { color: '#333', marginVertical: 6 },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },

  // CTA (only for Posts)
  postCTA: {
    backgroundColor: '#000',
    padding: 12,
    margin: 20,
    borderRadius: 8,
  },
  postCTAText: { color: '#fff', textAlign: 'center', fontSize: 16 },

  // Events chips
  chipBtn: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  chipBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  chipBtnOutline: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  chipBtnOutlineText: {
    color: '#000',
    fontWeight: '600',
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

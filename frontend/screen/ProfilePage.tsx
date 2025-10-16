import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
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

const ProfilePage = ({ user }: Props) => {
  const u = { ...fallbackUser, ...(user || {}) };

  return (
    <View style={styles.screen}>
      {/* Scrollable content (pad bottom for fixed nav) */}
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons
            name="settings-outline"
            size={24}
            color="black"
            style={styles.settingsIcon}
          />
        </View>

        {/* Profile block */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: u.profilePic }} style={styles.profileImage} />
          <Text style={styles.name}>{u.name}</Text>
          <Text style={styles.username}>@{u.username}</Text>
          <Text style={styles.bio}>{u.bio}</Text>

          {/* Stats + link */}
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>
              {formatCount(u.followers)}{' '}
              <Text style={styles.bold}>Followers</Text>
            </Text>
            <Text style={styles.statText}>
              {u.following} <Text style={styles.bold}>Following</Text>
            </Text>
            <TouchableOpacity style={styles.link}>
              <Ionicons name="call-outline" size={14} color="#007AFF" />
              <Text style={styles.linkText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOutline}>
              <Text style={styles.buttonOutlineText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs row (visual only; wire to routes later if you add them) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tab}>
            <FontAwesome5 name="th-large" size={18} color="#000" />
            <Text style={styles.tabLabel}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="calendar-outline" size={20} color="#000" />
            <Text style={styles.tabLabel}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="trophy-outline" size={20} color="#000" />
            <Text style={styles.tabLabel}>Badges</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <MaterialIcons name="movie-filter" size={22} color="#000" />
            <Text style={styles.tabLabel}>Movies</Text>
          </TouchableOpacity>
        </View>

        {/* Example Post */}
        <View style={styles.postContainer}>
          <Image source={{ uri: u.profilePic }} style={styles.postProfile} />
          <View style={{ flex: 1 }}>
            <Text style={styles.postName}>{u.name}</Text>
            <Text style={styles.postText}>
              SRK in his lover era again and I’m not surviving this one.
            </Text>
            <View style={styles.postActions}>
              <Text>❤️ 1.23k</Text>
              <Text>💬 1.23k</Text>
              <Text>🔁 1.23k</Text>
              <Text>📤</Text>
            </View>
          </View>
        </View>

        {/* Create Post CTA */}
        <TouchableOpacity
          style={styles.postCTA}
          onPress={() => router.push('/post')}
        >
          <Text style={styles.postCTAText}>➕ Create a Post</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Fixed bottom nav (Router-native version) */}
      <View style={styles.bottomBar}>
        <BottomNavBar />
      </View>
    </View>
  );
};

function formatCount(n?: number) {
  if (n === undefined || n === null) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

export default ProfilePage;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 60,
    backgroundColor: '#E9EBEF',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
  },
  settingsIcon: { marginBottom: 8 },

  profileContainer: { alignItems: 'center', padding: 20 },
  profileImage: { width: 90, height: 90, borderRadius: 45, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: '700' },
  username: { color: 'gray', marginBottom: 8 },
  bio: {
    textAlign: 'center',
    color: '#555',
    paddingHorizontal: 25,
    marginBottom: 10,
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  statText: { color: '#000' },
  bold: { fontWeight: '600' },
  link: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkText: { color: '#007AFF', fontWeight: '500' },

  buttonRow: { flexDirection: 'row', gap: 12 },
  button: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonOutlineText: { color: '#000', fontWeight: '600' },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    marginTop: 10,
  },
  tab: { alignItems: 'center' },
  tabLabel: { fontSize: 12, marginTop: 2 },

  postContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  postProfile: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postName: { fontWeight: '600' },
  postText: { color: '#333', marginVertical: 6 },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },

  postCTA: {
    backgroundColor: '#000',
    padding: 12,
    margin: 20,
    borderRadius: 8,
  },
  postCTAText: { color: '#fff', textAlign: 'center', fontSize: 16 },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

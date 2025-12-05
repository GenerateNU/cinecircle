import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';

import { getUserProfile } from '../services/userService';
import { getFollowers, getFollowing } from '../services/followService';
import { getMovieByCinecircleId } from '../services/moviesService';

import { User, Props } from '../types/models';
import type { components } from '../types/api-generated';

type UserProfile = components['schemas']['UserProfile'];

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.2);
const AVATAR_SIZE = 100;
const AVATAR_RADIUS = AVATAR_SIZE / 2;

type TabKey = 'movies' | 'posts' | 'events' | 'badges';

const ProfilePage = ({ user, userId }: Props) => {
  const [activeTab, setActiveTab] = useState<TabKey>('movies');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const profileRes = await getUserProfile();
      if (profileRes.userProfile?.userId) {
        setProfile(profileRes.userProfile);

        const targetUserId = userId || profileRes.userProfile.userId;

        const [followersRes, followingRes] = await Promise.all([
          getFollowers(targetUserId),
          getFollowing(targetUserId),
        ]);

        setFollowersCount(followersRes?.followers?.length || 0);
        setFollowingCount(followingRes?.following?.length || 0);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Build display user from real data + placeholders
  const u: User =
    profile && profile.userId
      ? {
          name: profile.username || 'User',
          username: profile.username || 'user',
          bio: 'Movie enthusiast',
          followers: followersCount,
          following: followingCount,
          profilePic:
            profile.profilePicture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.username || 'User'
            )}&size=200&background=667eea&color=fff`,
        }
      : user || {
          name: 'User',
          username: 'user',
          bio: 'Movie enthusiast',
          followers: 0,
          following: 0,
          profilePic:
            'https://ui-avatars.com/api/?name=User&size=200&background=667eea&color=fff',
        };

  // Pull bookmark arrays out of the loaded profile
  const bookmarkedToWatch: string[] = (profile as any)?.bookmarkedToWatch ?? [];
  const bookmarkedWatched: string[] = (profile as any)?.bookmarkedWatched ?? [];

  return (
    <View style={styles.screen}>
      {/* Light gray band */}
      <View style={[styles.topBand, { height: HEADER_HEIGHT }]} />

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        <View style={{ height: HEADER_HEIGHT }} />

        {/* Profile block */}
        <View style={styles.profileContainer}>
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

          <Text style={styles.name}>{u.name}</Text>
          <Text style={styles.username}>@{u.username}</Text>

          <Text style={styles.bio}>{u.bio}</Text>

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
          {activeTab === 'movies' && (
            <MoviesGrid
              userId={profile?.userId || userId}
              bookmarkedToWatch={bookmarkedToWatch}
              bookmarkedWatched={bookmarkedWatched}
            />
          )}
          {activeTab === 'posts' && <PostsList user={u} />}
          {activeTab === 'events' && <EventsList />}
          {activeTab === 'badges' && <BadgesGrid />}
        </View>

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

/* ===== Movies Tab (uses bookmark arrays directly) ===== */

type MovieListItem = {
  id: string;
  title: string;
  poster?: string | null;
};

type MoviesGridProps = {
  userId?: string | null;
  bookmarkedToWatch: string[];
  bookmarkedWatched: string[];
};

const MoviesGrid = ({
  userId,
  bookmarkedToWatch,
  bookmarkedWatched,
}: MoviesGridProps) => {
  const [activeSubTab, setActiveSubTab] = useState<'toWatch' | 'completed'>(
    'completed'
  );
  const [moviesByStatus, setMoviesByStatus] = useState<
    Record<'toWatch' | 'completed', MovieListItem[]>
  >({
    toWatch: [],
    completed: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const movies = moviesByStatus[activeSubTab];
  const showBookmark = activeSubTab === 'toWatch';

  const fetchMoviesForIds = useCallback(
    async (ids: string[]): Promise<MovieListItem[]> => {
      if (!ids || ids.length === 0) return [];

      const results = await Promise.all(
        ids.map(async movieId => {
          try {
            const envelope = await getMovieByCinecircleId(movieId);
            const movie =
              (envelope as any)?.data ?? (envelope as any)?.movie ?? null;

            return {
              id: movieId,
              title: movie?.title || `Movie ${movieId}`,
              poster: movie?.imageUrl ?? null,
            } as MovieListItem;
          } catch (err) {
            console.error('Failed to fetch movie detail:', err);
            return {
              id: movieId,
              title: `Movie ${movieId}`,
              poster: null,
            } as MovieListItem;
          }
        })
      );

      // Deduplicate by id
      return results.filter(
        (m, index, self) => self.findIndex(x => x.id === m.id) === index
      );
    },
    []
  );

  const syncMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // If no user or no bookmark data, just clear
      if (!userId) {
        setMoviesByStatus({ toWatch: [], completed: [] });
        return;
      }

      const [toWatchMovies, completedMovies] = await Promise.all([
        fetchMoviesForIds(bookmarkedToWatch),
        fetchMoviesForIds(bookmarkedWatched),
      ]);

      setMoviesByStatus({
        toWatch: toWatchMovies,
        completed: completedMovies,
      });

      if (completedMovies.length > 0) {
        setActiveSubTab('completed');
      } else if (toWatchMovies.length > 0) {
        setActiveSubTab('toWatch');
      } else {
        setActiveSubTab('completed');
      }
    } catch (err: any) {
      console.error('Failed to load movies for user:', err);
      setError(err?.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, [userId, bookmarkedToWatch, bookmarkedWatched, fetchMoviesForIds]);

  // Re-sync whenever userId or bookmark arrays change
  useEffect(() => {
    syncMovies();
  }, [syncMovies]);

  const emptyMessage = useMemo(() => {
    if (!userId) return 'Sign in to see your movies.';
    if (activeSubTab === 'toWatch') return 'No watchlist movies yet.';
    return 'No movies found for this user.';
  }, [activeSubTab, userId]);

  const renderMovie = ({ item }: { item: MovieListItem }) => (
    <View style={tw`w-1/3 p-1`}>
      {item.poster ? (
        <Image
          source={{ uri: item.poster }}
          style={[
            tw`w-full rounded-md`,
            { aspectRatio: 2 / 3 }, // classic poster ratio
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            tw`w-full rounded-md items-center justify-center bg-gray-200`,
            { aspectRatio: 2 / 3 },
          ]}
        >
          <Ionicons name="film-outline" size={22} color="#555" />
        </View>
      )}
    </View>
  );

  return (
    <View>
      {/* Sub-tabs */}
      <View
        style={[
          tw`flex-row items-center mb-4`,
          {
            backgroundColor: '#FBEAE6',
            borderRadius: 12,
            padding: 4,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            tw`flex-1 items-center justify-center`,
            {
              paddingVertical: 8,
              borderRadius: 8,
              marginHorizontal: 2,
              backgroundColor:
                activeSubTab === 'toWatch' ? '#D62E05' : 'transparent',
            },
          ]}
          onPress={() => setActiveSubTab('toWatch')}
        >
          <Text
            style={[
              tw`text-sm font-semibold`,
              { color: activeSubTab === 'toWatch' ? '#FBEAE6' : '#D62E05' },
            ]}
          >
            To Be Watched
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`flex-1 items-center justify-center`,
            {
              paddingVertical: 8,
              borderRadius: 8,
              marginHorizontal: 2,
              backgroundColor:
                activeSubTab === 'completed' ? '#D62E05' : 'transparent',
            },
          ]}
          onPress={() => setActiveSubTab('completed')}
        >
          <Text
            style={[
              tw`text-sm font-semibold`,
              { color: activeSubTab === 'completed' ? '#FBEAE6' : '#D62E05' },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={tw`py-6 items-center`}>
          <ActivityIndicator size="small" color="#D62E05" />
          <Text style={tw`mt-2 text-gray-600`}>Loading movies…</Text>
        </View>
      ) : error ? (
        <View style={tw`py-4`}>
          <Text style={tw`text-red-600 mb-2`}>{error}</Text>
          <TouchableOpacity
            onPress={syncMovies}
            style={tw`self-start px-3 py-2 rounded bg-black`}
          >
            <Text style={tw`text-white font-semibold`}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : movies.length === 0 ? (
        <Text style={tw`text-gray-600 px-1 py-2`}>{emptyMessage}</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={item => item.id}
          renderItem={renderMovie}
          numColumns={3}
          scrollEnabled={false}
          removeClippedSubviews={false}
          initialNumToRender={movies.length || 9}
          maxToRenderPerBatch={movies.length || 9}
          windowSize={Math.max(5, movies.length || 5)}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={tw`justify-start`}
          ListFooterComponent={<View style={tw`h-2`} />}
        />
      )}
    </View>
  );
};

/* ===== Posts Tab ===== */

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

/* ===== Events & Badges stay unchanged ===== */

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

/* ===== Helpers & Styles (unchanged) ===== */

function formatCount(n?: number) {
  if (n === undefined || n === null) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

export default ProfilePage;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
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
  profileImage: {
    alignSelf: 'flex-start',
  },
  name: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
  },
  username: {
    marginTop: 4,
    fontSize: 20,
    color: '#9A9A9A',
    fontWeight: '600',
  },
  bio: {
    marginTop: 10,
    color: '#555',
    lineHeight: 20,
    paddingHorizontal: 6,
  },
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

  buttonRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignSelf: 'center',
    width: '88%',
    gap: 12,
  },
  buttonOutlineSquare: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutlineSquareText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
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
  postCTA: {
    backgroundColor: '#000',
    padding: 12,
    margin: 20,
    borderRadius: 8,
  },
  postCTAText: { color: '#fff', textAlign: 'center', fontSize: 16 },
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

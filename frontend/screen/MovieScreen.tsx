// frontend/app/screens/MoviesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import MovieChosenScreen from './MovieChosenScreen';
import RecByFriendsScreen from './RecByFriendsScreen';
import SearchBar from '../components/SearchBar';
import { getAllMovies } from '../services/moviesService';
import type { Movie as ApiMovie } from '../types/models';

// ✅ FIX: correct i18n imports (no extra /app, right folder name)
import { t, getLanguage } from '../app/il8n/il8n';
import { UiTextKey } from '../app/il8n/keys';

// ✅ Make sure this exists and is exported
import { fetchUserProfile } from '../services/userService';
import { router } from 'expo-router';

interface MovieCard {
  id: string;
  title: string;
  badge?: 'New!' | 'Hot!';
  image: string;
}

const MOCK_MOVIES: MovieCard[] = [
  {
    id: '1',
    title: 'Inception',
    badge: 'New!',
    image: 'https://via.placeholder.com/150x220/667eea/ffffff?text=Movie+1',
  },
  {
    id: '2',
    title: 'The Matrix',
    badge: 'Hot!',
    image: 'https://via.placeholder.com/150x220/f093fb/ffffff?text=Movie+2',
  },
  {
    id: '3',
    title: 'Interstellar',
    image: 'https://via.placeholder.com/150x220/4facfe/ffffff?text=Movie+3',
  },
  {
    id: '4',
    title: 'The Dark Knight',
    badge: 'New!',
    image: 'https://via.placeholder.com/150x220/00f2fe/ffffff?text=Movie+4',
  },
  {
    id: '5',
    title: 'Pulp Fiction',
    image: 'https://via.placeholder.com/150x220/43e97b/ffffff?text=Movie+5',
  },
  {
    id: '6',
    title: 'Fight Club',
    image: 'https://via.placeholder.com/150x220/fa709a/ffffff?text=Movie+6',
  },
  {
    id: '7',
    title: 'Forrest Gump',
    badge: 'New!',
    image: 'https://via.placeholder.com/150x220/fee140/ffffff?text=Movie+7',
  },
  {
    id: '8',
    title: 'The Godfather',
    image: 'https://via.placeholder.com/150x220/30cfd0/ffffff?text=Movie+8',
  },
  {
    id: '9',
    title: 'Goodfellas',
    image: 'https://via.placeholder.com/150x220/a8edea/ffffff?text=Movie+9',
  },
];
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MoviesScreen() {
  const [activeTab, setActiveTab] = useState<'forYou' | 'recommended'>(
    'forYou'
  );
  const [searchText, setSearchText] = useState('');
  const [showMovieDetail, setShowMovieDetail] = useState(false);

  const [newReleases, setNewReleases] = useState<MovieCard[]>([]);
  const [loadingNewReleases, setLoadingNewReleases] = useState(false);
  const [newReleasesError, setNewReleasesError] = useState<string | null>(null);

  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const handleSearchSubmit = (text: string): void => {
    const query = (text || '').trim();
    if (!query) {
      return;
    }
    router.push({
      pathname: '/profilePage/user/[userId]',
      params: {
        userId: query,
        username: query,
        name: query,
      },
    });
  };

  // 🔍 Log every render to see what language + labels we get
  console.log('[MoviesScreen] render', {
    lang: getLanguage(),
    forYouLabel: t(UiTextKey.ForYou),
    newReleasesLabel: t(UiTextKey.NewReleases),
  });

  useEffect(() => {
    const init = async () => {
      // 1) Fetch user profile and set language
      try {
        console.log('[MoviesScreen] calling fetchUserProfile...');
        await fetchUserProfile(); // should log [user] ... and call setLanguage()
      } catch (err) {
        console.log('[MoviesScreen] fetchUserProfile error:', err);
      }

      // 2) Fetch New Releases
      try {
        setLoadingNewReleases(true);
        setNewReleasesError(null);

        console.log('Fetching movies for New Releases...');
        const apiMovies = await getAllMovies();
        console.log('Movies from API:', apiMovies);

        if (!apiMovies || apiMovies.length === 0) {
          setNewReleases([]);
          return;
        }

        const mapped: MovieCard[] = apiMovies
          .slice(0, 8)
          .map((m: ApiMovie, index) => {
            const title = m.title ?? 'Untitled';
            const movieId = m.movieId ?? String(index);
            const badge: MovieCard['badge'] | undefined =
              index < 3 ? 'New!' : undefined;

            const imagePath = m.imageUrl ?? ''; // e.g. "/ii8QGacT3MXESqBckQlyrATY0lT.jpg"

            const image =
              imagePath && imagePath.trim().length > 0
                ? `${TMDB_IMAGE_BASE_URL}${
                    imagePath.startsWith('/') ? '' : '/'
                  }${imagePath}`
                : `https://via.placeholder.com/150x220/667eea/ffffff?text=${encodeURIComponent(
                    title
                  )}`;

            return { id: movieId, title, badge, image };
          });

        setNewReleases(mapped);
      } catch (error) {
        console.error('Error fetching movies for New Releases:', error);
        setNewReleasesError('Failed to load new releases');
      } finally {
        setLoadingNewReleases(false);
      }
    };

    init();
  }, []);

  const handleMoviePress = (movieId: string) => {
    setSelectedMovieId(movieId);
    setShowMovieDetail(true);
  };

  const renderMovieCard = (movie: MovieCard) => (
    <TouchableOpacity
      key={movie.id}
      style={styles.movieCard}
      onPress={() => handleMoviePress(movie.id)}
    >
      <Text
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          color: '#fff',
          fontWeight: '600',
          textShadowColor: '#000',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 4,
        }}
      >
        {movie.title}
        {'\n'}
        {movie.id}
      </Text>
      <Image source={{ uri: movie.image }} style={styles.movieImage} />
      {movie.badge && (
        <View
          style={[
            styles.badge,
            movie.badge === 'New!' ? styles.badgeNew : styles.badgeHot,
          ]}
        >
          <Text style={styles.badgeText}>{movie.badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // ✅ Use UiTextKey instead of string, and branch on the enum
  const renderSection = (titleKey: UiTextKey, movies: MovieCard[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t(titleKey)}</Text>

      {titleKey === UiTextKey.NewReleases && loadingNewReleases && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="small" />
          <Text style={{ marginLeft: 8, color: '#666' }}>
            Loading new releases...
          </Text>
        </View>
      )}

      {titleKey === UiTextKey.NewReleases &&
        newReleasesError &&
        !loadingNewReleases && (
          <Text style={{ paddingHorizontal: 16, color: '#FF3B30' }}>
            {newReleasesError}
          </Text>
        )}

      {titleKey === UiTextKey.NewReleases &&
        !loadingNewReleases &&
        !newReleasesError &&
        movies.length === 0 && (
          <Text style={{ paddingHorizontal: 16, color: '#666' }}>
            No movies found yet.
          </Text>
        )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moviesList}
      >
        {movies.map(renderMovieCard)}
      </ScrollView>
    </View>
  );

  const newReleasesToShow = newReleases;

  return (
    <SafeAreaView style={styles.screen}>
      <SearchBar
        placeholder="Enter search text"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearchSubmit}
      />

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('forYou')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'forYou' && styles.tabTextActive,
            ]}
          >
            {t(UiTextKey.ForYou)}
          </Text>
          {activeTab === 'forYou' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('recommended')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'recommended' && styles.tabTextActive,
            ]}
          >
            {t(UiTextKey.RecommendedByFriends)}
          </Text>
          {activeTab === 'recommended' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {activeTab === 'forYou' ? (
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {renderSection(UiTextKey.NewReleases, newReleasesToShow)}
          {renderSection(UiTextKey.Genre, MOCK_MOVIES.slice(4, 7))}
          {renderSection(UiTextKey.Genre, MOCK_MOVIES.slice(6, 9))}
        </ScrollView>
      ) : (
        <RecByFriendsScreen />
      )}

      <Modal
        visible={showMovieDetail}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMovieDetail(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowMovieDetail(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {selectedMovieId ? (
            <MovieChosenScreen movieId={selectedMovieId} />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>No movie selected.</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 32,
  },
  tab: { paddingVertical: 12, position: 'relative' },
  tabText: { fontSize: 16, color: '#666', fontWeight: '400' },
  tabTextActive: { color: '#000', fontWeight: '600' },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  content: { flex: 1 },
  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  moviesList: { paddingHorizontal: 16, gap: 12 },
  movieCard: {
    width: 150,
    height: 220,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  movieImage: { width: '100%', height: '100%', borderRadius: 12 },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
  },
  badgeNew: { backgroundColor: '#fff', borderColor: '#E91E63' },
  badgeHot: { backgroundColor: '#fff', borderColor: '#000' },
  badgeText: { fontSize: 14, fontWeight: '600', color: '#000' },
  modalHeader: {
    padding: 16,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  closeText: { fontSize: 24, color: '#000' },
});

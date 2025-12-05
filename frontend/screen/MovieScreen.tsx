import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import RecByFriendsScreen from './RecByFriendsScreen';
import SearchBar from '../components/SearchBar';
import {
  getAllMovies,
  getMoviesAfterYear,
  getMoviesRandom10,
} from '../services/moviesService';
import type { components } from '../types/api-generated';
import { t, getLanguage } from '../il8n/_il8n';
import { UiTextKey } from '../il8n/_keys';
import { fetchUserProfile } from '../services/userService';
import { router } from 'expo-router';

type Movie = components['schemas']['Movie'];

interface MovieCard {
  id: string;
  title: string;
  badge?: 'New!' | 'Hot!';
  image: string;
}

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const MOVIES_AFTER_YEAR = 2015;

export default function MoviesScreen() {
  const [activeTab, setActiveTab] = useState<'forYou' | 'recommended'>(
    'forYou'
  );
  const [searchText, setSearchText] = useState('');

  // 🔹 New Releases
  const [newReleases, setNewReleases] = useState<MovieCard[]>([]);
  const [loadingNewReleases, setLoadingNewReleases] = useState(false);
  const [newReleasesError, setNewReleasesError] = useState<string | null>(null);

  // 🔹 Movies after a certain year
  const [moviesAfterYear, setMoviesAfterYear] = useState<MovieCard[]>([]);
  const [loadingAfterYear, setLoadingAfterYear] = useState(false);
  const [afterYearError, setAfterYearError] = useState<string | null>(null);

  // 🔹 Random 10 movies
  const [randomMovies, setRandomMovies] = useState<MovieCard[]>([]);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [randomError, setRandomError] = useState<string | null>(null);

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

  console.log('[MoviesScreen] render', {
    lang: getLanguage(),
    forYouLabel: t(UiTextKey.ForYou),
    newReleasesLabel: t(UiTextKey.NewReleases),
  });

  // Helper to map backend Movie → MovieCard
  const mapMoviesToCards = (
    apiMovies: Movie[],
    withBadgesForFirstThree: boolean
  ): MovieCard[] => {
    return apiMovies.map((m: Movie, index) => {
      const title = m.title ?? 'Untitled';
      const movieId = m.movieId ?? String(index);
      const badge: MovieCard['badge'] | undefined =
        withBadgesForFirstThree && index < 3 ? 'New!' : undefined;

      const imagePath = m.imageUrl ?? '';

      const image =
        imagePath && imagePath.trim().length > 0
          ? `${TMDB_IMAGE_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
          : `https://via.placeholder.com/150x220/667eea/ffffff?text=${encodeURIComponent(
              title
            )}`;

      return { id: movieId, title, badge, image };
    });
  };

  useEffect(() => {
    const init = async () => {
      // 1) Fetch user profile and set language
      try {
        console.log('[MoviesScreen] calling fetchUserProfile...');
        await fetchUserProfile();
      } catch (err) {
        console.log('[MoviesScreen] fetchUserProfile error:', err);
      }

      // 2) Fetch sections in parallel
      try {
        setLoadingNewReleases(true);
        setLoadingAfterYear(true);
        setLoadingRandom(true);
        setNewReleasesError(null);
        setAfterYearError(null);
        setRandomError(null);

        const [allMovies, afterYearMovies, random10Movies] = await Promise.all([
          getAllMovies(),
          getMoviesAfterYear(MOVIES_AFTER_YEAR),
          getMoviesRandom10(),
        ]);

        // 🔸 New Releases: slice + badges
        if (allMovies && allMovies.length > 0) {
          const mappedNew = mapMoviesToCards(
            allMovies.slice(0, 8),
            true // badges for first few
          );
          setNewReleases(mappedNew);
        } else {
          setNewReleases([]);
        }

        // 🔸 Movies after year (no badges)
        if (afterYearMovies && afterYearMovies.length > 0) {
          const mappedAfter = mapMoviesToCards(afterYearMovies, false);
          setMoviesAfterYear(mappedAfter);
        } else {
          setMoviesAfterYear([]);
        }

        // 🔸 Random 10 movies (no badges)
        if (random10Movies && random10Movies.length > 0) {
          const mappedRandom = mapMoviesToCards(random10Movies, false);
          setRandomMovies(mappedRandom);
        } else {
          setRandomMovies([]);
        }
      } catch (error: any) {
        console.error('Error fetching movie sections:', error);
        if (!newReleases.length) {
          setNewReleasesError('Failed to load new releases');
        }
        setAfterYearError('Failed to load movies');
        setRandomError('Failed to load random picks');
      } finally {
        setLoadingNewReleases(false);
        setLoadingAfterYear(false);
        setLoadingRandom(false);
      }
    };

    init();
  }, []);

  const handleMoviePress = (movieId: string) => {
    router.push({
      pathname: '/movies/[movieId]',
      params: { movieId },
    });
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

  // 🔹 Generic section renderer (still used for New Releases)
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

  // 🔹 Section for "Movies Since YEAR"
  const renderAfterYearSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Movies Since {MOVIES_AFTER_YEAR}</Text>

      {loadingAfterYear && (
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
            Loading movies...
          </Text>
        </View>
      )}

      {afterYearError && !loadingAfterYear && (
        <Text style={{ paddingHorizontal: 16, color: '#FF3B30' }}>
          {afterYearError}
        </Text>
      )}

      {!loadingAfterYear && !afterYearError && moviesAfterYear.length === 0 && (
        <Text style={{ paddingHorizontal: 16, color: '#666' }}>
          No movies found for this year range.
        </Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moviesList}
      >
        {moviesAfterYear.map(renderMovieCard)}
      </ScrollView>
    </View>
  );

  // 🔹 Section for "Random Picks"
  const renderRandomSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Movies We Love For You</Text>

      {loadingRandom && (
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
            Loading random movies...
          </Text>
        </View>
      )}

      {randomError && !loadingRandom && (
        <Text style={{ paddingHorizontal: 16, color: '#FF3B30' }}>
          {randomError}
        </Text>
      )}

      {!loadingRandom && !randomError && randomMovies.length === 0 && (
        <Text style={{ paddingHorizontal: 16, color: '#666' }}>
          No random picks available.
        </Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moviesList}
      >
        {randomMovies.map(renderMovieCard)}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <SearchBar
        placeholder="Search movies..."
        value={searchText}
        onChangeText={setSearchText}
        onPress={() =>
          router.push({
            pathname: '/search',
            params: { origin: 'movies', defaultCategory: 'movies' },
          })
        }
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
          {renderAfterYearSection()}
          {renderRandomSection()}
        </ScrollView>
      ) : (
        <RecByFriendsScreen />
      )}
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
});

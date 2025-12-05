import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import SearchToggle from '../components/SearchToggle';
import MovieCard from '../components/MovieCard';
import UserCard from '../components/UserCard';
import TextPost from '../components/TextPost';
import PicturePost from '../components/PicturePost';
import ReviewPost from '../components/ReviewPost';
import EventCard from '../app/events/components/EventCard';
import {
  searchMovies,
  searchUsers,
  searchPosts,
  searchReviews,
  searchEvents,
  type MovieSearchResponse,
  type UserSearchResponse,
  type PostSearchResponse,
  // type ReviewSearchResponse,
} from '../services/searchService';
import type { components } from '../types/api-generated';

type Movie = components["schemas"]["Movie"];
type Post = components["schemas"]["Post"];
type Rating = components["schemas"]["Rating"];

const { width, height } = Dimensions.get('window');

type SearchCategory = 'movies' | 'posts' | 'events' | 'users';

export default function SearchResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    query: string;
    category: SearchCategory;
    origin?: string;
  }>();

  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>(
    (params.category as SearchCategory) || 'movies'
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchCategories = [
    { value: 'movies' as SearchCategory, label: 'Movies' },
    { value: 'posts' as SearchCategory, label: 'Posts' },
    { value: 'events' as SearchCategory, label: 'Events' },
    { value: 'users' as SearchCategory, label: 'Users' },
  ];

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery, selectedCategory);
    }
  }, [selectedCategory]);

  const performSearch = async (query: string, category: SearchCategory) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);

      let response;
      switch (category) {
        case 'movies':
          response = await searchMovies(query) as MovieSearchResponse;
          setResults(response.results || []);
          break;
        case 'users':
          response = await searchUsers(query) as UserSearchResponse;
          setResults(response.results || []);
          break;
        case 'posts':
          response = await searchPosts(query) as PostSearchResponse;
          setResults(response.results || []);
          break;
        case 'events':
          response = await searchEvents(query);
          setResults(response.results || []);
          break;
        default:
          setResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleNewSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
    performSearch(newQuery, selectedCategory);
  };

  const renderMovieResults = () => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.moviesScroll}
  >
    {results.map((movie: Movie, index) => (
      <MovieCard
        key={`${movie.movieId}-${index}`}  // ← Add index to ensure uniqueness
        movieId={movie.movieId}
        title={movie.title || 'Untitled'}
        imageUrl={movie.imageUrl}
        badge={index < 3 ? 'New!' : undefined}
        onPress={() => router.push({
          pathname: '/movies/[movieId]',
          params: { movieId: movie.movieId },
        })}
      />
    ))}
  </ScrollView>
);

  const renderUserResults = () => (
    <View>
      {results.map((user: any) => (
        <UserCard
          key={user.userId}
          userId={user.userId}
          username={user.username || 'Unknown'}
          avatarUri={user.profilePicture}
          favoriteGenres={user.favoriteGenres || []}
          isFollowing={false}
          onFollowPress={() => console.log('Follow user:', user.userId)}
        />
      ))}
    </View>
  );

  const renderPostResults = () => (
  <View style={styles.postsList}>
    {results.map((post: Post) => {
      const username = post.UserProfile?.username || 'Unknown';
      const userId = post.userId;
      const hasImages = post.imageUrls && post.imageUrls.length > 0;
      const isLongPost = post.type === 'LONG';
      const isShortPost = post.type === 'SHORT';
      const hasStars = post.stars !== null && post.stars !== undefined;

      // DEBUG: Log post details
      console.log('Post debug:', {
        id: post.id,
        type: post.type,
        isLongPost,
        isShortPost,
        hasStars,
        stars: post.stars,
        hasImages,
        imageUrls: post.imageUrls,
      });

      // LONG post with stars = ReviewPost
      if (isLongPost && hasStars) {
        console.log('✅ Rendering ReviewPost for:', post.id);
        return (
          <ReviewPost
            key={post.id}
            userName={username}
            username={username}
            date={formatDate(post.createdAt)}
            reviewerName={username}
            movieTitle={post.movie?.title || 'Unknown Movie'}
            rating={post.stars ?? undefined}
            userId={userId}
            reviewerUserId={userId}
            movieImageUrl={post.movie?.imageUrl || "https://via.placeholder.com/400x600/667eea/ffffff?text=Movie"}
          />
        );
      }

      // SHORT post with images = PicturePost
      if (isShortPost && hasImages) {
        console.log('✅ Rendering PicturePost for:', post.id);
        return (
          <PicturePost
            key={post.id}
            userName={username}
            username={username}
            date={formatDate(post.createdAt)}
            content={post.content}
            imageUrls={post.imageUrls}
            userId={userId}
          />
        );
      }

      // SHORT post without images = TextPost
      if (isShortPost && !hasImages) {
        console.log('✅ Rendering TextPost for:', post.id);
        return (
          <TextPost
            key={post.id}
            userName={username}
            username={username}
            date={formatDate(post.createdAt)}
            content={post.content}
            userId={userId}
          />
        );
      }

      // Fallback
      console.warn('❌ Post did not match any type:', post.type, post);
      return null;
    })}
  </View>
);

  const renderEventResults = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.eventsScroll}
    >
      {results.map((event: any) => (
        <EventCard
          key={event.id}
          event={event}
          onPress={() => router.push(`/events/eventDetail?eventId=${event.id}`)}
        />
      ))}
    </ScrollView>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays < 2) return '1d';
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderResults = () => {
    switch (selectedCategory) {
      case 'movies':
        return renderMovieResults();
      case 'users':
        return renderUserResults();
      case 'posts':
        return renderPostResults();
      case 'events':
        return renderEventResults();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* SearchBar */}
        <SearchBar
        placeholder={`Search ${selectedCategory}...`}
        value={searchQuery}
        onChangeText={setSearchQuery}
        editable={true}
        onSearchPress={() => {
            console.log('🔍 Search icon clicked!');
            performSearch(searchQuery, selectedCategory);
        }}
/>

      {/* Category Toggle */}
      <View style={styles.toggleContainer}>
        <SearchToggle
          options={searchCategories}
          activeOption={selectedCategory}
          onOptionChange={setSelectedCategory}
        />
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#D62E05" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="search" size={width * 0.16} color="#DDD" />
          <Text style={styles.emptyText}>
            No results found for "{searchQuery}"
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.resultsContainer}>
          <Text style={styles.resultCount}>
            {results.length} result{results.length !== 1 ? 's' : ''}
          </Text>
          {renderResults()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  backButtonContainer: {
    paddingHorizontal: width * 0.04,
  },
  backButton: {
    padding: width * 0.01,
    alignSelf: 'flex-start',
  },
  toggleContainer: {
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
  },
  resultsContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: '#999',
  },
  errorText: {
    fontSize: width * 0.04,
    color: '#FF0000',
    textAlign: 'center',
    paddingHorizontal: width * 0.08,
  },
  emptyText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: width * 0.08,
  },
  resultCount: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: height * 0.01,
  },
  moviesScroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  postsList: {
    paddingHorizontal: width * 0.04,
  },
  reviewsList: {
    paddingHorizontal: width * 0.04,
  },
  eventsScroll: {
    paddingHorizontal: width * 0.04,
  },
}); 
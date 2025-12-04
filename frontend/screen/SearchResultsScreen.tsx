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
  type ReviewSearchResponse,
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
    <View style={styles.movieGrid}>
      {results.map((movie: Movie) => (
        <MovieCard
          key={movie.movieId}
          movieId={movie.movieId}
          title={movie.title || 'Untitled'}
          imageUrl={movie.imageUrl}
          rating={movie.imdbRating ? movie.imdbRating / 10 : undefined}
        />
      ))}
    </View>
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
        const hasImage = post.imageUrls !== null;

        if (hasImage) {
          return (
            <PicturePost
              key={post.id}
              userName={username}
              username={username}
              date={formatDate(post.createdAt)}
              content={post.content}
              imageUrls={post.imageUrls ? post.imageUrls : []}
              userId={post.userId}
            />
          );
        }

        return (
          <TextPost
            key={post.id}
            userName={username}
            username={username}
            date={formatDate(post.createdAt)}
            content={post.content}
            userId={post.userId}
          />
        );
      })}
    </View>
  );

  const renderReviewResults = () => (
    <View style={styles.reviewsList}>
      {results.map((rating: Rating) => {
        const username = rating.UserProfile?.username || 'Unknown';
        return (
          <ReviewPost
            key={rating.id}
            userName={username}
            username={username}
            date={formatDate(rating.date)}
            reviewerName={username}
            movieTitle={`Movie #${rating.movieId}`}
            rating={rating.stars}
            userId={rating.userId}
            reviewerUserId={rating.userId}
            movieImageUrl="https://via.placeholder.com/400x600/667eea/ffffff?text=Movie"
          />
        );
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
  movieGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',  // ✅ Add the value and comma
  paddingHorizontal: width * 0.02,
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
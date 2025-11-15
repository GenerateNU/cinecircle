import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import RecommendedMovieCard from '../components/RecommendedMovieCard';
import { getMutualRecommendations } from '../services/recommendationsService';
import type { MutualRecommendation } from '../types/models';

const { width } = Dimensions.get('window');

export default function RecByFriendsScreen() {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<MutualRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMutualRecommendations();
        if (!active) return;
        setRecommendations(response.data ?? []);
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load recommendations';
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadRecommendations();
    return () => {
      active = false;
    };
  }, []);

  const filteredRecommendations = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return recommendations;

    return recommendations.filter((rec) => {
      const title = rec.movie.title?.toLowerCase() ?? '';
      const friends = rec.likedBy
        .map((friend) => friend.username?.toLowerCase() ?? '')
        .join(' ');
      return title.includes(trimmed) || friends.includes(trimmed);
    });
  }, [query, recommendations]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color="#8B7FD6" />
          <Text style={styles.feedbackText}>Loading recommendations...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>{error}</Text>
        </View>
      );
    }

    if (filteredRecommendations.length === 0) {
      return (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>
            {recommendations.length === 0
              ? 'No mutual friend likes yet.'
              : 'No matches. Try a different search.'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredRecommendations.map((rec) => (
          <RecommendedMovieCard
            key={rec.movie.movieId}
            recommendation={rec}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search by title or friend"
        value={query}
        onChangeText={setQuery}
      />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: width * 0.04,
    paddingBottom: width * 0.08,
  },
  feedbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.1,
  },
  feedbackText: {
    marginTop: width * 0.04,
    color: '#6B6B6B',
    fontSize: width * 0.04,
    textAlign: 'center',
  },
});

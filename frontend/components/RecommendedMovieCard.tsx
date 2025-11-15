import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import type { MutualRecommendation } from '../types/models';

const { width } = Dimensions.get('window');

type Props = {
  recommendation: MutualRecommendation;
};

const formatFriendNames = (likedBy: MutualRecommendation['likedBy']) => {
  if (!likedBy.length) return 'No friends yet';
  return likedBy
    .map((friend, idx) => friend.username?.trim() || `Friend ${idx + 1}`)
    .join(', ');
};

export default function RecommendedMovieCard({ recommendation }: Props) {
  const { movie, likedBy } = recommendation;
  const primaryFriend = likedBy[0];
  const posterUri = extractPosterUri(movie);
  const [useFallbackPoster, setUseFallbackPoster] = useState(!posterUri);

  useEffect(() => {
    setUseFallbackPoster(!posterUri);
  }, [posterUri, movie.movieId]);

  return (
    <View style={styles.card}>
      {useFallbackPoster ? (
        <View style={[styles.poster, styles.posterFallback]}>
          <View style={styles.posterGlyph}>
            <Text style={styles.posterGlyphText}>🎬</Text>
          </View>
          <Text style={styles.posterFallbackLabel}>No Poster</Text>
        </View>
      ) : (
        <Image
          source={{ uri: posterUri! }}
          style={styles.poster}
          resizeMode="cover"
          onError={() => setUseFallbackPoster(true)}
        />
      )}
      <View style={styles.meta}>
        <Text style={styles.title}>{movie.title ?? 'Untitled film'}</Text>
        {movie.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {movie.description}
          </Text>
        ) : null}
        <Text style={styles.friendsLabel}>
          Recommended by{' '}
          <Text style={styles.friendsValue}>
            {primaryFriend?.username ?? 'a friend'}
          </Text>
          {likedBy.length > 1 ? ` +${likedBy.length - 1}` : ''}
        </Text>
      </View>
    </View>
  );
}

const extractPosterUri = (movie: MutualRecommendation['movie']) => {
  const candidates = [
    movie.posterUrl,
    (movie as { posterPath?: string | null }).posterPath,
    (movie as { imageUrl?: string | null }).imageUrl,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (trimmed) return trimmed;
    }
  }
  return null;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: width * 0.03,
    overflow: 'hidden',
    marginBottom: width * 0.04,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  poster: {
    width: '100%',
    height: width * 1.1,
  },
  posterFallback: {
    backgroundColor: '#F1F0FB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width * 0.08,
  },
  posterGlyph: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: width * 0.05,
    backgroundColor: '#DFDCF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: width * 0.03,
  },
  posterGlyphText: {
    fontSize: width * 0.11,
  },
  posterFallbackLabel: {
    fontSize: width * 0.04,
    letterSpacing: 1,
    color: '#7C7C88',
    textTransform: 'uppercase',
  },
  meta: {
    padding: width * 0.04,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: width * 0.02,
  },
  description: {
    fontSize: width * 0.0375,
    color: '#4A4A4A',
    lineHeight: width * 0.05,
    marginBottom: width * 0.03,
  },
  friendsLabel: {
    fontSize: width * 0.035,
    color: '#6B6B6B',
  },
  friendsValue: {
    fontWeight: '600',
    color: '#2D2D2D',
  },
});

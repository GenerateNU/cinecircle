import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

type MovieCardProps = {
  movieId: string;
  title: string;
  imageUrl?: string | null;
  badge?: 'New!' | 'Hot!';
  onPress?: () => void;
};

export default function MovieCard({
  movieId,
  title,
  imageUrl,
  badge,
  onPress,
}: MovieCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: '/movies/[movieId]',
        params: { movieId },
      });
    }
  };

  const formatImageUrl = (url: string | null | undefined) => {
    if (!url) {
      return `https://via.placeholder.com/150x220/667eea/ffffff?text=${encodeURIComponent(title)}`;
    }
    
    if (url.startsWith('http')) {
      return url;
    }
    
    return `${TMDB_IMAGE_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: formatImageUrl(imageUrl) }} style={styles.movieImage} />
      {badge && (
        <View
          style={[
            styles.badge,
            badge === 'New!' ? styles.badgeNew : styles.badgeHot,
          ]}
        >
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  movieCard: {
    width: 150,
    height: 220,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
    marginRight: 12,
    marginBottom: 12,
  },
  movieImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 12 
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
  },
  badgeNew: { 
    backgroundColor: '#fff', 
    borderColor: '#E91E63' 
  },
  badgeHot: { 
    backgroundColor: '#fff', 
    borderColor: '#000' 
  },
  badgeText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#000' 
  },
});
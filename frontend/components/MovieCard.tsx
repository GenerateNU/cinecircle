import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

type MovieCardProps = {
  movieId: string;
  title: string;
  imageUrl?: string | null;
  rating?: number;
  onPress?: () => void;
};

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({
  movieId,
  title,
  imageUrl,
  rating,
  onPress,
}: MovieCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default navigation to movie detail
      router.push(`/movies/${movieId}`);
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
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: formatImageUrl(imageUrl) }} 
        style={styles.image} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {rating !== undefined && rating !== null && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: (width - (width * 0.04 * 2) - (width * 0.03)) / 2,  // Calculate proper width for 2 columns with gap
    marginRight: width * 0.03,
    marginBottom: width * 0.04,
  },
  image: {
    width: '100%',
    aspectRatio: 2/3, 
    borderRadius: width * 0.02,
    backgroundColor: '#E0E0E0',
  },
  infoContainer: {
    marginTop: width * 0.02,
  },
  title: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#000',
    marginBottom: width * 0.01,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: width * 0.03,
    color: '#666',
  },
});
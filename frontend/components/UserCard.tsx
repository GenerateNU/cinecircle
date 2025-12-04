import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

type UserCardProps = {
  userId: string;
  username: string;
  avatarUri?: string;
  favoriteGenres?: string[];
  isFollowing?: boolean;
  onFollowPress?: () => void;
};

export default function UserCard({
  userId,
  username,
  avatarUri,
  favoriteGenres = [],
  isFollowing = false,
  onFollowPress,
}: UserCardProps) {
  const handleUserPress = () => {
    router.push({
      pathname: '/profilePage/user/[userId]',
      params: { userId },
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleUserPress}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: avatarUri || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&size=200&background=667eea&color=fff`,
        }}
        style={styles.avatar}
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.username}>@{username}</Text>
        {favoriteGenres.length > 0 && (
          <Text style={styles.genres} numberOfLines={1}>
            {favoriteGenres.slice(0, 3).join(', ')}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.followButton,
          isFollowing && styles.followingButton,
        ]}
        onPress={(e) => {
          e.stopPropagation();
          onFollowPress?.();
        }}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.followButtonText,
            isFollowing && styles.followingButtonText,
          ]}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
  },
  infoContainer: {
    flex: 1,
  },
  username: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#000',
    marginBottom: width * 0.01,
  },
  genres: {
    fontSize: width * 0.035,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#D62E05',
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.02,
    borderRadius: width * 0.015,
  },
  followingButton: {
    backgroundColor: '#FFE5E0',
  },
  followButtonText: {
    color: '#FFF',
    fontSize: width * 0.035,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#D62E05',
  },
});
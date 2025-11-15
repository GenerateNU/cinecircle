import React, { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { DeviceEventEmitter } from 'react-native';
import ProfilePage from '../index';
import { followUser, unfollowUser } from '../../../services/followService';
import type { User } from '../types';

export default function OtherUserProfile() {
  const params = useLocalSearchParams<{
    userId?: string;
    username?: string;
    name?: string;
    bio?: string;
    followers?: string;
    following?: string;
  }>();

  const [isFollowing, setIsFollowing] = useState(false);
  const userId = params.userId ?? 'demo-user';

  const displayUser: User = useMemo(() => {
    const username =
      params.username?.trim() ||
      params.userId ||
      params.name ||
      'user';
    const name = params.name || username;
    return {
      name,
      username,
      bio: params.bio || 'Movie enthusiast',
      followers: params.followers ? Number(params.followers) : 0,
      following: params.following ? Number(params.following) : 0,
      profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username || 'User'
      )}&size=200&background=667eea&color=fff`,
    };
  }, [params]);

  const handleFollow = async () => {
    try {
      await followUser(userId);
      setIsFollowing(true);
      DeviceEventEmitter.emit('followStatusChanged');
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(userId);
      setIsFollowing(false);
      DeviceEventEmitter.emit('followStatusChanged');
    } catch (err) {
      console.error('Failed to unfollow user:', err);
    }
  };

  return (
    <ProfilePage
      user={displayUser}
      isMe={false}
      isFollowing={isFollowing}
      onFollow={handleFollow}
      onUnfollow={handleUnfollow}
    />
  );
}

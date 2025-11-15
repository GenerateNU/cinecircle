import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { DeviceEventEmitter } from 'react-native';
import ProfilePage from '../index';
import { followUser, unfollowUser, getFollowers, getFollowing } from './followServiceProxy';
import { getUserProfile } from '../../../services/userService';
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
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const userId = params.userId ?? 'demo-user';

  const usernameFromParams =
    params.username?.trim() || params.userId || params.name || 'user';

  const loadCounts = useCallback(async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        getFollowers(userId),
        getFollowing(userId),
      ]);
      setFollowersCount(followersRes.followers?.length || 0);
      setFollowingCount(followingRes.following?.length || 0);
      if (currentUserId) {
        const iFollow =
          followersRes.followers?.some(
            (edge) => edge.followerId === currentUserId
          ) ?? false;
        setIsFollowing(iFollow);
      }
    } catch (err) {
      console.error('Failed to load counts for user profile:', err);
    }
  }, [userId, currentUserId]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await getUserProfile();
        setCurrentUserId(res.userProfile?.userId ?? null);
      } catch (err) {
        console.error('Failed to determine current user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  const displayUser: User = useMemo(() => {
    const username =
      usernameFromParams || 'user';
    const name = params.name || username;
    return {
      name,
      username,
      bio: params.bio || 'Movie enthusiast',
      followers: followersCount,
      following: followingCount,
      profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username || 'User'
      )}&size=200&background=667eea&color=fff`,
    };
  }, [params, followersCount, followingCount, usernameFromParams]);

  const handleFollow = async () => {
    try {
      await followUser(userId);
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
      DeviceEventEmitter.emit('followStatusChanged');
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(userId);
      setIsFollowing(false);
      setFollowersCount((prev) => Math.max(0, prev - 1));
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
      profileUserId={userId}
    />
  );
}

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { DeviceEventEmitter } from 'react-native';
import ProfilePage from '../index';
import { followUser, unfollowUser, getFollowers, getFollowing } from './followServiceProxy';
import { getUserProfile } from '../../../services/userService';
import { searchUsers } from '../../../services/searchService';
import type { User } from '../_types';

/**
 * Standalone profile screen for viewing another user's page.
 * Mirrors logged-in styling but fetches counts directly and shows follow/unfollow CTA.
 */
export default function OtherUserProfile() {
  const params = useLocalSearchParams<{
    userId?: string;
    username?: string;
    name?: string;
    bio?: string;
    followers?: string;
    following?: string;
    profilePic?: string;
  }>();

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const initialUserId = params.userId ?? 'demo-user';
  const [resolvedUserId, setResolvedUserId] = useState(initialUserId);
  const isValidUuid = (val: string | null | undefined) =>
    !!val &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      val
    );

  const usernameFromParams =
    params.username?.trim() || params.userId || params.name || 'user';

  useEffect(() => {
    const maybeResolve = async () => {
      if (isValidUuid(initialUserId)) {
        setResolvedUserId(initialUserId);
        return;
      }
      const query = params.username || params.userId || params.name;
      if (!query) return;
      try {
        const results = await searchUsers(String(query), 5);
        const normalized = String(query).toLowerCase();
        const match =
          results.find((u) => (u.username || '').toLowerCase() === normalized) ||
          results[0];
        if (match?.userId && isValidUuid(match.userId)) {
          setResolvedUserId(match.userId);
        }
      } catch (err) {
        console.error('Failed to resolve userId from username search:', err);
      }
    };
    maybeResolve();
  }, [initialUserId, params.name, params.userId, params.username]);

  const loadCounts = useCallback(async () => {
    if (!isValidUuid(resolvedUserId)) {
      setFollowersCount(0);
      setFollowingCount(0);
      setIsFollowing(false);
      return;
    }
    try {
      const [followersRes, followingRes] = await Promise.all([
        getFollowers(resolvedUserId),
        getFollowing(resolvedUserId),
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
  }, [resolvedUserId, currentUserId, isValidUuid]);

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
    fetchCurrentUser(); // ensures we know whether the visitor already follows this profile
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
      profilePic:
        params.profilePic ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          username || 'User'
        )}&size=200&background=667eea&color=fff`,
    };
  }, [params, followersCount, followingCount, usernameFromParams]);

  const handleFollow = async () => {
    if (!isValidUuid(resolvedUserId)) return;
    try {
      await followUser(resolvedUserId);
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
      DeviceEventEmitter.emit('followStatusChanged');
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  const handleUnfollow = async () => {
    if (!isValidUuid(resolvedUserId)) return;
    try {
      await unfollowUser(resolvedUserId);
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
      onFollow={isValidUuid(resolvedUserId) ? handleFollow : undefined}
      onUnfollow={isValidUuid(resolvedUserId) ? handleUnfollow : undefined}
      profileUserId={resolvedUserId}
    />
  );
}

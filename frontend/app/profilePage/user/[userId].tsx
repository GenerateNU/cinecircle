import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { DeviceEventEmitter } from 'react-native';
import ProfilePage from '../index';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../../../lib/profilePage/followServiceProxy';
import { getUserProfile, getUserProfileById } from '../../../services/userService';
import { searchUsers } from '../../../services/searchService';
import type { User } from '../../../lib/profilePage/_types';
import type { components } from '../../../types/api-generated';

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
  const [profileData, setProfileData] = useState<components['schemas']['UserProfile'] | null>(null);
  
  const isValidUuid = (val: string | null | undefined) =>
    !!val &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      val
    );

  const usernameFromParams =
    params.username?.trim() || params.userId || params.name || 'user';

  useEffect(() => {
    const fetchUserProfile = async () => {
      const query = params.username || params.userId || params.name;
      if (!query) return;

      try {
        // First, try to find the user by ID if we have a valid UUID
        if (isValidUuid(query)) {
          const response = await getUserProfileById(query);
          if (response?.userProfile) {
            setResolvedUserId(response.userProfile.userId);
            setProfileData(response.userProfile);
            return;
          }
        }

        // If no user found by ID or not a valid UUID, try searching by username
        const searchResponse = await searchUsers(String(query));
        const results = searchResponse.results || [];
        const normalized = String(query).toLowerCase();
        const match = results.find((u) => 
          (u.username || '').toLowerCase() === normalized || 
          u.userId === query
        ) || results[0];

        if (match?.userId) {
          // Now fetch the full profile using the user ID
          const response = await getUserProfileById(match.userId);
          if (response?.userProfile) {
            setResolvedUserId(response.userProfile.userId);
            setProfileData(response.userProfile);
          } else {
            // Fallback to basic info if full profile fetch fails
            setResolvedUserId(match.userId);
            setProfileData({
              userId: match.userId,
              username: match.username || '',
              onboardingCompleted: false,
              primaryLanguage: 'English',
              secondaryLanguage: [],
              profilePicture: match.profilePicture || null,
              country: null,
              city: null,
              displayName: match.username || null,
              favoriteGenres: match.favoriteGenres || [],
              favoriteMovies: [],
              bio: null,
              eventsSaved: [],
              eventsAttended: [],
              privateAccount: false,
              spoiler: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              bookmarkedToWatch: [],
              bookmarkedWatched: []
            });
          }
        } 
      } catch (err) {
        console.error('Failed to resolve userId from username search:', err);
      }
    };
    fetchUserProfile();
  }, [initialUserId, params.name, params.userId, params.username]);

  // Once we know the userId, fetch the full profile (including events) directly
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isValidUuid(resolvedUserId)) return;
      try {
        const res = await getUserProfileById(resolvedUserId);
        if (res?.userProfile) {
          setProfileData(res.userProfile as components['schemas']['UserProfile']);
        }
      } catch (err) {
        console.error('Failed to fetch profile by id:', err);
      }
    };
    fetchProfile();
  }, [resolvedUserId]);

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
    fetchCurrentUser();
  }, []);

  const displayUser: User = useMemo(() => {
    const username = usernameFromParams || 'user';
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
      profileData={profileData}
    />
  );
}
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import SectionHeader from '../../components/SectionHeader';
import UserBar from '../../components/UserBar';
import { getUserProfileBasic } from '../../services/userService';
import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from '../../services/followService';
import type { components } from '../../types/api-generated';

type UserProfileBasic = components['schemas']['UserProfileBasic'];
type FollowEdge = components['schemas']['FollowEdge'];

const NAV_HEIGHT = 64;

const Followers = () => {
  const [profile, setProfile] = useState<UserProfileBasic | null>(null);
  const [followers, setFollowers] = useState<FollowEdge[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingActions, setPendingActions] = useState<Record<string, boolean>>(
    {}
  );

  const fetchFollowersData = useCallback(
    async (options: { silent?: boolean } = {}) => {
      const { silent = false } = options;

      try {
        if (!silent) {
          setLoading(true);
        }
        setError(null);

        const profileRes = await getUserProfileBasic();
        const userId = profileRes.user?.id;

        if (!userId) {
          throw new Error('Unable to determine your account.');
        }

        setProfile(profileRes.user ?? null);

        const [followersRes, followingRes] = await Promise.all([
          getFollowers(userId),
          getFollowing(userId),
        ]);

        setFollowers(followersRes.followers || []);

        const nextFollowingMap: Record<string, boolean> = {};
        (followingRes.following || []).forEach((edge) => {
          nextFollowingMap[edge.followingId] = true;
        });
        setFollowingMap(nextFollowingMap);
      } catch (err: any) {
        console.error('Failed to load followers list:', err);
        setFollowers([]);
        setFollowingMap({});
        setError(err?.message || 'Failed to load followers list.');
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchFollowersData();
  }, [fetchFollowersData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFollowersData({ silent: true });
    setRefreshing(false);
  }, [fetchFollowersData]);

  const handleRetry = () => {
    fetchFollowersData();
  };

  const handleToggleFollow = async (followerId: string) => {
    const isFollowingBack = Boolean(followingMap[followerId]);
    setPendingActions((prev) => ({ ...prev, [followerId]: true }));

    try {
      if (isFollowingBack) {
        await unfollowUser(followerId);
        setFollowingMap((prev) => {
          const next = { ...prev };
          delete next[followerId];
          return next;
        });
      } else {
        await followUser(followerId);
        setFollowingMap((prev) => ({ ...prev, [followerId]: true }));
      }
    } catch (err: any) {
      console.error('Failed to update follow status:', err);
      Alert.alert(
        'Action failed',
        err?.message || 'Please try again in a moment.'
      );
    } finally {
      setPendingActions((prev) => {
        const next = { ...prev };
        delete next[followerId];
        return next;
      });
    }
  };

  const getDisplayName = (edge: FollowEdge) => {
    if (edge.follower?.username && edge.follower.username.trim().length > 0) {
      return edge.follower.username;
    }
    return `User ${edge.followerId.slice(0, 6)}`;
  };

  const getCategoriesPreview = (edge: FollowEdge) => {
    const categories = edge.follower?.favoriteGenres || [];
    if (!categories.length) {
      return 'No favorite categories shared yet.';
    }
    const preview = categories.slice(0, 3).join(', ');
    return `Enjoys ${preview}${categories.length > 3 ? '…' : ''}`;
  };

  if (loading && !refreshing) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={tw`mt-4 text-gray-600`}>Loading followers list…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
        <Text style={tw`text-red-600 text-center mb-4`}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-black px-6 py-3 rounded-lg`}
          onPress={handleRetry}
        >
          <Text style={tw`text-white font-semibold`}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const followersCount = followers.length;
  const profileHandle = profile?.email?.split('@')[0] || 'You';

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: NAV_HEIGHT + 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View
          style={tw`flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-gray-200`}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`p-2 -ml-2`}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-semibold text-black`}>Followers</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={tw`px-5 py-4`}>
          <Text style={tw`text-[22px] font-bold text-black`}>
            {profileHandle}
          </Text>
          <Text style={tw`mt-1 text-gray-500`}>
            Followed by {followersCount}{' '}
            {followersCount === 1 ? 'person' : 'people'}
          </Text>
        </View>

        <View style={tw`px-5 mt-2`}>
          <SectionHeader title="People who follow you" size="small" />
        </View>

        <View style={tw`mt-2`}>
          {followersCount === 0 && (
            <View style={tw`px-5 py-10 items-center`}>
              <Text style={tw`text-base text-gray-600 text-center`}>
                No one is following you yet.
              </Text>
              <Text style={tw`mt-2 text-gray-500 text-center`}>
                Engage with the community and followers will start showing up
                here.
              </Text>
            </View>
          )}
          {followers.map((edge) => {
            const isFollowingBack = Boolean(followingMap[edge.followerId]);
            return (
              <View key={edge.id} style={tw`px-5 py-4 border-b border-gray-100`}>
                <View style={tw`flex-row items-center justify-between`}>
                  <UserBar
                    name={getDisplayName(edge)}
                    avatarUri={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      getDisplayName(edge)
                    )}&background=667eea&color=fff`}
                    avatarSize={48}
                  />
                  <TouchableOpacity
                    disabled={pendingActions[edge.followerId]}
                    onPress={() => handleToggleFollow(edge.followerId)}
                    style={tw`ml-4 px-4 py-2 border border-gray-400 rounded-full`}
                  >
                    {pendingActions[edge.followerId] ? (
                      <ActivityIndicator size="small" color="#000" />
                    ) : (
                      <Text style={tw`text-sm font-semibold text-black`}>
                        {isFollowingBack ? 'Unfollow' : 'Follow back'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={tw`mt-2 text-gray-500`}>
                  {getCategoriesPreview(edge)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Followers;

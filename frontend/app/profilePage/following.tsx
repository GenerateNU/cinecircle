import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { getUserProfileBasic } from '../../services/userService';
import { getFollowing, unfollowUser } from '../../services/followService';
import type { components } from '../../types/api-generated';

type UserProfileBasic = components['schemas']['UserProfileBasic'];
type FollowEdge = components['schemas']['FollowEdge'];

const NAV_HEIGHT = 64;

const Following = () => {
  const [profile, setProfile] = useState<UserProfileBasic | null>(null);
  const [following, setFollowing] = useState<FollowEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingUnfollows, setPendingUnfollows] = useState<Record<string, boolean>>({});

  const fetchFollowingData = useCallback(
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

        const followingRes = await getFollowing(userId);
        setFollowing(followingRes.following || []);
      } catch (err: any) {
        console.error('Failed to load following list:', err);
        setFollowing([]);
        setError(err?.message || 'Failed to load following list.');
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchFollowingData();
  }, [fetchFollowingData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFollowingData({ silent: true });
    setRefreshing(false);
  }, [fetchFollowingData]);

  const handleRetry = () => {
    fetchFollowingData();
  };

  const handleUnfollow = async (followingId: string) => {
    setPendingUnfollows((prev) => ({ ...prev, [followingId]: true }));
    try {
      await unfollowUser(followingId);
      setFollowing((prev) => prev.filter((edge) => edge.followingId !== followingId));
    } catch (err: any) {
      console.error('Failed to unfollow user:', err);
      Alert.alert('Unable to unfollow', err?.message || 'Please try again.');
    } finally {
      setPendingUnfollows((prev) => {
        const next = { ...prev };
        delete next[followingId];
        return next;
      });
    }
  };

  const getDisplayName = (edge: FollowEdge) => {
    if (edge.following?.username && edge.following.username.trim().length > 0) {
      const name = edge.following.username.trim();
      return name.startsWith('@') ? name : `@${name}`;
    }
    return `@user${edge.followingId.slice(0, 4)}`;
  };

  const getCategoriesPreview = (edge: FollowEdge) => {
    const categories = edge.following?.favoriteGenres || [];
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
        <Text style={tw`mt-4 text-gray-600`}>Loading following list…</Text>
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

  const followingCount = following.length;
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
          <Text style={tw`text-lg font-semibold text-black`}>Following</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={tw`mt-2`}>
          {followingCount === 0 && (
            <View style={tw`px-5 py-10 items-center`}>
              <Text style={tw`text-base text-gray-600 text-center`}>
                You are not following anyone yet.
              </Text>
              <Text style={tw`mt-2 text-gray-500 text-center`}>
                Discover creators and tap follow on their profiles to see them
                here.
              </Text>
            </View>
          )}
          {following.map((edge) => (
            <View key={edge.id} style={tw`px-5 py-4 border-b border-gray-100`}>
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-row items-center`}>
                  <Image
                    source={{
                      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        getDisplayName(edge).replace('@', '')
                      )}&background=667eea&color=fff`,
                    }}
                    style={tw`w-12 h-12 rounded-full mr-3`}
                  />
                  <View>
                    <Text style={tw`text-base font-semibold`}>
                      {getDisplayName(edge)}
                    </Text>
                    <Text style={tw`text-xs text-gray-500`}>
                      {getCategoriesPreview(edge)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  disabled={pendingUnfollows[edge.followingId]}
                  onPress={() => handleUnfollow(edge.followingId)}
                  style={[
                    tw`ml-4 px-4 py-2 border rounded-lg`,
                    {
                      backgroundColor: '#D62E05',
                      borderColor: '#801C03',
                    },
                  ]}
                >
                  {pendingUnfollows[edge.followingId] ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text
                      style={[
                        tw`text-sm font-semibold`,
                        { color: '#F7D5CD' },
                      ]}
                    >
                      Unfollow
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Following;

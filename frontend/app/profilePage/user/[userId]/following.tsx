import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { getFollowing } from '../followServiceProxy';
import type { components } from '../../../../types/api-generated';

type FollowEdge = components['schemas']['FollowEdge'];

/**
 * Following list for another user (mirrors styling of the local following screen).
 */
export default function OtherUserFollowingPage() {
  const { userId, name, username } = useLocalSearchParams<{
    userId?: string;
    name?: string;
    username?: string;
  }>();
  const [following, setFollowing] = useState<FollowEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const targetUserId = userId as string;

  const fetchFollowing = useCallback(async () => {
    if (!targetUserId) {
      setError('Missing user');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await getFollowing(targetUserId);
      setFollowing(res.following || []);
    } catch (err: any) {
      console.error('Failed to load following list', err);
      setError(err?.message || 'Failed to load following list');
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  if (!targetUserId) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-white`}>
        <Text style={tw`text-gray-600`}>Unable to load following list.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={tw`mt-4 text-gray-600`}>Loading following…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
        <Text style={tw`text-red-600 text-center mb-4`}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-black px-6 py-3 rounded-lg`}
          onPress={fetchFollowing}
        >
          <Text style={tw`text-white font-semibold`}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
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
        <View style={tw`w-6`} />
      </View>

      <Text style={tw`mt-4 text-center text-xl font-bold text-black`}>
        {name || username || 'User'}
      </Text>

      <ScrollView style={tw`mt-4`}>
        {following.length === 0 && (
          <View style={tw`px-5 py-10 items-center`}>
            <Text style={tw`text-base text-gray-600 text-center`}>
              Not following anyone yet.
            </Text>
          </View>
        )}
        {following.map((edge) => {
          const followingName =
            edge.following?.username && edge.following.username.trim().length > 0
              ? edge.following.username.trim()
              : `user${edge.followingId.slice(0, 4)}`;
          const handle =
            followingName.startsWith('@') ? followingName : `@${followingName}`;
          return (
            <View
              key={edge.id}
              style={tw`px-5 py-4 border-b border-gray-100 flex-row items-center`}
            >
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    handle.replace('@', '')
                  )}&background=667eea&color=fff`,
                }}
                style={tw`w-12 h-12 rounded-full mr-3`}
              />
              <View>
                <Text style={tw`text-base font-semibold`}>{handle}</Text>
                <Text style={tw`text-xs text-gray-500`}>
                  {edge.following?.favoriteGenres?.slice(0, 3).join(', ') ||
                    'Following' }
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

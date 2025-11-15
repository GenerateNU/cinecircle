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
import { getFollowers } from '../followServiceProxy';
import type { components } from '../../../../types/api-generated';

type FollowEdge = components['schemas']['FollowEdge'];

export default function OtherUserFollowersPage() {
  const { userId, name, username } = useLocalSearchParams<{
    userId?: string;
    name?: string;
    username?: string;
  }>();
  const [followers, setFollowers] = useState<FollowEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const targetUserId = userId as string;

  const fetchFollowers = useCallback(async () => {
    if (!targetUserId) {
      setError('Missing user');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await getFollowers(targetUserId);
      setFollowers(res.followers || []);
    } catch (err: any) {
      console.error('Failed to load followers', err);
      setError(err?.message || 'Failed to load followers');
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  if (!targetUserId) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-white`}>
        <Text style={tw`text-gray-600`}>Unable to load followers.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={tw`mt-4 text-gray-600`}>Loading followers…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center px-6`}>
        <Text style={tw`text-red-600 text-center mb-4`}>{error}</Text>
        <TouchableOpacity
          style={tw`bg-black px-6 py-3 rounded-lg`}
          onPress={fetchFollowers}
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
        <Text style={tw`text-lg font-semibold text-black`}>Followers</Text>
        <View style={tw`w-6`} />
      </View>

      <Text style={tw`mt-4 text-center text-xl font-bold text-black`}>
        {name || username || 'User'}
      </Text>

      <ScrollView style={tw`mt-4`}>
        {followers.length === 0 && (
          <View style={tw`px-5 py-10 items-center`}>
            <Text style={tw`text-base text-gray-600 text-center`}>
              No followers yet.
            </Text>
          </View>
        )}
        {followers.map((edge) => {
          const followerName =
            edge.follower?.username && edge.follower.username.trim().length > 0
              ? edge.follower.username.trim()
              : `user${edge.followerId.slice(0, 4)}`;
          const handle =
            followerName.startsWith('@') ? followerName : `@${followerName}`;
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
                  {edge.follower?.favoriteGenres?.slice(0, 3).join(', ') ||
                    'Follower'}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

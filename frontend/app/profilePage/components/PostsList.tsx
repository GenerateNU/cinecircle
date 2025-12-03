import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import tw from 'twrnc';
import { User } from '../_types';
import { Feather } from '@expo/vector-icons';
import { getPosts } from '../../../services/postsService';
import type { components } from '../../../types/api-generated';
import { formatCount } from '../_utils';

type Props = {
  user: User;
  userId?: string | null;
};

type Post = components['schemas']['Post'];

const PostsList = ({ user, userId }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedUserId = useMemo(() => userId ?? null, [userId]);
  const isValidUuid = useCallback(
    (value: string | null) =>
      !!value &&
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        value
      ),
    []
  );

  const loadPosts = useCallback(async () => {
    if (!resolvedUserId) {
      setPosts([]);
      setLoading(false);
      return;
    }
    if (!isValidUuid(resolvedUserId)) {
      // Avoid hitting backend with invalid ids (which can trigger DB errors)
      setPosts([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await getPosts({
        userId: resolvedUserId,
        parentPostId: null,
        limit: 50,
      });
      setPosts(res);
    } catch (err: any) {
      console.error('Failed to load posts', err);
      setError(err?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [resolvedUserId, isValidUuid]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  if (!resolvedUserId) {
    return (
      <View style={tw`py-6`}>
        <Text style={tw`text-center text-gray-600`}>
          Unable to load posts for this user.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={tw`py-8 items-center`}>
        <ActivityIndicator size="small" color="#000" />
        <Text style={tw`mt-2 text-gray-600`}>Loading posts…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`py-6 items-center`}>
        <Text style={tw`text-red-600 text-center mb-2`}>{error}</Text>
        <TouchableOpacity
          onPress={loadPosts}
          style={tw`bg-black px-4 py-2 rounded-lg`}
          accessibilityRole="button"
          accessibilityLabel="Retry loading posts"
        >
          <Text style={tw`text-white font-semibold`}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={tw`py-6 items-center`}>
        <Text style={tw`text-gray-600`}>No posts yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      removeClippedSubviews={false}
      initialNumToRender={posts.length || 10}
      maxToRenderPerBatch={posts.length || 10}
      windowSize={Math.max(5, posts.length || 5)}
      showsVerticalScrollIndicator={false}
      renderItem={({ item: p }) => {
        const likeCount = formatCount(p.likeCount ?? (p as any).votes ?? 0);
        const commentCount = formatCount(p.commentCount ?? (p as any).commentCount ?? 0);
        const replyCount = formatCount(p.replyCount ?? (p as any).replyCount ?? 0);
        const avatar = user.profilePic;
        const displayName =
          p.UserProfile?.username?.trim() ||
          user.name ||
          user.username ||
          'User';
        return (
          <View
            style={tw`flex-row rounded-[8px] bg-white mb-[10px] border-b border-[#eee] p-[15px]`}
          >
            <Image
              source={{ uri: avatar }}
              style={tw`w-10 h-10 rounded-full mr-2.5`}
            />
            <View style={tw`flex-1`}>
              <Text style={tw`font-semibold`}>{displayName}</Text>
              <Text style={tw`text-[#333] my-1.5`}>{p.content}</Text>
              <View style={tw`flex-row justify-between w-4/5 mt-2`}>
                <View style={tw`flex-row items-center`}>
                  <Feather name="heart" size={18} color="#111" />
                  <Text style={tw`ml-1 text-[12px] text-gray-600`}>{likeCount}</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Feather name="message-circle" size={18} color="#111" />
                  <Text style={tw`ml-1 text-[12px] text-gray-600`}>{commentCount}</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Feather name="repeat" size={18} color="#111" />
                  <Text style={tw`ml-1 text-[12px] text-gray-600`}>{replyCount}</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Feather name="send" size={18} color="#111" />
                </View>
              </View>
            </View>
          </View>
        );
      }}
      ListFooterComponent={<View style={tw`h-2`} />}
    />
  );
};

export default PostsList;

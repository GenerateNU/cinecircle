import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import { api } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { togglePostReaction } from '../services/feedService';
import TextPost from '../components/TextPost';
import PicturePost from '../components/PicturePost';
import InteractionBar from '../components/InteractionBar';
import CommentSection, { CommentInput, type CommentInputRenderProps } from '../app/commentSection/commentSection';
import type { components } from '../types/api-generated';

type Post = components['schemas']['Post'];

export type PostDetailsProps = {
  postId: string;
};

type PostDetailResponse = {
  message?: string;
  data: Post;
};

const { width } = Dimensions.get('window');

export default function PostDetails({ postId }: PostDetailsProps) {
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentInputProps, setCommentInputProps] = useState<CommentInputRenderProps | null>(null);

  const loadPost = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<PostDetailResponse>(`/api/post/${postId}`);
      setPost(response.data ?? null);
    } catch (err) {
      console.error('Failed to load post:', err);
      setError('Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleReaction = async (reactionIndex: number) => {
    if (!user?.id || !post) return;

    const reactionTypes: Array<
      'SPICY' | 'STAR_STUDDED' | 'THOUGHT_PROVOKING' | 'BLOCKBUSTER'
    > = ['SPICY', 'STAR_STUDDED', 'THOUGHT_PROVOKING', 'BLOCKBUSTER'];
    const reactionType = reactionTypes[reactionIndex];

    try {
      // Optimistically update UI
      const wasSelected = post.userReactions?.includes(reactionType) || false;

      // Update reaction counts
      const newReactionCounts: {
        SPICY: number;
        STAR_STUDDED: number;
        THOUGHT_PROVOKING: number;
        BLOCKBUSTER: number;
      } = {
        SPICY: post.reactionCounts?.SPICY || 0,
        STAR_STUDDED: post.reactionCounts?.STAR_STUDDED || 0,
        THOUGHT_PROVOKING: post.reactionCounts?.THOUGHT_PROVOKING || 0,
        BLOCKBUSTER: post.reactionCounts?.BLOCKBUSTER || 0,
      };
      if (wasSelected) {
        newReactionCounts[reactionType] = Math.max(
          0,
          newReactionCounts[reactionType] - 1
        );
      } else {
        newReactionCounts[reactionType] = newReactionCounts[reactionType] + 1;
      }

      // Update user reactions
      let newUserReactions = [...(post.userReactions || [])];
      if (wasSelected) {
        newUserReactions = newUserReactions.filter(r => r !== reactionType);
      } else {
        newUserReactions.push(reactionType);
      }

      setPost({
        ...post,
        reactionCounts: newReactionCounts,
        userReactions: newUserReactions,
      });

      // Call API in background
      await togglePostReaction(post.id, user.id, reactionType);
    } catch (err) {
      console.error('Error toggling reaction:', err);
      // Reload on error to ensure consistency
      await loadPost();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#D62E05" />
          <Text style={tw`mt-4 text-gray-500`}>Loading post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-200`}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`mr-4`}
          >
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-semibold`}>Post Details</Text>
        </View>
        <View style={tw`flex-1 justify-center items-center px-6`}>
          <Text style={tw`text-center text-red-500 mb-4`}>
            {error || 'Post not found'}
          </Text>
          <TouchableOpacity
            onPress={loadPost}
            style={tw`px-6 py-3 bg-gray-200 rounded-lg`}
          >
            <Text style={tw`text-black font-semibold`}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`mt-4 px-6 py-3`}
          >
            <Text style={tw`text-blue-500 font-semibold`}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const hasImages = post.imageUrls && post.imageUrls.length > 0;
  const username = post.UserProfile?.username || 'Unknown User';
  const userName = username;

  // Map backend reaction data to InteractionBar format
  const reactions = [
    {
      emoji: '🌶️',
      count: post.reactionCounts?.SPICY || 0,
      selected: post.userReactions?.includes('SPICY') || false,
    },
    {
      emoji: '✨',
      count: post.reactionCounts?.STAR_STUDDED || 0,
      selected: post.userReactions?.includes('STAR_STUDDED') || false,
    },
    {
      emoji: '🧠',
      count: post.reactionCounts?.THOUGHT_PROVOKING || 0,
      selected: post.userReactions?.includes('THOUGHT_PROVOKING') || false,
    },
    {
      emoji: '🧨',
      count: post.reactionCounts?.BLOCKBUSTER || 0,
      selected: post.userReactions?.includes('BLOCKBUSTER') || false,
    },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header with back button */}
        <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-200`}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`mr-4`}
          >
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-semibold`}>Post Details</Text>
        </View>

        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          bounces={true}
        >
          <View style={tw`px-4 pt-4`}>
            {/* Post Content */}
            {hasImages ? (
              <PicturePost
                userName={userName}
                username={username}
                date={formatDate(post.createdAt)}
                content={post.content}
                imageUrls={post.imageUrls || []}
                userId={post.userId}
              />
            ) : (
              <TextPost
                userName={userName}
                username={username}
                date={formatDate(post.createdAt)}
                content={post.content}
                userId={post.userId}
              />
            )}

            {/* Interaction Bar */}
            <View style={styles.interactionWrapper}>
              <InteractionBar
                initialComments={post.commentCount || 0}
                reactions={reactions}
                onReactionPress={handleReaction}
              />
            </View>
          </View>

          {/* Comment Section - comments only, input rendered separately below */}
          <View style={tw`mt-6 px-4`}>
            <CommentSection
              targetType="post"
              targetId={postId}
              renderInput={false}
              onInputPropsReady={setCommentInputProps}
            />
          </View>
        </ScrollView>

        {/* Sticky Comment Input - positioned outside ScrollView for sticky behavior */}
        {commentInputProps && (
          <CommentInput
            onSubmit={commentInputProps.onSubmit}
            replyingTo={commentInputProps.replyingTo}
            onCancelReply={commentInputProps.onCancelReply}
            userProfilePicture={commentInputProps.userProfilePicture}
            username={commentInputProps.username}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  interactionWrapper: {
    paddingHorizontal: width * 0.04,
    paddingTop: width * 0.02,
    paddingBottom: width * 0.02,
  },
});

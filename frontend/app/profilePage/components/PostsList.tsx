import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import tw from 'twrnc';
import { User } from '../../../lib/profilePage/_types';
import { Feather } from '@expo/vector-icons';
import { getPosts } from '../../../services/postsService';
import type { components } from '../../../types/api-generated';
import { formatCount } from '../../../lib/profilePage/_utils';
import ReviewPost from '../../../components/ReviewPost';
import PicturePost from '../../../components/PicturePost';
import TextPost from '../../../components/TextPost';
import UserBar from '../../../components/UserBar';
import InteractionBar from '../../../components/InteractionBar';
import { togglePostReaction } from '../../../services/feedService';
import { useAuth } from '../../../context/AuthContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

type Props = {
  user: User;
  userId?: string | null;
};

type Post = components['schemas']['Post'];

const PostsList = ({ user, userId }: Props) => {
  const { user: currentUser } = useAuth();
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
        currentUserId: currentUser?.id, // Pass current user ID to get their reactions
        repostedPostId: null, // Only show original posts, not reposts
        limit: 50,
      });
      setPosts(res);
    } catch (err: any) {
      console.error('Failed to load posts', err);
      setError(err?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [resolvedUserId, isValidUuid, currentUser?.id]);

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

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handlePostPress = (post: Post) => {
    router.push(`/postDetail/${post.id}`);
  };

  const handleComment = (post: Post) => {
    router.push(`/postDetail/${post.id}`);
  };

  const handleReaction = async (post: Post, reactionIndex: number) => {
    if (!currentUser?.id) return;

    const reactionTypes: Array<
      'SPICY' | 'STAR_STUDDED' | 'THOUGHT_PROVOKING' | 'BLOCKBUSTER'
    > = ['SPICY', 'STAR_STUDDED', 'THOUGHT_PROVOKING', 'BLOCKBUSTER'];
    const reactionType = reactionTypes[reactionIndex];

    try {
      // Optimistically update UI
      setPosts(prevPosts =>
        prevPosts.map(p => {
          if (p.id !== post.id) return p;

          const wasSelected = p.userReactions?.includes(reactionType) || false;

          const newCounts = {
            SPICY: p.reactionCounts?.SPICY ?? 0,
            STAR_STUDDED: p.reactionCounts?.STAR_STUDDED ?? 0,
            THOUGHT_PROVOKING: p.reactionCounts?.THOUGHT_PROVOKING ?? 0,
            BLOCKBUSTER: p.reactionCounts?.BLOCKBUSTER ?? 0,
          };
          newCounts[reactionType] = Math.max(
            0,
            newCounts[reactionType] + (wasSelected ? -1 : 1)
          );

          let newUserReactions = [...(p.userReactions || [])];
          if (wasSelected) {
            newUserReactions = newUserReactions.filter(r => r !== reactionType);
          } else {
            newUserReactions.push(reactionType);
          }

          return {
            ...p,
            reactionCounts: newCounts,
            userReactions: newUserReactions,
          };
        })
      );

      await togglePostReaction(post.id, currentUser.id, reactionType);
    } catch (err) {
      console.error('Error toggling reaction:', err);
      await loadPosts();
    }
  };

  // Render a horizontal line between posts
  const renderSeparator = () => (
    <View
      style={{
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 8,
      }}
    />
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      scrollEnabled={false}
      removeClippedSubviews={false}
      initialNumToRender={posts.length || 10}
      maxToRenderPerBatch={posts.length || 10}
      windowSize={Math.max(5, posts.length || 5)}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={renderSeparator}
      renderItem={({ item: post }) => {
        const username = post.UserProfile?.username || user.username || 'User';
        const avatar = user.profilePic;
        const hasImage = post.imageUrls && post.imageUrls.length > 0;
        const hasStars = post.stars !== null && post.stars !== undefined;
        const containsSpoilers = post.spoiler || false;
        const movieTitle = post.movie?.title || 'Unknown Movie';
        const movieImagePath = post.movie?.imageUrl;

        // Build reaction data from post
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
            selected:
              post.userReactions?.includes('THOUGHT_PROVOKING') || false,
          },
          {
            emoji: '🧨',
            count: post.reactionCounts?.BLOCKBUSTER || 0,
            selected: post.userReactions?.includes('BLOCKBUSTER') || false,
          },
        ];

        // Determine which component to use:
        // - ReviewPost for LONG posts with stars
        // - PicturePost for SHORT posts with images
        // - TextPost for SHORT posts without images

        if (hasStars) {
          // LONG post with rating - use ReviewPost with wrapper
          return (
            <React.Fragment key={post.id}>
              <View style={styles.ratingContainer}>
                <UserBar
                  name={username}
                  username={username}
                  userId={post.userId}
                />
                <Text style={styles.shareText}>
                  Check out this new review that I just dropped!
                </Text>
                <ReviewPost
                  userName={username}
                  username={username}
                  date={formatDate(post.createdAt)}
                  avatarUri={avatar}
                  reviewerName={username}
                  reviewerAvatarUri={avatar}
                  movieTitle={movieTitle}
                  rating={post.stars || 0}
                  userId={post.userId}
                  reviewerUserId={post.userId}
                  movieImageUrl={movieImagePath}
                  onPress={() => handlePostPress(post)}
                  spoiler={containsSpoilers}
                />
                <View style={styles.interactionWrapper}>
                  <InteractionBar
                    initialComments={post.commentCount || 0}
                    reactions={reactions}
                    onCommentPress={() => handleComment(post)}
                    onReactionPress={index => handleReaction(post, index)}
                  />
                </View>
              </View>
            </React.Fragment>
          );
        } else if (hasImage) {
          // SHORT post with images - use PicturePost
          return (
            <React.Fragment key={post.id}>
              <View style={styles.postContainer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handlePostPress(post)}
                >
                  <PicturePost
                    userName={username}
                    username={username}
                    date={formatDate(post.createdAt)}
                    avatarUri={avatar}
                    content={post.content}
                    imageUrls={post.imageUrls || []}
                    userId={post.userId}
                    spoiler={containsSpoilers}
                  />
                </TouchableOpacity>
                <View style={styles.interactionWrapper}>
                  <InteractionBar
                    initialComments={post.commentCount || 0}
                    reactions={reactions}
                    onCommentPress={() => handleComment(post)}
                    onReactionPress={index => handleReaction(post, index)}
                  />
                </View>
              </View>
            </React.Fragment>
          );
        } else {
          // SHORT post without images - use TextPost
          return (
            <React.Fragment key={post.id}>
              <View style={styles.postContainer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handlePostPress(post)}
                >
                  <TextPost
                    userName={username}
                    username={username}
                    date={formatDate(post.createdAt)}
                    avatarUri={avatar}
                    content={post.content}
                    userId={post.userId}
                    spoiler={containsSpoilers}
                  />
                </TouchableOpacity>
                <View style={styles.interactionWrapper}>
                  <InteractionBar
                    initialComments={post.commentCount || 0}
                    reactions={reactions}
                    onCommentPress={() => handleComment(post)}
                    onReactionPress={index => handleReaction(post, index)}
                  />
                </View>
              </View>
            </React.Fragment>
          );
        }
      }}
      ListFooterComponent={<View style={tw`h-2`} />}
    />
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: width * 0.04,
    paddingTop: width * 0.04,
    paddingBottom: width * 0.04,
  },
  shareText: {
    fontSize: width * 0.04,
    color: '#000',
    marginTop: width * 0.03,
    marginBottom: width * 0.04,
  },
  postContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: width * 0.04,
    paddingTop: width * 0.04,
    paddingBottom: width * 0.04,
  },
  interactionWrapper: {
    marginTop: width * 0.04,
  },
});

export default PostsList;

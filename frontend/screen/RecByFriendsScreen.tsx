import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { fetchHomeFeed, togglePostReaction } from '../services/feedService';
import { getMoviePosterUrl } from '../services/imageService';
import { getUserProfile } from '../services/userService';

import TextPost from '../components/TextPost';
import PicturePost from '../components/PicturePost';
import ReviewPost from '../components/ReviewPost';
import InteractionBar from '../components/InteractionBar';
import UserBar from '../components/UserBar';

import type { components } from '../types/api-generated';

type Post = components['schemas']['Post'];

const { width } = Dimensions.get('window');

type FeedItem = {
  type: 'post' | 'trending_post';
  data: Post;
};

export default function RecByFriendsScreen() {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [revealedPostIds, setRevealedPostIds] = useState<string[]>([]);

  const isPostRevealed = (id: string) => revealedPostIds.includes(id);
  const revealPost = (id: string) =>
    setRevealedPostIds(prev => (prev.includes(id) ? prev : [...prev, id]));

  useEffect(() => {
    loadFeed();
  }, []);

  // Initialize spoiler toggle from user profile
  useEffect(() => {
    const loadSpoilerPreference = async () => {
      try {
        const res = await getUserProfile();
        const profile = res?.userProfile;

        if (!profile) {
          console.log('No userProfile found in RecByFriends');
          return;
        }

        const pref = (profile as any).spoiler;

        console.log('RecByFriends spoiler pref:', pref);

        if (typeof pref === 'boolean') {
          setShowSpoilers(pref);
        }
      } catch (err) {
        console.log('RecByFriends: failed to load spoiler preference', err);
      }
    };

    loadSpoilerPreference();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await fetchHomeFeed(50);
      setFeedItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading feed:', err);
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const openPostDetail = (post: Post, options?: { focusComment?: boolean }) => {
    // TODO: Hook up to post detail page
    router.push({
      pathname: '/post/[postId]',
      params: {
        postId: post.id,
        movieId: post.movieId ?? '',
        focusCommentInput: options?.focusComment ? 'true' : 'false',
      },
    });
  };

  const renderFeedItem = (item: FeedItem, index: number) => {
    const post = item.data as Post;

    if (post.stars !== null && post.stars !== undefined) {
      return renderReview(post, index);
    } else {
      return renderPost(post, index);
    }
  };

  const renderPost = (post: Post, index: number) => {
    const username = post.UserProfile?.username || 'Unknown';
    const hasImage = post.imageUrls && post.imageUrls.length > 0;

    const containsSpoilers = Boolean(
      (post as any).containsSpoilers ??
      (post as any).hasSpoilers ??
      (post as any).spoiler
    );
    const isRevealed = showSpoilers || isPostRevealed(post.id);

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

    const handleReaction = async (reactionIndex: number) => {
      if (!user?.id) return;

      const reactionTypes: Array<
        'SPICY' | 'STAR_STUDDED' | 'THOUGHT_PROVOKING' | 'BLOCKBUSTER'
      > = ['SPICY', 'STAR_STUDDED', 'THOUGHT_PROVOKING', 'BLOCKBUSTER'];
      const reactionType = reactionTypes[reactionIndex];

      try {
        // optimistic
        setFeedItems(prevItems =>
          prevItems.map(it => {
            if ((it.data as Post).id !== post.id) return it;

            const currentPost = it.data as Post;
            const wasSelected =
              currentPost.userReactions?.includes(reactionType) || false;

            const newCounts = {
              SPICY: currentPost.reactionCounts?.SPICY ?? 0,
              STAR_STUDDED: currentPost.reactionCounts?.STAR_STUDDED ?? 0,
              THOUGHT_PROVOKING:
                currentPost.reactionCounts?.THOUGHT_PROVOKING ?? 0,
              BLOCKBUSTER: currentPost.reactionCounts?.BLOCKBUSTER ?? 0,
            };
            newCounts[reactionType] = Math.max(
              0,
              newCounts[reactionType] + (wasSelected ? -1 : 1)
            );

            let newUserReactions = [...(currentPost.userReactions || [])];
            if (wasSelected) {
              newUserReactions = newUserReactions.filter(
                r => r !== reactionType
              );
            } else {
              newUserReactions.push(reactionType);
            }

            return {
              ...it,
              data: {
                ...currentPost,
                reactionCounts: newCounts,
                userReactions: newUserReactions,
              } as Post,
            };
          })
        );

        await togglePostReaction(post.id, user.id, reactionType);
      } catch (err) {
        console.error('Error toggling reaction:', err);
        await loadFeed();
      }
    };

    // If spoiler + not revealed -> show the spoiler overlay
    if (containsSpoilers && !isRevealed) {
      return (
        <React.Fragment key={post.id}>
          <View style={styles.postContainer}>
            <UserBar name={username} username={username} userId={post.userId} />
            <TouchableOpacity
              style={styles.spoilerOverlayCard}
              activeOpacity={0.85}
              onPress={() => revealPost(post.id)}
            >
              <Ionicons name="eye-outline" size={20} color="#561202" />
              <Text style={styles.spoilerOverlayTitle}>
                This post may contain spoilers
              </Text>
              <Text style={styles.spoilerOverlayText}>
                Tap to reveal just this post, or turn on “Show spoilers” to
                reveal all.
              </Text>
            </TouchableOpacity>
          </View>
          {index < feedItems.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      );
    }

    // Revealed or non-spoiler -> show normal post
    return (
      <React.Fragment key={post.id}>
        <View style={styles.postContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => openPostDetail(post)}
          >
            {hasImage ? (
              <PicturePost
                userName={username}
                username={username}
                date={formatDate(post.createdAt)}
                content={post.content}
                imageUrls={post.imageUrls || []}
                userId={post.userId}
                spoiler={containsSpoilers}
              />
            ) : (
              <TextPost
                userName={username}
                username={username}
                date={formatDate(post.createdAt)}
                content={post.content}
                userId={post.userId}
                spoiler={containsSpoilers}
              />
            )}
          </TouchableOpacity>
          <View style={styles.interactionWrapper}>
            <InteractionBar
              initialComments={post.commentCount || 0}
              reactions={reactions}
              onCommentPress={() => handleComment(post)}
              onReactionPress={handleReaction}
            />
          </View>
        </View>
        {index < feedItems.length - 1 && <View style={styles.divider} />}
      </React.Fragment>
    );
  };

  const renderReview = (post: Post, index: number) => {
    const username = post.UserProfile?.username || 'Unknown';
    const movieTitle = post.movie?.title || `Movie #${post.movieId}`;
    const movieImagePath = post.movie?.imageUrl;
    const moviePosterUrl = getMoviePosterUrl(movieImagePath);

    const containsSpoilers = Boolean(
      (post as any).containsSpoilers ??
      (post as any).hasSpoilers ??
      (post as any).spoiler
    );
    const isRevealed = showSpoilers || isPostRevealed(post.id);

    if (containsSpoilers && !isRevealed) {
      return (
        <React.Fragment key={post.id}>
          <View style={styles.ratingContainer}>
            <UserBar name={username} username={username} userId={post.userId} />
            <TouchableOpacity
              style={styles.spoilerOverlayCard}
              activeOpacity={0.85}
              onPress={() => revealPost(post.id)}
            >
              <Ionicons name="eye-outline" size={20} color="#561202" />
              <Text style={styles.spoilerOverlayTitle}>
                This review may contain spoilers
              </Text>
              <Text style={styles.spoilerOverlayText}>
                Tap to reveal just this review, or turn on “Show spoilers” to
                reveal all.
              </Text>
            </TouchableOpacity>
          </View>
          {index < feedItems.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      );
    }

    const handleReviewPress = () => {
      openPostDetail(post);
    };

    return (
      <React.Fragment key={post.id}>
        <View style={styles.ratingContainer}>
          <UserBar name={username} username={username} userId={post.userId} />
          <Text style={styles.shareText}>
            Check out this new review that I just dropped!
          </Text>
          <ReviewPost
            userName={username}
            username={username}
            date={formatDate(post.createdAt)}
            reviewerName={username}
            movieTitle={movieTitle}
            rating={post.stars || 0}
            userId={post.userId}
            reviewerUserId={post.userId}
            movieImageUrl={moviePosterUrl}
            onPress={handleReviewPress}
            spoiler={containsSpoilers}
          />
        </View>
        {index < feedItems.length - 1 && <View style={styles.divider} />}
      </React.Fragment>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleComment = (post: Post) => {
    openPostDetail(post, { focusComment: true });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B7FD6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (feedItems.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No posts from friends yet</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {feedItems.map((item, index) => renderFeedItem(item, index))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: width * 0.08,
  },
  filterBar: {
    backgroundColor: '#FFF',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  postContainer: {
    backgroundColor: '#FFF',
    paddingTop: width * 0.04,
  },
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
  interactionWrapper: {
    paddingHorizontal: width * 0.04,
    paddingBottom: width * 0.04,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  spoilerOverlayCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF4E5',
    borderWidth: 1,
    borderColor: '#F5C518',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  spoilerOverlayTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#561202',
    textAlign: 'center',
  },
  spoilerOverlayText: {
    fontSize: 13,
    color: '#7A4A24',
    textAlign: 'center',
  },
});

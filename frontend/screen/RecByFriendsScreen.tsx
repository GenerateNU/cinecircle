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
import { useAuth } from '../context/AuthContext';
import { fetchHomeFeed, togglePostReaction } from '../services/feedService';
import { getMoviePosterUrl } from '../services/imageService';
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

  useEffect(() => {
    loadFeed();
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

  const renderFeedItem = (item: FeedItem, index: number) => {
    const post = item.data as Post;

    // If post has stars, render as review, otherwise as regular post
    if (post.stars !== null && post.stars !== undefined) {
      return renderReview(post, index);
    } else {
      return renderPost(post, index);
    }
  };

  const renderPost = (post: Post, index: number) => {
    const username = post.UserProfile?.username || 'Unknown';
    const hasImage = post.imageUrls && post.imageUrls.length > 0;

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

    const handleReaction = async (reactionIndex: number) => {
      if (!user?.id) return;

      const reactionTypes: Array<
        'SPICY' | 'STAR_STUDDED' | 'THOUGHT_PROVOKING' | 'BLOCKBUSTER'
      > = ['SPICY', 'STAR_STUDDED', 'THOUGHT_PROVOKING', 'BLOCKBUSTER'];
      const reactionType = reactionTypes[reactionIndex];

      try {
        // Optimistically update UI
        setFeedItems(prevItems =>
          prevItems.map(item => {
            if (
              (item.type === 'post' || item.type === 'trending_post') &&
              (item.data as Post).id === post.id
            ) {
              const currentPost = item.data as Post;
              const wasSelected =
                currentPost.userReactions?.includes(reactionType) || false;

              // Update reaction counts
              const newReactionCounts = { ...currentPost.reactionCounts };
              if (wasSelected) {
                newReactionCounts[reactionType] = Math.max(
                  0,
                  (newReactionCounts[reactionType] || 0) - 1
                );
              } else {
                newReactionCounts[reactionType] =
                  (newReactionCounts[reactionType] || 0) + 1;
              }

              // Update user reactions
              let newUserReactions = [...(currentPost.userReactions || [])];
              if (wasSelected) {
                newUserReactions = newUserReactions.filter(
                  r => r !== reactionType
                );
              } else {
                newUserReactions.push(reactionType);
              }

              return {
                ...item,
                data: {
                  ...currentPost,
                  reactionCounts: newReactionCounts,
                  userReactions: newUserReactions,
                } as Post,
              };
            }
            return item;
          })
        );

        // Call API in background
        await togglePostReaction(post.id, user.id, reactionType);
      } catch (err) {
        console.error('Error toggling reaction:', err);
        // Optionally: revert optimistic update on error
        await loadFeed(); // Reload to get correct state
      }
    };

    return (
      <React.Fragment key={post.id}>
        <View style={styles.postContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handlePostPress(post)}
          >
            {hasImage ? (
              <PicturePost
                userName={username}
                username={username}
                date={formatDate(post.createdAt)}
                content={post.content}
                imageUrls={post.imageUrls || []}
                userId={post.userId}
              />
            ) : (
              <TextPost
                userName={username}
                username={username}
                date={formatDate(post.createdAt)}
                content={post.content}
                userId={post.userId}
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

    const handleReviewPress = () => {
      // TODO: Navigate to post detail page (review)
      console.log('Review pressed:', post.id, 'Movie:', post.movieId);
      console.log('Would navigate to PostDetail with:', {
        postId: post.id,
        movieId: post.movieId,
        type: 'LONG',
        hasStars: true,
      });
      // For now, commenting out navigation to movie page - should go to post detail
      // router.push({
      //   pathname: '/movies/[movieId]',
      //   params: { movieId: post.movieId },
      // });
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
    // TODO: Navigate to post detail page to view/add comments
    console.log('Comment button pressed for post:', post.id);
    console.log('Would navigate to PostDetail with:', {
      postId: post.id,
      movieId: post.movieId,
      type: post.type,
      focusCommentInput: true, // Auto-focus comment input when navigating from comment button
    });
  };

  const handlePostPress = (post: Post) => {
    // TODO: Navigate to post detail page
    console.log('Post pressed:', post.id, 'Movie:', post.movieId);
    console.log('Would navigate to PostDetail with:', {
      postId: post.id,
      movieId: post.movieId,
      type: post.type,
      hasStars: post.stars !== null && post.stars !== undefined,
      hasImages: post.imageUrls && post.imageUrls.length > 0,
      imageCount: post.imageUrls?.length || 0,
    });
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
});

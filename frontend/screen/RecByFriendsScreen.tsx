import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { fetchHomeFeed, togglePostReaction } from '../services/feedService';
import TextPost from '../components/TextPost';
import PicturePost from '../components/PicturePost';
import ReviewPost from '../components/ReviewPost';
import InteractionBar from '../components/InteractionBar';
import type { components } from '../types/api-generated';

type Post = components['schemas']['Post'];
type Rating = components['schemas']['Rating'];

const { width } = Dimensions.get('window');

type FeedItem = {
  type: 'post' | 'rating' | 'trending_post' | 'trending_rating';
  data: Post | Rating;
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
    const isPost = item.type === 'post' || item.type === 'trending_post';

    if (isPost) {
      return renderPost(item.data as Post, index);
    } else {
      return renderRating(item.data as Rating, index);
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
          <View style={styles.interactionWrapper}>
            <InteractionBar
              initialComments={post.commentCount || 0}
              reactions={reactions}
              onCommentPress={() => handleComment(post.id)}
              onReactionPress={handleReaction}
            />
          </View>
        </View>
        {index < feedItems.length - 1 && <View style={styles.divider} />}
      </React.Fragment>
    );
  };

  const renderRating = (rating: Rating, index: number) => {
    const username = rating.UserProfile?.username || 'Unknown';
    const movieTitle = `Movie #${rating.movieId}`;

    return (
      <React.Fragment key={rating.id}>
        <View style={styles.postContainer}>
          <ReviewPost
            userName={username}
            username={username}
            date={formatDate(rating.date)}
            reviewerName={username}
            movieTitle={movieTitle}
            rating={rating.stars}
            userId={rating.userId}
            reviewerUserId={rating.userId}
          />
          <View style={styles.interactionWrapper}>
            <InteractionBar
              initialComments={0}
              onCommentPress={() => console.log('Rating comment')}
            />
          </View>
        </View>
        {index < feedItems.length - 1 && <View style={styles.divider} />}
      </React.Fragment>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleComment = (itemId: string) => {
    console.log('Navigate to comments:', itemId);
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

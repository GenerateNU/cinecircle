import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Dimensions, ActivityIndicator, View, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { fetchHomeFeed, togglePostLike } from '../services/feedService';
import TextPost from '../components/TextPost';
import PicturePost from '../components/PicturePost';
import ReviewPost from '../components/ReviewPost';
import InteractionBar from '../components/InteractionBar';
import type { components } from '../types/api-generated';

type Post = components["schemas"]["Post"];
type Rating = components["schemas"]["Rating"];

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
    const hasImage = post.imageUrl !== null;

    return (
      <React.Fragment key={post.id}>
        <View style={styles.postContainer}>
          {hasImage ? (
            <PicturePost
              userName={username}
              username={username}
              date={formatDate(post.createdAt)}
              content={post.content}
              imageUrl={post.imageUrl || undefined}
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
              initialLikes={post.likeCount || post.votes}
              initialComments={post.commentCount || 0}
              isLiked={false}
              onLikePress={() => handlePostLike(post.id)}
              onCommentPress={() => handleComment(post.id)}
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
              initialLikes={rating.votes}
              initialComments={0}
              isLiked={false}
              onLikePress={() => console.log('Rating like not implemented')}
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

  const handlePostLike = async (postId: string) => {
    if (!user?.id) return;
    
    try {
      await togglePostLike(postId, user.id);
      await loadFeed();
    } catch (err) {
      console.error('Error liking post:', err);
    }
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
import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CommentSection from '../commentSection/commentSection';
import { api } from '../../services/apiClient';
import type { components } from '../../types/api-generated';

type Post = components['schemas']['Post'];
type Rating = components['schemas']['Rating'];

type PostDetailResponse = {
  message?: string;
  data: Post;
};

type RatingDetailResponse = {
  message?: string;
  data: Rating;
};

const { width } = Dimensions.get('window');

export default function PostDetailPage() {
  const { id, type } = useLocalSearchParams<{ id: string; type: 'post' | 'rating' }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [rating, setRating] = useState<Rating | null>(null);

  const targetType = type || 'post';

  const loadContent = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      if (targetType === 'rating') {
        const response = await api.get<RatingDetailResponse>(`/api/rating/${id}`);
        setRating(response.data ?? null);
      } else {
        const response = await api.get<PostDetailResponse>(`/api/post/${id}`);
        setPost(response.data ?? null);
      }
    } catch (err) {
      console.error('Failed to load content:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, targetType]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  if (!id) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No content ID provided</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || (!post && !rating)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Content not found'}</Text>
          <TouchableOpacity onPress={loadContent} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {targetType === 'rating' ? 'Rating' : 'Post'}
        </Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Post Content */}
        {targetType === 'post' && post && (
          <View style={styles.contentCard}>
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {post.UserProfile?.username?.[0]?.toUpperCase() || '?'}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.username}>
                  {post.UserProfile?.username || 'Anonymous'}
                </Text>
                <Text style={styles.date}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <Text style={styles.contentText}>{post.content}</Text>

            {post.imageUrls && post.imageUrls.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.imageScroll}
              >
                {post.imageUrls.map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            )}

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Feather name="heart" size={16} color="#666" />
                <Text style={styles.statText}>{post.reactionCount ?? 0}</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="message-circle" size={16} color="#666" />
                <Text style={styles.statText}>{post.commentCount ?? 0}</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="repeat" size={16} color="#666" />
                <Text style={styles.statText}>{post.replyCount ?? 0}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Rating Content */}
        {targetType === 'rating' && rating && (
          <View style={styles.contentCard}>
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {rating.UserProfile?.username?.[0]?.toUpperCase() || '?'}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.username}>
                  {rating.UserProfile?.username || 'Anonymous'}
                </Text>
                <Text style={styles.date}>
                  {new Date(rating.date).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.ratingRow}>
              {[...Array(5)].map((_, i) => (
                <Feather
                  key={i}
                  name="star"
                  size={20}
                  color={i < rating.stars ? '#FFD700' : '#DDD'}
                  style={i < rating.stars ? { fill: '#FFD700' } : undefined}
                />
              ))}
              <Text style={styles.ratingText}>{rating.stars}/5</Text>
            </View>

            {rating.comment && (
              <Text style={styles.contentText}>{rating.comment}</Text>
            )}

            {rating.tags && rating.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {rating.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Feather name="thumbs-up" size={16} color="#666" />
                <Text style={styles.statText}>{rating.votes ?? 0}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Comment Section */}
        <View style={styles.commentsContainer}>
          <CommentSection targetType={targetType} targetId={id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#333',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  contentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  imageScroll: {
    marginBottom: 12,
  },
  postImage: {
    width: width - 64,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#666',
  },
  commentsContainer: {
    marginTop: 16,
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

import { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { api } from '../../services/apiClient';
import type { ApiComment } from './_types';
import { buildCommentTree, type CommentNode } from './_utils';
import CommentThread from './components/CommentThread';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface CommentSectionProps { 
  targetType: 'post' | 'rating';
  targetId: string;
}

interface GetCommentsResponse {
  message?: string;
  comments: ApiComment[];
}

const MAX_INITIAL_THREADS = 4;
const THREAD_INCREMENT = 8;

const CommentSection = ({ targetType, targetId }: CommentSectionProps) => {
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyTarget, setReplyTarget] = useState<CommentNode | null>(null);
  const [visibleThreadCount, setVisibleThreadCount] = useState(MAX_INITIAL_THREADS);

  const endpoint = useMemo(
    () =>
      targetType === 'post'
        ? `/api/comments/post/${targetId}`
        : `/api/comments/rating/${targetId}`,
    [targetId, targetType]
  );

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<GetCommentsResponse>(endpoint);
      setComments(response.comments ?? []);
      setVisibleThreadCount(MAX_INITIAL_THREADS);
    } catch (err) {
      console.error('Failed to load comments', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Re-fetch comments every time this screen/component gains focus
  useFocusEffect(
    useCallback(() => {
      loadComments();
      // no cleanup needed; we rely on latest state when refocused
      return undefined;
    }, [loadComments])
  );

  const tree = useMemo(() => buildCommentTree(comments), [comments]);
  const visibleThreads = tree.slice(0, visibleThreadCount);
  const hasMoreThreads = tree.length > visibleThreadCount;

  if (loading) {
    return (
      <View>
        <Text>Loading comments…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginHorizontal: width * 0.025 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
        Comments ({comments.length})
      </Text>

      <ScrollView
        contentContainerStyle={{ paddingRight: width * 0.04 }}
        showsVerticalScrollIndicator={false}
      >
        {visibleThreads.map((node) => (
          <CommentThread
            key={node.id}
            node={node}
            depth={0}
            onReply={setReplyTarget}
            targetType={targetType}
            targetId={targetId}
          />
        ))}

        {hasMoreThreads && (
          <TouchableOpacity
            onPress={() =>
              setVisibleThreadCount((prev) => Math.min(prev + THREAD_INCREMENT, tree.length))
            }
          >
            <Text style={{ color: '#555', fontWeight: '500' }}>
              View more comments ({tree.length - visibleThreadCount} more)
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {replyTarget && (
        <Text style={{ marginTop: 8 }}>
          Replying to: {replyTarget.UserProfile?.username ?? 'Anonymous'}
        </Text>
      )}
    </View>
  );
};

export default CommentSection;

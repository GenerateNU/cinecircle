import { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { api } from '../../services/apiClient';
import type { ApiComment } from './_types';
import { buildCommentTree, type CommentNode } from './_utils';
import CommentThread from './commentThread';

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

  useEffect(() => {
    let cancelled = false;

    async function loadComments() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<GetCommentsResponse>(endpoint);
        if (!cancelled) {
          setComments(response.comments ?? []);
          setVisibleThreadCount(MAX_INITIAL_THREADS);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load comments', err);
          setError('Failed to load comments');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadComments();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

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
    <View style={{ flex: 1 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
        Comments ({comments.length})
      </Text>

      <ScrollView>
        {visibleThreads.map((node) => (
          <CommentThread
            key={node.id}
            node={node}
            depth={0}
            onReply={setReplyTarget}
          />
        ))}

        {hasMoreThreads && (
          <TouchableOpacity
            style={{ paddingVertical: 8 }}
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

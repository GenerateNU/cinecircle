import { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { api } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import type { ApiComment } from './_types';
import { buildCommentTree, findCommentById, findRootAncestor, type CommentNode } from './_utils';
import Comment from './components/Comment';
import CommentInput from './components/CommentInput';
import { threadStyles } from './styles/Thread.styles';

interface GetCommentsResponse {
  message?: string;
  comments: ApiComment[];
}

interface CreateCommentResponse {
  message: string;
  comment: ApiComment;
}

/**
 * Recursive component to render a comment and all its replies without depth limit.
 */
function ThreadComment({
  node,
  depth,
  onReply,
}: {
  node: CommentNode;
  depth: number;
  onReply: (node: CommentNode) => void;
}) {
  const hasReplies = node.replies.length > 0;

  return (
    <View style={depth > 0 ? threadStyles.replyContainer : threadStyles.rootCommentContainer}>
      {hasReplies && depth > 0 && <View style={threadStyles.threadLine} />}
      <Comment comment={node} depth={0} onReply={onReply} />
      {node.replies.map((reply) => (
        <ThreadComment
          key={reply.id}
          node={reply}
          depth={depth + 1}
          onReply={onReply}
        />
      ))}
    </View>
  );
}

const Thread = () => {
  const { profile } = useAuth();
  const params = useLocalSearchParams<{
    type: 'post' | 'rating';
    targetId: string;
    commentId: string;
  }>();

  const { type, targetId, commentId } = params;

  const [comments, setComments] = useState<ApiComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<CommentNode | null>(null);

  const endpoint = useMemo(
    () =>
      type === 'post'
        ? `/api/comments/post/${targetId}`
        : `/api/comments/rating/${targetId}`,
    [targetId, type]
  );

  const loadComments = useCallback(async () => {
    if (!type || !targetId || !commentId) {
      setError('Missing required parameters');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<GetCommentsResponse>(endpoint);
      setComments(response.comments ?? []);
    } catch (err) {
      console.error('Failed to load thread comments', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [endpoint, type, targetId, commentId]);

  // Re-fetch comments every time this screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadComments();
      return undefined;
    }, [loadComments])
  );

  // Find the root of the thread containing the selected comment
  const threadRoot = useMemo(() => {
    if (comments.length === 0 || !commentId) return null;

    // Find the root ancestor of the clicked comment
    const rootId = findRootAncestor(comments, commentId);
    
    // Build the tree and find the root node
    const tree = buildCommentTree(comments);
    return findCommentById(tree, rootId);
  }, [comments, commentId]);

  const handleSubmitComment = useCallback(async (content: string) => {
    const body: { content: string; postId?: string; ratingId?: string; parentId?: string } = {
      content,
    };

    if (type === 'post') {
      body.postId = targetId;
    } else {
      body.ratingId = targetId;
    }

    if (replyTarget) {
      body.parentId = replyTarget.id;
    } else if (threadRoot) {
      // If no specific reply target, reply to the root comment of this thread
      body.parentId = threadRoot.id;
    }

    try {
      const response = await api.post<CreateCommentResponse>('/api/comment', body);
      setReplyTarget(null);
      
      // Optimistically add the new comment to the state without showing loading
      if (response.comment) {
        setComments((prevComments) => [...prevComments, response.comment]);
      } else {
        // Fallback: reload if response doesn't include the comment
        await loadComments();
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      // Reload on error to ensure consistency
      await loadComments();
    }
  }, [type, targetId, replyTarget, threadRoot, loadComments]);

  const handleCancelReply = useCallback(() => {
    setReplyTarget(null);
  }, []);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={threadStyles.container}>
        <View style={threadStyles.header}>
          <TouchableOpacity onPress={handleBack} style={threadStyles.backButton}>
            <MaterialIcons name="arrow-back" style={threadStyles.backIcon} />
          </TouchableOpacity>
          <Text style={threadStyles.headerTitle}>Thread</Text>
        </View>
        <View style={threadStyles.loadingContainer}>
          <Text style={threadStyles.loadingText}>Loading thread…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !threadRoot) {
    return (
      <SafeAreaView style={threadStyles.container}>
        <View style={threadStyles.header}>
          <TouchableOpacity onPress={handleBack} style={threadStyles.backButton}>
            <MaterialIcons name="arrow-back" style={threadStyles.backIcon} />
          </TouchableOpacity>
          <Text style={threadStyles.headerTitle}>Thread</Text>
        </View>
        <View style={threadStyles.errorContainer}>
          <Text style={threadStyles.errorText}>
            {error ?? 'Thread not found'}
          </Text>
          <TouchableOpacity onPress={loadComments} style={threadStyles.retryButton}>
            <Text style={threadStyles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={threadStyles.container}>
      <KeyboardAvoidingView
        style={threadStyles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={threadStyles.header}>
          <TouchableOpacity onPress={handleBack} style={threadStyles.backButton}>
            <MaterialIcons name="arrow-back" style={threadStyles.backIcon} />
          </TouchableOpacity>
          <Text style={threadStyles.headerTitle}>Thread</Text>
        </View>

        <ScrollView
          style={threadStyles.scrollContainer}
          contentContainerStyle={threadStyles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ThreadComment
            node={threadRoot}
            depth={0}
            onReply={setReplyTarget}
          />
        </ScrollView>

        <CommentInput
          onSubmit={handleSubmitComment}
          replyingTo={replyTarget?.UserProfile?.username ?? (replyTarget ? 'Anonymous' : null)}
          onCancelReply={handleCancelReply}
          placeholder="Reply to thread..."
          userProfilePicture={profile?.profilePicture}
          username={profile?.username}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Thread;

import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { api } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import type { ApiComment } from './_types';
import { buildCommentTree, type CommentNode } from './_utils';
import CommentThread from './components/CommentThread';
import CommentInput from './components/CommentInput';
import { commentSectionStyles } from './styles/CommentSection.styles';

interface CommentSectionProps {
    targetType: 'post' | 'rating';
    targetId: string;
    /** When true, renders CommentInput at the bottom. When false, parent handles input rendering. */
    renderInput?: boolean;
    /** Called with input props when renderInput is false, so parent can render input elsewhere */
    onInputPropsReady?: (inputProps: CommentInputRenderProps) => void;
}

export interface CommentInputRenderProps {
    onSubmit: (content: string) => Promise<void>;
    replyingTo: string | null;
    onCancelReply: () => void;
    userProfilePicture?: string | null;
    username?: string | null;
}

interface GetCommentsResponse {
    message?: string;
    comments: ApiComment[];
}

interface CreateCommentResponse {
    message: string;
    comment: ApiComment;
}

const MAX_INITIAL_THREADS = 4;
const THREAD_INCREMENT = 8;

const CommentSection = ({ targetType, targetId, renderInput = true, onInputPropsReady }: CommentSectionProps) => {
    const { profile } = useAuth();
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
            return undefined;
        }, [loadComments])
    );

    const tree = useMemo(() => buildCommentTree(comments), [comments]);
    const visibleThreads = tree.slice(0, visibleThreadCount);
    const hasMoreThreads = tree.length > visibleThreadCount;

    const handleSubmitComment = useCallback(async (content: string) => {
        const body: { content: string; postId?: string; ratingId?: string; parentId?: string } = {
            content,
        };

        if (targetType === 'post') {
            body.postId = targetId;
        } else {
            body.ratingId = targetId;
        }

        if (replyTarget) {
            body.parentId = replyTarget.id;
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
    }, [targetType, targetId, replyTarget, loadComments]);

    const handleCancelReply = useCallback(() => {
        setReplyTarget(null);
    }, []);

    // Provide input props to parent when not rendering input internally
    const inputProps: CommentInputRenderProps = useMemo(() => ({
        onSubmit: handleSubmitComment,
        replyingTo: replyTarget?.UserProfile?.username ?? (replyTarget ? 'Anonymous' : null),
        onCancelReply: handleCancelReply,
        userProfilePicture: profile?.profilePicture,
        username: profile?.username,
    }), [handleSubmitComment, replyTarget, handleCancelReply, profile?.profilePicture, profile?.username]);

    // Notify parent of input props when they change - this runs before any early returns
    // so the input is always available even during loading
    useEffect(() => {
        if (!renderInput && onInputPropsReady) {
            onInputPropsReady(inputProps);
        }
    }, [renderInput, onInputPropsReady, inputProps]);

    if (loading) {
        return (
            <>
                <View style={commentSectionStyles.loadingContainer}>
                    <Text style={commentSectionStyles.loadingText}>Loading comments…</Text>
                </View>
                {renderInput && (
                    <CommentInput
                        onSubmit={handleSubmitComment}
                        replyingTo={replyTarget?.UserProfile?.username ?? (replyTarget ? 'Anonymous' : null)}
                        onCancelReply={handleCancelReply}
                        userProfilePicture={profile?.profilePicture}
                        username={profile?.username}
                    />
                )}
            </>
        );
    }

    if (error) {
        return (
            <>
                <View style={commentSectionStyles.errorContainer}>
                    <Text style={commentSectionStyles.errorText}>{error}</Text>
                </View>
                {renderInput && (
                    <CommentInput
                        onSubmit={handleSubmitComment}
                        replyingTo={replyTarget?.UserProfile?.username ?? (replyTarget ? 'Anonymous' : null)}
                        onCancelReply={handleCancelReply}
                        userProfilePicture={profile?.profilePicture}
                        username={profile?.username}
                    />
                )}
            </>
        );
    }

    return (
        <View style={commentSectionStyles.container}>
            <Text style={commentSectionStyles.header}>
                {comments.length} Comments
            </Text>

            <View style={commentSectionStyles.threadContainer}>
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
                        style={commentSectionStyles.viewMoreButton}
                    >
                        <Text style={commentSectionStyles.viewMoreText}>
                            View more comments ({tree.length - visibleThreadCount} more)
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {renderInput && (
                <CommentInput
                    onSubmit={handleSubmitComment}
                    replyingTo={replyTarget?.UserProfile?.username ?? (replyTarget ? 'Anonymous' : null)}
                    onCancelReply={handleCancelReply}
                    userProfilePicture={profile?.profilePicture}
                    username={profile?.username}
                />
            )}
        </View>
    );
};

export default CommentSection;
export { CommentInput };

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { CommentNode } from '../_utils';
import CommentUserRow from './CommentUserRow';
import CommentInteractionBar from './CommentInteractionBar';
import { commentStyles, INDENT_PER_LEVEL } from '../styles/Comment.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { api } from '../../../services/apiClient';

type CommentProps = {
  comment: CommentNode;
  depth: number;
  onReply?: (comment: CommentNode) => void;
  onContinueThread?: () => void;
};

interface ToggleLikeResponse {
  message: string;
  liked: boolean;
  likeCount: number;
}

const MAX_PREVIEW_CHARS = 400;

const Comment: React.FC<CommentProps> = ({
  comment,
  depth,
  onReply,
  onContinueThread,
}) => {
  const username = comment.UserProfile?.username ?? 'Anonymous';
  const profilePicture = comment.UserProfile?.profilePicture ?? null;
  const [isExpanded, setIsExpanded] = useState(false);
  const [liked, setLiked] = useState(comment.liked);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [isLiking, setIsLiking] = useState(false);

  const isLong = comment.content.length > MAX_PREVIEW_CHARS;
  const previewText = isLong
    ? comment.content.slice(0, MAX_PREVIEW_CHARS).trimEnd() + '…'
    : comment.content;
  const displayText = isExpanded || !isLong ? comment.content : previewText;

  const handleLikePress = useCallback(async () => {
    if (isLiking) return;

    // Optimistic update
    const previousLiked = liked;
    const previousCount = likeCount;
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    setIsLiking(true);

    try {
      const response = await api.post<ToggleLikeResponse>(`/api/comment/${comment.id}/like`);
      // Sync with server response
      setLiked(response.liked);
      setLikeCount(response.likeCount);
    } catch (error) {
      // Revert on error
      console.error('Failed to toggle like:', error);
      setLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setIsLiking(false);
    }
  }, [comment.id, liked, likeCount, isLiking]);

  return (
    <View style={[
      commentStyles.container,
      { marginLeft: depth * INDENT_PER_LEVEL }
    ]}>
      <View style={commentStyles.content}>
        <View style={commentStyles.headerRow}>
          <CommentUserRow
            username={username}
            profilePicture={profilePicture}
            timestamp={comment.createdAt}
          />
        </View>


        <View style={commentStyles.bodyContainer}>
          <Text style={commentStyles.body}>{displayText}</Text>
          {isLong && (
            <View style={commentStyles.expandTextContainer}>
              <TouchableOpacity onPress={() => setIsExpanded((prev) => !prev)}>
                <Text style={commentStyles.expandText}>
                  {isExpanded ? 'Show less' : 'Expand Comment'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {isLong && !isExpanded && (
            <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 1)']}
              locations={[0, 0.3, 1]}
              style={commentStyles.fadeOverlay}
            />
          )}
        </View>

        {(isExpanded || !isLong) && (
          <View>
            <View style={commentStyles.interactionsBar}>
              <CommentInteractionBar
                likeCount={likeCount}
                liked={liked}
                onLikePress={handleLikePress}
                onTranslatePress={() => { }}
                onReplyPress={() => onReply?.(comment)}
              />
            </View>
            <View>
              {onContinueThread && (
                <TouchableOpacity onPress={onContinueThread}>
                  <View style={commentStyles.viewMoreTextContainer}>
                    <Text style={commentStyles.viewMoreText}>Continue Thread</Text>
                    <MaterialIcons name="arrow-forward" style={commentStyles.viewMoreIcon} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Comment;
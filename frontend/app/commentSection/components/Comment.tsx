// components/Comment.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { CommentNode } from '../_utils';
import CommentUserRow from './CommentUserRow';
import CommentInteractionBar from './CommentInteractionBar';
import { commentStyles, INDENT_PER_LEVEL } from '../styles/Comment.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { api } from '../../../services/apiClient';
import { translateTextApi } from '../../../services/translationService';
import { useAuth } from '../../../context/AuthContext';

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

function mapPrimaryLanguage(primaryLanguage?: string | null): {
  code: string;
  label: string;
} {
  if (!primaryLanguage) return { code: 'en', label: 'English' };

  const lower = primaryLanguage.toLowerCase().trim();

  switch (lower) {
    case 'hindi':
      return { code: 'hi', label: 'Hindi' };
    case 'tamil':
      return { code: 'ta', label: 'Tamil' };
    case 'telugu':
      return { code: 'te', label: 'Telugu' };
    case 'bengali':
    case 'bangla':
      return { code: 'bn', label: 'Bengali' };
    case 'english':
    case 'en':
      return { code: 'en', label: 'English' };
    default:
      return { code: 'en', label: primaryLanguage };
  }
}

const Comment: React.FC<CommentProps> = ({
  comment,
  depth,
  onReply,
  onContinueThread,
}) => {
  const username = comment.UserProfile?.username ?? 'Anonymous';
  const profilePicture = comment.UserProfile?.profilePicture ?? null;

  const { profile } = useAuth();
  const mappedLang = mapPrimaryLanguage((profile as any)?.primaryLanguage);
  const userLangCode = mappedLang.code;
  const shouldShowTranslate = userLangCode == 'en';

  const [isExpanded, setIsExpanded] = useState(false);
  const [liked, setLiked] = useState(comment.liked);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [isLiking, setIsLiking] = useState(false);

  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Base text is either translated or original, depending on toggle state
  const baseText =
    isTranslated && translatedText ? translatedText : comment.content;

  const isLong = baseText.length > MAX_PREVIEW_CHARS;
  const previewText = isLong
    ? baseText.slice(0, MAX_PREVIEW_CHARS).trimEnd() + '…'
    : baseText;
  const displayText = isExpanded || !isLong ? baseText : previewText;

  const handleLikePress = useCallback(async () => {
    if (isLiking) return;

    const previousLiked = liked;
    const previousCount = likeCount;

    // optimistic update
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    setIsLiking(true);

    try {
      const response = await api.post<ToggleLikeResponse>(
        `/api/comment/${comment.id}/like`
      );
      // assuming api.post returns the JSON directly (as it did before)
      setLiked(response.liked);
      setLikeCount(response.likeCount);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      setLiked(previousLiked);
      setLikeCount(previousCount);
    } finally {
      setIsLiking(false);
    }
  }, [comment.id, liked, likeCount, isLiking]);

  const handleTranslatePress = useCallback(async () => {
    console.log('=== [Comment] translate pressed ===', {
      isTranslated,
      hasTranslated: !!translatedText,
      userLangCode,
    });

    const turningOn = !isTranslated;

    if (turningOn && shouldShowTranslate && !translatedText) {
      try {
        if (isTranslating) return;
        setIsTranslating(true);

        console.log('[Comment] Calling translateTextApi with:', {
          textSnippet: comment.content.slice(0, 80),
          dest: 'en',
        });

        // Translate to English, auto-detect source language
        const response = await translateTextApi(
          comment.content,
          'en'
        );
        console.log('[Comment] translateTextApi response =', response);

        const tText = response.destinationText || comment.content;
        setTranslatedText(tText);
      } catch (err) {
        console.error('[Comment] Translation ERROR:', err);
        setTranslatedText(null);
      } finally {
        setIsTranslating(false);
      }
    }

    setIsTranslated(prev => !prev);
  }, [
    comment.content,
    isTranslated,
    translatedText,
    shouldShowTranslate,
    isTranslating,
  ]);

  return (
    <View
      style={[
        commentStyles.container,
        { marginLeft: depth * INDENT_PER_LEVEL },
      ]}
    >
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
              <TouchableOpacity onPress={() => setIsExpanded(prev => !prev)}>
                <Text style={commentStyles.expandText}>
                  {isExpanded ? 'Show less' : 'Expand Comment'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {isLong && !isExpanded && (
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 0.8)',
                'rgba(255, 255, 255, 1)',
              ]}
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
                onTranslatePress={
                  shouldShowTranslate ? handleTranslatePress : undefined
                }
                onReplyPress={() => onReply?.(comment)}
              />
            </View>
            <View>
              {onContinueThread && (
                <TouchableOpacity onPress={onContinueThread}>
                  <View style={commentStyles.viewMoreTextContainer}>
                    <Text style={commentStyles.viewMoreText}>
                      Continue Thread
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      style={commentStyles.viewMoreIcon}
                    />
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

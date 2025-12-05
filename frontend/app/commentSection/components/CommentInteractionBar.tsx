// components/CommentInteractionBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { commentInteractionBarStyles } from '../styles/CommentInteractionBar.styles';

type CommentInteractionBarProps = {
  likeCount: number;
  liked: boolean;
  onLikePress?: () => void;
  onTranslatePress?: () => void;
  onReplyPress?: () => void;
};

const CommentInteractionBar: React.FC<CommentInteractionBarProps> = ({
  likeCount,
  liked,
  onLikePress,
  onTranslatePress,
  onReplyPress,
}) => {
  return (
    <View style={commentInteractionBarStyles.container}>
      {/* Translate – only show if handler is provided */}
      {onTranslatePress && (
        <TouchableOpacity
          onPress={onTranslatePress}
          style={commentInteractionBarStyles.button}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="translate"
            style={commentInteractionBarStyles.icon}
          />
        </TouchableOpacity>
      )}

      {/* Reply */}
      <TouchableOpacity
        onPress={onReplyPress}
        style={commentInteractionBarStyles.button}
        activeOpacity={0.7}
      >
        <MaterialIcons name="reply" style={commentInteractionBarStyles.icon} />
      </TouchableOpacity>

      {/* Like */}
      <TouchableOpacity
        onPress={onLikePress}
        style={commentInteractionBarStyles.likeButton}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name={liked ? 'favorite' : 'favorite-border'}
          style={[
            commentInteractionBarStyles.icon,
            liked && commentInteractionBarStyles.likedIcon,
          ]}
        />
        <Text
          style={[
            commentInteractionBarStyles.likeCount,
            liked && commentInteractionBarStyles.likedText,
          ]}
        >
          {likeCount > 0 ? likeCount : ' '}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommentInteractionBar;

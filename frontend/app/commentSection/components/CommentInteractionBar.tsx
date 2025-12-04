import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { commentInteractionBarStyles } from '../styles/CommentInteractionBar.styles';

type CommentInteractionBarProps = {
  onLikePress?: () => void;
  onTranslatePress?: () => void;
  onReplyPress?: () => void;
};

const CommentInteractionBar: React.FC<CommentInteractionBarProps> = ({
  onLikePress,
  onTranslatePress,
  onReplyPress,
}) => {
  return (
    <View style={commentInteractionBarStyles.container}>
      {/* Translate */}
      <TouchableOpacity
        onPress={onTranslatePress}
        style={commentInteractionBarStyles.button}
        activeOpacity={0.7}
      >
        <MaterialIcons name="translate" style={commentInteractionBarStyles.icon} />
      </TouchableOpacity>

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
        style={commentInteractionBarStyles.button}
        activeOpacity={0.7}
      >
        <MaterialIcons name="favorite-border" style={commentInteractionBarStyles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default CommentInteractionBar;

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
        <MaterialIcons name="translate" size={16} color="#777" />
      </TouchableOpacity>

      {/* Reply */}
      <TouchableOpacity
        onPress={onReplyPress}
        style={commentInteractionBarStyles.button}
        activeOpacity={0.7}
      >
        <MaterialIcons name="reply" size={16} color="#777" />
      </TouchableOpacity>

      {/* Like */}
      <TouchableOpacity
        onPress={onLikePress}
        style={commentInteractionBarStyles.button}
        activeOpacity={0.7}
      >
        <MaterialIcons name="favorite-border" size={16} color="#777" />
      </TouchableOpacity>
    </View>
  );
};

export default CommentInteractionBar;

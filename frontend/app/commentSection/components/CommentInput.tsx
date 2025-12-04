import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { commentInputStyles, AVATAR_SIZE } from '../styles/CommentInput.styles';

type CommentInputProps = {
  placeholder?: string;
  replyingTo?: string | null;
  onCancelReply?: () => void;
  onSubmit: (content: string) => Promise<void>;
  userProfilePicture?: string | null;
  username?: string | null;
};

const CommentInput: React.FC<CommentInputProps> = ({
  placeholder = 'Add to the discussion...',
  replyingTo,
  onCancelReply,
  onSubmit,
  userProfilePicture,
  username,
}) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedText = text.trim();
    if (!trimmedText || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(trimmedText);
      setText('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = text.trim().length > 0 && !isSubmitting;
  const displayName = username || 'Anonymous';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <View style={commentInputStyles.container}>
      {replyingTo && (
        <View style={commentInputStyles.replyingToContainer}>
          <Text style={commentInputStyles.replyingToText}>
            Replying to {replyingTo}
          </Text>
          <TouchableOpacity onPress={onCancelReply} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="close" style={commentInputStyles.cancelIcon} />
          </TouchableOpacity>
        </View>
      )}
      <View style={commentInputStyles.inputRow}>
        {userProfilePicture ? (
          <Image
            source={{ uri: userProfilePicture }}
            style={commentInputStyles.avatar}
          />
        ) : (
          <View style={[commentInputStyles.avatar, commentInputStyles.avatarPlaceholder]}>
            <Text style={commentInputStyles.avatarText}>{initials}</Text>
          </View>
        )}
        <TextInput
          style={commentInputStyles.input}
          placeholder={replyingTo ? `Reply to ${replyingTo}...` : placeholder}
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={2000}
          editable={!isSubmitting}
        />
        <TouchableOpacity
          style={[
            commentInputStyles.sendButton,
            !canSubmit && commentInputStyles.sendButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.7}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialIcons name="arrow-upward" style={commentInputStyles.sendIcon} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentInput;

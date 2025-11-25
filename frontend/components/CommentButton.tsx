import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles/CommentButton.styles';

interface CommentButtonProps {
  count: number;
  onPress?: () => void;
}

export default function CommentButton({ count, onPress }: CommentButtonProps) {
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons name="chat-bubble" style={styles.icon} />
      <Text style={styles.count}>{formatCount(count)}</Text>
    </TouchableOpacity>
  );
}


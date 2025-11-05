import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles/CommentItem.styles';

interface CommentItemProps {
  nestLevel?: number;
  size?: 'small' | 'medium' | 'large';
}

export default function CommentItem({ nestLevel = 0, size = 'medium' }: CommentItemProps) {
  const getMarginLeft = () => {
    const { width } = require('react-native').Dimensions.get('window');
    return nestLevel * width * 0.075;
  };

  return (
    <View style={[styles.container, { marginLeft: getMarginLeft() }]}>
      <View style={[styles.avatar, styles[size]]} />
      <View style={styles.content}>
        <View style={[styles.placeholder, styles[size]]} />
      </View>
    </View>
  );
}
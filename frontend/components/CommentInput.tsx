import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/CommentInput.styles';

interface CommentInputProps {
  placeholder: string;
  size?: 'small' | 'medium' | 'large';
}

export default function CommentInput({ placeholder, size = 'medium' }: CommentInputProps) {
  return (
    <View style={[styles.container, styles[size]]}>
      <View style={[styles.avatar, styles[`${size}Avatar`]]} />
      <Text style={[styles.placeholder, styles[`${size}Text`]]}>
        {placeholder}
      </Text>
    </View>
  );
}
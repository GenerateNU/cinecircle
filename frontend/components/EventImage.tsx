import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles/EventImage.styles';

interface EventImageProps {
  imageUrl?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function EventImage({ imageUrl, size = 'medium' }: EventImageProps) {
  return (
    <View style={[styles.container, styles[size]]}>
      <View style={[styles.image, styles[`${size}Image`]]} />
    </View>
  );
}
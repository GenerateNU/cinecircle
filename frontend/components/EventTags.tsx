import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../styles/EventTags.styles';

interface EventTagsProps {
  tags: string[];
  size?: 'small' | 'medium' | 'large';
  onTagPress?: (tag: string, index: number) => void;
}

export default function EventTagList({ tags, size = 'medium', onTagPress }: EventTagsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tags.map((tag, index) => (
        <TouchableOpacity key={index} 
        style={[styles.tagPill, styles[size]]}
        onPress={() => onTagPress?.(tag, index)}>
          <Text style={[styles.tagText, styles[`${size}Text`]]}>{tag}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from '../styles/EventTags.styles';

interface EventTagsProps {
  tags: string[];
  size?: 'small' | 'medium' | 'large';
}

export default function EventTagList({ tags, size = 'medium' }: EventTagsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tags.map((tag, index) => (
        <View key={index} style={[styles.tagPill, styles[size]]}>
          <Text style={[styles.tagText, styles[`${size}Text`]]}>{tag}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
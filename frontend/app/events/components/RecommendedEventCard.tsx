import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { styles } from '../styles/RecommendedEventCard.styles';
import type { LocalEvent } from '../../../services/eventsService';

interface RecommendedEventCardProps {
  event: LocalEvent;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const PLACEHOLDER_IMAGE =
  'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg';

export default function RecommendedEventCard({
  event,
  onPress,
  size = 'medium',
}: RecommendedEventCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, styles[size]]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ImageBackground
        source={{ uri: event.imageUrl || PLACEHOLDER_IMAGE }}
        style={[styles.image, styles[`${size}Image`]]}
        imageStyle={styles.imageStyle}
      />
      <View style={styles.details}>
        <Text style={[styles.title, styles[`${size}Title`]]}>
          {event.title}
        </Text>
        <Text style={[styles.dateTime, styles[`${size}Text`]]}>
          {event.date} - {event.time}
        </Text>
        <Text style={[styles.location, styles[`${size}Text`]]}>
          {event.location}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

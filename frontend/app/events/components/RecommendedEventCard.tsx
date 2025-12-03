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
  'https://www.bostonteapartyship.com/wp-content/uploads/2023/03/boston-fall.jpg';

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

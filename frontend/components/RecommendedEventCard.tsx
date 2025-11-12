import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/RecommendedEventCard.styles';

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  attendees?: string;
}

interface RecommendedEventCardProps {
  event: Event;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function RecommendedEventCard({ 
  event, 
  onPress, 
  size = 'medium' 
}: RecommendedEventCardProps) {
  const handlePress = () => {
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity 
      style={[styles.card, styles[size]]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.image, styles[`${size}Image`]]} />
      <View style={styles.details}>
        <Text style={[styles.title, styles[`${size}Title`]]}>{event.title}</Text>
        <Text style={[styles.dateTime, styles[`${size}Text`]]}>
          {event.date} • {event.time}
        </Text>
        <Text style={[styles.location, styles[`${size}Text`]]}>{event.location}</Text>
        {event.attendees && (
          <Text style={[styles.attendees, styles[`${size}Text`]]}>{event.attendees}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
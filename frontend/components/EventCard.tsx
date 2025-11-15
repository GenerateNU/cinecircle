import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/EventCard.styles';

interface Event {
    id: string;
    title: string;
    location: string;
    date: string;
    time: string;
    imageUrl?: string;
    attendees?: string;
  }

  interface EventCardProps {
    event: Event;
    onPress?: () => void;
    size?: 'small' | 'medium' | 'large';
  }

  export default function EventCard({ event, onPress, size = 'medium' }: EventCardProps) {
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
        <Text style={[styles.title, styles[`${size}Title`]]}>{event.title}</Text>
        <View style={styles.details}>
          <Text style={[styles.location, styles[`${size}Text`]]}>📍 {event.location}</Text>
          <Text style={[styles.dateTime, styles[`${size}Text`]]}>
            📅 {event.date} • {event.time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
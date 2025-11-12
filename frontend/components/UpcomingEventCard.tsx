import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/UpcomingEventCard.styles';

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
}

interface UpcomingEventCardProps {
  event: Event;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function UpcomingEventCard({ 
  event, 
  onPress, 
  size = 'medium' 
}: UpcomingEventCardProps) {
  const handlePress = () => {
    if (onPress) onPress();
  };

  // use this to extract month and day from string
  const getMonthDay = (dateStr: string) => {
    // handle diff formats like nov 14 vs november 14 for consistency
    const parts = dateStr.trim().split(' ');
    const month = parts[0] || 'Nov';
    const day = parts[1]?.replace(/\D/g, '') || '14';
    
    return { month, day };
  };

  const { month, day } = getMonthDay(event.date);

  return (
    <TouchableOpacity 
      style={[styles.card, styles[size]]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.dateBox, styles[`${size}DateBox`]]}>
        <Text style={[styles.dateMonth, styles[`${size}Month`]]}>
          {month.substring(0, 3).toUpperCase()}
        </Text>
        <Text style={[styles.dateDay, styles[`${size}Day`]]}>{day}</Text>
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, styles[`${size}Title`]]}>{event.title}</Text>
        <View style={styles.info}>
          <Text style={[styles.text, styles[`${size}Text`]]}>📍 {event.location}</Text>
          <Text style={[styles.text, styles[`${size}Text`]]}>🕐 {event.time}</Text>
        </View>
      </View>
      <Text style={[styles.arrow, styles[`${size}Arrow`]]}>›</Text>
    </TouchableOpacity>
  );
}
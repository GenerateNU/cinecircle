import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/AttendeeList.styles';

interface AttendeeListProps {
  attendeeCount: number;
  additionalCount?: number;
  size?: 'small' | 'medium' | 'large';
}

export default function AttendeeList({ 
  attendeeCount, 
  additionalCount = 0, 
  size = 'medium' 
}: AttendeeListProps) {
  const displayCount = Math.min(attendeeCount, 5);
  
  return (
    <View style={styles.container}>
      {[...Array(displayCount)].map((_, index) => (
        <View key={index} style={[styles.avatar, styles[size]]}>
          <View style={[styles.avatarPlaceholder, styles[`${size}Placeholder`]]} />
        </View>
      ))}
      {additionalCount > 0 && (
        <View style={[styles.moreAttendees, styles[size]]}>
          <Text style={[styles.moreText, styles[`${size}Text`]]}>
            +{additionalCount}
          </Text>
        </View>
      )}
    </View>
  );
}
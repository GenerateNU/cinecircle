import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/EventDetailRow.styles';

interface EventDetailRowProps {
  icon: string;
  text: string;
  size?: 'small' | 'medium' | 'large';
}

export default function EventDetailRow({ icon, text, size = 'medium' }: EventDetailRowProps) {
  return (
    <View style={[styles.container, styles[size]]}>
      <Text style={[styles.icon, styles[`${size}Icon`]]}>{icon}</Text>
      <Text style={[styles.text, styles[`${size}Text`]]}>{text}</Text>
    </View>
  );
}
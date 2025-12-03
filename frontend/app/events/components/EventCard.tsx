import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles/EventCard.styles';
import type { LocalEvent } from '../../../services/eventsService';

interface EventCardProps {
  event: LocalEvent;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const PLACEHOLDER_IMAGE =
  'https://www.bostonteapartyship.com/wp-content/uploads/2023/03/boston-fall.jpg';

export default function EventCard({
  event,
  onPress,
  size = 'medium',
}: EventCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, styles[size]]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ImageBackground
        source={{ uri: event.imageUrl || PLACEHOLDER_IMAGE }}
        style={[styles.imageBackground, styles[`${size}Height`]]}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(0,0,0,2)']}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
        >
          <View style={styles.textOverlay}>
            <Text style={[styles.title, styles[`${size}Title`]]}>
              {event.title}
            </Text>
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <MaterialIcons
                  name="event"
                  size={16}
                  color="rgba(255, 255, 255, 0.9)"
                />
                <Text style={[styles.dateTime, styles[`${size}Text`]]}>
                  {event.date} • {event.time}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

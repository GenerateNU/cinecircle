import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/LocationSection.styles';

interface LocationSectionProps {
  location: string;
  size?: 'small' | 'medium' | 'large';
}

export default function LocationSection({ location, size = 'medium' }: LocationSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles[`${size}Title`]]}>Location</Text>
      <Text style={[styles.address, styles[`${size}Address`]]}>{location}</Text>
      <View style={[styles.mapContainer, styles[size]]}>
        <View style={styles.mapPlaceholder}>
          <Text style={[styles.mapText, styles[`${size}MapText`]]}>Map View</Text>
        </View>
      </View>
    </View>
  );
}
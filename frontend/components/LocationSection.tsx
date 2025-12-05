import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/LocationSection.styles';
import MapView, { Marker } from 'react-native-maps';

interface LocationSectionProps {
  location: string;
  latitude: number;
  longitude: number;
  size?: 'small' | 'medium' | 'large';
  latitudeDelta?: number;
  longitudeDelta?: number;
}

export default function LocationSection({
  location,
  latitude,
  longitude,
  size = 'medium',
  latitudeDelta = 0.0922,
  longitudeDelta = 0.0421,
}: LocationSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles[`${size}Title`]]}>Location</Text>
      {/* <Text style={[styles.address, styles[`${size}Address`]]}>{location}</Text> */}
      <View style={[styles.mapContainer, styles[size]]}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
          }}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            title={location}
            description="Event Location"
          />
        </MapView>
      </View>
    </View>
  );
}

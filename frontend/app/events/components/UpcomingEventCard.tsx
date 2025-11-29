import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles/UpcomingEventCard.styles';
import type { LocalEvent } from '../../../services/eventsService';

interface UpcomingEventCardProps {
  event: LocalEvent;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function UpcomingEventCard({
  event,
  onPress,
  size = 'medium',
}: UpcomingEventCardProps) {
  // Extract month and day from the formatted date string (e.g., "Mon, Nov 15")
  const dateParts = event.date.split(' ');
  const monthAbbrev = dateParts[1] || 'TBD';
  const month = dateParts[1] || 'TBD';
  const day = dateParts[2] || '??';

  const PLACEHOLDER_IMAGE =
    'https://www.bostonteapartyship.com/wp-content/uploads/2023/03/boston-fall.jpg';

  // Convert month abbreviation to full month name
  const monthMap: { [key: string]: string } = {
    Jan: 'January',
    Feb: 'February',
    Mar: 'March',
    Apr: 'April',
    May: 'May',
    Jun: 'June',
    Jul: 'July',
    Aug: 'August',
    Sep: 'September',
    Oct: 'October',
    Nov: 'November',
    Dec: 'December',
  };

  // Extract state abbreviation from location
  const stateAbbreviations: { [key: string]: string } = {
    alabama: 'AL',
    alaska: 'AK',
    arizona: 'AZ',
    arkansas: 'AR',
    california: 'CA',
    colorado: 'CO',
    connecticut: 'CT',
    delaware: 'DE',
    florida: 'FL',
    georgia: 'GA',
    hawaii: 'HI',
    idaho: 'ID',
    illinois: 'IL',
    indiana: 'IN',
    iowa: 'IA',
    kansas: 'KS',
    kentucky: 'KY',
    louisiana: 'LA',
    maine: 'ME',
    maryland: 'MD',
    massachusetts: 'MA',
    michigan: 'MI',
    minnesota: 'MN',
    mississippi: 'MS',
    missouri: 'MO',
    montana: 'MT',
    nebraska: 'NE',
    nevada: 'NV',
    'new hampshire': 'NH',
    'new jersey': 'NJ',
    'new mexico': 'NM',
    'new york': 'NY',
    'north carolina': 'NC',
    'north dakota': 'ND',
    ohio: 'OH',
    oklahoma: 'OK',
    oregon: 'OR',
    pennsylvania: 'PA',
    'rhode island': 'RI',
    'south carolina': 'SC',
    'south dakota': 'SD',
    tennessee: 'TN',
    texas: 'TX',
    utah: 'UT',
    vermont: 'VT',
    virginia: 'VA',
    washington: 'WA',
    'west virginia': 'WV',
    wisconsin: 'WI',
    wyoming: 'WY',
  };

  const locationParts = event.location.split(', ');
  const stateName =
    locationParts[locationParts.length - 1]?.toLowerCase() || '';
  const state =
    stateAbbreviations[stateName] || stateName.toUpperCase().slice(0, 2);

  return (
    <TouchableOpacity
      style={[styles.cardContainer, styles[size]]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ImageBackground
        source={{ uri: PLACEHOLDER_IMAGE }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['#D1E9EB', 'rgba(255, 255, 255, 0.6)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.overlay}
        />
        <View style={styles.cardContent}>
          <View style={[styles.dateBox, styles[`${size}DateBox`]]}>
            <Text style={[styles.dateMonth, styles[`${size}Month`]]}>
              {monthMap[monthAbbrev]}
            </Text>
            <Text style={[styles.dateDay, styles[`${size}Day`]]}>{day}</Text>
          </View>
          <View style={styles.details}>
            <Text style={[styles.title, styles[`${size}Title`]]}>
              {event.title}
            </Text>
            <View style={styles.info}>
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" size={14} color="#666" />
                <Text style={[styles.text, styles[`${size}Text`]]}>
                  {event.location.split(', ')[0]}, {state}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="schedule" size={14} color="#666" />
                <Text style={[styles.text, styles[`${size}Text`]]}>
                  {event.time}
                </Text>
              </View>
            </View>
          </View>
          <Text style={[styles.arrow, styles[`${size}Arrow`]]}>›</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

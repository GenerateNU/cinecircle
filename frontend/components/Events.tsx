import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import RecommendedEventCard from './RecommendedEventCard';
import EventCard from './EventCard';
import UpcomingEventCard from './UpcomingEventCard';
import SectionHeader from './SectionHeader';
import { styles } from '../styles/Events.styles'
import EventTagList from './EventTags';
import EventDetails from './EventDetails';

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
}

const Events: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Sample data
  const trendingEvents: Event[] = [
    {
      id: '1',
      title: 'Event Title',
      location: 'Location',
      date: 'Date',
      time: 'Time',
    },
    {
      id: '2',
      title: 'Event Title',
      location: 'Location',
      date: 'Date',
      time: 'Time',
    },
    {
      id: '3',
      title: 'Event Title',
      location: 'Location',
      date: 'Date',
      time: 'Time',
    },
  ];

  const upcomingEvents: Event[] = [
    {
      id: '4',
      title: 'XYZ Meet and Greet',
      location: 'Boston, MA',
      date: 'Nov 14',
      time: '7:15 PM EST',
    },
    {
      id: '5',
      title: 'Another Event',
      location: 'Boston, MA',
      date: 'Nov 14',
      time: '8:00 PM EST',
    },
    {
      id: '6',
      title: 'Another Event',
      location: 'Boston, MA',
      date: 'Nov 14',
      time: '8:00 PM EST',
    },
  ];

  const categories: string[] = [
    'Label',
    'Label',
    'Label',
    'Label',
    'Label',
    'Label',
  ];

  const recommendedEvents: Event[] = [
    {
      id: '4',
      title: 'Generate Software',
      location: 'Sudbury, MA',
      date: 'Fri, Oct 15th',
      time: '10:00PM',
      attendees: '1000+ people are going',
    },
    {
      id: '5',
      title: 'Generate Software',
      location: 'Sudbury, MA',
      date: 'Fri, Oct 15th',
      time: '10:00PM',
      attendees: '1000+ people are going',
    },
    {
      id: '6',
      title: 'Tech Meetup',
      location: 'Cambridge, MA',
      date: 'Sat, Oct 16th',
      time: '2:00PM',
      attendees: '500+ people are going',
    },
  ];

  const handleSearch = () => {
    console.log('Search pressed');
  };

  const handleEventPress = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  if (selectedEventId) {
    return (
      <EventDetails 
        eventId={selectedEventId} 
        onBack={() => setSelectedEventId(null)}
      />
    );
  }

return (
  <View style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Events</Text>

      <SectionHeader 
        title="Trending in your area" 
        showSearchIcon 
        onSearchPress={handleSearch}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {trendingEvents.map((event) => (
          <View key={event.id} style={styles.eventCardWrapper}>
            <EventCard event={event} 
            onPress={() => handleEventPress(event.id)}/>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Your upcoming events</Text>
      <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalScroll}
      >
        {upcomingEvents.map((event) => (
        <UpcomingEventCard key={event.id} 
        event={event} />
      ))}
      </ScrollView>
      
      <Text style={styles.sectionTitle}>Find by categories</Text>
      <View style={styles.categoriesContainer}>
        <EventTagList tags={categories} />
      </View>

      <Text style={styles.sectionTitle}>Recommended for you</Text>
      {recommendedEvents.map((event) => (
        <RecommendedEventCard key={event.id} event={event} />
      ))}
    </ScrollView>
  </View>
);
};

export default Events;











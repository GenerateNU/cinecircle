import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import RecommendedEventCard from './RecommendedEventCard';
import EventCard from './EventCard';
import UpcomingEventCard from './UpcomingEventCard';
import SectionHeader from './SectionHeader';
import { styles } from '../styles/Events.styles'
import EventTagList from './EventTags';
import EventDetails from './EventDetails';
import SearchBar from './SearchBar';
import FilterModal, { FilterOption } from './FilterModal';

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  imageUrl?: string;
  attendees?: string;
}

interface FilterState {
  price: string[];
  distance: string[];
  dates: string[];
  eventType: string[];
}
  
interface EventCardProps {
  event: Event;
}

const Events: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    price: [],
    distance: [],
    dates: [],
    eventType: [],
  });

  const filterConfigs: Record<string, { title: string; options: FilterOption[] }> = {
    Price: {
      title: 'Price',
      options: [
        { id: 'free', label: 'Free', value: 0 },
        { id: '1-25', label: '$1 - $25', value: '1-25' },
        { id: '26-50', label: '$26 - $50', value: '26-50' },
        { id: '50+', label: '$50 +', value: '50+' },
      ],
    },
    'Near Me': {
      title: 'Near Me',
      options: [
        { id: '5', label: '5 Miles', value: 5 },
        { id: '10', label: '10 Miles', value: 10 },
        { id: '15', label: '15 Miles', value: 15 },
        { id: '20+', label: '20 Miles +', value: 20 },
      ],
    },
    Dates: {
      title: 'Dates',
      options: [
        { id: 'today', label: 'Today', value: 'today' },
        { id: 'week', label: 'This Week', value: 'week' },
        { id: 'month', label: 'This Month', value: 'month' },
        { id: 'later', label: 'Later', value: 'later' },
      ],
    },
    'Event Type': {
      title: 'Event Type',
      options: [
        { id: 'screening', label: 'Screening', value: 'screening' },
        { id: 'meetup', label: 'Meet & Greet', value: 'meetup' },
        { id: 'premiere', label: 'Premiere', value: 'premiere' },
        { id: 'festival', label: 'Festival', value: 'festival' },
      ],
    },
  };

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

  const categories: string[] = ['Price', 'Near Me', 'Dates', 'Event Type'];

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

  const handleCategoryPress = (category: string) => {
    setActiveModal(category);
  };

  const handleFilterApply = (category: string, selectedValues: string[]) => {
    const filterKey = category.toLowerCase().replace(' ', '') as keyof FilterState;
    setFilters((prev) => ({
      ...prev,
      [filterKey]: selectedValues,
    }));

    // TODO: Call backend API with filters
    console.log('Applied filters:', { ...filters, [filterKey]: selectedValues });
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
      <SearchBar/>

      <SectionHeader 
        title="Trending in your area" 
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
        <EventTagList tags={categories} onTagPress={handleCategoryPress}/>
      </View>

      <Text style={styles.sectionTitle}>Recommended for you</Text>
      {recommendedEvents.map((event) => (
        <RecommendedEventCard key={event.id} event={event} />
      ))}
    </ScrollView>

    {categories.map((category) => {
        const config = filterConfigs[category];
        const filterKey = category.toLowerCase().replace(' ', '') as keyof FilterState;

        return (
          <FilterModal
            key={category}
            visible={activeModal === category}
            onClose={() => setActiveModal(null)}
            title={config.title}
            options={config.options}
            selectedValues={filters[filterKey] || []}
            onApply={(values) => handleFilterApply(category, values)}
          />
        );
      })}
  </View>
);
};

export default Events;











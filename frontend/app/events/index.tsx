import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { getLocalEvents, type LocalEvent } from '../../services/eventsService';
import FilterModal, { FilterOption } from '../../components/FilterModal';
import EventCard from './components/EventCard';
import UpcomingEventCard from './components/UpcomingEventCard';
import RecommendedEventCard from './components/RecommendedEventCard';
import SearchBar from '../../components/SearchBar';

interface FilterState {
  price: string[];
  distance: string[];
  dates: string[];
  eventType: string[];
}

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    price: [],
    distance: [],
    dates: [],
    eventType: [],
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLocalEvents();
      setEvents(response.data ?? []);
    } catch (err) {
      console.error('Failed to load events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/events/eventDetail?eventId=${eventId}`);
  };

  const handleCategoryPress = (category: string) => {
    setActiveModal(category);
  };

  const handleFilterApply = (category: string, selectedValues: string[]) => {
    const filterKey = category
      .toLowerCase()
      .replace(' ', '') as keyof FilterState;
    setFilters(prev => ({
      ...prev,
      [filterKey]: selectedValues,
    }));
    console.log('Applied filters:', {
      ...filters,
      [filterKey]: selectedValues,
    });
    // TODO: Call backend API with filters
    loadEvents();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadEvents} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Split events into sections
  const upcomingEvents = events.slice(0, 5);
  const trendingEvents = events.slice(0, 3);
  const recommendedEvents = events.slice(0, 4);

  // Filter categories for modal buttons
  const filterCategories = ['Price', 'Near Me', 'Dates', 'Event Type'];

  // Extract unique genres for browse categories
  const genreCategories = Array.from(
    new Set(events.map(e => e.genre).filter(Boolean))
  );

  // Filter configurations
  const filterConfigs: Record<
    string,
    { title: string; options: FilterOption[] }
  > = {
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

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
      <SearchBar
        placeholder="Search events..."
        onPress={() => router.push({
          pathname: '/search',
          params: { origin: 'events', defaultCategory: 'events' }
        })}
      />
        {/* Filter Buttons Row */}
        <View style={styles.filterButtonsRow}>
          {filterCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.filterButton}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.filterButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending Section */}
        <View style={styles.sectionWrapper}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending in your area</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {trendingEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.sectionWrapper}>
          <View style={styles.section}>
            <Text style={styles.sectionTitleSmall}>Your upcoming events</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {upcomingEvents.map(event => (
              <UpcomingEventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View style={styles.sectionWrapper}>
          <View style={styles.section}>
            <Text style={styles.sectionTitleSmall}>Recommended for you</Text>
            <View style={styles.verticalList}>
              {recommendedEvents.map(event => (
                <RecommendedEventCard
                  key={event.id}
                  event={event}
                  onPress={() => handleEventPress(event.id)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Filter Modals */}
      {filterCategories.map(category => {
        const config = filterConfigs[category];
        const filterKey = category
          .toLowerCase()
          .replace(' ', '') as keyof FilterState;

        return (
          <FilterModal
            key={category}
            visible={activeModal === category}
            onClose={() => setActiveModal(null)}
            title={config.title}
            options={config.options}
            selectedValues={filters[filterKey] || []}
            onApply={values => handleFilterApply(category, values)}
          />
        );
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Section wrapper - handles ONLY vertical spacing between sections
  sectionWrapper: {
    marginBottom: 24,
  },

  // Section content - handles ONLY horizontal padding
  section: {
    paddingHorizontal: 20,
  },

  // Section title
  sectionTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 12,
  },
  sectionTitleSmall: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 8,
  },

  // List styles
  verticalList: {
    gap: 12,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
  },
  searchIcon: {
    fontSize: 24,
  },

  // Filter button styles
  filterButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d32f2f',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  filterButtonText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '500',
  },

  // Horizontal scroll styles
  horizontalScroll: {
    paddingLeft: 20,
  },
  horizontalScrollContent: {
    paddingRight: 20,
    gap: 12,
  },

  // Category pills
  categoriesScroll: {
    paddingLeft: 20,
    marginBottom: 10,
  },
  categoriesContent: {
    paddingRight: 20,
    gap: 10,
  },
  categoryPill: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  // Loading and error states
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#333',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
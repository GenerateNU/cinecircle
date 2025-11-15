import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { getLocalEvents, type LocalEvent } from '../services/eventsService';

interface EventCardProps {
  event: LocalEvent;
  onPress?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const formatCost = () => {
    if (event.cost === null) return null;
    return event.cost === 0 ? 'Free' : `$${event.cost.toFixed(2)}`;
  };

  const costDisplay = formatCost();

  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress}>
      <View style={styles.eventImage} />
      <Text style={styles.eventTitle}>{event.title}</Text>
      <View style={styles.eventDetails}>
        <Text style={styles.eventLocation}>📍 {event.location}</Text>
        <Text style={styles.eventDateTime}>
          📅 {event.date} • {event.time}
        </Text>
        {costDisplay && <Text style={styles.costText}>{costDisplay}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const UpcomingEventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  // Extract month and day from the formatted date string (e.g., "Mon, Nov 15")
  const dateParts = event.date.split(' ');
  const month = dateParts[1]?.replace(',', '') || 'TBD';
  const day = dateParts[2] || '??';

  const formatCost = () => {
    if (event.cost === null || event.cost === undefined) return null;
    return event.cost === 0 ? 'Free' : `$${event.cost.toFixed(2)}`;
  };

  const costDisplay = formatCost();

  return (
    <TouchableOpacity style={styles.upcomingCard} onPress={onPress}>
      <View style={styles.dateBox}>
        <Text style={styles.dateMonth}>{month}</Text>
        <Text style={styles.dateDay}>{day}</Text>
      </View>
      <View style={styles.upcomingDetails}>
        <Text style={styles.upcomingTitle}>{event.title}</Text>
        <View style={styles.upcomingInfo}>
          <Text style={styles.upcomingText}>📍 {event.location}</Text>
          <Text style={styles.upcomingText}>🕐 {event.time}</Text>
        </View>
        {costDisplay && <Text style={styles.costText}>{costDisplay}</Text>}
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    router.push(`/eventDetail?eventId=${eventId}`);
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
  const categories = Array.from(
    new Set(events.map(e => e.genre).filter(Boolean))
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }} // keeps content above the fixed nav
      >
        {/* Header */}
        <Text style={styles.header}>Events</Text>

        {/* Trending Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending in your area</Text>
          <TouchableOpacity>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
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

        {/* Upcoming Events Section */}
        <Text style={styles.sectionTitleStandalone}>Your upcoming events</Text>
        {upcomingEvents.map(event => (
          <UpcomingEventCard
            key={event.id}
            event={event}
            onPress={() => handleEventPress(event.id)}
          />
        ))}

        {/* Categories Section */}
        <Text style={styles.sectionTitleStandalone}>Find by categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryPill}>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended Section */}
        <Text style={styles.sectionTitleStandalone}>Recommended for you</Text>
        {recommendedEvents.map(event => (
          <TouchableOpacity
            key={event.id}
            style={styles.recommendedCard}
            onPress={() => handleEventPress(event.id)}
          >
            <View style={styles.recommendedImage} />
            <View style={styles.recommendedDetails}>
              <Text style={styles.recommendedTitle}>{event.title}</Text>
              <Text style={styles.recommendedDate}>
                {event.date} • {event.time}
              </Text>
              <Text style={styles.recommendedLocation}>{event.location}</Text>
              {event.occasion && (
                <Text style={styles.recommendedAttendees}>
                  {event.occasion} event
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
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
  retryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 20, fontWeight: '600' },
  sectionTitleStandalone: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  searchIcon: { fontSize: 24 },
  horizontalScroll: { paddingLeft: 20, marginBottom: 10 },
  eventCard: {
    width: 280,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
  },
  eventImage: { width: '100%', height: 180, backgroundColor: '#e0e0e0' },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 15,
    paddingBottom: 5,
  },
  eventDetails: { paddingHorizontal: 15, paddingBottom: 15 },
  eventLocation: { fontSize: 14, color: '#666', marginBottom: 5 },
  eventDateTime: { fontSize: 14, color: '#666' },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  dateBox: {
    width: 60,
    height: 60,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  dateMonth: { fontSize: 10, color: '#fff', textTransform: 'uppercase' },
  dateDay: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  upcomingDetails: { flex: 1 },
  upcomingTitle: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  upcomingInfo: { flexDirection: 'row', gap: 15 },
  upcomingText: { fontSize: 12, color: '#666' },
  costText: { fontSize: 12, color: '#28a745', marginTop: 3, fontWeight: '600' },
  arrow: { fontSize: 24, color: '#666' },
  categoriesScroll: { paddingLeft: 20, marginBottom: 10 },
  categoriesContent: { paddingRight: 20 },
  categoryPill: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  categoryText: { fontSize: 14, color: '#333', fontWeight: '500' },
  recommendedCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  recommendedImage: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginRight: 15,
  },
  recommendedDetails: { flex: 1, justifyContent: 'center' },
  recommendedTitle: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  recommendedDate: { fontSize: 12, color: '#666', marginBottom: 3 },
  recommendedLocation: { fontSize: 12, color: '#666', marginBottom: 3 },
  recommendedAttendees: { fontSize: 12, color: '#666', marginTop: 5 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getLocalEvent, LocalEvent } from '../services/eventsService';

export default function EventDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params as { eventId: string };

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<LocalEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await getLocalEvent(eventId);
      setEvent(eventData.data ?? null);
    } catch (err) {
      console.error('Failed to load event:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Loading event...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error || 'Event not found'}</Text>
        <TouchableOpacity onPress={loadEventDetails} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const descriptionText = event.description || 'No description available.';
  const truncatedDescription = showFullDescription
    ? descriptionText
    : descriptionText.length > 150
      ? `${descriptionText.substring(0, 150)}...`
      : descriptionText;

  // Mock attendees data (in production, this would come from the API)
  const mockAttendees = [
    { id: '1', name: 'User 1', avatar: null },
    { id: '2', name: 'User 2', avatar: null },
    { id: '3', name: 'User 3', avatar: null },
    { id: '4', name: 'User 4', avatar: null },
    { id: '5', name: 'User 5', avatar: null },
  ];
  const additionalAttendees = 7;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <View style={styles.heroImage} />

          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.iconText}>↗</Text> {/* Share button */}
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.iconText}>🔖</Text> {/* Bookmark button */}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={styles.title}>{event.title}</Text>

          {/* Info Items */}
          <View style={styles.infoSection}>
            {/* Location */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.infoIcon}>📍</Text>
              </View>
              <Text style={styles.infoText}>{event.location}</Text>
            </View>

            {/* Date & Time */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.infoIcon}>📅</Text>
              </View>
              <Text style={styles.infoText}>
                {event.date} at {event.time}
              </Text>
            </View>

            {/* Price */}
            {event.cost !== null && (
              <View style={styles.infoRow}>
                <View style={styles.iconCircle}>
                  <Text style={styles.infoIcon}>💲</Text>
                </View>
                <Text style={styles.infoText}>
                  {event.cost === 0
                    ? 'Free event'
                    : `$${event.cost.toFixed(2)} per person`}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{truncatedDescription}</Text>
            {descriptionText.length > 150 && (
              <TouchableOpacity
                onPress={() => setShowFullDescription(!showFullDescription)}
              >
                <Text style={styles.readMoreText}>
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Additional Info */}
          {event.languages && event.languages.length > 0 && (
            <View style={styles.metadataSection}>
              <Text style={styles.metadataLabel}>Languages:</Text>
              <Text style={styles.metadataValue}>
                {event.languages.join(', ')}
              </Text>
            </View>
          )}

          {event.genre && (
            <View style={styles.metadataSection}>
              <Text style={styles.metadataLabel}>Genre:</Text>
              <Text style={styles.metadataValue}>{event.genre}</Text>
            </View>
          )}

          {event.occasion && (
            <View style={styles.metadataSection}>
              <Text style={styles.metadataLabel}>Occasion:</Text>
              <Text style={styles.metadataValue}>{event.occasion}</Text>
            </View>
          )}

          {/* Who's Going */}
          <View style={styles.attendeesSection}>
            <Text style={styles.sectionTitle}>Who's Going?</Text>
            <View style={styles.attendeesRow}>
              {mockAttendees.map((attendee, index) => (
                <View
                  key={attendee.id}
                  style={[
                    styles.avatarCircle,
                    { marginLeft: index > 0 ? -12 : 0 },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {attendee.name.charAt(0)}
                  </Text>
                </View>
              ))}
              {additionalAttendees > 0 && (
                <View
                  style={[
                    styles.avatarCircle,
                    styles.moreAvatar,
                    { marginLeft: -12 },
                  ]}
                >
                  <Text style={styles.avatarText}>+{additionalAttendees}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContent}
            >
              {event.cost !== null && event.cost > 0 && (
                <View style={styles.filterPill}>
                  <Text style={styles.filterText}>
                    ${Math.floor(event.cost)}-$
                    {Math.ceil(event.cost + 20)}
                  </Text>
                </View>
              )}
              <View style={styles.filterPill}>
                <Text style={styles.filterText}>10 Miles</Text>
              </View>
              <View style={styles.filterPill}>
                <Text style={styles.filterText}>Later</Text>
              </View>
              <View style={styles.filterPill}>
                <Text style={styles.filterText}>Other</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  heroImageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  rightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
  },
  readMoreText: {
    fontSize: 15,
    color: '#d32f2f',
    fontWeight: '600',
    marginTop: 8,
  },
  metadataSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metadataLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  metadataValue: {
    fontSize: 15,
    color: '#666',
  },
  attendeesSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a5568',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  moreAvatar: {
    backgroundColor: '#d32f2f',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filterSection: {
    marginTop: 12,
    marginBottom: 20,
  },
  filterContent: {
    gap: 10,
  },
  filterPill: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

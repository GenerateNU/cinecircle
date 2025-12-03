import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import RsvpNotification from '../../components/RsvpNotification';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CircleDollarSign, MapPin, Calendar } from 'lucide-react-native';
import Entypo from '@expo/vector-icons/Entypo';
import Rsvp from '../../components/Rsvp';
import { router, useLocalSearchParams } from 'expo-router';
import { getLocalEvent, type LocalEvent } from '../../services/eventsService';
import { createOrUpdateRsvp, getUserRsvp } from '../../services/rsvpService';
import LocationSection from '../../components/LocationSection';

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<LocalEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [userRsvp, setUserRsvp] = useState<'yes' | 'maybe' | 'no' | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEventDetails();
      loadUserRsvp();
    }
  }, [eventId]);

  const loadEventDetails = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getLocalEvent(eventId);
      setEvent(response.data ?? null);
    } catch (err) {
      console.error('Failed to load event:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserRsvp = async () => {
    if (!eventId) return;

    try {
      const response = await getUserRsvp(eventId);
      if (response.data) {
        setUserRsvp(response.data.status as 'yes' | 'maybe' | 'no');
      }
    } catch (err) {
      // No RSVP found, that's okay
      console.log('No existing RSVP found');
    }
  };

  const handleRSVP = () => {
    setShowRsvpModal(true); // just showing modal for now
  };

  const handleRsvpComplete = async (
    response: 'yes' | 'maybe' | 'no' | null
  ) => {
    if (!eventId || !response) return;

    try {
      await createOrUpdateRsvp(eventId, response);
      setUserRsvp(response);
      setShowRsvpModal(false);
      setShowNotification(true);
      // Reload event to get updated attendee list
      loadEventDetails();
    } catch (err) {
      console.error('Failed to save RSVP:', err);
      alert('Failed to save RSVP. Please try again.');
    }
  };

  const handleEditRsvp = () => {
    setShowNotification(false);
    setShowRsvpModal(true);
  };

  const handleDismissNotification = () => {
    setShowNotification(false);
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

  const formatDescription = () => {
    const text = event.description || 'No description available.';
    if (showFullDescription || text.length <= 150) return text;
    return `${text.substring(0, 150)}...`;
  };

  const shouldShowReadMore = (event.description?.length || 0) > 150;

  // Get attendees from event data
  const attendees = event.attendees || [];
  const displayAttendees = attendees.slice(0, 5);
  const additionalAttendees = Math.max(0, attendees.length - 5);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          {event.imageUrl ? (
            <Image
              source={{ uri: event.imageUrl }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.heroImage} />
          )}
        </View>

        {/* Event Details */}
        <View style={styles.contentContainer}>
          {/* Title and Action Buttons */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="ios-share" size={20} color="#A82411" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons
                  name="bookmark-border"
                  size={20}
                  color="#A82411"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Items */}
          <View style={styles.infoSection}>
            {/* Location */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Entypo name="location" size={24} color="#A82411" />
              </View>
              <Text style={styles.infoText}>{event.location}</Text>
            </View>

            {/* Date & Time */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="calendar-range-outline"
                  size={19}
                  color="#A82411"
                />
              </View>
              <Text style={styles.infoText}>
                {event.date} at {event.time}
              </Text>
            </View>

            {/* Price */}
            {event.cost !== null && (
              <View style={styles.infoRow}>
                <View style={styles.iconCircle}>
                  <CircleDollarSign size={20} color="#A82411" />
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
            <Text style={styles.descriptionText}>{formatDescription()}</Text>
            {shouldShowReadMore && (
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

          {/* Attendees */}
          {attendees.length > 0 && (
            <View style={styles.attendeesSection}>
              <Text style={styles.smallText}>Who's Going?</Text>
              <View style={styles.attendeesRow}>
                {displayAttendees.map((attendee, index) => (
                  <View
                    key={attendee.userId}
                    style={[
                      styles.avatarCircle,
                      index > 0 && { marginLeft: -12 },
                    ]}
                  >
                    {attendee.profilePicture ? (
                      <Image
                        source={{ uri: attendee.profilePicture }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <Text style={styles.avatarText}>
                        {attendee.username?.[0]?.toUpperCase() || '?'}
                      </Text>
                    )}
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
                    <Text style={styles.avatarText}>
                      +{additionalAttendees}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

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

          {/* Location with Map */}
          <LocationSection
            location={event.location}
            latitude={event.lat ?? 42.3601}
            longitude={event.lon ?? -71.0589}
            size="large"
          />
        </View>
      </ScrollView>

      {/* Floating RSVP Button - Only show if no notification */}
      {!showNotification && (
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={styles.rsvpButton}
            onPress={handleRSVP}
            activeOpacity={0.8}
          >
            <Text style={styles.rsvpButtonText}>
              {userRsvp ? `RSVP: ${userRsvp.toUpperCase()}` : 'RSVP'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* RSVP Modal */}
      <Modal
        visible={showRsvpModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRsvpModal(false)}
      >
        <Rsvp eventId={eventId} onContinue={handleRsvpComplete} />
      </Modal>

      {/* RSVP Success Notification */}
      <RsvpNotification
        visible={showNotification}
        response={userRsvp}
        onEdit={handleEditRsvp}
        onDismiss={handleDismissNotification}
      />
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
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#fff',
    position: 'relative',
    marginTop: 20,
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
    marginRight: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: 'black',
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
    color: 'black',
  },
  readMoreText: {
    fontSize: 15,
    color: '#d32f2f',
    fontWeight: '600',
    marginTop: 8,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  rsvpButton: {
    backgroundColor: '#A82411',
    borderRadius: 12,
    paddingVertical: 16,
    elevation: 8,
    shadowOpacity: 0.4,
    shadowColor: '#A82411',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rsvpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
  scrollContent: {
    paddingBottom: 60, // to stop hiding behind button ?
  },
  smallText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#515151',
  },
});

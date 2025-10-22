import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

interface EventDetailsProps {
  eventId?: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventId }) => {
  // sample data
  const event = {
    id: eventId || '1',
    title: 'GenerRave',
    location: 'da Sherm',
    date: 'Fri, Oct 10, 2025',
    time: '10:00 PM - 12:00 AM',
    price: '$1234590 per person',
    imageUrl: '',
    description: 'Lorem impsum yada yada etc etc... this is a description about this supa expensive Generave in da Sherm woop woop.',
  };

  const handleBack = () => {
    console.log('Navigate back');
  };

  const handleShare = () => {
    console.log('Share event');
  };

  const handleBookmark = () => {
    console.log('Bookmark event');
  };

  const handleReadMore = () => {
    console.log('Read more');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* event pic placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.eventImage} />
        </View>

        {/* info card for event */}
        <View style={styles.contentContainer}>
          {/* title */}
          <View style={styles.titleSection}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                <Text style={styles.actionIcon}>⤴</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleBookmark} style={styles.iconButton}>
                <Text style={styles.actionIcon}>🔖</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* event deets */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText}>{event.location}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailText}>{event.date} at {event.time}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>💵</Text>
              <Text style={styles.detailText}>{event.price}</Text>
            </View>
          </View>

          {/* description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
            
            <TouchableOpacity style={styles.readMoreButton} onPress={handleReadMore}>
              <Text style={styles.readMoreText}>Read More</Text>
            </TouchableOpacity>
          </View>

          {/* tags */}
          <View style={styles.tagsSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsContainer}
            >
              {['TAG', 'TAG', 'TAG', 'TAG', 'TAG'].map((tag, index) => (
                <View key={index} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          {/* attendees profile pics */}
          <View style={styles.attendeesSection}>
            <View style={styles.attendeesRow}>
              {[1, 2, 3, 4, 5].map((attendee) => (
                <View key={attendee} style={styles.attendeeAvatar}>
                  <View style={styles.avatarPlaceholder} />
                </View>
              ))}
              <View style={styles.moreAttendees}>
                <Text style={styles.moreAttendeesText}>+7</Text>
              </View>
            </View>
          </View>
          {/* location sec */}
          <View style={styles.locationSection}>
            <Text style={styles.locationTitle}>Location</Text>
            <Text style={styles.locationAddress}>{event.location}</Text>
            
            {/* placeholder for location map */}
            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>Map View</Text>
              </View>
            </View>
          </View>
          {/* comments */}
          <View style={styles.commentsSection}>
            <View style={styles.commentInputContainer}>
              <View style={styles.commentAvatar} />
              <Text style={styles.commentInputPlaceholder}>
                Comment on Generate Softwarave 0th...
              </Text>
            </View>
            {/* comment thread */}
            <View style={styles.commentThread}>
              {/* parent comment */}
              <View style={styles.commentItem}>
                <View style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <View style={styles.commentPlaceholder} />
                </View>
              </View>

              {/* first nested reply */}
              <View style={[styles.commentItem, styles.nestedComment]}>
                <View style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <View style={styles.commentPlaceholder} />
                </View>
              </View>

              {/* second nested reply e.g. */}
              <View style={[styles.commentItem, styles.nestedCommentLevel2]}>
                <View style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <View style={styles.commentPlaceholder} />
                </View>
              </View>

              {/* parent comment e.g. */}
              <View style={styles.commentItem}>
                <View style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <View style={styles.commentPlaceholder} />
                </View>
              </View>
              {/* comments */}
              <View style={styles.commentItem}>
                <View style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <View style={styles.commentPlaceholder} />
                </View>
              </View>

              <View style={styles.commentItem}>
                <View style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <View style={styles.commentPlaceholder} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 32,
    fontWeight: '300',
    color: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  contentContainer: {
    padding: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  detailsSection: {
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  detailText: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  readMoreButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // tags section
  tagsSection: {
    marginBottom: 25,
  },
  tagsContainer: {
    paddingRight: 20,
  },
  tagPill: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  // attendees section
  attendeesSection: {
    marginBottom: 25,
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: -10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: '#c0c0c0',
  },
  moreAttendees: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  moreAttendeesText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  // Location Section
  locationSection: {
    marginBottom: 25,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 16,
    color: '#999',
  },
  // comments section
  commentsSection: {
    marginBottom: 30,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d0d0d0',
    marginRight: 12,
  },
  commentInputPlaceholder: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  commentThread: {
    marginTop: 10,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  nestedComment: {
    marginLeft: 30,
  },
  nestedCommentLevel2: {
    marginLeft: 60,
  },
  commentContent: {
    flex: 1,
  },
  commentPlaceholder: {
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});

export default EventDetails;
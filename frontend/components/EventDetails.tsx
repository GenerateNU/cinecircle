import React from 'react';
import EventImage from './EventImage';
import EventDetailRow from './EventDetailRow';
import EventTagList from './EventTags';
import AttendeeList from './AttendeeList';
import LocationSection from './LocationSection';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import { styles } from '../styles/EventDetails.styles'
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

interface EventDetailsProps {
  eventId?: string;
  onBack: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onBack }) => {
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

  const tags = ['tag', 'tag', 'tag', 'tag', 'tag'];
  
  // comment examples for nesting -- (need to check data structure in backend)
  const comments = [
    { id: 1, nestLevel: 0 },
    { id: 2, nestLevel: 1 },
    { id: 3, nestLevel: 2 },
    { id: 4, nestLevel: 0 },
    { id: 5, nestLevel: 0 },
    { id: 6, nestLevel: 0 },
  ];

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
        {/* event pic placeholder - reusable component*/} 
        <EventImage imageUrl={event.imageUrl} size="large" />

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
            <EventDetailRow icon="📍" text={event.location} />
            <EventDetailRow icon="📅" text={`${event.date} at ${event.time}`} />
            <EventDetailRow icon="💵" text={event.price} />
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
            <EventTagList tags={tags} />
          </View>
          {/* attendees profile pics */}
          <View style={styles.attendeesSection}>
            <AttendeeList attendeeCount={5} additionalCount={7} />
          </View>

          {/* location sec */}
          <LocationSection location={event.location} />
          
          {/* comments */}
          <View style={styles.commentsSection}>
            <CommentInput 
              placeholder="Comment on Generate Softwarave 0th..." 
            />
            
            <View style={styles.commentThread}>
              {comments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  nestLevel={comment.nestLevel}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventDetails;
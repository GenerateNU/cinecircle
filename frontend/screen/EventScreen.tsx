// app/events.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';

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

const EventCard: React.FC<EventCardProps> = ({ event }) => (
  <View style={styles.eventCard}>
    <View style={styles.eventImage} />
    <Text style={styles.eventTitle}>{event.title}</Text>
    <View style={styles.eventDetails}>
      <Text style={styles.eventLocation}>📍 {event.location}</Text>
      <Text style={styles.eventDateTime}>📅 {event.date} • {event.time}</Text>
    </View>
  </View>
);

const UpcomingEventCard: React.FC<EventCardProps> = ({ event }) => (
  <TouchableOpacity style={styles.upcomingCard}>
    <View style={styles.dateBox}>
      <Text style={styles.dateMonth}>November</Text>
      <Text style={styles.dateDay}>14</Text>
    </View>
    <View style={styles.upcomingDetails}>
      <Text style={styles.upcomingTitle}>{event.title}</Text>
      <View style={styles.upcomingInfo}>
        <Text style={styles.upcomingText}>📍 {event.location}</Text>
        <Text style={styles.upcomingText}>🕐 {event.time}</Text>
      </View>
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

export default function Events() {
  // Sample data
  const trendingEvents: Event[] = [
    { id: '1', title: 'Event Title', location: 'Location', date: 'Date', time: 'Time' },
    { id: '2', title: 'Event Title', location: 'Location', date: 'Date', time: 'Time' },
  ];

  const upcomingEvents: Event[] = [
    { id: '3', title: 'XYZ Meet and Greet', location: 'Boston, MA', date: 'Nov 14', time: '7:15 PM EST' },
    { id: '4', title: 'Another Event', location: 'Boston, MA', date: 'Nov 14', time: '8:00 PM EST' },
  ];

  const categories: string[] = ['Label','Label','Label','Label','Label','Label'];

  const recommendedEvents: Event[] = [
    { id: '4', title: 'Generate Software', location: 'Sudbury, MA', date: 'Fri, Oct 15th', time: '10:00PM', attendees: '1000+ people are going' },
    { id: '5', title: 'Generate Software', location: 'Sudbury, MA', date: 'Fri, Oct 15th', time: '10:00PM', attendees: '1000+ people are going' },
    { id: '6', title: 'Tech Meetup', location: 'Cambridge, MA', date: 'Sat, Oct 16th', time: '2:00PM', attendees: '500+ people are going' },
  ];

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
          <TouchableOpacity><Text style={styles.searchIcon}>🔍</Text></TouchableOpacity>
        </View>

        {/* Horizontal Scrollable Trending Events */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {trendingEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </ScrollView>

        {/* Upcoming Events Section */}
        <Text style={styles.sectionTitleStandalone}>Your upcoming events</Text>
        {upcomingEvents.map((event) => <UpcomingEventCard key={event.id} event={event} />)}

        {/* Find by Categories Section */}
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

        {/* Recommended for You Section */}
        <Text style={styles.sectionTitleStandalone}>Recommended for you</Text>
        {recommendedEvents.map((event) => (
          <View key={event.id} style={styles.recommendedCard}>
            <View style={styles.recommendedImage} />
            <View style={styles.recommendedDetails}>
              <Text style={styles.recommendedTitle}>{event.title}</Text>
              <Text style={styles.recommendedDate}>{event.date} • {event.time}</Text>
              <Text style={styles.recommendedLocation}>{event.location}</Text>
              <Text style={styles.recommendedAttendees}>{event.attendees}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Fixed Bottom Nav */}
      <View style={styles.bottomBar}>
        <BottomNavBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header:{ fontSize:36, fontWeight:'bold', paddingHorizontal:20, marginTop:60, marginBottom:20 },
  sectionHeader:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, marginBottom:15 },
  sectionTitle:{ fontSize:20, fontWeight:'600' },
  sectionTitleStandalone:{ fontSize:20, fontWeight:'600', paddingHorizontal:20, marginTop:20, marginBottom:15 },
  searchIcon:{ fontSize:24 },
  horizontalScroll:{ paddingLeft:20, marginBottom:10 },
  eventCard:{ width:280, backgroundColor:'#f5f5f5', borderRadius:20, marginRight:15, overflow:'hidden' },
  eventImage:{ width:'100%', height:180, backgroundColor:'#e0e0e0' },
  eventTitle:{ fontSize:18, fontWeight:'600', padding:15, paddingBottom:5 },
  eventDetails:{ paddingHorizontal:15, paddingBottom:15 },
  eventLocation:{ fontSize:14, color:'#666', marginBottom:5 },
  eventDateTime:{ fontSize:14, color:'#666' },
  upcomingCard:{ flexDirection:'row', alignItems:'center', backgroundColor:'#f5f5f5', borderRadius:15, padding:15, marginHorizontal:20, marginBottom:15 },
  dateBox:{ width:60, height:60, backgroundColor:'#333', borderRadius:10, justifyContent:'center', alignItems:'center', marginRight:15 },
  dateMonth:{ fontSize:10, color:'#fff', textTransform:'uppercase' },
  dateDay:{ fontSize:24, fontWeight:'bold', color:'#fff' },
  upcomingDetails:{ flex:1 },
  upcomingTitle:{ fontSize:16, fontWeight:'600', marginBottom:5 },
  upcomingInfo:{ flexDirection:'row', gap:15 },
  upcomingText:{ fontSize:12, color:'#666' },
  arrow:{ fontSize:24, color:'#666' },
  categoriesScroll:{ paddingLeft:20, marginBottom:10 },
  categoriesContent:{ paddingRight:20 },
  categoryPill:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#ddd', borderRadius:20, paddingVertical:10, paddingHorizontal:20, marginRight:10 },
  categoryText:{ fontSize:14, color:'#333', fontWeight:'500' },
  recommendedCard:{ flexDirection:'row', backgroundColor:'#f5f5f5', borderRadius:15, padding:15, marginHorizontal:20, marginBottom:15 },
  recommendedImage:{ width:100, height:100, backgroundColor:'#e0e0e0', borderRadius:10, marginRight:15 },
  recommendedDetails:{ flex:1, justifyContent:'center' },
  recommendedTitle:{ fontSize:16, fontWeight:'600', marginBottom:5 },
  recommendedDate:{ fontSize:12, color:'#666', marginBottom:3 },
  recommendedLocation:{ fontSize:12, color:'#666', marginBottom:3 },
  recommendedAttendees:{ fontSize:12, color:'#666', marginTop:5 },
  bottomBar:{ position:'absolute', left:0, right:0, bottom:0 },
});

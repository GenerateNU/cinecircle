import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const EventsList = () => {
  const events = [
    { id: 'e1', title: 'Bollywood Night Screening', date: 'Sat, Nov 2', time: '7:00 PM', location: 'Cineplex Downtown' },
    { id: 'e2', title: 'SRK Fan Meetup', date: 'Sun, Nov 10', time: '3:00 PM', location: 'City Park Amphitheater' },
  ];
  return (
    <View style={tw`gap-3`}>
      {events.map((ev) => (
        <View key={ev.id} style={tw`rounded-[8px] border border-[#e5e5e5] bg-white p-3`}>
          <Text style={tw`text-[16px] font-bold`}>{ev.title}</Text>
          <Text style={tw`mt-1 text-[#333]`}><Ionicons name="calendar-outline" size={14} /> {ev.date} • {ev.time}</Text>
          <Text style={tw`mt-0.5 text-[#333]`}><Ionicons name="location-outline" size={14} /> {ev.location}</Text>
          <View style={tw`mt-2 flex-row gap-2`}>
            <TouchableOpacity style={tw`bg-black rounded-[6px] px-3 py-2`}>
              <Text style={tw`text-white font-semibold`}>Add to Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`rounded-[6px] border border-black bg-transparent px-3 py-2`}>
              <Text style={tw`text-black font-semibold`}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

export default EventsList;


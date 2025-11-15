import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import EventCard from '../../../components/EventCard';

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
};

const SAVED_EVENTS: Event[] = [
  {
    id: 'saved-1',
    title: 'Bollywood Night Screening',
    date: 'Sat, Nov 2',
    time: '7:00 PM',
    location: 'Cineplex Downtown',
  },
  {
    id: 'saved-2',
    title: 'Directors Roundtable',
    date: 'Thu, Nov 7',
    time: '6:30 PM',
    location: 'Studio 54 Theater',
  },
];

const ATTENDED_EVENTS: Event[] = [
  {
    id: 'att-1',
    title: 'SRK Fan Meetup',
    date: 'Sun, Oct 20',
    time: '3:00 PM',
    location: 'City Park Amphitheater',
  },
  {
    id: 'att-2',
    title: 'Classic Film Marathon',
    date: 'Fri, Sep 13',
    time: '8:00 PM',
    location: 'Cinecircle HQ',
  },
];

const EventsList = () => {
  const [activeSubTab, setActiveSubTab] = useState<'saved' | 'attended'>('saved');
  const events = activeSubTab === 'saved' ? SAVED_EVENTS : ATTENDED_EVENTS;

  return (
    <View>
      <View style={tw`flex-row justify-around border-b border-[#ddd] mb-2`}>
        <TouchableOpacity
          style={[
            tw`flex-1 items-center pb-2 border-b-2`,
            activeSubTab === 'saved' ? tw`border-black` : tw`border-transparent`,
          ]}
          onPress={() => setActiveSubTab('saved')}
        >
          <Text
            style={tw`text-sm font-semibold ${
              activeSubTab === 'saved' ? 'text-black' : 'text-gray-500'
            }`}
          >
            Saved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`flex-1 items-center pb-2 border-b-2`,
            activeSubTab === 'attended' ? tw`border-black` : tw`border-transparent`,
          ]}
          onPress={() => setActiveSubTab('attended')}
        >
          <Text
            style={tw`text-sm font-semibold ${
              activeSubTab === 'attended' ? 'text-black' : 'text-gray-500'
            }`}
          >
            Attended
          </Text>
        </TouchableOpacity>
      </View>

      <View style={tw`gap-3`}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} size="small" />
        ))}
      </View>
    </View>
  );
};

export default EventsList;

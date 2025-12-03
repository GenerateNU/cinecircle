import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import tw from 'twrnc';
import UpcomingEventCard from '../../events/components/UpcomingEventCard';
import type { LocalEvent } from '../../../services/eventsService';
import { getUserEvents } from '../../../services/eventsService';

type Props = {
  userId?: string | null;
};

const EventsList = ({ userId }: Props) => {
  const [activeSubTab, setActiveSubTab] = useState<'saved' | 'attended'>('saved');
  const [savedEvents, setSavedEvents] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const events = useMemo(
    () => (activeSubTab === 'saved' ? savedEvents : []),
    [activeSubTab, savedEvents]
  );

  const loadEvents = useCallback(async () => {
    if (!userId) {
      setSavedEvents([]);
      setError(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const fetched = await getUserEvents(userId);
      setSavedEvents(fetched);
    } catch (err: any) {
      console.error('Failed to load user events', err);
      setError(err?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return (
    <View>
      <View
        style={[
          tw`flex-row items-center mb-4`,
          {
            backgroundColor: '#FBEAE6',
            borderRadius: 12,
            padding: 4,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            tw`flex-1 items-center justify-center`,
            {
              paddingVertical: 8,
              borderRadius: 8,
              marginHorizontal: 2,
              backgroundColor: activeSubTab === 'saved' ? '#D62E05' : 'transparent',
            },
          ]}
          onPress={() => setActiveSubTab('saved')}
        >
          <Text
            style={[
              tw`text-sm font-semibold`,
              { color: activeSubTab === 'saved' ? '#FBEAE6' : '#D62E05' },
            ]}
          >
            Saved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`flex-1 items-center justify-center`,
            {
              paddingVertical: 8,
              borderRadius: 8,
              marginHorizontal: 2,
              backgroundColor: activeSubTab === 'attended' ? '#D62E05' : 'transparent',
            },
          ]}
          onPress={() => setActiveSubTab('attended')}
        >
          <Text
            style={[
              tw`text-sm font-semibold`,
              { color: activeSubTab === 'attended' ? '#FBEAE6' : '#D62E05' },
            ]}
          >
            Attended
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={tw`py-6 items-center`}>
          <ActivityIndicator size="small" color="#D62E05" />
          <Text style={tw`mt-2 text-gray-600`}>Loading events…</Text>
        </View>
      ) : error ? (
        <View style={tw`py-4`}>
          <Text style={tw`text-red-600 mb-2`}>{error}</Text>
          <TouchableOpacity
            onPress={loadEvents}
            style={tw`self-start px-3 py-2 rounded bg-black`}
            accessibilityRole="button"
            accessibilityLabel="Retry loading events"
          >
            <Text style={tw`text-white font-semibold`}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : events.length === 0 ? (
        <Text style={tw`text-gray-600 px-1 py-2`}>
          {activeSubTab === 'saved'
            ? 'No saved events yet.'
            : 'No attended events yet.'}
        </Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={tw`mb-3`}>
              <UpcomingEventCard event={item} size="small" />
            </View>
          )}
          ListFooterComponent={<View style={tw`h-2`} />}
        />
      )}
    </View>
  );
};

export default EventsList;

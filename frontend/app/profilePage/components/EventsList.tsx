import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import UpcomingEventCard from '../../events/components/UpcomingEventCard';
import type { LocalEvent } from '../../../services/eventsService';
import { getLocalEvent } from '../../../services/eventsService';

type Props = {
  userId?: string | null;
  eventsSaved?: string[] | null;
  eventsAttended?: string[] | null;
};

const EMPTY_IDS: string[] = [];

const EventsList = ({ userId, eventsSaved, eventsAttended }: Props) => {
  const router = useRouter();
  // Normalize to stable references to avoid re-running effects on every render
  const savedIds = useMemo(() => eventsSaved ?? EMPTY_IDS, [eventsSaved]);
  const attendedIds = useMemo(() => eventsAttended ?? EMPTY_IDS, [eventsAttended]);
  const [activeSubTab, setActiveSubTab] = useState<'saved' | 'attended'>(
    'saved'
  );
  const [savedEvents, setSavedEvents] = useState<LocalEvent[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const events = useMemo(
    () => (activeSubTab === 'saved' ? savedEvents : attendedEvents),
    [activeSubTab, savedEvents, attendedEvents]
  );

  const loadEvents = useCallback(async () => {
    // If no ids and no user, nothing to fetch
    if ((savedIds.length === 0 && attendedIds.length === 0) && !userId) {
      setSavedEvents([]);
      setAttendedEvents([]);
      setError(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // fetch saved (create arrays of promises)
      const fetchSaved: Promise<LocalEvent>[] = savedIds.length
        ? savedIds.map(id => getLocalEvent(id).then(r => r.data as LocalEvent))
        : [];
      const fetchAttended: Promise<LocalEvent>[] = attendedIds.length
        ? attendedIds.map(id => getLocalEvent(id).then(r => r.data as LocalEvent))
        : [];

      const [saved, attended] = await Promise.all([
        Promise.all(fetchSaved),
        Promise.all(fetchAttended),
      ]);
      setSavedEvents(saved.filter((e): e is LocalEvent => Boolean(e)));
      setAttendedEvents(attended.filter((e): e is LocalEvent => Boolean(e)));
    } catch (err: any) {
      console.error('Failed to load user events', err);
      setError(err?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [userId, savedIds, attendedIds]);

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
              backgroundColor:
                activeSubTab === 'saved' ? '#D62E05' : 'transparent',
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
              backgroundColor:
                activeSubTab === 'attended' ? '#D62E05' : 'transparent',
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
      ) : events.length === 0 ? null : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={tw`mb-3`}>
              <UpcomingEventCard 
                event={item} 
                size="small" 
                onPress={() => router.push(`/events/eventDetail?eventId=${item.id}`)}
              />
            </View>
          )}
          ListFooterComponent={<View style={tw`h-2`} />}
        />
      )}
    </View>
  );
};

export default EventsList;

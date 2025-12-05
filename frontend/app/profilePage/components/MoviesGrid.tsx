import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { getUserRatings } from '../../../services/userService';
import { getMovieByCinecircleId } from '../../../services/moviesService';

type MovieListItem = {
  id: string;
  title: string;
  poster?: string | null;
};

type Props = {
  userId?: string | null;
  moviesToWatch?: string[] | null;
  moviesCompleted?: string[] | null;
};

const MoviesGrid = ({ userId, moviesToWatch, moviesCompleted }: Props) => {
  const [activeSubTab, setActiveSubTab] = useState<'toWatch' | 'completed'>('completed');
  const [moviesByStatus, setMoviesByStatus] = useState<Record<'toWatch' | 'completed', MovieListItem[]>>({
    toWatch: [],
    completed: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const movies = moviesByStatus[activeSubTab];
  const showBookmark = activeSubTab === 'toWatch';
  const hydrateList = useCallback(async (ids: string[]): Promise<MovieListItem[]> => {
    const validIds = Array.isArray(ids) ? ids.filter(Boolean) : [];
    if (!validIds.length) return [];

    const results = await Promise.all(
      validIds.map(async (id) => {
        try {
          const envelope = await getMovieByCinecircleId(id);
          const movie = (envelope as any)?.data ?? (envelope as any)?.movie ?? null;
          return {
            id,
            title: movie?.title || `Movie ${id}`,
            poster: movie?.imageUrl ?? null,
          } as MovieListItem;
        } catch (err) {
          console.error('Failed to fetch movie detail:', err);
          return {
            id,
            title: `Movie ${id}`,
            poster: null,
          } as MovieListItem;
        }
      })
    );

    return results.filter(
      (movie, index, self) => self.findIndex((m) => m.id === movie.id) === index
    );
  }, []);

  const hydrateFromProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [toWatchList, completedList] = await Promise.all([
        hydrateList(moviesToWatch ?? []),
        hydrateList(moviesCompleted ?? []),
      ]);

      setMoviesByStatus({
        toWatch: toWatchList,
        completed: completedList,
      });

      if (toWatchList.length > 0) {
        setActiveSubTab('toWatch');
      } else if (completedList.length > 0) {
        setActiveSubTab('completed');
      }
    } catch (err: any) {
      console.error('Failed to load movies for user:', err);
      setError(err?.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, [hydrateList, moviesCompleted, moviesToWatch]);

  useEffect(() => {
    hydrateFromProfile();
  }, [hydrateFromProfile]);

  const emptyMessage = useMemo(() => {
    if (activeSubTab === 'toWatch') return 'No watchlist movies yet.';
    return 'No completed movies yet.';
  }, [activeSubTab]);

  const renderMovie = ({ item }: { item: MovieListItem }) => (
    <View style={tw`flex-row items-center py-3 border-b border-gray-100`}>
      {item.poster ? (
        <Image
          source={{ uri: item.poster }}
          style={tw`w-[56px] h-[84px] rounded-md`}
          resizeMode="cover"
        />
      ) : (
        <View
          style={tw`w-[56px] h-[84px] rounded-md bg-gray-200 items-center justify-center`}
        >
          <Ionicons name="film-outline" size={22} color="#555" />
        </View>
      )}
      <Text style={tw`flex-1 ml-4 text-base font-semibold text-black`} numberOfLines={2}>
        {item.title}
      </Text>
      <Ionicons
        name={showBookmark ? 'bookmark-outline' : 'checkmark-circle-outline'}
        size={22}
        color="#111"
      />
    </View>
  );

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
              backgroundColor: activeSubTab === 'toWatch' ? '#D62E05' : 'transparent',
            },
          ]}
          onPress={() => setActiveSubTab('toWatch')}
        >
          <Text
            style={[
              tw`text-sm font-semibold`,
              { color: activeSubTab === 'toWatch' ? '#FBEAE6' : '#D62E05' },
            ]}
          >
            To Be Watched
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`flex-1 items-center justify-center`,
            {
              paddingVertical: 8,
              borderRadius: 8,
              marginHorizontal: 2,
              backgroundColor: activeSubTab === 'completed' ? '#D62E05' : 'transparent',
            },
          ]}
          onPress={() => setActiveSubTab('completed')}
        >
          <Text
            style={[
              tw`text-sm font-semibold`,
              { color: activeSubTab === 'completed' ? '#FBEAE6' : '#D62E05' },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={tw`py-6 items-center`}>
          <ActivityIndicator size="small" color="#D62E05" />
          <Text style={tw`mt-2 text-gray-600`}>Loading movies…</Text>
        </View>
      ) : error ? (
        <View style={tw`py-4`}>
          <Text style={tw`text-red-600 mb-2`}>{error}</Text>
          <TouchableOpacity
            onPress={fetchMoviesForUser}
            style={tw`self-start px-3 py-2 rounded bg-black`}
          >
            <Text style={tw`text-white font-semibold`}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : movies.length === 0 ? (
        <Text style={tw`text-gray-600 px-1 py-2`}>{emptyMessage}</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id}
          renderItem={renderMovie}
          scrollEnabled={false}
          removeClippedSubviews={false}
          initialNumToRender={movies.length || 10}
          maxToRenderPerBatch={movies.length || 10}
          windowSize={Math.max(5, movies.length || 5)}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={tw`h-0`} />}
          ListFooterComponent={<View style={tw`h-2`} />}
        />
      )}
    </View>
  );
};

export default MoviesGrid;

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
import { router } from 'expo-router';

import { getUserProfile } from '../../../services/userService';
import { getMovieByCinecircleId } from '../../../services/moviesService';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w185';

type MovieListItem = {
  id: string;
  title: string;
  poster?: string | null;
};

type Props = {
  userId?: string | null;
};

const MoviesGrid = (props: Props | undefined) => {
  // ✅ safely read userId even if props is undefined
  const userId = props?.userId ?? null;

  const [activeSubTab, setActiveSubTab] = useState<'toWatch' | 'completed'>(
    'toWatch'
  );
  const [moviesByStatus, setMoviesByStatus] = useState<
    Record<'toWatch' | 'completed', MovieListItem[]>
  >({
    toWatch: [],
    completed: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const movies = moviesByStatus[activeSubTab];

  const fetchMoviesForUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const profileRes = await getUserProfile();
      const profile = profileRes?.userProfile;
      if (!profile) {
        setMoviesByStatus({ toWatch: [], completed: [] });
        return;
      }

      const toWatchIds: string[] = profile.bookmarkedToWatch ?? [];
      const completedIds: string[] = profile.bookmarkedWatched ?? [];

      const fetchMovie = async (id: string): Promise<MovieListItem> => {
        try {
          const envelope = await getMovieByCinecircleId(id);
          const movie =
            (envelope as any)?.data ?? (envelope as any)?.movie ?? null;

          const title = movie?.title ?? `Movie ${id}`;
          const imagePath: string = movie?.imageUrl ?? '';

          const poster =
            imagePath && imagePath.trim().length > 0
              ? `${TMDB_IMAGE_BASE_URL}${
                  imagePath.startsWith('/') ? '' : '/'
                }${imagePath}`
              : `https://via.placeholder.com/150x220/667eea/ffffff?text=${encodeURIComponent(
                  title
                )}`;

          return { id, title, poster };
        } catch (err) {
          console.error('Failed to fetch movie detail:', err);
          return {
            id,
            title: `Movie ${id}`,
            poster: null,
          };
        }
      };

      const [toWatchMovies, completedMovies] = await Promise.all([
        Promise.all(toWatchIds.map(fetchMovie)),
        Promise.all(completedIds.map(fetchMovie)),
      ]);

      const dedupe = (arr: MovieListItem[]) =>
        arr.filter(
          (m, idx, self) => self.findIndex(x => x.id === m.id) === idx
        );

      setMoviesByStatus({
        toWatch: dedupe(toWatchMovies),
        completed: dedupe(completedMovies),
      });

      if (toWatchMovies.length > 0) {
        setActiveSubTab('toWatch');
      } else if (completedMovies.length > 0) {
        setActiveSubTab('completed');
      } else {
        setActiveSubTab('toWatch');
      }
    } catch (err: any) {
      console.error('Failed to load movies for user:', err);
      setError(err?.message || 'Failed to load movies');
      setMoviesByStatus({ toWatch: [], completed: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoviesForUser();
  }, [fetchMoviesForUser]);

  const emptyMessage = useMemo(() => {
    if (!userId) return 'Sign in to see your movies.';
    if (activeSubTab === 'toWatch') return 'No watchlist movies yet.';
    return 'No movies found for this user.';
  }, [activeSubTab, userId]);

  const handleMoviePress = (movieId: string) => {
    router.push({
      pathname: '/movies/[movieId]',
      params: { movieId },
    });
  };

  /** 🎬 Poster-only grid item */
  const renderMovie = ({ item }: { item: MovieListItem }) => (
    <TouchableOpacity
      onPress={() => handleMoviePress(item.id)}
      activeOpacity={0.85}
      style={tw`w-1/3 p-1`}
    >
      {item.poster ? (
        <Image
          source={{ uri: item.poster }}
          style={[
            tw`w-full rounded-md`,
            { aspectRatio: 2 / 3 }, // classic poster ratio
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            tw`w-full rounded-md items-center justify-center bg-gray-200`,
            { aspectRatio: 2 / 3 },
          ]}
        >
          <Ionicons name="film-outline" size={22} color="#555" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Sub-tabs */}
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
                activeSubTab === 'toWatch' ? '#D62E05' : 'transparent',
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
              backgroundColor:
                activeSubTab === 'completed' ? '#D62E05' : 'transparent',
            },
          ]}
          onPress={() => setActiveSubTab('completed')}
        >
          <Text
            style={[
              tw`text-sm font-semibold`,
              {
                color: activeSubTab === 'completed' ? '#FBEAE6' : '#D62E05',
              },
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
          keyExtractor={item => item.id}
          renderItem={renderMovie}
          numColumns={3}
          scrollEnabled={false}
          removeClippedSubviews={false}
          initialNumToRender={movies.length || 9}
          maxToRenderPerBatch={movies.length || 9}
          windowSize={Math.max(5, movies.length || 5)}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={tw`justify-start`}
          ListFooterComponent={<View style={tw`h-2`} />}
        />
      )}
    </View>
  );
};

export default MoviesGrid;
